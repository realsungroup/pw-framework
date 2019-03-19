import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { message, Tabs } from 'antd';
import './LzRegister.less';
import classNames from 'classnames';
import EventEmitter from 'wolfy87-eventemitter';
import {TableData} from '../../common/loadableCommon'

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
 * 保安登记
 */
export default class LzRegister extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      abnormalNum: 0,
      activeKey: '待访问'
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
      let activeKey = '访问中';

      if (!abnormalRecords.length) {
        activeKey = '待访问';
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
      <div className="lz-register">

        <Tabs
          activeKey={activeKey}
          renderTabBar={this.renderTabBar}
          onChange={this.handleTabsChange}
        >
          <TabPane tab="待访问" key="待访问">
          <div style={{height:'calc(100vh - 220px)'}}>
            <TableData
              {...inApplication}
              // https://github.com/react-component/form#note-use-wrappedcomponentref-instead-of-withref-after-rc-form140
              // wrappedComponentRef={form => (this.inApplicationRef = form)}
              ref={this.inApplicationRef}
            />
          </div>       
          </TabPane>
          <TabPane tab="访问中" key="访问中" forceRender={true}>
          <div style={{height:'calc(100vh - 220px)'}}>
          <TableData
              {...applyForAbnormal}
              getTableData={this.getTableData}
              // https://github.com/react-component/form#note-use-wrappedcomponentref-instead-of-withref-after-rc-form140
              // wrappedComponentRef={form => (this.abnormalRef = form)}
              ref={this.abnormalRef}
            />
          </div>            
          </TabPane>
          <TabPane tab="已访问" key="已访问">
            <div style={{height:'calc(100vh - 220px)'}}>
              <TableData {...refused} />
            </div> 
          </TabPane>
        </Tabs>
        {!!abnormalNum && (
          <div className="lz-affo__abnormal-num">{abnormalNum}</div>
        )}
      </div>
    );
  }
}
