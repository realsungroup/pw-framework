import React from 'react';
import './DesktopColorPicker.less';
import PropTypes from 'prop-types';
import ColorPicker from './ColorPicker';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import { Button, message } from 'antd';
import { setThemeColor } from 'Util/api';

/**
 * 桌面改变主题色组件
 */
export default class DesktopColorPicker extends React.Component {
  static propTypes = {
    /**
     * 选择颜色的回调函数，如：(color) => void，color 表示选中的颜色
     * 默认：-
     */
    onColorSelect: PropTypes.func
  };

  static defaultProps = {};

  vars = { '@primary-color': '' };
  handleChangeComplete = (val, color) => {
    const { onColorSelect } = this.props;
    onColorSelect && onColorSelect(color);
    const rbga = color.rgb;
    this.vars = {
      '@primary-color': `rgba(${rbga.r},${rbga.g},${rbga.b},${rbga.a})`
    };
  };

  renderSelectedColor = async () => {
    const { intl } = this.props;
    this.setState({ loading: true });
    setTimeout(() => {
      window.less
        .modifyVars(this.vars)
        .then(() => {
          this.setState({ loading: false, pickerVisible: false });
          // message.success(intl.messages['RightBtns.success']);
          message.success('修改主题色成功');
        })
        .catch(err => {
          this.setState({ loading: false });
          console.error(err);
          return message.error(err.message);
        });
    }, 200);
    let res;
    try {
      res = await setThemeColor(this.vars['@primary-color']);
    } catch (err) {
      return message.error(err.message);
    }
    this.modUserInfoThemColor(this.vars['@primary-color']);
  };

  modUserInfoThemColor = color => {
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        userInfo = JSON.parse(userInfo);
      } catch (err) {
        return;
      }
      userInfo.UserInfo.EMP_Color = color;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  };

  render() {
    const { color } = this.props;
    return (
      <React.Fragment>
        <ColorPicker
          color={color}
          onChangeComplete={this.handleChangeComplete}
        />
        <div className="desktop-color-picker__btns">
          <Button
            size="small"
            className="color-picker-btn"
            onClick={this.renderSelectedColor}
          >
            <FM id="RightBtns.OK" defaultMessage="确定" />
          </Button>
        </div>
      </React.Fragment>
    );
  }
}
