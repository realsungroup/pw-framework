import React from 'react';
import { Input, Tree, Icon } from 'antd';
import './DepartmentManager.less';
/**
 * 部门管理
 */
const { Search } = Input;
const { TreeNode } = Tree;

class DepartmentManager extends React.Component {
  render() {
    return (
      <div className="department-manager">
        <div className="department-manager__department-tree__wrapper">
          <div className="department-manager__department-tree__search">
            <Search placeholder="部门编号、部门名、部门曾用名"></Search>
          </div>
          <Tree>
            <TreeNode title="parent 1" key="0-0">
              <TreeNode title="parent 1-0" key="0-0-0" disabled>
                <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
                <TreeNode title="leaf" key="0-0-0-1" />
              </TreeNode>
              <TreeNode title="parent 1-1" key="0-0-1">
                <TreeNode
                  title={<span style={{ color: '#1890ff' }}>sss</span>}
                  key="0-0-1-0"
                />
              </TreeNode>
            </TreeNode>
          </Tree>
        </div>
        <div className="department-manager__main-content">
          <div className="department-manager__main-content__left">
            <div className="department-manager__main-content__left__top">
              <div className="department-manager__main-content__left__top__left"></div>
              <div className="department-manager__main-content__left__top__right"></div>
            </div>
            <div className="department-manager__main-content__left__center">
              <div className="department-manager__main-content__left__center__left"></div>
              <div className="department-manager__main-content__left__center__center"></div>
              <div className="department-manager__main-content__left__center__right"></div>
            </div>
            <div className="department-manager__main-content__left__bottom">
              <div className="department-manager__main-content__left__bottom__left"></div>
              <div className="department-manager__main-content__left__bottom__right"></div>
            </div>
          </div>
          <div className="department-manager__main-content__right">
            <div className="department-manager__main-content__right__top">
              <div className="department-manager__main-content__right__top__action-item">
                <span>人员档案</span>
                <Icon type="right" />
              </div>
              <div className="department-manager__main-content__right__top__action-item">
                <span>架构管理</span>
                <Icon type="right" />
              </div>
              <div className="department-manager__main-content__right__top__action-item">
                <span>申请招聘</span>
                <Icon type="right" />
              </div>
            </div>
            <div className="department-manager__main-content__right__bottom"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default DepartmentManager;
