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
  static displayName = 'BusinessManagement';
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      originMenuTree: [],
      menuTree: [],
      loading: false,
      openedTabs: [], // 打开的标签页
      activeKey: '',
      collapsed: false,
      menuArr: [], // menuTree 的数组形式
      searchValue: '', // 搜索值
      openKeys: [] // 打开的 subMenu key
    };
    this._httpParams = {};
    const { baseURL } = this.props;
    if (baseURL) {
      this._httpParams = { baseURL };
    }
  }

  componentDidMount = () => {
    this.getData();
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
  };

  getData = async () => {
    this.setState({ loading: true });
    const { rootId, dblinkname } = this.props;
    const params = { dblinkname };
    // if (rootId) {
    params.rootid = rootId;
    // }
    this.p1 = makeCancelable(
      http(this._httpParams).getUserFunctionTree(params)
    );
    let res;
    try {
      res = await this.p1.promise;
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    const menuArr = [...res.data];
    const menuTree = arrayToTree([...res.data], {
      parentProperty: 'RES_PID',
      customID: 'RES_ID'
    });
    this.setState({
      menuArr,
      menuTree,
      originMenuTree: [...menuTree],
      loading: false
    });
  };

  handleSelectedMenuItem = menuItem => {
    const index = this.state.openedTabs.findIndex(
      openedTab => openedTab.RES_ID === menuItem.RES_ID
    );

    const activeKey = menuItem.RES_ID + '';
    const state = { activeKey };
    if (index === -1) {
      state.openedTabs = [...this.state.openedTabs, menuItem];
    }
    this.setState(state);
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
            <span
              onClick={e => {
                if (menuItem.RES_TABLETYPE) {
                  e.stopPropagation();
                  this.handleSelectedMenuItem(menuItem);
                }
              }}
            >
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
    const { menuArr, originMenuTree } = this.state;
    if (!value) {
      return this.setState({ menuTree: [...originMenuTree] });
    }

    const { intl } = this.props;
    const prop = intl.locale === 'zh' ? 'RES_NAME' : 'RES_NAME_EN';
    const newMenuArr = [...menuArr];

    // 通过搜索数组，得到所有对应的数组项
    console.log({ newMenuArr });
    const items = newMenuArr.filter(
      menuItem => menuItem.RES_NAME.indexOf(value) !== -1
    );

    // 得到数组项的所有子节点
    let otherItems = [];
    this.getOtherItems(otherItems, newMenuArr, items, 'RES_ID', 'RES_PID');

    // 去重
    const array = this.removeRepeatItem([...items, ...otherItems], 'RES_ID');

    const menuTree = arrayToTree(array, {
      parentProperty: 'RES_PID',
      customID: 'RES_ID'
    });

    this.setState({ menuTree });
  };

  removeRepeatItem = (arr, idField) => {
    const ret = [];
    arr.forEach(item => {
      const retItem = ret.find(retItem => retItem[idField] === item[idField]);
      if (!retItem) {
        ret.push(item);
      }
    });
    return ret;
  };

  getOtherItems = (result, itemArr, items, idField, pidField) => {
    if (!items.length) {
      return;
    }
    const arr = [];
    items.forEach(item => {
      const tempItems = itemArr.filter(
        itemArrItem => itemArrItem[pidField] === item[idField]
      );
      if (tempItems.length) {
        arr.push(...tempItems);
      }
    });
    result.push(...arr);
    return this.getOtherItems(result, itemArr, arr, idField, pidField);
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
      menuTree,
      openedTabs,
      activeKey,
      collapsed,
      openKeys
    } = this.state;
    const { intl, enTitle, title, dblinkname, baseURL } = this.props;

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
                {!collapsed && (
                  <Input.Search
                    onSearch={this.handleSearch}
                    className="business-management__input-search"
                    enterButton={false}
                  />
                )}
              </div>

              <Menu
                // mode="horizontal"
                theme="dark"
                mode="inline"
                openKeys={openKeys}
                onOpenChange={this.handleOpenChange}
              >
                {menuTree.map(menuItem => this.renderMenuItem(menuItem))}
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
                          dblinkname={dblinkname}
                          baseURL={baseURL}
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
