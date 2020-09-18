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
      record: {},
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
      console.log('form', res)
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
      let obj = {}
      if (res.data.length > 0) {
        console.log('jinlaile');
        this.setState({ isSave: true });
        obj = res.data[0];
        this.setState({ data: obj });
      }
      this.getPersonalInfo(613149356409, id, obj);
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
  getPersonalInfo = async (resid, id, obj) => {
    let res;
    try {
      res = await http().getTable({
        resid: resid,
        cmswhere: `ID=${id}`
      });
      console.log('name', res)
      let rec = obj;
      if (res.data) {
        rec.candidate = res.data[0].ChName
        rec.position = res.data[0].appPosition
        rec.ID = res.data[0].ID
      }
      this.setState({ record: rec })
      let data = this.state.data;
      if (res.data[0].Email) {
        this.setState({
          data: {
            ...data,
            emailaddress: res.data[0].Email
          }
        });
      }
      this.getFormData(this.state.record);

    } catch (err) {
      Modal.error({
        title: '提示',
        content: err.message,
        okText: 'OK'

      });
    }
  };
  onPrinting = () => {
    const bodyHtml = window.document.body.innerHTML;

    var footstr = "</body>";
    var newstr = document.getElementById('content').innerHTML;
    var style = '<style>svg{display:none!important}p{font-size:15px;}*{border:none!important;color:#000!important;background:#fff!important;}</style>';
    var headstr = "<html><head><title></title>" + style + "</head><body>";
    document.body.innerHTML = headstr + newstr + footstr;
    window.print();
    window.document.body.innerHTML = bodyHtml;
    window.location.reload();

  };
  onSendMail = async (obj) => {
    // this.formDataRef.handleSave();
    let recid = this.state.data.REC_ID;
    this.setState({ loading: true });
    let data = obj;
    obj.isSendEmail = 'Y'
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
      data.REC_ID = recid;
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
  afterSave = () => {
    message.success('成功')
  }
  render() {
    const { operation, record } = this.state
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
            <FormData
              info={{ dataMode: 'main', resid: resid }}
              operation={this.state.record.REC_ID ? 'modify' : 'add'}
              data={this._dataProp}
              ref={(el) => { this.formDataRef = el }}
              useAbsolute={true}
              record={record}
              recordFormHideFields={['ID']}
              recordFormHideLables={['候选人编号']}
              // // useAbsolute={true}
              // // formProps={{ width: 500 }}
              // onCancel={this.closeBroModal}
              onSuccess={this.afterSave}
              extraButtons={(form) => {
                console.log(form)
                return <Button type='primary' onClick={() => {
                  form.validateFields((error, value) => {
                    this.onSendMail(value);
                  });
                }}>保存并发邮件</Button>
              }}
            // baseURL={this.props.baseURL}
            />

          </div>
          <div
            style={{ marginLeft: '280px', textAlign: 'right' }}
            className={this.state.data ? 'buttonLine' : 'hidden'}
          >
            <Button style={{ marginLeft: '5px' }} onClick={this.onPrinting}>
              打印
            </Button>
            <Button style={{ marginLeft: '5px' }} onClick={this.showHis}>
              查看邮件记录
            </Button>
          </div>

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
