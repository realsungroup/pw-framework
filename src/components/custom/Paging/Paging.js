import React, { Component } from 'react';
import { Pagination } from 'antd';
import './Paging.less';
class Paging extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  // pageChange = (pagenumber) =>{
  //   console.log("跳转到了"+pagenumber+"页")
  // }
  render() {
    return (
      <div className="paging">
        <Pagination showQuickJumper defaultCurrent={2} total={500}  />,
      </div>
    );
  }
}

export default Paging;
