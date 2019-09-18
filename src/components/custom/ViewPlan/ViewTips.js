import React from 'react';
import {
  Button,
  message,
  Modal,
	Divider,
	Empty,
  Card,
  Row,
  Col,
  Rate,
  DatePicker,
  InputNumber
} from 'antd';
import moment from 'moment';
import { TableData } from '../../common/loadableCommon';
import http from 'Util20/api';

const CourseArrangementDetailResid = '616245136209';
const TIPS_RESID = '614964195659'; //心得表id

class ViewTips extends React.Component {
  state = {
    viewActionsVisible: false,
    selectedCourseArrangmentDetail: {},
    tips: {}
  };

  getTips = async () => {
    const { selectedCourseArrangmentDetail } = this.state;
    try {
      let res = await http().getTable({
        resid: TIPS_RESID,
        cmswhere: `C3_615479417558 = ${selectedCourseArrangmentDetail.CourseArrangeDetailID}`
      });
      if (res.data.length) {
        this.setState({ tips: { ...res.data[0] } });
      }
    } catch (error) {
      message.error(error.message);
      console.log(error.message);
    }
  };

  //关闭模态窗
  handleCloseModal = () =>
    this.setState({
      viewActionsVisible: false,
      selectedCourseArrangmentDetail: {},
      tips: {}
    });

  //下载查阅
    handleDownMaterial = url => {
      if (!url) {
        return Modal.warning({
          title: '还未上传心得'
        });
      }
      const urls = url.split(';file;');
      for (let i = 0, len = urls.length; i < len; i++) {
        window.open(urls[i]);
      }
    };
  render() {
    let { tips } = this.state;
    return (
      <div style={{ flex: 1, height: '100%' }}>
        <TableData
          resid={CourseArrangementDetailResid}
          subtractH={240}
          hasRowView={false}
          hasAdd={false}
          hasModify={false}
          hasDelete={false}
          hasRowSelection={true}
          hasRowDelete={false}
          hasRowModify={false}
					actionBarWidth={150}
          customRowBtns={[
            (record,btnSize) => {
              return (
                <Button
                  onClick={() => {
                    this.setState(
                      {
                        viewActionsVisible: true,
                        selectedCourseArrangmentDetail: record
                      },
                      this.getTips
                    );
                  }}
                >
                  查看心得
                </Button>
              );
            },
            (record, btnSize) => {
              return (
                <Button
                  onClick={() => {
                    this.handleDownMaterial(record.Filepath);
                  }}
                >
                  下载查阅
                </Button>
              );
            }
          ]}
          cmswhere={`courseType <> '外聘内训'`}
        />
        <Modal
          title="查看心得"
          visible={this.state.viewActionsVisible}
          onCancel={this.handleCloseModal}
          onOk={this.handleCloseModal}
          width="70%"
          destroyOnClose
        >
          {tips.C3_614964225030?<div style={{ padding: 12 }}>
            {/* 标题 */}
            <h2 style={{ textAlign: 'center' }}>{tips.C3_614964239022}</h2>
            <Divider />
            {/* 内容 */}
            <pre>{tips.C3_614964225030}</pre>
          </div>: <Empty description='未提交心得'></Empty>}
        </Modal>
      </div>
    );
  }
}

export default ViewTips;
