import React from 'react';
import TableData from '../../../../common/data/TableData';
import { Select } from 'antd';

const { Option } = Select;
class TargetTarget extends React.Component {
  actionBarExtra = record => {
    return (
      <div className="hr-probation_table-action-bar-extra">
        <div className="hr-probation_table-action-bar-extra_buttons">
          <Select
            style={{ width: 120 }}
            placeholder="提醒"
            onSelect={selectValue => {
              // this.handleSel(record, selectValue);
              // this.showConfirm(record, selectValue);
            }}
          >
            <Option value="员工填写">员工填写</Option>
            <Option value="主管填写">主管填写</Option>
            <Option value="辅导员填写">辅导员填写</Option>
            <Option value="员工确认辅导">员工确认辅导</Option>
          </Select>
        </div>
      </div>
    );
  };
  render() {
    return (
      <div id="target-history">
        <TableData
          key="1"
          resid="619609481002"
          subtractH={240}
          hasAdvSearch={false}
          hasAdd={false}
          hasRowView={false}
          hasRowDelete={false}
          hasRowEdit={false}
          hasDelete={false}
          hasModify={false}
          hasRowModify={false}
          hasRowSelection={true}
          actionBarWidth={100}
          actionBarExtra={this.actionBarExtra}
        />
      </div>
    );
  }
}
export default TargetTarget;
