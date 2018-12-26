import React from 'react';
import PropTypes from 'prop-types';
import './PwForm.less';
import { Form, Button } from 'antd';
import LzRowCols from '../LzRowCols';
import FormItem from './FormItem';
import schema from 'async-validator';
import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';

const Fragment = React.Fragment;

const PwFormFooter = React.memo(
  ({ hasEdit, hasSave, hasCancel, onEdit, onSave, onCancel, mode, form }) => {
    return (
      <div className="pw-form__footer">
        {(function() {
          if (mode === 'edit') {
            return (
              <Fragment>
                {hasCancel && (
                  <Button onClick={() => onCancel && onCancel(form)}>
                    取消
                  </Button>
                )}

                {hasSave && (
                  <Button
                    type="primary"
                    onClick={() => {
                      onSave && onSave(form);
                    }}
                  >
                    保存
                  </Button>
                )}
              </Fragment>
            );
          } else {
            return (
              <Fragment>
                {hasEdit && (
                  <Button type="primary" onClick={() => onEdit && onEdit()}>
                    编辑
                  </Button>
                )}
              </Fragment>
            );
          }
        })()}
      </div>
    );
  }
);

const getValues = data => {
  const values = {};
  data.forEach(item => {
    values[item.id] = item.value;
  });
  return values;
};
const getDescriptor = data => {
  const descriptor = {};
  data.forEach(item => {
    descriptor[item.id] = cloneDeep(item.rules);
  });
  return descriptor;
};

// 验证规则
// let descriptor = {
//   name: [{ required: true, message: '请输入姓名' }],
//   age: [{required: true, message: '请输入年龄'}]
// }
let descriptor = {};
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
    // data 格式
    // [
    //   {
    //     id: 'name', // 字段名称
    //     label: '姓名', // label
    //     value: '肖磊', // 初始值
    //     labelCol: 8, // label 所占列
    //     wrapperCol: 16, // 控件 所占列
    //     rules: [{ required: true, message: '请输入姓名' }], // 验证规则
    //     name: 'Input', // 控件名称
    //     props: { // 控件所接收的 props
    //       type: 'number'
    //     }
    //   }
    // ];

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
    wrapperCol: PropTypes.number,

    /**
     * 是否有编辑按钮
     * 默认：true
     */
    hasEdit: PropTypes.bool,

    /**
     * 点击编辑时的回调函数
     * 默认：-
     */
    onEdit: PropTypes.func,

    /**
     * 是否有保存按钮
     * 默认：true
     */
    hasSave: PropTypes.bool,

    /**
     * 点击保存时的回调函数
     * 默认：-
     */
    onSave: PropTypes.func,

    /**
     * 是否有取消编辑按钮
     * 默认：true
     */
    hasCancel: PropTypes.bool,

    /**
     * 点击取消时的回调函数
     * 默认：-
     */
    onCancel: PropTypes.func
  };
  static defaultProps = {
    mode: 'edit',
    colCount: 1,
    hasEdit: true,
    hasSave: true,
    hasCancel: true
  };

  constructor(props) {
    super(props);
    const values = getValues(props.data);
    descriptor = getDescriptor(props.data);
    this.state = {
      values,
      helps: {} // 错误提示
    };
  }

  componentDidMount() {
    this.form.validateFields();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.data, this.props.data)) {
      console.log('111');

      const values = getValues(nextProps.data);
      descriptor = getDescriptor(nextProps.data);
      this.setState({ values });
    }
  }

  form = {
    getFieldsValue: () => {
      return this.state.values;
    },
    setFieldsValue: values => {
      this.setState({ values: { ...this.state.values, ...values } });
    },
    /**
     * 验证字段的函数
     * callback：验证完成后的回调
     */
    validateFields: callback => {
      const validator = new schema(descriptor);
      validator.validate(this.form.getFieldsValue(), (err, fields) => {
        const values = this.form.getFieldsValue();

        const helps = {};
        for (let id in fields) {
          fields[id].forEach(item => {
            helps[id] = `${item.message} `;
          });
        }

        this.setState({ helps });
        callback && callback(err, values);
      });
    }
  };

  getData = data => {
    return cloneDeep(data);
  };

  getControlView = item => {
    return <div>{item.initialValue}</div>;
  };

  renderFormItem = formItemData => {
    const { mode } = this.props;
    const { values, helps } = this.state;
    if (mode === 'edit') {
      return (
        <FormItem
          key={formItemData.id}
          mode={mode}
          formItemData={formItemData}
          value={values[formItemData.id]}
          onChange={this.handleFormItemChange}
          onBlur={this.handleFormItemBlur}
          help={helps[formItemData.id]}
        />
      );
    } else {
      return this.getControlView(formItemData);
    }
  };

  handleFormItemChange = (id, value) => {
    const values = { ...this.state.values, ...{ [id]: value } };
    this.setState({ values }, () => {
      this.form.validateFields();
    });
  };

  handleFormItemBlur = (id, value) => {};

  render() {
    const {
      colCount,
      labelCol,
      wrapperCol,
      mode,
      hasEdit,
      hasSave,
      hasCancel,
      onEdit,
      onSave,
      onCancel,
      data
    } = this.props;
    const { values, descriptor } = this.state;

    return (
      <div className="pw-form">
        <Form>
          {colCount === 1 ? (
            data.map(formItemData => this.renderFormItem(formItemData))
          ) : (
            <LzRowCols renderData={data} keyName={'id'} colCount={colCount}>
              {formItemData => this.renderFormItem(formItemData)}
            </LzRowCols>
          )}

          <PwFormFooter
            hasEdit={hasEdit}
            hasSave={hasSave}
            hasCancel={hasCancel}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            mode={mode}
            form={this.form}
            descriptor={descriptor}
          />
        </Form>
      </div>
    );
  }
}

export default PwForm;
