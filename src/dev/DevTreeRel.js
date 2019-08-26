import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import TreeRel from '../components/common/ui/TreeRel';
// 实例化时必须传入的数据

// {
// el:DOM,
// resid:str,
// ColumnOfID:str,
// ColumnOfPID:str,
// ProductIDs:str
// }

// 这是要将组建渲染进去的外层元素

class App extends Component {

  render() {
    return (
      <TemplateWrap>

          <TreeRel
            url='api/OrgChart/GetNodesData'
            resid='602348115218'
            ColumnOfID='C3_602347243263'
            ColumnOfPID='C3_602347244770'
            ProductIDs='1360564'
            autoExpandParent='true'
          ></TreeRel>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
