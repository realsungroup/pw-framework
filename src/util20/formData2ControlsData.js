import { getRules, ControlCode } from './controls';
import cloneDeep from 'lodash.clonedeep';
import { FILESEPARATOR } from './constants';

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
    case ControlCode.RadioGroup: {
      return 'RadioGroup';
    }
    //
    case ControlCode.Checkbox: {
      return 'Checkbox';
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
    // take picture:拍照
    case ControlCode.ImgCamera: {
      return 'TakePicture';
    }
    // Image 显示图片
    case ControlCode.ImageForUrlCol: {
      return 'Image';
    }
    // AutoComplete
    case ControlCode.OptionDictionaryAutoComplete: {
      return 'AutoComplete';
    }
    // 没有使用控件
    default: {
      return 'Null';
    }
  }
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
const getMatchFields = advData => {
  const matchFields = advData.MatchAndReferenceCols.filter(item => {
    return item.CDZ2_TYPE === 0;
  });
  return matchFields;
};

const getProps = (controlData, name) => {
  const { FrmReadonly, ColIsReadOnly } = controlData;
  const props = {};

  // 获取 Select 的 options prop
  if (name === 'Select') {
    const isMultiple = !!controlData.ColParam10;
    // 多选 Select
    if (isMultiple) {
      props.mode = 'multiple';
    }

    const type = controlData.ColValType;
    switch (type) {
      // 下拉框：Select
      case ControlCode.OptionValue: {
        const labelOptions = controlData.DisplayOptions;
        const valueOptions = controlData.ValueOptions;
        props.options = labelOptions.map((label, index) => ({
          label,
          value: valueOptions[index]
        }));
        break;
      }
      // 下拉框部门：Select
      case ControlCode.OptionDepartment: {
        const labelOptions = controlData.DisplayOptions;
        const valueOptions = controlData.ValueOptions;
        props.options = labelOptions.map((label, index) => ({
          label,
          value: valueOptions[index]
        }));
        break;
      }
      // 下拉字典：Select
      case ControlCode.OptionDictionary: {
        const options = controlData.ListOfColOptions;
        props.options = options.map(option => ({
          label: option.displayColValue,
          value: option.valueColValue
        }));
        break;
      }
      default: {
        return null;
      }
    }
  }

  // 'Search' 添加搜索按钮
  if (name === 'Search') {
    props.enterButton = true;
    props.disabled = true;
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

const getData = (controlArr, rulesControl) => {
  const data = [];
  controlArr.forEach(controlData => {
    // id 在后端表示内部字段
    const id = controlData.ColName || controlData.innerFieldName;
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
      if (obj.name !== 'Checkbox') {
        obj.rules = getRules(controlData);
      }
      // 指定的字段加上验证规则
    } else if (Array.isArray(rulesControl)) {
      let result = rulesControl.some(innerFieldName => innerFieldName === id);
      if (result) {
        obj.rules = getRules(controlData);
      }
    } else {
      throw new Error('rulesControl 类型应该为 `boolean` 或 `array`');
    }
    obj.props = getProps(controlData, obj.name);

    // 高级字典表格接收的 props
    if (obj.name === 'Search') {
      const advData = controlData.AdvDictionaryListData[0];
      if (!advData) {
        // alert('advDictionatyData.AdvDictionaryListData 为空数组');
        return;
      }
      obj.advDicTableProps = {
        // 匹配字段
        resid: advData.ResID2,
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
        subtractH: 140,
        height: 450,
        hasResizeableBox: true
      };
    }
    data.push(obj);
  });

  return data;
};

const trueValues = ['Y'];
// const falseValues = ['', undefined, null, 'N'];
// 获取是否项是否被选中
const getChecked = value => {
  if (trueValues.indexOf(value) !== -1) {
    return true;
  }
  return false;
};

// 获取文件列表，value：字符串，里面含有 n 个文件地址，以 ';file;' 分隔
const getFileList = value => {
  let ret = [];
  if (!value) {
    return ret;
  }
  const urls = value.split(FILESEPARATOR);
  ret = urls.map((url, index) => ({
    uid: -(index + 1),
    name: url,
    status: 'done',
    url: url
  }));
  return ret;
};

/**
 * 设置所有控件的 initialValue 属性值
 * @param {array} data 所有控件数据
 * @param {object} record 记录
 * @param {boolean} isTransformValue 是否转换值，默认值：false
 * @param {boolean} isClassifyLayout 是否是分类布局，默认值：false
 */
export const setDataInitialValue = (
  data,
  record,
  isTransformValue = false,
  isClassifyLayout = false
) => {
  const newData = cloneDeep(data);
  if (isClassifyLayout) {
    newData.forEach(item => {
      item.data.forEach(dataItem => {
        dataItem.initialValue = record[dataItem.id];
      });
    });
  } else {
    newData.forEach(dataItem => {
      dataItem.initialValue = record[dataItem.id];
    });
  }
  newData.containerControlArr = data.containerControlArr;
  newData.labelControllArr = data.labelControllArr;
  return newData;
};

/**
 * 获取表单接收的 data prop
 * @param {object} formData 窗体数据
 * @param {object} record 记录
 * @param {boolean} isTransformValue 是否转换控件的值，默认值：false，即值为 record 中值
 * @param {boolean} isClassifyLayout 是否返回分类布局所需的数据，默认值：false
 * @param {array | boolean} rulesControl
 * 含有验证规则的控件数据，默认：true，表示所有控件都需要添加验证规则；
 * 若 rulesControl = ['name', 'age']，则表示只有 'name' 和 'age' 字段才需要添加验证规则，其他字段的控件需不要验证
 */
export const getDataProp = (
  formData,
  record,
  isTransformValue = false,
  isClassifyLayout = false,
  rulesControl = true
) => {
  let data = [];
  const {
    canOpControlArr,
    containerControlArr,
    labelControllArr,
    imageArr = []
  } = formData;
  // 默认布局
  if (!isClassifyLayout) {
    data = getData([...canOpControlArr, ...imageArr], rulesControl);
    // 分类布局
  } else {
    const klasses = assortFields([...canOpControlArr, ...imageArr]);
    klasses.forEach(klass => {
      const obj = {
        type: klass.title,
        data: getData(klass.renderControlArr, rulesControl)
      };
      data.push(obj);
    });
  }
  data = setDataInitialValue(data, record, isTransformValue, isClassifyLayout);
  data.containerControlArr = containerControlArr;
  data.labelControllArr = labelControllArr;
  return data;
};
