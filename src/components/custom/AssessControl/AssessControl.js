import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Divider } from 'antd';
import OrganizationManagement from './OrganizationManagement';

const { Header, Content, Sider } = Layout;

const baseURLAPI = window.pwConfig[process.env.NODE_ENV].customURLs.hikBaseURL;

class AssessControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedMenu: {
        key: 'two',
        iconType: 'folder-open',
        title: '分组管理',
        render: () => {
          return <OrganizationManagement />;
        }
      },
      collapsed: false
    };
    this.menus = [
      {
        key: 'one',
        iconType: 'setting',
        title: '权限配置',
        render: () => {
          return <p>权限配置</p>;
        }
      },
      {
        key: 'two',
        iconType: 'folder-open',
        title: '分组管理',
        render: () => {
          return <p>分组管理</p>;
        }
      },
      {
        key: 'three',
        iconType: 'file-search',
        title: '权限综合查询',
        render: () => {
          return <p>1223</p>;
        }
      },
      {
        key: 'four',
        iconType: 'cloud-download',
        title: '权限下载记录',
        render: () => {
          return <p>1223</p>;
        }
      }
    ];
  }

  render() {
    const { loading, selectedMenu, collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={collapsed => {
            this.setState({ collapsed });
          }}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={['one']}
            mode="inline"
            onSelect={e => {
              this.setState({
                selectedMenu: this.menus.find(item => {
                  return item.key === e.key;
                })
              });
            }}
          >
            {this.menus.map(item => {
              return (
                <Menu.Item key={item.key}>
                  <Icon type={item.iconType} style={{ marginLeft: '8px' }} />
                  <span>{item.title}</span>
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Layout style={{ background: '#fff', padding: 0 }}>
          <Header style={{ background: '#fff', marginBottom: '-40px' }}>
            <Breadcrumb style={{ margin: '8px 0 0 -32px' }}>
              <Breadcrumb.Item>门禁管理</Breadcrumb.Item>
              <Breadcrumb.Item>{selectedMenu.title}</Breadcrumb.Item>
            </Breadcrumb>
          </Header>
          <Divider style={{ margin: '8px' }} />
          <Content style={{ margin: '0 16px 16px' }}>
            {selectedMenu.render()}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default AssessControl;
