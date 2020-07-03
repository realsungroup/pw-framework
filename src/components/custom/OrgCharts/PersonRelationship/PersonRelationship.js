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
  Tree
} from 'antd';
import './PersonRelationship.less';
import avatarDef from './svg/avatar.svg';
import add1 from './svg/同级.svg';
import add2 from './svg/子级.svg';
import selfDefine from './svg/自定义卡片.svg';
import http, { makeCancelable } from 'Util20/api';
import FormData from '../../../common/data/FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { clone, getIntlVal } from 'Util20/util';
import TableData from '../../../common/data/TableData';
import TreeData from '../../../common/data/TreeData';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { defaultProps, propTypes } from './propTypes';
import moment from 'moment';
import withImport from '../../../common/hoc/withImport';
import withModalDrawer from '../../../common/hoc/withModalDrawer';
import PwAggrid from '../../../common/ui/PwAggrid';
import { getItem, setItem } from 'Util20/util';
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
const selected = 'selected';
const OrgChart = window.OrgChart;
// const BALKANGraph = window.BALKANGraph;
OrgChart.templates.relationshipArchitectureDiagramTemplate = Object.assign(
  {},
  OrgChart.templates.ula
);
OrgChart.templates.relationshipArchitectureDiagramTemplate.node =
  '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect><line x1="0" y1="0" x2="0" y2="120" stroke="#1890FF" stroke-width="2" ></line>';
OrgChart.templates.relationshipArchitectureDiagramTemplate.img_0 =
  '<clipPath id="ulaImg">' +
  '<circle  cx="45" cy="45" r="40"></circle>' +
  '</clipPath>' +
  '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#ulaImg)" xlink:href="{val}" x="10" y="10"  width="60" height="60">' +
  '</image>';
OrgChart.templates.relationshipArchitectureDiagramTemplate.field_0 =
  '<text width="250" class="field_0" style="font-size: 16px;font-weight:bold;" fill="#000000" x="125" y="30" text-anchor="middle">{val}</text>';
OrgChart.templates.relationshipArchitectureDiagramTemplate.field_1 =
  '<text width="250" class="field_1" style="font-size: 16px;" fill="#000000" x="125" y="55" text-anchor="middle">{val}</text>';
OrgChart.templates.relationshipArchitectureDiagramTemplate.field_2 =
  '<text width="250" class="field_1" style="font-size: 16px;" fill="#000000" x="125" y="75" text-anchor="middle">{val}</text>';
OrgChart.templates.relationshipArchitectureDiagramTemplate.field_3 =
  '<text width="200" class="field_1" style="font-size: 16px;" fill="#000000" x="200" y="100" text-anchor="middle">HC:{val}</text>';

class PersonRelationship extends React.Component {
  static defaultProps = defaultProps;
  static propTypes = propTypes;
  userNo = '';
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
    const userInfo = JSON.parse(getItem('userInfo'));
    console.log(userInfo);
    this.userNo = userInfo ? userInfo.UserInfo.EMP_USERCODE : '';

    this.state = {
      selectedNode: {}, // 选中项
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
      selectedDepartment: '',
      departmentTreeVisible: false,
      rootKey: [],
      parentKeys: [],
      filtedNodes: [],
      treeData: []
    };
  }

  async componentDidMount() {
    this.initializeOrgchart();
    // let data = await this.getData();
    let data = await this.getDataById();
    this.chart.load(data);
    this.getData(false);
    // this._nodes = [...this.chart.config.nodes];
    // for (var i = 0; i < data.length; i++) {
    //   data[i].number_children = childCount(data[i].id, data) + 1;
    // }
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
    const { displayFileds } = this.props;

    this.chart = new OrgChart(
      document.getElementById('person-relationship_orgchart'),
      {
        template: 'relationshipArchitectureDiagramTemplate',
        nodeBinding: {
          field_0: firstField,
          field_1: secondaryField,
          field_2: thirdField,
          field_3: 'number_children',
          img_0: displayFileds.imgField
        },
        collapse: {
          level: this.state.currentLevel,
          allChildren: true
        },
        scaleInitial: 0.5,
        // mouseScrool: OrgChart.action.zoom,
        layout: OrgChart.tree,
        enableDragDrop: this.props.role === 'hr' ? true : false,
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
        this.handleExpcollclick(parseInt(id));
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
      displayFileds,
      role,
      rootId
    } = this.props;
    const { selectedDate } = this.state;
    let options = {};
    if (role === 'manager') {
      options = {
        ...procedureConfig,
        resid,
        paravalues: selectedDate.format('YYYYMMDD'),
        idcolumn: idField,
        pidcolumn: pidField,
        id: this.userNo,
        totallevels: 300
      };
    } else {
      options = {
        ...procedureConfig,
        resid,
        paravalues: selectedDate.format('YYYYMMDD'),
        idcolumn: idField,
        pidcolumn: pidField,
        id: rootId,
        totallevels: 300
      };
    }

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
        } else if (item.isEmpty === 'Y') {
          tags.push('empty');
        }
        if (item.isCreated === 'Y') {
          tags.push('created');
        }
        const node = {
          ...item,
          id: item[idField],
          pid: item[pidField],
          [displayFileds.imgField]: avatarDef,
          tags
        };
        const { selectedNode } = this.state;
        if (selectedNode.id === item[idField]) {
          node.tags.push(selected);
          newSelectedNode = node;
        }
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
      displayFileds,
      role,
      rootId,
      level
    } = this.props;
    const { selectedDate, selectedNode } = this.state;
    let options = {};
    if (role === 'manager') {
      options = {
        ...procedureConfig,
        resid,
        paravalues: selectedDate.format('YYYYMMDD'),
        idcolumn: idField,
        pidcolumn: pidField,
        id: this.userNo,
        totallevels: level
      };
    } else {
      options = {
        ...procedureConfig,
        resid,
        paravalues: selectedDate.format('YYYYMMDD'),
        idcolumn: idField,
        pidcolumn: pidField,
        id: rootId,
        totallevels: level
      };
    }

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
        }
        if (item.isCreated === 'Y') {
          tags.push('created');
        }
        const node = {
          ...item,
          id: item[idField],
          pid: item[pidField],
          [displayFileds.imgField]: avatarDef,
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
    const { selectedNode, mode } = this.state;
    // let node;
    // if (mode === 'table') {

    // } else {
    //   node = selectedNode;
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
    this.setState({ selectedNode: node });
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
    this.chart.expand(root.id, childrens.map(item => item.id));
    this.chart.load(this.chart.config.nodes);
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
        this.getData();
      }
    );
  };

  handleRefresh = async () => {
    const { selectedNode } = this.state;
    await this.getData();
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

  renderHeader = () => {
    const { mode, isGrouping, selectedNode, currentLevel } = this.state;
    const { hasOpration, hasGroup } = this.props;
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
      <header className="person-relationship_header">
        <div className="person-relationship_header_icon-button-group">
          <div
            className={classNames({
              'person-relationship_header_icon-button': true,
              'person-relationship_header_icon-button__selected':
                mode === 'chart'
            })}
            onClick={this.handleModeChange('chart')}
          >
            <Icon
              type="apartment"
              className="person-relationship_header_icon-button__icon"
            />
            图形化
          </div>
          <div
            className={classNames({
              'person-relationship_header_icon-button': true,
              'person-relationship_header_icon-button__selected':
                mode === 'table'
            })}
            onClick={this.handleModeChange('table')}
          >
            <Icon
              type="table"
              className="person-relationship_header_icon-button__icon"
            />
            表格化
          </div>
        </div>

        {mode === 'chart' && (
          <div className="person-relationship_header_icon-button-group">
            <div
              className="person-relationship_header_icon-button"
              onClick={this.handleSelfDefine}
            >
              <img
                src={selfDefine}
                className="person-relationship_header_icon-button__icon"
                alt=""
              />
              自定义卡片
            </div>
          </div>
        )}

        {this.props.role === 'hr' && (
          <div className="person-relationship_header_icon-button-group">
            <div
              className="person-relationship_header_icon-button"
              onClick={() => {
                if (selectedNode.id) {
                  window.open(
                    '/fnmodule?resid=626954797692&recid=626954935897&type=人事信息管理&title=岗位信息' +
                      '&selectedNode=' +
                      selectedNode.orgcode
                  );
                } else {
                  window.open(
                    '/fnmodule?resid=626954797692&recid=626954935897&type=人事信息管理&title=岗位信息'
                  );
                }
              }}
            >
              <Icon
                type="switcher"
                className="person-relationship_header_icon-button__icon"
              />
              打开岗位管理窗口
            </div>
          </div>
        )}
      </header>
    );
  };

  renderBreadcrumb = () => {
    const { breadcrumb, firstField, secondaryField } = this.state;
    const { displayFileds } = this.props;
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
              {`${item[firstField]}(${
                item[secondaryField] ? item[secondaryField] : 'N/A'
              })`}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    );
  };

  renderTree = (data = []) => {
    const { idField } = this.props;
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            key={item[idField]}
            title={item.C3_419343735913 || '无任职人'}
          >
            {this.renderTree(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item[idField]}
          title={item.C3_419343735913 || '无任职人'}
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
      this.setRootNode(parseInt(selectedKeys[0]));
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
            item.C3_419343735913.toLowerCase().indexOf(value.toLowerCase()) >= 0
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
      loading,
      mode,
      selfDefineVisible,
      selectedDate,
      detaileMin,
      filtedNodes,
      rootKey,
      parentKeys,
      treeData,
      fetchingData
    } = this.state;
    const { displayFileds, hasView } = this.props;
    return (
      <div className="person-relationship">
        <Spin spinning={loading}>
          {this.renderHeader()}
          <div className="person-relationship_breadcrumb">
            <div>
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
              icon="sync"
            >
              刷新
            </Button>
          </div>
          <div className="person-relationship_breadcrumb">
            当前位置：{this.renderBreadcrumb()}
          </div>
          <div
            className="person-relationship__content"
            ref={ref => {
              this.contentRef = ref;
            }}
          >
            <div
              className={classNames('person-relationship__content__main', {
                hidden: mode === 'table'
              })}
            >
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
                    style={{ width: '100%' }}
                    filterOption={false}
                    disabled={fetchingData}
                    notFoundContent={null}
                    onSearch={this.filterNodes}
                    showArrow={false}
                    allowClear
                    defaultActiveFirstOption={false}
                    onSelect={v => {
                      this.setRootNode(v);
                    }}
                    placeholder="人员英文名搜索"
                    size="small"
                  >
                    {filtedNodes.map(job => {
                      return (
                        <Option value={job.id}>{job.C3_419343735913}</Option>
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
              <div className="person-relationship__chart-container">
                <div id="person-relationship_orgchart"></div>
              </div>
              <div className="person-relationship_main_sider">
                {!detaileMin && (
                  <div className="person-relationship_main_item-detail">
                    <div className="person-relationship_main_sider_title">
                      详细情况
                    </div>
                    {selectedNode.id ? (
                      <div className="person-relationship_main_item-detail_list">
                        {this._cmscolumninfo.map(item => {
                          return (
                            <p
                              key={item.id}
                              className="person-relationship_main_item-detail_list_item"
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
                      <div className="person-relationship_unselect-tip">
                        <Alert
                          message="尚未选中任何卡片！"
                          type="info"
                          showIcon
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div
              className={classNames({
                'person-relationship__tabledata__container': true,
                hidden: mode === 'chart'
              })}
            >
              <PwAggrid
                originalColumn={this._cmscolumninfo}
                dataSource={this._nodes}
                // rowSelection={rowSelection}
                gridProps={[]}
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
          </div>
        </Spin>

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
      </div>
    );
  }
}
const composedHoc = compose(
  injectIntl,
  withImport,
  withModalDrawer()
);

export default composedHoc(PersonRelationship);
