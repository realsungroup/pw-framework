import React from 'react';
import { Modal, Form, Input, message, Spin, Button } from 'antd';
import './ModifyPersonsByOrgModal.less';
import http from 'Util20/api';
import { TableData } from 'pw-components';
import PersonsSelectByOrg from '../PersonsSelectByOrg';
import PropTypes from 'prop-types';

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

class ModifyPersonsByOrgModal extends React.Component {
  static propTypes = {
    /**
     * 人员分组记录
     */
    record: PropTypes.object.isRequired,
    /**
     * 修改成功的回调
     */
    onSuccess: PropTypes.func.isRequired
  };

  state = {
    orgIndexCodes: [],
    persons: [],
    loading: false,
    personsSelectVisible: false,
    personsSelectLoading: false,
    tableDataKey: 0,
    isReuqestExcludePersons: false,
    selectedPersons: [],
    addLoading: false
  };

  componentDidMount = () => {
    this.getOrgIndexCodes();
  };

  openAddModal = () => {
    this.setState({
      personsSelectVisible: true
    });
  };

  getAllSelectedPersons = async () => {
    const { record = {} } = this.props;
    this.setState({ addLoading: true });
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getSubTable({
        resid: 682507819904,
        subresid: 682507890263,
        hostrecid: record.REC_ID
      });
    } catch (err) {
      this.setState({ addLoading: false });
      return message.error(err.message);
    }
    this.setState({
      selectedPersons: res.data.map(record => {
        return {
          ...record,
          personName: record.name,
          jobNo: record.jobNo,
          orgPathName: record.org,
          personId: record.personId
        };
      }),
      isReuqestExcludePersons: true,
      addLoading: false
    });
    this.openAddModal();
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
    validateFields((err, values) => {
      if (err) {
        return;
      }
      this.submitData(values);
    });
  };

  submitData = async values => {
    this.setState({ loading: true });
    const { record = {} } = this.props;
    try {
      await http({ baseURL: realsunApiBaseURL }).modifyRecords({
        resid: '682507819904',
        isEditOrAdd: true,
        data: [
          {
            REC_ID: record.REC_ID,
            ...values
          }
        ]
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    this.setState({ loading: false });
    const { onSuccess } = this.props;
    message.success('修改成功');
    onSuccess && onSuccess();
  };

  handleSelectedPersonsChange = persons => {
    this.setState({ persons });
  };

  actionBarExtra = ({ size }) => {
    return (
      <Button
        size={size}
        onClick={() => {
          this.getAllSelectedPersons();
        }}
        loading={this.state.addLoading}
      >
        添加
      </Button>
    );
  };

  handleAddPersons = async () => {
    const { persons } = this.state;
    if (!persons.length) {
      return message.info('没有选择人员');
    }

    this.setState({ personsSelectLoading: true });
    const { record } = this.props;

    try {
      await http({ baseURL: realsunApiBaseURL }).addRecords({
        resid: '682507890263',
        data: persons.map((person, index) => {
          return {
            groupId: record.groupId,
            personId: person.personId,
            name: person.personName,
            jobNo: person.jobNo,
            org: person.orgPathName,
            _state: 'editoradd',
            _id: index + 1
          };
        })
      });
    } catch (err) {
      this.setState({
        personsSelectLoading: false,
        tableDataKey: this.state.tableDataKey + 1
      });
      return message.error(err.message);
    }
    this.setState({
      personsSelectLoading: false,
      personsSelectVisible: false,
      tableDataKey: this.state.tableDataKey + 1,
      selectedPersons: [],
      persons: []
    });
    message.success('添加成功');
  };

  tableDataRef = null;

  render() {
    const { record, ...otherProps } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      orgIndexCodes,
      loading,
      personsSelectVisible,
      personsSelectLoading,
      tableDataKey,
      selectedPersons
    } = this.state;
    return (
      <>
        <Modal
          width={1180}
          title="修改人员分组"
          onOk={this.handleSubmit}
          destroyOnClose
          {...otherProps}
        >
          <Spin spinning={loading}>
            <Form>
              <h2>基本信息</h2>
              <Form.Item label="人员分组名称">
                {getFieldDecorator('name', {
                  initialValue: record.name,
                  rules: [
                    {
                      required: true,
                      message: `请输入人员分组名称`
                    }
                  ]
                })(<Input style={{ width: 400 }} />)}
              </Form.Item>
              <Form.Item label="描述">
                {getFieldDecorator('describe', {
                  initialValue: record.describe
                })(<Input.TextArea style={{ width: 400 }} />)}
              </Form.Item>
            </Form>
            <TableData
              subtractH={190}
              key={tableDataKey}
              height={420}
              baseURL={realsunApiBaseURL}
              resid={682507819904}
              subresid={682507890263}
              hostrecid={record.REC_ID}
              dataMode="sub"
              hasModify={false}
              hasImport={false}
              hasDownload={false}
              hasAdvSearch={false}
              hasZoomInOut={false}
              importConfig={null}
              hasRowModify={false}
              hasRowView={false}
              hasAdd={false}
              actionBarExtra={this.actionBarExtra}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
            ></TableData>
          </Spin>
        </Modal>
        <Modal
          title="添加人员"
          width={1180}
          visible={personsSelectVisible}
          cancelButtonProps={{ disabled: personsSelectLoading }}
          onCancel={() => {
            if (!personsSelectLoading) {
              this.setState({ personsSelectVisible: false, persons: [] });
            } else {
              message.info('添加人员中，请稍后关闭弹窗...');
            }
            this.setState({ persons: [] });
          }}
          confirmLoading={personsSelectLoading}
          destroyOnClose
          onOk={this.handleAddPersons}
        >
          {!!orgIndexCodes.length && (
            <PersonsSelectByOrg
              orgIndexCodes={orgIndexCodes}
              onSelectedPersonsChange={this.handleSelectedPersonsChange}
              selectedPersons={selectedPersons}
            ></PersonsSelectByOrg>
          )}
        </Modal>
      </>
    );
  }
}

export default Form.create()(ModifyPersonsByOrgModal);
