import React from 'react';
import PropTypes from 'prop-types';
import { Input, message } from 'antd';
import './LzMenuForms.less';
import LzMenuContainer from '../LzMenuContainer';
import { getAllAppLinks } from 'Util/api';

/**
 * 左侧主表右侧多表单组件
 */
export default class LzMenuForms extends React.Component {
  static propTypes = {
    /**
     * 获取导航列表的 resid
     * 默认：-
     */
    navListResid: PropTypes.number.isRequired
  };
  static defaultProps = {};
  constructor(props) {
    super(props);

    this.state = {
      menuList: [] // 菜单列表
    };
  }

  componentDidMount() {
    this.getNavList();
  }

  getNavList = async () => {
    const { navListResid } = this.props;
    let res;
    try {
      res = await getAllAppLinks(navListResid);
    } catch (err) {
      return message.error(err.message);
    }
    console.log({ navListRes: res });
    res.data.length && this.dealNavList(res.data[0]);
  };

  dealNavList = navData => {
    const resid = navData.resid;
    const apps = navData.AppLinks;
    const firstNavs = apps.filter(app => app.RES_PID === resid);
    const secondNavs = apps.filter(app => app.RES_PID !== resid);
    firstNavs.forEach(app => {
      secondNavs.forEach(secondApp => {
        if (app.RES_ID === secondApp.RES_PID) {
          if (!app.subMenuList) {
            app.subMenuList = [];
          }
          app.subMenuList.push(secondApp);
        }
      });
    });
    this.setState({ menuList: firstNavs });
  };

  render() {
    const { menuList } = this.state;
    return <LzMenuContainer {...this.props} menuList={menuList} />;
  }
}
