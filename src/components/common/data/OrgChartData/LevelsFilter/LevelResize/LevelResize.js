import React from 'react';
import PropTypes from 'prop-types';
import './LevelResize.less';

/**
 * level resize
 */
export default class LevelResize extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }
  _isPress = false;
  handleMouseDown = e => {
    this._isPress = true;
    document.body.addEventListener('mousemove', e => {
      if (this._isPress) {
        console.log(e.movementY);
      }
    });
    document.body.addEventListener('mouseup', e => {
      this._isPress = false;
    });
  };

  render() {
    return (
      <div className="level-resize">
        <i
          className="level-resize__top-handle"
          onMouseDown={this.handleMouseDown}
        />
        <i
          className="level-resize__bottom-handle"
          onMouseDown={this.handleMouseDown}
        />
      </div>
    );
  }
}
