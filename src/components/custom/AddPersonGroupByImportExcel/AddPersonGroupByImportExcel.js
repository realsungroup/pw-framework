import React from 'react';
import http from 'Util20/api';
import { Icon, Input, Table, Modal, Upload, message, Form } from 'antd';
import './AddPersonGroupByImportExcel.less';
import XLSX from 'xlsx';
import { validPersons as validPersonsApi } from '../../../hikApi';
import { getAccessToken } from 'Util20/util';
import PropTypes from 'prop-types';

const { Dragger } = Upload;
const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

class AddPersonGroupByImportExcel extends React.Component {
  static propTypes = {
    /**
     * 添加成功的回调
     */
    onSuccess: PropTypes.func
  };

  state = {
    fileName: '',
    isValidateComplete: false,
    validPersons: [],
    inValidPersons: [],
    confirmLoading: false
  };

  readWorkbookFromLocalFile = info => {
    const file = info.file.originFileObj;
    this.setState({ fileName: file.name });
    const reader = new FileReader();
    const ctx = this;
    this.setState({
      fileInfo: info,
      progressIndex: 0,
      feMessages: []
    });
    reader.onload = function(e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {
        type: 'array',
        cellDates: true, // https://github.com/SheetJS/js-xlsx/issues/703#issuecomment-357383504
        dateNF: 'yyyy/mm/dd;@' // 日期格式化
      });
      const sheet1Name = workbook.SheetNames[0];
      ctx._sheetData = workbook.Sheets[sheet1Name];
      ctx.handleImportExcel(ctx._sheetData, file.name);
    };
    reader.readAsArrayBuffer(file);
  };

  handleImportExcel = sheetData => {
    const resultArr = XLSX.utils.sheet_to_json(sheetData, {
      header: 1,
      dateNF: 'm/d/yy h:mm'
    });
    const recordArr = resultArr.slice(1);
    const records = this.getRecords(recordArr);
    this.validPersons(records);
  };

  validPersons = async persons => {
    const accessToken = getAccessToken();

    let res;
    try {
      res = await validPersonsApi({
        accessToken,
        persons
      });
    } catch (err) {
      this.setState({ isValidateComplete: true });
      return message.error(err.message);
    }
    const { validPersons, inValidPersons } = res.data;

    this.setState({ validPersons, inValidPersons, isValidateComplete: true });
  };

  getRecords = recordArr => {
    const fileArr = ['jobNo', 'name'];
    const records = [];
    recordArr.forEach(record => {
      const recordItem = {};
      record.forEach((value, index) => {
        recordItem[fileArr[index]] = value;
      });
      records.push(recordItem);
    });
    return records;
  };

  columns = [
    {
      title: '行号',
      dataIndex: 'rowIndex',
      key: 'rowIndex',
      width: 100
    },
    {
      title: '工号',
      dataIndex: 'jobNo',
      key: 'jobNo',
      width: 200
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 200
    }
  ];

  inValidColumns = [
    ...this.columns,
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      render: text => {
        return <div style={{ color: '#f00' }}>{text}</div>;
      }
    }
  ];

  validColumns = [
    ...this.columns,
    {
      title: '',
      dataIndex: '',
      key: 'test'
    }
  ];

  handleSubmit = async values => {
    this.setState({ confirmLoading: true });
    const { validPersons } = this.state;
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
            subdata: validPersons.map((person, index) => {
              return {
                resid: '682507890263',
                maindata: {
                  personId: person.personId,
                  jobNo: person.jobNo,
                  name: person.name,
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
      this.setState({ confirmLoading: false });
      return message.error(err.message);
    }

    this.setState({ confirmLoading: false });
    const { onSuccess } = this.props;
    message.success('添加成功');
    onSuccess && onSuccess();
  };

  handleOk = () => {
    const { validateFields } = this.props.form;
    const { validPersons, inValidPersons } = this.state;

    const callback = values => {
      if (inValidPersons.length) {
        Modal.confirm({
          title: '提示',
          content: `有 ${inValidPersons.length} 个人员的信息有误，您确定要导入吗？`,
          onOk: () => this.handleSubmit(values)
        });
      } else {
        this.handleSubmit(values);
      }
    };
    validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!validPersons.length) {
        return message.error('没有有效的人员');
      }
      callback(values);
    });
  };

  render() {
    const { fileName, isValidateComplete, confirmLoading } = this.state;
    const { onSuccess, ...otherProps } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        width={1180}
        title="通过 Excel 导入人员分组"
        okButtonProps={{ disabled: !isValidateComplete }}
        okText="导入"
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        {...otherProps}
      >
        <Form>
          <Form.Item label="人员分组名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: `请输入人员分组名称`
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
        <h3>选择 Excel</h3>
        <Dragger
          name="file"
          onChange={this.readWorkbookFromLocalFile}
          customRequest={() => {}}
          showUploadList={false}
        >
          {fileName ? (
            <div>
              <Icon type="file-excel" />
              <span>{fileName}</span>
              {!isValidateComplete && (
                <div style={{ marginLeft: 4, color: '#f00' }}>
                  校验中，请稍等...
                  <Icon type="loading" />
                </div>
              )}
            </div>
          ) : (
            <p>点击或拖拽文件到此区域</p>
          )}
        </Dragger>

        {isValidateComplete && <h3 style={{ marginTop: 30 }}>校验结果</h3>}

        {isValidateComplete && (
          <Table
            size="small"
            title={() => <h4 style={{ color: '#f00' }}>无效的人员</h4>}
            columns={this.inValidColumns}
            dataSource={this.state.inValidPersons}
            rowKey={(record, index) => `${record.personId}-${index}`}
            pagination={{ pageSize: 10 }}
            bordered
          ></Table>
        )}
        {isValidateComplete && (
          <Table
            size="small"
            title={() => <h4 style={{ color: '#34a853' }}>有效的人员</h4>}
            columns={this.validColumns}
            dataSource={this.state.validPersons}
            rowKey={(record, index) => `${record.personId}-${index}`}
            pagination={{ pageSize: 10 }}
            bordered
          ></Table>
        )}
      </Modal>
    );
  }
}

export default Form.create()(AddPersonGroupByImportExcel);
