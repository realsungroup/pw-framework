import React from 'react';
import './InternalTrainingAuth.less';
import TableData from 'Common/data/TableData';

const baseURLDownload =
  window.pwConfig[process.env.NODE_ENV].customURLs.onlineTrainningDownload;
class InternalTrainingAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TableData
        resid={640021774020}
        downloadBaseURL={baseURLDownload}
        baseURL={this.props.baseURL}
        recordFormFormWidth="90%"
        hasBeBtns={true}
        hasModify={true}
        hasDelete={true}
        hasAdd={true}
        hasRowDelete={false}
        hasRowModify={false}
        hasRowView={false}
        subtractH={180}
        noWidthFields='ID'
        isSetColumnWidth={false}
        formProps={{ height: 550 }}
      />
    );
  }
}

export default InternalTrainingAuth;
