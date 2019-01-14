import React from 'react';
import PropTypes from 'prop-types';
import './PwForm.less';
import { Form, Button, Collapse } from 'antd';
import LzRowCols from '../LzRowCols';
// import FormItem from './FormItem';
import schema from 'async-validator';
import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import PwFormFooter from './PwFormFooter/index';
import Control from '../../ui-components/Control';

const Fragment = React.Fragment;

const Panel = Collapse.Panel;
const FormItem = Form.Item;

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
     * 点击保存时的回调函数，如：(form) => {}，form 为包含 getFieldsValue/setFieldsValue/validateFields 方法的对象
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
    onCancel: PropTypes.func,

    /**
     * 确认按钮文案
     * 默认：'保存'
     */
    saveText: PropTypes.string,

    /**
     * 取消按钮文案
     * 默认：'取消'
     */
    cancelText: PropTypes.string,

    /**
     * 编辑按钮文案
     * 默认：'编辑'
     */
    editText: PropTypes.string
  };
  static defaultProps = {
    mode: 'edit',
    colCount: 1,
    hasEdit: true,
    hasSave: true,
    hasCancel: true,
    displayMode: 'default',
    saveText: '保存',
    cancelText: '取消',
    editText: '编辑'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.data, this.props.data)) {
    }
  }

  handleCollapseChange = activeKey => {
    this.setState({ activeKey });
  };

  renderFormItems = (data, colCount) => {
    return (
      <Fragment>
        {colCount === 1 ? (
          data.map(dateItem => this.renderFormItem(dateItem))
        ) : (
          <LzRowCols renderData={data} keyName="id" colCount={colCount}>
            {dateItem => this.renderFormItem(dateItem)}
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

  renderFormItem = dataItem => {
    const { id, label, labelCol, wrapperCol } = dataItem;
    const {
      form,
      mode,
      resid,
      operation,
      record,
      beforeSaveFields
    } = this.props;
    const { getFieldDecorator } = form;
    const options = {
      initialValue: dataItem.initialValue,
      rules: dataItem.rules
    };

    const hasBeforeSave =
      !!beforeSaveFields && beforeSaveFields.indexOf(dataItem.id) !== -1;

    return (
      <FormItem
        key={id}
        label={label}
        labelCol={{ span: labelCol || 8 }}
        wrapperCol={{ span: wrapperCol || 16 }}
      >
        {getFieldDecorator(dataItem.id, options)(
          <Control
            dataItem={dataItem}
            form={form}
            displayMode={mode}
            resid={resid}
            record={record}
            operation={operation}
            hasBeforeSave={hasBeforeSave}
            beforeSaveFields={hasBeforeSave}
          />
        )}
      </FormItem>
    );
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
      height,
      saveText,
      cancelText,
      editText
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
          form={this.props.form}
          saveText={saveText}
          cancelText={cancelText}
          editText={editText}
        />
      </div>
    );
  }
}

export default Form.create()(PwForm);
