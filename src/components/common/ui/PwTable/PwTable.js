import React from 'react';
import { Table, Button, Input, Pagination } from 'antd';
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
              `${rang.start} ~ ${rang.end} ，${
                pagination.total
              } Records Totally`,
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
      ...restProps
    } = this.props;

    const hasActionBar =
      hasAdd ||
      hasModify ||
      hasDelete ||
      renderOtherBtns ||
      hasSearch ||
      actionBarExtra;

    const hasIconBtns =
      hasDownload || hasRefresh || hasAdvSearch || hasZoomInOut || headerExtra;

    const hasHeader = hasIconBtns || title;

    const { locale } = this.props.intl;

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
                  hasZoomInOut={hasZoomInOut}
                  onZoomIn={this.handleZoomIn}
                  onZoomOut={this.handleZoomOut}
                  size={size}
                  zoomStatus={this.state.zoomStatus}
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

        {hasActionBar && (
          <div className={`pw-table__action-bar pw-table__action-bar--${size}`}>
            <div className="pw-table__action-btns">
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
        )}

        <Table
          dataSource={dataSource}
          {...restProps}
          pagination={false}
          size={tableSizeMap[size]}
        />

        {this.renderPagination()}
      </div>
    );
  }
}

export default injectIntl(PwTable);
