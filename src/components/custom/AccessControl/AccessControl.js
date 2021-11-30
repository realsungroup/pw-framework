import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, Input, Modal, Spin, Tabs, Popconfirm } from 'antd';
import './AccessControl.less';
import http from '../../../util20/api';
const { TabPane } = Tabs;
class AccessControl extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
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
    cms: ``
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
  //添加门
  addRec = async () => {
    let obj = {
      组编号: this.state.currentRight.groupId,
      组名称: this.state.currentRight.group,
      时间段名称: this.state.currentRight.timeId,
      时间段编号: this.state.currentRight.time,
      门编号: this.state.doorId,
      门名称: this.state.doorName
    };
  };
  //修改门
  modiRec = async () => {};
  //删除门
  delRec = async recid => {};
  render() {
    const { showModal, showModalInput } = this.state;
    return (
      <div className="ac">
        <Tabs>
          <TabPane tab={'权限查阅'} key={0}>
            <Spin spinning={this.state.loading}>
              <Modal
                visible={showModalInput}
                title={'请输入门的信息'}
                width={320}
                onCancel={() => {
                  this.setState({
                    showModalInput: false,
                    curecid: '',
                    doorName: ''
                  });
                }}
                onOk={() => {
                  if (this.state.curecid) {
                    this.addRec();
                  } else {
                    this.modiRec();
                  }
                }}
                destroyOnClose
              >
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <span>门编号：</span>
                    <Input
                      value={this.state.doorId}
                      style={{ width: 200 }}
                      onChange={v => {
                        this.setState({ doorId: v.target.value });
                      }}
                    />
                  </div>
                  <div>
                    <span>门名称：</span>
                    <Input
                      value={this.state.doorName}
                      style={{ width: 200 }}
                      onChange={v => {
                        this.setState({ doorName: v.target.value });
                      }}
                    />
                  </div>
                </div>
              </Modal>
              <Modal
                visible={showModal}
                title={'涉及的门'}
                width={800}
                footer={null}
                onCancel={() => {
                  this.setState({ showModal: false });
                }}
                destroyOnClose
              >
                <div>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.setState({
                        showModalInput: true,
                        doorName: '',
                        curecid: ''
                      });
                    }}
                  >
                    添加
                  </Button>
                  <ul className="doors">
                    {this.state.currentRight.door.map(item => {
                      return (
                        <li>
                          <span>{item.name}</span>
                          <Popconfirm
                            title="确认进行结算吗？"
                            onConfirm={this.delRec(item.REC_ID)}
                          >
                            <Button type="danger">删除</Button>
                          </Popconfirm>
                          <Button
                            onClick={() => {
                              this.setState({
                                showModalInput: true,
                                doorName: item.name,
                                curecid: item.REC_ID
                              });
                            }}
                          >
                            修改
                          </Button>
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
                          查看涉及的门
                        </Button>
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
                  wrappedComponentRef={element =>
                    (this.addModalTableDataRef = element)
                  }
                  refTargetComponentName="TableData"
                  subtractH={180}
                  hasAdd={true}
                  hasRowView={false}
                  hasRowDelete={true}
                  hasRowEdit={false}
                  hasDelete={true}
                  hasModify={false}
                  hasRowModify={true}
                  hasRowSelection={true}
                  hasAdvSearch={false}
                  actionBarWidth={160}
                />
              </div>
            </Spin>
          </TabPane>
          <TabPane tab={'权限导入'} key={1}></TabPane>
        </Tabs>
      </div>
    );
  }
}

export default AccessControl;
