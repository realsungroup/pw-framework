import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import AdvSearch from '../components/common/ui/AdvSearch';
// 导入需要开发的组件
import TableData from 'Common/data/TableData';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
class App extends Component {
  
  render() {
    const props={resid: 610311177773,
      recordFormFormWidth: '90%',
      hasBeBtns: true,
      hasModify: false,
      hasDelete: false,
      hasAdd: false,
      hasRowDelete: false,
      hasRowModify: false,
      hasRowView: false,
      subtractH: 190,
      // height:600,
      formProps: {
        height: 500
      },
      recordFormType: 'drawer',
      recordFormContainerProps: {
        placement: 'bottom',
        height: 600
      },
      subTableArrProps: [
        {
          subTableName: '员工成绩',
          subResid: 608809112309,
          tableProps: {
            hasAdd: false,
            hasModify: false,
            hasRowDelete: false,
            hasRowModify: false,
            hasDelete: false,
            subtractH: 190,
            height: 500,
            hasRowView: false
          }
        }
      ]}
    return (
      <TemplateWrap>
        <div
          style={{
            width: 600,
            height: 600,
            marginLeft: 20,
            border: '1px solid #000'
          }}
        >
           <div style={{ height: '100vh' }}>
        <TableData
          {...props}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          customRowBtns={[
            (record, btnSize) => {
              return (
               
                  <Button size={btnSize}>图表分析</Button>
               
              );
            }
          ]}
        />
      </div>
        </div>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
