import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import OrgChartData from 'Common/data/OrgChartData';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <OrgChartData
          resid={602348115218}
          template="rony"
          chartId="org-chart"
          chartWrapId="org-chart-wrap"
          level={3}
          isExpandAllChildren={true}
          pidField="C3_602347244770"
          idField="C3_602347243263"
          enableDragDrop
          showFields={{
            field_0: 'C3_602347243459',
            field_1: 'C3_602347246317',
            field_2: 'C3_602347244217',
            field_3: 'C3_602347243840',
            field_4: 'C3_602347242079',

            img_0: 'C3_602350177952'
          }}
          recordFormContainerProps={{ width: 500 }}
          rootIds={[61, 67]}
          rootIdsResid={602348168470}
        />
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
