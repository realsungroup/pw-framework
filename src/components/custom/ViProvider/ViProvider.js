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
            <TableData {...inApplication}/>
          </TabPane>

          <TabPane tab="审批中" key="审批中">
            <TableData {...inExaminationAndApproval}/>
          </TabPane>
          <TabPane tab="已审批" key="已审批">
            <TableData {...approved}/>
          </TabPane>
          <TabPane tab="已拒绝" key="已拒绝">
            <TableData {...refused}/>
          </TabPane>
          <TabPane tab="历史记录" key="历史记录">
            <TableData {...history}/>
          </TabPane>
        </Tabs>
        {!!abnormalNum && (
          <div className="lz-affo__abnormal-num">{abnormalNum}</div>
        )}
      </div>
    );
  }
}
