import React from 'react';
import TableData from 'Common/data/TableData';
import { Select } from 'antd';
import classnames from 'classnames';
const { Option } = Select;

class ByYear extends React.Component {
  state = {
    selectedYear: ''
  };
  static getDerivedStateFromProps(props, state) {
    if (!state.selectedYear) {
      return { selectedYear: props.currentYear.C3_420161949106 };
    }
  }
  render() {
    const tableDataProps = {};
    tableDataProps.hasAdd = false;
    tableDataProps.hasModify = false;
    tableDataProps.hasDelete = false;
    tableDataProps.hasRowAdd = false;
    tableDataProps.hasRowModify = false;
    tableDataProps.hasRowDelete = false;
    tableDataProps.hasRowEdit = false;
    tableDataProps.hasRowView = true;
    tableDataProps.actionBarWidth = 150;
    const { selectedYear } = this.state;
    const { years, resid ,baseURL} = this.props;
    return (
      <div className="subordinate-achievements">
        <div className="subordinate-achievements__year-list">
          {years.map(year => {
            return (
              <div
                key={year.C3_420161949106}
                className={classnames('year-list-item', {
                  'year-list-item--selected':
                    selectedYear == year.C3_420161949106
                })}
                onClick={() =>
                  this.setState({ selectedYear: year.C3_420161949106 })
                }
              >
                {year.C3_420161949106}
              </div>
            );
          })}
        </div>
        <div className="subordinate-achievements__tabledata-container">
          <TableData
            key={selectedYear}
            resid={resid}
            {...tableDataProps}
            cmswhere={`C3_420150922019 = '${selectedYear}'`}
            subtractH={180}
            hasRowDelete={false}
            hasRowModify={false}
            hasRowView={false}
            baseURL={baseURL}
          />
        </div>
      </div>
    );
  }
}

export default ByYear;
