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
     * 默认：[]
     */
    data: PropTypes.array
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

  static defaultProps = {
    data: []
  };

  getDataItemAndOptions = () => {
    const { data, dataIndex } = this.props;
    const dataItem = data.find(
      controlData => controlData.id === dataIndex
    );
    if (!dataItem) {
      return;
    }
    const options = {
      initialValue: dataItem.initialValue,
      rules: dataIndex.rules
    }
    return { dataItem, options };
  };

  render() {
    const {
      editing, // 是否处于编辑状态
      dataIndex, // 内部字段
      title,
      record, // 记录
      index,
      data, // 所有控件配置
      ...restProps
    } = this.props;

    let obj, dataItem, options;
    if (editing) {
      obj = this.getDataItemAndOptions();

      dataItem = obj && obj.dataItem;
      options = obj && obj.options
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
                  {getFieldDecorator(dataIndex, options)(
                    <Control
                      dataItem={dataItem}
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
