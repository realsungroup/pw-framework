
import React, { Component } from 'react';
import './ReferenceCheck.less';
import http from 'Util20/api';

/**
 * 管理员确认
 */
class ReferenceCheck extends React.Component {
  state = {
  };
  render() {
    return (
      <div className='reference'>
        <div id='toPrint'>
          <div style={{width:'842px',position:'absolute',left:'50%',marginLeft:'-421px'}}>
            <h3 style={{fontSize:'20px',textAlign:'center'}}>Reference Check</h3>

            <b>Candidate’s Name：</b><input type='text' style={{outline:'none',border:'none',borderBottom:'1px solid #000'}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default ReferenceCheck;
