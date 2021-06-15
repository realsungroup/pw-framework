import React from 'react';
import echarts from 'echarts';
import http from 'Util20/api';
import { message, Select, Table, Drawer, Button, Icon, Tooltip } from 'antd';
import { getItem } from 'Util20/util';
import { Resizable } from 'react-resizable';
import { BIGrid } from 'lz-components-and-utils/lib/index';
import './ManagerAttendanceApproval.less';
import PwAggrid from 'Common/ui/PwAggrid';

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
const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

/**
 * 下属加班汇总 e-chart
 * @author 邓铭
 */
class WorkOvertimeChart extends React.Component {
  state = {
    selectedMonth: '', //选中的月
    months: [], //所有月
    statisticalData: {
      //统计数据
      headcount: 0,
      totalOT: 0,
      averageOT: 0
    },
    tableColumns: [],
    dataSource: [],
    isShowTable: false,
    isShowAggird: false,
    employeeId: 0,
    loading: false,
    selectedPersonid: 0,
    cmscolumninfo: []
  };
  components = {
    header: {
      cell: ResizeableTitle
    }
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
      this.setState({ isShowTable: true, selectedPersonid: params.data.id });
      this.getDetailData(params.data.id, this.state.selectedMonth);
    });
    await this.getYearMonths();
    await this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedMonth, selectedPersonid, isShowTable } = this.state;
    if (
      selectedMonth &&
      isShowTable &&
      prevState.selectedMonth !== selectedMonth
    ) {
      if (selectedPersonid) {
        this.getDetailData(
          this.state.selectedPersonid,
          this.state.selectedMonth
        );
      }
    }
  }

  /**
   * 获取统计数据
   */
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

  /**
   * 获取考勤月
   */
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

  /**
   * 获取下属数据
   * @param {string} id 人员工号
   * @param {string} month 选中的考勤月份
   */
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
        return { title: item.text, dataIndex: item.id, width: 100 };
      });
      const dataSource = res.data.map(item => {
        return { ...item, key: item['工号'] };
      });
      this.setState({
        tableColumns: columns,
        dataSource,
        cmscolumninfo: res.cmscolumninfo
      });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  };

  /**
   * 头部统计数据点击事件
   */
  onStatisticalDataClick = () => {
    this.setState({ isShowTable: true, selectedPersonid: this.UserCode });
    this.getDetailData(this.UserCode, this.state.selectedMonth);
  };

  handleResize = index => (e, { size }) => {
    this.setState(({ tableColumns }) => {
      const nextColumns = [...tableColumns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width
      };
      return { tableColumns: nextColumns };
    });
  };

  render() {
    const {
      selectedMonth,
      statisticalData,
      isShowTable,
      isShowAggird,
      months,
      tableColumns,
      dataSource,
      selectedPersonid,
      cmscolumninfo
    } = this.state;
    const columns = this.state.tableColumns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index)
      })
    }));
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
        <div style={{ display: isShowTable ? 'none' : '' }}>
          {/* 头部统计数据 */}
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
          <div className="work-over-time-table">
            <div className="header__icon-buttons">
              <Button
                onClick={() =>
                  this.setState({
                    isShowTable: false,
                    isShowAggird: false,
                    selectedPersonid: this.UserCode
                  })
                }
              >
                返回
              </Button>
              <div>
                <Tooltip title={isShowAggird ? '普通表格' : '动态表格'}>
                  <Icon
                    type="table"
                    className="header__icon-buttons_icon"
                    onClick={() => {
                      this.setState({ isShowAggird: !isShowAggird });
                    }}
                  />
                </Tooltip>
                <Tooltip title="下载">
                  <Icon
                    type="download"
                    className="header__icon-buttons_icon"
                    onClick={() => {
                      downloadFile(tableColumns, dataSource);
                    }}
                  />
                </Tooltip>
              </div>
            </div>
            {isShowAggird ? (
              <div style={{ height: 600 }}>
                <PwAggrid
                  originalColumn={cmscolumninfo}
                  dataSource={dataSource}
                  gridProps={[]}
                  resid={'624039666618'}
                  baseURL={window.pwConfig[process.env.NODE_ENV].baseURL}
                  hasAdd={false}
                  hasModify={false}
                  hasDelete={false}
                  hasImport={false}
                  hasRefresh={false}
                  hasAdvSearch={false}
                  hasDownload={false}
                  sideBarAg={true}
                />
              </div>
            ) : (
                <Table
                  columns={columns}
                  rowKey={record => record['工号']}
                  dataSource={dataSource}
                  bordered
                  // pagination={this.state.pagination}
                  loading={this.state.loading}
                  components={this.components}
                // onChange={this.handleTableChange}
                />
              )}
          </div>
        </div>
        <div
          id="work-overtime-chart"
          style={{
            height: 800,
            width: '100%',
            display: isShowTable ? 'none' : ''
          }}
        />
        <Drawer></Drawer>
      </div>
    );
  }
}

export default WorkOvertimeChart;
