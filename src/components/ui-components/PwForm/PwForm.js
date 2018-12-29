import React from 'react';
import PropTypes from 'prop-types';
import './PwForm.less';
import { Form, Button, Collapse } from 'antd';
import LzRowCols from '../LzRowCols';
import FormItem from './FormItem';
import schema from 'async-validator';
import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import PwFormFooter from './PwFormFooter/index';

const Fragment = React.Fragment;

const Panel = Collapse.Panel;

const getValues = (data, displayMode) => {
  const values = {};
  if (displayMode === 'default') {
    data.forEach(item => {
      values[item.id] = item.value;
    });
  } else {
    data.forEach(typeItem => {
      typeItem.data.forEach(item => {
        values[item.id] = item.value;
      });
    });
  }
  return values;
};

const getActiveKey = (data, displayMode) => {
  if (displayMode === 'default') {
    return [];
  }
  const activeKey = [];
  data.forEach(typeItem => {
    activeKey.push(typeItem.type);
  });
  return activeKey;
};

const getDescriptor = (data, displayMode) => {
  const descriptor = {};
  if (displayMode === 'default') {
    data.forEach(item => {
      descriptor[item.id] = cloneDeep(item.rules);
    });
  } else {
    data.forEach(typeItem => {
      typeItem.data.forEach(item => {
        descriptor[item.id] = cloneDeep(item.rules);
      });
    });
  }
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
     * 宽度
     * 默认：-
     */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * 高度
     * 默认：-
     */
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

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
    // data 格式：displayMode 为 default 时
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

    // data 格式：displayMode 为 classify 时
    // [
    //   {
    //     type: '基本信息',
    //     data: [
    //       {
    //         id: 'name', // 字段名称
    //         label: '姓名', // label
    //         value: '肖磊', // 初始值
    //         labelCol: 8, // label 所占列
    //         wrapperCol: 16, // 控件 所占列
    //         rules: [{ required: true, message: '请输入姓名' }], // 验证规则
    //         name: 'Input', // 控件名称
    //         props: { // 控件所接收的 props
    //           type: 'number'
    //         }
    //       }
    //     ]
    //   }
    // ]

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
    hasCancel: true,
    displayMode: 'default'
  };

  constructor(props) {
    super(props);
    const { data, displayMode } = props;
    const values = getValues(data, displayMode);
    const activeKey = getActiveKey(data, displayMode);
    descriptor = getDescriptor(data, displayMode);
    this.state = {
      values,
      helps: {}, // 错误提示
      activeKey
    };
  }

  componentDidMount() {
    this.form.validateFields();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.data, this.props.data)) {
      const values = getValues(nextProps.data, this.props.displayMode);
      descriptor = getDescriptor(nextProps.data, this.props.displayMode);
      this.setState({ values }, () => {
        // 对新的 values 进行 validate
        this.form.validateFields();
      });
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
      const values = this.form.getFieldsValue();
      validator.validate(values, (err, fields) => {
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

  handleCollapseChange = activeKey => {
    this.setState({ activeKey });
  };

  renderFormItems = (data, colCount) => {
    return (
      <Fragment>
        {colCount === 1 ? (
          data.map(formItemData => this.renderFormItem(formItemData))
        ) : (
          <LzRowCols renderData={data} keyName="id" colCount={colCount}>
            {formItemData => this.renderFormItem(formItemData)}
          </LzRowCols>
        )}
      </Fragment>
    );
  };

  renderForm = () => {
    const { data, colCount, displayMode } = this.props;
    // 默认显示模式
    if (displayMode === 'default') {
      return this.renderFormItems(data, colCount);

      // 分类显示模式
    } else if (displayMode === 'classify') {
      const { activeKey } = this.state;
      return (
        <Collapse activeKey={activeKey} onChange={this.handleCollapseChange}>
          {data.map(typeItem => (
            <Panel key={typeItem.type} header={typeItem.type}>
              {this.renderFormItems(typeItem.data, colCount)}
            </Panel>
          ))}
        </Collapse>
      );
    }
  };

  renderFormItem = formItemData => {
    const { mode } = this.props;
    const { values, helps } = this.state;
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
  };

  handleFormItemChange = (id, value) => {
    const values = { ...this.state.values, ...{ [id]: value } };
    this.setState({ values }, () => {
      this.form.validateFields();
    });
  };

  handleFormItemBlur = (id, value) => {
    const values = { ...this.state.values, ...{ [id]: value } };
    this.setState({ values }, () => {
      this.form.validateFields();
    });
  };

  render() {
    const {
      mode,
      hasEdit,
      hasSave,
      hasCancel,
      onEdit,
      onSave,
      onCancel,
      width,
      height
    } = this.props;

    return (
      <div className="pw-form" style={{ width, height }}>
        {/* body */}
        <Form className="pw-form__body">{this.renderForm()}</Form>
        {/* footer */}
        <PwFormFooter
          hasEdit={hasEdit}
          hasSave={hasSave}
          hasCancel={hasCancel}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          mode={mode}
          form={this.form}
        />
      </div>
    );
  }
}

export default PwForm;
