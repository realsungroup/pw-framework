import React from 'react';
import { Route } from 'react-router-dom';
import { getItem } from '../../util/localCache';
import {
  PersonCenter,
  WorkbenchSetting,
  GetConfig,
  Reminder,
  Desktop,
  WorkBench
} from '../loadablePage';
import { message, Icon, Modal } from 'antd';
import { defaultLogin, domainLogin } from 'Util/api';
import PageBody from '../components/PageBody';
import SwitchHome from '../components/SwitchHome';
import http from 'Util20/api';
import folderPng from './assets/folder.png';
import qs from 'qs';
import './PageContainer.less';
import { cloneDeep } from 'lodash';
import WindowView from './WindowView';
import PageHeader from '../components/PageHeader1';
import { delay } from 'lodash';
import DesktopLockScreen from '../Desktop/DesktopLockScreen';
import classNames from 'classnames';
import moment from 'moment';
import memoizeone from 'memoize-one';
import AbbreviationApp from './AbbreviationApp';
import { OrgChartData } from '../../components/common/loadableCommon';
import DesktopBg from './DesktopBg';
import defaultDesktopBg from './DesktopBg/assets/05.jpg';

import {
  DesktopReminderList,
  DesktopColorPicker,
  DesktopDashboard,
  DesktopPersonCenter
} from '../Desktop/loadableDesktop';

const {
  domainLoginConfig,
  lockScreenWaitTime,
  themeColor,
  businessOptionalResIds,
  defaultOpenWindow,
  orgChartConfig,
  reminderDataConfig
} = window.pwConfig[process.env.NODE_ENV];

const time = lockScreenWaitTime;

const desktopStyleMap = {
  DESKTOP: Desktop,
  WORKBENCH: WorkBench
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

function validateImage(pathImg) {
  return new Promise(res => {
    let ImgObj = new Image();
    ImgObj.onload = () => {
      if (ImgObj.width > 0 && ImgObj.height > 0) {
        res(true);
      } else {
        res(false);
      }
    };
    ImgObj.onerror = () => {
      res(false);
    };
    ImgObj.src = pathImg;
  });
  ////判断图片地址是否有效
  let ImgObj = new Image();
  ImgObj.src = pathImg;
  process.env.NODE_ENV === 'development' &&
    console.log(pathImg, ImgObj.width, ImgObj.height);
  if (ImgObj.width > 0 && ImgObj.height > 0) {
    return true;
  } else {
    return false;
  }
}

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
        typeName: app.BusinessNode,
        categoricalApps: new Map(),
        url: app.BusinessIconUrl || folderPng
      };
      index = arr.length - 1;
    }
    let categoryapps = arr[index].categoricalApps.get(
      app.PwCategory || '未分类'
    );
    if (categoryapps) {
      categoryapps.push(app);
      arr[index].categoricalApps.set(app.PwCategory || '未分类', categoryapps);
    } else {
      arr[index].categoricalApps.set(app.PwCategory || '未分类', [app]);
    }
    arr[index].apps.push(app);
  });
  return arr;
};

export default class PageContainer extends React.Component {
  constructor(props) {
    super(props);
    const userInfo = JSON.parse(getItem('userInfo'));
    let color = themeColor['@primary-color'];
    if (userInfo && userInfo.UserInfo && userInfo.UserInfo.EMP_Color) {
      color = userInfo.UserInfo.EMP_Color
    }
    const selectedBg = JSON.parse(getItem('selectedBg')) || {
      bgMode: 'image', // 背景模式
      value: defaultDesktopBg // 背景值
    };
    window.__powerWorkGlobal.themeColor = color;
    this.state = {
      reminderNum: 0,
      password: '',
      desktopStyle: null,
      activeApps: [],
      folders: [],
      zIndexActiveApps: [],
      appsSwitchStatus: [], // 激活的 app 开关状态数组（其值一一对应 activeApps 数组对象中的 isOpen 属性）
      fixedApps: [],
      allFolders: [],
      menus: [],
      searchTextHeader: '',
      allFoldersExpandedKeys: [],
      headerVisible: true,
      userInfo,
      showHome: true,
      showAbbreviation: false,
      recentApps: [],
      abbreviationDoms: [],
      color, // 主题色
      selectedBg
    };
    this.lockScreenRef = React.createRef();
  }

  componentDidMount = () => {
    const { userInfo, color } = this.state;
    // 设置主题色
    this.setThemeColor(this.state.color);
    // 'DESKTOP' or 'WORKBENCH'
    let desktopStyle = 'DESKTOP';
    try {
      desktopStyle = userInfo.UserInfo.EMP_MAINPAGE;
      if (['DESKTOP', 'WORKBENCH'].indexOf(desktopStyle) === -1) {
        // 默认 'WORKBENCH'
        desktopStyle = 'WORKBENCH';
      }

      const _desktopStyle = localStorage.getItem('desktopStyle');
      if (
        _desktopStyle &&
        (_desktopStyle === 'DESKTOP' || _desktopStyle === 'WORKBENCH')
      ) {
        desktopStyle = _desktopStyle;
      }
    } catch (err) { }

    this.setState({
      desktopStyle
    });

    this.getData(true);
    this.setRecentApps();

    if (desktopStyle === 'WORKBENCH') {
      this.fetchWaitingHandle();
    }
  };

  setRecentApps = async () => {
    const { userInfo } = this.state;
    let recentApps = JSON.parse(getItem('recentApps' + userInfo.UserCode));
    if (recentApps && Array.isArray(recentApps)) {
      recentApps = this.getSortRecentApps(recentApps);

      this.setState({ recentApps }, async () => {
        const { recentApps } = this.state;
        const pArr = [];
        recentApps.forEach(app => {
          pArr.push(validateImage(app.appIconUrl));
        });
        const resArr = await Promise.all(pArr).then();
        for (let index = 0; index < resArr.length; index++) {
          const validate = resArr[index];
          recentApps[index].appIconUrlValidate = validate;
        }
        this.setState({ recentApps: [...recentApps] });
      });
    } else {
      localStorage.setItem(
        'recentApps' + userInfo.UserCode,
        JSON.stringify([])
      );
      this.setState({ recentApps: [] });
    }
  };

  fetchWaitingHandle = async () => {
    this.setState({ loading: true });
    let linknames = '';
    reminderDataConfig.forEach(item => {
      linknames += item.dblinkname + ',';
    });
    linknames = linknames.substring(0, linknames.length - 1);
    let res;
    try {
      res = await http().getReminderDatas({ linknames });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
      return message.error(error.message);
    }

    const data = [];
    reminderDataConfig.forEach(item => {
      if (res.data[item.dblinkname]) {
        res.data[item.dblinkname].forEach(_item => {
          _item.dblinkname = item.dblinkname;
        });
        data.push(...res.data[item.dblinkname]);
      }
    });
    this.setState({ waitingHandleData: data, loading: false });
  };

  handleSearchChange = e => {
    this.setState({ searchTextHeader: e.target.value });
    delay(this.filterMenus, 200);
  };

  filterMenus = () => {
    const { allFolders, searchTextHeader: value } = this.state;
    const menus = allFolders
      .map(folder => {
        // 搜索的值不是分类的值
        if (folder.title.indexOf(value) === -1) {
          // 1.1
          const appLinks = folder.AppLinks.map(appLink => {
            if (appLink.title.indexOf(value) === -1) {
              return false;
            }
            return appLink;
          }).filter(Boolean);
          if (!appLinks.length) {
            return false;
          }
          return { ...folder, AppLinks: appLinks };
        }
        // 2 搜索的值是分类的值
        return folder;
      })
      .filter(Boolean);

    this.setState({ menus });
  };

  getWindowViewRef = (node, title) => {
    this[`windowViewRef${title}`] = node;
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
    this.setState({ folders, fixedApps: res.userdefined }, () => {
      const appArr = [];
      // 第一次打开桌面时，默认打开的 app
      if (isFirst) {
        folders.some(folder =>
          folder.apps.some(app => {
            if (app.title === defaultOpenWindow) {
              appArr.push({ app, typeName: folder.typeName });
              return true;
            }
          })
        );
      }
      // 地址栏有某个功能模块的 querystring 的话，也直接打开窗口
      const search = this.props.history.location.search.substring(1);
      const qsObj = qs.parse(search);
      if (qsObj.resid && qsObj.recid && qsObj.type && qsObj.title) {
        let temp = folders.some(folder =>
          folder.apps.some(app => {
            if (app.title === qsObj.title) {
              app.fnmoduleUrl = `fnmodule${this.props.history.location.search}`;
              appArr.push({ app, typeName: folder.typeName });
              return true;
            }
          })
        );

        // 若后端未定义这个入口（即改入口由前端定义的）
        if (!temp) {
          appArr.push({
            app: {
              appName: qsObj.title,
              title: qsObj.title,
              name: qsObj.title,
              ResID: qsObj.resid,
              REC_ID: qsObj.recid,
              fnmoduleUrl: `fnmodule${this.props.history.location.search}`
            },
            typeName: qsObj.type
          });
        }
      }
      this.handleOpenWindow(appArr);
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
      menus: fnTreeData,
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
      item.categoricalApps = new Map();
      item.AppLinks.forEach(app => {
        app.title = app.RES_NAME;
        app.key = app.RES_PID + '_' + app.RES_ID;
        app.isParentNode = false;
        if (
          selectedApps.some(item => {
            if (item.name === app.RES_NAME) {
              // REC_ID 为空时，为必要功能
              return (app.recid = item.REC_ID);
            }
          })
        ) {
          checkedKeys.push(app.key);
          selectedFnList.push(cloneDeep(app));
        }
        let categoryapps = item.categoricalApps.get(app.PwCategory || '未分类');
        if (categoryapps) {
          categoryapps.push(app);
          item.categoricalApps.set(app.PwCategory || '未分类', categoryapps);
        } else {
          item.categoricalApps.set(app.PwCategory || '未分类', [app]);
        }
      });
    });

    return { expandedKeys, fnTreeData, checkedKeys, selectedFnList };
  };

  handleBottomBarAppTrigger = activeApp => {
    const {
      desktopStyle,
      activeApps,
      zIndexActiveApps,
      appsSwitchStatus
    } = this.state;
    const newActiveApps = [...activeApps];
    const newAppsSwitchStatus = [...appsSwitchStatus];

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

    if (desktopStyle === 'DESKTOP') {
      newActiveApps[appIndex].isOpen = isOpen;
    } else {
      newActiveApps[appIndex].isOpen = true;
    }
    newAppsSwitchStatus[appIndex] = isOpen;

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
      zIndexActiveApps: newZIndexActiveApps,
      appsSwitchStatus: newAppsSwitchStatus,
      showHome: false,
      showAbbreviation: false
    });
  };

  /**
   * 打开窗口
   * @params {array} appArr，如：[{ app, typeName }]
   */
  handleOpenWindow = appArr => {
    const { activeApps, desktopStyle } = this.state;
    // app, typeName
    const arr = [];

    if (desktopStyle === 'DESKTOP') {
      if (
        appArr.length === 1 &&
        activeApps.find(app => app.REC_ID === appArr[0].app.REC_ID)
      ) {
        const activeApp = activeApps.find(
          app => app.REC_ID === appArr[0].app.REC_ID
        );
        if (activeApp) {
          return this.handleBottomBarAppTrigger(activeApp);
        }
      }
    } else {
      if (appArr.length === 1) {
        const activeApp = activeApps.find(
          app => app.ResID === appArr[0].app.ResID
        );
        if (activeApp) {
          return this.handleBottomBarAppTrigger(activeApp);
        }
      }
    }

    appArr.forEach(item => {
      const { app, typeName } = item;
      const resid = app.ResID || app.resid;
      const url =
        item.app.fnmoduleUrl ||
        `/fnmodule?resid=${resid}&recid=${app.REC_ID}&type=${typeName}&title=${app.title}`;
      const children = (
        <iframe src={url} frameBorder="0" className="desktop__iframe" />
      );
      const width = this.desktopMainRef.clientWidth;
      const height =
        desktopStyle === 'DESKTOP'
          ? this.desktopMainRef.clientHeight
          : this.desktopMainRef.clientHeight - 38;
      arr.push({
        children,
        title: app.title,
        activeAppOthersProps: {
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
          minHeight: 100,
          zoomStatus: 'max'
        }
      });
    });

    this.addAppToBottomBar(arr);
  };

  handleActiveWindowView = activeApp => {
    const { activeApps, zIndexActiveApps, appsSwitchStatus } = this.state;
    const newActiveApps = [...activeApps];
    const newAppsSwitchStatus = [...appsSwitchStatus];

    // app 索引
    const appIndex = newActiveApps.findIndex(
      item => item.appName === activeApp.appName
    );

    // 只能有一个 app 被激活
    newActiveApps.forEach(activeApp => (activeApp.isActive = false));
    newActiveApps[appIndex].isActive = true;

    if (!newActiveApps[appIndex].isActive) {
      newActiveApps[appIndex].isOpen = true;
      newAppsSwitchStatus[appIndex] = true;
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
      zIndexActiveApps: newZIndexActiveApps,
      appsSwitchStatus: newAppsSwitchStatus
    });
  };

  handleMinActiveApp = activeApp => {
    const { activeApps, appsSwitchStatus } = this.state;
    const newActiveApps = [...activeApps];
    const newAppsSwitchStatus = [...appsSwitchStatus];

    const appIndex = newActiveApps.findIndex(
      item => item.appName === activeApp.appName
    );
    newActiveApps[appIndex].isOpen = false;
    newAppsSwitchStatus[appIndex] = false;

    newActiveApps[appIndex].isActive = false;
    this.setState({
      activeApps: newActiveApps,
      appsSwitchStatus: newAppsSwitchStatus
    });
  };

  handleAddToDesktop = appData => {
    const { folders } = this.state;
    const { activeApps } = this.state;
    let activeApp = activeApps.find(app => app.REC_ID === appData.recid);
    if (activeApp) {
      return this.handleBottomBarAppTrigger(activeApp);
    }
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
      const resid = parseInt(app.ResID || app.resid, 10);
      const url = `/fnmodule?resid=${resid}&recid=${app.REC_ID}&type=${typeName}&title=${app.title}`;
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

      this.addAppToBottomBar([
        {
          children,
          title: app.title,
          activeAppOthersProps: {
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
            minHeight: 100,
            zoomStatus: 'max'
          }
        }
      ]);
      // 不存在于桌面，则先将 app 添加到桌面，然后再打开窗口
    } else {
      this.addAppToDesktop(appData);
    }
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
    const resid = parseInt(app.ResID || app.resid, 10);
    const url = `/fnmodule?resid=${resid}&recid=${app.REC_ID}&type=${typeName}&title=${app.title}`;
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

    this.addAppToBottomBar([
      {
        children,
        title: app.title,
        activeAppOthersProps: {
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
          minHeight: 100,
          zoomStatus: 'max'
        }
      }
    ]);
  };

  isDesktopShow = false;
  handleCloseActiveApp = activeApp => {
    const { activeApps, zIndexActiveApps, abbreviationDoms } = this.state;
    const newActiveApps = [...activeApps];
    const newabbreviationDoms = [...abbreviationDoms];

    const appIndex = newActiveApps.findIndex(
      item => item.appName === activeApp.appName
    );

    newActiveApps.splice(appIndex, 1);
    newabbreviationDoms.splice(appIndex, 1);

    // 删除 zIndexActiveApps
    const newZIndexActiveApps = [...zIndexActiveApps];
    const index = newZIndexActiveApps.findIndex(
      app => app.title === activeApp.title
    );
    newZIndexActiveApps.splice(index, 1);

    this.setState({
      activeApps: newActiveApps,
      zIndexActiveApps: newZIndexActiveApps,
      abbreviationDoms: newabbreviationDoms
    });

    if (newActiveApps.length === 0) {
      this.setState({ showAbbreviation: false });
    }
  };

  getSortRecentApps = memoizeone((apps = []) => {
    return apps.sort((a, b) => {
      return a.dateString < b.dateString ? 1 : -1;
    });
  });

  /**
   * 添加应用到底部 bar（即打开窗口）
   * @param {array} willOpenApps 将要打开的 app；如：[{ children, title, activeAppOthersProps }]
   * children:表示子组件
   * title:窗口标题
   * activeAppOthersProps:activeApp 其他的 props
   */
  addAppToBottomBar = willOpenApps => {
    // children, title, activeAppOthersProps = {}
    const {
      desktopStyle,
      activeApps,
      zIndexActiveApps,
      appsSwitchStatus,
      recentApps,
      userInfo
    } = this.state;

    const appArr = [];
    const newRecentApps = [...recentApps];
    willOpenApps.forEach(willOpenApp => {
      // 不能打开同一个窗口
      if (
        activeApps.findIndex(
          activeApp => activeApp.appName === willOpenApp.title
        ) === -1
      ) {
        appArr.push({
          ...willOpenApp.activeAppOthersProps,
          children: willOpenApp.children,
          appName: willOpenApp.title,
          isOpen: true,
          isActive: true
        });
      }
      if (desktopStyle === 'WORKBENCH') {
        // 判断是否在最近使用的功能中
        const recentApp = recentApps.find(item => {
          return willOpenApp.activeAppOthersProps.ResID == item.ResID;
        });
        const datastring = moment().format('YYYY-MM-DD HH:mm:ss');
        if (!recentApp) {
          // hasNewRecentApp = true;
          newRecentApps.unshift({
            ...willOpenApp.activeAppOthersProps,
            dateString: datastring
          });
        } else {
          recentApp.dateString = datastring;
        }
      }
    });

    let sortApps = [];
    if (desktopStyle === 'WORKBENCH') {
      if (newRecentApps.length > 20) {
        newRecentApps.length = 20;
      }
      sortApps = this.getSortRecentApps(newRecentApps);
      localStorage.setItem(
        'recentApps' + userInfo.UserCode,
        JSON.stringify(this.getSortRecentApps(sortApps))
      );
    }

    activeApps.forEach(activeApp => {
      activeApp.isActive = false;
    });
    const newZIndexActiveApps = [...zIndexActiveApps, ...appArr];

    const state = {
      activeApps: [...activeApps, ...appArr],
      zIndexActiveApps: newZIndexActiveApps,
      appsSwitchStatus: [...appsSwitchStatus, true],
      reminderListVisible: false
    };

    if (desktopStyle === 'WORKBENCH') {
      state.showHome = false;
      state.showAbbreviation = false;
      state.recentApps = sortApps;
    }

    this.setState(state);
  };

  setThemeColor = themeColor => {
    window.less
      .modifyVars({ '@primary-color': themeColor })
      .then(() => { })
      .catch(err => {
        console.log({ err });
        message.error(err.message);
      });
  };

  unloadCallback = () => {
    localStorage.removeItem('userInfo');
  };

  handleMaskShow = () => {
    window.addEventListener('unload', this.unloadCallback);
  };

  handlePassChange = e => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = async () => {
    const { password } = this.state;
    let res;
    // 普通方式登录
    const loginMode = localStorage.getItem('loginMode');
    if (loginMode === 'normal') {
      try {
        res = await defaultLogin(this.userCode, password);
      } catch (err) {
        console.error(err);
        return message.error(err.message);
      }

      // 域登录
    } else {
      const domain = domainLoginConfig.domain;
      const usernameSuffix = domainLoginConfig.usernameSuffix;
      const domainUserField = domainLoginConfig.domainUserField;
      try {
        res = await domainLogin(
          this.domainCode,
          password,
          domain,
          domainUserField
        );
      } catch (err) {
        console.error(err);
        return message.error(err.message);
      }
    }
    if (res.OpResult === 'N') {
      return message.error('密码输入错误');
    }
    localStorage.setItem('userInfo', JSON.stringify(res));
    this.lockScreenRef.current.removeLockScreen();
    this.setState({ password: '' });
    window.removeEventListener('unload', this.unloadCallback);
  };

  handleSwitchHome = homeMode => {
    const { activeApps } = this.state;
    const newActiveApps = activeApps.map(item => ({
      ...item,
      isOpen: false
    }));
    const state = {
      desktopStyle: homeMode,
      activeApps: newActiveApps,
      showHome: true
    };
    if (homeMode === 'WORKBENCH') {
      state.headerVisible = true;
    }

    this.setState(state);
    localStorage.setItem('desktopStyle', homeMode);
  };

  getDesktopLockScreenRef = node => {
    this.desktopLockScreenRef = node;
  };

  handleDragStop = (activeApp, dX, dY) => {
    activeApp.x = dX;
    activeApp.y = dY;
    activeApp.customX = dX;
    activeApp.customY = dY;
    this.forceUpdate();
  };

  getDesktopMainRef = node => {
    this.desktopMainRef = node;
  };

  handleRefresh = () => {
    console.log('refreshed...');
    this.getData();
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

  handleResizeStop = (activeApp, dW, dH) => {
    activeApp.width = activeApp.width + dW;
    activeApp.height = activeApp.height + dH;

    activeApp.customWidth = activeApp.width;
    activeApp.customHeight = activeApp.height;

    activeApp.zoomStatus = 'custom';
    this.forceUpdate();
  };

  getMinMaxSize = activeApp => {
    const { desktopStyle } = this.state;
    let minWidth, minHeight, maxWidth, maxHeight;
    if (desktopStyle === 'DESKTOP') {
      minWidth = activeApp.minWidth;
      minHeight = activeApp.minHeight;
      maxWidth = this.desktopMainRef.clientWidth;
      maxHeight = this.desktopMainRef.clientHeight;
    }

    return { minWidth, minHeight, maxWidth, maxHeight };
  };

  getXY = activeApp => {
    const { desktopStyle, headerVisible } = this.state;

    let x, y;
    if (desktopStyle === 'DESKTOP') {
      x = activeApp.x;
      y = activeApp.y;
    } else {
      x = 0;
      if (headerVisible) {
        y = 94;
      } else {
        y = 38;
      }
    }
    return { x, y };
  };

  renderWindowView = () => {
    const {
      activeApps,
      zIndexActiveApps,
      desktopStyle,
      headerVisible,
      showHome
    } = this.state;

    return activeApps.map((activeApp, index) => {
      let visible = activeApp.isOpen;
      if (desktopStyle === 'WORKBENCH') {
        visible = !showHome && activeApp.isOpen;
      }
      // 窗口的 zIndex，从 4 开始
      const zIndex =
        zIndexActiveApps.findIndex(app => app.title === activeApp.title) + 4;

      return (
        <div
          className="page-container__window-view-wrapper"
          key={activeApp.ResID}
        >
          <WindowView
            ref={node => this.getWindowViewRef(node, activeApp.title)}
            title={activeApp.appName}
            visible={visible}
            onClose={() => this.handleCloseActiveApp(activeApp)}
            onMin={() => this.handleMinActiveApp(activeApp)}
            onActive={() => this.handleActiveWindowView(activeApp)}
            zIndex={zIndex}
            width={desktopStyle === 'DESKTOP' ? activeApp.width : '100%'}
            height={
              desktopStyle === 'DESKTOP'
                ? activeApp.height
                : 'calc(100vh - 90px)'
            }
            {...this.getXY(activeApp)}
            {...this.getMinMaxSize(activeApp)}
            onResizeStop={(dW, dH) => this.handleResizeStop(activeApp, dW, dH)}
            onDragStop={(dX, dY) => this.handleDragStop(activeApp, dX, dY)}
            onMax={() => this.handleMax(activeApp)}
            onCustom={() => this.handleCustom(activeApp)}
            isActive={activeApp.isActive}
            zoomStatus={activeApp.zoomStatus}
            type={desktopStyle}
            isWorkbenchMax={!headerVisible}
          >
            {activeApp.children}
          </WindowView>
        </div>
      );
    });
  };

  handleShowAbbreviation = () => {
    if (this.state.activeApps.length) {
      this.setState({ showAbbreviation: !this.state.showAbbreviation }, () => {
        setTimeout(() => {
          if (this.state.showAbbreviation) {
            let apps = document.querySelectorAll('iframe');
            // this.toimag(apps);
            const doms = [];
            apps.forEach(item => {
              let dom = item.contentDocument.querySelector('.functions');
              doms.push(dom);
            });

            this.setState({ abbreviationDoms: doms });
          }
        }, 200);
      });
    } else {
      message.info('您还未打开任何功能窗口');
    }
  };

  handleLockScreen = () => {
    Modal.confirm({
      title: '提示',
      content: '您确定要锁定屏幕吗？',
      onOk: this.lockScreen
    });
  };

  lockScreen = () => {
    this.desktopLockScreenRef.lockScreenRef.lockScreen();
  };

  renderTopBar = activeApps => {
    const { headerVisible, showHome } = this.state;
    if (!showHome && activeApps.length) {
      return (
        <div className="page-container__top-bar">
          <div className="page-container__top-bar__app-list">
            {activeApps.map(app => {
              return (
                <div
                  className={classNames('page-container__top-bar__app', {
                    active: app.isActive
                  })}
                  key={app.title}
                  onClick={() => {
                    this.handleBottomBarAppTrigger(app);
                  }}
                >
                  <span className="page-container__top-bar__app-title">
                    {app.title}
                  </span>
                  <Icon
                    type="close"
                    onClick={e => {
                      e.stopPropagation();
                      this.handleCloseActiveApp(app);
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="page-container__top-bar__action-btn">
            {headerVisible ? (
              <Icon
                type="arrows-alt"
                onClick={() => {
                  this.setState({ headerVisible: false });
                }}
              />
            ) : (
                <Icon
                  type="shrink"
                  onClick={() => {
                    this.setState({ headerVisible: true });
                  }}
                />
              )}
          </div>
        </div>
      );
    }
  };

  renderAbbreviation = () => {
    const { showAbbreviation, activeApps, abbreviationDoms } = this.state;
    return (
      <div
        className={classNames('new-home__abbreviation', {
          visible: showAbbreviation
        })}
      >
        {activeApps.map((item, index) => {
          return (
            <AbbreviationApp
              ready={showAbbreviation}
              app={item}
              key={item.REC_ID}
              onCloseActiveApp={this.handleCloseActiveApp}
              onClick={() => {
                this.setState({ showAbbreviation: false });
                this.handleBottomBarAppTrigger(item);
              }}
              dom={abbreviationDoms[index]}
            />
          );
        })}
      </div>
    );
  };

  handleOpenDashboard = () => {
    const children = <DesktopDashboard />;
    const width = this.desktopMainRef.clientWidth;
    const height = this.desktopMainRef.clientHeight;
    this.addAppToBottomBar([
      {
        children,
        title: '仪表盘',
        activeAppOthersProps: {
          width,
          height,
          x: 0,
          y: 0,
          customWidth: 800,
          customHeight: height,
          customX: 0,
          customY: 0,
          minWidth: 330,
          minHeight: 100,
          zoomStatus: 'max'
        }
      }
    ]);
  };

  handleOpenOrgChart = () => {
    const children = <OrgChartData {...orgChartConfig} />;
    const width = this.desktopMainRef.clientWidth;
    const height = this.desktopMainRef.clientHeight;
    this.addAppToBottomBar([
      {
        children,
        title: '组织结构图',
        activeAppOthersProps: {
          width,
          height,
          x: 0,
          y: 0,
          customWidth: 800,
          customHeight: height,
          customX: 0,
          customY: 0,
          minWidth: 330,
          minHeight: 100,
          zoomStatus: 'max'
        }
      }
    ]);
  };

  handleReminderListItemClick = (url, title) => {
    const children = (
      <iframe src={url} frameBorder="0" className="desktop__iframe" />
    );
    const width = this.desktopMainRef.clientWidth;
    const height = this.desktopMainRef.clientHeight;

    this.addAppToBottomBar([
      {
        children,
        title: title,
        activeAppOthersProps: {
          width,
          height,
          x: 0,
          y: 0,
          customWidth: 800,
          customHeight: height,
          customX: 0,
          customY: 0,
          minWidth: 330,
          minHeight: 100,
          zoomStatus: 'max'
        }
      }
    ]);
  };

  handleOpenColorPicker = () => {
    const { color } = this.state;
    const children = (
      <DesktopColorPicker
        color={color}
        onColorSelect={this.handleSelectColor}
      />
    );

    const x = this.desktopMainRef.clientWidth / 2 - 115;
    const y = this.desktopMainRef.clientHeight / 2 - 190;

    this.addAppToBottomBar([
      {
        children,
        title: '更换主题色',
        activeAppOthersProps: {
          width: 230,
          height: 380,
          x,
          y,
          customWidth: 230,
          customHeight: 380,
          customX: x,
          customY: y,
          zoomStatus: 'custom'
        }
      }
    ]);
  };

  handleSelectDeskBg = selectedBg => {
    this.setState({ selectedBg: { ...selectedBg } });
    localStorage.setItem('selectedBg', JSON.stringify(selectedBg));
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

    this.addAppToBottomBar([
      {
        children,
        title: '更换背景图片',
        activeAppOthersProps: {
          width,
          height,
          x,
          y,
          customWidth: width,
          customHeight: height,
          customX: x,
          customY: y,
          zoomStatus: 'custom'
        }
      }
    ]);
  };
  handleDesktopSwitch = () => {
    const { activeApps, appsSwitchStatus } = this.state;
    const newActiveApps = [...activeApps];
    this.isDesktopShow = !this.isDesktopShow;
    // 关闭所有 app
    if (this.isDesktopShow) {
      newActiveApps.forEach(app => (app.isOpen = false));
    } else {
      // 还原所有 app 的打开关闭状态
      newActiveApps.forEach(
        (app, index) => (app.isOpen = appsSwitchStatus[index])
      );
    }
    console.log('111');
    this.setState({ activeApps: newActiveApps });
  };

  render() {
    if (!this.state.desktopStyle) {
      return null;
    }

    const user = JSON.parse(getItem('userInfo'));
    let userData;
    // 读取用户信息报错时
    // 说明没登录
    // 进入登录页面
    try {
      userData = {
        userName: user.SysUserInfo.UserName
      };
    } catch (err) {
      document.location.href = '/login';
    }

    let username;
    if (user) {
      this.userCode = user.UserCode;
      this.domainCode = user.DomainCode;
      username = user.Data;
    }

    const {
      desktopStyle,
      activeApps,
      folders,
      fixedApps,
      allFolders,
      menus,
      searchTextHeader,
      allFoldersExpandedKeys,
      headerVisible,
      userInfo,
      recentApps,
      selectedBg
    } = this.state;

    return (
      <div className="page-container">
        {desktopStyle === 'WORKBENCH' && (
          <PageHeader
            onPwlogoClick={() => {
              this.setState({ showAbbreviation: false, showHome: true });
            }}
            lockScreenRef={this.desktopLockScreenRef}
            onShowAbbreviation={this.handleShowAbbreviation}
            activeAppsNumber={activeApps.length}
            activeApps={activeApps}
            menus={menus}
            onMenuClick={this.handleAddToDesktop}
            onLockScreen={this.handleLockScreen}
            onSearchChange={this.handleSearchChange}
            searchTextHeader={searchTextHeader}
            allFoldersExpandedKeys={allFoldersExpandedKeys}
            onOpenWindow={this.handleOpenWindow}
            onCloseActiveApp={this.handleCloseActiveApp}
            visible={headerVisible}
          />
        )}
        {desktopStyle === 'WORKBENCH' && this.renderTopBar(activeApps)}
        {desktopStyle === 'WORKBENCH' && this.renderAbbreviation()}

        <PageBody>
          <Route
            path="/"
            exact
            render={props => {
              const Component = desktopStyleMap[desktopStyle];
              return (
                <Component
                  {...props}
                  activeApps={activeApps}
                  folders={folders}
                  onOpenWindow={this.handleOpenWindow}
                  onActiveWindowView={this.handleActiveWindowView}
                  onMinActiveApp={this.handleMinActiveApp}
                  onAddToDesktop={this.handleAddToDesktop}
                  onBottomBarAppTrigger={this.handleBottomBarAppTrigger}
                  onCloseActiveApp={this.handleCloseActiveApp}
                  getDesktopMainRef={this.getDesktopMainRef}
                  fixedApps={fixedApps}
                  allFolders={allFolders}
                  onRefresh={this.handleRefresh}
                  recentApps={recentApps}
                  onOpenOrgChart={this.handleOpenOrgChart}
                  onOpenDashboard={this.handleOpenDashboard}
                  onReminderClick={this.handleReminderListItemClick}
                  menus={menus}
                  onOpenColorPicker={this.handleOpenColorPicker}
                  onOpenDesktopBg={this.handleOpenDesktopBg}
                  selectedBg={selectedBg}
                  onDesktopSwitch={this.handleDesktopSwitch}
                ></Component>
              );
            }}
          />
          <Route path="/person-center" component={PersonCenter} />
          <Route path="/workbench-setting" component={WorkbenchSetting} />
          <Route path="/fnmodule" component={GetConfig} />
          <Route path="/reminder" component={Reminder} />
        </PageBody>
        {this.renderWindowView()}
        {window.location.pathname === '/' && (
          <SwitchHome
            homeMode={desktopStyle}
            onSwitch={this.handleSwitchHome}
          ></SwitchHome>
        )}
        <DesktopLockScreen
          userInfo={userInfo}
          ref={this.getDesktopLockScreenRef}
        />
      </div>
    );
  }
}
