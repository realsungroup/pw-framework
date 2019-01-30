import React from 'react';
import PropTypes from 'prop-types';
import './LevelSection.less';
import { Radio } from 'antd';
import classNames from 'classnames';
import { FNLIST, TEMPLATES, ORIENTATIONS } from './constants';
const prefix = 'org-chart-tools';
const Fragment = React.Fragment;

/**
 * 层级中的某一层组件（显示某一层的高度以及该层的名称）
 */
export default class LevelSection extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return <div className="level-section">level-section</div>;
  }
}
