import React from 'react';
import './DesktopLockScreen.less';
import PropTypes from 'prop-types';
import LockScreen from './LockScreen';

/**
 * 桌面锁屏组件
 */
export default class DesktopLockScreen extends React.Component {
  static propTypes = {
    /**
     * 用户信息
     */
    userInfo: PropTypes.object
  };

  static defaultProps = {};

  render() {
    const { color } = this.props;
    return 
  }
}
