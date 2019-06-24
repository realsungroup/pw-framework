import React from 'react';
import { TableData } from '../../common/loadableCommon';
import TabsTableData from '../TabsTableData';

function ReviewRequisition(props) {
  return (
    <div style={{ flex: 1, display: 'flex'}}>
      <TabsTableData
        arr={[
          {
            resid: 613959487818,
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
            recordFormType: 'drawer',
            recordFormContainerProps: {
              placement: 'bottom',
              height: 600
            },
          },
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
          }
        ]}
      />
    </div>
  );
}

export default ReviewRequisition;
