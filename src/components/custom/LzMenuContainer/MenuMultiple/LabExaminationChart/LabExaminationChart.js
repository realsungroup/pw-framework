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
    const {
      dateField,
      data,
      fields
    } = this.props;
    // columns
    const columns = [];
    const itemnamecolumndata = {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      align: 'left',
    };
    columns.push(itemnamecolumndata);
    
    const newData = [...data];
    const dsOfTableGrid=[];
    newData.sort((a, b) => moment(a[dateField]).unix() - moment(b[dateField]));

    // x 轴配置信息
    const xAxis = {
      type: 'category',
      data: []
    };
    newData.forEach(item => {
      const value = moment(item[dateField]).format('YYYY-MM-DD');
      xAxis.data.push(value);
      const columndata = {
        title: value,
        dataIndex: moment(item[dateField]).format('YYYYMMDD'),
        key: moment(item[dateField]).format('YYYYMMDD'),
        width: 200,
        align: 'left',
      };
      columns.push(columndata);
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
        const dateColumnName = moment(item[dateField]).format('YYYYMMDD');
        const row={ name: obj.name};
        row[dateColumnName]= value ;
        const index=dsOfTableGrid.findIndex(row => row.name===obj.name);
        if (~index) {
          dsOfTableGrid[index][dateColumnName]=value;

        } else {
          dsOfTableGrid.push(row);
        }
       
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
      legend,
      dataZoom: [
        {
          type: 'inside'
        },
        {
          type: 'slider'
        }
      ]
    };

    option.xAxis = xAxis;

    

    return { option, tableData: newData, columns,dsOfTableGrid };
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    setTimeout(() => {
      const { option, tableData, columns ,dsOfTableGrid} = this.getOption();
      this.setState({ option, loading: false, tableData ,columns,dsOfTableGrid});
    }, 1000);
  };

  componentWillUnmount = () => {};

  render() {
    const { loading, option, tableData, columns,dsOfTableGrid } = this.state;
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
        <div>
        {option && (
            <Table
            columns={columns}
            dataSource={dsOfTableGrid}
            />
          )}
        </div>
      </Spin>
    );
  }
}

export default LabExaminationChart;
