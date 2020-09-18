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
import { BIGrid } from 'lz-components-and-utils/lib/index';
import classNames from 'classnames';

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
      isFooterAbsolute: true,
      zoomStatus: 0 // 缩放状态：0 表示处于缩小状态 | 1 表示处于放大状态
    };
  }

  componentDidMount = () => {
    if (this.containerRef) {
      const el = this.containerRef;
      if (el.scrollHeight > el.clientHeight) {
        this.setState({ isFooterAbsolute: false });
      } else {
        this.setState({ isFooterAbsolute: true });
      }
    }
  };

  componentDidMount = () => {
    if (this.containerRef) {
      const el = this.containerRef;
      if (el.scrollHeight > el.clientHeight) {
        this.setState({ isFooterAbsolute: false });
      } else {
        this.setState({ isFooterAbsolute: true });
      }
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

  renderPagination = () => {
    const { isFooterAbsolute } = this.state;
    const { pagination, size, intl } = this.props;
    const rang = getRang(pagination);
    const hasTotal = pagination.current && pagination.total;

    if (pagination) {
      return (
        <div
          className={classNames('pw-table__footer', {
            'pw-table__footer--absolute': isFooterAbsolute
          })}
        >
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

  getContainerRef = node => {
    this.containerRef = node;
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

    const hasStatisticalAnalysis = gridProps.length ? true : false;
    return (
      <div className="pw-table" ref={this.getContainerRef}>
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
            {hasActionBar && (
              <div
                className={`pw-table__action-bar pw-table__action-bar--${size}`}
              >
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
