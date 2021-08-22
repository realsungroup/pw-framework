import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import DoorsSelect from '../DoorsSelect';
import './AddDoorsModal.less';
import http from 'Util20/api';

class AddDoorsModal extends React.Component {
  state = {
    regionIndexCodes: [],
    doors: []
  };

  componentDidMount = async () => {
    // TODO: 从 realsun 平台获取区域管辖表，得到能够管辖的区域 indexCodes 列表
    this.setState({
      regionIndexCodes: [
        '06155983-b505-4b41-89b1-75cd63ad3cf2',
        'ec25ecfb-388d-4b86-9932-853e8c34474d'
      ]
    });
  };

  handleSubmit = () => {
    console.log('11');
    const { validateFields } = this.props.form;
    const { doors } = this.state;

    validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!doors.length) {
        return message.error('请选择门禁点');
      }

      this.submitData(values);
    });
  };

  submitData = async values => {
    const { doors } = this.state;
    try {
      await http().saveRecordAndSubTables({
        data: [
          {
            resid: '682507600534',
            // 主表记录
            maindata: {
              ...values,
              _state: 'added',
              _id: 1
            },
            // 子表数据
            subdata: doors.map((door, index) => {
              return {
                resid: '682507735244',
                maindata: {
                  indexCode: door.indexCode,
                  _state: 'added',
                  _id: index + 1
                }
              };
            })
          }
        ]
      });
    } catch (err) {
      return message.error(err.message);
    }
  };

  handleSelectedDoorsChange = doors => {
    this.setState({ doors });
  };

  render() {
    const { ...otherProps } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { regionIndexCodes } = this.state;
    return (
      <Modal
        {...otherProps}
        width={1180}
        title="添加门禁分组"
        onOk={this.handleSubmit}
      >
        <div>
          <Form>
            <h2>基本信息</h2>
            <Form.Item label="门禁分组名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: `请输入门禁分组名称`
                  }
                ]
              })(<Input style={{ width: 400 }} />)}
            </Form.Item>
            <Form.Item label="描述">
              {getFieldDecorator('describe', {})(
                <Input.TextArea style={{ width: 400 }} />
              )}
            </Form.Item>
          </Form>
          <DoorsSelect
            regionIndexCodes={regionIndexCodes}
            onSelectedDoorsChange={this.handleSelectedDoorsChange}
          ></DoorsSelect>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(AddDoorsModal);
