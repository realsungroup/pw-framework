import React from 'react';
import { Icon, Breadcrumb, Alert, message, Modal, Spin } from 'antd';
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
  '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect><line x1="0" y1="" x2="0" y2="120" stroke="#1890FF" stroke-width="2" ></line>';
OrgChart.templates.architectureDiagramTemplate.image = '';
OrgChart.templates.architectureDiagramTemplate.field_0 =
  '<text width="250" class="field_0" style="font-size: 16px;" fill="#000000" x="125" y="51" text-anchor="middle">{val}</text>';
OrgChart.templates.architectureDiagramTemplate.field_1 =
  '<text width="250" class="field_1" style="font-size: 16px;" fill="#000000" x="125" y="76" text-anchor="middle">{val}</text>';

class ArchitectureDiagram extends React.Component {
  state = {
    selectedNode: {},
    addBroVisible: false,
    addSubVisible: false,
    loading: false
  };
  async componentDidMount() {
    this.getFormData();
    this.initializeOrgchart();
    let data = await this.getData();
    this.chart.load([
      ...data,
      {
        id: 12345,
        C3_227192484125: '兰发华',
        C3_417990929305: '老大',
        tags: []
      }
    ]);
  }
  componentWillUnmount() {
    this.p1 && this.p1.cancel();
  }

  /**
   *  初始化orgchart
   * @param data 初始化数据
   * @returns void
   */

  initializeOrgchart = data => {
    this.chart = new OrgChart(
      document.getElementById('architecture-diagram_orgchart'),
      {
        template: 'architectureDiagramTemplate',
        nodeBinding: {
          field_0: 'C3_227192484125',
          field_1: 'C3_417990929305'
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
          this.setState({ selectedNode: node });
          let nodes = [...sender.config.nodes];
          nodes = nodes.filter(item => node.id !== item.id);
          nodes.forEach(item => {
            let index = item.tags.findIndex(item => item === 'selected');
            if (index > -1) {
              item.tags.splice(index, 1);
              sender.update(item);
            }
          });
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
        // nodes: [
        //   ...data,
        //   {
        //     id: 12345,
        //     C3_227192484125: '兰发华',
        //     C3_417990929305: '老大',
        //     tags: []
        //   }
        // ]
      }
    );
  };

  _cmscolumninfo = [];
  getData = async () => {
    const { resid, baseURL, historyResid } = this.props;
    try {
      let httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      this.p1 = makeCancelable(
        http(httpParams).getRecordAndSubTables({
          resid,
          subresid: historyResid,
          getcolumninfo: 1 // 需要这个参数为 1，才能获取到字段信息
        })
      );
      let res = await this.p1.promise;
      this._cmscolumninfo = res.cmscolumninfo;
      return res.data.map(item => {
        return {
          ...item,
          id: item.C3_305737857578,
          pid: item.C3_417993417686,
          tags: []
        };
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  handleAdd = level => () => {
    console.log(level);
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
        formName: 'add1'
      });
      const formData = dealControlArr(res.data.columns);
      this._dataProp = getDataProp(formData, {}, true, false, false);
    } catch (err) {
      console.log(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
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
          <div className="architecture-diagram_header_icon-button">
            <img
              src={add1}
              className="architecture-diagram_header_icon-button__icon"
              alt=""
              onClick={this.handleAdd('sub')}
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
    const { selectedNode, addBroVisible, addSubVisible, loading } = this.state;
    const { historyResid } = this.props;
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
              {selectedNode.C3_305737857578 ? (
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
                {selectedNode.C3_305737857578 ? (
                  selectedNode[historyResid].map(item => {
                    return (
                      <div className="architecture-diagram_change-hsitory">
                        <p className="architecture-diagram_change-hsitory_item">
                          <label>时间：</label>
                          <span>{item.C3_470524257391}</span>
                        </p>
                        <p className="architecture-diagram_change-hsitory_item">
                          <label>备注：</label>
                          <span>sdfsdfsdfsasadsafffffffffffff</span>
                        </p>
                      </div>
                    );
                  })
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
          title="添加同级"
          width="90%"
          onCancel={() => this.setState({ addBroVisible: false })}
        >
          <FormData
            info={{ dataMode: 'main', resid: this.props.resid }}
            operation="view"
            data={this._dataProp}
            record={{}}
            useAbsolute={true}
            formProps={{ width: 1000 }}
          />
        </Modal>
        <Modal visible={addSubVisible} title="添加子级">
          <FormData />
        </Modal>
      </div>
    );
  }
}

export default ArchitectureDiagram;
