import React from 'react';
import PropTypes from 'prop-types';

import './PwForm.less';

import { Form, Input } from 'antd';

const controlsMap = {
  Input: Input
};

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
    data: PropTypes.array.isRequired
  };

  static defaultProps = {
    mode: 'view'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  getControlComponent = control => {
    const Tag = controlsMap[control.name];
    return <Tag {...control.props} />;
  };

  render() {
    const { data } = this.props;
    const { getFieldDecorator } = this.props.form;

    // [
    //   {
    //     id: '姓名',
    //     initialValue: '肖磊',
    //     rules: [{ required: true, message: '请输入姓名' }],
    //     control: {
    //       name: 'Input',
    //       props: {
    //         type: 'number'
    //       }
    //     }
    //   }
    // ];

    return (
      <div className="pw-form">
        <Form>
          {data.map(item => {
            return (
              <Form.Item key={item.id}>
                {getFieldDecorator(item.id, {
                  initialValue: item.initialValue,
                  rules: item.rules
                })(this.getControlComponent(item.control))}
              </Form.Item>
            );
          })}
        </Form>
      </div>
    );
  }
}

export default Form.create()(PwForm);
