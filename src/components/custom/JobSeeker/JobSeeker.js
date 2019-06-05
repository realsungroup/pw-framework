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
    span: 10
  },
  wrapperCol: {
    span: 14
  }
};
const formItemLayout2 = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
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
      console.log('接收的值', values.ThreeEddate[0].format('YYYY-MM-DD'));
      if (!err) {
        // console.log('接收的值', values.ThreeEddate[0].format('YYYY-MM-DD'));
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
    moveTo.move(tempid);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="job-seeker">
        <div className="job-seeker__nav">
          <Menu
            style={{ width: 265, minHeight: 60 }}
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
          <Form style={{ width: '90%', margin: '0 auto' }}>
            <h2 className="job-seeker__informnation-title" id="个人资料">
              个人资料
            </h2>
            <Form.Item label="中文姓名/ChineseName" {...formItemLayout}>
              {getFieldDecorator('ChName', {
                rules: [
                  {
                    required: true,
                    message: '请输入中文姓名'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="英文姓名/EnglishName" {...formItemLayout}>
              {getFieldDecorator('EnName', {})(<Input />)}
            </Form.Item>
            <Form.Item label="申请职位名称/jobTitle" {...formItemLayout}>
              {getFieldDecorator('appPosition', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="身份证号码/IDCardNumber" {...formItemLayout}>
              {getFieldDecorator('idNumber', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="性别/Sex" {...formItemLayout}>
              {getFieldDecorator('Sex', {
                rules: [
                  {
                    required: true,
                    message: '请选择性别'
                  }
                ]
              })(
                <Radio.Group>
                  <Radio value="男">男</Radio>
                  <Radio value="女">女</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="手机/Phone" {...formItemLayout}>
              {getFieldDecorator('Phone', {
                rules: [
                  {
                    required: true,
                    message: '请务必输入手机号，方便我们联系您'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="个人邮箱/E-mail" {...formItemLayout}>
              {getFieldDecorator('E-mail', {
                rules: [
                  {
                    required: true,
                    message: '请务必输入邮箱，方便我们联系您'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="国籍/Nationality" {...formItemLayout}>
              {getFieldDecorator('Nationality', {
                rules: [
                  {
                    required: true,
                    message: '输入国籍'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="民族/Nationality" {...formItemLayout}>
              {getFieldDecorator('Nationa', {
                rules: [
                  {
                    required: true,
                    message: '输入民族'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="政治面貌/Party" {...formItemLayout}>
              {getFieldDecorator('Party', {
                rules: [
                  {
                    required: true,
                    message: '输入政党'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="出生日期/BirhtOfDate" {...formItemLayout}>
              {getFieldDecorator('birthOfDate', {
                rules: [
                  {
                    required: true,
                    message: '输入出生日期'
                  }
                ]
              })(<DatePicker />)}
            </Form.Item>
            <Form.Item label="出生地点/PlaceOfBirth" {...formItemLayout}>
              {getFieldDecorator('BirthPlace', {
                rules: [
                  {
                    required: true,
                    message: '输出生地点'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="户口所在地/PlaceOfHuKou" {...formItemLayout}>
              {getFieldDecorator('placeOfHukou', {
                rules: [
                  {
                    required: true,
                    message: '户口所在地必填'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="血型/BloodType" {...formItemLayout}>
              {getFieldDecorator('BloodType', {
                rules: [
                  {
                    required: true,
                    message: '血型必须要填'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="现通讯地址/CurrentCorrespondAddress" {...formItemLayout}>
              {getFieldDecorator('currentAddress', {
                rules: [
                  {
                    required: true,
                    message: '输入现居住的地址'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="有无推荐人/if have recommender"
              {...formItemLayout}
            >
              {getFieldDecorator('IsRecommended', {
                rules: [
                  {
                    required: true,
                    message: '输入国籍'
                  }
                ]
              })(
                <Radio.Group>
                  <Radio value="有">有</Radio>
                  <Radio value="无">无</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="推荐人姓名/recommender" {...formItemLayout}>
              {getFieldDecorator('recommenderName', {})(<Input />)}
            </Form.Item>
            <Form.Item label="和推荐人关系/relationship" {...formItemLayout}>
              {getFieldDecorator('recommenderRelationship', {})(<Input />)}
            </Form.Item>
            <Form.Item label="婚姻状况/Marital status" {...formItemLayout}>
              {getFieldDecorator('MaritalStatus', {})(
                <Radio.Group>
                  <Radio value="未婚">未婚</Radio>
                  <Radio value="已婚">已婚</Radio>
                  <Radio value="离异">离异</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="有无子女/children if any" {...formItemLayout}>
              {getFieldDecorator('havechildren', {})(
                <Radio.Group>
                  <Radio value="有">有</Radio>
                  <Radio value="无">无</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <h2 className="job-seeker__informnation-title" id="教育背景">
              教育背景
            </h2>
            <Form.Item label="日期" {...formItemLayout2}>
              {getFieldDecorator('latestEddate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item label="学校名称" {...formItemLayout2}>
              {getFieldDecorator('latestShcoolName', {})(<Input />)}
            </Form.Item>
            <Form.Item label="日期" {...formItemLayout2}>
              {getFieldDecorator('ThreeEddate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item label="学校名称" {...formItemLayout2}>
              {getFieldDecorator('ThreeShcoolName', {})(<Input />)}
            </Form.Item>
            <h2 className="job-seeker__informnation-title" id="工作经历">
              工作经历
            </h2>
            <Form.Item label="任职年限" {...formItemLayout2}>
              {getFieldDecorator('latestWorkdate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item label="公司名称" {...formItemLayout2}>
              {getFieldDecorator('latestComName', {})(<Input />)}
            </Form.Item>
            <Form.Item label="任职年限" {...formItemLayout2}>
              {getFieldDecorator('threeWorkdate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item label="公司名称" {...formItemLayout2}>
              {getFieldDecorator('threeComName', {})(<Input />)}
            </Form.Item>
            <h2 className="job-seeker__informnation-title" id="家庭成员关系">
              家庭成员关系
            </h2>
            <Form.Item label="姓名" {...formItemLayout2}>
              {getFieldDecorator('familyOneName', {})(<Input />)}
            </Form.Item>
            <Form.Item label="关系" {...formItemLayout2}>
              {getFieldDecorator('relationShip', {})(<Input />)}
            </Form.Item>
            <Form.Item label="出生年月" {...formItemLayout2}>
              {getFieldDecorator('birthDate', {})(<Input />)}
            </Form.Item>
            <Button type="primary" onClick={this.handleClick}>
              确认申请
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create()(JobSeeker);
