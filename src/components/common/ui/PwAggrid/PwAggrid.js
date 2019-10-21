import React from 'react';
import { Table, Button, Input, Pagination, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import ButtonWithConfirm from '../ButtonWithConfirm';
import memoize from 'memoize-one';
import { propTypes, defaultProps } from './propTypes';
import { getRang } from './util';
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
import { BIGrid } from 'lz-components-and-utils/lib/index';

const Search = Input.Search;

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
      zoomStatus: 0, // 缩放状态：0 表示处于缩小状态 | 1 表示处于放大状态
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true,
        checkboxSelection: isFirstColumn,
        headerCheckboxSelection: isFirstColumn
      },
      columnDefs: [],
      hasPasteData: false
    };
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

  handleAdd = () => {
    this.props.onAdd && this.props.onAdd();
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

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  onQuickFilterChanged = () => {
    this.gridApi.setQuickFilter(document.getElementById('quickFilter').value);
  };

  getcolumnDefs = memoize((columnDefs, columns) => {
    return columns.map(column => {
      const _column = column[column.id];
      let aggridColumn = {
        headerName: _column.ColDispName,
        field: _column.ColName,
        sortable: true,
        filter: _column.filter,
        editable: true,
        valueSetter: params => {
          // console.log(params.data[_column.ColName]);
          if (params.oldValue === params.newValue) {
            return false;
          }
          let data = { ...params.data, [_column.ColName]: params.newValue };
          params.data[_column.ColName] = params.newValue;
          return true;
        }
      };
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
      return aggridColumn;
    });
  });

  _modifiedDataByPaste = new Map();

  onCellValueChanged = params => {
    const { data, newValue, rowIndex, colDef } = params;
    const oldObj = this._modifiedDataByPaste.get(rowIndex);
    this._modifiedDataByPaste.set(rowIndex, {
      ...oldObj,
      REC_ID: data.REC_ID,
      [colDef.field]: newValue
    });
  };
  onPasteStart = params => {};

  onPasteEnd = params => {
    this.setState({ hasPasteData: true });
  };

  onSavePasteButtonClick = async () => {
    const data = Array.from(this._modifiedDataByPaste.values());
    this.setState({ hasPasteData: false });
    return console.log(data);
    let res = await this.props.onPasteEnd(data);
    if (res) {
      message.success('保存成功');
      this.setState({ hasPasteData: false });
    } else {
      message.success('保存失败');
    }
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

    let { columnDefs, defaultColDef, hasPasteData } = this.state;

    const hasActionBar =
      hasAdd || hasModify || hasDelete || renderOtherBtns || hasSearch;
    const hasIconBtns =
      hasDownload || hasRefresh || hasAdvSearch || hasZoomInOut || headerExtra;

    const hasHeader = hasIconBtns || title;

    const { locale } = this.props.intl;

    const hasStatisticalAnalysis = gridProps.length ? true : false;
    columnDefs = this.getcolumnDefs(columnDefs, this.props.originalColumn);

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
              {/* {hasPasteData && ( */}
              <>
                <Button
                  onClick={() => {
                    console.log(this.gridApi.getModel());
                  }}
                >
                  还原
                </Button>
                <Button type="primary" onClick={this.onSavePasteButtonClick}>
                  保存
                </Button>
              </>
              {/* )} */}
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
          ></AgGridReact>
        </div>
      </div>
    );
  }
}

export default injectIntl(PwAggrid);
