import React from 'react';
import './WorkInfo.less';
import WorkInfo from './WorkInfo';

const activeClasssName = 'performance-query_nav_item__active';
const activeTargetItem = 'performance-query_item_nav_item__active';
class Attendance extends React.Component {
  state = {
    currentNav: 'target',
    targetSelectItem: 'target',
    middleOfYearSelectItem: 'targetSelfAppraise'
  };

  render() {
    const { currentNav, targetSelectItem, middleOfYearSelectItem } = this.state;
    return (
      <div className="performance-query">
        <WorkInfo></WorkInfo>
      </div>
    );
  }
}

export default Attendance;
