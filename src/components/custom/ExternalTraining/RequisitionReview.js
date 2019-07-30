import React from 'react';
import TabsTableData from '../TabsTableData';
import { Button, message } from 'antd';
import http from 'Util20/api';

class ReviewRequisition extends React.Component {
  render() {
    return (
      <div style={{ flex: 1, display: 'flex' }}>
        <TabsTableData
          arr={[
            {
              resid: 614778527180,
              TabsTitle: '待提交',
              recordFormFormWidth: '90%',
              hasBeBtns: true,
              hasModify: false,
              hasDelete: false,
              hasAdd: false,
              hasRowDelete: false,
              hasRowModify: false,
              hasRowView: true,
              subtractH: 220,
              hasRowSelection: true,
              recordFormType: 'drawer',
              recordFormContainerProps: {
                placement: 'bottom',
                height: 600
              },
              OutHeight: '80vh',
              cmswhere : 'C3_613960304536 IS NULL',
              wrappedComponentRef: element => (this.tableDataRef = element),
              refTargetComponentName: 'TableData',
              actionBarExtra: records => {
                return (
                  <Button
                    onClick={async () => {
                      if (!records.selectedRowKeys.length) {
                        return message.error('请选择一条记录');
                      }
                      let keys = records.selectedRowKeys;
                      let selected = keys.map(item => {
                        let record = records.dataSource.find(i => {
                          return i.REC_ID === item;
                        });
                        return {
                          REC_ID: record.REC_ID,
                          C3_613960304536: 'Y'
                        };
                      });
                      let res;
                      try {
                        res = await http().modifyRecords({
                          resid: '613959487818',
                          data: selected
                        });
                        message.success(res.message);
                        this.tableDataRef.handleRefresh();
                      } catch (error) {
                        console.log(error);
                        message.error(error.message);
                      }
                    }}
                  >
                    通知
                  </Button>
                );
              }
            },
            {
              resid: 614449812342,
              TabsTitle: '待审核',
              OutHeight: '80vh',
              recordFormFormWidth: '90%',
              hasBeBtns: true,
              hasModify: false,
              hasDelete: false,
              hasAdd: false,
              hasRowDelete: false,
              hasRowModify: false,
              hasRowView: true,
              subtractH: 220,
              recordFormType: 'drawer',
              recordFormContainerProps: {
                placement: 'bottom',
                height: 600
              }
            },
            {
              resid: 614449831159,
              TabsTitle: '已审核',
              OutHeight: '80vh',
              recordFormFormWidth: '90%',
              hasBeBtns: true,
              hasModify: false,
              hasDelete: false,
              hasAdd: false,
              hasRowDelete: false,
              hasRowModify: false,
              hasRowView: true,
              subtractH: 220,
              recordFormType: 'drawer',
              recordFormContainerProps: {
                placement: 'bottom',
                height: 600
              }
            }
          ]}
        />
      </div>
    );
  }
}

export default ReviewRequisition;
