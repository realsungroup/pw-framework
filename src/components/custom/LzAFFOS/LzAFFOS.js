import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import http from '../../../util20/api';
import { message, Tabs, Button } from 'antd';
import './LzAFFOS.less';
// import TableData from '../../../lib/unit-component/TableData';
import { TableData } from '../../common/loadableCommon';
import {
  inApplication,
  inExaminationAndApproval,
  approved,
  refused,
  history,
  MyVisitor
} from './config';

const TabPane = Tabs.TabPane;

/**
 * 访客申请
 */
export default class LzAFFOS extends React.Component {
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
  reApply = async record => {
    console.log('当前记录', record);
    // 根据当前记录，找到与之对应的访客信息。
    let res;
    try {
      res = await http().getTable({
        resid: 606066688508,
        cmswhere: `C3_606070812241=${record.C3_605718092628}`
      });
    } catch (err) {
      console.error(err.message);
      return err.message;
    }
    console.log(res.data);
    // 向申请中表加数据,主子表同时加
    let res2;
    try {
      res2 = await http().saveRecordAndSubTables({
        data: [
          {
            resid: '605801028375',
            maindata: {
              C3_605703896083: record.C3_605703896083, //来访事由
              C3_605703913037: record.C3_605703913037, //访客类型
              C3_605703930741: record.C3_605703930741, //访客类型
              C3_605703980025: record.C3_605703980025, //有效开始日期
              C3_605703992046: record.C3_605703992046, //有效结束日期
              C3_614883990443: record.C3_614883990443, //一级审批人工号
              C3_614884004893: record.C3_614884004893, //一级审批人
              C3_614884015488: record.C3_614884015488, //二级审批人工号
              C3_614884016188: record.C3_614884016188, //二级审批人
              C3_615638304913: 'Y',
              _state: 'added',
              _id: 1
            },
            subdata: [
              {
                resid: '606066688508',
                maindata: {
                  C3_605716828937: res.data[0].C3_605716828937, //访客姓名
                  C3_605716301557: res.data[0].C3_605716301557, //访客单位
                  C3_605716867680: res.data[0].C3_605716867680, //访客证件类型
                  C3_606412134505: res.data[0].C3_606412134505, //访客手机号
                  C3_614704116070: res.data[0].C3_614704116070, //登记证件号
                  _state: 'added',
                  _id: 1
                }
              }
            ]
          }
        ]
      });
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
    console.log(res2);
    this.tableDataRef.handleRefresh();
    this.setState({ activeKey: '申请中' });
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
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData
                {...inApplication}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                formProps={{ saveText: '提交', height: 500 }}
              />
            </div>
          </TabPane>

          <TabPane tab="审批中" key="审批中">
            <div style={{ height: 'calc(100vh - 220px)' }}>
              {' '}
              <TableData {...inExaminationAndApproval} />
            </div>
          </TabPane>
          <TabPane tab="已审批" key="已审批">
            <div style={{ height: 'calc(100vh - 220px)' }}>
              <TableData {...approved} />
            </div>
          </TabPane>
          <TabPane tab="已拒绝" key="已拒绝">
            <div style={{ height: 'calc(100vh - 220px)' }}>
              <TableData {...refused} />
            </div>
          </TabPane>
          <TabPane tab="历史记录" key="历史记录">
            <div style={{ height: 'calc(100vh - 220px)' }}>
              <TableData
                {...history}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
                      <Button
                        onClick={() => {
                          this.reApply(record);
                        }}
                      >
                        重新申请
                      </Button>
                    );
                  }
                ]}
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
