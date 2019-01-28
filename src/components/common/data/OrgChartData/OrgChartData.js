import React from 'react';
import './OrgChartData.less';
import { propTypes, defaultProps } from './propTypes';
import http, { makeCancelable } from 'Util20/api';
import { message, Spin, Modal, Drawer } from 'antd';
import { withHttpGetFormData } from '../../hoc/withHttp';
import { setDataInitialValue, getDataProp } from 'Util20/formData2ControlsData';
import { compose } from 'recompose';
import FormData from 'Common/data/FormData';
import withModalDrawer from 'Common/hoc/withModalDrawer';

const OrgChart = window.OrgChart;
const BALKANGraph = window.BALKANGraph;

const drawerTitleMap = {
  view: '查看',
  modify: '修改'
};

var modifyIcon =
  '<svg class="icon" width="24px" height="24px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#7A7A7A" d="M768.4872723 388.36148148l-177.72756385-173.29417481-379.8296652 379.42431288-66.20106903 242.16158815v0.40049778l241.7538086-67.25328593z m-28.96448475-321.74171023l-95.19710814 95.04054993 178.29675614 172.64973749 92.37420563-92.29653334c48.48693097-48.40561778 48.48693097-126.98449541 0-175.39132681-48.40440415-48.40683141-127.06823585-48.40683141-175.47385363-0.00242727zM79.02913422 878.71032889h872.33270519v114.97563022h-872.33270519z"  /></svg>';

/**
 * 组织图标组件
 */
class OrgChartData extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);

    const { recordFormType, enableDragDrop } = props;

    this.state = {
      loading: true,
      drawerVisible: false,
      recordFormType, // 记录表单的容器类型：'modal' 模态窗 | 'drawer' 抽屉
      enableDragDrop // 是否能够拖动节点
    };
  }

  componentDidMount = () => {
    this.initVariables();
    this.getData();
    this.EditForm = function() {};
    this.EditForm.prototype.init = () => {};
    this.EditForm.prototype.show = () => {};
    this.EditForm.prototype.hide = () => {};
  };

  initVariables = () => {
    this._nodes = []; // 节点数据
    this._data = []; // 控件数据
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
      pid
    };

    setTimeout(() => {
      this.chart.addNode(newNode);
      // this.chart.draw(BALKANGraph.action.init);
    });
    message.success('添加成功');
  };

  // handleUpdate = async (sender, oldNode, newNode) => {
  //   this.setState({ loading: true });
  //   console.log({ sender, oldNode, newNode });
  //   const values = { ...newNode };
  //   this.p2 = makeCancelable(
  //     http().modifyRecords({
  //       resid: this.props.resid,
  //       data: [values]
  //     })
  //   );
  //   try {
  //     await this.p2.promise;
  //   } catch (err) {
  //     this.setState({ loading: false });
  //     message.error(err.message);
  //     console.error(err);
  //     return false;
  //   }
  //   this.setState({ loading: false });
  //   message.success('修改成功');
  // };

  handleNodeClick = (sender, node) => {
    this.openRecordForm('view', node, sender);
  };

  openRecordForm = (operation, node, sender) => {
    const { recordFormType } = this.state;
    const { resid, isClassifyLayout } = this.props;
    const containerProps = {
      width: 500
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
      data,
      record,
      operation,
      info: { dataMode: 'main', resid },
      onConfirm: this.handleRecordFormConfirm
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
    const { template, lazyLoading, level, isExpandAllChildren } = this.props;
    const { enableDragDrop } = this.state;
    const options = {
      template,
      enableDelete: true,

      // 可拖动节点
      enableDragDrop,

      lazyLoading,
      nodeBinding: {
        field_0: 'name',
        field_1: 'title',
        field_2: 'phone',
        img_0: 'image'
      },

      // 节点数据
      nodes,

      // 增删查改
      nodeMenu: {
        modify: {
          icon: modifyIcon,
          text: '修改',
          onClick: this.handleModifyClick
        },
        add: { text: '添加' },
        remove: { text: '移除' }
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

const composedHoc = compose(
  withHttpGetFormData,
  withModalDrawer()
);
export default composedHoc(OrgChartData);
