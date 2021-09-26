import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Divider, Button } from 'antd';
import OrganizationManagement from './OrganizationManagement';
import AssessConfig from '../AssessConfig/AssessConfig';
import AuthDownloadRecord from '../AuthDownloadRecord';
import AuthAllQuery from '../AuthAllQuery';
import DownloadAuthModal from '../DownloadAuthModal';

const { Header, Content, Sider } = Layout;

const baseURLAPI = window.pwConfig[process.env.NODE_ENV].customURLs.hikBaseURL;

class AssessControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedMenu: {
        key: 'one',
        iconType: 'setting',
        title: '权限配置',
        render: () => {
          return <AssessConfig />;
        }
      },
      collapsed: false,
      downloadVisible: false,
      selectedKeys: ['one']
    };
    this.menus = [
      {
        key: 'one',
        iconType: 'setting',
        title: '权限配置',
        render: () => {
          return <AssessConfig />;
        }
      },
      {
        key: 'two',
        iconType: 'folder-open',
        title: '分组管理',
        render: () => {
          return <OrganizationManagement />;
        }
      },
      {
        key: 'three',
        iconType: 'file-search',
        title: '权限综合查询',
        render: () => {
          return <AuthAllQuery></AuthAllQuery>;
        }
      },
      {
        key: 'four',
        iconType: 'cloud-download',
        title: '权限下载记录',
        render: () => {
          return <AuthDownloadRecord />;
        }
      }
    ];
  }

  render() {
    const { loading, selectedMenu, collapsed, downloadVisible } = this.state;
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
            selectedKeys={this.state.selectedKeys}
            mode="inline"
            onSelect={e => {
              this.setState({
                selectedMenu: this.menus.find(item => {
                  return item.key === e.key;
                }),
                selectedKeys: [e.key]
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
          <Header
            style={{
              background: '#fff',
              display: 'flex',
              height: 32,
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}
          >
            <Breadcrumb style={{ margin: '8px 0 0 -32px' }}>
              <Breadcrumb.Item>门禁管理</Breadcrumb.Item>
              <Breadcrumb.Item>{selectedMenu.title}</Breadcrumb.Item>
            </Breadcrumb>
            {this.state.selectedKeys[0] === 'two' && (
              <Button
                size="small"
                icon="download"
                onClick={() => this.setState({ downloadVisible: true })}
              >
                下载权限
              </Button>
            )}
          </Header>
          <Divider style={{ margin: '8px' }} />
          <Content style={{ margin: '0 16px 16px' }}>
            {selectedMenu.render()}
          </Content>
        </Layout>
        {downloadVisible && (
          <DownloadAuthModal
            visible={downloadVisible}
            onCancel={() => this.setState({ downloadVisible: false })}
          />
        )}
      </Layout>
    );
  }
}

export default AssessControl;
