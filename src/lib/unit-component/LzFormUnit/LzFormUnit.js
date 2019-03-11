import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';

import { LzForm } from '../../../loadableComponents';
import { getFormData } from '../../util/api';
import './LzFormUnit.less';

/**
 * LzFormUnit 组件
 */
export default class LzFormUnit extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { formName, resid } = this.props;
    let res;
    try {
      res = await getFormData(resid, formName);
    } catch (err) {
      return message.success(err.message);
    }
  };

  render() {
    return (
      <div>
        <LzForm {...this.props} />
      </div>
    );
  }
}
