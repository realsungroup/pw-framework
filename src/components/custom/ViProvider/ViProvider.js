import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Tabs,
  Button,
  Modal,
  Form,
  Select,
  Input,
  DatePicker,
  message
} from 'antd';
import http from '../../../util20/api';
import './ViProvider.less';
// import TableData from '../../../lib/unit-component/TableData';
import { TableData } from '../../common/loadableCommon';
import DeliverList from './DeliverList';
import {
  inApplication,
  inExaminationAndApproval,
  approved,
  refused,
  history
} from './config';
import moment from 'moment';

const TabPane = Tabs.TabPane;
const { Option } = Select;

/**
 * 访客申请
 */
export default class ViProvider extends React.Component {
  static propTypes = {
    /**
     * 标签页配置
     */
    tabs: PropTypes.array
    // tabs = [
    //   {
    //     resid: 111,
    //     subTableArrProps: {
    //       // ..
    //     }
    //   }
    // ]
  };

  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      abnormalNum: 0,
      activeKey: '审批中',
      showDeliverModal: false,
      deliverList: [],
      showDeliverPeopleListModal: false,
      C3_605719340594: '',
      C3_605719340781: '',
      C3_605718146773: '',
      C3_605718133807: '送货人员'
    };
    this.abnormalRef = React.createRef();
    this.inApplicationRef = React.createRef();
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {};

  handleTabsChange = activeKey => {
    this.setState({ activeKey });
  };

  getBuilderList = msg => {
    this.setState({
      deliverList: msg,
      showDeliverPeopleListModal: false
    });
  };

  openDeliverPeopleListModal = () => {
    this.setState({
      showDeliverPeopleListModal: true
    });
  };

  reApply = async record => {
    console.log('当前记录', record);
    // 根据当前记录，找到与之对应的访客信息。
    let res;
    try {
      res = await http().getTable({
        resid: 605719206028,
        cmswhere: `C3_606218777003=${record.C3_605993242597}`
      });
    } catch (err) {
      console.error(err.message);
      return err.message;
    }
    console.log(res.data);
    // 向审批中表加数据,主子表同时加
    let res2;
    try {
      res2 = await http().saveRecordAndSubTables({
        data: [
          {
            resid: '605891699222',
            maindata: {
              C3_605718056102: record.C3_605718056102, //访客单位
              C3_605718133807: record.C3_605718133807, //访客类型
              C3_605718146773: record.C3_605718146773, //访问地区类型
              C3_605719340594: record.C3_605719340594, //有效开始日期
              C3_605719340781: record.C3_605719340781, //有效结束日期
              C3_605706988162: '',
              _state: 'added',
              _id: 1
            },
            subdata: [
              {
                resid: '605719206028',
                maindata: {
                  C3_605719242294: res.data[0].C3_605719242294, //访客姓名
                  C3_606843168661: res.data[0].C3_606843168661, //访客单位
                  C3_605719242802: res.data[0].C3_605719242802, //访客证件类型
                  C3_605719242955: res.data[0].C3_605719242955, //登记证件号
                  _state: 'added',
                  _id: 1
                }
              }
            ]
          }
        ]
      });
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
    console.log(res2);
    this.tableDataRef.handleRefresh();
    this.setState({ activeKey: '申请中' });
  };

  submit = async () => {
    let res;
    const subdataPeople = this.state.deliverList.map((item, index) => {
      item._state = 'added';
      item._id = index + 6;
      return {
        resid: '647640373205',
        maindata: item
      };
    });
    const data = [
      {
        resid: '605891699222',
        maindata: {
          C3_605719340594: this.state.C3_605719340594,
          C3_605719340781: this.state.C3_605719340781,
          C3_605718146773: this.state.C3_605718146773,
          C3_605718133807: '送货人员',
          _state: 'added',
          _id: 1
        },
        subdata: [...subdataPeople]
      }
    ];
    console.log('data', data);
    try {
      // res = await http().saveRecordAndSubTables({
      //   data
      // });
      res = await http().saveRecordAndSubTables({
        data
      });
      console.log(res);
      message.info('提交成功');
    } catch (error) {
      console.log(error);
      message.info(error);
    }
  };

  render() {
    const { activeKey, abnormalNum } = this.state;
    const { resids } = this.props;
    const initialMoment = moment();

    return (
      <div className="lz-affo">
        <Tabs
          activeKey={activeKey}
          renderTabBar={this.renderTabBar}
          onChange={this.handleTabsChange}
        >
          {/* <TabPane tab="申请中" key="申请中">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData {...inApplication} 
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData" formProps={{saveText: '提交', height: 480}} />
            </div>
          </TabPane> */}

          <TabPane tab="审批中" key="审批中">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData
                {...inExaminationAndApproval}
                addText="请添加一般或施工人员"
                actionBarExtra={({}) => {
                  return (
                    <Button
                      onClick={() => {
                        // this.getapplyInfo();
                        this.setState({ showDeliverModal: true });
                      }}
                    >
                      请添加送货人员
                    </Button>
                  );
                }}
              />
            </div>
            <Modal
              title="送货人员清单"
              width="90%"
              visible={this.state.showDeliverPeopleListModal}
              onCancel={() => {
                this.setState({
                  showDeliverPeopleListModal: false
                });
              }}
              footer={[]}
            >
              <DeliverList getBuilderList={this.getBuilderList} />
            </Modal>
            <Modal
              width="61%"
              title="添加送货人员"
              visible={this.state.showDeliverModal}
              onCancel={() => {
                this.setState({
                  showDeliverModal: false
                });
              }}
              footer={[
                <Button
                  onClick={() => {
                    this.setState({
                      showDeliverModal: false
                    });
                    this.submit();
                  }}
                >
                  提交
                </Button>
              ]}
            >
              <Form>
                <div className="changeAntCss">
                  <table border="1">
                    <tbody>
                      <tr>
                        <th colSpan="9">
                          <h3>基本信息</h3>
                        </th>
                      </tr>
                      <tr>
                        <th colSpan="2">
                          <label>
                            访客类型<font color="red">*</font>
                          </label>
                        </th>
                        <th colSpan="2">
                          <label>送货人员</label>
                        </th>
                        <th colSpan="2">
                          <label>
                            访问地区类型<font color="red">*</font>
                          </label>
                        </th>
                        <th colSpan="2">
                          <Select
                            onChange={value => {
                              this.setState({
                                C3_605718146773: value
                              });
                            }}
                            className="selectCss"
                          >
                            <Option value="管控区">管控区</Option>
                            <Option value="非管控区">非管控区</Option>
                          </Select>
                        </th>
                      </tr>
                      <tr>
                        <th colSpan="2">
                          <label>
                            有效开始时间<font color="red">*</font>
                          </label>
                        </th>
                        <th colSpan="3">
                          <DatePicker
                            onChange={date => {
                              this.setState({
                                C3_605719340594: moment(date).format('HH:mm')
                              });
                            }}
                          />
                        </th>
                        <th colSpan="2">
                          <label>
                            有效结束时间<font color="red">*</font>
                          </label>
                        </th>
                        <th colSpan="2">
                          <DatePicker
                            onChange={date => {
                              this.setState({
                                C3_605719340781: moment(date).format('HH:mm')
                              });
                            }}
                          />
                        </th>
                      </tr>

                      {/* 施工人员清单 */}
                      <tr>
                        <th colSpan="9">
                          <h3>施工人员清单</h3>
                        </th>
                      </tr>
                      <tr>
                        <th colSpan="9">
                          <Button
                            onClick={() => {
                              this.openDeliverPeopleListModal();
                            }}
                            type="primary"
                          >
                            变更人员
                          </Button>
                        </th>
                      </tr>
                      <tr>
                        <th colSpan="2" className="thCss">
                          <label>单位</label>
                        </th>
                        <th className="thCss">
                          <label>姓名</label>
                        </th>
                        <th colSpan="2" className="thCss">
                          <label>证件类型</label>
                        </th>
                        <th colSpan="2" className="thCss">
                          <label>证件号码</label>
                        </th>
                        <th colSpan="2" className="thCss">
                          <label>车辆号码</label>
                        </th>
                      </tr>
                      {(this.state.deliverList.length > 0
                        ? this.state.deliverList
                        : []
                      ).map((item, index) => {
                        return (
                          <tr>
                            <th colSpan="2" className="thCss">
                              <label>{item.C3_605719242129}</label>
                            </th>
                            <th className="thCss">
                              <label>{item.C3_605719242294}</label>
                            </th>
                            <th colSpan="2" className="thCss">
                              <label>{item.C3_605719242802}</label>
                            </th>
                            <th colSpan="2" className="thCss">
                              <label>{item.C3_605719242955}</label>
                            </th>
                            <th colSpan="2" className="thCss">
                              <label>{item.carNum}</label>
                            </th>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Form>
            </Modal>
          </TabPane>
          <TabPane tab="已审批" key="已审批">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData {...approved} />
            </div>
          </TabPane>
          <TabPane tab="已拒绝" key="已拒绝">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData {...refused} />
            </div>
          </TabPane>
          <TabPane tab="历史记录" key="历史记录">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData
                {...history}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
                      <Button
                        onClick={() => {
                          this.reApply(record);
                        }}
                      >
                        重新申请
                      </Button>
                    );
                  }
                ]}
              />
            </div>
          </TabPane>
        </Tabs>
        {!!abnormalNum && (
          <div className="lz-affo__abnormal-num">{abnormalNum}</div>
        )}
      </div>
    );
  }
}
