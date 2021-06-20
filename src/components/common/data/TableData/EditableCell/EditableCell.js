import React from 'react';
import { EditableContext } from '../EditableRow';
import { Form } from 'antd';
import Control from '../../../ui/Control';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

/**
 * 可编辑的单元格
 */
export default class EditableCell extends React.Component {
  static propTypes = {
    /**
     * 控件（如：Input）的数据
     * 默认：{}
     */
    dataItem: PropTypes.object,
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
    /**
     * 是否处于编辑状态
     * 默认：-
     */
    editing: PropTypes.bool,

    /**
     * 记录
     */
    record: PropTypes.object,

    /**
     * 单元格宽度
     * 默认：-
     */
    width: PropTypes.number,
  };

  static defaultProps = {
    dataItem: {}
  };

  render() {
    const {
      editing, // 是否处于编辑状态
      dataIndex, // 内部字段
      title,
      record, // 记录
      index,
      dataItem, // 控件数据
      width,
      height,
      baseURL,
      fieldName,
      ...restProps
    } = this.props;

    const isRenderControl = editing && !!dataItem;

    let options;
    if (isRenderControl) {
      options = {
        initialValue: dataItem.initialValue,
        rules: dataItem.rules
      };
    }

    let hasControl = true;
    if (!Object.keys(dataItem).length) {
      hasControl = false;
    }

    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps} style={{ width }}>
              {isRenderControl ? (
                <FormItem>
                  {hasControl ? (
                    getFieldDecorator(dataIndex, options)(
                      <Control
                        dataItem={dataItem}
                        form={form}
                        displayMode="edit"
                        baseURL={baseURL}
                      />
                    )
                  ) : (
                      <span>{record[fieldName]}</span>
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
