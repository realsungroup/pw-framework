import React from 'react';
import './DepartmentAuth.less';
import { Button, message, Popconfirm } from 'antd';
import TableData from '../../../common/data/TableData';

/*
 * 部门独立授权
 */

class DepartmentAuth extends React.Component {
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="invalid-application-form"
          resid="475845337597"
          subtractH={200}
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
          actionBarExtra={record => (
            <div className="">
              <Popconfirm
                title="禁用独立授权？"
                onConfirm={() => {
                  if (record.selectedRowKeys.length) {
                    this.onMoveEmployees(record);
                  } else {
                    this.setState({
                      selectCourseArrangementVisible: false
                    });
                    message.error('请选择至少一条记录');
                  }
                }}
              >
                <Button>启用独立授权</Button>
              </Popconfirm>
              <Popconfirm
                title="禁用独立授权？"
                onConfirm={() => {
                  if (record.selectedRowKeys.length) {
                    this.onMoveEmployees(record);
                  } else {
                    this.setState({
                      selectCourseArrangementVisible: false
                    });
                    message.error('请选择至少一条记录');
                  }
                }}
              >
                <Button>禁用独立授权</Button>
              </Popconfirm>
            </div>
          )}
        />
      </div>
    );
  }
}

export default DepartmentAuth;
