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
      addModal: true
    });
  };
  handleEdit = record => {
    let peopleList = [];
    for (let i = 0; i < record.countVisitors; i++) {
      peopleList.push({ name: true });
    }
    console.log('peopleList', peopleList, record.countVisitors);
    this.setState({
      addModal: true,
      record,
      peopleList
    });
  };
  componentDidMount = () => {
    this.getApprover();
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
    let peopleListNew = []
    peopleList.forEach((item,indexs)=>{
        if(index === indexs){
            item.name ='';
        }
        peopleListNew.push(item)
    })
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
          resid: 628862440631, // 主表 id
          maindata: {
            // 添加的主表记录
            _state: 'editoradd',
            C3_605703828345: values.C3_605703828345,
            visitDate: moment(values.visitDate).format('YYYY-MM-DD'),
            visitPurpose: values.visitPurpose,
            airportOrstation: values.airportOrstation,
            everydayCar: values.everydayCar,
            VIPMeal: values.VIPMeal,
            countVisitors: values.countVisitors,
            TeaBreak: values.TeaBreak,
            C3_612005042895: values.C3_612005042895,
            _id: 1,
            REC_ID: record.REC_ID ? record.REC_ID : ''
          }
        };
        const { peopleList } = this.state;
        // let subdata = [];
        peopleList.forEach((item, index) => {
            if(item.name){
                data.maindata[`Name${index + 1}`] = values[`Name${index + 1}`];
            }else{
                data.maindata[`Name${index + 1}`] = '';
            }
          //   let obj = {
          //     resid: '628872584248',
          //     maindata: {
          //       _state: 'editoradd',
          //       C3_605716828937: 1,
          //       _id: 1
          //     }
          //   };
          //   obj.maindata.C3_605716828937 = values[`name${index}`];
          //   subdata.push(obj);
        });
        // data.subdata = subdata;
        try {
          res = await http().saveRecordAndSubTables({
            data: [data]
          });
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
    const { addModal, peopleList, record, options } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <React.Fragment>
        <TableData
          resid="628862440631"
          height={640}
          subtractH={220}
          hasRowView={false}
          hasModify={false}
          hasDelete={false}
          hasAdd={false}
          hasRowModify={false}
          hasRowSelection={true}
          actionBarWidth={170}
          customRowBtns={[
            record => {
              return (
                <Button
                  onClick={() => {
                    this.handleEdit(record);
                  }}
                >
                  修改
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
          onOk={() => this.handleSave()}
          onCancel={() =>
            this.setState({ addModal: false, peopleList: [], record: {} })
          }
          centered
        >
          <Form {...formItemLayout}>
            <Form.Item label="来访单位" hasFeedback>
              {getFieldDecorator('C3_605703828345', {
                initialValue: record && record.C3_605703828345,
                rules: [
                  {
                    required: true,
                    message: '请输入来访单位!'
                  }
                ]
              })(<Input />)}
            </Form.Item>

            <Form.Item label="来访人数" hasFeedback>
              {getFieldDecorator('countVisitors', {
                initialValue: record && record.countVisitors,
                rules: [
                  {
                    required: true,
                    message: '请输入来访人数!'
                  }
                ]
              })(<Input />)}
            </Form.Item>

            <Form.Item label="添加来访人员" hasFeedback>
              <Button
                type="primary"
                icon="plus"
                className="visitorApply_addPeople"
                onClick={this.handlePushPeople}
              >
                添加人员
              </Button>
            </Form.Item>

            {peopleList.map((item, index) => {
              if (item.name) {
                return (
                  <Form.Item label={`人员${index + 1}`} key={index}>
                    {getFieldDecorator(`Name${index + 1}`, {
                      initialValue: record[`Name${index + 1}`]
                    })(<Input className="visitorApply_input" />)}
                    <Button
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

            <Form.Item label="VIP餐" hasFeedback>
              {getFieldDecorator('VIPMeal', {
                initialValue: record && record.VIPMeal,
                rules: [
                  {
                    required: true,
                    message: '请选择VIP餐!'
                  }
                ]
              })(
                <Radio.Group>
                  <Radio value={'0'}>不需要</Radio>
                  <Radio value={'30'}>30元/份</Radio>
                  <Radio value={'50'}>50元/份</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="来访日期" hasFeedback>
              {getFieldDecorator('visitDate', {
                initialValue: record && moment(record.visitDate),
                rules: [
                  {
                    required: true,
                    message: '请输入来访日期!'
                  }
                ]
              })(<DatePicker />)}
            </Form.Item>

            <Form.Item label="来访目的" hasFeedback>
              {getFieldDecorator('visitPurpose', {
                initialValue: record && record.visitPurpose,
                rules: [
                  {
                    required: true,
                    message: '请输入来访目的!'
                  }
                ]
              })(<Input />)}
            </Form.Item>

            <Form.Item label="接机/接站" hasFeedback>
              {getFieldDecorator('airportOrstation', {
                initialValue: record && record.airportOrstation,
                rules: [
                  {
                    required: true,
                    message: '请选择接机/接站!'
                  }
                ]
              })(
                <Radio.Group>
                  <Radio value={'Y'}>是</Radio>
                  <Radio value={'N'}>否</Radio>
                </Radio.Group>
              )}
            </Form.Item>

            <Form.Item label="日常用车" hasFeedback>
              {getFieldDecorator('everydayCar', {
                initialValue: record && record.everydayCar,
                rules: [
                  {
                    required: true,
                    message: '请选择日常用车!'
                  }
                ]
              })(
                <Radio.Group>
                  <Radio value={'Y'}>是</Radio>
                  <Radio value={'N'}>否</Radio>
                </Radio.Group>
              )}
            </Form.Item>

            <Form.Item label="审批人" hasFeedback>
              {getFieldDecorator('C3_612005042895', {
                initialValue: record && record.C3_612005042895,
                rules: [
                  {
                    required: true,
                    message: '请选择审批人!'
                  }
                ]
              })(
                <Select placeholder="请选择审批人">
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

            <Form.Item label="茶歇" hasFeedback>
              {getFieldDecorator('TeaBreak', {
                initialValue: record && record.TeaBreak,
                rules: [
                  {
                    required: true,
                    message: '请输入茶歇!'
                  }
                ]
              })(
                <Radio.Group>
                  <Radio value={'Y'}>是</Radio>
                  <Radio value={'N'}>否</Radio>
                </Radio.Group>
              )}
            </Form.Item>

            <Form.Item label="备注" hasFeedback>
              {getFieldDecorator('applyPersonRemark', {
                initialValue: record && record.applyPersonRemark
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Form.create()(VisitorApplyVIP);
