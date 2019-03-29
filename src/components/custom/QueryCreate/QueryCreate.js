import React, { Component } from 'react';
import './QueryCreate.less';
import { Button, Input } from 'antd';
class QueryCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
 
  render() {
    return (
      <div className="querycreate">
          <div className="createname">调查名称:<Input className="nameInp"/></div>
          <div className="createstyle">
           <Button type="primary" size="large">立即创建</Button>
           <Button type="primary"  size="large">导入创建</Button>
          </div>
      </div>
    );
  }
}

export default QueryCreate;