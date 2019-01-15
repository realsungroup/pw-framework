import React from 'react';
import PwTable from '../../ui-components/PwTable';
import { message, Button, Spin } from 'antd';
import LzBackendBtn from '../../ui-components/LzBackendBtn';
import ButtonWithConfirm from '../../ui-components/ButtonWithConfirm';
import { getResid, getCmsWhere, paa } from '../../../util/util';
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
import { EditableContext } from './EditableRow';
import {
  getDataProp,
  setDataInitialValue
} from '../../../util/formData2ControlsData';
import { ResizableBox } from 'react-resizable';
import withZoomInOut from '../../hoc/withZoomInOut';
import { makeCancelable } from '../../../util/api';

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
      components: undefined, // 行内编辑中自定义单元行/格的组件
      beBtnsMultiple: [], // 后端操作多条记录的按钮
      beBtnsSingle: [], // 后端操作单条记录的按钮
      beBtnsOther: [], // 后端其他操作按钮（如：打开添加表单；打开修改表单；打开查看表单；地址跳转等）
      recordFormShowMode: undefined, // 记录表单的显示模式：'add' 添加 | 'modify' 修改 | 'view' 查看
      rowSelection, // 行选择配置
      selectedRecord: {}, // 所选择的记录
      scrollXY: { x: 1000, y: 1000 },
      editingKey: null // 正在进行行内编辑的记录 REC_ID
    };
  }

  componentDidMount = async () => {
    this.initVariables();
    this.setState({ loading: true });
    await this.getData();
    await this.getScrollXY();
    this.setState({ loading: false });
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
  };

  initVariables = () => {
    const { dataMode, resid, subresid } = this.props;

    // 资源 id
    this._id = getResid(dataMode, resid, subresid);

    // 记录表单所需的窗体数据
    this._recordFormData = null;

    // 行内编辑需索的窗体数据
    this._rowEditFormData = null;

    /**
     * 缓存已处理的窗体数据
     */
    // 缓存已处理的记录表单窗体数据（记录表单所需的 data）
    this._dealedRecordFormData = null;

    // 缓存已处理的行内编辑窗体数据（行内编辑表单所需的 data）
    this._dealedRowEditFormData = null;
  };

  getData = async () => {
    const {
      hasBeBtns,
      hasAdd,
      hasModify,
      hasRowModify,
      hasRowView,
      hasRowEdit
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

    // 需要获取窗体数据，用于行内编辑或记录记录表单中
    const isNeedRecordForm = hasAdd || hasModify || hasRowModify || hasRowView;
    const isNeedEditForm = hasRowEdit;
    if (isNeedRecordForm || isNeedEditForm) {
      this.getFormData(isNeedRecordForm, isNeedEditForm);
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
      return console.error(err);
    }
    const {
      hasBeSort,
      defaultColumnWidth,
      columnsWidth,
      fixedColumns,
      hasRowEdit
    } = this.props;
    const { columns, components } = getColumns(
      res.cmscolumninfo,
      {
        hasBeSort,
        defaultColumnWidth,
        columnsWidth,
        fixedColumns
      },
      cmscolumns,
      hasRowEdit
    );
    const dataSource = res.data;

    const state = {
      columns,
      dataSource,
      components,
      pagination: {
        ...this.state.pagination,
        current: page,
        pageSize,
        total: res.total
      },
      editingKey: null // 清除正在编辑的行
    };

    // 有行内编辑，则清除正在编辑的行
    if (this.props.hasRowEdit) {
      state.editingKey = null;
    }

    this.setState(state);
  };

  /**
   * 获取窗体数据
   * @param {boolean} isNeedRecordForm 是否需要获取记录表单所需的窗体数据
   * @param {boolean} isNeedEditForm 是否需要获取行内编辑所需的窗体数据
   */
  getFormData = async (isNeedRecordForm, isNeedEditForm) => {
    const {
      recordFormName,
      rowEditFormName,
      httpGetFormData,
      formProps
    } = this.props;
    const id = this._id;
    let arr,
      pArr = [];
    if (isNeedRecordForm) {
      pArr.push(httpGetFormData(id, recordFormName));
    }
    if (isNeedEditForm) {
      pArr.push(httpGetFormData(id, rowEditFormName));
    }
    try {
      this.p1 = makeCancelable(Promise.all(pArr));
      arr = await this.p1.promise;
    } catch (err) {
      return console.error(err);
    }
    const [recordFormData, rowEditFormData] = arr;
    this._recordFormData = recordFormData;
    this._rowEditFormData = rowEditFormData;

    // 缓存记录表单和行内编辑表单所接收的 data prop
    const recordFormIsClassifyLayout = formProps.displayMode === 'classify';
    this._dealedRecordFormData =
      recordFormData &&
      getDataProp(this._recordFormData, {}, recordFormIsClassifyLayout);
    this._dealedRowEditFormData =
      rowEditFormData && getDataProp(this._rowEditFormData, {});
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
    const { httpGetBeBtns } = this.props;
    const id = this._id;
    let btns;
    try {
      btns = await httpGetBeBtns(id);
    } catch (err) {
      return console.error(err);
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

  // 渲染在头部的后端按钮
  renderBeBtns = () => {
    const { beBtnsMultiple, beBtnsOther } = this.state;
    const { size } = this.props;
    const id = this._id;
    const arr = [...beBtnsMultiple, ...beBtnsOther];
    const records = this.getSelectedRecords();

    return arr.map(btnInfo => (
      <LzBackendBtn
        key={btnInfo.Name1}
        btnInfo={btnInfo}
        resid={id}
        onConfirm={this.beBtnConfirm}
        records={records}
        size={size}
      />
    ));
  };

  // 渲染行后端按钮
  renderRowBeBtns = (beBtnsSingle, record) => {
    const { size } = this.props;
    const id = this._id;
    return beBtnsSingle.map(btnInfo => (
      <LzBackendBtn
        key={btnInfo.Name1}
        btnInfo={btnInfo}
        resid={id}
        onConfirm={this.beBtnConfirm}
        records={[record]}
        size={size}
      />
    ));
  };

  getSelectedRecords = () => {
    const { rowSelection, dataSource } = this.state;
    const records = [];
    if (!rowSelection) {
      return records;
    }
    const { selectedRowKeys } = rowSelection;
    dataSource.forEach(record => {
      const result = selectedRowKeys.some(key => key === record.REC_ID);
      if (result) {
        records.push(record);
      }
    });
    return records;
  };

  /**
   * 打开记录表单，进行 添加/修改/查看 操作
   * @param {string} operation 操作：'add' 添加 | 'modify' 修改 | 'view' 查看
   * @param {object} record 记录
   * @param {object} data 控件数据
   * 当传参数时，表示点击 “后端按钮” 打开记录表单
   * 不传参数时，表示点击 “前端定义的按钮” 打开记录表单
   */
  openRecordForm = (operation, record, data, recordFormData) => {
    const {
      dataMode,
      resid,
      subresid,
      formProps,
      hostrecid,
      AdvDicTableProps,
      openRecordForm,
      recordFormType,
      beforeSaveFields,
      recordFormContainerProps,
      subTableArrProps
    } = this.props;

    const { recordFormShowMode, selectedRecord } = this.state;

    if (!this._recordFormData || !this._dealedRecordFormData) {
      return message.info('正在请求窗体数据，请稍等...');
    }

    const newOperation = operation || recordFormShowMode;

    const newRecord = record || selectedRecord;

    let newData = data || this._dealedRecordFormData;
    const isTransformValue = ['add', 'modify'].indexOf(newOperation) !== -1;
    newData = setDataInitialValue(newData, newRecord, isTransformValue);

    const { subTableArr } = recordFormData || this._recordFormData;

    openRecordForm({
      type: recordFormType,
      title: modalTitleMap[recordFormShowMode],
      formProps,
      data: newData,
      operation: newOperation,
      record: newRecord,
      info: { dataMode, resid, subresid, hostrecid },
      beforeSaveFields,
      AdvDicTableProps,
      recordFormContainerProps,
      subTableArr,
      subTableArrProps,
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

  handleRowEdit = record => {
    this.setState({
      editingKey: record.REC_ID
    });
  };

  handleRowSave = (form, oldRecord) => {
    const { validateFields } = form;
    validateFields((err, values) => {
      if (err) {
        return message.error('表单验证出错');
      }
      console.log({ values });
    });
  };

  handleRowCancel = () => {
    this.setState({ editingKey: null });
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
    const { httpRemoveRecords } = this.props;
    const id = this._id;
    try {
      await httpRemoveRecords(id, records);
    } catch (err) {
      return console.error(err);
    }
    message.success('删除成功');

    // 清除 selectedRowKeys
    if (this.state.rowSelection) {
      this.setState({
        rowSelection: { ...this.state.rowSelection, selectedRowKeys: [] }
      });
    }

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
      advSearchContainerType,
      advSearchFormName,
      advSearchContainerProps,
      advSearchFormProps,
      openAdvSearch,
      advSearchValidationFields
    } = this.props;
    const id = this._id;

    // 打开高级搜索
    openAdvSearch(
      advSearchContainerType,
      id,
      advSearchFormName,
      advSearchValidationFields,
      this.getCmsWhere,
      advSearchContainerProps,
      advSearchFormProps
    );
  };

  handleZoomIn = () => {
    this.props.hasResizeableBox || this.props.zoomIn();
  };

  handleZoomOut = () => {
    this.props.hasResizeableBox || this.props.zoomOut();
  };

  _cmsWhere = '';
  getCmsWhere = cmsWhere => {
    this._cmsWhere = cmsWhere;
    this.handleRefresh(true);
  };

  beBtnConfirm = (type, records, formData, defaultRecord) => {
    if (type === 1 || type === 5) {
      this.handleRefresh();
      // 编辑记录
    } else if (type === 6) {
      this.openRecordForm('modify', defaultRecord, formData);
      // 查看记录
    } else if (type === 7) {
      this.openRecordForm('view', defaultRecord, formData);
      // 添加记录
    } else if (type === 8) {
      this.openRecordForm('add', defaultRecord, formData);
    }
  };

  isEditing = record => {
    return this.state.editingKey === record.REC_ID;
  };

  getDataItem = (record, dataIndex) => {
    if (!this._rowEditFormData || !this._dealedRowEditFormData) {
      return {};
    }
    const data = setDataInitialValue(this._dealedRowEditFormData, record, true);
    return data.find(dataItem => dataItem.id === dataIndex);
  };

  getNewColumns = columns => {
    const { hasRowEdit } = this.props;
    let newColumns = [...columns];

    // 行内编辑
    if (hasRowEdit) {
      newColumns = newColumns.map(column => {
        if (!column.editable) {
          return column;
        }
        return {
          ...column,
          onCell: (record, index) => ({
            record,
            title: column.title,
            dataIndex: column.dataIndex,
            index,
            editing: this.isEditing(record),
            dataItem: this.getDataItem(record, column.dataIndex)
          })
        };
      });
    }

    // 添加操作栏
    if (this.hasActionBar()) {
      newColumns = newColumns.concat([this.getActionBar()]);
    }

    return newColumns;
  };

  renderRowEditBtn = record => {
    return (
      <Button
        size={btnSizeMap[this.props.size]}
        onClick={() => this.handleRowEdit(record)}
        className="table-data__action-btn"
      >
        编辑
      </Button>
    );
  };

  renderRowSaveBtn = record => {
    return (
      <EditableContext.Consumer>
        {form => (
          <Button
            size={btnSizeMap[this.props.size]}
            onClick={() => this.handleRowSave(form, record)}
            className="table-data__action-btn"
          >
            保存
          </Button>
        )}
      </EditableContext.Consumer>
    );
  };

  renderRowCancelBtn = record => {
    return (
      <ButtonWithConfirm
        popConfirmProps={{
          title: '您确定要取消编辑吗？',
          onConfirm: () => this.handleRowCancel()
        }}
        buttonProps={{
          type: 'danger',
          size: btnSizeMap[this.props.size],
          className: 'table-data__action-btn'
        }}
      >
        取消
      </ButtonWithConfirm>
    );
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
    const { httpRemoveRecords } = this.props;
    const id = this._id;
    try {
      await httpRemoveRecords(id, records);
    } catch (err) {
      return console.error(err);
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
        const { beBtnsSingle, editingKey } = this.state;
        let {
          hasRowEdit,
          hasRowModify,
          hasRowView,
          hasRowDelete,
          customRowBtns,
          hasBeBtns
        } = this.props;
        let hasRowSaveCancel,
          hasRowBeBtns = hasBeBtns && !!beBtnsSingle.length,
          hasCustomRowBtns = !!customRowBtns;

        if (hasRowEdit) {
          hasRowSaveCancel = record.REC_ID === editingKey;
          hasRowEdit = hasRowEdit && !hasRowSaveCancel;
          hasRowModify = hasRowModify && !hasRowSaveCancel;
          hasRowView = hasRowView && !hasRowSaveCancel;
          hasRowDelete = hasRowDelete && !hasRowSaveCancel;
          hasRowBeBtns = hasRowBeBtns && !hasRowSaveCancel;
          hasCustomRowBtns = hasCustomRowBtns && !hasRowSaveCancel;
        }

        return (
          <Fragment>
            {hasRowEdit && this.renderRowEditBtn(record)}

            {hasRowSaveCancel && this.renderRowSaveBtn(record)}
            {hasRowSaveCancel && this.renderRowCancelBtn(record)}

            {hasRowModify && this.renderRowModifyBtn(record)}
            {hasRowView && this.renderRowViewBtn(record)}
            {hasRowDelete && this.renderRowDeleteBtn(record)}

            {/* 后端按钮 */}
            {hasRowBeBtns && this.renderRowBeBtns(beBtnsSingle, record)}
            {/* 自定义按钮 */}
            {hasCustomRowBtns &&
              this.renderCustomRowBtns(customRowBtns, record)}
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

  renderPwTable = () => {
    const {
      title,
      hasAdd,
      hasModify,
      hasDelete,
      size,
      hasDownload,
      hasRefresh,
      hasAdvSearch,
      width,
      height,
      hasResizeableBox,
      hasZoomInOut
    } = this.props;
    const {
      pagination,
      dataSource,
      columns,
      rowSelection,
      scrollXY,
      components,
      editingKey
    } = this.state;
    const newColumns = this.getNewColumns(columns);

    let style = {};
    if (!hasResizeableBox && !hasZoomInOut) {
      style = { width, height };
    }

    return (
      <div className="table-data" style={style}>
        <PwTable
          title={title}
          editingKey={editingKey}
          components={components}
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
          size={size}
          hasDownload={hasDownload}
          hasRefresh={hasRefresh}
          onAdvSearch={this.handleAdvSearch}
          hasAdvSearch={hasAdvSearch}
          hasZoomInOut={hasZoomInOut}
          onZoomIn={this.handleZoomIn}
          onZoomOut={this.handleZoomOut}
        />
      </div>
    );
  };

  render() {
    const { width, height, hasResizeableBox } = this.props;
    const { loading } = this.state;

    if (hasResizeableBox) {
      return (
        <Spin spinning={loading}>
          <ResizableBox
            width={width}
            height={height}
            onResizeStop={this.handleResizeStop}
          >
            {this.renderPwTable()}
          </ResizableBox>
        </Spin>
      );
    } else {
      return <Spin spinning={loading}>{this.renderPwTable()}</Spin>;
    }
  }
}

const composedHoc = compose(
  withHttpGetTableData,
  withHttpGetSubTableData,
  withHttpGetBeBtns,
  withHttpGetFormData,
  withHttpRemoveRecords,
  withAdvSearch(),
  withDownloadFile,
  withRecordForm(),
  withZoomInOut()
);
export default composedHoc(TableData);
