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
  Spin,
  message,
  Cascader
} from 'antd';
import MoveTo from 'moveto'; //引入moveto这个库
import http from 'Util20/api';
// import ApplyInformantion from '../ApplayInformnation';
import TextArea from 'antd/lib/input/TextArea';
import RadioGroup from 'antd/lib/radio/group';
import cityData from './city.json';

const { Option } = Select;
// 左侧导航栏
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
// 语言能力评估的程度
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
// 栅格系统的布局
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
const eduResid = 620392895622; //教育背景表
const workResid = 620475141560; //工作经验表
const familyResid = 620478243451; //家庭主要成员表
const trainResid = 620479827779; //专业培训表
class JobSeeker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hasCriminal: '', //是否有犯罪记录
      hasLostTrust: '', //是否有失信行为
      hasUnemployee: '', //是否失业四个月经历
      knowColleaguage: '', //是否认识菲尼萨员工
      competitionAgreement: '', //是否签署过竞争协议
      //教育背景
      educationBackground: [{}],
      //工作经历
      workExperise: [{}],
      //家庭成员
      family: [{}],
      //培训经历
      training: [{}],
      options: []
    };
  }

  componentDidMount() {
    // 清除缓存
    // http().clearCache();
    this.handleData();
  }

  handleData = () => {
    let provinces = { ...cityData[86] }; //省
    let data = [];
    for (let province of Object.entries(provinces)) {
      let provinceObj = {
        value: province[0],
        label: province[1],
        children: []
      };
      let cities = cityData[province[0]]; //市
      if (cities) {
        for (let city of Object.entries(cities)) {
          let cityObj = { value: city[0], label: city[1], children: [] };
          let areas = cityData[city[0]];
          if (areas) {
            for (let area of Object.entries(areas)) {
              cityObj.children.push({
                value: area[0],
                label: area[1],
                children: []
              });
            }
          }
          provinceObj.children.push(cityObj);
        }
      }
      data.push(provinceObj);
    }
    this.setState({ options: data });
    console.log(this.state.options);
    return data;
  };

  confirmAppalyTotal = () => {
    this.confirmAppaly(); //提交工作申请表信息
    this.confirmEdu(); //提交教育经历信息
    this.confirmWork(); //提交工作经历方法
    this.confirmFam(); // 提交家庭主要成员方法
    this.confirmTrain(); //提交专业培训方法
  };

  // 提交教育经历方法
  confirmEdu = async () => {
    let res;
    try {
      res = await http().addRecords({
        resid: eduResid,
        data: this.state.educationBackground
      });
      message.success(res.message);
    } catch (error) {
      message.error(error.message);
    }
  };

  // 提交工作经历方法
  confirmWork = async () => {
    let res;
    try {
      res = await http().addRecords({
        resid: workResid,
        data: this.state.workExperise
      });
    } catch (error) {
      message.error(error.message);
    }
  };

  // 提交家庭主要成员方法
  confirmFam = async () => {
    let res;
    try {
      res = await http().addRecords({
        resid: familyResid,
        data: this.state.family
      });
    } catch (error) {
      message.error(error.message);
    }
  };

  // 提交专业培训方法
  confirmTrain = async () => {
    let res;
    try {
      res = await http().addRecords({
        resid: trainResid,
        data: this.state.training
      });
    } catch (error) {
      message.error(error.message);
    }
  };

  // 确认提交申请
  confirmAppaly = () => {
    this.props.form.validateFields((err, values) => {
      console.log(values);
      var strHuKou;
      var instr=values.PlaceOfHuKou[0];
      var instr2=values.PlaceOfHuKou[1];
      var instr3=values.PlaceOfHuKou[2];
      strHuKou=cityData[86][instr]+cityData[instr][instr2]+cityData[instr2][instr3];
      console.log(strHuKou)
      if (
        !err
        // err==err
      ) {
        this.setState({ loading: true });
        console.log('date',values.Eddate1[0].format('YYYY-MM-DD'));
        let res;
        try {
          res = http().addRecords({
            resid: 613149356409, //工作申请表 业务数据
            data: [
              {
                ...values,
                PlaceOfHuKou:strHuKou,
                //教育
                EdStartTime1: values.Eddate1
                  ? values.Eddate1[0].format('YYYY-MM-DD')
                  : null,
                EdEndTime1: values.Eddate1
                  ? values.Eddate1[1].format('YYYY-MM-DD')
                  : null,
                EdStartTime2: values.Eddate2
                  ? values.Eddate2[0].format('YYYY-MM-DD')
                  : null,
                EdEndTime2: values.Eddate2
                  ? values.Eddate2[1].format('YYYY-MM-DD')
                  : null,
                EdStartTime3: values.Eddate3
                  ? values.Eddate3[0].format('YYYY-MM-DD')
                  : null,
                EdEndTime3: values.Eddate3
                  ? values.Eddate3[1].format('YYYY-MM-DD')
                  : null,
                EdStartTime4: values.Eddate4
                  ? values.Eddate4[0].format('YYYY-MM-DD')
                  : null,
                EdEndTime4: values.Eddate4
                  ? values.Eddate4[1].format('YYYY-MM-DD')
                  : null,
                //工作
                WorkStartTime1: values.WorkDate1
                  ? values.WorkDate1[0].format('YYYY-MM-DD')
                  : null,
                WorkEndTime1: values.WorkDate1
                  ? values.WorkDate1[1].format('YYYY-MM-DD')
                  : null,

                WorkStartTime2: values.WorkDate2
                  ? values.WorkDate2[0].format('YYYY-MM-DD')
                  : null,
                WorkEndTime2: values.WorkDate2
                  ? values.WorkDate2[1].format('YYYY-MM-DD')
                  : null,

                WorkStartTime3: values.WorkDate3
                  ? values.WorkDate3[0].format('YYYY-MM-DD')
                  : null,
                WorkEndTime3: values.WorkDate3
                  ? values.WorkDate3[1].format('YYYY-MM-DD')
                  : null,
                TrainingDate1: values.TrainingD1
                  ? values.TrainingD1[0].format('YYYY-MM-DD')+'-'+values.TrainingD1[1].format('YYYY-MM-DD')
                  : null,
                  TrainingDate2: values.TrainingD2
                    ? values.TrainingD2[0].format('YYYY-MM-DD')+'-'+values.TrainingD2[1].format('YYYY-MM-DD')
                    : null,
                    TrainingDate3: values.TrainingD3
                      ? values.TrainingD3[0].format('YYYY-MM-DD')+'-'+values.TrainingD3[1].format('YYYY-MM-DD')
                      : null,
              }
            ]
          });
          console.log(res.data);
          this.setState({ loading: false });
          Modal.success({
            title: '提示',
            content: '提交成功'
          });
          var time=setTimeout(function(){
            window.location.reload();

          },1000)
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
        this.confirmAppalyTotal();
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
  // 添加教育背景
  handleAddEdBack = () => {
    const { educationBackground } = this.state;
    const tempeducationBackground = [...educationBackground];
    const obj = {
      EduPeriod: '',
      EdSchool: '',
      EdMajor: '',
      EdDegree: '',
      EdReference: '',
      EdReferenceTel: ''
    };
    tempeducationBackground.push(obj);
    this.setState({
      educationBackground: tempeducationBackground
    });
  };
  //  添加工作经历
  handleAddWork = () => {
    const { workExperise } = this.state;
    const tempworkExperise = [...workExperise];
    const obj = {
      workPeriod: '',
      CompanyName: '',
      Position: '',
      Reason: '',
      Reference: '',
      Telephone: ''
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
      Name: '',
      Relationship: '',
      DateofBirth: '',
      Position: '',
      Company: '',
      Telephone: ''
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
      EduPeriod: '',
      EduPeriodEnd: '',
      TrainingName: '',
      TrainingCourses: '',
      Professional: '',
      TrainingReference: '',
      TrainingReferenceTel: ''
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
  //选择日期
  onChangeDate = (date, dateString) => {
    console.log(date, dateString);
  };

  //教育背景信息 选择大学
  handelEduColleges = (index, e) => {
    this.state.educationBackground[index].Colleges = e.target.value;
    this.setState({});
  };

  //教育背景信息 选择时间
  handelDate = (index, date, dateString) => {
    this.state.educationBackground[index].EduPeriod = dateString[0];
    this.state.educationBackground[index].EduPeriodEnd = dateString[1];
    this.setState({});
  };

  //教育背景信息 选择专业
  handelEduMajor = (index, e) => {
    this.state.educationBackground[index].Major = e.target.value;
    this.setState({});
  };

  //教育背景信息 选择学位
  handelEduDegree = (index, e) => {
    this.state.educationBackground[index].Degree = e.target.value;
    this.setState({});
  };

  //教育背景信息 选择证明人
  handelEduReference = (index, e) => {
    this.state.educationBackground[index].Reference = e.target.value;
    this.setState({});
  };

  //教育背景信息 选择证明人电话
  handelEduTelephone = (index, e) => {
    this.state.educationBackground[index].Telephone = e.target.value;
    this.setState({});
    console.log(index,this.state)
  };

  //工作经历 任职年限
  handelworkPeriod = (index, date, dateString) => {
    this.state.workExperise[index].workPeriod = dateString[0];
    this.state.workExperise[index].EduPeriodEnd = dateString[1];
    this.setState({});
  };

  //工作经历 公司名称&类型
  handelCompanyName = (index, e) => {
    this.state.workExperise[index].CompanyName = e.target.value;
    this.setState({});
  };

  //工作经历 职位
  handelPosition = (index, e) => {
    this.state.workExperise[index].Position = e.target.value;
    this.setState({});
  };

  //工作经历 离职原因
  handelReason = (index, e) => {
    this.state.workExperise[index].Reason = e.target.value;
    this.setState({});
  };

  //工作经历 证明人
  handelReference = (index, e) => {
    this.state.workExperise[index].Reference = e.target.value;
    this.setState({});
  };

  //工作经历 证明人电话
  handelTelephone = (index, e) => {
    this.state.workExperise[index].Telephone = e.target.value;
    this.setState({});
  };

  //家庭成员信息 姓名
  handelFamName = (index, e) => {
    this.state.family[index].Name = e.target.value;
    this.setState({});
  };

  //家庭成员信息 关系
  handelFamRelationship = (index, e) => {
    this.state.family[index].Relationship = e.target.value;
    this.setState({});
  };

  //家庭成员信息 出生日期
  handelFamDateofBirth = (index, e) => {
    this.state.family[index].DateofBirth = e.target.value;
    this.setState({});
  };

  //家庭成员信息 职务
  handelFamPosition = (index, e) => {
    this.state.family[index].Position = e.target.value;
    this.setState({});
  };

  //家庭成员信息 电话
  handelFamTelephone = (index, e) => {
    this.state.family[index].Telephone = e.target.value;
    this.setState({});
  };

  //家庭成员信息 公司名称
  handelFamCompany = (index, e) => {
    this.state.family[index].Company = e.target.value;
    this.setState({});
  };

  // 专业培训 年限
  handelTrainPeriod = (index, e, dateString) => {
    this.state.training[index].Period = dateString[0];
    this.state.training[index].PeriodEnd = dateString[1];
    this.setState({});
  };

  // 专业培训 培训机构
  handelTrainingName = (index, e) => {
    this.state.training[index].TrainingName = e.target.value;
    this.setState({});
  };

  // 专业培训 培训课程
  handelTrainingCourses = (index, e) => {
    this.state.training[index].TrainingCourses = e.target.value;
    this.setState({});
  };

  // 专业培训 专业资格
  handelTrainProfessional = (index, e) => {
    this.state.training[index].Professional = e.target.value;
    this.setState({});
  };
  //证明人
  handelTrainReference = (index, e) => {
    this.state.training[index].Reference = e.target.value;
    this.setState({});
  };
  //证明人电话
  handelTrainTelephone = (index, e) => {
    this.state.training[index].Telephone = e.target.value;
    this.setState({});
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
                Personal Information 个人资料
              </h3>
              <Form.Item label="中文姓名/Chinese Name" {...formItemLayout}>
                {getFieldDecorator('ChName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入中文姓名'
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="英文姓名/Name in English" {...formItemLayout}>
                {getFieldDecorator('EnName', {})(<Input />)}
              </Form.Item>
              <Form.Item
                label="申请职位名称/Position for Applied"
                {...formItemLayout}
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
                label="身份证号码/Number of ID Card"
                {...formItemLayout}
              >
                {getFieldDecorator('IDCardNumber', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your E-mail!'
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="性别/Gender" {...formItemLayout}>
                {getFieldDecorator('Sex', {
                  rules: [
                    {
                      required: true,
                      message: '请选择性别'
                    }
                  ]
                })(
                  <Radio.Group>
                    <Radio value="男">男/Male</Radio>
                    <Radio value="女">女/Female</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="手机/MP" {...formItemLayout}>
                {getFieldDecorator('Tel', {
                  rules: [
                    {
                      required: true,
                      message: '请务必输入手机号，方便我们联系您'
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="个人邮箱/E-mail" {...formItemLayout}>
                {getFieldDecorator('Email', {
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
              <Form.Item label="籍贯/NativePlace" {...formItemLayout}>
                {getFieldDecorator('NativePlace', {
                  rules: [
                    {
                      required: true,
                      message: '输入籍贯'
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="民族/Nationality" {...formItemLayout}>
                {getFieldDecorator('Nation', {
                  rules: [
                    {
                      required: true,
                      message: '输入民族'
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="政治面貌/Party Affiliation" {...formItemLayout}>
                {getFieldDecorator('Party', {
                  rules: [
                    {
                      required: true,
                      message: '输入政党'
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="出生日期/Date Of Birth" {...formItemLayout}>
                {getFieldDecorator('BirthDate', {
                  rules: [
                    {
                      required: true,
                      message: '输入出生日期'
                    }
                  ]
                })(<DatePicker onChange={this.onChangeDate} />)}
              </Form.Item>
              <Form.Item label="出生地点/Place of Birth" {...formItemLayout}>
                {getFieldDecorator('BirthPlace', {
                  rules: [
                    {
                      required: true,
                      message: '输出生地点'
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item
                label="户口所在地/Place Of HuKou Registered(Province/City)"
                {...formItemLayout}
              >
                {getFieldDecorator('PlaceOfHuKou', {
                  rules: [
                    {
                      required: true,
                      message: '户口所在地必填'
                    }
                  ]
                })(
                  <Cascader
                    options={this.state.options}
                    placeholder="please select"
                  ></Cascader>
                )}
              </Form.Item>
              <Form.Item label="血型/Blood Type" {...formItemLayout}>
                {getFieldDecorator('BloodType', {
                  rules: [
                    {
                      required: true,
                      message: '血型必须要填'
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item
                label="现通讯地址/Current Correspond Address"
                {...formItemLayout}
              >
                {getFieldDecorator('CurrentAddress', {
                  rules: [
                    {
                      required: true,
                      message: '输入现居住的地址'
                    }
                  ]
                })(<Input />)}
              </Form.Item>
              <Form.Item
                label="有无推荐人/If have recommender"
                {...formItemLayout}
              >
                {getFieldDecorator('IfRecommendByF', {
                  rules: [
                    {
                      required: true,
                      message: '输入推荐人'
                    }
                  ]
                })(
                  <Radio.Group>
                    <Radio value="有">有/Yes</Radio>
                    <Radio value="无">无/No</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item label="推荐人姓名/Recommended by" {...formItemLayout}>
                {getFieldDecorator('Recommender', {})(<Input />)}
              </Form.Item>
              <Form.Item label="和推荐人关系/Relationship" {...formItemLayout}>
                {getFieldDecorator('RecomenderRelation', {})(<Input />)}
              </Form.Item>
              <Form.Item
                label="婚姻状况(选填)/Marital Status(Optional)"
                {...formItemLayout}
              >
                {getFieldDecorator('MaritalStatus', {})(
                  // <Radio.Group>
                  //   <Radio value="未婚">未婚</Radio>
                  //   <Radio value="已婚">已婚</Radio>
                  //   <Radio value="离异">离异</Radio>
                  // </Radio.Group>
                  <Input></Input>
                )}
              </Form.Item>
              <Form.Item
                label="有无子女(选填)/Children,of any(Optional)"
                {...formItemLayout}
              >
                {getFieldDecorator('ChildIf', {})(
                  // <Radio.Group>
                  //   <Radio value="有">有</Radio>
                  //   <Radio value="无">无</Radio>
                  // </Radio.Group>
                  <Input></Input>
                )}
              </Form.Item>
              <h3 className="job-seeker__informnation-title" id="教育背景">
                Education Background (Please start from latest education to
                middle school) 教育背景(请从最近教育开始填写至中学)
              </h3>
              {educationBackground.map((item, index) => {
                return (
                  <div className="job-seeker__informnation-boundry">
                    <Form.Item
                      label="年限（年/月）/Period(Year/Month)"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`Eddate${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写年限'
                          }
                        ]
                      })(
                        <RangePicker
                          onChange={this.handelDate.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="学校名称/Name of School"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`EdSchool${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写学校名称'
                          }
                        ]
                      })(
                        <Input
                          value={item.Colleges}
                          onChange={this.handelEduColleges.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="专业名称/Major" {...formItemLayout2}>
                      {getFieldDecorator(`EdMajor${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写专业'
                          }
                        ]
                      })(
                        <Input
                          value={item.Major}
                          onChange={this.handelEduMajor.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="学位/Degree" {...formItemLayout2}>
                      {getFieldDecorator(`EdDegree${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写学位'
                          }
                        ]
                      })(
                        <Input
                          value={item.Degree}
                          onChange={this.handelEduDegree.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="证明人/Reference" {...formItemLayout2}>
                      {getFieldDecorator(`EdReference${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写证明人'
                          }
                        ]
                      })(
                        <Input
                          value={item.Reference}
                          onChange={this.handelEduReference.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="证明人电话/Telephone"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`EdReferenceTel${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写证明人电话'
                          }
                        ]
                      })(
                        <Input
                          value={item.Telephone}
                          onChange={this.handelEduTelephone.bind(this, index)}
                        />
                      )}
                    </Form.Item>
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
                  </div>
                );
              })}

              <Form.Item>
                <Button
                  type="primary"
                  icon="plus"
                  onClick={() => {
                    this.handleAddEdBack();
                  }}
                >
                  添加教育背景
                </Button>
              </Form.Item>
              <h3 className="job-seeker__informnation-title" id="工作经历">
                Working History (Please start with latest one)
                工作经历(请从最近职位开始填写)
              </h3>
              {workExperise.map((item, index) => {
                return (
                  <div className="job-seeker__informnation-boundry">
                    <Form.Item
                      label="任职年限/Post period"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`WorkDate${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写年限'
                          }
                        ]
                      })(
                        <RangePicker
                          onChange={this.handelworkPeriod.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="公司名称&类型/Name of Company & Type"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`WorkComName${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写公司名称&类型'
                          }
                        ]
                      })(
                        <Input
                          value={item.CompanyName}
                          onChange={this.handelCompanyName.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="职位/Position" {...formItemLayout2}>
                      {getFieldDecorator(`WorkRank${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写职位'
                          }
                        ]
                      })(
                        <Input
                          value={item.Position}
                          onChange={this.handelPosition.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="离职原因/Reason For Leaving"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`ReasonForLeave${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写离职原因'
                          }
                        ]
                      })(
                        <Input
                          value={item.Reason}
                          onChange={this.handelReason.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="证明人/Reference" {...formItemLayout2}>
                      {getFieldDecorator(`WorkReference${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写证明人'
                          }
                        ]
                      })(
                        <Input
                          value={item.Reference}
                          onChange={this.handelReference.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="证明人电话/Telephone"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`WorkReferenceTel${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写证明人电话'
                          }
                        ]
                      })(
                        <Input
                          value={item.Telephone}
                          onChange={this.handelTelephone.bind(this, index)}
                        />
                      )}
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
                    this.handleAddWork();
                  }}
                >
                  添加工作经历
                </Button>
              </Form.Item>
              <h3 className="job-seeker__informnation-title" id="家庭成员关系">
                Family Members and Mainly Social Relationship
                家庭成员及主要社会关系
              </h3>
              {family.map((item, index) => {
                return (
                  <div className="job-seeker__informnation-boundry">
                    <Form.Item label="姓名/Name" {...formItemLayout2}>
                      {getFieldDecorator(`FamName${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写姓名'
                          }
                        ]
                      })(
                        <Input
                          value={item.Name}
                          onChange={this.handelFamName.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="关系/Relationship" {...formItemLayout2}>
                      {getFieldDecorator(`FamRelation${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写关系'
                          }
                        ]
                      })(
                        <Input
                          value={item.Relationship}
                          onChange={this.handelFamRelationship.bind(
                            this,
                            index
                          )}
                        />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="出生年月/Date of Birth"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`FamBirthDate${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写出生年月'
                          }
                        ]
                      })(
                        <Input
                        type='date'

                          value={item.DateofBirth}
                          onChange={this.handelFamDateofBirth.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="职务/Position" {...formItemLayout2}>
                      {getFieldDecorator(`FamPosition${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写职务'
                          }
                        ]
                      })(
                        <Input
                          value={item.Position}
                          onChange={this.handelFamPosition.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="公司名称&地址/Name of Company&Address"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`FamComAndAdd${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写公司名称&地址'
                          }
                        ]
                      })(
                        <Input
                          value={item.Company}
                          onChange={this.handelFamCompany.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="电话/Telephone" {...formItemLayout2}>
                      {getFieldDecorator(`FamTel${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写电话'
                          }
                        ]
                      })(
                        <Input
                          value={item.Telephone}
                          onChange={this.handelFamTelephone.bind(this, index)}
                        />
                      )}
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
                Professional Qualification/Training 专业资格/培训
              </h3>
              {training.map((item, index) => {
                return (
                  <div className="job-seeker__informnation-boundry">
                    <Form.Item label="日期/Date/Period " {...formItemLayout2}>
                      {getFieldDecorator(`TrainingD${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写日期'
                          }
                        ]
                      })(
                        <RangePicker
                          onChange={this.handelTrainPeriod.bind(this, index)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="培训机构/Name of Training Institute"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`TrainingInstitute${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写培训机构'
                          }
                        ]
                      })(
                        <Input
                          value={item.TrainingName}
                          onChange={this.handelTrainingName.bind(this, index)}
                        />
                      )}
                    </Form.Item>

                    <Form.Item
                      label="培训课程/Training Courses"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`TrainingCourese${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写培训课程'
                          }
                        ]
                      })(
                        <Input
                          value={item.TrainingCourses}
                          onChange={this.handelTrainingCourses.bind(
                            this,
                            index
                          )}
                        />
                      )}
                    </Form.Item>
                    <Form.Item
                      label="专业资格/Pofessional Qualification"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator(`TrainingQualification${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message: '请填写专业资格'
                          }
                        ]
                      })(
                        <Input
                          value={item.Professional}
                          onChange={this.handelTrainProfessional.bind(
                            this,
                            index
                          )}
                        />
                      )}
                    </Form.Item>
                    <Form.Item label="证明人/Reference" {...formItemLayout2}>
                    {getFieldDecorator(`TrainingReference${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message:"请填写证明人"
                          }
                        ]
                      }
                      )
                      (<Input
                        value={item.Reference}
                        onChange={this.handelTrainReference.bind(this, index)}
                      />)}
                    </Form.Item>
                    <Form.Item label="电话/Telephone" {...formItemLayout2}>
                    {getFieldDecorator(`TrainingRefTel${index+1}`, {
                        rules: [
                          {
                            required: true,
                            message:"请填写电话"
                          }
                        ]
                      }
                      )
                      (<Input
                        value={item.Telephone}
                        onChange={this.handelTrainTelephone.bind(this, index)}
                      />)}
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
                Related Qualification/Skill (If any) 相关技能
              </h3>
              <Form.Item label="常用外语/Common Language" {...formItemLayout2}>
                {getFieldDecorator('Language', {
                        rules: [
                          {
                            required: true,
                            message:"请填写相关技能"
                          }
                        ]
                      }
                      )(<Input />)}
              </Form.Item>
              <Form.Item
                label="外语等级/Level"
                className='half'
                {...formItemLayout2}
                style={{ display: 'inline-block', width: '50%' }}
              >
                {getFieldDecorator('EnCET', {
                        rules: [
                          {
                            required: true,
                            message:"请填写外语等级"
                          }
                        ]
                      }
                      )(
                  <Select>
                    <Option value="CET-4">CET-4</Option>
                    <Option value="CET-6">CET-6</Option>
                    <Option value="TEM-4">TEM-4</Option>
                    <Option value="TEM-8">TEM-8</Option>
                    <Option value="公共英语三级">公共英语三级</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                className='half'
                label="写作/Writing"
                {...formItemLayout2}
                style={{ display: 'inline-block', width: '50%' }}
              >
                {getFieldDecorator('Writing',{
                        rules: [
                          {
                            required: true,
                            message:"请填写写作能力"
                          }
                        ]
                      }
                      )(
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
                className='half'
                {...formItemLayout2}
                style={{ display: 'inline-block', width: '50%' }}
              >
                {getFieldDecorator('Reading',{
                        rules: [
                          {
                            required: true,
                            message:"请填写阅读能力"
                          }
                        ]
                      }
                      )(
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
                className='half'
                {...formItemLayout2}
                style={{ display: 'inline-block', width: '50%' }}
              >
                {getFieldDecorator('Speaking',{
                        rules: [
                          {
                            required: true,
                            message:"请填写口语能力"
                          }
                        ]
                      }
                      )(
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
                label="听力/Listening"
                className='half'
                {...formItemLayout2}
                style={{ display: 'inline-block', width: '50%' }}
              >
                {getFieldDecorator('Listening', {
                        rules: [
                          {
                            required: true,
                            message:"请填写听力能力"
                          }
                        ]
                      }
                      )(
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
              <Form.Item label="计算机技能/Computer Skill" {...formItemLayout2}>
                {getFieldDecorator('ComputerSkills',{
                        rules: [
                          {
                            required: true,
                            message:"请填写计算机能力"
                          }
                        ]
                      }
                      )(
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
              <Form.Item label="列出常用软件/List Name of Software Used">
                {getFieldDecorator('SoftList', {
                    rules: [
                      {
                        required: true,
                        message:"请填写常用软件能力"
                      }
                    ]
                  }
                  )(<Input />)}
              </Form.Item>
              <Form.Item label="其他技能/Other Skill(If any)">
                {getFieldDecorator('OtherSkills',{
                    rules: [
                      {
                        required: true,
                        message:"请填写其他技能"
                      }
                    ]
                  }
                  )(<Input />)}
              </Form.Item>
              <h3 className="job-seeker__informnation-title" id="其他">
                Other information 其他
              </h3>
              <Form.Item label="身高(CM)/Height" {...formItemLayout2}>
                {getFieldDecorator('Height',{
                        rules: [
                          {
                            required: true,
                            message:"请填写身高"
                          }
                        ]
                      }
                      )(<Input />)}
              </Form.Item>
              <Form.Item label="体重(KG)/Weight" {...formItemLayout2}>
                {getFieldDecorator('Weight',{
                    rules: [
                      {
                        required: true,
                        message:"请填写体重"
                      }
                    ]
                  }
                  )(<Input />)}
              </Form.Item>
              <Form.Item label="视力左/Eye Left sight" {...formItemLayout2}>
                {getFieldDecorator('EyeSight', {
                        rules: [
                          {
                            required: true,
                            message:"请填写视力左"
                          }
                        ]
                      }
                      )(<Input />)}
              </Form.Item>
              <Form.Item label="视力右/Eye Right sight" {...formItemLayout2}>
                {getFieldDecorator('EyeSightR', {
                    rules: [
                      {
                        required: true,
                        message:"请填写视力右"
                      }
                    ]
                  })(<Input />)}
              </Form.Item>

              <Form.Item
                colon={false}
                label={
                  <p style={{ height: 30 }}>
                    Have you ever been suffering from any severe disease? What
                    are your current health? Are you sick for contagion, or
                    chronic etc. now?
                    <br />
                    是否得过严重的疾病？目前身体状况如何？是否患有传染病，慢性病等
                  </p>
                }
              >
                {getFieldDecorator('DiseaseStatus',{
                    rules: [
                      {
                        required: true,
                        message:"请填写身体状况"
                      }
                    ]
                  })(<TextArea />)}
              </Form.Item>
              <Form.Item
                colon={false}
                label={
                  <p style={{ height: 30 }}>
                    Do you have criminal history or discredit history? If yes,
                    please give the details.
                    <br />
                    是否有犯罪记录,如有请作详细的说明
                  </p>
                }
              >
                {getFieldDecorator('Criminal',{
                    rules: [
                      {
                        required: true,
                        message:"请填写是否有犯罪记录"
                      }
                    ]
                  })(
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
                {getFieldDecorator('TrustStatus', {
                        rules: [
                          {
                            required: true,
                            message:"请填写是否有失信记录"
                          }
                        ]
                      }
                      )(
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
                label={
                  <p style={{ height: 30 }}>
                    Do you have any unemployed period of more than 4 months? If
                    yes, please give the details..
                    <br />
                    是否有过4个月以上的失业经历？如有，请详细说明。
                  </p>
                }
              >
                {getFieldDecorator('UnemployedStatus',{
                    rules: [
                      {
                        required: true,
                        message:"请填写是否有4个月以上失业经历"
                      }
                    ]
                  })(
                  <div>
                    <RadioGroup
                      onChange={e => {
                        this.isUnemployeeChange(e.target.value);
                      }}
                    >
                      <Radio value="是">是</Radio>
                      <Radio value="否">否</Radio>
                    </RadioGroup>
                    {this.state.hasUnemployee === '是' ? <TextArea /> : ''}
                  </div>
                )}
              </Form.Item>
              <Form.Item
                colon={false}
                label={
                  <p style={{ height: 30 }}>
                    Do you know any employee of Finisar Shanghai Inc.? If yes,
                    please give his/her name and relationship.
                    <br />
                    是否认识本公司的员工？如是，请详细指出姓名及与其关系。
                  </p>
                }
              >
                {getFieldDecorator('KnowColleageStatus',{
                        rules: [
                          {
                            required: true,
                            message:"请填写是否认识本司员工"
                          }
                        ]
                      }
                      )(
                  <div>
                    <RadioGroup
                      onChange={e => {
                        this.isKnowColleaguageChange(e.target.value);
                      }}
                    >
                      <Radio value="是">是</Radio>
                      <Radio value="否">否</Radio>
                    </RadioGroup>
                    {this.state.knowColleaguage === '是' ? <TextArea /> : ''}
                  </div>
                )}
              </Form.Item>
              <Form.Item
                colon={false}
                label={
                  <p style={{ height: 30 }}>
                    Do you have any unexpired contract or service agreement with
                    your present employer? <br />
                    与现任雇主的合同或服务协议是否到期？
                  </p>
                }
              >
                {getFieldDecorator('OtherAgreement',{
                        rules: [
                          {
                            required: true,
                            message:"请填写与现任雇主的合同是否到期"
                          }
                        ]
                      }
                      )(
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
                  <p style={{ height: 30 }}>
                    Do you have ever signed non-competition agreement or
                    confidentiality agreement? Please explain when does the
                    contract or agreement at term?
                    <br />
                    是否签署过竞业限制协议或保密协议？请说明何时到期及是否需赔款？
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
                    {this.state.competitionAgreement === '是' ? (
                      <TextArea />
                    ) : (
                      ''
                    )}
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
              <Form.Item label="自我评价/Self Appraisement">
                {getFieldDecorator('SelfAccessment', {})(<TextArea />)}
              </Form.Item>
              <div>
                <h3>Commitments/本人承诺</h3>
                <p style={{ padding: 5, textAlign: 'left' }}>
                  1) All informantion given are true and accurate ,otherwise I'm
                  willing to be punished even dismissed.
                  <br /> 所有填表内容真实、准确,如有虚假愿意接受处分包括辞退
                </p>
                <p style={{ padding: 5, textAlign: 'left' }}>
                  2) I agree with further background check.
                  <br />
                  本人同意公司进行背景调查
                </p>
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
