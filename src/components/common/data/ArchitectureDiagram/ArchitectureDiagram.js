import React from 'react';
import {
  Icon,
  Breadcrumb,
  Alert,
  message,
  Modal,
  Spin,
  Timeline,
  Drawer
} from 'antd';
import './ArchitectureDiagram.less';
import add1 from './svg/同级.svg';
import add2 from './svg/子级.svg';
import selfDefine from './svg/自定义卡片.svg';
import http, { makeCancelable } from 'Util20/api';
import FormData from '../FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';

const selected = 'selected';
const OrgChart = window.OrgChart;
// const BALKANGraph = window.BALKANGraph;
OrgChart.templates.architectureDiagramTemplate = Object.assign(
  {},
  OrgChart.templates.ula
);
OrgChart.templates.architectureDiagramTemplate.node =
  '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect><line x1="0" y1="0" x2="0" y2="120" stroke="#1890FF" stroke-width="2" ></line>';
OrgChart.templates.architectureDiagramTemplate.image = '';
OrgChart.templates.architectureDiagramTemplate.field_0 =
  '<text width="250" class="field_0" style="font-size: 16px;" fill="#000000" x="125" y="51" text-anchor="middle">{val}</text>';
OrgChart.templates.architectureDiagramTemplate.field_1 =
  '<text width="250" class="field_1" style="font-size: 16px;" fill="#000000" x="125" y="76" text-anchor="middle">{val}</text>';

class ArchitectureDiagram extends React.Component {
  state = {
    selectedNode: {}, // 选中项
    addBroVisible: false,
    loading: false,
    viewHistoryDetailVisible: false,
    historyData: [], // 选中项的历史记录
    operation: 'add', // FormData用到的prop
    record: {}, // FormData用到的prop
    breadcrumb: [], //面包屑数据
    currentLevel: this.props.level //当前层级
  };
  async componentDidMount() {
    this.initializeOrgchart();
    await this.getRootNodes();
    let data = await this.getData();
    this.chart.load(data);
  }
  componentWillUnmount() {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
    this.p3 && this.p3.cancel();
    this.p4 && this.p4.cancel();
  }

  /**
   *  初始化orgchart
   * @param {array} data 初始化数据
   * @returns void
   */

  initializeOrgchart = () => {
    const { displayFileds } = this.props;
    this.chart = new OrgChart(
      document.getElementById('architecture-diagram_orgchart'),
      {
        template: 'architectureDiagramTemplate',
        nodeBinding: {
          field_0: displayFileds[0],
          field_1: displayFileds[1]
        },
        // layout: OrgChart.mixed,
        toolbar: {
          layout: true,
          zoom: true,
          fit: true
          // expandAll: false
        },
        nodeMenu: {
          call: {
            text: '设为顶层',
            icon: '<img/>',
            onClick: this.setRootNode
          }
        },

        enableSearch: true,
        onClick: (sender, node) => {
          this.handleNodeClick(sender, node);
          return false;
        },
        tags: {
          selected: selected,
          deleted: 'deleted'
        },
        scaleInitial: 1,
        scaleMin: 0.3,
        mouseScroolBehaviour: OrgChart.action.zoom
      }
    );
  };
  _topRootIds = []; //最顶层节点id
  _rootIds = []; //当前跟节点id
  /**
   * 获取根节点
   */
  getRootNodes = async () => {
    const { baseURL, rootResid, dblinkname, idField } = this.props;
    let httpParams = {};
    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    this.p2 = makeCancelable(
      http(httpParams).getTable({ resid: rootResid, dblinkname })
    );
    let res;
    try {
      res = await this.p2.promise;
    } catch (error) {
      console.error(error);
      return message.error(error.message);
    }
    this._topRootIds = this._rootIds = res.data.map(item => item[idField]);
  };

  _cmscolumninfo = []; // 主表的列定义
  _nodes = []; // 当前所有节点数据
  /**
   * 获取节点数据
   */
  getData = async () => {
    const { resid, baseURL, idField, pidField, level, dblinkname } = this.props;
    const options = {
      resid,
      ColumnOfID: idField,
      ColumnOfPID: pidField,
      ProductIDs: this._rootIds.join(','),
      Levels: level,
      cmswhere: this._cmswhere,
      dblinkname
    };
    try {
      let httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      this.p1 = makeCancelable(http(httpParams).getNodesData(options));
      let res = await this.p1.promise;
      this._cmscolumninfo = res.cmscolumninfo;
      let nodes = res.nodes.map(item => {
        return {
          ...item,
          id: item[idField],
          pid: item[pidField],
          tags: []
        };
      });
      this._nodes = nodes;
      return nodes;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  /**
   * 获取历史数据
   */
  getHistory = async () => {
    const { resid, baseURL, dblinkname, historyResid } = this.props;
    const { selectedNode } = this.state;
    this.p3 && this.p3.cancel();
    let httpParams = {};
    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    this.p3 = makeCancelable(
      http(httpParams).getTableByHostRecord({
        resid,
        subresid: historyResid,
        hostrecid: selectedNode.REC_ID,
        dblinkname
      })
    );
    try {
      const res = await this.p3.promise;
      this.setState({ historyData: res.data });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 计算面包屑数据
   */
  getBreadcrumb = (selectedNode, breadcrumb = []) => {
    if (selectedNode.pid) {
      let fooNode = this._nodes.find(item => {
        return item.id === selectedNode.pid;
      });
      if (fooNode) {
        breadcrumb.unshift(selectedNode);
        this.getBreadcrumb(fooNode, breadcrumb);
      }
    } else {
      breadcrumb.unshift(selectedNode);
    }
  };

  /**
   * 添加节点
   */
  handleAdd = level => () => {
    const { pidField, idField } = this.props;
    const { selectedNode } = this.state;
    if (!selectedNode.REC_ID) {
      return message.info('请选择一个卡片');
    }
    let record = {};
    if (level === 'sub') {
      record[pidField] = selectedNode[idField];
      this.getFormData(record);
    } else if (level === 'bro') {
      record[pidField] = selectedNode[pidField];
      this.getFormData(record);
    }
    this.setState({ addBroVisible: true, operation: 'add', record });
  };

  /**
   * 修改节点
   */
  handleModify = () => {
    const { selectedNode } = this.state;
    this.getFormData({ ...selectedNode });
    this.setState({
      addBroVisible: true,
      operation: 'modify',
      record: { ...selectedNode }
    });
  };

  /**
   * 点击节点
   */
  handleNodeClick = (chart, node) => {
    if (!chart.get(node.id)) {
      this.setRootNode(node.id);
    }
    if (node.tags && node.tags.includes(selected)) {
      return;
    }
    console.log(chart);
    this.setState({ selectedNode: node }, this.getHistory);
    let findNodes = chart.find(selected);
    if (findNodes.length) {
      findNodes.forEach(item => {
        chart.removeNodeTag(item.id, selected);
      });
    }
    chart.addNodeTag(node.id, selected);
    chart.draw();
    let breadcrumb = [];
    this.getBreadcrumb(node, breadcrumb);
    this.setState({ breadcrumb });
    chart.center(node.id, {
      rippleId: node.id,
      vertical: true,
      horizontal: true
    });
  };

  /**
   * 获取主表窗体数据
   */
  getFormData = async record => {
    let res;
    try {
      const { resid, baseURL } = this.props;
      this.setState({ loading: true });
      let httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      res = await http(httpParams).getFormData({
        resid: resid,
        formName: 'default'
      });
      const formData = dealControlArr(res.data.columns);
      this._dataProp = getDataProp(formData, record, true, false, false);
    } catch (err) {
      console.log(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
  };

  /**
   * 获取历史表窗体数据
   */
  getHistoryFormData = async record => {
    let res;
    try {
      const { historyResid, baseURL } = this.props;
      this.setState({ loading: true });
      let httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      res = await http(httpParams).getFormData({
        resid: historyResid,
        formName: 'default'
      });
      const formData = dealControlArr(res.data.columns);
      this._historyDataProp = getDataProp(formData, record, true, false, false);
    } catch (err) {
      console.log(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
  };

  /**
   * 设置某个节点为根节点
   */
  setRootNode = nodeId => {
    const node =
      this.chart.get(nodeId) || this._nodes.find(item => item.id === nodeId);
    let nodes = [node];
    this.calcSubNodes([node], nodes, this._nodes);
    this.chart.load(nodes);
  };

  calcSubNodes = (calcNode, subNodes, allNodes) => {
    //仍有要计算子节点的数据
    if (calcNode.length) {
      let filterNodes = allNodes.filter(item => {
        return calcNode.some(i => i.id === item.pid);
      });
      subNodes.push(...filterNodes);
      this.calcSubNodes(filterNodes, subNodes, allNodes);
    }
  };

  closeBroModal = () => this.setState({ addBroVisible: false });
  viewHistoryDetail = () => {
    this.setState({ viewHistoryDetailVisible: true });
    this.getHistoryFormData();
  };
  closeHistoryDetail = () => this.setState({ viewHistoryDetailVisible: false });

  /**
   * 保存成功后的回调函数
   */
  afterSave = (operation, formData, record, form) => {
    const { pidField, idField } = this.props;
    this.closeBroModal();
    if (operation === 'add') {
      this.chart.addNode({
        ...record,
        id: record[idField],
        pid: record[pidField],
        tags: []
      });
    } else if (operation === 'modify') {
      let node = {
        ...record,
        id: record[idField],
        pid: record[pidField],
        tags: [selected]
      };
      this.setState({ selectedNode: node });
      this.chart.updateNode(node);
    }
  };

  loadNextLevel = async () => {
    const { resid, idField, pidField, baseURL, dblinkname } = this.props;
    let httpParams = {};
    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    const options = {
      resid,
      Levels: 1,
      ColumnOfID: idField,
      ColumnOfPID: pidField,
      ProductIDs: this._rootIds.join(','),
      cmswhere: this._cmswhere,
      dblinkname
    };
    this.p4 = makeCancelable(http(httpParams).getNodesData(options));
    let res;
    try {
      res = await this.p4.promise;
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    if (!res.nodes) {
      return message.info('没有更多数据');
    }
  };

  renderHeader = () => {
    return (
      <header className="architecture-diagram_header">
        <div className="architecture-diagram_header_icon-button-group">
          <div className="architecture-diagram_header_icon-button">
            <Icon
              type="redo"
              className="architecture-diagram_header_icon-button__icon"
            />
            重置
          </div>
          <div className="architecture-diagram_header_icon-button">
            <Icon
              type="save"
              className="architecture-diagram_header_icon-button__icon"
            />
            保存
          </div>
        </div>
        <div className="architecture-diagram_header_icon-button-group">
          <div className="architecture-diagram_header_icon-button">
            <Icon
              type="apartment"
              className="architecture-diagram_header_icon-button__icon"
            />
            图形化
          </div>
          <div className="architecture-diagram_header_icon-button">
            <Icon
              type="table"
              className="architecture-diagram_header_icon-button__icon"
            />
            表格化
          </div>
        </div>
        <div className="architecture-diagram_header_icon-button-group">
          <div
            className="architecture-diagram_header_icon-button"
            onClick={this.handleAdd('sub')}
          >
            <img
              src={add1}
              className="architecture-diagram_header_icon-button__icon"
              alt=""
            />
            添加子级
          </div>
          <div
            className="architecture-diagram_header_icon-button"
            onClick={this.handleAdd('bro')}
          >
            <img
              src={add2}
              className="architecture-diagram_header_icon-button__icon"
              alt=""
            />
            添加同级
          </div>
          <div
            className="architecture-diagram_header_icon-button"
            onClick={this.handleModify}
          >
            <Icon
              type="edit"
              className="architecture-diagram_header_icon-button__icon"
            />
            修改
          </div>
          <div className="architecture-diagram_header_icon-button delete-button">
            <Icon
              type="delete"
              className="architecture-diagram_header_icon-button__icon"
            />
            删除
          </div>
        </div>
        <div className="architecture-diagram_header_icon-button-group">
          <div className="architecture-diagram_header_icon-button">
            <img
              src={selfDefine}
              className="architecture-diagram_header_icon-button__icon"
              alt=""
            />
            自定义卡片
          </div>
        </div>
        <div className="architecture-diagram_header_icon-button-group">
          <div className="architecture-diagram_header_icon-button">
            加载下一层
          </div>
        </div>
      </header>
    );
  };

  renderBreadcrumb = () => {
    const { breadcrumb } = this.state;
    const { displayFileds } = this.props;
    return (
      <Breadcrumb separator=">">
        {breadcrumb.map(item => {
          return (
            <Breadcrumb.Item
              onClick={() => {
                this.handleNodeClick(this.chart, item);
              }}
              key={item.id}
            >
              {item[displayFileds[0]]}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    );
  };

  render() {
    const {
      selectedNode,
      addBroVisible,
      historyData,
      viewHistoryDetailVisible,
      operation,
      record
    } = this.state;
    const { remarkField } = this.props;
    return (
      <div className="architecture-diagram">
        {this.renderHeader()}
        <div className="architecture-diagram_breadcrumb">
          当前位置：
          {this.renderBreadcrumb()}
        </div>
        <div className="architecture-diagram_main-container">
          <div id="architecture-diagram_orgchart"></div>
          <div className="architecture-diagram_main_sider">
            <div className="architecture-diagram_main_item-detail">
              <div className="architecture-diagram_main_sider_title">
                详细情况
              </div>
              {selectedNode.REC_ID ? (
                <div className="architecture-diagram_main_item-detail_list">
                  {this._cmscolumninfo.map(item => {
                    return (
                      <p
                        key={item.id}
                        className="architecture-diagram_main_item-detail_list_item"
                      >
                        <label>{item.text}：</label>
                        <span>{selectedNode[item.id]}</span>
                      </p>
                    );
                  })}
                </div>
              ) : (
                <div className="architecture-diagram_unselect-tip">
                  <Alert message="您尚未选中任何卡片！" type="info" showIcon />
                </div>
              )}
            </div>
            <div className="architecture-diagram_main_item-history">
              <div className="architecture-diagram_main_sider_title">
                历史情况
              </div>
              <div className="architecture-diagram_change-hsitory_list">
                {selectedNode.REC_ID ? (
                  historyData.length ? (
                    <Timeline>
                      {historyData.map(item => (
                        <Timeline.Item>
                          {item[remarkField]}
                          <a
                            href="javascript::"
                            className="architecture-diagram_change-hsitory_list__view-button"
                            onClick={this.viewHistoryDetail}
                          >
                            查看
                          </a>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  ) : (
                    <div className="architecture-diagram_unselect-tip">
                      <Alert message="无历史记录" type="info" showIcon />
                    </div>
                  )
                ) : (
                  <div className="architecture-diagram_unselect-tip">
                    <Alert
                      message="您尚未选中任何卡片！"
                      type="info"
                      showIcon
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Modal
          visible={addBroVisible}
          title="添加节点"
          width={800}
          footer={null}
          onCancel={this.closeBroModal}
          destroyOnClose
        >
          <FormData
            info={{ dataMode: 'main', resid: this.props.resid }}
            operation={operation}
            data={this._dataProp}
            record={record}
            // useAbsolute={true}
            // formProps={{ width: 500 }}
            onCancel={this.closeBroModal}
            onSuccess={this.afterSave}
            baseURL={this.props.baseURL}
          />
        </Modal>
        <Drawer
          visible={viewHistoryDetailVisible}
          onClose={this.closeHistoryDetail}
          destroyOnClose
          width={800}
        >
          <FormData
            info={{ dataMode: 'main', resid: this.props.historyResid }}
            operation="view"
            data={this._historyDataProp}
            // record={}
            useAbsolute={true}
            // formProps={{ width: 500 }}
            baseURL={this.props.baseURL}
          />
        </Drawer>
      </div>
    );
  }
}

export default ArchitectureDiagram;
