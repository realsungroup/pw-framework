import React from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  message
} from 'antd';
import { getItem } from 'Util/util';
import moment from 'moment';
import http from 'Util20/api';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};
const { TextArea } = Input;
const { Option } = Select;
class CustomForm2 extends React.Component {
  state = {
    currentUser: JSON.parse(getItem('userInfo')).Data,
    currentTime: moment().format('YYYY-MM-DD HH:mm:ss')
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      let { startTime, endTime, reason } = values;
      if (!startTime && !startTime) {
        return message.info('至少选择上、下班时间中的一个');
      }
      try {
        let res = await http().addRecords({
          resid: '449440966625',
          data: [
            {
              C3_449349153817: 40, //项目编号
              C3_449663289150: reason, //事由
              C3_449349070185: startTime && startTime.format('YYYY-MM-DD'), //开始日期
              C3_449349087938: startTime && startTime.format('HH'), //开始小时
              C3_449349105582: startTime && startTime.format('mm'), //开始分钟
              C3_449349077689: endTime && endTime.format('YYYY-MM-DD'), //结束日期
              C3_449349100590: endTime && endTime.format('HH'), //结束小时
              C3_449349105691: endTime && endTime.format('mm'), //结束分钟
              C3_479576033832: startTime && 'Y',
              C3_479576038621: endTime && 'Y'
            }
          ],
          dblinkname: 'ehr'
        });
        message.success(res.message);
        this.props.goBack();
        this.props.getNotices();
      } catch (error) {
        console.log(error);
        message.error(error.message);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { currentUser, currentTime } = this.state;
    return (
      <div className="attendace-aplly_form__wrapper">
        <Form className="attendace-aplly_form" onSubmit={this.handleSubmit}>
          <h2>补刷卡申请单</h2>
          <Row style={{ fontWeight: 600, marginBottom: 32 }}>
            <Col span={8}>填单人：{currentUser}</Col>
            <Col span={16}>填单时间：{currentTime}</Col>
          </Row>

          <Form.Item
            {...formItemLayout}
            label="上班时间："
            help={
              <span style={{ color: '#f22735' }}>
                选择上班时间即代表补上班卡点
              </span>
            }
          >
            {getFieldDecorator('startTime', {})(<DatePicker showTime />)}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="下班时间："
            help={
              <span style={{ color: '#f22735' }}>
                选择下班时间即代表补下班卡点
              </span>
            }
          >
            {getFieldDecorator('endTime', {})(<DatePicker showTime />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="事由：">
            {getFieldDecorator('reason', {})(
              <TextArea placeholder="请输入事由" />
            )}
          </Form.Item>

          <Row>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              提交
            </Button>
            <Button onClick={this.props.goBack}>返回</Button>
          </Row>
        </Form>
      </div>
    );
  }
}
export default Form.create({})(CustomForm2);
