import React from 'react';
import classNames from 'classnames';
import folderPng from './assets/folder.png';
import memoizeone from 'memoize-one';
import { Icon, message } from 'antd';
import { getItem, setItem } from '../../util/localCache';
import http from 'Util20/api';
import qs from 'qs';
import { cloneDeep } from 'lodash';
import FixedApps from './FixedApps';
import WaitingHandle from './WaitingHandle';
import RecentApps from './RecentApps';
import Spin from 'Common/ui/Spin';
import Img from 'Common/ui/Img';
import html2canvas from 'html2canvas';
import WorkOvertime from './Kanbans/WorkOvertime';
import './NewHome.less';

const {
  businessOptionalResIds,
  reminderDataConfig,
  themeColor,
  waitingHandleBaseURL
} = window.pwConfig[process.env.NODE_ENV];

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

const objArrUnique = (arr, key) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i][key] === arr[j][key]) {
        arr.splice(j, 1);
      }
    }
  }
};
const dealApps = async (apps, arr) => {
  apps.forEach(app => (app.ResID = app.ResID || app.resid));
  objArrUnique(apps, 'ResID');
  // let arr = [];
  for (let ind = 0; ind < apps.length; ind++) {
    const app = apps[ind];
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
  }
  // return arr;
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    const userInfo = JSON.parse(getItem('userInfo'));
    const color = userInfo.UserInfo.EMP_Color || themeColor['@primary-color'];
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
      headerVisible: true,
      searchTextHeader: '',
      abbreviations: [],
      abbreviationDoms: [],
      color,
      forbidChange: false
    };
  }
  componentDidMount() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串

    //判断是否Edge浏览器
    if (userAgent.indexOf('Edge') > -1) {
      this.setState({ forbidChange: true });
    }
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      this.setState({ forbidChange: true });
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
      this.setState({ userData });
    } catch (err) {
      document.location.href = '/login';
    }
  }

  setRecentApps = async () => {
    let recentApps = JSON.parse(getItem('recentApps'));
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
      setItem('recentApps', JSON.stringify([]));
      this.setState({ recentApps: [] });
    }
  };

  getSortRecentApps = memoizeone((apps = []) => {
    return apps.sort((a, b) => {
      return a.dateString < b.dateString ? 1 : -1;
    });
  });

  getData = async (isFirst = false) => {
    this.setState({ appDataFetching: true });
    const res = await this.getAndSetUserDesktop(isFirst);
    await this.getAndSetAllAppLinks(res.userdefined);
    this.setState({ appDataFetching: false }, async () => {
      const { folders } = this.state;
      const bigpArr = [];
      const smallpArr = [];
      folders.forEach((folder, index) => {
        bigpArr.push(validateImage(folder.url));
        folder.apps.forEach(app => {
          if (!smallpArr[index]) {
            smallpArr[index] = [];
          }
          smallpArr[index].push(validateImage(app.appIconUrl));
        });
      });
      //判断大图标是否有效
      const bigRes = await Promise.all(bigpArr).then();
      bigRes.forEach((res, index) => {
        if (!res) {
          folders[index].url = folderPng;
        }
      });
      // 判断小图标是否有效
      for (let index = 0; index < smallpArr.length; index++) {
        const resArr = await Promise.all(smallpArr[index]).then();
        resArr.forEach((res, i) => {
          folders[index].apps[i].appIconUrlValidate = res;
        });
      }

      this.setState({ folders: [...folders] });
    });
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
    const folders = [];
    const apps = res.data.filter(app => {
      // return app.isPersonCenter === 'Y';
      return true;
    });
    const userdefined = res.userdefined.filter(app => {
      // return app.isPersonCenter === 'Y';
      return true;
    });
    await dealApps([...apps, ...(userdefined || [])], folders);
    this.setState(
      {
        folders,
        allApps: res.data,
        fixedApps: res.userdefined,
        appDataFetching: false
      },
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
        appArr.length && this.props.onOpenWindow(appArr);
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

  getDesktopMainRef = node => {
    this.desktopMainRef = node;
  };

  handleRemindItemClick = (resid, url) => {
    const { onOpenWindow } = this.props;
    console.log(this.props, resid)
    const app = this.state.allApps.find(item => {
      return item.ResID == resid;
    });
    if (app) {
      onOpenWindow([{ app, typeName: app.BusinessNode }]);
    } else {
      window.open(waitingHandleBaseURL + url);
    }
  };

  handleImageError = e => {
    e.target.src = folderPng;
  };

  filterPersonApps = memoizeone((folders = []) => {
    const newFolders = JSON.parse(JSON.stringify(folders));
    newFolders.forEach(folder => {
      folder.apps = folder.apps.filter(app => {
        return app.isPersonCenter === 'Y';
      });
      folder.categoricalApps = new Map();
      folder.apps.forEach(app => {
        let categoryapps = folder.categoricalApps.get(
          app.PwCategory || '未分类'
        );
        if (categoryapps) {
          categoryapps.push(app);
          folder.categoricalApps.set(app.PwCategory || '未分类', categoryapps);
        } else {
          folder.categoricalApps.set(app.PwCategory || '未分类', [app]);
        }
      });
    });
    return newFolders.filter(folder => {
      return folder.categoricalApps.size;
    });
  });
  renderHome = () => {
    const {
      selectedModule,
      allFoldersExpandedKeys,
    } = this.state;
    const {
      fixedApps,
      allFolders,
      onOpenWindow,
      getDesktopMainRef,
      onRefresh,
      loading,
      recentApps,
      waitingHandleFetching,
      waitingHandleData,
      // folders
    } = this.props;
    const folders = this.filterPersonApps([...this.props.folders]);
    return (
      <div className="new-home-wrapper" ref={getDesktopMainRef}>
        <aside className="new-home__recently">
          <RecentApps
            apps={recentApps}
            onRefresh={onRefresh}
            onClick={onOpenWindow}
          />
        </aside>
        <main className="new-home__main">
          <div className="new-home__center">
            <div className="new-home__kanban">
              <div className="new-home-title">下属加班汇总</div>
              <div className="new-home__kanban__body">
                <WorkOvertime onClick={onOpenWindow} />
              </div>
            </div>
            <div className="new-home__fixed-functions">
              {loading && <Spin />}
              <FixedApps
                apps={fixedApps}
                fnTreeData={allFolders}
                expandedKeys={allFoldersExpandedKeys}
                onRefresh={onRefresh}
                onClick={onOpenWindow}
                loading={loading}
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
                      reminderDataConfig={reminderDataConfig}
                    />
                  )}
              </div>
            </div>
          </div>
          <div className="new-home__functions">
            {loading && <Spin />}
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
                    <Img
                      className="new-home__module-icon"
                      src={module.url}
                      alt={module.typeName}
                      defaultImg={folderPng}
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
                                      onOpenWindow([
                                        { app, typeName: module.typeName }
                                      ])
                                    }
                                    title={app.title}
                                  >
                                    {this.state.forbidChange ? (
                                      <Img
                                        src={app.appIconUrl}
                                        className="new-home-app-icon"
                                        alt={app.appIconUrl}
                                        defaultImg={folderPng}
                                      />
                                    ) : (
                                        <div className="overlay">
                                          <div className="overlay-inner"></div>
                                          <Img
                                            src={app.appIconUrl}
                                            className="new-home-app-icon"
                                            alt={app.appIconUrl}
                                            defaultImg={folderPng}
                                          />
                                        </div>
                                      )}

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

  render() {
    return <div className="new-home">{this.renderHome()}</div>;
  }

  toimag = async iframes => {
    iframes.forEach((item, index) => {
      let dom = item.contentDocument.querySelector('.functions');
      const promise = new Promise((resolve, reject) => {
        const { showAbbreviation } = this.state;
        if (showAbbreviation) {
          html2canvas(dom)
            .then(canvas => {
              const imgDataURL = canvas.toDataURL('image/png', 1.0);
              resolve({ imgDataURL: imgDataURL, index });
            })
            .catch(error => {
              reject(error);
            });
        } else {
          reject(new Error('取消生成缩略图'));
        }
      });
      promise
        .then(val => {
          const { abbreviations, showAbbreviation } = this.state;
          if (showAbbreviation) {
            abbreviations[val.index] = val.imgDataURL;
            this.setState({ abbreviations });
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  };
}

export default Home;
