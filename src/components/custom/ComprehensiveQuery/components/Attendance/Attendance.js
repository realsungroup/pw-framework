import React from 'react';
import './WorkInfo.less';
import WorkInfo from './WorkInfo';


const activeClasssName = 'performance-query_nav_item__active';
const activeTargetItem = 'performance-query_item_nav_item__active';
class Attendance extends React.Component {
  constructor(props){
    super(props);
    this.state={
      currentNav: 'target',
      targetSelectItem: 'target',
      middleOfYearSelectItem: 'targetSelfAppraise',
      node:props.node[0]
    };
  }

  render() {
    return (
      <div className="performance-query">
        <WorkInfo node={this.state.node}></WorkInfo>

      </div>
    );
  }
}

export default Attendance;
