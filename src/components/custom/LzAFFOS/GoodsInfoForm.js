import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  Icon,
  Upload,
  message,
  Modal
} from 'antd';
import React from 'react';
import './LzAFFOS.less';
import { uploadFile } from '../../../util/api';
import moment from 'moment';
import XLSX from 'xlsx';
const EditableContext = React.createContext();
const Dragger = Upload.Dragger;

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `请填写${title}.`
            }
          ],
          initialValue: record[dataIndex]
        })(
          <Input
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}
const noop = () => {};

class GoodsInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '物品名称',
        dataIndex: 'goodsName',
        editable: true,
        width: '10%'
      },
      {
        title: '单位',
        dataIndex: 'unit',
        editable: true,
        width: '10%'
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        editable: true,
        width: '10%'
      },
      {
        title: '带出原因',
        dataIndex: 'reason',
        editable: true,
        width: '30%'
      },
      {
        title: '照片链接',
        dataIndex: 'photo1',
        width: '30%',
        render: (text, record) => (
          <Upload
            onChange={this.handleFileChange}
            fileList={this.state.dataSource.find(key => key == record.key)}
            // fileList={this.state.fileList}
            onRemove={v => {
              this.setState({ fileList: [] });
              this.state.dataSource.map((item, index) => {
                if (item.key == record.key) {
                  item.name = '';
                  item.url = '';
                  item.status = '';
                  item.uid = moment().format();
                  item.photo1 = '';
                }
              });
            }}
            customRequest={async file => {
              const res = await uploadFile(file.file);
              this.setState({
                fileList: [
                  {
                    name: file.file.name,
                    url: res,
                    status: 'done',
                    uid: moment().format(),
                    photo1: res
                  }
                ]
              });
              this.state.dataSource.map((item, index) => {
                if (item.key == record.key) {
                  item.name = file.file.name;
                  item.url = res;
                  item.status = 'done';
                  item.uid = moment().format();
                  item.photo1 = res;
                }
              });
              message.info('照片上传成功');
            }}
          >
            <Button>
              <Icon type="upload" /> 上传附件
            </Button>
          </Upload>
        )
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '10%',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="是否确认删除?"
              onConfirm={() => this.deleteBuilder(record.key)}
            >
              <a>删除</a>
            </Popconfirm>
          ) : null
      }
    ];

    this.state = {
      fileList: [], //照片上传数据
      dataSource: [
        {
          key: 2
        }
      ],
      count: 3,
      showDragger: false
    };
  }
  //照片上传
  handleFileChange = (info, record) => {
    let fileList = [...info.fileList];
    this.setState({ fileList });
  };

  checkNumLength = () => {};
  //导入人员
  readWorkbookFromLocalFile = info => {
    const file = info.file.originFileObj;
    const reader = new FileReader();
    const ctx = this;
    const { count, dataSource } = ctx.state;
    const importData = [];
    reader.onload = function(e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      message.success('选择文件成功');
      // 只读取 sheet1 中的 excel 数据
      ctx._sheet1 = workbook.Sheets[workbook.SheetNames[0]];
      var sheetJson = XLSX.utils.sheet_to_json(ctx._sheet1);
      sheetJson.map((item, index) => {
        const newInfo = {};
        newInfo.key = count + index;
        newInfo.goodsName = item.物品名称;
        newInfo.unit = item.单位;
        newInfo.quantity = item.数量;
        newInfo.reason = item.带出原因;
        importData.push(newInfo);
      });
      ctx.setState({
        count: count + importData.length,
        dataSource: [...importData, ...dataSource]
      });
    };
    reader.readAsArrayBuffer(file);
    this.setState({
      showDragger: false
    });
  };

  //删除施工人员
  deleteBuilder = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  //添加施工人员
  addBuilder = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      goodsName: '',
      unit: '',
      quantity: '',
      reason: ''
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  };

  //保存修改
  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ dataSource: newData });
  };

  //向父组件发送施工人员名单
  sendDeliverList = () => {
    this.props.getGoodsInfo(this.state.dataSource);
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
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
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <div>
        <Button type="primary" onClick={this.sendDeliverList}>
          提交
        </Button>
        <Button
          onClick={this.addBuilder}
          type="primary"
          style={{ marginBottom: 16, marginLeft: 10, marginRight: 10 }}
        >
          添加
        </Button>
        <Button
          type="primary"
          onClick={() => {
            this.setState({
              showDragger: true
            });
          }}
        >
          导入
        </Button>
        <Modal
          visible={this.state.showDragger}
          title="导入人员清单"
          onCancel={() => {
            this.setState({
              showDragger: false
            });
          }}
        >
          <Dragger
            name="file"
            customRequest={noop}
            onChange={this.readWorkbookFromLocalFile}
          >
            <p>点击或拖拽文件到此区域</p>
          </Dragger>
        </Modal>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}

export default GoodsInfoForm;
