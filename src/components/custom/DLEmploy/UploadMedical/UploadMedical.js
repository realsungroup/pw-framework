import React from 'react';
import './UploadMedical.less';
import TabsTableData from '../../TabsTableData';
class UploadMedical extends React.Component {
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
            resid: 618666652590,
            TabsTitle: '上传体检报告',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            
            hasBeBtns: false,
            hasModify: false,
            hasDelete: true,
            hasAdd: true,
            hasRowDelete: false,
            hasRowModify: true,
            hasRowView: true,
            hasRowSelection:true,
            subtractH: 220,
            hasDownloadExcel:true,
            recordFormType:'drawer',
            formProps: {
              height: 550
            },
            recordFormContainerProps: {
              placement: 'bottom',
              height: 550
            },
            importConfig: {
              mode: 'fe',
              saveState: 'added',
              containerType: 'drawer'
            },
          },
          {
            baseURL:'http://kingofdinner.realsun.me:1201/',
            resid: 618666816692,
            TabsTitle: '体检未通过人员',
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
            formProps: {
              height: 550
            },
            importConfig: {
              mode: 'fe',
              saveState: 'added',
              containerType: 'drawer'
            },
            recordFormType: 'drawer',
            recordFormContainerProps: {
              placement: 'bottom',
              height: 700
            }
          }
        ]}
      />
    );
  }
}

export default UploadMedical;
