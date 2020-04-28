import React from 'react';
import './NewHome.less';
import { connect } from 'react-redux';
import classNames from 'classnames';
import folderPng from './assets/folder.png';
import memoizeone from 'memoize-one';
import { Icon, message, Modal } from 'antd';
import WindowView from './WindowView';
import SearchBox from '../components/SearchBox';
import UserInfo from '../components/UserInfo';
import PageHeader from '../components/PageHeader1';
import { getItem, setItem } from '../../util/localCache';
import http from 'Util20/api';
import qs from 'qs';
import { cloneDeep } from 'lodash';
import FixedApps from './FixedApps';
import WaitingHandle from './WaitingHandle';
import RecentApps from './RecentApps';
import Spin from './Spin';
import DesktopLockScreen from '../Desktop/DesktopLockScreen';
import { delay } from 'lodash';

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
// const dealApps = memoizeone(modules => {
//   modules.forEach(module => {
//     module.apps.forEach(app => {
//       if (!module.categoricalApps) {
//         module.categoricalApps = new Map();
//       }
//       let categoryapps = module.categoricalApps.get(app.PwCategory || '未分类');
//       if (categoryapps) {
//         categoryapps.push(app);
//         module.categoricalApps.set(app.PwCategory || '未分类', categoryapps);
//       } else {
//         module.categoricalApps.set(app.PwCategory || '未分类', [app]);
//       }
//     });
//   });
//   return modules;
// });
class Home extends React.Component {
  constructor(props) {
    super(props);
    const userInfo = JSON.parse(getItem('userInfo'));
    this.state = {
      selectedModule: '',
      recentApps: [],
      allApps: [],
      folders: [],
      waitingHandleData: [],
      activeApps: [],
      showHome: true,
      userData: {},
      fixedApps: [],
      allFolders: [],
      menus: [],
      userInfo,
      allFoldersExpandedKeys: [],
      zIndexActiveApps: [], // 被激活的 app 的层级
      appsSwitchStatus: [], // 激活的 app 开关状态数组（其值一一对应 activeApps 数组对象中的 isOpen 属性）
      waitingHandleFetching: false,
      appDataFetching: false,
      showAbbreviation: false,
      searchTextHeader: ''
    };
  }
  componentDidMount() {
    const user = JSON.parse(getItem('userInfo'));
    let userData;
    // 读取用户信息报错时
    // 说明没登录
    // 进入登录页面
    try {
      userData = {
        userName: user.SysUserInfo.UserName
      };
      this.setState({ userData });
    } catch (err) {
      document.location.href = '/login';
    }
    let recentApps = JSON.parse(getItem('recentApps'));
    if (recentApps && Array.isArray(recentApps)) {
      this.setState({ recentApps });
    } else {
      setItem('recentApps', JSON.stringify([]));
      this.setState({ recentApps: [] });
    }
    this.getData();
    this.fetchWaitingHandle();
  }

  fetchWaitingHandle = async () => {
    try {
      this.setState({ waitingHandleFetching: true });
      const res = await http().getReminderData();

      this.setState({ waitingHandleData: res.data });
    } catch (error) {
      console.error(error);
      return message.error(error.message);
    }
    this.setState({ waitingHandleFetching: false });
  };

  getData = async (isFirst = false) => {
    this.setState({ appDataFetching: true });
    const res = await this.getAndSetUserDesktop(isFirst);
    await this.getAndSetAllAppLinks(res.userdefined);
    this.setState({ appDataFetching: false });
  };

  getAndSetUserDesktop = async (isFirst = false) => {
    let res;
    try {
      res = await http().getUserDesktop();
    } catch (err) {
      this.setState({ appDataFetching: false });
      console.error(err);
      return message.error(err.message);
    }

    // 桌面的文件夹
    const folders = dealApps([...res.data, ...(res.userdefined || [])]);
    this.setState(
      { folders, allApps: res.data, fixedApps: res.userdefined },
      () => {
        const appArr = [];

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
        appArr.length && this.handleOpenWindow(appArr);
      }
    );
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
      this.setState({ appDataFetching: false });
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

  handleSelectModule = app => () => {
    this.setState({ selectedModule: app });
  };

  handleShowAbbreviation = () => {
    if (this.state.activeApps.length) {
      this.setState({ showAbbreviation: true });
    } else {
      message.info('您还未打开任何功能窗口');
    }
  };

  getDesktopMainRef = node => {
    this.desktopMainRef = node;
  };
  getWindowViewRef = (node, title) => {
    this[`windowViewRef${title}`] = node;
  };
  handleBottomBarAppTrigger = activeApp => {
    const { activeApps, zIndexActiveApps, appsSwitchStatus } = this.state;
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
      // isOpen = true;
    }
    newActiveApps[appIndex].isOpen = true;
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
      showHome: false
    });
  };
  /**
   * 打开窗口
   * @params {array} appArr，如：[{ app, typeName }]
   */
  handleOpenWindow = appArr => {
    const { activeApps } = this.state;
    // app, typeName
    const arr = [];
    if (appArr.length === 1) {
      const activeApp = activeApps.find(
        app =>
          app.ResID === appArr[0].app.ResID || app.resid === appArr[0].app.resid
      );
      if (activeApp) {
        return this.handleBottomBarAppTrigger(activeApp);
      }
    }
    appArr.forEach(item => {
      const { app, typeName } = item;
      const resid = app.ResID || app.resid;
      const url =
        item.app.fnmoduleUrl ||
        `/fnmodule?resid=${resid}&recid=${app.REC_ID}&type=${typeName}&title=${app.title}`;
      const children = (
        <iframe src={url} frameBorder="0" className="new-home__iframe" />
      );
      const width = this.desktopMainRef.clientWidth;
      const height = this.desktopMainRef.clientHeight - 38;

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
      activeApps,
      zIndexActiveApps,
      appsSwitchStatus,
      recentApps
    } = this.state;
    const appArr = [];
    const newRecentApps = [...recentApps];
    let hasNewRecentApp = false;
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
      // 判断是否在最近使用的功能中
      const recentApp = recentApps.find(item => {
        return willOpenApp.activeAppOthersProps.ResID == item.ResID;
      });
      if (!recentApp) {
        hasNewRecentApp = true;
        newRecentApps.unshift(willOpenApp.activeAppOthersProps);
      }
    });
    if (hasNewRecentApp) {
      setItem('recentApps', JSON.stringify(newRecentApps));
      this.setState({ recentApps: newRecentApps });
    }

    activeApps.forEach(activeApp => {
      activeApp.isActive = false;
    });
    const newZIndexActiveApps = [...zIndexActiveApps, ...appArr];

    this.setState({
      activeApps: [...activeApps, ...appArr],
      zIndexActiveApps: newZIndexActiveApps,
      appsSwitchStatus: [...appsSwitchStatus, true],
      showHome: false
    });
  };
  handleAddToDesktop = appData => {
    const { folders } = this.state;
    const { activeApps } = this.state;
    let activeApp = activeApps.find(app => app.ResID == appData.RES_ID);
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
        <iframe src={url} frameBorder="0" className="new-home__iframe" />
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
    if (newActiveApps.length === 0) {
      this.setState({ showAbbreviation: false });
    }
  };
  handleRemindItemClick = (resid, url) => {
    const app = this.state.allApps.find(item => {
      return item.ResID == resid;
    });
    if (app) {
      this.handleOpenWindow([{ app, typeName: app.BusinessNode }]);
    } else {
      window.open(url);
    }
  };
  getDesktopLockScreenRef = node => {
    this.desktopLockScreenRef = node;
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

  handleSearchChange = e => {
    this.setState({ searchTextHeader: e.target.value });
    delay(this.filterMenus, 200);
  };
  renderWindowView = () => {
    const { activeApps, zIndexActiveApps, showHome } = this.state;
    return activeApps.map((activeApp, index) => {
      const visible = !showHome && activeApp.isOpen;
      // 窗口的 zIndex，从 4 开始
      const zIndex =
        zIndexActiveApps.findIndex(app => app.title === activeApp.title) + 4;

      return (
        <WindowView
          ref={node => this.getWindowViewRef(node, activeApp.title)}
          key={activeApp.appName + index}
          title={activeApp.appName}
          visible={visible}
          // onClose={() => this.handleCloseActiveApp(activeApp)}
          // onMin={() => this.handleMinActiveApp(activeApp)}
          // onActive={() => this.handleActiveWindowView(activeApp)}
          zIndex={zIndex}
          width={activeApp.width}
          height={activeApp.height}
          x={activeApp.x}
          y={activeApp.y}
          minWidth={activeApp.minWidth}
          minHeight={activeApp.minHeight}
          // onResizeStop={(dW, dH) => this.handleResizeStop(activeApp, dW, dH)}
          // onDragStop={(dX, dY) => this.handleDragStop(activeApp, dX, dY)}
          // onMax={() => this.handleMax(activeApp)}
          // onCustom={() => this.handleCustom(activeApp)}
          isActive={activeApp.isActive}
          zoomStatus={activeApp.zoomStatus}
        >
          {activeApp.children}
        </WindowView>
      );
    });
  };

  renderHome = () => {
    const {
      folders,
      selectedModule,
      fixedApps,
      allFolders,
      allFoldersExpandedKeys,
      waitingHandleFetching,
      waitingHandleData,
      recentApps,
      appDataFetching
    } = this.state;
    return (
      <div className="new-home-wrapper" ref={this.getDesktopMainRef}>
        <aside className="new-home__recently">
          <RecentApps
            apps={recentApps}
            onRefresh={this.getData}
            onClick={this.handleOpenWindow}
          />
        </aside>
        <main className="new-home__main">
          <div className="new-home__center">
            <div className="new-home__fixed-functions">
              {appDataFetching && <Spin />}

              <FixedApps
                apps={fixedApps}
                fnTreeData={allFolders}
                expandedKeys={allFoldersExpandedKeys}
                onRefresh={this.getData}
                onClick={this.handleOpenWindow}
              />
            </div>
            <div className="new-home__waiting-handle">
              <div className="new-home-title">待办事项</div>
              <div className="new-home__waiting-handle__content">
                {waitingHandleFetching ? (
                  <Spin />
                ) : (
                  <WaitingHandle
                    data={waitingHandleData}
                    onItemClick={this.handleRemindItemClick}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="new-home__functions">
            {appDataFetching && <Spin />}
            {folders.map((module, index) => {
              const categories = [...module.categoricalApps.entries()];
              let left = (index + 1) % 3;
              switch (left) {
                case 1:
                  left = '0%';
                  break;
                case 2:
                  left = '-100%';
                  break;
                case 0:
                  left = '-200%';
                  break;
                default:
                  left = '0%';
              }
              return (
                <div className="new-home__module-wrapper" key={module.typeName}>
                  <div
                    className={classNames('new-home__module', {
                      selected: selectedModule.typeName === module.typeName
                    })}
                    onClick={this.handleSelectModule(module)}
                  >
                    <img
                      alt={module.typeName}
                      className="new-home__module-icon"
                      src={module.apps.length && module.apps[0].BusinessIconUrl}
                    />
                    <span className="new-home__module-name">
                      {module.typeName}
                    </span>
                  </div>
                  <div
                    className={classNames('new-home__module-apps', {
                      show: selectedModule.typeName === module.typeName
                    })}
                    style={{
                      position: 'relative',
                      left
                    }}
                  >
                    {categories &&
                      categories.map((category, index) => {
                        return (
                          <div className="new-home__module-category">
                            <div className="new-home__module-category-title">
                              {category[0]}
                            </div>
                            <div className="new-home__module-category-apps">
                              {category[1].map(app => {
                                return (
                                  <div
                                    className="new-home__module-category-app"
                                    onClick={() =>
                                      this.handleOpenWindow([
                                        { app, typeName: module.typeName }
                                      ])
                                    }
                                  >
                                    <div className="desktop__folder-category-app-icon">
                                      {app.appIconUrl ? (
                                        <Icon
                                          type="mail"
                                          style={{
                                            color: '#1890FF',
                                            fontSize: 20,
                                            marginRight: 8
                                          }}
                                        />
                                      ) : (
                                        <i
                                          className={`iconfont icon-${app.DeskiconCls ||
                                            'wdkq_icon'}`}
                                          style={{ fontSize: 48 }}
                                        />
                                      )}
                                    </div>
                                    <span className="new-home__module-category-app-title">
                                      {app.title}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  };
  renderTopBar = activeApps => {
    return (
      <div className="new-home__top-bar">
        {activeApps.map(app => {
          return (
            <div
              className={classNames('new-home__top-bar__app', {
                active: app.isActive
              })}
              key={app.title}
              onClick={() => this.handleBottomBarAppTrigger(app)}
            >
              <span>{app.title}</span>
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
    );
  };
  render() {
    const {
      activeApps,
      showHome,
      userInfo,
      menus,
      searchTextHeader,
      allFoldersExpandedKeys
    } = this.state;

    // const userInfo = (
    //   <UserInfo userName={userData.userName} userRank={userData.userRank} />
    // );
    return (
      <div className="new-home">
        <PageHeader
          // title={userInfo}
          // reminderNum={reminderNum}
          onPwlogoClick={() =>
            this.setState({ showHome: true, showAbbreviation: false })
          }
          lockScreenRef={this.desktopLockScreenRef}
          onShowAbbreviation={this.handleShowAbbreviation}
          activeAppsNumber={activeApps.length}
          menus={menus}
          onMenuClick={this.handleAddToDesktop}
          onLockScreen={this.handleLockScreen}
          onSearchChange={this.handleSearchChange}
          searchTextHeader={searchTextHeader}
          allFoldersExpandedKeys={allFoldersExpandedKeys}
        />
        {!showHome && activeApps.length ? this.renderTopBar(activeApps) : null}
        {this.renderHome()}
        {this.renderWindowView()}
        {this.renderAbbreviation()}
        <DesktopLockScreen
          userInfo={userInfo}
          ref={this.getDesktopLockScreenRef}
        />
      </div>
    );
  }

  renderAbbreviation = () => {
    const { showAbbreviation, activeApps } = this.state;
    // let apps = document.querySelectorAll('.window-view');
    return (
      <div
        className={classNames('new-home__abbreviation', {
          visible: showAbbreviation
        })}
      >
        {activeApps.map((item, index) => {
          return (
            <div className="new-home__abbreviation-app">
              <header className="new-home__abbreviation-app__header">
                <div className="new-home__abbreviation-app__header__title">
                  {item.appIconUrl ? (
                    <Icon
                      type="mail"
                      style={{
                        color: '#1890FF',
                        fontSize: 20,
                        marginRight: 8
                      }}
                    />
                  ) : (
                    <i
                      className={`iconfont icon-${item.DeskiconCls ||
                        'wdkq_icon'}`}
                      style={{ fontSize: 48 }}
                    />
                  )}
                  {item.appName}
                </div>
                <div>
                  <Icon
                    type="close"
                    className="abbreviation-app__header__close-btn"
                    onClick={() => {
                      this.handleCloseActiveApp(item);
                    }}
                  />
                </div>
              </header>
              <div
                className="new-home__abbreviation-app__body"
                onClick={() => {
                  this.setState({ showAbbreviation: false });
                  this.handleBottomBarAppTrigger(item);
                }}
              ></div>
            </div>
          );
        })}
      </div>
    );
  };
}

export default Home;
