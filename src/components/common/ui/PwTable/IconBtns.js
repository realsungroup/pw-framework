import React from 'react';
import { Icon, Tooltip } from 'antd';
import IconWithTooltip from '../IconWithTooltip';

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
    hasImport,
    onImport,
    onDownload,
    hasRefresh,
    onRefresh,
    hasAdvSearch,
    onAdvSearch,
    hasZoomInOut,
    zoomStatus,
    onZoomIn,
    onZoomOut,
    size,
    onStatisticalAnalysis,
    hasStatisticalAnalysis
  }) => {
    return (
      <React.Fragment>
        {hasStatisticalAnalysis && (
          <Tooltip
            className="pw-table__header-icon"
            placement="top"
            title="统计分析"
            onClick={onStatisticalAnalysis}
          >
            <Icon
              type="bar-chart"
              style={{ fontSize: iconSizeMap[size], color: 'green' }}
            />
          </Tooltip>
        )}

        {hasImport && (
          <IconWithTooltip
            className="pw-table__header-icon"
            tip="导入"
            iconClass="icon-import"
            onClick={onImport}
            style={{ fontSize: iconSizeMap[size] }}
          />
        )}
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
        {hasZoomInOut && zoomStatus === 0 && (
          <IconWithTooltip
            className="pw-table__header-icon"
            tip="放大"
            iconClass="icon-scale-max"
            onClick={onZoomIn}
            style={{ fontSize: iconSizeMap[size] }}
          />
        )}
        {hasZoomInOut && zoomStatus === 1 && (
          <IconWithTooltip
            className="pw-table__header-icon"
            tip="缩小"
            iconClass="icon-scale-normal"
            onClick={onZoomOut}
            style={{ fontSize: iconSizeMap[size] }}
          />
        )}
      </React.Fragment>
    );
  }
);
export default IconBtns;
