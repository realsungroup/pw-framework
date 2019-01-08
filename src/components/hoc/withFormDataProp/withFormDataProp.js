import React from 'react';
import PropTypes from 'prop-types';
import http, { makeCancelable } from '../../../util/api';
import dealControlArr from '../../../util/controls';
import { argumentContainer } from '../util';
import { withHttpGetFormData } from '../withHttp';
import { message, Modal, Button } from 'antd';
import TableData from '../../data-components/TableData';
import getDataProp from './util';
import cloneDeep from 'lodash.clonedeep';

const Fragment = React.Fragment;

// 处理 formData（窗体数据）得到 PwForm 接受的 data prop
const withFormDataProp = WrappedComponent => {
  class withFormDataProp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        advDicModalVisible: false,
        AdvDicTableProps: {},
        data: []
      };
    }

    handleGetDataProp = (operation, record, formData, formProps) => {
      const data = getDataProp(
        operation,
        record,
        formData,
        formProps,
        this.handleSearch
      );
      this.setState({ data });
    };

    handleSearch = (props, controlData) => {
      this.tempControlData = controlData;
      this.setState({
        advDicModalVisible: true,
        AdvDicTableProps: { ...props, ...this.props.AdvDicTableProps }
      });
    };

    handleModalCancel = () => {
      this.setState({ advDicModalVisible: false });
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

      const advData = this.tempControlData.AdvDictionaryListData[0];

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

      // 修改 data 中每个控件的 value
      newData.forEach(item => {
        let obj;
        if (
          (obj = values.find(valueItem => valueItem.innerFieldName === item.id))
        ) {
          item.value = obj.value;
        }
      });

      this.setState({
        data: newData,
        loading: false,
        advDicModalVisible: false
      });
    };

    render() {
      const { advDicModalVisible, AdvDicTableProps, data } = this.state;
      return (
        <Fragment>
          <WrappedComponent
            {...this.props}
            onGetDataProp={this.handleGetDataProp}
            data={data}
          />
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
        </Fragment>
      );
    }
  }

  return argumentContainer(
    withFormDataProp,
    WrappedComponent,
    'withFormDataProp'
  );
};

export default withFormDataProp;
