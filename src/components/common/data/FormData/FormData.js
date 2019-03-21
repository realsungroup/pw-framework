import React from 'react';
import PwForm from '../../ui/PwForm';
import { message, Tabs } from 'antd';
import { dealFormData } from 'Util20/controls';
import { getResid } from 'Util20/util';
import { withHttpAddRecords, withHttpModifyRecords } from '../../hoc/withHttp';
import { compose } from 'recompose';
import { TableData } from '../../loadableCommon';
import classNames from 'classnames';
import './FormData.less';
import { propTypes, defaultProps } from './propTypes';

const { Fragment } = React;
const TabPane = Tabs.TabPane;

/**
 * 显示记录的表单，且具有增改查功能
 */
class FormData extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      defaultActiveKey: '-1'
    };
  }

  componentDidMount = () => {
    const { subTableArr } = this.props;
    if (subTableArr && !!subTableArr.length) {
      // 等待抽屉动画完成，再去请求子表数据（否则会卡顿）
      setTimeout(() => {
        this.setState({ defaultActiveKey: '0' });
      }, 500);
    }
  };

  componentWillUnmount = () => {};

  handleSave = form => {
    const { operation, info, record } = this.props;
    const { dataMode, resid, subresid } = info;
    const id = getResid(dataMode, resid, subresid);

    form.validateFields(async (err, values) => {
      if (err) {
        return message.error('表单数据有误');
      }
      const formData = dealFormData(values);
      formData.REC_ID = record.REC_ID;
      // 添加
      if (operation === 'add') {
        try {
          await this.props.httpAddRecords(id, [formData]);
        } catch (err) {
          console.error(err);
          return message.error(err.message);
        }

        // 修改
      } else {
        try {
          await this.props.httpModifyRecords(id, [formData]);
        } catch (err) {
          console.error(err);
          return message.error(err.message);
        }
      }
      this.props.onConfirm && this.props.onConfirm(formData, form);
    });
  };

  renderSubTables = () => {
    const { defaultActiveKey } = this.state;
    const { subTableArr, data, width } = this.props;

    return (
      <Tabs
        defaultActiveKey={defaultActiveKey}
        className={classNames('form-data__tabs', {
          'form-data__tabs--full': !data.length
        })}
        style={{ width: width.tabsWidth }}
      >
        {subTableArr.map((subTable, index) =>
          this.renderTabPane(subTable, index)
        )}
      </Tabs>
    );
  };

  renderTabPane = (subTable, index) => {
    const { subTableArrProps, record, info } = this.props;
    const { resid } = info;

    const subTableProps = subTableArrProps.find(
      item => item.subResid === subTable.subResid
    );

    const tableProps = { ...subTableProps } || {};

    delete tableProps.subResid;
    delete tableProps.subTableName;

    const tab =
      (subTableProps && subTableProps.subTableName) || subTable.subResid;

    const props = {
      hasZoomInOut: false
    };

    return (
      <TabPane tab={tab} key={index}>
        <TableData
          dataMode="sub"
          resid={resid}
          subresid={subTable.subResid}
          hostrecid={record.REC_ID}
          size="small"
          {...props}
          {...tableProps}
        />
      </TabPane>
    );
  };

  render() {
    const {
      formProps,
      operation,
      data,
      record,
      beforeSaveFields,
      info,
      subTableArr,
      width
    } = this.props;
    const mode = operation === 'view' ? 'view' : 'edit';
    let otherProps = {};
    // 当为查看时，不显示 编辑、保存和取消按钮
    if (mode === 'view') {
      otherProps.hasEdit = false;
      otherProps.hasSave = false;
      otherProps.hasCancel = false;
    }
    const { resid } = info;

    const hasSubTables =
      Array.isArray(subTableArr) && !!subTableArr.length && operation !== 'add';

    return (
      <div className="form-data">
        {!!data.length && (
          <div
            style={{ width: hasSubTables ? width.formWidth : '100%' }}
            className="form-data__form-wrap"
          >
            <PwForm
              data={data}
              {...formProps}
              mode={mode}
              {...otherProps}
              onSave={this.handleSave}
              onCancel={this.props.onCancel}
              operation={operation}
              record={record}
              beforeSaveFields={beforeSaveFields}
              resid={resid}
            />
          </div>
        )}
        {hasSubTables && this.renderSubTables()}
      </div>
    );
  }
}

const composedHoc = compose(
  withHttpAddRecords,
  withHttpModifyRecords
);
export default composedHoc(FormData);
