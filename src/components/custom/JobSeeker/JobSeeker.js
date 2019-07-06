import React, { Component } from 'react';
import './JobSeeker.less';
import {
  Menu,
  Icon,
  Form,
  Input,
  DatePicker,
  Radio,
  Button,
  Select,
  Modal,
  Spin
} from 'antd';
import MoveTo from 'moveto';
import http from 'Util20/api';
import ApplyInformantion from '../ApplayInformnation';
import TextArea from 'antd/lib/input/TextArea';
import RadioGroup from 'antd/lib/radio/group';
const { Option } = Select;
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
    icon: 'desktop'
  },
  {
    label: '家庭成员关系',
    value: '家庭成员关系',
    icon: 'home'
  },
  {
    label: '专业培训',
    value: '专业培训',
    icon: 'usergroup-add'
  },
  {
    label: '相关技能',
    value: '相关技能',
    icon: 'schedule'
  },
  {
    label: '其他',
    value: '其他',
    icon: 'user-add'
  }
];
const languageAbility = [
  {
    label: '优秀',
    value: '优秀'
  },
  {
    label: '良好',
    value: '良好'
  },
  {
    label: '一般',
    value: '一般'
  },
  {
    label: '欠佳',
    value: '欠佳'
  }
];
const formItemLayout = {
  labelCol: {
    span: 10,
    offset: -6
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
const pstyle = {
  style: {
    width: 600,
    padding: 10,
    lineHeight: '14px',
    whiteSpace: 'pre-line',
    textAlign: 'left'
  }
};

class JobSeeker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hasCriminal: '',
      hasLostTrust: '',
      hasUnemployee: '',
      knowColleaguage: '',
      competitionAgreement: '',
      educationBackground: [
        {
          Eddate: 'Eddate',
          EdSchool: 'EdSchool',
          EdMajor: 'EdMajor',
          EdDegree: 'EdDegree',
          EdReference: 'EdReference',
          EdReferenceTel: 'EdReferenceTel'
        }
      ],
      workExperise: [
        {
          WorkDate: 'WorkDate',
          WorkComName: 'WorkComName',
          WorkRank: 'WorkRank',
          ReasonForLeave: 'ReasonForLeave',
          WorkReference: 'WorkReference',
          WorkReferenceTel: 'WorkReferenceTel'
        }
      ],
      family: [
        {
          FamName: 'FamName',
          FamRelation: 'FamRelation',
          FamBirthDate: 'FamBirthDate',
          FamPosition: 'FamPosition',
          FamComAndAdd: 'FamComAndAdd',
          FamTel: 'FamTel'
        }
      ],
      training: [
        {
          TrainingDate: 'TrainingDate',
          TrainingInstitute: 'TrainingInstitute',
          TrainingCourses: 'TrainingCourses',
          TrainingQualification: 'TrainignQualification',
          TrainingReference: 'TrainingReference',
          TrainingReferenceTel: 'TrainingReferenceTel'
        }
      ]
    };
  }
  // 确认提交申请
  confirmAppaly = () => {
    this.props.form.validateFields((err, values) => {
      console.log(values);
      console.log(values.Eddate1[0].format('YYYY-MM-DD'));
      if (!err) {
        this.setState({ loading: true });
        console.log(1111111);
        let res;
        try {
          res = http().addRecords({
            resid: 613149356409,
            data: [
              {
                ...values,
                //教育
                 EdStartTime1:  values.Eddate1 ? 
                 values.Eddate1[0].format('YYYY-MM-DD'):null,
                 EdEndTime1:  values.Eddate1 ? 
                 values.Eddate1[1].format('YYYY-MM-DD'):null,
                 EdStartTime2:  values.Eddate2 ? 
                 values.Eddate2[0].format('YYYY-MM-DD'):null,
                 EdEndTime2:  values.Eddate2 ? 
                 values.Eddate2[1].format('YYYY-MM-DD'):null,
                 EdStartTime3:  values.Eddate3 ? 
                 values.Eddate3[0].format('YYYY-MM-DD'):null,
                 EdEndTime3:  values.Eddate3 ? 
                 values.Eddate3[1].format('YYYY-MM-DD'):null,
                 EdStartTime4:  values.Eddate4 ? 
                 values.Eddate4[0].format('YYYY-MM-DD'):null,
                 EdEndTime4:  values.Eddate4 ? 
                 values.Eddate4[1].format('YYYY-MM-DD'):null,
                 //工作
                 WorkStartTime1:  values.WorkDate1 ? 
                 values.WorkDate1[0].format('YYYY-MM-DD'):null,
                 WorkEndTime1:  values.WorkDate1 ? 
                 values.WorkDate1[1].format('YYYY-MM-DD'):null,

                 WorkStartTime2:  values.WorkDate2 ? 
                 values.WorkDate2[0].format('YYYY-MM-DD'):null,
                 WorkEndTime2:  values.WorkDate2 ? 
                 values.WorkDate2[1].format('YYYY-MM-DD'):null,

                 WorkStartTime3:  values.WorkDate3 ? 
                 values.WorkDate3[0].format('YYYY-MM-DD'):null,
                 WorkEndTime3:  values.WorkDate3 ? 
                 values.WorkDate3[1].format('YYYY-MM-DD'):null,
              }
            ]
          });
          console.log(res.data);
          this.setState({ loading: false });
          Modal.success({
            title: '提示',
            content: '提交成功'
          });
        } catch (err) {
          console.error(err.message);
          Modal.error({
            title: '提示失败',
            content: err.message
          });
        }
      } else {
        return Modal.warning({
          title: '提示',
          content: '请确认所有必填项都填写完毕,您还有一些必填项没有填写'
        });
      }
    });
  };
  // 提交的值
  handleClick = e => {
    // e.preventDefault();
    Modal.confirm({
      title: '确认要提交吗?',
      content: '请您最后再次确认一遍再提交',
      onOk: () => {
        this.confirmAppaly();
      }
    });
  };
  // 移动
  hanleMoveTo = id => {
    const moveTo = new MoveTo({
      duration: 300,
      tolerance: 195,
      container: document.querySelector('.job-seeker__informnation')
    });
    // console.log(id);
    const tempid = document.getElementById(id);
    moveTo.move(tempid);
  };
  // 监听犯罪行为是否项的变化
  isYesChange = value => {
    console.log(value);
    this.setState({
      hasCriminal: value
    });
  };
  // 监听是否有失信行为发生变化
  isLostTrustChange = value => {
    this.setState({
      hasLostTrust: value
    });
  };
  // 监听是否有失业经历变化
  isUnemployeeChange = value => {
    this.setState({
      hasUnemployee: value
    });
  };
  // 监听是否有认识本公司员工
  isKnowColleaguageChange = value => {
    this.setState({
      knowColleaguage: value
    });
  };
  // 监听是否签署过竞争协议或者保密协议
  isCompetitionChange = value => {
    this.setState({
      competitionAgreement: value
    });
  };
  // 添加教育,工作,家庭成员,培训，
  handleAdd = key => {
    const { educationBackground, workExperise } = this.state;
    // console.log(key);
    const tempeducationBackground = [...educationBackground];
    const tempworkExperise = [...workExperise];
    let obj = {};
    switch (key) {
      case 'educationBackground':
        obj = {
          Eddate: 'Eddate',
          EdSchool: 'EdSchool',
          EdMajor: 'EdMajor',
          EdDegree: 'EdDegree',
          EdReference: 'EdReference',
          EdReferenceTel: 'EdReferenceTel'
        };
        tempeducationBackground.push(obj);
        break;
      case 'workExperise':
        obj = {
          WorkDate: 'WorkDate',
          WorkComName: 'WorkComName',
          WorkRank: 'WorkRank',
          ReasonForLeave: 'ReasonForLeave',
          WorkReference: 'WorkReference',
          WorkReferenceTel: 'WorkReferenceTel'
        };
        tempworkExperise.push(obj);
        break;
    }
    this.setState({
      educationBackground: tempeducationBackground,
      workExperise: tempworkExperise
    });
  };
  // 添加教育背景
  handleAddEdBack = () => {
    const { educationBackground } = this.state;
    const tempeducationBackground = [...educationBackground];
    const obj = {
      Eddate: 'Eddate',
      EdSchool: 'EdSchool',
      EdMajor: 'EdMajor',
      EdDegree: 'EdDegree',
      EdReference: 'EdReference',
      EdReferenceTel: 'EdReferenceTel'
    };
    tempeducationBackground.push(obj);
    this.setState({
      educationBackground: tempeducationBackground
    });
  };
  // // 添加工作经历
  handleAddWork = () => {
    const { workExperise } = this.state;
    const tempworkExperise = [...workExperise];
    const obj = {
      WorkDate: 'WorkDate',
      WorkComName: 'WorkComName',
      WorkRank: 'WorkRank',
      ReasonForLeave: 'ReasonForLeave',
      WorkReference: 'WorkReference',
      WorkReferenceTel: 'WorkReferenceTel'
    };
    tempworkExperise.push(obj);
    this.setState({
      workExperise: tempworkExperise
    });
  };
  //添加家庭成员
  handleAddFamily = () => {
    const { family } = this.state;
    const tempfamily = [...family];
    const obj = {
      FamName: 'FamName',
      FamRelation: 'FamRelation',
      FamBirthDate: 'FamBirthDate',
      FamPosition: 'FamPosition',
      FamComAndAdd: 'FamComAndAdd',
      FamTel: 'FamTel'
    };
    tempfamily.push(obj);
    this.setState({
      family: tempfamily
    });
  };
  // 添加教育培训经历
  handleAddTraining = () => {
    const { training } = this.state;
    const temptraining = [...training];
    const obj = {
      TrainingDate: 'TrainingDate',
      TrainingInstitute: 'TrainingInstitute',
      TrainingCourses: 'TrainingCourses',
      TrainingQualification: 'TrainignQualification',
      TrainingReference: 'TrainingReference',
      TrainingReferenceTel: 'TrainingReferenceTel'
    };
    temptraining.push(obj);
    this.setState({
      training: temptraining
    });
  };
  // 删除教育背景
  handleDelete = index => {
    const { educationBackground } = this.state;
    const tempeducationBackground = [...educationBackground];
    tempeducationBackground.splice(index, 1);
    this.setState({
      educationBackground: tempeducationBackground
    });
  };
  // 删除工作经历
  handleDeleteW = index => {
    const { workExperise } = this.state;
    const tempworkExperise = [...workExperise];
    tempworkExperise.splice(index, 1);
    this.setState({
      workExperise: tempworkExperise
    });
  };
  // 删除家庭成员
  handleDeleteF = index => {
    const { family } = this.state;
    const tempfamily = [...family];
    tempfamily.splice(index, 1);
    this.setState({
      family: tempfamily
    });
  };
  // 删除培训
  handleDeleteT = index => {
    const { training } = this.state;
    const temptraining = [...training];
    temptraining.splice(index, 1);
    this.setState({
      training: temptraining
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      loading,
      educationBackground,
      workExperise,
      family,
      training
    } = this.state;
    return (
      <Spin spinning={loading}>
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
            <Form style={{ width: '90%', margin: '0 auto' }} labelAlign="left">
              <h3 className="job-seeker__informnation-title" id="个人资料">
                个人资料/Personal Informnation
              </h3>
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
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: 'Please input your E-mail!'
                  //   }
                  // ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="身份证号码/IDCardNumber" {...formItemLayout}>
                {getFieldDecorator('idNumber', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: 'Please input your E-mail!'
                  //   }
                  // ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="性别/Sex" {...formItemLayout}>
                {getFieldDecorator('Sex', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请选择性别'
                  //   }
                  // ]
                })(
                  <Radio.Group>
                    <Radio value="男">男</Radio>
                    <Radio value="女">女</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="手机/Phone" {...formItemLayout}>
                {getFieldDecorator('Phone', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请务必输入手机号，方便我们联系您'
                  //   }
                  // ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="个人邮箱/E-mail" {...formItemLayout}>
                {getFieldDecorator('Email', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请务必输入邮箱，方便我们联系您'
                  //   }
                  // ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="国籍/Nationality" {...formItemLayout}>
                {getFieldDecorator('Nationality', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '输入国籍'
                  //   }
                  // ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="民族/Nationality" {...formItemLayout}>
                {getFieldDecorator('Nation', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '输入民族'
                  //   }
                  // ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="政治面貌/Party" {...formItemLayout}>
                {getFieldDecorator('Party', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '输入政党'
                  //   }
                  // ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="出生日期/BirhtOfDate" {...formItemLayout}>
                {getFieldDecorator('BirthOfDate', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '输入出生日期'
                  //   }
                  // ]
                })(<DatePicker />)}
              </Form.Item>
              <Form.Item label="出生地点/PlaceOfBirth" {...formItemLayout}>
                {getFieldDecorator('BirthPlace', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '输出生地点'
                  //   }
                  // ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="户口所在地/PlaceOfHuKou" {...formItemLayout}>
                {getFieldDecorator('PlaceOfHukou', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '户口所在地必填'
                  //   }
                  // ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="血型/BloodType" {...formItemLayout}>
                {getFieldDecorator('BloodType', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '血型必须要填'
                  //   }
                  // ]
                })(<Input />)}
              </Form.Item>
              <Form.Item
                label="现通讯地址/CurrentCorrespondAddress"
                {...formItemLayout}
              >
                {getFieldDecorator('CurrentAddress', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '输入现居住的地址'
                  //   }
                  // ]
                })(<Input />)}
              </Form.Item>
              <Form.Item
                label="有无推荐人/if have recommender"
                {...formItemLayout}
              >
                {getFieldDecorator('IfRecommendByF', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '输入国籍'
                  //   }
                  // ]
                })(
                  <Radio.Group>
                    <Radio value="有">有</Radio>
                    <Radio value="无">无</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="推荐人姓名/recommender" {...formItemLayout}>
                {getFieldDecorator('RecommenderName', {})(<Input />)}
              </Form.Item>
              <Form.Item label="和推荐人关系/relationship" {...formItemLayout}>
                {getFieldDecorator('RecommenderRelation', {})(<Input />)}
              </Form.Item>
              <Form.Item label="婚姻状况(选填)/Marital status(Optional)" {...formItemLayout}>
                {getFieldDecorator('MaritalStatus', {})(
                  // <Radio.Group>
                  //   <Radio value="未婚">未婚</Radio>
                  //   <Radio value="已婚">已婚</Radio>
                  //   <Radio value="离异">离异</Radio>
                  // </Radio.Group>
                  <Input></Input>
                )}
              </Form.Item>
              <Form.Item label="有无子女(选填)/children if any(Optional)" {...formItemLayout}>
                {getFieldDecorator('ChildIf', {})(
                  // <Radio.Group>
                  //   <Radio value="有">有</Radio>
                  //   <Radio value="无">无</Radio>
                  // </Radio.Group>
                  <Input></Input>
                )}
              </Form.Item>
              <h3 className="job-seeker__informnation-title" id="教育背景">
                教育背景/(请从最近的开始写起)Education Background (Please start
                from latest education to middle school)
              </h3>
              {educationBackground.map((item, index) => {
                return (
                  <div className="job-seeker__informnation-boundry">
                    <Form.Item
                      label="日期/latest period from to"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`${item.Eddate}${index + 1}`, {})(
                        <RangePicker />
                      )}
                    </Form.Item>
                    <Form.Item label="学校名称/schoolName" {...formItemLayout2}>
                      {getFieldDecorator(`${item.EdSchool}${index + 1}`, {})(
                        <Input />
                      )}
                    </Form.Item>
                    <Form.Item label="专业名称/major" {...formItemLayout2}>
                      {getFieldDecorator(`${item.EdMajor}${index + 1}`, {})(
                        <Input />
                      )}
                    </Form.Item>
                    <Form.Item label="学位/degree" {...formItemLayout2}>
                      {getFieldDecorator(`${item.EdDegree}${index + 1}`, {})(
                        <Input />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="证明人/ReferenceName"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`${item.EdReference}${index + 1}`, {})(
                        <Input />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="证明人电话/ReferenceTel"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(
                        `${item.EdReferenceTel}${index + 1}`,
                        {}
                      )(<Input />)}
                    </Form.Item>
                    {index + 1 > 1 ? (
                      <div className="job-seeker__informnation-boundry__delete">
                        <Button
                          type="primary"
                          icon="delete"
                          onClick={() => {
                            this.handleDelete(item.index);
                          }}
                        >
                          删除
                        </Button>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                );
              })}
              <Form.Item>
                <Button
                  type="primary"
                  icon="plus"
                  onClick={() => {
                    this.handleAdd('educationBackground');
                  }}
                >
                  添加教育背景
                </Button>
              </Form.Item>
              <h3 className="job-seeker__informnation-title" id="工作经历">
                工作经历(请从最近的写起)/Working History (Please start with
                latest one)
              </h3>
              {workExperise.map((item, index) => {
                return (
                  <div className="job-seeker__informnation-boundry">
                    <Form.Item
                      label="任职年限/post period from to "
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`${item.WorkDate}${index + 1}`, {})(
                        <RangePicker />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="公司名称&类型/name of Com&type"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`${item.WorkComName}${index + 1}`, {})(
                        <Input />
                      )}
                    </Form.Item>
                    <Form.Item label="职位/position" {...formItemLayout2}>
                      {getFieldDecorator(`${item.WorkRank}${index + 1}`, {})(
                        <Input />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="离职原因/Reasons for leaving"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(
                        `${item.ReasonForLeave}${index + 1}`,
                        {}
                      )(<Input />)}
                    </Form.Item>
                    <Form.Item label="证明人/Reference" {...formItemLayout2}>
                      {getFieldDecorator(
                        `${item.WorkReference}${index + 1}`,
                        {}
                      )(<Input />)}
                    </Form.Item>
                    <Form.Item
                      label="证明人电话/Reference phone"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(
                        `${item.WorkReferenceTel}${index + 1}`,
                        {}
                      )(<Input />)}
                    </Form.Item>
                    <div className="job-seeker__informnation-boundry__delete">
                      <Button
                        type="primary"
                        icon="delete"
                        onClick={() => {
                          this.handleDeleteW(item.index);
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                );
              })}
              <Form.Item>
                <Button
                  type="primary"
                  icon="plus"
                  onClick={() => {
                    this.handleAdd('workExperise');
                  }}
                >
                  添加工作经历
                </Button>
              </Form.Item>
              <h3 className="job-seeker__informnation-title" id="家庭成员关系">
                家庭成员及主要社会关系/Family Members and Mainly Social
              </h3>
              {family.map((item, index) => {
                return (
                  <div className="job-seeker__informnation-boundry">
                    <Form.Item label="姓名/Name" {...formItemLayout2}>
                      {getFieldDecorator(`${item.FamName}${index + 1}`, {})(
                        <Input />
                      )}
                    </Form.Item>
                    <Form.Item label="关系/Relationship" {...formItemLayout2}>
                      {getFieldDecorator(`${item.FamRelation}${index + 1}`, {})(
                        <Input />
                      )}
                    </Form.Item>
                    <Form.Item label="职务/position" {...formItemLayout2}>
                      {getFieldDecorator(`${item.FamPosition}${index + 1}`, {})(
                        <Input />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="公司名称&地址/name of Com&Add"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(
                        `${item.FamComAndAdd}${index + 1}`,
                        {}
                      )(<Input />)}
                    </Form.Item>
                    <Form.Item label="电话/TelPhone" {...formItemLayout2}>
                      {getFieldDecorator(`${item.FamTel}${index + 1}`, {})(
                        <Input />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="出生年月/birthOfDate"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(
                        `${item.FamBirthDate}${index + 1}`,
                        {}
                      )(<Input />)}
                    </Form.Item>
                    {index + 1 > 1 ? (
                      <div className="job-seeker__informnation-boundry__delete">
                        <Button
                          type="primary"
                          icon="delete"
                          onClick={() => {
                            this.handleDeleteF(item.index);
                          }}
                        >
                          删除
                        </Button>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                );
              })}
              <Form.Item>
                <Button
                  type="primary"
                  icon="plus"
                  onClick={() => {
                    this.handleAddFamily();
                  }}
                >
                  添加家庭成员
                </Button>
              </Form.Item>
              <h3 className="job-seeker__informnation-title" id="专业培训">
                专业培训training
              </h3>
              {training.map((item, index) => {
                return (
                  <div className="job-seeker__informnation-boundry">
                    <Form.Item
                      label="日期/post period from to "
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(
                        `${item.TrainingDate}${index + 1}`,
                        {}
                      )(<Input />)}
                    </Form.Item>
                    <Form.Item
                      label="培训机构/name of Com&type"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(
                        `${item.TrainingInstitute}${index + 1}`,
                        {}
                      )(<Input />)}
                    </Form.Item>

                    <Form.Item
                      label="培训课程/TrainingCourses"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(
                        `${item.TrainingCourses}${index + 1}`,
                        {}
                      )(<Input />)}
                    </Form.Item>
                    <Form.Item
                      label="专业资格/professionalQualification"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(
                        `${item.TrainingQualification}${index + 1}`,
                        {}
                      )(<Input />)}
                    </Form.Item>
                    <Form.Item label="证明人/Reference" {...formItemLayout2}>
                      {getFieldDecorator(
                        `${item.TrainingReference}${index + 1}`,
                        {}
                      )(<Input />)}
                    </Form.Item>
                    <Form.Item
                      label="证明人电话/Reference phone"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(
                        `${item.TrainingReferenceTel}${index + 1}`,
                        {}
                      )(<Input />)}
                    </Form.Item>
                    <div className="job-seeker__informnation-boundry__delete">
                      <Button
                        type="primary"
                        icon="delete"
                        onClick={() => {
                          this.handleDeleteT(item.index);
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                );
              })}
              <Form.Item>
                <Button
                  type="primary"
                  icon="plus"
                  onClick={() => {
                    this.handleAddTraining();
                  }}
                >
                  添加培训经历
                </Button>
              </Form.Item>
              <h3 className="job-seeker__informnation-title" id="相关技能">
                相关技能/Related Qualification / Skill (If any)
              </h3>
              <Form.Item label="常用外语" {...formItemLayout2}>
                {getFieldDecorator('Language', {})(<Input />)}
              </Form.Item>
              <Form.Item
                label="外语等级"
                {...formItemLayout2}
                style={{ display: 'inline-block', width: '50%' }}
              >
                {getFieldDecorator('EnCET', {})(<Input />)}
              </Form.Item>
              <Form.Item
                label="写作/Writing"
                {...formItemLayout2}
                style={{ display: 'inline-block', width: '50%' }}
              >
                {getFieldDecorator('Writing', {})(
                  <Select>
                    {languageAbility.map((item, index) => {
                      return (
                        <Option key={index} value={item.value}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                label="阅读/Reading"
                {...formItemLayout2}
                style={{ display: 'inline-block', width: '50%' }}
              >
                {getFieldDecorator('Reading', {})(
                  <Select>
                    {languageAbility.map((item, index) => {
                      return (
                        <Option key={index} value={item.value}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                label="口语/Speaking"
                {...formItemLayout2}
                style={{ display: 'inline-block', width: '50%' }}
              >
                {getFieldDecorator('Speaking', {})(
                  <Select>
                    {languageAbility.map((item, index) => {
                      return (
                        <Option key={index} value={item.value}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="计算机技能/ComputerSkills" {...formItemLayout2}>
                {getFieldDecorator('ComputerSkills', {})(
                  <Select>
                    {languageAbility.map((item, index) => {
                      return (
                        <Option key={index} value={item.value}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="列出常用软件/list name of software used">
                {getFieldDecorator('SoftList', {})(<Input />)}
              </Form.Item>
              <Form.Item label="其他技能/other skills">
                {getFieldDecorator('OtherSkills', {})(<Input />)}
              </Form.Item>
              <h3 className="job-seeker__informnation-title" id="其他">
                其他/other informnation
              </h3>
              <Form.Item label="身高cm/height" {...formItemLayout2}>
                {getFieldDecorator('Height', {})(<Input />)}
              </Form.Item>
              <Form.Item label="体重kg/weight" {...formItemLayout2}>
                {getFieldDecorator('Weight', {})(<Input />)}
              </Form.Item>
              <Form.Item label="视力左 右/eye sight" {...formItemLayout2}>
                {getFieldDecorator('EyeSight', {})(<Input />)}
              </Form.Item>
              <Form.Item
                colon={false}
                label="是否得过严重的疾病？目前身体状况如何？是否患有传染病，慢性病等"
              >
                {getFieldDecorator('DiseaseStatus', {})(<TextArea />)}
              </Form.Item>
              <Form.Item
                colon={false}
                label="是否有犯罪记录,如有请作详细的说明"
              >
                {getFieldDecorator('CriminalStatus', {})(
                  <div>
                    <RadioGroup
                      onChange={e => {
                        this.isYesChange(e.target.value);
                      }}
                    >
                      <Radio value="是">是</Radio>
                      <Radio value="否">否</Radio>
                    </RadioGroup>
                    {this.state.hasCriminal === '是' ? <Input /> : ''}
                  </div>
                )}
              </Form.Item>
              <Form.Item
                colon={false}
                label="是否有过失信记录等行为,如有请作详细的说明"
              >
                {getFieldDecorator('TrustStatus', {})(
                  <div>
                    <RadioGroup
                      onChange={e => {
                        this.isLostTrustChange(e.target.value);
                      }}
                    >
                      <Radio value="是">是</Radio>
                      <Radio value="否">否</Radio>
                    </RadioGroup>
                    {this.state.hasLostTrust === '是' ? <Input /> : ''}
                  </div>
                )}
              </Form.Item>
              <Form.Item
                colon={false}
                label="Do you have any unemployed period of more than 4 months? If
                yes, please give the details.
                
                是否有过4个月以上的失业经历？如有，请详细说明。"
              >
                {getFieldDecorator('UnemployedStatus', {})(
                  <div>
                    <RadioGroup
                      onChange={e => {
                        this.isUnemployeeChange(e.target.value);
                      }}
                    >
                      <Radio value="是">是</Radio>
                      <Radio value="否">否</Radio>
                    </RadioGroup>
                    {this.state.hasUnemployee === '是' ? <Input /> : ''}
                  </div>
                )}
              </Form.Item>
              <Form.Item
                colon={false}
                label="Do you know any employee of Finisar Shanghai Inc.? If yes,
                please give his/her name and relationship./
                是否认识本公司的员工？如是，请详细指出姓名及与其关系。"
              >
                {getFieldDecorator('KnowColleageStatus', {})(
                  <div>
                    <RadioGroup
                      onChange={e => {
                        this.isKnowColleaguageChange(e.target.value);
                      }}
                    >
                      <Radio value="是">是</Radio>
                      <Radio value="否">否</Radio>
                    </RadioGroup>
                    {this.state.knowColleaguage === '是' ? <Input /> : ''}
                  </div>
                )}
              </Form.Item>
              <Form.Item
                colon={false}
                label="Do you have any unexpired contract or service agreement with
                   your present employer? 
                   与现任雇主的合同或服务协议是否到期？"
              >
                {getFieldDecorator('OtherAgreement', {})(
                  <div>
                    <RadioGroup>
                      <Radio value="是">已到期</Radio>
                      <Radio value="否">未到期</Radio>
                    </RadioGroup>
                  </div>
                )}
              </Form.Item>
              <Form.Item
                colon={false}
                label={
                  <p style={{height:30}}>
                    Do you have ever signed non-competition agreement or
                    confidentiality agreement? Please explain when does the
                    contract or agreement at
                    term?<br/>是否签署过竞业限制协议或保密协议？请说明何时到期及是否需赔款？
                  </p>
                }
              >
                {getFieldDecorator('CompetitionAgreement', {})(
                  <div>
                    <RadioGroup
                      onChange={e => {
                        this.isCompetitionChange(e.target.value);
                      }}
                    >
                      <Radio value="是">是</Radio>
                      <Radio value="否">否</Radio>
                    </RadioGroup>
                    {this.state.competitionAgreement === '是' ? <Input /> : ''}
                  </div>
                )}
              </Form.Item>
              <Form.Item
                label="办离职需要多长时间/How long do
                   you carry out demission?"
              >
                {getFieldDecorator('HowLong', {})(<Input />)}
              </Form.Item>
              <Form.Item label="如被录用何时上班/When would be available for you?">
                {getFieldDecorator('WhenOn', {})(<Input />)}
              </Form.Item>
              <Form.Item label="自我评价">
                {getFieldDecorator('SelfAccessment', {})(<TextArea />)}
              </Form.Item>
              <div>
                <h3>Commitments/本人承诺</h3>
                <p style={{padding:5,textAlign:'left'}}>1) All informantion given are true and accurate ,otherwise I'm willing to be punished even dismissed.<br/>  所有填表内容真实、准确,如有虚假愿意接受处分包括辞退</p>
                <p>2) I agree with further background check.本人同意公司进行背景调查</p>
              </div>
              <Form.Item style={{ textAlign: 'center' }}>
                <Button type="primary" onClick={this.handleClick}>
                  确认申请
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Spin>
    );
  }
}

export default Form.create()(JobSeeker);
