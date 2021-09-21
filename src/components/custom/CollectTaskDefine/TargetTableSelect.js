import React from 'react';
import { Select, message, Dropdown, TreeSelect } from 'antd';
import http from 'Util20/api';
import { arrayToTree } from 'performant-array-to-tree';

const { TreeNode } = TreeSelect;

class TargetTableSelect extends React.Component {
  state = {
    tree: []
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    let res;
    try {
      res = await http().getUserAppLinks({
        parentresid: 685113093507
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    const tree = arrayToTree(
      [
        ...res.data,
        {
          RES_ID: 685113093507,
          RES_PID: -1,
          RES_NAME: '刷卡目标表'
        }
      ],
      {
        id: 'RES_ID',
        parentId: 'RES_PID',
        dataField: null,
        rootParentIds: {
          '-1': true
        }
      }
    );

    const addProp = nodes => {
      nodes.forEach(node => {
        node.title = node.RES_NAME;
        node.value = node.RES_ID;
        node.key = node.RES_ID;
        if (node.children.length > 0) {
          addProp(node.children);
        }
      });
    };
    addProp(tree);
    this.setState({
      loading: false,
      tree
    });
  };

  onChange = value => {
    console.log({ value });
  };

  render() {
    const { tree } = this.state;
    return (
      <TreeSelect
        showSearch
        style={{ width: '100%' }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择目标表"
        allowClear
        treeDefaultExpandAll
        onChange={this.onChange}
        treeData={tree}
      ></TreeSelect>
    );
  }
}

export default TargetTableSelect;
