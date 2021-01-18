import React, { Component } from 'react';
import TableData from '../../common/data/TableData';

class OnDutyTrainingApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainerName: ''
    };
  }

  componentDidMount = () => {
    const applyinfo = JSON.parse(localStorage.getItem('userInfo'));
    this.setState({
      trainerName: applyinfo.Data
    });
  };
  render() {
    const { trainerName } = this.state;
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
        <TableData
          resid={664295226124}
          cmswhere={`trainer = '${trainerName}'`}
          hasBeBtns={true}
          hasRowSelection={true}
          hasAdd={false}
          hasDelete={false}
          hasModify={false}
          hasRowDelete={false}
          hasRowModify={false}
          hasRowView={false}
          style={{ height: '100%' }}
          refTargetComponentName="TableData"
        />
      </div>
    );
  }
}

export default OnDutyTrainingApp;
