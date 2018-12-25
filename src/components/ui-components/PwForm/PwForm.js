import React from 'react';
import PropTypes from 'prop-types';
import './PwForm.less';
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Select,
  Upload,
  Button,
  Icon
} from 'antd';
import LzRowCols from '../LzRowCols';
import DateTimePicker from '../DateTimePicker';
import FormItem from './FormItem';

const { TextArea, Search } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;

// const controlsMap = {
//   Input: Input,
//   TextArea: TextArea,
//   DatePicker: DatePicker,
//   RadioGroup: RadioGroup,
//   Select: Select,
//   Search: Search,
//   DateTimePicker: DateTimePicker
// };
// const controlsMap = {
//   ret(C, props) {
//     return <C {...props} />;
//   },
//   Input(control) {
//     return this.ret(Input, control.props);
//   },
//   TextArea(control) {
//     return this.ret(TextArea, control.props);
//   },
//   DatePicker(control) {
//     return this.ret(DatePicker, control.props);
//   },
//   RadioGroup(control) {
//     return this.ret(RadioGroup, control.props);
//   },
//   Search(control) {
//     return this.ret(Search, control.props);
//   },
//   DateTimePicker(control) {
//     return this.ret(DateTimePicker, control.props);
//   },

//   Select(control) {
//     return (
//       <Select>
//         {control.props.options.map(option => (
//           <Option key={option.value} value={option.value}>
//             {option.label}
//           </Option>
//         ))}
//       </Select>
//     );
//   },

//   Upload(control) {
//     return (
//       <Upload {...control.props}>
//         <Button>
//           <Icon type="upload" /> 上传
//         </Button>
//       </Upload>
//     );
//   }
// };

/**
 * PwForm
 */
class PwForm extends React.Component {
  static propTypes = {
    /**
     * 模式：'edit' 编辑模式 | 'view' 查看模式
     * 默认：'view'
     */
    mode: PropTypes.oneOf(['edit', 'view']),

    /**
     * 显示模式：'default' 默认显示模式 | 'classify' 折叠面板形式的分类显示模式
     * 默认：'default'
     */
    displayMode: PropTypes.oneOf(['default', 'classify']),

    /**
     * 渲染表单控件的数据
     * 默认：-
     */
    data: PropTypes.array.isRequired,

    /**
     * 列数量
     * 默认：1
     */
    colCount: PropTypes.number,

    /**
     * label 宽度所占列数量
     * 默认：-
     */
    labelCol: PropTypes.number,

    /**
     * 控件 宽度所占列数量
     * 默认：-
     */
    wrapperCol: PropTypes.number
  };

  static defaultProps = {
    mode: 'edit',
    colCount: 1,
    values: {}
  };

  constructor(props) {
    super(props);
    const values = this.getValues(props.data);
    const data = this.getData(props.data);
    this.state = {
      values,
      data
    };
  }

  getValues = data => {
    const values = {};
    data.forEach(item => {
      values[item.id] = item.initialValue;
    });
    return values;
  };

  getData = data => {
    return (data = [...data]);
    // data.forEach(item => {
    //   item.control.props.innerChange = (e) => {

    //   }

    //   if (item.control.props && item.control.props.onChange) {

    //   }
    // })
  };

  // getControlComponent = control => {
  //   return controlsMap[control.name](control);
  // };

  getControlView = item => {
    return <div>{item.initialValue}</div>;
  };

  renderControl = item => {
    const { mode } = this.props;
    const { values } = this.state;
    if (mode === 'edit') {
      return (
        <FormItem
          key={item.id}
          item={item}
          value={values[item.id]}
          onChange={this.handleFormItemChange}
        />
      );

      // return this.props.form.getFieldDecorator(item.id, {
      //   initialValue: item.initialValue,
      //   rules: item.rules
      // })(this.getControlComponent(item.control));
    } else {
      return this.getControlView(item);
    }
  };

  handleFormItemChange = (id, value) => {
    const values = { ...this.state.values, ...{ [id]: value } };
    this.setState({ values });
  };

  render() {
    const { colCount, labelCol, wrapperCol, mode } = this.props;
    const { values, data } = this.state;
    // const { getFieldDecorator } = this.props.form;
    // data 格式
    // [
    //   {
    //     id: '姓名',
    //     label: '姓名',
    //     initialValue: '肖磊',
    //     labelCol: 8, // label 所占列
    //     wrapperCol: 16, // 控件 所占列
    //     rules: [{ required: true, message: '请输入姓名' }],
    //     control: {
    //       name: 'Input',
    //       props: {
    //         type: 'number'
    //       }
    //     }
    //   }
    // ];
    console.log('pwform');
    return (
      <div className="pw-form">
        <Form>
          <LzRowCols renderData={data} keyName={'id'} colCount={colCount}>
            {item => this.renderControl(item)}
          </LzRowCols>
        </Form>
      </div>
    );
  }
}

export default PwForm;
