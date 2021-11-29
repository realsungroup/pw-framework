import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, Input, message, Modal, Icon, Table, Spin, Tabs } from 'antd';
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
    rightList: [],
    currentRight: {
      name: '',
      time: '',
      recid: '',
      door: []
    }
  };

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

  dataPro = arr => {
    console.log('arr', arr);
    this.setState({ loading: false });
    let n = 0;
    let a = [];
    while (n < arr.length) {
      if (a == 0) {
        a.push({
          groupId: arr[n].组编号,
          group: arr[n].组名称,
          door: [arr[n].门名称],
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
            d.push(arr[n].门名称);
            a[c].door = d;
          }
          c++;
        }
        if (!bol) {
          a.push({
            groupId: arr[n].组编号,
            door: [arr[n].门名称],
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
    this.setState({ originList: a, rightList: a, currentRight: a[0] });
    console.log('a', a);
  };

  render() {
    const { showModal } = this.state;
    return (
      <div className="ac">
        <Tabs>
          <TabPane tab={'权限查阅'} key={0}>
            <Spin spinning={this.state.loading}>
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
                <ul>
                  {this.state.currentRight.door.map(item => {
                    return <li>{item}</li>;
                  })}
                </ul>
              </Modal>
              <div className="l">
                <div className="search">
                  <Input style={{ width: 'calc(100% - 1rem - 144px)' }} />
                  <Button
                    style={{ width: '72px', marginLeft: '.5rem' }}
                    type={'primary'}
                  >
                    搜索
                  </Button>
                  <Button style={{ width: '72px', marginLeft: '.5rem' }}>
                    重置
                  </Button>
                </div>
                <ul>
                  {this.state.rightList.map(item => {
                    return (
                      <li
                        key={item.id}
                        onClick={() => {
                          this.setState({ currentRight: item });
                        }}
                        className={
                          this.state.currentRight.id == item.id ? 'current' : ''
                        }
                      >
                        <span>
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
                  wrappedComponentRef={element =>
                    (this.addModalTableDataRef = element)
                  }
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
                  importConfig={null}
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
