import React from 'react';
import TableData from 'Common/data/TableData';
import { Button, message, Modal, Select, Input, Form } from 'antd';
import { LzModal, LzMenuForms } from '../loadableCustom';
import { RecordInput, DoctorList, OtherData } from '../loadableCustom';
import http from '../../../util20/api';
import { Header } from '../loadableCustom';
import './MemberRequire.less';
import moment from 'moment';
import DivisionTable from '../PersonalInformation/DivisionTable';

/**
 * 填写信息
 */
const customBtnStyle = {
  margin: '0 4px',
};
const Option = Select;

class MemberRequire extends React.Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      record: {},
      navListResidField: '',
      cdLen: {},
      ucLen: {},
      otherVisible: false,
      appLinks: [],
      selectKey: '',
    };
  }

  customRowBtns = [
    (record, size) => {
      return (
        <Button
          key='常见数据录入'
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleInputCaseClick(record)}
        >
          常见数据查看
        </Button>
      );
    },
    (record, size) => {
      return (
        <Button
          key='其他数据录入'
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleOtherCaseClick(record)}
        >
          其他数据查看
        </Button>
      );
    },
  ];

  modifyViewTime = (record) => {
    if (!record.viewTime) {
      http()
        .modifyRecords({
          resid: 641582795393, // 表资源 id
          data: [
            {
              REC_ID: record.REC_ID,
              viewTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            },
          ],
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };

  //常用信息录入
  handleInputCaseClick = (record) => {
    this.modifyViewTime(record);
    this.setState({
      modalVisible: true,
      record: { ...record },
    });
  };

  //其他信息录入
  handleOtherCaseClick = (record) => {
    this.setState({
      otherVisible: true,
      record: { ...record },
    });
  };

  handleModalClose = () => {
    this.setState({ modalVisible: false, selectKey: '' });
  };

  handleOtherModalClose = () => {
    this.setState({ otherVisible: false });
  };

  handleCellClick = (value) => {
    this.setState({ otherVisible: false }, () => {
      // 100 ms 后再打开 modal，用户体验好一点
      setTimeout(() => {
        this.setState({ modalVisible: true, selectKey: value.substring(0, 2) });
      }, 100);
    });
  };

  render() {
    const { modalVisible, otherVisible, record, selectKey } = this.state;
    return (
      <div>
        <Header />
        <TableData
          resid={641582795393}
          subtractH={170}
          actionBarFixed={true}
          height={500}
          size='small'
          actionBarWidth={490}
          hasAdd={false}
          hasModify={false}
          hasDelete={false}
          hasRowDelete={false}
          hasRowView={false}
          hasBeBtns={true}
          hasRowModify={false}
          enRowModifyText='Modify personal information'
          customRowBtns={this.customRowBtns}
        />
        {modalVisible && (
          <LzModal defaultScaleStatus='max' onClose={this.handleModalClose}>
            <RecordInput
              {...record}
              selectKey={selectKey}
              mode='view'
              hasSavePharmacyBtn
            />
          </LzModal>
        )}
        {otherVisible && (
          <LzModal onClose={this.handleOtherModalClose}>
            <DivisionTable onCellClick={this.handleCellClick} />
          </LzModal>
        )}
      </div>
    );
  }
}

export default MemberRequire;
