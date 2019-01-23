import React, { Fragment } from 'react';
import { message, Calendar, Spin, Button } from 'antd';
import PropTypes from 'prop-types';
import {
  getDailyRpt,
  getDailyRptV2,
  getMainTableData,
  modRecordEditOrAdd,
  addRecordEditOrAdd,
  addRecords,
  getFormData
} from 'Util/api';
import cloneDeep from 'lodash.clonedeep';
import classNames from 'classnames';
import moment from 'moment';
import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
  SubMenu
} from 'react-contextmenu';
import dealControlArr from 'Util/controls.js';
import LzModal from '../../../../lib/unit-component/components/LzModal';
import LzForm from '../../../../lib/unit-component/components/LzForm';

import './CurMonSchedule.less';

const teamResid = 593017031990;
const classResid = 592745383956;

/**
 * 当月排班
 */
export default class CurMonSchedule extends React.Component {
  static propTypes = {
    /**
     * 人员编号
     */
    pnid: PropTypes.number.isRequired,

    /**
     * 当前月份(moment 实例对象)
     */
    curMonth: PropTypes.object.isRequired
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      calendarData: [],
      teamArr: [], // 班组
      classArr: [], // 班次
      selectedDateArr: [], // 选择的日期
      record: {},
      formFormData: null,
      formModalVisible: false
    };
  }

  componentDidMount() {
    this.getScheduleData(cloneDeep(this.props.curMonth));
    this.getTeamAndClassData();
    this.bindEvent();
  }

  componentWillUnmount = () => {
    window.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('keyup', this.handleKeyup);
    window.removeEventListener('dblclick', this.handleDoubleClick);
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.curMonth !== this.props.curMonth) {
      this.getScheduleData(cloneDeep(nextProps.curMonth));
    }
  };

  bindEvent = () => {
    window.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('keyup', this.handleKeyup);
    window.addEventListener('dblclick', this.handleDoubleClick);
  };

  _isKeydown = false;
  handleKeydown = e => {
    if (e.code === 'MetaLeft' || e.code === 'ControlLeft') {
      this._isKeydown = true;
    }
  };

  handleKeyup = e => {
    if (e.code === 'MetaLeft' || e.code === 'ControlLeft') {
      this._isKeydown = false;
    }
  };

  handleCellWrapClick = e => {
    if (!this._isKeydown) {
      return;
    }
    const target = e.target;
    const td = target.closest('td.ant-fullcalendar-cell');
    td.classList.toggle('selected');

    const hasSelected = td.classList.contains('selected');

    const dateString = td.querySelector('.cur-mon-schedule__time-value')
      .innerHTML;

    const { selectedDateArr, calendarData } = this.state;
    // 已被选中
    if (hasSelected) {
      let selectedItem = calendarData.find(item => item.DATES === dateString);
      if (!selectedItem) {
        selectedItem = {
          DATES: dateString
        };
      }
      this.setState({ selectedDateArr: [...selectedDateArr, selectedItem] });

      // 未被选中
    } else {
      const index = selectedDateArr.findIndex(
        item => item.DATES === dateString
      );
      selectedDateArr.splice(index, 1);
      this.setState({ selectedDateArr: [...selectedDateArr] });
    }
  };

  handleDoubleClick = () => {
    if (this.state.selectedDateArr.length) {
      this.setState({ selectedDateArr: [] });
      this.removeSelectedTdBorderStyle();
    }
  };

  getScheduleData = async curMonth => {
    this.setState({ loading: true });
    const { pnid } = this.props;
    const startDate = curMonth.startOf('month').format('YYYY-MM-DD');
    const endDate = curMonth.endOf('month').format('YYYY-MM-DD');
    let res;
    try {
      res = await getDailyRptV2(pnid, startDate, endDate);
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    res.data.forEach(item => {
      item.WORKSTARTTIME = item.STARTTIME
        ? moment(item.STARTTIME).format('HH:mm')
        : '';
      item.WORKENDTIME = item.FINISHTIME
        ? moment(item.FINISHTIME).format('HH:mm')
        : '';
    });
    this.setState({
      calendarData: res.data,
      loading: false,
      selectedDateArr: []
    });
  };

  getTeamAndClassData = async () => {
    let res;
    try {
      res = await Promise.all([
        getMainTableData(teamResid),
        getMainTableData(classResid)
      ]);
    } catch (err) {
      return message.error(err.message);
    }
    const teamArr = res[0].data.map(item => ({
      id: item.SHIFTID,
      name: item.DESCP
    }));
    const classArr = res[1].data.map(item => ({
      id: item.WORKDAYID,
      name: item.NAME
    }));
    this.setState({ teamArr, classArr });
  };

  renderDateCell = cellDate => {
    const { calendarData } = this.state;
    const cellDateStr = cellDate.format('YYYY-MM-DD');
    const curCellDate = calendarData.find(item => item.date === cellDateStr);

    return (
      <ContextMenuTrigger id="cur-mon-schedule__contextmenu">
        <div
          className="cur-mon-schedule__cell-wrap"
          onClick={this.handleCellWrapClick}
        >
          <div className="cur-mon-schedule__time-value">{cellDateStr}</div>
          {!!curCellDate && (
            <Fragment>
              {/* 班次名称 */}
              <div
                className={classNames('cur-mon-schedule__type', {
                  'cur-mon-schedule__type--rest':
                    curCellDate.workdayname === '休息',
                  'cur-mon-schedule__type--work':
                    curCellDate.workdayname !== '休息'
                })}
              >
                {curCellDate.workdayname}
              </div>
              <div className="cur-mon-schedule__time">
                {curCellDate.WORKSTARTTIME &&
                  curCellDate.WORKENDTIME &&
                  `${curCellDate.WORKSTARTTIME} - ${curCellDate.WORKENDTIME}`}
              </div>
            </Fragment>
          )}
        </div>
      </ContextMenuTrigger>
    );
  };

  handleTeamItemClick = async (e, data) => {
    let res;
    try {
      res = await getMainTableData(593881702082, {
        cmswhere: `STARTDATE = ${moment(this._curDateString).format(
          'YYYY-MM-DD'
        )} and PNID = ${this.props.pnid}`
      });
    } catch (err) {
      return message.error(err.message);
    }
    // 没有则添加
    if (!res.data.length) {
      try {
        res = await addRecordEditOrAdd(593881702082, {
          DAOBAN_ID: data.item.id,
          PNID: this.props.pnid,
          STARTDATE: moment(this._curDateString).format('YYYY-MM-DD')
        });
      } catch (err) {
        return message.error(err.message);
      }

      // 有则修改
    } else {
      try {
        res = await modRecordEditOrAdd(593881702082, {
          DAOBAN_ID: data.item.id,
          PNID: this.props.pnid,
          STARTDATE: moment(this._curDateString).format('YYYY-MM-DD')
        });
      } catch (err) {
        return message.error(err.message);
      }
    }
    if (!res.data.length) {
      return message.error('修改失败');
    }
    message.success('修改成功');
    this.getScheduleData(cloneDeep(this.props.curMonth));
  };

  // 修改班次
  handleClassItemClick = async (e, data) => {
    // 修改单个
    if (!this.state.selectedDateArr.length) {
      let res;
      try {
        res = await getMainTableData(593881721521, {
          cmswhere: `C3_423664325432 = ${moment(this._curDateString).format(
            'YYYY-MM-DD'
          )} and PNID = ${this.props.pnid}`
        });
      } catch (err) {
        return message.error(err.message);
      }
      // 没有则添加
      if (!res.data.length) {
        try {
          res = await addRecordEditOrAdd(593881721521, {
            WORKDAYID: data.item.id,
            PNID: this.props.pnid,
            C3_423664325432: moment(this._curDateString).format('YYYY-MM-DD')
          });
        } catch (err) {
          return message.error(err.message);
        }

        // 有则修改
      } else {
        try {
          res = await modRecordEditOrAdd(593881721521, {
            WORKDAYID: data.item.id,
            PNID: this.props.pnid,
            C3_423664325432: moment(this._curDateString).format('YYYY-MM-DD'),
            REC_ID: res.data[0].REC_ID
          });
        } catch (err) {
          return message.error(err.message);
        }
      }
      if (!res.data.length) {
        return message.error('修改失败');
      }
      message.success('修改成功');
      this.getScheduleData(cloneDeep(this.props.curMonth));
    } else {
      // 修改多个

      const { selectedDateArr } = this.state;
      const dataArr = [];

      selectedDateArr.forEach(selectedDate => {
        dataArr.push({
          WORKDAYID: data.item.id,
          PNID: this.props.pnid,
          C3_423664325432: moment(selectedDate.DATES).format('YYYY-MM-DD')
        });
      });
      let res;
      try {
        res = await addRecords(593881721521, dataArr);
      } catch (err) {
        return message.error(err.message);
      }
      message.success('修改成功');
      this.getScheduleData(cloneDeep(this.props.curMonth));
      this.removeSelectedTdBorderStyle();
    }
  };

  removeSelectedTdBorderStyle = () => {
    const tdArr = document.querySelectorAll('.ant-fullcalendar-cell.selected');
    tdArr.forEach(td => {
      td.classList.remove('selected');
    });
  };

  _curDateString = '';
  handleContextMenuShow = e => {
    const target = e.detail.target;
    const parentNode = target.closest('.ant-fullcalendar-date');
    const str = parentNode.querySelector('.ant-fullcalendar-value').innerHTML;
    this._curDateString = this.props.curMonth.format('YYYYMM') + str;
  };

  handleCheckRecordBtnClick = async () => {
    const { calendarData } = this.state;
    const selectedItem = calendarData.find(
      item => moment(this._curDateString).format('YYYY-MM-DD') === item.date
    );
    const record = selectedItem.dailyrecord;
    let res;
    try {
      res = await getFormData(593257166942, 'default');
    } catch (err) {
      return message.error(err.message);
    }
    const formFormData = dealControlArr(res.data.columns);
    this.setState({ record, formFormData, formModalVisible: true });
  };

  handleRefreshDailyRpt = async () => {
    this.setState({ loading: true });
    const { pnid } = this.props;
    const curMonth = cloneDeep(this.props.curMonth);
    const startDate = curMonth.startOf('month').format('YYYY-MM-DD');
    const endDate = curMonth.endOf('month').format('YYYY-MM-DD');

    try {
      await getDailyRpt(pnid, startDate, endDate, 1);
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }

    await this.getScheduleData(cloneDeep(this.props.curMonth));
    message.success('刷新日报成功');
  };

  render() {
    const {
      loading,
      teamArr,
      classArr,
      selectedDateArr,
      record,
      formFormData,
      formModalVisible
    } = this.state;
    return (
      <div className="cur-mon-schedule">
        <Spin spinning={loading}>
          <Button
            type="primary"
            onClick={this.handleRefreshDailyRpt}
            style={{ marginBottom: 0 }}
          >
            刷新日报
          </Button>
          <Calendar
            dateCellRender={this.renderDateCell}
            value={this.props.curMonth}
          />
          <ContextMenu
            id="cur-mon-schedule__contextmenu"
            onShow={this.handleContextMenuShow}
          >
            <MenuItem disabled>
              <div className="cur-mon-schedule__contextmenu-title">
                {this.state.selectedDateArr.length
                  ? '批量修改班次'
                  : '修改班组/班次'}
              </div>
            </MenuItem>
            {!selectedDateArr.length && (
              <SubMenu title="班组">
                {teamArr.map(item => (
                  <MenuItem
                    key={item.id}
                    onClick={this.handleTeamItemClick}
                    data={{ item }}
                  >
                    <div>{item.name}</div>
                  </MenuItem>
                ))}
              </SubMenu>
            )}

            <SubMenu title="班次">
              {classArr.map(item => (
                <MenuItem
                  key={item.id}
                  onClick={this.handleClassItemClick}
                  data={{ item }}
                >
                  <div>{item.name}</div>
                </MenuItem>
              ))}
            </SubMenu>
            {!selectedDateArr.length && (
              <MenuItem onClick={this.handleCheckRecordBtnClick}>
                <div className="cur-mon-schedule__check-record">查看日报</div>
              </MenuItem>
            )}
          </ContextMenu>
        </Spin>
        {formModalVisible && (
          <LzModal
            modalHeight={560}
            onClose={() => this.setState({ formModalVisible: false })}
          >
            <LzForm record={record} formFormData={formFormData} />
          </LzModal>
        )}
      </div>
    );
  }
}
