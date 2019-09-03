import React from 'react';
import './PersonnelQuery.less';
import PersonInfo from './PersonInfo';

const activeClasssName = 'performance-query_nav_item__active';
const activeTargetItem = 'performance-query_item_nav_item__active';
class PersonnelQuery extends React.Component {
  state = {
    currentNav: 'target',
    targetSelectItem: 'target',
    middleOfYearSelectItem: 'targetSelfAppraise'
  };

  render() {
    const { currentNav, targetSelectItem, middleOfYearSelectItem } = this.state;
    return (
      <div className="performance-query">
        <PersonInfo person={this.props.node}></PersonInfo>
      </div>
    );
  }
}

export default PersonnelQuery;
