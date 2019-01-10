import { getRules, ControlCode } from './controls';
import moment from 'moment';
import cloneDeep from 'lodash.clonedeep';


const assortFields = controlArr => {
  if (!controlArr || !controlArr.length) {
    return [];
  }
  const filteredControlArr = controlArr.filter(
    control => control.ColResDataSort
  );
  const klasses = [];
  filteredControlArr.forEach(control => {
    let i;
    if (
      !klasses.some((klass, index) => {
        if (klass.title === control.ColResDataSort) {
          i = index;
          return true;
        }
      })
    ) {
      klasses.push({
        title: control.ColResDataSort,
        renderControlArr: [control]
      });
    } else {
      klasses[i].renderControlArr.push(control);
    }
  });
  return klasses;
};

const getControlName = controlData => {
  const type = controlData.ColValType;
  switch (type) {
    // Input
    case ControlCode.Input:
    case ControlCode.IncrementalCoding:
    case ControlCode.AutoCoding: {
      return 'Input';
    }
    // TextArea
    case ControlCode.LongText: {
      return 'TextArea';
    }
    // DatePicker
    case ControlCode.Date: {
      return 'DatePicker';
    }
    // RadioGroup
    case ControlCode.RadioGroup:
    case ControlCode.Checkbox: {
      return 'RadioGroup';
    }
    // Select
    case ControlCode.OptionValue:
    case ControlCode.OptionDictionary:
    case ControlCode.OptionDepartment: {
      return 'Select';
    }

    // Search
    case ControlCode.AdvDictionary: {
      return 'Search';
    }
    // DateTimePicker
    case ControlCode.Time: {
      return 'DateTimePicker';
    }
    // Upload
    case ControlCode.ImageSelect:
    case ControlCode.FileSelect: {
      return 'Upload';
    }
  }
};

// 获取由过滤字段组合成的 cmswhere 查询语句，来查询高级字典表格的数据
const getCmswhere = advData => {
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

// 获取 cmscolumns 查询语句
const getCmscolumns = advData => {
  let str = '';
  const len = advData.MatchAndReferenceCols.length;

  advData.MatchAndReferenceCols.forEach((item, index) => {
    index === len - 1 ? (str += item.CDZ2_COL2) : (str += item.CDZ2_COL2 + ',');
  });
  return str;
};

// 获取匹配字段
const getMatchFields = (advData) => {
  const matchFields = advData.MatchAndReferenceCols.filter(item => {
    return item.CDZ2_TYPE === 0;
  });
  return matchFields;
}


const getProps = (controlData, name, handleSearch) => {
  const { FrmReadonly, ColIsReadOnly } = controlData;
  const props = {};

  // 获取 Select 的 options prop
  if (name === 'Select') {
    const type = controlData.ColValType;
    switch (type) {
      // 下拉框：Select
      case ControlCode.OptionValue: {
        const options = controlData.DisplayOptions;
        props.options = options.map(option => ({
          label: option.displayColValue,
          value: option.valueColValue
        }));
      }
      // 下拉框部门：Select
      case ControlCode.OptionDepartment: {
        const labelOptions = controlData.DisplayOptions;
        const valueOptions = controlData.ValueOptions;
        props.options = labelOptions.map((label, index) => ({
          label,
          value: valueOptions[index]
        }));
      }
      // 下拉字典：Select
      case ControlCode.OptionDictionary: {
        const options = controlData.ListOfColOptions;
        props.options = options.map(option => ({
          label: option.displayColValue,
          value: option.valueColValue
        }));
      }
    }
  }

  // 'Search' 添加搜索按钮
  if (name === 'Search') {
    const advData = controlData.AdvDictionaryListData[0];

    if (!advData) {
      alert('advDictionatyData.AdvDictionaryListData 为空数组');
      return;
    }

    const resid = advData.ResID2;
    const cmscolumns = getCmsColumns(advData);
    const cmswhere = getCmswhere(advData);

    props.enterButton = true;
    props.disabled = true;
    // Input.Search 控件点击搜索或按下回车时的回调
    props.onSearch = () => {
      handleSearch(
        {
          resid,
          cmscolumns,
          cmswhere,
          hasAdd: false,
          hasModify: false,
          hasDelete: false,
          hasRowModify: false,
          hasRowView: false,
          hasRowDelete: false,
          hasDownload: false,
          hasRefresh: false,
          hasAdvSearch: false,
          subtractH: 165,
          height: 400
        },
        controlData
      );
    };
  }

  props.disabled = !!(FrmReadonly || ColIsReadOnly);

  return props;
};

// 获取 cmscolumns 查询语句
const getCmsColumns = advData => {
  let str = '';
  const len = advData.MatchAndReferenceCols.length;

  advData.MatchAndReferenceCols.forEach((item, index) => {
    index === len - 1 ? (str += item.CDZ2_COL2) : (str += item.CDZ2_COL2 + ',');
  });
  return str;
};



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

const getValue = (name, record, controlData, operation) => {
  const value = record[controlData.ColName];
  if (operation === 'view') {
    return value;
  }
  if (name === 'DateTimePicker') {
    return moment(value);
  }
  return value;
};

const getData = (
  canOpControlArr,
  record,
  operation,
  handleSearch,
  rulesControl
) => {
  const data = [];
  canOpControlArr.forEach(controlData => {
    // id 在后端表示内部字段
    const id = controlData.ColName;
    const obj = {
      controlData: controlData,
      id,
      label: controlData.ColDispName,
      labelCol: 8,
      wrapperCol: 16,
      name: getControlName(controlData)
    };
    // 所有控件都加上验证规则
    if (typeof rulesControl === 'boolean') {
      obj.rules = getRules(controlData);

      // 指定的字段加上验证规则
    } else if (Array.isArray(rulesControl)) {
      let result = rulesControl.some(innerFieldName => innerFieldName === id);
      if (result) {
        obj.rules = getRules(controlData);
      }
    } else {
      throw new Error('rulesControl 类型应该为 `boolean` 或 `array`');
    }
    // obj.value = getValue(obj.name, record, controlData, operation);
    // obj.initialValue = getValue(obj.name, record, controlData, operation);
    obj.props = getProps(controlData, obj.name, handleSearch);

    // 高级字典表格接收的 props
    if (obj.name === 'Search') {
      const advData = controlData.AdvDictionaryListData[0];
      if (!advData) {
        alert('advDictionatyData.AdvDictionaryListData 为空数组');
        return;
      }
      obj.advDicTableProps = {
        // 匹配字段
        resid: advData.ResID2,
        cmsWhere: getCmswhere(advData),
        cmscolumns: getCmscolumns(advData),
        matchFields: getMatchFields(advData), // 匹配字段（即高级字典表中的字段对应表单中的字段，如：[{ CDZ2_COL1: 111, CDZ2_COL2: 222 }, { CDZ2_COL1: 111, CDZ2_COL2: 222 }]）
        // 得到匹配字段的话，可以由选择的高级字典表中记录得到表单中字段的值（一一对应）
        // 高级字典默认 props
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        hasDownload: false,
        hasRefresh: false,
        hasAdvSearch: false,
        subtractH: 165,
        height: 400
      }

    }
    data.push(obj);
  });

  return data;
};

/**
 * 获取 PwForm 接收的 data prop
 * @param {string} operation 操作：'add' 添加 | 'modify' 修改 | 'view' 查看
 * @param {object} record 记录
 * @param {object} formData 窗体数据
 * @param {object} formProps PwForm 组件所接收的其他 props，默认：{}
 * @param {array | boolean} rulesControl
 * 含有验证规则的控件数据，默认：true，表示所有控件都需要添加验证规则；
 * 若 rulesControl = ['name', 'age']，则表示只有 'name' 和 'age' 字段才需要添加验证规则，其他字段的控件需不要验证
 */
export const getDataProp = (
  operation,
  record,
  formData,
  formProps = {},
  handleSearch,
  rulesControl = true
) => {
  let data = [];
  const { canOpControlArr } = formData;
  const { displayMode = 'default' } = formProps;

  // 默认布局
  if (displayMode === 'default') {
    data = getData(
      canOpControlArr,
      record,
      operation,
      handleSearch,
      rulesControl
    );

    // 分类布局
  } else if (displayMode === 'classify') {
    const klasses = assortFields(canOpControlArr);
    console.log({ klasses });

    klasses.forEach(klass => {
      const obj = {
        type: klass.title,
        data: getData(
          klass.renderControlArr,
          record,
          operation,
          handleSearch,
          rulesControl
        )
      };
      data.push(obj);
    });
  }

  let isTransformValue = true;
  if (operation === 'view') {
    isTransformValue = false;
  }
  data = setDataInitialValue(data, record, isTransformValue);
  return data;
};

/**
 * 设置所有控件的 initialValue 属性值
 * @param {array} data 所有控件数据
 * @param {object} record 记录
 * @param {boolean} isTransformValue 是否转换值（如：'2019-01-10' 转换为 moment 对象），默认值：false
 */
export const setDataInitialValue = (data, record, isTransformValue = false) => {
  const newData = cloneDeep(data);
  newData.forEach(dataItem => {
    dataItem.initialValue = record[dataItem.id];
  })
  return newData;
}
