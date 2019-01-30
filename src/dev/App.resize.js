import React, { Component } from 'react';
import { Button, message } from 'antd';
import LevelResize from 'Common/data/OrgChartData/LevelsFilter/LevelResize';
class App extends Component {
  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <LevelResize />
      </div>
    );
  }
}

export default App;
