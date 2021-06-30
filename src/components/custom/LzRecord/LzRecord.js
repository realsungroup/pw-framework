import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { message, Tabs } from 'antd';
import './LzRecord.less';
import classNames from 'classnames';
import { TableData } from '../../common/loadableCommon'
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
 * 前台记录
 */
export default class LzRecord extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      abnormalNum: 0,
      activeKey: '待处理'
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
      let activeKey = '已处理';

      if (!abnormalRecords.length) {
        activeKey = '待处理';
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
      <div className="lz-record">
        <Tabs
          activeKey={activeKey}
          renderTabBar={this.renderTabBar}
          onChange={this.handleTabsChange}
        >
          <TabPane tab="访问中" key="待处理">
            <div style={{ height: (this.props.height ? this.props.height : 'calc(100vh - 220px)') }}>
              <TableData
                {...inApplication}
                // https://github.com/react-component/form#note-use-wrappedcomponentref-instead-of-withref-after-rc-form140
                // wrappedComponentRef={form => (this.inApplicationRef = form)}
                ref={this.inApplicationRef}
              />
            </div>
          </TabPane>
          <TabPane tab="已访问" key="已处理" forceRender={true}>
            <div style={{ height: (this.props.height ? this.props.height : 'calc(100vh - 220px)') }}>
              <TableData
                {...applyForAbnormal}
                getTableData={this.getTableData}
                // https://github.com/react-component/form#note-use-wrappedcomponentref-instead-of-withref-after-rc-form140
                // wrappedComponentRef={form => (this.abnormalRef = form)}
                ref={this.abnormalRef}
              />
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
