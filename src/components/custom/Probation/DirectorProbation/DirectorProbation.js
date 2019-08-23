import React from 'react';
import './DirectorProbation.less';
import TableData from '../../../common/data/TableData';
import { Button, message, Select } from 'antd';
import ProbationForms from '../ProbationForms';
import http from 'Util20/api';
const { Option } = Select;
class DirectorProbation extends React.Component {
  state = {
    isShowTable: true, //控制页面显示内容
    selectedRecord: {}
  };

  // 点击同意转正
  handleAgreed = async (record) =>{
    if (record.selectedRowKeys.length) {
      let res;
      let data = [];
      record.dataSource.map(item => {
        if (record.selectedRowKeys.includes(item.REC_ID)) {
          console.log("item",item);
          item.isRegular = 'Y';
          data.push(item);
        }
      });
      try {
        res = await http().modifyRecords({
          resid:618591396440 ,
          data
        });
        if (res.Error === 0) {
          message.success(res.message);
        }
      } catch (error) {
        message.error(error.message);
      }
    } else {
      message.error('请选择至少一条记录');
    }
  }

  

  // 点击批量审批触发方法
  handMul = async (record) => {
    console.log("record.data",record.data);

    if (record.selectedRowKeys.length) {
      let res;
      let data = [];
      record.dataSource.map(item => {
        if (record.selectedRowKeys.includes(item.REC_ID)) {
          console.log("item",item);
          item.isDirectorApproval = 'Y';
          data.push(item);
        }
      });
      try {
        res = await http().modifyRecords({
          resid:618591396440,
          data
        });
        if (res.Error === 0) {
          console.log("选择记录",record)
          message.success(res.message);
        }
      } catch (error) {
        message.error(error.message);
      }
    } else {
      console.log("选择记录",message.error)
      message.error('请选择至少一条记录');
    }



    
  }

  actionBarExtra = record => {
    return (
      <div className="hr-probation_table-action-bar-extra">
        <div className="hr-probation_table-action-bar-extra_buttons">
          {/* <Button
            onClick={() => {
              if (record.selectedRowKeys.length) {
                // this.onMoveEmployees(record);
              } else {
                message.error('请选择至少一条记录');
              }
            }}
          >
            提醒填写
          </Button> */}
          <Button
            type="primary"
            onClick={() => {
              // if (record.selectedRowKeys.length) {
              //   // this.onMoveEmployees(record);
              // } else {
              //   this.setState({
              //     selectCourseArrangementVisible: false
              //   });
              //   message.error('请选择至少一条记录');
              // }
              this.handMul(record);
            }}
            
          >
            批量审批
          </Button>
          <Button
            onClick={() => {
              this.handleAgreed(record);
            }}
          >
            同意转正
          </Button>
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
            memberId={this.state.selectedRecord.memberId}
            goBack={this.goBack}
            roleName="主管"
            setIsShowTable={this.setIsShowTable}
          />
        )}
      </div>
    );
  }
}

export default DirectorProbation;
