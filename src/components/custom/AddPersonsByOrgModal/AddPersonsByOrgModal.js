import React from 'react';
import { Modal, Form, Input, message, Spin } from 'antd';
import PersonsSelectByOrg from '../PersonsSelectByOrg';
import './AddPersonsByOrgModal.less';
import http from 'Util20/api';
import PropTypes from 'prop-types';

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

/**
 * 添加人员分组（按组织添加）Modal
 */
class AddPersonsByOrgModal extends React.Component {
  static propTypes = {
    /**
     * 添加成功的回调
     */
    onSuccess: PropTypes.func.isRequired
  };

  state = {
    orgIndexCodes: [],
    persons: [],
    loading: false
  };

  componentDidMount = () => {
    this.getOrgIndexCodes();
  };

  getOrgIndexCodes = async () => {
    this.setState({ loading: true });
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getTable({
        resid: 683043670166
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    this.setState({
      orgIndexCodes: res.data.map(record => record.depId),
      loading: false
    });
  };

  handleSubmit = () => {
    const { validateFields } = this.props.form;
    const { persons } = this.state;

    validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!persons.length) {
        return message.error('请选择人员');
      }

      this.submitData(values);
    });
  };

  submitData = async values => {
    this.setState({ loading: true });
    const { persons } = this.state;

    try {
      await http({ baseURL: realsunApiBaseURL }).saveRecordAndSubTables({
        data: [
          {
            resid: '682507819904',
            // 主表记录
            maindata: {
              ...values,
              _state: 'added',
              _id: 1
            },
            // 子表数据
            subdata: persons.map((person, index) => {
              return {
                resid: '682507890263',
                maindata: {
                  personId: person.personId,
                  name: person.personName,
                  jobNo: person.jobNo,
                  org: person.orgPathName,
                  _state: 'editoradd',
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

  handleSelectedPersonsChange = persons => {
    console.log({ persons });
    this.setState({ persons });
  };

  render() {
    const { ...otherProps } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { orgIndexCodes, loading } = this.state;
    return (
      <Modal
        {...otherProps}
        width={1180}
        title="添加人员分组"
        onOk={this.handleSubmit}
      >
        <Spin spinning={loading}>
          <Form>
            <h2>基本信息</h2>
            <Form.Item label="人员分组名称">
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
          <h3>人员列表</h3>
          {!!orgIndexCodes.length && (
            <PersonsSelectByOrg
              orgIndexCodes={orgIndexCodes}
              onSelectedPersonsChange={this.handleSelectedPersonsChange}
            ></PersonsSelectByOrg>
          )}
        </Spin>
      </Modal>
    );
  }
}

export default Form.create()(AddPersonsByOrgModal);
