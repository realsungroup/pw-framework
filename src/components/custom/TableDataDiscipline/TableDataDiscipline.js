import React from 'react';
import TableData from '../../common/data/TableData';

const  baseURL =
window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03BaseURL;
const downloadURL =
window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03DownloadBaseURL;
class TableDataDiscipline extends React.Component {
  constructor(props){
    super(props);
   
  }
  state = {
    visible: false,
    record: null,
    readOnly: true
  };

  //奖惩-查看个人违纪
componentDidMount = () =>{
  console.log(baseURL)
}
 
  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {

    return (
      <div
        className="table-data-wrap"
        style={{ height: '100vh' }}
      >
        <TableData
          baseURL={baseURL}
          downloadBaseURL = {downloadURL}
          resid={622206065690}
          subtractH={220}
          hasBeBtns={false}
          hasRowSelection={false}
          hasAdd={false}
          hasRowView={true}
          hasModify={false}
          hasRowDelete={false}
          hasDelete={false}
          hasRowModify={false}
          height="100%"
        />

      </div>
    );
  }
}

export default TableDataDiscipline 