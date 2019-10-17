import React from 'react';
import {
  Icon,
  Card,
  Steps,
  Popover,
  message,
  Popconfirm,
  Tag,
  notification,
  Modal,
  Progress
} from 'antd';
import './IdpCard.less';
import http from 'Util20/api';
import PersonList from './PersonList';
import PersonPlan from './PersonPlan';

/**
 * 管理员确认
 */

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        状态:{' '}
        {status === 'finish'
          ? '已结束'
          : status === 'wait'
          ? '等待中'
          : '进行中'}{' '}
      </span>
    }
  >
    {dot}
  </Popover>
);
const { Step } = Steps;
const { confirm } = Modal;
const developmentPersonID = '617725883137'; //发展人员表
const hrMangerID = '617725533684'; //发展计划总表
const autoTaskID = '618594705773'; //自动同步无锡发展人员表
const autoTaskSHID = '619623421822'; //自动同步上海发展人员表

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
    checkType: null,
    totalIndex: 0, // 任务总进度
    curIndex: 0, // 当前任务进度
    isTaskComplete: false, // 当前任务是否已完成
    isShowModal: false,
    currentRecord: {} //当前传入的发展计划
  };

  //年中回顾
  onMiddleBack = () => {
    let res;
    let currentPlan = this.state.currentPlan;
    currentPlan.status = '年中回顾';
    try {
      res = http().modifyRecords({
        resid: hrMangerID,
        data: [currentPlan]
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
      this.setState({
        currentPlan
      });
    } catch (error) {
      message.error(error.message);
    }
  };
  //年末回顾
  onEndBack = () => {
    let res;
    let currentPlan = this.state.currentPlan;
    currentPlan.status = '年末回顾';
    try {
      res = http().modifyRecords({
        resid: hrMangerID,
        data: [currentPlan]
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
      this.setState({
        currentPlan
      });
    } catch (error) {
      message.error(error.message);
    }
  };
  //结束计划
  onStopPlan = () => {
    let res;
    let currentPlan = this.state.currentPlan;
    currentPlan.status = '已完成';
    try {
      res = http().modifyRecords({
        resid: hrMangerID,
        data: [currentPlan]
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
      this.setState({
        currentPlan
      });
    } catch (error) {
      message.error(error.message);
    }
  };
  renderTaskProgress = () => {
    const { totalIndex, curIndex } = this.state;
    let percent = 0;
    if (this.state.isTaskComplete) {
      percent = 100;
    } else if (totalIndex) {
      percent = Math.floor((curIndex / totalIndex) * 100);
    }
    return (
      <div className="total-plan__seed_personnel">
        <Progress width={240} type="circle" percent={percent} />
        <div style={{ marginTop: 20 }}>
          {curIndex} / {totalIndex}
        </div>
      </div>
    );
  };
  getTaskInfo = async () => {
    let res;
    try {
      res = await http().getAutoImportStatus();
    } catch (err) {
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo();
        }
      }, 1000);
      return message.error(err.message);
    }
    if (res.error !== 0) {
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo();
        }
      }, 1000);
      return message.error(res.message);
    }
    // 当前任务已完成
    if (res.IsComplete) {
      //修改当前财年的是否生成人员名单字段
      const data = [
        {
          REC_ID: this.state.currentPlan.REC_ID,
          isCreatePerson: 'Y'
        }
      ];
      http()
        .modifyRecords({
          resid: hrMangerID,
          data
        })
        .then(res => {
          if (res.Error === 0) {
            notification.open({
              message: '通知',
              description: '当前发展计划人员名单已生成完毕，请注意查看！',
              icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
              duration: null
            });
          } else {
            message.error(res.message);
          }
        })
        .catch(error => {
          message.error(error.message);
        });
      this.setState({
        curIndex: this.state.totalIndex,
        isTaskComplete: true
      });
      // 当前任务未完成
    } else {
      this.setState({
        totalIndex: res.data.Total,
        curIndex: res.data.Index,
        isTaskComplete: false
      });
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo();
        }
      }, 1000);
    }
  };
  onRunAutoTask = async projectId => {
    let res;
    try {
      res = await http().PostRunAutoImport({
        id: autoTaskID,
        parms: {
          projectId: projectId
        }
      });
    } catch (err) {
      message.error('正在生成人员名单，请耐心等候');
    }
    this.setState({ isShowModal: true });
    this.getTaskInfo();
  };
  //添加发展计划
  onAdd = async () => {
    // let that = this;
    confirm({
      title: '你确定要开启新的发展计划吗?',
      content: '在开启之前，请确保历史财年的计划已经结束！',
      onOk: async () => {
        let res;
        try {
          res = await http().addRecords({
            resid: hrMangerID,
            data: [{}]
          });
          if (res.Error === 0) {
            message.success(res.message);
            // this.onRunAutoTask(res.data[0].projectId);
            this.getData();
          }
        } catch (error) {
          message.error(error.message);
        }
      },
      onCancel: function() {}
    });
  };
  //查看团队
  onCheckTeam = currentRecord => {
    this.setState({
      currentPage: 2,
      currentRecord
    });
  };

  //查看自己
  onCheckOwn = () => {
    this.setState({
      currentPage: 3
    });
  };

  onLookPerson = async (record, checkType) => {
    await this.setState({
      currentPage: 3,
      record: record,
      checkType
    });
  };
  renderHistoryBtns = item => {
    switch (this.props.role) {
      case 'HR':
        return (
          <span
            onClick={() => {
              this.onCheckTeam(item);
            }}
          >
            员工列表
          </span>
        );
      case 'Employee':
        return (
          <span
            onClick={() => {
              this.onLookPerson(item, 'oneself');
            }}
          >
            查看自己
          </span>
        );
      case 'Manager':
      default:
        return (
          <span
            onClick={() => {
              this.onCheckTeam(item);
            }}
          >
            查看团队
          </span>
        );
    }
  };
  renderHistory = () => {
    let historyPlan = this.state.historyPlan;
    let role = this.props.role;

    return historyPlan.map(item => {
      return (
        <Card
          title={
            <span style={{ fontSize: '16px', color: '#000' }}>
              员工发展计划
            </span>
          }
          className="idp-contain-smallcards-card"
          bordered={false}
          extra={this.renderHistoryBtns(item)}
        >
          <div className="idp-contain-smallcards-card-content">
            发起时间: {item.startTime}
          </div>
          <div className="idp-contain-smallcards-card-content">
            参与人数: {item.number}
          </div>
          <div className="idp-contain-smallcards-card-content">
            财年: {item.year}
          </div>
        </Card>
      );
    });
  };
  renderBtns = () => {
    let currentPlan = this.state.currentPlan;
    let role = this.props.role;
    if (role === 'HR') {
      switch (currentPlan && currentPlan.status) {
        case '初次填写':
          return (
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

              <span
                onClick={() => {
                  this.onCheckTeam(this.state.currentPlan);
                }}
              >
                员工列表
              </span>
            </span>
          );
        case '年中回顾':
          return (
            <React.Fragment>
              <Popconfirm
                title="确认发起年末回顾吗?"
                onConfirm={this.onEndBack}
                okText="Yes"
                cancelText="No"
              >
                <span style={{ cursor:'pointer'}}>发起年末回顾</span>
              </Popconfirm>
              <span style={{ margin: '0 10px' }}>|</span>
              <span
                style={{ cursor:'pointer'}}
                onClick={() => {
                  this.onCheckTeam(this.state.currentPlan);
                }}
              >
                员工列表
              </span>
            </React.Fragment>
          );
        case '年末回顾':
          return (
            <React.Fragment>
              <Popconfirm
                title="确认结束计划吗?"
                onConfirm={this.onStopPlan}
                okText="Yes"
                cancelText="No"
              >
                <span>结束</span>
              </Popconfirm>
              <span style={{ margin: '0 10px' }}>|</span>
              <span
                onClick={() => {
                  this.onCheckTeam(this.state.currentPlan);
                }}
              >
                员工列表
              </span>
            </React.Fragment>
          );
        case '已完成':
          return (
            <span
              onClick={() => {
                this.onCheckTeam(this.state.currentPlan);
              }}
            >
              员工列表
            </span>
          );
        default:
          break;
      }
    } else if (this.props.role === 'Employee') {
      return (
        <span
          onClick={() => {
            this.onLookPerson(this.state.currentPlan, 'oneself');
          }}
        >
          查看自己
        </span>
      );
    } else {
      return (
        <span
          onClick={() => {
            this.onCheckTeam(this.state.currentPlan);
          }}
        >
          查看团队
        </span>
      );
    }
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
              {currentPlan ? (
                <Card
                  className="idp-contain-card"
                  title={
                    <span style={{ fontSize: '24px', color: '#fff' }}>
                      员工发展计划
                    </span>
                  }
                  bordered={false}
                  extra={this.renderBtns()}
                >
                  <div style={{ float: 'left' }}>
                    <div>发起时间: {currentPlan && currentPlan.startTime}</div>
                    <br />
                    <div>
                      {this.props.role === 'HR' ? '参与人数:' : '下属人数:'}
                      {currentPlan && currentPlan.num}
                    </div>
                    <br />
                    <div>财年: {currentPlan && currentPlan.year}</div>
                    <br />
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
                  <div style={{ marginTop: '160px' }}>
                    <Steps
                      current={
                        currentPlan && currentPlan.status === '初次填写'
                          ? 0
                          : currentPlan && currentPlan.status === '年中回顾'
                          ? 1
                          : 3
                      }
                      progressDot={customDot}
                    >
                      <Step description="初次填写" style={{ color: '#fff' }} />
                      <Step description="年中回顾" style={{ color: '#fff' }} />
                      <Step description="年末回顾" style={{ color: '#fff' }} />
                    </Steps>
                  </div>
                </Card>
              ) : null}
              <div
                className="idp-contain-smallcards"
                style={{
                  marginTop: currentPlan ? '0px' : '100px'
                }}
              >
                {this.props.role === 'HR' ? (
                  <Card
                    className="idp-contain-smallcards-card addPlan"
                    onClick={() => {
                      this.onAdd();
                    }}
                    style={{
                      
                      marginLeft: historyPlan.length > 0 ? '0' : '176px'
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
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}
                    >
                      添加新的发展计划
                    </span>
                    <span style={{ display:'block',textAlign:'center',width:'100%',color: '#999' }}>Add a new compentecy</span>
                  </Card>
                ) : null}
                {this.renderHistory()}
              </div>
            </div>
          </React.Fragment>
        );
      case 2:
        return (
          <PersonList
            onLookPerson={record => {
              this.onLookPerson(record);
            }}
            record={this.state.currentRecord}
            role={this.props.role}
          ></PersonList>
        );
      case 3:
        return (
          <PersonPlan
            goBack={() => {
              this.goBack();
            }}
            role={this.props.role}
            record={this.state.record}
            checkType={this.state.checkType}
          ></PersonPlan>
        );

      default:
        break;
    }
  };
  goBack = () => {
    let currentPage = this.state.currentPage;
    if (currentPage === 2) {
      this.setState({
        currentPage: 1
      });
    } else {
      if (this.state.checkType) {
        this.setState({
          currentPage: 1
        });
      } else {
        this.setState({
          currentPage: 2
        });
      }
    }
  };
  componentDidMount = async () => {
    this.getData();
  };
  getData = async () => {
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
      this.setState({
        currentPlan,
        historyPlan
      });
    } catch (error) {
      message.error(error.message);
    }
  };
  render() {
    const { currentPage } = this.state;
    return (
      <div
        className="idp-contain"
        style={{
          height: currentPage !== 2 ? 'calc(100% - 64px)' : '100%',
          width: '100%'
        }}
      >
        {this.getCurrentPage()}
        {currentPage !== 1 ? (
          <div className="idp-contain-back" onClick={this.goBack}>
            <Icon type="rollback" style={{ color: '#999' }} />
          </div>
        ) : null}
        <Modal
          title="生成人员名单"
          visible={this.state.isShowModal}
          okText="完成"
          cancelText="关闭"
          closable={false}
          onOk={() => {
            this.setState({ isShowModal: false });
          }}
          onCancel={() => {
            this.setState({ isShowModal: false });
          }}
        >
          {this.renderTaskProgress()}
        </Modal>
      </div>
    );
  }
}

export default IdpCard;
