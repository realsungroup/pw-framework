import React, { Component } from 'react';
import './ApplayInformnation.less';
import { Form, Input, DatePicker, Radio, Button, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import http from '../../../util20/api';
import PropTypes from 'prop-types';
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};
const { RangePicker } = DatePicker;
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
const englishgarde = [
  {
    label: 'CET-4',
    value: 'CET-4'
  },
  {
    label: 'CET-6',
    value: 'CET-6'
  },
  {
    label: 'TEM-4',
    value: 'TEM-4'
  },
  {
    label: 'TEM-8',
    value: 'TEM-8'
  },
  {
    label: '公共英语三级',
    value: '公共英语三级'
  }
];
const eduResid = 620392895622;//教育背景
class Applayinformation extends Component {
  static propTypes = {
    /**
     * 表达初始化值
     */
    initialValue: PropTypes.object
  };

  static defaultProps = {
    initialValue: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      currentInfo: {},
      mode: ['month', 'month'],
      value: [],
      eduInfo:[],
      ID:''
    };
  
  }

  componentWillReceiveProps = (nextProps) => {
    if( typeof nextProps.personDetail !== "undefined" ){
      this.setState({
        currentInfo: nextProps.personDetail,
        ChName:nextProps.personDetail.ChName,
        ID:nextProps.personDetail.ID,
      }, () => {
        this.searchEdu(this.state.ID);
      });
    }
    // let ID = ''  
    
  }

  // 查询教育背景
  searchEdu = async(ID) =>{
    let res;
    try {
      res = await http().getTable({
        resid: eduResid,
        cmswhere:`ID=${ID}`
      });
      this.setState({ eduInfo: res.data.data });
    } catch (error) {
      console.log(error);
    }
  }

  // 时间选择器
  handlePanelChange = (value, mode) => {
    this.setState({
      value,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    });
  };

  handleChange = value => {
    this.setState({ value });
  };
  // 确认修改并打印
  handleModifyAndPrint = () => {
    // 打印
    const newEle = document.querySelector('.applay__information').innerHTML;
    var oldstr = document.body.innerHTML; //保存当前页面
    document.body.innerHTML = newEle; //把当前页面内容替换为要打印的内容
    window.print();
    document.body.innerHTML = oldstr; //恢复原来的页面
    return false;
  };
  handleSave=()=>{
    this.props.form.validateFields((err,values)=>{
      console.log(values);
    })
  }
  handleClick =() =>{

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { initialValue } = this.props;
    console.log(initialValue);
    let {currentInfo} = this.state;
    console.log("currentInfo",currentInfo);
    const { value, mode } = this.state;
    return (
      <div
        className="applay__information"
        style={{ height: '90vh', overflow: 'scroll' }}
      >
        <Form>
          <div className="information__boundary">
            <h3 className="applay__information-title" id="个人资料">
            Personal Information 个人资料
            </h3>
            <Form.Item label="中文姓名/Chinese Name" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('ChName', {
                initialValue: currentInfo.ChName,
                rules: [
                  {
                    required: true,
                    message: '请输入中文姓名'
                  }
                ]
              })(<Input  />)}
            </Form.Item>
            <Form.Item
              label="英文姓名/Name in English"
              {...formItemLayout}
              className="applay__information-content"
            >
              {getFieldDecorator('EnName', {
                initialValue: currentInfo.EnName,
                rules: [
                  {
                    required: true,
                    message: '请输入英文姓名'
                  }
                ]
              })(<Input   />)}
            </Form.Item>
            <Form.Item label="申请职位名称/Position for Applied" {...formItemLayout} 
              className="applay__information-content">
              {getFieldDecorator('appPosition', {
                initialValue: currentInfo.appPosition,
                rules: [
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="身份证号码/Number of ID Card" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('idNumber', {
                initialValue: currentInfo.IDCardNumber,
                rules: [
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="性别/Gender" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('Sex', {
                initialValue: currentInfo.Sex,
                rules: [
                  {
                    message: '请选择性别'
                  }
                ]
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="手机/MP" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('Phone', {
                initialValue: currentInfo.Tel,
                rules: [
                  {
                    required: true,
                    message: '请务必输入手机号，方便我们联系您'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="个人邮箱/E-mail" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('Email', {
                initialValue: currentInfo.Email,
                rules: [
                  {
                    required: true,
                    message: '请务必输入邮箱，方便我们联系您'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="国籍/Nationality" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('Nationality', {
                initialValue: currentInfo.Nationality,
                rules: [
                  {
                    required: true,
                    message: '输入国籍'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="民族/Nationality" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('Nation', {
                initialValue: currentInfo.Nation,
                rules: [
                  {
                    required: true,
                    message: '输入民族'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="政治面貌/Party Affiliation" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('Party', {
                initialValue: currentInfo.Party,
                rules: [
                  {
                    required: true,
                    message: '输入政党'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="出生日期/Date Of Birth(year/month/day)" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('BirthOfDate', {
                initialValue: currentInfo.BirthDate,
                rules: [
                  {
                    required: true,
                    message: '输入出生日期'
                  }
                ]
              })(
              // <DatePicker />
              <Input />
              )}
            </Form.Item>
            <Form.Item label="出生地点/Place of Birth" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('BirthPlace', {
                initialValue: currentInfo.BirthPlace,
                rules: [
                  {
                    required: true,
                    message: '输入出生地点'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="籍贯/Native Place" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('PlaceOfHukou', {
                initialValue: currentInfo.PlaceOfHuKou,
                rules: [
                  {
                    required: true,
                    message: '户口所在地必填'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="血型/Blood Type" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('BloodType', {
                initialValue: currentInfo.BloodType,
                rules: [
                  {
                    required: true,
                    message: '血型必须要填'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="现通讯地址/Current Correspond Address" {...formItemLayout} className="applay__information-content" >
              {getFieldDecorator('CurrentAddress', {
                initialValue: currentInfo.CurrentAddress,
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
              className="applay__information-content"
            >
              {getFieldDecorator('IfRecommendByF', {
                initialValue: currentInfo.IfRecommendByF,
                rules: [
                  {
                    required: true,
                    message: '输入国籍'
                  }
                ]
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="推荐人姓名/Recommended by" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('RecommenderName', {
                initialValue: currentInfo.Recommender
              })(<Input />)}
            </Form.Item>
            <Form.Item label="和推荐人关系/Relationship" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('RecommenderRelation', {
                initialValue: currentInfo.RecomenderRelation
              })(<Input />)}
            </Form.Item>
            <Form.Item label="婚姻状况（选填）/Marital Status(Optional)" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('MaritalStatus', {
                initialValue: currentInfo.MaritalStatus
              })(<Input />)}
            </Form.Item>
            <Form.Item label="有无子女（选填）/Children,of any(Optional)" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('ChildIf', {
                initialValue: currentInfo.ChildIf
              })(<Input />)}
            </Form.Item>
          </div>
          <h3 className="applay__information-title" id="教育背景" >
          Education Background (Please start from latest education to middle school)/教育背景(请从最近教育开始填写至中学)
          </h3>
          <div className="information__boundary">
            <Form.Item label="年限（年/月）/Period(Year/Month)" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('Eddate1', {
                initialValue: currentInfo.ChildIf
                // initialValue: [
                //   moment(initialValue.EdStartTime1, dateFormat),
                //   moment(initialValue.EdEndTime1, dateFormat)
                // ]
              })(
                <Input />
              // <RangePicker
              //   placeholder={['Start month', 'End month']}
              //   format="YYYY-MM"
              //   value={value}
              //   mode={mode}
              //   onChange={this.handleChange}
              //   onPanelChange={this.handlePanelChange}
              // />
              )}
            </Form.Item>
            <Form.Item label="学校/学院/大学Name of School/Colleges/Universities" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdSchool1', {
                initialValue: initialValue.EdSchool1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="专业名称/Major" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdMajor1', {
                initialValue: initialValue.EdMajor1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="学位/Degree" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdDegree1', {
                initialValue: initialValue.EdDegree1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdReference1', {
                initialValue: initialValue.EdReference1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdReferenceTel1', {
                initialValue: initialValue.EdReferenceTel1
              })(<Input />)}
            </Form.Item>
          </div>
          <h3 className="applay__information-title" id="工作经验">
            Working History (Please start with latest one)/工作经历(请从最近职位开始填写)
          </h3>
          <div className="information__boundary">
            <Form.Item
              label="任职年限(年/月)/Period(Year/Month)  "
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkDate1', {
                initialValue: initialValue.EdReferenceTel1
                // initialValue: [
                //   moment(initialValue.WorkStartTime1, dateFormat),
                //   moment(initialValue.WorkEndTime1, dateFormat)
                // ]
              })(
              // <RangePicker />
              <Input />
              )}
            </Form.Item>
            <Form.Item
              label="公司名称及类型/Name of Company & Type"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkComName1', {
                initialValue: initialValue.WorkComName1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="职位/Position" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkRank1', {
                initialValue: initialValue.WorkRank1
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="离职原因/Reason For Leaving"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('ReasonForLeave1', {
                initialValue: initialValue.ReasonForLeave1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkReference1', {
                initialValue: initialValue.WorkReference1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkReferenceTel1', {
                initialValue: initialValue.WorkReferenceTel1
              })(<Input />)}
            </Form.Item>
          </div>
          <h3 className="applay__information-title" id="家庭成员关系">
            Family Members and Mainly Social Relationship 家庭成员及主要社会关系
          </h3>
          <div className="information__boundary">
            <Form.Item label="姓名/Name" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamName1', {
                initialValue: initialValue.FamName1,
                rules: [
                  {
                    required: true,
                    message: '输入姓名'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="关系/Relationship" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamRelation1', {
                initialValue: initialValue.FamRelation1,
                rules: [
                  {
                    required: true,
                    message: '输入与该成员的关系'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="出生年月/Date of Birth" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamBirthDate1', {
                initialValue: initialValue.FamBirthDate1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="职务/Position" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamPosition1', {
                initialValue: initialValue.FamPosition1
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="公司名称及地址/Name of Company&Address"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('FamComAndAdd1', {
                initialValue: initialValue.FamComAndAdd1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamOneTel', {
                initialValue: currentInfo.WorkReferenceTel1,
                rules: [
                  {
                    required: true,
                    message: '输入该成员的电话号码'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            
          </div>
          <h3 className="applay__information-title" id="专业培训" >
            Professional Qualification/Training 专业资格/培训
          </h3>
          <div className="information__boundary">
            <Form.Item label="日期/Date/Period " {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingDate1', {
                initialValue: initialValue.TrainingDate1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="培训机构/Name of Training Institute" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingInstitute1', {
                initialValue: initialValue.TrainingInstitute1
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="培训课程/Training Courses"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('TrainingCourses', {
                initialValue: initialValue.TrainingCourses
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="专业资格/Pofessional Qualification"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('TrainingQualification1', {
                initialValue: initialValue.TrainingQualification1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingReference1', {
                initialValue: initialValue.TrainingReference1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingRefTel1', {
                initialValue: initialValue.TrainingRefTel1
              })(<Input />)}
            </Form.Item>
          </div>
          <h3 className="applay__information-title" id="相关技能">
          Related Qualification / Skill (If any) 相关技能
          </h3>
          <Form.Item label="常用外语/CommonLanguage" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Language', {
              initialValue: currentInfo.Language
            })(<Input />)}
          </Form.Item>
          <Form.Item label="外语等级/Level" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('EnCET', {
              initialValue: currentInfo.EnCET
            })(<Select>
              {englishgarde.map((item, index) => {
                return (
                  <Option key={index} value={item.value}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>)}
          </Form.Item>
          <Form.Item label="写作/Writing" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Writing', {
              initialValue: currentInfo.Writing
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
          <Form.Item label="阅读/Reading" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Reading', {
              initialValue: currentInfo.Reading
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
          <Form.Item label="口语/Speaking" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Speaking', {
              initialValue: currentInfo.Speaking
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
          <Form.Item label="听力/Listening" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Listening', {
              initialValue: currentInfo.Listening
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
          {/* <Form.Item label="计算机技能/ComputerSkills" /> */}
          <Form.Item label="计算机技能/Computer Skill" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('ComputerSkills', {
              initialValue: currentInfo.ComputerSkills
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
          <Form.Item label="列出常用软件/List Name of Software Used" className="applay__information-content">
            {getFieldDecorator('SoftList', {
              initialValue: currentInfo.SoftList
            })(<Input />)}
          </Form.Item>
          <Form.Item label="其他技能/Other Skill(If any)" className="applay__information-content">
            {getFieldDecorator('OtherSkills', {
              initialValue: currentInfo.OtherSkills
            })(<Input />)}
          </Form.Item>
          <h3 className="applay__information-title" id="其他">
            Other information 其他资料
          </h3>
          <Form.Item label="身高(CM)/Height" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Height', {
              initialValue: currentInfo.Height
            })(<Input />)}
          </Form.Item>
          <Form.Item label="体重(KG)/Weight" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Weight', {
              initialValue: currentInfo.Weight
            })(<Input />)}
          </Form.Item>
          <Form.Item label="视力左 /Eye Left sight" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('EyeLeftSight', {
              initialValue: currentInfo.EyeSight
            })(<Input />)}
          </Form.Item>
          <Form.Item label="视力右 /Eye Right sight" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('EyeRightSight', {
              initialValue: currentInfo.EyeSightR 
            })(<Input />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                是否得过严重的疾病？目前身体状况如何？是否患有传染病，慢性病等？
                <br />
                Have you ever been suffering from any severe disease? What are
                your current health? Are you sick for contagion, or chronic etc.
              </p>
            }
          >
            {getFieldDecorator('DiseaseStatus', {
              initialValue: currentInfo.DiseaseStatus
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }} >
                是否有犯罪记录或失信行为记录？如是，请详细说明
                <br />
                Do you have criminal history or discredit history? If yes,
                please give the details.
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('Criminal', {
              initialValue: currentInfo.Criminal
            })(
              <TextArea/>
            )}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }} >
                是否有过4个月以上的失业经历？如有，请详细说明。
                <br />
                Do you have any unemployed period of more than 4 months? If yes,
                please give the details.
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('UnemployedStatus', {
              initialValue: currentInfo.UnemployedStatus
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                是否认识本公司的员工？如是，请详细指出姓名及与其关系。
                <br />
                Do you know any employee of Finisar Shanghai Inc.? If yes,
                please give his/her name and relationship.
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('KnowColleageStatus', {
              initialValue: [
                currentInfo.KnowColleageStatus,
                currentInfo.Recommender,
                currentInfo.RecomenderRelation
              ]
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                与现任雇主的合同或服务协议是否到期？
                <br />
                Do you have any unexpired contract or service agreement with
                your present employer?
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('OtherAgreement', {
              initialValue: currentInfo.OtherAgreement
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                是否签署过竞业限制协议或保密协议？请说明何时到期及是否需赔款？
                <br />
                Do you have ever signed non-competition agreement or
                confidentiality agreement?Please explain when does the contract
                or agreement at term?
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('CompetitionAgreement', {
              initialValue: [
                currentInfo.CompetitionAgreement,
                currentInfo.TimeofExpiration,
                currentInfo.ifToNeedReparations
              ]
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                办理离职手续需多长时间？
                <br />
                Do you need to pay compensation for demission?
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('HowLong', {
              initialValue: currentInfo.HowLong
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                如被录用何时可以上班？
                <br />
                When would be available for you?
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('WhenOn', {
              initialValue: currentInfo.WhenOn
            })(<TextArea />)}
          </Form.Item>
          <h3 className="applay__information-title" id="自我评价">
          自我评价/Self Appraisement
          </h3>
          <Form.Item label="自我评价/Appraisement" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Appraisement', {
              initialValue: currentInfo.SelfAccessment
            })(<TextArea />)}
          </Form.Item>
          <div>
              <h3>Commitments/本人承诺</h3>
              <p style={{padding:5,textAlign:'left'}}>1) All informantion given are true and accurate ,otherwise I'm willing to be punished even dismissed.<br/>  所有填表内容真实、准确,如有虚假愿意接受处分包括辞退</p>
              <p>2) I agree with further background check.<br/>
              本人同意公司进行背景调查</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style = {{width:"100%",height:"40px"}}>
              <div className = "applay__informnation-signPerson" > 申请人签名/Signature of Applicant </div>
              <div className = "applay__informnation-date">日期/Date</div>
            </div>
            <Form.Item style={{ textAlign: 'center' }}>
              <Button type="primary" onClick={this.handleSave}>保存</Button>
              <Button type="primary" onClick={this.handleClick}>
                确认打印
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Applayinformation);
