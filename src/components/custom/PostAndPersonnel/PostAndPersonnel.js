import React from 'react';
import { Menu, Icon, Badge } from 'antd';
import classnames from 'classnames';
import './PostAndPersonnel.less';
import PersonnelChanges from './PersonnelChanges';
import PostArchitecture from './PostArchitecture';
import PersonRelationship from './PersonRelationship';

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureBaseURL;
const { SubMenu } = Menu;
const styles = {
  menuStyle: {
    height: '100%'
  }
};
class PostAndPersonnel extends React.Component {
  state = {
    collapsed: false,
    selectKey: 'personnel-changes',
    defaultSelectedKeys: ['personnel-changes'],
    defaultOpenKeys: ['personnel-approval', 'sub2', 'sub3']
  };

  onSelect = e => {
    this.setState({
      selectKey: e.key
    });
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  renderContent = () => {
    let { selectKey } = this.state;
    let page = null;
    switch (selectKey) {
      case 'personnel-changes':
        page = <PersonnelChanges />;
        break;
      case 'post-architecture':
        page = <PostArchitecture />;
        break;
      case 'person-relationship':
        page = (
          <PersonRelationship
            resid="639856535460"
            idField="C3_305737857578" //主表id字段名
            pidField="C3_417993417686" //父节点id字段名
            level={3}
            hasOpration={false}
            displayFileds={{
              firstField: 'C3_419343735913',
              secondaryField: 'C3_227212499515',
              thirdField: 'C3_417990929081',
              imgField: 'C3_461934233303'
            }}
            procedureConfig={{
              procedure: 'pw_staffs',
              paranames: 'dates',
              paratypes: 'string'
            }}
            baseURL={baseURL}
            hasView
          />
        );
        break;
      default:
        break;
    }

    return page;
  };

  render() {
    const { collapsed, defaultSelectedKeys, defaultOpenKeys } = this.state;
    return (
      <div className="post-personnel">
        <div
          className={classnames({
            'post-personnel_menu': true,
            collapsed: collapsed
          })}
        >
          <div
            onClick={this.toggleCollapsed}
            className={classnames({
              btn__collapsed: collapsed,
              btn__uncollapsed: !collapsed
            })}
          >
            <Icon
              type={collapsed ? 'caret-right' : 'caret-left'}
              className="icon__toggle-collapse"
            />
          </div>
          <Menu
            style={styles.menuStyle}
            defaultSelectedKeys={defaultSelectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            mode="inline"
            theme="light"
            onSelect={this.onSelect}
            inlineCollapsed={collapsed}
          >
            <Menu.Item key="personnel-changes">
              <Icon type="appstore" />
              <span>人事变动</span>
            </Menu.Item>
            <SubMenu
              key="personnel-approval"
              title={
                <span>
                  <Icon type="appstore" />
                  <span>人事审批</span>
                </span>
              }
            >
              <Menu.Item key="sub1-1">
                审批中
                <Badge count={0} />
              </Menu.Item>
              <Menu.Item key="sub1-2">
                已审批
                <Badge count={0} />
              </Menu.Item>
              <Menu.Item key="sub1-3">
                已作废
                <Badge count={0} />
              </Menu.Item>
              <Menu.Item key="sub1-4">
                已撤销
                <Badge count={0} />
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <spam>
                  <Icon type="appstore" />
                  <span>招聘审批</span>
                </spam>
              }
            >
              <Menu.Item key="sub2-1">
                审批中
                <Badge count={0} />
              </Menu.Item>
              <Menu.Item key="sub2-2">
                已审批
                <Badge count={0} />
              </Menu.Item>
              <Menu.Item key="sub2-3">
                已作废
                <Badge count={0} />
              </Menu.Item>
              <Menu.Item key="sub2-4">
                已撤销
                <Badge count={0} />
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="post-architecture">
              <Icon type="appstore" />
              <span>岗位架构管理</span>
            </Menu.Item>
            <SubMenu
              key="sub3"
              title={
                <span>
                  <Icon type="appstore" />
                  <span>人事档案</span>
                </span>
              }
            >
              <Menu.Item key="person-relationship">人事关系</Menu.Item>
              <Menu.Item>档案导入</Menu.Item>
            </SubMenu>
            <Menu.Item key="">
              <Icon type="appstore" />
              <span>岗位矩阵管理</span>
            </Menu.Item>
          </Menu>
        </div>
        <div
          className={classnames({
            'post-personnel_content__wrapper': true,
            collapsed: collapsed
          })}
        >
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

export default PostAndPersonnel;
