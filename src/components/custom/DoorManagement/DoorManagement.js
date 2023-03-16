import React, { Component } from 'react';
import {
  Pagination,
  message,
  Tabs,
  Button,
  Table,
  Spin,
  Progress,
  Modal,
  DatePicker,
  Select,
  Input
} from 'antd';
import './DoorManagement.less';
import TableData from '../../common/data/TableData';
import http, { makeCancelable } from 'Util20/api';
import moment from 'moment';
import { indexOf } from 'lodash';
const { Option } = Select;
const thead = [
  {
    title: '月份',
    dataIndex: 'C3_595166992528',
    key: 'C3_595166992528'
  },
  {
    title: '工号',
    dataIndex: 'C3_595166604634',
    key: 'C3_595166604634'
  },
  {
    title: '姓名',
    dataIndex: 'C3_595166693246',
    key: 'C3_595166693246'
  },
  {
    title: '部门',
    dataIndex: 'C3_595166712341',
    key: 'C3_595166712341'
  },
  {
    title: '权限组名',
    dataIndex: 'C3_595166751093',
    key: 'C3_595166751093'
  },
  {
    title: '确认无误',
    dataIndex: 'C3_595192402751',
    key: 'C3_595192402751'
  }
];
const theaDel = [
  {
    title: '月份',
    dataIndex: 'C3_595166992528',
    key: 'C3_595166992528'
  },
  {
    title: '工号',
    dataIndex: 'C3_595166604634',
    key: 'C3_595166604634'
  },
  {
    title: '姓名',
    dataIndex: 'C3_595166693246',
    key: 'C3_595166693246'
  },
  {
    title: '部门',
    dataIndex: 'C3_595166712341',
    key: 'C3_595166712341'
  },
  {
    title: '权限组名',
    dataIndex: 'C3_595166751093',
    key: 'C3_595166751093'
  },
  {
    title: '申请重开权限',
    dataIndex: 'C3_732287734141',
    key: 'C3_732287734141'
  }
];
class DoorManagement extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
    this.state = {
      data: [],
      process: '未开始',
      loading: false,
      step: 1,
      add: [],
      minus: [],
      same: [],
      selectedRowKeysSame: [],
      selectedDataAdd: [],
      selectedDataSame: [],
      percent: 0,
      isFinished: false,
      dataSame: 'same',
      dataAdd: 'add',
      dataMinus: 'minus',
      keyAdd: '',
      keyMinus: '',
      keySame: '',
      confirmedDel: false,
      confirmedAdd: false
    };
  }
  componentDidMount() {
    this.getDelConfirmRec();
    this.getData();
  }
  getYearMonths = async () => {
    try {
      const res = await http({ baseURL: this.baseURL }).getTable({
        resid: '702643427843',
        pageIndex: 0,
        pageSize: 1
      });
      if (res.data.length) {
        return res.data[0].C3_595166992528;
      }
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  filtData = (all, v) => {
    let arr = this.state[all + 'O'];
    let res = [];
    if (v) {
      for (let i = 0; i < arr.length; i++) {
        for (let c = 0; c < thead.length; c++) {
          let str = '' + arr[i][thead[c].key];
          if (str.indexOf(v) != -1) {
            res.push(arr[i]);
          }
        }
      }
    } else {
      res = arr;
    }
    this.setState({ [all]: res });
  };
  getData = async () => {
    this.setState({
      loading: true,
      process: '获取当月记录',
      step: 1
    });
    //获取考勤月
    let yymm = await this.getYearMonths();
    yymm = yymm + '';
    let yy = yymm.substring(0, 4);
    let mm = yymm.substring(4, 6);
    console.log(yy, mm);

    //let yy = new Date().getFullYear() + '';
    //let mm = new Date().getMonth() + 1;
    let ly = yy;
    let lm = mm - 1;
    if (lm <= 0) {
      lm = 12;
      ly = Number(yy) - 1;
    }
    if (Number(lm) < 10) {
      lm = '0' + Number(lm);
    } else {
      lm = lm + '';
    }
    ly = ly + '';
    let lym = ly + lm;
    if (Number(mm) < 10) {
      mm = '0' + Number(mm);
    } else {
      mm = mm + '';
    }
    let ym = yy + mm;
    let jobID = localStorage.getItem('userInfo');
    jobID = JSON.parse(jobID);
    jobID = jobID.UserInfo.EMP_ID;
    let cms = `(C3_595166992528 = '${ym}' or C3_595166992528 = '${lym}') and C3_595166775274 = '${jobID}'`;
    let res = await http({ baseURL: this.baseURL }).getTable({
      resid: 702643693809,
      cmswhere: cms
    });
    this.setState({
      process: '整理数据',
      step: 2
    });
    let n = 0;
    let data = res.data;
    let lyArr = [];
    let cyArr = [];
    let addY = [];
    let addN = [];
    let sameY = [];
    let sameN = [];
    let minusY = [];
    let minusN = [];
    while (n < data.length) {
      if (data[n].C3_595166992528 === lym) {
        lyArr.push(data[n]);
      } else {
        cyArr.push(data[n]);
      }
      n++;
    }
    this.setState({
      process: '筛选减少的门禁权限',
      step: 3
    });
    let add = [];
    let minus = [];
    let same = [];
    let bolSame = false;

    n = 0;
    while (n < lyArr.length) {
      let c = 0;
      let bol = false;
      while (c < cyArr.length) {
        if (
          (
            lyArr[n].C3_595166604634 === cyArr[c].C3_595166604634 &&
            lyArr[n].C3_595166751093 === cyArr[c].C3_595166751093) || cyArr[c].C3_727094761747 === 'Y'
        ) {
          if (lyArr[n].C3_595166604634 === cyArr[c].C3_595166604634 &&
            lyArr[n].C3_595166751093 === cyArr[c].C3_595166751093) {
            bol = true;
          }

          if (((!bolSame && cyArr[c].C3_727094761747 === 'Y') || (!cyArr[c].C3_727094761747))) {
            same.push(cyArr[c]);
            if (cyArr[c].C3_595192402751 === 'Y') {
              sameY.push(cyArr[c]);
            } else {
              sameN.push(cyArr[c]);
            }
          }
        }
        c++;
      }

      bolSame = true;
      if (!bol) {
        minus.push(lyArr[n]);
      }
      // if (!bol && cyArr[c]) {
      //   minus.push(lyArr[n]);
      //   if (lyArr[n].C3_595192402751 === 'Y' &&
      //     cyArr[c].C3_727094761747 != 'Y') {
      //     minusY.push(lyArr[n]);
      //   } else {
      //     minusN.push(lyArr[n]);
      //   }
      // }
      n++;
    }
    this.setState({
      process: '筛选增加的门禁权限',
      step: 4
    });
    n = 0;
    while (n < cyArr.length) {
      let c = 0;
      let bol = false;
      while (c < lyArr.length) {

        if (
          lyArr[c].C3_595166604634 === cyArr[n].C3_595166604634 &&
          lyArr[c].C3_595166751093 === cyArr[n].C3_595166751093
        ) {
          bol = true;
        }

        c++;
      }
      if ((!bol) && (cyArr[n].C3_727094761747 != 'Y')) {
        add.push(cyArr[n]);
        if (cyArr[n].C3_595192402751 === 'Y') {
          addY.push(cyArr[n]);
        } else {
          addN.push(cyArr[n]);
        }
      }
      n++;
    }
    this.setState({
      loading: false,
      process: '完成',
      add,
      minus,
      same,
      addY,
      addN,
      minusY,
      minusN,
      sameY,
      sameN,
      sameO: same,
      minusO: minus,
      addO: add
    });
  };
  handleCloz = async arr => {
    console.log(arr);
    if (arr.length > 0) {
      this.setState({ toDel: arr, vis: true, refre: 1 });
    } else {
      message.error('请选择记录');
    }
  };
  setSel = (type, selectedRowKeys, selectedRows) => {
    if (type === 'same') {
      this.setState({
        selectedRowKeysSame: selectedRowKeys,
        selectedDataSame: selectedRows
      });
    } else if (type === 'add') {
      this.setState({
        selectedRowKeysAdd: selectedRowKeys,
        selectedDataAdd: selectedRows
      });
    } else {
      this.setState({
        selectedRowKeysDel: selectedRowKeys,
        selectedDataDel: selectedRows
      })
    }
  };
  handleConfirm = async type => {
    let data = [];
    if (type === 'add') {
      data = this.state.selectedDataAdd;
    } else {
      data = this.state.selectedDataSame;
    }
    let n = 0;
    while (n < data.length) {
      data[n].C3_595192402751 = 'Y';
      data[n]._state = 'editoradd';
      data[n]._id = n;
      n++;
    }
    data = JSON.stringify(data);
    try {
      let res = await http({ baseURL: this.baseURL }).StartSaveTask({
        resid: 702643693809,
        data
      });
      message.success('已开始上传数据');
      const taskid = res.taskid;
      if (taskid) {
        this.getTaskInfo(taskid);
      } else {
        message.error('无taskid');
      }
      this.setState({
        selectedRowKeysSame: [],
        selectedDataSame: [],
        selectedDataAdd: [],
        selectedRowKeysAdd: []
      });
    } catch (e) {
      message.error(e.message);
      console.log(e.message);
    }
  };
  handleDelRight = async (arr, delMark) => {
    if (arr.length > 0) {
      this.setState({ vis: true, refre: 2, delMark });
    } else {
      message.error('请选择记录');
    }
  };
  addDelRec = async date => {
    let data = this.state.toDel;
    let n = 0;
    let arr = [];
    while (n < data.length) {
      data[n].C3_595192402751 = 'Y';
      arr.push({
        //权限组
        C3_497800103507: data[n].C3_595166751093,
        C3_498749351171: '删除',
        //工号
        C3_498046910810: data[n].C3_595166604634,
        C3_498756365442: date,
        _state: 'editoradd',
        _id: n
      });
      n++;
    }
    let data2 = JSON.stringify(arr);
    //遍历删除原有数组的数据
    let afterDel = [];
    let org = this.state[this.state.dataSame];
    let mark = 'same'
    if (this.state.delMark === 'add') {
      org = this.state[this.state.dataAdd];
      mark = 'add'
    }
    for (let m = 0; m < org.length; m++) {
      let bool = false;
      for (let nn = 0; nn < data.length; nn++) {
        if (org[m].REC_ID === data[nn].REC_ID) {
          bool = true;
        }
      }
      if (!bool) {
        afterDel.push(org[m]);
      }
    }
    if (mark === 'same') {
      this.setState({ toDel: [], [this.state.dataSame]: afterDel, delMark: '' })
    } else {
      this.setState({ toDel: [], [this.state.dataAdd]: afterDel, delMark: '' })
    }
    this.setState({
      selectedRowKeysSame: [],
      selectedDataSame: [],
      selectedDataAdd: [],
      selectedRowKeysAdd: []
    });
    try {
      let resC = await http({ baseURL: this.baseURL }).modifyRecords({
        resid: 702643427843,
        data
      });
      message.success('已确认完毕');
    } catch (e) {
      message.error(e.message);
      console.log(e.message);
    }
    try {
      let res = await http({ baseURL: this.baseURL }).StartSaveTask({
        resid: 692357214309,
        data2
      });
      message.success('已经上传数据');
      const taskid = res.taskid;
      if (taskid) {
        this.getTaskInfo(taskid);
      } else {
        message.error('无taskid');
      }
    } catch (e) {
      message.error(e.message);
      console.log(e.message);
    }
  };
  getTaskInfo = async taskid => {
    let res;
    const baseURL = this.baseURL;
    let httpParams = {};
    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    try {
      res = await http(httpParams).RetrieveSaveTask({
        taskid,
        includeData: true
      });
    } catch (err) {
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo(taskid);
        }
      }, 1000);
      console.log(err);
      return message.error(err.message);
    }
    let data = res.data;
    if (res.IsCompleted) {
      // 当前任务已完成
      if (data.result.Error !== 0) {
        let errorList = [];
        data.result.data.forEach(item => {
          if (item.maindata.message) {
            errorList.push(item.maindata);
          }
        });
        let percent = Math.floor((data.intCurrent / data.intTotalNumber) * 100);
        message.success('成功');
        this.setState({
          errorList,
          percent,
          isFinished: true,
          intCurrent: data.intCurrent,
          intErrLines: data.intErrLines,
          intTotalNumber: data.intTotalNumber
        });
        if (this.state.refre === 2) {
          this.getData();
          this.getDelConfirmRec();

        } else {
          this.tableDataRef.handleRefresh();
        }
      } else {
        this.setState({
          percent: 100,
          isFinished: true,
          intCurrent: data.intCurrent,
          intErrLines: data.intErrLines,
          intTotalNumber: data.intTotalNumber
        });
      }
    } else {
      // 当前任务未完成
      let percent = Math.floor((data.intCurrent / data.intTotalNumber) * 100);
      this.setState({
        percent,
        isFinished: false,
        intCurrent: data.intCurrent,
        intErrLines: data.intErrLines,
        intTotalNumber: data.intTotalNumber
      });
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo(taskid);
        }
      }, 1000);
    }
  };
  onChangeDate = v => {
    this.setState({ delTime: v });
  };
  onSub = () => {
    this.addDelRec(this.state.delTime);
    this.setState({ vis: false, delTime: null });
  };
  handleConfirmDel = async () => {
    let res;
    const baseURL = this.baseURL;
    let httpParams = {};
    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    try {
      res = await http(httpParams).addRecords({
        resid: 731348464154,
        data: [{
          C3_731348719962: ''
        }],
        isEditOrAdd: 'true'
      });
      message.success('确认成功');
    } catch (err) {
      console.log(err);
      return message.error(err.message);
    }
  }
  getDelConfirmRec = async () => {
    let res;
    const baseURL = this.baseURL;
    let httpParams = {};
    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    try {
      res = await http(httpParams).getTable({
        resid: 732207214993
      });
      if (res.data[0].C3_731607900611 === 'Y') {
        this.setState({ confirmedDel: true });
      }
      if (res.data[0].C3_731348909587 === 'Y') {
        this.setState({ confirmedAdd: true });
      }
    } catch (err) {
      console.log(err);
      return message.error(err.message);
    }
  }
  handleReapply = async () => {
    this.setState({ loading: true });
    let res;
    const baseURL = this.baseURL;
    let httpParams = {};
    // 使用传入的 baseURL
    if (baseURL) {
      httpParams.baseURL = baseURL;
    }
    let data = this.state.selectedDataDel;
    for (let i = 0; i < data.length; i++) {
      data[i].C3_732287734141 = 'Y';
    }
    try {
      res = await http(httpParams).modifyRecords({
        resid: 702643427843,
        data
      });
      this.setState({ loading: false });
      message.success('已申请')
    } catch (err) {
      console.log(err);
      return message.error(err.message);
    }
  }
  render() {
    const { activeKey } = this.state;
    return (
      <div className="DoorManagement">
        {/* <div className="prog">
          <Progress percent={this.state.percent} className="chart" />
          <span className="hint">
            {this.state.percent > 0
              ? '进度：' + this.state.percent + '%'
              : null}
          </span>
        </div> */}
        <Modal
          visible={this.state.vis}
          footer={null}
          width={400}
          destroyOnClose
          onCancel={() => {
            this.setState({ vis: false });
          }}
        >
          {/* 生效时间：
          <DatePicker
            showTime
            value={this.state.delTime}
            onChange={v => {
              this.onChangeDate(v);
            }}
          /> */}
          <p>是否确定要删除?</p>
          <Button
            type={'primary'}
            style={{ marginLeft: '.5rem' }}
            onClick={() => {
              this.onSub();
            }}
          >
            确定
          </Button>
        </Modal>

        {/* <Tabs
          defaultActiveKey="1"
          onChange={() => {
            this.setState({ toDel: [] });
          }}
        > */}
        {/* <Tabs.TabPane tab="现有门禁清单" key={1}>
            <div className="tableWrap">
              <TableData
                baseURL={this.baseURL}
                downloadBaseURL={this.downloadURL}
                resid={'702643427843'}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                subtractH={240}
                defaultPagination={
                  {
                    pageSize: 100,
                    current: 1,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: ['10', '20', '30', '40', '100', '500', '1000']
                  }
                }
                hasAdd={false}
                hasRowView={false}
                hasRowDelete={true}
                hasRowEdit={false}
                hasDelete={true}
                hasModify={false}
                hasBeBtns={true}
                hasRowModify={true}
                hasRowSelection={true}
                hasAdvSearch={false}
                customRowBtns={[
                  record => {
                    return (
                      <Button onClick={() => this.handleCloz([record])}>
                        关闭门禁
                      </Button>
                    );
                  }
                ]}
                actionBarExtra={({ dataSource = [], selectedRowKeys = [] }) => {
                  const selectedRecords = selectedRowKeys.map(key => {
                    return dataSource.find(item => item.REC_ID === key);
                  });
                  return (
                    <Button
                      size={'small'}
                      onClick={() => {
                        if (!selectedRecords.length) {
                          return message.info('请选择记录');
                        }
                        this.handleCloz([...selectedRecords]);
                      }}
                    >
                      关闭门禁
                    </Button>
                  );
                }}
              />
            </div>
          </Tabs.TabPane> */}
        {/* <Tabs.TabPane tab="月度变动清单" key={1}> */}
        <Spin spinning={this.state.loading}>
          <div className="tableWrap">
            <Button
              type={'primary'}
              onClick={() => {
                this.getData();
                this.getDelConfirmRec();

              }}
            >
              刷新数据
                </Button>
            <span style={{ color: '#f5222d', marginLeft: 8 }}>门权限被删除后，需要24小时才会生效</span>
            {this.state.process != '完成' ? null : (
              <ul>
                <li>
                  <div className="add">
                    <span>新增权限  - {this.state.confirmedAdd ? '已' : '未'}确认</span>

                    {/* <Button
                          type="primary"
                          onClick={() => {
                            this.handleConfirm('add');
                          }}
                        >
                          保留
                        </Button> */}
                    <Button
                      type="danger"
                      onClick={() => {
                        this.setState({
                          toDel: this.state.selectedDataAdd
                        });
                        this.handleDelRight(this.state.selectedDataAdd, 'add');
                      }}
                    >
                      删除
                        </Button>
                    {
                      this.state.confirmedAdd ?
                        null
                        : <Button
                          type="primary"
                          onClick={() => {
                            this.handleConfirm('add')
                          }}
                        >
                          确认无误
                      </Button>
                    }

                    <Input.Search
                      style={{ width: 'calc(100% - 260px)' }}
                      onPressEnter={v => {
                        this.filtData('add', v.target.value);
                      }}
                    />
                    {/* <b>确认无误：</b>
                        <Select
                          defaultValue="add"
                          style={{ width: 120 }}
                          onChange={v => {
                            this.setState({
                              dataAdd: v,
                              selectedDataAdd: [],
                              selectedRowKeysAdd: []
                            });
                          }}
                        >
                          <Option value="add">全部</Option>
                          <Option value="addY">是</Option>
                          <Option value="addN">否</Option>
                        </Select> */}
                  </div>
                  <div className="tableOuter">
                    <Table
                      rowSelection={{
                        selectedRowKeys: this.state.selectedRowKeysAdd,
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                          this.setSel('add', selectedRowKeys, selectedRows);
                        }
                      }}
                      dataSource={this.state[this.state.dataAdd]}
                      columns={thead}
                      pagination={{
                        pageSize: 40,
                        pageSizeOptions: [10, 40, 100, 500],
                        showSizeChanger: true,
                        size: 'small',
                        showQuickJumper: true,
                        onChange: () => {
                          this.setSel('add', [], []);
                        }
                      }}
                    />
                  </div>
                </li>
                <li>
                  <div className="minus">
                    减少权限 - {this.state.confirmedDel ? '已' : '未'}确认
                        {
                      this.state.confirmedDel ? null : <Button
                        type="primary"
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                          this.handleConfirmDel();
                        }}
                      >
                        确认无误
                        </Button>
                    }
                    <Button onClick={() => { this.handleReapply() }}>申请复权</Button>
                    <Input.Search
                      style={{ width: 'calc(100% - 320px)' }}
                      onPressEnter={v => {
                        this.filtData('minus', v.target.value);
                      }}
                    />

                    {/* <b>确认无误：</b>
                        <Select
                          defaultValue="minus"
                          style={{ width: 120 }}
                          onChange={v => {
                            this.setState({ dataMinus: v });
                          }}
                        >
                          <Option value="minus">全部</Option>
                          <Option value="minusY">是</Option>
                          <Option value="minusN">否</Option>
                        </Select> */}
                  </div>
                  <div className="tableOuter">
                    <Table
                      dataSource={this.state.minus}
                      rowSelection={{
                        selectedRowKeys: this.state.selectedRowKeysDel,
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                          this.setSel(
                            'del',
                            selectedRowKeys,
                            selectedRows
                          );
                        }
                      }}
                      columns={theaDel}
                      pagination={{
                        pageSizeOptions: [10, 40, 100, 500],
                        pageSize: 40,
                        size: 'small',
                        showSizeChanger: true,
                        showQuickJumper: true,
                        onChange: () => {
                          this.setSel('del', [], []);
                        }
                      }}
                    />
                  </div>
                </li>
                <li>
                  <div className="same">
                    <span>未变权限</span>
                    {/* <Button
                          type="primary"
                          onClick={() => {
                            this.handleConfirm('same');
                          }}
                        >
                          保留
                        </Button> */}
                    <Button
                      type="danger"
                      onClick={() => {
                        this.setState({
                          toDel: this.state.selectedDataSame
                        });
                        this.handleDelRight(this.state.selectedDataSame, 'same');
                      }}
                    >
                      删除
                        </Button>
                    {/* {
                      this.state[this.state.dataSame].length > 0 ?
                        <Button
                          type="primary"
                          onClick={() => {
                            this.handleConfirm('same')
                          }}
                        >
                          确认无误
                        </Button>
                        : null
                    } */}

                    <Input.Search
                      style={{ width: 'calc(100% - 260px)' }}
                      onPressEnter={v => {
                        this.filtData('same', v.target.value);
                      }}
                    />
                    {/* <b>确认无误：</b>

                        <Select
                          defaultValue="same"
                          style={{ width: 120 }}
                          onChange={v => {
                            this.setState({
                              dataSame: v,
                              selectedDataSame: [],
                              selectedRowKeysSame: []
                            });
                          }}
                        >
                          <Option value="same">全部</Option>
                          <Option value="sameY">是</Option>
                          <Option value="sameN">否</Option>
                        </Select> */}
                  </div>
                  <div className="tableOuter">
                    <Table
                      rowSelection={{
                        selectedRowKeys: this.state.selectedRowKeysSame,
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                          this.setSel(
                            'same',
                            selectedRowKeys,
                            selectedRows
                          );
                        }
                      }}
                      dataSource={this.state[this.state.dataSame]}
                      columns={thead}
                      pagination={{
                        pageSizeOptions: [10, 40, 100, 500],
                        pageSize: 40,
                        size: 'small',
                        showSizeChanger: true,
                        showQuickJumper: true,
                        onChange: () => {
                          this.setSel(
                            'same',
                            [],
                            []
                          );
                        }
                      }}
                    />
                  </div>
                </li>
              </ul>
            )}
          </div>
        </Spin>
        {/* </Tabs.TabPane>
        </Tabs> */}
      </div>
    );
  }
}

export default DoorManagement;
