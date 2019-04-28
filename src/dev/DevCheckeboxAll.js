import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
import { Checkbox } from 'antd';
// 导入需要开发的组件，如：
// import TableData from 'Common/data/TableData';
// const plainOptions = ['Apple', 'Pear', 'Orange'];
// const defaultCheckedList = ['Apple', 'Orange'];
const CheckboxGroup = Checkbox.Group;
class App extends Component {
  constructor(props){
    super(props);
    this.state={
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      persons:[
        {
         number:'1',
         department:'事业部'
        },
        {
          number:'12',
          department:'事业部'
         },
         {
          number:'113',
          department:'事业部'
         },
         {
          number:'114',
          department:'事业部'
         },
         {
          number:'115',
          department:'事业部'
         },
         {
          number:'116',
          department:'事业部'
         },
         {
          number:'117',
          department:'事业部'
         },
      ]
    }
  }
  //checkboxgroup选中值的变化
  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < persons.length),
      checkAll: checkedList.length === persons.length,
    });
  }
  // 全选中时的变化
  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? persons:[],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  render() {
    return <TemplateWrap>
     <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全选
          </Checkbox>
        </div>
        <br />
        <CheckboxGroup options={this.state.persons} value={this.state.checkedList} onChange={this.onChange} />
    );
  }
}
    </TemplateWrap>;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
