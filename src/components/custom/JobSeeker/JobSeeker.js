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
  Modal
} from 'antd';
import MoveTo from 'moveto';
import http from 'Util20/api';
import ApplyInformantion from '../ApplayInformnation';
import TextArea from 'antd/lib/input/TextArea';
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
    icon: 'apartment'
  },
  {
    label: '家庭成员关系',
    value: '家庭成员关系',
    icon: 'apartment'
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
const pstyle = {
  style: {
    width: 600,
    padding: 10,
    lineHeight: '14px',
    whiteSpace: 'pre-line',
    textAlign: 'left'
  }
};
const Question = () => {
  return (
    <p {...pstyle}>
      Have you ever been suffering from any severe disease? What are your
      current health? Are you sick for contagion, or chronic etc. now? Do you
      have criminal history or discredit history? If yes, please give the
      details.
      <br />
      是否得过严重的疾病？目前身体状况如何？是否患有传染病，慢性病等？是否有犯罪记录或失信行为记录？如是，请详细说明
    </p>
  );
};
class JobSeeker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // 确认提交申请
  confirmAppaly=()=>{
    this.props.form.validateFields((err, values) => {
      // console.log('接收的值', values.ThreeEddate[0].format('YYYY-MM-DD'));
      console.log('所有值', values);
      console.log('错误',err);
      if (!err) {
        let res;
        try {
          res = http().addRecords({
            resid: 613149356409,
            data: [
              {
                ChName: values.ChName, //中文姓名
                EnName: values.EnName, //英文姓名
                JobTitle: values.appPosition, //申请职位名称
                IDCardNumber: values.idNumber, //身份证号码
                Sex: values.Sex, //性别
                Tel: values.Phone, //求职者手机号
                Email: values.Email, //求职者邮箱
                Nationality: values.Nationality, //国籍
                Nation: values.Nation, //民族
                Party: values.Party, //政治面貌
                BirthDate: values.BirthOfDate, //出生日期
                BirthPlace: values.BirthPlace, //出生地点
                PlaceOfHuKou: values.PlaceOfHuKou, //户口所在地
                BloodType: values.BloodType, //血型
                CurrentAddress: values.CurrentAddress, //现通讯地址
                IfRecommendByF: values.IfRecommendByF, //有无推荐人
                Recommender: values.RecommenderName, //推荐人姓名
                RecommenderRelation: values.RecommenderRelation, //和推荐人关系
                MaritalStatus: values.MaritalStatus, //婚姻状况
                ChildIf: values.ChildIf, //有无子女
                // 教育背景
                LatestStartTime: values.LatestEddate[0].format('YYYY-MM-DD'), //最近教育开始时间
                LatestEndTime: values.LatestEddate[1].format('YYYY-MM-DD'), //最近教育结束时间
                LatestEdSchool: values.LatestEdSchool, //最近学校名称
                LatestEdMajor: values.LatestEdMajor, //专业名称
                LatestEdDegree: values.LatestEdDegree, //学位
                LatestReference: values.LatestReference, //最近教育证明人
                LatestReferenceTel: values.LatestReferenceTel, //最近教育证明人电话
                ThreeEdStartTime: values.ThreeEddate[0].format('YYYY-MM-DD'), //第三教育开始时间
                ThreeEdEndTime: values.ThreeEddate[1].format('YYYY-MM-DD'), //第三教育结束时间
                ThreeEdSchool: values.ThreeEdSchool, //第三学校名称
                ThreeEdMajor: values.ThreeEdMajor, //第三专业名称
                ThreeEdDegree: values.ThreeEdDegree, //第三学位
                ThreeReference: values.ThreeReference, //第三教育证明人
                ThreeReferenceTel: values.ThreeReferenceTel, //第三教育证明人电话
                SecEdStartTime: values.SecEddate[0].format('YYYY-MM-DD'), //第二教育开始时间
                SecEdEndTime: values.SecEddate[1].format('YYYY-MM-DD'), //第二教育结束时间
                SecEdSchool: values.SecEdSchool, //第二教育学校名称
                SecEdMajor: values.SecEdMajor, //第二教育专业名称
                SecEdDegree: values.SecEdDegree, //第二教育学位
                SecReference: values.SecReference, //第二教育证明人
                SecReferenceTel: values.SecReferenceTel, //第二教育证明人电话
                FistEdStartTime: values.FirstEddate[0].format('YYY-MM-DD'), //第一教育开始时间
                FisrtEdEndTime: values.FirstEddate[1].format('YYY-MM-DD'), //第一教育结束时间
                FirstEdSchool: values.FirstEdSchool, //第一教育学校名称
                FirstEdMajor: values.FirstEdMajor, //第一教育专业名称
                FirstEdDegree: values.FirstEdDegree, //第一教育学位
                FirstReference: values.FirstReference, //第一教育证明人
                FirstReferenceTel: values.FirstReferenceTel, //第一教育证明人电话
                //工作经历
                LatestWorkStartTime: values.LatestWorkdate[0].format(
                  'YYY-MM-DD'
                ), //最近工作开始时间
                LatestWorkEndTime: values.LatestWorkdate[1].format('YYY-MM-DD'), //最近工作结束时间
                LatestComName: values.LatestComName, //最近工作公司名称
                LatestRank: values.LatestRank, //最近工作公司职位
                LatestReasonForLeave: values.LatestReasonForLeave, //最近工作离职原因
                LatestWorkReference: values.LatestWorkReference, //最近工作证明人
                LatestWorkReferenceTel: values.LatestWorkReferenceTel, //最近工作证明人电话

                ThreeWorkStartTime: values.ThreeWorkdate[0].format('YYY-MM-DD'), //次之工作开始时间
                ThreeWorkEndTime: values.ThreeWorkdate[1].format('YYY-MM-DD'), //次之工作结束时间
                ThreeComName: values.ThreeComName, //次之工作公司名称
                ThreeRank: values.ThreeRank, //次之工作公司职位
                ThreeReasonForLeave: values.ThreeReasonForLeave, //次之工作离职原因
                ThreeWorkReference: values.ThreeWorkReference, //次之工作证明人
                ThreeWorkReferenceTel: values.ThreeWorkReferenceTel, //次之工作证明人电话
                // 家庭成员及主要关系
                FamOneName: values.FamOneName, //姓名
                FamOneRelation: values.FamOneRelation, //关系
                FamOnePosition: values.FamOnePosition, //职务
                FamOneComAndAdd: values.FamOneComAndAdd, //公司名称及地址
                FamOneTel: values.FamOneTel, //电话
                FamOneBirthDate: values.FamOneBirthDate, //出生年月

                FamToName: values.FamToName, //姓名
                FamToRelation: values.FamToRelation, //关系
                FamToPosition: values.FamToPosition, //职务
                FamToComAndAdd: values.FamToComAndAdd, //公司名称及地址
                FamToTel: values.FamToTel, //电话
                FamToBirthDate: values.FamToBirthDate, //出生年月
                // 专业培训
                LatestTrainingDate: values.LatestTrainingDate, //最近专业培训开始日期
                // LatestEndTime: values.LatestEndTime, //最近专业培训日期
                LatestTrainingInstitute: values.LatestTrainingInstitute, //最近培训机构
                LatestTrainingCourese: values.LatestTrainingCourese, //最近培训课程
                LatestTrainingQualification: values.LatestTrainingQualification, //最近培训获得证书
                LatestTrainingReference: values.LatestTrainingReference, //最近培训证明人
                LatestTrainingRefTel: values.LatestTrainingRefTel, //最近培训证明人电话
                //相关技能
                EnCET: values.EnCET, //英语等级
                Writing: values.Writing, //写作
                Reading: values.Reading, //阅读
                Speaking: values.Speaking, //口语
                ComputerSkill: values.ComputerSkill, //计算机
                SoftList: values.SoftList, //常用软件
                OtherSkills: values.OtherSkills, //其他技能
                //其他信息
                Weight: values.Weight, //身高
                Height: values.Height, //体重
                EyeSight: values.EyeSight, //视力
                DiseaseStatus: values.DiseaseStatus, //疾病
                UnemployedStatus: values.UnemployedStatus, //失业情况
                KnowColleageStatus: values.KnowColleageStatus, //是否认识本公司员工
                OtherAgreement: values.OtherAgreement //是否有其他合同
              }
            ]
          });
        } catch (err) {
          // console.error(err.message);
          Modal.success({
            title:'提示',
            content:'提交成功'
          })
        }
        console.log(res);
      }else{
        Modal.warning({
          title:'提示',
          content:'请确认所有必填项都填写完毕,您还有一些必填项没有填写',
        })
      }
    });
  }
  // 提交的值
  handleClick = e => {
    // e.preventDefault();
    Modal.confirm({
      title:'确认要提交吗?',
      content:'请您最后再次确认一遍再提交',
      onOk:()=>{
        this.confirmAppaly();
      }
    })
    
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
            <h3 className="job-seeker__informnation-title" id="个人资料">
              个人资料/Personal Information
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
              {getFieldDecorator('BirthOfDate', {
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
              {getFieldDecorator('PlaceOfHukou', {
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
            <Form.Item
              label="现通讯地址/CurrentCorrespondAddress"
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
              label="有无推荐人/if have recommender"
              {...formItemLayout}
            >
              {getFieldDecorator('IfRecommendByF', {
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
              {getFieldDecorator('RecommenderName', {})(<Input />)}
            </Form.Item>
            <Form.Item label="和推荐人关系/relationship" {...formItemLayout}>
              {getFieldDecorator('RecommenderRelation', {})(<Input />)}
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
              {getFieldDecorator('ChildIf', {})(
                <Radio.Group>
                  <Radio value="有">有</Radio>
                  <Radio value="无">无</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <h3 className="job-seeker__informnation-title" id="教育背景">
              教育背景/(请从最近的开始写起)Education Background (Please start
              from latest education to middle school)
            </h3>
            <Form.Item label="日期/latest period from to" {...formItemLayout2}>
              {getFieldDecorator('LatestEddate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item label="学校名称/schoolName" {...formItemLayout2}>
              {getFieldDecorator('LatestEdSchool', {})(<Input />)}
            </Form.Item>
            <Form.Item label="专业名称/major" {...formItemLayout2}>
              {getFieldDecorator('LatestEdMajor', {})(<Input />)}
            </Form.Item>
            <Form.Item label="学位/degree" {...formItemLayout2}>
              {getFieldDecorator('LatestEdDegree', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/ReferenceName" {...formItemLayout2}>
              {getFieldDecorator('LatestReference', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/ReferenceTel" {...formItemLayout2}>
              {getFieldDecorator('LatestReferenceTel', {})(<Input />)}
            </Form.Item>
            <Form.Item label="日期/third period from to" {...formItemLayout2}>
              {getFieldDecorator('ThreeEddate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item label="学校名称/third school name" {...formItemLayout2}>
              {getFieldDecorator('ThreeEdSchool', {})(<Input />)}
            </Form.Item>
            <Form.Item label="专业名称/major" {...formItemLayout2}>
              {getFieldDecorator('ThreeEdMajor', {})(<Input />)}
            </Form.Item>
            <Form.Item label="学位/degree" {...formItemLayout2}>
              {getFieldDecorator('ThreeEdDegree', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/ReferenceName" {...formItemLayout2}>
              {getFieldDecorator('ThreeReference', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/ReferenceTel" {...formItemLayout2}>
              {getFieldDecorator('ThreeReferenceTel', {})(<Input />)}
            </Form.Item>
            <Form.Item label="日期/second period from to" {...formItemLayout2}>
              {getFieldDecorator('SecEddate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item label="学校名称/third school name" {...formItemLayout2}>
              {getFieldDecorator('SecEdSchool', {})(<Input />)}
            </Form.Item>
            <Form.Item label="专业名称/major" {...formItemLayout2}>
              {getFieldDecorator('SecEdMajor', {})(<Input />)}
            </Form.Item>
            <Form.Item label="学位/degree" {...formItemLayout2}>
              {getFieldDecorator('SecEdDegree', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/ReferenceName" {...formItemLayout2}>
              {getFieldDecorator('SecReference', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/ReferenceTel" {...formItemLayout2}>
              {getFieldDecorator('SecReferenceTel', {})(<Input />)}
            </Form.Item>
            <Form.Item label="日期/first period from to" {...formItemLayout2}>
              {getFieldDecorator('FirstEddate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item label="学校名称/school name" {...formItemLayout2}>
              {getFieldDecorator('FirstEdSchool', {})(<Input />)}
            </Form.Item>
            <Form.Item label="专业名称/major" {...formItemLayout2}>
              {getFieldDecorator('FirstEdMajor', {})(<Input />)}
            </Form.Item>
            <Form.Item label="学位/degree" {...formItemLayout2}>
              {getFieldDecorator('FirstEdDegree', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/ReferenceName" {...formItemLayout2}>
              {getFieldDecorator('FirstReference', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/ReferenceTel" {...formItemLayout2}>
              {getFieldDecorator('FirstReferenceTel', {})(<Input />)}
            </Form.Item>
            <h3 className="job-seeker__informnation-title" id="工作经历">
              工作经历(请从最近的写起)/Working History (Please start with latest
              one)
            </h3>
            <Form.Item
              label="任职年限/post period from to "
              {...formItemLayout2}
            >
              {getFieldDecorator('LatestWorkdate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item
              label="公司名称&类型/name of Com&type"
              {...formItemLayout2}
            >
              {getFieldDecorator('LatestComName', {})(<Input />)}
            </Form.Item>
            <Form.Item label="职位/position" {...formItemLayout2}>
              {getFieldDecorator('LatestRank', {})(<Input />)}
            </Form.Item>
            <Form.Item
              label="离职原因/Reasons for leaving"
              {...formItemLayout2}
            >
              {getFieldDecorator('LatestReasonForLeave', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2}>
              {getFieldDecorator('LatestWorkReference', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Reference phone" {...formItemLayout2}>
              {getFieldDecorator('LatestWorkReferenceTel', {})(<Input />)}
            </Form.Item>
            <Form.Item
              label="任职年限/post period from to "
              {...formItemLayout2}
            >
              {getFieldDecorator('ThreeWorkdate', {})(<RangePicker />)}
            </Form.Item>
            <Form.Item label="公司名称/name of Com&type" {...formItemLayout2}>
              {getFieldDecorator('ThreeComName', {})(<Input />)}
            </Form.Item>
            <Form.Item label="职位/position" {...formItemLayout2}>
              {getFieldDecorator('ThreeRank', {})(<Input />)}
            </Form.Item>
            <Form.Item
              label="离职原因/Reasons for leaving"
              {...formItemLayout2}
            >
              {getFieldDecorator('ThreeReasonForLeave', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2}>
              {getFieldDecorator('ThreeWorkReference', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Reference phone" {...formItemLayout2}>
              {getFieldDecorator('ThreeWorkReferenceTel', {})(<Input />)}
            </Form.Item>
            <h3 className="job-seeker__informnation-title" id="家庭成员关系">
              家庭成员及主要社会关系/Family Members and Mainly Social
              Relationship
            </h3>
            <Form.Item label="姓名/Name" {...formItemLayout2}>
              {getFieldDecorator('FamOneName', {})(<Input />)}
            </Form.Item>
            <Form.Item label="关系/Relationship" {...formItemLayout2}>
              {getFieldDecorator('FamOneRelation', {})(<Input />)}
            </Form.Item>
            <Form.Item label="职务/position" {...formItemLayout2}>
              {getFieldDecorator('FamOnePosition', {})(<Input />)}
            </Form.Item>
            <Form.Item
              label="公司名称&地址/name of Com&Add"
              {...formItemLayout2}
            >
              {getFieldDecorator('FamOneComAndAdd', {})(<Input />)}
            </Form.Item>
            <Form.Item label="电话/TelPhone" {...formItemLayout2}>
              {getFieldDecorator('FamOneTel', {})(<Input />)}
            </Form.Item>
            <Form.Item label="出生年月/birthOfDate" {...formItemLayout2}>
              {getFieldDecorator('FamOneBirthDate', {})(<Input />)}
            </Form.Item>
            <Form.Item label="姓名/name" {...formItemLayout2}>
              {getFieldDecorator('FamToName', {})(<Input />)}
            </Form.Item>
            <Form.Item label="关系/relationship" {...formItemLayout2}>
              {getFieldDecorator('FamToRelation', {})(<Input />)}
            </Form.Item>
            <Form.Item label="职务/position" {...formItemLayout2}>
              {getFieldDecorator('FamToPosition', {})(<Input />)}
            </Form.Item>
            <Form.Item
              label="公司名称&地址/name of Com&Add"
              {...formItemLayout2}
            >
              {getFieldDecorator('FamToComAndAdd', {})(<Input />)}
            </Form.Item>
            <Form.Item label="电话/TelPhone" {...formItemLayout2}>
              {getFieldDecorator('FamToTel', {})(<Input />)}
            </Form.Item>
            <Form.Item label="出生年月/birthOfDate" {...formItemLayout2}>
              {getFieldDecorator('FamToBirthDate', {})(<Input />)}
            </Form.Item>
            <h3 className="job-seeker__informnation-title" id="专业培训">
              专业培训
            </h3>
            <Form.Item label="日期/post period from to " {...formItemLayout2}>
              {getFieldDecorator('LatestTrainingDate', {})(<Input />)}
            </Form.Item>
            <Form.Item label="培训机构/name of Com&type" {...formItemLayout2}>
              {getFieldDecorator('LatestTrainingInstitute', {})(<Input />)}
            </Form.Item>
            <Form.Item
              label="专业资格/professionalQualification"
              {...formItemLayout2}
            >
              {getFieldDecorator('LatestTrainingQualification', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2}>
              {getFieldDecorator('LatestTrainingReference', {})(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Reference phone" {...formItemLayout2}>
              {getFieldDecorator('LatestTrainingRefTel', {})(<Input />)}
            </Form.Item>
            <h3 className="job-seeker__informnation-title" id="相关技能">
              相关技能/Related Qualification / Skill (If any)
            </h3>
            <Form.Item label="语言能力/languageAbility" {...formItemLayout2}>
              {getFieldDecorator('languageAbility', {})(
                <Input
                  disabled
                  placeholder="请列明程度,优秀，良好，一般，欠佳"
                />
              )}
            </Form.Item>
            <Form.Item
              label="英语CET/CET"
              {...formItemLayout2}
              style={{ display: 'inline-block', width: '50%' }}
            >
              {getFieldDecorator('EnCET', {})(
                <Select>
                  <Option value="四级">四级</Option>
                  <Option value="六级">六级</Option>
                  <Option value="专八">专八</Option>
                </Select>
              )}
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
            <Form.Item colon={false} label={<Question />}>
              {getFieldDecorator('DiseaseStatus', {})(<TextArea />)}
            </Form.Item>
            <Form.Item
              colon={false}
              label={
                <p {...pstyle}>
                  Do you have any unemployed period of more than 4 months? If
                  yes, please give the details.
                  <br />
                  是否有过4个月以上的失业经历？如有，请详细说明。
                </p>
              }
            >
              {getFieldDecorator('UnemployedStatus', {})(<TextArea />)}
            </Form.Item>
            <Form.Item
              colon={false}
              label={
                <p {...pstyle}>
                  Do you know any employee of Finisar Shanghai Inc.? If yes,
                  please give his/her name and relationship.
                  <br />
                  是否认识本公司的员工？如是，请详细指出姓名及与其关系。
                </p>
              }
            >
              {getFieldDecorator('KnowColleageStatus', {})(<TextArea />)}
            </Form.Item>
            <Form.Item
              colon={false}
              label={
                <p {...pstyle}>
                  Do you have any unexpired contract or service agreement with
                  your present employer? Do you have ever signed non-competition
                  agreement or confidentiality agreement? Please explain when
                  does the contract or agreement at term? Do you need to pay
                  compensation for demission? How long do you carry out
                  demission? When would be available for you?
                  <br />
                  与现任雇主的合同或服务协议是否到期？是否签署过竞业限制协议或保密协议？请说明何时到期及是否需赔款？办理离职手续需多长时间？如被录用何时可以上班？
                </p>
              }
            >
              {getFieldDecorator('OtherAgreement', {})(<TextArea />)}
            </Form.Item>
            <Form.Item style={{textAlign:'center'}}>
              <Button type="primary" onClick={this.handleClick}>
                确认申请
              </Button>
            </Form.Item>
          </Form>
        </div>


        {/* <ApplyInformantion hasSubmit={true}></ApplyInformantion> */}
      </div>
    );
  }
}

export default Form.create()(JobSeeker);
