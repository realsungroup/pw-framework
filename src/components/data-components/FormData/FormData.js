import React from 'react';
import PropTypes from 'prop-types';
import PwForm from '../../ui-components/PwForm';

import { message, Spin } from 'antd';

import { dealFormData } from '../../../util/controls';

import { getResid } from '../../../util/util';

import { withHttpAddRecords, withHttpModifyRecords } from '../../hoc/withHttp';
import withFormDataProp from '../../hoc/withFormDataProp';
import { compose } from 'recompose';
import { getDataProp } from '../../../util/formData2ControlsData';

// 临时存放高级字典控件数据 controlData
let tempControlData = null;

/**
 * FormData
 */
class FormData extends React.Component {
  static propTypes = {
    /**
     * 窗体数据
     * 默认：{ subTableArr:[], allControlArr: [], canOpControlArr: [], containerControlArr: [] }
     */
    formData: PropTypes.object,
    // formData = {
    //   subTableArr: [], // 子表控件
    //   allControlArr: [], // 所有控件（可操作的控件 + label）
    //   canOpControlArr: [], // 可操作的控件（如 input）
    //   containerControlArr: [] // 容器控件
    // }

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
    formProps: {},
    formData: {
      subTableArr: [],
      allControlArr: [],
      canOpControlArr: [],
      containerControlArr: []
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount = () => {
    // 放 didmount 是为了优化 Modal 的显示速度
    // onGetDataProp 会耗时，会阻止 Modal 的显示
    // 若表单数据比较多，Modal 的显示出来的速度就会变慢
    const { operation, record, formData, formProps } = this.props;
    getDataProp(operation, record, formData, formProps);
    this.setState({ loading: false });
  };

  componentWillUnmount = () => { };

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
      if (this.props.operation === 'add') {
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
    const { loading } = this.state;
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
      <Spin spinning={loading}>
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
      </Spin>
    );
  }
}

const composedHoc = compose(
  withHttpAddRecords,
  withHttpModifyRecords,
  withFormDataProp
);
export default composedHoc(FormData);
