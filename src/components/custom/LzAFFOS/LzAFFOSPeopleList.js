import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  message,
  Upload,
  Modal
} from 'antd';
import React from 'react';
import './LzAFFOS.less';
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
    editing: false,
    _sheet1: {}
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
class LzAFFOSPeopleList extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '访客姓名',
        dataIndex: 'C3_605716828937',
        editable: true,
        width: '10%'
      },
      {
        title: '登记证件类型',
        dataIndex: 'C3_605716867680',
        editable: true,
        width: '10%'
      },
      {
        title: '登记证件号码',
        dataIndex: 'C3_614704116070',
        editable: true,
        width: '20%'
      },
      {
        title: '访客手机号码',
        dataIndex: 'C3_606412134505',
        editable: true,
        width: '20%'
      },
      {
        title: '备注',
        dataIndex: 'C3_605717318503',
        editable: true,
        width: '20%'
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
      // 临时数据，需要清空
      dataSource: [],
      count: 6
    };
  }

  readWorkbookFromLocalFile = info => {
    console.log('点击导入');
    const file = info.file.originFileObj;
    const reader = new FileReader();
    const ctx = this;
    // this.setState({ fileInfo: info });
    const { count, dataSource } = ctx.state;
    const importData = [];
    reader.onload = function(e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      message.success('选择文件成功');
      // 只读取 sheet1 中的 excel 数据
      ctx._sheet1 = workbook.Sheets[workbook.SheetNames[0]];
      var sheetJson = XLSX.utils.sheet_to_json(ctx._sheet1);
      console.log(sheetJson);
      // console.log(ctx._sheet1);
      // ctx.setState({ isSelectFile: true });

      sheetJson.map((item, index) => {
        // console.log(index, item);
        const newInfo = {};
        newInfo.key = count + index;
        console.log('state', ctx.state.dataSource);
        newInfo.C3_605716828937 = item.访客姓名;
        newInfo.C3_605716867680 = item.登记证件类型;
        newInfo.C3_614704116070 = item.登记证件号码;
        newInfo.C3_606412134505 = item.访客手机号码;
        newInfo.C3_605717318503 = item.备注;
        importData.push(newInfo);
        console.log('要添加的', newInfo);
        // ctx.setState({
        //   dataSource: [newInfo, ...dataSource],
        //   count: count + 1
        // });
      });
      console.log('import', importData);
      this.setState({
        dataSource: [...importData]
      });
    };
    console.log('外面import', importData);

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
      C3_605716828937: ' ',
      C3_605716867680: ' ',
      C3_614704116070: ' ',
      C3_606412134505: ' ',
      C3_605717318503: ' '
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
  sendBuilderList = () => {
    this.props.parent.getBuilderList(this, this.state.dataSource);
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
        <Button type="primary" onClick={this.sendBuilderList}>
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

export default LzAFFOSPeopleList;
