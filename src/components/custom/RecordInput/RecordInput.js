import React from 'react';
// import { propTypes, defaultProps } from './propTypes';
// import TableData from 'Common/data/TableData';
import './RecordInput.less';
import { Button, message, Modal, Form, Row, Col, Input } from 'antd';
import { LzModal, LzMenuForms } from '../loadableCustom';
import http, { makeCancelable } from 'Util20/api';

const customBtnStyle = {
  margin: '0 4px',
};

/**
 * 患者信息
 */
 
class RecordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // const { tableDataProps } = this.props;
    console.log(this.props);
    return (
      <div className="DataPut">
        <h2 style={{ marginLeft: '9px' }}>常见信息录入</h2>
        <div className >
        <Input></Input>
        </div>
       
      </div>
    );
  }
}

export default RecordInput;
