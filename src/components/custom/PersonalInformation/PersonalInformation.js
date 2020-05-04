import React from 'react'
import TableData from 'Common/data/TableData';
import './PersonalInformation.less'
import { Button, message, Modal, Select, Input, Form } from 'antd';
import { LzModal, LzMenuForms } from '../loadableCustom';
import { RecordInput, DoctorList, OtherData } from '../loadableCustom';
import http from "../../../util20/api";


/**
 * 填写信息
 */
const customBtnStyle = {
  margin: '0 4px',
};
const Option = Select

class PersonalInformation extends React.Component {
  constructor() {
    super()
    this.state = {
      modalVisible: false,
      record: {},
      navListResidField: '',
      cdLen: {},
      ucLen: {},
      otherVisible: false,
      appLinks: []
    }
  }

  customRowBtns = [
    (record, size) => {
      return (
        <Button
          key="常见数据录入"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleInputCaseClick(record)}
        >
          常见数据录入
        </Button>
      );
    },
    (record, size) => {
      return (
        <Button
          key="其他数据录入"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleOtherCaseClick(record)}
        >
          其他数据录入
        </Button>
      );
    },
  ];

  //常用信息录入
  handleInputCaseClick = (record) => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      // navListResidField: 'C3_620929565473'
    });

    http().addRecords({
      resid: 641570651236, // 表资源 id
      data: [
        {
          tableNo: 640186569410,
          tableName: '血压检测',
        },
        {
          tableNo: 640452175220,
          tableName: '血糖检测',
        },
        {
          tableNo: 640452189185,
          tableName: '体温检测',
        }],
    });
  };


  //其他信息录入
  handleOtherCaseClick = (record) => {
    this.setState({
      otherVisible: true,
      record: { ...record },
      // navListResidField: 'C3_620929565473'
    });
  };

  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  handleOtherModalClose = () => {
    this.setState({ otherVisible: false });
  };

  render() {
    const { modalVisible, otherVisible, record } = this.state
    return (
      <div>
        <TableData
          resid={641576107105}
          subtractH={170}
          actionBarFixed={true}
          height={500}
          size='small'
          actionBarWidth={490}
          hasAdd={false}
          hasModify={false}
          hasDelete={false}
          hasRowDelete={true}
          hasRowView={false}
          hasBeBtns={true}
          rowModifyText="修改个人信息"
          enRowModifyText="Modify personal information"
          customRowBtns={this.customRowBtns}
        />
        {modalVisible && (
          <LzModal defaultScaleStatus="max" onClose={this.handleModalClose}>
            <RecordInput {...record} />
          </LzModal>
        )}
        {otherVisible && (
          <LzModal
            defaultScaleStatus="max"
            onClose={this.handleOtherModalClose}
          >
            {/* <RecordInput {...record} /> */}
            {/* <OtherData {...record} /> */}
            {/* <DoctorList {...record} /> */}
            <h1>请选择您要录入的科室</h1>
            <span>科室：</span>
            <Select style={{ width: '200px', marginLeft: '10px' }}>
              <Option value="常见数据录入">常见数据录入</Option>
            </Select>
            <Form style={{ width: "200px" }} className="otherData">
              <Form.Item label="常见数据录入">
                <Input defaultValue="血压检测" />
              </Form.Item>
              <Form.Item label="常见数据录入">
                <Input defaultValue="血糖检测" />
              </Form.Item>
              <Form.Item label="常见数据录入">
                <Input defaultValue="体温检测" />
              </Form.Item>
            </Form>
          </LzModal>
        )}
      </div>
    )
  }

}

export default PersonalInformation;