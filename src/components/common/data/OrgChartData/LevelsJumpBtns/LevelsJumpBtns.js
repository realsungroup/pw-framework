import React from 'react';
import PropTypes from 'prop-types';
import './LevelsJumpBtns.less';
import { Radio } from 'antd';
import IconWithTooltip from 'Common/ui/IconWithTooltip';
import classNames from 'classnames';

/**
 * 层级跳转按钮
 */
export default class LevelsJumpBtns extends React.Component {
  static propTypes = {
    /**
     * 图表所用模板
     */
    template: PropTypes.string,

    /**
     * 点击上一层的回调
     */
    onLevelUp: PropTypes.func,

    /**
     * 点击下一层的回调
     */
    onLevelDown: PropTypes.func
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  handleLevelUp = () => {
    this.props.onLevelUp && this.props.onLevelUp();
  };

  handleLevelDown = () => {
    this.props.onLevelDown && this.props.onLevelDown();
  };

  render() {
    const { template } = this.props;
    return (
      <div className="levels-jump-btns">
        <IconWithTooltip
          tip="上一层"
          iconClass="icon-org-chart-arrow-up"
          onClick={this.handleLevelUp}
          className={`${template === 'luba' ? 'luba' : ''}`}
        />
        <br />
        <IconWithTooltip
          tip="下一层"
          iconClass="icon-org-chart-arrow-down"
          placement="bottom"
          onClick={this.handleLevelDown}
          className={`${template === 'luba' ? 'luba' : ''}`}
        />
      </div>
    );
  }
}
