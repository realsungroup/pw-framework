import React from 'react';
import {
  Icon,
  Breadcrumb,
  Alert,
  message,
  Modal,
  Spin,
  Timeline,
  Drawer,
  Switch,
  Select,
  Form,
  Button,
  DatePicker,
  InputNumber,
  notification,
  Tabs
} from 'antd';
import './ArchitectureDiagram.less';
import add1 from './svg/同级.svg';
import add2 from './svg/子级.svg';
import avatarDef from './svg/avatar.svg';
import selfDefine from './svg/自定义卡片.svg';
import http, { makeCancelable } from 'Util20/api';
import FormData from '../FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { clone, getIntlVal } from 'Util20/util';
import TableData from '../TableData';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { defaultProps, propTypes } from './propTypes';
import moment from 'moment';
import withImport from '../../hoc/withImport';
import withModalDrawer from '../../hoc/withModalDrawer';

const selected = 'selected';
const OrgChart = window.OrgChart;
// const BALKANGraph = window.BALKANGraph;
OrgChart.templates.architectureDiagramTemplate = Object.assign(
  {},
  OrgChart.templates.ula
);
OrgChart.templates.architectureDiagramTemplate.node =
  '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect><line x1="0" y1="0" x2="0" y2="120" stroke="#1890FF" stroke-width="2" ></line>';
OrgChart.templates.architectureDiagramTemplate.img_0 =
  '<clipPath id="ulaImg">' +
  '<circle  cx="50" cy="60" r="20"></circle>' +
  '</clipPath>' +
  '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="10" y="10"  width="40" height="40">' +
  '</image>';
OrgChart.templates.architectureDiagramTemplate.field_0 =
  '<text width="250" class="field_0" style="font-size: 16px;" fill="#000000" x="125" y="51" text-anchor="middle">{val}</text>';
OrgChart.templates.architectureDiagramTemplate.field_1 =
  '<text width="250" class="field_1" style="font-size: 16px;" fill="#000000" x="125" y="76" text-anchor="middle">{val}</text>';

class ArchitectureDiagram extends React.Component {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  state = {
    selectedNode: {}, // 选中项
    addBroVisible: false,
    selfDefineVisible: false,
    loading: false,
    viewHistoryDetailVisible: false,
    historyData: [], // 选中项的历史记录
    partHistoryData: [],
    operation: 'add', // FormData用到的prop
    record: {}, // FormData用到的prop
    breadcrumb: [], //面包屑数据
    currentLevel: this.props.level, //当前层级
    mode: 'chart', //显示模式：图->chart; 表-> table
    isGrouping: false,
    firstField: this.props.displayFileds.firstField,
    secondaryField: this.props.displayFileds.secondaryField,
    selectedDate: moment(),
    takeEffectDate: '', //生效日期
    detaileMin: false,
    historyMin: false,
    resultMin: false,
    hasImportResult: false,
    detailVisible: false,
    selectedResultResid: '638645137963',
    selectedType: 'IDL'
  };
  async componentDidMount() {
    // await this.getRootNodes();
    if (this.props.hasUnhandleRecords) {
      Modal.error({
        title: '有未处理的记录',
        content: '请尽快处理',
        onOk: () => {
          this.setState(
            { hasImportResult: true, selectedResultResid: '638646009862' },
            () => {
              this.contentRef.scrollTo({
                left: 0,
                top: window.innerHeight,
                behavior: 'smooth'
              });
            }
          );
        },
        onCancel: () => {
          this.setState({ hasImportResult: true }, () => {
            this.contentRef.scrollTo({
              left: 0,
              top: window.innerHeight,
              behavior: 'smooth'
            });
          });
        }
      });
    }
    let data = await this.getData();
    this.initializeOrgchart();
    this.chart.load(data);
    this._nodes = [...this.chart.config.nodes];
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const preNode = prevState.selectedNode;
    const node = this.state.selectedNode;
    if (node.id && preNode !== node) {
      let breadcrumb = [];
      this.getBreadcrumb(node, breadcrumb);
      this.setState({ breadcrumb });
    }
  }

  componentWillUnmount() {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
    this.p3 && this.p3.cancel();
    this.p4 && this.p4.cancel();
    this.p6 && this.p6.cancel();
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
          field_0: displayFileds.firstField,
          field_1: displayFileds.secondaryField,
          img_0: displayFileds.imgField
        },
        collapse: {
          level: this.state.currentLevel
        },
        scaleInitial: 0.5,
        // mouseScrool: OrgChart.action.zoom,
        layout: OrgChart.tree,
        enableDragDrop: true,
        toolbar: {
          layout: true,
          zoom: true,
          fit: true
          // expandAll: false
        },
        menu: {
          pdf: { text: '导出PDF' },
          png: { text: '导出PNG' }
        },
        nodeMenu: {
          setRoot: {
            text: '设为顶层',
            icon: '<img/>',
            onClick: this.setRootNode
          },
          addPerson: {
            text: '添加兼职人员',
            icon: '<img/>',
            onClick: this.openAddModal
          },
          importPerson: {
            text: '从未匹配人员导入',
            icon: '<img/>',
            onClick: this.openImportModal
          },
          clearPerson: {
            text: `<span style='color:red'>清空人员</span>`,
            icon: '<img/>',
            onClick: this.clearPerson
          }
        },

        enableSearch: true,
        onClick: (sender, node) => {
          if (!node) {
            return false;
          }
          this.handleNodeClick(sender, node);
          return false;
        },
        // 更新节点（拖拽）
        onUpdate: this.handleDragNode,
        tags: {
          selected
        },
        scaleMin: 0.3,
        mouseScroolBehaviour: OrgChart.action.zoom
      }
    );
  };

  handleDragNode = (sender, oldNode, newNode) => {
    const { displayFileds, intl } = this.props;
    const newParentNode = this.chart.get(newNode.pid);
    const zhTip = `您确定要将 ${newNode[displayFileds.firstField]} 拖拽到 ${
      newParentNode[displayFileds.firstField]
    } 下面吗？`;
    const enTip = `Are you sure you want to drag ${
      newNode[displayFileds.firstField]
    } under ${newParentNode[displayFileds.firstField]}`;
    Modal.confirm({
      title: getIntlVal(intl.locale, 'Prompt', '提示'),
      content: (
        <div>
          {getIntlVal(intl.locale, enTip, zhTip)}
          <div>生效日期：{this.state.selectedDate.format('YYYY-MM-DD')}</div>
        </div>
      ),
      onOk: () => {
        this.updateNode(newNode);
      }
    });
    return false;
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
    const { resid, baseURL, idField, pidField, procedureConfig } = this.props;
    const { selectedDate, selectedNode } = this.state;
    const options = {
      ...procedureConfig,
      resid,
      paravalues: selectedDate.format('YYYYMMDD')
    };
    this.setState({ loading: true });
    try {
      const httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      this.p1 = makeCancelable(http(httpParams).getByProcedure(options));
      const res = await this.p1.promise;
      this._cmscolumninfo = res.cmscolumninfo;
      this._tags = {};
      let newSelectedNode = {};
      const nodes = res.data.map(item => {
        const tag = item.tagsname;
        this._tags[tag] = {
          group: true,
          groupName: tag,
          groupState: OrgChart.EXPAND,
          template: 'group_grey'
        };
        const tags = [item.tagsname];

        if (item.isScrap === 'Y') {
          tags.push('discard');
        } else if (item.isEmpty === 'Y' && item.isPartOccupied === 'Y') {
          tags.push('tartOccupied');
        } else if (item.isEmpty === 'Y') {
          tags.push('empty');
        }
        if(item.isCreated==='Y'){
          tags.push('created')
        }
          let ImgObj = new Image(); //判断图片是否存在  
          ImgObj.src = item.memberAvatar;  
          let url;
          //没有图片，则返回-1  
          if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {  
            url = item.memberAvatar;
          } else {  
            url=avatarDef
          }  

        const node = {
          ...item,
          id: item[idField],
          pid: item[pidField],
          memberAvatar:url,
          tags
        };
        if (selectedNode.id === item[idField]) {
          node.tags.push(selected);
          newSelectedNode = node;
        }
        return node;
      });
      this.setState({ loading: false, selectedNode: newSelectedNode });
      return nodes;
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
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
        dblinkname,
        getcolumninfo: 1
      })
    );
    try {
      const res = await this.p3.promise;
      if (!this._historyColinfo) {
        this._historyColinfo = res.cmscolumninfo;
      }
      this.setState({ historyData: res.data });
    } catch (error) {
      console.error(error);
    }
  };

  _partHistoryColinfo = [];
  /**
   * 获取历史兼职数据
   */
  getPartHistory = async () => {
    const { baseURL, dblinkname, historyResid } = this.props;
    const { selectedNode } = this.state;
    this.p6 && this.p6.cancel();
    let httpParams = {};
    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    this.p6 = makeCancelable(
      http(httpParams).getTableByHostRecord({
        resid: '639083780814',
        subresid: historyResid,
        hostrecid: selectedNode.REC_ID,
        dblinkname,
        getcolumninfo: 1
      })
    );
    try {
      const res = await this.p6.promise;
      if (!this._partHistoryColinfo.length) {
        this._partHistoryColinfo = res.cmscolumninfo;
      }
      this.setState({ partHistoryData: res.data });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 计算面包屑数据
   */
  getBreadcrumb = (selectedNode, breadcrumb = []) => {
    if (selectedNode.pid) {
      const fooNode = this._nodes.find(item => {
        return item.id === selectedNode.pid;
      });
      if (fooNode) {
        breadcrumb.unshift(selectedNode);
        this.getBreadcrumb(fooNode, breadcrumb);
      } else {
        breadcrumb.unshift(selectedNode);
      }
    } else {
      breadcrumb.unshift(selectedNode);
    }
  };

  /**
   * 添加节点
   */
  handleAdd = level => () => {
    const { pidField, idField, createWindowName } = this.props;
    const { selectedNode, selectedDate } = this.state;
    if (!selectedNode.REC_ID) {
      return message.info('请选择一个卡片');
    }
    let record = {};
    if (level === 'sub') {
      record[pidField] = selectedNode[idField];
      record.updateDate = selectedDate;
      this.getFormData(record, createWindowName);
    } else if (level === 'bro') {
      record[pidField] = selectedNode[pidField];
      record.updateDate = selectedDate;
      this.getFormData(record, createWindowName);
    }
    this.setState({ addBroVisible: true, operation: 'add', record });
  };

  /**
   * 修改节点
   */
  handleModify = () => {
    const { selectedNode } = this.state;
    const { createWindowName, editWindowName } = this.props;
    if (!selectedNode.REC_ID) {
      return message.info('请选择一个卡片');
    }
    if (selectedNode.isCreated === 'Y') {
      this.getFormData({ ...selectedNode }, createWindowName);
    } else {
      this.getFormData({ ...selectedNode }, editWindowName);
    }
    this.setState({
      addBroVisible: true,
      operation: 'modify',
      record: { ...selectedNode }
    });
  };

  /**
   * 删除节点
   */
  handleDelete = () => {
    const { selectedNode } = this.state;
    if (!selectedNode.REC_ID) {
      return message.info('请选择一个卡片');
    }
    if (selectedNode.isCreated === 'Y') {
      Modal.confirm({
        title: '提示',
        content: '确认删除？',
        onOk: async () => {
          try {
            const { resid, baseURL } = this.props;
            this.setState({ loading: true });
            let httpParams = {};
            // 使用传入的 baseURL
            if (baseURL) {
              httpParams.baseURL = baseURL;
            }
            const res = await http(httpParams).removeRecords({
              resid,
              data: [{ REC_ID: selectedNode.REC_ID }]
            });
            this.chart.removeNode(selectedNode.id);
            this._nodes.splice(
              this._nodes.findIndex(node => node.id === selectedNode.id),
              1
            );
            this.setState({ selectedNode: {}, breadcrumb: [] });
            message.success('删除成功');
            this.setState({ loading: false });
          } catch (error) {
            this.setState({ loading: false });
            message.error(error.message);
            console.log(error);
          }
        }
      });
    } else {
      message.info('该节点无法删除');
    }
  };

  /**
   * 点击节点
   */
  handleNodeClick = (chart, args) => {
    const node = chart.get(args.node.id);
    if (node.tags && node.tags.includes(selected)) {
      return;
    }
    const { selectedNode } = this.state;
    if (selectedNode && selectedNode.id !== undefined) {
      chart.removeNodeTag(selectedNode.id, selected);
    }
    chart.addNodeTag(node.id, selected);
    chart.center(node.id, {
      rippleId: node.id,
      vertical: true,
      horizontal: true
    });
    this.setState({ selectedNode: node }, () => {
      this.getHistory();
      this.getPartHistory();
    });
  };

  /**
   * 获取主表窗体数据
   */
  getFormData = async (record, formName = 'default') => {
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
        formName
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

  openAddModal = nodeId => {
    const node = this.chart.get(nodeId);
    if (node.isEmpty !== 'Y') {
      return message.info('非空缺岗位');
    }
    if (node.isPartOccupied === 'Y') {
      return message.info('已有兼职人员，请先清空');
    }
    const { baseURL } = this.props;
    this.props.openModalOrDrawer(
      'modal',
      {
        title: '添加兼职人员',
        width: '80vw',
        onCancel: this.props.closeModalOrDrawer,
        footer: null
      },
      () => {
        return (
          <div>
            <div>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  const waitingImport = this.addModalTableDataRef.getSelectedRecords();
                  if (!waitingImport.length) {
                    return message.info('请选择一位人员');
                  }
                  if (waitingImport.length > 1) {
                    return message.info('只能选择一位人员');
                  }
                  const records = [
                    {
                      pnid: waitingImport[0].C3_305737857578,
                      orgcode: node.orgcode,
                      dates: this.state.selectedDate.format('YYYYMMDD')
                    }
                  ];
                  console.log(records);
                  const name = waitingImport[0].C3_227192484125;
                  Modal.confirm({
                    title: '请确认兼职信息',
                    content: (
                      <div>
                        【<span style={{ color: '#f5222d' }}>{name}</span>】
                        将兼职 【
                        <span style={{ color: '#1890ff' }}>{node.orgName}</span>
                        】
                        <div>
                          生效日期：
                          {this.state.selectedDate.format('YYYY-MM-DD')}
                        </div>
                      </div>
                    ),
                    onOk: async () => {
                      try {
                        this.setState({ loading: true });
                        let httpParams = {};
                        // 使用传入的 baseURL
                        if (baseURL) {
                          httpParams.baseURL = baseURL;
                        }
                        await http(httpParams).addRecords({
                          resid: '639083780814',
                          data: records,
                          uniquecolumns: 'orgcode,dates',
                          isEditOrAdd: 'true'
                        });
                        message.success('兼职成功');
                        this.props.closeModalOrDrawer();
                        this.setState({ loading: false });
                        let data = await this.getData();
                        this.chart.load(data);
                        this._nodes = [...this.chart.config.nodes];
                        if (node.id) {
                          this.chart.center(node.id);
                        }
                      } catch (error) {
                        message.error(error.message);
                        this.setState({ loading: false });
                      }
                    }
                  });
                }}
              >
                兼职
              </Button>
            </div>
            <div style={{ height: 600 }}>
              <TableData
                baseURL={this.props.baseURL}
                resid="639138610234"
                wrappedComponentRef={element =>
                  (this.addModalTableDataRef = element)
                }
                refTargetComponentName="TableData"
                // subtractH={240}
                hasAdd={false}
                // tableComponent="ag-grid"
                // rowSelectionAg="single"
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasRowSelection={true}
                hasAdvSearch={false}
                importConfig={null}
              />
            </div>
          </div>
        );
      },
      {}
    );
  };
  clearPerson = nodeId => {
    const node = this.chart.get(nodeId);
    if (node.isEmpty === 'Y' && node.isPartOccupied !== 'Y') {
      return message.info('无任职或兼职人员');
    }
    const { baseURL } = this.props;
    if (node.isPartOccupied === 'Y') {
      //有兼职人员，则清空兼职人员
      Modal.confirm({
        title: '清空岗位人员',
        content: (
          <div>
            此岗位的兼职人员将被清空，请确认
            <div>
              生效日期：
              {this.state.selectedDate.format('YYYY-MM-DD')}
            </div>
          </div>
        ),
        onOk: async () => {
          try {
            this.setState({ loading: true });
            let httpParams = {};
            // 使用传入的 baseURL
            if (baseURL) {
              httpParams.baseURL = baseURL;
            }
            await http(httpParams).addRecords({
              resid: '639083780814',
              data: [
                {
                  orgcode: node.orgcode,
                  pnid: 0,
                  dates: this.state.selectedDate.format('YYYYMMDD')
                }
              ],
              uniquecolumns: 'orgcode,dates',
              isEditOrAdd: 'true'
            });
            this.setState({ loading: false });
            message.success('清空成功');
            this.props.closeModalOrDrawer();
            // 重新获取数据
            let data = await this.getData();
            this.chart.load(data);
            this._nodes = [...this.chart.config.nodes];
            if (node.id) {
              this.chart.center(node.id);
            }
          } catch (error) {
            message.error(error.message);
            this.setState({ loading: false });
          }
        }
      });
    } else {
      Modal.confirm({
        title: '清空岗位人员',
        content: (
          <div>
            此岗位的兼职人员将被清空，请确认
            <div>
              生效日期：
              {this.state.selectedDate.format('YYYY-MM-DD')}
            </div>
          </div>
        ),
        onOk: async () => {
          try {
            this.setState({ loading: true });
            let httpParams = {};
            // 使用传入的 baseURL
            if (baseURL) {
              httpParams.baseURL = baseURL;
            }
            await http(httpParams).modifyRecords({
              resid: '639230706234',
              data: [
                {
                  C3_305737857578: node.memberCode,
                  C3_465142349966: '',
                  C3_470524257391: this.state.selectedDate
                }
              ],
              isEditOrAdd: 'true'
            });
            this.setState({ loading: false });
            message.success('清空成功');
            this.props.closeModalOrDrawer();
            let data = await this.getData();
            this.chart.load(data);
            this._nodes = [...this.chart.config.nodes];
            if (node.id) {
              this.chart.center(node.id);
            }
          } catch (error) {
            message.error(error.message);
            this.setState({ loading: false });
          }
        }
      });
    }
  };

  openImportModal = nodeId => {
    const node = this.chart.get(nodeId);
    const { baseURL } = this.props;
    if (node.isEmpty !== 'Y') {
      return message.info('非空缺岗位');
    }
    if (node.isVirtual !== 'Y' && node.PartOccupiedPnId) {
      return message.info('IDL岗位，不可添加多人');
    }
    this.props.openModalOrDrawer(
      'modal',
      {
        title: '从未匹配人员导入',
        width: '80vw',
        onCancel: this.props.closeModalOrDrawer,
        footer: null
      },
      () => {
        return (
          <div>
            <div>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  const waitingImport = this.importModalTableDataRef.getAggridSelectedRows();
                  if (!waitingImport.length) {
                    return message.info('请选择待人员');
                  }
                  const records = [];
                  let names = '';
                  waitingImport.forEach((record, index) => {
                    names += record.C3_421886426562;
                    if (index + 1 !== waitingImport.length) {
                      names += ',';
                    }
                    records.push({
                      REC_ID: record.REC_ID,
                      C3_465142349966: node.orgNumber
                    });
                  });
                  Modal.confirm({
                    title: '提示',
                    content: (
                      <div>
                        【<span style={{ color: '#f5222d' }}>{names}</span>】
                        将任职 【
                        <span style={{ color: '#1890ff' }}>{node.orgName}</span>
                        】
                        <div>
                          生效日期：
                          {this.state.selectedDate.format('YYYY-MM-DD')}
                        </div>
                      </div>
                    ),
                    onOk: async () => {
                      try {
                        this.setState({ loading: true });
                        let httpParams = {};
                        // 使用传入的 baseURL
                        if (baseURL) {
                          httpParams.baseURL = baseURL;
                        }
                        await http(httpParams).modifyRecords({
                          resid: '638645984799',
                          data: records
                        });
                        this.setState({ loading: false });
                        message.success('任职成功');
                        this.props.closeModalOrDrawer();
                        let data = await this.getData();
                        this.chart.load(data);
                        this._nodes = [...this.chart.config.nodes];
                        if (node.id) {
                          this.chart.center(node.id);
                        }
                      } catch (error) {
                        message.error(error.message);
                        this.setState({ loading: false });
                      }
                    }
                  });
                }}
              >
                任职
              </Button>
            </div>
            <div style={{ height: 600 }}>
              <TableData
                baseURL={this.props.baseURL}
                resid="638645984799"
                wrappedComponentRef={element =>
                  (this.importModalTableDataRef = element)
                }
                refTargetComponentName="TableData"
                // subtractH={240}
                hasAdd={false}
                tableComponent="ag-grid"
                rowSelectionAg={node.isVirtual === 'Y' ? 'multiple' : 'single'}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasRowSelection={false}
                // cmswhere={selectedType && `C3_417994161226 = '${selectedType}'`}
                afterSaveRefresh={true}
                hasAdvSearch={false}
                importConfig={null}
              />
            </div>
          </div>
        );
      },
      {}
    );
  };

  /**
   * 设置某个节点为根节点
   */
  setRootNode = nodeId => {
    const node =
      this.chart.get(nodeId) || this._nodes.find(item => item.id === nodeId);
    let nodes = [node]; //计算后的节点，必包含点击的节点
    this.calcSubNodes([node], nodes, this._nodes);
    nodes.forEach(node => {
      if (node.tags.includes(selected)) {
        node.tags.splice(node.tags.findIndex(tag => tag === selected), 1);
      }
    });
    node.tags.push(selected);
    this.chart.load(nodes);
    this.setState({ selectedNode: node });
  };

  calcSubNodes = (calcNode, subNodes, allNodes) => {
    //仍有要计算子节点的数据
    if (calcNode.length) {
      let filterNodes = allNodes.filter(item => {
        item.tags.splice(item.tags.findIndex(tag => tag === selected), 1);
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

  handleModeChange = mode => () => this.setState({ mode });

  handleSelfDefine = () => this.setState({ selfDefineVisible: true });

  handleGroupChange = checked => {
    if (isEmpty(this._tags)) {
      message.info('无分组配置');
      this.setState({ isGrouping: false });
      return false;
    }
    if (checked) {
      this.chart.config.tags = {
        // selected,
        ...this._tags
      };
    } else {
      this.chart.config.tags = { selected };
    }
    this.setState({ isGrouping: checked });
    this.chart.draw();
  };

  closeSelfDefineModal = () => this.setState({ selfDefineVisible: false });
  closeDetaileModal = () => this.setState({ detailVisible: false });

  updateNode = async newNode => {
    this.setState({ loading: true });
    const { resid, idField, pidField, dblinkname, baseURL } = this.props;
    let httpParams = {};
    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    let res;
    this.p5 = makeCancelable(
      http(httpParams).modifyRecords({
        resid,
        data: [
          {
            REC_ID: newNode.REC_ID,
            updateDate: this.state.selectedDate,
            [pidField]: newNode.pid
          }
        ],
        dblinkname
      })
    );
    try {
      res = await this.p5.promise;
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
    this.chart.updateNode(newNode);
  };

  /**
   * 保存成功后的回调函数
   */
  afterSave = (operation, formData, record, form) => {
    const { pidField, idField } = this.props;
    this.closeBroModal();
    if (operation === 'add') {
      const tags = [];
      if (record.isScrap === 'Y') {
        tags.push('discard');
      } else if (record.isEmpty === 'Y') {
        tags.push('empty');
      }
      const node = {
        ...record,
        id: record[idField],
        pid: record[pidField],
        tags: record.tags ? [...record.tags, ...tags] : tags
      };
      message.success('添加成功');
      this.chart.addNode(node);
      this._nodes.push(node);
    } else if (operation === 'modify') {
      // const oldTags = this.chart.get(record[idField]).tags;
      const tags = [];
      if (record.isScrap === 'Y') {
        tags.push('discard');
      } else if (record.isEmpty === 'Y') {
        tags.push('empty');
      }
      const node = {
        ...record,
        id: record[idField],
        pid: record[pidField],
        tags: record.tags
          ? [...record.tags, ...tags, selected]
          : [...tags, selected]
      };
      message.success('修改成功');
      this.setState({ selectedNode: node }, () => {
        this.getHistory();
        this.getPartHistory();
      });
      this.chart.updateNode(node);
    }
  };

  /**
   * 加载下一层级的数据
   */
  // loadNextLevel = async () => {
  //   if (this.state.isGrouping) {
  //     return message.info('请先取消分组');
  //   }
  //   const {
  //     resid,
  //     idField,
  //     pidField,
  //     baseURL,
  //     dblinkname,
  //     groupConfig
  //   } = this.props;
  //   let httpParams = {};
  //   // 使用传入的 baseURL
  //   if (baseURL) {
  //     httpParams.baseURL = baseURL;
  //   }
  //   const nodes = this.chart.nodes;
  //   const keys = Object.keys(nodes);
  //   const ids = keys.filter(key => {
  //     return !nodes[key].childrenIds.length;
  //   });
  //   const options = {
  //     resid,
  //     Levels: 1,
  //     ColumnOfID: idField,
  //     ColumnOfPID: pidField,
  //     MoveDirection: 1,
  //     MoveLevels: 1,
  //     ProductIDs: ids.join(','),
  //     cmswhere: this._cmswhere,
  //     dblinkname,
  //     tags: groupConfig
  //   };
  //   this.p4 = makeCancelable(http(httpParams).getMoveNodes(options));
  //   this.setState({ loading: true });
  //   let res;
  //   try {
  //     res = await this.p4.promise;
  //   } catch (err) {
  //     console.error(err);
  //     return message.error(err.message);
  //   }
  //   if (!res.nodes || !res.nodes.length) {
  //     this.setState({ loading: false });
  //     return message.info('没有更多数据');
  //   }
  //   this.setState({ currentLevel: this.state.currentLevel + 1 });
  //   res.nodes.forEach(node => {
  //     this.chart.add({
  //       ...node,
  //       id: node[idField],
  //       pid: node[pidField]
  //     });
  //   });
  //   this.setState({ loading: false });
  //   this.chart.draw();
  // };

  onLevelChange = level => {
    this.setState({ currentLevel: level });
    this.chart.expandCollapseToLevel(1, {
      level
    });
  };

  handleDateChange = (date, dateString) => {
    this.setState({ selectedDate: date }, async () => {
      const { selectedNode } = this.state;
      let data = await this.getData();
      this.chart.load(data);
      this._nodes = [...this.chart.config.nodes];
      if (selectedNode.id) {
        this.chart.center(selectedNode.id);
      }
    });
  };

  /**
   *
   */
  handleDisableEnable = value => () => {
    Modal.confirm({
      title: value === 'disable' ? '停用' : '启用',
      content: (
        <div>
          <div>生效日期：</div>
          <DatePicker
            onChange={(date, dateString) => {
              this.setState({ takeEffectDate: dateString });
            }}
            placeholder="请选择生效日期"
            showToday
            defaultValue={this.state.selectedDate}
          />
        </div>
      ),
      onOk: async () => {
        const { takeEffectDate, selectedNode, selectedDate } = this.state;
        const { baseURL, resid } = this.props;
        try {
          let httpParams = {};
          // 使用传入的 baseURL
          if (baseURL) {
            httpParams.baseURL = baseURL;
          }
          const isScrap = value === 'disable' ? 'Y' : 'N';
          this.setState({ loading: true });
          const res = await http(httpParams).modifyRecords({
            resid,
            data: [
              {
                REC_ID: selectedNode.REC_ID,
                isScrap,
                isCreated: 'N',
                updateDate: takeEffectDate || selectedDate
              }
            ]
          });
          message.info('操作成功');
          const data = res.data[0];
          const tags = [selected];
          if (data.isScrap === 'Y') {
            tags.push('discard');
          } else if (data.isEmpty === 'Y') {
            tags.push('empty');
          }
          const node = {
            ...selectedNode,
            ...data,
            tags: [...tags]
          };
          this.chart.updateNode(node);
          this.setState({ loading: false, selectedNode: node });
        } catch (error) {
          this.setState({ loading: false });
          console.log(error);
          message.error(error.message);
        }
      }
    });
  };
  // 导入
  handleImport = () => {
    const {
      openImportView,
      baseURL,
      importConfig,
      importResid,
      dblinkname
    } = this.props;
    const url = baseURL || window.pwConfig[process.env.NODE_ENV].baseURL;

    openImportView &&
      openImportView(
        dblinkname,
        url,
        importResid,
        importConfig.mode,
        importConfig.containerType,
        importConfig.saveState,
        importConfig.containerProps,
        this.handleFinishImport
      );
  };

  handleFinishImport = () => {
    this.props.closeImportView();
    this.setState({ hasImportResult: true, resultMin: false }, () => {
      this.contentRef.scrollTo({
        left: 0,
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
    notification.open({
      message: '导入完成',
      description: '请查看导入结果',
      onClick: () => {
        console.log('Notification Clicked!');
      }
    });
  };

  handleRefresh = async () => {
    const { selectedNode } = this.state;
    const data = await this.getData();
    this.chart.load(data);
    this._nodes = [...this.chart.config.nodes];
    if (selectedNode.id) {
      this.chart.center(selectedNode.id);
    }
  };

  renderHeader = () => {
    const { mode, isGrouping, selectedNode, currentLevel } = this.state;
    const { hasOpration, hasImport } = this.props;
    const enable = selectedNode.isScrap === '' || selectedNode.isScrap === null;
    const disable = selectedNode.isScrap === 'N';
    let opration = '';
    if (selectedNode.isScrap === '') {
      opration = 'enable';
    }
    if (selectedNode.isScrap === 'N') {
      opration = 'disable';
    }
    return (
      <header className="architecture-diagram_header">
        {/* <div className="architecture-diagram_header_icon-button-group">
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
        </div> */}
        {mode === 'chart' && (
          <div className="architecture-diagram_header_icon-button-group">
            <div className="architecture-diagram_header_icon-button">
              分组
              <Switch
                checked={isGrouping}
                style={{ marginLeft: '8px' }}
                onChange={this.handleGroupChange}
              />
            </div>
          </div>
        )}
        <div className="architecture-diagram_header_icon-button-group">
          <div
            className={classNames({
              'architecture-diagram_header_icon-button': true,
              'architecture-diagram_header_icon-button__selected':
                mode === 'chart'
            })}
            onClick={this.handleModeChange('chart')}
          >
            <Icon
              type="apartment"
              className="architecture-diagram_header_icon-button__icon"
            />
            图形化
          </div>
          <div
            className={classNames({
              'architecture-diagram_header_icon-button': true,
              'architecture-diagram_header_icon-button__selected':
                mode === 'table'
            })}
            onClick={this.handleModeChange('table')}
          >
            <Icon
              type="table"
              className="architecture-diagram_header_icon-button__icon"
            />
            表格化
          </div>
        </div>
        {hasOpration && (
          <div className="architecture-diagram_header_icon-button-group">
            {mode === 'chart' && (
              <>
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
              </>
            )}
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
            <div
              className="architecture-diagram_header_icon-button delete-button"
              onClick={this.handleDelete}
            >
              <Icon
                type="delete"
                className="architecture-diagram_header_icon-button__icon"
              />
              删除
            </div>
            {selectedNode.REC_ID && (
              <div
                className={classNames(
                  'architecture-diagram_header_icon-button ',
                  {
                    'disable-button': disable,
                    'enable-button': enable
                  }
                )}
                onClick={this.handleDisableEnable(opration)}
              >
                {disable && (
                  <>
                    <Icon
                      type="logout"
                      className="architecture-diagram_header_icon-button__icon"
                    />
                    停用
                  </>
                )}
                {enable && (
                  <>
                    <Icon
                      type="login"
                      className="architecture-diagram_header_icon-button__icon"
                    />
                    启用
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {mode === 'chart' && (
          <div className="architecture-diagram_header_icon-button-group">
            <div
              className="architecture-diagram_header_icon-button"
              onClick={this.handleSelfDefine}
            >
              <img
                src={selfDefine}
                className="architecture-diagram_header_icon-button__icon"
                alt=""
              />
              自定义卡片
            </div>
          </div>
        )}
        {mode === 'chart' && (
          <div className="architecture-diagram_header_icon-button-group">
            <div className="architecture-diagram_header_icon-button">
              <Icon
                type="switcher"
                className="architecture-diagram_header_icon-button__icon"
              />
              层级
              <InputNumber
                size="small"
                min={1}
                max={100000}
                value={currentLevel}
                onChange={this.onLevelChange}
              />
            </div>
          </div>
        )}
        {hasImport && (
          <div className="architecture-diagram_header_icon-button-group">
            <div
              className="architecture-diagram_header_icon-button"
              onClick={this.handleImport}
            >
              <Icon
                type="upload"
                className="architecture-diagram_header_icon-button__icon"
              />
              导入数据
            </div>
            <div className="architecture-diagram_header_icon-button">
              <Icon
                type="download"
                className="architecture-diagram_header_icon-button__icon"
              />
              下载导入模板
            </div>
            {/* <Popover
            placement="right"
            content={
              <div>
                <div>
                  <Checkbox>未处理记录</Checkbox>
                </div>
                <div>
                  <Checkbox>导入结果</Checkbox>
                </div>
                <div>
                  <Checkbox>岗位信息</Checkbox>
                </div>
                <div>
                  <Checkbox>历史信息</Checkbox>
                </div>
              </div>
            }
          >
            <div className="architecture-diagram_header_icon-button">
              <Icon
                type="layout"
                className="architecture-diagram_header_icon-button__icon"
              />
              显示
            </div>
          </Popover> */}
          </div>
        )}
      </header>
    );
  };

  renderBreadcrumb = () => {
    const { breadcrumb } = this.state;
    const { displayFileds, name } = this.props;
    return (
      <Breadcrumb separator=">">
        {breadcrumb.map(item => {
          return (
            <Breadcrumb.Item
              onClick={() => {
                // this.handleNodeClick(this.chart, item);
                this.setRootNode(item.id);
              }}
              key={item.id}
            >
              {name === 'person' &&
                `${item.orgName}(${
                  item.memberCN ? item.memberCN : '无任职人'
                })`}
              {name === 'job' && item[displayFileds.firstField]}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    );
  };

  renderImportResult = () => {
    const { baseURL } = this.props;
    const { selectedResultResid, selectedType, mode } = this.state;
    return (
      <div id="import-result" className="architecture-diagram__import-result">
        <div className="architecture-diagram__import-result__title">
          导入结果
          <Icon
            type="minus"
            className="architecture-diagram__min-button"
            style={{ fontSize: 16 }}
            onClick={() => {
              this.setState({ resultMin: true });
            }}
          />
        </div>
        <div className="architecture-diagram__import-result__content">
          <div style={{ marginBottom: 16 }}>
            <Select
              style={{ width: 120, marginRight: 16 }}
              size="small"
              defaultValue="638645137963"
              onChange={v => {
                this.setState({ selectedResultResid: v });
              }}
              value={selectedResultResid}
            >
              <Select.Option value="638645137963">全部</Select.Option>
              <Select.Option value="638646080344">正常</Select.Option>
              <Select.Option value="638645984799">未匹配</Select.Option>
              <Select.Option value="638646009862">错误</Select.Option>
            </Select>
            <Select
              style={{ width: 120, marginRight: 16 }}
              size="small"
              defaultValue="IDL"
              onChange={v => {
                this.setState({ selectedType: v });
              }}
              value={selectedType}
            >
              <Select.Option value="DL">DL</Select.Option>
              <Select.Option value="IDL">IDL</Select.Option>
            </Select>
            {selectedResultResid === '638645984799' && (
              <Button
                size="small"
                type="primary"
                style={{ marginRight: 24 }}
                onClick={() => {
                  const waitingImport = this.tableDataRef.getAggridSelectedRows();
                  if (!waitingImport.length) {
                    return message.info('请选择待导入的数据');
                  }
                  let selectedNode;
                  if (mode === 'table') {
                    selectedNode = this.tableDataRef1.getAggridSelectedRows()[0];
                    if (!selectedNode) {
                      return message.info('请在上方表中选择待导入的岗位');
                    }
                  } else {
                    selectedNode = this.state.selectedNode;
                    if (!selectedNode.REC_ID) {
                      return message.info('请在架构图中选择待导入的岗位');
                    }
                  }
                  const records = [];
                  let names = '';
                  waitingImport.forEach((record, index) => {
                    names += record.C3_421886426562;
                    if (index + 1 !== waitingImport.length) {
                      names += ',';
                    }
                    records.push({
                      REC_ID: record.REC_ID,
                      C3_465142349966: selectedNode.orgNumber
                    });
                  });
                  Modal.confirm({
                    title: '提示',
                    content: (
                      <div>
                        【<span style={{ color: '#f5222d' }}>{names}</span>】
                        将导入到 【
                        <span style={{ color: '#1890ff' }}>
                          {selectedNode.orgName}
                        </span>
                        】
                      </div>
                    ),
                    onOk: async () => {
                      try {
                        this.setState({ loading: true });
                        let httpParams = {};
                        // 使用传入的 baseURL
                        if (baseURL) {
                          httpParams.baseURL = baseURL;
                        }
                        await http(httpParams).modifyRecords({
                          resid: '638645984799',
                          data: records
                        });
                        this.setState({ loading: false });
                        message.success('导入成功');
                        this.tableDataRef.handleRefresh();
                      } catch (error) {
                        message.error(error.message);
                        this.setState({ loading: false });
                      }
                    }
                  });
                }}
              >
                匹配
              </Button>
            )}
            {/* <span style={{ marginRight: 16 }}>合计：100</span>
            <span style={{ marginRight: 16 }}>成功：70</span>
            <span style={{ marginRight: 16 }}>错误：20</span>
            <span style={{ marginRight: 16 }}>未匹配：10</span> */}
          </div>
          <div style={{ flex: 1 }}>
            <TableData
              baseURL={baseURL}
              resid={selectedResultResid || '638645137963'}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              // subtractH={240}
              hasAdd={false}
              tableComponent="ag-grid"
              rowSelectionAg={selectedType === 'IDL' ? 'single' : 'multiple'}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={false}
              hasRowSelection={false}
              cmswhere={selectedType && `C3_417994161226 = '${selectedType}'`}
              afterSaveRefresh={true}
              hasAdvSearch={false}
              importConfig={null}
            />
          </div>
        </div>
      </div>
    );
  };
  renderExpand = () => {
    const { detaileMin, historyMin, resultMin } = this.state;
    return (
      <div className="architecture-diagram__expand-buttons">
        {detaileMin && (
          <div className="architecture-diagram__expand">
            详细情况
            <Icon
              type="switcher"
              onClick={() => {
                this.setState({ detaileMin: false });
              }}
            />
          </div>
        )}
        {historyMin && (
          <div className="architecture-diagram__expand">
            历史情况
            <Icon
              type="switcher"
              onClick={() => {
                this.setState({ historyMin: false });
              }}
            />
          </div>
        )}
        {resultMin && (
          <div
            className="architecture-diagram__expand"
            onClick={() => {
              this.setState({ resultMin: false }, () => {
                this.contentRef.scrollTo({
                  left: 0,
                  top: window.innerHeight,
                  behavior: 'smooth'
                });
              });
            }}
          >
            导入结果
            <Icon type="switcher" />
          </div>
        )}
      </div>
    );
  };

  render() {
    const {
      selectedNode,
      addBroVisible,
      historyData,
      partHistoryData,
      viewHistoryDetailVisible,
      operation,
      record,
      loading,
      mode,
      selfDefineVisible,
      selectedDate,
      detaileMin,
      resultMin,
      historyMin,
      hasImportResult,
      detailVisible
    } = this.state;
    const { resid, baseURL, displayFileds, hasView, idField } = this.props;
    return (
      <div className="architecture-diagram">
        <Spin spinning={loading}>
          {this.renderExpand()}
          {this.renderHeader()}
          <div className="architecture-diagram_breadcrumb">
            <div style={{marginRight:8}}>
              <DatePicker
                value={selectedDate}
                showToday
                onChange={this.handleDateChange}
                size="small"
                allowClear={false}
              />
            </div>
            <Button
              onClick={this.handleRefresh}
              style={{ margin: '0 8px' }}
              type="primary"
              size="small"
            >
              刷新
            </Button>
            当前位置：
            {this.renderBreadcrumb()}
          </div>
          <div
            className="architecture-diagram__content"
            ref={ref => {
              this.contentRef = ref;
            }}
          >
            <div className="architecture-diagram__content__main">
              <div className="architecture-diagram__content__main__container">
                <div
                  className={classNames({
                    'architecture-diagram__tabledata__container': true,
                    hidden: mode === 'chart'
                  })}
                >
                  <TableData
                    resid={resid}
                    subtractH={220}
                    wrappedComponentRef={element =>
                      (this.tableDataRef1 = element)
                    }
                    refTargetComponentName="TableData"
                    tableComponent="ag-grid"
                    rowSelectionAg="single"
                    sideBarAg={true}
                    hasAdvSearch={true}
                    hasAdd={false}
                    hasRowView={false}
                    hasRowDelete={false}
                    hasRowEdit={false}
                    hasDelete={false}
                    hasModify={false}
                    hasBeBtns={false}
                    hasRowModify={false}
                    hasRowSelection={false}
                    baseURL={baseURL}
                    onAgGridSelectionChanged={(rows = []) => {
                      if (rows.length) {
                        const node = this.chart.get(rows[0][idField]);
                        console.log(node);
                        // this.setState({selectedNode:node});
                      } else {
                      }
                    }}
                  />
                </div>
                <div
                  className={classNames({
                    'architecture-diagram__chart-container': true,
                    hidden: mode === 'table'
                  })}
                >
                  <div id="architecture-diagram_orgchart"></div>
                </div>
              </div>
              <div className="architecture-diagram_main_sider">
                {!detaileMin && (
                  <div className="architecture-diagram_main_item-detail">
                    <div className="architecture-diagram_main_sider_title">
                      详细情况
                      <Icon
                        type="minus"
                        className="architecture-diagram__min-button"
                        style={{ fontSize: 16 }}
                        onClick={() => {
                          this.setState({ detaileMin: true });
                        }}
                      />
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
                              {hasView &&
                                item.id === displayFileds.firstField &&
                                selectedNode[item.id] && (
                                  <span
                                    style={{
                                      color: '#1890FF',
                                      cursor: 'pointer',
                                      marginLeft: 8
                                    }}
                                    onClick={() => {
                                      this.setState({
                                        detailVisible: true
                                      });
                                    }}
                                  >
                                    查看
                                  </span>
                                )}
                              {!selectedNode[item.id] &&
                                item.id === displayFileds.firstField && (
                                  <span
                                    style={{
                                      color: '#1890FF',
                                      cursor: 'pointer',
                                      marginLeft: 8
                                    }}
                                    onClick={() =>
                                      this.openAddModal(selectedNode.id)
                                    }
                                  >
                                    选择人员
                                  </span>
                                )}
                            </p>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="architecture-diagram_unselect-tip">
                        <Alert
                          message="尚未选中任何卡片！"
                          type="info"
                          showIcon
                        />
                      </div>
                    )}
                  </div>
                )}
                {!historyMin && (
                  <div className="architecture-diagram_main_item-history">
                    <div className="architecture-diagram_main_sider_title">
                      历史情况
                      <Icon
                        type="minus"
                        className="architecture-diagram__min-button"
                        style={{ fontSize: 16 }}
                        onClick={() => {
                          this.setState({ historyMin: true });
                        }}
                      />
                    </div>
                    <div className="architecture-diagram_change-hsitory_list">
                      <Tabs defaultActiveKey="1" size="small">
                        <Tabs.TabPane tab="历史任职记录" key="1">
                          {selectedNode.REC_ID ? (
                            historyData.length ? (
                              <Timeline>
                                {historyData.map((item, index) => {
                                  const showMore = item.showMore;
                                  return (
                                    <Timeline.Item>
                                      <div>
                                        {this._historyColinfo.map((i, ind) => {
                                          return (
                                            <p
                                              key={i.id}
                                              className="architecture-diagram_main_item-detail_list_item"
                                              style={{
                                                display:
                                                  !showMore && ind > 3
                                                    ? 'none'
                                                    : 'block'
                                              }}
                                            >
                                              <label>{i.text}：</label>
                                              <span>{item[i.id]}</span>
                                              {!showMore && ind === 3 && (
                                                <span
                                                  style={{
                                                    color: '#1890ff',
                                                    marginLeft: 8,
                                                    cursor: 'pointer'
                                                  }}
                                                  onClick={() => {
                                                    historyData[
                                                      index
                                                    ].showMore = true;
                                                    this.setState({
                                                      historyData
                                                    });
                                                  }}
                                                >
                                                  更多
                                                </span>
                                              )}
                                              {showMore &&
                                                ind + 1 ===
                                                  this._historyColinfo
                                                    .length && (
                                                  <span
                                                    style={{
                                                      color: '#1890ff',
                                                      marginLeft: 8,
                                                      cursor: 'pointer'
                                                    }}
                                                    onClick={() => {
                                                      historyData[
                                                        index
                                                      ].showMore = false;
                                                      this.setState({
                                                        historyData
                                                      });
                                                    }}
                                                  >
                                                    收起
                                                  </span>
                                                )}
                                            </p>
                                          );
                                        })}
                                      </div>
                                    </Timeline.Item>
                                  );
                                })}
                              </Timeline>
                            ) : (
                              <div className="architecture-diagram_unselect-tip">
                                <Alert
                                  message="无历史记录"
                                  type="info"
                                  showIcon
                                />
                              </div>
                            )
                          ) : (
                            <div className="architecture-diagram_unselect-tip">
                              <Alert
                                message="尚未选中任何卡片！"
                                type="info"
                                showIcon
                              />
                            </div>
                          )}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="历史兼职记录" key="2">
                          {selectedNode.REC_ID ? (
                            historyData.length ? (
                              <Timeline>
                                {historyData.map((item, index) => {
                                  const showMore = item.showMore;
                                  return (
                                    <Timeline.Item>
                                      <div>
                                        {this._partHistoryColinfo.map(
                                          (i, ind) => {
                                            return (
                                              <p
                                                key={i.id}
                                                className="architecture-diagram_main_item-detail_list_item"
                                                style={{
                                                  display:
                                                    !showMore && ind > 3
                                                      ? 'none'
                                                      : 'block'
                                                }}
                                              >
                                                <label>{i.text}：</label>
                                                <span>{item[i.id]}</span>
                                                {!showMore && ind === 3 && (
                                                  <span
                                                    style={{
                                                      color: '#1890ff',
                                                      marginLeft: 8,
                                                      cursor: 'pointer'
                                                    }}
                                                    onClick={() => {
                                                      partHistoryData[
                                                        index
                                                      ].showMore = true;
                                                      this.setState({
                                                        partHistoryData
                                                      });
                                                    }}
                                                  >
                                                    更多
                                                  </span>
                                                )}
                                                {showMore &&
                                                  ind + 1 ===
                                                    this._partHistoryColinfo
                                                      .length && (
                                                    <span
                                                      style={{
                                                        color: '#1890ff',
                                                        marginLeft: 8,
                                                        cursor: 'pointer'
                                                      }}
                                                      onClick={() => {
                                                        partHistoryData[
                                                          index
                                                        ].showMore = false;
                                                        this.setState({
                                                          partHistoryData
                                                        });
                                                      }}
                                                    >
                                                      收起
                                                    </span>
                                                  )}
                                              </p>
                                            );
                                          }
                                        )}
                                      </div>
                                    </Timeline.Item>
                                  );
                                })}
                              </Timeline>
                            ) : (
                              <div className="architecture-diagram_unselect-tip">
                                <Alert
                                  message="无历史记录"
                                  type="info"
                                  showIcon
                                />
                              </div>
                            )
                          ) : (
                            <div className="architecture-diagram_unselect-tip">
                              <Alert
                                message="尚未选中任何卡片！"
                                type="info"
                                showIcon
                              />
                            </div>
                          )}
                        </Tabs.TabPane>
                      </Tabs>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {hasImportResult && !resultMin && this.renderImportResult()}
          </div>
        </Spin>

        <Modal
          visible={addBroVisible}
          title={operation === 'modify' ? '修改' : '添加'}
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
          visible={selfDefineVisible}
          title="自定义卡片"
          width={400}
          onCancel={this.closeSelfDefineModal}
          onOk={this.closeSelfDefineModal}
          onClose={this.closeSelfDefineModal}
          destroyOnClose
        >
          <Form
            labelCol={{
              xs: { span: 24 },
              sm: { span: 8 }
            }}
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 16 }
            }}
          >
            <Form.Item label="主要字段">
              <Select
                // style={{ width: 120 }}
                defaultValue={this.state.firstField}
                onChange={v => {
                  let nodeBinding = this.chart.config.nodeBinding;
                  nodeBinding.field_0 = v;
                  this.chart.draw();
                  this.setState({ firstField: v });
                }}
              >
                {this._cmscolumninfo.map(item => {
                  return (
                    <Select.Option value={item.id}>{item.text}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item label="次要字段">
              <Select
                // style={{ width: 120 }}
                defaultValue={this.state.secondaryField}
                onChange={v => {
                  let nodeBinding = this.chart.config.nodeBinding;
                  nodeBinding.field_1 = v;
                  this.chart.draw();
                  this.setState({ secondaryField: v });
                }}
              >
                {this._cmscolumninfo.map(item => {
                  return (
                    <Select.Option value={item.id}>{item.text}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </Drawer>
        <Drawer
          visible={detailVisible}
          width="70vw"
          onCancel={this.closeDetaileModal}
          onOk={this.closeDetaileModal}
          onClose={this.closeDetaileModal}
          destroyOnClose
          title="变动记录"
          placement="left"
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 12 }}>
              <img
                src={selectedNode[displayFileds.imgField]}
                style={{ height: 48, width: 48 }}
                alt="人员照片"
              />
              <span
                style={{
                  color: '#000',
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginRight: 24
                }}
              >
                {selectedNode[displayFileds.firstField]}
              </span>
              <span>{selectedNode[displayFileds.secondaryField]}</span>
            </div>
            <div style={{ height: 500 }}>
              <TableData
                baseURL={baseURL}
                resid={'638643664427'}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                // subtractH={240}
                hasAdd={false}
                // tableComponent="ag-grid"
                // rowSelectionAg={ 'single' }
                hasRowView={true}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasRowSelection={false}
                cmswhere={`C3_305737857578 = '${selectedNode.memberCode}'`}
                hasAdvSearch={false}
                importConfig={null}
                actionBarWidth={100}
              />
            </div>
          </div>
        </Drawer>
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
const composedHoc = compose(
  injectIntl,
  withImport,
  withModalDrawer()
);

export default composedHoc(ArchitectureDiagram);
