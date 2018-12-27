import React from 'react';
import PropTypes from 'prop-types';
import PwTable from '../../ui-components/PwTable';
import http, { makeCancelable } from '../../../util/api';
import { message, Modal } from 'antd';
import { extractAndDealBackendBtns } from '../../../util/beBtns';
import LzBackendBtn from '../../ui-components/LzBackendBtn';
import FormData from '../FormData';
import { Button } from '../../../../node_modules/antd/lib/radio';
import dealControlArr from '../../../util/controls';
import ButtonWithConfirm from '../../ui-components/ButtonWithConfirm';
const { Fragment } = React;

const getResid = (dataMode, resid, subresid) => {
  return dataMode === 'main' ? resid : subresid;
};

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
export default class TableData extends React.Component {
  static propTypes = {
    /**
     * 表格尺寸
     * 默认：'middle'
     */
    size: PropTypes.oneOf(['large', 'middle', 'small']),

    /**
     * 表格标题
     */
    title: PropTypes.string.isRequired,

    /**
     * 数据模式
     * 可选：'main' | 'sub'
     * 默认：'main'
     * 描述：'main' 表示主表数据；'sub' 表示子表数据
     */
    dataMode: PropTypes.oneOf(['main', 'sub']),

    /**
     * 主表id
     */
    resid: PropTypes.number.isRequired,

    /**
     * 预设查询编号
     */
    mtsid: PropTypes.number,

    /**
     * 子表 id
     */
    subresid: (props, propName, componentName) => {
      // 当 dataMode 为 "sub" 时，subresid 是必传的
      if (props.dataMode === 'sub') {
        return typeof props[propName] === 'number'
          ? null
          : new Error('lz-table: subresid 无效，subresid 必须为 number 类型');
      }
    },

    /**
     * 主表记录编号
     */
    hostrecid: (props, propName, componentName) => {
      // 当 dataMode 为 "sub" 时，hostrecid 是必传的
      if (props.dataMode === 'sub') {
        return typeof props[propName] === 'number'
          ? null
          : new Error('lz-table: hostrecid 无效，hostrecid 必须为 number 类型');
      }
    },

    /**
     * 要获取数据的字段
     * 默认：-
     * 例子：'C3_511302422114,C3_511302066880,C3_511302131411'
     */
    cmscolumns: PropTypes.string,

    /**
     * 表 cmswhere 查询的字符串
     * 默认：-
     * 例子：'C3_511302422114=1,C3_511302066880,C3_511302131411'
     */
    cmswhere: PropTypes.string,

    /**
     * 窗体名称
     * 默认：'default'，相当于：
     * {
     *   rowFormName: 'default', //  rowFormName 表示行内编辑所用的窗体名称
     *   formFormName: 'default' // formFormName 表示表单中所用的窗体名称
     * }
     * 如果 formsName 的类型为字符串，则 “行内编辑所用的窗体名称” 和 “表单中所用的窗体名称” 相同
     */
    formsName: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

    /**
     * 默认分页配置
     * -
     */
    defaultPagination: PropTypes.object,

    /**
     * 是否有添加按钮
     * 默认：true
     */
    hasAdd: PropTypes.bool,

    /**
     * 是否有修改按钮
     * 默认：true
     */
    hasModify: PropTypes.bool,

    /**
     * 是否有删除按钮
     * 默认：true
     */
    hasDelete: PropTypes.bool,

    /**
     * 是否有后端排序功能
     * 默认：true
     */
    hasBeSort: PropTypes.bool,

    /**
     * 默认列宽度
     * 默认：200
     */
    defaultColumnWidth: PropTypes.number,

    /**
     * 自定义列宽度
     * 默认：-
     * 如：{ '姓名': 100, '工号': 150 }
     */
    columnsWidth: PropTypes.object,

    /**
     * 是否有行修改按钮
     * 默认：true
     */
    hasRowModify: PropTypes.bool,

    /**
     * 是否有行查看按钮
     * 默认：true
     */
    hasRowView: PropTypes.bool,

    /**
     * 是否有行删除按钮
     * 默认：true
     */
    hasRowDelete: PropTypes.bool,

    /**
     * 是否有后端按钮
     * 默认：false
     */
    hasBeBtns: PropTypes.bool,

    /**
     * 渲染自定义行按钮：为一个函数数组
     * 默认：-
     */
    renderRowBtns: PropTypes.array,

    /**
     * 操作栏的宽度
     * 默认：300
     */
    actionBarWidth: PropTypes.number,

    /**
     * 操作栏是否固定在右侧
     * 默认：true
     */
    actionBarFixed: PropTypes.bool,

    /**
     * 固定列
     * 默认：-
     * 如：['姓名', '工号']
     */
    fixedColumns: PropTypes.array,

    /**
     * 模态窗中表单的 formname
     * 默认：default
     */
    modalFormName: PropTypes.string
  };

  static defaultProps = {
    size: 'middle',
    dataMode: 'main',
    hasAdd: true,
    hasModify: true,
    hasDelete: true,
    hasBeSort: true,
    defaultColumnWidth: 200,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    hasBeBtns: false,
    actionBarWidth: 300,
    actionBarFixed: true,
    modalFormName: 'default'
  };

  constructor(props) {
    super(props);

    const { defaultPagination } = props;

    const pagination = this.getPagination(defaultPagination);

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
      modalVisible: false, // 表单模态窗是否显示
      modalFormMode: undefined, // 表单模态窗的显示模式：'add' 添加 | 'modify' 修改 | 'view' 查看
      rowSelection: null, // 行选择配置
      selectedRecord: {} // 所选择的记录
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
    this.p3 && this.p3.cancel();
    this.p4 && this.p4.cancel();
    this.p5 && this.p5.cancel();
    this.p6 && this.p6.cancel();
  };

  getData = () => {
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
    this.getTableData({ page, pageSize });

    // 有后端定义按钮
    if (hasBeBtns) {
      this.getBeBtns();
    }

    // 有打开模态窗表单的按钮
    if (hasAdd || hasModify || hasRowModify || hasRowView) {
      this.getFormData();
    }
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
      cmscolumns
    } = this.props;
    let res;
    try {
      // 获取主表数据
      if (dataMode === 'main') {
        res = await this.getMainTableData({
          resid,
          key,
          cmswhere,
          cmscolumns,
          pageindex: page - 1,
          pagesize: pageSize,
          sortOrder,
          sortField,
          getcolumninfo: 1 // 需要这个参数为 1，才能获取到字段信息
        });
      } else {
        // 获取子表数据
        res = await this.getSubTableData();
      }
    } catch (err) {
      return message.error(err.message);
    }
    const columns = this.getColumns(res.cmscolumninfo);
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

  getMainTableData = async params => {
    this.p1 = makeCancelable(http().getTable(params));
    return await this.p1.promise;
  };
  getSubTableData = async params => {
    this.p1 = makeCancelable(http().getSubTable(params));
    return await this.p1.promise;
  };

  getPagination = defaultPagination => {
    if (defaultPagination) {
      return { ...defaultPagination, onChange: this.handlePageChange };
    }
  };

  getFormData = async () => {
    const { dataMode, resid, subresid, modalFormName } = this.props;
    const id = getResid(dataMode, resid, subresid);
    this.p4 = makeCancelable(
      http().getFormData({
        resid: id,
        formname: modalFormName
      })
    );
    let res;
    try {
      res = await this.p4.promise;
    } catch (err) {
      return message.error(err.message);
    }
    const modalFormData = dealControlArr(res.data.columns);
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
    const { dataMode, resid, subresid } = this.props;
    let res, id;
    if (dataMode === 'main') {
      id = resid;
    } else {
      id = subresid;
    }
    this.p3 = makeCancelable(http().getBeBtns({ resid: id }));
    try {
      res = await this.p3.promise;
    } catch (err) {
      return message.error(err.message);
    }
    const {
      beBtnsMultiple,
      beBtnsSingle,
      beBtnsOther
    } = extractAndDealBackendBtns(res.data);

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

  // 是否有操作栏
  hasActionBar = () => {
    const { beBtnsSingle } = this.state;
    const {
      hasRowDelete,
      hasRowModify,
      hasRowView,
      renderRowBtns
    } = this.props;
    return !!(
      hasRowDelete ||
      hasRowModify ||
      hasRowView ||
      beBtnsSingle.length ||
      renderRowBtns
    );
  };

  hasRowSelection = beBtnsMultiple => {
    const { hasModify, hasDelete } = this.props;
    return !!beBtnsMultiple.length || hasModify || hasDelete;
  };

  getColumns = columnsInfo => {
    const {
      hasBeSort,
      defaultColumnWidth,
      columnsWidth,
      fixedColumns
    } = this.props;
    const columns = [];
    columnsInfo.forEach(item => {
      const column = {
        width: defaultColumnWidth,
        title: item.text,
        dataIndex: item.id,
        key: item.id,
        align: 'center'
      };

      // 自定义列宽度
      let width = columnsWidth && columnsWidth[item.text];
      if (width) {
        column.width = width;
      }

      // 开启了后端排序功能
      if (hasBeSort) {
        column.sorter = true;
      }

      // 固定了列
      if (
        Array.isArray(fixedColumns) &&
        fixedColumns.indexOf(item.text) !== -1
      ) {
        column.fixed = 'left';
      }

      columns.push(column);
    });

    return columns;
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

  getScroll = () => {
    const { defaultColumnWidth, columnsWidth, actionBarWidth } = this.props;
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
    return { x };
  };

  // 渲染后端按钮
  renderBeBtns = () => {
    const { selectedRows, beBtnsMultiple, beBtnsOther } = this.state;
    const { dataMode, resid, subresid } = this.props;
    const id = getResid(dataMode, resid, subresid);
    const arr = [...beBtnsMultiple, ...beBtnsOther];

    return arr.map(btnInfo => (
      <LzBackendBtn
        key={btnInfo.Name1}
        btnInfo={btnInfo}
        resid={id}
        onConfirm={this.beBtnConfirm}
        records={selectedRows}
      />
    ));
  };

  // 点击添加按钮
  handleAdd = () => {
    this.setState({
      modalVisible: true,
      modalFormMode: 'add',
      selectedRecord: {}
    });
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

    this.setState({
      modalVisible: true,
      modalFormMode: 'modify',
      selectedRecord
    });
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
    const { dataMode, resid, subresid } = this.props;
    this.p5 = makeCancelable(
      http().removeRecords({
        resid: getResid(dataMode, resid, subresid),
        data: records
      })
    );
    try {
      await this.p5.promise;
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

  handleModalCancel = () => {
    this.setState({ modalVisible: false });
  };

  handleOnRow = record => {
    return {
      onClick: () => {}, // 点击行
      onMouseEnter: () => {} // 鼠标移入行
    };
  };

  handleRefresh = () => {
    this.getTableData({
      page: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize
    });
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
      >
        修改
      </Button>
    );
  };

  renderRowViewBtn = () => {
    return <Button size={btnSizeMap[this.props.size]}>查看</Button>;
  };

  renderRowDeleteBtn = record => {
    return (
      <ButtonWithConfirm
        popConfirmProps={{
          title: '您确定要删除吗？',
          onConfirm: () => this.handleRowDelete([record])
        }}
        buttonProps={{
          type: 'danger'
        }}
      >
        删除
      </ButtonWithConfirm>
    );
  };

  handleRowDelete = async records => {
    const { dataMode, resid, subresid } = this.props;
    console.log({ records });

    this.p6 = makeCancelable(
      http().removeRecords({
        resid: getResid(dataMode, resid, subresid),
        data: records
      })
    );

    try {
      await this.p6.promise;
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

  getActionBar = () => {
    const actionBar = {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      align: 'center',
      width: this.props.actionBarWidth,
      render: (text, record, rowIndex) => {
        const { beBtnsSingle } = this.state;
        const { hasModify, hasRowView, hasRowDelete } = this.props;
        return (
          <Fragment>
            {hasModify && this.renderRowModifyBtn(record)}
            {hasRowView && this.renderRowViewBtn()}
            {hasRowDelete && this.renderRowDeleteBtn(record)}

            {/* 后端按钮 */}
            {this.renderBeBtns(beBtnsSingle, record)}
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
    const { title, resid, dataMode, hasAdd, hasModify, hasDelete } = this.props;
    const {
      loading,
      pagination,
      dataSource,
      columns,
      modalVisible,
      modalFormMode,
      rowSelection,
      modalFormData,
      selectedRecord
    } = this.state;

    const newColumns = this.getNewColumns(columns);

    return (
      <Fragment>
        <PwTable
          title={title}
          loading={loading}
          pagination={pagination}
          dataSource={dataSource}
          columns={newColumns}
          bordered
          rowKey={'REC_ID'}
          scroll={this.getScroll()}
          hasAdd={hasAdd}
          hasModify={hasModify}
          hasDelete={hasDelete}
          onAdd={this.handleAdd}
          onModify={this.handleModify}
          onDelete={this.handleDelete}
          onSearch={this.handleSearch}
          onSearchChange={this.onSearchChange}
          onChange={this.handleTableChange}
          renderOtherBtns={this.renderBeBtns}
          rowSelection={rowSelection}
          onRow={this.handleOnRow}
          onRefresh={this.handleRefresh}
          width={1300}
          height={850}
        />
        <Modal
          title={modalTitleMap[modalFormMode]}
          visible={modalVisible}
          footer={null}
          onCancel={this.handleModalCancel}
          destroyOnClose
        >
          <FormData
            formData={modalFormData}
            operation={modalFormMode}
            record={selectedRecord}
          />
        </Modal>
      </Fragment>
    );
  }
}
