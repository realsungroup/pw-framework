import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { message, Skeleton } from 'antd';
import http from 'Util20/api';
import './RBAVideoData.less';

class RBAVideoData extends React.Component {
  state={
    baseURL:'',
    baseURLDownload:''
  }
  componentDidMount = () => {
    var baseURL=window.pwConfig[
      process.env.NODE_ENV
    ].customURLs.onlineTrainning;
    var baseURLDownload=window.pwConfig[
      process.env.NODE_ENV
    ].customURLs.onlineTrainningDownload;
    this.setState({baseURL,baseURLDownload});
  }
    
  render() {
    return (
     <div className='RBAVideo'>
        <TableData
                  key="1"
                  baseURL={this.state.baseURL}
                  downloadBaseURL={this.state.baseURLDownload}
                  resid={640086187755}
                  subtractH={240}
                  hasAdd={false}
                  hasRowView={false}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasDelete={false}
                  hasModify={false}
                  hasRowModify={false}
                  hasRowSelection={false}
                  actionBarWidth={100}
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  refTargetComponentName="TableData"
            tableComponent="ag-grid"

                />
      </div>
    );
  }
}

export default RBAVideoData;
