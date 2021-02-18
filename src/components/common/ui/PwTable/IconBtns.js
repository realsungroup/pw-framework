import React from 'react';
import {
  Icon,
  Tooltip,
  Dropdown,
  Menu,
  Input,
  Checkbox,
  Button,
  message
} from 'antd';
import IconWithTooltip from '../IconWithTooltip';
import memoizeOne from 'memoize-one';
import { debounce } from 'lodash';

const iconSizeMap = {
  large: 20,
  middle: 18,
  small: 16
};

/**
 * 字体图标按钮
 */
export default class IconBtns extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      showColumns: [],
      columnValue: '',
      columnsCheckedMap: {},
      isCheckedAll: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    if ('columns' in props && !state.columns.length) {
      const { columns } = props;
      const columnsCheckedMap = {};
      const columnsTitleMap = {};
      columns.forEach(column => {
        if (column.dataIndex !== '操作') {
          columnsCheckedMap[column.fieldName] = false;
          columnsTitleMap[column.fieldName] = column.title;
        }
      });

      const newColumns = columns
        .map(columnsItem => {
          if (columnsItem.dataIndex !== '操作') {
            return { ...columnsItem };
          }
          return false;
        })
        .filter(Boolean);

      return {
        columns: [...newColumns],
        showColumns: [...newColumns],
        columnsCheckedMap,
        columnsTitleMap
      };
    }
  }

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

  getChecked = memoizeOne(columnsCheckedMap => {
    if (!columnsCheckedMap) {
      return { isCheckedAll: false, isSomeChecked: false };
    }
    const keys = Object.keys(columnsCheckedMap);
    // 所有的都选中了
    const isCheckedAll = keys.every(key => columnsCheckedMap[key]);
    // 至少选中了 1 个
    const isSomeChecked = keys.some(key => columnsCheckedMap[key]);
    return { isCheckedAll, isSomeChecked };
  });

  handleCheckAllChange = e => {
    const checked = e.target.checked;

    const { columnsCheckedMap } = this.state;
    const newColumnsCheckedMap = {};
    const keys = Object.keys(columnsCheckedMap);
    keys.forEach(key => {
      newColumnsCheckedMap[key] = checked;
    });

    this.setState({ columnsCheckedMap: newColumnsCheckedMap });
  };

  handleDownloadPart = () => {
    const { columnsCheckedMap } = this.state;
    const { onDownload } = this.props;

    const downloadColumns = [];

    Object.keys(columnsCheckedMap).forEach(key => {
      if (columnsCheckedMap[key]) {
        downloadColumns.push(key);
      }
    });

    if (!downloadColumns.length) {
      return message.error('您还未选择列');
    }

    onDownload && onDownload(downloadColumns);
  };

  handleDownloadAll = () => {
    const { onDownload } = this.props;
    onDownload && onDownload();
  };

  render() {
    const {
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
      hasStatisticalAnalysis,
      isShowGrid
    } = this.props;

    const { showColumns, columnValue, columnsCheckedMap } = this.state;

    const { isCheckedAll, isSomeChecked } = this.getChecked(columnsCheckedMap);

    return (
      <React.Fragment>
        {hasStatisticalAnalysis && (
          <Tooltip
            className="pw-table__header-icon"
            placement="top"
            title={isShowGrid ? '表格数据' : '统计分析'}
            onClick={onStatisticalAnalysis}
          >
            <Icon
              type={isShowGrid ? 'table' : 'bar-chart'}
              style={{ fontSize: iconSizeMap[size] }}
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
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={this.handleDownloadAll}>
                  导出全部列
                </Menu.Item>
                <Menu.SubMenu title="导出指定列">
                  <div className="pw-table__columns-wrapper">
                    <Input
                      placeholder="输入关键字搜索表格列名"
                      value={columnValue}
                      onChange={this.handleColumnValueChange}
                    ></Input>
                    <div className="pw-table__columns-title">请勾选导出项</div>

                    <div className="pw-table__columns">
                      <label className="pw-table__columns-item" key="全选">
                        <Checkbox
                          checked={isCheckedAll}
                          indeterminate={isSomeChecked && !isCheckedAll}
                          onChange={this.handleCheckAllChange}
                        ></Checkbox>
                        <div className="pw-table__columns-item-title">全选</div>
                      </label>

                      <div className="pw-table__columns-list">
                        {showColumns.map(columnItem => (
                          <label
                            className="pw-table__columns-item"
                            key={columnItem.fieldName}
                            title={columnItem.title}
                          >
                            <Checkbox
                              checked={columnsCheckedMap[columnItem.fieldName]}
                              onChange={e =>
                                this.handleCheckboxChange(
                                  e.target.checked,
                                  columnItem.fieldName
                                )
                              }
                            ></Checkbox>
                            <div className="pw-table__columns-item-title">
                              {columnItem.title}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pw-table__columns-footer">
                      <Button
                        block
                        type="primary"
                        onClick={this.handleDownloadPart}
                      >
                        确认
                      </Button>
                    </div>
                  </div>
                </Menu.SubMenu>
              </Menu>
            }
            placement="bottomRight"
          >
            <i
              className="iconfont pw-table__header-icon icon-export"
              style={{ cursor: 'pointer', fontSize: iconSizeMap[size] }}
            />
          </Dropdown>
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
}
