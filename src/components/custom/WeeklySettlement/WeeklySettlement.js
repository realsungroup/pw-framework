import React from 'react';
import './WeeklySettlement.less';
import { DatePicker } from 'antd';
import moment from 'moment';
import MainTableSubTables from 'Common/data/MainTableSubTables';
/**
 * 周结算
 */
class WeeklySettlement extends React.Component {
  constructor(props) {
    super(props);
    const date = moment();
    this.state = {
      selectedDate: date,
      week: date.week()
    };
  }

  handleDateChange = date => {
    this.setState({ selectedDate: date, week: date.week() });
  };
  render() {
    const { selectedDate, week } = this.state;
    return (
      <div className="weekly-settlement">
        <header>
          <DatePicker value={selectedDate} onChange={this.handleDateChange} />
          <div className="week-number">考勤周：{week}</div>
        </header>
        <main style={{ height: 800 }}>
          <MainTableSubTables
            resid={644512352963}
            mainTableProps={{
              cmswhere: `C3_644512413647 = '${week}'`,
              hasAdd: false,
              hasModify: false,
              hasDelete: false,
              hasRowSelection: false,
              hasRowModify: false,
              hasRowDelete: false
            }}
            subTablesProps={{
              644525987356: {
                hasAdd: false,
                hasModify: false,
                hasDelete: false,
                hasRowSelection: false,
                hasRowModify: false,
                hasRowDelete: false
              }
            }}
          />
        </main>
      </div>
    );
  }
}

export default WeeklySettlement;
