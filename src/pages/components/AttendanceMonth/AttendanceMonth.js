import React from 'react';
import { getGBEMClassName } from 'Util20/util';
import { Select } from 'antd';
import classNames from 'classnames';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import './AttendanceMonth.less';

const { Option } = Select;
const prefix = 'attendance-month';
const c = getGBEMClassName(prefix);

/**
 * 切换考勤月份的组件
 */
const AttendanceMonth = ({
  currentAttendanceMonth,
  onAttendanceChange,
  attendanceMonthList = [],
  className
}) => {
  return (
    <div className={classNames(prefix, className)}>
      <span className={c('attendance-title')}>
        <FM
          id="考勤月份"
          defaultMessage="考勤月份"
        />
      </span>
      <Select
        value={currentAttendanceMonth}
        className={c('attendance-month-select')}
        onChange={onAttendanceChange}
      >
        {attendanceMonthList.map(attendanceMonth => (
          <Option value={attendanceMonth.value} style={{ width: 100 }}>
            {attendanceMonth.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default injectIntl(AttendanceMonth);
