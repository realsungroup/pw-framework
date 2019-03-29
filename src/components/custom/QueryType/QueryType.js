import React, { Component } from 'react';
import './QueryType.less';
import { Icon } from 'antd';
import { router } from 'sw-toolbox';
class QueryType extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // pageChange = (pagenumber) =>{
  //   console.log("跳转到了"+pagenumber+"页")
  // }
  render() {
    return (
      <div className="querytype">
        <h1 style={{ color: '#0086ff', textAlign: 'center' }}>
          请选择创建问卷的类型
        </h1>
        <ul className="type-box">
          <li className="typecar">
            <div className="typecar-top">
              <div className="iconbox">
                <Icon type="file-search" className="caricon" />
              </div>
              <div className="txt">
                <span className="title">调查</span>
                <br />
                <span>丰富题型，强大逻辑</span>
                <br />
                <span>丰富题型，强大逻辑</span>
              </div>
            </div>
            <div className="typecar-bottom">
            <div className="create">创建</div>
            </div>
          </li>
          <li className="typecar">
          <div className="typecar-top">
              <div className="iconbox">
                <Icon type="solution" className="caricon" />
              </div>
              <div className="txt">
                <span className="title">投票</span>
                <br />
                <span>丰富题型，强大逻辑</span>
                <br />
                <span>丰富题型，强大逻辑</span>
              </div>
            </div>
            <div className="typecar-bottom">
            <div className="create">创建</div>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default QueryType;
