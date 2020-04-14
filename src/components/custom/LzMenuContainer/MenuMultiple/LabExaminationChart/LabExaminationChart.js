import React from "react";
import PropTypes from "prop-types";
import "./LabExaminationChart.less";
import { Spin, Table } from "antd";
import EchartsOfReact from "echarts-of-react";
import moment from "moment";

const colors = [
  "#c23531",
  "#2f4554",
  "#61a0a8",
  "#d48265",
  "#91c7ae",
  "#749f83",
  "#ca8622",
  "#bda29a",
  "#6e7074",
  "#546570",
  "#14c263",
  "#cd12a9",
  "#912389",
  "#a829f3",
  "#1c61f6",
  "#7ac421"
];
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
    dateField: PropTypes.string.isRequired,

    /**
     * echart id
     */
    chartid: PropTypes.string,
    chartVisible: PropTypes.bool
  };
  static defaultProps = {
    chartid: "lab-examination-chart",
    chartVisible: true
  };
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
    const { dateField, data, fields, colInfo } = this.props;
    // columns
    const columns = [];
    const itemnamecolumndata = {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      align: "left"
    };
    columns.push(itemnamecolumndata);

    const newData = [...data];
    const dsOfTableGrid = [];
    newData.sort((a, b) => moment(a[dateField]).unix() - moment(b[dateField]));

    // x 轴配置信息
    const xAxis = {
      type: "category",
      data: []
    };
    newData.forEach(item => {
      const value = moment(item[dateField]).format("YYYY-MM-DD");
      xAxis.data.push(value);
      const columndata = {
        title: value,
        dataIndex: moment(item[dateField]).format("YYYYMMDD"),
        key: moment(item[dateField]).format("YYYYMMDD"),
        width: 200,
        align: "left"
      };
      columns.push(columndata);
    });

    // 曲线配置
    const series = [];
    const yAxis = [];
    // 图例配置
    const legend = { data: [] };
    fields.forEach((field, index) => {
      const obj = {
        name: field.title,
        type: "line",
        data: [],
        yAxisIndex: index
      };
      const _yAxis = {
        // name: field.title,
        type: "value",
        position: "left ",
        axisLine: {
          lineStyle: {
            color: colors[index]
          }
        }
      };
      if (index % 2 === 0) {
        _yAxis.position = "left";
        _yAxis.offset = (index / 2) * 35;
      } else {
        _yAxis.position = "right";
        _yAxis.offset = (index / 2) * 35;
      }
      yAxis.push(_yAxis);
      newData.forEach(item => {
        let colinfo = colInfo.find(col => col.ColName === field.field);
        let value = item[field.field];
        if (colinfo.ColValType === 14) {
          const options = colinfo.ListOfColOptions;
          const isMultiple = colinfo.ColParam10;
          if (isMultiple) {
            if (typeof value === "string" && value) {
              value = value.split(",");
            }
            const arr = options.map(option => {
              if (
                Array.isArray(value) &&
                value.find(item => item === option.valueColValue)
              ) {
                return option.displayColValue;
              }
            });
            value = arr || [];
            value = value.filter(item => item).join(",");
          }
        }

        obj.data.push(value);
        const dateColumnName = moment(item[dateField]).format("YYYYMMDD");
        const row = {
          name: obj.name
        };
        row[dateColumnName] = value;
        const index = dsOfTableGrid.findIndex(row => row.name === obj.name);
        if (~index) {
          dsOfTableGrid[index][dateColumnName] = value;
        } else {
          dsOfTableGrid.push(row);
        }
      });
      legend.data.push(field.title);
      series.push(obj);
    });

    const option = {
      // yAxis: {
      //   type: "value"
      // },
      yAxis,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      },
      xAxis,
      series,
      legend,
      dataZoom: [
        {
          type: "inside"
        },
        {
          type: "slider"
        }
      ],
      color: colors,
      grid: {
        left: "20%",
        right: "20%"
      }
    };

    option.xAxis = xAxis;

    return { option, tableData: newData, columns, dsOfTableGrid };
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    setTimeout(() => {
      const { option, tableData, columns, dsOfTableGrid } = this.getOption();
      this.setState({
        option,
        loading: false,
        tableData,
        columns,
        dsOfTableGrid
      });
    }, 1000);
  };

  componentWillUnmount = () => {};

  render() {
    const { loading, option, tableData, columns, dsOfTableGrid } = this.state;
    const { chartid, chartVisible } = this.props;
    return (
      <Spin spinning={loading}>
        {chartVisible && (
          <div className="lab-examination-chart">
            {option && (
              <EchartsOfReact
                id={chartid}
                defaultWidth={"100%"}
                defaultHeight={600}
                option={option}
              />
            )}
          </div>
        )}
        <div style={{ width: "100%", overflow: "auto" }}>
          {option && <Table columns={columns} dataSource={dsOfTableGrid} />}
        </div>
      </Spin>
    );
  }
}

export default LabExaminationChart;
