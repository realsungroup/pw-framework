import React from 'react';
import { message, TreeSelect } from 'antd';
import http from 'Util20/api';
import { arrayToTree } from 'performant-array-to-tree';

class TargetTableSelect extends React.Component {
  state = {
    tree: [],
    list: []
  };

  componentDidMount = async () => {
    let parentresid;
    if (process.env.NODE_ENV === 'development') {
      parentresid = 685113093507;
    } else {
      parentresid = 685354717933;
    }
    this.setState({ loading: true });
    let res;
    try {
      res = await http().getUserAppLinks({
        parentresid
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    const list = [...res.data];
    const tree = arrayToTree(res.data, {
      id: 'RES_ID',
      parentId: 'RES_PID',
      dataField: null,
      rootParentIds: {
        [`${parentresid}`]: true,
      }
    });

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
      tree,
      value: this.props.value,
      list
    });
  };

  onChange = value => {
    const { list } = this.state;
    const result = list.find(item => item.RES_ID === value);
    if (['沪东', '长兴'].includes(result.RES_NAME)) {
      return message.error('不能选择沪东或长兴');
    }

    const { onChange } = this.props;
    onChange && onChange(value);
    this.setState({ value });
  };

  render() {
    const { tree, value, style } = this.state;
    return (
      <TreeSelect
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择目标表"
        allowClear
        treeDefaultExpandAll
        onChange={this.onChange}
        treeData={tree}
        style={style}
        showSearch={false}
      ></TreeSelect>
    );
  }
}

export default TargetTableSelect;
