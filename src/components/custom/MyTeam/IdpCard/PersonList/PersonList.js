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
  constructor(props) {
    super(props);
  }
  onNoticeEmployee = (dataSource, selectKey) => {
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
      res = http().modifyRecords({
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
  onEmployeeWrite = (dataSource, selectKey) => {
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
      res = http().modifyRecords({
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
  onMangerWrite = (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data;
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        console.log('come in ');
        item.sMangerWrite = 'Y';
        data.push(item);
      }
    });
    try {
      res = http().modifyRecords({
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
  onCloseWrite = (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data;
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        console.log('come in ');
        item.isCloseWrite = 'Y';
        data.push(item);
      }
    });
    try {
      res = http().modifyRecords({
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
          cmswhere={`projectId = '${this.props.record &&
            this.props.record.projectId}' and memberId = '${this.props.record &&
            this.props.record.menberId}' and year = '${this.props.record &&
            this.props.record.year}'`}
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
                ,
                {this.props.role === 'HR' ? (
                  <Button
                    onClick={() => {
                      this.onMangerWrite(dataSource, selectedRowKeys);
                    }}
                  >
                    开启主管填写
                  </Button>
                ) : null}
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
