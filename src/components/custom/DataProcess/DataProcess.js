import React from 'react';
import './DataProcess.less';
import ProcessData from '../../common/data/ProcessData';

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.DataProcessBaseURL;

class DataProcess extends React.Component {
  render() {
    return (
      <div className="data-process">
        <ProcessData
          resid="629373035772"
          baseURL={baseURL}
          taskidField="C3_628275595259"
          titleField="C3_629371875049"
          descriptionField="C3_629371937304"
          taskReturnField="C3_627494984765"
          currentCountText="完成人数"
          totalCountText="总人数"
        />
      </div>
    );
  }
}

export default DataProcess;
