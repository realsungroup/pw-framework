import React from 'react';
import { Tree, Input, message, Spin, Empty } from 'antd';
import {
  queryDepartments,
  getOrgTreeByName,
  getSubOrgs
} from '../../../hikApi';
import PropTypes from 'prop-types';
import './OrgSelect.less';
import { tree2list } from 'Util20/util';

const { TreeNode } = Tree;

const { Search } = Input;

/**
 * 组织树组件
 */
class OrgSelect extends React.Component {
  static propTypes = {
    /**
     * 根组织 indexCodes 列表
     */
    orgIndexCodes: PropTypes.arrayOf(PropTypes.string).isRequired,

    /**
     * 组织节点选择时的回调
     */
    onOrgSelect: PropTypes.func,

    /**
     * 是否有标题
     */
    hasTitle: PropTypes.string,

    /**
     * 节点前添加 Checkbox 复选框
     */
    checkable: PropTypes.bool,

    /**
     * 获取到的组织列表改变时的回调
     */
    onOrgListChange: PropTypes.func,

    /**
     * 选中的树节点
     */
    selectedKeys: PropTypes.array,

    /**
     * 请求组织完后的回调
     */
    onFetchedOrg: PropTypes.func
  };

  static propTypes = {
    hasTitle: false,
    checkable: false
  };

  state = {
    loading: false,
    orgTree: [],
    autoExpandParent: true,
    searchValue: '',
    treeKey: 0
  };

  componentDidMount = () => {
    this.initData();
  };

  initData = async () => {
    this.setState({ loading: true });
    const { orgIndexCodes } = this.props;
    let res;
    try {
      res = await queryDepartments({
        orgIndexCodes: orgIndexCodes.join(','),
        pageNo: 1,
        pageSize: 1000
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }

    if (res && res.data && Array.isArray(res.data.list)) {
      this.setState({
        orgTree: res.data.list,
        loading: false,
        searchValue: '',
        treeKey: this.state.treeKey + 1
      });
      const orgList = tree2list(res.data.list);
      const { onOrgListChange, onOrgSelect } = this.props;
      onOrgListChange && onOrgListChange(orgList);
      orgList &&
        orgList.length &&
        onOrgSelect &&
        onOrgSelect(orgList[0].orgIndexCode);
    }
  };

  onLoadData = async treeNode => {
    if (treeNode.props.children) {
      return;
    }
    const { orgIndexCode } = treeNode.props;

    const {
      data: { list }
    } = await getSubOrgs(orgIndexCode);

    treeNode.props.dataRef.children = list;

    const newOrgTree = [...this.state.orgTree];
    this.setState({
      orgTree: newOrgTree,
      treeKey: this.state.treeKey + 1
    });

    const orgList = tree2list(newOrgTree);
    const { onOrgListChange } = this.props;
    onOrgListChange && onOrgListChange(orgList);
  };

  getDisableCheckbox = item => {
    const { checkable, disableCheckedKeys } = this.props;
    if (checkable && disableCheckedKeys) {
      const { orgIndexCode } = item;
      if (disableCheckedKeys.includes(orgIndexCode)) {
        return true;
      }
    }
    return false;
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children && item.children.length) {
        return (
          <TreeNode
            title={item.name}
            key={item.indexCode}
            dataRef={item}
            disableCheckbox={this.getDisableCheckbox(item)}
          >
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
          disableCheckbox={this.getDisableCheckbox(item)}
        />
      );
    });

  onSearch = async value => {
    if (!value) {
      return this.initData();
    }
    const result = this.state.orgTree.find(region =>
      region.orgName.includes(value)
    );
    if (result) {
      return this.setState({ searchValue: value });
    }

    this.setState({ loading: true, searchValue: value });
    const { orgIndexCodes } = this.props;
    let res;
    try {
      res = await getOrgTreeByName(orgIndexCodes, value);
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }

    const orgTree = res.data.orgTree || [];

    const dataList = [];
    const generateList = data => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { orgName: key } = node;
        dataList.push({ key, title: key });
        if (node.children) {
          generateList(node.children);
        }
      }
    };
    generateList(orgTree);

    const getParentKey = (key, tree) => {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children && node.children.length) {
          if (node.children.some(item => item.orgName === key)) {
            parentKey = node.orgIndexCode;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    };

    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(this.state.searchValue) > -1) {
          return getParentKey(item.key, orgTree);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    this.setState({
      loading: false,
      orgTree,
      expandedKeys,
      treeKey: this.state.treeKey + 1
    });
  };

  loop = data => {
    const { searchValue } = this.state;
    return data.map(item => {
      const index = item.orgName.indexOf(searchValue);
      const beforeStr = item.orgName.substr(0, index);
      const afterStr = item.orgName.substr(index + searchValue.length);
      const name =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.orgName}</span>
        );
      if (item.children && item.children.length) {
        return (
          <TreeNode
            key={item.orgIndexCode}
            title={name}
            dataRef={item}
            disableCheckbox={this.getDisableCheckbox(item)}
          >
            {this.loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.orgIndexCode}
          title={name}
          {...item}
          dataRef={item}
          disableCheckbox={this.getDisableCheckbox(item)}
        />
      );
    });
  };

  onExpand = (expandedKeys, { expanded }) => {
    this.setState({ expandedKeys });
  };

  handleSelect = selectedKeys => {
    const { onOrgSelect } = this.props;
    onOrgSelect && onOrgSelect(selectedKeys[0]);
  };

  getCheckedKeys = () => {
    const { checkable, checkedKeys } = this.props;
    if (checkable) {
      return checkedKeys;
    }
    return;
  };

  render() {
    const {
      orgTree,
      loading,
      expandedKeys,
      autoExpandParent,
      treeKey
    } = this.state;
    const { hasTitle, checkable, onCheck, selectedKeys } = this.props;
    return (
      <div className="org-select">
        <Spin spinning={loading} style={{ height: '100%' }}>
          {hasTitle && <div className="org-select__header">人员所属组织</div>}
          <Search
            style={{ marginBottom: 8 }}
            placeholder="搜索组织名称"
            onSearch={this.onSearch}
            size="small"
          />

          {!!orgTree.length && (
            <Tree
              onExpand={this.onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              loadData={this.onLoadData}
              key={treeKey}
              onSelect={this.handleSelect}
              checkable={checkable}
              onCheck={onCheck}
              checkedKeys={this.getCheckedKeys()}
              checkStrictly
              selectedKeys={selectedKeys}
            >
              {this.loop(orgTree)}
            </Tree>
          )}

          {!orgTree.length && <Empty />}
        </Spin>
      </div>
    );
  }
}

export default OrgSelect;
