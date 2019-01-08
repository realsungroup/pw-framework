import React from 'react';
import PwTable from '../../ui-components/PwTable';
import { message, Button, Spin } from 'antd';
import LzBackendBtn from '../../ui-components/LzBackendBtn';
import ButtonWithConfirm from '../../ui-components/ButtonWithConfirm';
import { getResid, getCmsWhere } from '../../../util/util';
import { getColumns, getRowSelection, getPagination } from './util';
import './TableData.less';
import {
  withHttpGetTableData,
  withHttpGetSubTableData,
  withHttpGetBeBtns,
  withHttpGetFormData,
  withHttpRemoveRecords
} from '../../hoc/withHttp';
import { compose } from 'recompose';
import withAdvSearch from '../../hoc/withAdvSearch/withAdvSearch';
import withDownloadFile from '../../hoc/withDownloadFile';
import withRecordForm from '../../hoc/withRecordForm';
import {
  tableDataPropTypes,
  tableDataDefaultPropTypes
} from './TableDataPropTypes';

const { Fragment } = React;

const btnSizeMap = {
  large: 'large',
  middle: 'default',
  small: 'small'
};

const modalTitleMap = {
  add: '添加记录',
  modify: '修改记录',
  view: '查看记录'
};

/**
 * TableData
 */
class TableData extends React.Component {
  static propTypes = tableDataPropTypes;

  static defaultProps = tableDataDefaultPropTypes;

  constructor(props) {
    super(props);

    const { defaultPagination, hasModify, hasDelete } = props;

    const pagination = getPagination(
      defaultPagination,
      this.handlePageChange,
      this.handleShowSizeChange
    );

    const rowSelection = getRowSelection(
      hasModify,
      hasDelete,
      this.rowSelectionChange
    );
    this.state = {
      loading: false,
      key: '', // 模糊查询关键词
      pagination, // 分页配置
      dataSource: [], // 表格数据
      columns: [], // 表格列配置信息
      beBtnsMultiple: [], // 后端操作多条记录的按钮
      beBtnsSingle: [], // 后端操作单条记录的按钮
      beBtnsOther: [], // 后端其他操作按钮（如：打开添加表单；打开修改表单；打开查看表单；地址跳转等）
      modalFormData: undefined, // 模态窗中的表单窗体数据
      recordFormShowMode: undefined, // 记录表单的显示模式：'add' 添加 | 'modify' 修改 | 'view' 查看
      rowSelection, // 行选择配置
      selectedRecord: {}, // 所选择的记录
      scrollXY: { x: 1000, y: 1000 }
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    await this.getData();
    await this.getScrollXY();
    this.setState({ loading: false });
  };

  componentWillUnmount = () => {};

  getData = async () => {
    const {
      hasBeBtns,
      hasAdd,
      hasModify,
      hasRowModify,
      hasRowView
    } = this.props;
    const { pagination } = this.state;
    let page, pageSize;
    if (pagination) {
      page = pagination.current;
      pageSize = pagination.pageSize;
    }
    await this.getTableData({ page, pageSize });

    // 有后端定义按钮
    if (hasBeBtns) {
      await this.getBeBtns();
    }

    // 有打开模态窗表单的按钮
    if (hasAdd || hasModify || hasRowModify || hasRowView) {
      await this.getFormData();
    }
  };

  getScrollXY = async y => {
    const {
      defaultColumnWidth,
      columnsWidth,
      actionBarWidth,
      height,
      subtractH
    } = this.props;
    const { columns, rowSelection } = this.state;
    const count = columns.length;
    let customWidth = 0,
      customCount = 0;
    if (columnsWidth) {
      const arr = Object.keys(columnsWidth);
      customCount = arr.length;
      arr.forEach(key => {
        customWidth += columnsWidth[key];
      });
    }

    let x = (count - customCount) * defaultColumnWidth + customWidth;

    // 操作栏
    if (this.hasActionBar()) {
      x += actionBarWidth;
    }

    // rowSelection
    if (rowSelection) {
      x += 50;
    }
    const newY = y || height - subtractH;
    const scrollXY = { x, y: newY };

    this.setState({ scrollXY });
    // return { x, y: newY };
  };

  getTableData = async ({
    page = 1,
    pageSize = 10,
    key = this._searchValue,
    sortOrder = this._sortOrder,
    sortField = this._sortField
  }) => {
    const {
      dataMode,
      resid,
      hostrecid,
      subresid,
      cmswhere,
      cmscolumns,
      httpGetTableData,
      httpGetSubTableData
    } = this.props;
    let res;
    const mergedCmsWhere = getCmsWhere(cmswhere, this._cmsWhere);
    try {
      // 获取主表数据
      if (dataMode === 'main') {
        res = await httpGetTableData(
          resid,
          key,
          mergedCmsWhere,
          cmscolumns,
          page - 1,
          pageSize,
          sortOrder,
          sortField,
          1
        );
      } else {
        // 获取子表数据
        res = await httpGetSubTableData(
          resid,
          subresid,
          hostrecid,
          key,
          mergedCmsWhere,
          cmscolumns,
          page - 1,
          pageSize,
          sortOrder,
          sortField,
          1
        );
      }
    } catch (err) {
      return message.error(err.message);
    }
    const {
      hasBeSort,
      defaultColumnWidth,
      columnsWidth,
      fixedColumns
    } = this.props;
    const columns = getColumns(res.cmscolumninfo, {
      hasBeSort,
      defaultColumnWidth,
      columnsWidth,
      fixedColumns
    });
    const dataSource = res.data;
    this.setState({
      columns,
      dataSource,
      pagination: {
        ...this.state.pagination,
        current: page,
        pageSize,
        total: res.total
      }
    });
  };

  getFormData = async () => {
    const {
      dataMode,
      resid,
      subresid,
      modalFormName,
      httpGetFormData
    } = this.props;
    const id = getResid(dataMode, resid, subresid);
    let modalFormData;
    try {
      modalFormData = await httpGetFormData(id, modalFormName);
    } catch (err) {
      return message.error(err.message);
    }
    this.setState({ modalFormData });
  };

  /**
   * 获取后端定义的按钮
   *
   * 按钮字段说明：
   * Name1：按钮名称
   * Type：按钮行为类型（1 发送请求，4 跳转网页，6 打开指定的 formName 的表单进行编辑）
   * Code：发送给后台的 strCommand 参数值
   * OkMsgCn：点击按钮成功后的提示信息
   * FailMsgCn：点击按钮失败后的提示信息
   * FormName：窗体名称
   */
  getBeBtns = async () => {
    const { dataMode, resid, subresid, httpGetBeBtns } = this.props;
    const id = getResid(dataMode, resid, subresid);
    let btns;
    try {
      btns = await httpGetBeBtns(id);
    } catch (err) {
      return message.error(err.message);
    }
    const { beBtnsMultiple, beBtnsSingle, beBtnsOther } = btns;

    // 有行选择
    let rowSelection = null;
    if (this.hasRowSelection(beBtnsMultiple)) {
      rowSelection = {
        selectedRowKeys: [],
        onChange: this.rowSelectionChange,
        columnWidth: 50,
        fixed: true
      };
    }

    this.setState({
      beBtnsMultiple,
      beBtnsSingle,
      beBtnsOther,
      rowSelection
    });
  };

  rowSelectionChange = selectedRowKeys => {
    this.setState({
      rowSelection: { ...this.state.rowSelection, selectedRowKeys }
    });
  };

  handlePageChange = (page, pageSize) => {
    this.getTableData({ page, pageSize });
  };

  handleShowSizeChange = (current, pageSize) => {
    const pagination = getPagination(
      {
        ...this.state.pagination,
        current,
        pageSize
      },
      this.handlePageChange,
      this.handleShowSizeChange
    );
    this.setState({ pagination }, () => {
      this.handleRefresh();
    });
  };

  // 是否有操作栏
  hasActionBar = () => {
    const { beBtnsSingle } = this.state;
    const {
      hasRowDelete,
      hasRowModify,
      hasRowView,
      renderRowBtns,
      customRowBtns
    } = this.props;
    return !!(
      hasRowDelete ||
      hasRowModify ||
      hasRowView ||
      beBtnsSingle.length ||
      renderRowBtns ||
      !!customRowBtns
    );
  };

  hasRowSelection = beBtnsMultiple => {
    const { hasModify, hasDelete } = this.props;
    return !!beBtnsMultiple.length || hasModify || hasDelete;
  };

  // 搜索
  _searchValue = '';
  handleSearch = value => {
    this._searchValue = value;
    this.getTableData({
      page: 1,
      pageSize: this.state.pagination.pageSize
    });
  };

  // 下载
  handleDownload = async () => {
    this.setState({ loading: true });
    const {
      title,
      downloadFileName,
      downloadFile,
      resid,
      cmswhere,
      fileType
    } = this.props;
    const mergedCmsWhere = getCmsWhere(cmswhere, this._cmsWhere);
    await downloadFile(
      (window.powerWorks && window.powerWorks.fileDownloadUrl) || '...',
      downloadFileName || title,
      resid,
      mergedCmsWhere,
      fileType
    );
    this.setState({ loading: false });
  };

  _sortField = ''; // 排序字段
  _sortOrder = ''; // 排序模式
  handleTableChange = (a, b, sorter) => {
    // 不排序
    if (!sorter.order) {
      this._sortField = '';
      this._sortOrder = '';
      this.getTableData({ page: 1, pageSize: this.state.pagination.pageSize });
    } else {
      this._sortField = sorter.field;
      // 升序
      if (sorter.order === 'descend') {
        this._sortOrder = 'desc';
        this.getTableData({
          page: 1,
          pageSize: this.state.pagination.pageSize
        });
      } else {
        // 降序
        this._sortOrder = 'asc';
        this.getTableData({
          page: 1,
          pageSize: this.state.pagination.pageSize
        });
      }
    }
  };

  getScroll = () => {};

  // 渲染后端按钮
  renderBeBtns = () => {
    const { selectedRows, beBtnsMultiple, beBtnsOther } = this.state;
    const { dataMode, resid, subresid, size } = this.props;
    const id = getResid(dataMode, resid, subresid);
    const arr = [...beBtnsMultiple, ...beBtnsOther];

    return arr.map(btnInfo => (
      <LzBackendBtn
        key={btnInfo.Name1}
        btnInfo={btnInfo}
        resid={id}
        onConfirm={this.beBtnConfirm}
        records={selectedRows}
        size={size}
      />
    ));
  };

  openRecordForm = () => {
    const {
      dataMode,
      resid,
      subresid,
      formProps,
      hostrecid,
      AdvDicTableProps,
      openRecordForm,
      recordFormType
    } = this.props;

    const { recordFormShowMode, modalFormData, selectedRecord } = this.state;

    openRecordForm({
      type: recordFormType,
      title: modalTitleMap[recordFormShowMode],
      formProps,
      formData: modalFormData,
      operation: recordFormShowMode,
      record: selectedRecord,
      info: { dataMode, resid, subresid, hostrecid },
      AdvDicTableProps,
      onConfirm: this.handleConfirm,
      onCancel: this.handleCancel
    });
  };

  // 点击添加按钮
  handleAdd = () => {
    this.setState(
      {
        recordFormShowMode: 'add',
        selectedRecord: {}
      },
      () => {
        this.openRecordForm();
      }
    );
  };

  handleModify = record => {
    let selectedRecord = record;
    if (!selectedRecord) {
      const { selectedRowKeys } = this.state.rowSelection;
      if (selectedRowKeys.length !== 1) {
        return message.error('请选择一条记录');
      }
      const { dataSource } = this.state;
      selectedRecord = dataSource.find(
        record => record.REC_ID === selectedRowKeys[0]
      );
    }

    this.setState(
      {
        recordFormShowMode: 'modify',
        selectedRecord
      },
      () => {
        this.openRecordForm();
      }
    );
  };

  // 点击删除按钮
  handleDelete = async () => {
    const { selectedRowKeys } = this.state.rowSelection;
    if (!selectedRowKeys.length) {
      return message.error('请选择记录');
    }
    const { dataSource } = this.state;
    const records = [];
    dataSource.forEach(record => {
      if (selectedRowKeys.indexOf(record.REC_ID) !== -1) {
        records.push(record);
      }
    });
    const { dataMode, resid, subresid, httpRemoveRecords } = this.props;
    const id = getResid(dataMode, resid, subresid);
    try {
      await httpRemoveRecords(id, records);
    } catch (err) {
      return message.error(err.message);
    }
    message.success('删除成功');

    // 清除 selectedRowKeys
    this.setState({
      rowSelection: { ...this.state.rowSelection, selectedRowKeys: [] }
    });

    // 刷新表格数据
    this.handleRefresh();
  };

  handleOnRow = record => {
    return {
      onClick: () => {}, // 点击行
      onMouseEnter: () => {} // 鼠标移入行
    };
  };

  /**
   * 刷新表格数据
   * @param {boolean} isFirst 是否刷新的页数为第一页，默认：false
   */
  handleRefresh = async (isFirst = false) => {
    this.setState({ loading: true });
    const { pagination } = this.state;
    let obj;
    // 刷新第一页的表格数据
    if (isFirst) {
      obj = { page: 1, pageSize: pagination.pageSize };
      // 刷新当前页的表格数据
    } else {
      obj = {
        page: pagination.current,
        pageSize: pagination.pageSize
      };
    }
    await this.getTableData(obj);
    this.setState({ loading: false });
  };

  handleResizeStop = (e, data) => {
    const { subtractH } = this.props;
    const { height } = data.size;
    this.setState({
      scrollXY: { x: this.state.scrollXY.x, y: height - subtractH }
    });
  };

  handleAdvSearch = () => {
    const {
      advSearchFormName,
      advSearchDrawerProps,
      advSearchFormProps,
      showAdvSearch,
      dataMode,
      resid,
      subresid,
      setProps
    } = this.props;
    const id = getResid(dataMode, resid, subresid);

    // 显示高级搜索（处于抽屉中的表单）
    showAdvSearch(id, advSearchFormName, advSearchFormProps, this.getCmsWhere);

    // 设置高级搜索中 Drawer 组件和 PwForm 组件所接收 props
    setProps(advSearchDrawerProps, advSearchFormProps);
  };

  _cmsWhere = '';
  getCmsWhere = cmsWhere => {
    this._cmsWhere = cmsWhere;
    this.handleRefresh(true);
  };

  beBtnConfirm = (type, records, formData, defaultRecord) => {
    // if (type === 1 || type === 5) {
    //   this.refreshTableData();
    //   const rowSelection = {
    //     ...this.state.rowSelection,
    //     selectedRowKeys: []
    //   };
    //   this.setState({ selectedRowKeys: [], selectedRows: [], rowSelection });
    //   // 编辑记录
    // } else if (type === 6) {
    //   this.setState({ backendBtnOpenModalFormData: formData }, () => {
    //     this.openModalWay = 'be';
    //     this.operationRow('mod', records[0]);
    //   });
    //   // 查看记录
    // } else if (type === 7) {
    //   this.setState({ backendBtnOpenModalFormData: formData }, () => {
    //     this.openModalWay = 'be';
    //     this.operationRow('check', records[0]);
    //   });
    //   // 添加记录
    // } else if (type === 8) {
    //   this.setState({ backendBtnOpenModalFormData: formData }, () => {
    //     this.addRecord(defaultRecord);
    //   });
    // }
  };

  getNewColumns = columns => {
    let newColumns;
    // 添加操作栏
    if (this.hasActionBar()) {
      newColumns = columns.concat([this.getActionBar()]);
    } else {
      newColumns = columns;
    }
    return newColumns;
  };

  renderRowModifyBtn = record => {
    return (
      <Button
        size={btnSizeMap[this.props.size]}
        onClick={() => this.handleModify(record)}
        className="table-data__action-btn"
      >
        修改
      </Button>
    );
  };

  renderRowViewBtn = record => {
    return (
      <Button
        size={btnSizeMap[this.props.size]}
        onClick={() => this.handleView(record)}
        className="table-data__action-btn"
      >
        查看
      </Button>
    );
  };

  handleView = record => {
    this.setState(
      {
        recordFormShowMode: 'view',
        selectedRecord: record
      },
      () => {
        this.openRecordForm();
      }
    );
  };

  renderRowDeleteBtn = record => {
    return (
      <ButtonWithConfirm
        popConfirmProps={{
          title: '您确定要删除吗？',
          onConfirm: () => this.handleRowDelete([record])
        }}
        buttonProps={{
          type: 'danger',
          size: btnSizeMap[this.props.size],
          className: 'table-data__action-btn'
        }}
      >
        删除
      </ButtonWithConfirm>
    );
  };

  renderCustomRowBtns = (customRowBtns, record) => {
    return customRowBtns.map(customBtn => {
      // customBtn 为 function 时
      if (typeof customBtn === 'function') {
        return customBtn(record, btnSizeMap[this.props.size]);
      }
    });
  };

  handleRowDelete = async records => {
    const { dataMode, resid, subresid, httpRemoveRecords } = this.props;
    const id = getResid(dataMode, resid, subresid);
    try {
      await httpRemoveRecords(id, records);
    } catch (err) {
      return message.error(err.message);
    }
    message.success('删除成功');

    // 清除 selectedRowKeys
    this.setState({
      rowSelection: { ...this.state.rowSelection, selectedRowKeys: [] }
    });

    // 刷新表格数据
    this.handleRefresh();
  };

  handleConfirm = () => {
    const { recordFormShowMode } = this.state;
    if (recordFormShowMode === 'add') {
      message.success('添加成功');
    } else if (recordFormShowMode === 'modify') {
      message.success('修改成功');
    }
    this.props.closeRecordForm();
    this.handleRefresh();
  };

  handleCancel = () => {
    this.props.closeRecordForm();
  };

  getActionBar = () => {
    const actionBar = {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      align: 'center',
      width: this.props.actionBarWidth,
      render: (text, record, rowIndex) => {
        const { beBtnsSingle } = this.state;
        const {
          hasModify,
          hasRowView,
          hasRowDelete,
          customRowBtns
        } = this.props;
        return (
          <Fragment>
            {hasModify && this.renderRowModifyBtn(record)}
            {hasRowView && this.renderRowViewBtn(record)}
            {hasRowDelete && this.renderRowDeleteBtn(record)}

            {/* 后端按钮 */}
            {this.renderBeBtns(beBtnsSingle, record)}
            {/* 自定义按钮 */}
            {customRowBtns && this.renderCustomRowBtns(customRowBtns, record)}
          </Fragment>
        );
      }
    };

    // 操作栏固定在右侧
    if (this.props.actionBarFixed) {
      actionBar.fixed = 'right';
    }
    return actionBar;
  };

  render() {
    const {
      title,
      hasAdd,
      hasModify,
      hasDelete,
      size,
      width,
      height,
      hasDownload,
      hasRefresh
    } = this.props;
    const {
      loading,
      pagination,
      dataSource,
      columns,
      rowSelection,
      scrollXY
    } = this.state;

    const newColumns = this.getNewColumns(columns);

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
            onAdd={this.handleAdd}
            onModify={this.handleModify}
            onDelete={this.handleDelete}
            onSearch={this.handleSearch}
            onDownload={this.handleDownload}
            onSearchChange={this.onSearchChange}
            onChange={this.handleTableChange}
            renderOtherBtns={this.renderBeBtns}
            rowSelection={rowSelection}
            onRow={this.handleOnRow}
            onRefresh={this.handleRefresh}
            onResizeStop={this.handleResizeStop}
            size={size}
            width={width}
            height={height}
            hasDownload={hasDownload}
            hasRefresh={hasRefresh}
            onAdvSearch={this.handleAdvSearch}
          />
        </Spin>
      </div>
    );
  }
}

const composedHoc = compose(
  withHttpGetTableData,
  withHttpGetSubTableData,
  withHttpGetBeBtns,
  withHttpGetFormData,
  withHttpRemoveRecords,
  withAdvSearch,
  withDownloadFile,
  withRecordForm()
);
export default composedHoc(TableData);
