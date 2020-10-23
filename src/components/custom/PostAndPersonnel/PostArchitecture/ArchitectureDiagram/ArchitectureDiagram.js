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
  Tree
} from 'antd';
import './ArchitectureDiagram.less';
import add1 from './svg/同级.svg';
import add2 from './svg/子级.svg';
import selfDefine from './svg/自定义卡片.svg';
import http, { makeCancelable } from 'Util20/api';
import FormData from '../../../../common/data/FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { clone, getIntlVal } from 'Util20/util';
import TableData from '../../../../common/data/TableData';
import TreeData from '../../../../common/data/TreeData';
import PwAggrid from '../../../../common/ui/PwAggrid';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { defaultProps, propTypes } from './propTypes';
import moment from 'moment';
import withImport from '../../../../common/hoc/withImport';
import withModalDrawer from '../../../../common/hoc/withModalDrawer';
import { getItem, setItem } from 'Util20/util';
import qs from 'qs';
import debounce from 'lodash/debounce';
import PWSpin from 'Common/ui/Spin';

const { TreeNode } = Tree;
const { Option } = Select;

function childCount(id, nodes) {
  let count = 0;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].pid == id) {
      count++;
      count += childCount(nodes[i].id, nodes);
    }
  }
  return count;
}
function exportExcel(data, headerData = [], fileName) {
  //要导出的json数据

  let header = '';
  headerData.forEach(item => {
    header += item.text + ',';
  });
  header = header.substring(0, header.length - 1);
  header += `\n`;
  //列标题，逗号隔开，每一个逗号就是隔开一个单元格
  // let str = `姓名,电话,邮箱\n`;
  let str = header;
  //增加\t为了不让表格显示科学计数法或者其他格式
  // for (let i = 0; i < data.length; i++) {
  //   for (let item in data[i]) {
  //     str += `${data[i][item] + '\t'},`;
  //   }
  //   str += '\n';
  // }
  data.forEach(_data => {
    headerData.forEach(item => {
      const value = _data[item.id];
      if (value !== null && value !== undefined) {
        str += `${value + '\t'},`;
      } else {
        str += ',';
      }
    });
    str += '\n';
  });

  //encodeURIComponent解决中文乱码
  let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
  //通过创建a标签实现
  let link = document.createElement('a');
  link.href = uri;
  //对下载的文件命名
  link.download = fileName + '.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
const selected = 'selected';
const OrgChart = window.OrgChart;
// const BALKANGraph = window.BALKANGraph;
OrgChart.templates.jobarchitectureDiagramTemplate = Object.assign(
  {},
  OrgChart.templates.ula
);
OrgChart.templates.jobarchitectureDiagramTemplate.node =
  '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect><line x1="0" y1="0" x2="0" y2="120" stroke="#1890FF" stroke-width="2" ></line>';
OrgChart.templates.jobarchitectureDiagramTemplate.img_0 =
  '<clipPath id="ulaImg">' +
  '<circle  cx="50" cy="60" r="40"></circle>' +
  '</clipPath>' +
  '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="10" y="10"  width="80" height="80">' +
  '</image>';
OrgChart.templates.jobarchitectureDiagramTemplate.field_0 =
  '<text width="230" class="field_0" style="font-size: 16px;font-weight:bold;" fill="#000000" x="125" y="40" text-anchor="middle">{val}</text>';
OrgChart.templates.jobarchitectureDiagramTemplate.field_1 =
  '<text width="230" class="field_1" style="font-size: 16px;" fill="#000000" x="125" y="65" text-anchor="middle">{val}</text>';
OrgChart.templates.jobarchitectureDiagramTemplate.field_2 =
  '<text width="230" class="field_1" style="font-size: 16px;" fill="#000000" x="125" y="85" text-anchor="middle">{val}</text>';
OrgChart.templates.jobarchitectureDiagramTemplate.field_3 =
  '<text width="200" class="field_1" style="font-size: 16px;" fill="#000000" x="200" y="20" text-anchor="middle">Total:{val}</text>';

class ArchitectureDiagram extends React.Component {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  constructor(props) {
    super(props);
    const displayFiledsJson = getItem(`displayField${this.props.resid}`);
    let firstField, secondaryField, thirdField;
    if (displayFiledsJson) {
      const displayFileds = JSON.parse(displayFiledsJson);
      firstField = displayFileds.firstField;
      secondaryField = displayFileds.secondaryField;
      thirdField = displayFileds.thirdField;
    } else {
      setItem(
        `displayField${this.props.resid}`,
        JSON.stringify(this.props.displayFileds)
      );
    }
    this.state = {
      selectedNode: {}, // 选中项
      tableSelectedNode: {},
      addBroVisible: false,
      selfDefineVisible: false,
      loading: false,
      fetchingData: true,
      viewHistoryDetailVisible: false,
      historyData: [], // 选中项的历史记录
      partHistoryData: [],
      operation: 'add', // FormData用到的prop
      record: {}, // FormData用到的prop
      breadcrumb: [], //面包屑数据
      currentLevel: this.props.level, //当前层级
      mode: 'chart', //显示模式：图->chart; 表-> table
      isGrouping: false,
      firstField: firstField || this.props.displayFileds.firstField,
      secondaryField: secondaryField || this.props.displayFileds.secondaryField,
      thirdField: thirdField || this.props.displayFileds.thirdField,
      selectedDate: moment(),
      takeEffectDate: '', //生效日期
      detaileMin: false,
      historyMin: false,
      resultMin: false,
      hasImportResult: false,
      detailVisible: false,
      selectedResultResid: '638645137963',
      selectedType: 'IDL',
      departmentTreeVisible: false,
      selectedDepartments: [],
      rootKey: [],
      parentKeys: [],
      filtedNodes: []
    };
  }

  async componentDidMount() {
    this.initializeOrgchart();
    await this.clearCache();
    const data = await this.getDataById();
    this.chart.load(data);
    this.getData(false);
    // this._nodes = [...this.chart.config.nodes];
    // for (var i = 0; i < data.length; i++) {
    //   data[i].number_children = childCount(data[i].id, data) + 1;
    // }
    const querystring = window.location.search.substring(1);
    const qsObj = qs.parse(querystring);
    if (qsObj.selectedNode) {
      this.handleNodeClick(this.chart, {
        node: { id: Number(qsObj.selectedNode) }
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const preNode = prevState.selectedNode;
    const node = this.state.selectedNode;
    if (node.id >= 0 && preNode !== node) {
      let breadcrumb = [];
      this.getBreadcrumb(node, breadcrumb);
      this.setState({ breadcrumb });
    }
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
    const { firstField, secondaryField, thirdField } = this.state;
    this.chart = new OrgChart(
      document.getElementById('architecture-diagram_orgchart'),
      {
        template: 'jobarchitectureDiagramTemplate',
        nodeBinding: {
          field_0: firstField,
          field_1: secondaryField,
          field_2: thirdField,
          field_3: 'number_children'
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
    this.chart.on('dbclick', (sender, node) => {
      this.setRootNode(node.id);
    });
    this.chart.on('expcollclick', (sender, action, id, ids) => {
      if (action === OrgChart.EXPAND) {
        this.setRootNode(parseInt(id));
        return false;
      }
    });
    this.chart.on('exportstart', function(sender, args) {
      args.content += `
      <style type="text/css">
        .created > rect {
          fill-opacity: 0.4;
        }
        .selected > rect {
          fill: #1890ff;
        }
        .selected > text {
          fill: #ffffff;
        }
        .empty > rect {
          fill: #fa8c16;
        }
        .empty > line {
          stroke: #fa8c16;
        }
        .empty > text {
          fill: #ffffff;
        }
        .empty.selected > rect {
          fill: #ffa940;
        }
        .empty.selected > line {
          stroke: #ffa940;
        }
        .empty.selected > text {
          fill: #ffffff;
        }
        .discard > rect {
          fill: #bbbbbb;
        }
        .discard > line {
          stroke: #bbbbbb;
        }
        .discard > text {
          fill: #999999;
        }
        .tartOccupied > line {
          stroke: #13c2c2;
        }
        .tartOccupied.selected > rect {
          fill: #36cfc9;
        }
        .tartOccupied.selected > line {
          stroke: #36cfc9;
        }
        .tartOccupied.selected > text {
          fill: #ffffff;
        }
        </style>
      `;
    });
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

  _cmscolumninfo = []; // 主表的列定义
  _nodes = []; // 当前所有节点数据
  _emptyJobs = []; //空缺岗位
  /**
   * 获取节点数据
   */
  getData = async (needLoading = true) => {
    const {
      resid,
      baseURL,
      idField,
      pidField,
      procedureConfig,
      rootId
    } = this.props;
    this._emptyJobs = [];
    const { selectedDate } = this.state;
    const options = {
      ...procedureConfig,
      resid,
      paravalues: selectedDate.format('YYYYMMDD'),
      idcolumn: idField,
      pidcolumn: pidField,
      id: rootId,
      totallevels: 0
    };
    needLoading && this.setState({ loading: true });
    this.setState({ fetchingData: true });
    try {
      const httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      this.p1 = makeCancelable(http(httpParams).getByProcedureWithId(options));
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
          this._emptyJobs.push(item);
        } else if (item.isEmpty === 'Y') {
          tags.push('empty');
          this._emptyJobs.push(item);
        }
        if (item.isCreated === 'Y') {
          tags.push('created');
        }
        const node = {
          ...item,
          id: item[idField],
          pid: item[pidField],
          tags
        };
        // alert(selectedNode);
        const { selectedNode } = this.state;

        if (selectedNode.id === item[idField]) {
          node.tags.push(selected);
          newSelectedNode = node;
        }
        res.cmscolumninfo.forEach(item => {
          if (node[item.id] == null || node[item.id] === undefined) {
            node[item.id] = 'N/A';
          }
        });
        return node;
      });
      const treeData = this.getTreeData(res.data);
      this.setState({
        loading: false,
        fetchingData: false,
        selectedNode: newSelectedNode,
        treeData
      });
      this.chart.load(nodes);
      this._nodes = [...this.chart.config.nodes];
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].number_children = childCount(nodes[i].id, nodes) + 1;
      }
      return nodes;
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
      return [];
    }
  };
  getDataById = async () => {
    const {
      resid,
      baseURL,
      idField,
      pidField,
      procedureConfig,
      level,
      rootId
    } = this.props;
    const { selectedDate, selectedNode } = this.state;
    const options = {
      ...procedureConfig,
      resid,
      paravalues: selectedDate.format('YYYYMMDD'),
      idcolumn: idField,
      pidcolumn: pidField,
      id: rootId,
      totallevels: level
    };
    this.setState({ loading: true });
    try {
      const httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      this.p11 = makeCancelable(http(httpParams).getByProcedureWithId(options));
      const res = await this.p11.promise;
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
          this._emptyJobs.push(item);
        }
        if (item.isCreated === 'Y') {
          tags.push('created');
        }
        const node = {
          ...item,
          id: item[idField],
          pid: item[pidField],
          tags
        };
        if (selectedNode.id === item[idField]) {
          node.tags.push(selected);
          newSelectedNode = node;
        }
        res.cmscolumninfo.forEach(item => {
          if (node[item.id] == null || node[item.id] === undefined) {
            node[item.id] = 'N/A';
          }
        });
        return node;
      });
      this.setState({ loading: false });
      return nodes;
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
      return [];
    }
  };

  clearCache = async () => {
    const { selectedDate } = this.state;
    const { baseURL } = this.props;
    const httpParams = {};
    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    await http(httpParams).clearOrgCache({
      // key:
      //   selectedDate.format('YYYYMMDD') + this.props.procedureConfig.procedure
      key: ''
    });
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

  /**
   * 计算面包屑数据
   */
  getBreadcrumb = (selectedNode, breadcrumb = []) => {
    if (selectedNode.pid >= 0) {
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

  getParentKeys = (selectedNode, keys = []) => {
    if (selectedNode.pid >= 0) {
      const fooNode = this._nodes.find(item => {
        return item.id === selectedNode.pid;
      });
      if (fooNode) {
        keys.unshift(selectedNode.id + '');
        this.getParentKeys(fooNode, keys);
      } else {
        keys.unshift(selectedNode.id + '');
      }
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
      record.orgSupCode = selectedNode.orgcode;
      record.orgSupNumber = selectedNode.orgNumber;
      this.getFormData(record, createWindowName);
    } else if (level === 'bro') {
      record[pidField] = selectedNode[pidField];
      record.updateDate = selectedDate;
      record.orgSupCode = selectedNode.orgSupCode;
      record.orgSupNumber = selectedNode.orgSupNumber;
      this.getFormData(record, createWindowName);
    }
    this.setState({ addBroVisible: true, operation: 'add', record });
  };

  /**
   * 修改节点
   */
  handleModify = () => {
    const { selectedNode, mode, tableSelectedNode } = this.state;
    const { createWindowName, editWindowName } = this.props;
    const node = mode === 'chart' ? selectedNode : tableSelectedNode;
    if (!node.REC_ID) {
      if (mode === 'chart') {
        return message.info('请选择一个卡片');
      } else {
        return message.info('请选择一条记录');
      }
    }
    if (node.isCreated === 'Y') {
      this.getFormData({ ...node }, createWindowName);
    } else {
      this.getFormData({ ...node }, editWindowName);
    }
    this.setState({
      addBroVisible: true,
      operation: 'modify',
      record: { ...node }
    });
  };

  /**
   * 删除节点
   */
  handleDelete = () => {
    const { selectedNode, mode, tableSelectedNode } = this.state;
    // let node;
    // if (mode === 'table') {
    //   node = tableSelectedNode;
    // } else {
    //   node = selectedNode;
    // }
    // if (!selectedNode.REC_ID) {
    //   if (mode === 'table') {
    //     return message.info('请选择一条记录');
    //   } else {
    //     return message.info('请选择一个卡片');
    //   }
    // }
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
            // this.chart.removeNode(selectedNode.id);
            // this._nodes.splice(
            //   this._nodes.findIndex(node => node.id === selectedNode.id),
            //   1
            // );
            message.success('删除成功');

            this.setState(
              { selectedNode: {}, breadcrumb: [], loading: false },
              async () => {
                await this.clearCache();
                this.handleRefresh();
              }
            );
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
    const hasSelectedTagNode = chart.config.nodes.find(node =>
      node.tags.includes(selected)
    );
    if (hasSelectedTagNode) {
      chart.removeNodeTag(hasSelectedTagNode.id, selected);
    }
    chart.addNodeTag(node.id, selected);
    chart.center(node.id, {
      rippleId: node.id,
      vertical: true,
      horizontal: true
    });
    this.setState({ selectedNode: node }, () => {
      this.getHistory();
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

  /**
   * 设置某个节点为根节点
   */
  setRootNode = nodeId => {
    const node =
      this.chart.get(nodeId) || this._nodes.find(item => item.id === nodeId);
    const root = this.chart.getBGNode(nodeId);
    const { selectedNode } = this.state;
    if (selectedNode.id >= 0) {
      this.chart.removeNodeTag(this.state.selectedNode.id, selected);
    }
    this.chart.addNodeTag(nodeId, selected);
    const childrens = this.chart.config.nodes.filter(item => {
      return item.pid == root.id;
    });
    this.chart.config.roots = [root.id];
    this.chart.load(this.chart.config.nodes);
    this.chart.expand(root.id, childrens.map(item => item.id));
    this.chart.center(nodeId, {
      rippleId: node.id,
      vertical: true,
      horizontal: true
    });
    const parentKeys = [];
    this.getParentKeys(node, parentKeys);
    this.setState({ selectedNode: node, rootKey: [nodeId + ''], parentKeys });
  };

  handleExpcollclick = nodeId => {
    const node =
      this.chart.get(nodeId) || this._nodes.find(item => item.id === nodeId);
    const root = this.chart.getBGNode(nodeId);
    this.chart.config.roots = [root.id];
    const { selectedNode } = this.state;
    if (selectedNode.id >= 0) {
      this.chart.removeNodeTag(this.state.selectedNode.id, selected);
    }
    this.chart.addNodeTag(nodeId, selected);
    const parentKeys = [];
    this.getParentKeys(node, parentKeys);
    this.setState({ selectedNode: node, rootKey: [nodeId + ''], parentKeys });
  };
  calcSubNodes = (calcNode, subNodes, allNodes) => {
    //仍有要计算子节点的数据
    if (calcNode.length) {
      let filterNodes = allNodes.filter(item => {
        // item.tags.splice(item.tags.findIndex(tag => tag === selected), 1);
        if (item.tags.includes(selected)) {
          item.tags.splice(item.tags.findIndex(tag => tag === selected), 1);
        }
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
        selected,
        ...this._tags
      };
    } else {
      this.chart.config.tags = { selected };
    }
    this.setState({ isGrouping: checked });
    this.chart.load(this.chart.config.nodes);
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
    this.clearCache();
  };

  /**
   * 保存成功后的回调函数
   */
  afterSave = async (operation, formData, record, form) => {
    const { pidField, idField } = this.props;
    this.closeBroModal();
    if (operation === 'add') {
      const tags = [record.tagsname];
      if (record.isScrap === 'Y') {
        tags.push('discard'); //废弃
      } else if (record.isEmpty === 'Y' && record.PartOccupiedPnId) {
        tags.push('tartOccupied'); //兼任
      } else if (record.isEmpty === 'Y') {
        tags.push('empty'); //空缺
      }

      await this.clearCache();
      this.handleRefresh();
      message.success('添加成功');
      // this.chart.addNode(node);
      // this._nodes.push(node);
    } else if (operation === 'modify') {
      // const oldTags = this.chart.get(record[idField]).tags;
      const tags = [record.tagsname];
      if (record.isScrap === 'Y') {
        tags.push('discard'); //废弃
      } else if (record.isEmpty === 'Y' && record.PartOccupiedPnId) {
        tags.push('tartOccupied'); //兼任
      } else if (record.isEmpty === 'Y') {
        tags.push('empty'); //空缺
      }
      const node = {
        ...record,
        id: record[idField],
        pid: record[pidField],
        tags: [...tags, selected]
      };
      await this.clearCache();
      await this.handleRefresh();
      message.success('修改成功');
      this.setState({ selectedNode: node }, () => {
        this.getHistory();
      });
    }
  };

  onLevelChange = level => {
    this.setState({ currentLevel: level });
    this.chart.expandCollapseToLevel(0, {
      level
    });
    this.chart.draw(OrgChart.action.init);
  };

  handleDateChange = (date, dateString) => {
    this.setState(
      { selectedDate: date, selectedNode: {}, breadcrumb: [] },
      async () => {
        await this.clearCache();
        await this.getData();
      }
    );
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
            tags.push('discard'); //废弃
          } else if (data.isEmpty === 'Y' && data.PartOccupiedPnId) {
            tags.push('tartOccupied'); //兼任
          } else if (data.isEmpty === 'Y') {
            tags.push('empty'); //空缺
          }
          const node = {
            ...selectedNode,
            ...data,
            tags: [...tags]
          };
          this.chart.updateNode(node);
          this.setState({ loading: false, selectedNode: node });
          this.clearCache();
        } catch (error) {
          this.setState({ loading: false });
          console.log(error);
          message.error(error.message);
        }
      }
    });
  };
  handleAddRoot = async () => {
    const { pidField, idField, createWindowName } = this.props;
    const { selectedNode, selectedDate } = this.state;
    let record = {};
    record[pidField] = 0;
    record.updateDate = selectedDate;
    record.orgSupCode = 0;
    record.orgSupNumber = 0;
    record.C3_417654796647 = 0;
    this.getFormData(record, createWindowName);
    this.setState({ addBroVisible: true, operation: 'add', record });
  };
  handleRefresh = async () => {
    const { selectedNode } = this.state;
    await this.getData();
    // this.chart.load(data);
    // this._nodes = [...this.chart.config.nodes];
    if (selectedNode.id) {
      this.chart.center(selectedNode.id);
    }
  };

  calcChildren = (item, data = []) => {
    data.forEach(d => {
      if (d.DEP_PID === item.DEP_ID) {
        item.children.push({
          DEP_ID: d.DEP_ID,
          DEP_PID: d.DEP_PID,
          title: d.DEP_NAME + (d.DEP_NAME_EN ? '-' + d.DEP_NAME_EN : ''),
          key: d.DEP_ID,
          children: []
        });
      }
    });
    if (item.children.length) {
      item.children.forEach(i => {
        this.calcChildren(i, data);
      });
    }
  };

  handleAggridSelectionChange = rows => {
    this.setState({ tableSelectedNode: rows[0] ? rows[0] : {} });
  };

  renderHeader = () => {
    const { mode, isGrouping, selectedNode, currentLevel } = this.state;
    const { hasOpration, hasImport, hasGroup } = this.props;
    const enable =
      selectedNode.isScrap === 'N/A' ||
      selectedNode.isScrap === '' ||
      selectedNode.isScrap === null;
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
        {/* {mode === 'chart' && hasGroup && (
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
        )} */}
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
                <div
                  className="architecture-diagram_header_icon-button"
                  onClick={() => this.handleAddRoot()}
                >
                  <Icon
                    type="link"
                    className="architecture-diagram_header_icon-button__icon"
                  />
                  添加根节点
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
            {mode === 'chart' && (
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
            )}
            {selectedNode.REC_ID && mode === 'chart' && (
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
          </div>
        )}
        <div className="architecture-diagram_header_icon-button-group">
          <div
            className="architecture-diagram_header_icon-button"
            onClick={() => {
              exportExcel(this._emptyJobs, this._cmscolumninfo, '空缺岗位');
            }}
          >
            <Icon
              type="file-excel"
              className="architecture-diagram_header_icon-button__icon"
            />
            下载空缺岗位表格
          </div>
        </div>
      </header>
    );
  };

  renderBreadcrumb = () => {
    const { breadcrumb, firstField, secondaryField } = this.state;
    // const { displayFileds } = this.props;
    return (
      <Breadcrumb
        separator=">"
        style={{ overflow: 'auto', whiteSpace: 'nowrap' }}
      >
        {breadcrumb.map(item => {
          return (
            <Breadcrumb.Item
              onClick={() => {
                // this.handleNodeClick(this.chart, item);
                this.setRootNode(item.id);
              }}
              key={item.id}
            >
              {`${item[firstField]}(${
                item[secondaryField] || item[secondaryField] >= 0
                  ? item[secondaryField]
                  : 'N/A'
              })`}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
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

  renderTree = (data = []) => {
    const { idField } = this.props;
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            key={item[idField]}
            title={`${item.orgName}(${item[idField]})`}
          >
            {this.renderTree(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item[idField]}
          title={`${item.orgName}(${item[idField]})`}
        />
      );
    });
  };

  getTreeData = (data = []) => {
    let rootNode = [];
    const { idField, pidField } = this.props;

    rootNode = data.filter(item => {
      return !data.some(i => i[idField] == item[pidField]);
    });
    rootNode.forEach(item => {
      this.getChildrenNodes(item, data);
    });
    return rootNode;
  };

  getChildrenNodes = (node = {}, allNode = []) => {
    const { idField, pidField } = this.props;
    const children = allNode.filter(item => {
      return item[pidField] === node[idField];
    });
    if (children.length) {
      node.children = children;
      children.forEach(item => {
        this.getChildrenNodes(item, allNode);
      });
    }
  };

  onTreeNodeSelect = selectedKeys => {
    if (selectedKeys.length) {
      const id = parseInt(selectedKeys[0]);
      this.setRootNode(id);
      const parentKeys = [];
      this.getParentKeys(this.chart.get(id), parentKeys);
      this.setState({ rootKey: selectedKeys, parentKeys });
    }
  };
  onExpand = expandedKeys => {
    this.setState({
      parentKeys: expandedKeys
    });
  };
  filterNodes = debounce(value => {
    if (value) {
      this.setState({
        filtedNodes: this.chart.config.nodes.filter(item => {
          return (
            item.orgJobEN.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
            item.orgName.toLowerCase().indexOf(value.toLowerCase()) >= 0
          );
        })
      });
    } else {
      this.setState({ filtedNodes: [] });
    }
  }, 800);

  render() {
    const {
      selectedNode,
      addBroVisible,
      historyData,
      viewHistoryDetailVisible,
      operation,
      record,
      loading,
      mode,
      selfDefineVisible,
      selectedDate,
      detaileMin,
      historyMin,
      detailVisible,
      departmentTreeVisible,
      hasDepartmentFilter,
      treeData,
      rootKey,
      parentKeys,
      filtedNodes,
      fetchingData
    } = this.state;
    const { baseURL, displayFileds, hasView, idField } = this.props;
    return (
      <div className="architecture-diagram">
        <Spin spinning={loading}>
          {this.renderExpand()}
          {this.renderHeader()}
          <div className="architecture-diagram_breadcrumb">
            <div>
              <DatePicker
                value={selectedDate}
                showToday
                onChange={this.handleDateChange}
                size="small"
                allowClear={false}
              />
            </div>
            {hasDepartmentFilter && (
              <Button
                onClick={() => {
                  this.setState({ departmentTreeVisible: true });
                }}
                style={{ margin: '0 8px' }}
                type="primary"
                size="small"
                icon="filter"
              >
                筛选部门
              </Button>
            )}
            <Button
              onClick={this.handleRefresh}
              style={{ margin: '0 8px' }}
              type="primary"
              size="small"
              icon="sync"
            >
              刷新
            </Button>
          </div>
          <div className="architecture-diagram_breadcrumb">
            <div style={{ flexShrink: 0 }}>当前位置：</div>
            {this.renderBreadcrumb()}
          </div>
          <div
            className="architecture-diagram__content"
            ref={ref => {
              this.contentRef = ref;
            }}
          >
            <div className="architecture-diagram__content__main">
              <div
                style={{
                  width: 200,
                  flexShrink: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ padding: 8 }}>
                  <Select
                    showSearch
                    disabled={fetchingData}
                    style={{ width: '100%' }}
                    filterOption={false}
                    notFoundContent={null}
                    onSearch={this.filterNodes}
                    showArrow={false}
                    allowClear
                    defaultActiveFirstOption={false}
                    onSelect={v => {
                      this.setRootNode(v);
                    }}
                    placeholder="岗位名搜索"
                  >
                    {filtedNodes.map(job => {
                      return (
                        <Option
                          value={job.id}
                        >{`${job.orgName}(${job[idField]})`}</Option>
                      );
                    })}
                  </Select>
                </div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                  {fetchingData && <PWSpin />}
                  <Tree
                    onSelect={this.onTreeNodeSelect}
                    checkable={false}
                    defaultExpandAll
                    size="small"
                    selectedKeys={rootKey}
                    expandedKeys={parentKeys}
                    autoExpandParent={true}
                    onExpand={this.onExpand}
                  >
                    {this.renderTree(treeData)}
                  </Tree>
                </div>
              </div>
              <div className="architecture-diagram__content__main__container">
                <div
                  className={classNames({
                    'architecture-diagram__tabledata__container': true,
                    hidden: mode === 'chart'
                  })}
                >
                  <PwAggrid
                    originalColumn={this._cmscolumninfo}
                    dataSource={this.chart ? this.chart.config.nodes : []}
                    // rowSelection={rowSelection}
                    gridProps={[]}
                    onAgGridSelectionChanged={this.handleAggridSelectionChange}
                    resid={this.props.resid}
                    baseURL={this.props.baseURL}
                    hasAdd={false}
                    hasModify={false}
                    hasDelete={false}
                    hasImport={false}
                    hasRefresh={false}
                    hasAdvSearch={false}
                    hasDownload={false}
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
                          if (!item[item.id].enableValue) {
                            return null;
                          }
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
                      {selectedNode.REC_ID ? (
                        historyData.length ? (
                          <Timeline>
                            {historyData.map((item, index) => {
                              return (
                                <Timeline.Item>
                                  <div>
                                    {this._historyColinfo.map((i, ind) => {
                                      return (
                                        <p
                                          key={i.id}
                                          className="architecture-diagram_main_item-detail_list_item"
                                        >
                                          <label>{i.text}：</label>
                                          <span>{item[i.id]}</span>
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
                            <Alert message="无历史记录" type="info" showIcon />
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
                    </div>
                  </div>
                )}
              </div>
            </div>
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
                  this.setState({ firstField: v }, () => {
                    const {
                      firstField,
                      secondaryField,
                      thirdField
                    } = this.state;
                    const json = JSON.stringify({
                      firstField,
                      secondaryField,
                      thirdField
                    });
                    setItem(`displayField${this.props.resid}`, json);
                  });
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
                  this.setState({ secondaryField: v }, () => {
                    const {
                      firstField,
                      secondaryField,
                      thirdField
                    } = this.state;
                    const json = JSON.stringify({
                      firstField,
                      secondaryField,
                      thirdField
                    });
                    setItem(`displayField${this.props.resid}`, json);
                  });
                }}
              >
                {this._cmscolumninfo.map(item => {
                  return (
                    <Select.Option value={item.id}>{item.text}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item label="次次要字段">
              <Select
                // style={{ width: 120 }}
                defaultValue={this.state.thirdField}
                onChange={v => {
                  let nodeBinding = this.chart.config.nodeBinding;
                  nodeBinding.field_2 = v;
                  this.chart.draw();
                  this.setState({ thirdField: v }, () => {
                    const {
                      firstField,
                      secondaryField,
                      thirdField
                    } = this.state;
                    const json = JSON.stringify({
                      firstField,
                      secondaryField,
                      thirdField
                    });
                    setItem(`displayField${this.props.resid}`, json);
                  });
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
        <Drawer
          title="部门筛选"
          onClose={() => {
            this.setState({
              departmentTreeVisible: false
            });
          }}
          width={500}
          placement="left"
          visible={departmentTreeVisible}
        >
          <TreeData
            resid="417643880834"
            baseURL={baseURL}
            idField="DEP_ID"
            pidField="DEP_PID"
            titleField="DEP_NAME"
            rootNode={{
              title: 'Enterprise',
              key: 0
            }}
            onCheck={checkedKeys => {
              if (checkedKeys.length) {
                const nodes = this._nodes.filter(node => {
                  return checkedKeys.some(key => {
                    return node.orgDepCode == key;
                  });
                });
                this.chart.load(nodes);
                this.setState({
                  selectedNode: {},
                  breadcrumb: [],
                  selectedDepartments: checkedKeys
                });
              } else {
                this.chart.load(this._nodes);
                this.setState({
                  selectedNode: {},
                  breadcrumb: [],
                  selectedDepartments: []
                });
              }
            }}
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
