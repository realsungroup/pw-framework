import React from 'react';
import './AuthMenu.less';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import { message, Button, Input, Form, Icon, Radio, Spin, Select } from 'antd';
import { Menu } from 'antd';
import { withRouter, Link } from 'react-router-dom'
// import http from "../../../util20/api";
import { getMenus, getSelectedKeyByUrl } from './utils';


/**
 * 导航栏
 */
class AuthMenu extends React.Component {
  constructor(props) {
    super(props);
    this.menus = getMenus();
    console.log({ props });
    this.selectedKey = getSelectedKeyByUrl(props.location.pathname)
  }

  render() {
    return (
      <div className='auth-menu'>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.selectedKey]}
          mode="horizontal"
        >
          {this.menus.map(menuItem => {
            return (
              <Menu.Item key={menuItem.title}>
                <Link to={menuItem.url}>
                  {menuItem.title}
                </Link>
              </Menu.Item>
            )
          })}
        </Menu>
      </div>
    );
  }
}

export default withRouter(AuthMenu);
