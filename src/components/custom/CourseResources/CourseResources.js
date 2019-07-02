import React, { Component } from 'react';
import './CourseResources.less';
import { TableData } from '../../common/loadableCommon';


class CourseResources extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }
  render() {
    return (
      <div className='courseResources'>
         <TableData></TableData>
      </div>
    );
  }
}

export default CourseResources;
