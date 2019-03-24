import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { message, Tabs } from 'antd';
import './ViProvider.less';
// import TableData from '../../../lib/unit-component/TableData';
import { TableData } from '../../common/loadableCommon';
import {
  inApplication,
  inExaminationAndApproval,
  approved,
  refused,
  history
} from './config';

const TabPane = Tabs.TabPane;

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
      activeKey: '申请中'
    };
    this.abnormalRef = React.createRef();
    this.inApplicationRef = React.createRef();
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {};

  handleTabsChange = activeKey => {
    this.setState({ activeKey });
  };

  render() {
    const { activeKey, abnormalNum } = this.state;
    const { resids } = this.props;
    return (
      <div className="lz-affo">
        <Tabs
          activeKey={activeKey}
          renderTabBar={this.renderTabBar}
          onChange={this.handleTabsChange}
        >
          <TabPane tab="申请中" key="申请中">
          <div style={{height:'calc(100vh - 220px)'}}><TableData {...inApplication}/></div>
          </TabPane>

          <TabPane tab="审批中" key="审批中">
          <div style={{height:'calc(100vh - 220px)'}}><TableData {...inExaminationAndApproval}/></div>
          </TabPane>
          <TabPane tab="已审批" key="已审批">
          <div style={{height:'calc(100vh - 220px)'}}><TableData {...approved}/></div>
          </TabPane>
          <TabPane tab="已拒绝" key="已拒绝">
          <div style={{height:'calc(100vh - 220px)'}}><TableData {...refused}/></div>
          </TabPane>
          <TabPane tab="历史记录" key="历史记录">
          <div style={{height:'calc(100vh - 220px)'}}><TableData {...history}/></div>
          </TabPane>
        </Tabs>
        {!!abnormalNum && (
          <div className="lz-affo__abnormal-num">{abnormalNum}</div>
        )}
      </div>
    );
  }
}
