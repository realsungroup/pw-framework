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
import TableData from '../TableData';
import cloneDeep from 'lodash.clonedeep';
import { withHttpAddRecords, withHttpModifyRecords } from '../../hoc/withHttp';
import { compose } from 'recompose';

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
      data: null, // 表单控件数据
      loading: true,
      advDicModalVisible: false,
      AdvDicTableProps: {} // 高级字典表格 props
    };
  }

  componentDidMount = () => {
    // 放 didmount 是为了优化 Modal 的显示速度
    // getDataProp 会耗时，会阻止 Modal 的显示
    // 若表单数据比较多，Modal 的显示出来的速度就会变慢
    const { operation, record, formData, formProps } = this.props;
    const data = getDataProp(
      operation,
      record,
      formData,
      formProps,
      this.handleSearch
    );
    this.setState({ data, loading: false });
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
  };

  // 渲染高级字典中表格的选择按钮
  renderSelectBtn = (record, size) => {
    return (
      <Button
        key={record.REC_ID}
        size={size}
        onClick={() => this.handleSelect(record)}
      >
        选择
      </Button>
    );
  };

  // 自定义高级字典中表格的选择按钮
  customRowBtns = [this.renderSelectBtn];

  // 点击高级字典表中的行选择按钮
  handleSelect = record => {
    message.success('选择成功');

    const advData = tempControlData.AdvDictionaryListData[0];

    // 匹配字段
    const matchFileds = advData.MatchAndReferenceCols.filter(item => {
      return item.CDZ2_TYPE === 0;
    });
    let values = [];
    matchFileds.forEach(item => {
      values.push({
        value: record[item.CDZ2_COL2],
        innerFieldName: item.CDZ2_COL1
      });
    });

    const { canOpControlArr } = this.props.formData;

    values = values.filter(item =>
      canOpControlArr.some(
        controlData => controlData.innerFieldName === item.innerFieldName
      )
    );

    const newData = cloneDeep(this.state.data);
    newData.forEach(item => {
      let obj;
      if (
        (obj = values.find(valueItem => valueItem.innerFieldName === item.id))
      ) {
        item.value = obj.value;
      }
    });
    console.log({ values });

    console.log({ newData });

    // getAdvDictionaryVal(values, advDictionatyData);

    this.setState({ data: newData, loading: false, advDicModalVisible: false });
  };

  // 显示高级字典表格
  handleSearch = (props, controlData) => {
    tempControlData = controlData;
    this.setState({
      advDicModalVisible: true,
      AdvDicTableProps: { ...props, ...this.props.AdvDicTableProps }
    });
  };

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
          await this.props.onAdd(id, [formData]);
        } catch (err) {
          return message.error(err.message);
        }

        // 修改
      } else {
        try {
          await this.props.onModify(id, [formData]);
        } catch (err) {
          return message.error(err.message);
        }
      }
      this.props.onConfirm();
    });
  };

  handleModalCancel = () => {
    this.setState({ advDicModalVisible: false });
  };

  render() {
    const { data, loading, advDicModalVisible, AdvDicTableProps } = this.state;
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
        <Modal
          title={'请选择一条记录'}
          visible={advDicModalVisible}
          footer={null}
          onCancel={this.handleModalCancel}
          width={AdvDicTableProps.width ? AdvDicTableProps.width + 50 : 850}
          destroyOnClose
        >
          {advDicModalVisible && (
            <TableData
              {...AdvDicTableProps}
              customRowBtns={this.customRowBtns}
            />
          )}
        </Modal>
      </Spin>
    );
  }
}

const composedHoc = compose(
  withHttpAddRecords,
  withHttpModifyRecords
);
export default composedHoc(FormData);

// 等价于：
// withHttp.addRecords(withHttp.modifyRecords(FormData));
