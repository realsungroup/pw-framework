import React from 'react';
import { Button, message } from 'antd';
import { biLogin } from 'Util20/bi';
import { getAppConfig } from 'Util20/appConfig';
import { FormattedMessage as FM } from 'react-intl';
import './BIButton.less';

const biConfig = getAppConfig('biConfig');

export default class BIButton extends React.Component {
  state = {
    loading: false,
  };

  handleOpenBI = async () => {
    this.setState({ loading: true });
    try {
      await biLogin({ isGetUserNameAndPassword: true });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(`bi 系统登录失败:${err.message}`);
    }
    this.setState({ loading: false });
    window.open(biConfig.homeURL);
  };

  render() {
    const { style, className } = this.props;
    const { loading } = this.state;
    return (
      <Button
        size='small'
        style={style}
        className={className}
        onClick={this.handleOpenBI}
        loading={loading}
      >
        <FM id="BIButton.biSystem" defaultMessage="报表中心"></FM>
      </Button>
    );
  }
}
