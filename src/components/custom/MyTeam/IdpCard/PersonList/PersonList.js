import React from 'react';
import { message, Button } from 'antd';
import './PersonList.less';
import http from 'Util20/api';
import TableData from '../../../../common/data/TableData';
/**
 * 管理员确认
 */

const personID = '618488751596'; //下属发展人员表ID
class PersonList extends React.Component {
  state = {
    mode: 'inline',
    theme: 'light',
    selectKey: '1',
    collapsed: false,
    currentPlan: {},
    historyPlan: []
  };
  constructor(props) {
    super(props);
  }
  onNoticeEmployee = async (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data = [];
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        console.log('come in ');
        item.isMessage = 'Y';
        data.push(item);
      }
    });
    try {
      res = await http().modifyRecords({
        resid: personID,
        data
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  onEmployeeWrite = async (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data = [];
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        console.log('come in ');
        item.sEmployeeWrite = 'Y';
        data.push(item);
      }
    });
    try {
      res = await http().modifyRecords({
        resid: personID,
        data
      });
      console.log('res.Error', res, res.Error);
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  onMangerWrite = async (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data = [];
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        console.log('come in ');
        item.sMangerWrite = 'Y';
        data.push(item);
      }
    });
    try {
      res = await http().modifyRecords({
        resid: personID,
        data
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  onCloseWrite = async (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data = [];
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        item.sEmployeeWrite = '';
        data.push(item);
      }
    });
    try {
      res = await http().modifyRecords({
        resid: personID,
        data
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  componentDidMount = async () => {
    console.log('props', this.props.record);
  };
  render() {
    return (
      <div className="personlist-contain" style={{ height: '100%' }}>
        <TableData
          resid={personID}
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
          cmswhere={
            this.props.role === 'HR'
              ? `projectId = '${this.props.record &&
                  this.props.record.projectId}'`
              : `projectId = '${this.props.record &&
                  this.props.record.projectId}' and directorId = '${this.props
                  .record && this.props.record.memberId}' `
          }
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
          actionBarExtra={({ dataSource, selectedRowKeys, data }) => {
            return (
              <React.Fragment>
                <Button
                  onClick={() => {
                    this.onNoticeEmployee(dataSource, selectedRowKeys, data);
                  }}
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
                {/* {this.props.role === 'HR' ? (
                  <Button
                    onClick={() => {
                      this.onMangerWrite(dataSource, selectedRowKeys);
                    }}
                  >
                    开启主管填写
                  </Button>
                ) : null} */}
                <Button
                  onClick={() => {
                    this.onCloseWrite(dataSource, selectedRowKeys);
                  }}
                >
                  关闭员工填写
                </Button>
              </React.Fragment>
            );
          }}
        />
      </div>
    );
  }
}

export default PersonList;
