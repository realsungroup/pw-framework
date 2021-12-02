import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, Input, Modal, Spin, Tabs, Select, message, DatePicker } from 'antd';
import './AccessControl.less';
import moment from 'moment';
import http from '../../../util20/api';
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
class AccessControl extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  componentDidMount() {
    let edDate = moment().format('YYYY-MM-DD');
    let stDate = moment().subtract('days',6).format('YYYY-MM-DD');
    this.setState({edDate,stDate});
    
    this.getAllDoors();
  }
  state = {
    kw: '',
    rightList: [],
    currentRight: {
      group: '',
      time: '',
      recid: '',
      door: [{ name: '', recid: '' }],
      filterSync: 0
    },
    subStatus: 0,
    cms: ``,
    importCms: `isnull(C3_498047440296,'') = ''`,
    filterSync: 'all',
    columns: [],
    detailData: []
  };
  //获取列定义
  getCol = async () => {
    this.setState({ loading: true });
    let arr = [];
    try {
      let res = await http({ baseURL: this.baseURL }).getTableColumnDefine({
        resid: 666812500033
      });
      let n = 0;
      while (n < res.data.length) {
        res.data[n].title = res.data[n].ColDispName;
        res.data[n].labeldataIndex = res.data[n].ColName;
        res.data[n].labelkey = res.data[n].ColName;
        arr.push(res.data[n]);
        n++;
      }
      this.setState({ columns: arr });
      this.setState({ loading: false });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };
  //获取所有门的数据
  getAllDoors = async () => {
    this.setState({ loading: true });
    let res;
    try {
      let res = await http({ baseURL: this.baseURL }).getTable({
        resid: 691171742184
      });
      this.dataPro(res.data);
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };
  //整理数据
  dataPro = arr => {
    let n = 0;
    let a = [];
    while (n < arr.length) {
      if (a == 0) {
        a.push({
          groupId: arr[n].组编号,
          group: arr[n].组名称,
          door: [{ name: arr[n].门名称, recid: arr[n].REC_ID }],
          time: arr[n].时间段名称,
          timeId: arr[n].时间段编号
        });
      } else {
        let c = 0;
        let bol = false;
        while (c < a.length) {
          if (
            a[c].groupId == arr[n].组编号 &&
            a[c].timeId == arr[n].时间段编号
          ) {
            bol = true;
            let d = a[c].door;
            d.push({ name: arr[n].门名称, recid: arr[n].REC_ID });
            a[c].door = d;
          }
          c++;
        }
        if (!bol) {
          a.push({
            groupId: arr[n].组编号,
            door: [{ name: arr[n].门名称, recid: arr[n].REC_ID }],
            group: arr[n].组名称,
            time: arr[n].时间段名称,
            timeId: arr[n].时间段编号
          });
        }
      }
      n++;
    }
    n = 0;
    while (n < a.length) {
      a[n].id = n;
      n++;
    }
    this.setState({ originList: a, rightList: a });
    this.getCol();
  };
  //点击搜索按钮
  handleSearch = () => {
    let k = this.state.kw;
    let n = 0;
    let arr = [];
    let org = this.state.originList;
    while (n < org.length) {
      let bol = false;
      let c = 0;
      while (c < org[n].door.length) {
        if (org[n].door[c].name.indexOf(k) != -1) {
          bol = true;
        }
        c++;
      }
      if (org[n].group.indexOf(k) != -1) {
        bol = true;
      }
      if (org[n].time.indexOf(k) != -1) {
        bol = true;
      }
      if (bol) {
        arr.push(org[n]);
      }
      n++;
    }
    this.setState({
      rightList: arr,
      cms: ``,
      currentRight: {
        group: '',
        time: '',
        recid: '',
        door: [{ name: '', recid: '' }]
      }
    });
  };
  //点击重置按钮
  handleReset = () => {
    this.setState({
      rightList: this.state.originList,
      kw: '',
      cms: ``,
      currentRight: {
        group: '',
        time: '',
        recid: '',
        door: [{ name: '', recid: '' }]
      }
    });
  };
  //点击同步搜索
  handleSearchSync = () => {
    let k = this.state.kw2;
    let n = 0;
    let arr = [];
    let org = this.state.orgDetails[this.state.filterSync];
    while (n < org.length) {
      let bol = false;
      let obj = org[n];
      for (let key in obj) {
        let str = obj[key] + '';
        if (str.indexOf(k) != -1) {
          bol = true;
        }
      }

      if (bol) {
        arr.push(obj);
      }
      n++;
    }
    this.setState({
      detailData: arr
    });
  };

  //点击同步按钮
  handleSync = async d => {
    this.setState({ loading: true });
    console.log(d);
    let arr = d;
    let n = 0;
    while (n < arr.length) {
      arr[n].C3_498047440296 = 'Y';
      n++;
    }
    try {
      let res = await http({ baseURL: this.baseURL }).modifyRecords({
        resid: 666812500033,
        data: arr
      });
      message.success('已提交同步请求');
      this.tableDataRef.handleRefresh();
      this.setState({ loading: false });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
      message.error(e.message);
    }
  };
  //获取所有明细并筛选同步状态
  getDetails = async (st,ed) => {
    this.setState({loading:true});
    let stDate=this.state.stDate;
    let edDate=this.state.edDate;
    if(st){
      stDate=st;
    }
    if(ed){
      edDate=ed;
    }
    //明细
    let res = await http({ baseURL: this.baseURL }).getTable({
      resid: 691681288938,
      cmswhere:`TheDatetime >= '${stDate}' and TheDatetime <= '${edDate}'`
    });
    let n = 0;
    let arr = [];
    while (n < res.data.length) {
      let c = 0;
      let bol = false;
      while (c < arr.length) {
        if (res.data[n].ID == arr[c]) {
          bol = true;
        }
        c++;
      }
      if (!bol) {
        arr.push(res.data[c].ID);
      }
      n++;
    }
    //操作记录
    let res2 = await http({ baseURL: this.baseURL }).getTable({
      resid: 666812500033,
      cmswhere: `C3_498047440296 = 'Y'`
    });
    let all = [];
    let un = [];
    let done = [];
    n = 0;
    while (n < arr.length) {
      let c = 0;
      let bol = false;
      all.push(res2.data[n]);

      while (c < res2.data.length) {
        if (res2.data[c].C3_691167014001 == arr[n]) {
          bol = true;
        }
        c++;
      }
      if (bol) {
        done.push(res2.data[n]);
      } else {
        un.push(res2.data[n]);
      }
      n++;
    }
    let obj = {
      done,
      all,
      un
    };
    this.setState({ orgDetails: obj, detailData: obj[this.state.filterSync] ,loading:false});
  };
  //筛选同步状态
  handleChangeFilter = async v => {
    this.setState({ filterSync: v, detailData: this.state.orgDetails[v] });
    console.log(this.state.orgDetails[v]);
  };
  render() {
    const { showModal, showModalInput } = this.state;
    return (
      <div className="ac">
        <Spin spinning={this.state.loading}>
          <Tabs>
            <TabPane tab={'权限查阅'} key={0}>
              <Modal
                visible={showModal}
                title={
                  this.state.currentRight.group + this.state.currentRight.time
                }
                width={800}
                footer={null}
                onCancel={() => {
                  this.setState({ showModal: false });
                }}
                destroyOnClose
              >
                <div>
                  <ul className="doors">
                    {this.state.currentRight.door.map(item => {
                      return (
                        <li>
                          <span>{item.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Modal>
              <div className="l">
                <div className="search">
                  <Input
                    style={{ width: 'calc(100% - 1rem - 144px)' }}
                    value={this.state.kw}
                    onChange={v => {
                      this.setState({ kw: v.target.value });
                    }}
                    onKeyUp={e => {
                      if (e.keyCode == 13) {
                        this.handleSearch();
                      }
                    }}
                  />
                  <Button
                    style={{ width: '72px', marginLeft: '.5rem' }}
                    type={'primary'}
                    onClick={() => {
                      this.handleSearch();
                    }}
                  >
                    搜索
                  </Button>
                  <Button
                    style={{ width: '72px', marginLeft: '.5rem' }}
                    onClick={() => {
                      this.handleReset();
                    }}
                  >
                    重置
                  </Button>
                </div>
                <ul>
                  {this.state.rightList.map(item => {
                    return (
                      <li
                        key={item.id}
                        className={
                          this.state.currentRight.id == item.id ? 'current' : ''
                        }
                      >
                        <span
                          onClick={() => {
                            if (this.state.currentRight.id == item.id) {
                              this.setState({
                                currentRight: {
                                  group: '',
                                  time: '',
                                  recid: '',
                                  door: [{ name: '', recid: '' }]
                                },
                                cms: ``
                              });
                            } else {
                              this.setState({
                                currentRight: item,
                                cms: `组编号 = ${item.groupId} and 时间段编号 = ${item.timeId}`
                              });
                            }
                          }}
                        >
                          {item.group} {item.time}
                        </span>
                        <Button
                          size={'small'}
                          type={
                            this.state.currentRight.id == item.id
                              ? 'primary'
                              : 'normal'
                          }
                          onClick={() => {
                            this.setState({
                              currentRight: item,
                              cms: `组编号 = ${item.groupId} and 时间段编号 = ${item.timeId}`,
                              showModal: true
                            });
                          }}
                        >
                          查看详情
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="r">
                <TableData
                  downloadBaseURL={this.downloadURL}
                  baseURL={this.baseURL}
                  down
                  resid="691171872439"
                  cmswhere={this.state.cms}
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  refTargetComponentName="TableData"
                  subtractH={180}
                  hasAdd={false}
                  hasRowView={false}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasDelete={false}
                  hasModify={false}
                  hasRowModify={false}
                  hasRowSelection={false}
                  hasAdvSearch={false}
                />
              </div>
            </TabPane>
            <TabPane tab={'权限导入'} key={1}>
              <div className="rightFilters">
                <ul>
                  <li
                    className={this.state.subStatus == 0 ? 'current' : ''}
                    onClick={() => {
                      this.setState({
                        subStatus: 0
                      });
                    }}
                  >
                    未提交
                  </li>
                  <li
                    className={this.state.subStatus == 1 ? 'current' : ''}
                    onClick={() => {
                      this.setState({
                        subStatus: 1,
                        filterSync: 'all'
                      });
                      this.getDetails();
                    }}
                  >
                    已提交
                  </li>
                </ul>
                {this.state.subStatus == 0 ? null : (
                  <>
                    <Select
                      style={{ width: 120, left: 16 }}
                      size="small"
                      onChange={v => {
                        this.handleChangeFilter(v);
                      }}
                      value={this.state.filterSync}
                    >
                      <Select.Option value={'all'}>全部</Select.Option>
                      <Select.Option value={'un'}>未同步</Select.Option>
                      <Select.Option value={'done'}>已同步</Select.Option>
                      {/* <Select.Option value={3}>
                    同步失败
                  </Select.Option> */}
                    </Select>
                    <RangePicker
                      style={{ marginLeft: 24 }}
                      size="small"
                      value={this.state.stDate && this.state.edDate ? [
                        moment(this.state.stDate, dateFormat),
                        moment(this.state.edDate, dateFormat)
                      ] : [null, null]}
                      onChange={(dates, dateString) => {
                        this.setState({
                          stDate:dateString[0],
                          edDate:dateString[1]
                        });
                        this.getDetails(dateString[0],dateString[1])
                      }}
                    ></RangePicker>
                    <Input
                      style={{ width: '320px', height: '24px', marginLeft: 8 }}
                      value={this.state.kw2}
                      onChange={v => {
                        this.setState({ kw2: v.target.value });
                      }}
                      onKeyUp={e => {
                        if (e.keyCode == 13) {
                          this.handleSearchSync();
                        }
                      }}
                    />
                    <Button
                      style={{ width: '72px', marginLeft: '.5rem' }}
                      type={'primary'}
                      size={'small'}
                      onClick={() => {
                        this.handleSearchSync();
                      }}
                    >
                      搜索
                    </Button>
                    <Button
                      style={{ width: '72px', marginLeft: '.5rem' }}
                      size={'small'}
                      onClick={() => {
                        this.handleChangeFilter(this.state.filterSync);
                      }}
                    >
                      重置
                    </Button>
                  </>
                )}
              </div>
              <div className="outer">
                <TableData
                  downloadBaseURL={this.downloadURL}
                  baseURL={this.baseURL}
                  style={this.state.subStatus == '0' ? {} : { display: 'none' }}
                  resid="666812500033"
                  cmswhere={this.state.importCms}
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  refTargetComponentName="TableData"
                  subtractH={180}
                  hasAdd={false}
                  hasRowView={false}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasDelete={false}
                  hasModify={false}
                  hasRowModify={false}
                  hasRowSelection={true}
                  hasAdvSearch={false}
                  actionBarExtra={({
                    dataSource = [],
                    selectedRowKeys = [],
                    data = [],
                    recordFormData,
                    size
                  }) => {
                    const selectedRecords = selectedRowKeys.map(key => {
                      return dataSource.find(item => item.REC_ID === key);
                    });
                    return this.state.importCms ==
                      `isnull(C3_498047440296,'') = ''` ? null : (
                      <Button
                        type="primary"
                        size={size}
                        loading={this.state.loading}
                        onClick={() => {
                          if (!selectedRecords.length) {
                            return message.info('请选择记录');
                          }
                          this.handleSync([...selectedRecords]);
                        }}
                      >
                        提交
                      </Button>
                    );
                  }}
                />
                {this.state.subStatus == 0 ? null : (
                  <div className={'csmTable'}>
                    <table>
                      <tr>
                        {this.state.columns.map(item => {
                          return <th>{item.title}</th>;
                        })}
                      </tr>
                      {this.state.detailData.map((item, key) => {
                        return (
                          <tr>
                            {this.state.columns.map(item2 => {
                              return (
                                <td>
                                  {
                                    this.state.detailData[key][
                                      item2.labeldataIndex
                                    ]
                                  }
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </table>
                  </div>
                )}
              </div>
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    );
  }
}

export default AccessControl;
