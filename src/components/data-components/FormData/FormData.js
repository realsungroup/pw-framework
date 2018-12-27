import React from 'react';
import PropTypes from 'prop-types';
import PwForm from '../../ui-components/PwForm';
import http, { makeCancelable } from '../../../util/api';
import { message, Modal, Spin } from 'antd';
import { extractAndDealBackendBtns } from '../../../util/beBtns';
import LzBackendBtn from '../../ui-components/LzBackendBtn';
import { Button } from '../../../../node_modules/antd/lib/radio';
import { dealFormData } from '../../../util/controls';

import getDataProp from './util';
import { getResid } from '../../../util/util';

/**
 * FormData
 */
export default class FormData extends React.Component {
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
      data: null, // 表单控件数据
      loading: true
    };
  }

  componentDidMount = () => {
    // 放 didmount 是为了优化 Modal 的显示速度
    // getDataProp 会耗时，会阻止 Modal 的显示
    // 若表单数据比较多，Modal 的显示出来的速度就会变慢
    const { operation, record, formData, formProps } = this.props;
    const data = getDataProp(operation, record, formData, formProps);
    this.setState({ data, loading: false });
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
  };

  handleSave = form => {
    const { operation, info, record } = this.props;
    const { dataMode, resid, subresid } = info;
    const id = getResid(dataMode, resid, subresid);

    form.validateFields((err, values) => {
      if (err) {
        return message.error('表单数据有误');
      }
      const formData = dealFormData(values);
      formData.REC_ID = record.REC_ID;
      // 添加
      if (this.props.operation === 'add') {
        this.handleAdd(id, formData);
        // 修改
      } else {
        this.handleModify(id, formData);
      }
    });
  };

  handleAdd = async (id, formData) => {
    this.p2 = makeCancelable(
      http().addRecords({
        resid: id,
        data: [formData]
      })
    );
    try {
      await this.p2.promise;
    } catch (err) {
      return message.error(err.message);
    }
    this.props.onConfirm();
  };
  handleModify = async (id, formData) => {
    this.p1 = makeCancelable(
      http().modifyRecords({
        resid: id,
        data: [formData]
      })
    );
    try {
      await this.p1.promise;
    } catch (err) {
      return message.error(err.message);
    }
    this.props.onConfirm();
  };

  render() {
    const { data, loading } = this.state;
    const { formProps, operation } = this.props;
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
        {data && (
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
