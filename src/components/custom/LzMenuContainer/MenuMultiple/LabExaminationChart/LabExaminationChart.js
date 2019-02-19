import React from 'react';
import PropTypes from 'prop-types';
import './LabExaminationChart.less';
import { Spin, Table } from 'antd';
import EchartsOfReact from 'echarts-of-react';
import moment from 'moment';

/**
 * 实验室检查图表
 */
class LabExaminationChart extends React.Component {
  static propTypes = {
    /**
     * 需要显示在图表中的字段以及字段名称
     */
    fields: PropTypes.array.isRequired,

    /**
     * 实验室检查表数据
     */
    data: PropTypes.array.isRequired,

    /**
     * 日期字段
     */
    dateField: PropTypes.string.isRequired
  };
  static defaultProps = {};
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      option: null,
      tableData: [],
      columns: []
    };
  }

  getOption = () => {
    const { dateField, data, fields } = this.props;

    const newData = [...data];
    newData.sort((a, b) => moment(a[dateField]).unix() - moment(b[dateField]));

    // x 轴配置信息
    const xAxis = {
      type: 'category',
      data: []
    };
    newData.forEach(item => {
      const value = moment(item[dateField]).format('YYYY-MM-DD');
      xAxis.data.push(value);
    });

    // 曲线配置
    const series = [];
    // 图例配置
    const legend = { data: [] };
    fields.forEach(field => {
      const obj = { name: field.title, type: 'line', data: [] };
      newData.forEach(item => {
        const value = item[field.field];
        obj.data.push(value);
      });
      legend.data.push(field.title);
      series.push(obj);
    });

    const option = {
      yAxis: {
        type: 'value'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis,
      series,
      legend
    };

    option.xAxis = xAxis;

    // columns
    const columns = [];

    return { option, tableData: newData, columns };
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    setTimeout(() => {
      const { option, tableData, columns } = this.getOption();
      this.setState({ option, loading: false, tableData });
    }, 1000);
  };

  componentWillUnmount = () => {};

  render() {
    const { loading, option, tableData, columns } = this.state;
    return (
      <Spin spinning={loading}>
        <div className="lab-examination-chart">
          {option && (
            <EchartsOfReact
              id="lab-examination-chart"
              defaultWidth={'100%'}
              defaultHeight={600}
              option={option}
            />
          )}
        </div>
      </Spin>
    );
  }
}

export default LabExaminationChart;
