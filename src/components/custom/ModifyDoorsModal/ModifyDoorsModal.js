import React from 'react';
import { Modal, Form, Input, message, Spin, Button } from 'antd';
import './ModifyDoorsModal.less';
import http from 'Util20/api';
import TableData from 'Common/data/TableData';
import DoorsSelect from '../DoorsSelect';
import PropTypes from 'prop-types';

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

class ModifyDoorsModal extends React.Component {
  static propTypes = {
    /**
     * 门禁分组记录
     */
    record: PropTypes.object.isRequired,
    /**
     * 修改成功的回调
     */
    onSuccess: PropTypes.func.isRequired
  };

  state = {
    regionIndexCodes: [],
    doors: [],
    loading: false,
    doorsSelectVisible: false,
    doorsSelectLoading: false,
    tableDataKey: 0,
    addLoading: false,
    selectedDoors: []
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
    validateFields((err, values) => {
      if (err) {
        return;
      }
      this.submitData(values);
    });
  };

  submitData = async values => {
    this.setState({ loading: true });
    const { record } = this.props;
    try {
      await http({ baseURL: realsunApiBaseURL }).modifyRecords({
        resid: '682507600534',
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

  handleSelectedDoorsChange = doors => {
    this.setState({ doors });
  };

  getSelectedDoors = async () => {
    this.setState({ addLoading: true, doors: [] });
    const { record } = this.props;
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getSubTable({
        resid: 683210011323,
        subresid: 682507735244,
        hostrecid: record.REC_ID
      });
    } catch (err) {
      this.setState({ addLoading: false });
      return;
    }
    this.setState({
      doorsSelectVisible: true,
      selectedDoors: res.data,
      addLoading: false
    });
  };

  actionBarExtra = ({ size }) => {
    return (
      <Button
        size={size}
        loading={this.state.addLoading}
        onClick={this.getSelectedDoors}
      >
        添加
      </Button>
    );
  };

  handleAddDoors = async () => {
    const { doors } = this.state;
    if (!doors.length) {
      return message.error('请选择门禁点');
    }

    this.setState({ doorsSelectLoading: true });
    const { record } = this.props;

    try {
      await http({ baseURL: realsunApiBaseURL }).addRecords({
        resid: '682507735244',
        data: doors.map((door, index) => {
          return {
            groupId: record.groupId,
            indexCode: door.indexCode,
            name: door.name,
            regionIndexCode: door.regionIndexCode,
            region: door.regionPathName,
            control: door.doorNo,
            _state: 'added',
            _id: index + 1
          };
        })
      });
    } catch (err) {
      this.setState({
        doorsSelectLoading: false,
        tableDataKey: this.state.tableDataKey + 1
      });
      return message.error(err.message);
    }
    this.setState({
      doorsSelectLoading: false,
      doorsSelectVisible: false,
      tableDataKey: this.state.tableDataKey + 1,
      doors: []
    });
    message.success('添加成功');
  };

  getTableDataRef = element => {
    console.log('element:', element);
    this.tableDataRef = element;
  };

  render() {
    const { record, ...otherProps } = this.props;
    const { getFieldDecorator } = this.props.form;
    const {
      regionIndexCodes,
      loading,
      doorsSelectVisible,
      doorsSelectLoading,
      tableDataKey
    } = this.state;
    return (
      <>
        <Modal
          {...otherProps}
          width={1180}
          title="修改门禁分组"
          onOk={this.handleSubmit}
          onCancel={() => {
            this.setState({ doors: [] });
            otherProps.onCancel && otherProps.onCancel();
          }}
        >
          <Spin spinning={loading}>
            <Form>
              <h2>基本信息</h2>
              <Form.Item label="门禁分组名称">
                {getFieldDecorator('name', {
                  initialValue: record.name,
                  rules: [
                    {
                      required: true,
                      message: `请输入门禁分组名称`
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
              key={tableDataKey}
              height={360}
              baseURL={realsunApiBaseURL}
              resid={682507600534}
              subresid={682507735244}
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
            ></TableData>
          </Spin>
        </Modal>
        <Modal
          title="添加门禁点"
          width={1180}
          visible={doorsSelectVisible}
          onCancel={() =>
            this.setState({ doorsSelectVisible: false, doors: [] })
          }
          onOk={this.handleAddDoors}
          confirmLoading={doorsSelectLoading}
          destroyOnClose
        >
          {!!regionIndexCodes.length && (
            <DoorsSelect
              regionIndexCodes={regionIndexCodes}
              onSelectedDoorsChange={this.handleSelectedDoorsChange}
              selectedDoors={this.state.selectedDoors}
            ></DoorsSelect>
          )}
        </Modal>
      </>
    );
  }
}

export default Form.create()(ModifyDoorsModal);
