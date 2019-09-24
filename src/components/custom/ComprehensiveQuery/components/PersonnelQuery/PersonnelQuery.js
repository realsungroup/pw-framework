import React from 'react';
import './PersonnelQuery.less';
import PersonInfo from './PersonInfo';

class PersonnelQuery extends React.Component {
  render() {
    return (
      <div className="performance-query">
        <PersonInfo person={this.props.node} />
      </div>
    );
  }
}

export default PersonnelQuery;
