import React from 'react';
import { TableData } from '../../common/loadableCommon';
import {
  Button,
  Popconfirm,
  message,
  Spin,
  Steps,
  List,
  Radio,
  Card
} from 'antd';
import http from 'Util20/api';
import { getItem } from 'Util20/util';
import FJList from '../FJList';
import CreatePlan from '../CreatePlan';
import './FiscalYearPlan.less';
import DefinePlan from '../FiscalYearPlan/DefinePlan';

const { Step } = Steps;
/**
 * 财年计划
 */
class FiscalYearPlan extends React.Component {
  state = {
    loading: false,
    current: 0,
    plans: [],
    selectedPlan: null,
    currentResid: 0,
    selectModel: 'single'
  };
  async componentDidMount() {
    this.setState({loading:true})
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
        resid: '609883172764' //财年计划主表
        //cmswhere: `C3_609615909659 = '${userinfo.EMP_USERCODE}'`
      });
      let plans = res.data;
      plans[0].check = true;
      let selectedPlan = plans[0];
      this.setState({ plans, selectedPlan });
    } catch (error) {
      message.error(error.message)
     }
    this.setState({loading:false})
  }
  handleGetSelectedPlan = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: '609883172764',
        cmswhere: `REC_ID='${this.state.selectedPlan.REC_ID}'`
      });
    } catch (error) {
      return console.log(error);
    }
    if (res.error == 0) {
      this.setState({
        selectedPlan: res.data[0]
      })
    } else {
      return console.log(res.message);
    }
  }
  onChange = current => {
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
  applyPlan = () => {
    console.log(this.state.selectedPlan);
    let resid = 609883172764;
    let data = [
      {
        REC_ID: this.state.selectedPlan.REC_ID,
        C3_609874867626: 'Y'
      }
    ];
    const newPlans = this.state.plans.filter(e => {
      if (e.REC_ID != this.state.selectedPlan.REC_ID) {
        return e;
      }
    });
    http()
      .modifyRecords({
        resid,
        data
      })
      .then(res => {
        if (res.Error === 0) {
          message.success('提交成功');
          this.setState({
            current: 3,
            plans: newPlans,
            selectedPlan: null
          });
        } else {
          message.error(res.message);
        }
      });
  };

  refreshSelectedPlan = async () => {
    if (!this.state.selectedPlan) {
      return;
    }
    this.setState({loading:true})
    let res,
      REC_ID = this.state.selectedPlan.REC_ID;
    
    try {
      res = await http().getTable({
        resid: '609883172764', //财年计划主表
        cmswhere: `REC_ID = '${REC_ID}'`
      });
      let plan = res.data[0];
      plan.check =true;
      let plans = [...this.state.plans];
      let index = plans.findIndex(item => {
        return item.check;
      });
      plans[index] = plan;
      this.setState({ plans, selectedPlan: plan });
    } catch (error) {
      message.error(error.message)
    }
    this.setState({loading:false})
  };
  render() {
    const { loading, current, selectedPlan } = this.state;
    let page;
    switch (current) {
      case 0:
        page = (
          <List
            size="large"
            bordered
            dataSource={this.state.plans}
            style={{
              width: '100%',
              margin: '0 auto',
              backgroundColor: 'white'
            }}
            header={
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => {
                    if (this.state.selectedPlan) {
                      this.setState({ current: 1 });
                    } else {
                      message.error('未选择财年计划，请先选择财年计划！');
                    }
                  }}
                >
                  下一步
                </Button>
              </div>
            }
            renderItem={(item, i) => {
              let branchCompany =
                item.C3_609616006519 === 'WX' ? '无锡' : '上海';
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
                      {/* <div className="plan_infos_item">编号:{item.C3_609616660273}</div> */}
                      <div className="plan_infos_item">
                        财年: {item.C3_609615869581}
                      </div>
                      <div className="plan_infos_item">
                        制定者：{item.C3_609615939753}
                      </div>
                      <div className="plan_infos_item">
                        下属人数：{item.C3_609615996253}
                      </div>
                      <div className="plan_infos_item">
                        {' '}
                        部门：{item.C3_609616487709}
                      </div>
                      <div className="plan_infos_item">
                        总预算：{item.C3_609616030566}
                      </div>
                      <div className="plan_infos_item">
                        人均预算：{item.C3_611074040082}
                      </div>
                      <div className="plan_infos_item">
                        实际费用：{item.C3_609616051191}
                      </div>
                      {/* <div className="plan_infos_item">
                        是否提交：{item.C3_609874867626}
                      </div> */}
                      {/* <div className="plan_infos_item">
                        状态：{item.C3_609874879829}
                      </div> */}
                      {/* <div className="plan_infos_item">一级部门编号：{item.C3_609874956063}</div> */}
                      <div className="plan_infos_item">
                        一级部门经理：{item.C3_609874982844}
                      </div>
                      <div className="plan_infos_item">
                        HR：{item.C3_609874947298}
                      </div>
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        );
        break;
      case 1:
        page = (
          <div>
            <div
              style={{
                display: 'flex',
                backgroundColor: 'white',
                padding: 5,
                borderBottom: '1px solid #dddddd'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'flex-start'
                }}
              >
                <Radio.Group value={this.state.selectModel}>
                  <Radio.Button
                    value={'single'}
                    onClick={() => {
                      this.setState({ selectModel: 'single' });
                    }}
                  >
                    单人选择
                  </Radio.Button>
                  <Radio.Button
                    value={'multiple'}
                    onClick={() => {
                      this.setState({ selectModel: 'multiple' });
                    }}
                  >
                    批量选择
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'flex-end',
                  marginRight: 15,
                  marginBottom: 5
                }}
              >
                <Button
                  onClick={() => {
                    this.setState({ current: 0 }, () => {
                      this.refreshSelectedPlan();
                    });
                  }}
                  style={{ marginRight: 5 }}
                >
                  上一步
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ current: 2 });
                  }}
                >
                  下一步
                </Button>
              </div>
            </div>
            {this.state.selectModel === 'single' ? (
              <FJList
                planid={selectedPlan.C3_609616660273}
                year={selectedPlan.C3_609615869581}
                totalResid="609883172764" //财年明细-待提交
                subResid="611315248461" //财年计划明细表
                subbResid="610308370365" //课程表
                levelId="449335746776" //
                kcxlResid="610708527386" //课程系列
                kclbResid="610708543449" //课程类别
                resid="610307713776" //人员名单
              />
            ) : (
                <CreatePlan
                  planid={selectedPlan.C3_609616660273}
                  year={selectedPlan.C3_609615869581}
                  totalResid="609883172764" //财年明细-待提交
                  resid="610307713776"
                  subResid="610308370365"
                  levelId="449335746776"
                  kcbResid="611315248461"
                  kcxlResid="610708527386"
                  kclbResid="610708543449"
                />
              )}
          </div>
        );
        break;
      case 2:
        page = (
          <DefinePlan
            selectedPlan={this.state.selectedPlan}
            applyPlan={this.applyPlan}
            onGetSelectedPlan={this.handleGetSelectedPlan}
          />
        );
        break;
      case 3:
        page = (
          <TableData
            resid={611165813996}
            key="611165813996"
            hasBeBtns={true}
            hasAdd={false}
            hasRowView={false}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            actionBarFixed={true}
            hasRowModify={false}
            recordFormType="drawer"
            recordFormContainerProps={{
              placement: 'bottom',
              height: '100vh'
            }}
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
        );
        break;
      default:
        break;
    }
    return (
      <Spin spinning={loading}>
        <Steps
          current={current}
          style={{
            width: '100%',
            marginBottom: 10,
            padding: 10,
            backgroundColor: 'white'
          }}
        >
          <Step
            title="选择计划"
            description=""
            style={{ cursor: 'pointer' }}
            onClick={() => {
              this.setState({ current: 0 }, () => {
                this.refreshSelectedPlan();
              });
            }}
          />
          <Step
            title="制定计划"
            description=""
            onClick={() => {
              if (this.state.selectedPlan) {
                this.setState({ current: 1 });
              } else {
                message.error('未选择财年计划，请先选择财年计划！');
              }
            }}
            style={{ cursor: 'pointer' }}
          />
          <Step
            title="确认计划"
            description=""
            onClick={() => {
              if (this.state.selectedPlan) {
                this.setState({
                  current: 2
                });
              } else {
                message.error('未选择财年计划，请先选择财年计划!');
              }
            }}
            style={{ cursor: 'pointer' }}
          />
          <Step
            title="已提交计划"
            description=""
            onClick={() => {
              this.setState({
                current: 3
              });
            }}
            style={{ cursor: 'pointer' }}
          />
        </Steps>
        {page}
      </Spin>
    );
  }
}

export default FiscalYearPlan;
