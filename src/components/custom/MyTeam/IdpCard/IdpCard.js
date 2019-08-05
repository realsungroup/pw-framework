import React from 'react';
import {
  Button,
  Menu,
  Icon,
  Card,
  Steps,
  Popover,
  message,
  Popconfirm,
  Tag
} from 'antd';
import './IdpCard.less';
import http from 'Util20/api';
import PersonList from './PersonList';
import PersonPlan from './PersonPlan';

/**
 * 管理员确认
 */
const customDot = (dot, { status, index }) => (
  <Popover content={<span>状态: {status}</span>}>{dot}</Popover>
);
const { Step } = Steps;
const developmentPersonID = '617725883137'; //发展人员表
const hrMangerID = '617725533684'; //发展计划总表

class IdpCard extends React.Component {
  state = {
    mode: 'inline',
    theme: 'light',
    selectKey: '1',
    collapsed: false,
    currentPlan: {},
    historyPlan: [],
    currentPage: 1,
    record: {},
    checkType: null
  };
  onMiddleBack = () => {
    let res;
    try {
      // res = http().modifyData({
      // })
    } catch (error) {}
  };
  onCheckTeam = () => {
    this.setState({
      currentPage: 2
    });
  };

  onCheckOwn = () => {
    this.setState({
      currentPage: 3
    });
  };
  onLookPerson = (record, checkType) => {
    console.log('checkType', checkType);
    console.log('record', record);
    this.setState({
      currentPage: 3,
      record: record,
      checkType
    });
  };
  getCurrentPage = () => {
    let currentPlan = this.state.currentPlan;
    let historyPlan = this.state.historyPlan;
    console.log('currentPage', this.state.currentPage);
    switch (this.state.currentPage) {
      case 1:
        return (
          <React.Fragment>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Card
                className="idp-contain-card"
                title={
                  <span style={{ fontSize: '24px', color: '#fff' }}>
                    员工发展计划
                  </span>
                }
                bordered={false}
                extra={
                  currentPlan.status === '初次填写' ? (
                    this.props.role === 'HR' ? (
                      <span>
                        <Popconfirm
                          title="确认发起年中回顾吗?"
                          onConfirm={this.onMiddleBack}
                          onCancel={this.onCancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <span>发起年中回顾 </span>
                        </Popconfirm>
                        <span style={{ margin: '0 10px' }}>|</span>
                        <span onClick={this.onCheck}>查看</span>
                      </span>
                    ) : null
                  ) : (
                    <span>
                      {this.props.role === 'HR' ? (
                        <React.Fragment>
                          <Popconfirm
                            title="确认发起年末回顾吗?"
                            onConfirm={this.onEndBack}
                            onCancel={this}
                            okText="Yes"
                            cancelText="No"
                          >
                            <span>发起年末回顾</span>
                          </Popconfirm>
                          <span style={{ margin: '0 10px' }}>|</span>{' '}
                        </React.Fragment>
                      ) : null}

                      <Popover
                        content={
                          <React.Fragment>
                            <p>
                              <Tag
                                color="#f50"
                                onClick={() => {
                                  this.onCheckTeam(this.state.currentPlan);
                                }}
                              >
                                查看团队
                              </Tag>
                            </p>
                            <p>
                              <Tag
                                color="#108ee9"
                                onClick={() => {
                                  this.onLookPerson(
                                    this.state.currentPlan,
                                    'oneself'
                                  );
                                }}
                              >
                                查看自己
                              </Tag>
                            </p>
                          </React.Fragment>
                        }
                      >
                        <span onClick={this.onCheck}>查看</span>
                      </Popover>
                    </span>
                  )
                }
              >
                <div style={{ float: 'left' }}>
                  <p>发起时间:{currentPlan.startTime}</p>
                  <p>进行状态:{currentPlan.status}</p>
                  <p>参与人数:{currentPlan.number}</p>
                  <p>财年:{currentPlan.year}</p>
                </div>
                <div
                  className="image"
                  style={{
                    width: '136px',
                    height: '135px',
                    backgroundSize: '100%',
                    float: 'right'
                  }}
                ></div>
                <Steps
                  current={1}
                  progressDot={customDot}
                  style={{ color: '#fff' }}
                >
                  <Step
                    title="Finished"
                    description="初次填写"
                    style={{ color: '#fff' }}
                  />
                  <Step
                    title="In Progress"
                    description="年中回顾"
                    style={{ color: '#fff' }}
                  />
                  <Step
                    title="Waiting"
                    description="年末回顾"
                    style={{ color: '#fff' }}
                  />
                </Steps>
              </Card>
              <div className="idp-contain-smallcards">
                {/* <Card
                  className="idp-contain-smallcards-card"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <Icon
                    type="plus"
                    style={{
                      display: 'block',
                      fontSize: '60px',
                      fontWeight: 'bold'
                    }}
                  />
                  <span
                    style={{
                      display: 'block',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    发起新的发展计划
                  </span>
                </Card> */}
                {historyPlan.map(item => {
                  return (
                    <Card
                      title={
                        <span style={{ fontSize: '16px', color: '#000' }}>
                          员工发展计划
                        </span>
                      }
                      className="idp-contain-smallcards-card"
                      bordered={false}
                      extra={
                        <span style={{ color: '#1890FF', fontSize: '16px' }}>
                          <Popover
                            content={
                              <React.Fragment>
                                <p>
                                  <Tag
                                    color="#f50"
                                    onClick={() => {
                                      this.onCheckTeam(item);
                                    }}
                                  >
                                    查看团队
                                  </Tag>
                                </p>
                                <p>
                                  <Tag
                                    color="#108ee9"
                                    onClick={() => {
                                      this.onLookPerson(item, 'oneself');
                                    }}
                                  >
                                    查看自己
                                  </Tag>
                                </p>
                              </React.Fragment>
                            }
                          >
                            查看
                          </Popover>
                        </span>
                      }
                    >
                      <div className="idp-contain-smallcards-card-content">
                        发起时间:{item.startTime}
                      </div>
                      <div>进行状态:{item.status}</div>
                      <div>参与人数:{item.number}</div>
                      <div>财年:{item.year}</div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </React.Fragment>
        );
        break;
      case 2:
        return <PersonList onLookPerson={this.onLookPerson} role={this.props.role}></PersonList>;
      case 3:
        return (
          <PersonPlan
            record={this.state.record}
            checkType={this.state.checkType}
          ></PersonPlan>
        );

      default:
    }
  };
  componentDidMount = async () => {
    let resID;
    if (this.props.role === 'HR') {
      resID = hrMangerID;
    } else {
      resID = developmentPersonID;
    }

    let res;
    try {
      res = await http().getTable({
        resid: resID
      });
      let [currentPlan, ...historyPlan] = [...res.data];
      // console.log('currentPlan', currentPlan, historyPlan);
      this.setState({
        currentPlan,
        historyPlan
      });
    } catch (error) {
      message.error(error.message);
    }
  };
  render() {
    const { currentPlan, historyPlan, currentPage } = this.state;
    return (
      <div className="idp-contain" style={{ height: '100%', width: '100%' }}>
        {this.getCurrentPage()}
      </div>
    );
  }
}

export default IdpCard;
