import React from 'react';
// import { propTypes, defaultProps } from './propTypes';
import TableData from 'Common/data/TableData';
import BPChart from '../BPChart/BPChart';
import GLUChart from '../GLUChart/GLUChart';
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
class RecordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beginDate: '',
      endDate: '',
      now: '',
      days: '',
      basic: '',
      change: '',
      remark: '',
      bloodPressureDate: [],
      selectKey: '1',
      res: {},
      infoModal: false,
      xAxis: {}, // x轴渲染的数据
      legend: {}, // 图表上方的选择器
      series: [],
    };
  }

  componentWillMount = () => {
    console.log('props', this.props);
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
    // this.getTableData();
  };

  //开始日期
  beginDateChange = (value) => {
    let start = moment(value).format('YYYY-MM-DD');
    let end = moment(this.state.endDate);
    // this.setState({ beginDate: moment(start) });
    let days = end.diff(moment(start), 'day');
    this.setState({
      days: days,
      beginDate: moment(start),
    });
  };
  //结束日期
  endDateChange = (value) => {
    // this.setState({ endDate: moment(value).format('YYYY-MM-DD') });
    let end = moment(value).format('YYYY-MM-DD');
    let days = moment(end).diff(this.state.beginDate, 'day');
    this.setState({
      days: days,
      endDate: moment(end),
    });
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
    const { now, beginDate,endDate } = this.state;
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
                  />
                </Form.Item>
                <Form.Item
                  label="结束日期"
                  className="recordInput__userInfo__endDate"
                >
                  <DatePicker onChange={this.endDateChange} value={endDate} />
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
              <div className="recordInput__dataContainer">
                <TableData
                  resid={639829713698}
                  hasModify={false}
                  height={500}
                  hasDelete={false}
                  hasRowDelete={false}
                  defaultColumnWidth={150}
                  actionBarWidth={200}
                  subtractH={150}
                />
              </div>
              {/* <div className="recordInput__basicMd">
                <Form.Item label="基本用药">
                  <TextArea
                    rows={3}
                    className="recordInput__basicMd__basic"
                    value={this.s}
                  />
                </Form.Item>
                <Form.Item label="用药变化">
                  <TextArea rows={3} className="recordInput__basicMd__change" />
                </Form.Item>
                <Form.Item label="备注">
                  <TextArea rows={3} className="recordInput__basicMd__remark" />
                </Form.Item>
              </div> */}
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
                  />
                </Form.Item>
                <Form.Item
                  label="结束日期"
                  className="recordInput__userInfo__endDate"
                >
                  <DatePicker onChange={this.endDateChange} value={endDate} />
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
              <div className="recordInput__dataContainer">
                <TableData
                  resid={640190825057}
                  hasModify={false}
                  height={500}
                  hasDelete={false}
                  hasRowDelete={false}
                  defaultColumnWidth={150}
                  actionBarWidth={200}
                  subtractH={150}
                />
              </div>
              {/* <div className="recordInput__basicMd">
                <Form.Item label="基本用药">
                  <TextArea
                    rows={3}
                    className="recordInput__basicMd__basic"
                    value={this.s}
                  />
                </Form.Item>
                <Form.Item label="用药变化">
                  <TextArea rows={3} className="recordInput__basicMd__change" />
                </Form.Item>
                <Form.Item label="备注">
                  <TextArea rows={3} className="recordInput__basicMd__remark" />
                </Form.Item>
              </div> */}
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
                  />
                </Form.Item>
                <Form.Item
                  label="结束日期"
                  className="recordInput__userInfo__endDate"
                >
                  <DatePicker onChange={this.endDateChange} value={now} />
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
                {/* <ShowDataChart
                beginDate = {this.state.beginDate}
                endDate = {this.state.endDate}
                selectKey = {this.state.selectKey}
                /> */}
              </div>
              <div className="recordInput__dataContainer">
                <TableData
                  resid={resid3}
                  hasModify={false}
                  height={500}
                  hasDelete={false}
                  hasRowDelete={false}
                  defaultColumnWidth={150}
                  actionBarWidth={200}
                  subtractH={150}
                />
              </div>
              {/* <div className="recordInput__basicMd">
                <Form.Item label="基本用药">
                  <TextArea
                    rows={3}
                    className="recordInput__basicMd__basic"
                    value={this.s}
                  />
                </Form.Item>
                <Form.Item label="用药变化">
                  <TextArea rows={3} className="recordInput__basicMd__change" />
                </Form.Item>
                <Form.Item label="备注">
                  <TextArea rows={3} className="recordInput__basicMd__remark" />
                </Form.Item>
              </div> */}
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
                <p>会员编号：{this.props.userNo}</p>
                <p>会员姓名：{this.props.userName}</p>
              </Panel>
              <Panel header="用户健康状况" key="2">
                <p>家族病史：{this.props.familyMedicalHistory}</p>
                <p>主要疾病：{this.props.principalDisease}</p>
                <p>药物过敏：{this.props.drugAllergy}</p>
                <p>高血压：{this.props.highBloodPressure}</p>
                <p>糖尿病：{this.props.diabetesMellitus}</p>
                <p>慢性病：{this.props.chronicDisease}</p>
                <p>精神病史：{this.props.psychiatricHistory}</p>
                <p>免疫情况：{this.props.immunized}</p>
                <p>所需服务：{this.props.needService}</p>
              </Panel>
              <Panel header="个人行为情况" key="3">
                <p>性格：{this.props.character}</p>
                <p>吸烟史：{this.props.smokeHistory}</p>
                <p>饮酒史：{this.props.drinkHistory}</p>
                <p>睡眠状况：{this.props.SleepQuality}</p>
                <p>锻炼项目：{this.props.exerciseEvent}</p>
                <p>饮食习惯：{this.props.dietaryHabit}</p>
                <p>兴趣爱好：{this.props.hobbies}</p>
                <p>是否残疾：{this.props.isDisability}</p>
                <p>身体不适处理方式：{this.props.processMode}</p>
              </Panel>
              <Panel header="自述状况" key="4">
                <p>自述状况：{this.props.processMode}</p>
              </Panel>
            </Collapse>
          </div>
        </Modal>
      </div>
    );
  }
}

export default RecordInput;
