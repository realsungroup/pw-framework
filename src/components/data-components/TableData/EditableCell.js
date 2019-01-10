import React from 'react';
import { EditableContext } from './EditableRow';
import { Form, Input } from 'antd';
import Control from '../../ui-components/Control';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

const Fragment = React.Fragment;

/**
 * 可编辑的单元格
 */
export default class EditableCell extends React.Component {
  static propTypes = {
    /**
     * 所有控件（如：Input）的数据
     */
    controlsData: PropTypes.array.isRequired
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
  };

  static defaultProps = {};

  getObj = () => {
    const { controlsData, dataIndex } = this.props;
    const controlData = controlsData.find(
      controlData => controlData.id === dataIndex
    );

    // 该字段没有控件配置（即没有控件，直接显示记录值）
    if (!controlData) {
      return;
    }

    const {
      value,
      rules,
      props,
      name: controlName,
      ...restOptions
    } = controlData;
    const options = {
      initialValue: value,
      rules: rules
      // ...restOptions
    };
    return {
      props,
      options,
      controlName,
      controlData
    };
  };

  render() {
    const {
      editing, // 是否处于编辑状态
      dataIndex, // 内部字段
      title,
      record, // 记录
      index,
      controlsData, // 所有控件配置
      ...restProps
    } = this.props;

    let obj;
    if (editing) {
      obj = this.getObj();
    }

    const isRenderControl = editing && !!obj;

    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {isRenderControl ? (
                <FormItem>
                  {getFieldDecorator(dataIndex, obj.options)(
                    <Control
                      name={obj.controlName}
                      controlProps={obj.props}
                      controlData={obj.controlData}
                      form={form}
                    />
                  )}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
