import React, { Component } from 'react';
import './JobSeeker.less';
import { Menu, Icon, Form, Input, DatePicker, Radio, Button } from 'antd';
import MoveTo from 'moveto';
const MenuList = [
  {
    label: '个人资料',
    value: '个人资料',
    icon: 'user'
  },
  {
    label: '教育背景',
    value: '教育背景',
    icon: 'trophy'
  },
  {
    label: '工作经历',
    value: '工作经历',
    icon: 'apartment'
  },
  {
    label: '家庭成员关系',
    value: '家庭成员关系',
    icon: 'apartment'
  },
  {
    label: '相关技能',
    value: '相关技能',
    icon: 'usergroup-add'
  },
  {
    label: '其他',
    value: '其他',
    icon: 'user-add'
  }
];

const formItemLayout = {
  labelCol: {
    span: 16
  },
  wrapperCol: {
    span: 8
  }
};

const { RangePicker } = DatePicker;

class JobSeeker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // 提交的值
  handleClick = e => {
    // e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('接收的值', values);
        // console.log('Merged values:', keys.map(key => names[key]));
      }
      console.error(err);
    });
  };
  // 移动
  hanleMoveTo = id => {
    const moveTo = new MoveTo({
      duration: 300,
      tolerance: 54,
      container: document.querySelector('.job-seeker__informnation')
    });
    console.log(id);
    const tempid = document.getElementById(id);
    // console.log(tempid);
    moveTo.move(tempid);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="job-seeker">
        <div className="job-seeker__nav">
          <Menu
            style={{ width: 256, minHeight: 60 }}
            defaultSelectedKeys={['个人资料']}
          >
            {MenuList.map((menuItem, index) => {
              return (
                <Menu.Item
                  key={menuItem.value}
                  onClick={() => {
                    this.hanleMoveTo(menuItem.value);
                  }}
                >
                  <Icon type={menuItem.icon} />
                  {menuItem.label}
                </Menu.Item>
              );
            })}
          </Menu>
        </div>
        <div className="job-seeker__informnation">
          <Form>
            <h4 id="个人资料">个人资料</h4>
            <Form.Item
              label="中文姓名/ChineseName"
              {...formItemLayout}
              style={{ display: 'inline-block', width: '50%' }}
            >
              {getFieldDecorator('ChName', {
                rules: [
                  {
                    required: true,
                    message: '请输入中文姓名'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="英文姓名/EnglishName"
              {...formItemLayout}
              style={{ display: 'inline-block', width: '50%' }}
            >
              {getFieldDecorator('EnName', {})(<Input />)}
            </Form.Item>
            <Form.Item
              label="申请职位名称/jobTitle"
              {...formItemLayout}
              style={{ display: 'inline-block', width: '50%' }}
            >
              {getFieldDecorator('appPosition', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="身份证号码/IDCardNumber"
              {...formItemLayout}
              style={{ display: 'inline-block', width: '50%' }}
            >
              {getFieldDecorator('idNumber', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="性别"
              {...formItemLayout}
              style={{ display: 'inline-block', width: '50%' }}
            >
              {getFieldDecorator('Sex', {})(
                <Radio.Group>
                  <Radio value="男">男</Radio>
                  <Radio value="女">女</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <h4 id="教育背景">教育背景</h4>
            <Form.Item
              label="日期"
              {...formItemLayout}
              style={{ display: 'inline-block', width: '50%' }}
            >
              {getFieldDecorator('latestEddate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item
              label="学校名称"
              {...formItemLayout}
              style={{ display: 'inline-block', width: '50%' }}
            >
              {getFieldDecorator('latestShcoolName', {})(<Input />)}
            </Form.Item>
            <Form.Item
              label="日期"
              {...formItemLayout}
              style={{ display: 'inline-block', width: '50%' }}
            >
              {getFieldDecorator('ThreeEddate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item
              label="学校名称"
              {...formItemLayout}
              style={{ display: 'inline-block', width: '50%' }}
            >
              {getFieldDecorator('ThreeShcoolName', {})(<Input />)}
            </Form.Item>
            <h4 id="工作经历">工作经历</h4>
            <Form.Item label="任职年限">
              {getFieldDecorator('latestWorkdate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item label="公司名称">
              {getFieldDecorator('latestShcoolName', {})(<Input />)}
            </Form.Item>
            <Form.Item label="任职年限">
              {getFieldDecorator('threeWorkdate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item label="公司名称">
              {getFieldDecorator('threeShcoolName', {})(<Input />)}
            </Form.Item>
            <h4 id="家庭成员关系">家庭成员关系</h4>
            <Form.Item label="姓名">
              {getFieldDecorator('familyOneName', {})(<Input />)}
            </Form.Item>
            <Form.Item label="关系">
              {getFieldDecorator('relationShip', {})(<Input />)}
            </Form.Item>
            <Form.Item label="出生年月">
              {getFieldDecorator('birthDate', {})(<Input />)}
            </Form.Item>
            <Button type="primary" onClick={this.handleClick}>
              提交
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(JobSeeker);
