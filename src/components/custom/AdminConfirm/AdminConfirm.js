import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, Popconfirm, message, Spin, Modal, Input } from 'antd';
import LzAdvSearch from '../../../lib/unit-component/LzTable/LzAdvSearch';
import IconWithTooltip from '../../../pages/components/IconWithTooltip';
import http from 'Util20/api';
import {
  getMainTableData,
  getColumnsDefine,
  getSubTableData,
  getRecord
} from '../../../lib/util/api';
import { clone } from '../../../lib/util/util';
import cloneDeep from 'lodash.clonedeep';
const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03BaseURL;
const downloadURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03DownloadBaseURL;
/**
 * 管理员确认
 */
const { TextArea } = Input;
class AdminConfirm extends React.Component {
  constructor(props) {
    super(props);
    const {
      advSearchConfig,
      height,
      pagination,
      exceptTableInnerHeight
    } = props;
    const paginationState = pagination && cloneDeep(pagination);
    const advSearchVisible = !!(
      advSearchConfig && advSearchConfig.defaultVisible
    );
    this.state = {
      pagination: paginationState,
      loading: false,
      deleteReason: '',
      sendBackReason: null,
      advSearchVisible: false,
      key: '', // 模糊搜索的 key 值
      sortOrder: '', // 后端排序规则：'desc' 降序 | 'asc' 升序
      sortField: '', // 后端排序字段
      record: [],
      cmswhere: ''
    };
  }

  componentDidMount = () => {
    console.log('this.props', this.props)
  }


  // 处理表头数据
  dealColumns = cmscolumninfo => {
    const {
      isSortBE,
      btnsVisible,
      isSortFE,
      startColumns,
      mergeColIndex,
      filters,
      startColumnAdd,
      fixedCols,
      customColumnWidth,
      customColRender
    } = this.props;

    let arr;

    // startColumns
    arr = startColumns.length !== 0 ? [...startColumns] : [];

    this.getWidths(cmscolumninfo);

    // 数据栏
    cmscolumninfo.forEach((column, index) => {
      const opt = {
        title: column.text,
        dataIndex: column.id,
        key: column.id,
        width: this.widths[column.text],
        align: 'left',
        isEditableCell: true // 是否是可以编辑的单元格
      };
      // 开启了后端排序功能且当前列可以排序
      if (isSortBE && this.curColIsSort('be', column)) {
        opt.sorter = true;
      }
      // 开启了前端排序功能且当前列可以排序
      if (isSortFE && this.curColIsSort('fe', column)) {
        opt.text = column.text;
        opt.sorter = true;
      }
      // 过滤功能
      if (filters && Object.keys(filters).indexOf(column.text) !== -1) {
        opt.filters = filters[column.text];
        opt.onFilter = (value, record) =>
          record[column.id].indexOf(value) === 0;
      }

      // 固定在左侧的列
      if (fixedCols && fixedCols.indexOf(column.text) !== -1) {
        opt.fixed = 'left';
      }

      // 指定某列的宽度
      if (customColumnWidth) {
        if (customColumnWidth[column.text]) {
          opt.width = customColumnWidth[column.text];
        }
      }

      // 自定义渲染行：列颜色 / 列数据格式化
      if (Array.isArray(customColRender)) {
        let item;
        if (
          (item = customColRender.find(
            item => item.innerFieldName === column.id
          ))
        ) {
          opt.render = (value, record, rowIndex) => {
            const props = {};
            // 列颜色
            if (item.colors) {
              const obj = item.colors.find(color => color.value === value);
              const color = obj && obj.color;
              props.style = { color };
            }
            // 列数据格式化
            if (item.format) {
              value = item.format(value);
            }
            return <span {...props}>{value}</span>;
          };
        }
      }

      // 列合并功能
      // if (mergeColIndex === 0 || mergeColIndex) {
      //   if (mergeColIndex === index) {
      //     // opt.colSpan = 2;
      //     opt.render = (value, record, rowIndex) => {
      //       return {
      //         children: (
      //           <div
      //             style={{
      //               fontWeight: 'bold',
      //               position: 'relative',
      //               left: '0px',
      //               top: '-10px'
      //             }}
      //           >
      //             {value}
      //           </div>
      //         ),
      //         props: {
      //           colSpan: 1
      //         }
      //       };
      //     };
      //   } else if (mergeColIndex === index - 1) {
      //     opt.colSpan = 0;
      //     opt.render = (value, record, rowIndex) => {
      //       return {
      //         children: (
      //           <div
      //             style={{ position: 'relative', left: '-200px', top: '10px' }}
      //           >
      //             {value}
      //           </div>
      //         ),
      //         props: {
      //           colSpan: 1
      //         }
      //       };
      //     };
      //   }
      // }
      arr.push(opt);
    });

    // 通过 columnCount 来计算 scroll.x 的值
    this.setState({ columnCount: arr.length });
    return arr;
  };

  onSendBack = async record => {
    let res;
    record.C3_591373760332 = '';
    record.C3_617212255449 = this.state.sendBackReason;
    try {
      res = await http({ baseURL }).modifyRecords({
        resid: 605617716920,
        data: [record]
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
    this.setState({
      sendBackReason: null
    });
  };
  onChangeDeleteReason = event => {
    this.setState({
      deleteReason: event.target.value
    });
  };
  onChangeSendBackReason = event => {
    this.setState({
      sendBackReason: event.target.value
    });
  };
  onClearReason = () => {
    this.setState({
      sendBackReason: null,
      deleteReason: null
    });
  };
  onDelete = async record => {
    let res;
    record.C3_591556634215 = 'Y';
    record.C3_617205061601 = this.state.deleteReason;
    if (!this.state.deleteReason) {
      return message.error("请填写删除原因！")
    }
    try {
      res = await http({ baseURL }).modifyRecords({
        resid: 605617716920,
        data: [record]
      });
      console.log('res', res);
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
    this.setState({
      deleteReason: null
    });
    this.tableDataRef.handleRefresh();
  };

  handleDownMaterial = url => {
    if (!url) {
      return Modal.warning({
        title: '您还未上传过资料'
      });
    }
    const urls = url.split(';file;');
    for (let i = 0, len = urls.length; i < len; i++) {
      const obj = JSON.parse(urls[i]);
      window.open(obj.url);
    }
  };
  handleConfirm = async (dataSource, selectedRowKeys) => {
    if (!selectedRowKeys.length) {
      return message.error('请选择记录');
    }
    const { resid } = this.props;
    this.setState({ loading: true });
    const data = selectedRowKeys.map(recid => ({
      REC_ID: recid,
      C3_605619907534: 'Y'
    }));

    let res;
    try {
      res = await http({ baseURL }).modifyRecords({
        resid,
        data
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
    message.success('操作成功');
    this.tableDataRef.handleRefresh();
  };


  getRecord = async (wheres) => {
    let options = {
      key: '',
      sortOrder: '',
      sortField: '',
      pageindex: 0,
      pageSize: 10,
      cmswhere: wheres
    }
    let res;
    const { resid, mtsid } = this.props;
    console.log("options", options)
    try {
      res = await getMainTableData(
        resid,
        mtsid,
        options
      );
    } catch (error) {
      message.error(error.message);
    }
    this.setState({
      record: res.data,
      cmswhere: wheres
    })
    this.forceUpdate()
  };

  handleConfirm = async (dataSource, selectedRowKeys) => {
    if (!selectedRowKeys.length) {
      return message.error('请选择记录');
    }
    const { resid } = this.props;
    this.setState({ loading: true });
    const data = selectedRowKeys.map(recid => ({
      REC_ID: recid,
      C3_605619907534: 'Y'
    }));

    let res;
    try {
      res = await http({ baseURL }).modifyRecords({
        resid,
        data
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
    message.success('操作成功');
    this.tableDataRef.handleRefresh();
  };

  conditionChange = async wheres => {
    console.log('wheres', wheres);
    this.wheres = wheres;
    const { pagination } = this.state;
    let o = {};
    if (pagination) {
      o.current = 0;
      o.pageSize = pagination.pageSize;
    }
    this.setState({ loading: true });
    await this.getRecord(wheres);
    this.setState({ loading: false });
  };

  getTableData = async (
    options = {
      ...{
        key: '',
        sortOrder: '',
        sortField: ''
      },
      ...(this.state.pagination || {})
    },
    cmswhere
  ) => {
    options = {
      ...{
        key: this.state.key,
        sortOrder: this.state.sortOrder,
        sortField: this.state.sortField
      },
      ...options
    };

    let res;
    // 主表数据
    if (this.props.dataMode === 'main') {
      const { resid, cmscolumns, mtsid } = this.props;
      if (this.props.cmswhere) {
        cmswhere = `${cmswhere ? cmswhere + ' and ' : ''} ${
          this.props.cmswhere
          }`;
      }
      try {
        res = await getMainTableData(
          resid,
          mtsid,
          Object.assign(options, { cmswhere, cmscolumns })
        );
      } catch (err) {
        this.setState({ loading: false });

        return message.error(err.message);
      }
      // 子表数据
    } else {
      const { resid, subresid, hostrecid, cmscolumns, operation } = this.props;
      if (this.props.cmswhere) {
        cmswhere = `${cmswhere ? cmswhere + ' and ' : ''} ${
          this.props.cmswhere
          }`;
      }
      if (operation === 'add') {
        res = await getColumnsDefine(subresid);
      } else if (operation !== 'add' && hostrecid !== 0) {
        try {
          res = await getSubTableData(
            resid,
            subresid,
            hostrecid,
            Object.assign(options, { cmswhere, cmscolumns })
          );
        } catch (err) {
          this.setState({ loading: false });

          return message.error(err.message);
        }
      } else {
        return;
      }
    }
    console.log('cmscolumninfo', res.cmscolumninfo);
    let tableData, columns;
    if (this.props.operation === 'add') {
      tableData = [];
    } else {
      tableData = this.dealTableData(res.data);
    }
    columns = this.dealColumns(res.cmscolumninfo);

    const originTableData = clone(tableData);
    // 前端排序开启了，才需要 this.state.originOrderTableData
    let originOrderTableData;
    if (this.props.isSortFE) {
      originOrderTableData = clone(tableData);
    }
    // 开启了分页功能
    let pagination;
    if (this.props.pagination) {
      pagination = {
        ...this.state.pagination,
        ...{
          pageSize: options.pageSize,
          current: options.current + 1,
          total: res.total,
          showTotal: total => <div>总共 {total} 条记录</div>
        }
      };
    }
    this.setState(
      Object.assign(
        this.state,
        {
          originCmscolumninfo: res.cmscolumninfo,
          columns,
          tableData,
          originTableData,
          originOrderTableData: originOrderTableData || [],
          key: options.key
        },
        pagination ? { pagination } : {}
      )
    );
    this.props.getTableData && this.props.getTableData(tableData, res.total);
  };

  // 处理表格数据
  dealTableData = tableData => {
    switch (this.props.viewMode) {
      case 'table': {
        const { btnsVisible, editableRow, dataMode } = this.props;
        const { editingRecIds } = this.state;
        // 主表
        if (dataMode === 'main') {
          tableData.forEach((item, index) => {
            item.btnsVisible = { ...btnsVisible };
            // 未开启行编辑功能
            if (!editableRow) {
              item.btnsVisible.edit = false;
              item.btnsVisible.save = false;
              item.btnsVisible.cancel = false;
            } else if (editableRow) {
              // 开启了多行编辑功能

              item.btnsVisible.save = false;
              item.btnsVisible.cancel = false;
              editingRecIds.some(recid => {
                if (item.REC_ID === recid) {
                  item.btnsVisible.save = true;
                  item.btnsVisible.cancel = true;
                  item.btnsVisible.edit = false;
                  item.btnsVisible.mod = false;
                  item.btnsVisible.check = false;
                  item.btnsVisible.del = false;
                  return true;
                }
              });
            }
            // 记录的索引
            item.index = index;
          });
        } else {
          // 子表
          tableData.forEach((item, index) => {
            item.btnsVisible = { ...btnsVisible };
            // 未开启行编辑功能
            if (!editableRow) {
              item.btnsVisible.edit = false;
              item.btnsVisible.save = false;
              item.btnsVisible.cancel = false;
            } else if (editableRow) {
              // 开启了多行编辑功能
              item.btnsVisible.save = false;
              item.btnsVisible.cancel = false;
              editingRecIds.some(recid => {
                if (item.REC_ID === recid) {
                  item.btnsVisible.save = false;
                  item.btnsVisible.cancel = true;
                  item.btnsVisible.edit = false;
                  item.btnsVisible.mod = false;
                  item.btnsVisible.check = false;
                  item.btnsVisible.del = false;
                  return true;
                }
              });
            }
            // 记录的索引
            item.index = index;
          });
        }
        break;
      }
      case 'cards': {
        break;
      }
      case 'forms': {
        tableData.forEach(item => {
          item.viewStatus = 'view';
        });
      }
    }

    return tableData;
  };

  renderAdvSearchBtn = () => {
    return (
      <IconWithTooltip
        tip="高级搜索"
        className="btn"
        iconClass="icon-adv-search"
        style={{
          position: 'absolute',
          zIndex: '99',
          right: '125px',
          top: '18px'
        }}
        onClick={() => {
          this.setState({
            advSearchVisible: true
          });
        }}
      />
    );
  };
  renderActionBarExtra = ({ dataSource, selectedRowKeys }) => {
    return (
      <Popconfirm
        title="您确定要操作吗？"
        placement="bottom"
        onConfirm={() => this.handleConfirm(dataSource, selectedRowKeys)}
      >
        <Button>确认</Button>
      </Popconfirm>
    );
  };

  closeAdvSearch = () => {
    this.setState({ advSearchVisible: false });
  };


  render() {
    const { loading, advSearchVisible } = this.state;
    const { advSearchConfig, lzAdvSearchStyle } = this.props;
    return (
      <Spin spinning={loading}>
        <div style={{ height: '100vh' }}>
          {advSearchConfig && this.renderAdvSearchBtn()}
          <TableData
            {...this.props}
            baseURL={baseURL}
            downloadBaseURL={downloadURL}
            actionBarExtra={this.renderActionBarExtra}
            wrappedComponentRef={element => (this.tableDataRef = element)}
            refTargetComponentName="TableData"
            customRowBtns={[
              record => {
                return (
                  <Button
                    onClick={() => {
                      this.handleDownMaterial(record.C3_590515131157 || record.C3_590516276367);
                    }}
                  >
                    下载查阅
                  </Button>
                );
              },
              record => {
                return (
                  <Popconfirm
                    title={
                      <React.Fragment>
                        <span>请输入退回原因</span>
                        <TextArea
                          value={this.state.sendBackReason}
                          onChange={this.onChangeSendBackReason}
                        ></TextArea>
                      </React.Fragment>
                    }
                    onConfirm={() => this.onSendBack(record)}
                    onCancel={() => {
                      this.onClearReason();
                    }}
                  >
                    <Button>退回</Button>
                  </Popconfirm>
                );
              },
              record => {
                return (
                  <Popconfirm
                    title={
                      <React.Fragment>
                        <span>请输入删除原因</span>
                        <TextArea
                          value={this.state.deleteReason}
                          onChange={this.onChangeDeleteReason}
                        ></TextArea>
                      </React.Fragment>
                    }
                    onConfirm={() => this.onDelete(record)}
                  >
                    <Button>删除</Button>
                  </Popconfirm>
                );
              }
            ]}
            dataSource={this.state.record}
            cmswhere={this.state.cmswhere}
          />
          {advSearchConfig && (
            <LzAdvSearch
              advSearchConfig={advSearchConfig}
              conditionChange={this.conditionChange}
              advSearchVisible={advSearchVisible}
              onClose={this.closeAdvSearch}
              style={lzAdvSearchStyle}
            />
          )}
        </div>
      </Spin>
    );
  }
}

export default AdminConfirm;
