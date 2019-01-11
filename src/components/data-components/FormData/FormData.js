import React from 'react';
import PropTypes from 'prop-types';
import PwForm from '../../ui-components/PwForm';

import { message, Spin } from 'antd';

import { dealFormData } from '../../../util/controls';

import { getResid } from '../../../util/util';

import { withHttpAddRecords, withHttpModifyRecords } from '../../hoc/withHttp';
import { compose } from 'recompose';

const { Fragment } = React;

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
    onCancel: PropTypes.func
  };

  static defaultProps = {
    record: {},
    operation: 'add',
    formProps: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  componentDidMount = () => {};

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
          return message.error(err.message);
        }

        // 修改
      } else {
        try {
          await this.props.httpModifyRecords(id, [formData]);
        } catch (err) {
          return message.error(err.message);
        }
      }
      this.props.onConfirm();
    });
  };

  render() {
    const { formProps, operation, data } = this.props;
    const mode = operation === 'view' ? 'view' : 'edit';
    let otherProps = {};
    // 当为查看时，不显示 编辑、保存和取消按钮
    if (mode === 'view') {
      otherProps.hasEdit = false;
      otherProps.hasSave = false;
      otherProps.hasCancel = false;
    }
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
          />
        )}
      </Fragment>
    );
  }
}

const composedHoc = compose(
  withHttpAddRecords,
  withHttpModifyRecords
);
export default composedHoc(FormData);
