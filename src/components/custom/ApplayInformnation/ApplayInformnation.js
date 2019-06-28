import React, { Component } from 'react';
import './ApplayInformnation.less';
import { Form, Input, DatePicker, Radio, Button, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import PropTypes from 'prop-types';
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
const formItemLayout = {
  labelCol: {
    span: 12
  },
  wrapperCol: {
    span: 12
  }
};
const { RangePicker } = DatePicker;
const formItemLayout2 = {
  labelCol: {
    span: 12
  },
  wrapperCol: {
    span: 12
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
    initialValue: PropTypes.object
  };

  static defaultProps = {
    initialValue: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      currentInfo: {}
    };
  }
  // 确认修改并打印
  handleModifyAndPrint = () => {
    // 打印
    const newEle = document.querySelector('.applay__informnation').innerHTML;
    var oldstr = document.body.innerHTML; //保存当前页面
    document.body.innerHTML = newEle; //把当前页面内容替换为要打印的内容
    window.print();
    document.body.innerHTML = oldstr; //恢复原来的页面
    return false;
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { initialValue } = this.props;
    console.log(initialValue);
    return (
      <div
        className="applay__informnation"
        style={{ height: '100vh', overflow: 'scroll' }}
      >
        <Form>
          <div className="informnation__boundary">
            <h3 className="applay__informnation-title" id="个人资料">
              个人资料/Personal Information
            </h3>
            <Form.Item label="中文姓名/ChineseName" {...formItemLayout}>
              {getFieldDecorator('ChName', {
                initialValue: initialValue.ChName,
                rules: [
                  {
                    required: true,
                    message: '请输入中文姓名'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item
              colon={false}
              label="英文姓名
            EnglishName"
              {...formItemLayout}
            >
              {getFieldDecorator('EnName', {
                initialValue: initialValue.EnName
              })(<Input />)}
            </Form.Item>
            <Form.Item label="申请职位名称/jobTitle" {...formItemLayout}>
              {getFieldDecorator('appPosition', {
                initialValue: initialValue.appPosition,
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
                initialValue: initialValue.idNumber,
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
                initialValue: initialValue.Sex,
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
                initialValue: initialValue.Phone,
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
                initialValue: initialValue.Email,
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
                initialValue: initialValue.Nationality,
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
                initialValue: initialValue.Nation,
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
                initialValue: initialValue.Party,
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
                initialValue: initialValue.BirthOfDate,
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
                initialValue: initialValue.BirthPlace,
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
                initialValue: initialValue.PlaceOfHukou,
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
                initialValue: initialValue.BloodType,
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
                initialValue: initialValue.CurrentAddress,
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
                initialValue: initialValue.IfRecommendByF,
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
                initialValue: initialValue.RecommenderName
              })(<Input />)}
            </Form.Item>
            <Form.Item label="和推荐人关系/relationship" {...formItemLayout}>
              {getFieldDecorator('RecommenderRelation', {
                initialValue: initialValue.RecommenderRelation
              })(<Input />)}
            </Form.Item>
            <Form.Item label="婚姻状况/Marital status" {...formItemLayout}>
              {getFieldDecorator('MaritalStatus', {
                initialValue: initialValue.MaritalStatus
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
                initialValue: initialValue.ChildIf
              })(
                <Radio.Group>
                  <Radio value="有">有</Radio>
                  <Radio value="无">无</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </div>
          <h3 className="applay__informnation-title" id="教育背景">
            教育背景/(请从最近的开始写起)Education Background (Please start from
            latest education to middle school)
          </h3>
          <div className="informnation__boundary">
            <Form.Item label="日期/latest period from to" {...formItemLayout2}>
              {getFieldDecorator('Eddate1', {
                initialValue: [
                  moment(initialValue.EdStartTime1, dateFormat),
                  moment(initialValue.EdEndTime1, dateFormat)
                ]
              })(<RangePicker />)}
            </Form.Item>
            <Form.Item label="学校名称/schoolName" {...formItemLayout2}>
              {getFieldDecorator('EdSchool1', {
                initialValue: initialValue.EdSchool1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="专业名称/major" {...formItemLayout2}>
              {getFieldDecorator('EdMajor1', {
                initialValue: initialValue.EdMajor1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="学位/degree" {...formItemLayout2}>
              {getFieldDecorator('EdDegree1', {
                initialValue: initialValue.EdDegree1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/ReferenceName" {...formItemLayout2}>
              {getFieldDecorator('EdReference1', {
                initialValue: initialValue.EdReference1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/ReferenceTel" {...formItemLayout2}>
              {getFieldDecorator('EdReferenceTel1', {
                initialValue: initialValue.EdReferenceTel1
              })(<Input />)}
            </Form.Item>
          </div>
          <h3 className="applay__informnation-title" id="工作经历">
            工作经历(请从最近的写起)/Working History (Please start with latest
            one)
          </h3>
          <div className="informnation__boundary">
            <Form.Item
              label="任职年限/post period from to "
              {...formItemLayout2}
            >
              {getFieldDecorator('WorkDate1', {
                initialValue: [
                  moment(initialValue.WorkStartTime1, dateFormat),
                  moment(initialValue.WorkEndTime1, dateFormat)
                ]
              })(<RangePicker />)}
            </Form.Item>
            <Form.Item
              label="公司名称&类型/name of Com&type"
              {...formItemLayout2}
            >
              {getFieldDecorator('WorkComName1', {
                initialValue: initialValue.WorkComName1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="职位/position" {...formItemLayout2}>
              {getFieldDecorator('WorkRank1', {
                initialValue: initialValue.WorkRank1
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="离职原因/Reasons for leaving"
              {...formItemLayout2}
            >
              {getFieldDecorator('ReasonForLeave1', {
                initialValue: initialValue.ReasonForLeave1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2}>
              {getFieldDecorator('WorkReference1', {
                initialValue: initialValue.WorkReference1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Reference phone" {...formItemLayout2}>
              {getFieldDecorator('WorkReferenceTel1', {
                initialValue: initialValue.WorkReferenceTel1
              })(<Input />)}
            </Form.Item>
          </div>
          <h3 className="applay__informnation-title" id="家庭成员关系">
            家庭成员及主要社会关系/Family Members and Mainly Social Relationship
          </h3>
          <div className="informnation__boundary">
            <Form.Item label="姓名/Name" {...formItemLayout2}>
              {getFieldDecorator('FamName1', {
                initialValue: initialValue.FamName1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="关系/Relationship" {...formItemLayout2}>
              {getFieldDecorator('FamRelation1', {
                initialValue: initialValue.FamRelation1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="职务/position" {...formItemLayout2}>
              {getFieldDecorator('FamPosition1', {
                initialValue: initialValue.FamPosition1
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="公司名称&地址/name of Com&Add"
              {...formItemLayout2}
            >
              {getFieldDecorator('FamComAndAdd1', {
                initialValue: initialValue.FamComAndAdd1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="电话/TelPhone" {...formItemLayout2}>
              {getFieldDecorator('FamOneTel', {
                initialValue: initialValue.FamOneTel
              })(<Input />)}
            </Form.Item>
            <Form.Item label="出生年月/birthOfDate" {...formItemLayout2}>
              {getFieldDecorator('FamBirthDate1', {
                initialValue: initialValue.FamBirthDate1
              })(<Input />)}
            </Form.Item>
          </div>
          <h3 className="applay__informnation-title" id="专业培训">
            专业培训
          </h3>
          <div className="informnation__boundary">
            <Form.Item label="日期/post period from to " {...formItemLayout2}>
              {getFieldDecorator('TrainingDate1', {
                initialValue: initialValue.TrainingDate1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="培训机构/name of Com&type" {...formItemLayout2}>
              {getFieldDecorator('TrainingInstitute1', {
                initialValue: initialValue.TrainingInstitute1
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="专业资格/professionalQualification"
              {...formItemLayout2}
            >
              {getFieldDecorator('TrainingQualification1', {
                initialValue: initialValue.TrainingQualification1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2}>
              {getFieldDecorator('TrainingReference1', {
                initialValue: initialValue.TrainingReference1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Reference phone" {...formItemLayout2}>
              {getFieldDecorator('TrainingRefTel1', {
                initialValue: initialValue.TrainingRefTel1
              })(<Input />)}
            </Form.Item>
          </div>
          <h3 className="applay__informnation-title" id="相关技能">
            相关技能/Related Qualification / Skill (If any)
          </h3>
          <Form.Item label="语言能力/languageAbility" {...formItemLayout2}>
            {getFieldDecorator('languageAbility', {
              initialValue: initialValue.languageAbility
            })(
              <Input disabled placeholder="请列明程度,优秀，良好，一般，欠佳" />
            )}
          </Form.Item>
          <Form.Item label="英语CET/CET" {...formItemLayout2}>
            {getFieldDecorator('EnCET', {
              initialValue: initialValue.EnCET
            })(
              <Select>
                <Option value="四级">四级</Option>
                <Option value="六级">六级</Option>
                <Option value="专八">专八</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="写作/Writing" {...formItemLayout2}>
            {getFieldDecorator('Writing', {
              initialValue: initialValue.Writing
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
          <Form.Item label="阅读/Reading" {...formItemLayout2}>
            {getFieldDecorator('Reading', {
              initialValue: initialValue.Reading
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
          <Form.Item label="口语/Speaking" {...formItemLayout2}>
            {getFieldDecorator('Speaking', {
              initialValue: initialValue.Speaking
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
              initialValue: initialValue.ComputerSkills
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
              initialValue: initialValue.SoftList
            })(<Input />)}
          </Form.Item>
          <Form.Item label="其他技能/other skills">
            {getFieldDecorator('OtherSkills', {
              initialValue: initialValue.OtherSkills
            })(<Input />)}
          </Form.Item>
          <h3 className="applay__informnation-title" id="其他">
            其他/other informnation
          </h3>
          <Form.Item label="身高cm/height" {...formItemLayout2}>
            {getFieldDecorator('Height', {
              initialValue: initialValue.Height
            })(<Input />)}
          </Form.Item>
          <Form.Item label="体重kg/weight" {...formItemLayout2}>
            {getFieldDecorator('Weight', {
              initialValue: initialValue.Weight
            })(<Input />)}
          </Form.Item>
          <Form.Item label="视力左 右/eye sight" {...formItemLayout2}>
            {getFieldDecorator('EyeSight', {
              initialValue: initialValue.EyeSight
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
              initialValue: initialValue.DiseaseStatus
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                是否有犯罪记录或失信行为记录？如是，请详细说明
                <br />
                Do you have criminal history or discredit history? If yes,
                please give the details.
              </p>
            }
          >
            {getFieldDecorator('CrimianlStatus', {
              initialValue: initialValue.CrimianlStatus
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                是否有过4个月以上的失业经历？如有，请详细说明。
                <br />
                Do you have any unemployed period of more than 4 months? If yes,
                please give the details.
              </p>
            }
          >
            {getFieldDecorator('UnemployedStatus', {
              initialValue: initialValue.UnemployedStatus
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
          >
            {getFieldDecorator('KnowColleageStatus', {
              initialValue: initialValue.KnowColleageStatus
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
          >
            {getFieldDecorator('OtherAgreement', {
              initialValue: initialValue.OtherAgreement
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
          >
            {getFieldDecorator('CompetitionAgreement', {
              initialValue: initialValue.OtherAgreement
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
          >
            {getFieldDecorator('HowLong', {
              initialValue: initialValue.OtherAgreement
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
          >
            {getFieldDecorator('WhenOn', {
              initialValue: initialValue.OtherAgreement
            })(<TextArea />)}
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary">保存</Button>
            <Button type="primary" onClick={this.handleClick}>
              确认打印
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ApplayInformnation);
