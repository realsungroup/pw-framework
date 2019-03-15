import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { message, Tabs } from 'antd';
import './LzApproval.less';
import classNames from 'classnames';
import {TableData} from '../../common/loadableCommon'
import EventEmitter from 'wolfy87-eventemitter';
import {
  inApplication,
  applyForAbnormal,
  approved,
  refused,
  history,
  inExaminationAndApproval
} from './config';

const TabPane = Tabs.TabPane;

/**
 * 审批
 */
export default class LzApproval extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      abnormalNum: 0,
      activeKey: '待审批'
    };
    this.abnormalRef = React.createRef();
    this.inApplicationRef = React.createRef();
  }

  componentDidMount = () => {
    window.lzCustomEvent = window.lzCustomEvent ? window.lzCustomEvent : {};
    window.lzCustomEvent.ee = new EventEmitter();
    // 监听 批量添加完成
    window.lzCustomEvent.ee.addListener('batchAdd', this.retHandleBatchAdd());
  };

  componentWillUnmount = () => {
    window.lzCustomEvent.ee.removeListener('batchAdd', this.handleBatchAdd);
  };

  retHandleBatchAdd = () => {
    const that = this;
    this.handleBatchAdd = function handleBatchAdd(
      normalRecords,
      abnormalRecords
    ) {
      let activeKey = '已审批';

      if (!abnormalRecords.length) {
        activeKey = '待审批';
      }
      if (normalRecords.length) {
        that.inApplicationRef.current.refreshTableData(true);
      }
      if (abnormalRecords.length) {
        that.abnormalRef.current.refreshTableData(true);
      }
      that.setState({ activeKey });
    };
    return this.handleBatchAdd;
  };

  getTableData = (tableData, total) => {
    this.setState({ abnormalNum: total });
  };

  handleTabsChange = activeKey => {
    this.setState({ activeKey });
  };

  render() {
    const { activeKey, abnormalNum } = this.state;
    return (
      <div className="lz-approval">
        <Tabs
          activeKey={activeKey}
          renderTabBar={this.renderTabBar}
          onChange={this.handleTabsChange}
        >
          <TabPane tab="待审批" key="待审批">
            <TableData
              {...inApplication}
              // https://github.com/react-component/form#note-use-wrappedcomponentref-instead-of-withref-after-rc-form140
              // wrappedComponentRef={form => (this.inApplicationRef = form)}
              ref={this.inApplicationRef}
            />
          </TabPane>
          <TabPane tab="已审批" key="已审批" forceRender={true}>
            <TableData
              {...applyForAbnormal}
              getTableData={this.getTableData}
              // https://github.com/react-component/form#note-use-wrappedcomponentref-instead-of-withref-after-rc-form140
              // wrappedComponentRef={form => (this.abnormalRef = form)}
              ref={this.abnormalRef}
            />
          </TabPane>
          <TabPane tab="已拒绝" key="已拒绝">
            <TableData {...refused} />
          </TabPane>
          <TabPane tab="历史记录" key="历史记录">
            <TableData {...history} />
          </TabPane>
        </Tabs>
        {!!abnormalNum && (
          <div className="lz-affo__abnormal-num">{abnormalNum}</div>
        )}
      </div>
    );
  }
}
