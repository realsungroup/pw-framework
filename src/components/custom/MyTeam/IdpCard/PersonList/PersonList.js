import React from 'react';
import { message, Button } from 'antd';
import './PersonList.less';
import http from 'Util20/api';
import TableData from '../../../../common/data/TableData';
/**
 * 管理员确认
 */

const personID = '617725883137'; //发展人员表ID
class PersonList extends React.Component {
  state = {
    mode: 'inline',
    theme: 'light',
    selectKey: '1',
    collapsed: false,
    currentPlan: {},
    historyPlan: []
  };
  onNoticeEmployee = (dataSource,selectKey) => {
    // if (!record.selectedRowKeys.length) {
    //   return message.error('请选择一条记录');
    // }
    let res;
    // dataSource.
    let data ;
    dataSource.map((item) => {
      item.map((items) => {
        if(items.REC_ID === selectKey){
          items.isMessage = 'Y'
        }
        data.push(item)
      })
    })
    try {
      res = http().modifyRecords({
        resid:personID,
        data
      })
      if(res.Error === 0){
        message.success(res.message)
      }
    } catch (error) {
      message.error(error.message)
    }
  };
  onEmployeeWrite = (dataSource,selectKey) => {
    let res;
    let data ;
    dataSource.map((item) => {
      item.map((items) => {
        if(items.REC_ID === selectKey){
          items.sEmployeeWrite = 'Y'
        }
        data.push(item)
      })
    })
    try {
      res = http().modifyRecords({
        resid:personID,
        data
      })
      if(res.Error === 0){
        message.success(res.message)
      }
    } catch (error) {
      message.error(error.message)
    }
  };
  onMangerWrite = (dataSource,selectKey) => {
    let res;
    let data ;
    dataSource.map((item) => {
      item.map((items) => {
        if(items.REC_ID === selectKey){
          items.sMangerWrite = 'Y'
        }
        data.push(item)
      })
    })
    try {
      res = http().modifyRecords({
        resid:personID,
        data
      })
      if(res.Error === 0){
        message.success(res.message)
      }
    } catch (error) {
      message.error(error.message)
    }
  };
  onCloseWrite = (dataSource,selectKey) => {
    let res;
    let data ;
    dataSource.map((item) => {
      item.map((items) => {
        if(items.REC_ID === selectKey){
          items.isCloseWrite = 'Y'
        }
        data.push(item)
      })
    })
    try {
      res = http().modifyRecords({
        resid:personID,
        data
      })
      if(res.Error === 0){
        message.success(res.message)
      }
    } catch (error) {
      message.error(error.message)
    }
  };
  componentDidMount = async () => {};
  render() {
    return (
      <div className="personlist-contain" style={{ height: '100%' }}>
        <TableData
          resid="617725883137"
          subtractH={220}
          hasBeBtns={false}
          hasRowSelection={true}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          hasAdd={false}
          hasRowView={false}
          hasModify={false}
          hasRowDelete={false}
          hasDelete={false}
          hasRowModify={false}
          actionBarFixed={true}
          height="100%"
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Button
                  onClick={() => {
                    this.props.onLookPerson(record);
                  }}
                >
                  修改
                </Button>
              );
            }
          ]}
          actionBarExtra={({ dataSource, selectedRowKeys,data }) => {
            return (
              <React.Fragment>
                <Button
                  onClick={() => {
                    this.onNoticeEmployee(dataSource, selectedRowKeys,data)
                    
                  }
                    // this.setState({ applyByCourseVisible: true });
                  }
                >
                  提醒员工
                </Button>
                <Button
                  onClick={() => {
                    this.onEmployeeWrite(dataSource, selectedRowKeys);
                  }}
                >
                  开启员工填写
                </Button>
                ,
                <Button
                  onClick={() => {
                    this.onMangerWrite(dataSource, selectedRowKeys);
                  }}
                >
                  开启主管填写
                </Button>
                ,
                <Button
                  onClick={() => {
                    this.onCloseWrite(dataSource, selectedRowKeys);
                  }}
                >
                  关闭填写
                </Button>
              </React.Fragment>
            );

            // <Button
            //   onClick={() => {
            //     this.onEmployeeWrite(selectedRowKeys,data)
            //   }}
            // >
            //   开启员工填写
            // </Button>,
            // <Button
            //   onClick={() => {
            //     this.onMangerWrite(selectedRowKeys,data)
            //   }}
            // >
            //   开启主管填写
            // </Button>,
            // <Button
            //   onClick={() => {

            //     this.onCloseWrite(selectedRowKeys,data)                }}
            // >
            //   关闭填写
            // </Button>
          }}
        />
      </div>
    );
  }
}

export default PersonList;
