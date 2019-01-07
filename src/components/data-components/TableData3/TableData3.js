import React from 'react';
import PwTable from '../../ui-components/PwTable';
import { Modal, Spin, Table } from 'antd';
import FormData from '../FormData';
import withTableData from '../../hoc/withTableData';
import './TableData.less';

const modalTitleMap = {
  add: '添加记录',
  modify: '修改记录',
  view: '查看记录'
};

/**
 * TableData
 */
class TableData extends React.Component {
  render() {
    const {
      title,
      dataMode,
      resid,
      subresid,
      hasAdd,
      hasModify,
      hasDelete,
      formProps,
      size,
      hostrecid,
      AdvDicTableProps,
      width,
      height,
      hasDownload,
      hasRefresh,
      hasAdvSearch,
      loading,
      pagination,
      dataSource,
      columns,
      modalVisible,
      modalFormMode,
      rowSelection,
      modalFormData,
      selectedRecord,
      scrollXY,
      getNewColumns,
      handleModalCancel,

      onAdd,
      onModify,
      onDelete,
      onSearch,
      onDownload,
      onChange,
      renderOtherBtns,
      onRow,
      onRefresh,
      onResizeStop,

      handleConfirm,
      handleCancel
    } = this.props;

    const newColumns = getNewColumns(columns);

    return (
      <div className="table-data">
        <Spin spinning={loading}>
          <PwTable
            title={title}
            loading={loading}
            pagination={pagination}
            dataSource={dataSource}
            columns={newColumns}
            bordered
            rowKey={'REC_ID'}
            scroll={scrollXY}
            hasAdd={hasAdd}
            hasModify={hasModify}
            hasDelete={hasDelete}
            onAdd={onAdd}
            onModify={onModify}
            onDelete={onDelete}
            onSearch={onSearch}
            onDownload={onDownload}
            onChange={onChange}
            renderOtherBtns={renderOtherBtns}
            rowSelection={rowSelection}
            onRow={onRow}
            onRefresh={onRefresh}
            onResizeStop={onResizeStop}
            size={size}
            width={width}
            height={height}
            hasDownload={hasDownload}
            hasRefresh={hasRefresh}
            hasAdvSearch={hasAdvSearch}
          />
        </Spin>

        <Modal
          title={modalTitleMap[modalFormMode]}
          visible={modalVisible}
          footer={null}
          onCancel={handleModalCancel}
          destroyOnClose
          width={formProps && formProps.width ? formProps.width + 50 : 800}
        >
          <FormData
            formData={modalFormData}
            operation={modalFormMode}
            record={selectedRecord}
            formProps={formProps}
            info={{ dataMode, resid, subresid, hostrecid }}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            AdvDicTableProps={AdvDicTableProps}
          />
        </Modal>
      </div>
    );
  }
}

export default withTableData(TableData);
