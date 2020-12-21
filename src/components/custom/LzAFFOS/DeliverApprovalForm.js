import {
  Button,
  Form,
  Modal,
  Select,
  DatePicker,
  TimePicker,
  Input,
  message
} from 'antd';
import React from 'react';
import './LzAFFOS.less';
import moment from 'moment';

const { Option } = Select;
class DeliverApprovalForm extends React.Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = {};
  }

  //控制是否经过管控区
  changeIsControl = v => {
    if (v === '管控区') {
      this.props.changeControl(true);
    } else {
      this.props.changeControl(false);
    }
  };

  submit = () => {
    this.props.form.validateFields((error, value) => {
      console.log('error:', error, 'value', value);
      this.props.parent.getValuesDeliver(this, value);
    });
    const { resetFields } = this.props.form;
    resetFields();
  };

  //   {changeManagerSpecial,changeConductor,changeIsControl}
  render() {
    const { getFieldDecorator } = this.props.form;

    const {
      showDeliverApprovalModal,
      deliverList,
      isControl,
      isLongDeliver,
      deliverTime
    } = this.props.toDeliverApprovalFormData;
    const initialMoment = moment(); //开始时间初始值
    const initialMoment1 = isLongDeliver
      ? deliverTime === 'three'
        ? moment().add(3, 'M')
        : moment().add(6, 'M')
      : moment(); //结束时间初始值
    return (
      <Modal
        title="送货申请"
        width="61%"
        visible={showDeliverApprovalModal}
        destroyOnClose
        onCancel={() => {
          this.props.closeDeliverApprovalModal();
        }}
        onOk={() => {
          this.submit();
          this.props.closeDeliverApprovalModal();

          //   this.props.openDeliverFinalApprovalModal();
        }}
      >
        <Form>
          <div className="changeAntCss">
            <table border="1">
              <tbody>
                <tr>
                  <th colSpan="9">
                    <h3>基本信息</h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="2">
                    <label>申请人姓名</label>
                  </th>
                  <th colSpan="2">
                    {getFieldDecorator('C3_605703779087', {
                      initialValue: this.props.toDeliverApprovalFormData
                        .approvalPeopleList[0].C3_605717998409,
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(
                      <Input
                        placeholder="请选择"
                        onClick={() => {
                          this.props.changeApply();
                        }}
                        autoComplete="off"
                      />
                    )}
                  </th>
                  <th colSpan="2">
                    <label>申请人工号</label>
                  </th>
                  <th colSpan="3">
                    {getFieldDecorator('C3_605703793342', {
                      initialValue: this.props.toDeliverApprovalFormData
                        .approvalPeopleList[0].num,
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                </tr>
                <tr>
                  <th>
                    <label>来访单位</label>
                  </th>
                  <th colSpan="2">
                    {getFieldDecorator('C3_605703828345', {
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                  <th>
                    <label>来访事由</label>
                  </th>
                  <th colSpan="2">
                    {getFieldDecorator('C3_605703896083', {
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                  <th>
                    <label>访问区域</label>
                  </th>
                  <th colSpan="2">
                    {getFieldDecorator('C3_605703930741', {
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(
                      <Select
                        onChange={this.changeIsControl}
                        className="selectCss"
                      >
                        <Option value="管控区">管控区</Option>
                        <Option value="非管控区">非管控区</Option>
                      </Select>
                    )}
                  </th>
                </tr>
                {isControl && (
                  <>
                    <tr>
                      <th colSpan="2">
                        <label>管控区审批人</label>
                      </th>
                      <th>
                        {getFieldDecorator('C3_614884016188', {
                          initialValue: this.props.toDeliverApprovalFormData
                            .approvalPeopleList[5].C3_605717998409,
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Input
                            placeholder="请选择"
                            onClick={() => {
                              this.props.changeConductor();
                            }}
                            autoComplete="off"
                          />
                        )}
                      </th>
                      <th colSpan="2">
                        <label>管控区审批人工号</label>
                      </th>
                      <th>
                        {getFieldDecorator('C3_614884015488', {
                          initialValue: this.props.toDeliverApprovalFormData
                            .approvalPeopleList[5].num,
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(<Input autoComplete="off" />)}
                      </th>
                      <th colSpan="2">
                        <label>管控区审批人编号</label>
                      </th>
                      <th>
                        {getFieldDecorator('C3_614884015210', {
                          initialValue: this.props.toDeliverApprovalFormData
                            .approvalPeopleList[5].C3_605718032582,
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(<Input autoComplete="off" />)}
                      </th>
                    </tr>
                  </>
                )}
                <tr>
                  <th colSpan="2">
                    <label>非管控区负责人</label>
                  </th>

                  <th>
                    {getFieldDecorator('C3_614884004893', {
                      initialValue: this.props.toDeliverApprovalFormData
                        .approvalPeopleList[4].C3_605717998409,
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(
                      <Input
                        placeholder="请选择"
                        onClick={() => {
                          this.props.changeManagerSpecial();
                        }}
                        autoComplete="off"
                      />
                    )}
                  </th>
                  <th colSpan="2">
                    <label>非管控区审批人工号</label>
                  </th>
                  <th>
                    {getFieldDecorator('C3_614883990443', {
                      initialValue: this.props.toDeliverApprovalFormData
                        .approvalPeopleList[4].num,
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                  <th colSpan="2">
                    <label>非管控区审批人编号</label>
                  </th>
                  <th>
                    {getFieldDecorator('C3_614883971652', {
                      initialValue: this.props.toDeliverApprovalFormData
                        .approvalPeopleList[4].C3_605718032582,
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                </tr>
                <tr>
                  <th>
                    <label>申请人手机号</label>
                  </th>
                  <th colSpan="2">
                    {getFieldDecorator('C3_619693496163', {
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                  <th>
                    <label>申请人分机号</label>
                  </th>
                  <th colSpan="2">
                    {getFieldDecorator('C3_619693518811', {
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                  <th>
                    <label>车牌号</label>
                  </th>
                  <th colSpan="2">
                    {getFieldDecorator('C3_645723637160', {
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                </tr>
                <tr>
                  <th colSpan="2">
                    <label>有效开始时间</label>
                  </th>
                  <th colSpan="3">
                    {getFieldDecorator('C3_605703980025', {
                      initialValue: initialMoment,
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<DatePicker />)}
                  </th>
                  <th colSpan="2">
                    <label>有效结束时间</label>
                  </th>
                  <th colSpan="2">
                    {getFieldDecorator('C3_605703992046', {
                      initialValue: initialMoment1,
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<DatePicker />)}
                  </th>
                </tr>

                {/* 施工人员清单 */}
                <tr>
                  <th colSpan="9">
                    <h3>施工人员清单</h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="9">
                    <Button
                      onClick={() => {
                        this.props.openDeliverPeopleListModal();
                      }}
                      type="primary"
                    >
                      变更人员
                    </Button>
                  </th>
                </tr>
                <tr>
                  <th className="thCss">
                    <label>访客姓名</label>
                  </th>
                  <th className="thCss">
                    <label>登记证件类型</label>
                  </th>
                  <th colSpan="2" className="thCss">
                    <label>登记证件号码</label>
                  </th>
                  <th colSpan="2" className="thCss">
                    <label>访客手机号码</label>
                  </th>
                  <th colSpan="3" className="thCss">
                    <label>照片链接</label>
                  </th>
                </tr>
                {deliverList.map((item, index) => {
                  console.log(item);
                  return (
                    <tr>
                      <th className="thCss">
                        <label>{item.C3_605716828937}</label>
                      </th>
                      <th className="thCss">
                        <label>{item.C3_605716867680}</label>
                      </th>
                      <th colSpan="2" className="thCss">
                        <label>{item.C3_614704116070}</label>
                      </th>
                      <th colSpan="2" className="thCss">
                        <label>{item.C3_606412134505}</label>
                      </th>
                      <th colSpan="3" className="thCss">
                        <label>{item.photo}</label>
                      </th>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(DeliverApprovalForm);
