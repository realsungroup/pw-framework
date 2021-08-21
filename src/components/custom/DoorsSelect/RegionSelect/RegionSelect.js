import React from 'react';
import { Tree, Input, message, Spin, Empty } from 'antd';
import './RegionSelect.less';
import {
  getSubRegions,
  getRegionInfo,
  getRegionTreeByName
} from '../../../../hikApi';

const { TreeNode } = Tree;

const { Search } = Input;

class RegionSelect extends React.Component {
  state = {
    loading: false,
    regionTree: [],
    autoExpandParent: true,
    searchValue: '',
    treeKey: 0
  };

  componentDidMount = () => {
    this.initData();
  };

  initData = async () => {
    this.setState({ loading: true });
    const { regionIndexCodes } = this.props;
    let res;
    try {
      res = await getRegionInfo(regionIndexCodes);
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }

    if (res && res.data && Array.isArray(res.data.list)) {
      this.setState({
        regionTree: res.data.list,
        loading: false,
        searchValue: '',
        treeKey: this.state.treeKey + 1
      });
    }
  };

  onLoadData = async treeNode => {
    if (treeNode.props.children) {
      return;
    }
    const { indexCode: parentIndexCode } = treeNode.props;

    const {
      data: { list }
    } = await getSubRegions({
      parentIndexCode,
      resourceType: 'region',
      pageNo: 1,
      pageSize: 1000
    });

    treeNode.props.dataRef.children = list;

    this.setState({
      regionTree: [...this.state.regionTree],
      treeKey: this.state.treeKey + 1
    });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children && item.children.length) {
        return (
          <TreeNode title={item.name} key={item.indexCode} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.name}
          key={item.indexCode}
          {...item}
          dataRef={item}
        />
      );
    });

  onSearch = async value => {
    if (!value) {
      return this.initData();
    }
    const result = this.state.regionTree.find(region =>
      region.name.includes(value)
    );
    if (result) {
      return this.setState({ searchValue: value });
    }

    this.setState({ loading: true, searchValue: value });
    const { regionIndexCodes } = this.props;
    let res;
    try {
      res = await getRegionTreeByName(regionIndexCodes, value);
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }

    const regionTree = res.data.regionTree;

    const dataList = [];
    const generateList = data => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { name: key } = node;
        dataList.push({ key, title: key });
        if (node.children) {
          generateList(node.children);
        }
      }
    };
    generateList(regionTree);

    const getParentKey = (key, tree) => {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children && node.children.length) {
          if (node.children.some(item => item.name === key)) {
            parentKey = node.indexCode;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
      console.log('parentKey:', parentKey);
      return parentKey;
    };

    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(this.state.searchValue) > -1) {
          return getParentKey(item.key, regionTree);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    this.setState({
      loading: false,
      regionTree,
      expandedKeys,
      treeKey: this.state.treeKey + 1
    });
  };

  loop = data => {
    const { searchValue } = this.state;
    return data.map(item => {
      const index = item.name.indexOf(searchValue);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchValue.length);
      const name =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.name}</span>
        );
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.indexCode} title={name} dataRef={item}>
            {this.loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode key={item.indexCode} title={name} {...item} dataRef={item} />
      );
    });
  };

  onExpand = (expandedKeys, { expanded }) => {
    this.setState({ expandedKeys });
  };

  handleSelect = selectedKeys => {
    const { onRegionSelect } = this.props;
    onRegionSelect && onRegionSelect(selectedKeys[0]);
  };

  render() {
    const {
      regionTree,
      loading,
      expandedKeys,
      autoExpandParent,
      treeKey
    } = this.state;
    return (
      <div className="region-select">
        <Spin spinning={loading} style={{ height: '100%' }}>
          <div className="region-select__header">设备所在区域</div>
          <Search
            style={{ marginBottom: 8 }}
            placeholder="搜索区域名称"
            onSearch={this.onSearch}
            size="small"
          />

          {!!regionTree.length && (
            <Tree
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              loadData={this.onLoadData}
              key={treeKey}
              onSelect={this.handleSelect}
            >
              {this.loop(regionTree)}
            </Tree>
          )}

          {!regionTree.length && <Empty />}
        </Spin>
      </div>
    );
  }
}

export default RegionSelect;
