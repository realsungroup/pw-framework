import React from 'react';
import './InternalTrainingAuth.less';
import TableData from 'Common/data/TableData';

class InternalTrainingAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { downloadBaseURL } = this.props;
    return (
      <TableData
        downloadBaseURL={downloadBaseURL}
        resid={640021774020}
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
        noWidthFields="ID"
        isSetColumnWidth={false}
        formProps={{ height: 550 }}
      />
    );
  }
}

export default InternalTrainingAuth;
