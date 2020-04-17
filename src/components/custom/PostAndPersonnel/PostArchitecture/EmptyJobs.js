import React from 'react';
import http, { makeCancelable } from 'Util20/api';
import moment from 'moment';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import memoize from 'memoize-one';
import { Spin, Button } from 'antd';
import './EmptyJob.less';

const isFirstColumn = params => {
  var displayedColumns = params.columnApi.getAllDisplayedColumns();
  var thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
};
class ArchitectureDiagram extends React.Component {
  state = {
    defaultColDef: {
      filter: true,
      sortable: true,
      resizable: true,
      checkboxSelection: isFirstColumn,
      headerCheckboxSelection: isFirstColumn
    },
    columnDefs: [],
    dataSource: [],
    loading: true
  };
  async componentDidMount() {
    this.getData();
  }
  componentWillUnmount() {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
    this.p3 && this.p3.cancel();
    this.p4 && this.p4.cancel();
  }
  onGridReady = params => {
    this.gridApi = params.api;
    this.props.onReady && this.props.onReady(params.api);
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  };

  _cmscolumninfo = []; // 主表的列定义
  _nodes = []; // 当前所有节点数据
  /**
   * 获取节点数据
   */
  getData = async () => {
    const { resid, baseURL, procedureConfig } = this.props;
    const options = {
      ...procedureConfig,
      resid
    };
    this.setState({ loading: true });
    try {
      const httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      this.p1 = makeCancelable(http(httpParams).getByProcedure(options));
      const res = await this.p1.promise;
      this._cmscolumninfo = res.cmscolumninfo;
      const nodes = res.data.filter(item => {
        return item.isEmpty === 'Y';
      });
      this.setState({ loading: false, dataSource: nodes });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
    }
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
        // hide: true,
        // autoHeight: true,
        cellStyle: function(params) {},
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
          aggridColumn.cellEditorParams = {
            values:
              _column.ColType === 1
                ? _column.ListOfColOptions.map(item => item.displayColValue)
                : _column.ListOfColOptions.map(item => item.valueColValue)
          };
        } else {
          aggridColumn.cellEditorParams = { values: _column.ValueOptions };
        }
      }
      if (_column.ColType === 4) {
        aggridColumn.cellEditor = 'datePicker';
      }
      if (!aggridColumn.filter) {
        switch (_column.ColType) {
          case 4:
          case 8:
            aggridColumn.filter = 'agDateColumnFilter';
            aggridColumn.filterParams = {
              // provide comparator function
              comparator: function(filterLocalDateAtMidnight, cellValue) {
                const dateAsString = cellValue;
                if (dateAsString == null) return 0;
                const cellDate = moment(dateAsString).toDate();

                // Now that both parameters are Date objects, we can compare
                if (cellDate < filterLocalDateAtMidnight) {
                  return -1;
                } else if (cellDate > filterLocalDateAtMidnight) {
                  return 1;
                } else {
                  return 0;
                }
              }
            };
            break;
          case 1:
          case 5:
            // aggridColumn.filter = 'agTextColumnFilter';
            aggridColumn.filter = true;

            break;

          default:
            aggridColumn.filter = 'agNumberColumnFilter';
            break;
        }
      }
      return aggridColumn;
    });
  });
  render() {
    const { defaultColDef, dataSource, loading } = this.state;
    const columnDefs = this.getcolumnDefs(
      this._cmscolumninfo,
      this.state.columnDefs
    );
    return (
      <div className="empty-jobs">
        <Spin spinning={loading}>
          <div style={{ height: '100%' }} className="ag-theme-balham">
            <AgGridReact
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowData={dataSource}
              pagination={true}
              paginationPageSize={100}
              floatingFilter={true}
              // rowSelection={rowSelectionAg}
              rowMultiSelectWithClick={true} //是否
              onGridReady={this.onGridReady}
              enableRangeSelection={true} //是否启用范围选择
              suppressRowClickSelection={true}
              // onCellValueChanged={this.onCellValueChanged}
              // onPasteStart={this.onPasteStart}
              // onPasteEnd={this.onPasteEnd}
              getRowNodeId={data => data.REC_ID}
              // onSelectionChanged={this.handleSelectionChanged}
              // animateRows={true}
              // editType="fullRow"
              // onRowEditingStopped={this.handleRowEditingStopped}
              // onRowEditingStarted={this.handleRowEditingStarted}
              // rowClassRules={this.state.rowClassRules}
              // sideBar={this.props.sideBarAg}
              // components={this.state.components}
              // frameworkComponents={this.state.frameworkComponents}
              groupMultiAutoColumn={true}
              rememberGroupStateWhenNewData={true}
              enableCharts={true}
            ></AgGridReact>
          </div>
        </Spin>
      </div>
    );
  }
}

export default ArchitectureDiagram;
