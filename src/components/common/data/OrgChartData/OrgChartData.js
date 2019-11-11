import React from 'react';
import './OrgChartData.less';
import { propTypes, defaultProps } from './propTypes';
import http, { makeCancelable } from 'Util20/api';
import { clone, getIntlVal } from 'Util20/util';
import { message, Modal, Spin, Button, Slider } from 'antd';
import { withHttpGetFormData } from '../../hoc/withHttp';
import { setDataInitialValue, getDataProp } from 'Util20/formData2ControlsData';
import { compose } from 'recompose';
import FormData from 'Common/data/FormData';
import withModalDrawer from 'Common/hoc/withModalDrawer';
import { modifyIcon } from './icon';
import OrgChartTools from './OrgChartTools';
import LevelsJumpBtns from './LevelsJumpBtns';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import withAdvSearch from '../../hoc/withAdvSearch';

const OrgChart = window.OrgChart;
const BALKANGraph = window.BALKANGraph;

// img_0
OrgChart.templates.rony.img_0 =
  '<image preserveAspectRatio="xMidYMid slice" xlink:href="{val}" x="50" y="-10" width="80" height="80" clip-path="url(#2tjzm4d9b9p3iurqaq5mg)"></image>';

// field_n
OrgChart.templates.rony.field_0 =
  '<text class="field_0" width="130" text-anchor="middle" text-overflow="ellipsis" x="80" style="font-size: 16px;" fill="#000" y="100">{val}</text>';

OrgChart.templates.rony.field_1 =
  '<text class="field_1" width="130" text-anchor="middle" text-overflow="ellipsis" x="80"  style="font-size: 16px;" fill="#000" y="130" >{val}</text>';

OrgChart.templates.rony.field_2 =
  '<text class="field_2" width="130" text-anchor="middle" text-overflow="ellipsis" x="80"  style="font-size: 16px;" fill="#000" y="160">{val}</text>';

OrgChart.templates.rony.field_3 =
  '<text class="field_3" width="130" text-anchor="middle" text-overflow="ellipsis" x="80"  style="font-size: 16px;" fill="#000" y="190">{val}</text>';

OrgChart.templates.rony.field_4 =
  '<text class="field_4" width="130" text-anchor="middle" text-overflow="ellipsis" x="80"  style="font-size: 16px;" fill="#000" y="210">{val}</text>';

/**
 * 根据节点数据获取最顶层节点的 id
 * @param {array} nodes 节点数据
 * @param {string} idField id 对应的字段
 * @param {string} pidField pid 对应的字段
 */
const getRootIds = (nodes, idField, pidField) => {
  const ret = [];
  const len = Array.isArray(nodes) ? nodes.length : 0;
  for (let i = 0; i < len; i++) {
    let hasPid = false;
    for (let j = 0; j < len; j++) {
      if (nodes[i][pidField] === nodes[j][idField]) {
        hasPid = true;
        break;
      }
    }
    if (!hasPid) {
      ret.push(nodes[i][idField]);
    }
  }
  return ret;
};

/**
 * 移除根节点的 pid 属性
 * @param {array} nodes 节点数据
 * @param {string} idField id 对应的字段
 * @param {string} pidField pid 对应的字段
 * @param {array} rootIds 根节点 id 数组
 */
const dealNodes = (nodes, idField, pidField, rootIds) => {
  nodes.forEach(item => {
    item.id = parseInt(item[idField], 10);
    item.pid = parseInt(item[pidField], 10);
    if (rootIds.indexOf(item[idField]) !== -1) {
      delete item.pid;
    }
  });
  return nodes;
};

/**
 * 处理 tags 对象中每条数据的 groupState 属性
 * @param {object} tags 后端返回的 tags 对象
 */
const dealTags = tags => {
  for (let key in tags) {
    if (tags[key].groupState) {
      tags[key].groupState = BALKANGraph.EXPAND;
    } else {
      tags[key].groupState = BALKANGraph.COLLAPSE;
    }
  }
  return tags;
};
/**
 * 筛选字段：删除节点的 id 和 pid 数据
 * @param {array} nodes 节点数据
 * @param {string} idField id 对应的字段
 * @param {string} pidField pid 对应的字段
 */
const filterFields = (nodes, idField, pidField) => {
  nodes.forEach(node => {
    node[idField] = node.id;
    node[pidField] = node.pid;
    delete node.id;
    delete node.pid;
  });
  return nodes;
};

/**
 * 组织图组件
 */
class OrgChartData extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);

    const {
      recordFormType,
      enableDragDrop,
      level,
      template,
      orientation,
      padding,
      mode,
      settingStatus
    } = props;

    this.init(props);

    this.state = {
      loading: true,
      drawerVisible: false,
      settingStatus, // 工具栏的状态：'max' 最大化状态 | 'min' 最小化状态
      recordFormType, // 记录表单的容器类型：'modal' 模态窗 | 'drawer' 抽屉
      enableDragDrop, // 是否能够拖动节点
      level, // 显示的层数
      template, // 使用的模板
      orientation, // 方向
      padding, // OrgChart 的 padding
      mode
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
    this.p3 && this.p3.cancel();
    this.p4 && this.p4.cancel();
    this.p5 && this.p5.cancel();
  };

  init = props => {
    this._rootIds = [];
    this._mode = props.mode; // 模式：'normal' 普通模式 | 'grouping' 分组模式
    this._nodes = []; // 节点数据
    this._data = []; // 控件数据
    this._cmswhere = ''; // 查询条件

    // 自定义空表单
    this.EditForm = function() {};
    this.EditForm.prototype.init = () => {};
    this.EditForm.prototype.show = () => {};
    this.EditForm.prototype.hide = () => {};
  };

  // 获取根节点 id -> 获取节点数据 + 获取窗体数据
  getData = async () => {
    const {
      resid,
      idField,
      pidField,
      httpGetFormData,
      rootIdsResid
    } = this.props;
    this.p6 = makeCancelable(http().getTable({ resid: rootIdsResid }));
    let res;
    try {
      res = await this.p6.promise;
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    this._rootIds = res.data.map(item => item.C3_602347243263);
    const pArr = [this.getNodes(), httpGetFormData(resid, 'default')];
    this.p1 = makeCancelable(Promise.all(pArr));
    try {
      res = await this.p1.promise;
    } catch (err) {
      this.setState({ loading: false });
      message.error(err.message);
      return console.error(err);
    }
    // 窗体数据
    const resFormData = res[1];
    this._formData = { ...resFormData };
    this._data = getDataProp(resFormData, {}, false, false);

    // 节点数据
    const resNodes = res[0];
    this.afterGetNodes(resNodes);
  };

  // 获取节点数据
  getNodes = async () => {
    const { level } = this.state;
    const { idField, pidField, resid, groupingConfig } = this.props;
    const options = {
      resid,
      ColumnOfID: idField,
      ColumnOfPID: pidField,
      ProductIDs: this._rootIds.join(','),
      Levels: level,
      cmswhere: this._cmswhere
    };

    // 分组模式，添加 tags 参数
    if (this._mode === 'grouping' && Array.isArray(groupingConfig)) {
      options.tags = groupingConfig;
    }
    this.p8 = makeCancelable(http().getNodesData(options));
    return this.p8.promise;
  };

  // 获取节点数据之后
  afterGetNodes = res => {
    const { idField, pidField } = this.props;
    // 设置新的根节点 id
    this._rootIds = getRootIds(res.nodes, idField, pidField);

    const nodes = dealNodes(res.nodes, idField, pidField, this._rootIds);
    this._nodes = nodes;

    const tags = dealTags(res.tags);

    // 更新图表所在的父节点
    this.updateChart();

    // 渲染图表
    this.renderOrgChart(nodes, tags);
  };

  handleAdd = (sender, node) => {
    this.handleAddNode(sender, node);
    return false;
  };

  handleAddNode = async (sender, node) => {
    const pid = Number(node.pid);
    const records = { [this.props.pidField]: pid };
    this.p4 = makeCancelable(
      http().addRecords({
        resid: this.props.resid,
        data: [records]
      })
    );
    let res;
    try {
      res = await this.p4.promise;
    } catch (err) {
      message.error(err.message);
      return console.error(err);
    }
    const resNode = res.data[0];
    const newNode = {
      ...resNode,
      id: resNode[this.props.nodeId],
      pid
    };

    setTimeout(() => {
      this.chart.addNode(newNode);
    });
    message.success('添加成功');
  };

  handleNodeClick = (sender, node) => {
    this.openRecordForm('view', node, sender);
  };

  openRecordForm = (operation, node, sender) => {
    const { recordFormType } = this.state;
    const {
      resid,
      isClassifyLayout,
      recordFormContainerProps,
      formProps
    } = this.props;
    const containerProps = {
      destroyOnClose: true,
      ...recordFormContainerProps
    };

    if (recordFormType === 'drawer') {
      containerProps.onClose = this.handleRecordFormClose;
    }
    const record = { ...node };
    const data = setDataInitialValue(
      this._data,
      record,
      false,
      isClassifyLayout
    );

    const childProps = {
      ...formProps,
      data,
      record,
      operation,
      info: { dataMode: 'main', resid },
      onConfirm: this.handleRecordFormConfirm,
      subTableArr: this._formData.subTableArr,
      subTableArrProps: [
        {
          subTableName: '子表标题', // 必选（若不选则标签页标题为子表的 resid）
          subResid: 227186227531, // 必选
          tableProps: {
            // 可选，TableData 组件接收的 props
            width: 777,
            height: 888
          }
        }
      ]
    };
    this.props.openModalOrDrawer(
      recordFormType,
      containerProps,
      FormData,
      childProps
    );
  };

  handleRecordFormClose = () => {
    this.props.closeModalOrDrawer();
  };

  handleRecordFormConfirm = (formData, form) => {
    message.success('修改成功');
    this.props.closeModalOrDrawer();
    this.chart.updateNode({
      ...formData,
      id: formData[this.props.idField],
      pid: formData[this.props.pidField]
    });
  };

  handleRemove = (sender, nodeId) => {
    const { intl } = this.props;
    Modal.confirm({
      title: getIntlVal(intl.locale, 'Prompt', '提示'),
      content: getIntlVal(
        intl.locale,
        'Are you sure to delete this node?',
        '是否删除该节点？'
      ),
      onOk: () => this.handleRemoveConfirmOk(sender, nodeId)
    });
    return false;
  };

  handleRemoveConfirmOk = async (sender, nodeId) => {
    nodeId = Number(nodeId);
    const nodeData = this._nodes.find(item => item.id === nodeId);
    const values = { ...nodeData };
    this.p3 = makeCancelable(
      http().removeRecords({
        resid: this.props.resid,
        data: [values]
      })
    );
    try {
      await this.p3.promise;
    } catch (err) {
      message.error(err.message);
      return console.error(err);
    }
    message.success('删除成功');
    // 手动移除界面上的节点
    this.chart.removeNode(nodeId);
  };

  handleModifyClick = id => {
    const { idField } = this.props;
    id = parseInt(id, 10);
    const node = this._nodes.find(node => node[idField] === id);
    this.openRecordForm('modify', node);
  };

  getOrgChartOptions = (nodes, tags) => {
    const { lazyLoading, showFields, intl } = this.props;
    const { locale } = intl;
    const { enableDragDrop, template, orientation, padding } = this.state;
    const options = {
      padding,
      template,

      scaleMin: 0.3,
      mouseScroolBehaviour: BALKANGraph.action.zoom,

      enableDelete: true,

      orientation: BALKANGraph.orientation[orientation],

      // 可拖动节点
      enableDragDrop,

      nodeBinding: showFields,

      // 高性能
      lazyLoading,
      // showXScroll: BALKANGraph.scroll.visible,
      // mouseScroolBehaviour: BALKANGraph.action.xScroll,
      // layout: BALKANGraph.mixed,
      // scaleInitial: BALKANGraph.match.width,

      // 节点数据
      nodes,

      tags,

      nodeMenu: {
        // 增删改
        modify: {
          icon: modifyIcon,
          text: getIntlVal(locale, 'Modify', '修改'),
          onClick: this.handleModifyClick
        },
        add: { text: getIntlVal(locale, 'Add', '添加') },
        remove: { text: getIntlVal(locale, 'Delete', '移除') },

        // 导出以某个节点为根节点的文件
        pdf: { text: getIntlVal(locale, 'Export PDF', '导出 PDF') },
        png: { text: getIntlVal(locale, 'Export PNG', '导出 PNG') },
        svg: { text: getIntlVal(locale, 'Export SVG', '导出 SVG') }
      },

      // 导出文件的菜单
      menu: {
        pdf: { text: getIntlVal(locale, 'Export PDF', '导出 PDF') },
        png: { text: getIntlVal(locale, 'Export PNG', '导出 PNG') },
        svg: { text: getIntlVal(locale, 'Export SVG', '导出 SVG') },
        csv: { text: getIntlVal(locale, 'Export CSV', '导出 CSV') }
      },

      // 自定义表单：此自定义表单用于覆盖默认的表单
      editUI: new this.EditForm(),

      // 添加节点
      onAdd: this.handleAdd,

      // 修改节点
      // onUpdate: this.handleUpdate,

      // 删除节点
      onRemove: this.handleRemove,

      // 查看节点表单
      onClick: this.handleNodeClick,

      // 更新节点（拖拽）
      onUpdate: this.handleDragNode
    };
    return options;
  };

  handleDragNode = (sender, oldNode, newNode) => {
    console.log({ newNode });
    const { keyField, intl } = this.props;
    const newParentNode = this._nodes.find(
      node => node.id === parseInt(newNode.pid, 10)
    );
    const zhTip = `您确定要将 ${newNode[keyField]} 拖拽到 ${
      newParentNode[keyField]
    } 下面吗？`;
    const enTip = `Are you sure you want to drag ${newNode[keyField]} under ${
      newParentNode[keyField]
    }`;
    Modal.confirm({
      title: getIntlVal(intl.locale, 'Prompt', '提示'),
      content: getIntlVal(intl.locale, enTip, zhTip),
      onOk: () => this.updateNode(sender, oldNode, newNode)
    });
    return false;
  };

  updateNode = async (sender, oldNode, newNode) => {
    this.setState({ loading: true });
    const { resid, idField, pidField } = this.props;
    const values = filterFields([{ ...newNode }], idField, pidField);
    let res;
    this.p9 = makeCancelable(
      http().modifyRecords({
        resid,
        data: values
      })
    );
    try {
      res = await this.p9.promise;
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    const node = res.data[0];
    node.id = node[idField];
    node.pid = node[pidField];
    this.setState({ loading: false });
    this.chart.updateNode(node);
  };

  renderOrgChart = (nodes, tags) => {
    const options = this.getOrgChartOptions(nodes, tags);
    this.chart = new OrgChart(
      document.getElementById(this.props.chartId),
      options
    );
    this.setState({ loading: false });
  };

  handleTemplateChange = template => {
    this.chart.config.template = template;
    this.setState({ template }, () => {
      this.chart.draw();
    });
  };

  handleOrientationChange = orientation => {
    this.chart.config.orientation = BALKANGraph.orientation[orientation];
    this.setState({ orientation }, () => {
      this.chart.draw();
    });
  };

  handleMin = () => {
    this.setState({ settingStatus: 'min' });
  };

  handleMax = () => {
    this.setState({ settingStatus: 'max' });
  };

  /**
   * direction：0 表示向上 | 1 表示向下
   */
  handleLevelMove = async direction => {
    this.setState({ loading: true });
    const { level } = this.state;
    const { resid, idField, pidField, groupingConfig } = this.props;
    const options = {
      resid,
      Levels: level,
      MoveDirection: direction,
      MoveLevels: 1,
      ColumnOfID: idField,
      ColumnOfPID: pidField,
      ProductIDs: this._rootIds.join(','),
      cmswhere: this._cmswhere
    };
    if (this._mode === 'grouping' && Array.isArray(groupingConfig)) {
      options.tags = groupingConfig;
    }

    this.p5 = makeCancelable(http().getMoveNodes(options));
    let res;
    try {
      res = await this.p5.promise;
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    if (!res.nodes) {
      this.setState({ loading: false });
      return message.info('已经到最底层了');
    }

    this.afterGetNodes(res);
  };

  handleLevelChange = e => {
    const value = e.target.value;
    if (
      /^\d.$/.test(value) &&
      (parseInt(value, 10) > 16 || parseInt(value, 10) <= 0)
    ) {
      return;
    }
    this.setState({ level: value });
  };

  handleLevelConfirm = async value => {
    this.setState({ loading: true });
    let res;
    try {
      res = await this.getNodes();
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    if (!res.nodes) {
      this.setState({ loading: false });
      return message.error('error');
    }
    this.afterGetNodes(res);
  };

  updateChart = () => {
    const { chartId, chartWrapId } = this.props;
    // 移除节点
    const chart = document.getElementById(chartId);
    chart && chart.remove();
    // 添加节点
    const chartWrap = document.getElementById(chartWrapId);
    const element = document.createElement('div');
    element.setAttribute('id', chartId);
    chartWrap.appendChild(element);
  };

  handleSaveOrgClick = () => {
    const { intl } = this.props;
    Modal.confirm({
      title: getIntlVal(intl.locale, 'Prompt', '提示'),
      content: getIntlVal(
        intl.locale,
        'Are you sure to save structure?',
        '您确定要保存该结构吗？'
      ),
      onOk: this.handleSaveOrgChartData
    });
  };

  triggerCmswhereChange = async cmswhere => {
    this._cmswhere = cmswhere;
    this.setState({ loading: true });
    let res;
    try {
      res = await this.getNodes();
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    this.afterGetNodes(res);
  };

  handleAdvSearch = () => {
    const { resid, advSearchFormName } = this.props;
    this.props.openAdvSearch(
      'drawer',
      resid,
      advSearchFormName,
      [],
      this.triggerCmswhereChange,
      {
        width: 500
      }
    );
  };

  handleSaveOrgChartData = async () => {
    this.setState({ loading: true });
    const { nodeId, parentNodeId, resid } = this.props;
    let nodes = clone(this.chart.config.nodes);
    nodes = filterFields(nodes, nodeId, parentNodeId);
    this.p6 = makeCancelable(
      http().modifyRecords({
        resid,
        data: nodes
      })
    );
    try {
      await this.p6.promise;
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
    message.success('保存成功');
  };

  handleModeChange = async e => {
    this.setState({ loading: true });
    const value = e.target.value;
    this._mode = value;
    let res;
    try {
      res = await this.getNodes();
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    this.afterGetNodes(res);
    this.forceUpdate();
  };

  render() {
    const { template, orientation, settingStatus, loading, level } = this.state;
    const { chartId, chartWrapId } = this.props;
    return (
      <Spin spinning={loading}>
        <div className="org-chart-data" id={chartWrapId}>
          <i
            className="org-chart-data__adv-search-btn iconfont icon-adv-search"
            onClick={this.handleAdvSearch}
          />
          <OrgChartTools
            status={settingStatus}
            templateChange={this.handleTemplateChange}
            orientationChange={this.handleOrientationChange}
            selectedTemplate={template}
            selectedOrientation={orientation}
            onMin={this.handleMin}
            onMax={this.handleMax}
            level={level}
            onLevelChange={this.handleLevelChange}
            onLevelConfirm={this.handleLevelConfirm}
            mode={this._mode}
            onModeChange={this.handleModeChange}
          />
          <LevelsJumpBtns
            onLevelUp={() => this.handleLevelMove(0)}
            onLevelDown={() => this.handleLevelMove(1)}
            template={template}
          />
          <div id="editForm" style={{ display: 'none' }} />
          <div id={chartId} />
        </div>
      </Spin>
    );
  }
}

const composedHoc = compose(
  withHttpGetFormData,
  withModalDrawer(),
  injectIntl,
  withAdvSearch()
);
export default composedHoc(OrgChartData);
