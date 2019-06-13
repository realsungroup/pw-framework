import React from 'react';
import { TableData } from '../../common/loadableCommon';
import {
  Button,
  Popconfirm,
  message,
  Spin,
  Tabs,
  Steps,
  List,
  Radio,
  Card,
  Icon
} from 'antd';
import http from 'Util20/api';
import { Link } from 'react-router-dom';
import { getItem } from 'Util20/util';
import FJList from '../FJList';
import './FiscalYearPlan.less';

const TabPane = Tabs.TabPane;
const { Step } = Steps;
/**
 * 财年计划
 */
class FiscalYearPlan extends React.Component {
  state = {
    loading: false,
    current: 0,
    plans: [],
    selectedPlan: {}
  };
  async componentDidMount() {
    let createableGroups = this.props.CreateableGroups; //可创建财年计划id组
    let userinfo = JSON.parse(getItem('userInfo')).UserInfo;
    let grouplist = userinfo.GroupList.replace('(', '')
      .replace(')', '')
      .replace(/'/g, '');
    let listArr = grouplist.split(', ');
    let tag = false;
    //判断当前用户是否可以创建财年计划
    createableGroups.forEach(element => {
      if (listArr.includes(element)) {
        tag = true;
      }
    });
    if (tag) {
      let res;
      try {
        res = await http().addRecords({
          resid: '609615842690', // 表资源 id
          data: [{ C3_609616006519: 'WX' }, { C3_609616006519: 'SHG' }], // 要添加的记录；如 [{ name: '1', age: 18 }, { name: '2', age: 19 }]
          isEditOrAdd: true // 添加记录的状态是否为 'editoradd'；默认为 false，即状态为 'added'
        });
      } catch (error) {}
    }
    let res;
    try {
      res = await http().getTable({
        resid: '609883172764',
        cmswhere: `C3_609615909659 = '${userinfo.EMP_USERCODE}'`
      });
      let plans = res.data;
      plans[0].check = true;
      let selectedPlan = plans[0];
      this.setState({ plans, selectedPlan });
    } catch (error) {}
  }

  handleConfirm = async (dataSource, selectedRowKeys) => {
    if (!selectedRowKeys.length) {
      return message.error('请选择记录');
    }
    const { resid } = this.props;
    this.setState({ loading: true });
    const data = selectedRowKeys.map(recid => ({
      REC_ID: recid,
      C3_605619907534: 'Y'
    }));

    let res;
    try {
      res = await http().modifyRecords({
        resid,
        data
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
    message.success('操作成功');
    this.tableDataRef.handleRefresh();
  };

  renderActionBarExtra = ({ dataSource, selectedRowKeys }) => {
    return (
      <Popconfirm
        title="您确定要操作吗？"
        onConfirm={() => this.handleConfirm(dataSource, selectedRowKeys)}
      >
        <Button>确认</Button>
      </Popconfirm>
    );
  };
  onChange = current => {
    console.log('onChange:', current);
    this.setState({ current });
  };
  onPlanClick = index => {
    let { plans } = this.state;
    plans.forEach(item => {
      item.check = false;
    });
    plans[index].check = true;
    let selectedPlan = plans[index];
    this.setState({ plans, selectedPlan });
  };
  render() {
    const { loading, current } = this.state;
    let page;
    switch (current) {
      case 0:
        page = (
          <List
            size="large"
            bordered
            loading={this.state.loading}
            dataSource={this.state.plans}
            style={{ width: '80%', margin: '0 auto' }}
            header={
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => {
                    this.setState({ current: 1 });
                  }}
                >
                  下一步
                </Button>
              </div>
            }
            renderItem={(item, i) => {
              let branchCompany = item === 'WX' ? '无锡' : '上海';
              return (
                <List.Item
                  style={{ cursor: 'pointer' }}
                  onClick={this.onPlanClick.bind(this, i)}
                >
                  <Card
                    title={branchCompany}
                    style={{ width: '100%' }}
                    bordered
                    extra={<Radio checked={item.check} />}
                  >
                    <div className="plan_infos">
                      <div className="plan_infos_wrapper">
                        <span className="plan_infos_item">
                          编号:{item.C3_609616660273}
                        </span>
                        <span className="plan_infos_item">
                          财年: {item.C3_609615869581}
                        </span>
                        <span className="plan_infos_item">制定者</span>
                        <span className="plan_infos_item">下属人数</span>
                        <span className="plan_infos_item"> 部门</span>
                      </div>
                      <div className="plan_infos_wrapper">
                        <span className="plan_infos_item">预算</span>
                        <span className="plan_infos_item">人均预算</span>
                        <span className="plan_infos_item">实际费用</span>
                        <span className="plan_infos_item">是否提交：</span>
                        <span className="plan_infos_item">状态</span>
                      </div>
                      <div className="plan_infos_wrapper">
                        <span className="plan_infos_item">一级部门：</span>
                        <span className="plan_infos_item">一级部门经理：</span>
                        <span className="plan_infos_item">HR</span>
                      </div>
                    </div>
                  </Card>
                  {/* <div
                    style={{
                      display: 'flex',
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', flex: 1 }}>
                      <Radio checked={item.check} />
                    </div>
                    <div>
                      {item.C3_609616006519}
                    </div>
                  </div> */}
                </List.Item>
              );
            }}
          />
        );
        break;
      case 1:
        page = <FJList />;
        break;
      case 2:
        page = <FJList />;
        break;
      case 3:
        page = <FJList />;
        break;
      default:
        break;
    }
    return (
      <Spin spinning={loading}>
        <Steps
          current={current}
          onChange={this.onChange}
          style={{ width: '80%', margin: '0 auto', padding: 10 }}
        >
          <Step
            title="未提交计划"
            description=""
            style={{ cursor: 'pointer' }}
            onClick={() => {
              this.setState({ current: 0 });
            }}
          />
          <Step
            title="制定计划"
            description=""
            onClick={() => {
              this.setState({ current: 1 });
            }}
            style={{ cursor: 'pointer' }}
          />
          <Step
            title="确认计划"
            description=""
            onClick={() => {
              this.setState({ current: 2 });
            }}
            style={{ cursor: 'pointer' }}
          />
          <Step
            title="已提交计划"
            description=""
            onClick={() => {
              this.setState({ current: 3 });
            }}
            style={{ cursor: 'pointer' }}
          />
        </Steps>
        {page}
        {/* <div style={{ height: '100vh' }}>
          <Tabs
            defaultActiveKey="1"
            style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
          >
            <TabPane
              tab="待提交"
              key="1"
              style={{ width: '100%', height: 'calc(100vh - 64px)' }}
            >
              <TableData
                resid={609883172764}
                actionBarWidth={450}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
                      <Link
                        to={{
                          pathname: '/fnmodule',
                          search: `?resid=财年培训课表管理&recid=610555815210&type=前端功能入口&title=财年计划管理&planid=${
                            record.C3_609616660273
                          }`
                        }}
                        target="_self"
                      >
                        <Button size={btnSize}>制定计划</Button>
                      </Link>
                    );
                  }
                ]}
                subTableArrProps={[
                  {
                    subTableName: '审批记录',
                    subResid: 611144001666,
                    tableProps: {
                      hasAdd: false,
                      hasModify: false,
                      hasRowDelete: false,
                      hasRowModify: false,
                      hasDelete: false,
                      subtractH: 190,
                      height: 500,
                      hasRowView: false
                    }
                  },
                  {
                    subTableName: '计划详情',
                    subResid: 611315248461,
                    tableProps: {
                      hasAdd: false,
                      hasModify: false,
                      hasRowDelete: false,
                      hasRowModify: false,
                      hasDelete: false,
                      subtractH: 190,
                      height: 500,
                      hasRowView: false
                    }
                  }
                ]}
                hasBeBtns={true}
                hasRowView={false}
                hasAdd={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
              />
            </TabPane>
            <TabPane
              tab="已提交"
              key="2"
              style={{ width: '100%', height: 'calc(100vh - 64px)' }}
            >
              <TableData
                resid={611165813996}
                hasBeBtns={true}
                hasAdd={false}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                subTableArrProps={[
                  {
                    subTableName: '审批记录',
                    subResid: 611144001666,
                    tableProps: {
                      hasAdd: false,
                      hasModify: false,
                      hasRowDelete: false,
                      hasRowModify: false,
                      hasDelete: false,
                      subtractH: 190,
                      height: 500,
                      hasRowView: false
                    }
                  },
                  {
                    subTableName: '计划详情',
                    subResid: 611315248461,
                    tableProps: {
                      hasAdd: false,
                      hasModify: false,
                      hasRowDelete: false,
                      hasRowModify: false,
                      hasDelete: false,
                      subtractH: 190,
                      height: 500,
                      hasRowView: false
                    }
                  }
                ]}
              />
            </TabPane>
          </Tabs>
        </div>
       */}
      </Spin>
    );
  }
}

export default FiscalYearPlan;
