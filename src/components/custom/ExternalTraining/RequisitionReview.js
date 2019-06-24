import React from 'react';
import { TableData } from '../../common/loadableCommon';
import TabsTableData from '../TabsTableData';

function ReviewRequisition(props) {
  return (
    <div style={{ flex: 1, display: 'flex'}}>
      <TabsTableData
        arr={[
          {
            resid: 614449812342,
            TabsTitle: '待审核',
            OutHeight:"80vh",
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
            },
            subTableArrProps: [
              {
                subTableName: '计划详情',
                subResid: 611315248461,
                tableProps: {
                  hasAdd: false,
                  hasModify: false,
                  hasDelete: false,
                  hasRowModify: false,
                  hasRowView: true,
                  hasRowDelete: false,
                  height: 400,
                  subtractH: 196
                }
              }
            ]
          },
          {
            resid: 614449831159,
            TabsTitle: '已审核',
            OutHeight:"80vh",
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: false,
            hasRowDelete: false,
            hasRowModify: false,
            hasRowView: false,
            subtractH: 220,
            recordFormType: 'drawer',
            recordFormContainerProps: {
              placement: 'bottom',
              height: 600
            },
            subTableArrProps: [
              {
                subTableName: '计划详情',
                subResid: 611315248461,
                tableProps: {
                  hasAdd: false,
                  hasModify: false,
                  hasDelete: false,
                  hasRowModify: false,
                  hasRowView: true,
                  hasRowDelete: false,
                  height: 400,
                  subtractH: 196
                }
              }
            ]
          }
        ]}
      />
    </div>
  );
}

export default ReviewRequisition;
