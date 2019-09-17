import React from 'react';
import './WorkOvertimeApply.less';
import http from 'Util20/api';
import {
  Button,
  Input,
  Form,
  Popconfirm,
  Table,
  InputNumber,
  DatePicker,
  message,
  Tooltip
} from 'antd';
import moment from 'moment';

const { TextArea } = Input;
const EditableContext = React.createContext();

const InputType = {
  Input: 'Input',
  InputNumber: 'InputNumber',
  TextArea: 'TextArea',
  DataTime: 'DateTime'
};

class EditableCell extends React.Component {
  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      type,
      ...restProps
    } = this.props;
    let input = null;
    let initialValue = null;
    switch (type) {
      case InputType.DataTime:
        input = <DatePicker showTime />;
        initialValue = record[dataIndex] && moment(record[dataIndex]);
        break;
      case InputType.Input:
        input = <Input />;
        initialValue = moment(record[dataIndex]);
        break;
      case InputType.InputNumber:
        input = <InputNumber />;
        initialValue = record[dataIndex];
        break;
      case InputType.TextArea:
        input = <TextArea />;
        initialValue = record[dataIndex];
        break;
      default:
        break;
    }
    let _children =
      typeof children[2] !== 'object' ? (
        <Tooltip title={children[2]}>{children}</Tooltip>
      ) : (
        children
      );

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入 ${title}!`
                }
              ],
              initialValue
            })(input)}
          </Form.Item>
        ) : (
          _children
        )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

class WorkOvertimeApply extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '开始时间',
        dataIndex: 'startTime',
        type: InputType.DataTime,
        editable: true,
        width: 230
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        type: InputType.DataTime,
        editable: true,
        width: 230
      },
      {
        title: '小时数',
        dataIndex: 'hours',
        type: InputType.InputNumber,
        editable: true,
        width: 120
      },
      {
        title: '事由',
        dataIndex: 'reason',
        type: InputType.TextArea,
        editable: true,
        width: 200
      },
      {
        title: '提示信息',
        dataIndex: 'tips',
        width: 300
      },
      {
        title: '错误信息',
        dataIndex: 'error',
        width: 300
      },
      {
        title: '操作',

        dataIndex: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    完成
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="确认放弃编辑的内容吗？"
                onConfirm={() => this.cancel(record.key)}
              >
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
            <a
              disabled={editingKey !== ''}
              onClick={() => this.edit(record.key)}
            >
              编辑
            </a>
          );
        }
      }
    ];
  }
  state = {
    dataSource: [],
    count: 0,
    selectedRowKeys: [],
    editingKey: ''
  };
  componentDidMount() {
    this.getRecords();
  }

  getRecords = async () => {
    try {
      let res = await http().getTable({
        resid: '489233670834',
        dblinkname: 'ehr'
      });
      let dataSource = [...res.data];
      dataSource = dataSource.map(item => {
        return {
          startTime: item.C3_489231991382,
          endTime: item.C3_489231991601,
          hours: item.C3_489232060991,
          reason: item.C3_489232525436,
          tips: item.C3_489237393687,
          error: item.C3_489246954187,
          REC_ID: item.REC_ID,
          key: item.REC_ID
        };
      });
      this.setState({
        dataSource,
        count: dataSource.length
      });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };
  isEditing = record => record.key === this.state.editingKey;
  cancel = key => {
    const { dataSource } = this.state;
    let data = dataSource.find(item => {
      return item.key === key;
    });
    if (data.REC_ID) {
      this.setState({ editingKey: '' });
    } else {
      this.setState({
        editingKey: '',
        dataSource: dataSource.filter(item => item.key !== key)
      });
    }
  };
  save(form, key) {
    form.validateFields(async (error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.dataSource];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        try {
          let res = await this.hadnleSave({
            C3_489231991382: row.startTime.format
              ? row.startTime.format('YYYY-MM-DD HH:mm:ss')
              : row.startTime,
            C3_489231991601: row.endTime.format
              ? row.endTime.format('YYYY-MM-DD HH:mm:ss')
              : row.endTime,
            C3_489232060991: row.hours,
            C3_489232525436: row.reason,
            REC_ID: newData[index].REC_ID
          });
          newData.splice(index, 1, {
            REC_ID: res.REC_ID,
            key: res.REC_ID,
            startTime: res.C3_489231991382,
            endTime: res.C3_489231991601,
            hours: res.C3_489232060991,
            reason: res.C3_489232525436
          });
          this.setState({ dataSource: newData, editingKey: '' });
        } catch (error) {
          console.log(error);
          message.error(error.message);
        }
      } else {
        newData.push(row);
        this.setState({ dataSource: newData, editingKey: '' });
      }
    });
  }

  hadnleSave = async record => {
    try {
      let res;
      this.props.setLoading(true);
      if (record.REC_ID) {
        res = await http().modifyRecords({
          resid: '489233670834',
          data: [record],
          dblinkname: 'ehr',
          isEditOrAdd: true
        });
      } else {
        delete record.REC_ID;
        res = await http().addRecords({
          resid: '489233670834',
          data: [record],
          dblinkname: 'ehr',
          isEditOrAdd: true
        });
      }
      return res.data[0];
    } catch (error) {
      throw error;
    } finally {
      this.props.setLoading(false);
    }
  };
  edit(key) {
    this.setState({ editingKey: key });
  }
  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource, editingKey } = this.state;
    if (editingKey !== '') {
      return message.info('有记录正在编辑，请先完成编辑');
    }
    const newData = {
      key: count,
      startTime: null,
      endTime: null,
      hours: 0,
      reason: ''
    };
    this.setState({
      dataSource: [...dataSource, newData],
      editingKey: count,
      count: count + 1
    });
  };

  // selectRow = record => {
  //   const selectedRowKeys = [...this.state.selectedRowKeys];
  //   if (selectedRowKeys.indexOf(record.key) >= 0) {
  //     selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
  //   } else {
  //     selectedRowKeys.push(record.key);
  //   }
  //   this.setState({ selectedRowKeys });
  // };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  submit = async data => {
    try {
      console.log(data);
      this.props.setLoading(true);
      await http().modifyRecords({
        resid: '489233670834',
        data
      });
      message.success('提交成功');
      this.getRecords();
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      this.props.setLoading(false);
    }
  };

  render() {
    const { dataSource, selectedRowKeys, editingKey } = this.state;
    const components = {
      body: {
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          type: col.type,
          editing: this.isEditing(record)
        })
      };
    });
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      fixed: true
    };
    return (
      <EditableContext.Provider value={this.props.form}>
        <div className="attendance-manage_tabledata__wrapper">
          <div id="work-overtime-apply">
            <Button
              onClick={this.handleAdd}
              type="primary"
              style={{ marginBottom: 16, marginRight: 8 }}
            >
              新建
            </Button>

            <Popconfirm
              title="确认提交吗？"
              onConfirm={() => {
                if (selectedRowKeys.length) {
                  if (editingKey) {
                    return message.info('有记录正在编辑，请先完成编辑');
                  }
                  let selectedRecords = selectedRowKeys.map(key => {
                    return {
                      REC_ID: dataSource.find(item => {
                        return item.key === key;
                      }).REC_ID,
                      C3_489235088041: 'Y'
                    };
                  });
                  this.submit(selectedRecords);
                } else {
                  return message.info('至少选择一条记录');
                }
              }}
            >
              <Button
                type="primary"
                style={{ marginBottom: 16, marginRight: 8 }}
              >
                提交申请
              </Button>
            </Popconfirm>

            <Table
              components={components}
              scroll={{ x: 1200 }}
              rowClassName="editable-row"
              bordered
              dataSource={dataSource}
              columns={columns}
              rowSelection={rowSelection}
              // onRow={record => ({
              //   onClick: () => {
              //     this.selectRow(record);
              //   }
              // })}
              pagination={{
                onChange: () => this.setState({ editingKey: '' })
              }}
            />
          </div>
          {/* <TableData
          key="work-overtime-apply"
          resid="489233670834"
          subtractH={200}
          hasAdvSearch={false}
          hasAdd={true}
          hasRowView={false}
          hasRowDelete={false}
          hasBeBtns={true}
          hasRowEdit={false}
          hasDelete={false}
          hasModify={false}
          hasRowModify={false}
          hasRowSelection={true}
          actionBarWidth={100}
          dblinkname="ehr"
          actionBarExtra={this.actionBarExtra}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
        /> */}
        </div>
      </EditableContext.Provider>
    );
  }
}

export default Form.create()(WorkOvertimeApply);
