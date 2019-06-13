import React, { Component } from 'react';
import './ApplayInformnation.less';
import { Form, Input, DatePicker, Radio, Button, Select } from 'antd';
import MoveTo from 'moveto';
import http from 'Util20/api';
import TextArea from 'antd/lib/input/TextArea';
import PropTypes from 'prop-types';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
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
const formItemLayout2 = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};
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
class ApplayInformnation extends Component {
  static propTypes = {
    /**
     * 表达初始化值
     */
    initialValues: PropTypes.object
  };

  static defaultProps = {
    initialValues: {}
  };

  constructor(props) {
    super(props);
    this.state = {};
  }
  // 移动
  hanleMoveTo = id => {
    const moveTo = new MoveTo({
      duration: 300,
      tolerance: 0,
      container: document.querySelector('.applay__informnation')
    });
    // console.log(id);
    const tempid = document.getElementById(id);
    moveTo.move(tempid);
  };
  // 提交的值
  handleClick = e => {
    // e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // console.log('接收的值', values.ThreeEddate[0].format('YYYY-MM-DD'));
      console.log('所有值', values);
      if (!err) {
        // console.log('接收的值', values.ThreeEddate[0].format('YYYY-MM-DD'));
        // console.log('Merged values:', keys.map(key => names[key]));
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
                BirthDate: values.birthOfDate, //出生日期
                BirthPlace: values.BirthPlace, //出生地点
                PlaceOfHuKou: values.PlaceOfHuKou, //户口所在地
                BloodType: values.BloodType, //血型
                CurrentAddress: values.CurrentAddress, //现通讯地址
                IfRecommendByF: values.IfRecommendByF, //有无推荐人
                Recommender: values.Recommender, //推荐人姓名
                RecommenderRelation: values.RecommenderRelation, //和推荐人关系
                MaritalStatus: values.MaritalStatus, //婚姻状况
                ChildIf: values.ChildIf, //有无子女
                // 教育背景
                LatestStartTime: values.LatestStartTime, //最近教育开始时间
                LatestEndTime: values.LatestEndTime, //最近教育结束时间
                LatestEdSchool: values.LatestEdSchool, //最近学校名称
                LatestEdMajor: values.LatestStartTime, //专业名称
                LatestEdDegree: values.LatestEdDegree, //学位
                LatestReference: values.LatestEndTime, //最近教育证明人
                LatestReferenceTel: values.LatestStartTime, //最近教育证明人电话
                ThreeEdStartTime: values.LatestEndTime, //第三教育开始时间
                ThreeEdEndTime: values.LatestStartTime, //第三教育结束时间
                ThreeEdSchool: values.LatestEndTime, //第三学校名称
                ThreeEdMajor: values.LatestEndTime, //第三专业名称
                ThreeEdDegree: values.LatestStartTime, //第三学位
                ThreeReference: values.LatestEndTime, //第三教育证明人
                ThreeReferenceTel: values.LatestStartTime, //第三教育证明人电话
                SecEdStartTime: values.LatestEndTime, //第二教育开始时间
                SecEdEndTime: values.LatestStartTime, //第二教育结束时间
                SecEdSchool: values.LatestEndTime, //第二教育学校名称
                SecEdMajor: values.LatestStartTime, //第二教育专业名称
                SecEdDegree: values.LatestEndTime, //第二教育学位
                SecReference: values.LatestStartTime, //第二教育证明人
                SecReferenceTel: values.LatestEndTime, //第二教育证明人电话
                FistEdStartTime: values.LatestStartTime, //第一教育开始时间
                FisrtEdEndTime: values.LatestEndTime, //第一教育结束时间
                FirstEdSchool: values.LatestStartTime, //第一教育学校名称
                FirstEdMajor: values.LatestEndTime, //第一教育专业名称
                FirstEdDegree: values.LatestEndTime, //第一教育学位
                FirstReference: values.LatestEndTime, //第一教育证明人
                FirstReferenceTel: values.LatestEndTime, //第一教育证明人电话
                //工作经历
                LatestWorkStartTime: values.LatestStartTime, //最近工作开始时间
                LatestWorkEndTime: values.LatestEndTime, //最近工作结束时间
                LatestComName: values.LatestStartTime, //最近工作公司名称
                LatestRank: values.LatestEndTime, //最近工作公司职位
                LatestReasonForLeave: values.LatestEndTime, //最近工作离职原因
                LatestWorkReference: values.LatestEndTime, //最近工作证明人
                LatestWorkReferenceTel: values.LatestEndTime, //最近工作证明人电话

                ThreeWorkStartTime: values.LatestStartTime, //次之工作开始时间
                ThreeWorkEndTime: values.LatestEndTime, //次之工作结束时间
                ThreeComName: values.LatestStartTime, //次之工作公司名称
                ThreeRank: values.LatestEndTime, //次之工作公司职位
                ThreeReasonForLeave: values.LatestEndTime, //次之工作离职原因
                ThreeWorkReference: values.LatestEndTime, //次之工作证明人
                ThreeWorkReferenceTel: values.LatestEndTime, //次之工作证明人电话
                // 家庭成员及主要关系
                FamOneName: values.LatestStartTime, //姓名
                FamOneRelation: values.LatestEndTime, //关系
                FamOnePosition: values.LatestStartTime, //职务
                FamOneComAndAdd: values.LatestEndTime, //公司名称及地址
                LatestEndTime: values.LatestEndTime, //电话
                FamOneBirthDate: values.LatestEndTime, //出生年月

                FamToName: values.LatestStartTime, //姓名
                FamToRelation: values.LatestEndTime, //关系
                FamToPosition: values.LatestStartTime, //职务
                FamToComAndAdd: values.LatestEndTime, //公司名称及地址
                LatestEndTime: values.LatestEndTime, //电话
                FamToBirthDate: values.LatestEndTime, //出生年月
                // 专业培训
                LatestTrainingDate: values.LatestStartTime, //最近专业培训开始日期
                // LatestEndTime: values.LatestEndTime, //最近专业培训日期
                LatestTrainingInstitute: values.LatestStartTime, //最近培训机构
                LatestTrainingCourese: values.LatestEndTime, //最近培训课程
                LatestTrainingQualification: values.LatestEndTime, //最近培训获得证书
                LatestTrainingReference: values.LatestEndTime, //最近培训证明人
                LatestTrainingRefTel: values.LatestEndTime, //最近培训证明人电话
                //相关技能
                EnCET: values.LatestStartTime, //英语等级
                Writing: values.LatestEndTime, //写作
                Reading: values.LatestStartTime, //阅读
                Speaking: values.LatestEndTime, //口语
                ComputerSkill: values.LatestEndTime, //计算机
                SoftList: values.LatestEndTime, //常用软件
                OtherSkills: values.LatestEndTime, //其他技能
                //其他信息
                Weight: values.LatestStartTime, //身高
                Height: values.LatestEndTime, //体重
                EyeSight: values.LatestStartTime, //视力
                DiseaseStatus: values.LatestEndTime, //疾病
                UnemployedStatus: values.LatestEndTime, //失业情况
                KnowColleageStatus: values.LatestEndTime, //是否认识本公司员工
                OtherAgreement: values.LatestEndTime //是否有其他合同
              }
            ]
          });
        } catch (err) {
          console.error(err.message);
        }
        console.log(res);
      }
    });
  };
  // 确认修改并打印
  handleModifyAndPrint = () => {
    // 打印
    const newEle = document.querySelector('.applay__informnation').innerHTML;
    var oldstr = document.body.innerHTML; //保存当前页面
    document.body.innerHTML = newEle; //吧当前页面内容替换为要打印的内容
    window.print();
    document.body.innerHTML = oldstr; //恢复原来的页面
    return false;
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { initialValues } = this.props;
    return (
      <div className="applay__informnation">
        <Form style={{ width: '90%', margin: '0 auto' }}>
          <h3 className="applay__informnation-title" id="个人资料">
            个人资料/Personal Information
          </h3>
          <Form.Item label="中文姓名/ChineseName" {...formItemLayout}>
            {getFieldDecorator('ChName', {
              initialValues: initialValues.ChName,
              rules: [
                {
                  required: true,
                  message: '请输入中文姓名'
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="英文姓名/EnglishName" {...formItemLayout}>
            {getFieldDecorator('EnName', {
              initialValues: initialValues.EnName
            })(<Input />)}
          </Form.Item>
          <Form.Item label="申请职位名称/jobTitle" {...formItemLayout}>
            {getFieldDecorator('appPosition', {
              initialValues: initialValues.appPosition,
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
              initialValues: initialValues.idNumber,
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
              initialValues: initialValues.Sex,
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
              initialValues: initialValues.Phone,
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
              initialValues: initialValues.Email,
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
              initialValues: initialValues.Nationality,
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
              initialValues: initialValues.Nation,
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
              initialValues: initialValues.Party,
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
              initialValues: initialValues.BirthOfDate,
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
              initialValues: initialValues.BirthPlace,
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
              initialValues: initialValues.PlaceOfHukou,
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
              initialValues: initialValues.BloodType,
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
              initialValues: initialValues.CurrentAddress,
              rules: [
                {
                  required: true,
                  message: '输入现居住的地址'
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="有无推荐人/if have recommender" {...formItemLayout}>
            {getFieldDecorator('IfRecommendByF', {
              initialValues: initialValues.IfRecommendByF,
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
            {getFieldDecorator('RecommenderName', {
              initialValues: initialValues.RecommenderName
            })(<Input />)}
          </Form.Item>
          <Form.Item label="和推荐人关系/relationship" {...formItemLayout}>
            {getFieldDecorator('RecommenderRelation', {
              initialValues: initialValues.RecommenderRelation
            })(<Input />)}
          </Form.Item>
          <Form.Item label="婚姻状况/Marital status" {...formItemLayout}>
            {getFieldDecorator('MaritalStatus', {
              initialValues: initialValues.MaritalStatus
            })(
              <Radio.Group>
                <Radio value="未婚">未婚</Radio>
                <Radio value="已婚">已婚</Radio>
                <Radio value="离异">离异</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="有无子女/children if any" {...formItemLayout}>
            {getFieldDecorator('ChildIf', {
              initialValues: initialValues.ChildIf
            })(
              <Radio.Group>
                <Radio value="有">有</Radio>
                <Radio value="无">无</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <h3 className="applay__informnation-title" id="教育背景">
            教育背景/(请从最近的开始写起)Education Background (Please start from
            latest education to middle school)
          </h3>
          <Form.Item label="日期/latest period from to" {...formItemLayout2}>
            {getFieldDecorator('LatestEddate', {
              initialValues: initialValues.LatestEddate
            })(<RangePicker />)}
          </Form.Item>
          <Form.Item label="学校名称/schoolName" {...formItemLayout2}>
            {getFieldDecorator('LatestEdSchool', {
              initialValues: initialValues.LatestEdSchool
            })(<Input />)}
          </Form.Item>
          <Form.Item label="专业名称/major" {...formItemLayout2}>
            {getFieldDecorator('LatestEdMajor', {
              initialValues: initialValues.LatestEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="学位/degree" {...formItemLayout2}>
            {getFieldDecorator('LatestEdDegree', {
              initialValues: initialValues.LatestEdDegree
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人/ReferenceName" {...formItemLayout2}>
            {getFieldDecorator('LatestReference', {
              initialValues: initialValues.LatestReference
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人电话/ReferenceTel" {...formItemLayout2}>
            {getFieldDecorator('LatestReferenceTel', {
              initialValues: initialValues.LatestReferenceTel
            })(<Input />)}
          </Form.Item>
          <Form.Item label="日期/third period from to" {...formItemLayout2}>
            {getFieldDecorator('ThreeEddate', {
              initialValues: initialValues.ThreeEddate
            })(<RangePicker />)}
          </Form.Item>
          <Form.Item label="学校名称/third school name" {...formItemLayout2}>
            {getFieldDecorator('ThreeEdSchool', {
              initialValues: initialValues.ThreeEdSchool
            })(<Input />)}
          </Form.Item>
          <Form.Item label="专业名称/major" {...formItemLayout2}>
            {getFieldDecorator('ThreeEdMajor', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="学位/degree" {...formItemLayout2}>
            {getFieldDecorator('ThreeEdDegree', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人/ReferenceName" {...formItemLayout2}>
            {getFieldDecorator('ThreeReference', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人电话/ReferenceTel" {...formItemLayout2}>
            {getFieldDecorator('ThreeReferenceTel', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="日期/second period from to" {...formItemLayout2}>
            {getFieldDecorator('SecEddate', {
              initialValues: initialValues.ThreeEdMajor
            })(<RangePicker />)}
          </Form.Item>
          <Form.Item label="学校名称/third school name" {...formItemLayout2}>
            {getFieldDecorator('SecEdSchool', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="专业名称/major" {...formItemLayout2}>
            {getFieldDecorator('SecEdMajor', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="学位/degree" {...formItemLayout2}>
            {getFieldDecorator('SecEdDegree', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人/ReferenceName" {...formItemLayout2}>
            {getFieldDecorator('SecReference', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人电话/ReferenceTel" {...formItemLayout2}>
            {getFieldDecorator('SecReferenceTel', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="日期/first period from to" {...formItemLayout2}>
            {getFieldDecorator('FirstEddate', {
              initialValues: initialValues.ThreeEdMajor
            })(<RangePicker />)}
          </Form.Item>
          <Form.Item label="学校名称/school name" {...formItemLayout2}>
            {getFieldDecorator('FirstEdSchool', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="专业名称/major" {...formItemLayout2}>
            {getFieldDecorator('FirstEdMajor', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="学位/degree" {...formItemLayout2}>
            {getFieldDecorator('FirstEdDegree', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人/ReferenceName" {...formItemLayout2}>
            {getFieldDecorator('FirstReference', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人电话/ReferenceTel" {...formItemLayout2}>
            {getFieldDecorator('FirstReferenceTel', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <h3 className="applay__informnation-title" id="工作经历">
            工作经历(请从最近的写起)/Working History (Please start with latest
            one)
          </h3>
          <Form.Item label="任职年限/post period from to " {...formItemLayout2}>
            {getFieldDecorator('LatestWorkdate', {
              initialValues: initialValues.ThreeEdMajor
            })(<RangePicker />)}
          </Form.Item>
          <Form.Item
            label="公司名称&类型/name of Com&type"
            {...formItemLayout2}
          >
            {getFieldDecorator('LatestComName', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="职位/position" {...formItemLayout2}>
            {getFieldDecorator('LatestRank', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="离职原因/Reasons for leaving" {...formItemLayout2}>
            {getFieldDecorator('LatestReasonForLeave', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人/Reference" {...formItemLayout2}>
            {getFieldDecorator('LatestWorkReference', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人电话/Reference phone" {...formItemLayout2}>
            {getFieldDecorator('LatestWorkReferenceTel', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="任职年限/post period from to " {...formItemLayout2}>
            {getFieldDecorator('ThreeWorkdate', {
              initialValues: initialValues.ThreeEdMajor
            })(<RangePicker />)}
          </Form.Item>
          <Form.Item label="公司名称/name of Com&type" {...formItemLayout2}>
            {getFieldDecorator('ThreeComName', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="职位/position" {...formItemLayout2}>
            {getFieldDecorator('ThreeRank', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="离职原因/Reasons for leaving" {...formItemLayout2}>
            {getFieldDecorator('ThreeReasonForLeave', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人/Reference" {...formItemLayout2}>
            {getFieldDecorator('ThreeWorkReference', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人电话/Reference phone" {...formItemLayout2}>
            {getFieldDecorator('ThreeWorkReferenceTel', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <h3 className="applay__informnation-title" id="家庭成员关系">
            家庭成员及主要社会关系/Family Members and Mainly Social Relationship
          </h3>
          <Form.Item label="姓名/Name" {...formItemLayout2}>
            {getFieldDecorator('FamOneName', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="关系/Relationship" {...formItemLayout2}>
            {getFieldDecorator('FamOneRelation', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="职务/position" {...formItemLayout2}>
            {getFieldDecorator('FamOnePosition', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="公司名称&地址/name of Com&Add" {...formItemLayout2}>
            {getFieldDecorator('FamOneComAndAdd', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="电话/TelPhone" {...formItemLayout2}>
            {getFieldDecorator('FamOneTel', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="出生年月/birthOfDate" {...formItemLayout2}>
            {getFieldDecorator('FamOneBirthDate', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="姓名/name" {...formItemLayout2}>
            {getFieldDecorator('FamToName', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="关系/relationship" {...formItemLayout2}>
            {getFieldDecorator('FamToRelation', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="职务/position" {...formItemLayout2}>
            {getFieldDecorator('FamToPosition', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="公司名称&地址/name of Com&Add" {...formItemLayout2}>
            {getFieldDecorator('FamToComAndAdd', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="电话/TelPhone" {...formItemLayout2}>
            {getFieldDecorator('FamToTel', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="出生年月/birthOfDate" {...formItemLayout2}>
            {getFieldDecorator('FamToBirthDate', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <h3 className="applay__informnation-title" id="专业培训">
            专业培训
          </h3>
          <Form.Item label="日期/post period from to " {...formItemLayout2}>
            {getFieldDecorator('LatestTrainingDate', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="培训机构/name of Com&type" {...formItemLayout2}>
            {getFieldDecorator('LatestTrainingInstitute', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label="专业资格/professionalQualification"
            {...formItemLayout2}
          >
            {getFieldDecorator('LatestTrainingQualification', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人/Reference" {...formItemLayout2}>
            {getFieldDecorator('LatestTrainingReference', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="证明人电话/Reference phone" {...formItemLayout2}>
            {getFieldDecorator('LatestTrainingRefTel', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <h3 className="applay__informnation-title" id="相关技能">
            相关技能/Related Qualification / Skill (If any)
          </h3>
          <Form.Item label="语言能力/languageAbility" {...formItemLayout2}>
            {getFieldDecorator('languageAbility', {
              initialValues: initialValues.ThreeEdMajor
            })(
              <Input disabled placeholder="请列明程度,优秀，良好，一般，欠佳" />
            )}
          </Form.Item>
          <Form.Item
            label="英语CET/CET"
            {...formItemLayout2}
            style={{ display: 'inline-block', width: '50%' }}
          >
            {getFieldDecorator('EnCET', {
              initialValues: initialValues.ThreeEdMajor
            })(
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
            {getFieldDecorator('Writing', {
              initialValues: initialValues.ThreeEdMajor
            })(
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
            {getFieldDecorator('Reading', {
              initialValues: initialValues.ThreeEdMajor
            })(
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
            {getFieldDecorator('Speaking', {
              initialValues: initialValues.ThreeEdMajor
            })(
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
            {getFieldDecorator('ComputerSkills', {
              initialValues: initialValues.ThreeEdMajor
            })(
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
            {getFieldDecorator('SoftList', {
              initialValues: initialValues.ThreeEdMajor
            })(<Input />)}
          </Form.Item>
          <Form.Item label="其他技能/other skills">
            {getFieldDecorator('OtherSkills', {
              initialValues: initialValues.OtherSkills
            })(<Input />)}
          </Form.Item>
          <h3 className="applay__informnation-title" id="其他">
            其他/other informnation
          </h3>
          <Form.Item label="身高cm/height" {...formItemLayout2}>
            {getFieldDecorator('Height', {
              initialValues: initialValues.Height
            })(<Input />)}
          </Form.Item>
          <Form.Item label="体重kg/weight" {...formItemLayout2}>
            {getFieldDecorator('Weight', {
              initialValues: initialValues.Weight
            })(<Input />)}
          </Form.Item>
          <Form.Item label="视力左 右/eye sight" {...formItemLayout2}>
            {getFieldDecorator('EyeSight', {
              initialValues: initialValues.EyeSight
            })(<Input />)}
          </Form.Item>
          <Form.Item colon={false} label={<Question />}>
            {getFieldDecorator('DiseaseStatus', {
              initialValues: initialValues.DiseaseStatus
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p {...pstyle}>
                Do you have any unemployed period of more than 4 months? If yes,
                please give the details.
                <br />
                是否有过4个月以上的失业经历？如有，请详细说明。
              </p>
            }
          >
            {getFieldDecorator('UnemployedStatus', {
              initialValues: initialValues.UnemployedStatus
            })(<TextArea />)}
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
            {getFieldDecorator('KnowColleageStatus', {
              initialValues: initialValues.KnowColleageStatus
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p {...pstyle}>
                Do you have any unexpired contract or service agreement with
                your present employer? Do you have ever signed non-competition
                agreement or confidentiality agreement? Please explain when does
                the contract or agreement at term? Do you need to pay
                compensation for demission? How long do you carry out demission?
                When would be available for you?
                <br />
                与现任雇主的合同或服务协议是否到期？是否签署过竞业限制协议或保密协议？请说明何时到期及是否需赔款？办理离职手续需多长时间？如被录用何时可以上班？
              </p>
            }
          >
            {getFieldDecorator('OtherAgreement', {
              initialValues: initialValues.OtherAgreement
            })(<TextArea />)}
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={this.handleClick}>
              确认申请
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ApplayInformnation);
