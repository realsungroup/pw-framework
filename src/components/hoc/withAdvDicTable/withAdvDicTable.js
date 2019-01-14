import React from 'react';
import { argumentContainer } from '../util';
import { message, Modal, Button } from 'antd';
import TableData from '../../data-components/TableData';
import { getCmscolumns, getCmswhere } from './util';

const Fragment = React.Fragment;

// 显示高级字典表格的高阶组件
const withAdvDicTable = WrappedComponent => {
  class withAdvDicTable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        visible: false, // 是否显示高级字典表格
        advDicTableProps: {} // 高级字典表格接收的 props
      };
    }

    /**
     * 显示高级字典表格
     * @param {object} form 使用 Form.create()(MyForm) 自动收集 MyForm 组件中的表单值功能暴露出来的 form 对象
     * @param {object} dataItem 描述控件项（打开高级字典的控件为 Search）的数据，如：
     */
    // {
    //   id: 'name', // 字段名称
    //   label: '姓名', // label
    //   value: '肖磊', // 初始值
    //   labelCol: 8, // label 所占列
    //   wrapperCol: 16, // 控件 所占列
    //   rules: [{ required: true, message: '请输入姓名' }], // 验证规则
    //   name: 'Input', // 控件名称
    //   props: { // 控件所接收的 props
    //     type: 'number'
    //   },
    //   advDicTableProps: { resid: 666, cmsWhere: 'xxx', cmscolumns: 'yyy' } // 高级字典独有的字段
    // }
    handleShowAdvDicTable = (form, dataItem, afterSelect) => {
      const state = { visible: true };

      if (!this._form || !this._dataItem) {
        // 缓存 form、dataItem
        this._form = form;
        this._dataItem = dataItem;
        this._afterSelect = afterSelect;
      }

      if (!this.state.advDicTableProps.resid) {
        state.advDicTableProps = { ...dataItem.advDicTableProps };
      }

      this.setState(state);
    };

    getadvDicTableProps = () => {
      const controlData = this._controlData;
      if (!controlData) {
        return {};
      }
      const advData = controlData.AdvDictionaryListData[0];
      if (!advData) {
        alert('advDictionatyData.AdvDictionaryListData 为空数组');
        return;
      }
      const resid = advData.ResID2;
      const cmscolumns = getCmscolumns(advData);
      const cmswhere = getCmswhere(advData);
      return {
        resid,
        cmscolumns,
        cmswhere
      };
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

    // 点击高级字典表中的行选择按钮
    handleSelect = record => {
      message.success('选择成功');
      // 匹配字段
      const { matchFields = [] } = this._dataItem.advDicTableProps;
      // 得到表单中匹配字段的值
      const values = {};
      matchFields.forEach(item => {
        values[item.CDZ2_COL1] = record[item.CDZ2_COL2];
      });

      // 设置值
      this._form.setFieldsValue(values);
      this._afterSelect && this._afterSelect();
      this.handleCancel();
    };

    handleCancel = () => {
      this.setState({ visible: false });
    };

    // 自定义高级字典中表格的选择按钮
    customRowBtns = [this.renderSelectBtn];

    render() {
      const { visible, advDicTableProps } = this.state;
      return (
        <Fragment>
          <WrappedComponent
            {...this.props}
            showAdvDicTable={this.handleShowAdvDicTable}
            afterSelect={this.handleAfterSelect}
          />

          {/* 高级字典表格 */}
          <Modal
            title={'请选择一条记录'}
            visible={visible}
            footer={null}
            onCancel={this.handleCancel}
            width={advDicTableProps.width ? advDicTableProps.width + 50 : 850}
            destroyOnClose
          >
            <TableData
              {...advDicTableProps}
              customRowBtns={this.customRowBtns}
            />
          </Modal>
        </Fragment>
      );
    }
  }

  return argumentContainer(
    withAdvDicTable,
    WrappedComponent,
    'withAdvDicTable'
  );
};

export default withAdvDicTable;
