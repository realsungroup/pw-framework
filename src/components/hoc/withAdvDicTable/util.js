// 返回高级字典中过滤字段的值
const retFilterFieldValues = innerFieldNames => {
  const { getFieldValue } = this.props.form;
  const colValues = [];
  innerFieldNames.forEach(innerFieldName => {
    colValues.push({
      col1: innerFieldName.col1,
      col1Value: getFieldValue(innerFieldName.col1),
      col2: innerFieldName.col2
    });
  });
  return colValues;
};

// 获取 cmscolumns 查询语句
export const getCmscolumns = advData => {
  let str = '';
  const len = advData.MatchAndReferenceCols.length;

  advData.MatchAndReferenceCols.forEach((item, index) => {
    index === len - 1 ? (str += item.CDZ2_COL2) : (str += item.CDZ2_COL2 + ',');
  });
  return str;
};

// 获取由过滤字段组合成的 cmswhere 查询语句，来查询高级字典表格的数据
export const getCmswhere = advData => {
  const innerFieldNames = advData.DictionaryFilterCol.map(item => {
    return { col1: item.Column1, col2: item.Column2 };
  });
  if (!retFilterFieldValues || innerFieldNames.length === 0) {
    return;
  }
  const colValues = retFilterFieldValues(innerFieldNames);
  let where = '';
  colValues.forEach((colValue, index) => {
    if (index === colValues.length - 1) {
      colValue.col1Value &&
        (where += colValue.col2 + "='" + colValue.col1Value + "'"); // 需要用单引号将字段值括起来
    } else {
      colValue.col1Value &&
        (where += colValue.col2 + "='" + colValue.col1Value + "'" + ' and ');
    }
  });
  return where;
};
