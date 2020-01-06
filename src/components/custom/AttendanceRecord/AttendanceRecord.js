import React, { Component } from 'react'
import './AttendanceRecord.less'
import TabsTableData from '../TabsTableData';


 class AttendanceRecord extends Component {
  render() {
    return (
      <div>
        <TabsTableData
          arr={[
            {
              wrappedComponentRef: element => (this.tableDataRef = element),
              refTargetComponentName: 'TableData',
              resid: 622220868503,
              TabsTitle: '内训签到记录',
              OutHeight: '91vh',
              recordFormFormWidth: '90%',
              hasBeBtns: false,
              hasModify: false,
              hasDelete: false,
              hasAdd: false,
              hasRowDelete: false,
              hasRowSelection: false,
              hasRowModify: false,
              hasRowView: true,
              subtractH: 220,
              actionBarWidth: 220,
              recordFormType: 'drawer',
              formProps: {
                height: 650
              },
              recordFormContainerProps: {
                placement: 'right',
                height: 700
              }
            },
            {
              resid: 631379198782,
              TabsTitle: '外聘内训签到记录',
              OutHeight: '91vh',
              recordFormFormWidth: '90%',
              hasBeBtns: true,
              hasModify: false,
              hasDelete: false,
              hasAdd: false,
              hasRowDelete: false,
              hasRowModify: false,
              hasRowView: true,
              subtractH: 220,
              actionBarWidth: 220,
              formProps: {
                height: 650
              },
              recordFormType: 'drawer',
              recordFormContainerProps: {
                placement: 'right',
                height: 700
              }
            }
          ]}
        />
      </div>
    )
  }
}
export default AttendanceRecord;