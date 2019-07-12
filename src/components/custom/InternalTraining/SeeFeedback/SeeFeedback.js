import React from 'react';
import './SeeFeedback.less';
import { TableData } from '../../../common/loadableCommon';
import { Button, Modal, Popconfirm, message, Card, Row, Col, Rate } from 'antd';
import http from 'Util20/api';

const InnerTrainPersonID = '616073391736';
class SeeFeedback extends React.Component {
  state = {
    seeFeedbackVisible: false, // 查看反馈模态窗状态
    records: {},  
    rate: {
      rate1: null,
      rate2: null,
      rate3: null,
      rate4: null,
      rate5: null,
      rate6: null,
      rate7: null,
      rate8: null
    }
  };
  getFeebackAndRate = async (records) => {
    const { rate } = this.state;
    let res; //课程反馈
    try {
      res = await http().getTable({
        resid: 478367996508,
        cmswhere: `C3_478368118696 =${records.CourseArrangeDetailID}`
      });
    } catch (err) {
      message.error(err)
    }
    if (res.data.length > 0) {
      const tempRate = { ...rate };
      tempRate.rate1 = res.data[0].C3_615639978971; //讲师备课充分
      tempRate.rate2 = res.data[0].C3_615640010121; //我认为课程主题准确，结构清晰，内容充实
      tempRate.rate3 = res.data[0].C3_615640043869; //所学的内容对实际工作有很大帮助
      tempRate.rate4 = res.data[0].C3_615640107592; //讲师语言表达能力好,讲解清楚生动,运用肢体语言
      tempRate.rate5 = res.data[0].C3_615640157603; // 讲师能够引入实际案例和例证,讲解透彻,激发学员思考
      tempRate.rate6 = res.data[0].C3_615640180269; //我能够积极参与到课堂中去
      tempRate.rate7 = res.data[0].C3_615640206802; //我的提问能够得到讲师认真,满意的答复
      tempRate.rate8 = res.data[0].C3_615640235456; //时间控制合理使我感到舒适
      this.setState({
        rate: tempRate
      });
    }
  };
  componentDidMount() {
  }

  render() {
    return (
      <React.Fragment>
        <TableData
          resid={InnerTrainPersonID}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          subtractH={240}
          hasBeBtns={true}
          hasAdd={false}
          hasRowView={false}
          hasRowDelete={true}
          hasRowEdit={false}
          hasDelete={false}
          hasModify={false}
          actionBarFixed={true}
          hasRowModify={false}
          hasRowSelection={true}
          customRowBtns={[
            records => {
              console.log('records', records);
              return (
                <Button
                  onClick={() => {
                    this.setState({
                      seeFeedbackVisible: true,
                    });
                    this.getFeebackAndRate(records)
                  }}
                  
                >
                  查看反馈
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
            this.setState({ seeFeedbackVisible: false });
          }}
          onCancel={() => {
            this.setState({ seeFeedbackVisible: false });
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
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}
export default SeeFeedback;
