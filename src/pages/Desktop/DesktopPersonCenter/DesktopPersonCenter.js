import React from 'react';
import { Tabs, message, Spin } from 'antd';
import PwForm from 'Common/ui/PwForm';
import { getDataProp, setDataInitialValue } from 'Util20/formData2ControlsData';
import { withHttpGetFormData } from 'Common/hoc/withHttp';
import http, { makeCancelable } from 'Util20/api';
import { dealFormData } from 'Util20/controls';
import { getIntlVal } from 'Util20/util';
import './DesktopPersonCenter.less';
import { FormattedMessage as FM, injectIntl } from 'react-intl';

const TabPane = Tabs.TabPane;

// 本页面的配置信息在 public/app.config.js 文件中
const tabsConfig = window.pwConfig[process.env.NODE_ENV].personCenterResIds;

class DesktopPersonCenter extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      tabsConfig,
      activeKey: '0',
      mode: 'view', // 模式：'view' 表示查看模式；'edit' 表示编辑模式
      loading: true,
      record: {}
    };
  }

  componentDidMount() {
    this.getData(this.state.activeKey);
  }

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
  };

  getData = async activeKey => {
    this.setState({ spinning: true, mode: 'view' });
    const tabConfig = this.state.tabsConfig[activeKey];
    const resid = tabConfig.resid,
      formName = tabConfig.formName || 'default';

    let resTableData, formData, res;
    const pArr = [
      http().getTable({ resid }),
      this.props.httpGetFormData(resid, formName)
    ];
    this.p1 = makeCancelable(Promise.all(pArr));
    try {
      res = await this.p1.promise;
    } catch (err) {
      return console.error(err);
    }
    resTableData = res[0];
    formData = res[1];
    const record = resTableData.data[0] || {};
    const data = getDataProp(formData, record, false, true);
    this.setState({ data, record, activeKey, loading: false });
  };

  onChange = activeKey => {
    this.getData(activeKey);
  };

  handleEdit = () => {
    this.setState({ mode: 'edit' });
  };

  handleCancel = form => {
    form.resetFields();
    this.setState({ mode: 'view' });
  };

  handleSave = form => {
    this.setState({ loading: true });
    const { validateFields } = form;
    validateFields(async (err, values) => {
      const { tabsConfig, activeKey, record } = this.state;

      if (err) {
        this.setState({ loading: false });
        return message.error('表单有误');
      }
      const formData = dealFormData(values);
      formData.REC_ID = record.REC_ID;
      const tabConfig = tabsConfig[activeKey];
      const resid = tabConfig.resid;

      this.p2 = makeCancelable(
        http().modifyRecords({ resid, data: [formData] })
      );
      let res;
      try {
        res = await this.p2.promise;
      } catch (err) {
        this.setState({ loading: false });
        return console.error(err);
      }
      message.success('修改成功');

      const data = setDataInitialValue(this.state.data, values, false, true);
      this.setState({ loading: false, mode: 'view', data });
    });
  };

  render() {
    const { tabsConfig, activeKey, loading, data, mode } = this.state;
    const { locale } = this.props.intl;
    return (
      <div className="person-center">
        <div className="person-center-tabs">
          <Spin spinning={loading}>
            <Tabs type="card" onChange={this.onChange} activeKey={activeKey}>
              {tabsConfig &&
                tabsConfig.length > 0 &&
                tabsConfig.map((tabConfig, index) => (
                  <TabPane
                    tab={getIntlVal(locale, tabConfig.enTitle, tabConfig.title)}
                    key={index}
                  >
                    <PwForm
                      data={data}
                      displayMode="classify"
                      mode={mode}
                      onEdit={this.handleEdit}
                      onCancel={this.handleCancel}
                      onSave={this.handleSave}
                    />
                  </TabPane>
                ))}
            </Tabs>
          </Spin>
        </div>
      </div>
    );
  }
}

export default injectIntl(withHttpGetFormData(DesktopPersonCenter));
