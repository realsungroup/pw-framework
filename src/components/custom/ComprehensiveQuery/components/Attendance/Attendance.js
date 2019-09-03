import React from 'react';
import './WorkInfo.less';
import WorkInfo from './WorkInfo';

class Attendance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNav: 'target',
      targetSelectItem: 'target',
      middleOfYearSelectItem: 'targetSelfAppraise',
      node: props.node
    };
  }

  render() {
    return (
      <div className="performance-query">
        <WorkInfo person={this.props.node}></WorkInfo>
      </div>
    );
  }
}

export default Attendance;
