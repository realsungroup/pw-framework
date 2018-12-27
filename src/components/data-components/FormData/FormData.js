import React from 'react';
import PropTypes from 'prop-types';
import PwForm from '../../ui-components/PwForm';
import http, { makeCancelable } from '../../../util/api';
import { message, Modal } from 'antd';
import { extractAndDealBackendBtns } from '../../../util/beBtns';
import LzBackendBtn from '../../ui-components/LzBackendBtn';
import { Button } from '../../../../node_modules/antd/lib/radio';
import dealControlArr, { getRules, ControlCode } from '../../../util/controls';
import moment from 'moment';
const { Fragment } = React;

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

const getProps = (controlData, name) => {
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
    props.enterButton = true;
  }

  props.disabled = !!(FrmReadonly || ColIsReadOnly);

  return props;
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

const getData = (operation, record, formData) => {
  const data = [];
  const { canOpControlArr } = formData;
  if (operation === 'add' || operation === 'modify' || operation === 'view') {
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
      obj.props = getProps(controlData, obj.name);
      data.push(obj);
    });
  }
  return data;
};

/**
 * FormData
 */
export default class FormData extends React.Component {
  static propTypes = {
    /**
     * 窗体数据
     * 默认：{ subTableArr:[], allControlArr: [], canOpControlArr: [], containerControlArr: [] }
     */
    formData: PropTypes.object,
    // formData = {
    //   subTableArr: [], // 子表控件
    //   allControlArr: [], // 所有控件（可操作的控件 + label）
    //   canOpControlArr: [], // 可操作的控件（如 input）
    //   containerControlArr: [] // 容器控件
    // }

    /**
     * 表单记录
     * 默认：{}
     */
    record: PropTypes.object,

    /**
     * 对表单的操作：'add' 添加 | 'modify' 修改 | 'view' 查看
     * 默认：'add'
     */
    operation: PropTypes.oneOf(['add', 'modify', 'view']),

    /**
     * PwForm 的 props
     * 默认：{}
     */
    formProps: PropTypes.object
  };

  static defaultProps = {
    record: {},
    operation: 'add',
    formProps: {},
    formData: {
      subTableArr: [],
      allControlArr: [],
      canOpControlArr: [],
      containerControlArr: []
    }
  };

  constructor(props) {
    super(props);
    const { operation, record, formData } = props;
    const data = getData(operation, record, formData);

    this.state = {
      data // 表单控件数据
    };
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {};

  render() {
    const { data } = this.state;
    const { formProps, operation } = this.props;
    const mode = operation === 'view' ? 'view' : 'edit';
    let otherProps = {};

    // 当为查看时，不显示 编辑、保存和取消按钮
    if (mode === 'view') {
      otherProps.hasEdit = false;
      otherProps.hasSave = false;
      otherProps.hasCancel = false;
    }
    return <PwForm data={data} {...formProps} mode={mode} {...otherProps} />;
  }
}
