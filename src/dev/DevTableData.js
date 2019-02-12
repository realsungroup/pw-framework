import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';

// 导入需要开发的组件
import TableData from 'Common/data/TableData';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <TableData
          title="调休登记"
          resid={596720928643}
          // width={1360}
          size="small"
          hasBeBtns={false}
          subtractH={180}
          actionBarFixed={true}
          advSearchContainerType="drawer"
          //hasRowEdit
          hasAdd={true}
          hasDelete={false}
          hasModify={false}
          hasRowModify={true}
          hasAdvSearch={true}
          // height={600}
          recordFormContainerProps={{
            // width: 800,
            height: 500,
            placement: 'bottom'
          }}
          formProps={{ displayMode: 'default', height: 400 }}
          recordFormType="drawer"
          // cmscolumns="C3_600449702200,C3_600449723545,C3_600449744490,C3_600449756846,C3_600449776309,C3_600449791836,C3_600449800714,C3_600449820713"
          recordFormName="default_rowTest"
          rowEditFormName="default_rowTest"
          // ['C3_600449702200', 'C3_600449702200']
          beforeSaveFields={[
            // 'C3_600449702200',
            'C3_600449723545',
            'C3_600449744490',
            'C3_600449756846',
            'C3_600449776309',
            'C3_600449791836',
            'C3_600449800714',
            'C3_600449820713'
          ]}
          subTableArrProps={[
            {
              subTableName: '子表',
              subResid: 596647249456,
              tableProps: {
                height: 350
              }
            }
          ]}
          hasResizeableBox={true}
          hasZoomInOut={false}
          bordered={true}
        />
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
