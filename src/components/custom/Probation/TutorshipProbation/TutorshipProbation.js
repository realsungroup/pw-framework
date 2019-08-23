import React from 'react';
import './TutorshipProbation.less';
import TableData from '../../../common/data/TableData';
import { Button, message, Select } from 'antd';
import ProbationForms from '../ProbationForms';
import http from 'Util20/api';
const { Option } = Select;
class TutorshipProbation extends React.Component {
  state = {
    isShowTable: true, //控制页面显示内容
    selectedRecord: {}
  };

  //点击提醒确认
  handleConfirm = async (record) =>{
    if (record.selectedRowKeys.length) {
      // this.onMoveEmployees(record);
      let res;
    let data = [];
    record.dataSource.map(item => {
      if (record.selectedRowKeys.includes(item.REC_ID)) {
        console.log("item",item);
        item.isRemindConfirm = 'Y';
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

  actionBarExtra = record => {
    return (
      <div className="hr-probation_table-action-bar-extra">
        <div className="hr-probation_table-action-bar-extra_buttons">
          <Button
            onClick={() => {
              this.handleConfirm(record);
              // if (record.selectedRowKeys.length) {
              //   // this.onMoveEmployees(record);
              // } else {
              //   message.error('请选择至少一条记录');
              // }
            }}
          >
            提醒确认
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
              resid="619609503146"
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
            roleName="辅导员"
            setIsShowTable={this.setIsShowTable}
          />
        )}
      </div>
    );
  }
}

export default TutorshipProbation;
