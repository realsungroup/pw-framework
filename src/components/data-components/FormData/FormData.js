import React from 'react';
import PropTypes from 'prop-types';
import PwForm from '../../ui-components/PwForm';
import http, { makeCancelable } from '../../../util/api';
import { message, Modal, Spin } from 'antd';
import { extractAndDealBackendBtns } from '../../../util/beBtns';
import LzBackendBtn from '../../ui-components/LzBackendBtn';
import { Button } from '../../../../node_modules/antd/lib/radio';

import getDataProp from './util';

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
    formProps: PropTypes.object
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

  componentWillUnmount = () => {};

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
          <PwForm data={data} {...formProps} mode={mode} {...otherProps} />
        )}
      </Spin>
    );
  }
}
