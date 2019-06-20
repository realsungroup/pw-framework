import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tabs,Button } from 'antd';
import http from '../../../util20/api';
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
  reApply = async record => {
    console.log('当前记录', record);
    // 根据当前记录，找到与之对应的访客信息。
    let res;
    try {
      res = await http().getTable({
        resid: 605719206028,
        cmswhere: `C3_606218777003=${record.C3_605993242597}`
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
            resid: '605718030245',
            maindata: {
              C3_605718056102: record.C3_605718056102, //访客单位
              C3_605718133807: record.C3_605718133807, //访客类型
              C3_605718146773: record.C3_605718146773, //访问地区类型
              C3_605719340594: record.C3_605719340594, //有效开始日期
              C3_605719340781: record.C3_605719340781, //有效结束日期
              C3_605706988162: '',
              _state: 'added',
              _id: 1
            },
            subdata: [
              {
                resid: '605719206028',
                maindata: {
                  C3_605719242294: res.data[0].C3_605719242294, //访客姓名
                  C3_606843168661: res.data[0].C3_606843168661, //访客单位
                  C3_605719242802: res.data[0].C3_605719242802, //访客证件类型
                  C3_605719242955: res.data[0].C3_605719242955, //登记证件号
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
              <TableData {...inApplication} 
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData" formProps={{saveText: '提交', height: 480}} />
            </div>
          </TabPane>

          <TabPane tab="审批中" key="审批中">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData {...inExaminationAndApproval} />
            </div>
          </TabPane>
          <TabPane tab="已审批" key="已审批">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData {...approved} />
            </div>
          </TabPane>
          <TabPane tab="已拒绝" key="已拒绝">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData {...refused} />
            </div>
          </TabPane>
          <TabPane tab="历史记录" key="历史记录">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData {...history} customRowBtns={[
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
                ]}/>
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
