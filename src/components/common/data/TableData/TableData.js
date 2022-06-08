import React from 'react';
import PwTable from '../../ui/PwTable';
import PwAggird from '../../ui/PwAggrid';
import { message, Button, Spin, Modal } from 'antd';
import LzBackendBtn from '../../ui/LzBackendBtn';
import ButtonWithConfirm from '../../ui/ButtonWithConfirm';
import { getResid, getCmsWhere, percentString2decimal } from 'Util20/util';
import { getColumns, getRowSelection, getPagination } from './util';
import './TableData.less';
import { withHttpGetBeBtns, withHttpGetFormData } from '../../hoc/withHttp';
import { compose } from 'recompose';
import withAdvSearch from '../../hoc/withAdvSearch';
import withImport from '../../hoc/withImport';
import withModalDrawer from '../../hoc/withModalDrawer';
import withDownloadFile from '../../hoc/withDownloadFile';
import { withRecordForm } from '../../hoc/withRecordForm';

import { defaultProps, propTypes } from './propTypes';
import { EditableContext } from './EditableRow';
import { getDataProp, setDataInitialValue } from 'Util20/formData2ControlsData';
// import withZoomInOut from '../../hoc/withZoomInOut';
import { injectIntl, FormattedMessage as FM } from 'react-intl';
import { getIntlVal, getItem } from 'Util20/util';
import dealControlArr, { dealFormData } from 'Util20/controls';
import http, { makeCancelable } from 'Util20/api';
import { debounce } from 'lodash';
import classNames from 'classnames';

const { Fragment } = React;

const btnSizeMap = {
  large: 'large',
  middle: 'default',
  small: 'small'
};

const getResColumns = cmscolumninfo => {
  return cmscolumninfo.map(item => ({ ...item[item.id] }));
};

const getColor = (record, { cols, conds, vals, color }) => {
  const len = cols.length;
  let flag = true; // 是否符合规则
  for (let i = 0; i < len; i++) {
    const actualVal = record[cols[i]];
    const value = vals[i];
    const cond = conds[i];
    let isBreak = false;
    switch (cond) {
      case '<': {
        if (!(actualVal < value)) {
          isBreak = true;
        }
        break;
      }
      case '<=': {
        if (!(actualVal <= value)) {
          isBreak = true;
        }
        break;
      }
      case '=': {
        if (!(actualVal == value)) {
          isBreak = true;
        }
        break;
      }
      case '>=': {
        if (!(actualVal >= value)) {
          isBreak = true;
        }
        break;
      }
      case '>': {
        if (!(actualVal > value)) {
          isBreak = true;
        }
        break;
      }
      default: {
        isBreak = true;
      }
    }

    if (isBreak) {
      flag = false;
      break;
    }
  }

  return flag ? color : '';
};

const getColorByRules = (record, ruleData, ruleCount) => {
  const dataFilter = item => {
    if (typeof item === 'string' && !item) {
      return false;
    }
    return true;
  };

  let color;
  for (let i = 1; i <= ruleCount; i++) {
    color = getColor(record, {
      cols: ruleData[`RowColorCol${i}`].filter(dataFilter),
      conds: ruleData[`RowColorCond${i}`].filter(dataFilter),
      vals: ruleData[`RowColorCondVal${i}`].filter(dataFilter),
      color: ruleData[`RowColor${i}`]
    });
    if (color) {
      break;
    }
  }
  return color;
};

const getRuleCount = ruleData => {
  const keys = Object.keys(ruleData);
  let count = 0;
  keys.forEach(item => {
    if (/RowColorCol\d+$/.test(item)) {
      count++;
    }
  });
  return count;
};

const getWithRowColorDataSource = (dataSource, ruleData) => {
  const newDataSource = dataSource.map(item => ({ ...item }));

  const ruleCount = getRuleCount(ruleData);

  newDataSource.forEach(record => {
    const color = getColorByRules(record, ruleData, ruleCount);
    if (color) {
      record._rowColor = color;
    }
  });

  return newDataSource;
};

const getSuccessMessageComponent = successMessageComponent => {
  if (typeof successMessageComponent === 'string') {
    return {
      name: successMessageComponent
    };
  }
  return successMessageComponent;
};

/**
 * 精确的 where 语句转换为模式搜索的 where 语句，如：
 * "C3_609845305680 = '11' and C3_610390410802 = '121'" =》 "C3_609845305680 like '%11%' and C3_610390410802 like '%121%'"
 * @param {string} cmsWhere cmswhere，如："C3_609845305680 = '11' and C3_610390410802 = '121'"
 */
const accurate2fuzzy = cmsWhere => {
  if (!cmsWhere) {
    return '';
  }
  const a1 = cmsWhere.split('and').map(item => item.trim());
  a1.forEach((s, index) => {
    const sArr = s.split('=').map(item => item.trim());
    sArr[1] = sArr[1].replace(/'/g, '');
    sArr[1] = `'%${sArr[1]}%'`;
    a1[index] = `${sArr[0]} like ${sArr[1]}`;
  });
  return a1.join(' and ');
};

const NO_COLUMN_EN_TEXT = 'No.';
const NO_COLUMN_CN_TEXT = '序号';
const NO_COLUMN_WIDTH = 50;

/**
 * TableData
 */
class TableData extends React.Component {
  static displayName = 'TableData';

  static propTypes = propTypes;

  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    const {
      defaultPagination,
      hasModify,
      hasDelete,
      width,
      height,
      hasRowSelection,
      rowSelection
    } = props;
    const pagination = getPagination(
      defaultPagination,
      this.handlePageChange,
      this.handleShowSizeChange
    );
    const _rowSelection = getRowSelection(
      hasRowSelection,
      hasModify,
      hasDelete,
      {
        columnWidth: rowSelection.columnWidth,
        columnTitle: rowSelection.columnTitle,
        fixed:
          typeof rowSelection.fixed === 'undefined' ? true : rowSelection.fixed,
        getCheckboxProps: rowSelection.getCheckboxProps,
        hideDefaultSelections: rowSelection.hideDefaultSelections,
        selectedRowKeys: rowSelection.selectedRowKeys,
        selections: rowSelection.selections,
        type: rowSelection.type,
        onChange: this.rowSelectionChange,
        onSelect: this.handleRowSelect,
        onSelectAll: this.handleRowSelectAll,
        onSelectInvert: this.handleRowSelectInvert
      }
    );

    this._showAGgrid = false;
    try {
      this._showAGgrid = JSON.parse(getItem('tablesConfigure'))[
        this.props.resid
      ].showAGgrid;
    } catch (error) {
      // console.error(error)
    }

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
      recordFormShowMode: '', // 记录表单的显示模式：'add' 添加 | 'modify' 修改 | 'view' 查看
      rowSelection: _rowSelection, // 行选择配置
      selectedRecord: {}, // 所选择的记录
      scrollXY: { x: 1000, y: 1000 },
      editingKey: null, // 正在进行行内编辑的记录 REC_ID
      width,
      height,
      gridProps: [],
      originalColumn: [],
      zoomStatus: 0, // 缩放状态：0 表示处于缩小状态 | 1 表示处于放大状态
      clickedRowId: -1, // 点击行的 id
    };
  }

  componentDidMount = async () => {
    this.initVariables();
    this.setState({ loading: true });

    await this.getData();
    await this.getScrollXY();

    this.addEventListener();

    this.setState({ loading: false });

    this.getRowColorData();
  };

  componentWillReceiveProps = async nextProps => {
    // if (
    //   this.props.resid !== nextProps.resid ||
    //   this.props.subresid !== nextProps.subresid ||
    //   this.props.dataMode !== nextProps.dataMode ||
    //   this.props.hostrecid !== nextProps.hostrecid
    // ) {
    //   this.setState({ loading: true });

    //   this.initVariables(nextProps);
    //   await this.getData(nextProps);
    //   this.setState({ loading: false });
    // }
    if (this.props.dataSource !== nextProps.dataSource) {
      this.setState({
        dataSource: nextProps.dataSource
      });
    }
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
    this.p3 && this.p3.cancel();
    this.p4 && this.p4.cancel();
    window.removeEventListener('resize', this.cb);
  };

  async componentDidUpdate(prevProps) {
    if (
      this.props.cparm1 !== prevProps.cparm1 ||
      this.props.cparm2 !== prevProps.cparm2 ||
      this.props.cparm3 !== prevProps.cparm3 ||
      this.props.cparm4 !== prevProps.cparm4 ||
      this.props.cparm5 !== prevProps.cparm5 ||
      this.props.cparm6 !== prevProps.cparm6 ||
      this.props.cmswhere !== prevProps.cmswhere ||
      this.props.resid !== prevProps.resid ||
      this.props.subresid !== prevProps.subresid ||
      this.props.dataMode !== prevProps.dataMode ||
      this.props.hostrecid !== prevProps.hostrecid
    ) {
      if (this.props.cparm1 !== prevProps.cparm1) {
        this.handleRefresh(true);
      } else {
        this.setState({ loading: true });
        await this.getData();
        this.setState({ loading: false });
      }
    }
  }

  getRowColorData = async () => {
    const { rowColorRules } = this.props;
    let rules;
    if (rowColorRules) {
      rules = rowColorRules;
    } else {
      let res;
      const { baseURL } = this.props;
      const httpParams = {};
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      try {
        res = await http(httpParams).getRowColorData({ id: this._id });
      } catch (err) {
        message.error(err.message);
        return;
      }
      rules = res.data;
    }
    const { dataSource } = this.state;
    const newDataSource = getWithRowColorDataSource(dataSource, rules);
    this.setState({ dataSource: newDataSource });
  };

  addEventListener = () => {
    this.cb = debounce(this.handleResize, 200);
    window.addEventListener('resize', this.cb);
  };

  handleResize = () => {
    this.getScrollXY();
  };

  getDataSource = () => {
    return this.state.dataSource;
  };

  initVariables = props => {
    const { dataMode, resid, subresid } = props || this.props;

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

    // 缓存已处理的高级查询中的自定义搜索所需要的窗体数据
    this._dealedAdvSearchFormData = null;

    // scroll = { x, y }
    this._x = 0;
    this._y = 0;

    // 后端返回的表格列数据
    this._columns = [];

    // 通过 getColumns() 得到的 columns 数据
    this._dealedColumns = [];
  };

  getData = async props => {
    const {
      hasBeBtns,
      hasAdd,
      hasModify,
      hasRowModify,
      hasRowView,
      hasRowEdit,
      storeWay,
      isUseFormDefine
    } = props || this.props;

    const { pagination } = this.state;
    let page, pageSize;
    if (pagination) {
      page = pagination.current;
      pageSize = pagination.pageSize;
    }
    await this.getTableData({ page, pageSize });

    // 存储方式为后端储存时，才请求后端按钮
    if (storeWay !== 'fe') {
      // 有后端定义按钮
      if (hasBeBtns) {
        await this.getBeBtns();
      }
    }

    if (!isUseFormDefine) {
      return;
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
      columnsWidth,
      actionBarWidth,
      width,
      height,
      subtractH,
      noColumn,
    } = this.props;
    const { rowSelection } = this.state;
    let columnsWidthKeys = [];
    let customWidth = 0;
    if (columnsWidth) {
      columnsWidthKeys = Object.keys(columnsWidth);
      columnsWidthKeys.forEach(key => {
        if (typeof columnsWidth[key] === 'number') {
          customWidth += columnsWidth[key];
        }
      });
    }

    this._dealedColumns.forEach(item => {
      if (!columnsWidthKeys.find(key => key === item.title)) {
        if (typeof item.width === 'number') {
          customWidth += item.width;
        }
      }
    });

    let x = customWidth;

    // 操作栏
    if (this.hasActionBar()) {
      x += actionBarWidth;
    }

    // rowSelection
    if (rowSelection) {
      x += 50;
    }

    if (noColumn.show) {
      x += noColumn.width || NO_COLUMN_WIDTH;
    }

    // 计算：this.boxW 和 this.boxH
    // ResizableBox 接收的 with 和 height 属性类型为 number
    // 所以，当 width 和 height 用的字符串类型时（百分比），需要转换一下
    if (this.tableDataRef) {
      // const parent = this.tableDataRef.parentNode;
      const parent = this.tableDataRef;
      this.boxW =
        typeof width === 'number'
          ? width
          : parent.clientWidth * percentString2decimal(width);
      this.boxH =
        typeof height === 'number'
          ? height
          : parent.clientHeight * percentString2decimal(height);
    }

    const scrollXY = { x, y: this.boxH - subtractH };

    this._x = x;
    this._y = y;

    const { hasModify, hasDelete, hasRowSelection } = this.props;
    let newRowSelection = null;
    if (rowSelection) {
      newRowSelection = getRowSelection(hasRowSelection, hasModify, hasDelete, {
        columnWidth: rowSelection.columnWidth,
        columnTitle: rowSelection.columnTitle,
        fixed: rowSelection.fixed,
        getCheckboxProps: rowSelection.getCheckboxProps,
        hideDefaultSelections: rowSelection.hideDefaultSelections,
        selectedRowKeys: rowSelection.selectedRowKeys,
        selections: rowSelection.selections,
        type: rowSelection.type,
        onChange: this.rowSelectionChange,
        onSelect: this.handleRowSelect,
        onSelectAll: this.handleRowSelectAll,
        onSelectInvert: this.handleRowSelectInvert
      });
    }
    this.setState({ scrollXY, rowSelection: newRowSelection });
  };

  dealTableDataFormData = (
    res,
    cachedFormDataKey = ['_dealedRowEditFormData', '_dealedRecordFormData']
  ) => {
    const { formProps } = this.props;

    // 获取和调用获取窗体定义数据（res.data.columns）相同的数据
    let resColumns = getResColumns(res.cmscolumninfo || []);
    const formData = dealControlArr(resColumns);

    this._recordFormData = formData;
    this._rowEditFormData = formData;

    // 缓存记录表单和行内编辑表单所接收的 data prop
    const recordFormIsClassifyLayout = formProps.displayMode === 'classify';
    const dealedFormData = formData && getDataProp(formData, {}, undefined, recordFormIsClassifyLayout);
    cachedFormDataKey.forEach(key => (this[key] = dealedFormData));
  };

  getTableData = async ({
    page = 1,
    pageSize = 10,
    key = this._searchValue,
    // cmswhere= this.props.cmswhere,
    sortOrder = this._sortOrder,
    sortField = this._sortField,
    isRefresh = false
  }) => {
    const {
      dataMode,
      resid,
      hostrecid,
      subresid,
      cmswhere,
      cmscolumns,
      storeWay,
      baseURL,
      dblinkname,
      cparm1,
      cparm2,
      cparm3,
      cparm4,
      cparm5,
      cparm6,
      lngMtsID,
      tableComponent,
      nullValueNotFetch
    } = this.props;

    let res;
    const mergedCmsWhere = getCmsWhere(cmswhere, this._cmsWhere);

    const httpParams = {};

    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }

    // 存储方式为后端存储
    if (storeWay !== 'fe') {
      try {
        // 获取主表数据
        if (dataMode === 'main') {
          const params = {
            resid,
            key,
            cmswhere:
              nullValueNotFetch && !mergedCmsWhere ? '1 = 2' : mergedCmsWhere,
            cmscolumns,
            pageindex:
              this._showAGgrid || tableComponent === 'ag-grid' ? 0 : page - 1,
            pagesize:
              this._showAGgrid || tableComponent === 'ag-grid'
                ? null
                : pageSize,
            sortOrder,
            sortField,
            getcolumninfo: 1, // 需要这个参数为 1，才能获取到字段信息
            dblinkname,
            cparm1,
            cparm2,
            cparm3,
            cparm4,
            cparm5,
            cparm6,
            lngMtsID
          };
          this.p3 = makeCancelable(http(httpParams).getTable(params));
          res = await this.p3.promise;

          // 获取子表数据
        } else {
          const params = {
            resid,
            subresid,
            hostrecid,
            key,
            cmswhere:
              nullValueNotFetch && !mergedCmsWhere ? '1 = 2' : mergedCmsWhere,
            cmscolumns,
            pageindex:
              this._showAGgrid || tableComponent === 'ag-grid' ? 0 : page - 1,
            pagesize:
              this._showAGgrid || tableComponent === 'ag-grid'
                ? null
                : pageSize,
            sortOrder,
            sortField,
            getcolumninfo: 1, // 需要这个参数为 1，才能获取到字段信息
            dblinkname,
            cparm1,
            cparm2,
            cparm3,
            cparm4,
            cparm5,
            cparm6,
            lngMtsID
          };
          this.p3 = makeCancelable(http(httpParams).getSubTable(params));
          res = await this.p3.promise;
        }
      } catch (err) {
        return console.error(err);
      }
    } else {
      // 存储方式为前端存储，则只获取表格列定义数据
      this.p3 = makeCancelable(
        http(httpParams).getTableColumnDefine({ resid: this._id, dblinkname })
      );
      try {
        res = await this.p3.promise;
      } catch (err) {
        return console.error(err);
      }
    }

    const {
      hasBeSort,
      defaultColumnWidth,
      columnsWidth,
      fixedColumns,
      hasRowEdit,
      isUseBESize,
      isUseFormDefine,
      isSetColumnWidth,
      hasAdvSearch,
      advSearch,
      noWidthFields,
      noWidthFieldsIndex
    } = this.props;

    const secondParams = {
      hasBeSort,
      defaultColumnWidth,
      columnsWidth,
      fixedColumns,
      locale: this.props.intl.locale
    };

    let dataSource = res.data;

    // 是否使用表格字段数据
    if (!isRefresh) {
      let isUseTableFieldsData = false, cachedKey = [];
      if (!isUseFormDefine || hasAdvSearch) {
        isUseTableFieldsData = true;
      }
      if (isUseTableFieldsData) {
        if (!isUseFormDefine) {
          cachedKey.push(...['_dealedRowEditFormData', '_dealedRecordFormData',]);
        }
        if (hasAdvSearch) {
          cachedKey.push(...['_dealedAdvSearchFormData',]);
        }
        this.dealTableDataFormData(res, cachedKey);
      }
    }

    if (storeWay === 'fe') {
      secondParams.hasBeSort = false;
      dataSource = [];
    }
    if (Array.isArray(res.ResourceData.AnalysisConfig)) {
      let config = [...res.ResourceData.AnalysisConfig];
      config = config.map(item => {
        return {
          ...item,
          baseURL: this.props.baseURL,
          resid: this.props.resid,
          cparm1: this.props.cparm1,
          cparm2: this.props.cparm2,
          cmswhere: item.cmswhere ? this.props.cmswhere : '',
          keyValue: item.key ? this.props.key : ''
        };
      });
      this.setState({ gridProps: config });
    } else {
      // console.error('该配置未设成数组');
    }

    let _noWidthFields;
    if (Array.isArray(noWidthFields)) {
      _noWidthFields = noWidthFields;
    } else if (typeof noWidthFields === 'string') {
      _noWidthFields = [noWidthFields];
    }
    let _noWidthFieldsIndex;
    if (Array.isArray(noWidthFieldsIndex)) {
      _noWidthFieldsIndex = noWidthFieldsIndex;
    } else if (typeof noWidthFieldsIndex === 'number') {
      _noWidthFieldsIndex = [noWidthFieldsIndex];
    }

    let columns = this.state.columns, components = this.state.components;
    // 列数据已存在时，不再去计算得到 columns
    if (!this.state.columns.length) {
      const result = getColumns(
        res.cmscolumninfo,
        secondParams,
        cmscolumns,
        hasRowEdit,
        isUseBESize,
        isSetColumnWidth,
        _noWidthFields,
        _noWidthFieldsIndex,
      );
      columns = result.columns;
      components = result.components;
    }
    this._dealedColumns = columns;

    this.setState({ originalColumn: res.cmscolumninfo });

    const state = {
      columns,
      dataSource: this.props.recordsMap ? this.props.recordsMap(dataSource) : dataSource,
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

    // 没有返回 ResourceData，报错
    if (!res.ResourceData) {
      return message.error(
        '后端未返回 ResourceData 参数（用于确定前端按钮是否有显示的权限）'
      );
    }

    // 前端按钮是否有显示的权限
    this.setUpBtnAuth(res.ResourceData);

    // 保存列数据
    this._columns = [...res.cmscolumninfo];

    this.setState(state);
  };

  setUpBtnAuth = ({
    hasAdd,
    hasAdvSearch,
    hasBeBtns,
    hasDelete,
    hasDownload,
    hasImport,
    hasModify,
    hasRefresh,
    hasRowDelete,
    hasRowModify,
    hasRowView,
    hasSearch
  }) => {
    this._hasAdd = hasAdd;
    this._hasAdvSearch = hasAdvSearch;
    this._hasBeBtns = hasBeBtns;
    this._hasDelete = hasDelete;
    this._hasDownload = hasDownload;
    this._hasImport = hasImport;
    this._hasModify = hasModify;
    this._hasRefresh = hasRefresh;
    this._hasRowDelete = hasRowDelete;
    this._hasRowModify = hasRowModify;
    this._hasRowView = hasRowView;
    this._hasSearch = hasSearch;
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
      formProps,
      baseURL,
      dblinkname
    } = this.props;
    const id = this._id;
    let arr,
      pArr = [];
    if (isNeedRecordForm) {
      pArr.push(httpGetFormData(id, recordFormName, baseURL, dblinkname));
    }
    if (isNeedEditForm) {
      pArr.push(httpGetFormData(id, rowEditFormName, baseURL, dblinkname));
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
      getDataProp(
        this._recordFormData,
        {},
        undefined,
        recordFormIsClassifyLayout
      );
    this._dealedRowEditFormData =
      rowEditFormData && getDataProp(this._rowEditFormData, {});
    this.forceUpdate();
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
    const { httpGetBeBtns, baseURL, dblinkname, hideBebtns = {} } = this.props;
    const id = this._id;
    let btns = {};
    try {
      btns = await httpGetBeBtns(id, baseURL, dblinkname, hideBebtns);
    } catch (err) {
      return console.error(err);
    }

    const { beBtnsMultiple = [], beBtnsSingle = [], beBtnsOther = [] } =
      btns || {};

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
    const { rowSelection } = this.props;
    rowSelection &&
      rowSelection.onChange &&
      rowSelection.onChange(selectedRowKeys);
  };

  handleRowSelect = (record, selected, selectedRows, nativeEvent) => {
    const { rowSelection } = this.props;
    rowSelection &&
      rowSelection.onSelect &&
      rowSelection.onSelect(record, selected, selectedRows, nativeEvent);
  };

  handleRowSelectAll = (selected, selectedRows, changeRows) => {
    const { rowSelection } = this.props;
    rowSelection &&
      rowSelection.onSelectAll &&
      rowSelection.onSelectAll(selected, selectedRows, changeRows);
  };

  handleRowSelectInvert = selectedRows => {
    const { rowSelection } = this.props;
    rowSelection &&
      rowSelection.onSelectInvert &&
      rowSelection.onSelectInvert(selectedRows);
  };

  handlePageChange = async (page, pageSize) => {
    this.setState({ loading: true });
    await this.getTableData({ page, pageSize });
    this.setState({ loading: false });
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
      customRowBtns,
      hasRowEdit
    } = this.props;
    return !!(
      hasRowDelete ||
      hasRowModify ||
      hasRowView ||
      beBtnsSingle.length ||
      renderRowBtns ||
      !!customRowBtns ||
      hasRowEdit
    );
  };

  hasRowSelection = beBtnsMultiple => {
    const { hasModify, hasDelete, hasRowSelection } = this.props;
    return hasRowSelection || !!beBtnsMultiple.length || hasModify || hasDelete;
  };

  // 搜索
  _searchValue = '';
  handleSearch = async value => {
    this._searchValue = value;
    this.setState({ loading: true });
    await this.getTableData({
      page: 1,
      pageSize: this.state.pagination.pageSize
    });
    this.setState({ loading: false });
  };

  // 搜索的值改变
  onSearchChange = value => {
    this._searchValue = value;
  };

  handleExcelChange = (records) => {
    const { dataMode, closeImportView, importConfig } = this.props;
    const { saveFE = false } = importConfig;

    if (dataMode === 'sub' && saveFE) {
      if (Array.isArray(records) && records.length) {
        closeImportView && closeImportView();
        message.success('导入成功');
        const dataSource = [...records];
        return this.setState({ dataSource });
      }
      message.error('文件中无记录');
    }
  }

  // 导入
  handleImport = () => {
    const { openImportView, baseURL, importConfig, dblinkname } = this.props;
    const url = baseURL || window.pwConfig[process.env.NODE_ENV].baseURL;

    const { mode = 'be', containerType = 'drawer', saveState = 'editoradd', containerProps = {}, saveFE = false } = importConfig;

    let disabledSave = false;
    if (saveFE) {
      disabledSave = true;
    }

    openImportView &&
      openImportView(
        dblinkname,
        url,
        this._id,
        mode,
        containerType,
        saveState,
        containerProps,
        null,
        {},
        {},
        false,
        null,
        null,
        disabledSave,
        this.handleExcelChange
      );
  };

  /**
   * 下载 excel 表格数据
   * @param {array} downloadColumns 指定下载的列
   */
  handleDownload = async (downloadColumns = []) => {
    this.setState({ loading: true });
    const {
      title,
      downloadFileName,
      downloadFile,
      cmswhere,
      baseURL,
      downloadBaseURL,
      dblinkname,
      dataMode,
      cparm1 = '',
      cparm2 = '',
      cparm3 = '',
      cparm4 = '',
      cparm5 = '',
      cparm6 = ''
    } = this.props;
    let fileType = this.props.fileType;
    let fileDownloadConfig =
      window.pwConfig[process.env.NODE_ENV].fileDownloadConfig[this._id];
    if (fileDownloadConfig && fileDownloadConfig.fileType) {
      fileType = fileDownloadConfig.fileType;
    }
    const mergedCmsWhere = getCmsWhere(cmswhere, this._cmsWhere);

    // 请求文件下载地址的基地址
    const requestBaseURL =
      baseURL || window.pwConfig[process.env.NODE_ENV].baseURL;

    // 下载文件的基地址
    const downloadBaseURL_ =
      downloadBaseURL || window.pwConfig[process.env.NODE_ENV].fileDownloadUrl;

    let hostresid = this.props.resid;
    let hostrecid = this.props.hostrecid;

    if (dataMode === 'main') {
      hostresid = '';

      hostrecid = '';
    }

    await downloadFile(
      requestBaseURL,
      downloadBaseURL_,
      downloadFileName || title,
      this._id,
      hostresid,
      hostrecid,
      mergedCmsWhere,
      fileType,
      dblinkname,
      cparm1,
      cparm2,
      cparm3,
      cparm4,
      cparm5,
      cparm6,
      this._searchValue,
      downloadColumns
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

  // 渲染在头部的后端按钮
  renderBeBtns = () => {
    const { beBtnsMultiple, beBtnsOther } = this.state;
    const { size, formProps, baseURL, backendButtonPopConfirmProps, intl: { locale } } = this.props;
    const id = this._id;
    const arr = [...beBtnsMultiple, ...beBtnsOther];
    const records = this.getSelectedRecords();
    const recordFormDisplayMode =
      (formProps && formProps.displayMode) || 'default';
    return arr.map(btnInfo => (
      <LzBackendBtn
        baseURL={baseURL}
        backendBtnType="multiple"
        key={btnInfo.Name1}
        btnInfo={{ ...btnInfo }}
        resid={id}
        recordFormDisplayMode={recordFormDisplayMode}
        onConfirm={(
          backendBtnType,
          type,
          records,
          controlData,
          defaultRecord,
          recordFormData,
          baseURL,
          iframeURL
        ) => {
          this.setState({ recordFormShowMode: '' }, () => {
            this.beBtnConfirm(
              backendBtnType,
              type,
              records,
              controlData,
              defaultRecord,
              recordFormData,
              baseURL,
              iframeURL,
              locale == 'en' ? btnInfo.Name2 : btnInfo.Name1
            );
          });
        }}
        records={records}
        size={size}
        popConfirmProps={backendButtonPopConfirmProps}
      />
    ));
  };

  // 渲染行后端按钮
  renderRowBeBtns = (beBtnsSingle, record) => {
    const { size, formProps, baseURL, intl: { locale } } = this.props;
    const id = this._id;

    return beBtnsSingle.map(btnInfo => (
      <LzBackendBtn
        baseURL={baseURL}
        backendBtnType="single"
        key={btnInfo.Name1}
        btnInfo={btnInfo}
        resid={id}
        recordFormDisplayMode={
          (formProps && formProps.displayMode) || 'default'
        }
        onConfirm={(
          backendBtnType,
          type,
          records,
          controlData,
          defaultRecord,
          recordFormData,
          baseURL,
          iframeURL
        ) => {
          this.setState(
            { selectedRecord: record, recordFormShowMode: '' },
            () => {
              this.beBtnConfirm(
                backendBtnType,
                type,
                records,
                controlData,
                defaultRecord,
                recordFormData,
                baseURL,
                iframeURL,
                locale == 'en' ? btnInfo.Name2 : btnInfo.Name1
              );
            }
          );
        }}
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
    const { selectedRowKeys = [] } = rowSelection;
    dataSource.forEach(record => {
      const result = selectedRowKeys.some(key => key === record.REC_ID);
      if (result) {
        records.push(record);
      }
    });
    return records;
  };

  getTitle = () => {
    const {
      intl,
      addText,
      enAddText,
      modifyText,
      enModifyText,
      viewText,
      enViewText
    } = this.props;
    const { recordFormShowMode } = this.state;
    let title = '';
    // 中文记录表单标题
    if (intl.locale === 'zh') {
      switch (recordFormShowMode) {
        case 'add':
          title = addText;
          break;
        case 'modify':
          title = modifyText;
          break;
        case 'view':
          title = viewText;
        default:
          title = '';
      }
    } else {
      switch (recordFormShowMode) {
        case 'add':
          title = enAddText;
          break;
        case 'modify':
          title = enModifyText;
          break;
        case 'view':
          title = enViewText;
        default:
          title = '';
      }
    }
    return title;
  };

  /**
   * 打开记录表单，进行 添加/修改/查看 操作
   * @param {string} backendBtnType 后端按钮类型：'single' 行后端按钮；'multiple' 表格头部的后端按钮
   * @param {string} operation 操作：'add' 添加 | 'modify' 修改 | 'view' 查看
   * @param {object} record 记录
   * @param {object} data 控件数据
   * 当传参数时，表示点击 “后端按钮” 打开记录表单
   * 不传参数时，表示点击 “前端定义的按钮” 打开记录表单
   */
  openRecordForm = (
    backendBtnType,
    operation,
    record,
    data,
    recordFormData,
    title
  ) => {
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
      subTableArrProps,
      storeWay,
      recordFormUseAbsolute,
      baseURL,
      formDataProps,
      uploadConfig,
      mediaFieldBaseURL,
      beforeSaveConfig,
      labelRequiredList,
      recordFormHideFields,
      recordFormHideLables,
      saveRecordAndSubTablesApiExtraParams,
    } = this.props;

    const { recordFormShowMode, selectedRecord } = this.state;
    const {
      intl,
      recordFormFormWidth,
      recordFormTabsWidth,
      dblinkname
    } = this.props;

    // 点击前端按钮时
    if (!backendBtnType) {
      if (!this._recordFormData || !this._dealedRecordFormData) {
        return message.info('正在请求窗体数据，请稍等...');
      }
    }

    const newOperation = operation || recordFormShowMode;

    let newRecord;
    if (operation === 'add') {
      newRecord = record;
    } else {
      newRecord = selectedRecord;
    }

    let newData = data || this._dealedRecordFormData;
    const isTransformValue = ['add', 'modify'].indexOf(newOperation) !== -1;

    const isClassifyLayout = this.props.formProps.displayMode === 'classify';

    newData = setDataInitialValue(
      newData,
      newRecord,
      isTransformValue,
      isClassifyLayout
    );

    const { subTableArr } = recordFormData || this._recordFormData;

    const _title = title || this.getTitle();

    let newHostRecid = hostrecid;
    if (backendBtnType === 'single') {
      newHostRecid = record.REC_ID;
    }
    const className = 'table-data-form';
    openRecordForm({
      type: recordFormType,
      title: _title,
      formProps:
        recordFormType === 'modal'
          ? {
            ...formProps,
            className
          }
          : formProps,
      data: newData,
      operation: newOperation,
      record: newRecord,
      info: { dataMode, resid, subresid, hostrecid: newHostRecid },
      beforeSaveFields,
      AdvDicTableProps,
      recordFormContainerProps,
      subTableArr,
      subTableArrProps,
      recordFormFormWidth,
      recordFormTabsWidth,
      storeWay,
      onSuccess: this.handleSuccess,
      onCancel: this.handleCancel,
      onReopenSaveSuccess: this.handleReopenSaveSuccess,
      dblinkname,
      useAbsolute: recordFormUseAbsolute,
      baseURL,
      formDataProps,
      uploadConfig,
      mediaFieldBaseURL,
      beforeSaveConfig,
      labelRequiredList,
      recordFormHideFields,
      recordFormHideLables,
      saveRecordAndSubTablesApiExtraParams,
    });
  };

  rowEditRecId = -1;

  // 触发行内编辑的方式：'rowEdit' 点行内编辑触发 | 'add' 点添加触发
  triggerRowEditType = '';

  // 点击添加按钮
  handleAdd = () => {
    const { hasRowEdit, hasRowEditAdd, rowEditAddPosition, defaultAddRecord } = this.props;
    if (!hasRowEdit || !hasRowEditAdd) {
      return this.setState(
        {
          recordFormShowMode: 'add',
          selectedRecord: {}
        },
        () => {
          this.openRecordForm("multiple", 'add', defaultAddRecord || {});
        }
      );
    }

    // 行内编辑添加
    const { dataSource, originalColumn } = this.state;
    const nullRecord = {
      REC_ID: this.rowEditRecId--
    };
    originalColumn.forEach(item => {
      nullRecord[item.id] = null;
    });

    let newDataSource;
    if (rowEditAddPosition === 'start') {
      newDataSource = [nullRecord, ...dataSource];
    } else {
      newDataSource = [...dataSource, nullRecord];
    }
    this.triggerRowEditType = 'add';
    this.setState({
      dataSource: newDataSource,
      editingKey: nullRecord.REC_ID
    });
    setTimeout(() => {
      this.forceUpdate();
    })
  };

  handleRowEdit = record => {
    this.triggerRowEditType = 'rowEdit';
    this.setState({
      editingKey: record.REC_ID
    });
  };

  handleRowSave = (form, oldRecord) => {
    const { hasRowEdit, storeWay } = this.props;
    const { validateFields } = form;
    validateFields(async (err, values) => {
      if (err) {
        return;
      }

      const {
        dataMode,
        resid,
        subresid,
        baseURL,
        dblinkname,
        hostrecid
      } = this.props;
      const id = getResid(dataMode, resid, subresid);
      const formData = dealFormData(values);
      formData.REC_ID = oldRecord.REC_ID;

      const httpParams = {};
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }

      if (storeWay === 'fe') {
        const dataSource = [...this.state.dataSource];
        const index = dataSource.findIndex(
          item => item.REC_ID === formData.REC_ID
        );
        dataSource.splice(index, 1, { ...formData });

        // 保存到前端
        return this.setState({ editingKey: null, dataSource });
      }
      this.setState({ loading: true });

      // 保存到后端
      // 添加记录
      let params = {};
      if (dataMode === 'sub') {
        params.hostresid = resid;
        params.hostrecid = hostrecid;
      }
      if (this.triggerRowEditType === 'add') {
        this.p2 = makeCancelable(
          http(httpParams).addRecords({
            resid: id,
            data: [formData],
            dblinkname,
            ...params
          })
        );
      } else {
        // 编辑存在的记录
        this.p2 = makeCancelable(
          http(httpParams).modifyRecords({
            resid: id,
            data: [formData],
            dblinkname,
            ...params
          })
        );
      }

      try {
        await this.p2.promise;
      } catch (err) {
        console.error(err);
        this.setState({ loading: false });
        return message.error(err.message);
      }

      if (hasRowEdit && this.triggerRowEditType === 'add') {
        message.success('添加成功');
      } else {
        message.success('修改成功');
      }
      this.triggerRowEditType = '';
      this.setState({ editingKey: null, loading: false });
      this.handleRefresh();
    });
  };

  handleRowCancel = () => {
    const { rowEditAddPosition } = this.props;
    const dataSource = [...this.state.dataSource];
    if (this.triggerRowEditType === 'rowEdit') {
      return this.setState({ editingKey: null });
    }
    if (rowEditAddPosition === 'start') {
      dataSource.shift();
    } else {
      dataSource.pop();
    }
    this.setState({ editingKey: null, dataSource });
  };

  handleModify = record => {
    const { intl } = this.props;
    let selectedRecord = record;
    if (!selectedRecord) {
      const { selectedRowKeys } = this.state.rowSelection;
      if (!selectedRowKeys || selectedRowKeys.length !== 1) {
        return message.error(intl.messages['TableData.pleaseSelectARecord']);
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
    const { intl, storeWay, baseURL, dblinkname } = this.props;
    const { selectedRowKeys } = this.state.rowSelection;
    if (!Array.isArray(selectedRowKeys) || !selectedRowKeys.length) {
      return message.error(intl.messages['TableData.pleaseSelectARecord']);
    }
    const { dataSource } = this.state;
    const records = [];
    dataSource.forEach(record => {
      if (selectedRowKeys.indexOf(record.REC_ID) !== -1) {
        records.push(record);
      }
    });

    const httpParams = {};
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }

    // 后端存储，则发送请求删除记录
    if (storeWay === 'be') {
      const id = this._id;
      this.p4 = makeCancelable(
        http(httpParams).removeRecords({
          resid: id,
          data: records,
          dblinkname
        })
      );
      try {
        await this.p4.promise;
      } catch (err) {
        return console.error(err);
      }
      // 刷新表格数据
      this.handleRefresh();

      // 前端存储，则只修改 dataSource
    } else {
      const newDataSource = [...dataSource];
      newDataSource.forEach(record => {
        const index = records.findIndex(item => record.REC_ID === item.REC_ID);
        if (index !== -1) {
          newDataSource.splice(index, 1);
        }
      });
      this.setState({ dataSource: newDataSource });
    }

    message.success(intl.messages['common.deleteSuccess']);

    // 清除 selectedRowKeys
    if (this.state.rowSelection) {
      this.setState({
        rowSelection: { ...this.state.rowSelection, selectedRowKeys: [] }
      });
    }
  };

  handlePasteEnd = async data => {
    try {
      await http().modifyRecords({
        resid: this.props.resid,
        data
      });
      return true;
    } catch (error) {
      message.error(error.message);
      console.error(error);
      return false;
    }
  };

  handleOnRow = record => {
    return {
      onClick: () => {
        this.setState({ clickedRowId: record.REC_ID });
        this.props.onRowClick && this.props.onRowClick(record);
      }, // 点击行
      onMouseEnter: () => { } // 鼠标移入行
    };
  };

  handleRowClassName = (record, index) => {
    const { clickedRowId } = this.state;
    if (clickedRowId === record.REC_ID) {
      return 'table-data__row--clicked';
    }
    return ''
  }

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
    await this.getTableData({ ...obj, isRefresh: true });
    this.setState({
      loading: false,
      rowSelection: this.state.rowSelection
        ? { ...this.state.rowSelection, selectedRowKeys: [] }
        : null
    });
  };

  handleAdvSearch = () => {
    const { openAdvSearch, advSearch, baseURL, dblinkname } = this.props;
    const id = this._id;
    const {
      searchComponent = 'both',
      containerType = 'drawer',
      containerProps,
      formName = 'default',
      formProps,
      validationFields = [],
      isUseTableFields = true,
      fields = [],
      isRequestFormData = true
    } = advSearch;

    let newFields = [];
    if (isUseTableFields) {
      newFields = this._columns.map(col => ({
        label: col.text,
        value: col.id,
        control: 'Input'
      }));
    }
    if (Array.isArray(fields)) {
      newFields = [...newFields, ...fields];
    }

    let recordFormData;
    if (!isRequestFormData) {
      if (!this._dealedAdvSearchFormData) {
        return message.info('正在请求数据，请稍后再试');
      }
      recordFormData = this._dealedAdvSearchFormData;
    }

    // 打开高级搜索
    openAdvSearch(
      searchComponent,
      containerType,
      id,
      formName,
      validationFields,
      this.getCmsWhere,
      containerProps,
      formProps,
      newFields,
      baseURL,
      dblinkname,
      recordFormData
    );
  };

  handleStatisticalAnalysis = () => {
    this.setState({ isShowGrid: !this.state.isShowGrid });
  };

  handleZoomIn = () => {
    // this.props.hasResizeableBox || this.props.zoomIn();
    this.setState({ zoomStatus: 1 }, this.handleResize);
  };

  handleZoomOut = () => {
    // this.props.hasResizeableBox || this.props.zoomOut();
    this.setState({ zoomStatus: 0 }, this.handleResize);
  };

  // 固定列
  handleFixedColumns = (fixedColumns) => {
    const { columns } = this.state;
    const newColumns = [];

    columns.forEach(column => {
      if (column.dataIndex !== '操作') {
        if (fixedColumns.length) {
          let flag = false;
          fixedColumns.forEach(fixedColumn => {
            if (column.fieldName === fixedColumn) {
              column.fixed = 'left';
              newColumns.push(column);
              flag = true;
            }
          });
          if (!flag) {
            delete column.fixed;
          }
        } else {
          delete column.fixed;
        }
      }
    });

    // 将非固定的列推入 newColumns 中
    columns.forEach(column => {
      if (!column.fixed) {
        newColumns.push(column);
      }
    })

    this.setState({ columns: newColumns });
    message.success('固定列成功！');
  }

  _cmsWhere = '';
  getCmsWhere = (cmsWhere, isAdvSearch, isRefreshTable = true) => {
    console.log({ isRefreshTable })
    if (isAdvSearch) {
      this._cmsWhere = cmsWhere;
    } else {
      this._cmsWhere = accurate2fuzzy(cmsWhere);
    }
    isRefreshTable && this.handleRefresh(true);
  };

  beBtnConfirm = (
    backendBtnType,
    type,
    records,
    controlData,
    defaultRecord,
    recordFormData,
    baseURL,
    iframeURL,
    title
  ) => {
    if (type === 1 || type === 5) {
      this.handleRefresh();
      // 编辑记录
    } else if (type === 4 || type === 3) {
      this.props.openModalOrDrawer(
        'modal',
        {
          width: '90%',
          onCancel: this.props.closeModalOrDrawer,
          onOk: this.props.closeModalOrDrawer,
          footer: null
        },
        () => (
          <div style={{ height: '80vh' }}>
            <iframe
              title="iframe"
              src={records.length ? `${iframeURL}&mnurecid=${records[0].REC_ID}&timeid=${records[0].REC_ID}` : iframeURL}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          </div>
        )
      );
    } else if (type === 6) {
      this.openRecordForm(
        backendBtnType,
        'modify',
        defaultRecord,
        controlData,
        recordFormData,
        title
      );
      // 查看记录
    } else if (type === 7) {
      this.openRecordForm(
        backendBtnType,
        'view',
        records[0],
        controlData,
        recordFormData,
        title
      );
      // 添加记录
    } else if (type === 8) {
      this.openRecordForm(
        backendBtnType,
        'add',
        defaultRecord,
        controlData,
        recordFormData,
        title
      );
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
    const ret = data.find(dataItem => dataItem.id === dataIndex);
    return ret;
  };

  getNoColumn = () => {
    const { current, pageSize } = this.state.pagination;
    const { noColumn, intl } = this.props;
    const { enText = NO_COLUMN_EN_TEXT, cnText = NO_COLUMN_CN_TEXT, width = NO_COLUMN_WIDTH } = noColumn;
    return {
      title: getIntlVal(intl.locale, enText, cnText),
      dataIndex: '序号',
      align: 'center',
      width: width,
      render: (value, record, index) => {
        const no = (current - 1) * pageSize + (index + 1);
        return <span>{no}</span>
      }
    }
  }

  getNewColumns = columns => {
    const { hasRowEdit, isUseBESize, rowColorConfig, baseURL, noColumn } = this.props;
    let newColumns = [...columns];
    if (noColumn && noColumn.show) {
      newColumns.unshift(this.getNoColumn());
    }

    // 行内编辑
    if (hasRowEdit) {
      newColumns = newColumns.map(column => {
        if (!column.editable) {
          return column;
        }
        const newColumn = { ...column };
        const ret = {
          ...column,
          onCell: (record, index) => {
            const isEditing = this.isEditing(record);
            const ret = {
              record,
              title: newColumn.title,
              dataIndex: newColumn.dataIndex,
              index,
              editing: isEditing,
              fieldName: newColumn.fieldName,
              dataItem: this.getDataItem(record, newColumn.dataIndex),
              baseURL
            };
            if (isUseBESize && isEditing) {
              ret.height = newColumn._editHeight
                ? newColumn._editHeight
                : undefined;
            }
            return ret;
          }
        };
        // 行内编辑列的宽度
        if (isUseBESize && this.state.editingKey) {
          ret.width = newColumn._editWidth
            ? newColumn._editWidth
            : newColumn.width;
        }
        return ret;
      });
    }

    if (rowColorConfig) {
      newColumns.forEach(item => {
        item.render = (text, record, rowIndex) => {
          const rowColor = record._rowColor;
          if (rowColor) {
            const style = {};
            if (rowColorConfig.position === 'bg') {
              style.backgroundColor = rowColor;
            } else {
              style.color = rowColor;
            }
            return <div style={style}>{text}</div>;
          }
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
        <FM id="common.Edit" defaultMessage="编辑" />
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
            <FM id="common.Save" defaultMessage="保存" />
          </Button>
        )}
      </EditableContext.Consumer>
    );
  };

  renderRowCancelBtn = record => {
    return (
      <ButtonWithConfirm
        popConfirmProps={{
          title: (
            <FM
              id="TableData.sureCancelEdit"
              defaultMessage="您确定要取消编辑吗？"
            />
          ),
          onConfirm: () => this.handleRowCancel()
        }}
        buttonProps={{
          type: 'danger',
          size: btnSizeMap[this.props.size],
          className: 'table-data__action-btn'
        }}
      >
        <FM id="common.Cancel" defaultMessage="取消" />
      </ButtonWithConfirm>
    );
  };

  renderRowModifyBtn = record => {
    const { intl, rowModifyText, enRowModifyText } = this.props;
    return (
      <Button
        size={btnSizeMap[this.props.size]}
        onClick={() => this.handleModify(record)}
        className="table-data__action-btn"
      >
        {getIntlVal(intl.locale, enRowModifyText, rowModifyText)}
      </Button>
    );
  };

  renderRowViewBtn = record => {
    const { intl, rowViewText, enRowViewText } = this.props;
    return (
      <Button
        size={btnSizeMap[this.props.size]}
        onClick={() => this.handleView(record)}
        className="table-data__action-btn"
      >
        {getIntlVal(intl.locale, enRowViewText, rowViewText)}
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
    const { intl, rowDeleteText, enRowDeleteText } = this.props;

    return (
      <ButtonWithConfirm
        popConfirmProps={{
          title: (
            <FM id="common.sureDelete" defaultMessage="您确定要删除吗？" />
          ),
          onConfirm: () => this.handleRowDelete(record)
        }}
        buttonProps={{
          type: 'danger',
          size: btnSizeMap[this.props.size],
          className: 'table-data__action-btn'
        }}
      >
        {getIntlVal(intl.locale, enRowDeleteText, rowDeleteText)}
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

  handleRowDelete = async record => {
    const { intl, storeWay, baseURL, dblinkname } = this.props;

    const httpParams = {};

    if (baseURL) {
      httpParams.baseURL = baseURL;
    }

    // 后端存储，发送删除行请求
    if (storeWay === 'be') {
      const id = this._id;
      this.p4 = makeCancelable(
        http(httpParams).removeRecords({
          resid: id,
          data: [record],
          dblinkname
        })
      );
      try {
        await this.p4.promise;
      } catch (err) {
        return console.error(err);
      }
      // 刷新表格数据
      this.handleRefresh();

      // 前端存储，只修改 dataSource
    } else {
      const { dataSource } = this.state;
      const index = dataSource.findIndex(
        reocrdItem => reocrdItem.REC_ID === record.REC_ID
      );
      const newDataSource = [...dataSource];
      newDataSource.splice(index, 1);
      this.setState({ dataSource: newDataSource });
    }

    message.success(intl.messages['common.deleteSuccess']);

    // 清除 selectedRowKeys
    this.setState({
      rowSelection: { ...this.state.rowSelection, selectedRowKeys: [] }
    });
  };

  renderMessage = _message => {
    const { successMessageComponent } = this.props;
    const messageComponent = getSuccessMessageComponent(
      successMessageComponent
    );

    if (messageComponent.name === 'message') {
      message.success(_message);
    } else {
      delete messageComponent.name;
      Modal.success({
        title: _message,
        ...messageComponent
      });
    }
  };

  handleSuccess = (operation, formData, record, form) => {
    this.props.closeRecordForm();
    const { intl, storeWay } = this.props;
    if (operation === 'add') {
      this.renderMessage(intl.messages['common.addSuccess']);
    } else if (operation === 'modify') {
      this.renderMessage(intl.messages['common.modifySuccess']);
    }
    // 后端存储，则刷新表格数据
    if (storeWay === 'be') {
      // 添加成功时
      if (operation === 'add') {
        const { whereRefreshWhenAdd } = this.props;
        if (whereRefreshWhenAdd === 'start') {
          this.handleRefresh(true);
        } else if (whereRefreshWhenAdd === 'end') {
          const { total, pageSize } = this.state.pagination;
          const getCurrent = () => {
            return Math.ceil((total + 1) / pageSize);
          };
          this.setState(
            {
              pagination: {
                ...this.state.pagination,
                current: getCurrent(),
                total: total + 1
              }
            },
            () => {
              this.handleRefresh();
            }
          );
        } else {
          this.handleRefresh();
        }
      } else {
        this.handleRefresh();
      }
      // 前端存储，则修改 dataSource
    } else {
      this.handleDealDataSource(operation, formData, record);
    }
  };
  handleReopenSaveSuccess = (operation, formData, record, form) => {
    this.props.closeRecordForm();
    const { intl, storeWay } = this.props;
    if (operation === 'add') {
      message.success(intl.messages['common.addSuccess']);
    } else if (operation === 'modify') {
      message.success(intl.messages['common.modifySuccess']);
    }
    // 后端存储，则刷新表格数据
    if (storeWay === 'be') {
      this.handleRefresh();

      // 前端存储，则修改 dataSource
    } else {
      this.handleDealDataSource(operation, formData, record);
    }
    setTimeout(() => {
      this.handleAdd();
    }, 500);
  };

  handleDealDataSource = (operation, formData, record) => {
    const { dataSource } = this.state;
    // 添加
    if (operation === 'add') {
      this.setState({
        dataSource: [...dataSource, { ...formData, REC_ID: dataSource.length }]
      });

      // 修改
    } else if (operation === 'modify') {
      const newDataSource = [...dataSource];
      const index = newDataSource.findIndex(
        recordItem => recordItem.REC_ID === record.REC_ID
      );
      newDataSource.splice(index, 1, { ...formData });
      this.setState({ dataSource: newDataSource });
    }
  };

  handleCancel = () => {
    this.props.closeRecordForm();
  };

  getAggridSelectedRows = () => {
    return this.gridApi.getSelectedRows();
  };

  getActionBar = () => {
    const actionBar = {
      title: <FM id="common.operation" defaultMessage="操作" />,
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
          hasCustomRowBtns = !!customRowBtns,
          _hasRowEdit = hasRowEdit,
          _hasRowModify = hasRowModify && this._hasRowModify,
          _hasRowDelete = hasRowDelete && this._hasRowDelete,
          _hasRowView = hasRowView && this._hasRowView;
        if (hasRowEdit) {
          hasRowSaveCancel = record.REC_ID === editingKey;
          _hasRowEdit = hasRowEdit && !hasRowSaveCancel;
          _hasRowModify = _hasRowModify && !hasRowSaveCancel;
          _hasRowView = _hasRowView && !hasRowSaveCancel;
          _hasRowDelete = _hasRowDelete && !hasRowSaveCancel;
          hasRowBeBtns = hasRowBeBtns && !hasRowSaveCancel;
          hasCustomRowBtns = hasCustomRowBtns && !hasRowSaveCancel;
        }

        return (
          <Fragment>
            {_hasRowEdit && this.renderRowEditBtn(record)}

            {hasRowSaveCancel && this.renderRowSaveBtn(record)}
            {hasRowSaveCancel && this.renderRowCancelBtn(record)}

            {_hasRowModify && this.renderRowModifyBtn(record)}
            {_hasRowView && this.renderRowViewBtn(record)}
            {_hasRowDelete && this.renderRowDeleteBtn(record)}

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
    if (
      this.props.actionBarFixed &&
      this.tableDataRef &&
      this._x + 32 >= this.tableDataRef.clientWidth
    ) {
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
      hasSearch,
      hasZoomInOut,
      importConfig,
      bordered,
      actionBarExtra,
      actionBarExtraAg,
      headerExtra,
      rowSelectionAg,
      sideBarAg,
      afterSaveRefresh,
      afterSaveCallback,
      onAgGridSelectionChanged
    } = this.props;

    const {
      pagination,
      dataSource,
      columns,
      rowSelection,
      scrollXY,
      components,
      editingKey,
      gridProps,
      isShowGrid,
      zoomStatus,
      originalColumn
    } = this.state;
    const newColumns = this.getNewColumns(columns);

    const {
      addText,
      enAddText,
      modifyText,
      enModifyText,
      tableComponent
    } = this.props;
    if (this._showAGgrid || tableComponent === 'ag-grid') {
      return (
        <PwAggird
          title={title}
          onReady={gridApi => {
            this.gridApi = gridApi;
          }}
          onAgGridSelectionChanged={onAgGridSelectionChanged}
          afterSaveRefresh={afterSaveRefresh}
          afterSaveCallback={afterSaveCallback}
          originalColumn={originalColumn}
          hasZoomInOut={hasZoomInOut}
          zoomStatus={zoomStatus}
          editingKey={editingKey}
          components={components}
          pagination={pagination}
          dataSource={dataSource}
          onPasteEnd={this.handlePasteEnd}
          scroll={scrollXY}
          sideBarAg={sideBarAg}
          hasAdd={hasAdd && this._hasAdd}
          hasModify={hasModify && this._hasModify}
          hasDelete={hasDelete && this._hasDelete}
          onAdd={this.handleAdd}
          onModify={this.handleModify}
          onDelete={this.handleDelete}
          onSearch={this.handleSearch}
          onImport={this.handleImport}
          onDownload={this.handleDownload}
          onSearchChange={v => {
            this.onSearchChange(v);
          }}
          onChange={this.handleTableChange}
          renderOtherBtns={this.renderBeBtns}
          rowSelection={rowSelection}
          onRow={this.handleOnRow}
          onRefresh={this.handleRefresh}
          size={size}
          hasImport={importConfig && this._hasImport}
          hasDownload={hasDownload && this._hasDownload}
          hasRefresh={hasRefresh && this._hasRefresh}
          onAdvSearch={this.handleAdvSearch}
          onStatisticalAnalysis={this.handleStatisticalAnalysis}
          hasAdvSearch={hasAdvSearch && this._hasAdvSearch}
          hasSearch={hasSearch && this._hasSearch}
          onZoomIn={this.handleZoomIn}
          onZoomOut={this.handleZoomOut}
          bordered={bordered}
          addText={addText}
          enAddText={enAddText}
          modifyText={modifyText}
          enModifyText={enModifyText}
          actionBarExtra={actionBarExtra}
          actionBarExtraAg={actionBarExtraAg}
          actionBarExtraParams={{
            dataSource,
            selectedRowKeys:
              (rowSelection && rowSelection.selectedRowKeys) || [],
            data: this._dealedRecordFormData,
            recordFormData: this._recordFormData
          }}
          headerExtra={headerExtra}
          isShowGrid={isShowGrid}
          gridProps={gridProps}
          rowSelectionAg={rowSelectionAg}
          resid={this.props.resid}
          baseURL={this.props.baseURL}
        />
      );
    }
    return (
      <PwTable
        title={title}
        hasZoomInOut={hasZoomInOut}
        zoomStatus={zoomStatus}
        editingKey={editingKey}
        components={components}
        pagination={pagination}
        dataSource={dataSource}
        columns={newColumns}
        bordered
        rowKey={'REC_ID'}
        scroll={scrollXY}
        hasAdd={hasAdd && this._hasAdd}
        hasModify={hasModify && this._hasModify}
        hasDelete={hasDelete && this._hasDelete}
        onAdd={this.handleAdd}
        onModify={this.handleModify}
        onDelete={this.handleDelete}
        onSearch={this.handleSearch}
        onImport={this.handleImport}
        onDownload={this.handleDownload}
        onSearchChange={v => {
          this.onSearchChange(v);
        }}
        onChange={this.handleTableChange}
        renderOtherBtns={this.renderBeBtns}
        rowSelection={rowSelection}
        onRow={this.handleOnRow}
        rowClassName={this.handleRowClassName}
        onRefresh={this.handleRefresh}
        size={size}
        hasImport={importConfig && this._hasImport}
        hasDownload={hasDownload && this._hasDownload}
        hasRefresh={hasRefresh && this._hasRefresh}
        onAdvSearch={this.handleAdvSearch}
        onStatisticalAnalysis={this.handleStatisticalAnalysis}
        hasAdvSearch={hasAdvSearch && this._hasAdvSearch}
        hasSearch={hasSearch && this._hasSearch}
        // hasZoomInOut={hasZoomInOut}
        onZoomIn={this.handleZoomIn}
        onZoomOut={this.handleZoomOut}
        bordered={bordered}
        addText={addText}
        enAddText={enAddText}
        modifyText={modifyText}
        enModifyText={enModifyText}
        actionBarExtra={actionBarExtra}
        actionBarExtraParams={{
          dataSource,
          selectedRowKeys: (rowSelection && rowSelection.selectedRowKeys) || [],
          data: this._dealedRecordFormData,
          recordFormData: this._recordFormData,
          size
        }}
        headerExtra={headerExtra}
        isShowGrid={isShowGrid}
        gridProps={gridProps}
        onFixedColumns={this.handleFixedColumns}
      />
    );
  };

  render() {
    const { loading, zoomStatus, width, height } = this.state;
    let zoomOutStyle = {};
    if (zoomStatus === 1) {
      zoomOutStyle = {
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        zIndex: 999,
        height: '100%'
      };
    }
    const { style, isWrap } = this.props;
    return (
      <div
        className={classNames('table-data', {
          'table-data--no-wrap': !isWrap
        })}
        style={
          zoomOutStyle.position
            ? { ...zoomOutStyle, ...style }
            : { width, height, ...style }
        }
        ref={element => (this.tableDataRef = element)}
      >
        <Spin spinning={loading}>{this.renderPwTable()}</Spin>
      </div>
    );
  }
}

const composedHoc = compose(
  withHttpGetBeBtns,
  withHttpGetFormData,
  withAdvSearch(),
  withDownloadFile,
  withModalDrawer(),
  withRecordForm(),
  injectIntl,
  withImport
);

export default composedHoc(TableData);
