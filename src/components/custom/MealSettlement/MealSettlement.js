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
  attendaceId: 756901988242,//月结餐标触发存储过程
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
    name: '清空上上月账户余额(改为每月底线下导入，跳过)',
    count: 0,
    total: 0,
    status: 0,
    hint: '未开始'
  },
  {
    id: 2,
    name: '计算考勤月餐标(改为考勤结算后线下导入，等导入完毕以后再继续执行后续步骤)',
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
  // {
  //   id: 5,
  //   name: '各个账户余额转出',
  //   count: 0,
  //   total: 0,
  //   status: 0,
  //   hint: '未开始'
  // },
  // {
  //   id: 6,
  //   name: '各个账户余额转入',
  //   count: 0,
  //   total: 0,
  //   status: 0,
  //   hint: '未开始'
  // },
  {
    id: 5,
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
      stTime: 'N/A',
      status: 0,
      hint: '未开始',
      id: 0
    },
    memDataOrigin: [],
    memDataAtt: [],
    settled: false//当月是否已经结算
  };
  componentDidMount() {
    this.init();
  }


  modiRec = async (resid, data) => {
    await http({ baseURL: this.baseURL }).modifyRecords({
      resid: resid,
      data: [data]
    });
  }

  addRec = async (resid, data) => {
    await http({ baseURL: this.baseURL }).addRecords({
      resid: resid,
      data: [data],
      isEditOrAdd: true
    });
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
      if (tas.status != 2) {
        tas.status = 3;
        tas.hint = '暂停';
        obj.task = tas;
      } else {
        let ym = moment(tas.stTime).format('YYYYMM');
        let cym = moment().format('YYYYMM');
        if (ym === cym) {
          this.setState({ settled: true });
        }
      }
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
      if ((obj.task.status != 0) && (obj.task.status != 2)) {
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
  chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
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
      let resMem = await http({ baseURL: this.baseURL }).getTable({
        resid: tableId.settleId
      });
      let arr = [];
      for (let i = 0; i < res.data.length; i++) {
        arr.push({ numberId: res.data[i].numberId, name: res.data[i].name, recid: res.data[i].recid, REC_ID: res.data[i].recid });//精简数据，缩小保存到ls的数据大小
      }
      let arrMem = [];
      for (let i = 0; i < resMem.data.length; i++) {
        arrMem.push({ numberId: resMem.data[i].numberId, name: resMem.data[i].name, recid: resMem.data[i].REC_ID, REC_ID: resMem.data[i].REC_ID });//精简数据，缩小保存到ls的数据大小
      }
      arr = this.chunkArray(arr, 20);
      arrMem = this.chunkArray(arrMem, 20);
      let ts = { stTime: moment().format('YYYY-MM-DD hh:mm:ss'), status: 1, hint: '进行中', id: 0 }
      let process = initProcess;
      process[0].hint = '进行中';
      process[0].total = arr.length;
      process[0].status = 1;
      let mealData = {
        memData: arrMem,
        memDataOrigin: arr,
        process,
        task: ts,
        memDataAtt: []
      };
      this.setStorage(mealData);
      //修改“更新员工在职状态流程”的状态
      this.setState({ process, memDataOrigin: arr, loading: false, task: ts, memData: arrMem });
      await this.modiAccount(arr, 0);
      // await this.sendAllSubarrays(arr).catch((error) => {
      //   console.log('error', error)
      // })
    } catch (e) {
      this.repoError(e);
    }
  };
  modiAccount = async (org, count) => {
    let recid = '';
    let mealD = this.getStorage();
    let data = [];
    if (mealD.task.status === 3) {
      return false;
    }
    if (count < org.length) {
      data = org[count];
    } else {
      console.log('进来了', count)

      mealD.process[0].status = 2;
      mealD.process[0].hint = '已完成';
      mealD.process[1].status = 1;
      mealD.process[1].hint = '进行中';
      //生成要导入考勤补贴表的数据
      let memDataAtt = [];
      let stDate = moment().subtract(1, 'months').startOf('month');
      const daysInLastMonth = moment().subtract(1, 'months').daysInMonth();
      let stD = stDate;
      //只有非外包人员才需要计算日报
      // for (let i = 0; i < mealD.memData.length; i++) {
      //   if (mealD.memData[i].isWB != 'Y') {
      //     stD = stDate;
      //     for (let c = 0; c < daysInLastMonth; c++) {
      //       memDataAtt.push({
      //         numberId: mealD.memData[i].numberId,
      //         name: mealD.memData[i].name,
      //         dateStr: moment(stD).format('YYYYMMDD')
      //       });
      //       stD = moment(stD).add(1, 'days')
      //     }
      //   }
      // }
      //改为月报触发存储过程
      for (let i = 0; i < mealD.memDataOrigin.length; i++) {
        for (let c = 0; c < mealD.memDataOrigin[i].length; c++) {
          memDataAtt.push({
            numberId: mealD.memDataOrigin[i][c].numberId,
            name: mealD.memDataOrigin[i][c].name,
            month: moment(stD).format('YYYYMM')
          })
        }
      }
      memDataAtt = this.chunkArray(memDataAtt, 20);
      mealD.memDataAtt = memDataAtt;
      mealD.process[1].total = mealD.memData.length;
      mealD.task.id = 1;
      this.setStorage(mealD);
      this.setState({ process: mealD.process, memDataAtt });
      await this.refreSettl(mealD.memData, 0);
      return true;
    };
    try {
      // await Promise.all(data.map((obj) => this.addRec(tableId.memberId, obj)));
      let res = await http({ baseURL: this.baseURL }).modifyRecords({
        resid: tableId.memberId,
        data: data
      });

      //修改逻辑，直接从后台获取已经导入的memdata，之后直接修改数据而不是用editoradd方法
      // let arr = this.state.memData;
      // let array = []
      // for (let d = 0; d < data.length; d++) {
      // array.push({ numberId: data[d].numberId, name: data[d].name });
      // }
      // arr.push(array);
      let process = this.state.process;
      process[0].count = process[0].count + 1;
      let mealData = this.getStorage();
      // mealData.memData = arr;
      mealData.process = process;
      this.setState({ process });
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
    if (mealD.task.status === 3) {
      return false;
    }
    //为防止前端卡死，该步骤改为导入数据到后台，运行到这一步的时候自动暂停，等导入完毕以后再继续执行后续步骤
    // if (count < arr.length) {
    if (count < 0) {
      record = arr[count];
    } else {
      mealD.process[2].status = 2;
      mealD.process[2].count = arr.length;
      mealD.process[2].hint = '已完成';
      mealD.process[3].status = 1;
      mealD.process[3].total = mealD.memData.length;
      mealD.process[3].hint = '进行中';
      mealD.task.id = 3;
      this.setStorage(mealD);
      this.setState({ process: mealD.process, task: mealD.task });
      await this.refreSettl(mealD.memData, 0);
      return true;
    }
    try {
      console.log('record', record)
      // await Promise.all(record.map((obj) => this.addRec(tableId.attendaceId, obj)));

      let res = await http({ baseURL: this.baseURL }).addRecords({
        resid: tableId.attendaceId,
        data: record,
        isEditOrAdd: true
      });
      let process = mealD.process;
      process[2].count = process[2].count + 1;
      let mealData = this.getStorage();
      mealData.process = process;
      mealData.task.id = 2;
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
    let records = [];
    let mealD = await this.getStorage();
    const _id = mealD.task.id;
    const new_id = mealD.task.id + 1;
    if (mealD.task.status === 3) {
      return false;
    }
    if (count < arr.length) {
      const month = moment().subtract(1, 'months').format('YYYYMM');

      for (let c = 0; c < arr[count].length; c++) {
        let record = {
          month,
          numberId: arr[count][c].numberId,
          REC_ID: arr[count][c].REC_ID
        };
        if (mealD.task.id === 1) {
          record.killed = 'Y';
        } else if (mealD.task.id === 3) {
          record.dealed = 'Y';
        }
        records.push(record);
      }



    } else {
      if (mealD.task.id === 5) {
        mealD.process[_id].status = 2;
        mealD.process[_id].hint = '已完成';
        mealD.process[_id].status = 1;
        mealD.task.status = 2;
        mealD.task.hint = '已完成';
        this.setStorage(mealD);
        this.setState({ process: mealD.process, task: mealD.task, settled: true });
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
          this.setState({ process: mealD.process, task: mealD.task });
          this.handlePause()
          await this.addAttData(mealD.memDataAtt, 0);
          return true;
        } else {
          this.setStorage(mealD);
          this.setState({ process: mealD.process });
          await this.refreSettl(arr, 0);
          return true;
        }
      }
    }
    try {
      console.log('records', records)
      if (mealD.task.id != 1) {
        await Promise.all(records.map((obj) => this.modiRec(tableId.settleId, obj)));
      }
      // let res = await http({ baseURL: this.baseURL }).addRecords({
      //   resid: tableId.settleId,
      //   data: records,
      //   isEditOrAdd: true
      // });
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
    const { process, settled, task, memData, loading, memDataAtt, memDataOrigin } = this.state
    return (
      <div className='mealSettlement'>
        <div className='mealSettlement_controlPad'>
          <div>
            <Button type={'primary'} loading={loading} onClick={() => {
              this.handleRun();
            }} disabled={(task.status === 1) || settled}>开始</Button>
            <Button disabled={(task.status === 3) || ((task.status === 2)) || settled} onClick={() => { this.handlePause() }}>暂停</Button>
            {settled ? <span>当前月份已结算</span> : <span style={{ color: '#f5222d' }}>结算前请询问同事「当前月份是否已经结算过」,同一个月只能结算一次！</span>}
          </div>
          <div>
            最近一次任务开始时间：{task.stTime}
          </div>
          <div>
            最近一次任务状态：<span style={task.status === 1 ? { color: '#1890ff' } : {}}>{task.hint}</span>
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
                    {/* <span style={((item.status != 1) || (item.id === 0) || (item.id === 2) || (task.id === 2) || (task.id === 0) || (task.status === 3)) ? { display: 'none' } : {}}>
                      当前人员：
                      {memData[item.count] ? (memData[item.count].numberId + ' - ' + memData[item.count].name) : ''}
                    </span>
                    <span style={((item.status != 1) || (task.id != 0) || (task.status === 3)) ? { display: 'none' } : {}}>
                      当前人员：
                      {memDataOrigin[item.count] ? (memDataOrigin[item.count].numberId + ' - ' + memDataOrigin[item.count].name) : ''}
                    </span>
                    <span style={((item.status != 1) || (task.id != 2) || (task.status === 3)) ? { display: 'none' } : {}}>
                      当前人员：
                      {memDataAtt[item.count] ? (memDataAtt[item.count].numberId + ' - ' + memDataAtt[item.count].name) : ''}
                    </span> */}
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
