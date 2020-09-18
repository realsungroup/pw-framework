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
  message,
  Switch
} from 'antd';
import FormData from '../../common/data/FormData';
import TableData from '../../common/data/TableData';
import dealControlArr from 'Util20/controls';
import { getDataProp } from 'Util20/formData2ControlsData';

import http from '../../../util20/api';
import logo from '../../../assets/logo.png';
const { Option } = Select;
const resid = window.pwConfig[process.env.NODE_ENV].offerletter;

class OfferLetter extends React.Component {
  constructor() {
    super();

    this.state = {
      salary: '',
      level: '',
      data: {
        candidate: '',
        position: '',
        salary: '',
        level: '',
        manager: '',
        details: '',
        signature: '',
        date: '',
        year: '',
        month: '',
        day: '',
        hour: '08:00',
        bgCorp: '',
        contactsOne: '',
        contactsPositionOne: '',
        officeNo: '',
        contactsOnePhone: '',
        contactsTwo: '',
        contactsPositionTwo: '',
        contactsTwoOfficeNo: '',
        contactsTwoPhone: '',
        contactsThree: '',
        contactsPositionThree: '',
        contactsThreeOfficeNo: '',
        contactsThreePhone: '',
        englishName: '',
        HRName: '',
        HROfficeNo: '',
        HRPhone: '',
        stock: '',
        location: 'WX',
        isHasStock: 'N'
      },
      isShow: true,
      isSave: false,
      loading: false
    };
  }
  componentDidMount = () => {
    var peopleData = this.props.personDetail;
    this.getTableData(peopleData);
    let data = this.state.data;
    this.setState({
      data: {
        ...data,
        ID: peopleData
      }
    });
  };
  /**
     * 获取主表窗体数据
     */
  getFormData = async (record, formName = 'default') => {
    let res;
    try {
      this.setState({ loading: true });
      res = await http().getFormData({
        resid: resid,
        formName
      });
      const formData = dealControlArr(res.data.columns);
      this._dataProp = getDataProp(formData, record, true, false, false);
    } catch (err) {
      console.log(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
  };

  componentWillReceiveProps = nextProps => {
    let data = this.state.data;
    console.log(nextProps.personDetail);
    if (nextProps.personDetail) {
      if (typeof nextProps.personDetail !== 'undefined') {
        this.setState({
          data: {
            ...data,
            ID: nextProps.personDetail
          }
        });
        this.getTableData(nextProps.personDetail);
        // this.getFormData(record, createWindowName);
      }
    } else {
    }

  };

  getTableData = async id => {
    this.setState({ loading: true });
    this.setState({
      data: {
        ID: id,
        candidate: '',
        position: '',
        salary: '',
        level: '',
        manager: '',
        details: '',
        signature: '',
        date: '',
        year: '',
        month: '',
        day: '',
        hour: '08:00',
        bgCorp: '',
        contactsOne: '',
        contactsPositionOne: '',
        officeNo: '',
        contactsOnePhone: '',
        contactsTwo: '',
        contactsPositionTwo: '',
        contactsTwoOfficeNo: '',
        contactsTwoPhone: '',
        contactsThree: '',
        contactsPositionThree: '',
        contactsThreeOfficeNo: '',
        contactsThreePhone: '',
        englishName: '',
        HRName: '',
        HROfficeNo: '',
        HRPhone: '',
        stock: '',
        location: 'WX',
        isHasStock: 'N'
      },
      isSave: false,
      isShow: true
    });

    try {
      let res = await http().getTable({
        resid: 621422585590,
        cmswhere: `ID=${id}`
      });
      console.log(res);
      if (res.data.length > 0) {
        console.log('jinlaile');
        this.setState({ isSave: true });
        var obj = res.data[0];
        this.setState({ data: obj });
      }
      this.getPersonalInfo(613149356409, id);
    } catch (error) {
      message.error(error.message);
      this.setState({ loading: false });
    }
  };
  onSaveData = async () => {
    let { data } = this.state;
    this.setState({ loading: true });

    if (this.state.isSave == false) {
      try {
        const res = await http().addRecords({
          resid: 621422585590,
          data: [data]
        });
        message.success('保存成功');

        this.setState({ loading: false });
      } catch (error) {
        message.error(error.message);
        this.setState({ loading: false });
      }
    } else {
      try {
        const res = await http().modifyRecords({
          resid: 621422585590,
          data: [data]
        });
        message.success('保存成功');
        // this.setState({
        //   data: {
        //     candidate: '',
        //     position: '',
        //     salary: '',
        //     level: '',
        //     manager: '',
        //     details: '',
        //     signature: '',
        //     date: '',
        //     year: '',
        //     month: '',
        //     day: '',
        //     hour: '',
        //     bgCorp: '',
        //     contactsOne: '',
        //     contactsPositionOne: '',
        //     officeNo: '',
        //     contactsOnePhone: '',
        //     contactsTwo: '',
        //     contactsPositionTwo: '',
        //     contactsTwoOfficeNo: '',
        //     contactsTwoPhone: '',
        //     contactsThree: '',
        //     contactsPositionThree: '',
        //     contactsThreeOfficeNo: '',
        //     contactsThreePhone: '',
        //     englishName: '',
        //     HRName: '',
        //     HROfficeNo: '',
        //     HRPhone: '',
        //     stock:''
        //   }
        // });
        this.setState({ loading: false });
      } catch (error) {
        message.error(error.message);
        this.setState({ loading: false });
      }
    }
  };

  candidateChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        candidate: value
      }
    });
  };

  jobChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        position: value
      }
    });
  };

  salaryChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        salary: value
      }
    });
  };
  levelChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        level: value
      }
    });
  };
  ManagerChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        manager: value
      }
    });
  };

  detailsChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        details: value
      }
    });
  };
  signChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        signature: value
      }
    });
  };
  dateChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        date: value
      }
    });
  };
  yearChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        year: value
      }
    });
  };
  monthChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        month: value
      }
    });
  };
  dayChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        day: value
      }
    });
  };
  stockChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        stock: value
      }
    });
  };
  hourChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        hour: value
      }
    });
  };
  bgCorpChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        bgCorp: value
      }
    });
  };
  nameOneChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        contactsOne: value
      }
    });
  };
  contactsOneChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        contactsOne: value
      }
    });
  };
  contactsPositionOneChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        contactsPositionOne: value
      }
    });
  };
  officeOneChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        officeNo: value
      }
    });
  };
  phoneOneChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        contactsOnePhone: value
      }
    });
  };
  nameTwoChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        contactsTwo: value
      }
    });
  };
  positionTwoChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        contactsPositionTwo: value
      }
    });
  };
  officeTwoChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        contactsTwoOfficeNo: value
      }
    });
  };
  phoneTwoChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        contactsTwoPhone: value
      }
    });
  };
  nameThreeChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        contactsThree: value
      }
    });
  };
  positionThreeChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        contactsPositionThree: value
      }
    });
  };
  officeThreeChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        contactsThreeOfficeNo: value
      }
    });
  };
  phoneThreeChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        contactsThreePhone: value
      }
    });
  };
  englishNameChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        englishName: value
      }
    });
  };
  hrNameChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        HRName: value
      }
    });
  };
  hrofficeChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        HROfficeNo: value
      }
    });
  };
  hasStockChange = value => {
    let data = this.state.data;
    if (data.isHasStock == 'Y') {
      this.setState({
        data: {
          ...data,
          isHasStock: 'N'
        }
      });
    } else {
      this.setState({
        data: {
          ...data,
          isHasStock: 'Y'
        }
      });
    }
  };
  hrphoneChange = value => {
    let data = this.state.data;
    console.log(value);
    this.setState({
      data: {
        ...data,
        HRPhone: value
      }
    });
  };
  onDownload = () => {
    this.setState({
      isShow: false
    });
  };
  locaSele = V => {
    let data = this.state.data;
    this.setState({
      data: {
        ...data,
        location: V
      }
    });
  };
  showHis = () => {
    this.setState({ overlay: true });
  };
  clzHis = () => {
    this.setState({ overlay: false });
  };
  // 获取当前人员人员详细信息
  getPersonalInfo = async (resid, id) => {
    let res;
    try {
      res = await http().getTable({
        resid: resid,
        cmswhere: `ID=${id}`
      });

      let data = this.state.data;
      if (res.data[0].Email) {
        this.setState({
          data: {
            ...data,
            emailaddress: res.data[0].Email
          }
        });
      }
      this.setState({ loading: false });
    } catch (err) {
      Modal.error({
        title: '提示',
        content: err.message,
        okText: 'OK'

      });
      this.setState({ loading: false });
    }
  };
  onPrinting = () => {
    const bodyHtml = window.document.body.innerHTML;

    var footstr = "</body>";
    var newstr = document.getElementById('content').innerHTML;
    var style = '<style>p{font-size:15px;}</style>';
    var headstr = "<html><head><title></title>" + style + "</head><body>";
    document.body.innerHTML = headstr + newstr + footstr;
    window.print();
    window.document.body.innerHTML = bodyHtml;
    window.location.reload();

  };

  onSendMail = async () => {
    console.log();
    let { data } = this.state;
    data.isSendEmail = 'Y';
    var myDate = new Date();
    this.setState({ loading: true });
    data.sendEmailTime = myDate;
    if (this.state.isSave == false) {
      try {
        const res = await http().addRecords({
          resid: 621422585590,
          data: [data]
        });
        message.success('发送邮件成功');

        this.setState({ loading: false });
      } catch (error) {
        message.error(error.message);
        this.setState({ loading: false });
      }
    } else {
      try {
        const res = await http().modifyRecords({
          resid: 621422585590,
          data: [data]
        });
        message.success('发送邮件成功');
        this.setState({ loading: false });
      } catch (error) {
        message.error(error.message);
        this.setState({ loading: false });
      }
    }
  };
  render() {
    const offerTitle =
      'http://wux-hr03.china.ads.finisar.com/rispweb/upfiles/iivi.png';
    return (
      <div className="container containerOfferLetter" style={{ paddingBottom: '80px' }}>
        <Spin spinning={this.state.loading}>
          <div
            style={{ marginTop: '48px' }}
            id="content"
            ref={p => (this.printer = p)}
          >

            <div
              className={
                this.state.data.location == 'WX' || !this.state.data.location
                  ? 'offer-content'
                  : 'hidden'
              }
            >
              <div style={{ textAlign: 'center' }}>
                <img
                  style={{ margin: '0', width: '100%', height: 'auto' }}
                  src={offerTitle}
                />
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
              Dear&nbsp;
              <strong>
                <u>
                  {this.state.isShow ? (
                    <Input
                      size="small"
                      class="offer-name"
                      style={{
                        width: '120px',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}
                      value={this.state.data.candidate}
                      onChange={e => {
                        this.candidateChange(e.target.value);
                      }}
                    />
                  ) : (
                      <span>{this.state.data.candidate}</span>
                    )}
                </u>
              </strong>
              <br />
              <p>
                Finisar Wuxi, Inc. is pleased to offer you a job as a&nbsp;
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '200px',
                          textAlign: 'center',
                          // border:"none",
                          fontWeight: 'bold'
                        }}
                        onChange={e => {
                          this.jobChange(e.target.value);
                        }}
                        value={this.state.data.position}
                      />
                    ) : (
                        <span>{this.state.data.position}</span>
                      )}
                  </u>
                </strong>
                . We trust that your knowledge, skills and experience will be
                among our most valuable assets.
              </p>
              <p>
                Should you accept this job offer, per company policy you will be
                eligible to receive the following compensations or arrangement
                beginning on your reporting date.
              </p>
              <ul>
                <li>
                  Monthly gross starting salary of{' '}
                  <strong>
                    <u>
                      RMB
                      {this.state.isShow ? (
                        <Input
                          size="small"
                          style={{
                            width: '80px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}
                          value={this.state.data.salary}
                          onChange={e => {
                            this.salaryChange(e.target.value);
                          }}
                        />
                      ) : (
                          <span>{this.state.data.salary}</span>
                        )}
                    </u>
                  </strong>
                  (before tax, 12months pay), paid by direct deposit.
                </li>
                <li
                  className={this.state.data.isHasStock == 'Y' ? '' : 'hidden'}
                >
                  You will be issued a combination of II-VI Incorporated Stock
                  Options and RSUs with a value of $
                  {this.state.isShow ? (
                    <Input
                      size="small"
                      style={{
                        width: '80px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '0',
                        outline: 'none!important',
                        borderBottom: '1px solid #000'
                      }}
                      value={this.state.data.stock}
                      onChange={e => {
                        this.stockChange(e.target.value);
                      }}
                    />
                  ) : (
                      <span>{this.state.data.salary}</span>
                    )}
                  The value will be split equally (50/50) between Stock Options
                  and RSUs. The price associated with these RSUs and Stock
                  Options will be referenced from the closing price on the 27th
                  day of the month following the next II-VI Incorporated Board
                  of Director’s Meeting and will be awarded on the 28th of that
                  month, upon approval. The Restricted Stock Units vest equally
                  over a three-year period at the rate of one third per year.
                  The Stock Options vest equally over a four-year period at a
                  rate of one quarter per year. These Awards will be subject to
                  the terms and conditions of II-VI Incorporated’s Stock
                  Incentive Plan and applicable agreements. This equity is a New
                  Hire grant and future grants may vary. II-VI Incorporated
                  acquired Finisar Corporation in September 2019 and will be
                  harmonizing compensation and benefits programs in the future.
                  This may result in a different mix of compensation and
                  benefits at a comparable value.
                  <br />
                  <br />
                  If the employment contract between you and the company is
                  terminated, all offered RSUs/Stock Options that have not
                  vested will be cancelled unconditionally and immediately on
                  your last working day.
                  <br />
                  <br />
                </li>
                <li>
                  Yearly bonus equals to 1 month of your base salary. Will be
                  paid pro rata according to the service months in the calendar
                  year. If the employment contract between you and company end
                  before the payment date, you will not eligible for this bonus.
                </li>
                <li>
                  <strong>Level:</strong>{' '}
                  <strong>
                    <u>
                      {this.state.isShow ? (
                        <Input
                          size="small"
                          style={{
                            width: '80px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}
                          value={this.state.data.level}
                          onChange={e => {
                            this.levelChange(e.target.value);
                          }}
                        />
                      ) : (
                          <span>{this.state.data.level}</span>
                        )}
                    </u>
                  </strong>
                </li>
                <li>
                  <strong>Manager:</strong> Report to&nbsp;
                  <strong>
                    <u>
                      {this.state.isShow ? (
                        <Input
                          size="small"
                          style={{
                            width: '200px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}
                          value={this.state.data.manager}
                          onChange={e => {
                            this.ManagerChange(e.target.value);
                          }}
                        />
                      ) : (
                          <span>{this.state.data.manager}</span>
                        )}
                    </u>
                  </strong>
                </li>
                <li>
                  <strong>Job Location: </strong>Wuxi, China.
                </li>
                <li>
                  <strong>Probation Period: </strong>6 months with 3 years
                  contract.
                </li>
                <li>
                  <strong>Normal working time:</strong> 5 working days per week;
                  8 working hours per day.
                </li>
                <li>
                  <strong>Benefits:</strong>
                </li>
                <ul>
                  <p>
                    Standard, Finisar Wuxi, Inc. provided benefits for
                    salaried-exempt employees, including the following.
                  </p>
                  <li>
                    Social insurance and housing fund as required by the local
                    municipal government of Wuxi.
                  </li>
                  <li>
                    Other benefits in accordance with company policy and
                    government regulations.
                  </li>
                </ul>
              </ul>
              <br />
              <p style={{ paddingBottom: '5px' }}>
                Sincerely,
                <br />
                <br />
                Alwin Li
                <br />
                <br />
                HR VP
                <br />
                <br />
              </p>
              <h3>Accept Job Offer</h3>
              <p>
                By signing and dating this letter below, I accept the job offer
                of &nbsp;
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '200px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.details}
                        onChange={e => {
                          this.detailsChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.details}</span>
                      )}
                  </u>
                </strong>
                &nbsp; at Finisar Wuxi, Incorporated. I have reviewed and agree
                the following hiring and on-board conditions.
                <p style={{ margin: '0' }}>
                  Signature:{' '}
                  <strong>
                    <u>
                      {this.state.isShow ? (
                        <Input
                          size="small"
                          style={{
                            width: '180px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}
                          value={this.state.data.signature}
                          onChange={e => {
                            this.signChange(e.target.value);
                          }}
                        />
                      ) : (
                          <span>{this.state.data.signature}</span>
                        )}
                    </u>
                  </strong>
                  Date:
                  <strong>
                    <u>
                      <Input
                        size="small"
                        style={{
                          width: '120px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.date}
                        onChange={e => {
                          this.dateChange(e.target.value);
                        }}
                      />
                    </u>
                  </strong>
                </p>
                <p style={{ marginBottom: '60px' }}>
                  Please sign this job offer and resend to us within 5 days
                  after you receive it. If not, the offer letter will become
                  invalid.
                </p>
                {this.state.data.isHasStock == 'Y' ? null : (
                  <div style={{ height: '280px', width: '100%' }}>

                  </div>
                )}
                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    borderBottom: '1px solid #971a1e'
                  }}></div>
                <p style={{ textAlign: "center", color: "#971a1e", fontSize: '12px' }}>T. 724.352.4455  |  F. 724.352.5284  |  ii-vi.com</p>
                <div
                  style={{ height: '1px', width: '100%' }}
                  className={this.state.data.isHasStock == 'Y' ? '' : 'hidden'}
                ></div>
              </p>
              <br />
              <br />
              <img
                style={{ margin: '0', width: '100%', height: 'auto' }}
                src={offerTitle}
              />
              <br />
              <h3>聘用条件</h3>
              <br />
              <p>
                公司实施录用考核制度，不符合录用条件的员工，公司可在试用期内解除其劳动合同，或在约定时间退回派遣机构。
              </p>
              <br />
              <h4 style={{ marginBottom: '20px' }}>
                以下情况均被视为不符合录用条件：
              </h4>
              <ul
                className="condition"
                style={{ paddingLeft: '17px', marginBottom: '20px' }}
              >
                <li>未满16周岁者；</li>
                <li>有聘用禁忌情形者；</li>
                <li>经公司指定医院体检不合格者；</li>
                <li>患有精神疾病或传染病者，不能正常从事该岗位工作的；</li>
                <li>不具备政府规定的就业手续者；</li>
                <li>
                  不能纳入政府社保体系或未在指定期限内完成社保帐户转移的；
                </li>
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
              <br />
              {/* <div className="logot"></div> */}
              <br />
              <img
                style={{ margin: '0', width: '100%', height: 'auto' }}
                src={offerTitle}
              />
              <br />
              <h3>报道注意事项</h3>
              <br />
              <p>
                请您于
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '55px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.year}
                        onChange={e => {
                          this.yearChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.year}</span>
                      )}
                  </u>
                </strong>
                年
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '55px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.month}
                        onChange={e => {
                          this.monthChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.month}</span>
                      )}
                  </u>
                </strong>
                月
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '55px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.day}
                        onChange={e => {
                          this.dayChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.day}</span>
                      )}
                  </u>
                </strong>
                日{' '}
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '60px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.hour}
                        onChange={e => {
                          this.hourChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.hour}</span>
                      )}
                  </u>
                </strong>
                时携带如下资料至公司人力资源部办理报到手续。如无法按期报到的，请您及时与公司人力资源部取得联系并说明理由，公司将酌情是否另行安排报到时间。如您未能按时报到或未能在公司另行指定的报到时间报到的，本录取通知书失效。
              </p>
              <div style={{ marginBottom: '40px' }}>
                <ul className="notice" style={{ paddingLeft: '0px' }}>
                  <li>1. 身份证原件；</li>
                  <li>2. 户口本的本人页及首页复印件；</li>
                  <li>
                    3.
                    近2个月内的一寸彩色照片2张（白底证件照，同时需要电子档）；
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
                  <br />
                  <br />
                  <p style={{ textIndent: '2em' }}>
                    请提供你目前所在公司三个联系人（直接主管，人事主管，同事）的姓名及电话，我们在必要情况下做相关背景调查。
                  </p>
                  <p style={{ marginBottom: '8px' }}>
                    公司名称：
                    <strong>
                      <u>
                        <Input
                          size="small"
                          style={{ width: '240px', textAlign: 'center' }}
                          value={this.state.data.bgCorp}
                          onChange={e => {
                            this.bgCorpChange(e.target.value);
                          }}
                        />
                      </u>
                    </strong>
                  </p>
                  <ol type="a">
                    <li style={{ marginBottom: '15px' }}>
                      姓名：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsOne}
                            onChange={e => {
                              this.contactsOneChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      职位：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsPositionOne}
                            onChange={e => {
                              this.contactsPositionOneChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      办公室电话：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.officeNo}
                            onChange={e => {
                              this.officeOneChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      手机：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '120px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsOnePhone}
                            onChange={e => {
                              this.phoneOneChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      姓名：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsTwo}
                            onChange={e => {
                              this.nameTwoChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      职位：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsPositionTwo}
                            onChange={e => {
                              this.positionTwoChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      办公室电话：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsTwoOfficeNo}
                            onChange={e => {
                              this.officeTwoChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      手机：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '120px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsTwoPhone}
                            onChange={e => {
                              this.phoneTwoChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      姓名：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsThree}
                            onChange={e => {
                              this.nameThreeChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      职位：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsPositionThree}
                            onChange={e => {
                              this.positionThreeChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      办公室电话：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsThreeOfficeNo}
                            onChange={e => {
                              this.officeThreeChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      手机：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '120px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsThreePhone}
                            onChange={e => {
                              this.phoneThreeChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                    </li>
                  </ol>
                </li>
              </ul>
              <br />
              <h3>
                我们将核实所有您所提供的资料，如果与事实不符，本录取通知书自动失效。
              </h3>
              <p>
                若有任何疑问，请与人力资源部&nbsp;
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '100px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.HRName}
                        onChange={e => {
                          this.hrNameChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.HRName}</span>
                      )}
                  </u>
                </strong>
                &nbsp; 联系。Tel: &nbsp;
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        placeholder="公司电话"
                        size="small"
                        style={{
                          width: '180px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.HROfficeNo}
                        onChange={e => {
                          this.hrofficeChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.HROfficeNo}</span>
                      )}
                  </u>
                </strong>
                &nbsp; or &nbsp;
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        placeholder="手机号码"
                        size="small"
                        style={{
                          width: '120px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.HRPhone}
                        onChange={e => {
                          this.hrphoneChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.HRPhone}</span>
                      )}
                  </u>
                </strong>
                。
              </p>
              <br />
              <div style={{ marginTop: '40px' }}>
                <h2>
                  Warmly welcome to be a member of Finisar Wuxi!
                  <br />
                  欢迎加入菲尼萨无锡！
                </h2>
              </div>
            </div>
            <div
              className={
                this.state.data.location == 'SH' ? 'offer-content' : 'hidden'
              }
            >
              <div style={{ textAlign: 'center' }}>
                <div className="logo ">
                  <img src={logo} />
                </div>
                <div className="header">
                  <h3 style={{ margin: '0' }}>
                    Finisar Shanghai, Incorporated
                    <br />
                  </h3>
                  <p style={{ margin: '0' }}>
                    66 Huiqing Rd., Zhangjiang Hi-Tech Park
                    <br />
                    Pudong Shanghai, China 201201
                    <br />
                    Main: +86-21-38559200 Fax: +86-21-68919894
                  </p>
                  <h3>JOB OFFER LETTER</h3>
                </div>
              </div>
              Dear&nbsp;
              <strong>
                <u>
                  {this.state.isShow ? (
                    <Input
                      size="small"
                      class="offer-name"
                      style={{
                        width: '120px',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}
                      value={this.state.data.candidate}
                      onChange={e => {
                        this.candidateChange(e.target.value);
                      }}
                    />
                  ) : (
                      <span>{this.state.data.candidate}</span>
                    )}
                </u>
              </strong>
              <br />
              <p>
                Finisar Shanghai, Inc. is pleased to offer you a job as a
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '200px',
                          textAlign: 'center',
                          // border:"none",
                          fontWeight: 'bold'
                        }}
                        onChange={e => {
                          this.jobChange(e.target.value);
                        }}
                        value={this.state.data.position}
                      />
                    ) : (
                        <span>{this.state.data.position}</span>
                      )}
                  </u>
                </strong>
                .We trust that your knowledge, skills and experience will be
                among our most valuable assets.
              </p>
              <p>
                Should you accept this job offer, per company policy you will be
                eligible to receive the following compensations or arrangement
                beginning on your reporting date.
              </p>
              <ul>
                <li>
                  <strong>Salary</strong>: Monthly gross starting salary of{' '}
                  <strong>
                    <u>
                      RMB
                      {this.state.isShow ? (
                        <Input
                          size="small"
                          style={{
                            width: '80px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}
                          value={this.state.data.salary}
                          onChange={e => {
                            this.salaryChange(e.target.value);
                          }}
                        />
                      ) : (
                          <span>{this.state.data.salary}</span>
                        )}
                    </u>
                  </strong>
                  (before tax, 12months pay), paid by direct deposit.
                </li>
                <li
                  className={this.state.data.isHasStock == 'Y' ? '' : 'hidden'}
                >
                  <strong>Sign-on RSUs:</strong> Finisar and II-VI Incorporated
                  are working together to become one Company. If your start date
                  occurs before the acquisition date, subject to the approval of
                  Finisar’s Board of Directors, you will be issued a value of $
                  {this.state.isShow ? (
                    <Input
                      size="small"
                      style={{
                        width: '80px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '0',
                        outline: 'none!important',
                        borderBottom: '1px solid #000'
                      }}
                      value={this.state.data.stock}
                      onChange={e => {
                        this.stockChange(e.target.value);
                      }}
                    />
                  ) : (
                      <span>{this.state.data.salary}</span>
                    )}{' '}
                  in Finisar’s Restricted Stock Units (RSUs). These RSUs will
                  vest over a four-year period at the rate of 25% per year
                  starting from the date of grant and will be subject to the
                  terms and conditions of Finisar’s Stock Incentive Plan and
                  applicable agreements.
                  <br />
                  <br />
                  If you start after the acquisition date, you will be issued a
                  combination of II-VI Stock Options and RSUs with the same or
                  slightly greater value than the value referenced above. The
                  value will be split equally (50/50) between Stock Options and
                  RSUs. The price associated with these RSUs and Stock Options
                  will be referenced from the closing price on the 27th day of
                  the month following the next II-VI Board of Director’s Meeting
                  and will be awarded on the 28th of that month, upon approval.
                  The Restricted Stock Units vest equally over a three-year
                  period at the rate of one third per year. The Stock Options
                  vest equally over a four-year period at a rate of one quarter
                  per year.  These Awards will be subject to the terms and
                  conditions of II-VI’s Stock Incentive Plan and applicable
                  agreements.
                  <br />
                  <br />
                  If the employment contract between you and the company is
                  terminated, all offered RSUs/Stock Options that have not
                  vested will be cancelled unconditionally and immediately on
                  your last working day.
                  <br />
                  <br />
                </li>
                <li>
                  <strong>Yearly Bonus:</strong> Equal to 1 month of your base
                  salary. Will be paid pro rata according to the service months
                  in the calendar year. If the employment contract between you
                  and company end before the payment date, you will not eligible
                  for this bonus.
                </li>
                <li>
                  <strong>Level:</strong>{' '}
                  <strong>
                    <u>
                      {this.state.isShow ? (
                        <Input
                          size="small"
                          style={{
                            width: '80px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}
                          value={this.state.data.level}
                          onChange={e => {
                            this.levelChange(e.target.value);
                          }}
                        />
                      ) : (
                          <span>{this.state.data.level}</span>
                        )}
                    </u>
                  </strong>
                </li>
                <li>
                  <strong>Manager:</strong> Report to&nbsp;
                  <strong>
                    <u>
                      {this.state.isShow ? (
                        <Input
                          size="small"
                          style={{
                            width: '200px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}
                          value={this.state.data.manager}
                          onChange={e => {
                            this.ManagerChange(e.target.value);
                          }}
                        />
                      ) : (
                          <span>{this.state.data.manager}</span>
                        )}
                    </u>
                  </strong>
                </li>
                <li>
                  <strong>Job Location: </strong>Shanghai, China
                </li>
                <li>
                  <strong>Probation Period: </strong>6 months with 3 years
                  contract.
                </li>
                <li>
                  <strong>Normal working time:</strong> 5 working days per week;
                  8 working hours per day.
                </li>
                <li>
                  <strong>Benefits:</strong>
                </li>
                <ul>
                  <p>
                    Standard, Finisar  Inc. provided benefits for
                    salaried-exempt employees, including the following.
                  </p>
                  <li>
                    Social insurance and housing fund as required by the local
                    municipal government of Shanghai.
                  </li>
                  <li>
                    Other benefits in accordance with company policy and
                    government regulations.
                  </li>
                </ul>
              </ul>
              <p style={{ paddingBottom: '5px' }}>
                Sincerely,
                <br />
                <br />
                Alwin Li
                <br />
                <br />
                HR Director
                <br />
              </p>
              <h3>Accept Job Offer</h3>
              <p>
                By signing and dating this letter below, I accept the job offer
                of &nbsp;
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '200px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.details}
                        onChange={e => {
                          this.detailsChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.details}</span>
                      )}
                  </u>
                </strong>
                &nbsp; at Finisar , Incorporated. I have reviewed and
                agree the following hiring and on-board conditions.
                <br />
                <br />
                <p style={{ margin: '0' }}>
                  Signature:{' '}
                  <strong>
                    <u>
                      {this.state.isShow ? (
                        <Input
                          size="small"
                          style={{
                            width: '180px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}
                          value={this.state.data.signature}
                          onChange={e => {
                            this.signChange(e.target.value);
                          }}
                        />
                      ) : (
                          <span>{this.state.data.signature}</span>
                        )}
                    </u>
                  </strong>
                  Date:
                  <strong>
                    <u>
                      <Input
                        size="small"
                        style={{
                          width: '120px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.date}
                        onChange={e => {
                          this.dateChange(e.target.value);
                        }}
                      />
                    </u>
                  </strong>
                </p>
                <br />
                <p>
                  Please sign this job offer and resend to us within 5 days
                  after you receive it. If not, the offer letter will become
                  invalid.
                </p>
                {this.state.data.isHasStock == 'Y' ? null : (
                  <div style={{ height: '280px', width: '100%' }}>

                  </div>
                )}
                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    borderBottom: '1px solid #971a1e'
                  }}></div>
                <p style={{ textAlign: "center", color: "#971a1e", fontSize: '12px' }}>T. 724.352.4455  |  F. 724.352.5284  |  ii-vi.com</p>
                <div
                  style={{ height: '1px', width: '100%' }}
                  className={this.state.data.isHasStock == 'Y' ? '' : 'hidden'}
                ></div>
              </p>
              <br />
              {/* <div className="logos"></div> */}
              <div className="logoTwo ">
                <img src={logo} />
              </div>
              <br />
              <br />
              <h3>聘用条件</h3>
              <br />
              <p>
                公司实施录用考核制度，不符合录用条件的员工，公司可在试用期内解除其劳动合同，或在约定时间退回派遣机构。
              </p>
              <br />
              <h4 style={{ marginBottom: '20px' }}>
                以下情况均被视为不符合录用条件：
              </h4>
              <ul
                className="condition"
                style={{ paddingLeft: '17px', marginBottom: '20px' }}
              >
                <li>未满16周岁者；</li>
                <li>有聘用禁忌情形者；</li>
                <li>经公司指定医院体检不合格者；</li>
                <li>患有精神疾病或传染病者，不能正常从事该岗位工作的；</li>
                <li>不具备政府规定的就业手续者；</li>
                <li>
                  不能纳入政府社保体系或未在指定期限内完成社保帐户转移的；
                </li>
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
              <br />
              {/* <div className="logot"></div> */}
              <div className="logoThree ">
                <img src={logo} />
              </div>
              <br />
              <br />
              <h3>报道注意事项</h3>
              <br />
              <p>
                请您于
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '55px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.year}
                        onChange={e => {
                          this.yearChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.year}</span>
                      )}
                  </u>
                </strong>
                年
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '55px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.month}
                        onChange={e => {
                          this.monthChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.month}</span>
                      )}
                  </u>
                </strong>
                月
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '55px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.day}
                        onChange={e => {
                          this.dayChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.day}</span>
                      )}
                  </u>
                </strong>
                日{' '}
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '60px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.hour}
                        onChange={e => {
                          this.hourChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.hour}</span>
                      )}
                  </u>
                </strong>
                时携带如下资料至公司人力资源部办理报到手续。如无法按期报到的，请您及时与公司人力资源部取得联系并说明理由，公司将酌情是否另行安排报到时间。如您未能按时报到或未能在公司另行指定的报到时间报到的，本录取通知书失效。
              </p>
              <div style={{ marginBottom: '40px' }}>
                <ul className="notice" style={{ paddingLeft: '0px' }}>
                  <li>1. 退工单或相应离职证明；</li>
                  <li>2. 身份证原件；</li>
                  <li>3. 交通银行借记卡（用于发放工资）；</li>
                  <li>4. 一寸彩色照片2张；</li>
                  <li>5.最高学历（位）证书及专业资格证书</li>
                  <li>
                    6. 体检报告:
                    <br />
                    注：已居住在上海的员工必须到美年健康做标准体检（菲尼萨团体体检为160元/男或者175元/女套餐），体检预约电话：4006808855；如有最近三个月以内三甲医院的体检报告，可直接携带该报告入职，无需另外再做入职体检；如本人不在上海，可在当地三甲医院做常规入职体检，费用在200元左右。
                  </li>
                  <li>7.劳动手册（上海市户口）；</li>
                  <li>
                    8.
                    公积金事宜：如您已缴纳公积金，请通知您所在的公司将公积金转移至881546569205（补充公积金转移至
                    209881546560）,
                    帐号名称：菲尼萨光电通讯（上海）有限公司；或者将公积金帐号封存后提供给菲尼萨人力资源部。
                  </li>
                </ul>
              </div>
              <h3>公司地址：上海浦东张江高科技园区东区汇庆路66号</h3>
              <ul style={{ listStyle: 'none', paddingLeft: '0px' }}>
                <li>
                  1. 背景调查信息：
                  <br />
                  <br />
                  <p style={{ textIndent: '2em' }}>
                    请提供你目前所在公司三个联系人（直接主管，人事主管，同事）的姓名及电话，我们在必要情况下做相关背景调查。
                  </p>
                  <p style={{ marginBottom: '8px' }}>
                    公司名称：
                    <strong>
                      <u>
                        <Input
                          size="small"
                          style={{ width: '240px', textAlign: 'center' }}
                          value={this.state.data.bgCorp}
                          onChange={e => {
                            this.bgCorpChange(e.target.value);
                          }}
                        />
                      </u>
                    </strong>
                  </p>
                  <ol type="a">
                    <li style={{ marginBottom: '15px' }}>
                      姓名：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsOne}
                            onChange={e => {
                              this.contactsOneChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      职位：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsPositionOne}
                            onChange={e => {
                              this.contactsPositionOneChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      办公室电话：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.officeNo}
                            onChange={e => {
                              this.officeOneChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      手机：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '120px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsOnePhone}
                            onChange={e => {
                              this.phoneOneChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      姓名：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsTwo}
                            onChange={e => {
                              this.nameTwoChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      职位：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsPositionTwo}
                            onChange={e => {
                              this.positionTwoChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      办公室电话：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsTwoOfficeNo}
                            onChange={e => {
                              this.officeTwoChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      手机：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '120px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsTwoPhone}
                            onChange={e => {
                              this.phoneTwoChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                      姓名：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsThree}
                            onChange={e => {
                              this.nameThreeChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      职位：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsPositionThree}
                            onChange={e => {
                              this.positionThreeChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      办公室电话：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '100px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsThreeOfficeNo}
                            onChange={e => {
                              this.officeThreeChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                      手机：
                      <strong>
                        <u>
                          <Input
                            size="small"
                            style={{
                              width: '120px',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            value={this.state.data.contactsThreePhone}
                            onChange={e => {
                              this.phoneThreeChange(e.target.value);
                            }}
                          />
                        </u>
                      </strong>
                    </li>
                  </ol>
                </li>
                <li>
                  2. 其他信息：
                  <br />
                  <br />
                  <p style={{ textIndent: '2em' }}>
                    请确定一个您使用的英文名
                    <strong>
                      <u>
                        <Input
                          size="small"
                          style={{
                            width: '100px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}
                          value={this.state.data.englishNameChange}
                          onChange={e => {
                            this.englishNameChange(e.target.value);
                          }}
                        />
                      </u>
                    </strong>
                    ，我们将据此为你建立一个公司邮箱，如没有，我们将用您中文姓名的拼音来建立邮箱。如果您的英文名与现有员工重名或会导致歧义，公司会建议您更换英文名。
                  </p>
                </li>
              </ul>
              <br />
              <h3>
                我们将核实所有您所提供的资料，如果与事实不符，本录取通知书自动失效。
              </h3>
              <p>
                若有任何疑问，请与人力资源部&nbsp;
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '100px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.HRName}
                        onChange={e => {
                          this.hrNameChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.HRName}</span>
                      )}
                  </u>
                </strong>
                &nbsp; 联系。Tel: &nbsp;
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '180px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.HROfficeNo}
                        onChange={e => {
                          this.hrofficeChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.HROfficeNo}</span>
                      )}
                  </u>
                </strong>
                &nbsp; or &nbsp;
                <strong>
                  <u>
                    {this.state.isShow ? (
                      <Input
                        size="small"
                        style={{
                          width: '120px',
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                        value={this.state.data.HRPhone}
                        onChange={e => {
                          this.hrphoneChange(e.target.value);
                        }}
                      />
                    ) : (
                        <span>{this.state.data.HRPhone}</span>
                      )}
                  </u>
                </strong>
                。
              </p>
              <br />
              <div style={{ marginTop: '40px' }}>
                <h2>
                  Warmly welcome to be a member of Finisar Shanghai!
                  <br />
                  欢迎加入菲尼萨上海！
                </h2>
              </div>
            </div>
          </div>
          <div
            style={{ marginLeft: '280px', textAlign: 'right' }}
            className={this.state.data ? 'buttonLine' : 'hidden'}
          >
            <div className="right">
              <Switch
                checked={this.state.data.isHasStock == 'Y' ? true : false}
                onChange={this.hasStockChange}
              />
              <p>在offer里显示股权信息</p>
            </div>
            <Button
              type="primary"
              style={{ marginRight: '5px' }}
              onClick={this.onSendMail}
            >
              保存并发送邮件
            </Button>
            <Button style={{ marginLeft: '5px' }} onClick={this.onSaveData}>
              保存
            </Button>
            {/* <Button
            type="primary"
            style={{ marginLeft: '5px' }}
            onClick={this.onDownload}
          >
            下载
          </Button> */}
            <Button style={{ marginLeft: '5px' }} onClick={this.onPrinting}>
              打印
            </Button>
            <Button style={{ marginLeft: '5px' }} onClick={this.showHis}>
              查看邮件记录
            </Button>
            <span
              style={{ marginLeft: '8px', color: 'red' }}
              className={this.state.data.isSendEmail == 'Y' ? '' : 'hidden'}
            >
              已发送过邮件
            </span>
          </div>
          <ul className="location">
            <li
              className={this.state.data.location == 'SH' ? 'hidden' : 'cur'}
              onClick={() => {
                this.locaSele('WX');
              }}
            >
              WX
            </li>
            <li
              className={this.state.data.location == 'SH' ? 'cur' : 'hidden'}
              onClick={() => {
                this.locaSele('SH');
              }}
            >
              SH
            </li>
          </ul>
          <div className="mailAddress" style={{ marginTop: '-34px' }}>
            收件人邮箱:{this.state.data.emailaddress}
          </div>
          <div className={this.state.overlay ? 'overlay' : 'hidden'}>
            <rect onClick={this.clzHis}></rect>
            <div>
              <TableData
                resid={621422585590}
                hasRowView={false}
                hasAdd={false}
                hasRowSelection={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                hasDelete={false}
                style={{ height: '100%' }}
              />
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default OfferLetter;
