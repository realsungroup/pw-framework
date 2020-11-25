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
  Tabs,
  Checkbox,
  Popover,
  Tree,
  Dropdown,
  Menu,
  Input
} from 'antd';
import './ArchitectureDiagram.less';
import add1 from './svg/同级.svg';
import add2 from './svg/子级.svg';
import avatarDef from './svg/avatar.svg';
import selfDefine from './svg/自定义卡片.svg';
import http, { makeCancelable } from 'Util20/api';
import { getItem, setItem } from 'Util20/util';
import FormData from '../FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { clone, getIntlVal } from 'Util20/util';
import TableData from '../TableData';
import PwAggrid from '../../ui/PwAggrid';
import TreeData from '../TreeData';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { defaultProps, propTypes } from './propTypes';
import moment from 'moment';
import withImport from '../../hoc/withImport';
import withModalDrawer from '../../hoc/withModalDrawer';
import qs from 'qs';
import debounce from 'lodash/debounce';
import PWSpin from 'Common/ui/Spin';
import PlanProgress from './PlanProgress';

const { TreeNode } = Tree;
const { Option } = Select;
const { SubMenu } = Menu;
const yesterday = moment();
const disableDate = currentDate => {
  return currentDate.isBefore(yesterday);
};
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
// window.imageClick = function(e) {
//   Modal.info({
//     title: '照片',
//     icon: null,
//     width: '100%',
//     okText: '关闭',
//     content: (
//       <div
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           height: 300
//         }}
//       >
//         <img
//           style={{ height: '100%', width: 'auto' }}
//           src={e.target.href.baseVal}
//         />
//       </div>
//     )
//   });
// };
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
  '<circle  cx="45" cy="45" r="40"></circle>' +
  '</clipPath>' +
  `<?xml version="1.0" encoding="UTF-8"?>
   <svg width="58px" height="58px" x="10" y="10" viewBox="0 0 178 178" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: Sketch 60.1 (88133) - https://sketch.com -->
      <title>用户</title>
      <desc>Created with Sketch.</desc>
      <defs>
          <rect id="path-1" x="0" y="0" width="178" height="178" rx="89"></rect>
      </defs>
      <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="补充图标" transform="translate(-103.000000, -627.000000)">
              <g id="用户" transform="translate(103.000000, 627.000000)">
                  <mask id="mask-2" fill="white">
                      <use xlink:href="#path-1"></use>
                  </mask>
                  <use id="蒙版" fill="#FFFFFF" xlink:href="#path-1"></use>
                  <g mask="url(#mask-2)" fill-rule="nonzero">
                      <g transform="translate(15.000000, 16.000000)">
                          <path d="M147.996801,154.55819 L147.996801,140.470899 C147.996801,111.580013 111.29702,103.70068 111.29702,103.70068 L37.2130811,103.70068 C37.2130811,103.70068 0,111.580013 0,140.470899 L0,154.55819 C0,154.55819 -0.0855303036,165.18335 11.891088,165.541502 C23.8677064,165.899653 74.340598,165.541502 74.340598,165.541502 C74.340598,165.541502 124.556848,165.899653 136.533466,165.541502 C148.510085,165.18335 147.996801,154.55819 147.996801,154.55819 Z" id="路径" fill="#999999"></path>
                          <path d="M87.5918367,101.687075 L74.7965611,101.687075 L37.3553519,102.446454 C37.3553519,102.446454 0,108.774613 0,129.193472 L0,139.149775 C0,139.149775 -0.0858572979,146.65919 11.9365493,146.912317 C23.958956,147.165443 24.0448303,146.743566 24.0448303,146.743566 L60.6272962,119.40592 L87.5918367,119.40592 L87.5918367,101.687075 Z" id="路径" fill="#666666"></path>
                          <polygon id="路径" fill="#C7928E" points="52.3537415 81.5510204 95.6462585 81.5510204 95.6462585 108.734694 52.3537415 108.734694"></polygon>
                          <path d="M115.768224,43.6346074 C115.768224,43.6346074 121.471716,61.0506258 105.916738,71.4829932 L105.916738,40.2721088 L115.768224,43.6346074 Z M29.5245129,43.6346074 C29.5245129,43.6346074 26.4135173,61.0506258 39.375999,71.4829932 L39.375999,40.2721088 L29.5245129,43.6346074 Z" id="形状" fill="#333333"></path>
                          <path d="M39.2721263,39.8653288 L39.2721263,71.4485801 C39.2721263,71.4485801 46.6900976,98.6666667 73.1587679,98.6666667 C99.6274382,98.6666667 106.708229,70.9350313 106.708229,70.9350313 L106.708229,42.0907069 C106.708229,42.0907069 108.394132,1.00680272 73.1587679,1.00680272 C37.9234043,1.00680272 39.2721263,39.8653288 39.2721263,39.8653288 Z" id="路径" fill="#FECCCB"></path>
                          <path d="M74.5034014,98.6666667 C47.9841758,98.6666667 40.2850458,71.4724138 40.2850458,71.4724138 L40.2850458,39.9168186 C40.2850458,39.9168186 38.5741281,1.00680272 74.5034014,1.00680272 L74.5034014,98.6666667 Z" id="路径" fill="#D8AEAF"></path>
                          <path d="M58.9300912,22.6530612 C58.9300912,22.6530612 64.6710088,45.3061224 117.795918,45.3061224 C117.795918,45.3061224 116.939065,0 73.7536547,0 C30.5682443,0 29.1972789,45.3061224 29.1972789,45.3061224 C29.1972789,45.3061224 47.2768852,40.4700757 58.9300912,22.6530612 Z" id="路径" fill="#2B2B2B"></path>
                          <polygon id="路径" fill="#B6D5D0" points="50.559304 89.6054422 36.244898 104.036281 59.6684715 120.816327 74.5034014 109.489796"></polygon>
                          <polygon id="路径" fill="#B6D5D0" points="96.4338933 89.6054422 110.748299 104.036281 87.4114798 120.816327 72.4897959 109.489796"></polygon>
                      </g>
                  </g>
              </g>
          </g>
      </g>
    </svg>`;
OrgChart.templates.architectureDiagramTemplate.field_0 =
  '<text width="200" class="field_0" style="font-size: 16px;font-weight:bold;" fill="#000000" x="150" y="40" text-anchor="middle">{val}</text>';
OrgChart.templates.architectureDiagramTemplate.field_1 =
  '<text width="200" class="field_1" style="font-size: 16px;" fill="#000000" x="150" y="65" text-anchor="middle">{val}</text>';
OrgChart.templates.architectureDiagramTemplate.field_2 =
  '<text width="200" class="field_1" style="font-size: 16px;" fill="#000000" x="150" y="85" text-anchor="middle">{val}</text>';
OrgChart.templates.architectureDiagramTemplate.field_3 =
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
      resultMin: true,
      hasImportResult: false,
      detailVisible: false,
      selectedResultResid: '638645137963',
      selectedType: 'IDL',
      hasDetail: true,
      hasHistory: true,
      selectedDepartments: [],
      departmentTreeVisible: false,
      treeData: [],
      treeDataList: [],
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      selectedBranch: 'all',
      rootKey: [],
      parentKeys: [],
      filtedNodes: [],
      joinVisible: false,
      joinRecord: {},
      selectedResult: '全部',
      transferDate: moment(),
      DLImportResultVisible: false
    };
  }

  async componentDidMount() {
    this.initializeOrgchart();
    await this.clearCache();
    let data = await this.getDataById();
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
    const { firstField, secondaryField, thirdField } = this.state;

    this.chart = new OrgChart(
      document.getElementById('architecture-diagram_orgchart'),
      {
        template: 'architectureDiagramTemplate',
        nodeBinding: {
          field_0: firstField,
          field_1: secondaryField,
          field_2: thirdField,
          field_3: 'number_children',
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
          ruzhi: {
            text: '人员入职',
            icon: '<img/>',
            onClick: this.handleJoin
          },
          lizhi: {
            text: '人员离职',
            icon: '<img/>',
            onClick: this.openLizhiModal
          },
          transferTo: {
            text: '调动至其他岗位',
            icon: '<img/>',
            onClick: this.openTransferToModal
          },
          transferFrom: {
            text: '从在职人员调动',
            icon: '<img/>',
            onClick: this.openTransferFromModal
          },
          addPerson: {
            text: '变更兼职人员',
            icon: '<img/>',
            onClick: this.openAddModal
          },
          importPerson: {
            text: '从未匹配人员导入',
            icon: '<img/>',
            onClick: this.openImportModal
          },
          clearPerson: {
            text: `<span style='color:red'>清空兼职人员</span>`,
            icon: '<img/>',
            onClick: this.clearPerson
          }
        },

        enableSearch: false,
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
  _emptyJobs = []; //空缺岗位
  _transferableJobs = []; //空缺岗位
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
    this._transferableJobs = [];
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
          memberAvatar: avatarDef,
          tags
        };
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
        if (
          (item.isEmpty === 'Y' ||
            item.isPartOccupied === 'Y' ||
            item.isVirtual === 'Y') &&
          item.isScrap !== 'Y'
        ) {
          this._transferableJobs.push(item);
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
      if (newSelectedNode.id) {
        this.getHistory();
        this.getPartHistory();
      }
      this.chart.load(nodes);
      this._nodes = [...nodes];
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

        // let ImgObj = new Image(); //判断图片是否存在
        // ImgObj.src = item.memberAvatar;
        // let url;
        //没有图片，则返回-1
        // if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
        //   url = item.memberAvatar;
        // } else {
        //   url = avatarDef;
        // }
        // url = avatarDef;

        const node = {
          ...item,
          id: item[idField],
          pid: item[pidField],
          memberAvatar: avatarDef,
          tags
        };
        if (selectedNode.id === item[idField]) {
          node.tags.push(selected);
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
    const { baseURL, dblinkname, resid } = this.props;
    const { selectedNode } = this.state;
    this.p6 && this.p6.cancel();
    let httpParams = {};
    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    this.p6 = makeCancelable(
      http(httpParams).getTableByHostRecord({
        resid,
        subresid: 639083780814,
        hostrecid: selectedNode.REC_ID,
        cmswhere: 'pnid != 0',
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
   * 入职
   */
  handleJoin = id => {
    const node = this.chart.get(id);
    if (node.isScrap === 'Y') {
      return message.info('岗位已废弃');
    }
    if (node.isScrap !== 'Y' && node.isScrap !== 'N') {
      return message.info('岗位未启用');
    }
    if (node.isVirtual !== 'Y' && node.isEmpty !== 'Y') {
      return message.info('非空缺岗位');
    }
    this.getJoinFormData({
      C3_465142349966: node.orgNumber,
      C3_638469590670: '入职'
    });
    this.setState({
      joinVisible: true
    });
    this.handleNodeClick(this.chart, {
      node: { id }
    });
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
    this.setState(
      { selectedNode: node, historyData: [], partHistoryData: [] },
      () => {
        this.getHistory();
        this.getPartHistory();
      }
    );
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
   * 获取入职窗体数据
   */
  getJoinFormData = async record => {
    let res;
    try {
      const { importResid, baseURL } = this.props;
      this.setState({ loading: true });
      let httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      res = await http(httpParams).getFormData({
        resid: importResid,
        formName: 'join'
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
    if (node.isScrap !== 'Y' && node.isScrap !== 'N') {
      return message.info('岗位未启用');
    }
    if (node.isScrap === 'Y') {
      return message.info('岗位已废弃');
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
                        await this.clearCache();
                        this.props.closeModalOrDrawer();
                        this.setState({ loading: false });
                        await this.getData();
                        message.success('兼职成功');
                        if (node.id) {
                          this.chart.center(node.id);
                          this.getPartHistory();
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
                resid="647606607473"
                wrappedComponentRef={element =>
                  (this.addModalTableDataRef = element)
                }
                refTargetComponentName="TableData"
                subtractH={180}
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
    this.handleNodeClick(this.chart, {
      node: { id: nodeId }
    });
  };

  openLizhiModal = nodeId => {
    const { baseURL } = this.props;
    const node = this.chart.get(nodeId);
    if (node.isScrap === 'Y') {
      return message.info('岗位已废弃');
    }
    if (node.isScrap !== 'Y' && node.isScrap !== 'N') {
      return message.info('岗位未启用');
    }
    if (node.isEmpty === 'Y') {
      return message.info('空缺岗位，不可离职');
    }
    if (node.isVirtual === 'Y') {
      return message.info('多人任职岗位请使用导入离职方式');
    }
    this.props.openModalOrDrawer(
      'modal',
      {
        title: '人员离职',
        width: '50vw',
        onCancel: this.props.closeModalOrDrawer,
        footer: null
      },
      () => {
        return (
          <LizhiForm
            name={node.memberCN}
            number={node.memberID}
            onOk={async data => {
              try {
                let httpParams = {};
                if (baseURL) {
                  httpParams.baseURL = baseURL;
                }
                this.props.closeModalOrDrawer();
                this.setState({ loading: true });
                await http(httpParams).modifyRecords({
                  resid: '655636441513',
                  isEditOrAdd: true,
                  data: [
                    {
                      C3_244132849812: data.lizhiDate, //离职日期
                      C3_418993073324: data.lizhiReason, //离职原因
                      C3_383426933426: data.lizhiType, //离职类型
                      C3_470524257391: data.date, //生效日期
                      C3_543601479390: data.aDate, //实际离职日期
                      C3_305737857578: node.memberCode,
                      C3_470524286017: data.lizhiDate.format('YYYYMMDD'),
                      C3_638469590670: '离职',
                      C3_465142349966: '',
                      C3_294355760203: '',
                      C3_655655647639: 'Y', //锁定
                      C3_294483212234: 'Y' //离职薪已结
                    }
                  ],
                  rp: {
                    EnableBitianCheck: false,
                    EnableFormula1Layer: false
                  },
                  formulalayer: '0'
                });
                await this.clearCache();
                this.setState({ loading: false });
                await this.getData();
              } catch (error) {
                console.error(error);
                message.error(error.message);
              }
            }}
            onCancel={this.props.closeModalOrDrawer}
          />
        );
      },
      {}
    );
  };
  openTransferToModal = nodeId => {
    const node = this.chart.get(nodeId);
    if (node.isScrap === 'Y') {
      return message.info('岗位已废弃');
    }
    if (node.isScrap !== 'Y' && node.isScrap !== 'N') {
      return message.info('岗位未启用');
    }
    if (node.isVirtual === 'Y') {
      return message.info('多人任职岗位请使用导入变动方式');
    }
    if (node.isEmpty === 'Y') {
      return message.info('空缺岗位不可调动');
    }
    this.props.openModalOrDrawer(
      'modal',
      {
        title: '调动至其他岗位',
        width: '80vw',
        onCancel: this.props.closeModalOrDrawer,
        footer: null
      },
      () => {
        return (
          <div>
            <div style={{ height: 600 }}>
              <PwAggrid
                originalColumn={this._cmscolumninfo}
                dataSource={this._transferableJobs}
                onReady={gridApi => {
                  this.transferGridApi = gridApi;
                }}
                gridProps={[]}
                resid={638646080344}
                baseURL={this.props.baseURL}
                hasAdd={false}
                hasModify={false}
                hasDelete={false}
                hasImport={false}
                hasRefresh={false}
                hasAdvSearch={false}
                hasDownload={false}
                rowSelectionAg="single"
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '8px 0'
              }}
            >
              <Button
                type="primary"
                onClick={() => {
                  const waitingImport = this.transferGridApi.getSelectedRows();
                  if (!waitingImport.length) {
                    return message.info('请选择待调动人员');
                  }
                  Modal.confirm({
                    title: '选择生效日期',
                    content: (
                      <div>
                        <DatePicker
                          defaultValue={this.state.transferDate}
                          disabledDate={disableDate}
                          onChange={v => {
                            this.setState({ transferDate: v });
                          }}
                        />
                      </div>
                    ),
                    onOk: async () => {
                      this.handleTransfer({
                        C3_638469590670: '变动',
                        C3_470524257391: this.state.transferDate, //生效日期
                        C3_227192472953: node.memberID,
                        C3_305737857578: node.memberCode,
                        C3_227192484125: node.memberCN,
                        C3_465142349966: waitingImport[0].orgNumber
                      });
                    }
                  });
                }}
              >
                确认调动
              </Button>
            </div>
          </div>
        );
      },
      {}
    );
    this.handleNodeClick(this.chart, {
      node: { id: nodeId }
    });
  };
  openTransferFromModal = nodeId => {
    const node = this.chart.get(nodeId);
    if (node.isScrap === 'Y') {
      return message.info('岗位已废弃');
    }
    if (node.isScrap !== 'Y' && node.isScrap !== 'N') {
      return message.info('岗位未启用');
    }
    if (node.isVirtual !== 'Y' && node.isEmpty !== 'Y') {
      return message.info('非空缺岗位');
    }
    this.props.openModalOrDrawer(
      'modal',
      {
        title: '从在职人员调动',
        width: '80vw',
        onCancel: this.props.closeModalOrDrawer,
        footer: null
      },
      () => {
        return (
          <div>
            <div style={{ height: 600 }}>
              <TableData
                baseURL={this.props.baseURL}
                resid="638645137963"
                wrappedComponentRef={element =>
                  (this.transferFromTableDataRef = element)
                }
                refTargetComponentName="TableData"
                // subtractH={240}
                hasAdd={false}
                tableComponent="ag-grid"
                rowSelectionAg={'single'}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasRowSelection={false}
                cmswhere={`C3_294355760203 = 'Y' and importStatus = '正常'`}
                afterSaveRefresh={true}
                hasAdvSearch={false}
                importConfig={null}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '8px 0'
              }}
            >
              <Button
                type="primary"
                onClick={() => {
                  const waitingImport = this.transferFromTableDataRef.getAggridSelectedRows();
                  if (!waitingImport.length) {
                    return message.info('请选择待调动人员');
                  }
                  Modal.confirm({
                    title: '选择生效日期',
                    content: (
                      <div>
                        <DatePicker
                          defaultValue={this.state.transferDate}
                          disabledDate={disableDate}
                          onChange={v => {
                            this.setState({ transferDate: v });
                          }}
                        />
                      </div>
                    ),
                    onOk: async () => {
                      this.handleTransfer({
                        C3_638469590670: '变动',
                        C3_470524257391: this.state.transferDate, //生效日期
                        C3_417994161226: waitingImport[0].C3_417994161226,
                        C3_227192472953: waitingImport[0].C3_227192472953,
                        C3_305737857578: waitingImport[0].C3_305737857578,
                        C3_227192484125: waitingImport[0].C3_227192484125,
                        C3_465142349966: node.orgNumber,
                        C3_308778699827: waitingImport[0].C3_308778699827
                      });
                    }
                  });
                }}
              >
                确认调动
              </Button>
            </div>
          </div>
        );
      },
      {}
    );
    this.handleNodeClick(this.chart, {
      node: { id: nodeId }
    });
  };

  /**
   * 调动
   */
  handleTransfer = async record => {
    const { baseURL } = this.props;
    try {
      let httpParams = {};
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      this.props.closeModalOrDrawer();
      this.setState({ loading: true });
      await http(httpParams).modifyRecords({
        resid: '638646080344',
        isEditOrAdd: true,
        data: [record]
      });
      await this.clearCache();
      this.setState({ loading: false });
      await this.getData();
      message.success('调动成功');
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  clearCache = async () => {
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

  clearPerson = nodeId => {
    const node = this.chart.get(nodeId);
    if (node.isScrap === 'Y') {
      return message.info('岗位已废弃');
    }
    if (node.isEmpty !== 'Y') {
      return message.info('非空缺岗位');
    }
    if (node.isEmpty === 'Y' && node.isPartOccupied !== 'Y') {
      return message.info('无兼职人员');
    }
    const { baseURL, historyResid } = this.props;
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
          await this.clearCache();
          this.setState({ loading: false });
          this.props.closeModalOrDrawer();
          // 重新获取数据
          await this.getData();
          message.success('清空成功');

          if (node.id) {
            this.chart.center(node.id);
          }
        } catch (error) {
          message.error(error.message);
          this.setState({ loading: false });
        }
      }
    });
  };

  openImportModal = nodeId => {
    const node = this.chart.get(nodeId);
    const { baseURL } = this.props;
    if (node.isEmpty !== 'Y' && node.isVirtual !== 'Y') {
      return message.info('非空缺岗位');
    }
    if (node.isScrap !== 'Y' && node.isScrap !== 'N') {
      return message.info('岗位未启用');
    }
    if (node.isScrap === 'Y') {
      return message.info('岗位已废弃');
    }
    if (
      node.isVirtual !== 'Y' &&
      (node.PartOccupiedPnId && node.PartOccupiedPnId !== 'N/A')
    ) {
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
                        {/* <div>
                          生效日期：
                          {this.state.selectedDate.format('YYYY-MM-DD')}
                        </div> */}
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
                        await this.clearCache();
                        this.setState({ loading: false });
                        this.props.closeModalOrDrawer();
                        await this.getData();
                        message.success('任职成功');
                        if (node.id) {
                          this.chart.center(node.id);
                          this.getHistory();
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
                resid="655673514788"
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
    this.handleNodeClick(this.chart, {
      node: { id: nodeId }
    });
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
    this.setState(
      {
        selectedNode: node,
        rootKey: [nodeId + ''],
        parentKeys,
        partHistoryData: [],
        historyData: []
      },
      this.getHistory
    );
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
  closeJoinModal = () => this.setState({ joinVisible: false });

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
      await this.clearCache();
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

  handleJoinSuccess = async () => {
    this.closeJoinModal();
    await this.clearCache();
    await this.getData();
    message.success('入职成功');
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

  handleDownload = () => {
    window.open(
      window.pwConfig[process.env.NODE_ENV].customURLs.importTemplateDownloadURL
    );
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
  /**
   * 入职
   */
  handleRuzhi = () => {
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
        this.handleFinishImport,
        {},
        { fileName: moment().format('YYYY-MM-DD HH:mm') },
        true
      );
  };
  /**
   * DL入职
   */
  handleDLRuzhi = () => {
    const { openImportView, baseURL, importConfig, dblinkname } = this.props;
    const url = baseURL || window.pwConfig[process.env.NODE_ENV].baseURL;

    openImportView &&
      openImportView(
        dblinkname,
        url,
        '656418093200',
        importConfig.mode,
        importConfig.containerType,
        importConfig.saveState,
        importConfig.containerProps,
        () => {
          this.setState({ DLImportResultVisible: true });
          this.props.closeImportView();
          this.DLImportResultRef && this.DLImportResultRef.refreshTable();
        },
        {},
        { fileName: moment().format('YYYY-MM-DD HH:mm') },
        false
      );
  };
  /**
   * 离职
   */
  handleLizhi = () => {
    const { openImportView, baseURL, importConfig, dblinkname } = this.props;
    const url = baseURL || window.pwConfig[process.env.NODE_ENV].baseURL;

    openImportView &&
      openImportView(
        dblinkname,
        url,
        655636441513,
        importConfig.mode,
        importConfig.containerType,
        importConfig.saveState,
        importConfig.containerProps,
        this.handleFinishImport,
        {
          rp: {
            EnableBitianCheck: false,
            EnableFormula1Layer: false
          },
          formulalayer: '0'
        },
        {
          C3_465142349966: '',
          C3_294355760203: '',
          C3_655655647639: 'Y' //锁定
        },
        true,
        'fileName'
      );
  };
  /**
   * 变动
   */
  handleBiandong = () => {
    const { openImportView, baseURL, importConfig, dblinkname } = this.props;
    const url = baseURL || window.pwConfig[process.env.NODE_ENV].baseURL;

    openImportView &&
      openImportView(
        dblinkname,
        url,
        655636467905,
        importConfig.mode,
        importConfig.containerType,
        importConfig.saveState,
        importConfig.containerProps,
        this.handleFinishImport,
        {},
        {},
        false,
        'fileName'
      );
  };

  handleFinishImport = async () => {
    await this.clearCache();
    this.props.closeImportView();
    await this.getData();
    this.setState({ hasImportResult: true, resultMin: false }, () => {
      // this.contentRef.scrollTo({
      //   left: 0,
      //   top: window.innerHeight,
      //   behavior: 'smooth'
      // });
      this.tableDataRef && this.tableDataRef.handleRefresh();
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
    await this.getData();
    if (selectedNode.id) {
      this.chart.center(selectedNode.id);
    }
  };

  handleAggridSelectionChange = rows => {
    this.setState({ tableSelectedNode: rows[0] ? rows[0] : {} });
  };

  renderHeader = () => {
    const {
      mode,
      isGrouping,
      selectedNode,
      currentLevel,
      hasDetail,
      hasHistory
    } = this.state;
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
        {/* {mode === 'chart' && (
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
        {/* {mode === 'chart' && (
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
        )} */}
        {hasImport && (
          <div className="architecture-diagram_header_icon-button-group">
            <Dropdown
              overlay={
                <Menu>
                  <SubMenu title="入职">
                    <Menu.Item onClick={this.handleDLRuzhi}>DL</Menu.Item>
                    <Menu.Item onClick={this.handleRuzhi}>IDL</Menu.Item>
                  </SubMenu>
                  <SubMenu title="变动">
                    <Menu.Item onClick={this.handleDLRuzhi}>DL</Menu.Item>
                    <Menu.Item onClick={this.handleBiandong}>IDL</Menu.Item>
                  </SubMenu>
                  <Menu.Item onClick={this.handleLizhi}>离职</Menu.Item>
                  {/* <Menu.Item onClick={this.handleImport}>兼任</Menu.Item> */}
                </Menu>
              }
            >
              <div className="architecture-diagram_header_icon-button">
                <Icon
                  type="upload"
                  className="architecture-diagram_header_icon-button__icon"
                />
                导入数据
              </div>
            </Dropdown>
            <div
              className="architecture-diagram_header_icon-button"
              onClick={this.handleDownload}
            >
              <Icon
                type="download"
                className="architecture-diagram_header_icon-button__icon"
              />
              下载导入模板
            </div>
            <div
              className="architecture-diagram_header_icon-button"
              onClick={() => {
                this.setState({ resultMin: false });
              }}
            >
              <Icon
                type="eye"
                className="architecture-diagram_header_icon-button__icon"
              />
              查看导入结果
            </div>
            <div
              className="architecture-diagram_header_icon-button"
              onClick={() => {
                this.setState({ DLImportResultVisible: true });
              }}
            >
              <Icon
                type="eye"
                className="architecture-diagram_header_icon-button__icon"
              />
              查看DL导入匹配结果
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
    // const { displayFileds, name } = this.props;
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
                item.memberCN && item.memberCN !== 'N/A'
                  ? item.memberCN
                  : '无任职人'
              })`}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    );
  };

  handleCloseImportResult = () => {
    this.setState({
      resultMin: true
    });
  };
  renderImportResult = () => {
    const { baseURL } = this.props;
    const {
      selectedResultResid,
      selectedType,
      mode,
      resultMin,
      selectedResult
    } = this.state;
    let cmswhere = '';
    if (selectedType) {
      cmswhere += `C3_417994161226 = '${selectedType}'`;
    }
    if (selectedResult && selectedResult !== '全部') {
      cmswhere += `${
        cmswhere ? ' and ' : ''
      } importStatus = '${selectedResult}'`;
    }
    return (
      <div
        className={classNames('architecture-diagram__import-result', {
          hidden: resultMin
        })}
      >
        <div
          className="architecture-diagram__import-result-mask"
          onClick={this.handleCloseImportResult}
        ></div>
        <div
          id="import-result"
          className={classNames('architecture-diagram__import-result__main')}
        >
          <div className="architecture-diagram__import-result__main__title">
            导入结果
            <Icon
              type="close"
              className="architecture-diagram__min-button"
              style={{ fontSize: 16 }}
              onClick={this.handleCloseImportResult}
            />
          </div>
          <div className="architecture-diagram__import-result__main__content">
            <div style={{ marginBottom: 16 }}>
              <Select
                style={{ width: 120, marginRight: 16 }}
                size="small"
                onChange={v => {
                  this.setState({ selectedResultResid: v });
                  if (v === '638646009862') {
                    this.setState({ selectedResult: '全部' });
                  }
                }}
                value={selectedResultResid}
              >
                <Select.Option value="638645137963">全部</Select.Option>
                <Select.Option value="638645984799">入职</Select.Option>
                <Select.Option value="638646080344">变动</Select.Option>
                <Select.Option value="638646009862">离职</Select.Option>
              </Select>
              <Select
                style={{ width: 120, marginRight: 16 }}
                size="small"
                onChange={v => {
                  this.setState({ selectedResult: v });
                }}
                value={selectedResult}
              >
                <Select.Option value="全部">全部</Select.Option>
                <Select.Option
                  disabled={selectedResultResid === '638646009862'}
                  value="正常"
                >
                  正常
                </Select.Option>
                <Select.Option
                  disabled={selectedResultResid === '638646009862'}
                  value="未匹配"
                >
                  未匹配
                </Select.Option>
                <Select.Option
                  disabled={selectedResultResid === '638646009862'}
                  value="错误"
                >
                  错误
                </Select.Option>
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
              {selectedResult === '未匹配' && (
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
                          await this.clearCache();
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
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
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
                cmswhere={cmswhere}
                afterSaveRefresh={true}
                afterSaveCallback={this.clearCache}
                hasAdvSearch={false}
                importConfig={null}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  renderExpand = () => {
    const { detaileMin, historyMin, hasDetail, hasHistory } = this.state;
    return (
      <div className="architecture-diagram__expand-buttons">
        {hasDetail && detaileMin && (
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
        {hasHistory && historyMin && (
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
            title={`${item.memberCN || '无任职人'}(${item.orgName})`}
          >
            {this.renderTree(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item[idField]}
          title={`${item.memberCN || '无任职人'}(${item.orgName})`}
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
            item.orgName.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
            item.memberCN.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
            item.memberID.indexOf(value.toLowerCase()) >= 0 ||
            item.orgJobEN.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
            item.orgJobCN.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
            item.orgNumber.toLowerCase().indexOf(value.toLowerCase()) >= 0
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
      detailVisible,
      hasDetail,
      hasHistory,
      departmentTreeVisible,
      treeData,
      parentKeys,
      rootKey,
      filtedNodes,
      fetchingData,
      joinVisible,
      joinRecord,
      DLImportResultVisible
    } = this.state;
    const { baseURL, displayFileds, hasView, historyResid } = this.props;
    return (
      <div className="architecture-diagram">
        <Spin spinning={loading}>
          {this.renderExpand()}
          {this.renderHeader()}
          <div className="architecture-diagram_breadcrumb">
            <div style={{ marginRight: 8 }}>
              <DatePicker
                value={selectedDate}
                showToday
                onChange={this.handleDateChange}
                size="small"
                allowClear={false}
              />
            </div>
            {/* <Button
              onClick={() => {
                this.setState({ departmentTreeVisible: true });
              }}
              style={{ margin: '0 8px' }}
              type="primary"
              size="small"
              icon="filter"
            >
              筛选部门
            </Button> */}
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
                    placeholder="岗位名、人员姓名、工号搜索"
                    size="small"
                  >
                    {filtedNodes.map(job => {
                      return (
                        <Option
                          value={job.id}
                        >{`${job.memberCN}(${job.orgName})`}</Option>
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
                    dataSource={this._nodes}
                    // rowSelection={rowSelection}
                    onAgGridSelectionChanged={this.handleAggridSelectionChange}
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
                {hasDetail && !detaileMin && (
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
                                selectedNode[item.id] &&
                                selectedNode[item.id] !== 'N/A' && (
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
                              {(!selectedNode[item.id] ||
                                selectedNode[item.id] == 'N/A') &&
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
                {hasHistory && !historyMin && (
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
                            partHistoryData.length ? (
                              <Timeline>
                                {partHistoryData.map((item, index) => {
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

            {this.renderImportResult()}
            {DLImportResultVisible && (
              <DLImportResult
                ref={e => (this.DLImportResultRef = e)}
                baseURL={baseURL}
                onClose={this.handleCloseDLRuzhiImport}
              />
            )}
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
        <Modal
          visible={joinVisible}
          title="人员入职"
          width={800}
          footer={null}
          onCancel={this.closeJoinModal}
          destroyOnClose
        >
          <FormData
            info={{ dataMode: 'main', resid: this.props.importResid }}
            operation="add"
            data={this._dataProp}
            record={joinRecord}
            // useAbsolute={true}
            // formProps={{ width: 500 }}
            onCancel={this.closeJoinModal}
            onSuccess={this.handleJoinSuccess}
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
                resid={historyResid}
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
                recordFormUseAbsolute={true}
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
  handleCloseDLRuzhiImport = () => {
    this.setState({ DLImportResultVisible: false });
  };
}
const composedHoc = compose(
  injectIntl,
  withImport,
  withModalDrawer()
);

export default composedHoc(ArchitectureDiagram);

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
class LizhiForm extends React.PureComponent {
  state = {
    lizhiDate: null,
    lizhiReason: '',
    lizhiType: '',
    date: null,
    aDate: null
  };
  render() {
    const { lizhiDate, lizhiReason, date, lizhiType, aDate } = this.state;
    const { name, number } = this.props;
    return (
      <Form {...formItemLayout}>
        <Form.Item label="离职人姓名">
          <Input value={name} disabled />
        </Form.Item>
        <Form.Item label="离职人工号">
          <Input value={number} disabled />
        </Form.Item>
        <Form.Item label="离职日期" required>
          <DatePicker
            value={lizhiDate}
            onChange={v => {
              this.setState({ lizhiDate: v });
            }}
          />
        </Form.Item>
        <Form.Item label="离职原因" required>
          <Input
            value={lizhiReason}
            onChange={e => {
              this.setState({ lizhiReason: e.target.value });
            }}
          />
        </Form.Item>
        <Form.Item label="离职类型" required>
          <Input
            value={lizhiType}
            onChange={e => {
              this.setState({ lizhiType: e.target.value });
            }}
          />
        </Form.Item>
        <Form.Item label="生效日期" required>
          <DatePicker
            value={date}
            onChange={v => {
              this.setState({ date: v });
            }}
          />
        </Form.Item>
        <Form.Item label="实际离职日期">
          <DatePicker
            value={aDate}
            onChange={v => {
              this.setState({ aDate: v });
            }}
          />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            onClick={() => {
              if (!lizhiDate) {
                return message.info('请选择离职日期');
              }
              if (!lizhiReason) {
                return message.info('请输入离职原因');
              }
              if (!lizhiType) {
                return message.info('请输入离职类型');
              }
              if (!date) {
                return message.info('请选择生效日期');
              }
              this.props.onOk({
                lizhiDate,
                lizhiReason,
                lizhiType,
                date,
                aDate
              });
            }}
          >
            提交
          </Button>
        </div>
      </Form>
    );
  }
}

class DLImportResult extends React.PureComponent {
  state = {
    activeKey: '1',
    addVisible: false,
    record: {},
    isShowProgress: false,
    submiteData: [],
    selectedSubmiteData: [],
    spinnig: false
  };
  componentDidMount() {
    this.getFormData();
  }
  refreshTable = () => {
    this.tableDataRef1 && this.tableDataRef1.handleRefresh();
    this.tableDataRef2 && this.tableDataRef2.handleRefresh();
  };
  defaultPagination = {
    pageSize: 100,
    current: 1,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '30', '40', '100']
  };
  render() {
    const { visible, baseURL, onClose } = this.props;
    const {
      activeKey,
      addVisible,
      record,
      isShowProgress,
      submiteData,
      spinnig
    } = this.state;
    return (
      <div className={classNames('architecture-diagram__import-result', {})}>
        <div
          className="architecture-diagram__import-result-mask"
          onClick={this.handleCloseImportResult}
        ></div>
        <Spin spinning={spinnig}>
          <div
            id="import-result"
            className={classNames('architecture-diagram__import-result__main')}
          >
            <div className="architecture-diagram__import-result__main__title">
              DL入职匹配结果
              <Icon
                type="close"
                className="architecture-diagram__min-button"
                style={{ fontSize: 16 }}
                onClick={onClose}
              />
            </div>
            <div className="architecture-diagram__import-result__main__content">
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <Tabs
                  activeKey={activeKey}
                  onChange={this.handleActiveKeyChange}
                >
                  <Tabs.TabPane tab="未匹配" key="1">
                    <TableData
                      baseURL={baseURL}
                      resid={'656440052647'}
                      wrappedComponentRef={element =>
                        (this.tableDataRef1 = element)
                      }
                      refTargetComponentName="TableData"
                      subtractH={180}
                      hasAdd={false}
                      hasRowView={false}
                      hasRowDelete={true}
                      // hasRowEdit={true}
                      // hasRowEditAdd={true}
                      hasDelete={true}
                      hasModify={false}
                      hasRowModify={true}
                      hasRowSelection={true}
                      hasAdvSearch={false}
                      importConfig={null}
                      hasBeBtns
                      customRowBtns={[
                        (record, btnSize) => {
                          if (record.C3_465142349966) {
                            return null;
                          }
                          return (
                            <Button
                              type="primary"
                              size={btnSize}
                              onClick={() => this.handleCreateJobClick(record)}
                            >
                              创建岗位
                            </Button>
                          );
                        }
                      ]}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="已匹配" key="2">
                    <TableData
                      baseURL={baseURL}
                      resid={'656440072649'}
                      wrappedComponentRef={element =>
                        (this.tableDataRef2 = element)
                      }
                      refTargetComponentName="TableData"
                      subtractH={200}
                      hasAdd={false}
                      hasRowView={false}
                      hasRowDelete={true}
                      hasRowEdit={false}
                      hasDelete={true}
                      hasModify={false}
                      hasRowModify={true}
                      hasRowSelection={true}
                      hasAdvSearch={false}
                      importConfig={null}
                      defaultPagination={this.defaultPagination}
                      actionBarExtra={({
                        dataSource = [],
                        selectedRowKeys = [],
                        data = [],
                        recordFormData,
                        size
                      }) => {
                        const selectedRecords = selectedRowKeys.map(key => {
                          return dataSource.find(item => item.REC_ID === key);
                        });
                        return (
                          <Button
                            type="primary"
                            size={size}
                            onClick={() => {
                              if (!selectedRecords.length) {
                                return message.info('请选择记录');
                              }
                              this.handleSubmit([...selectedRecords]);
                            }}
                          >
                            提交
                          </Button>
                        );
                      }}
                    />
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </Spin>

        {isShowProgress ? (
          <PlanProgress
            onFinished={this.onSbumitFinished}
            struct="100"
            baseURL={baseURL}
            options={{
              resid: 638459489229,
              data: JSON.stringify(submiteData)
            }}
            title="提交"
            showFields={['C3_227192472953', 'C3_227192484125']}
          />
        ) : null}
        <Modal
          visible={addVisible}
          title={'创建岗位'}
          width={800}
          footer={null}
          onCancel={this.closeModal}
          destroyOnClose
        >
          <FormData
            info={{ dataMode: 'main', resid: 638632769633 }}
            operation={'add'}
            data={this._dataProp}
            record={record}
            // formProps={{ width: 500 }}
            onCancel={this.closeModal}
            onSuccess={this.afterSave}
            baseURL={baseURL}
          />
        </Modal>
      </div>
    );
  }
  afterSave = async () => {
    const { baseURL } = this.props;
    const { record } = this.state;
    try {
      this.closeModal();
      this.setState({ spinnig: true });
      await http({ baseURL }).modifyRecords({
        resid: '656440052647',
        data: [{ REC_ID: record.REC_ID }]
      });
      this.tableDataRef1.handleRefresh();
    } catch (error) {}
    this.setState({ spinnig: false });
  };
  handleActiveKeyChange = activeKey => {
    this.setState(
      {
        activeKey
      },
      () => {
        if (activeKey === '1') {
          this.tableDataRef1 && this.tableDataRef1.handleRefresh();
        } else {
          this.tableDataRef2 && this.tableDataRef2.handleRefresh();
        }
      }
    );
  };
  handleCreateJobClick = record => {
    this._dataProp = getDataProp(
      this._formData,
      {
        ...record,
        isCreated: 'N',
        isScrap: 'N',
        orgName: record.C3_417990929081,
        orgJobEN: record.C3_417990929081,
        Location: record.C3_417994395847,
        orgLevelCode: record.C3_656532371973,
        orgDepCode: record.C3_656588009121,
        orgDepCN: record.dep_cn,
        orgDepEN: record.dep_en,
        orgSupNumber: record.C3_656590854233,
        companycode: record.C3_656587686721,
        C3_642185521087: record.C3_656587419404,
        updateDate: record.C3_470524257391,
        isVirtual: 'Y'
      },
      true,
      false,
      false
    );
    this.setState({ addVisible: true, record });
  };
  closeModal = () => {
    this.setState({ addVisible: false, record: {} });
  };

  _dataProp = [];
  _formData = [];
  /**
   * 获取主表窗体数据
   */
  getFormData = async () => {
    let res;
    try {
      const { baseURL } = this.props;
      let httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      res = await http(httpParams).getFormData({
        resid: 638632769633,
        formName: 'CreateWindow1'
      });
      this._formData = dealControlArr(res.data.columns);
    } catch (err) {
      console.log(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
  };

  handleSubmit = (records = []) => {
    this.setState({
      isShowProgress: true,
      selectedSubmiteData: records,
      submiteData: records.map((item, index) => {
        const data = {
          ...item,
          C3_638469590670: item.C3_656522583613,
          _state: 'editoradd',
          _id: index
        };
        delete data.REC_ID;
        return data;
      })
    });
  };
  onSbumitFinished = async () => {
    const { selectedSubmiteData } = this.state;
    const { baseURL } = this.props;
    this.setState({ spinning: true });
    try {
      this.setState({
        isShowProgress: false,
        spinnig: true,
        submiteData: [],
        selectedSubmiteData: []
      });
      await http({ baseURL }).modifyRecords({
        resid: 656440072649,
        data: selectedSubmiteData.map(item => {
          return { REC_ID: item.REC_ID, C3_656523333717: 'Y' };
        })
      });
      this.tableDataRef2.handleRefresh();
    } catch (error) {}
    this.setState({ spinnig: false });
  };
}
