import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, Input, Modal, Spin, Tabs, Select, message } from 'antd';
import './AccessControl.less';
import http from '../../../util20/api';
const { Option } = Select;
const { TabPane } = Tabs;
class AccessControl extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  componentDidMount() {
    this.getAllDoors();
  }
  state = {
    kw: '',
    rightList: [],
    currentRight: {
      group: '',
      time: '',
      recid: '',
      door: [{ name: '', recid: '' }]
    },
    cms: ``,
    importCms: `isnull(C3_498047440296,'') = ''`
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
    this.setState({ loading: false });
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
  render() {
    const { showModal, showModalInput } = this.state;
    return (
      <div className="ac">
        <Tabs>
          <TabPane tab={'权限查阅'} key={0}>
            <Spin spinning={this.state.loading}>
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
            </Spin>
          </TabPane>
          <TabPane tab={'权限导入'} key={1}>
            <div className="rightFilters">
              <ul>
                <li
                  className={
                    this.state.importCms == `isnull(C3_498047440296,'') = ''`
                      ? 'current'
                      : ''
                  }
                  onClick={() => {
                    this.setState({
                      importCms: `isnull(C3_498047440296,'') = ''`
                    });
                  }}
                >
                  未提交
                </li>
                <li
                  className={
                    this.state.importCms == `isnull(C3_498047440296,'') = ''`
                      ? ''
                      : 'current'
                  }
                  onClick={() => {
                    this.setState({ importCms: `C3_498047440296 = 'Y'` });
                  }}
                >
                  已提交
                </li>
              </ul>
              {this.state.importCms ==
              `isnull(C3_498047440296,'') = ''` ? null : (
                <Select
                  style={{ width: 120, left: 16 }}
                  size="small"
                  onChange={v => {
                    this.setState({ importCms: v });
                  }}
                  value={this.state.importCms}
                >
                  <Select.Option value={`C3_498047440296 = 'Y'`}>
                    全部
                  </Select.Option>
                  <Select.Option
                    value={`C3_498047440296 = 'Y' and isnull(C3_498216153456,'') = '' and isnull(C3_498753689730,'') = ''`}
                  >
                    未同步
                  </Select.Option>
                  <Select.Option
                    value={`C3_498216153456 = 'Y' or C3_498753689730 = 'Y'`}
                  >
                    已同步
                  </Select.Option>
                  <Select.Option value={`C3_691167886415 != ''`}>
                    同步失败
                  </Select.Option>
                </Select>
              )}
            </div>
            <div className="outer">
              <TableData
                downloadBaseURL={this.downloadURL}
                baseURL={this.baseURL}
                down
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
                  return (
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
                      同步
                    </Button>
                  );
                }}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default AccessControl;
