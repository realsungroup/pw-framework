import React from 'react';
import './OrgChartData.less';
import { propTypes, defaultProps } from './propTypes';
import http, { makeCancelable } from 'Util20/api';
import { clone } from 'Util20/util';
import { message, Modal, Spin, Button } from 'antd';
import { withHttpGetFormData } from '../../hoc/withHttp';
import { setDataInitialValue, getDataProp } from 'Util20/formData2ControlsData';
import { compose } from 'recompose';
import FormData from 'Common/data/FormData';
import withModalDrawer from 'Common/hoc/withModalDrawer';
import { modifyIcon } from './icon';
import OrgChartTools from './OrgChartTools';
import LevelsJumpBtns from './LevelsJumpBtns';
import { FormattedMessage as FM } from 'react-intl';

const OrgChart = window.OrgChart;
const BALKANGraph = window.BALKANGraph;

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
      padding
    } = props;

    this.init(props);

    this.state = {
      loading: true,
      drawerVisible: false,
      toolsStatus: 'max', // 工具栏的状态：'max' 最大化状态 | 'min' 最小化状态
      recordFormType, // 记录表单的容器类型：'modal' 模态窗 | 'drawer' 抽屉
      enableDragDrop, // 是否能够拖动节点
      level, // 显示的层数
      template, // 使用的模板
      orientation, // 方向
      padding // OrgChart 的 padding
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
    this._rootIds = [...props.rootIds];

    this._nodes = []; // 节点数据
    this._data = []; // 控件数据

    // 自定义空表单
    this.EditForm = function() {};
    this.EditForm.prototype.init = () => {};
    this.EditForm.prototype.show = () => {};
    this.EditForm.prototype.hide = () => {};
  };

  getData = async () => {
    const { resid, idField, pidField, httpGetFormData } = this.props;
    const { level } = this.state;
    const pArr = [
      http().getNodesData({
        resid,
        ColumnOfID: idField,
        ColumnOfPID: pidField,
        ProductIDs: this._rootIds.join(','),
        Levels: level
      }),
      httpGetFormData(resid, 'default')
    ];

    this.p1 = makeCancelable(Promise.all(pArr));
    let res;
    try {
      res = await this.p1.promise;
    } catch (err) {
      this.setState({ loading: false });
      message.error(err.message);
      return console.error(err);
    }
    // 节点数据
    const resNodes = res[0];
    // 窗体数据
    const resFormData = res[1];

    const nodes = dealNodes(resNodes.nodes, idField, pidField, this._rootIds);
    this._nodes = nodes;

    this._formData = { ...resFormData };
    this._data = getDataProp(resFormData, {}, false, false);
    this.renderOrgChart(nodes);
  };

  handleAdd = (sender, node) => {
    this.handleAddNode(sender, node);
    return false;
  };

  handleAddNode = async (sender, node) => {
    const pid = Number(node.pid);
    const records = { [this.props.parentNodeId]: pid };
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
      // this.chart.draw(BALKANGraph.action.init);
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
      ...recordFormContainerProps
    };

    if (recordFormType === 'drawer') {
      containerProps.onClose = this.handleRecordFormClose;
    }

    // const operation = 'view';
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
      id: formData[this.props.nodeId],
      pid: formData[this.props.parentNodeId]
    });
  };

  handleRemove = (sender, nodeId) => {
    Modal.confirm({
      title: '提示',
      content: '是否删除该节点？',
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
    const { nodeId } = this.props;
    id = parseInt(id, 10);
    const node = this._nodes.find(node => node[nodeId] === id);
    this.openRecordForm('modify', node);
  };

  getOrgChartOptions = nodes => {
    const { lazyLoading, showFields } = this.props;
    const { enableDragDrop, template, orientation, padding } = this.state;
    const options = {
      padding,
      template,
      enableDelete: true,

      orientation: BALKANGraph.orientation[orientation],

      // 可拖动节点
      enableDragDrop,

      lazyLoading,
      nodeBinding: showFields,

      // 节点数据
      nodes,

      nodeMenu: {
        // 增删改
        modify: {
          icon: modifyIcon,
          text: '修改',
          onClick: this.handleModifyClick
        },
        add: { text: '添加' },
        remove: { text: '移除' },

        // 导出以某个节点为根节点的文件
        pdf: { text: '导出 PDF' },
        png: { text: '导出 PNG' },
        svg: { text: '导出 SVG' }
      },

      // 导出文件的菜单
      menu: {
        pdf: { text: '导出 PDF' },
        png: { text: '导出 PNG' },
        svg: { text: '导出 SVG' },
        csv: { text: '导出 CSV' }
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
      onClick: this.handleNodeClick
    };

    return options;
  };

  renderOrgChart = nodes => {
    const options = this.getOrgChartOptions(nodes);
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
    this.setState({ toolsStatus: 'min' });
  };

  handleMax = () => {
    this.setState({ toolsStatus: 'max' });
  };

  /**
   * direction：0 表示向上 | 1 表示向下
   */
  handleLevelMove = async direction => {
    this.setState({ loading: true });
    const { level } = this.state;
    const { resid, idField, pidField } = this.props;
    this.p5 = makeCancelable(
      http().getMoveNodes({
        resid,
        Levels: level,
        MoveDirection: direction,
        MoveLevels: 1,
        ColumnOfID: idField,
        ColumnOfPID: pidField,
        ProductIDs: this._rootIds.join(',')
      })
    );
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

    // 设置新的根节点 id
    this._rootIds = getRootIds(res.nodes, idField, pidField);

    const nodes = dealNodes(res.nodes, idField, pidField, this._rootIds);
    this._nodes = nodes;

    // 更新图表所在的父节点
    this.updateChart();

    // 渲染图表
    this.renderOrgChart(nodes);
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
    Modal.confirm({
      title: '提示',
      content: '您确定要保存该结构吗？',
      onOk: this.handleSaveOrgChartData
    });
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

  render() {
    const { template, orientation, toolsStatus, loading } = this.state;
    const { chartId, chartWrapId } = this.props;
    return (
      <Spin spinning={loading}>
        <div className="org-chart-data" id={chartWrapId}>
          <Button
            onClick={this.handleSaveOrgClick}
            type="primary"
            className="org-chart-data__save-btn"
          >
            <FM id="OrgChartData.saveStructure" defaultMessage="保存结构" />
          </Button>
          <OrgChartTools
            status={toolsStatus}
            templateChange={this.handleTemplateChange}
            orientationChange={this.handleOrientationChange}
            selectedTemplate={template}
            selectedOrientation={orientation}
            onMin={this.handleMin}
            onMax={this.handleMax}
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
  withModalDrawer()
);
export default composedHoc(OrgChartData);
