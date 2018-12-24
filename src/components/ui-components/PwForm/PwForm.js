import React from 'react';
import PropTypes from 'prop-types';

import './PwForm.less';

import { Table, Button, Input, Pagination, Spin } from 'antd';

/**
 * PwForm
 */
export default class PwForm extends React.Component {
  static propTypes = {
    /**
     * 模式：'edit' 编辑模式 | 'view' 查看模式
     * 默认：'view'
     */
    mode: PropTypes.oneOf(['edit', 'view'])
  };

  static defaultProps = {
    mode: 'view'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // const {} = this.props;

    return <div>pwform</div>;
  }
}
