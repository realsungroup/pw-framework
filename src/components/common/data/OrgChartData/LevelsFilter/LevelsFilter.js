import React from 'react';
import PropTypes from 'prop-types';
import './OrgChartLevels.less';
import { ResizableBox } from 'react-resizable';
import { Radio } from 'antd';
import Draggable from 'react-draggable';
import IconWithTooltip from 'Common/ui/IconWithTooltip';
import classNames from 'classnames';
import LevelSection from './LevelSection';

const RadioGroup = Radio.Group;
const prefix = 'org-chart-levels';
const Fragment = React.Fragment;

/**
 * 层级筛选组件
 */
export default class LevelsFilter extends React.Component {
  static propTypes = {
    /**
     * 层数
     * 默认：16
     */
    level: PropTypes.number,

    /**
     * 
     */
    start: PropTypes.number,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className={className}>
        <LevelSection />
      </div>
    );
  }
}
