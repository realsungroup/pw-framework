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
  Popover,
  Checkbox,
  DatePicker,
  InputNumber
} from 'antd';
import './ArchitectureDiagram.less';
import add1 from './svg/同级.svg';
import add2 from './svg/子级.svg';
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
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  state = {
    selectedNode: {}, // 选中项
    addBroVisible: false,
    selfDefineVisible: false,
    loading: false,
    viewHistoryDetailVisible: false,
    historyData: [], // 选中项的历史记录
    operation: 'add', // FormData用到的prop
    record: {}, // FormData用到的prop
    breadcrumb: [], //面包屑数据
    currentLevel: this.props.level, //当前层级
    mode: 'chart', //显示模式：图->chart; 表-> table
    isGrouping: false,
    firstField: this.props.displayFileds.firstField,
    secondaryField: this.props.displayFileds.secondaryField,
    selectedDate: moment(),
    takeEffectDate: ''
  };
  async componentDidMount() {
    // await this.getRootNodes();
    let data = await this.getData();
    this.initializeOrgchart();
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
          field_0: displayFileds.firstField,
          field_1: displayFileds.secondaryField,
          img_0: displayFileds.imgField
        },
        collapse: {
          level: 3
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
          call: {
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
    const {
      resid,
      baseURL,
      idField,
      pidField,
      dblinkname,
      groupConfig,
      procedureConfig
    } = this.props;
    const { currentLevel, selectedDate } = this.state;
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
      // this._tags = res.tags;
      const nodes = res.data.map(item => {
        const tags = [];
        if (item.isScrap === 'Y') {
          tags.push('discard');
        } else if (item.isEmpty === 'Y') {
          tags.push('empty');
        }
        return {
          ...item,
          id: item[idField],
          pid: item[pidField],
          tags
        };
      });
      this._nodes = nodes;
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

  /**
   * 计算面包屑数据
   */
  getBreadcrumb = (selectedNode, breadcrumb = []) => {
    if (selectedNode.pid) {
      let fooNode = this.chart.config.nodes.find(item => {
        return item.id === selectedNode.pid;
      });
      console.log(1, fooNode);
      if (fooNode) {
        breadcrumb.unshift(selectedNode);
        this.getBreadcrumb(fooNode, breadcrumb);
      } else {
        breadcrumb.unshift(selectedNode);
      }
    } else {
      console.log(2, selectedNode);

      breadcrumb.unshift(selectedNode);
    }
  };

  /**
   * 添加节点
   */
  handleAdd = level => () => {
    const { pidField, idField, createWindowName } = this.props;
    const { selectedNode } = this.state;
    if (!selectedNode.REC_ID) {
      return message.info('请选择一个卡片');
    }
    let record = {};
    if (level === 'sub') {
      record[pidField] = selectedNode[idField];
      this.getFormData(record, createWindowName);
    } else if (level === 'bro') {
      record[pidField] = selectedNode[pidField];
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
    if (selected.isCreated === 'Y') {
      this.getFormData({ ...selectedNode }, editWindowName);
    } else {
      this.getFormData({ ...selectedNode }, createWindowName);
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
            message.success('删除成功');
            this.setState({ loading: false });
          } catch (error) {
            this.setState({ loading: false });
            message.error(error.message);
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
  handleNodeClick = (chart, node) => {
    if (!chart.get(node.id)) {
      this.setRootNode(node.id);
    }
    if (node.tags && node.tags.includes(selected)) {
      return;
    }
    const { selectedNode } = this.state;
    if (selectedNode && selectedNode.id) {
      chart.removeNodeTag(selectedNode.id, selected);
    }
    // let findNodes = chart.find(selected);
    // if (findNodes.length) {
    //   findNodes.forEach(item => {
    //     chart.removeNodeTag(item.id, selected);
    //   });
    // }
    chart.addNodeTag(node.id, selected);
    // chart.draw();
    let breadcrumb = [];
    this.getBreadcrumb(node, breadcrumb);
    this.setState({ breadcrumb });
    chart.center(node.id, {
      rippleId: node.id,
      vertical: true,
      horizontal: true
    });
    this.setState({ selectedNode: node }, this.getHistory);
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
    this.chart.draw();
  };

  closeSelfDefineModal = () => this.setState({ selfDefineVisible: false });

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
      this.chart.addNode({
        ...record,
        id: record[idField],
        pid: record[pidField],
        tags: record.tags ? [...record.tags, ...tags] : tags
      });
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
      this.setState({ selectedNode: node });
      this.chart.updateNode(node);
    }
  };

  /**
   * 加载下一层级的数据
   */
  loadNextLevel = async () => {
    if (this.state.isGrouping) {
      return message.info('请先取消分组');
    }
    const {
      resid,
      idField,
      pidField,
      baseURL,
      dblinkname,
      groupConfig
    } = this.props;
    let httpParams = {};
    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    const nodes = this.chart.nodes;
    const keys = Object.keys(nodes);
    const ids = keys.filter(key => {
      return !nodes[key].childrenIds.length;
    });
    const options = {
      resid,
      Levels: 1,
      ColumnOfID: idField,
      ColumnOfPID: pidField,
      MoveDirection: 1,
      MoveLevels: 1,
      ProductIDs: ids.join(','),
      cmswhere: this._cmswhere,
      dblinkname,
      tags: groupConfig
    };
    this.p4 = makeCancelable(http(httpParams).getMoveNodes(options));
    this.setState({ loading: true });
    let res;
    try {
      res = await this.p4.promise;
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    if (!res.nodes || !res.nodes.length) {
      this.setState({ loading: false });
      return message.info('没有更多数据');
    }
    this.setState({ currentLevel: this.state.currentLevel + 1 });
    res.nodes.forEach(node => {
      this.chart.add({
        ...node,
        id: node[idField],
        pid: node[pidField]
      });
    });
    this.setState({ loading: false });
    this.chart.draw();
  };

  onLevelChange = level => {
    this.setState({ currentLevel: level });
    this.chart.expandCollapseToLevel(1, {
      level
    });
  };

  handleDateChange = (date, dateString) => {
    this.setState({ selectedDate: date }, async () => {
      let data = await this.getData();
      this.chart.load(data);
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
        const { takeEffectDate, selectedNode } = this.state;
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
                updateDate: takeEffectDate
              }
            ]
          });
          const data = res.data[0];
          const tags = [selected];
          if (data.isScrap === 'Y') {
            tags.push('discard');
          } else if (data.isEmpty === 'Y') {
            tags.push('empty');
          }
          this.chart.updateNode({
            ...selectedNode,
            ...data,
            tags
          });
          this.setState({ loading: false });
        } catch (error) {
          this.setState({ loading: false });

          message.error(error.message);
        }
      }
    });
  };

  renderHeader = () => {
    const { mode, isGrouping, selectedNode, currentLevel } = this.state;
    const { hasOpration, hasImport } = this.props;
    const enable = selectedNode.isScrap === '';
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
        {hasOpration && mode === 'chart' && (
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
            <div className="architecture-diagram_header_icon-button">
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
              {item[displayFileds.firstField]}
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
      record,
      loading,
      mode,
      selfDefineVisible,
      selectedDate
    } = this.state;
    const { resid, baseURL } = this.props;
    return (
      <div className="architecture-diagram">
        <Spin spinning={loading}>
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
            当前位置：
            {this.renderBreadcrumb()}
          </div>

          <div
            className={classNames({
              'architecture-diagram_main-container': true,
              hidden: mode === 'table'
            })}
          >
            <div id="architecture-diagram_orgchart"></div>
            <div className="architecture-diagram_main_sider">
              <div className="architecture-diagram_main_item-detail">
                <div className="architecture-diagram_main_sider_title">
                  详细情况
                  <Icon type="minus" style={{ fontSize: 16 }} />
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
                    <Alert message="尚未选中任何卡片！" type="info" showIcon />
                  </div>
                )}
              </div>
              <div className="architecture-diagram_main_item-history">
                <div className="architecture-diagram_main_sider_title">
                  历史情况
                  <Icon type="minus" style={{ fontSize: 16 }} />
                </div>
                <div className="architecture-diagram_change-hsitory_list">
                  {selectedNode.REC_ID ? (
                    historyData.length ? (
                      <Timeline>
                        {historyData.map(item => (
                          <Timeline.Item>
                            {/* {item[remarkField]} */}
                            {this._historyColinfo.map(i => {
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
                            {/* <a
                              href="javascript::"
                              className="architecture-diagram_change-hsitory_list__view-button"
                              onClick={this.viewHistoryDetail}
                            >
                              查看
                            </a> */}
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
                        message="尚未选中任何卡片！"
                        type="info"
                        showIcon
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className={classNames({
              'architecture-diagram_tabledata__container': true,
              hidden: mode === 'chart'
            })}
          >
            <TableData
              resid={resid}
              subtractH={220}
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
            />
          </div>
          {/* <div style={{ height: 500 }}></div> */}
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
          onOk={() => {}}
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
const composedHoc = compose(injectIntl);

export default composedHoc(ArchitectureDiagram);
