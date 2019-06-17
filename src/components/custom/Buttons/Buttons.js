import React from 'react';
import { TableData } from '../../common/loadableCommon';
import {Button} from 'antd'

class Buttons extends React.Component{
  render(){
    return (
      <div className="table-data-wrap" style={{height: 'calc(100vh - 220px)'}}>
       <Button>点击</Button>
      </div>
    )
  }
}

export default Buttons;