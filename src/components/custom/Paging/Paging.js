import React, { Component } from 'react';
import { Pagination } from 'antd';
import './Paging.less';
class Paging extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <div className="paging">
        <Pagination showQuickJumper  showSizeChanger/>,
      </div>
    );
  }
}

export default Paging;
