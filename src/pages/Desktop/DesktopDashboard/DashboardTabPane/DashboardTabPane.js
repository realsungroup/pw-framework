import React from 'react';
import DashboardPage from 'lz-components-and-utils/lib/DashboardPage';
import cloneDeep from 'lodash/cloneDeep';
import http from 'Util20/api';
import { message } from 'antd';
import { calcChartOptionByParams } from 'lz-components-and-utils/lib/util';
/**
 * 显示 dashboardPage 时，进行请求、计算 rows
 * @param {array} rows 行数据
 */
const calcRows = async rows => {
  const pArr = [];

  // 将每个获取某个曲线数据的 Promise push 进 pArr 数组中
  rows.forEach(rowItem => {
    rowItem.cols.forEach(colItem => {
      const { settingForm } = colItem;
      const { resid, bAreaFields, aAreaFields, where } = settingForm;

      const categoryFieldItem = aAreaFields[0];
      const categoryField = categoryFieldItem.id;
      const sort = categoryFieldItem.sort;

      bAreaFields.forEach(fieldItem => {
        const af = fieldItem.af;
        if (af) {
          const valueField = fieldItem.id;
          const aggregateFunctionObj = {
            min: `${categoryField},min(${valueField}) ${valueField}`,
            max: `${categoryField},max(${valueField}) ${valueField}`,
            avg: `${categoryField},avg(${valueField}) ${valueField}`,
            count: `${categoryField},count(${valueField}) ${valueField}`,
            'count(distinct)': `${categoryField},count(distinct ${valueField}) ${valueField}`,
            sum: `${categoryField},sum(${valueField}) ${valueField}`
          };
          const params = {
            resid,
            fields: aggregateFunctionObj[af],
            groupby: categoryField,
            cmswhere: where
          };
          if (sort) {
            params.orderby = `${categoryField} ${sort}`;
          }
          pArr.push(http().getFieldAggregateValue(params));
        } else {
          pArr.push(
            http().getTable({
              resid,
              sortField: categoryField,
              sortOrder: sort,
              cmswhere: where
            })
          );
        }
      });
    });
  });

  // 获取曲线数据
  let res;
  try {
    res = await Promise.all(pArr);
  } catch (err) {
    console.error(err);
    return message.error(err.message);
  }

  // 将获取到的曲线数据进行计算，得到 option，最后修改 rows
  let i = 0;
  rows.forEach(rowItem => {
    rowItem.cols.forEach(colItem => {
      const { settingForm } = colItem;
      const { bAreaFields, aAreaFields } = settingForm;

      const categoryFieldItem = aAreaFields[0];
      const sort = categoryFieldItem.sort;
      // 修改 aAreaFields 和 bAreaFields
      bAreaFields.forEach(fieldItem => {
        // 本字段使用了聚合函数
        if (fieldItem.af) {
          fieldItem.sort = sort;
          fieldItem.records = res[i].data;
          aAreaFields[0].records = res[i].data;
          aAreaFields[0].sort = sort;
          // 未使用聚合函数
        } else {
          settingForm.records = res[i].data;
          settingForm.aAreaFields[0].sort = sort;
        }
        i++;
      });
      // 计算得到 option
      const option = calcChartOptionByParams({
        type: colItem.chartType,
        ...settingForm
      });
      colItem.props.option = option;
    });
  });
};

export default class DashboardTabPane extends React.PureComponent {
  state = {
    hasReqChartData: false, // 是否请求了图表数据
    rows: []
  };

  componentDidMount = async () => {
    const newRows = cloneDeep(this.props.rows);
    await calcRows(newRows);
    this.setState({ rows: newRows, hasReqChartData: true });
  };
  getData = async () => {};

  render() {
    if (!this.state.hasReqChartData) {
      return (
        <div style={{ textAlign: 'center', marginTop: 100 }}>加载中...</div>
      );
    } else {
      return <DashboardPage rows={this.state.rows} mode="view" baseURL={window.pwConfig[process.env.NODE_ENV].biBaseURL} />;
    }
  }
}
