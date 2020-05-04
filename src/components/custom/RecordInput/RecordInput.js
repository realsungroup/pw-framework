import React from 'react';
// import { propTypes, defaultProps } from './propTypes';
import TableData from 'Common/data/TableData';
import BPChart from '../BPChart/BPChart';
import GLUChart from '../GLUChart/GLUChart';
import TemperatureChart from '../TemperatureChart/TemperatureChart';
import './RecordInput.less';
import {
  Button,
  message,
  Modal,
  Form,
  Row,
  Col,
  Input,
  TimePicker,
  DatePicker,
  Tabs,
  Collapse,
} from 'antd';
import { LzModal, LzMenuForms } from '../loadableCustom';
import http from 'Util20/api';
import { getTableData, getMainTableData } from '../../../util/api';
import moment from 'moment';
import EChartsOfReact from 'echarts-of-react';
import echarts from 'echarts/lib/echarts';

/**
 * 常见数据录入
 */
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const resid1 = 640186569410; // 血压检测表
const resid2 = 640190825057; // 血糖检测表
const resid3 = 640190883264; // 体温检测表
const userResid = 639670761186; // 会员信息

class RecordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beginDate: '',
      endDate: '',
      now: '',
      days: '',
      basic: '', //上一次基本用药
      change: '', //上一次用药变化
      remark: '', //上一次备注
      nowBasic: '', //当前基本用药
      nowChange: '', //当前用药变化
      nowRemark: '', //当前备注
      bloodPressureDate: [],
      selectKey: '1',
      res: {},
      infoModal: false,
      xAxis: {}, // x轴渲染的数据
      legend: {}, // 图表上方的选择器
      series: [],
      lastRecordId: '',
      userinfo: {},
    };
  }

  componentWillMount = () => {
    let nowDate = moment().format('YYYY-MM-DD');
    let start = moment(nowDate).add(-30, 'days');
    this.setState({
      now: moment(nowDate),
      endDate: moment(nowDate),
      beginDate: moment(nowDate).add(-30, 'days'),
    });
    this.setState({
      days: moment(nowDate).diff(start, 'day'),
    });
    this.getTableData();
    this.getUserInfo();
  };

  getUserInfo = async () => {
    let res;
    const resid = userResid;
    try {
      res = await http().getTable({
        resid,
        cmswhere: `userNo = '${this.props.userNo}'`,
      });
    } catch (error) {
      message.error(error.message);
    }
    console.log('resdata', res);
    this.setState({
      userinfo: res.data[0],
    });
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  getTableData = async () => {
    const { selectKey, basic, change, remark } = this.state;
    let res;
    if (selectKey == '1') {
      try {
        res = await getMainTableData(resid1, {
          getcolumninfo: 1,
        });
      } catch (err) {
        return message.error(err.message);
      }
    } else if (selectKey == '2') {
      try {
        res = await getMainTableData(resid2, {
          getcolumninfo: 1,
        });
      } catch (err) {
        return message.error(err.message);
      }
    } else if (selectKey == '3') {
      try {
        res = await getMainTableData(resid3, {
          getcolumninfo: 1,
        });
      } catch (err) {
        return message.error(err.message);
      }
    }
    let dataLen = res.data.length - 1;
    let arr = [];
    res.data.map((items) => {
      for (let i in items) {
        if (i == 'basicPharmacy' && items[i] !== null) {
          arr.push(items);
        }
      }
    });
    this.setState({
      basic: arr[arr.length - 1].basicPharmacy,
      change: arr[arr.length - 1].pharmacyChange,
      remark: arr[arr.length - 1].remark,
      lastRecordId: res.data[dataLen].REC_ID,
    });
    // console.log('res',this.state.lastRecordId)
  };

  //开始日期
  beginDateChange = (value) => {
    let start = moment(value).format('YYYY-MM-DD');
    let end = moment(this.state.endDate);
    let days = end.diff(moment(start), 'day');
    this.setState({
      days: days,
      beginDate: moment(start),
    });
  };
  //结束日期
  endDateChange = (value) => {
    let end = moment(value).format('YYYY-MM-DD');
    let days = moment(end).diff(this.state.beginDate, 'day');
    this.setState({
      days: days,
      endDate: moment(end),
    });
  };

  basicChange = ({ target: { value } }) => {
    console.log('value', value);
    this.setState({
      nowBasic: value,
    });
  };
  pharmacyChange = ({ target: { value } }) => {
    console.log('value', value);
    this.setState({
      nowChange: value,
    });
  };
  remarkChange = ({ target: { value } }) => {
    console.log('value', value);
    this.setState({
      nowRemark: value,
    });
  };
  //保存用药信息
  savePharmacyData = async () => {
    const {
      nowBasic,
      nowChange,
      nowRemark,
      lastRecordId,
      selectKey,
    } = this.state;
    let data = {
      basicPharmacy: nowBasic,
      pharmacyChange: nowChange,
      remark: nowRemark,
      REC_ID: lastRecordId,
    };
    let res;
    if (selectKey == 1) {
      try {
        res = await http().modifyRecords({
          resid: resid1,
          data: [data],
        });
        message.success('保存成功');
      } catch (error) {
        message.error(error.message);
      }
    } else if (selectKey == 2) {
      try {
        res = await http().modifyRecords({
          resid: resid2,
          data: [data],
        });
        message.success('保存成功');
      } catch (error) {
        message.error(error.message);
      }
    } else if (selectKey == 3) {
      let resid = resid3;
      try {
        res = await http().modifyRecords({
          resid,
          data: JSON.stringify([data]),
        });
        message.success('保存成功');
      } catch (error) {
        message.error(error.message);
      }
    }
  };
  activeKeyChange = (key) => {
    this.setState({
      selectKey: key,
    });
  };

  userInformation = () => {
    this.setState({
      infoModal: true,
    });
  };
  closeModal = () => {
    this.setState({
      infoModal: false,
    });
  };

  render() {
    const { now, beginDate, endDate, userinfo } = this.state;
    return (
      <div className="DataPut">
        <h2 style={{ marginLeft: '9px' }}>常见信息录入</h2>
        <Tabs defaultActiveKey="1" onChange={this.activeKeyChange}>
          <TabPane tab="血压" key="1">
            <Form className="recordInput">
              <div className="recordInput__userInfo">
                <Form.Item
                  label="用户编号"
                  className="recordInput__userInfo__userNo"
                >
                  <Input defaultValue={this.props.userNo} disabled />
                </Form.Item>
                <Form.Item
                  label="用户姓名"
                  className="recordInput__userInfo__userName"
                >
                  <Input defaultValue={this.props.userName} disabled />
                </Form.Item>
                <Form.Item
                  label="开始日期"
                  className="recordInput__userInfo__beginDate"
                >
                  <DatePicker
                    onChange={this.beginDateChange}
                    value={beginDate}
                    allowClear={false}
                  />
                </Form.Item>
                <Form.Item
                  label="结束日期"
                  className="recordInput__userInfo__endDate"
                >
                  <DatePicker
                    onChange={this.endDateChange}
                    allowClear={false}
                    disabledDate={this.disabledDate}
                    value={endDate}
                  />
                </Form.Item>
                <Form.Item label="共计" className="recordInput__userInfo__days">
                  <Input
                    value={`${this.state.days}天`}
                    // disabled
                    style={{ width: '35%' }}
                  />
                </Form.Item>
                <Form.Item className="recordInput__userInfo__days">
                  <Button onClick={this.userInformation}>会员信息</Button>
                </Form.Item>
              </div>
              <div id="recordInput__showChart1">
                <BPChart
                  beginDate={this.state.beginDate}
                  endDate={this.state.endDate}
                  selectKey={this.state.selectKey}
                />
              </div>
              <div className="recordInput__basicMd">
                <h3 style={{ color: '#000' }}>上一次用药情况:</h3>
                <div className="recordInput__basicMd__last">
                  <Form.Item label="基本用药">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__last__basic"
                      value={this.state.basic}
                    />
                  </Form.Item>
                  <Form.Item label="用药变化">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__last__change"
                      value={this.state.change}
                    />
                  </Form.Item>
                  <Form.Item label="备注">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__last__remark"
                      value={this.state.remark}
                    />
                  </Form.Item>
                </div>
                <h3 style={{ color: '#000' }}>当前用药情况:</h3>
                <div className="recordInput__basicMd__now">
                  <Form.Item label="基本用药">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__now__basic"
                      onChange={this.basicChange}
                    />
                  </Form.Item>
                  <Form.Item label="用药变化">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__now__change"
                      onChange={this.pharmacyChange}
                    />
                  </Form.Item>
                  <Form.Item label="备注">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__now__remark"
                      onChange={this.remarkChange}
                    />
                  </Form.Item>
                </div>
                <Button
                  type="primary"
                  onClick={this.savePharmacyData}
                  color="#7ca8fc"
                  style={{ marginLeft: '45%', marginBottom: '20px' }}
                >
                  保存当前用药信息
                </Button>
              </div>
              <div className="recordInput__dataContainer">
                <TableData
                  resid={639829713698}
                  hasModify={false}
                  height={500}
                  hasDelete={false}
                  hasRowDelete={false}
                  hasRowModify={false}
                  defaultColumnWidth={150}
                  actionBarWidth={200}
                  subtractH={150}
                />
              </div>
            </Form>
          </TabPane>
          <TabPane tab="血糖" key="2">
            <Form className="recordInput">
              <div className="recordInput__userInfo">
                <Form.Item
                  label="用户编号"
                  className="recordInput__userInfo__userNo"
                >
                  <Input defaultValue={this.props.userNo} disabled />
                </Form.Item>
                <Form.Item
                  label="用户姓名"
                  className="recordInput__userInfo__userName"
                >
                  <Input defaultValue={this.props.userName} disabled />
                </Form.Item>
                <Form.Item
                  label="开始日期"
                  className="recordInput__userInfo__beginDate"
                >
                  <DatePicker
                    onChange={this.beginDateChange}
                    value={beginDate}
                    allowClear={false}
                  />
                </Form.Item>
                <Form.Item
                  label="结束日期"
                  className="recordInput__userInfo__endDate"
                >
                  <DatePicker
                    onChange={this.endDateChange}
                    value={endDate}
                    allowClear={false}
                    disabledDate={this.disabledDate}
                  />
                </Form.Item>
                <Form.Item label="共计" className="recordInput__userInfo__days">
                  <Input
                    value={`${this.state.days}天`}
                    // disabled
                    style={{ width: '35%' }}
                  />
                </Form.Item>
                <Form.Item className="recordInput__userInfo__days">
                  <Button onClick={this.userInformation}>会员信息</Button>
                </Form.Item>
              </div>
              <div id="recordInput__showChart2">
                <GLUChart
                  beginDate={this.state.beginDate}
                  endDate={this.state.endDate}
                  selectKey={this.state.selectKey}
                />
              </div>
              <div className="recordInput__basicMd">
                <h3 style={{ color: '#000' }}>上一次用药情况:</h3>
                <div className="recordInput__basicMd__last">
                  <Form.Item label="基本用药">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__last__basic"
                      value={this.state.basic}
                    />
                  </Form.Item>
                  <Form.Item label="用药变化">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__last__change"
                      value={this.state.change}
                    />
                  </Form.Item>
                  <Form.Item label="备注">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__last__remark"
                      value={this.state.remark}
                    />
                  </Form.Item>
                </div>
                <h3 style={{ color: '#000' }}>当前用药情况:</h3>
                <div className="recordInput__basicMd__now">
                  <Form.Item label="基本用药">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__now__basic"
                      onChange={this.basicChange}
                    />
                  </Form.Item>
                  <Form.Item label="用药变化">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__now__change"
                      onChange={this.pharmacyChange}
                    />
                  </Form.Item>
                  <Form.Item label="备注">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__now__remark"
                      onChange={this.remarkChange}
                    />
                  </Form.Item>
                </div>
                <Button
                  type="primary"
                  onClick={this.savePharmacyData}
                  color="#7ca8fc"
                  style={{ marginLeft: '45%', marginBottom: '20px' }}
                >
                  保存当前用药信息
                </Button>
              </div>
              <div className="recordInput__dataContainer">
                <TableData
                  resid={640190825057}
                  hasModify={false}
                  height={500}
                  hasDelete={false}
                  hasRowDelete={false}
                  hasRowModify={false}
                  defaultColumnWidth={150}
                  actionBarWidth={200}
                  subtractH={150}
                />
              </div>
            </Form>
          </TabPane>
          <TabPane tab="体温" key="3">
            <Form className="recordInput">
              <div className="recordInput__userInfo">
                <Form.Item
                  label="用户编号"
                  className="recordInput__userInfo__userNo"
                >
                  <Input defaultValue={this.props.userNo} disabled />
                </Form.Item>
                <Form.Item
                  label="用户姓名"
                  className="recordInput__userInfo__userName"
                >
                  <Input defaultValue={this.props.userName} disabled />
                </Form.Item>
                <Form.Item
                  label="开始日期"
                  className="recordInput__userInfo__beginDate"
                >
                  <DatePicker
                    onChange={this.beginDateChange}
                    value={beginDate}
                    allowClear={false}
                  />
                </Form.Item>
                <Form.Item
                  label="结束日期"
                  className="recordInput__userInfo__endDate"
                >
                  <DatePicker
                    onChange={this.endDateChange}
                    value={now}
                    allowClear={false}
                    disabledDate={this.disabledDate}
                  />
                </Form.Item>
                <Form.Item label="共计" className="recordInput__userInfo__days">
                  <Input
                    value={`${this.state.days}天`}
                    // disabled
                    style={{ width: '35%' }}
                  />
                </Form.Item>
                <Form.Item className="recordInput__userInfo__days">
                  <Button onClick={this.userInformation}>会员信息</Button>
                </Form.Item>
              </div>
              <div id="recordInput__showChart3">
                <TemperatureChart
                  beginDate={this.state.beginDate}
                  endDate={this.state.endDate}
                  selectKey={this.state.selectKey}
                />
              </div>
              <div className="recordInput__basicMd">
                <h3 style={{ color: '#000' }}>上一次用药情况:</h3>
                <div className="recordInput__basicMd__last">
                  <Form.Item label="基本用药">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__last__basic"
                      value={this.state.basic}
                    />
                  </Form.Item>
                  <Form.Item label="用药变化">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__last__change"
                      value={this.state.change}
                    />
                  </Form.Item>
                  <Form.Item label="备注">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__last__remark"
                      value={this.state.remark}
                    />
                  </Form.Item>
                </div>
                <h3 style={{ color: '#000' }}>当前用药情况:</h3>
                <div className="recordInput__basicMd__now">
                  <Form.Item label="基本用药">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__now__basic"
                      onChange={this.basicChange}
                    />
                  </Form.Item>
                  <Form.Item label="用药变化">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__now__change"
                      onChange={this.pharmacyChange}
                    />
                  </Form.Item>
                  <Form.Item label="备注">
                    <TextArea
                      rows={3}
                      className="recordInput__basicMd__now__remark"
                      onChange={this.remarkChange}
                    />
                  </Form.Item>
                </div>
                <Button
                  type="primary"
                  onClick={this.savePharmacyData}
                  color="#7ca8fc"
                  style={{ marginLeft: '45%', marginBottom: '20px' }}
                >
                  保存当前用药信息
                </Button>
              </div>
              <div className="recordInput__dataContainer">
                <TableData
                  resid={resid3}
                  hasModify={false}
                  height={500}
                  hasDelete={false}
                  hasRowModify={false}
                  hasRowDelete={false}
                  defaultColumnWidth={150}
                  actionBarWidth={200}
                  subtractH={150}
                />
              </div>
            </Form>
          </TabPane>
        </Tabs>
        <Modal
          visible={this.state.infoModal}
          onCancel={this.closeModal}
          onOk={this.closeModal}
        >
          <div className="UserInfo">
            <Collapse defaultActiveKey={['1']}>
              <Panel header="用户基本信息" key="1">
                <p>会员编号：{userinfo.userNo}</p>
                <p>会员姓名：{userinfo.userName}</p>
              </Panel>
              <Panel header="用户健康状况" key="2">
                <p>家族病史：{userinfo.familyMedicalHistory}</p>
                <p>主要疾病：{userinfo.principalDisease}</p>
                <p>药物过敏：{userinfo.drugAllergy}</p>
                <p>高血压：{userinfo.highBloodPressure}</p>
                <p>糖尿病：{userinfo.diabetesMellitus}</p>
                <p>慢性病：{userinfo.chronicDisease}</p>
                <p>精神病史：{userinfo.psychiatricHistory}</p>
                <p>免疫情况：{userinfo.immunized}</p>
                <p>所需服务：{userinfo.needService}</p>
              </Panel>
              <Panel header="个人行为情况" key="3">
                <p>性格：{userinfo.character}</p>
                <p>吸烟史：{userinfo.smokeHistory}</p>
                <p>饮酒史：{userinfo.drinkHistory}</p>
                <p>睡眠状况：{userinfo.SleepQuality}</p>
                <p>锻炼项目：{userinfo.exerciseEvent}</p>
                <p>饮食习惯：{userinfo.dietaryHabit}</p>
                <p>兴趣爱好：{userinfo.hobbies}</p>
                <p>是否残疾：{userinfo.isDisability}</p>
                <p>身体不适处理方式：{userinfo.processMode}</p>
              </Panel>
              <Panel header="自述状况" key="4">
                <p>自述状况：{userinfo.processMode}</p>
              </Panel>
            </Collapse>
          </div>
        </Modal>
      </div>
    );
  }
}

export default RecordInput;
