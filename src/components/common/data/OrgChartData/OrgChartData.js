import React from 'react';
import './OrgChartData.less';
import { propTypes, defaultProps } from './propTypes';
import http, { makeCancelable } from 'Util20/api';
import { message, Spin, Modal } from 'antd';
import { withHttpGetFormData } from '../../hoc/withHttp';
import { withRecordForm } from '../../hoc/withRecordForm';
import { setDataInitialValue, getDataProp } from 'Util20/formData2ControlsData';
import { compose } from 'recompose';

const OrgChart = window.OrgChart;
const BALKANGraph = window.BALKANGraph;

/**
 * 组织图标组件
 */
class OrgChartData extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount = () => {
    this.getData();
    this.EditForm = function() {};
    this.EditForm.prototype.init = () => {};
    this.EditForm.prototype.show = () => {};
    this.EditForm.prototype.hide = () => {};
  };

  getData = async () => {
    const { resid, nodeId, parentNodeId, httpGetFormData } = this.props;

    const pArr = [
      http().getNodesData({
        resid,
        ColumnOfID: nodeId,
        ColumnOfPID: parentNodeId,
        ProductID: 0,
        Levels: 8
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

    const nodes = resNodes.nodes;
    nodes.forEach(item => (item.pid = item.parentId));
    this._nodes = nodes;
    this._data = getDataProp(resFormData, {}, false, false);

    console.log({ nodes: this._nodes, data: this._data });

    setTimeout(() => {
      this.renderOrgChart(nodes);
    });
  };

  componentWillUnmount = () => {};

  handleAdd = (sender, node) => {
    console.log({ sender, node });
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
      pid,
      name: '',
      title: '',
      phone: '',
      image: ''
    };

    setTimeout(() => {
      this.chart.addNode(newNode);
      // this.chart.draw(BALKANGraph.action.init);
    });
    message.success('添加成功');
  };

  handleUpdate = async (sender, oldNode, newNode) => {
    this.setState({ loading: true });
    console.log({ sender, oldNode, newNode });
    const values = { ...newNode };
    this.p2 = makeCancelable(
      http().modifyRecords({
        resid: this.props.resid,
        data: [values]
      })
    );
    try {
      await this.p2.promise;
    } catch (err) {
      this.setState({ loading: false });
      message.error(err.message);
      console.error(err);
      return false;
    }
    this.setState({ loading: false });
    message.success('修改成功');
  };

  handleNodeClick = (sender, node) => {
    this.props.openRecordForm({
      title: '查看记录'
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

  getOrgChartOptions = nodes => {
    console.log({ nodes });

    const { template, lazyLoading, level, isExpandAllChildren } = this.props;
    const options = {
      template,
      enableDelete: true,
      lazyLoading,
      nodeBinding: {
        field_0: 'name',
        field_1: 'title',
        field_2: 'phone',
        img_0: 'image'
      },
      nodes,

      // 增删查改
      nodeMenu: {
        details: { text: 'Details' },
        edit: { text: 'Edit' },
        add: { text: 'Add' },
        remove: { text: 'Remove' }
      },

      // 自定义表单
      editUI: new this.EditForm(),

      // 添加节点
      onAdd: this.handleAdd,

      // 修改节点
      onUpdate: this.handleUpdate,

      // 删除节点
      onRemove: this.handleRemove,

      onClick: this.handleNodeClick
    };

    // 显示 n 层 nodes
    if (level) {
      options.collapse = {
        level: level,
        allChildren: !isExpandAllChildren
      };
    }

    return options;
  };

  renderOrgChart = nodes => {
    const options = this.getOrgChartOptions(nodes);
    this.chart = new OrgChart(document.getElementById(this.props.id), options);
    this.setState({ loading: false });
  };

  render() {
    const { loading } = this.state;
    const { id } = this.props;
    return (
      <Spin spinning={loading}>
        <div className="org-chart-data" id={id} />
        <div id="editForm" style={{ display: 'none' }} />
      </Spin>
    );
  }
}
console.log(111);

const resWithRecordForm = withRecordForm();
const composedHoc = compose(
  withHttpGetFormData,
  resWithRecordForm
);
export default composedHoc(OrgChartData);
