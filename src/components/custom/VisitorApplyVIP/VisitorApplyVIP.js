import React from 'react';
import './VisitorApplyVIP.less';
import TableData from '../../common/data/TableData';
import http from '../../../util20/api';
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Radio,
  Select
} from 'antd';
import moment from 'moment';

const Option = Select.Option;
class VisitorApplyVIP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addModal: false,
      peopleList: [],
      record: {}, //当前选中的剂量
      options: [] // 选择的一级审批人
    };
  }
  actionBarExtra = record => {
    return (
      <Button
        onClick={() => {
          this.onAdd();
        }}
      >
        添加
      </Button>
    );
  };
  onAdd = () => {
    this.setState({
      addModal: true,
      mode: 'add'
    });
  };
  handleEdit = record => {
    let peopleList = [];
    for (let i = 0; i < record.countVisitors; i++) {
      peopleList.push({ name: true });
    }
    this.setState({
      addModal: true,
      record,
      peopleList,
      mode: 'check'
    });
  };
  componentDidMount = () => {
    this.getApprover();
    this.info();
  };

  info = () => {
    Modal.info({
      title: '温馨提示',
      content: (
        <div>
          <p>VIP访客指外部审核人员、政府官员及公司内部VIP</p>
        </div>
      ),
      onOk() {}
    });
  };
  getApprover = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: 614880215357
      });
      let arr = [];
      res.data.forEach(item => {
        arr.push({
          C3_614880295520: item.C3_614880295520,
          C3_614880295762: item.C3_614880295762
        });
      });
      this.setState({ options: arr });
    } catch (error) {
      message.error(error.message);
    }
  };
  remove = (item, index) => {
    const { peopleList } = this.state;
    let peopleListNew = [];
    peopleList.forEach((item, indexs) => {
      if (index === indexs) {
        item.name = '';
      }
      peopleListNew.push(item);
    });
    this.setState({
      peopleList: peopleListNew
    });
  };

  handleSave = () => {
    const { validateFieldsAndScroll } = this.props.form;
    const { record } = this.state;
    console.log({ record });
    validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        let data = {
          resid: 628946788076, // 主表 id
          maindata: {
            // 添加的主表记录
            _state: 'editoradd',
            C3_605703828345: values.C3_605703828345,
            visitDate: moment(values.visitDate).format('YYYY-MM-DD'),
            visitPurpose: values.visitPurpose,
            airportOrstation: values.airportOrstation,
            everydayCar: values.everydayCar,
            approver: values.approver,
            VIPMeal: values.VIPMeal,
            countVisitors: values.countVisitors,
            TeaBreak: values.TeaBreak,
            C3_612005042895: values.C3_612005042895,
            _id: 1
            // REC_ID: record.REC_ID ? record.REC_ID : ''
          }
        };
        const { peopleList } = this.state;
        peopleList.forEach((item, index) => {
          if (item.name) {
            data.maindata[`Name${index + 1}`] = values[`Name${index + 1}`];
          } else {
            data.maindata[`Name${index + 1}`] = '';
          }
        });
        try {
          res = await http().saveRecordAndSubTables({
            data: [data]
          });
          message.success('申请成功，请等待审批');
          this.setState({
            addModal: false
          });
          this.tableDataRef.handleRefresh();
        } catch (error) {
          message.error(error.message);
        }
      }
    });
  };
  handlePushPeople = () => {
    const { peopleList } = this.state;
    let peopleListNew = this.deepClone(peopleList);
    peopleListNew.push({ name: true });
    this.setState({
      peopleList: peopleListNew
    });
  };
  deepClone = obj => {
    return JSON.parse(JSON.stringify(obj));
  };

  render() {
    const { addModal, peopleList, record, options, mode } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    return (
      <React.Fragment>
        <TableData
          resid="628946788076"
          height={640}
          subtractH={220}
          hasModify={false}
          hasDelete={false}
          hasAdd={false}
          hasRowModify={false}
          hasRowView={false}
          hasRowDelete={false}
          hasBeBtns={true}
          actionBarWidth={170}
          advSearch={{
            formName:'defaultSearch'
          }}
          customRowBtns={[
            record => {
              return (
                <Button
                  onClick={() => {
                    this.handleEdit(record);
                  }}
                >
                  查看
                </Button>
              );
            }
          ]}
          actionBarExtra={this.actionBarExtra}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
        />
        <Modal
          visible={addModal}
          width={600}
          destroyOnClose
          okText={'申请'}
          cancelText={'取消'}
          onOk={() => this.handleSave()}
          onCancel={() =>
            this.setState({ addModal: false, peopleList: [], record: {} })
          }
          footer={
            mode === 'check' ? null : (
              <React.Fragment>
                <Button
                  onClick={() => {
                    this.setState({
                      addModal: false,
                      peopleList: [],
                      record: {}
                    });
                  }}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    this.handleSave();
                  }}
                >
                  申请
                </Button>
              </React.Fragment>
            )
          }
          centered
        >
          <Form {...formItemLayout} className="VisitorApplyVIP-form">
            <Form.Item
              label="来访单位"
              hasFeedback={mode === 'check' ? false : true}
            >
              {getFieldDecorator('C3_605703828345', {
                initialValue: record && record.C3_605703828345,
                rules: [
                  {
                    required: true,
                    message: '请输入来访单位!'
                  }
                ]
              })(<Input disabled={mode === 'check' ? true : false} />)}
            </Form.Item>

            <Form.Item
              label="来访人数"
              hasFeedback={mode === 'check' ? false : true}
            >
              {getFieldDecorator('countVisitors', {
                initialValue: record && record.countVisitors,
                rules: [
                  {
                    required: true,
                    message: '请输入来访人数!'
                  }
                ]
              })(<Input disabled={mode === 'check' ? true : false} />)}
            </Form.Item>

            {mode === 'check' ? (
              ''
            ) : (
              <Form.Item
                label="添加来访人员"
                hasFeedback={mode === 'check' ? false : true}
              >
                <Button
                  type="primary"
                  icon="plus"
                  className="visitorApply_addPeople"
                  onClick={this.handlePushPeople}
                >
                  添加人员
                </Button>
              </Form.Item>
            )}

            {peopleList.map((item, index) => {
              if (item.name) {
                return (
                  <Form.Item label={`人员${index + 1}`} key={index}>
                    {getFieldDecorator(`Name${index + 1}`, {
                      initialValue: record[`Name${index + 1}`]
                    })(
                      <Input
                        disabled={mode === 'check' ? true : false}
                        className="visitorApply_input"
                      />
                    )}
                    <Button
                      disabled={mode === 'check' ? true : false}
                      type="danger"
                      onClick={() => {
                        this.remove(item, index);
                      }}
                      className="visitorApply_deleteBtn"
                      icon="delete"
                    >
                      删除
                    </Button>
                  </Form.Item>
                );
              }
            })}

            <Form.Item
              label="VIP餐"
              className="fix-form-feedback-bug"
              hasFeedback={mode === 'check' ? false : true}
            >
              {getFieldDecorator('VIPMeal', {
                initialValue: record && record.VIPMeal,
                rules: [
                  {
                    required: true,
                    message: '请选择VIP餐!'
                  }
                ]
              })(
                <Radio.Group disabled={mode === 'check' ? true : false}>
                  <Radio value={'否'}>不需要</Radio>
                  <Radio value={'是'}>需要</Radio>
                </Radio.Group>
              )}
              <div>仅限外部审核及重要访客</div>
            </Form.Item>
            <Form.Item
              label="来访日期"
              hasFeedback={mode === 'check' ? false : true}
            >
              {getFieldDecorator('visitDate', {
                initialValue: record && moment(record.visitDate),
                rules: [
                  {
                    required: true,
                    message: '请输入来访日期!'
                  }
                ]
              })(<DatePicker disabled={mode === 'check' ? true : false} />)}
            </Form.Item>

            <Form.Item
              label="离开日期"
              hasFeedback={mode === 'check' ? false : true}
            >
              {getFieldDecorator('Enddate', {
                initialValue: record && moment(record.Enddate),
                rules: [
                  {
                    required: true,
                    message: '请输入离开日期!'
                  }
                ]
              })(<DatePicker disabled={mode === 'check' ? true : false} />)}
            </Form.Item>

            <Form.Item
              label="来访目的"
              hasFeedback={mode === 'check' ? false : true}
            >
              {getFieldDecorator('visitPurpose', {
                initialValue: record && record.visitPurpose,
                rules: [
                  {
                    required: true,
                    message: '请输入来访目的!'
                  }
                ]
              })(<Input disabled={mode === 'check' ? true : false} />)}
            </Form.Item>

            <Form.Item
              label="接机/接站"
              className="fix-form-feedback-bug"
              hasFeedback={mode === 'check' ? false : true}
            >
              {getFieldDecorator('airportOrstation', {
                initialValue: record && record.airportOrstation,
                rules: [
                  {
                    required: true,
                    message: '请选择接机/接站!'
                  }
                ]
              })(
                <Radio.Group disabled={mode === 'check' ? true : false}>
                  <Radio value={'是'}>需要</Radio>
                  <Radio value={'否'}>不需要</Radio>
                </Radio.Group>
              )}
            </Form.Item>

            <Form.Item
              label="日常用车"
              className="fix-form-feedback-bug"
              hasFeedback={mode === 'check' ? false : true}
            >
              {getFieldDecorator('everydayCar', {
                initialValue: record && record.everydayCar,
                rules: [
                  {
                    required: true,
                    message: '请选择日常用车!'
                  }
                ]
              })(
                <Radio.Group disabled={mode === 'check' ? true : false}>
                  <Radio value={'是'}>需要</Radio>
                  <Radio value={'否'}>不需要</Radio>
                </Radio.Group>
              )}
            </Form.Item>

            <Form.Item
              label="审批人"
              hasFeedback={mode === 'check' ? false : true}
            >
              {getFieldDecorator('approver', {
                initialValue: record && record.approver,
                rules: [
                  {
                    required: true,
                    message: '请选择审批人!'
                  }
                ]
              })(
                <Select
                  disabled={mode === 'check' ? true : false}
                  placeholder="请选择审批人"
                >
                  {options.length > 0 &&
                    options.map(item => {
                      return (
                        <Option value={item.C3_614880295520}>
                          {item.C3_614880295762}
                        </Option>
                      );
                    })}
                </Select>
              )}
            </Form.Item>

            <Form.Item
              label="茶歇"
              className="fix-form-feedback-bug"
              hasFeedback={mode === 'check' ? false : true}
            >
              {getFieldDecorator('TeaBreak', {
                initialValue: record && record.TeaBreak,
                rules: [
                  {
                    required: true,
                    message: '请选择茶歇!'
                  }
                ]
              })(
                <Radio.Group disabled={mode === 'check' ? true : false}>
                  <Radio value={'是'}>需要</Radio>
                  <Radio value={'否'}>不需要</Radio>
                </Radio.Group>
              )}
            </Form.Item>

            <Form.Item
              label="备注"
              hasFeedback={mode === 'check' ? false : true}
            >
              {getFieldDecorator('applyPersonRemark', {
                initialValue: record && record.applyPersonRemark
              })(<Input.TextArea disabled={mode === 'check' ? true : false} />)}
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Form.create()(VisitorApplyVIP);
