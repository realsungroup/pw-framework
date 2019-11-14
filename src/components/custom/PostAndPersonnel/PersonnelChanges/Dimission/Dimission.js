import React from 'react';
import { DatePicker } from 'antd';
import './Dimission.less';

const { RangePicker } = DatePicker;
/*
 *离职情况
 */
class Dimission extends React.Component {
  render() {
    return (
      <div className="personnel-changes_tabpane" id="dimission">
        <div className="dimission_change-period">
          <span>变化期间：</span>
          <RangePicker />
        </div>
        <div className="dimission-situation">
          <div>离职历史记录</div>
          <div>部门离职走势</div>
        </div>
      </div>
    );
  }
}

export default Dimission;
