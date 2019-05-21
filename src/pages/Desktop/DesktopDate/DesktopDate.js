import React from 'react';
import './DesktopDate.less';
import classNames from 'classnames';

const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/**
 * 窗口组件
 */
export default class DesktopDate extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    const { Y, M, D, w, h, m } = this.getDateTime(new Date());
    const { time, week, date } = this.getDateString({ Y, M, D, w, h, m });
    this.state = { time, week, date };
  }

  timer;

  componentDidMount() {
    this.setTimeout();
  }

  setTimeout = () => {
    this.timer = setTimeout(() => {
      const d = new Date();
      const { Y, M, D, w, h, m } = this.getDateTime(d);
      const { time, week, date } = this.getDateString({ Y, M, D, w, h, m });
      this.setState({ time, week, date });
      this.setTimeout();
    }, 60000);
  };

  getDateTime = d => {
    const h = d.getHours();
    const m = d.getMinutes();
    const Y = d.getFullYear();
    const M = d.getMonth() + 1;
    const w = d.getDay();
    const D = d.getDate();
    return { Y, M, D, w, h, m };
  };

  getDateString = ({ Y, M, D, w, h, m }) => {
    const time = `${h >= 10 ? h : '0' + h}:${m >= 10 ? m : '0' + m}`;
    const week = weekMap[w];
    const date = `${Y}/${M >= 10 ? M : '0' + M}/${D >= 10 ? D : '0' + D}`;
    return { time, week, date };
  };

  render() {
    const { time, week, date } = this.state;
    const classes = classNames('desktop-date', this.props.className);
    return (
      <div className={classes}>
        <div className="desktop-date__top">
          <span>{time}</span>
          <span>{week}</span>
        </div>
        <div className="desktop-date__date">{date}</div>
      </div>
    );
  }
}
