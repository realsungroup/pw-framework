import React from 'react';
import { Table, Button, Input, Pagination, message, Popconfirm } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import ButtonWithConfirm from '../ButtonWithConfirm';
import memoize from 'memoize-one';
import { propTypes, defaultProps } from './propTypes';
import { getRang } from './util';
import { clone } from '../../../../util20/util';
import IconBtns from './IconBtns';
import {
  btnSizeMap,
  tableSizeMap,
  paginationSizeMap,
  inputSizeMap
} from './map';
import './PwAggrid.less';
import 'react-resizable/css/styles.css';
import { getIntlVal } from 'Util20/util';
import { injectIntl, FormattedMessage as FM } from 'react-intl';
import moment from 'moment';
import http from 'Util20/api';

const isFirstColumn = params => {
  var displayedColumns = params.columnApi.getAllDisplayedColumns();
  var thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
};
/**
 * PwAggrid
 */
class PwAggrid extends React.Component {
  static propTypes = propTypes;

  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.state = {
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        checkboxSelection: isFirstColumn,
        headerCheckboxSelection: isFirstColumn
      },
      columnDefs: [],
      hasModifiedData: false,
      isEditing: false, //是否正在编辑
      saveBtnLoading: false,
      deleteBtnLoading: false,
      rowClassRules: {
        'pw-ag-grid-new-row': function(params) {
          return params.data ? params.data.isNew === true : null;
        }
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataSource !== this.props.dataSource) {
      const start_time = moment();
      this._clonedData = clone(this.props.dataSource);
      const end_time = moment();
      console.log(end_time.diff(start_time));
    }
  }

  handleImport = () => {
    this.props.onImport && this.props.onImport();
  };

  handleDownload = () => {
    this.props.onDownload && this.props.onDownload();
  };

  handleRefresh = () => {
    this.props.onRefresh && this.props.onRefresh();
  };

  handleAdvSearch = () => {
    this.props.onAdvSearch && this.props.onAdvSearch();
  };

  handleZoomIn = () => {
    this.props.onZoomIn && this.props.onZoomIn();
  };

  handleZoomOut = () => {
    this.props.onZoomOut && this.props.onZoomOut();
  };

  handleStatisticalAnalysis = () => {
    this.props.onStatisticalAnalysis && this.props.onStatisticalAnalysis();
  };

  handleModify = () => {
    this.props.onModify && this.props.onModify();
  };

  handleDelete = () => {
    this.props.onDelete && this.props.onDelete();
  };

  handleSearchChange = e => {
    this.props.onSearchChange && this.props.onSearchChange(e.target.value);
  };

  handleSearch = (value, e) => {
    this.props.onSearch && this.props.onSearch(value, e);
  };

  handleAddRecords = async records => {
    const data = records.map(item => {
      return {
        ...item,
        REC_ID: undefined
      };
    });
    try {
      await http().addRecords({
        resid: this.props.resid,
        data: data
      });
    } catch (error) {
      // message.error(error.message);
      console.log(error);
    }
  };

  handleSaveRecords = async records => {
    try {
      const res = await http().modifyRecords({
        resid: this.props.resid,
        data: records
      });
      this.gridApi.updateRowData({
        update: res.data
      });
      this._modifiedData.clear();
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  handleDeleteRecords = async () => {
    this.setState({ deleteBtnLoading: true });
    let selectedData = this.gridApi.getSelectedRows();
    this.gridApi.updateRowData({
      remove: selectedData
    });
    const hasRec_idRecords = selectedData.filter(item => item.REC_ID > 0);
    const noRec_idRecords = selectedData.filter(item => item.REC_ID < 0);
    noRec_idRecords.forEach(item => {
      this._addData.delete(item.REC_ID);
    });
    if (this._addData.size === 0 && this._modifiedData.size === 0) {
      this.setState({
        hasModifiedData: false
      });
    }
    if (hasRec_idRecords.length) {
      try {
        await http().removeRecords({
          resid: this.props.resid,
          data: hasRec_idRecords
        });
      } catch (error) {
        message.error(error.message);
        console.error(error);
      }
    }
    this.setState({ deleteBtnLoading: false });
  };

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  };

  onQuickFilterChanged = () => {
    this.gridApi.setQuickFilter(document.getElementById('quickFilter').value);
  };

  getcolumnDefs = memoize((columns, columnDefs) => {
    return columns.map((column, index) => {
      const _column = column[column.id];
      let aggridColumn = {
        headerName: _column.ColDispName,
        field: _column.ColName,
        sortable: true,
        filter: _column.filter,
        editable: _column.editable,
        filterParams: {},
        enableRowGroup: _column.enableRowGroup,
        enableValue: _column.enableValue,
        chartDataType: _column.chartType,
        aggFunc: _column.aggFunc,
        rowGroup: _column.rowGroup,
        cellStyle: function(params) {
          // console.log(params);
          if (params.colDef.editable) {
            return { background: '#ddebe1' };
          }
        },
        valueSetter: params => {
          if (params.oldValue == params.newValue) {
            return false;
          }
          params.data[_column.ColName] = params.newValue;
          return true;
        }
      };
      if (
        _column.ValueOptions.length ||
        _column.DisplayOptions.length ||
        _column.ListOfColOptions.length
      ) {
        // aggridColumn.cellEditor = 'agRichSelectCellEditor';
        aggridColumn.cellEditor = 'agSelectCellEditor';
        if (_column.ListOfColOptions.length) {
          console.log(_column.ListOfColOptions);
          aggridColumn.cellEditorParams = {
            values: _column.ListOfColOptions.map(item => item.valueColValue)
          };
        } else {
          aggridColumn.cellEditorParams = { values: _column.ValueOptions };
        }
      }
      if (!aggridColumn.filter) {
        switch (_column.ColType) {
          case 4:
          case 8:
            aggridColumn.filter = 'agDateColumnFilter';
            break;
          case 1:
          case 5:
            aggridColumn.filter = 'agTextColumnFilter';
            break;

          default:
            aggridColumn.filter = 'agNumberColumnFilter';
            break;
        }
      }
      if (aggridColumn.editable) {
        this._editableCol.push(aggridColumn.field);
      } else {
        this._cantEditCol.push(aggridColumn.field);
      }
      return aggridColumn;
    });
  });
  _editableCol = [];
  _cantEditCol = [];
  _modifiedData = new Map();
  _addData = new Map();

  onCellValueChanged = params => {
    const { data, newValue, rowIndex, colDef } = params;
    let oldObj = {};
    if (data.isNew) {
      oldObj = this._addData.get(data.REC_ID);
      this._addData.set(data.REC_ID, {
        ...oldObj,
        REC_ID: data.REC_ID,
        [colDef.field]: newValue,
        rowIndex
      });
    } else {
      oldObj = this._modifiedData.get(data.REC_ID);
      this._modifiedData.set(data.REC_ID, {
        ...oldObj,
        REC_ID: data.REC_ID,
        [colDef.field]: newValue,
        rowIndex
      });
    }

    if (!this.state.hasModifiedData) {
      this.setState({ hasModifiedData: true });
    }
  };

  onPasteStart = params => {};

  onPasteEnd = params => {};

  handleSaveButtonClick = async () => {
    this.setState({ saveBtnLoading: true });
    const data = Array.from(this._modifiedData.values());
    const addData = Array.from(this._addData.values());
    console.log(data, addData);
    if (addData.length) {
      await this.handleAddRecords(addData);
      console.log(addData.map(item => ({ ...item, isNew: false })));
      this.gridApi.updateRowData({
        update: addData.map(item => ({ ...item, isNew: false }))
      });
    }
    if (data.length) {
      await this.handleSaveRecords(data);
    }
    message.success('保存成功');
    if (this._modifiedData.size === 0 && this._addData.size === 0) {
      this.setState({
        hasModifiedData: false
      });
    }
    this.setState({ saveBtnLoading: false });
    this._addData.clear();
  };

  handleRowEditingStarted = params => {
    this.setState({ isEditing: true });
    // 隐藏不可编辑的列
    // this.gridColumnApi.setColumnsVisible(this._cantEditCol, false);
  };

  handleRowEditingStopped = params => {
    this.setState({ isEditing: false });
    // 显示不可编辑的列
    // this.gridColumnApi.setColumnsVisible(this._cantEditCol, true);
    const { data } = params;
    if (data.isNew) {
      this._addData.set(data.REC_ID, data);
    }
  };

  handleAddRecord = columnDefs => () => {
    const firstEditable = columnDefs.find(item => item.editable);

    let data = {
      REC_ID: -(this._addData.size + 1),
      isNew: true
    };
    this._addData.set(data.REC_ID, data);
    this.gridApi.updateRowData({
      add: [data],
      addIndex: 0
    });
    if (!firstEditable) {
      return;
    }
    this.gridApi.startEditingCell({
      rowIndex: 0,
      colKey: firstEditable.field
    });
  };

  render() {
    const {
      size,
      title,
      hasDownload,
      hasRefresh,
      hasAdvSearch,
      hasAdd,
      hasModify,
      hasDelete,
      renderOtherBtns,
      hasSearch,
      pagination,
      width,
      height,
      onResizeStop,
      hasZoomInOut,
      onZoomIn,
      onZoomOut,
      hasImport,
      onImport,
      addText,
      enAddText,
      modifyText,
      enModifyText,
      intl,
      dataSource,
      headerExtra,
      isShowGrid,
      gridProps,
      actionBarExtraAg,
      rowSelectionAg,
      ...restProps
    } = this.props;

    let {
      defaultColDef,
      hasModifiedData,
      isEditing,
      saveBtnLoading,
      deleteBtnLoading
    } = this.state;

    const hasActionBar =
      hasAdd || hasModify || hasDelete || renderOtherBtns || hasSearch;
    const hasIconBtns =
      hasDownload || hasRefresh || hasAdvSearch || hasZoomInOut || headerExtra;

    const hasHeader = hasIconBtns || title;

    const { locale } = this.props.intl;

    const hasStatisticalAnalysis = gridProps.length ? true : false;
    const columnDefs = this.getcolumnDefs(
      this.props.originalColumn,
      this.state.columnDefs
    );
    return (
      <div className="pw-ag-grid">
        {hasHeader && (
          <div className="pw-ag-grid__header">
            <div
              className={`pw-ag-grid__header-title pw-ag-grid__header-title--${size}`}
            >
              {title}
            </div>
            {hasIconBtns && (
              <div className="pw-ag-grid__header-icon-wrap">
                <IconBtns
                  hasDownload={hasDownload}
                  hasImport={hasImport}
                  onImport={this.handleImport}
                  onDownload={this.handleDownload}
                  hasRefresh={hasRefresh}
                  onRefresh={this.handleRefresh}
                  hasAdvSearch={hasAdvSearch}
                  onAdvSearch={this.handleAdvSearch}
                  hasStatisticalAnalysis={hasStatisticalAnalysis}
                  onStatisticalAnalysis={this.handleStatisticalAnalysis}
                  hasZoomInOut={hasZoomInOut}
                  onZoomIn={this.handleZoomIn}
                  onZoomOut={this.handleZoomOut}
                  size={size}
                  isShowGrid={isShowGrid}
                  zoomStatus={this.props.zoomStatus}
                />
                {/* {headerExtra && (
                  <React.Fragment>
                    {(function() {
                      if (typeof headerExtra === 'function') {
                        return headerExtra(dataSource);
                      } else {
                        return headerExtra;
                      }
                    })()}
                  </React.Fragment>
                )} */}
              </div>
            )}
          </div>
        )}

        {hasActionBar && (
          <div
            className={`pw-ag-grid__action-bar pw-ag-grid__action-bar--${size}`}
          >
            <div className="pw-ag-grid__action-btns">
              <Input
                type="text"
                onInput={this.onQuickFilterChanged}
                id="quickFilter"
                width={120}
                placeholder="全局筛选"
              />
              <Button onClick={this.handleAddRecord(columnDefs)}>添加</Button>
              {isEditing && (
                <Popconfirm
                  title="确认取消？"
                  onConfirm={() => this.gridApi.stopEditing(true)}
                >
                  <Button type="danger">取消</Button>
                </Popconfirm>
              )}

              {!isEditing && (
                <Popconfirm
                  title="确认删除？"
                  onConfirm={this.handleDeleteRecords}
                >
                  <Button loading={deleteBtnLoading} type="danger">
                    删除
                  </Button>
                </Popconfirm>
              )}
              {hasModifiedData && !isEditing && (
                <>
                  <Button
                    type="primary"
                    loading={saveBtnLoading}
                    onClick={this.handleSaveButtonClick}
                  >
                    保存
                  </Button>
                </>
              )}
              {renderOtherBtns && renderOtherBtns()}
              {hasAdd && (
                <Button size={btnSizeMap[size]} onClick={this.handleAdd}>
                  {/* 添加 */}
                  {getIntlVal(intl.locale, enAddText, addText)}
                </Button>
              )}
              {hasModify && (
                <Button size={btnSizeMap[size]} onClick={this.handleModify}>
                  {/* 修改 */}
                  {getIntlVal(intl.locale, enModifyText, modifyText)}
                </Button>
              )}
              {hasDelete && (
                <ButtonWithConfirm
                  popConfirmProps={{
                    onConfirm: this.handleDelete,
                    title: getIntlVal(
                      locale,
                      'Are you sure to delete?',
                      '您确定要删除吗？'
                    )
                  }}
                  buttonProps={{
                    size: btnSizeMap[size],
                    type: 'danger'
                  }}
                >
                  <FM id="common.delete" defaultMessage="删除" />
                </ButtonWithConfirm>
              )}
            </div>

            {actionBarExtraAg && this.gridApi && (
              <div className="pw-ag-grid__action-bar-extra">
                {typeof actionBarExtraAg === 'function'
                  ? actionBarExtraAg(this.gridApi)
                  : actionBarExtraAg}
              </div>
            )}
          </div>
        )}
        <div
          style={{ height: 'calc(100% - 65px)', width: '100%' }}
          className="ag-theme-balham"
        >
          <AgGridReact
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowData={dataSource}
            pagination={true}
            paginationPageSize={100}
            floatingFilter={true}
            rowSelection={rowSelectionAg}
            rowMultiSelectWithClick={true} //是否
            onGridReady={this.onGridReady}
            enableRangeSelection={true} //是否启用范围选择
            suppressRowClickSelection={true}
            onCellValueChanged={this.onCellValueChanged}
            onPasteStart={this.onPasteStart}
            onPasteEnd={this.onPasteEnd}
            getRowNodeId={data => data.REC_ID}
            // animateRows={true}
            editType="fullRow"
            onRowEditingStopped={this.handleRowEditingStopped}
            onRowEditingStarted={this.handleRowEditingStarted}
            rowClassRules={this.state.rowClassRules}
            sideBar={this.props.sideBarAg}
          ></AgGridReact>
        </div>
      </div>
    );
  }
}

export default injectIntl(PwAggrid);
