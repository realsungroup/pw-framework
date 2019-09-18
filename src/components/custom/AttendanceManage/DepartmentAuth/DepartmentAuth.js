import React from 'react';
import './DepartmentAuth.less';
import { Button, message, Popconfirm } from 'antd';
import TableData from '../../../common/data/TableData';
import http from 'Util20/api';

/*
 * 部门独立授权
 */

class DepartmentAuth extends React.Component {
  actionBarExtra = record => (
    <div className="">
      <Popconfirm
        title="禁用独立授权？"
        onConfirm={() => {
          if (!record.selectedRowKeys.length) {
            return message.error('请选择一条记录');
          }
          let selectedRecords = record.selectedRowKeys.map(key => {
            return {
              REC_ID: record.dataSource.find(item => {
                return item.REC_ID === key;
              }).REC_ID,
              C3_446915685257: 'Y'
            };
          });
          this.isAuth(true, selectedRecords);
        }}
      >
        <Button>启用独立授权</Button>
      </Popconfirm>
      <Popconfirm
        title="禁用独立授权？"
        onConfirm={() => {
          if (!record.selectedRowKeys.length) {
            return message.error('请选择一条记录');
          }
          let selectedRecords = record.selectedRowKeys.map(key => {
            return {
              REC_ID: record.dataSource.find(item => {
                return item.REC_ID === key;
              }).REC_ID,
              C3_446915685257: 'Y'
            };
          });
          this.isAuth(false, selectedRecords);
        }}
      >
        <Button>禁用独立授权</Button>
      </Popconfirm>
    </div>
  );

  isAuth = async (isAuth, data) => {
    try {
      this.props.setLoading(true);
      const res = await http().modifyRecords({
        resid: '475845337597',
        data
      });
      message.success(res.message);
      this.tableDataRef.handleRefresh();
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      this.props.setLoading(false);
    }
  };
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="department-auth"
          resid="475845337597"
          subtractH={230}
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
          dblinkname="ehr"
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          actionBarExtra={this.actionBarExtra}
        />
      </div>
    );
  }
}

export default DepartmentAuth;
