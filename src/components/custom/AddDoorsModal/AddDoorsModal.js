import React from 'react';
import { Modal, Form, Input, message, Spin } from 'antd';
import DoorsSelect from '../DoorsSelect';
import './AddDoorsModal.less';
import http from 'Util20/api';
import PropTypes from 'prop-types';

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

class AddDoorsModal extends React.Component {
  static propTypes = {
    /**
     * 添加成功的回调
     */
    onSuccess: PropTypes.func.isRequired
  };

  state = {
    regionIndexCodes: [],
    doors: [],
    loading: false
  };

  componentDidMount = () => {
    this.getRegionIndexCodes();
  };

  getRegionIndexCodes = async () => {
    this.setState({ loading: true });
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getTable({
        resid: 682964730936
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    this.setState({
      regionIndexCodes: res.data.map(record => record.regionIndexCode),
      loading: false
    });
  };

  handleSubmit = () => {
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
    this.setState({ loading: true });
    const { doors } = this.state;

    try {
      await http({ baseURL: realsunApiBaseURL }).saveRecordAndSubTables({
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
                  name: door.name,
                  regionIndexCode: door.regionIndexCode,
                  region: door.regionPathName,
                  control: door.doorNo,
                  describe: door.description,
                  _state: 'added',
                  _id: index + 1
                }
              };
            })
          }
        ]
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    this.setState({ loading: false });
    const { onSuccess } = this.props;
    message.success('添加成功');
    onSuccess && onSuccess();
  };

  handleSelectedDoorsChange = doors => {
    this.setState({ doors });
  };

  render() {
    const { onSuccess, ...otherProps } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { regionIndexCodes, loading } = this.state;
    return (
      <Modal
        width={1180}
        title="添加门禁分组"
        onOk={this.handleSubmit}
        {...otherProps}
      >
        <Spin spinning={loading}>
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
          {!!regionIndexCodes.length && (
            <DoorsSelect
              regionIndexCodes={regionIndexCodes}
              onSelectedDoorsChange={this.handleSelectedDoorsChange}
            ></DoorsSelect>
          )}
        </Spin>
      </Modal>
    );
  }
}

export default Form.create()(AddDoorsModal);
