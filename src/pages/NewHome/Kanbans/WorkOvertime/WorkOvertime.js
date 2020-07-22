import React from 'react';
import './WorkOvertime.less';
import http from 'Util20/api';
import { getItem } from 'Util20/util';
import moment from 'moment';
import echarts from 'echarts';

const months = [
  moment()
    .add(-2, 'M')
    .format('YYYYMM'),
  moment()
    .add(-1, 'M')
    .format('YYYYMM'),
  moment().format('YYYYMM')
];

class WorkOvertime extends React.Component {
  constructor(props) {
    super(props);
    this.UserCode = JSON.parse(getItem('userInfo')).UserCode;
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.state = {
      kanbanItems: [
        { key: 'ProgressBar-headcount', title: 'Headcount', data: [] },
        { key: 'ProgressBar-total', title: 'Total OT(hrs)', data: [] },
        { key: 'ProgressBar-average', title: 'Average OT(hrs)', data: [] }
      ]
    };
  }

  componentDidMount() {
    // this.getData();
  }

  getData = async () => {
    const { kanbanItems } = this.state;
    const pArr = [];
    months.forEach(month => {
      pArr.push(
        http().getTable({
          resid: '617805070334',
          cmswhere: `yearmonth = ${month}`
        })
      );
    });
    const resArr = await Promise.all(pArr);
    resArr.forEach(res => {
      let headcount = 0,
        totalOT = 0,
        averageOT = 0;
      res.data.forEach(item => {
        headcount += item.headcount;
        totalOT += item.ot;
        averageOT += item.otaverage;
      });
      kanbanItems[0].data.push(headcount.toFixed(2));
      kanbanItems[1].data.push(totalOT.toFixed(2));
      kanbanItems[2].data.push(averageOT.toFixed(2));
    });
    this.setState({ kanbanItems: [...kanbanItems] });
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
    const { kanbanItems } = this.state;
    return (
      <div className="work-overtime-kanban">
        {/* <div className="work-overtime-kanban__date" onClick={this.handleClick}>
          <div className="work-overtime-kanban__date-card">
            <div>{months[2].substring(0, 4)}</div>
            <div className="work-overtime-kanban__date-card__month">
              {months[2].substring(4, 6)}
            </div>
          </div>
        </div> */}
        {kanbanItems.map(item => {
          return (
            <div
              className="work-overtime-kanban__item"
              key={item.key}
              onClick={this.handleClick}
            >
              <WorkOvertimeChart
                id={item.key}
                title={item.title}
                xAxisData={months}
                data={item.data}
              />
              {/* <div className="work-overtime-kanban__item-title">
                {item.title}
              </div> */}
            </div>
          );
        })}
      </div>
    );
  }
}
export default WorkOvertime;

class WorkOvertimeChart extends React.Component {
  componentDidMount() {
    const { id, title, xAxisData } = this.props;

    this._echarts = echarts.init(document.getElementById(id));
    this._echarts.setOption({
      tooltip: {},
      title: {
        show: false
      },
      legend: {
        data: [title]
      },
      grid: {
        top: 20,
        bottom: 20,
        left: 60
        // containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisData
      },
      yAxis: {},
      series: [
        {
          name: title,
          type: 'line',
          data: [],
          itemStyle: {
            color: window.__powerWorkGlobal.themeColor
          }
          // label: {
          //   normal: {
          //     show: true,
          //     position: 'top'
          //   }
          // }
        }
      ]
    });
  }
  componentDidUpdate() {
    this._echarts.setOption({
      series: [
        {
          data: this.props.data
        }
      ]
    });
  }
  render() {
    const { id } = this.props;
    return <div id={id} style={{ height: '100%' }}></div>;
  }
}
