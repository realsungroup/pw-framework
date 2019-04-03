import React from 'react';
import './BusinessManagement.less';
import { propTypes, defaultProps } from './propTypes';
import { message, Tabs, Menu, Layout, Input, Spin } from 'antd';
import http, { makeCancelable } from 'Util20/api';
import BMContent from './BMContent';
import arrayToTree from 'array-to-tree';
import { injectIntl, FormattedMessage as FM } from 'react-intl';
import { getIntlVal } from 'Util20/util';
import { compose } from 'recompose';

const TabPane = Tabs.TabPane;
const { Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

/**
 * 业务管理组件
 */
class BusinessManagement extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      originMenuList: [],
      menuList: [],
      loading: false,
      openedTabs: [], // 打开的标签页
      activeKey: '',
      collapsed: false,
      arr: [], // menuList 的数组形式
      searchValue: '', // 搜索值
      openKeys: [] // 打开的 subMenu key
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
  };

  getData = async () => {
    this.setState({ loading: true });
    const { rootId } = this.props;
    const params = {};
    if (rootId) {
      params.rootid = rootId;
    }
    this.p1 = makeCancelable(http().getUserFunctionTree(params));
    let res;
    try {
      res = await this.p1.promise;
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    let arr = [...res.data];
    const menuList = arrayToTree([...res.data], {
      parentProperty: 'RES_PID',
      customID: 'RES_ID'
    });
    this.setState({
      arr,
      menuList,
      originMenuList: [...menuList],
      loading: false
    });
  };

  handleSelectedMenuItem = menuItem => {
    const index = this.state.openedTabs.findIndex(
      openedTab => openedTab.RES_ID === menuItem.RES_ID
    );
    if (index !== -1) {
      return;
    }

    const openedTabs = [...this.state.openedTabs, menuItem];
    const activeKey = menuItem.RES_ID + '';

    this.setState({
      openedTabs,
      activeKey
    });
  };

  handleOpenChange = openKeys => {
    this.setState({ openKeys });
  };

  renderMenuItem = menuItem => {
    if (
      typeof menuItem === 'object' &&
      menuItem.children &&
      menuItem.children.length
    ) {
      return (
        <SubMenu
          key={menuItem.RES_ID}
          title={
            <span>
              <i className={`iconfont ${menuItem.RES_ICONNAME}`} />
              {/* <Icon type="folder" /> */}
              <span>{menuItem.RES_NAME}</span>
            </span>
          }
        >
          {menuItem.children.map(item => this.renderMenuItem(item))}
        </SubMenu>
      );
    }
    return (
      typeof menuItem === 'object' && (
        <Menu.Item
          key={menuItem.RES_ID}
          onClick={() => this.handleSelectedMenuItem(menuItem)}
        >
          <i className={`iconfont ${menuItem.RES_ICONNAME}`} />
          {/* <Icon type="file" /> */}
          <span>{menuItem.RES_NAME}</span>
        </Menu.Item>
      )
    );
  };

  handleTabsChange = activeKey => {
    this.setState({ activeKey });
  };

  handleTabsEdit = (targetKey, action) => {
    if (action === 'remove') {
      const { openedTabs } = this.state;
      const index = openedTabs.findIndex(
        item => item.RES_ID === parseInt(targetKey, 10)
      );
      openedTabs.splice(index, 1);

      const len = openedTabs.length;
      let activeKey = '';
      if (len) {
        activeKey = openedTabs[len - 1].RES_ID + '';
      }
      this.setState({ openedTabs: [...openedTabs], activeKey });
    }
  };

  handleCollapse = collapsed => {
    this.setState({ collapsed });
  };

  handleSearch = value => {
    const { originMenuList, arr } = this.state;
    const { intl } = this.props;

    const prop = intl.locale === 'zh' ? 'RES_NAME' : 'RES_NAME_EN';

    const list = [...originMenuList];
    const menuList = [];
    let openKeys = [];
    list.forEach(item => {
      const parentKeys = [];
      let keys = [];
      if (typeof item === 'object') {
        this.getItemFromTree(
          item,
          prop,
          value,
          null,
          menuList,
          keys,
          'RES_ID',
          parentKeys
        );
      }
      openKeys.push(...keys);
    });
    this.setState({ menuList, openKeys: Array.from(new Set(openKeys)) });
  };

  getItemFromTree = (
    data,
    matchField,
    matchValue,
    parentData,
    arr,
    keyArr,
    keyField,
    parentKeys
  ) => {
    parentKeys.push(String(data[keyField]));
    if (data[matchField].indexOf(matchValue) !== -1) {
      if (parentData) {
        keyArr.push(...parentKeys);
      } else {
        arr.push(data);
      }
    }
    // 搜索 children
    if (data.children && data.children.length) {
      data.children.forEach(item => {
        if (typeof item === 'object') {
          this.getItemFromTree(
            item,
            matchField,
            matchValue,
            data,
            arr,
            keyArr,
            keyField,
            parentKeys
          );
        }
      });
    } else {
      return;
    }
  };

  render() {
    const {
      loading,
      menuList,
      openedTabs,
      activeKey,
      collapsed,
      openKeys
    } = this.state;
    const { intl, enTitle, title } = this.props;

    return (
      <Spin spinning={loading}>
        <div className="business-management">
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={this.handleCollapse}
              style={{ width: 256 }}
            >
              <div className="business-management__title">
                {!collapsed && getIntlVal(intl.locale, enTitle, title)}
              </div>
              <div className="business-management__menu-search">
                <Input.Search
                  onSearch={this.handleSearch}
                  className="business-management__input-search"
                  enterButton={false}
                />
              </div>

              <Menu
                mode="horizontal"
                theme="dark"
                mode="inline"
                openKeys={openKeys}
                onOpenChange={this.handleOpenChange}
              >
                {menuList.map(menuItem => this.renderMenuItem(menuItem))}
              </Menu>
            </Sider>
            <Layout>
              <Content style={{ margin: '0 16px' }}>
                <div style={{ padding: 24, background: '#fff' }}>
                  <Tabs
                    onChange={this.handleTabsChange}
                    activeKey={activeKey}
                    type="editable-card"
                    onEdit={this.handleTabsEdit}
                  >
                    {openedTabs.map(menuItem => (
                      <TabPane
                        tab={menuItem.RES_NAME}
                        key={menuItem.RES_ID + ''}
                      >
                        <BMContent
                          key={menuItem.RES_ID}
                          resid={menuItem.RES_ID}
                        />
                      </TabPane>
                    ))}
                  </Tabs>
                </div>
              </Content>
            </Layout>
          </Layout>
        </div>
      </Spin>
    );
  }
}

export default compose(injectIntl)(BusinessManagement);
