import React from 'react';
import PropTypes from 'prop-types';
import PwTable from '../../ui-components/PwTable';
import http, { makeCancelable } from '../../../util/api';
import { message } from 'antd';
import { extractAndDealBackendBtns } from '../../../util/beBtns';
/**
 * Table
 */
export default class Table extends React.Component {
  static propTypes = {
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
    hasBeBtns: PropTypes.bool
  };

  static defaultProps = {
    dataMode: 'main',
    hasAdd: true,
    hasModify: true,
    hasDelete: true,
    hasBeSort: true,
    defaultColumnWidth: 200,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    hasBeBtns: false
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
      columns: [] // 表格列配置信息
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  componentWillUnmount = () => {
    this.p1.cancel();
    this.p2.cancel();
  };

  getData = () => {
    const { hasBeBtns } = this.props;
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
  };

  getTableData = async ({
    page,
    pageSize,
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
    console.log({ page });

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
    const { beBtnsMultiple, beBtnsSingle } = extractAndDealBackendBtns(
      res.data
    );

    this.setState({
      beBtnsMultiple,
      beBtnsSingle
    });
  };

  handlePageChange = (page, pageSize) => {
    this.getTableData({ page, pageSize });
  };

  getColumns = columnsInfo => {
    const {
      hasBeSort,
      defaultColumnWidth,
      columnsWidth,
      hasRowModify,
      hasRowView,
      hasRowDelete
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

      columns.push(column);
    });

    // const

    return columns;
  };

  handleAdd = () => {
    console.log('add');
  };
  handleModify = () => {
    console.log('modify');
  };
  handleDelete = () => {
    console.log('delete');
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
    const { defaultColumnWidth, columnsWidth } = this.props;
    const { columns } = this.state;
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

    const x = (count - customCount) * defaultColumnWidth + customWidth;
    return { x };
  };

  render() {
    const { title, resid, dataMode, hasAdd, hasModify, hasDelete } = this.props;
    const { loading, pagination, dataSource, columns } = this.state;
    return (
      <PwTable
        title={title}
        loading={loading}
        pagination={pagination}
        dataSource={dataSource}
        columns={columns}
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
      />
    );
  }
}
