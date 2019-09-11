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
      let data = {
        reason,
        startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: endTime.format('YYYY-MM-DD HH:mm:ss')
      };

      try {
        let res = await http().addRecords({
          resid: '449440966625',
          data: [
            {
              C3_449349153817: 40, //项目编号
              C3_449663289150: data.reason //事由
            }
          ],
          dblinkname: 'ehr'
        });
        message.success(res.message);
        this.props.goBack();
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

          <Form.Item {...formItemLayout} label="上班时间：">
            {getFieldDecorator('startTime', {
              rules: [{ required: true, message: '请选择开始时间!' }]
            })(<DatePicker showTime />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="下班时间：">
            {getFieldDecorator('endTime', {
              rules: [{ required: true, message: '请选择结束时间!' }]
            })(<DatePicker showTime />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="事由：">
            {getFieldDecorator('reason', {
              rules: [{ required: true, message: '请输入事由!' }]
            })(<TextArea placeholder="请输入事由" />)}
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
