
import React, { Component } from 'react';
import './PhysicalExamination.less';
import http from 'Util20/api';
import {
  Button,
  Icon,
  Modal,
  Spin,
  Upload,
  Select,
  message
} from 'antd';
import debounce from 'lodash/debounce';
import TableData from '../../common/data/TableData';
import FormData from '../../common/data/FormData';
import dealControlArr from 'Util20/controls';
import { getDataProp } from 'Util20/formData2ControlsData';

const { Option } = Select;
const resid = window.pwConfig[process.env.NODE_ENV].pexan;

function crtTimeFtt(val, row) {
  if (val != null) {
    var date = new Date(val);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }
}
class PhysicalExamination extends React.Component {
  state = {
    record: {},
    overlay: false,
    loca: 'WX',
    fetching: false,
    data: [],
    hosName: '',
    imgUrl: '',
    address: '',
    phone1: '',
    phone2: '',
    traffic: '',
    traffic2: '',
    traffic3: '',
    loading: false,

  };
  constructor() {
    super();
    this.handleSearch = debounce(this.handleSearch, 800);

  }

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

  handleChangeS = (value, obj) => {
    console.log(obj)
    this.setState({
      value,
      data: [],
      postName: obj.props.children,
      candidateID: value,

      fetching: false,
    });
    this.getPersonalInfo(613149356409, value);


  }

  seLoca = () => {
    if (this.state.loca == 'SH') {
      this.setState({ loca: 'WX' })
    } else {
      this.setState({ loca: 'SH' })
    }
  }
  // 获取当前人员人员详细信息
  getPersonalInfo = async (resid, id) => {
    let res;
    try {
      res = await http().getTable({
        resid: resid,
        cmswhere: `ID=${id}`
      });
      console.log(res)
      this.setState({ mailAddress: res.data[0].Email });
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
  handleSearch = async (value) => {
    if (value) {

      this.setState({ fetching: true });

      let res;
      let isPsd = '待通过'
      try {
        res = await http().getTable({
          resid: 613152690063,
          key: value,
          cmswhere: `isPass='${isPsd}'`
        });
        const data = res.data.map(data => ({
          text: `${data.ChName}`,
          value: data.ID,

        }));

        this.setState({ data, fetching: false });
      } catch (err) {
        Modal.error({
          title: 'Alert!',
          content: err.message,
          okText: 'OK'
        });
        this.setState({ fetching: false });

      }


      // fetch(value, data => this.setState({ data }));
    } else {
      this.setState({ data: [] });
    }
  };
  sendVerifyMail = async () => {
    var reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
    var email = this.state.mailAddress
    if (!email) {
      Modal.error({
        title: '提示',
        content: '邮箱不能为空',
        okText: 'OK'
      });
    } else if (!reg.test(email)) {
      Modal.error({
        title: '提示',
        content: '邮箱格式不正确',
        okText: 'OK'
      });
    } else {

      let res;
      this.setState({ fetching: true });
      var myDate = new Date();
      myDate = crtTimeFtt(myDate);
      try {
        res = await http().addRecords({
          resid: 623152957838,
          data: [{
            addTime: myDate,
            REC_ID: this.state.REC_ID,
            isSendEmail: 'Y',
            candidateID: this.state.candidateID,
            email: this.state.mailAddress,
            Name: this.state.postName,
            location: this.state.loca, hospital: this.state.hosName,
            picUrl: this.state.imgUrl,
            address: this.state.address,
            tel: this.state.phone1,
            tel2: this.state.phone2,
            traffic: this.state.traffic,
            traffic2: this.state.traffic2,
            traffic3: this.state.traffic3,
            cost: this.state.cost,
            costFemale: this.state.costFemale,
            subscribeTel: this.state.subscribeTel,
            examinationCost: this.state.examinationCost,
            contactName: this.state.contactName,
          }]
        });
        Modal.success({
          title: '已发送邮件',
          content: '',
          okText: 'OK',
          onOk() {
            window.location.reload();
          },
        });

        this.setState({ fetching: false });
      } catch (err) {
        Modal.error({
          title: 'Alert!',
          content: err.message,
          okText: 'OK'
        });
        this.setState({ fetching: false });

      }
    }
  }
  uploadFile = (file, url, mode) => {
    return new Promise((resolve, reject) => {
      let fd = new FormData();
      fd.append('file', file, file.name);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        if (xhr.status === 200 && (data.error === 0 || data.error === '0')) {
          let imgUrl;
          if (mode === 'local') {
            imgUrl = data.httpfilename;
          } else if (mode === 'cloud') {
            imgUrl = data.data;
          }
          resolve(imgUrl);
        } else {
          reject(data);
        }
      };
      xhr.send(fd);
    });
  };
  onPrinting = () => {
    const bodyHtml = window.document.body.innerHTML;

    var footstr = "</body>";
    var newstr = document.getElementById('toPrint').innerHTML;
    var headstr = "<html><head><title></title></head><body>";
    document.body.innerHTML = headstr + newstr + footstr;
    window.print();
    window.document.body.innerHTML = bodyHtml;
    window.location.reload();
  };

  handlechange(key, val, ref) {

    this.setState({
      [key]: val.target.value
    })
    // 解决radio打印不出选中项的问题
    if (ref) {
      if (document.getElementById(ref).checked == true) {
        document.getElementById(ref).defaultChecked = true
      } else {
        document.getElementById(ref).defaultChecked = false
      }
    }

  }


  showOver = () => {

    if (this.state.overlay == true) {
      this.setState({ overlay: false })

    } else {
      this.setState({ overlay: true })

    }
  }

  getData = async (ID) => {
    this.setState({ loading: true });
    let res;
    try {
      res = await http().getTable({
        resid: 623152957838,
      });
      console.log('体检', res);
      this.setState({
        record: res.data[(res.data.length) - 1],
        hosName: res.data[(res.data.length) - 1].hospital,
        imgUrl: res.data[(res.data.length) - 1].picUrl,
        address: res.data[(res.data.length) - 1].address,
        phone1: res.data[(res.data.length) - 1].tel,
        phone2: res.data[(res.data.length) - 1].tel2,
        traffic: res.data[(res.data.length) - 1].traffic,
        traffic2: res.data[(res.data.length) - 1].traffic2,
        traffic3: res.data[(res.data.length) - 1].traffic3,
        cost: res.data[(res.data.length) - 1].cost,
        costFemale: res.data[(res.data.length) - 1].costFemale,
        subscribeTel: res.data[(res.data.length) - 1].subscribeTel,
        examinationCost: res.data[(res.data.length) - 1].examinationCost,
        contactName: res.data[(res.data.length) - 1].contactName,
        REC_ID: res.data[(res.data.length) - 1].REC_ID
      })
      this.getFormData(res.data[(res.data.length) - 1])
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  }
  subData = async (ID) => {

    this.setState({ loading: true });
    let res;
    try {
      res = await http().modifyRecords({
        resid: 623152957838,

        data: [{
          REC_ID: this.state.REC_ID,
          hospital: this.state.hosName,
          picUrl: this.state.imgUrl,
          address: this.state.address,
          tel: this.state.phone1,
          tel2: this.state.phone2,
          traffic: this.state.traffic,
          traffic2: this.state.traffic2,
          traffic3: this.state.traffic3,
          cost: this.state.cost,
          costFemale: this.state.costFemale,
          subscribeTel: this.state.subscribeTel,
          examinationCost: this.state.examinationCost,
          contactName: this.state.contactName,
        }]
      });
      this.setState({ loading: false });
      Modal.success({
        title: '提交成功',
        content: '',
        okText: 'OK'
      });

    } catch (error) {
      Modal.error({
        title: '提示',
        content: error.message,
        okText: 'OK'
      });
      console.log(error);
    }
  }

  componentDidMount() {
    this.getData();


  }
  imgUp(e) {
    this.setState({ imgfile: e });

    let files = e.target.files || e.dataTransfer.files;

    if (!files.length) return;
    let type = files[0].type; //文件的类型，判断是否是图片
    let size = files[0].size; //文件的大小，判断图片的大小
    // if (this.imgCropperData.accept.indexOf(type) == -1) {

    // alert("请选择我们支持的图片格式！");

    // return false;

    // }
    if (size > 5242880) {
      alert("请选择5M以内的图片！");
      return false;
    }
    this.setState({ loading: true })
    this.uploadFile(files[0], `http://kingofdinner.realsun.me:1201/api/AliyunOss/PutOneImageObject?bucketname=nutritiontower&srctype=${type[1]}`, "cloud").then((result) => {
      this.setState({ loading: false, imgUrl: result })

    }, (err) => {
      //图片上传异常！
      this.setState({ loading: false })


    })
  }
  afterSave = () => {
    message.success('成功')
  }
  render() {
    const { record } = this.state
    return (
      <div className='PE'>
        <Spin spinning={this.state.loading}>
          <div className={this.state.overlay ? 'overlay' : 'hidden'} >
            <rect onClick={this.showOver}></rect>
            <div>
              <TableData
                resid={623152957838}
                hasRowView={false}
                hasAdd={false}
                hasRowSelection={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                hasDelete={false}
                style={{ height: "100%" }}
              />
            </div>
          </div>
          <div className='buttonLine' style={{ textAlign: 'right' }}>
            <Button onClick={this.onPrinting}>打印</Button>
            {/* <div className={this.state.loca == 'WX' ? 'file ant-btn' : 'hidden'} style={{ marginTop: '12px', float: 'right', marginRight: '16px', marginLeft: '8px' }}>
              <input id="ss" name="ss" type="file" onChange={v => { this.imgUp(v) }} accept='image' />
			点击替换图片
		  </div> */}

          </div>
          <div class='wrap'>
            <div className='controlPad'>
              <Icon type="clock-circle" onClick={this.showOver} style={{ fontSize: '16px', margin: '0px 0px 16px' }} />
              <Select
                showSearch

                value={this.state.postName}
                placeholder="搜索求职者姓名"
                notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChangeS}
                style={{ width: '100%', maxHeight: '88px', overflow: 'auto' }}

              >
                {this.state.data.map(d => (
                  <Option key={d.value}>{d.text}</Option>
                ))}
              </Select>
              <input className="mailAddress" onChange={v => { this.handlechange("mailAddress", v) }} value={this.state.mailAddress} placeholder="选择求职者自动填写邮箱" />
              {/* <rect className={this.state.loca == "SH" ? '' : 'cur'} onClick={this.seLoca}>无锡</rect>
              <rect className={this.state.loca == "WX" ? '' : 'cur'} onClick={this.seLoca}>上海</rect> */}
              <div className="clearfix" style={{ marginBottom: '16px' }}></div>
              <Button type='primary' onClick={this.sendVerifyMail}>发送邮件</Button>

            </div>
            <div id='toPrint'>

              <FormData
                info={{ dataMode: 'main', resid: resid }}
                operation={'modify'}
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
                  return <></>
                }}
              // baseURL={this.props.baseURL}
              />
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default PhysicalExamination;
