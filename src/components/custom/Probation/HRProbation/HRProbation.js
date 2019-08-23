import React from 'react';
import './HRProbation.less';
import TableData from '../../../common/data/TableData';
import { Button, message, Select, } from 'antd';
import ProbationForms from '../ProbationForms';
import http from 'Util20/api';
import { isConstructorDeclaration } from 'typescript';
const { Option } = Select;
class HRProbation extends React.Component {
  state = {
    isShowTable: true, //控制页面显示内容
    selectedRecord: {}
  };

  // 点击下拉框
  handleSel = async (record,selectValue) => {
    if (record.selectedRowKeys.length) {
      let res;
      let data = [];
      record.dataSource.map(item => {
        if (record.selectedRowKeys.includes(item.REC_ID)) {
          if(selectValue === '主管填写'){
            item.isDirectorFill = 'Y';
          }else if (selectValue === '员工填写') {
            item.isEmployeeFill = 'Y';
          }else if (selectValue === '辅导员填写') {
            item.isCounselorFill = 'Y';
          }else if (selectValue === '员工确认辅导') {
            item.isStaffConfirm = 'Y';
          }
          data.push(item);
        }
      });
    try {
      res = await http().modifyRecords({
        resid:619609481002,
        data
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
      this.setState({
        selectCourseArrangementVisible: false
      });
      
    }else{
      message.error('请选择至少一条记录');
    }
    
  }

  // 点击转正申请
  handleApply = async (record) =>{
    console.log("record转正111",record)
    if (record.selectedRowKeys.length) {
      this.setState({
        selectCourseArrangementVisible: false
      });
      let res;
      let data = [];
      record.dataSource.map(item => {
        if (record.selectedRowKeys.includes(item.REC_ID)) {
          console.log('come in ');
          item.isRegularNotice = 'Y';
          data.push(item);
        }
      });
      try {
        res = await http().modifyRecords({
          resid:619609481002 ,
          data
        });
        if (res.Error === 0) {
          message.success(res.message);
        }
      } catch (error) {
        message.error(error.message);
      }
    }else{
      message.error('请选择至少一条记录');
    }
    

    
  }

  actionBarExtra = record => {
    return (
      <div className="hr-probation_table-action-bar-extra">
        <div className="hr-probation_table-action-bar-extra_buttons">
          {/* <Button
            type="primary"
            onClick={() => {
              console.log("come in ")
              this.handMul(record);
              console.log("record批量审批",record);
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
          </Button> */}
          <Select style={{ width: 120 }} placeholder="提醒"
            onChange={(selectValue) => {
              this.handleSel(record,selectValue)
              console.log("record下拉框",record);
            }}
          >
            <Option value="员工填写">员工填写</Option>
            <Option value="主管填写">主管填写</Option>
            <Option value="辅导员填写">辅导员填写</Option>
            <Option value="员工确认辅导">员工确认辅导</Option>
          </Select>
          <Button
            onClick = {(RegularApply) => {
              this.handleApply(record);
            }}
          >转正申请</Button>
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
              resid="619609481002"
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
            memberId={this.state.selectedRecord.memberId}
            goBack={this.goBack}
            roleName="HR"
            setIsShowTable={this.setIsShowTable}
          />
        )}
      </div>
    );
  }
}

export default HRProbation;
