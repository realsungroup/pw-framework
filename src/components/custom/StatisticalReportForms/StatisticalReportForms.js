import React from 'react';
import { Tabs, message, Spin } from 'antd';
import { TableData } from '../../common/loadableCommon';
import './StatisticalReportForms.less';
import ReportForm1 from './ReportForm1';
import ReportForm2 from './ReportForm2';
import ReportForm3 from './ReportForm3';
import http from 'Util20/api';

const { TabPane } = Tabs;
const YEAR_RESID = '420161931474'; //财年表id

/**
 * 学习与发展----数据统计报表
 */
class StatisticalReportForms extends React.Component {
  state = {
    currentYear: {},
    loading: false
  };
  componentDidMount() {
    this.setState({ loading: true });
    this.getYears();
    this.setState({ loading: false });
  }
  handleTabsChange = key => {
    // console.log(key);
  };
  //获取财年
  getYears = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: YEAR_RESID
      });
      let years = [...res.data];
      let currentYear = years.find(item => item.C3_478179065325 === 'Y');
      this.setState({
        currentYear
      });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };
  render() {
    const { loading, currentYear } = this.state;
    return (
      <div className="statistical-report-forms">
        <Spin spinning={loading}>
          <Tabs defaultActiveKey="1" onChange={this.handleTabsChange}>
            <TabPane tab="财年培训季度数据统计" key="1">
              <ReportForm3 />
            </TabPane>
            <TabPane tab="财年培训季度费用统计" key="2">
              <ReportForm1 currentYear={currentYear} />
            </TabPane>
            <TabPane tab="培训历年财年人均变化统计" key="3">
              <ReportForm2 chara='HR'/>
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    );
  }
}

export default StatisticalReportForms;
