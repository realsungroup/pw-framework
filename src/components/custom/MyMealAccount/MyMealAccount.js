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
import './MyMealAccount.less';
import moment from 'moment';
const { Option } = Select;

/**
 * 我的就餐账户
 */
export default class MyMealAccount extends Component {
  constructor(props) {
    super(props);
    this.baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadBaseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  state = {
    loading: false,
    visible: 0,
    data: {
      numberId: '',
      accountPrechargeDelta: '',
      accountPerkDelta: '',
      accountLMDelta: '',
      accountTMADelta: '',
      dealNumber: ''
    }
  };
  componentDidMount() {
  }
  onHandleSub = async () => {
    this.setState({ loading: true });
    let data = this.state.data;
    data.dealNumber = 6;
    try {
      let res = await http({ baseURL: this.baseURL }).addRecords({
        resid: 756315079798,
        data: [data]
      });
      this.setState({
        loading: false, visible: 0, data: {
          numberId: '',
          accountPrechargeDelta: '',
          accountPerkDelta: '',
          accountLMDelta: '',
          accountTMADelta: '',
          dealNumber: ''
        }
      });
      message.success('成功');
      this.tableDataRef.handleRefresh();

    } catch (e) {
      message.error(e.message);
      this.setState({ loading: false })
    }
  }
  onHandleRebirth = async () => {
    this.setState({ loading: true });
    let data = this.state.data;
    try {
      let res0 = await http({ baseURL: this.baseURL }).getTable({
        resid: 756313347112,
        cmswhere: `numberId = '${data.numberId}'`
      });
      if (res0.data.length > 0) {
        if (res0.data[0].rebirth === 'Y') {
          message.error('该员工当月已经恢复过期余额，不可重复操作！');
          this.setState({ loading: false });
        } else if (res0.data[0].odValue <= 0) {
          message.error('该员工当月没有过期余额');
          this.setState({ loading: false });
        } else {
          data.odValue = res0.data[0].odValue;
          data.dealNumber = 1;
          let res = await http({ baseURL: this.baseURL }).addRecords({
            resid: 756315079798,
            data: [data]
          });
          this.setState({
            loading: false, visible: 0, data: {
              numberId: '',
              accountPrechargeDelta: '',
              accountPerkDelta: '',
              accountLMDelta: '',
              accountTMADelta: '',
              dealNumber: ''
            }
          });
          message.success('成功');
          this.tableDataRef.handleRefresh();
        }
      } else {
        message.error('没有该员工的记录！');
        this.setState({ loading: false });
      }
    } catch (e) {
      message.error(e.message);
      this.setState({ loading: false })
    }
  }
  render() {
    return (
      <div className='myMealAccount'>
        <Tabs defaultActiveKey="1" size="small">
          <Tabs.TabPane tab="当前账户余额" key="1">
            <div className="myMealAccount_table-data-wrap">
              <TableData
                resid={this.props.accountId}
                baseURL={this.baseURL}
                downloadBaseURL={this.downloadBaseURL}
                hasRowView={true}
                hasAdd={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                hasDelete={false}
                subtractH={175}
              />
            </div >
          </Tabs.TabPane>
          <Tabs.TabPane tab="电子餐券领用记录" key="2">
            <div className="myMealAccount_table-data-wrap">
              <TableData
                resid={this.props.drawId}
                baseURL={this.baseURL}
                downloadBaseURL={this.downloadBaseURL}
                hasRowView={true}
                hasAdd={false}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                hasDelete={false}
                subtractH={175}
              />
            </div >
          </Tabs.TabPane>
          <Tabs.TabPane tab="账户余额变动记录" key="3">
            <div className="myMealAccount_table-data-wrap">
              <TableData
                resid={this.props.accountChangeId}
                baseURL={this.baseURL}
                downloadBaseURL={this.downloadBaseURL}
                hasRowView={true}
                hasAdd={false}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                hasDelete={false}
                hasImport={true}
                subtractH={175}
                refTargetComponentName="TableData"
                wrappedComponentRef={element => (this.tableDataRef = element)}
                actionBarExtra={({ dataSource, selectedRowKeys }) => {
                  return (
                    this.props.showModi ? <>
                      <Button
                        loading={this.state.loading}
                        onClick={() => {
                          this.setState({ visible: 1 });
                        }}
                      >
                        补差
                      </Button>
                      <Button
                        loading={this.state.loading}
                        onClick={() => {
                          this.setState({ visible: 2 });
                        }}
                      >
                        恢复过期余额
                      </Button>
                    </> : null
                  );
                }}
              />
              <Modal
                visible={this.state.visible === 1}
                width={'80vw'}
                title={'补差'}
                onCancel={() => {
                  this.setState({
                    loading: false, visible: 0, data: {
                      numberId: '',
                      accountPrechargeDelta: '',
                      accountPerkDelta: '',
                      accountLMDelta: '',
                      accountTMADelta: '',
                      dealNumber: ''
                    }
                  });
                }}
                footer={null}
              >
                <div className={'myMealAccount_modal'} style={{ height: '70vh' }}>
                  <div>
                    <span>员工工号：</span>
                    <Input
                      type={'number'}
                      onChange={v => {
                        let a = this.state.data;
                        a.numberId = v.target.value;
                        this.setState({
                          data: a
                        });
                      }}
                      value={this.state.data.numberId}
                      style={{ width: '160px' }}
                    />
                  </div>
                  <div>
                    <span>预充值账户余额交易额：</span>
                    <Input
                      type={'number'}
                      onChange={v => {
                        let a = this.state.data;
                        a.accountPrechargeDelta = v.target.value;
                        this.setState({
                          data: a
                        });
                      }}
                      value={this.state.data.accountPrechargeDelta}
                      style={{ width: '160px' }}
                    />
                  </div>
                  <div>
                    <span>补贴账户余额交易额：</span>
                    <Input
                      type={'number'}
                      onChange={v => {
                        let a = this.state.data;
                        a.accountPerkDelta = v.target.value;
                        this.setState({
                          data: a
                        });
                      }}
                      value={this.state.data.accountPerkDelta}
                      style={{ width: '160px' }}
                    />
                  </div>
                  <div>
                    <span>上月余额交易额：</span>
                    <Input
                      type={'number'}
                      onChange={v => {
                        let a = this.state.data;
                        a.accountLMDelta = v.target.value;
                        this.setState({
                          data: a
                        });
                      }}
                      value={this.state.data.accountLMDelta}
                      style={{ width: '160px' }}
                    />
                  </div>
                  <div>
                    <span>上上月余额交易额：</span>
                    <Input
                      type={'number'}
                      onChange={v => {
                        let a = this.state.data;
                        a.accountTMADelta = v.target.value;
                        this.setState({
                          data: a
                        });
                      }}
                      value={this.state.data.accountTMADelta}
                      style={{ width: '160px' }}
                    />
                  </div>
                  <Button type='primary' loading={this.state.loading} onClick={() => { this.onHandleSub(); }}>提交</Button>
                </div>
              </Modal>
              <Modal
                visible={this.state.visible === 2}
                width={'80vw'}
                title={'恢复过期余额'}
                onCancel={() => {
                  this.setState({
                    loading: false, visible: 0, data: {
                      numberId: '',
                      accountPrechargeDelta: '',
                      accountPerkDelta: '',
                      accountLMDelta: '',
                      accountTMADelta: '',
                      dealNumber: ''
                    }
                  });
                }}
                footer={null}
              >
                <div className={'myMealAccount_modal'} style={{ height: '70vh' }}>
                  <div>
                    <span>员工工号：</span>
                    <Input
                      type={'number'}
                      onChange={v => {
                        let a = this.state.data;
                        a.numberId = v.target.value;
                        this.setState({
                          data: a
                        });
                      }}
                      value={this.state.data.numberId}
                      style={{ width: '160px' }}
                    />
                  </div>
                  <Button type='primary' loading={this.state.loading} onClick={() => { this.onHandleRebirth(); }}>提交</Button>
                </div>
              </Modal>
            </div >
          </Tabs.TabPane>
          <Tabs.TabPane tab="就餐预充值记录" key="4">
            <div className="myMealAccount_table-data-wrap">
              <TableData
                resid={this.props.rechargeId}
                baseURL={this.baseURL}
                downloadBaseURL={this.downloadBaseURL}
                hasRowView={true}
                hasAdd={false}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                hasDelete={false}
                subtractH={175}
              />
            </div >
          </Tabs.TabPane>
          <Tabs.TabPane tab="系统补贴记录" key="5">
            <div className="myMealAccount_table-data-wrap">
              <TableData
                resid={this.props.dealId}
                baseURL={this.baseURL}
                downloadBaseURL={this.downloadBaseURL}
                hasRowView={true}
                hasAdd={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                hasDelete={false}
                subtractH={175}
              />
            </div >
          </Tabs.TabPane>

        </Tabs>

      </div>

    );
  }
}
