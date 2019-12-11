import React from 'react';
import { message ,Spin} from 'antd';
import echarts from 'echarts';
import http from 'Util20/api';
import './StatisticalReportForms.less';

/**
 *
 */
class ReportForm1 extends React.Component {
  state={
    loading:false
  }
  async componentDidMount() {
    this._echarts = echarts.init(
      document.getElementById('report-form1'),
      'light'
    );
    this._echarts.setOption({
      title: {
        text: '财年培训季度费用统计'
      },
      legend: {
        data: ['Overall Training Cost', 'Cost only for Courses']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      toolbox: {
        feature: {
          // dataView: { show: true, readOnly: false },
          // restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: { type: 'category' },
      yAxis: {},
      series: [
        {
          name: 'Overall Training Cost',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          }
        },
        {
          name: 'Cost only for Courses',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          }
        }
      ]
      // dataset: {
      //   source: [
      //     ['product', 'Overall Training Cost', 'Cost only for Courses'],
      //     ['Q1FY14', 43.3, 85.8],
      //     ['Q2FY14', 83.1, 73.4],
      //     ['Q3FY14', 86.4, 65.2],
      //     ['Q4FY14', 72.4, 53.9]
      //   ]
      // }
    });
    await this.getData();
  }
  getData = async () => {
    this.setState({loading:true});
    try {
      let httpParams = {};
      this._echarts.showLoading();
      const res = await http(httpParams).getTable({
        resid: '628789184275'
        // cmswhere: `C3_613941384328 = '${this.props.currentYear.C3_420161949106}'`
      });
      this._echarts.hideLoading();
      let source = [];
      source = res.data.map(item => {
        return [
          item.C3_613941384328 + item.quarter,
          item.OverallTrainingCost ? item.OverallTrainingCost : 0,
          item.CostOnlyForCourses ? item.CostOnlyForCourses : 0
          // 800,
          // 4000
        ];
      });
      this._echarts.setOption({
        dataset: {
          dimensions: ['product', 'Overall Training Cost', 'Average OT(hrs)'],
          source: source
        }
      });
      this.setState({loading:false});

    } catch (error) {
      message.error(error.message);
      console.error(error);
      this.setState({loading:false});

    }
  };

  render() {
    return (<Spin spinning={this.state.loading}><div id="report-form1" style={{}}></div></Spin>);
  }
}

export default ReportForm1;
