import { getRules, ControlCode } from '../../../../util20/controls';
import moment from 'moment';

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
      // alert('advDictionatyData.AdvDictionaryListData 为空数组');
      return;
    }

    const resid = advData.ResID2;
    const cmscolumns = getCmscolumns(advData);
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
const getCmscolumns = advData => {
  let str = '';
  const len = advData.MatchAndReferenceCols.length;

  advData.MatchAndReferenceCols.forEach((item, index) => {
    index === len - 1 ? (str += item.CDZ2_COL2) : (str += item.CDZ2_COL2 + ',');
  });
  return str;
};

// 获取由过滤字段组合成的 cmswhere 查询语句
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

const getData = (canOpControlArr, record, operation, handleSearch) => {
  const data = [];
  canOpControlArr.forEach(controlData => {
    const obj = {
      id: controlData.ColName,
      label: controlData.ColDispName,
      labelCol: 8,
      wrapperCol: 16,
      rules: getRules(controlData),
      name: getControlName(controlData)
    };
    obj.value = getValue(obj.name, record, controlData, operation);
    obj.props = getProps(controlData, obj.name, handleSearch);
    data.push(obj);
  });
  return data;
};

/**
 * 获取 PwForm 接收的 data prop
 * @param {string} operation 操作：'add' 添加 | 'modify' 修改 | 'view' 查看
 * @param {object} record 记录
 * @param {object} formData 窗体数据
 * @param {object} formProps PwForm 组件所接收的其他 props
 */
const getDataProp = (operation, record, formData, formProps, handleSearch) => {
  let data = [];
  const { canOpControlArr } = formData;
  const { displayMode = 'default' } = formProps;

  // 默认布局
  if (displayMode === 'default') {
    data = getData(canOpControlArr, record, operation, handleSearch);

    // 分类布局
  } else if (displayMode === 'classify') {
    const klasses = assortFields(canOpControlArr);
    console.log({ klasses });

    klasses.forEach(klass => {
      const obj = {
        type: klass.title,
        data: getData(klass.renderControlArr, record, operation, handleSearch)
      };
      data.push(obj);
    });

    console.log({ data });
  }
  return data;
};

export default getDataProp;
