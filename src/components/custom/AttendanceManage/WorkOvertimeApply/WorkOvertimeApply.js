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

const DateTimeFormatter = 'YYYY-MM-DD HH:mm';
/**
 * 可编辑行 https://ant.design/components/table-cn/#components-table-demo-edit-row
 */
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
        input = (
          <DatePicker
            showTime={{
              format: 'HH:mm',
              minuteStep: 30,
              defaultValue: moment('00:00', 'HH:mm')
            }}
            format={DateTimeFormatter}
          />
        );
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
/**
 * 加班批量申请
 * @author 邓铭
 */
class WorkOvertimeApply extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '开始时间',
        dataIndex: 'startTime',
        type: InputType.DataTime,
        editable: true,
        width: 200
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        type: InputType.DataTime,
        editable: true,
        width: 200
      },
      {
        title: '小时数',
        dataIndex: 'hours',
        type: InputType.InputNumber,
        editable: true,
        width: 100
      },
      {
        title: '事由',
        dataIndex: 'reason',
        type: InputType.TextArea,
        editable: true,
        width: 300
      },
      {
        title: '提示信息',
        dataIndex: 'tips',
        width: 300
      },
      {
        title: '错误信息',
        dataIndex: 'error'
        // width: 300
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
            <>
              <a
                disabled={editingKey !== ''}
                style={{ marginRight: 8 }}
                onClick={() => this.edit(record.key)}
              >
                编辑
              </a>
              <Popconfirm
                title="确认删除吗?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                <a
                  disabled={editingKey !== ''}
                  style={{ color: editingKey === '' ? 'red' : '#ccc' }}
                >
                  删除
                </a>
              </Popconfirm>
            </>
          );
        }
      }
    ];
    this.columnsEn = [
      {
        title: 'Start Time',
        dataIndex: 'startTime',
        type: InputType.DataTime,
        editable: true,
        width: 200
      },
      {
        title: 'End Time',
        dataIndex: 'endTime',
        type: InputType.DataTime,
        editable: true,
        width: 200
      },
      {
        title: 'Hours',
        dataIndex: 'hours',
        type: InputType.InputNumber,
        editable: true,
        width: 100
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        type: InputType.TextArea,
        editable: true,
        width: 300
      },
      {
        title: 'Tips',
        dataIndex: 'tips',
        width: 300
      },
      {
        title: 'Eror',
        dataIndex: 'error'
        // width: 300
      },
      {
        title: 'Operation',
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
                    Done
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => this.cancel(record.key)}
              >
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <>
              <a
                disabled={editingKey !== ''}
                style={{ marginRight: 8 }}
                onClick={() => this.edit(record.key)}
              >
                Edit
              </a>
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                <a
                  disabled={editingKey !== ''}
                  style={{ color: editingKey === '' ? 'red' : '#ccc' }}
                >
                  Delete
                </a>
              </Popconfirm>
            </>
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
    let lan = localStorage.getItem('language');
    this.setState({lan});
    this.getRecords();
  }

  /**
   * 获取未提交的申请
   */
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

  /**
   * 判断记录是否正在编辑
   */
  isEditing = record => record.key === this.state.editingKey;

  /**
   * 点击取消按钮
   */
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

  /**
   * 点击保存按钮
   *
   */
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
              ? row.startTime.format('YYYY-MM-DD HH:mm')
              : row.startTime,
            C3_489231991601: row.endTime.format
              ? row.endTime.format('YYYY-MM-DD HH:mm')
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
            reason: res.C3_489232525436,
            tips: res.C3_489237393687
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

  /**
   * 向后端保存数据
   */
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

  /**
   * 点击编辑按钮
   */
  edit(key) {
    this.setState({ editingKey: key });
  }

  /**
   * 删除申请单
   */
  handleDelete = key => {
    this.props.setLoading(true);
    const dataSource = [...this.state.dataSource];
    const record = dataSource.find(item => item.key === key);
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    try {
      http().removeRecords({
        resid: '489233670834',
        data: [{ REC_ID: record.REC_ID }],
        dblinkname: 'ehr'
      });
      message.success(this.state.lan==='中文'?'删除成功':'Success');
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      this.props.setLoading(false);
    }
  };

  /**
   * 添加申请单
   */
  handleAdd = () => {
    const { count, dataSource, editingKey } = this.state;
    if (editingKey !== '') {
      return message.info(this.state.lan==='中文'?'有记录正在编辑，请先完成编辑':"Some records haven't been saved.");
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

  /**
   * 提交
   * @param {object} data
   * @returns {void}
   */
  submit = async data => {
    try {
      this.props.setLoading(true);
      await http().modifyRecords({
        resid: '489233670834',
        data,
        dblinkname: 'ehr'
      });
      message.success(this.state.lan==='中文'?'提交成功':'Success');
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
    const columnsEn = this.columnsEn.map(col => {
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
              icon="edit"
            >
              {this.state.lan==='中文'?'新建':'Add'}
            </Button>

            <Popconfirm
              title={this.state.lan==='中文'?"确认提交吗？":'Aru you sure?'}
              onConfirm={() => {
                if (selectedRowKeys.length) {
                  if (editingKey) {
                    return message.info(this.state.lan==='中文'?'有记录正在编辑，请先完成编辑':"Some records havn't been saved");
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
                  return message.info(this.state.lan==='中文'?'至少选择一条记录':'Undefined Record');
                }
              }}
            >
              <Button
                type="primary"
                style={{ marginBottom: 16, marginRight: 8 }}
              >
                {this.state.lan==='中文'?'提交申请':'Apply'}
              </Button>
            </Popconfirm>
            <Button
              onClick={() => this.props.goBack()}
              icon="rollback"
              style={{ marginBottom: 16, marginRight: 8 }}
            >
              {this.state.lan==='中文'?'返回':'Back'}
            </Button>
            <Table
              components={components}
              scroll={{ x: 1500 }}
              rowClassName="editable-row"
              bordered
              dataSource={dataSource}
              columns={this.state.lan==='中文'?columns:columnsEn}
              rowSelection={rowSelection}
              // onRow={record => ({
              //   onClick: () => {
              //     this.selectRow(record);
              //   }
              // })}
              size="small"
              pagination={{
                onChange: () => this.setState({ editingKey: '' })
              }}
            />
          </div>
        </div>
      </EditableContext.Provider>
    );
  }
}

export default Form.create()(WorkOvertimeApply);
