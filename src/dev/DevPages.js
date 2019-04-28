import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
import { Pagination } from 'antd';
// 导入需要开发的组件，如：
// import TableData from 'Common/data/TableData';

let data = [];
const count = 60;
for (let i = 0; i < count; i++) {
  data.push({
    name: i,
    age: 18
  });
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data,
      current:1,
      pageSize:5,
    };
  }
  handlepageChange = (current,pagesize)=>{
    console.log(current,pagesize)
  }
  render() {
    return (
      <TemplateWrap>
        <ul style={{height:'800'}}>
          {this.state.data.map((item, index) => {
            return (
              <li
                key={index}
                style={{ display: 'flex', justifyContent: 'space-around' }}
              >
                <span>{item.name}</span>
                <span>{item.age}</span>
              </li>
            );
          })}
        </ul>
        <div style={{textAlign:'center'}}>
          <Pagination total={this.state.data.length} showSizeChanger showQuickJumper pageSizeOptions={[5,10,15,]} onChange={()=>{this.handlepageChange(this.state.current,this.state.pageSize)}} showLessItems={true}/>
          </div>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
