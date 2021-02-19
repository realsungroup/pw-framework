import React from 'react';
import {
  Table,
  Button,
  Input,
  Pagination,
  Dropdown,
  Checkbox,
  Menu,
  Tooltip,
  message
} from 'antd';
import pureRender from 'pure-render-deepcompare-decorator';
import ButtonWithConfirm from '../ButtonWithConfirm';
import { propTypes, defaultProps } from './propTypes';
import { getRang } from './util';
import IconBtns from './IconBtns';
import {
  btnSizeMap,
  tableSizeMap,
  paginationSizeMap,
  inputSizeMap
} from './map';
import './PwTable.less';
import 'react-resizable/css/styles.css';
import { getIntlVal } from 'Util20/util';
import { injectIntl, FormattedMessage as FM } from 'react-intl';
import { BIGrid } from 'lz-components-and-utils/lib/index';
import fixedPng from './assets/冻结@2x.png';
import fixedListPng from './assets/冻结列表@2x.png';
import { debounce } from 'lodash';

const Search = Input.Search;

/**
 * PwTable
 */
// @pureRender
class PwTable extends React.Component {
  static propTypes = propTypes;

  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.state = {
      zoomStatus: 0, // 缩放状态：0 表示处于缩小状态 | 1 表示处于放大状态
      columnValue: '',
      columnsCheckedMap: {},
      showColumns: [], // 选择固定列时，显示的列名列表
      columns: [] // 所有的列名（不包含操作栏的列名）
    };
  }

  static getDerivedStateFromProps(props, state) {
    if ('columns' in props && !state.columns.length) {
      const { columns } = props;
      const columnsCheckedMap = {};
      const columnsTitleMap = {};
      columns.forEach(column => {
        if (column.dataIndex !== '操作') {
          columnsCheckedMap[column.fieldName] = !!column.fixed;
          columnsTitleMap[column.fieldName] = column.title;
        }
      });

      const newColumns = columns.filter(
        columnsItem => columnsItem.dataIndex !== '操作'
      );

      return {
        columns: [...newColumns],
        showColumns: [...newColumns],
        columnsCheckedMap,
        columnsTitleMap
      };
    }
  }

  handleImport = () => {
    this.props.onImport && this.props.onImport();
  };

  handleDownload = downloadColumns => {
    this.props.onDownload && this.props.onDownload(downloadColumns);
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

  renderPagination = () => {
    const { pagination, size, intl } = this.props;
    const rang = getRang(pagination);
    const hasTotal = pagination.current && pagination.total;

    if (pagination) {
      return (
        <div className="pw-table__footer">
          <Pagination
            style={{ marginLeft: 8 }}
            {...pagination}
            size={paginationSizeMap[size]}
          />
          {hasTotal &&
            getIntlVal(
              intl.locale,
              `${rang.start} ~ ${rang.end} ，${pagination.total} Records Totally`,
              `${rang.start} ~ ${rang.end} ，${pagination.total} 条记录`
            )}
        </div>
      );
    }
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

  handleSearchColumn = debounce(value => {
    const { columns } = this.state;
    const showColumns = columns
      .map(column => {
        if (column.title.includes(value)) {
          return column;
        }
        return false;
      })
      .filter(Boolean);

    this.setState({ showColumns });
  }, 300);

  handleColumnValueChange = e => {
    const value = e.target.value;
    this.setState({ columnValue: value });
    this.handleSearchColumn(value);
  };

  handleCheckboxChange = (checked, fieldName) => {
    this.setState({
      columnsCheckedMap: {
        ...this.state.columnsCheckedMap,
        [fieldName]: checked
      }
    });
  };

  handleFixedColumn = () => {
    const { onFixedColumns } = this.props;
    const { columnsCheckedMap } = this.state;

    const fixedColumns = Object.keys(columnsCheckedMap).filter(
      key => columnsCheckedMap[key]
    );

    onFixedColumns && onFixedColumns(fixedColumns);
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
      actionBarExtra,
      actionBarExtraParams,
      dataSource,
      headerExtra,
      isShowGrid,
      gridProps,
      ...restProps
    } = this.props;

    const { showColumns, columnValue, columnsCheckedMap } = this.state;

    const hasIconBtns =
      hasDownload || hasRefresh || hasAdvSearch || hasZoomInOut || headerExtra;

    const hasHeader = hasIconBtns || title;

    const { locale } = this.props.intl;

    const hasStatisticalAnalysis = gridProps.length ? true : false;
    return (
      <div className="pw-table">
        {hasHeader && (
          <div className="pw-table__header">
            <div
              className={`pw-table__header-title pw-table__header-title--${size}`}
            >
              {title}
            </div>
            {hasIconBtns && (
              <div className="pw-table__header-icon-wrap">
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
                  columns={restProps.columns}
                />
                {headerExtra && (
                  <React.Fragment>
                    {(function() {
                      if (typeof headerExtra === 'function') {
                        return headerExtra(dataSource);
                      } else {
                        return headerExtra;
                      }
                    })()}
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        )}

        {!isShowGrid ? (
          <>
            {
              <div
                className={`pw-table__action-bar pw-table__action-bar--${size}`}
              >
                <div className="pw-table__action-btns">
                  <Tooltip title="固定列">
                    <img
                      src={fixedPng}
                      className="pw-table__fixed-column"
                      onClick={this.handleFixedColumn}
                    ></img>
                  </Tooltip>

                  <Dropdown
                    overlay={
                      <Menu>
                        <div className="pw-table__fixed-columns-wrapper">
                          <Input
                            placeholder="输入关键字搜索表格列名"
                            value={columnValue}
                            onChange={this.handleColumnValueChange}
                          ></Input>
                          <div className="pw-table__columns-title">
                            请勾选锁定项
                          </div>

                          <div className="pw-table__columns">
                            <div className="pw-table__columns-list">
                              {showColumns.map(columnItem => (
                                <label
                                  className="pw-table__fixed-columns-item"
                                  key={columnItem.fieldName}
                                  title={columnItem.title}
                                >
                                  <Checkbox
                                    checked={
                                      columnsCheckedMap[columnItem.fieldName]
                                    }
                                    onChange={e =>
                                      this.handleCheckboxChange(
                                        e.target.checked,
                                        columnItem.fieldName
                                      )
                                    }
                                  ></Checkbox>
                                  <div className="pw-table__fixed-columns-item-title">
                                    {columnItem.title}
                                  </div>
                                </label>
                              ))}

                              {!showColumns.length && (
                                <div className="pw-table__fixed-columns-no-data">
                                  无数据
                                </div>
                              )}
                            </div>
                          </div>

                          {/* <div className="pw-table__fixed-columns-footer">
                            <Button
                              block
                              type="primary"
                              onClick={this.handleSaveFixedColumn}
                            >
                              保存
                            </Button>
                          </div> */}
                        </div>
                      </Menu>
                    }
                  >
                    <img
                      src={fixedListPng}
                      className="pw-table__fixed-column-list"
                    ></img>
                  </Dropdown>

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

                {actionBarExtra && (
                  <div className="pw-table__action-bar-extra">
                    {(function() {
                      if (typeof actionBarExtra === 'function') {
                        return actionBarExtra(actionBarExtraParams);
                      } else {
                        return actionBarExtra;
                      }
                    })()}
                  </div>
                )}

                <div className="pw-table__search">
                  {hasSearch && (
                    <Search
                      placeholder={getIntlVal(
                        locale,
                        'Enter the key',
                        '请输入关键词'
                      )}
                      onChange={this.handleSearchChange}
                      size={inputSizeMap[size]}
                      style={{ width: 150 }}
                      onSearch={this.handleSearch}
                    />
                  )}
                </div>
              </div>
            }

            <Table
              dataSource={dataSource}
              {...restProps}
              pagination={false}
              size={tableSizeMap[size]}
            />

            {this.renderPagination()}
          </>
        ) : (
          <div style={{ height: 'calc(100% - 28px)', width: '100%' }}>
            {gridProps.length && (
              <BIGrid gridProps={gridProps} language="zhCN" height={'100%'} />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default injectIntl(PwTable);
