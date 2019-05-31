import React, { Component } from 'react';
import './JobSeeker.less';
import { Menu ,Icon} from 'antd';
export default class IdLindex extends Component {
  componentDidMount = () => {};
  state = {};

  render() {
    return (
      <div className="job-seeker">
        <div className='job-seeker__nav'>
        <Menu
          style={{ width: 256,minHeight:60 }}
          defaultSelectedKeys={['1']}
        >
          <Menu.Item key="1">
            <Icon type="mail" />
            个人资料
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="calendar" />
            教育背景
          </Menu.Item>                 
        </Menu>
        </div>
        
      </div>
    );
  }
}
