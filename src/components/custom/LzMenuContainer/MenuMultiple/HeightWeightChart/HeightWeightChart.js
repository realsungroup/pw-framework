import React from 'react';
import PropTypes from 'prop-types';
import './HeightWeightChart.less';
import http, { makeCancelable } from 'Util20/api';
import { message } from 'antd';
import EchartsOfReact from 'echarts-of-react';

const resids = {
  manHeight: 589202100504,
  manWeight: 603827735342,
  womanHeight: 589202110279,
  womanWeight: 589202127006
};

const getXAxisData = () => {
  const ret = [];
  for (let i = 0; i < 217; i++) {
    // 年
    if (i && i % 12 === 0) {
      ret.push({
        value: i / 12 + '岁',
        textStyle: {
          color: 'red'
        }
      });
      // 月
    } else {
      ret.push(i);
    }
  }
  return ret;
};

// 3rd
// 10th
// 25th
// 50th
// 75th
// 90th
// 97th

/**
 * 身高体重
 */
class HeightWeightChart extends React.Component {
  static propTypes = {
    /**
     * 性别
     */
    sex: PropTypes.oneOf(['男', '女']).isRequired,

    /**
     * 图表类型
     */
    chartType: PropTypes.oneOf(['身高', '体重']).isRequired,

    /**
     * 用户身高体重数据
     */
    userData: PropTypes.array.isRequired,

    /**
     * 月份内部字段
     */
    recordMonthField: PropTypes.string.isRequired,

    /**
     * 身高内部字段
     */
    recordHeightField: PropTypes.string.isRequired,

    /**
     * 体重内部字段
     */
    recordWeightField: PropTypes.string.isRequired
  };
  static defaultProps = {};
  constructor(props) {
    super(props);

    const { recordMonthField } = props;
    const params = this.getParams();

    const userData = [...props.userData];

    // 排序（按照月龄升序）
    userData.sort((a, b) => {
      return (
        parseInt(a[recordMonthField], 10) - parseInt(b[recordMonthField], 10)
      );
    });

    this.state = {
      option: {},
      params,
      userData
    };
  }

  componentDidMount = async () => {
    const { resid } = this.state.params;

    this.p1 = makeCancelable(
      http().getTable({
        resid
      })
    );
    let res;
    try {
      res = await this.p1.promise;
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    const option = this.getOption(res.data);
    this.setState({ option });
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
  };

  getSeries = data => {
    const { params, userData } = this.state;
    let ret = [];
    const {
      chartType,
      recordHeightField,
      recordWeightField,
      recordMonthField
    } = this.props;

    let series3rd = { data: [], type: 'line' },
      series10th = { data: [], type: 'line' },
      series25th = { data: [], type: 'line' },
      series50th = { data: [], type: 'line' },
      series75th = { data: [], type: 'line' },
      series90th = { data: [], type: 'line' },
      series97th = { data: [], type: 'line' };

    data.forEach(record => {
      series3rd.data.push(record[params['3rd']]);
      series10th.data.push(record[params['10th']]);
      series25th.data.push(record[params['25th']]);
      series50th.data.push(record[params['50th']]);
      series75th.data.push(record[params['75th']]);
      series90th.data.push(record[params['90th']]);
      series97th.data.push(record[params['97th']]);
    });

    ret = [
      series3rd,
      series10th,
      series25th,
      series50th,
      series75th,
      series90th,
      series97th
    ];

    // 用户曲线数据
    const seriesUser = {
      data: [],
      type: 'line',
      name: chartType
    };

    let field = recordHeightField;
    if (chartType === '体重') {
      field = recordWeightField;
    }

    for (let i = 0; i < 217; i++) {
      const record = userData.find(
        item => parseInt(item[recordMonthField], 10) === i
      );
      // i 月龄存在
      if (record) {
        seriesUser.data.push(record[field]);

        // i 月龄不存在，则补值为 undefined
      } else {
        seriesUser.data.push(undefined);
      }
    }

    ret.push(seriesUser);

    return ret;
  };

  getOption = data => {
    const { chartType } = this.props;

    const { monthAgeField } = this.state.params;

    // 对月龄排序（升序）
    data.sort((a, b) => {
      return parseInt(a[monthAgeField]) - parseInt(b[monthAgeField]);
    });

    const series = this.getSeries(data);

    // 选项配置
    const option = {
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: `{value} ${chartType === '体重' ? 'kg' : 'cm'}`
        }
      },

      // x 轴坐标配置
      xAxis: {
        data: getXAxisData(),
        type: 'category'
      },
      // 折线值
      series,

      // 图例
      legend: {
        data: [chartType]
      },

      dataZoom: [
        {
          type: 'inside',
        },
        {
          type: 'slider',
        },
      ]
    };

    return option;
  };

  getDataItem = (record, _age) => {
    const { params } = this.state;
    const monthAgeField = params.monthAgeField;

    const monthAge3rdValue = record[monthAgeField];

    const age = parseInt(monthAge3rdValue, 10) / 12;
    if (age !== _age) {
      return {
        value: ' '
      };
    } else {
      _age++;
      return {
        // 突出年龄
        value: age + '岁',
        textStyle: {
          color: 'red'
        }
      };
    }
  };

  getParams = () => {
    const { sex, chartType } = this.props;
    if (sex === '男') {
      if (chartType === '身高') {
        return {
          resid: resids.manHeight,
          monthAgeField: 'C3_589223007049',
          '3rd': 'C3_589223007245',
          '10th': 'C3_589223007395',
          '25th': 'C3_589223007546',
          '50th': 'C3_589223007705',
          '75th': 'C3_589223007850',
          '90th': 'C3_589223008011',
          '97th': 'C3_589223008159'
        };
      } else {
        return {
          resid: resids.manWeight,
          monthAgeField: 'C3_589156978205',
          '3rd': 'C3_589157035703',
          '10th': 'C3_589157043361',
          '25th': 'C3_589157048902',
          '50th': 'C3_589157057987',
          '75th': 'C3_589157067324',
          '90th': 'C3_589157072664',
          '97th': 'C3_589157084108'
        };
      }
    } else {
      if (chartType === '身高') {
        return {
          resid: resids.womanHeight,
          monthAgeField: 'C3_589202247307',
          '3rd': 'C3_589202247481',
          '10th': 'C3_589202247640',
          '25th': 'C3_589202247792',
          '50th': 'C3_589202247940',
          '75th': 'C3_589202248090',
          '90th': 'C3_589202248245',
          '97th': 'C3_589202248395'
        };
      } else {
        return {
          resid: resids.womanWeight,
          monthAgeField: 'C3_589202274135',
          '3rd': 'C3_589202274292',
          '10th': 'C3_589202274445',
          '25th': 'C3_589202274616',
          '50th': 'C3_589202274760',
          '75th': 'C3_589202275059',
          '90th': 'C3_589202274911',
          '97th': 'C3_589202275209'
        };
      }
    }
  };

  render() {
    return (
      <div className="height-weight-chart">
        <EchartsOfReact
          id="height-weight-chart"
          defaultWidth={'100%'}
          defaultHeight={600}
          option={this.state.option}
        />
      </div>
    );
  }
}

export default HeightWeightChart;
