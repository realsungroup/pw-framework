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
import './PersonList.less';
import http from 'Util20/api';
/**
 * 管理员确认
 */

class PersonList extends React.Component {
  state = {
    mode: 'inline',
    theme: 'light',
    selectKey: '1',
    collapsed: false,
    currentPlan: {},
    historyPlan: []
  };
  componentDidMount = async () => {
    let res;
    try {
      res = await http().getTable({
        // resid: developmentPersonID
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
      <div className="personlist-contain" style={{ height: '100%' }}>
        </div>
    );
  }
}

export default PersonList;
