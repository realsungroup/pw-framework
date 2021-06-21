import React from 'react';
import './TreeData.less';
import http, { makeCancelable } from '../../../../util20/api';
import { message, Tree, Input, Select } from 'antd';
import { getParentKey } from './util';
import memoize from 'memoize-one';

const { TreeNode } = Tree;
const { Search } = Input;

/**
 * 树组件
 * @author 邓铭
 */
class TreeData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      treeDataList: [],
      searchValue: '',
      selectedBranch: [],
      expandedKeys: [props.rootNode.key],
      autoExpandParent: true,
      loading: false
    };
    console.log(this.state);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.p1 && this.p1.cancel();
  }

  /**
   * 获取后台表数据
   */
  fetchData = async () => {
    const { baseURL, resid, idField, titleField, rootNode } = this.props;
    this.setState({ loading: true });
    try {
      const httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      this.p1 = makeCancelable(http(httpParams).getTable({ resid }));
      const res = await this.p1.promise;
      this.generateTreeData(res.data);
      const treeDataList = res.data.map(item => {
        return {
          key: item[idField],
          title: item[titleField]
        };
      });
      treeDataList.unshift({ ...rootNode });
      this.setState({
        treeDataList
      });
    } catch (error) {
      message.error(error.message);
    }
    this.setState({ loading: false });
  };

  generateTreeData = (data = []) => {
    const { idField, pidField, titleField, rootNode } = this.props;
    const treeData = [
      {
        title: rootNode.title,
        key: rootNode.key,
        [idField]: rootNode.key,
        children: []
      }
    ];
    data.forEach(item => {
      if (item[pidField] === rootNode.key) {
        treeData[0].children.push({
          [idField]: item[idField],
          [pidField]: item[pidField],
          title: item[titleField],
          key: item[idField],
          children: []
        });
      }
    });
    treeData[0].children.forEach(item => {
      this.calcChildren(item, data);
    });
    this.setState({ treeData });
  };

  calcChildren = (item, data = []) => {
    const { idField, pidField, titleField } = this.props;
    data.forEach(d => {
      if (d[pidField] === item[idField]) {
        item.children.push({
          DEP_ID: d[idField],
          DEP_PID: d[pidField],
          title: d[titleField],
          key: d[idField],
          children: []
        });
      }
    });
    if (item.children.length) {
      item.children.forEach(i => {
        this.calcChildren(i, data);
      });
    }
  };

  filterTreeData = memoize((filterText = [], treeData = []) => {
    if (!treeData.length || !filterText.length) {
      return treeData;
    }
    let _treeData = [{ ...treeData[0] }];
    _treeData[0].children = _treeData[0].children.filter(item =>
      filterText.some(text => text == item.key)
    );
    return _treeData;
  });

  handleSearchValueChange = e => {
    const { treeDataList, selectedBranch, treeData } = this.state;
    const { rootNode } = this.props;
    const { value } = e.target;
    const _treeData = this.filterTreeData(selectedBranch, treeData);
    if (value) {
      const keys = [];
      treeDataList.map(item => {
        if (item.title.indexOf(value) > -1) {
          keys.push(getParentKey(item.key, _treeData));
        }
        return null;
      });
      const expandedKeys = keys.filter(
        (item, i, self) => item != null && self.indexOf(item) === i
      );
      this.setState({
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      });
    } else {
      this.setState({
        expandedKeys: [rootNode.key],
        searchValue: value,
        autoExpandParent: true
      });
    }
  };
  renderTree = data => {
    const { searchValue } = this.state;
    return data.map(item => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title}>
            {this.renderTree(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} />;
    });
  };

  render() {
    const {
      selectedBranch,
      treeData,
      autoExpandParent,
      expandedKeys,
      loading
    } = this.state;
    const _treeData = this.filterTreeData(selectedBranch, treeData);
    return (
      <div>
        <div>
          <p>请选择分公司：</p>
          <Select
            value={selectedBranch}
            style={{ width: '100%', marginBottom: 8 }}
            onChange={v => {
              this.setState({ selectedBranch: v });
            }}
            mode="multiple"
          >
            {treeData[0] &&
              treeData[0].children.map(item => {
                return (
                  <Select.Option key={item.key}>{item.title} </Select.Option>
                );
              })}
          </Select>
        </div>
        <div>
          <p>请选择部门：</p>
          <Search
            style={{ marginBottom: 8 }}
            placeholder="输入部门名称搜索"
            onChange={this.handleSearchValueChange}
          />
        </div>
        {loading ? (
          '加载数据...'
        ) : (
          <Tree
            autoExpandParent={autoExpandParent}
            onExpand={expandedKeys => {
              this.setState({
                expandedKeys,
                autoExpandParent: false
              });
            }}
            expandedKeys={expandedKeys}
            onCheck={checkedKeys => {
              this.props.onCheck && this.props.onCheck(checkedKeys);
            }}
            checkable
          >
            {this.renderTree(_treeData)}
          </Tree>
        )}
      </div>
    );
  }
}

export default TreeData;
