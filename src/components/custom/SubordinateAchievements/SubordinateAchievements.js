import React from 'react';
import './SubordinateAchievements.less';
import { Menu, Select, Input, Pagination, Tree } from 'antd';

const { SubMenu } = Menu;
const { Search } = Input;
const { TreeNode } = Tree;

const { Option } = Select;
/**
 * 查看下属绩效
 */
class SubordinateAchievements extends React.Component {
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };
  render() {
    return (
      <div className="subordinate-achievements">
        <div className="subordinate-achievements__menu">
          <Menu mode="inline" style={{ width: '100%' }}>
            <SubMenu key="sub1" title="目标">
              <Menu.Item key="1">目标</Menu.Item>
              <Menu.Item key="2">历史记录</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title="年中自评">
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title="年末自评">
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title="直评查询">
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title="面谈记录">
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title="员工绩效反馈">
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
        <div className="subordinate-achievements__main">
          <div className="subordinate-achievements__main-container">
            <Tree
              onSelect={this.onSelect}
              onCheck={this.onCheck}
              defaultExpandAll
              s
            >
              <TreeNode title="parent 1" key="0-0">
                <TreeNode title="parent 1-0" key="0-0-0">
                  <TreeNode title="leaf" key="0-0-0-0" />
                  <TreeNode title="leaf" key="0-0-0-1" />
                </TreeNode>
                <TreeNode title="parent 1-1" key="0-0-1">
                  <TreeNode title={'sss'} key="0-0-1-0" />
                </TreeNode>
              </TreeNode>
            </Tree>
          </div>
        </div>
        <div className="subordinate-achievements__table">
          <div className="subordinate-achievements__table-container">
            <Select style={{ width: 100 }} value="FY2020" size="small">
              <Option value="FY2020">FY2020</Option>
            </Select>
            <div className="subordinate-achievements-tabledata-container"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default SubordinateAchievements;
