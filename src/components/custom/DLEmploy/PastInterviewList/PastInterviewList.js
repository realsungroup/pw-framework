import React from 'react';
import './PastInterviewList.less';
import TabsTableData from '../../TabsTableData'
class PastInterviewList extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    SquareCardArr: [],
    val: null
  };
  render() {
    return (
      <TabsTableData
        arr={[
          {
            baseURL:'http://kingofdinner.realsun.me:1201/',
            resid: 618666297012,
            TabsTitle: '未通知录用人员',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: true,
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
            baseURL:'http://kingofdinner.realsun.me:1201/',
            resid: 618666595021,
            TabsTitle: '已通知录用人员',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: true,
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
    );
  }
}

export default PastInterviewList;
