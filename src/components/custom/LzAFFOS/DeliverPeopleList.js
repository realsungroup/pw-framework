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
class DeliverPeopleList extends React.Component {
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
        title: '照片链接',
        dataIndex: 'photo',
        width: '20%',
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
                  item.photo = '';
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
                    photo: res
                  }
                ]
              });
              this.state.dataSource.map((item, index) => {
                if (item.key == record.key) {
                  item.name = file.file.name;
                  item.url = res;
                  item.status = 'done';
                  item.uid = moment().format();
                  item.photo = res;
                }
              });
              console.log('this.state.dataSource', this.state.dataSource);
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
    console.log('点击导入');
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
      // console.log(sheetJson);
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

        importData.push(newInfo);
        // console.log('要添加的', newInfo);
        // ctx.setState({
        //   dataSource: [newInfo, ...dataSource],
        //   count: count + 1
        // });
      });
      // console.log('import', importData);
      ctx.setState({
        count: count + importData.length,
        dataSource: [...importData, ...dataSource]
      });
    };
    // console.log('外面import', importData);
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
      C3_605716828937: '',
      C3_605716867680: '',
      C3_614704116070: '',
      C3_606412134505: ''
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
    if (
      !this.state.dataSource.find(item => {
        if (!/^1[345678]\d{9}$/.test(item.C3_606412134505)) {
          message.info(`${item.C3_605716828937}的手机号码有误，请重新填写`);
          return true;
        } else if (
          !/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
            item.C3_614704116070
          )
        ) {
          message.info(`${item.C3_605716828937}的证件号码有误，请重新填写`);
          return true;
        }
        return false;
      })
    ) {
      this.props.parent.getDelivererList(this, this.state.dataSource);
      console.log('人员名单', this.state.dataSource);
    }
  };

  render() {
    console.log('chushihua', this.state.dataSource);
    this.setState({
      dataSource: {}
    });
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

export default DeliverPeopleList;
