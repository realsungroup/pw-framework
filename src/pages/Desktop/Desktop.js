import React from 'react';
import withTitle from 'Common/hoc/withTitle';
import { getItem } from 'Util20/util';
import './Desktop.less';
import { message, Popover, Icon, Tooltip, Avatar, Menu, Modal } from 'antd';
import http from 'Util20/api';
import folderPng from './assets/folder.png';
import classNames from 'classnames';
import WindowView from './WindowView';
import { cloneDeep } from 'lodash';

const { SubMenu } = Menu;
const { businessOptionalResIds } = window.pwConfig[process.env.NODE_ENV];

const objArrUnique = (arr, key) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i][key] === arr[j][key]) {
        arr.splice(j, 1);
      }
    }
  }
};

const dealApps = apps => {
  apps.forEach(app => (app.ResID = app.ResID || app.resid));
  objArrUnique(apps, 'ResID');
  let arr = [];
  apps.forEach(app => {
    const appIndex = arr.findIndex(item => item.typeName === app.BusinessNode);
    let index = appIndex;
    if (appIndex === -1) {
      arr[arr.length] = {
        apps: [],
        typeName: app.BusinessNode
      };
      index = arr.length - 1;
    }
    arr[index].apps.push(app);
  });
  return arr;
};

class Desktop extends React.Component {
  constructor(props) {
    super(props);
    const userInfo = JSON.parse(getItem('userInfo'));
    this.state = {
      folders: [], // 在桌面的文件夹
      activeApps: [], // 打开的 app
      allFolders: [], // 所有的文件夹
      loading: false,
      menuVisible: false, // 菜单是否显示
      userInfo, // 用户信息
      allFoldersExpandedKeys: [],
      zIndexActiveApps: [] // 被激活的 app 的层级
    };
  }

  componentDidMount = async () => {
    this.getData();
  };

  handleDesktopClick = () => {
    if (this.state.menuVisible) {
      this.setState({ menuVisible: false });
    }
  };

  getData = async () => {
    this.setState({ loading: true });
    const res = await this.getAndSetUserDesktop();
    await this.getAndSetAllAppLinks(res.userdefined);
    this.setState({ loading: false });
  };

  getAndSetUserDesktop = async () => {
    let res;
    try {
      res = await http().getUserDesktop();
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }

    // 桌面的文件夹
    const folders = dealApps([...res.data, ...(res.userdefined || [])]);
    this.setState({ folders });
    return res;
  };

  getAndSetAllAppLinks = async selectedApps => {
    const residStr = businessOptionalResIds.join(',');
    let res;
    try {
      res = await http().getAllAppLinks({
        parentresids: residStr,
        getresourcedata: 1,
        getrecordcount: 1
      });
    } catch (err) {
      console.error(err);
      this.setState({ loading: false });
      return message.error(err.message);
    }

    // 左下角的所有功能
    const { expandedKeys, fnTreeData } = this.dealFnTreeData(
      res.data || [],
      selectedApps
    );

    this.setState({
      allFolders: fnTreeData,
      allFoldersExpandedKeys: expandedKeys
    });
  };

  dealFnTreeData = (fnTreeData, selectedApps) => {
    const expandedKeys = [],
      checkedKeys = [],
      selectedFnList = [];
    fnTreeData.forEach(item => {
      item.title = item.resname;
      item.key = item.resid;
      expandedKeys.push(item.key + '');
      item.isParentNode = true;
      item.AppLinks.forEach(app => {
        app.title = app.RES_NAME;
        app.key = app.RES_PID + '_' + app.RES_ID;
        app.isParentNode = false;
        if (
          selectedApps.some(item => {
            if (item.name === app.RES_NAME) {
              return (app.recid = item.REC_ID);
            }
          })
        ) {
          checkedKeys.push(app.key);
          selectedFnList.push(cloneDeep(app));
        }
      });
    });

    return { expandedKeys, fnTreeData, checkedKeys, selectedFnList };
  };

  handleOpenWindow = (app, typeName) => {
    const resid = parseInt(app.ResId || app.resid, 10);
    const url = `/fnmodule?resid=${resid}&recid=${
      app.REC_ID
    }&type=${typeName}&title=${app.title}`;
    const appName = app.title;

    const activeApp = {
      ...app,
      url,
      appName,
      isOpen: true, // 当前窗口是否打开（可以同时有多个窗口打开）
      isActive: true // 当前窗口是否被激活（最多只有一个窗口被激活）
    };

    const { activeApps, zIndexActiveApps } = this.state;

    activeApps.forEach(activeApp => {
      activeApp.isActive = false;
    });
    const newZIndexActiveApps = [...zIndexActiveApps, activeApp];
    console.log({ newZIndexActiveApps });

    this.setState({
      activeApps: [...activeApps, activeApp],
      zIndexActiveApps: newZIndexActiveApps
    });
  };

  handleCloseActiveApp = activeApp => {
    const { activeApps, zIndexActiveApps } = this.state;
    const newActiveApps = [...activeApps];

    const appIndex = newActiveApps.findIndex(
      item => item.appName === activeApp.appName
    );

    newActiveApps.splice(appIndex, 1);

    // 删除 zIndexActiveApps
    const newZIndexActiveApps = [...zIndexActiveApps];
    const index = newZIndexActiveApps.findIndex(
      app => app.title === activeApp.title
    );
    newZIndexActiveApps.splice(index, 1);

    this.setState({
      activeApps: newActiveApps,
      zIndexActiveApps: newZIndexActiveApps
    });
  };

  handleMinActiveApp = activeApp => {
    const { activeApps } = this.state;
    const newActiveApps = [...activeApps];

    const appIndex = newActiveApps.findIndex(
      item => item.appName === activeApp.appName
    );
    newActiveApps[appIndex].isOpen = false;
    newActiveApps[appIndex].isActive = false;
    this.setState({ activeApps: newActiveApps });
  };

  handleBottomBarAppTrigger = activeApp => {
    const { activeApps, zIndexActiveApps } = this.state;
    const newActiveApps = [...activeApps];

    const appIndex = newActiveApps.findIndex(
      item => item.appName === activeApp.appName
    );

    // app 是否被打开
    let isOpen;
    // 当窗口为非激活状态时，窗口一定为打开
    if (!newActiveApps[appIndex].isActive) {
      isOpen = true;

      // 当窗口为激活状态时
    } else {
      isOpen = !newActiveApps[appIndex].isOpen;
    }
    newActiveApps[appIndex].isOpen = isOpen;

    // 只能有一个 app 被激活
    newActiveApps.forEach(activeApp => (activeApp.isActive = false));
    newActiveApps[appIndex].isActive = true;

    // 如果是打开的，则调整 zIndex
    const newZIndexActiveApps = [...zIndexActiveApps];
    if (isOpen) {
      const index = newZIndexActiveApps.findIndex(
        app => app.title === activeApp.title
      );
      const removedApp = newZIndexActiveApps.splice(index, 1);
      newZIndexActiveApps.push(removedApp[0]);
    }
    console.log({ newZIndexActiveApps });

    this.setState({
      activeApps: newActiveApps,
      zIndexActiveApps: newZIndexActiveApps
    });
  };

  handleActiveWindowView = activeApp => {
    const { activeApps, zIndexActiveApps } = this.state;
    const newActiveApps = [...activeApps];

    // app 索引
    const appIndex = newActiveApps.findIndex(
      item => item.appName === activeApp.appName
    );

    // 只能有一个 app 被激活
    newActiveApps.forEach(activeApp => (activeApp.isActive = false));
    newActiveApps[appIndex].isActive = true;

    if (!newActiveApps[appIndex].isActive) {
      newActiveApps[appIndex].isOpen = true;
    }

    // 调整 zIndex
    const newZIndexActiveApps = [...zIndexActiveApps];
    const index = newZIndexActiveApps.findIndex(
      app => app.title === activeApp.title
    );
    const removedApp = newZIndexActiveApps.splice(index, 1);
    newZIndexActiveApps.push(removedApp[0]);

    this.setState({
      activeApps: newActiveApps,
      zIndexActiveApps: newZIndexActiveApps
    });
  };

  handleTriggerMenu = e => {
    e.stopPropagation();
    this.setState({ menuVisible: !this.state.menuVisible });
  };

  handleAddToDesktop = appData => {
    const { folders } = this.state;
    let desktopApp, typeName;
    const isExistDesktop = folders.some(folder => {
      return folder.apps.some(app => {
        if (app.title === appData.title) {
          desktopApp = app;
          typeName = folder.typeName;
          return true;
        }
      });
    });
    const app = desktopApp;
    // 已经存在于桌面，则直接打开窗口
    if (isExistDesktop) {
      const resid = parseInt(app.ResId || app.resid, 10);
      const url = `/fnmodule?resid=${resid}&recid=${
        app.REC_ID
      }&type=${typeName}&title=${app.title}`;
      const appName = app.title;
      const { activeApps } = this.state;
      activeApps.forEach(activeApp => {
        activeApp.isActive = false;
      });
      this.setState({
        activeApps: [
          ...this.state.activeApps,
          {
            ...app,
            url,
            appName,
            isOpen: true, // 当前窗口是否打开（可以同时有多个窗口打开）
            isActive: true // 当前窗口是否被激活（最多只有一个窗口被激活）
          }
        ],
        menuVisible: false
      });

      // 不存在于桌面，则先将 app 添加到桌面，然后再打开窗口
    } else {
      this.addAppToDesktop(appData);
    }
  };

  handleRemoveDesktopApp = async appData => {
    try {
      await http().removeRecords({
        resid: 582414136652,
        data: [{ REC_ID: appData.recid }]
      });
    } catch (err) {
      console.error(err);
      return message.error(err);
    }
    this.getData();
  };

  addAppToDesktop = async appData => {
    try {
      await http().addRecords({
        resid: 582414136652,
        data: [
          {
            ResID: appData.RES_ID,
            UserID: this.state.userInfo.SysUserInfo.UserID
          }
        ]
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    // 添加到桌面之后，刷新数据
    await this.getData();
    const { folders } = this.state;
    let desktopApp, typeName;
    folders.some(folder => {
      return folder.apps.some(app => {
        if (app.title === appData.title) {
          desktopApp = app;
          typeName = folder.typeName;
          return true;
        }
      });
    });
    const app = desktopApp;
    // 打开窗口
    const resid = parseInt(app.ResId || app.resid, 10);
    const url = `/fnmodule?resid=${resid}&recid=${
      app.REC_ID
    }&type=${typeName}&title=${app.title}`;
    const appName = app.title;
    const { activeApps } = this.state;
    activeApps.forEach(activeApp => {
      activeApp.isActive = false;
    });
    this.setState({
      activeApps: [
        ...this.state.activeApps,
        {
          ...app,
          url,
          appName,
          isOpen: true, // 当前窗口是否打开（可以同时有多个窗口打开）
          isActive: true // 当前窗口是否被激活（最多只有一个窗口被激活）
        }
      ],
      menuVisible: false
    });
  };

  renderApps = (apps, typeName) => {
    return apps.map(app => (
      <div
        className="desktop__folder-app"
        key={app.ResID || app.resid}
        onClick={() => this.handleOpenWindow(app, typeName)}
      >
        <div className="desktop__folder-app-icon">
          <i
            className={`iconfont icon-${app.DeskiconCls || 'wdkq_icon'}`}
            style={{ fontSize: 48 }}
          />
        </div>
        <h3 className="desktop__folder-app-title">{app.title}</h3>
        <Icon
          type="close"
          className="desktop__folder-app-remove"
          onClick={e => {
            e.stopPropagation();
            let appData;
            this.state.allFolders.some(folder =>
              folder.AppLinks.some(appItem => {
                if (appItem.title === app.title) {
                  return (appData = appItem);
                }
              })
            );
            if (!appData || !appData.recid) {
              return message.info('该功能为必要功能，不能删除');
            }
            Modal.confirm({
              title: '提示',
              content: '您确定从桌面删除该模块吗？',
              onOk: () => this.handleRemoveDesktopApp(appData)
            });
          }}
        />
      </div>
    ));
  };

  renderFolders = () => {
    const { folders } = this.state;
    return folders.map((folder, index) => {
      return (
        <Popover
          content={
            <div className="desktop__folder-apps">
              {this.renderApps(folder.apps, folder.typeName)}
            </div>
          }
          title={folder.typeName || '未命名'}
          trigger="hover"
          // trigger="click"
          key={folder.typeName + index}
          placement="rightTop"
          overlayClassName="desktop__folder-wrap"
        >
          <div className="desktop__folder">
            <img src={folderPng} alt="folder" className="desktop__folder-img" />
            <h3 className="desktop__folder-title">{folder.typeName}</h3>
          </div>
        </Popover>
      );
    });
  };

  renderActiveApps = () => {
    const { activeApps } = this.state;

    return activeApps.map((activeApp, index) => {
      const classes = classNames('desktop__active-app', {
        'desktop__active-app--active': activeApp.isActive
      });
      return (
        <div
          className={classes}
          key={activeApp + index}
          onClick={() => this.handleBottomBarAppTrigger(activeApp)}
        >
          <i
            className={`iconfont icon-${activeApp.DeskiconCls || 'wdkq_icon'}`}
          />
          <span>{activeApp.appName}</span>
          <Icon
            type="close-circle"
            className="desktop__active-app-close"
            onClick={e => {
              e.stopPropagation();
              this.handleCloseActiveApp(activeApp);
            }}
          />
        </div>
      );
    });
  };

  renderWindowView = () => {
    const { activeApps, zIndexActiveApps } = this.state;
    return activeApps.map(activeApp => {
      const visible = activeApp.isOpen;
      // 窗口的 zIndex
      const zIndex =
        zIndexActiveApps.findIndex(app => app.title === activeApp.title) + 1;
      return (
        <WindowView
          key={activeApp.appName}
          src={activeApp.url}
          title={activeApp.appName}
          visible={visible}
          onClose={() => this.handleCloseActiveApp(activeApp)}
          onMin={() => this.handleMinActiveApp(activeApp)}
          onActive={() => this.handleActiveWindowView(activeApp)}
          style={{ zIndex }}
        />
      );
    });
  };

  renderMenuItem = data => {
    if (data.isParentNode) {
      return (
        <SubMenu
          key={data.key + ''}
          title={
            <span>
              <Icon type="menu" />
              <span>{data.title}</span>
            </span>
          }
        >
          {data.AppLinks.map(app => this.renderMenuItem(app))}
        </SubMenu>
      );
    }
    return (
      <Menu.Item
        key={data.key + ''}
        onClick={() => this.handleAddToDesktop(data)}
      >
        {data.title}
      </Menu.Item>
    );
  };

  render() {
    const {
      menuVisible,
      userInfo,
      allFolders,
      allFoldersExpandedKeys,
      loading
    } = this.state;
    const menuClasses = classNames('desktop__menu', {
      'desktop__menu--hide': !menuVisible
    });
    const loadingClasses = classNames('desktop__loading', {
      'desktop__loading--hide': !loading
    });
    return (
      <div className="desktop" onClick={this.handleDesktopClick}>
        <div className="desktop__main">{this.renderFolders()}</div>
        <div className="desktop__bottom-bar">
          <div className="desktop__bottom-left">
            <div className="desktop__logo" onClick={this.handleTriggerMenu}>
              <i className="iconfont icon-logo" />
            </div>
            <div className="desktop__active-apps">
              {this.renderActiveApps()}
            </div>
          </div>
          <div className="desktop__bottom-right" />
        </div>
        {this.renderWindowView()}
        <div className={menuClasses} onClick={e => e.stopPropagation()}>
          <div className="desktop__menu-user">
            <div className="desktop__menu-user-avatar">
              <Avatar icon="user" />
            </div>
            <div className="desktop__menu-user-username">
              {userInfo.UserCode}
            </div>
            <Icon type="poweroff" className="desktop__menu-poweroff" />
          </div>
          <div className="desktop__menu-list">
            <Menu
              theme="theme"
              style={{ width: '100%' }}
              defaultOpenKeys={allFoldersExpandedKeys}
              // selectedKeys={[this.state.current]}
              mode="inline"
            >
              {allFolders.map(folder => this.renderMenuItem(folder))}
            </Menu>
          </div>
        </div>

        <Icon type="loading" className={loadingClasses} />
      </div>
    );
  }
}

const language = getItem('language') || '中文';
let title = 'Desktop';
if (language === 'Desktop') {
  title = '桌面';
}

export default withTitle(title)(Desktop);
