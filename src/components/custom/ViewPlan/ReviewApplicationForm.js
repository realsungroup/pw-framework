import React from 'react';
import TabsTableData from '../TabsTableData';

const ReviewApplicationForm = props => {
  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <TabsTableData
        arr={[
          {
            resid: 614449770755,
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
            formProps: {
              height: 550
            },
            recordFormContainerProps: {
              placement: 'bottom',
              height: 600
            }
          },
          {
            resid: 614449790350,
            TabsTitle: '已审核',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: false,
            hasRowDelete: false,
            hasRowModify: false,
            hasRowView: false,
            subtractH: 220,
            formProps: {
              height: 550
            },
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
};

export default ReviewApplicationForm;
