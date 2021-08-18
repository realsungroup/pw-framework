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
      options: [], // 选择的一级审批人
      vipmealOptions: [], //vip餐选项
      biscuitOptions: [], //饼干选项
      fruitOptions: [], //水果选项
      VIPMeal: '否',
      C3_682008393529: '否',
      airportOrstation: '否',
      TeaBreak: '否'
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
    let sendTime = moment(record.C3_682007825690);
    this.setState({
      addModal: true,
      record,
      peopleList,
      mode: 'check',
      VIPMeal: record.VIPMeal,
      C3_682008393529: record.C3_682008393529,
      airportOrstation: record.airportOrstation,
      TeaBreak: record.TeaBreak,
      C3_682008228598: record.C3_682008228598,
      C3_682007624565: record.C3_682007624565,
      C3_682007800032: record.C3_682007800032,
      C3_682007825690: sendTime,
      C3_682007840582: record.C3_682007840582,
      C3_682007924652: record.C3_682007924652,
      C3_682007915089: record.C3_682007915089,
      C3_682007902400: record.C3_682007902400,
      C3_682007891040: record.C3_682007891040
    });
  };
  componentDidMount = () => {
    this.getApprover();
    this.info();
    this.getOptions();
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
  getOptions = async () => {
    let res;
    try {
      res = await http().getTableColumnDefine({
        resid: 628944723761
      });
      let n = 0;
      while (n < res.data.length) {
        if (res.data[n].ColName == 'C3_682007624565') {
          this.setState({ vipmealOptions: res.data[n].DisplayOptions });
        } else if (res.data[n].ColName == 'C3_682007902400') {
          this.setState({ biscuitOptions: res.data[n].DisplayOptions });
        } else if (res.data[n].ColName == 'C3_682007924652') {
          this.setState({ fruitOptions: res.data[n].DisplayOptions });
        }
        n++;
      }
      console.log('options', res.data);
    } catch (error) {
      message.error(error.message);
    }
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
    let bol = true;
    //逻辑验证必填项
    if (this.state.C3_682008393529 == '是') {
      if (this.state.VIPMeal == '是') {
        if (!this.state.C3_682007624565) {
          message.error('未填vip餐别');
          bol = false;
        }
        if (!this.state.C3_682007800032) {
          message.error('未填vip餐数量');
          bol = false;
        }
        if (!this.state.C3_682007825690) {
          message.error('未填vip送餐时间');
          bol = false;
        }
        if (!this.state.C3_682007840582) {
          message.error('未填vip送餐地点');
          bol = false;
        }
      }
      if (this.state.airportOrstation == '是') {
        if (!this.state.C3_682008228598) {
          message.error('未填航班或者车次');
          bol = false;
        }
      }
      if (this.state.TeaBreak == '是') {
        if (!this.state.C3_682007924652) {
          message.error('未填水果规格');
          bol = false;
        }
        // if (!this.state.C3_682007915089) {
        //   message.error('未填水果数量');
        //   bol = false;
        // }
        if (!this.state.C3_682007902400) {
          message.error('未填饼干规格');
          bol = false;
        }
        // if (!this.state.C3_682007891040) {
        //   message.error('未填饼干数量');
        //   bol = false;
        // }
      }
    }
    if (!bol) {
      return false;
    }
    validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        let res;
        let data = {
          resid: 628946788076, // 主表 id
          maindata: {
            // 添加的主表记录
            _state: 'editoradd',
            C3_605703828345: values.C3_605703828345,
            VisitDate: moment(values.visitDate).format('YYYY-MM-DD'),
            Enddate: moment(values.Enddate).format('YYYY-MM-DD'),
            visitPurpose: values.visitPurpose,
            everydayCar: values.everydayCar,
            approver: values.approver,
            countVisitors: values.countVisitors,
            C3_612005042895: values.C3_612005042895,
            VIPMeal: this.state.VIPMeal,
            C3_682008393529: this.state.C3_682008393529,
            airportOrstation: this.state.airportOrstation,
            TeaBreak: this.state.TeaBreak,
            C3_682008228598: this.state.C3_682008228598,
            C3_682007624565: this.state.C3_682007624565,
            C3_682007800032: this.state.C3_682007800032,
            C3_682007825690: this.state.C3_682007825690,
            C3_682007840582: this.state.C3_682007840582,
            C3_682007924652: this.state.C3_682007924652,
            C3_682007915089: this.state.C3_682007915089,
            C3_682007902400: this.state.C3_682007902400,
            C3_682007891040: this.state.C3_682007891040,
            applyPersonRemark: values.applyPersonRemark,
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
        this.setState({ loading: true });
        try {
          res = await http().saveRecordAndSubTables({
            data: [data]
          });
          message.success('申请成功，请等待审批');
          this.setState({
            addModal: false,
            VIPMeal: '否',
            airportOrstation: '否',
            TeaBreak: '否',
            C3_682008228598: '',
            C3_682007624565: '',
            C3_682007800032: '',
            C3_682007825690: '',
            C3_682007840582: '',
            C3_682007924652: '',
            C3_682007915089: '',
            C3_682007902400: '',
            C3_682007891040: ''
          });
          this.setState({ loading: false });

          this.tableDataRef.handleRefresh();
        } catch (error) {
          this.setState({ loading: false });

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
            formName: 'defaultSearch'
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
          title="添加VIP访客"
          width="80%"
          destroyOnClose
          okText={'申请'}
          cancelText={'取消'}
          onOk={() => this.handleSave()}
          onCancel={() =>
            this.setState({
              addModal: false,
              peopleList: [],
              record: {},
              VIPMeal: '否',
              C3_682008393529: '否',
              airportOrstation: '否',
              TeaBreak: '否',
              C3_682008228598: '',
              C3_682007624565: '',
              C3_682007800032: '',
              C3_682007825690: '',
              C3_682007840582: '',
              C3_682007924652: '',
              C3_682007915089: '',
              C3_682007902400: '',
              C3_682007891040: ''
            })
          }
          footer={
            mode === 'check' ? null : (
              <React.Fragment>
                <Button
                  onClick={() => {
                    this.setState({
                      addModal: false,
                      peopleList: [],
                      record: {},
                      VIPMeal: '否',
                      C3_682008393529: '否',
                      airportOrstation: '否',
                      TeaBreak: '否',
                      C3_682008228598: '',
                      C3_682007624565: '',
                      C3_682007800032: '',
                      C3_682007825690: '',
                      C3_682007840582: '',
                      C3_682007924652: '',
                      C3_682007915089: '',
                      C3_682007902400: '',
                      C3_682007891040: ''
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
                  loading={this.state.loading}
                >
                  申请
                </Button>
              </React.Fragment>
            )
          }
          centered
        >
          <Form {...formItemLayout} className="VisitorApplyVIP-form">
            <div>
              <div className="changeFormItem">
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
              </div>
              <div className="changeFormItem">
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
              </div>
              <div className="changeFormItem">
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
              </div>
            </div>

            <div>
              <div className="changeFormItem">
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
              </div>

              <div className="changeFormItem1">
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
              </div>
              <div className="changeFormItem">
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
              </div>
            </div>
            <div className="serviceLine">
              <span>是否需要接待：</span>
              <Radio.Group
                disabled={mode === 'check' ? true : false}
                value={this.state.C3_682008393529}
                onChange={v => {
                  this.setState({ C3_682008393529: v.target.value });
                  if (v.target.value == '否') {
                    this.setState({
                      VIPMeal: '否',
                      airportOrstation: '否',
                      TeaBreak: '否',
                      C3_682008228598: '',
                      C3_682007624565: '',
                      C3_682007800032: '',
                      C3_682007825690: '',
                      C3_682007840582: '',
                      C3_682007924652: '',
                      C3_682007915089: '',
                      C3_682007902400: '',
                      C3_682007891040: ''
                    });
                  }
                }}
              >
                <Radio value={'是'}>需要</Radio>
                <Radio value={'否'}>不需要</Radio>
              </Radio.Group>
            </div>

            <div
              className="seviceSections"
              style={
                this.state.C3_682008393529 == '是' ? {} : { display: 'none' }
              }
            >
              <p style={{ marginTop: 8, color: '#f5222d' }}>
                水果及VIP餐需要提前1天预订
              </p>

              <div>
                <div>
                  <span>接机/接站：</span>
                  <Radio.Group
                    disabled={mode === 'check' ? true : false}
                    value={this.state.airportOrstation}
                    onChange={v => {
                      this.setState({ airportOrstation: v.target.value });
                      if (v.target.value == '否') {
                        this.setState({
                          C3_682008228598: ''
                        });
                      }
                    }}
                  >
                    <Radio value={'是'}>需要</Radio>
                    <Radio value={'否'}>不需要</Radio>
                  </Radio.Group>
                </div>
                <div
                  style={
                    this.state.airportOrstation == '是'
                      ? {}
                      : { display: 'none' }
                  }
                >
                  <span
                    className={this.state.C3_682008228598 ? 'hidden' : 'alert'}
                  >
                    *
                  </span>
                  <span>请输入航班或者车次：</span>
                  <Input
                    disabled={mode === 'check' ? true : false}
                    value={this.state.C3_682008228598}
                    onChange={v => {
                      this.setState({ C3_682008228598: v.target.value });
                    }}
                  />
                </div>
              </div>
              <div>
                <div>
                  <div className="inputWrap">
                    <span>VIP餐：</span>
                    <Radio.Group
                      disabled={mode === 'check' ? true : false}
                      value={this.state.VIPMeal}
                      onChange={v => {
                        this.setState({ VIPMeal: v.target.value });
                        if (v.target.value == '否') {
                          this.setState({
                            C3_682007624565: '',
                            C3_682007800032: '',
                            C3_682007825690: '',
                            C3_682007840582: ''
                          });
                        }
                      }}
                    >
                      <Radio value={'是'}>需要</Radio>
                      <Radio value={'否'}>不需要</Radio>
                    </Radio.Group>
                  </div>
                </div>
                <div
                  style={this.state.VIPMeal == '是' ? {} : { display: 'none' }}
                >
                  <span
                    className={this.state.C3_682007624565 ? 'hidden' : 'alert'}
                  >
                    *
                  </span>
                  <span>餐别：</span>
                  <Select
                    disabled={mode === 'check' ? true : false}
                    value={this.state.C3_682007624565}
                    style={{ margin: 0 }}
                    onChange={v => {
                      this.setState({ C3_682007624565: v });
                    }}
                  >
                    {this.state.vipmealOptions.map(item => {
                      return <Option value={item}>{item}</Option>;
                    })}
                  </Select>
                  <div className="inputWrap">
                    <span
                      className={
                        this.state.C3_682007800032 ? 'hidden' : 'alert'
                      }
                    >
                      *
                    </span>
                    <span>数量：</span>
                    <Input
                      disabled={mode === 'check' ? true : false}
                      type="number"
                      value={this.state.C3_682007800032}
                      onChange={v => {
                        this.setState({ C3_682007800032: v.target.value });
                      }}
                    />
                  </div>
                  <div className="inputWrap">
                    <span
                      className={
                        this.state.C3_682007825690 ? 'hidden' : 'alert'
                      }
                    >
                      *
                    </span>
                    <span>送餐时间：</span>
                    <DatePicker
                      disabled={mode === 'check' ? true : false}
                      value={this.state.C3_682007825690}
                      showTime
                      onChange={v => {
                        this.setState({ C3_682007825690: v });
                      }}
                    />
                  </div>
                  <div className="inputWrap">
                    <span
                      className={
                        this.state.C3_682007840582 ? 'hidden' : 'alert'
                      }
                    >
                      *
                    </span>
                    <span>地点：</span>
                    <Input
                      disabled={mode === 'check' ? true : false}
                      value={this.state.C3_682007840582}
                      onChange={v => {
                        this.setState({ C3_682007840582: v.target.value });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <span>茶歇：</span>
                  <Radio.Group
                    disabled={mode === 'check' ? true : false}
                    value={this.state.TeaBreak}
                    onChange={v => {
                      this.setState({ TeaBreak: v.target.value });
                      if (v.target.value == '否') {
                        this.setState({
                          C3_682007924652: '',
                          C3_682007915089: '',
                          C3_682007902400: '',
                          C3_682007891040: ''
                        });
                      }
                    }}
                  >
                    <Radio value={'是'}>需要</Radio>
                    <Radio value={'否'}>不需要</Radio>
                  </Radio.Group>
                </div>
                <div
                  style={this.state.TeaBreak == '是' ? {} : { display: 'none' }}
                >
                  <span
                    className={this.state.C3_682007924652 ? 'hidden' : 'alert'}
                  >
                    *
                  </span>
                  <span>水果规格：</span>
                  <Select
                    disabled={mode === 'check' ? true : false}
                    value={this.state.C3_682007924652}
                    style={{ margin: 0 }}
                    onChange={v => {
                      this.setState({ C3_682007924652: v });
                    }}
                  >
                    {this.state.fruitOptions.map(item => {
                      return <Option value={item}>{item}</Option>;
                    })}
                  </Select>

                  {/* <div className="inputWrap">
                    <span
                      className={
                        this.state.C3_682007915089 ? 'hidden' : 'alert'
                      }
                    >
                      *
                    </span>
                    <span>水果数量：</span>
                    <Input
                      disabled={mode === 'check' ? true : false}
                      type="number"
                      value={this.state.C3_682007915089}
                      onChange={v => {
                        this.setState({ C3_682007915089: v.target.value });
                      }}
                    />
                  </div> */}
                  <div className="inputWrap">
                    <span
                      className={
                        this.state.C3_682007902400 ? 'hidden' : 'alert'
                      }
                    >
                      *
                    </span>
                    <span>饼干规格：</span>
                    <Select
                      disabled={mode === 'check' ? true : false}
                      value={this.state.C3_682007902400}
                      style={{ margin: 0 }}
                      onChange={v => {
                        this.setState({ C3_682007902400: v });
                      }}
                    >
                      {this.state.biscuitOptions.map(item => {
                        return <Option value={item}>{item}</Option>;
                      })}
                    </Select>
                  </div>
                  {/* <div className="inputWrap">
                    <span
                      className={
                        this.state.C3_682007891040 ? 'hidden' : 'alert'
                      }
                    >
                      *
                    </span>
                    <span>饼干数量：</span>
                    <Input
                      disabled={mode === 'check' ? true : false}
                      value={this.state.C3_682007891040}
                      type="number"
                      onChange={v => {
                        this.setState({ C3_682007891040: v.target.value });
                      }}
                    />
                  </div> */}
                </div>
              </div>
            </div>

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
