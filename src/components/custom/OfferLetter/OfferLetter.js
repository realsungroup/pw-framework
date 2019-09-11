import React, { Component } from 'react';
import './OfferLetter.less';
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
  message
} from 'antd';


class OfferLetter extends React.Component {
  constructor() {
    super();
    this.state = {
      sex: '',
      nowdate: '',
      salary: '',
      level: ''
    };
  }
  componentDidMount = () => {

  }
  render() {
    return (
      <div className="container">
        <div style={{ textAlign: 'center' }}>
          <div className="logo"></div>
          <div className="header">
            <h3 style={{ margin: '0' }}>
              Finisar Wuxi, Incorporated
              <br />
            </h3>
            <p style={{ margin: '0' }}>
              Z3-1,No 3 Gaolang Road,Wuxi,China 214028
            </p>
            <h3>JOB OFFER LETTER</h3>
          </div>
        </div>
        <div className="offer-content">
          {/* <Input
            size="small"
            value={this.state.nowdate}
            style={{ width: '170px', paddingBottom: '5px' }}
          />
          <br /> */}
          Dear{' '}
          <u><Input size="small" class="offer-name" style={{ width: '120px',textAlign:"center" }} /></u>
          <br />
          <p>
            Finisar Wuxi, Inc. is pleased to offer you a job as a 
            <Input
              size="small"
              style={{
                width: '200px',
                border: 'none',
                borderBottom: '1px underline black',
                textAlign:"center",
                fontWeight:"bold"
              }}
            />{' '}
            . We trust that your knowledge, skills and experience will be among
            our most valuable assets.
          </p>
          <p>
            Should you accept this job offer, per company policy you will be
            eligible to receive the following compensations or arrangement
            beginning on your reporting date.
          </p>
          <ul>
            <li>
              <strong>Salary</strong>: Monthly gross starting salary of RMB
              <Input
                size="small"
                style={{
                  width: '80px',
                  border: 'none',
                  borderBottom: '1px underline black',
                  textAlign:"center",
                  fontWeight:"bold"
                }}
              />
              (before tax, 12months pay), paid by direct deposit.
            </li>
            <li>
              <strong>Sign-on RSUs:</strong> Finisar and II-VI Incorporated are
              working together to become one Company. If your start date occurs
              before the acquisition date, subject to the approval of Finisar’s
              Board of Directors, you will be issued a value of $ in Finisar’s
              Restricted Stock Units (RSUs). These RSUs will vest over a
              four-year period at the rate of 25% per year starting from the
              date of grant and will be subject to the terms and conditions of
              Finisar’s Stock Incentive Plan and applicable agreements. If you
              start after the acquisition date, you will be issued a combination
              of II-VI Stock Options and RSUs with the same or slightly greater
              value than the value referenced above. The value will be split
              equally (50/50) between Stock Options and RSUs. The price
              associated with these RSUs and Stock Options will be referenced
              from the closing price on the 27th day of the month following the
              next II-VI Board of Director’s Meeting and will be awarded on the
              28th of that month, upon approval. The Restricted Stock Units vest
              equally over a three-year period at the rate of one third per
              year. The Stock Options vest equally over a four-year period at a
              rate of one quarter per year. These Awards will be subject to the
              terms and conditions of II-VI’s Stock Incentive Plan and
              applicable agreements. If the employment contract between you and
              the company is terminated, all offered RSUs/Stock Options that
              have not vested will be cancelled unconditionally and immediately
              on your last working day.
            </li>
            <li>
              <strong>Yearly Bonus:</strong> Equal to 1 month of your base
              salary. Will be paid pro rata according to the service months in
              the calendar year. If the employment contract between you and
              company end before the payment date, you will not eligible for
              this bonus.
            </li>
            <li>
              <strong>Level:</strong>{' '}
              <Input size="small" style={{ width: '80px',textAlign:"center",fontWeight:"bold" }} />
            </li>
            <li>
              <strong>Manager:</strong> Report to
              <Input size="small" style={{ width: "200px",textAlign:"center",fontWeight:"bold" }} />
            </li>
            <li>
              <strong>Job Location: </strong>Wuxi, China.
            </li>
            <li>
              <strong>Probation Period: </strong>6 months with 3 years contract.
            </li>
            <li>
              <strong>Normal working time:</strong> 5 working days per week; 8
              working hours per day.
            </li>
            <li>
              <strong>Benefits:</strong></li>
              <ul>
              <li>
                Standard, Finisar Wuxi, Inc. provided benefits for
                salaried-exempt employees, including the following.
              </li>
              <li>
                Social insurance and housing fund as required by the local
                municipal government of Wuxi.
              </li>
              <li>
                Other benefits in accordance with company policy and government
                regulations.
              </li>
              </ul>
          </ul>
          <p style={{ paddingBottom: '5px' }}>
            Sincerely,
            <br />
            Alwin Li
            <br />
            HR Driector
          </p>
          <h3>Accept Job Offer</h3>
          <p>
            By signing and dating this letter below, I accept the job offer of{' '}
            <Input size="small" style={{ width: '200px',textAlign:"center",fontWeight:"bold" }} /> at Finisar Wuxi,
            Incorporated. I have reviewed and agree the following hiring and
            on-board conditions.
            <p style={{ margin: '0' }}>
              Signature: <Input size="small" style={{ width: '180px',textAlign:"center",fontWeight:"bold" }} /> Date:{' '}
              <Input size="small" style={{ width: '120px',textAlign:"center",fontWeight:"bold" }} />
            </p>
            <p>
              Please sign this job offer and resend to us within 5 days after
              you receive it. If not, the offer letter will become invalid.
            </p>
          </p>
          <div className="logos"></div>
          <h3>聘用条件</h3>
          <p>
            公司实施录用考核制度，不符合录用条件的员工，公司可在试用期内解除其劳动合同，或在约定时间退回派遣机构。
          </p>
          <h4>以下情况均被视为不符合录用条件：</h4>
          <ul className="condition" style={{ paddingLeft: '17px' }}>
            <li>未满16周岁者；</li>
            <li>有聘用禁忌情形者；</li>
            <li>经公司指定医院体检不合格者；</li>
            <li>患有精神疾病或传染病者，不能正常从事该岗位工作的；</li>
            <li>不具备政府规定的就业手续者；</li>
            <li>不能纳入政府社保体系或未在指定期限内完成社保帐户转移的；</li>
            <li>未在指定时间将个人档案转入公司指定的档案管理机构的；</li>
            <li>在前任职位单位签订并履行的竞业限制条款有冲突的；</li>
            <li>未在指定期限内提供有效的离职证明的；</li>
            <li>未在指定期限内及时返还签署完毕的劳动合同的；</li>
            <li>未在指定期限内及时办妥入职手续的；</li>
            <li>未通过新员工入职培训考核的；</li>
            <li>未通过试用期考核的；</li>
            <li>工作能力、工作态度不符合岗位说明者；</li>
            <li>不符合岗位技能要求的；</li>
            <li>录用评估无法满足业绩需要的；</li>
            <li>严重违反劳动纪律或规章制度的；</li>
            <li>背景调查不合格的；</li>
            <li>简历内容不符合事实及其它有欺骗、隐瞒或不诚实行为者；</li>
            <li>
              曾经被本公司或其他关联公司辞退或未经本公司或其他关联公司批准擅自离职者；
            </li>
            <li>亏空、拖欠公款尚未清偿者；</li>
            <li>酗酒、吸毒者；</li>
            <li>被判处刑罚，尚未执行完毕的；</li>
            <li>被剥夺公民权利者；</li>
            <li>通缉在案者；</li>
            <li>
              具有其他影响公司雇佣决策情形且在签订录用通知前未告知公司的；
            </li>
            <li>其他不符合录用条件的情形。</li>
          </ul>
          <div className="logot"></div>
          <h3>报道注意事项</h3>
          <p>
            请您于
            <Input size="small" style={{ width: '55px',textAlign:"center",fontWeight:"bold" }} /> 年
            <Input size="small" style={{ width: '55px',textAlign:"center",fontWeight:"bold" }} />月
            <Input size="small" style={{ width: '55px',textAlign:"center",fontWeight:"bold" }} />日 
            <Input size="small" style={{ width: '55px',textAlign:"center",fontWeight:"bold"}} value = "08:00"/>
            
            时携带如下资料至公司人力资源部办理报到手续。如无法按期报到的，请您及时与公司人力资源部取得联系并说明理由，公司将酌情是否另行安排报到时间。如您未能按时报到或未能在公司另行指定的报到时间报到的，本录取通知书失效。
          </p>
          <div style={{ marginBottom: '40px' }}>
            <ul className="notice" style={{ paddingLeft: '0px' }}>
              <li>1. 身份证原件；</li>
              <li>2. 户口本的本人页及首页复印件；</li>
              <li>
                3. 近2个月内的一寸彩色照片2张（白底证件照，同时需要电子档）；
              </li>
              <li>4. 原始学历和最高学历.学位证书及专业资格证书原件；</li>
              <li>
                5.
                体检报告（无锡恒康医院的体检或外地三级甲等医院的体检。注：已居住在无锡的员工需到无锡恒康医院做入职体检；外地县级市没有三甲医院的可到当地其他公立医院体检。）；
              </li>
              <li>6. 无锡建设银行储蓄卡；</li>
              <li>
                7.
                离职证明（原公司开具的离职证明上需写明双方解除劳动合同的具体日期，以及解除理由，并盖章）；
              </li>
              <li>
                8.
                《无锡市终止或解除劳动关系通知单》或《无锡人才离职情况表》（已在无锡缴纳过社保的员工）。
              </li>
            </ul>
          </div>
          <h3>公司地址：无锡新区高浪东路3号综合保税区Z3-1</h3>
          <ul style={{ listStyle: 'none', paddingLeft: '0px' }}>
            <li>
              1. 背景调查信息：
              <p style={{ textIndent: '2em' }}>
                请提供你目前所在公司三个联系人（直接主管，人事主管，同事）的姓名及电话，我们在必要情况下做相关背景调查。
              </p>
              <p>
                公司名称：
                <Input size="small" style={{ width: '240px' ,textAlign:"center"}} />
              </p>
              <ol type="a">
                <li>
                  姓名：
                  <Input size="small" style={{ width: '100px',textAlign:"center",fontWeight:"bold" }} />
                  职位：
                  <Input size="small" style={{ width: '100px',textAlign:"center",fontWeight:"bold" }} />
                  办公室电话：
                  <Input size="small" style={{ width: '100px' ,textAlign:"center",fontWeight:"bold"}} />
                  手机：
                  <Input size="small" style={{ width: '120px',textAlign:"center",fontWeight:"bold" }} />
                </li>
                <li>
                  姓名：
                  <Input size="small" style={{ width: '100px',textAlign:"center",fontWeight:"bold" }} />
                  职位：
                  <Input size="small" style={{ width: '100px',textAlign:"center",fontWeight:"bold" }} />
                  办公室电话：
                  <Input size="small" style={{ width: '100px',textAlign:"center",fontWeight:"bold" }} />
                  手机：
                  <Input size="small" style={{ width: '120px',textAlign:"center",fontWeight:"bold" }} />
                </li>
                <li>
                  姓名：
                  <Input size="small" style={{ width: '100px',textAlign:"center",fontWeight:"bold" }} />
                  职位：
                  <Input size="small" style={{ width: '100px',textAlign:"center",fontWeight:"bold" }} />
                  办公室电话：
                  <Input size="small" style={{ width: '100px',textAlign:"center",fontWeight:"bold" }} />
                  手机：
                  <Input size="small" style={{ width: '120px',textAlign:"center",fontWeight:"bold" }} />
                </li>
              </ol>
            </li>
            <li>
              2. 其他信息：
              <p style={{ textIndent: '2em' }}>
                请确定一个您使用的英文名
                <Input size="small" style={{ width: '100px' ,textAlign:"center",fontWeight:"bold"}} />
                ，我们将据此为你建立一个公司邮箱，如没有，我们将用您中文姓名的拼音来建立邮箱。如果您的英文名与现有员工重名或会导致歧义，公司会建议您更换英文名。
              </p>
            </li>
          </ul>
          <h3>
            我们将核实所有您所提供的资料，如果与事实不符，本录取通知书自动失效。
          </h3>
          <p>
            若有任何疑问，请与人力资源部
            <Input size="small" style={{ width: '100px',textAlign:"center",fontWeight:"bold" }} />
            联系。Tel:
            <Input size="small" style={{ width: '180px',textAlign:"center",fontWeight:"bold" }} /> or{' '}
            <Input size="small" style={{ width: '120px',textAlign:"center",fontWeight:"bold" }} />。
          </p>
          <div style={{ marginTop: '40px' }}>
              <h2>
                Warmly welcome to be a member of Finisar Wuxi!
                <br />
                欢迎加入菲尼萨无锡！
              </h2>
          </div>
          <Button type = "primary" style ={{ marginLeft:"5px"}}>保存</Button>
          <Button type = "primary" style ={{ marginLeft:"5px"}}>下载</Button>
          <Button type = "primary" style ={{ marginLeft:"5px"}}>打印</Button>
        </div>
      </div>
    );
  }
}

export default OfferLetter;
