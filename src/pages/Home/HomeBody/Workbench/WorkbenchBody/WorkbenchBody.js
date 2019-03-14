import React from 'react';
import Application from '../../../../components/Application';
import { Link } from 'react-router-dom';
import './WorkbenchBody.less';
import { Spin, Drawer, Menu } from 'antd';
import Swiper from 'swiper/dist/js/swiper.js';
import 'swiper/dist/css/swiper.css';
import http, { makeCancelable } from 'Util20/api';
import { connect } from 'react-redux';

const { openFuncInSelfResids } = window.pwConfig[process.env.NODE_ENV];
const SubMenu = Menu.SubMenu;

const getTarget = resid => {
  // 在新 tab 中打开功能页面
  if (openFuncInSelfResids.indexOf(resid) === -1) {
    return { target: '_blank' };
  }
  return {};
};

const SingApp = ({ app, type }) => {
  return (
    <Link
      to={{
        pathname: `/fnmodule`,
        search: `?resid=${app.ResID || app.resid}&recid=${
          app.REC_ID
        }&type=${type}&title=${app.title}`
      }}
      {...getTarget(parseInt(app.ResID || app.resid, 10))}
    >
      <div className="home-workbench-app-wrapper">
        <Application appData={app} iconStyle={{ fontSize: 48 }} />
      </div>
    </Link>
  );
};

class WorkbenchBody extends React.PureComponent {
  async componentDidMount() {
    this.setState({
      drawerVisible: false
    });
    // await this.loadApps();
    let initialSlide = localStorage.getItem('initialSlide');

    initialSlide =
      typeof initialSlide !== 'string' ? 0 : parseInt(initialSlide, 10);

    this.mySwiper = new Swiper('.home-workbench-body', {
      initialSlide,
      direction: 'vertical',
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      mousewheel: true,
      observer: true,
      observeParents: true,
      on: {
        // 当使用 initialSlide 时，初始化时会调用 slideChangeTransitionEnd 回调函数
        // 而且调用完一次之后，会取消该回调函数的绑定
        // 所以这里需要使用 transitionEnd 作为跳转的回调函数
        transitionEnd: function() {
          // https://github.com/nolimits4web/swiper/issues/1716
          if (this.isEnd) {
            // 主要是获取第几页
            // 所以可以通过获取分页器的子元素的数量来确定最后一页的索引
            // 从而赋值给 this.activeIndex
            if (!this.pagination.bullets) {
              return;
            }
            const activeIndex = this.pagination.bullets.length - 1;
            localStorage.setItem('initialSlide', activeIndex);
          } else {
            localStorage.setItem('initialSlide', this.activeIndex);
          }
        }
      }
    });
  }

  componentWillUnmount() {
    this.p1 && this.p1.cancel();
  }

  handleAppClick = (app, type) => {
    const resid = parseInt(app.ResId || app.resid, 10);
    const target = getTarget(resid).target || 'self';
    window.open(
      `/fnmodule?resid=${resid}&recid=${app.REC_ID}&type=${type}&title=${
        app.title
      }`,
      target
    );
  };

  loadApps = async () => {
    this.p1 = makeCancelable(http().getUserDesktop());
    try {
      const appsRes = await this.p1.promise;
      const apps = this.dealApps([
        ...appsRes.data,
        ...(appsRes.userdefined || [])
      ]);
      if (!appsRes.error) {
        this.setState({
          loading: false,
          apps
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  dealApps = apps => {
    apps.forEach(app => (app.ResID = app.ResID || app.resid));
    this.objArrUnique(apps, 'ResID');
    let arr = [];
    apps.forEach(app => {
      const appIndex = arr.findIndex(
        item => item.typeName === app.BusinessNode
      );
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

  objArrUnique = (arr, key) => {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i][key] === arr[j][key]) {
          arr.splice(j, 1);
        }
      }
    }
  };

  handleSwitchClick = () => {
    this.setState({ drawerVisible: !this.state.drawerVisible });
  };

  render() {
    const { PageHeaderReducers } = this.props;
    const { apps } = PageHeaderReducers;

    return (
      <Spin spinning={false}>
        <div className="swiper-container home-workbench-body">
          <div className="swiper-wrapper">
            {apps.map(item => {
              return (
                <div
                  key={item.typeName}
                  className="work-bench-body-category swiper-slide"
                >
                  <div className="work-bench-body-category__header">
                    <span className="work-bench-body-category__prefix" />
                    <span className="work-bench-body-category__title">
                      {item.typeName}
                    </span>
                  </div>
                  <div className="work-bench-body-category__apps">
                    {item.apps.map(app => (
                      <SingApp
                        app={app}
                        key={app.ResID || app.resid}
                        type={item.typeName}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="swiper-pagination" />
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps)(WorkbenchBody);
