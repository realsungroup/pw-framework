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
    selectedNode: {},
    addBroVisible: false,
    loading: false,
    viewHistoryDetailVisible: false,
    historyData: []
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
        layout: OrgChart.mixed,
        toolbar: {
          layout: true,
          zoom: true,
          fit: true
          // expandAll: false
        },
        enableSearch: true,
        onClick: (sender, node) => {
          if (node.tags && node.tags.includes('selected')) {
            return false;
          }
          this.setState({ selectedNode: node }, this.getHistory);
          const nodes = [...sender.config.nodes]; //所有节点
          let _selectedNode = nodes.find(node => {
            return node.tags.includes('selected');
          });
          // if (_selectedNode) {
          //   sender.removeNodeTag(_selectedNode.id, 'selected');
          //   sender.updateNode(_selectedNode);
          // }
          if (_selectedNode) {
            let index = _selectedNode.tags.findIndex(
              item => item === 'selected'
            );
            if (index > -1) {
              _selectedNode.tags.splice(index, 1);
              sender.update(_selectedNode);
            }
          }
          let selectedNode = { ...node, tags: [...node.tags, 'selected'] };
          sender.update(selectedNode);
          sender.draw();
          return false;
        },
        tags: {
          selected: 'selected',
          deleted: 'deleted'
        },
        scaleInitial: 1,
        scaleMin: 0.3,
        mouseScroolBehaviour: OrgChart.action.zoom
      }
    );
  };

  _rootIds = [];
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
    this._rootIds = res.data.map(item => item[idField]);
  };

  _cmscolumninfo = [];
  _nodes = [];
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
    // getTableByHostRecord
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

  handleAdd = level => () => {
    const { pidField, idField } = this.props;
    const { selectedNode } = this.state;
    if (!selectedNode.REC_ID) {
      return message.info('请选择一个卡片');
    }
    if (level === 'sub') {
      this.getFormData({ [pidField]: selectedNode[idField] });
    } else if (level === 'bro') {
      this.getFormData({ [pidField]: selectedNode[pidField] });
    }
    this.setState({ addBroVisible: true });
  };

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

  closeBroModal = () => this.setState({ addBroVisible: false });

  viewHistoryDetail = () => this.setState({ viewHistoryDetailVisible: true });
  closeHistoryDetail = () => this.setState({ viewHistoryDetailVisible: false });

  afterSave = (operation, formData, record, form) => {
    const { pidField, idField } = this.props;
    this.closeBroModal();
    this.chart.addNode({
      ...record,
      id: record[idField],
      pid: record[pidField],
      tags: []
    });
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
      </header>
    );
  };

  render() {
    const {
      selectedNode,
      addBroVisible,
      historyData,
      viewHistoryDetailVisible
    } = this.state;
    const { remarkField } = this.props;
    return (
      <div className="architecture-diagram">
        {this.renderHeader()}
        <div className="architecture-diagram_breadcrumb">
          当前位置：
          <Breadcrumb separator=">">
            <Breadcrumb.Item>菲尼撒（无锡）</Breadcrumb.Item>
            <Breadcrumb.Item>产品部</Breadcrumb.Item>
          </Breadcrumb>
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
        >
          <FormData
            info={{ dataMode: 'main', resid: this.props.resid }}
            operation="add"
            data={this._dataProp}
            // record={}
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
        ></Drawer>
      </div>
    );
  }
}

export default ArchitectureDiagram;
