import React from 'react';
import ComprehensiveQuery from './ComprehensiveQuery';
import './ComprehensiveQuery.less';

class ComprehensiveQueryIndex extends React.Component {
  state = {
    target: 0
  };

  render() {
    const { target } = this.state;
    return target === 0 ? (
      <div id="">
        <div
          style={{ width: 100, height: 100, border: '1px solid #000' }}
          onClick={() => {
            this.setState({
              target: 1
            });
          }}
        >
          1
        </div>
      </div>
    ) : (
      <ComprehensiveQuery />
    );
  }
}

export default ComprehensiveQueryIndex;
