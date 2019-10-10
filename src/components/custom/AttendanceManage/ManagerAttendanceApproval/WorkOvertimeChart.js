import React from 'react';
import echarts from 'echarts';
import http from 'Util20/api';
import { message, Select, Table } from 'antd';
import { getItem } from 'Util20/util';
import './ManagerAttendanceApproval.less';
import { Button } from 'antd';

const { Option } = Select;
const colors = ['#5793f3', '#d14a61', '#675bba'];
const downloadFile = (columns = [], data = []) => {
  //列标题，逗号隔开，每一个逗号就是隔开一个单元格
  let str = '';
  columns.forEach((item, index) => {
    str += item.dataIndex + ',';
    if (index + 1 === columns.length) {
      str += `\n`;
    }
  });
  //增加\t为了不让表格显示科学计数法或者其他格式
  data.forEach(item => {
    columns.forEach(column => {
      str += `${item[column.dataIndex] + '\t'},`;
    });
    str += '\n';
  });

  //encodeURIComponent解决中文乱码
  let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
  //通过创建a标签实现
  let link = document.createElement('a');
  link.href = uri;
  //对下载的文件命名
  link.download = '下属加班汇总.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
class WorkOvertimeChart extends React.Component {
  state = {
    selectedMonth: '',
    months: [],
    statisticalData: {
      headcount: 0,
      totalOT: 0,
      averageOT: 0
    },
    tableColumns: [],
    dataSource: [],
    isShowTable: false,
    loading: false
  };
  constructor(props) {
    super(props);
    this.UserCode = JSON.parse(getItem('userInfo')).UserCode;
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }

  async componentDidMount() {
    this._echarts = echarts.init(
      document.getElementById('work-overtime-chart')
    );
    this._echarts.setOption({
      color: colors,
      title: {
        text: 'S3 OT Analysis'
      },
      legend: { data: ['Headcount', 'Average OT(hrs)', 'Total OT(hrs)'] },
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
      yAxis: [
        {
          type: 'value',
          name: 'Headcount',
          position: 'left',
          min: 0,
          max: 150,
          offset: 80,
          axisLine: {
            lineStyle: {
              color: colors[0]
            }
          }
        },
        {
          type: 'value',
          name: 'Average OT(hrs)',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: colors[1]
            }
          },
          min: 0,
          max: 150
        },
        {
          type: 'value',
          name: 'Total OT(hrs)',
          position: 'right',
          axisLine: {
            lineStyle: {
              color: colors[2]
            }
          },
          min: 0,
          max: 10000
        }
      ],
      series: [
        { name: 'Headcount', type: 'bar', yAxisIndex: 0 },
        { name: 'Average OT(hrs)', type: 'bar', yAxisIndex: 1 },
        { name: 'Total OT(hrs)', type: 'bar', yAxisIndex: 2 }
      ]
    });
    this._echarts.on('click', params => {
      this.setState({ isShowTable: true });
      this.getDetailData(params.data.id, this.state.selectedMonth);
    });
    await this.getYearMonths();
    await this.getData();
  }

  getData = async () => {
    try {
      let httpParams = {};

      this._echarts.showLoading();
      const res = await http(httpParams).getTable({
        resid: '617805070334',
        cmswhere: `yearmonth = ${this.state.selectedMonth}`
      });
      this._echarts.hideLoading();
      let headcount = 0,
        totalOT = 0,
        averageOT = 0;
      let source = res.data.map(item => {
        headcount += item.headcount;
        totalOT += item.ot;
        averageOT += item.otaverage;
        return {
          product: item.zw_name,
          Headcount: item.headcount,
          'Average OT(hrs)': item.otaverage,
          'Total OT(hrs)': item.ot,
          id: item.ygno
        };
      });

      this.setState({
        statisticalData: {
          headcount: headcount.toFixed(2),
          totalOT: totalOT.toFixed(2),
          averageOT: averageOT.toFixed(2)
        }
      });
      this._echarts.setOption({
        dataset: {
          dimensions: [
            'product',
            'Headcount',
            'Average OT(hrs)',
            'Total OT(hrs)'
          ],
          source: source
        }
      });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  getYearMonths = async () => {
    try {
      const res = await http().getTable({
        resid: '447426327525',
        dblinkname: 'ehr'
      });
      if (res.data.length) {
        this.setState({
          months: res.data,
          selectedMonth: res.data[0].C3_424358155202
        });
      }
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  getDetailData = async (id, month) => {
    try {
      this.setState({ loading: true });
      const res = await http().getRecordsByProcedure({
        resid: '624039666618',
        paranames: '@leaderygno,@yearmonth',
        paratypes: 'string,string',
        paravalues: `${id},${month}`,
        procedure: 'GetS3OTListByLeaderMonth'
      });
      const columns = res.cmscolumninfo.map(item => {
        return { title: item.text, dataIndex: item.text };
      });
      const dataSource = res.data.map(item => {
        return { ...item, key: item['工号'] };
      });
      this.setState({
        tableColumns: columns,
        dataSource
      });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  };
  onStatisticalDataClick = () => {
    this.setState({ isShowTable: true });
    this.getDetailData(this.UserCode, this.state.selectedMonth);
  };
  render() {
    const {
      selectedMonth,
      statisticalData,
      isShowTable,
      months,
      tableColumns,
      dataSource
    } = this.state;
    return (
      <div className="manager-subordinates">
        <Select
          style={{ width: 120 }}
          placeholder="请选择月份"
          value={selectedMonth}
          onChange={v =>
            this.setState(
              {
                selectedMonth: v
              },
              this.getData
            )
          }
          showSearch
          filterOption={(input, option) => {
            return (
              option.props.children
                .toString()
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            );
          }}
        >
          {months.map(month => (
            <Option value={month.C3_424358155202}>
              {month.C3_424358155202}
            </Option>
          ))}
        </Select>
        <div>
          <table className="manager-subordinates-statistical-table">
            <thead>
              <th>Headcount</th>
              <th>Total OT(hrs)</th>
              <th>Average OT(hrs)</th>
            </thead>
            <tbody>
              <tr>
                <td onClick={this.onStatisticalDataClick}>
                  {statisticalData.headcount}
                </td>
                <td onClick={this.onStatisticalDataClick}>
                  {statisticalData.totalOT}
                </td>
                <td onClick={this.onStatisticalDataClick}>
                  {statisticalData.averageOT}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ display: !isShowTable ? 'none' : '' }}>
          <div style={{ eight: 800 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8
              }}
            >
              <Button onClick={() => this.setState({ isShowTable: false })}>
                返回
              </Button>
              <Button
                onClick={() => {
                  downloadFile(tableColumns, dataSource);
                }}
                type="primary"
              >
                下载
              </Button>
            </div>

            <Table
              columns={tableColumns}
              rowKey={record => record['工号']}
              dataSource={dataSource}
              bordered
              style={{ eight: 800 }}
              // pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
            />
          </div>
        </div>
        <div
          id="work-overtime-chart"
          style={{
            height: 800,
            width: '100%',
            display: isShowTable ? 'none' : ''
          }}
        ></div>
      </div>
    );
  }
}

export default WorkOvertimeChart;
