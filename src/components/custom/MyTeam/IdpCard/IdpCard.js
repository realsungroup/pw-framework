import React from 'react';
import { Button, Menu, Icon, Switch, Card ,Steps,Popover} from 'antd';
import './IdpCard.less';
import http from 'Util20/api';
import img from './形状@2x.png';

/**
 * 管理员确认
 */
const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);
const { Step } = Steps;
class IdpCard extends React.Component {
  state = {
    mode: 'inline',
    theme: 'light',
    selectKey: '1',
    collapsed: false
  };
  
  render() {
    const { loading } = this.state;
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
            <span style={{ color: '#fff', fontSize: '16px' }}>
              发起年中回顾  |    <span style={{ color: '#fff', fontSize: '16px' }}>
              查看 
            </span>
            </span>
          }
        >
          <div style={{float:"left"}}>
          <p>发起时间:</p>
          <p>进行状态:</p>
          <p>参与人数:</p>
          <p>财年:</p>
          </div>
          <div
          className="image"
            style={{
              width: '136px',
              height: '135px',
              // backgroundImage: 'url:(http://pic25.nipic.com/20121112/9252150_150552938000_2.jpg)',
              backgroundSize: '100%',
              float:"right"
            }}
          ></div>
            <Steps current={1} progressDot={customDot} style={{color:"#fff"}}>
    <Step title="Finished" description="初次填写" style={{color:"#fff"}} />
    <Step title="In Progress" description="年中回顾" style={{color:"#fff"}}/>
    <Step title="Waiting" description="年末回顾" style={{color:"#fff"}}/>
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
            <div className="idp-contain-smallcards-card-content">发起时间:</div>
            <div>进行状态:</div>
            <div>参与人数:</div>
            <div>财年:</div>
          </Card>
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
            <div>发起时间:</div>
            <div>进行状态:</div>
            <div>参与人数:</div>
            <div>财年:</div>
            Card content
          </Card>
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
            <div>发起时间:</div>
            <div>进行状态:</div>
            <div>参与人数:</div>
            <div>财年:</div>
            Card content
          </Card>
        </div>
      </div>
    );
  }
}

export default IdpCard;
