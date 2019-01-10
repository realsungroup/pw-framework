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
        visible: false,
        advDicTableProps: {}
      };
    }

    handleShowAdvDicTable = (form, controlData) => {
      const state = { visible: true };

      if (!this._form || !this._controlData) {
        this._form = form;
        this._controlData = controlData;
      }

      if (!this.state.advDicTableProps.resid) {
        const advDicTableProps = this.getadvDicTableProps();
        state.advDicTableProps = advDicTableProps;
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
        cmswhere,
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        hasDownload: false,
        hasRefresh: false,
        hasAdvSearch: false,
        subtractH: 165,
        height: 400
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

      const advData = this._controlData.AdvDictionaryListData[0];

      // 匹配字段
      const matchFileds = advData.MatchAndReferenceCols.filter(item => {
        return item.CDZ2_TYPE === 0;
      });
      const values = {};
      matchFileds.forEach(item => {
        values[item.CDZ2_COL1] = record[item.CDZ2_COL2];
      });
      this.setState({
        visible: false
      });
      // 设置值
      this._form.setFieldsValue(values);
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
