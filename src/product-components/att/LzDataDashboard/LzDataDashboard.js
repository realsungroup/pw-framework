import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  message,
  Card,
  Table,
  DatePicker,
  Spin,
  Collapse,
  Button,
  Modal,
  Select
} from 'antd';
import './LzDataDashboard.less';
import { getMainTableData } from 'Util/api';

// echarts
import EchartsOfReactCore from 'echarts-of-react/lib/EchartsOfReactCore';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';

import moment from 'moment';
import LzTable from '../../../lib/unit-component/LzTable';
import html2canvas from 'html2canvas';
import cloneDeep from 'lodash.clonedeep';

const Option = Select.Option;
const Panel = Collapse.Panel;

const columns = [
  {
    title: '部门',
    dataIndex: 'deptname',
    key: 'deptname'
  },
  {
    title: '> target HC',
    children: [
      {
        title: 'Daily',
        dataIndex: 'OverDayTargetHc'
      },
      {
        title: 'MTD',
        dataIndex: 'OverMonthTargetHc'
      }
    ]
  },
  {
    title: '> target HC / Total HC',
    children: [
      {
        title: 'Daily',
        dataIndex: 'DayOvertTargetRatio'
      },
      {
        title: 'MTD',
        dataIndex: 'MonthOvertTargetRatio'
      }
    ]
  },
  {
    title: 'Average OT Hours',
    children: [
      {
        title: 'Daily',
        dataIndex: 'AverageDayOtHrs'
      },
      {
        title: 'MTD',
        dataIndex: 'AverageMonthOtHrs'
      }
    ]
  }
];

function getEchartOption(
  xAxisData = [],
  data1 = [],
  data2 = [],
  standardValue1 = 0,
  standardValue2 = 0,
  yAxisMax
) {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: ['Average OT Hours', '> target HC / Total HC']
    },
    xAxis: [
      {
        type: 'category',
        data: xAxisData,
        axisPointer: {
          type: 'shadow'
        },
        axisLabel: {
          interval: 0,
          rotate: -30
        }
      }
    ],
    grid: {
      // left: '10%',
      bottom: '35%'
    },
    yAxis: [
      {
        type: 'value',
        name: 'Average OT Hours',
        axisLabel: {
          formatter: '{value}h'
        },
        max: yAxisMax
      },
      {
        type: 'value',
        name: '> target HC / Total HC',
        axisLabel: {
          formatter: '{value}%'
        },
        max: 100
      }
    ],
    series: [
      {
        name: 'Average OT Hours',
        type: 'bar',
        data: data1,
        markLine: {
          label: {
            formatter: `Target: ${standardValue1}h`
          },
          data: [{ yAxis: standardValue1, name: '1' }]
        }
      },
      {
        name: '> target HC / Total HC',
        type: 'line',
        yAxisIndex: 1,
        data: data2,
        markLine: standardValue2
          ? {
              label: {
                formatter: `Target: ${standardValue2}%`
              },
              data: [{ yAxis: standardValue2, name: '2' }]
            }
          : {}
      }
    ]
  };
}

/**
 * 数据看板
 */
export default class LzDataDashboard extends React.Component {
  static propTypes = {
    cardsResid: PropTypes.number,
    tableResid: PropTypes.number,

    cardsTitle: PropTypes.string,
    tableTitle: PropTypes.string,
    /**
     * 线长看板需要使用 LzTable 组件，所以线长看板需要配置 isUseTLzTable 为 true
     */
    isUseLzTable: PropTypes.bool
  };

  static defaultProps = {
    isUseLzTable: false
  };

  constructor(props) {
    super(props);

    const activeKey = [
      props.cardsTitle,
      props.tableTitle,
      'Daily OT Summary',
      'MTD OT Summary'
    ];
    this.state = {
      cardRecord: {}, // 卡片组件记录
      tableData: [], // 表格数据
      dayilyOption: {},
      monthOption: {},
      loading: false,
      selectedDate: moment(),
      activeKey,
      screenshotVisible: false,
      departments: [], // 所有部门
      selectedDepartments: [] // 已选部门
    };
  }

  componentDidMount() {
    this.getData(this.state.selectedDate);
  }

  getData = async selectedDate => {
    this.setState({ loading: true });
    if (!(selectedDate instanceof moment)) {
      this.setState({ loading: false });
      return message.error('请选择日期');
    }
    const cmswhere = `dates = ${selectedDate.format('YYYYMMDD')}`;
    const option = { cmswhere };
    let res;
    const pArr = [getMainTableData(this.props.cardsResid, option)];
    if (!this.props.isUseLzTable) {
      pArr.push(getMainTableData(this.props.tableResid, option));
    }
    try {
      res = await Promise.all(pArr);
    } catch (err) {
      this.setState({ loading: false });
      message.error(err.message);
    }
    let cardRecord = {};
    if (res[0].data.length) {
      cardRecord = res[0].data[0];
    }
    let tableData = [],
      departments = [],
      selectedDepartments;
    let xAxisData = [],
      dayilyData = {
        data1: [],
        data2: []
      },
      monthData = {
        data1: [],
        data2: []
      },
      dayilyStandardValue = {
        value1: 0,
        value2: 0
      },
      monthStandardValue = {
        value1: 0,
        value2: 0
      },
      dayilyOption = {},
      monthOption = {};
    if (res[1] && res[1].data.length) {
      res[1].data.forEach((item, index) => {
        item.id = index;
        item.DayOvertTargetRatio =
          Math.round(item.DayOvertTargetRatio * 100, 2) + '%';
        item.MonthOvertTargetRatio =
          Math.round(item.MonthOvertTargetRatio * 100, 2) + '%';
        // echart data
        xAxisData.push(item.deptname);

        dayilyData.data1.push(item.AverageDayOtHrs);
        dayilyData.data2.push(parseFloat(item.DayOvertTargetRatio, 10));

        monthData.data1.push(item.AverageMonthOtHrs);
        monthData.data2.push(parseFloat(item.MonthOvertTargetRatio));

        dayilyStandardValue.value1 = item.dayhrs;
        // dayilyStandardValue.value2 = item.xxx; // 第二条标准线暂时不需要

        // monthStandardValue.value1 = item.monhrs;
        monthStandardValue.value1 = item.monhrs;
        // monthStandardValue.value2 = item.xxx; // 第二条标准线暂时不需要
      });
      tableData = res[1].data;
      dayilyOption = getEchartOption(
        xAxisData,
        dayilyData.data1,
        dayilyData.data2,
        dayilyStandardValue.value1,
        undefined,
        15
      );
      monthOption = getEchartOption(
        xAxisData,
        monthData.data1,
        monthData.data2,
        monthStandardValue.value1,
        undefined,
        100
      );
      // 所有部门
      departments = tableData.map(item => ({
        label: item.deptname,
        value: item.deptname
      }));

      selectedDepartments = departments.map(item => item.value);
      this._tableData = tableData;
    }

    this.setState({
      cardRecord,
      tableData,
      dayilyOption,
      monthOption,
      loading: false,
      selectedDate,
      departments,
      selectedDepartments
    });
  };

  handleDateChange = date => {
    this.getData(date);
  };

  handleCollapseChange = activeKey => {
    this.setState({ activeKey });
  };

  handleExportImgBtnClick = () => {
    html2canvas(document.querySelector('.lz-data-dashboard__collapse')).then(
      canvas => {
        this.setState({ screenshotVisible: true }, () => {
          setTimeout(() => {
            console.log(document.querySelector('#lz-data-dashboard'));
            document.querySelector('#lz-data-dashboard').appendChild(canvas);
          }, 0);
        });
      }
    );
  };

  handleSelectedDepartmentsChange = selectedDepartments => {
    this.updateTableAndChartData(selectedDepartments);
  };

  updateTableAndChartData = selectedDepartments => {
    const tableData = this._tableData.filter(item => {
      if (
        selectedDepartments.some(
          selectedDepartment => selectedDepartment === item.deptname
        )
      ) {
        return true;
      }
    });
    let xAxisData = [],
      dayilyData = {
        data1: [],
        data2: []
      },
      monthData = {
        data1: [],
        data2: []
      },
      dayilyStandardValue = {
        value1: 0,
        value2: 0
      },
      monthStandardValue = {
        value1: 0,
        value2: 0
      },
      dayilyOption = {},
      monthOption = {};
    tableData.forEach((item, index) => {
      item.id = index;
      item.DayOvertTargetRatio =
        Math.round(item.DayOvertTargetRatio * 100, 2) + '%';
      item.MonthOvertTargetRatio =
        Math.round(item.MonthOvertTargetRatio * 100, 2) + '%';
      // echart data
      xAxisData.push(item.deptname);

      dayilyData.data1.push(item.AverageDayOtHrs);
      dayilyData.data2.push(parseFloat(item.DayOvertTargetRatio, 10));

      monthData.data1.push(item.AverageMonthOtHrs);
      monthData.data2.push(parseFloat(item.MonthOvertTargetRatio));

      dayilyStandardValue.value1 = item.dayhrs;
      // dayilyStandardValue.value2 = item.xxx; // 第二条标准线暂时不需要

      // monthStandardValue.value1 = item.monhrs;
      monthStandardValue.value1 = item.monhrs;
      // monthStandardValue.value2 = item.xxx; // 第二条标准线暂时不需要
    });
    dayilyOption = getEchartOption(
      xAxisData,
      dayilyData.data1,
      dayilyData.data2,
      dayilyStandardValue.value1,
      undefined,
      15
    );
    monthOption = getEchartOption(
      xAxisData,
      monthData.data1,
      monthData.data2,
      monthStandardValue.value1,
      undefined,
      100
    );
    this.setState({
      tableData,
      dayilyOption,
      monthOption,
      selectedDepartments
    });
  };

  render() {
    const {
      cardRecord,
      tableData,
      dayilyOption,
      monthOption,
      loading,
      selectedDate,
      activeKey,
      screenshotVisible,
      selectedDepartments,
      departments
    } = this.state;
    const {
      cardsTitle,
      tableTitle,
      isUseLzTable,
      tableResid,
      index
    } = this.props;
    const hasCards = !!Object.keys(cardRecord).length;
    const hasTable = !!tableData.length;
    const hasTableChart = hasTable;
    const cmswhere = `dates = ${selectedDate.format('YYYYMMDD')}`;
    console.log('departments:', departments);
    return (
      <Spin spinning={loading}>
        <div className="lz-data-dashboard">
          {/* select date */}
          <div className="lz-data-dashboard__date-picker">
            <i className="iconfont icon-rili" />
            <DatePicker value={selectedDate} onChange={this.handleDateChange} />

            <Button
              style={{ marginLeft: 10 }}
              onClick={this.handleExportImgBtnClick}
            >
              导出图片
            </Button>
          </div>

          <div>
            <span>选择部门：</span>
            <Select
              mode="multiple"
              placeholder="请选择部门（可多选）"
              value={selectedDepartments}
              onChange={this.handleSelectedDepartmentsChange}
              style={{ minWidth: 200 }}
            >
              {departments.map(department => (
                <Option key={department.value} value={department.value}>
                  {department.label}
                </Option>
              ))}
            </Select>
          </div>

          <Collapse
            className="lz-data-dashboard__collapse"
            onChange={this.handleCollapseChange}
            activeKey={activeKey}
            style={{ marginTop: 20 }}
          >
            <Panel header={cardsTitle} key={cardsTitle}>
              {hasCards ? (
                <div className="lz-data-dashboard__cards">
                  <Card
                    className="lz-data-dashboard__card"
                    title={cardRecord.deptname}
                    extra={
                      <span className="lz-data-dashboard__cards-extra">日</span>
                    }
                  >
                    <div className="lz-data-dashboard__cards-content">
                      <span>> target HC</span>
                      <span>{cardRecord.OverDayTargetHc}</span>
                    </div>
                    <div className="lz-data-dashboard__cards-content">
                      <span>> target HC / Total HC</span>
                      <span>
                        {Math.round(cardRecord.DayOvertTargetRatio * 100, 2) +
                          '%'}
                      </span>
                    </div>
                    <div className="lz-data-dashboard__cards-content">
                      <span>Average OT Hours</span>
                      <span>{Math.round(cardRecord.AverageDayOtHrs)}</span>
                    </div>
                    <div className="lz-data-dashboard__cards-content">
                      <span>(target HC) - (> target HC)</span>
                      <span>{Math.round(cardRecord.OvrDayAmountLimit)}</span>
                    </div>
                  </Card>
                  <Card
                    className="lz-data-dashboard__card"
                    title={cardRecord.deptname}
                    extra={
                      <span className="lz-data-dashboard__cards-extra">月</span>
                    }
                  >
                    <div className="lz-data-dashboard__cards-content">
                      <span>> target HC</span>
                      <span>{cardRecord.OverMonthTargetHc}</span>
                    </div>
                    <div className="lz-data-dashboard__cards-content">
                      <span>> target HC / Total HC</span>
                      <span>
                        {Math.round(cardRecord.MonthOvertTargetRatio * 100, 2) +
                          '%'}
                      </span>
                    </div>
                    <div className="lz-data-dashboard__cards-content">
                      <span>Average OT Hours</span>
                      <span>{Math.round(cardRecord.AverageMonthOtHrs, 2)}</span>
                    </div>
                    <div className="lz-data-dashboard__cards-content">
                      <span>(target HC) - (> target HC)</span>
                      <span>{Math.round(cardRecord.OvrMonAmountLimit)}</span>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="lz-data-dashboard__nodata">暂无数据</div>
              )}
            </Panel>
            <Panel header={tableTitle} key={tableTitle}>
              {(function() {
                if (isUseLzTable) {
                  return <LzTable resid={tableResid} cmswhere={cmswhere} />;
                } else {
                  if (!isUseLzTable) {
                    return (
                      <div className="lz-data-dashboard__table">
                        <Table
                          columns={columns}
                          dataSource={tableData}
                          bordered
                          rowKey="id"
                          pagination={false}
                          size="small"
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="lz-data-dashboard__nodata">暂无数据</div>
                    );
                  }
                }
              })()}
            </Panel>
            <Panel header="Daily OT Summary" key="Daily OT Summary">
              {hasTableChart ? (
                <EchartsOfReactCore
                  echarts={echarts}
                  defaultWidth="100%"
                  defaultHeight={400}
                  id={`lz-data-dashboard-dayilychart-${index}`}
                  option={dayilyOption}
                />
              ) : (
                <Fragment>
                  {!isUseLzTable && (
                    <div className="lz-data-dashboard__nodata">暂无数据</div>
                  )}
                </Fragment>
              )}
            </Panel>
            <Panel header="MTD OT Summary" key="MTD OT Summary">
              {hasTableChart ? (
                <EchartsOfReactCore
                  echarts={echarts}
                  defaultWidth="100%"
                  defaultHeight={400}
                  id={`lz-data-dashboard-monthchart-${index}`}
                  option={monthOption}
                />
              ) : (
                <Fragment>
                  {!isUseLzTable && (
                    <div className="lz-data-dashboard__nodata">暂无数据</div>
                  )}
                </Fragment>
              )}
            </Panel>
          </Collapse>
          <Modal
            title="截图查看"
            width="100%"
            visible={screenshotVisible}
            destroyOnClose
            footer={null}
            onCancel={() => this.setState({ screenshotVisible: false })}
            style={{ top: 0 }}
          >
            <div id="lz-data-dashboard" style={{ textAlign: 'center' }} />
          </Modal>
        </div>
      </Spin>
    );
  }
}
