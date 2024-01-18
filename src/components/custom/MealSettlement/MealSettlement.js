import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import {
  Modal,
  Button,
  message,
  Input,
  Row,
  Col,
  Radio,
  Checkbox,
  DatePicker,
  Select,
  Spin, Tabs
} from 'antd';
import http from 'Util20/api';
import './MealSettlement.less';
import moment from 'moment';
import { resolve } from 'url';
import loading from 'react-fullscreen-loading';
const { Option } = Select;
const tableId = {
  memberId: 758726389557,//需要结算的账户表
  attendaceId: 758738248141,//计算每日考勤餐标
  settleId: 756560986054//结算表
};
const initProcess = [
  //各项status值：0——未开始 1——进行中 2——已完成
  {
    id: 0,
    name: '更新员工在职状态',
    count: 0,
    total: 0,
    status: 0,
    hint: '未开始'
  },
  {
    id: 1,
    name: '清空上上月账户余额',
    count: 0,
    total: 0,
    status: 0,
    hint: '未开始'
  },
  {
    id: 2,
    name: '根据考勤日报计算餐标',
    count: 0,
    total: 0,
    status: 0,
    hint: '未开始'
  },
  {
    id: 3,
    name: '补扣上上月未审批通过餐券',
    count: 0,
    total: 0,
    status: 0,
    hint: '未开始'
  },
  {
    id: 4,
    name: '补扣上月多消费的餐标',
    count: 0,
    total: 0,
    status: 0,
    hint: '未开始'
  },
  {
    id: 5,
    name: '各个账户余额转出',
    count: 0,
    total: 0,
    status: 0,
    hint: '未开始'
  },
  {
    id: 6,
    name: '各个账户余额转入',
    count: 0,
    total: 0,
    status: 0,
    hint: '未开始'
  },
  {
    id: 7,
    name: '添加当月补贴账户余额',
    count: 0,
    total: 0,
    status: 0,
    hint: '未开始'
  }
];
/**
 * 我的就餐账户
 */
export default class MealSettlement extends Component {
  constructor(props) {
    super(props);
    this.baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadBaseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  state = {
    loading: false,
    memData: [],//存到localstorage的员工数据，防止结算中途卡住，保证中断以后可以继续执行。
    process: initProcess,
    task: {
      //各项status值：0——未开始 1——进行中 2——已完成 3-暂停
      stTime: '',
      status: 0,
      hint: '',
      id: 0
    },
    memDataOrigin: [],
    memDataAtt: []
  };
  componentDidMount() {
    this.init();
  }
  repoError = (e) => {
    console.log(e.message);
    message.error(e.message);
  };
  getStorage = () => {
    let str = localStorage.getItem('mealData');
    let obj = JSON.parse(str);
    return obj;
  };//获取前端暂存的ls并还原成json
  setStorage = (obj) => {
    let mealData = {
      memData: this.state.mealData,
      task: this.state.task,
      memDataOrigin: this.state.memDataOrigin,
      process: this.state.process,
      memDataAtt: this.state.memDataAtt
    };
    if (obj) {
      mealData = obj;
    }
    mealData = JSON.stringify(mealData);
    localStorage.setItem('mealData', mealData);
  };//将当前结算状态存到ls
  init = async () => {
    let obj = this.getStorage();
    if (obj) {
      let tas = obj.task;
      tas.status = 3;
      tas.hint = '暂停';
      obj.task = tas;
      this.setState({
        memData: obj.memData,
        process: obj.process,
        task: tas,
        memDataOrigin: obj.memDataOrigin,
        memDataAtt: obj.memDataAtt
      });
      this.setStorage(obj);
    }
  };
  handleRun = async () => {
    //获取ls判断是否有前端未执行完的任务
    let obj = this.getStorage();
    if (obj) {
      if (obj.task.status != 0) {
        this.setState({ memData: obj.memData, task: obj.task, memDataOrigin: obj.memDataOrigin, process: obj.process, memDataAtt: obj.memDataAtt });
        //修改任务状态
        let tas = obj.task;
        tas.status = 1;
        tas.hint = '进行中';
        obj.task = tas;
        this.setStorage(obj);
        this.setState({ task: tas });
        let _id = obj.task.id;
        if ((_id === 0) || (obj.task.status === 2)) {
          let arr = obj.memDataOrigin;
          this.modiAccount(arr, obj.process[_id].count);
        } else if (_id === 2) {
          let arr = obj.memDataAtt;
          this.addAttData(arr, obj.process[_id].count);
        } else {
          let arr = obj.memData;
          this.refreSettl(arr, obj.process[_id].count);
        }
      } else {
        await this.getMember();
      }
    }
    else {
      //没有未执行完的任务的场合从头开始执行
      await this.getMember();
    }
  };
  getMember = async () => {
    try {
      this.setState({
        loading: true,
        memData: [],
        process: initProcess,
        task: { stTime: '', status: 0, hint: '初始化中...', id: 0 }, memDataOrigin: [], memDataAtt: []
      });//初始化结算数据
      let res = await http({ baseURL: this.baseURL }).getTable({
        resid: tableId.memberId
      });
      let arr = [];
      for (let i = 0; i < res.data.length; i++) {
        arr.push({ numberId: res.data[i].numberId, name: res.data[i].name, recid: res.data[i].recid });//精简数据，缩小保存到ls的数据大小
      }
      let ts = { stTime: moment().format('YYYY-MM-DD hh:.mm:ss'), status: 1, hint: '进行中', id: 0 }
      let process = initProcess;
      process[0].hint = '进行中';
      process[0].total = arr.length;
      process[0].status = 1;
      let mealData = {
        memData: [],
        memDataOrigin: arr,
        process,
        task: ts,
        memDataAtt: []
      };
      this.setStorage(mealData);
      console.log('mealData', mealData)
      //修改“更新员工在职状态流程”的状态
      this.setState({ process, memDataOrigin: arr, loading: false, task: ts });
      await this.modiAccount(arr, 0);
    } catch (e) {
      this.repoError(e);
    }
  };
  modiAccount = async (org, count) => {
    let recid = '';
    let mealD = this.getStorage();
    if (mealD.task.status === 3) {
      return false;
    }
    if (count < org.length) {
      recid = org[count].recid;
    } else {
      mealD.process[0].status = 2;
      mealD.process[0].hint = '已完成';
      mealD.process[1].status = 1;
      mealD.process[1].hint = '进行中';
      //生成要导入考勤补贴表的数据
      let memDataAtt = [];
      const now = moment();
      let stDate = now.subtract(1, 'months').startOf('month');
      const daysInLastMonth = now.subtract(1, 'months').daysInMonth();
      let stD = stDate;
      //只有外包人员才需要计算日报
      for (let i = 0; i < mealD.memData.length; i++) {
        if (mealD.memData[i].isWB != 'Y') {
          stD = stDate;
          for (let c = 0; c < daysInLastMonth; c++) {
            memDataAtt.push({
              numberId: mealD.memData[i].numberId,
              name: mealD.memData[i].name,
              dateStr: moment(stD).format('YYYYMMDD')
            });
            stD = moment(stD).add(1, 'days')
          }
        }
      }
      mealD.memDataAtt = memDataAtt;
      mealD.process[1].total = mealD.memData.length;
      mealD.task.id = 1;
      this.setStorage(mealD);
      this.setState({ process: mealD.process, memDataAtt });
      await this.refreSettl(mealD.memData, 0);
    };
    try {
      let res = await http({ baseURL: this.baseURL }).modifyRecords({
        resid: tableId.memberId,
        data: [{ REC_ID: recid }]
      });
      let arr = this.state.memData;

      if (res.data[0].onJob) {
        arr.push({ numberId: res.data[0].numberId, name: res.data[0].name, isWB: res.data[0].isWB });
      };
      let process = this.state.process;
      process[0].count = process[0].count + 1;
      let mealData = this.getStorage();
      mealData.memData = arr;
      mealData.process = process;
      this.setState({ memData: arr, process });
      this.setStorage(mealData);
      let c = count + 1;
      await this.modiAccount(org, c);
    } catch (e) {
      this.repoError(e);
      return false;
    }
  }

  addAttData = async (arr, count) => {
    let record = {}
    let mealD = await this.getStorage();
    console.log('tstus', mealD.task.status)
    if (mealD.task.status === 3) {
      return false;
    }
    if (count < arr.length) {
      record = arr[count];
    } else {
      mealD.process[2].status = 2;
      mealD.process[2].hint = '已完成';
      mealD.process[2].status = 1;
      mealD.process[3].total = mealD.memData.length;
      mealD.process[3].hint = '进行中';
      mealD.task.id = 2;
      this.setStorage(mealD);
      this.setState({ process: mealD.process });
      await this.refreSettl(mealD.memData, 0);
    }
    try {
      let res = await http({ baseURL: this.baseURL }).addRecords({
        resid: tableId.attendaceId,
        data: [record],
        isEditOrAdd: true
      });
      let process = mealD.process;
      process[2].count = process[2].count + 1;
      let mealData = this.getStorage();
      mealData.process = process;
      let c = count + 1;
      this.setStorage(mealData);
      this.setState({ process: mealData.process });
      await this.addAttData(arr, c);
    } catch (e) {
      this.repoError(e);
      return false;
    }
  }
  refreSettl = async (arr, count) => {
    //后台已经配置了数据同步，只需要保存数据就可以执行结算。
    let record = {}
    let mealD = await this.getStorage();
    const _id = mealD.task.id;
    const new_id = mealD.task.id + 1;
    console.log('tstus', mealD.task.status)
    if (mealD.task.status === 3) {
      return false;
    }
    if (count < arr.length) {
      record = arr[count];
      const month = moment().subtract(1, 'months').format('YYYYMM');
      record = {
        month,
        numberId: arr[count].numberId
      };
      if (mealD.task.id === 1) {
        record.killed = 'Y';
      } else if (mealD.task.id === 3) {
        record.dealed = 'Y';
      }
    } else {
      if (mealD.process[_id] === 7) {
        mealD.process[_id].status = 2;
        mealD.process[_id].hint = '已完成';
        mealD.process[_id].status = 1;
        mealD.task.status = 2;
        mealD.task.hint = '已完成';
        this.setStorage(mealD);
        this.setState({ process: mealD.process, task: mealD.task });
        message.success('结算完成');
        return true;
      } else {
        mealD.process[_id].status = 2;
        mealD.process[_id].hint = '已完成';
        mealD.process[new_id].status = 1;
        mealD.process[new_id].total = mealD.memData.length;
        mealD.process[new_id].hint = '进行中';
        mealD.task.id = new_id;
        if (_id === 1) {
          mealD.process[2].total = mealD.memDataAtt.length;
          this.setStorage(mealD);
          this.setState({ process: mealD.process });
          await this.addAttData(mealD.memDataAtt, 0);
        } else {
          this.setStorage(mealD);
          this.setState({ process: mealD.process });
          await this.refreSettl(arr, 0);
        }
      }
    }
    try {
      let res = await http({ baseURL: this.baseURL }).addRecords({
        resid: tableId.settleId,
        data: [record],
        isEditOrAdd: true
      });
      let process = mealD.process;
      process[_id].count = process[_id].count + 1;
      let mealData = this.getStorage();
      mealData.process = process;
      let c = count + 1;
      this.setStorage(mealData);
      this.setState({ process: mealData.process });
      await this.refreSettl(arr, c);
    } catch (e) {
      this.repoError(e);
      return false;
    }
  }
  handlePause = () => {
    let obj = this.getStorage();
    let tas = obj.task;
    tas.status = 3;
    tas.hint = '暂停';
    obj.task = tas;
    this.setStorage(obj);
    this.setState({ task: tas });
  }
  render() {
    const { process, task, memData, loading, memDataAtt, memDataOrigin } = this.state
    return (
      <div className='mealSettlement'>
        <div className='mealSettlement_controlPad'>
          <div>
            <Button type={'primary'} loading={loading} onClick={() => {
              this.handleRun();
            }} disabled={task.status === 1}>开始</Button>
            <Button disabled={task.status === 3} onClick={() => { this.handlePause() }}>暂停</Button>
          </div>
          <div>
            当前任务开始时间：{task.stTime}
          </div>
          <div>
            当前任务状态：<span style={task.status === 1 ? { color: '#1890ff' } : {}}>{task.hint}</span>
          </div>
        </div>

        <ul>
          {
            process.map((item, key) => {
              return (
                <li className={'mealSettlement_status' + item.status} key={key}>
                  <h3>{(item.id) + 1} {item.name} - <span className='mealSettlement_title'>{item.hint}</span>
                  </h3>
                  <div>
                    <div className='mealSettlement_processBar'>
                      <div style={item.total != 0 ? { width: item.count / item.total * 100 + '%' } : { width: 0 }}></div>
                    </div>
                    <span>{item.count + '/' + item.total}</span>
                    <span style={((item.status != 1) || (task.id === 2) || (task.id === 0)) ? { display: 'none' } : {}}>
                      当前人员：
                      {memData[item.count] ? (memData[item.count].numberId + ' - ' + memData[item.count].name) : ''}
                    </span>
                    <span style={((item.status != 1) || (task.id != 0)) ? { display: 'none' } : {}}>
                      当前人员：
                      {memDataOrigin[item.count] ? (memDataOrigin[item.count].numberId + ' - ' + memDataOrigin[item.count].name) : ''}
                    </span>
                    <span style={((item.status != 1) || (task.id != 2)) ? { display: 'none' } : {}}>
                      当前人员：
                      {memDataAtt[item.count] ? (memDataAtt[item.count].numberId + ' - ' + memDataAtt[item.count].name + ' - ' + memDataAtt[item.count].dateStr) : ''}
                    </span>
                  </div>
                </li>
              )
            })
          }
        </ul>

      </div>

    );
  }
}
