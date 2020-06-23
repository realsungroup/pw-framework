import React from 'react';
import './WorkOvertime.less';
import ProgressBar from 'progressbar.js';
import http from 'Util20/api';
import { getItem } from 'Util20/util';
import moment from 'moment';

const month = moment().format('YYYYMM');
function getOption({ total }) {
  const option = {
    strokeWidth: 6,
    trailWidth: 8,
    color: '#e02020',
    trailColor: '#eee',
    easing: 'easeInOut',
    duration: 1400,
    svgStyle: null,
    text: {
      value: total,
      alignToBottom: false,
      className: 'work-overtime-kanban__label'
    },
    from: { color: '#FFEA82' },
    to: { color: '#e02020' },
    // Set default step function for all animate calls
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
      var value = Math.round(bar.value() * 100);
      if (value === 0) {
        bar.setText('');
      } else {
        bar.setText(total);
      }
      bar.text.style.color = state.color;
    }
  };
  return option;
}
const kanbanItems = [
  { key: 'ProgressBar-headcount', title: 'Headcount', total: 0 },
  { key: 'ProgressBar-total', title: 'Total OT(hrs)', total: 0 },
  { key: 'ProgressBar-average', title: 'Average OT(hrs)', total: 0 }
];
class WorkOvertime extends React.Component {
  constructor(props) {
    super(props);
    this.UserCode = JSON.parse(getItem('userInfo')).UserCode;
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
  }
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    const res = await http().getTable({
      resid: '617805070334',
      cmswhere: `yearmonth = ${month}`
    });
    let headcount = 0,
      totalOT = 0,
      averageOT = 0;
    res.data.forEach(item => {
      headcount += item.headcount;
      totalOT += item.ot;
      averageOT += item.otaverage;
    });

    kanbanItems[0].total = headcount.toFixed(2);
    kanbanItems[1].total = totalOT.toFixed(2);
    kanbanItems[2].total = averageOT.toFixed(2);

    kanbanItems.forEach(item => {
      const option = getOption({ total: item.total });
      const bar = new ProgressBar.SemiCircle(`#${item.key}`, option);
      bar.animate(1); // Number from 0.0 to 1.0
    });
  };

  handleClick = () => {
    const { onClick } = this.props;
    onClick &&
      onClick([
        {
          app: {
            ResID: 621257502796,
            title: '考勤审批',
            REC_ID: 621257791792,
            fnmoduleUrl: `/fnmodule?resid=${621257502796}&recid=${621257791792}&type=考勤审批&title=考勤审批&menuKey=sub2-1&summaryVisible=true`
          },
          typeName: '考勤审批'
        }
      ]);
  };
  render() {
    return (
      <div className="work-overtime-kanban">
        <div className="work-overtime-kanban__date" onClick={this.handleClick}>
          <div className="work-overtime-kanban__date-card">
            <div>{month.substring(0, 4)}</div>
            <div className="work-overtime-kanban__date-card__month">
              {month.substring(4, 6)}
            </div>
          </div>
          <div className="work-overtime-kanban__item-title">Time</div>
        </div>
        {kanbanItems.map(item => {
          return (
            <div
              className="work-overtime-kanban__item"
              key={item.key}
              onClick={this.handleClick}
            >
              <div id={item.key}></div>
              <div className="work-overtime-kanban__item-title">
                {item.title}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
export default WorkOvertime;
