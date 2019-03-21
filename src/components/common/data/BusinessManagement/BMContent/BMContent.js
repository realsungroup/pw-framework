import React from 'react';
import classNames from 'classnames';
import './BMContent.less';
import { propTypes, defaultProps } from './propTypes';
import { message, Spin } from 'antd';
import http, { makeCancelable } from 'Util20/api';
import { table2Tree } from 'Util20/util';

/**
 * 业务管理内容
 */
class BMContent extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  componentWillUnmount = () => {};

  getData = async () => {
    this.setState({ loading: true });

    this.setState({ loading: false });
  };

  handleSelectedMenuItem = menuItem => {
    this.setState({ openedTabs: [...this.state.opendedTabs, menuItem] });
  };

  render() {
    const { loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div className="bm-content" />
      </Spin>
    );
  }
}

export default BMContent;
