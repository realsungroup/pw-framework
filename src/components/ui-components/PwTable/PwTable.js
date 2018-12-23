import React from 'react';
import PropTypes from 'prop-types';
import './PwTable.less';

import IconWithTooltip from '../IconWithTooltip';

import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

import { Table, Button, Input, Pagination, Spin } from 'antd';

const Search = Input.Search;

const btnSizeMap = {
  large: 'large',
  middle: 'default',
  small: 'small'
};

const tableSizeMap = {
  large: 'default',
  middle: 'middle',
  small: 'small'
};

const paginationSizeMap = {
  large: '',
  middle: '',
  small: 'small'
};

const inputSizeMap = {
  large: 'large',
  middle: 'default',
  small: 'small'
};

const iconSizeMap = {
  large: 20,
  middle: 18,
  small: 16
};

/**
 * 字体图标按钮
 */
const IconBtns = React.memo(
  ({
    hasDownload,
    onDownload,
    hasRefresh,
    onRefresh,
    hasAdvSearch,
    onAdvSearch,
    size
  }) => {
    return (
      <div className="pw-table__header-icon-wrap">
        {hasDownload && (
          <IconWithTooltip
            className="pw-table__header-icon"
            tip="下载"
            iconClass="icon-export"
            onClick={onDownload}
            style={{ fontSize: iconSizeMap[size] }}
          />
        )}
        {hasRefresh && (
          <IconWithTooltip
            className="pw-table__header-icon"
            tip="刷新"
            iconClass="icon-refresh"
            onClick={onRefresh}
            style={{ fontSize: iconSizeMap[size] }}
          />
        )}
        {hasAdvSearch && (
          <IconWithTooltip
            className="pw-table__header-icon"
            tip="高级搜索"
            iconClass="icon-adv-search"
            onClick={onAdvSearch}
            style={{ fontSize: iconSizeMap[size] }}
          />
        )}
      </div>
    );
  }
);

/**
 * PwTable
 */
export default class PwTable extends React.Component {
  static propTypes = {
    /**
     * 表格尺寸
     * 默认：'large'
     */
    size: PropTypes.oneOf(['large', 'middle', 'small']),

    /**
     * 表格标题
     */
    title: PropTypes.string.isRequired,

    /**
     * 表格宽度
     * 默认：800
     */
    width: PropTypes.number,

    /**
     * 表格高度
     * 默认：300
     */
    height: PropTypes.number,

    /**
     * 是否有下载表格的功能
     * 默认值：true
     */
    hasDownload: PropTypes.bool,

    /**
     * 点击下载表格时的回调
     * */
    onDownload: PropTypes.func,

    /**
     * 是否有刷新表格数据的功能
     * 默认值：true
     */
    hasRefresh: PropTypes.bool,

    /**
     * 点击刷新时的回调
     * */
    onRefresh: PropTypes.func,

    /**
     * 是否有高级搜索的功能
     * 默认值：true
     */
    hasAdvSearch: PropTypes.bool,

    /**
     * 点击高级搜索时的回调
     */
    onAdvSearch: PropTypes.func,

    /**
     * 渲染后端按钮的函数
     */
    renderBeBtns: PropTypes.func,

    /**
     * 是否有添加按钮
     * 默认值：true
     */
    hasAdd: PropTypes.bool,

    /**
     * 点击添加时的回调
     */
    onAdd: PropTypes.func,

    /**
     * 是否有修改按钮
     * 默认值：true
     */
    hasModify: PropTypes.bool,

    /**
     * 点击修改时的回调
     */
    onModify: PropTypes.func,

    /**
     * 是否有删除按钮
     * 默认值：true
     */
    hasDelete: PropTypes.bool,

    /**
     * 点击删除时的回调
     */
    onDelete: PropTypes.func,

    /**
     * 是否有搜索栏
     * 默认值：true
     */
    hasSearch: PropTypes.bool,

    /**
     * 分页配置
     * 默认值：-
     */
    pagination: PropTypes.object,

    /**
     * 搜索时的回调
     */
    onSearch: PropTypes.func
  };

  static defaultProps = {
    size: 'middle',

    width: 800,
    height: 400,

    hasDownload: true,
    hasRefresh: true,
    hasAdvSearch: true,

    hasAdd: true,
    hasModify: true,
    hasDelete: true,
    hasSearch: true
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleDownload = () => {
    this.props.onDownload && this.props.onDownload();
  };

  handleRefresh = () => {
    this.props.onRefresh && this.props.onRefresh();
  };

  handleAdvSearch = () => {
    this.props.onAdvSearch && this.props.onAdvSearch();
  };

  getResizeBoxProp = () => {
    const {
      width,
      height,
      handleSize,
      lockAspectRatio,
      axis,
      minConstraints,
      maxConstraints,
      onResizeStop,
      onResizeStart,
      onResize,
      draggableOpts
    } = this.props;
    return {
      width,
      height,
      handleSize,
      lockAspectRatio,
      axis,
      minConstraints,
      maxConstraints,
      onResizeStop,
      onResizeStart,
      onResize,
      draggableOpts
    };
  };

  renderPagination = () => {
    const { pagination, size } = this.props;
    if (pagination) {
      return (
        <div className="pw-table__footer">
          <Pagination
            style={{ marginLeft: 8 }}
            {...pagination}
            size={paginationSizeMap[size]}
          />
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
      renderBeBtns,
      hasSearch,
      pagination,
      width,
      height,
      loading,
      ...restProps
    } = this.props;

    const hasActionBar =
      hasAdd || hasModify || hasDelete || renderBeBtns || hasSearch;

    const hasIconBtns = hasDownload || hasRefresh || hasAdvSearch;

    const resizeBoxProps = this.getResizeBoxProp();
    return (
      <Spin spinning={loading}>
        <ResizableBox {...resizeBoxProps}>
          <div className="pw-table">
            <div className="pw-table__header">
              <div
                className={`pw-table__header-title pw-table__header-title--${size}`}
              >
                {title}
              </div>
              {hasIconBtns && (
                <IconBtns
                  hasDownload={hasDownload}
                  onDownload={this.handleDownload}
                  hasRefresh={hasRefresh}
                  onRefresh={this.handleRefresh}
                  hasAdvSearch={hasAdvSearch}
                  onAdvSearch={this.handleAdvSearch}
                  size={size}
                />
              )}
            </div>
            {hasActionBar && (
              <div
                className={`pw-table__action-bar pw-table__action-bar--${size}`}
              >
                <div className="pw-table__action-btns">
                  {renderBeBtns && renderBeBtns()}
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
                    <Button
                      size={btnSizeMap[size]}
                      type="danger"
                      onClick={this.handleDelete}
                    >
                      删除
                    </Button>
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

            <Table
              {...restProps}
              pagination={false}
              size={tableSizeMap[size]}
            />

            {this.renderPagination()}
          </div>
        </ResizableBox>
      </Spin>
    );
  }
}
