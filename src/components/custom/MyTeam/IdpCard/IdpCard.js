import React from 'react';
import {
  Button,
  Menu,
  Icon,
  Switch,
  Card,
  Steps,
  Popover,
  message,
  Popconfirm
} from 'antd';
import './IdpCard.less';
import http from 'Util20/api';

/**
 * 管理员确认
 */
const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
       状态: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);
const { Step } = Steps;
const developmentPersonID = '617725883137'; //发展人员表

class IdpCard extends React.Component {
  state = {
    mode: 'inline',
    theme: 'light',
    selectKey: '1',
    collapsed: false,
    currentPlan: {},
    historyPlan: []
  };
  onMiddleBack = () => {
    let res;
    try{
      res = http().modifyData({

      })
    }catch(error){

    }
    
  }
  componentDidMount = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: developmentPersonID
      });
      let [currentPlan, ...historyPlan] = [...res.data];
      console.log('currentPlan', currentPlan, historyPlan);
      this.setState({
        currentPlan,
        historyPlan
      });
    } catch (error) {
      message.error(error.message);
    }
  };
  render() {
    const { currentPlan, historyPlan } = this.state;
    return (
      <div className="idp-contain" style={{ height: '100%' }}>
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
                <span>查看</span>
              </span>
            ) : (
              <span>
                <Popconfirm
                  title="确认发起年末回顾吗?"
                  onConfirm={this.onEndBack}
                  onCancel={this}
                  okText="Yes"
                  cancelText="No"
                >
                  <span>发起年末回顾</span>
                </Popconfirm>
                <span style={{ margin: '0 10px' }}>|</span>
                <span>查看</span>
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
              // backgroundImage: 'url:(http://pic25.nipic.com/20121112/9252150_150552938000_2.jpg)',
              backgroundSize: '100%',
              float: 'right'
            }}
          ></div>
          <Steps current={1} progressDot={customDot} style={{ color: '#fff' }}>
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
          <Card
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
              style={{ display: 'block', fontSize: '60px', fontWeight: 'bold' }}
            />
            <span
              style={{ display: 'block', fontSize: '16px', fontWeight: 'bold' }}
            >
              发起新的发展计划
            </span>
          </Card>
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
                    查看
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
    );
  }
}

export default IdpCard;
