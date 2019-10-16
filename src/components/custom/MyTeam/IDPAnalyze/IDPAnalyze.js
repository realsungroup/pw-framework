import React from 'react';
import './IDPAnalyze.less';
import http from 'Util20/api';
import EchartsOfReact from 'echarts-of-react';
import { BIGrid } from 'lz-components-and-utils/lib/index';

import { Tabs } from 'antd';
const { TabPane } = Tabs;


class IDPAnalyze extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    selectedMonth:'',
    selectedPersonid:''
  };

  render() {
    const { selectedPersonid, selectedMonth} = this.state;
    return (
      <div className="idp-analyze">
      <BIGrid
        height={'100%'}
        gridProps={[
          {
            resid: '624039666618',
            baseURL: 'http://10.108.2.66:1001/',

          }
        ]}
      />

      </div>
    );
  }
}

export default IDPAnalyze;
