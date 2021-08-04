import React from 'react';
import './SeeFeedback.less';
import { TableData } from '../../../common/loadableCommon';
import {
  Button,
  Modal,
  message,
  Card,
  Row,
  Col,
  Rate,
  Input,
  Form,
  Popconfirm,
  Collapse
} from 'antd';
import http from 'Util20/api';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

const InnerTrainID = '615549231946';
const InnerTrainPersonID = '616073391736';
const { TextArea } = Input;
const { Panel } = Collapse;

// C3_622485773574 发邮件
class SeeFeedback extends React.Component {
  state = {
    seeFeedbackVisible: false, //
    employeeFeedbackVisible: false,
    feedbackOverallVisible: false,
    sendToTrainerLoading: false,
    adoptBtnLoadingRECID: -1,
    // records: {},
    rate: {
      rate1: null,
      rate2: null,
      rate3: null,
      rate4: null,
      rate5: null,
      rate6: null,
      rate7: null,
      rate8: null
    },
    selectedCourseId: '',
    selectedCourse: { C3_622485660010: BraftEditor.createEditorState(null) },
    selectedCourseFeedbacks: [],
    otherAdvice: {
      advantages: '',
      shortcommings: ''
    },
    copied: false,
    allNotAdvantageData: '',
    allAdvantageData: ''
  };

  /**
   * 获取反馈及评分
   */
  getFeebackAndRate = async records => {
    const { rate } = this.state;
    let res; //课程反馈
    try {
      res = await http().getTable({
        resid: 478367996508,
        cmswhere: `C3_478368118696 =${records.CourseArrangeDetailID}`
      });
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
    if (res.data.length > 0) {
      const tempRate = { ...rate };
      const data = res.data[0];
      tempRate.rate1 = data.C3_615639978971; //讲师备课充分
      tempRate.rate2 = data.C3_615640010121; //我认为课程主题准确，结构清晰，内容充实
      tempRate.rate3 = data.C3_615640043869; //所学的内容对实际工作有很大帮助
      tempRate.rate4 = data.C3_615640107592; //讲师语言表达能力好,讲解清楚生动,运用肢体语言
      tempRate.rate5 = data.C3_615640157603; // 讲师能够引入实际案例和例证,讲解透彻,激发学员思考
      tempRate.rate6 = data.C3_615640180269; //我能够积极参与到课堂中去
      tempRate.rate7 = data.C3_615640206802; //我的提问能够得到讲师认真,满意的答复
      tempRate.rate8 = data.C3_615640235456; //时间控制合理使我感到舒适
      const otherAdvice = {
        shortcommings: data.C3_622216725340,
        advantages: data.C3_622216706104
      };
      this.setState({
        rate: tempRate,
        otherAdvice
      });
    }
  };

  /**
   * 获取课程所有反馈
   */
  getFeedbacks = async id => {
    try {
      const res = await http().getTable({
        resid: '478367996508',
        cmswhere: `C3_622480175852 = ${id}`
      });
      this.setState({
        selectedCourseFeedbacks: res.data
      });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  /**
   * 发给培训师
   */
  sendToTrainer = async data => {
    let obj = data;
    let str1 = obj.C3_622485660010;
    let str2 = obj.C3_622485682264;
    str1 = str1.replace(/~/g, '-');
    str2 = str2.replace(/~/g, '-');
    obj.C3_622485660010 = str1;
    obj.C3_622485682264 = str2;
    try {
      this.setState({
        sendToTrainerLoading: true
      });
      await http().modifyRecords({
        resid: InnerTrainID,
        data: [data]
      });
      this.setState({
        sendToTrainerLoading: false,
        feedbackOverallVisible: false,
        selectedCourse: {}
      });
      message.success('已发给培训师');
      this.tableDataRef.handleRefresh();
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  copy = id => {
    const copyEle = document.getElementById(id); // 获取要复制的节点
    const range = document.createRange(); // 创造range
    window.getSelection().removeAllRanges(); //清除页面中已有的selection
    range.selectNode(copyEle); // 选中需要复制的节点
    window.getSelection().addRange(range); // 执行选中元素
    const copyStatus = document.execCommand('Copy'); // 执行copy操作
    // 对成功与否定进行提示
    if (copyStatus) {
      message.success('复制成功');
    } else {
      message.fail('复制失败');
    }
    window.getSelection().removeAllRanges(); //清除页面中已有的selection
  };

  copyAll = async (selectedCourseFeedbacks, type = 'advantage') => {
    let pasteData = '';
    if (type === 'advantage') {
      selectedCourseFeedbacks.map(feedback => {
        pasteData = pasteData + '\n' + feedback.C3_622216706104;
      });
      await this.setState({
        allAdvantageData: pasteData
      });
    } else {
      selectedCourseFeedbacks.map(feedback => {
        pasteData = pasteData + '\n' + feedback.C3_622216725340;
      });
      await this.setState({
        allNotAdvantageData: pasteData
      });
    }
    var textNode = document.createElement('textarea');
    textNode.value = pasteData;
    document.body.appendChild(textNode);
    textNode.select();
    var res = document.execCommand('copy');
    document.body.removeChild(textNode);
    if (res) {
      message.success('复制成功');
    } else {
      message.fail('复制失败');
    }
  };

  renderFeedbackText = (feedback, type = 'advantage') => {
    return (
      <Row key={feedback.REC_ID}>
        <Col span={2}>
          <span
            style={{ color: 'blue' }}
            onClick={() => {
              this.copy(
                type === 'advantage'
                  ? feedback.REC_ID + 'a'
                  : feedback.REC_ID + 'b'
              );
            }}
          >
            复制
          </span>
        </Col>
        <Col span={2}>{feedback.C3_478368118915}</Col>
        <Col
          span={14}
          id={
            type === 'advantage' ? feedback.REC_ID + 'a' : feedback.REC_ID + 'b'
          }
        >
          {type === 'advantage'
            ? feedback.C3_622216706104
            : feedback.C3_622216725340}
        </Col>
      </Row>
    );
  };
  render() {
    const {
      selectedCourse,
      selectedCourseFeedbacks,
      sendToTrainerLoading
    } = this.state;
    return (
      <div className="internal-training_see-feed-back">
        <TableData
          resid={InnerTrainID}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          subtractH={240}
          actionBarWidth={260}
          hasBeBtns={true}
          hasAdd={false}
          hasRowView={false}
          hasRowDelete={false}
          hasRowEdit={false}
          hasDelete={false}
          hasModify={false}
          actionBarFixed={true}
          hasRowModify={false}
          hasRowSelection={true}
          customRowBtns={[
            record => {
              return (
                <Button
                  onClick={() => {
                    this.getFeedbacks(record.CourseArrangeID);
                    record.C3_622485660010 = BraftEditor.createEditorState(
                      record.C3_622485660010
                    );
                    record.C3_622485682264 = BraftEditor.createEditorState(
                      record.C3_622485682264
                    );

                    this.setState({
                      feedbackOverallVisible: true,
                      selectedCourse: record
                      // selectedCourse.C3_622485660010: BraftEditor.createEditorState(
                      //   selectedCourse.C3_622485660010
                      // ),
                    });
                  }}
                >
                  查看反馈总览
                </Button>
              );
            },
            record => {
              return (
                <Button
                  onClick={() => {
                    this.setState({
                      employeeFeedbackVisible: true,
                      selectedCourseId: record.CourseArrangeID
                    });
                  }}
                >
                  查看学员反馈
                </Button>
              );
            }
          ]}
        />
        <Modal
          title="查看反馈"
          visible={this.state.seeFeedbackVisible}
          width="70%"
          onOk={() => {
            this.setState({
              seeFeedbackVisible: false,
              otherAdvice: { advantages: '', shortcommings: '' }
            });
          }}
          onCancel={() => {
            this.setState({
              seeFeedbackVisible: false,
              otherAdvice: { advantages: '', shortcommings: '' }
            });
          }}
          centered
          destroyOnClose
        >
          <Card>
            <Card type="inner" title="讲师专业水平" className="cardinner">
              <Row>
                <Col span={12}>讲师备课充分，对授课内容非常了解</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate1} disabled />
                </Col>
              </Row>
            </Card>
            <Card type="inner" title="课程内容安排" className="cardinner">
              <Row>
                <Col span={12}>我认为课程主题准确，结构清晰，内容充实</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate2} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>所学的内容对实际工作有很大帮助</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate3} disabled />
                </Col>
              </Row>
            </Card>
            <Card type="inner" title="授课技巧" className="cardinner">
              <Row>
                <Col span={12}>
                  讲师语言表达能力好,讲解清楚生动,运用肢体语言
                </Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate4} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  讲师能够引入实际案例和例证,讲解透彻,激发学员思考
                </Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate5} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>我能够积极参与到课堂中去</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate6} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>我的提问能够得到讲师认真,满意的答复</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate7} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>时间控制合理使我感到舒适</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate8} disabled />
                </Col>
              </Row>
            </Card>

            <Row>
              <Col span={4} style={{ fontWeight: 600 }}>
                我很有收益的内容：
              </Col>
              <Col span={20}>{this.state.otherAdvice.advantages}</Col>
            </Row>
            <Row>
              <Col span={4} style={{ fontWeight: 600 }}>
                我希望改进的内容:
              </Col>
              <Col span={20}>{this.state.otherAdvice.shortcommings}</Col>
            </Row>
          </Card>
        </Modal>
        <Modal
          title="学员反馈"
          visible={this.state.employeeFeedbackVisible}
          width="90%"
          onOk={() => {
            this.setState({ employeeFeedbackVisible: false });
          }}
          onCancel={() => {
            this.setState({ employeeFeedbackVisible: false });
          }}
          centered
          destroyOnClose
        >
          <div style={{ height: 600 }}>
            <TableData
              resid={InnerTrainPersonID}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              subtractH={200}
              hasBeBtns={false}
              hasAdd={false}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              actionBarFixed={true}
              actionBarWidth={100}
              hasRowModify={false}
              hasRowSelection={true}
              cmswhere={`CourseArrangeID = '${this.state.selectedCourseId}'`}
              customRowBtns={[
                records => {
                  return (
                    <Button
                      onClick={() => {
                        this.setState({
                          seeFeedbackVisible: true
                        });
                        this.getFeebackAndRate(records);
                      }}
                    >
                      查看反馈
                    </Button>
                  );
                }
              ]}
            />
          </div>
        </Modal>
        <Modal
          title="课程反馈总览"
          visible={this.state.feedbackOverallVisible}
          width="90%"
          onCancel={() => {
            this.setState({
              feedbackOverallVisible: false,
              summary: {
                advantage: '',
                shortcomming: ''
              }
            });
          }}
          centered
          destroyOnClose
          footer={[
            <Button
              onClick={() =>
                this.setState({
                  feedbackOverallVisible: false,
                  selectedCourse: {}
                })
              }
            >
              取消
            </Button>,
            <Popconfirm
              title="确认发送？"
              onConfirm={() => {
                this.sendToTrainer({
                  REC_ID: selectedCourse.REC_ID,
                  C3_622485660010: BraftEditor.createEditorState(
                    selectedCourse.C3_622485660010
                  ).toHTML(),
                  C3_622485682264: BraftEditor.createEditorState(
                    selectedCourse.C3_622485682264
                  ).toHTML(),
                  C3_622485773574: 'Y'
                });
              }}
            >
              <Button loading={sendToTrainerLoading} type="primary">
                发给培训师
              </Button>
            </Popconfirm>
          ]}
        >
          <div>
            <h1 style={{ textAlign: 'center' }}>
              反馈人数：{selectedCourseFeedbacks.length}
            </h1>
            <div style={{ marginBottom: '12px' }}>
              <Card type="inner" title="讲师专业水平" className="cardinner">
                <Row>
                  <Col span={8}>讲师备课充分，对授课内容非常了解</Col>
                  <Col span={8}>
                    <Rate value={selectedCourse.C3_622480373149} disabled />
                  </Col>
                </Row>
              </Card>
              <Card type="inner" title="课程内容安排" className="cardinner">
                <Row>
                  <Col span={8}>我认为课程主题准确，结构清晰，内容充实</Col>
                  <Col span={8}>
                    <Rate value={selectedCourse.C3_622480393553} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>所学的内容对实际工作有很大帮助</Col>
                  <Col span={8}>
                    <Rate value={selectedCourse.C3_622480419356} disabled />
                  </Col>
                </Row>
              </Card>
              <Card type="inner" title="授课技巧" className="cardinner">
                <Row>
                  <Col span={8}>
                    讲师语言表达能力好,讲解清楚生动,运用肢体语言
                  </Col>
                  <Col span={8}>
                    <Rate value={selectedCourse.C3_622480440877} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    讲师能够引入实际案例和例证,讲解透彻,激发学员思考
                  </Col>
                  <Col span={8}>
                    <Rate value={selectedCourse.C3_622480463813} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>我能够积极参与到课堂中去</Col>
                  <Col span={8}>
                    <Rate value={selectedCourse.C3_622480487521} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>我的提问能够得到讲师认真,满意的答复</Col>
                  <Col span={8}>
                    <Rate value={selectedCourse.C3_622480505507} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>时间控制合理使我感到舒适</Col>
                  <Col span={8}>
                    <Rate value={selectedCourse.C3_622480523149} disabled />
                  </Col>
                </Row>
              </Card>
            </div>
            <Collapse>
              <Panel header="收益内容汇总" key="收益内容汇总">
                <span
                  style={{ color: 'blue' }}
                  onClick={() => {
                    this.copyAll(selectedCourseFeedbacks, 'advantage');
                  }}
                >
                  复制所有
                </span>
                {selectedCourseFeedbacks.map(feedback =>
                  this.renderFeedbackText(feedback, 'advantage')
                )}
              </Panel>
            </Collapse>
            <Form.Item required label="收益内容总结" labelCol={4}>
              <BraftEditor
                value={selectedCourse.C3_622485660010}
                onChange={e => {
                  this.setState({
                    selectedCourse: {
                      ...selectedCourse,
                      C3_622485660010: e
                    }
                  });
                }}
              />

              {/* <TextArea
                placeholder="收益内容总结"
                rows={4}
                value={selectedCourse.C3_622485660010}
                onChange={e => {
                  this.setState({
                    selectedCourse: {
                      ...selectedCourse,
                      C3_622485660010: e.target.value
                    }
                  });
                }}
              /> */}
            </Form.Item>
            <Collapse>
              <Panel header="改进内容汇总" key="改进内容汇总">
                <span
                  style={{ color: 'blue' }}
                  onClick={() => {
                    this.copyAll(selectedCourseFeedbacks, 'notAdvantage');
                  }}
                >
                  复制所有
                </span>
                {selectedCourseFeedbacks.map(feedback =>
                  this.renderFeedbackText(feedback, 'shortcomming')
                )}
              </Panel>
            </Collapse>
            <Form.Item required label="改进内容总结" labelCol={4}>
              <BraftEditor
                value={selectedCourse.C3_622485682264}
                onChange={e => {
                  this.setState({
                    selectedCourse: {
                      ...selectedCourse,
                      C3_622485682264: e
                    }
                  });
                }}
              />
              {/* <TextArea
                placeholder="改进内容总结"
                rows={4}
                value={selectedCourse.C3_622485682264}
                onChange={e => {
                  this.setState({
                    selectedCourse: {
                      ...selectedCourse,
                      C3_622485682264: e.target.value
                    }
                  });
                }}
              /> */}
            </Form.Item>
          </div>
        </Modal>
      </div>
    );
  }
}
export default SeeFeedback;
