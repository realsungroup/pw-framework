import React from 'react';
import PropTypes from 'prop-types';
import PwForm from '../../ui-components/PwForm';

import { message, Spin, Tabs } from 'antd';

import { dealFormData } from '../../../util/controls';

import { getResid } from '../../../util/util';

import { withHttpAddRecords, withHttpModifyRecords } from '../../hoc/withHttp';
import { compose } from 'recompose';
import TableData from '../TableData';
import classNames from 'classnames';
import './FormData.less';

const { Fragment } = React;
const TabPane = Tabs.TabPane;

/**
 * FormData
 */
class FormData extends React.Component {
  static propTypes = {
    data: PropTypes.array,

    /**
     * 表单记录
     * 默认：{}
     */
    record: PropTypes.object,

    /**
     * 对表单的操作：'add' 添加 | 'modify' 修改 | 'view' 查看
     * 默认：'add'
     */
    operation: PropTypes.oneOf(['add', 'modify', 'view']),

    /**
     * PwForm 的 props
     * 默认：{}
     */
    formProps: PropTypes.object,

    /**
     * 添加、修改 所需要的信息：{ dataMode, resid, subresid, hostrecid }
     * 默认：-
     */
    info: PropTypes.object,

    /**
     * 保存成功后的回调函数
     * 默认：-
     */
    onConfirm: PropTypes.func,

    /**
     * 点击取消按钮后的回调函数
     * 默认：-
     */
    onCancel: PropTypes.func,

    /**
     * 表单中的子表数组
     */
    subTableArr: PropTypes.array,

    /**
     * 表单中子表接收的 props
     */
    subTableArrProps: PropTypes.array
  };

  static defaultProps = {
    record: {},
    operation: 'add',
    formProps: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      defaultActiveKey: '-1'
    };
  }

  componentDidMount = () => {
    const { subTableArr } = this.props;
    if (!!subTableArr.length) {
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
      this.props.onConfirm();
    });
  };

  renderSubTables = () => {
    const { defaultActiveKey } = this.state;
    const { subTableArr } = this.props;

    return (
      <Tabs defaultActiveKey={defaultActiveKey} className="form-data__tabs">
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
    const { tableProps = {} } = subTableProps || {};
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
      subTableArr
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
      <Fragment>
        {!!data.length && (
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
            className={classNames({
              'form-data__pwform--left': hasSubTables
            })}
          />
        )}
        {hasSubTables && this.renderSubTables()}
      </Fragment>
    );
  }
}

const composedHoc = compose(
  withHttpAddRecords,
  withHttpModifyRecords
);
export default composedHoc(FormData);
