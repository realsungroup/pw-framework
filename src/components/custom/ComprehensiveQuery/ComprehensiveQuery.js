import React from 'react';
import TreeRel from '../../common/ui/TreeRel';
import './ComprehensiveQuery.less';

class ComprehensiveQuery extends React.Component {
  state = {
    node: []
  };
  setSelect = node => {
    this.setState({
      node
    });
  };
  render() {
    return (
      <div id="comprehensive-query">
        <TreeRel
          url="api/OrgChart/GetNodesData"
          resid="602348115218"
          ColumnOfID="C3_602347243263"
          ColumnOfPID="C3_602347244770"
          ProductIDs="1360564"
          autoExpandParent="true"
          onSelect={this.setSelect}
        />
        <div
          style={{
            height: 500,
            backgroundColor: '#fff',
            position: 'fixed',
            top: 0,
            // left: 'calc(100% - )',
            right: 0
          }}
        >
          asfd
        </div>
      </div>
    );
  }
}

export default ComprehensiveQuery;
