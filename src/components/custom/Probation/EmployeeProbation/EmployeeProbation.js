import React from 'react';
import './EmployeeProbation.less';
import TableData from '../../../common/data/TableData';
import { Button, message, Select } from 'antd';
import ProbationForms from '../ProbationForms';

const { Option } = Select;
/**
 * 无用文件
 */
class EmployeeProbation extends React.Component {
  state = {
    isShowTable: true, //控制页面显示内容
    selectedRecord: {}
  };

  actionBarExtra = record => {
    return (
      <div className="hr-probation_table-action-bar-extra">
        <div className="hr-probation_table-action-bar-extra_buttons">
          <Button
            type="primary"
            onClick={() => {
              if (record.selectedRowKeys.length) {
                // this.onMoveEmployees(record);
              } else {
                this.setState({
                  selectCourseArrangementVisible: false
                });
                message.error('请选择至少一条记录');
              }
            }}
          >
            批量审批
          </Button>
          <Select style={{ width: 120 }} placeholder="提醒">
            <Option value="员工填写">员工填写</Option>
            <Option value="主管填写">主管填写</Option>
            <Option value="辅导员填写">辅导员填写</Option>
            <Option value="员工确认辅导">员工确认辅导</Option>
          </Select>
          <Button>转正申请</Button>
        </div>
      </div>
    );
  };

  onCustomViewBtnClick = record => {
    return () => {
      this.setState({
        isShowTable: false,
        selectedRecord: record
      });
    };
  };

  goBack = () => this.setState({ isShowTable: true });

  setIsShowTable = isShowTable => {
    this.setState({ isShowTable });
  };

  render() {
    return (
      <div id="hr-probation">
        {this.state.isShowTable ? (
          <div style={{ height: '100vh' }}>
            <TableData
              resid="618591396440"
              subtractH={240}
              hasAdd={false}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={false}
              hasRowSelection={true}
              customRowBtns={[
                record => (
                  <Button
                    type="primary"
                    onClick={this.onCustomViewBtnClick(record)}
                  >
                    查看
                  </Button>
                )
              ]}
              actionBarExtra={this.actionBarExtra}
            />
          </div>
        ) : (
          <ProbationForms
            employeeInfo={this.state.selectedRecord}
            goBack={this.goBack}
            roleName="hr"
            setIsShowTable={this.setIsShowTable}
          />
        )}
      </div>
    );
  }
}

export default EmployeeProbation;
