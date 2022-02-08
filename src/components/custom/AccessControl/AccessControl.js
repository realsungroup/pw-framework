import React from 'react';
import { TableData } from '../../common/loadableCommon';
import {
  Button,
  Input,
  Modal,
  Spin,
  Tabs,
  Select,
  message,
  DatePicker,
  Checkbox
} from 'antd';
import './AccessControl.less';
import moment from 'moment';
import http from '../../../util20/api';
import exportJsonExcel from 'js-export-excel';

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
    let edDate = moment()
      .subtract('days', -1)
      .format('YYYY-MM-DD');
    let stDate = moment()
      .subtract('days', 6)
      .format('YYYY-MM-DD');
    this.setState({ edDate, stDate });

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
  //全选
  checkeAll = v => {
    let arr = this.state.detailData;
    let n = 0;
    while (n < arr.length) {
      arr[n].checked = v;
      n++;
    }
    this.setState({ detailData: arr, checkedAll: v });
  };
  //单选
  handleChecked = (v, key) => {
    let arr = this.state.detailData;
    arr[key].checked = v;
    let bol = true;
    let n = 0;
    while (n < arr.length) {
      if (!arr[n].checked) {
        bol = false;
      }
      n++;
    }
    this.setState({ detailData: arr, checkedAll: bol });
  };
  //获取列定义
  getCol = async () => {
    this.setState({ loading: true });
    let arr = [{ title: '', labeldataIndex: 'none', labelkey: 'none' }];
    // let arr = [];
    try {
      let res = await http({ baseURL: this.baseURL }).getTableColumnDefine({
        resid: 692357214309
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
  //导出excel的预处理
  beforeExport=async(resid,cmswhere)=>{
    this.setState({loading:true});
    let str='门禁权限';
    if(resid===691171742184){
      str='门禁权限组'
    }
    try{
      let res =  await http({ baseURL: this.baseURL }).getTable({
        resid,
        cmswhere
      });
      let res2 = await http({ baseURL: this.baseURL }).getTableColumnDefine({
        resid
      });
      if(res.data.length>0&&res2.data.length>0){
        if(resid===691171742184){
          this.exportExcel(res.data,res2.data,str);
        }else{
          this.exportExcel(res.data,res2.data,this.state.currentRight.group?this.state.currentRight.group:str);
        }
      }
    }catch(e){
      console.log(e.message);
      message.error(e.message);
     this.setState({loading:false});

    }
  }

  //导出excel
  exportExcel = async(data,cols,title)=>{
    let sheetData=[]
    let n=0;
    let obj={};
    let arr=[]
    while(n<cols.length){
      obj['_a'+n]=cols[n].ColDispName;
      arr.push(cols[n].ColDispName);
      n++;
    }
    sheetData.push(obj);
    n=0;
    while(n<data.length){
      let obj={};
      let c=0;
      while(c<arr.length){
        obj['_a'+n+c]=data[n][arr[c]];
        c++;
      }
      sheetData.push(obj);
      n++;
    } 
    var fileName = title;
    const option = {
      fileName : fileName,
      columnWidths: [20, ''],
      datas: [
        {
          sheetName: 'sheet',
          sheetData:sheetData
        }
      ]
    };
    const toExcel = new exportJsonExcel(option);
    toExcel.saveExcel();
    this.setState({loading:false});
  }
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
          timeId: arr[n].时间段编号,
          count: arr[n].人员数 + '人'
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
            timeId: arr[n].时间段编号,
            count: arr[n].人员数 + '人'
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
    console.log('org', org);
    while (n < org.length) {
      let bol = false;
      let c = 0;
      while (c < org[n].door.length) {
        if (org[n].door[c].name) {
          if (org[n].door[c].name.indexOf(k) != -1) {
            bol = true;
          }
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
    this.checkeAll(false);
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
  handleSync = async v => {
    this.setState({
      loading: true
    });
    let a = this.state.detailData;
    let arr = [];
    let n = 0;
    let c = [];
    let org = [];
    if (v == 'all') {
      arr.push({
        C3_691260319398: '人工',
        authorityId: '',
        offSet: '5'
      });
    } else {
      while (n < a.length) {
        if (a[n].checked) {
          org.push(a[n]);
          let bol = false;
          let p = 0;
          while (p < c.length) {
            if (c[p] == a[n].C3_497800103273) {
              bol = true;
            }
            p++;
          }
          if (!bol) {
            arr.push({
              C3_691260319398: '人工',
              authorityId: a[n].C3_497800103273,
              offSet: '5'
            });
            c.push(a[n].C3_497800103273);
          }
        }
        n++;
      }
    }
    try {
      let res = await http({ baseURL: this.baseURL }).addRecords({
        resid: 691260187514,
        data: arr
      });
      n = 0;
      let res2Data = [];
      while (n < res.data.length) {
        let aa = 0;
        while (aa < org.length) {
          if (res.data[n].authorityId == org[aa].C3_497800103273) {
            let object = org[aa];
            object.C3_691167014001 = res.data[n].logId;
            res2Data.push(object);
          }
          aa++;
        }
        n++;
      }

      let res2 = await http({ baseURL: this.baseURL }).modifyRecords({
        resid: 692357214309,
        data: res2Data
      });
      this.checkeAll(false);
      message.success('已提交同步请求');
      this.setState({ loading: false });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
      message.error(e.message);
    }
  };
  //点击提交按钮
  handleSub = async d => {
    this.setState({ loading: true });
    let arr = d;
    let n = 0;
    while (n < arr.length) {
      arr[n].C3_498047440296 = 'Y';
      n++;
    }
    try {
      let res = await http({ baseURL: this.baseURL }).modifyRecords({
        resid: 692357214309,
        data: arr
      });
      message.success('已提交');
      this.tableDataRef.handleRefresh();
      this.setState({ loading: false });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
      message.error(e.message);
    }
  };
  //获取所有明细并筛选同步状态
  getDetails = async (st, ed) => {
    this.setState({ loading: true });
    let stDate = this.state.stDate;
    let edDate = this.state.edDate;
    if (st) {
      stDate = st;
    }
    if (ed) {
      edDate = ed;
    }
    //明细
    // let res = await http({ baseURL: this.baseURL }).getTable({
    //   resid: 691681288938,
    //   cmswhere: `TheDatetime >= '${stDate}' and TheDatetime <= '${edDate}' and `
    // });
    // let n = 0;
    // let arr = [];
    // while (n < res.data.length) {
    //   let c = 0;
    //   let bol = false;
    //   while (c < arr.length) {
    //     if (res.data[n].ID == arr[c]) {
    //       bol = true;
    //     }
    //     c++;
    //   }
    //   if (!bol) {
    //     arr.push(res.data[c].ID);
    //   }
    //   n++;
    // }
    //操作记录
    let res2 = await http({ baseURL: this.baseURL }).getTable({
      resid: 692357214309,
      cmswhere: `C3_498047440296 = 'Y' and C3_498756365442 >= '${stDate}' and C3_498756365442 <= '${edDate}' `
    });
    let cms = `ID = ''`;
    let all = [];
    let un = [];
    let done = [];
    let n = 0;
    while (n < res2.data.length) {
      if (res2.data[n].C3_691167014001) {
        if (cms == `ID = ''`) {
          cms = `ID = '${res2.data[n].C3_691167014001}' `;
        } else {
          cms = cms + `or ID = '${res2.data[n].C3_691167014001}'`;
        }
      }

      n++;
    }
    console.log(cms);
    let res = await http({ baseURL: this.baseURL }).getTable({
      resid: 691681288938,
      cmswhere: cms
    });
    n = 0;
    while (n < res2.data.length) {
      let c = 0;
      let bol = false;
      all.push(res2.data[n]);

      while (c < res.data.length) {
        if (res2.data[n].C3_691167014001 == res.data[c].ID) {
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
    console.log('obj', all, un, done);

    this.setState({
      orgDetails: obj,
      detailData: obj[this.state.filterSync],
      loading: false
    });
  };
  //筛选同步状态
  handleChangeFilter = async v => {
    this.setState({ filterSync: v, detailData: this.state.orgDetails[v] });
    console.log(this.state.orgDetails[v]);
  };
  defaultPagination = {
    pageSize: 10,
    current: 1,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '30', '40', '100','500']
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
                    style={{
                      width: 'calc(100% - 1rem - 224px)',
                      textIndent: '.5rem'
                    }}
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
                  <Button
                    style={{ width: '72px', marginLeft: '.5rem' }}
                    onClick={()=>{
                      this.beforeExport(691171742184)
                    }}
                  >
                    导出
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
                          <span>{item.count}</span>
                          <span>{item.group}</span>
                          <span>{item.time}</span>
                        </span>
                        <span
                          style={{ color: '#1890ff', width: '80px' }}
                          onClick={() => {
                            this.setState({
                              currentRight: item,
                              cms: `组编号 = ${item.groupId} and 时间段编号 = ${item.timeId}`,
                              showModal: true
                            });
                          }}
                        >
                          查看详情
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="r">
                <TableData
                  baseURL={this.baseURL}
                  resid="691171872439"
                  cmswhere={this.state.cms}
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  refTargetComponentName="TableData"
                  defaultPagination={this.defaultPagination}
                  subtractH={180}
                  hasAdd={false}
                  hasRowView={false}
                  hasRowDelete={false}
                  hasDownload={false}
                  hasRowEdit={false}
                  hasDelete={false}
                  hasModify={false}
                  hasRowModify={false}
                  hasRowSelection={false}
                  hasAdvSearch={false}
                  actionBarExtra={({
                    dataSource,
                    selectedRowKeys
                  }) => {
                    return (
                      <Button
                      onClick={()=>{
                        this.beforeExport(691171872439,this.state.cms)
                      }}
                      >
                        导出
                      </Button>
                    );
                  }}
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
                        subStatus: 0,
                        checkedAll: false,
                        detailData: []
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
                      value={
                        this.state.stDate && this.state.edDate
                          ? [
                              moment(this.state.stDate, dateFormat),
                              moment(this.state.edDate, dateFormat)
                            ]
                          : [null, null]
                      }
                      onChange={(dates, dateString) => {
                        this.setState({
                          stDate: dateString[0],
                          edDate: dateString[1]
                        });
                        this.getDetails(dateString[0], dateString[1]);
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
                    <Button
                      style={{ width: '104px', marginLeft: '.5rem' }}
                      size={'small'}
                      onClick={() => {
                        this.handleSync('all');
                      }}
                    >
                      全部同步记录
                    </Button>
                    <Button
                      style={{ width: '120px', marginLeft: '.5rem' }}
                      size={'small'}
                      onClick={() => {
                        this.handleSync();
                      }}
                    >
                      同步选中的记录
                    </Button>
                  </>
                )}
              </div>
              <div className="outer">
                <TableData
                  downloadBaseURL={this.downloadURL}
                  baseURL={this.baseURL}
                  style={this.state.subStatus == '0' ? {} : { display: 'none' }}
                  resid="692357214309"
                  cmswhere={this.state.importCms}
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  refTargetComponentName="TableData"
                  subtractH={180}
                  hasAdd={true}
                  defaultPagination={this.defaultPagination}
                  hasRowView={false}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasDelete={true}
                  hasModify={false}
                  hasRowModify={true}
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
                    return (
                      <Button
                        type="primary"
                        size={size}
                        loading={this.state.loading}
                        onClick={() => {
                          if (!selectedRecords.length) {
                            return message.info('请选择记录');
                          }
                          this.handleSub([...selectedRecords]);
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
                        {this.state.columns.map((item, k) => {
                          return (
                            <th>
                              {k == 0 ? (
                                <Checkbox
                                  checked={this.state.checkedAll}
                                  onChange={v => {
                                    this.checkeAll(v.target.checked);
                                  }}
                                ></Checkbox>
                              ) : (
                                item.title
                              )}
                            </th>
                          );
                        })}
                      </tr>
                      {this.state.detailData.map((item, key) => {
                        return (
                          <tr>
                            <td>
                              <Checkbox
                                checked={item.checked}
                                onChange={v => {
                                  this.handleChecked(v.target.checked, key);
                                }}
                              ></Checkbox>
                            </td>
                            {this.state.columns.map((item2, key2) => {
                              return key2 == 0 ? null : (
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
