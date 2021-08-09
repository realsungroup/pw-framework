import React from 'react';
import http, { makeCancelable } from 'Util20/api';
import { message, Tree, Input, Select } from 'antd';
import { getParentKey } from './util';
import memoize from 'memoize-one';

const { TreeNode } = Tree;
const { Search } = Input;

/**
 * 部门树组件
 * @author 邓铭
 */
class DepartmentTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      treeDataList: [],
      searchValue: '',
      selectedBranch: [],
      expandedKeys: [`${props.rootNode.key}`],
      autoExpandParent: true,
      loading: false
    };
  }

  async componentDidMount() {
    const { onlyPersonData } = this.props;
    let data;
    if (onlyPersonData) {
      data = await this.getSubNodes();
      await this.fetchData(data);
    } else {
      await this.fetchData(data);
    }
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    this.p1 && this.p1.cancel();
  }

  /**
   * 获取后台表数据
   */
  fetchData = async data => {
    const {
      baseURL,
      resid,
      idField,
      titleField,
      rootNode,
      onlyPersonData
    } = this.props;
    this.setState({ loading: true });
    try {
      const httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      this.p1 = makeCancelable(http(httpParams).getTable({ resid }));
      const res = await this.p1.promise;
      if (onlyPersonData) {
        const filterdata = res.data.filter(item => {
          return data.find(d => {
            return d[idField] == item[idField];
          });
        });
        this.generatePersonTreeData(filterdata);
      } else {
        this.generateTreeData(res.data);
      }
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
      return res.data;
    } catch (error) {
      message.error(error);
      return [];
    }
  };

  getSubNodes = async () => {
    const { baseURL } = this.props;
    const httpParams = {};
    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    // http://ngrok5.realsun.me:6060/api/OrgStaff/GetSubNodes?resid=417643880834&idcolumn=DEP_ID&pidcolumn=DEP_PID&totallevels=2&rootresid=424709122808&rootidcolumn=DEP_ID
    try {
      const res = await http(httpParams).getSubNodes({
        resid: 417643880834,
        idcolumn: 'DEP_ID',
        pidcolumn: 'DEP_PID',
        totallevels: 2,
        rootresid: 424709122808,
        rootidcolumn: 'DEP_ID'
      });
      // console.log(res.data);
      return res.data;
    } catch (error) {
      message.error(error);
      return [];
    }
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
  generatePersonTreeData = (data = []) => {
    const { idField, pidField, titleField } = this.props;
    const treeData = [];
    data.forEach(item => {
      const isRootNode = data.some(d => {
        return d[idField] === item[pidField];
      });
      if (!isRootNode) {
        treeData.push({
          [idField]: item[idField],
          [pidField]: item[pidField],
          title: item[titleField],
          key: item[idField],
          children: []
        });
      }
    });

    treeData.forEach(item => {
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
    const { onSelect, treeClassName, onlyPersonData } = this.props;
    const _treeData = this.filterTreeData(selectedBranch, treeData);
    return (
      <div>
        {!onlyPersonData && (
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
        )}

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
            onSelect={selectedKeys => {
              onSelect && onSelect(selectedKeys);
            }}
            className={treeClassName ? treeClassName : ''}
          >
            {this.renderTree(_treeData)}
          </Tree>
        )}
      </div>
    );
  }
}

export default DepartmentTree;
