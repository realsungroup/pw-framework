import React from 'react';
import withTitle from 'Common/hoc/withTitle';
import { getItem, setItem } from 'Util20/util';
import './Desktop.less';
import { message, Popover, Icon, Avatar, Menu, Modal } from 'antd';
import http from 'Util20/api';
import folderPng from './assets/folder.png';
import classNames from 'classnames';
import { cloneDeep } from 'lodash';
import DesktopDate from './DesktopDate';
import DesktopLockScreen from './DesktopLockScreen';
import DesktopModifyPass from './DesktopModifyPass';
import DesktopBg from './DesktopBg';
import {
  DesktopReminderList,
  DesktopColorPicker,
  DesktopDashboard,
  WindowView,
  DesktopPersonCenter
} from './loadableDesktop';
import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
  SubMenu as SubMenuItem
} from 'react-contextmenu';
import { setLanguage } from 'Util/api';
import { logout } from 'Util/auth';
import desktopIconPng from './assets/desktop-icon.png';
import defaultBg from './DesktopBg/assets/default-bg.jpg';

const { SubMenu } = Menu;
const { businessOptionalResIds, defaultOpenWindow } = window.pwConfig[
  process.env.NODE_ENV
];

const getPopoverContainer = () => {
  return document.querySelector('.desktop__main');
};

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
  hasRequestReminderList = false; // 是否已请求提醒列表数据

  constructor(props) {
    super(props);
    const userInfo = JSON.parse(getItem('userInfo'));
    const color = userInfo.UserInfo.EMP_Color;
    const selectedBg = JSON.parse(getItem('selectedBg')) || {
      bgMode: 'image', // 背景模式
      value: defaultBg // 背景值
    };
    this.state = {
      folders: [], // 在桌面的文件夹
      activeApps: [], // 打开的 app
      allFolders: [], // 所有的文件夹
      loading: false,
      menuVisible: false, // 菜单是否显示
      userInfo, // 用户信息
      allFoldersExpandedKeys: [],
      zIndexActiveApps: [], // 被激活的 app 的层级
      reminderList: [], // 提醒列表
      reminderListVisible: false, // 提醒列表是否显示
      reminderListLoading: false, // 提醒列表是否显示
      color, // 主题色
      language: localStorage.getItem('language'), // 语言
      modifyPassModalVisible: false, // 修改密码的模态窗
      selectedBg // 背景图片地址
    };
  }

  componentDidMount = async () => {
    // 设置主题色
    this.setThemeColor(this.state.color);

    // 默认打开仪表盘
    if (defaultOpenWindow === '仪表盘') {
      this.handleOpenDashboard();
    }

    // 获取数据
    this.getData(true);
  };

  setThemeColor = themeColor => {
    window.less
      .modifyVars({ '@primary-color': themeColor })
      .then(() => {})
      .catch(err => {
        message.error(err.message);
      });
  };

  getDesktopMainRef = node => {
    this.desktopMainRef = node;
  };

  getWindowViewRef = (node, title) => {
    this[`windowViewRef${title}`] = node;
  };

  getLockScreenRef = node => {
    this.lockScreenRef = node;
  };

  getDesktopLockScreenRef = node => {
    this.desktopLockScreenRef = node;
  };

  handleDesktopClick = () => {
    if (this.state.menuVisible) {
      this.setState({ menuVisible: false });
    }
    if (this.state.reminderListVisible) {
      this.setState({ reminderListVisible: false });
    }
  };

  handleCloseModifyPassModal = () => {
    this.setState({ modifyPassModalVisible: false });
  };

  handleModifyPassSuccess = () => {
    this.setState({ modifyPassModalVisible: false });
    this.props.history.push('/login');
  };

  getData = async (isFirst = false) => {
    this.setState({ loading: true });
    const res = await this.getAndSetUserDesktop(isFirst);
    await this.getAndSetAllAppLinks(res.userdefined);
    this.setState({ loading: false });
  };

  getAndSetUserDesktop = async (isFirst = false) => {
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
    this.setState({ folders }, () => {
      // 第一次打开桌面时，默认打开的 app
      if (isFirst) {
        folders.some(folder =>
          folder.apps.some(app => {
            if (app.title === defaultOpenWindow) {
              this.handleOpenWindow(app, folder.typeName);
              return true;
            }
          })
        );
      }
    });
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
    const resid = parseInt(app.ResID || app.resid, 10);
    const url = `/fnmodule?resid=${resid}&recid=${
      app.REC_ID
    }&type=${typeName}&title=${app.title}`;
    const children = (
      <iframe src={url} frameBorder="0" className="desktop__iframe" />
    );
    const width = this.desktopMainRef.clientWidth;
    const height = this.desktopMainRef.clientHeight;

    this.addAppToBottomBar(children, app.title, {
      ...app,
      width,
      height,
      x: 0,
      y: 0,
      customWidth: 800,
      customHeight: height,
      customX: 0,
      customY: 0,
      minWidth: 330,
      minHeight: 500,
      zoomStatus: 'max'
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

      const children = (
        <iframe src={url} frameBorder="0" className="desktop__iframe" />
      );
      const width = this.desktopMainRef.clientWidth;
      const height = this.desktopMainRef.clientHeight;

      this.setState({ menuVisible: false });

      this.addAppToBottomBar(children, app.title, {
        ...app,
        width,
        height,
        x: 0,
        y: 0,
        customWidth: 800,
        customHeight: height,
        customX: 0,
        customY: 0,
        minWidth: 330,
        minHeight: 500,
        zoomStatus: 'max'
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

  handlePoweroffClick = () => {
    Modal.confirm({
      title: '提示',
      content: '您确定要退出登录吗？',
      onOk: () => {
        logout();
        this.props.history.push('/');
      }
    });
  };

  handleLockScreen = () => {
    Modal.confirm({
      title: '提示',
      content: '您确定要锁定屏幕吗？',
      onOk: this.lockScreen
    });
  };

  handleOpenModifyPassModal = () => {
    this.setState({ modifyPassModalVisible: true });
  };

  lockScreen = () => {
    this.desktopLockScreenRef.lockScreenRef.lockScreen();
  };

  handleOpenReminderList = () => {
    const reminderListVisible = !this.state.reminderListVisible;
    this.setState({ reminderListVisible });
    // 已请求过了提醒列表数据
    if (this.hasRequestReminderList) {
      return;
    }

    this.getReminderData();
  };

  handleOpenDashboard = () => {
    const children = <DesktopDashboard />;
    const width = this.desktopMainRef.clientWidth;
    const height = this.desktopMainRef.clientHeight;
    this.addAppToBottomBar(children, '仪表盘', {
      width,
      height,
      x: 0,
      y: 0,
      customWidth: 800,
      customHeight: height,
      customX: 0,
      customY: 0,
      minWidth: 330,
      minHeight: 500,
      zoomStatus: 'max'
    });
  };

  handleOpenPersonCenter = () => {
    const children = <DesktopPersonCenter />;
    const width = 620;
    const height = this.desktopMainRef.clientHeight;
    const x = this.desktopMainRef.clientWidth / 2 - 310;
    this.setState({ menuVisible: false });
    this.addAppToBottomBar(children, '个人中心', {
      width,
      height,
      x,
      y: 0,
      customWidth: width,
      customHeight: height,
      customX: x,
      customY: 0,
      minWidth: 330,
      minHeight: 500,
      zoomStatus: 'custom'
    });
  };

  handleReminderListItemClick = (url, title) => {
    const children = (
      <iframe src={url} frameBorder="0" className="desktop__iframe" />
    );
    const width = this.desktopMainRef.clientWidth;
    const height = this.desktopMainRef.clientHeight;
    this.addAppToBottomBar(children, title, {
      width,
      height,
      x: 0,
      y: 0,
      customWidth: 800,
      customHeight: height,
      customX: 0,
      customY: 0,
      minWidth: 330,
      minHeight: 500,
      zoomStatus: 'max'
    });
  };

  handleMaskShow = () => {
    window.addEventListener('unload', this.unloadCallback);
  };

  addAppToBottomBar = (children, title, activeAppOthersProps = {}) => {
    const { activeApps, zIndexActiveApps } = this.state;

    // 不能打开同一个窗口
    if (activeApps.findIndex(activeApp => activeApp.appName === title) !== -1) {
      return message.info('窗口已打开');
    }

    const activeApp = {
      ...activeAppOthersProps,
      children,
      appName: title,
      isOpen: true, // 当前窗口是否打开（可以同时有多个窗口打开）
      isActive: true // 当前窗口是否被激活（最多只有一个窗口被激活）
    };

    activeApps.forEach(activeApp => {
      activeApp.isActive = false;
    });
    const newZIndexActiveApps = [...zIndexActiveApps, activeApp];

    this.setState({
      activeApps: [...activeApps, activeApp],
      zIndexActiveApps: newZIndexActiveApps,
      reminderListVisible: false
    });
  };

  handleClearCache = async () => {
    try {
      await http().clearCache();
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    message.success('清除缓存成功');
  };

  handleSelectColor = color => {
    this.setState({ color });
  };

  handleOpenColorPicker = () => {
    const { color } = this.state;
    const children = (
      <DesktopColorPicker
        color={color}
        onColorSelect={this.handleSelectColor}
      />
    );

    const node = this[`windowViewRef更换主题色`];
    const x = this.desktopMainRef.clientWidth / 2 - 115;
    const y = this.desktopMainRef.clientHeight / 2 - 190;

    this.addAppToBottomBar(children, '更换主题色', {
      width: 230,
      height: 380,
      x,
      y,
      customWidth: 230,
      customHeight: 380,
      customX: x,
      customY: y,
      zoomStatus: 'custom'
    });
  };

  handleResizeStop = (activeApp, dW, dH) => {
    activeApp.width = activeApp.width + dW;
    activeApp.height = activeApp.height + dH;

    activeApp.customWidth = activeApp.width;
    activeApp.customHeight = activeApp.height;

    activeApp.zoomStatus = 'custom';
    this.forceUpdate();
  };

  handleDragStop = (activeApp, dX, dY) => {
    activeApp.x = dX;
    activeApp.y = dY;
    activeApp.customX = dX;
    activeApp.customY = dY;
    this.forceUpdate();
  };

  handleMax = activeApp => {
    activeApp.x = 0;
    activeApp.y = 0;
    activeApp.width = this.desktopMainRef.clientWidth;
    activeApp.height = this.desktopMainRef.clientHeight;
    activeApp.zoomStatus = 'max';
    this.forceUpdate();
  };

  handleCustom = activeApp => {
    activeApp.x = activeApp.customX;
    activeApp.y = activeApp.customY;
    activeApp.width = activeApp.customWidth;
    activeApp.height = activeApp.customHeight;
    activeApp.zoomStatus = 'custom';
    this.forceUpdate();
  };

  handleChangeLanguage = async (e, data) => {
    if (this.state.language === data.language) {
      return;
    }
    const { intl } = this.props;
    const value = data.language;
    let res;
    try {
      res = await setLanguage(value);
    } catch (err) {
      return message.error(err.message);
    }
    if (res.OpResult === 'Y') {
      this.modLanguage(value);
      this.setState({ language: value });
      // message.success(intl.messages['RightBtns.success']);
      message.success('更换语言成功');

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  handleSelectDeskBg = selectedBg => {
    this.setState({ selectedBg: { ...selectedBg } });
    setItem('selectedBg', JSON.stringify(selectedBg));
  };

  handleOpenDesktopBg = () => {
    const { selectedBg } = this.state;
    const children = (
      <DesktopBg selectedBg={selectedBg} onSave={this.handleSelectDeskBg} />
    );

    const width = 800;
    const height = this.desktopMainRef.clientHeight;
    const x = this.desktopMainRef.clientWidth / 2 - 400;
    const y = 0;

    this.addAppToBottomBar(children, '更换背景图片', {
      width,
      height,
      x,
      y,
      customWidth: width,
      customHeight: height,
      customX: x,
      customY: y,
      zoomStatus: 'custom'
    });
  };

  modLanguage = language => {
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        userInfo = JSON.parse(userInfo);
      } catch (err) {
        return;
      }
      userInfo.UserInfo.EMP_LANGUAGE = language;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('language', language);
    }
  };

  getReminderData = async () => {
    this.setState({ reminderListLoading: true, reminderListVisible: true });
    let res;
    try {
      res = await http().getReminderData();
    } catch (err) {
      this.setState({ reminderListLoading: false });
      console.error(err);
      return message.error(err.message);
    }
    const list = [...res.data];
    this.setState({ reminderList: list, reminderListLoading: false });
    this.hasRequestReminderList = true;
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
          key={folder.typeName + index}
          placement="rightTop"
          overlayClassName="desktop__folder-wrap"
          getPopupContainer={getPopoverContainer}
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
          {activeApp.DeskiconCls && (
            <i
              className={`iconfont icon-${activeApp.DeskiconCls ||
                'wdkq_icon'}`}
            />
          )}

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
    return activeApps.map((activeApp, index) => {
      const visible = activeApp.isOpen;
      // 窗口的 zIndex，从 4 开始
      const zIndex =
        zIndexActiveApps.findIndex(app => app.appName === activeApp.appName) +
        4;

      return (
        <WindowView
          ref={node => this.getWindowViewRef(node, activeApp.title)}
          key={activeApp.appName + index}
          title={activeApp.appName}
          visible={visible}
          onClose={() => this.handleCloseActiveApp(activeApp)}
          onMin={() => this.handleMinActiveApp(activeApp)}
          onActive={() => this.handleActiveWindowView(activeApp)}
          zIndex={zIndex}
          width={activeApp.width}
          height={activeApp.height}
          x={activeApp.x}
          y={activeApp.y}
          minWidth={activeApp.minWidth}
          minHeight={activeApp.minHeight}
          onResizeStop={(dW, dH) => this.handleResizeStop(activeApp, dW, dH)}
          onDragStop={(dX, dY) => this.handleDragStop(activeApp, dX, dY)}
          onMax={() => this.handleMax(activeApp)}
          onCustom={() => this.handleCustom(activeApp)}
          isActive={activeApp.isActive}
          zoomStatus={activeApp.zoomStatus}
        >
          {activeApp.children}
        </WindowView>
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
      loading,
      reminderList,
      reminderListVisible,
      reminderListLoading,
      modifyPassModalVisible,
      selectedBg
    } = this.state;

    // 背景样式
    const desktopStyle = {};
    if (selectedBg.bgMode === 'image') {
      desktopStyle.background = `url(${
        selectedBg.value
      }) center center / cover no-repeat`;
    } else {
      desktopStyle.background = selectedBg.value;
    }

    return (
      <div
        className="desktop"
        onClick={this.handleDesktopClick}
        style={desktopStyle}
      >
        {/* 右键菜单触发区域，即桌面 */}
        <ContextMenuTrigger id="desktop__trigger-area">
          <div className="desktop__main" ref={this.getDesktopMainRef}>
            {this.renderFolders()}
          </div>
        </ContextMenuTrigger>
        {/* 桌面底部 bar */}
        <div className="desktop__bottom-bar">
          <div className="desktop__bottom-left">
            <div className="desktop__logo" onClick={this.handleTriggerMenu}>
              <i className="iconfont icon-logo" />
            </div>
            <div className="desktop__active-apps">
              {this.renderActiveApps()}
            </div>
          </div>
          <div className="desktop__bottom-right">
            <DesktopDate className="desktop__bottom-date" />
            <div
              className="desktop__bottom-right-item"
              onClick={this.handleOpenDashboard}
            >
              <Icon type="dashboard" />
            </div>
            <div
              className="desktop__bottom-right-item"
              onClick={this.handleOpenReminderList}
            >
              <Icon type="bell" />
            </div>
          </div>
        </div>
        {/* 窗口 */}
        {this.renderWindowView()}
        <div
          className={classNames('desktop__menu', {
            'desktop__menu--hide': !menuVisible
          })}
          onClick={e => e.stopPropagation()}
        >
          <div className="desktop__menu-user">
            <div
              className="desktop__menu-user-info"
              onClick={this.handleOpenPersonCenter}
            >
              <div className="desktop__menu-user-avatar">
                <Avatar icon="user" />
              </div>
              <div className="desktop__menu-user-username">
                {userInfo.UserCode}
              </div>
            </div>

            <div className="desktop__menu-icon-wrapper">
              <Icon
                type="lock"
                className="desktop__menu-icon"
                onClick={this.handleLockScreen}
              />
            </div>

            <div className="desktop__menu-icon-wrapper">
              <i
                className="iconfont icon-mod-password desktop__menu-icon"
                onClick={this.handleOpenModifyPassModal}
              />
            </div>

            <Icon
              type="poweroff"
              className="desktop__menu-poweroff"
              onClick={this.handlePoweroffClick}
            />
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

        <Icon
          type="loading"
          className={classNames('desktop__loading', {
            'desktop__loading--hide': !loading
          })}
        />

        {/* 提醒列表 */}
        <DesktopReminderList
          visible={reminderListVisible}
          list={reminderList}
          loading={reminderListLoading}
          onItemClick={this.handleReminderListItemClick}
        />

        {/* 右键菜单 */}
        <ContextMenu id="desktop__trigger-area">
          <MenuItem onClick={this.handleClearCache}>
            <span>清除缓存</span>
          </MenuItem>
          <MenuItem onClick={this.handleOpenColorPicker}>
            <span>更换主题色</span>
          </MenuItem>
          <SubMenuItem
            title={
              <div>
                <span>更换语言</span>
                <Icon type="right" className="desktop__context-menu-arraw" />
              </div>
            }
          >
            <MenuItem
              data={{ language: '中文' }}
              onClick={this.handleChangeLanguage}
            >
              <span
                className={classNames('desktop__language', {
                  'desktop__language--selected': language === '中文'
                })}
              />
              <span>中文</span>
            </MenuItem>
            <MenuItem
              data={{ language: 'English' }}
              onClick={this.handleChangeLanguage}
            >
              <span
                className={classNames('desktop__language', {
                  'desktop__language--selected': language === 'English'
                })}
              />
              <span>English</span>
            </MenuItem>
          </SubMenuItem>
          <MenuItem
            onClick={this.handleOpenDesktopBg}
            className="desktop__context-menu-desktop-icon-wrapper"
          >
            <img
              src={desktopIconPng}
              alt="desktop-icon"
              className="desktop__context-menu-icon"
            />
            <span style={{ marginLeft: 4 }}>桌面背景</span>
          </MenuItem>
        </ContextMenu>

        {/* 锁屏 */}
        <DesktopLockScreen
          userInfo={userInfo}
          ref={this.getDesktopLockScreenRef}
        />

        {/* 修改密码 */}
        <DesktopModifyPass
          visible={modifyPassModalVisible}
          onSuccess={this.handleModifyPassSuccess}
          onClose={this.handleCloseModifyPassModal}
        />
      </div>
    );
  }
}

const language = getItem('language') || '中文';
let title = 'Desktop';
if (language === '中文') {
  title = '桌面';
}

export default withTitle(title)(Desktop);
