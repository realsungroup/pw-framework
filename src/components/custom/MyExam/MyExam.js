import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Modal, Button, message } from 'antd';
import './MyExam.less';
import http from 'Util20/api';
import moment from 'moment';
// import { withRouter } from 'react-router-dom';

class MyExam extends Component {
  state = {
    selectedRecord: null,
    modalVisible: false
  };

  handleJoinConfirm = record => {
    Modal.confirm({
      title: '提示',
      content: '您确定要参加考试吗？',
      onOk: () => this.handleJoinExam(record)
    });
  };

  handleJoinExam = async record => {
    // 向考试批次表（主表）和 考试批次答题表中添加

    // 考试安排编号
    const arrangeNum = record.C3_607197284004;
    // 试卷编号
    const examNum = record.C3_609936321951;
    // 人员编号
    const personNum = record.C3_607197253817;

    // 记录 id
    const myExamRecid = record.REC_ID;

    // 通过试卷编号获取试卷题目
    let res;
    try {
      res = await http().getTable({
        resid: 607188996053,
        cmswhere: `C3_607172879503 = '${examNum}'`
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    const questions = res.data; // 题目

    // 项考试批次表（主表）和考试批次答题表（子表）中插入数据
    const dataObj = {
      resid: 608809112309, // 主表 id
      maindata: {
        // 添加的主表记录
        _state: 'added',
        C3_607195889817: arrangeNum,
        C3_607195947239: examNum,
        C3_607195966239: personNum,
        C3_609958684582: moment().format('YYYY-MM-DD HH:mm:ss'), // 进入时间
        _id: 1
      },
      subdata: [] // 子表数据
    };

    questions.forEach((question, index) => {
      const subdataObj = {
        resid: 607270079025,
        maindata: {
          C3_607174660929: personNum,
          C3_607174324165: question.C3_607026334772, // 题目编号
          _id: index + 1,
          _state: 'added'
        }
      };
      dataObj.subdata.push(subdataObj);
    });

    try {
      res = await http().saveRecordAndSubTables({
        data: [dataObj]
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }

    // 验证后端返回的数据是否有错误
    try {
      if (!res.data.length) {
        throw new Error('操作失败');
      }
      const record = res.data[0];
      if (record.maindata.message) {
        throw new Error(record.maindata.message);
      }
      let message;
      for (let i = 0; i < record.subdata.length; i++) {
        if (record.subdata[i].maindata.message) {
          message = record.subdata[i].maindata.message;
          break;
        }
      }
      if (message) {
        throw new Error(message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }

    // 考试批次编号
    const examBatchNum = res.data[0].maindata.C3_607196596723;

    window.location.href = `/fnmodule?resid=考试页面&recid=608295659960&type=考试系统&title=考试页面&examnum=${examNum}&exambatchnum=${examBatchNum}&arrangenum=${arrangeNum}&personnum=${personNum}&myexamrecid=${myExamRecid}`;
  };

  render() {
    const { selectedRecord, modalVisible } = this.state;
    return (
      <div>
        <TableData
          resid={609931927812}
          hasRowModify={false}
          hasRowView={false}
          hasRowDelete={false}
          hasAdd={false}
          hasModify={false}
          hasDelete={false}
          height={500}
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Button
                  key={'考试记录'}
                  onClick={() =>
                    this.setState({
                      selectedRecord: record,
                      modalVisible: true
                    })
                  }
                  style={{ margin: '0 4px' }}
                >
                  考试记录
                </Button>
              );
            },
            (record, btnSize) => {
              return (
                record.C3_610137428463 > 0 && (
                  <Button
                    key={'参加考试'}
                    onClick={() => this.handleJoinConfirm(record)}
                    style={{ margin: '0 4px' }}
                  >
                    参加考试
                  </Button>
                )
              );
            }
          ]}
        />
        {selectedRecord && (
          <Modal
            visible={modalVisible}
            footer={null}
            title="考试记录"
            onCancel={() => this.setState({ modalVisible: false })}
            width="100%"
            destroyOnClose
          >
            <TableData
              resid={608809112309}
              hasRowModify={false}
              hasRowDelete={false}
              hasAdd={false}
              hasModify={false}
              hasDelete={false}
              height={500}
              width="100%"
              cmswhere={`C3_607195966239 = '${selectedRecord.C3_607197253817}'`}
            />
          </Modal>
        )}
      </div>
    );
  }
}

export default MyExam;
