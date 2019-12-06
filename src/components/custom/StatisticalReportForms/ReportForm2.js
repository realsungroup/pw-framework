import React from 'react';
import { message } from 'antd';
import echarts from 'echarts';
import http from 'Util20/api';
import './StatisticalReportForms.less';

/**
 *
 */
class ReportForm1 extends React.Component {
  async componentDidMount() {
    this._echarts = echarts.init(
      document.getElementById('report-form2'),
      'light'
    );
    this._echarts.setOption({
      title: {
        text: '人均时数'
      },
      legend: { data: [''] },
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
          type: 'line',
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
      //     // ['product', 'Overall Training Cost',],
      //     ['Q1FY14', 43.3],
      //     ['Q2FY14', 83.1],
      //     ['Q3FY14', 86.4],
      //     ['Q4FY14', 72.4]
      //   ]
      // }
    });
    await this.getData();
  }
  getData = async () => {
    try {
      let httpParams = {};

      this._echarts.showLoading();
      const res = await http(httpParams).getTable({
        resid: '628789285884'
      });
      this._echarts.hideLoading();
      // console.log(res.data);
      let source = res.data.map(item => {
        return [item.C3_611264173184 + item.quarter, item.trainTime];
      });
      this._echarts.setOption({
        dataset: {
          source: source
        }
      });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  render() {
    return <div id="report-form2" style={{ height: 400 }}></div>;
  }
}

export default ReportForm1;
