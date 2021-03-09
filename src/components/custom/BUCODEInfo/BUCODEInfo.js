import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const baseURL = 'http://10.108.2.66:9091/';

class BUCODEInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};
  render() {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
        <Tabs defaultActiveKey="BUCODE">
          <TabPane tab="BU CODE信息" key="BUCODE">
            <TableData
              baseURL={baseURL}
              resid={668190417178}
              hasBeBtns={true}
              hasRowSelection={true}
              hasAdd={true}
              hasDelete={true}
              hasModify={false}
              hasRowDelete={true}
              hasRowModify={true}
              hasRowView={true}
              subtractH={170}
              style={{ height: 'calc(100vh - 60px)' }}
              refTargetComponentName="TableData"
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default BUCODEInfo;
