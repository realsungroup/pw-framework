import React from 'react';
import './PwTable.less';

import 'react-resizable/css/styles.css';

import { Table, Button, Input, Pagination } from 'antd';
import pureRender from 'pure-render-deepcompare-decorator';
import ButtonWithConfirm from '../ButtonWithConfirm';
import { propTypes, defaultProps } from './PwTablePropTypes';
import { getRang } from './util';
import IconBtns from './IconBtns';
import {
  btnSizeMap,
  tableSizeMap,
  paginationSizeMap,
  inputSizeMap
} from './map';
const Search = Input.Search;

/**
 * PwTable
 */
@pureRender
class PwTable extends React.Component {
  static propTypes = propTypes;

  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.state = {
      zoomStatus: 0 // 缩放状态：0 表示处于缩小状态 | 1 表示处于放大状态
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
    this.setState({ zoomStatus: 1 });
    this.props.onZoomIn && this.props.onZoomIn();
  };

  handleZoomOut = () => {
    this.setState({ zoomStatus: 0 });
    this.props.onZoomOut && this.props.onZoomOut();
  };

  renderPagination = () => {
    const { pagination, size } = this.props;
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
          {hasTotal && (
            <span>
              第 {rang.start} - {rang.end} 条，总共 {pagination.total} 条
            </span>
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
      ...restProps
    } = this.props;

    const hasActionBar =
      hasAdd || hasModify || hasDelete || renderOtherBtns || hasSearch;

    const hasIconBtns =
      hasDownload || hasRefresh || hasAdvSearch || hasZoomInOut;

    const hasHeader = hasIconBtns && title;

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
              <IconBtns
                hasDownload={hasDownload}
                hasImport={hasImport}
                onImport={this.handleImport}
                onDownload={this.handleDownload}
                hasRefresh={hasRefresh}
                onRefresh={this.handleRefresh}
                hasAdvSearch={hasAdvSearch}
                onAdvSearch={this.handleAdvSearch}
                hasZoomInOut={hasZoomInOut}
                onZoomIn={this.handleZoomIn}
                onZoomOut={this.handleZoomOut}
                size={size}
                zoomStatus={this.state.zoomStatus}
              />
            )}
          </div>
        )}

        {hasActionBar && (
          <div className={`pw-table__action-bar pw-table__action-bar--${size}`}>
            <div className="pw-table__action-btns">
              {renderOtherBtns && renderOtherBtns()}
              {hasAdd && (
                <Button size={btnSizeMap[size]} onClick={this.handleAdd}>
                  添加
                </Button>
              )}
              {hasModify && (
                <Button size={btnSizeMap[size]} onClick={this.handleModify}>
                  修改
                </Button>
              )}
              {hasDelete && (
                <ButtonWithConfirm
                  popConfirmProps={{
                    onConfirm: this.handleDelete,
                    title: '您确定要删除吗？'
                  }}
                  buttonProps={{
                    size: btnSizeMap[size],
                    type: 'danger'
                  }}
                >
                  删除
                </ButtonWithConfirm>
              )}
            </div>
            <div className="pw-table__search">
              {hasSearch && (
                <Search
                  placeholder="请输入关键词"
                  onChange={this.handleSearchChange}
                  size={inputSizeMap[size]}
                  style={{ width: 150 }}
                  onSearch={this.handleSearch}
                />
              )}
            </div>
          </div>
        )}

        <Table {...restProps} pagination={false} size={tableSizeMap[size]} />

        {this.renderPagination()}
      </div>
    );
  }
}

export default PwTable;
