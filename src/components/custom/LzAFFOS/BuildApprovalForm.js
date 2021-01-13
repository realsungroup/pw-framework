import {
  Table,
  Button,
  Popconfirm,
  Form,
  Tabs,
  Modal,
  Switch,
  Select,
  Radio,
  tr,
  th,
  DatePicker,
  TimePicker,
  Input,
  message
} from 'antd';
import React from 'react';
import './LzAFFOS.less';
import moment from 'moment';

const { Option } = Select;
class BuildApprovlForm extends React.Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = {};
  }

  //将值传父组件
  submit = () => {
    this.props.form.validateFields((error, value) => {
      this.props.parent.getValues(this, value);
    });
    const { resetFields } = this.props.form;
    resetFields();
  };

  //比较时间间隔是否超过15天
  disabledTime = current => {
    const workDate1 = this.props.form.getFieldValue('C3_605703980025');
    if (this.props.form.getFieldValue('isLong') === '长期施工') {
      const workDate3 = moment(workDate1).add(15, 'd');
      return current && current > workDate3;
    } else {
      const workDate4 = moment(workDate1).add(7, 'd');
      return current && current > workDate4;
    }
  };
  checkTime = () => {
    const workDate1 = this.props.form.getFieldValue('C3_605703980025');
    const workDate2 = this.props.form.getFieldValue('C3_605703992046');
    if (this.props.form.getFieldValue('isLong') === '长期施工') {
      const workDate3 = moment(workDate1).add(15, 'd');
      if (moment(workDate3).isBefore(workDate2, 'day')) {
        message.info('施工时间不得超过15天');
      }
    } else {
      const workDate4 = moment(workDate1).add(7, 'd');
      if (moment(workDate4).isBefore(workDate2, 'day')) {
        message.info('施工时间不得超过7天');
      }
    }
  };

  changeIsControl = v => {
    if (v === '管控区') {
      this.props.changeControl(true);
    } else {
      this.props.changeControl(false);
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const initialMoment = moment();
    const {
      showBuilderModal,
      isLongBuilder,
      dataSource,
      showData,
      isControl,
      dept,
      influentedDepa,
      influentedManage,
      buildArrangeDept
    } = this.props.toFormMsg;

    return (
      <Modal
        title="施工申请"
        width="90%"
        visible={showBuilderModal}
        destroyOnClose
        onCancel={() => {
          this.props.closeBuildModal();
        }}
        onOk={() => {
          this.submit();
          this.props.closeBuildModal();
          this.props.openApprovalModal();
          this.props.openShortApprovalModal();
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
                  <th>
                    <label>
                      申请人<font color="red">*</font>
                    </label>
                  </th>
                  <th>
                    {getFieldDecorator('C3_605703779087', {
                      initialValue: this.props.toFormMsg.approvalPeopleList[0]
                        .C3_605717998409,
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(
                      <Input
                        disabled
                        placeholder="自动获取"
                        onClick={() => {
                          this.props.changeApply();
                        }}
                        autoComplete="off"
                      />
                    )}
                  </th>
                  <th colSpan="2">
                    <label>
                      申请人所属部门<font color="red">*</font>
                    </label>
                  </th>
                  <th colSpan="5">
                    {getFieldDecorator('C3_605703793342', {
                      initialValue: this.props.toFormMsg.approvalPeopleList[0]
                        .C3_227212499515,
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(
                      <Input
                        disabled
                        placeholder="自动获取"
                        autoComplete="off"
                      />
                    )}
                  </th>
                </tr>
                {/* <tr>
                  <th colSpan="2">
                    <label>
                      来访单位<font color="red">*</font>
                    </label>
                  </th>
                  <th colSpan="2">
                    {getFieldDecorator('C3_605703828345', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                  <th colSpan="2">
                    <label>
                      来访事由<font color="red">*</font>
                    </label>
                  </th>
                  <th colSpan="3">
                    {getFieldDecorator('C3_605703896083', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                </tr> */}
                <tr>
                  <th>
                    <label>
                      工程描述<font color="red">*</font>
                    </label>
                  </th>
                  <th colSpan="8">
                    {getFieldDecorator('projectIntro', {
                      initialValue: '',
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
                    <label>
                      施工管理部门<font color="red">*</font>
                    </label>
                  </th>
                  <th>
                    {getFieldDecorator('buildArrangeDept', {
                      // initialValue: dept,
                      initialValue: buildArrangeDept,
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(
                      <Input
                        disabled
                        placeholder="请选择"
                        onClick={() => {
                          this.props.openDeptModal('dept');
                        }}
                        autoComplete="off"
                      />
                    )}
                  </th>
                  <th colSpan="2">
                    <label>受施工影响部门</label>
                  </th>
                  <th>
                    {getFieldDecorator('influentedDepa', {
                      initialValue: influentedDepa
                    })(
                      <Input
                        placeholder="请选择"
                        onClick={() => {
                          this.props.openDeptModal('influentedDepa');
                        }}
                        autoComplete="off"
                      />
                    )}
                  </th>
                  <th colSpan="2">
                    <label>受施工影响部门负责人</label>
                  </th>
                  <th>
                    {getFieldDecorator('influentedManage', {
                      initialValue: influentedManage
                    })(
                      <Input
                        disabled
                        placeholder="请选择"
                        onClick={() => {
                          this.props.changeEffect();
                        }}
                        autoComplete="off"
                      />
                    )}
                  </th>
                </tr>
                <tr>
                  <th colSpan="2">
                    <label>
                      机台名称或作业地点<font color="red">*</font>
                    </label>
                  </th>
                  <th colSpan="3">
                    {getFieldDecorator('platformOrPlace', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                  <th colSpan="2">
                    <label>
                      是否为长期作业(最长十四日)<font color="red">*</font>
                    </label>
                  </th>
                  <th colSpan="2">
                    {getFieldDecorator('isLong', {
                      initialValue: isLongBuilder ? '长期施工' : '临时施工'
                    })(<Input disabled></Input>)}
                  </th>
                </tr>
                <tr>
                  <th colSpan="2">
                    <label>
                      申请作业时间<font color="red">*</font>
                    </label>
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
                    })(
                      <DatePicker
                        onOpenChange={this.checkTime()}
                        style={{ width: '45%' }}
                      />
                    )}
                    ~
                    {getFieldDecorator('C3_605703992046', {
                      initialValue: initialMoment,
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(
                      <DatePicker
                        disabledDate={this.disabledTime}
                        onOpenChange={this.checkTime()}
                        style={{ width: '45%' }}
                      />
                    )}
                  </th>
                  <th>
                    <label>
                      作业时段<font color="red">*</font>
                    </label>
                  </th>
                  <th colSpan="3">
                    {getFieldDecorator('workTime1', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(
                      <TimePicker
                        minuteStep={30}
                        format={'HH:mm'}
                        style={{ width: '45%' }}
                      />
                    )}
                    ~
                    {getFieldDecorator('workTime2', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(
                      <TimePicker
                        minuteStep={30}
                        format={'HH:mm'}
                        style={{ width: '45%' }}
                      />
                    )}
                  </th>
                </tr>
                <tr>
                  <th colSpan="1">
                    <label>
                      厂务负责工程师<font color="red">*</font>
                    </label>
                  </th>
                  <th>
                    {getFieldDecorator('factoryEngineer', {
                      initialValue: this.props.toFormMsg.approvalPeopleList[2]
                        .C3_605717998409,
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
                          this.props.changeEngineer();
                        }}
                        autoComplete="off"
                      />
                    )}
                  </th>
                  <th>
                    <label>
                      负责人电话<font color="red">*</font>
                    </label>
                  </th>
                  <th colSpan="3">
                    {getFieldDecorator('factoryEngineerTel', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                  <th>
                    <label>负责人邮箱</label>
                  </th>
                  <th colSpan="3">
                    {getFieldDecorator('factoryMail', {
                      initialValue: ''
                    })(<Input autoComplete="off" />)}
                  </th>
                </tr>
                <tr>
                  <th colSpan="2">
                    <label>
                      作业承包商公司名称<font color="red">*</font>
                    </label>
                  </th>
                  <th>
                    {getFieldDecorator('contractor', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                  <th colSpan="1">
                    <label>
                      安全管理人员姓名<font color="red">*</font>
                    </label>
                  </th>
                  <th>
                    {getFieldDecorator('securityName', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(<Input autoComplete="off" />)}
                  </th>
                  <th>
                    <label>
                      安全管理人员电话<font color="red">*</font>
                    </label>
                  </th>
                  <th colSpan="3">
                    {getFieldDecorator('securityTel', {
                      initialValue: '',
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
                    <label>
                      访问区域<font color="red">*</font>
                    </label>
                  </th>
                  <th colSpan="2">
                    {getFieldDecorator('C3_605703930741', {
                      initialValue: '',
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
                  <th colSpan={isControl ? '2' : '5'}>
                    <label>
                      非管控区负责人<font color="red">*</font>
                    </label>
                  </th>
                  <th>
                    {getFieldDecorator('C3_614884004893', {
                      initialValue: this.props.toFormMsg.approvalPeopleList[4]
                        .C3_605717998409,
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
                  {isControl && (
                    <>
                      <th colSpan="2">
                        <label>
                          管控区负责人<font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('C3_614884016188', {
                          initialValue: this.props.toFormMsg
                            .approvalPeopleList[5].C3_605717998409
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
                    </>
                  )}
                </tr>
                {/* 长期施工 */}
                {isLongBuilder && (
                  <>
                    <tr>
                      <th colSpan="9">
                        <h3>承包商长期作业许可证</h3>
                      </th>
                    </tr>
                    <tr>
                      <th colSpan="3">
                        <label>
                          承包方的Finisar施工EHS培训是否完成
                          <font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('isTrained', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            <Option value="不适用">不适用</Option>
                          </Select>
                        )}
                      </th>
                      <th colSpan="4">
                        <label>
                          承包商是否穿着[识别背心或公司制服]并备妥[施工标示板]
                          <font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('isFormulated', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            <Option value="不适用">不适用</Option>
                          </Select>
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th colSpan="3">
                        <label>
                          承包商作业人员是否已取得作业所需要的相关证照
                          <font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('isLicenced', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            <Option value="不适用">不适用</Option>
                          </Select>
                        )}
                      </th>
                      <th colSpan="4">
                        <label>
                          气体钢瓶、化学品、工具箱、氩/电焊机、切割机，宽或高超过40公分之电气设施是否已标示作业厂商名称及联络人姓名及电话
                          <font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('isSpecialSigned', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            <Option value="不适用">不适用</Option>
                          </Select>
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th colSpan="3">
                        <label>
                          作业过程中是否可能碰撞[消防喷淋系统]
                          <font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('isTall', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            <Option value="不适用">不适用</Option>
                          </Select>
                        )}
                      </th>
                      <th colSpan="4">
                        <label>
                          牵涉本作业之特种作业许可证<font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('specialLicence', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                          </Select>
                        )}
                      </th>
                    </tr>
                    {this.props.form.getFieldValue('specialLicence') ===
                    '是' ? (
                      <>
                        <tr>
                          <th colSpan="2">
                            <label>涉及特种作业许可证1</label>
                          </th>
                          <th>
                            {getFieldDecorator('specialOne', {
                              initialValue: ''
                            })(
                              <Select className="selectCss">
                                <Option value="登高作业">登高作业</Option>
                                <Option value="吊装作业">吊装作业</Option>
                                <Option value="动火作业">动火作业</Option>
                                <Option value="挂牌作业">挂牌作业</Option>
                                <Option value="密封空间作业">
                                  密封空间作业
                                </Option>
                              </Select>
                            )}
                          </th>
                          <th colSpan="2">
                            <label>涉及特种作业许可证2</label>
                          </th>
                          <th>
                            {getFieldDecorator('specialTwo', {
                              initialValue: ''
                            })(
                              <Select className="selectCss">
                                <Option value="登高作业">登高作业</Option>
                                <Option value="吊装作业">吊装作业</Option>
                                <Option value="动火作业">动火作业</Option>
                                <Option value="挂牌作业">挂牌作业</Option>
                                <Option value="密封空间作业">
                                  密封空间作业
                                </Option>
                              </Select>
                            )}
                          </th>
                          <th colSpan="2">
                            <label>涉及特种作业许可证3</label>
                          </th>
                          <th>
                            {getFieldDecorator('specialThree', {
                              initialValue: ''
                            })(
                              <Select className="selectCss">
                                <Option value="登高作业">登高作业</Option>
                                <Option value="吊装作业">吊装作业</Option>
                                <Option value="动火作业">动火作业</Option>
                                <Option value="挂牌作业">挂牌作业</Option>
                                <Option value="密封空间作业">
                                  密封空间作业
                                </Option>
                              </Select>
                            )}
                          </th>
                        </tr>
                      </>
                    ) : null}

                    <tr>
                      <th colSpan="3">
                        <label>
                          是否是洁净室作业<font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('isClean', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                          </Select>
                        )}
                      </th>
                      <th colSpan="4">
                        <label>
                          承包商作业人员是否已完成[洁净室培训]
                          <font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('isCleanTrained', {
                          initialValue: ''
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                          </Select>
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th colSpan="3">
                        <label>
                          作业过程中是否可能产生灰尘污染洁净室
                          <font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('maybePolluted', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                          </Select>
                        )}
                      </th>
                      <th colSpan="3">
                        <label>
                          是：请说明防止作业中产生之灰尘污染结净室的措施[洁净室培训]
                        </label>
                      </th>
                      <th colSpan="2">
                        {getFieldDecorator('measureDefence', {
                          initialValue: ''
                        })(<Input autoComplete="off" />)}
                      </th>
                    </tr>
                    <tr>
                      <th colSpan="3">
                        <label>
                          是否使用solvent（溶剂类）或可能产生异味之化学品
                          <font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('useChemist', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                          </Select>
                        )}
                      </th>
                      <th colSpan="3">
                        <label>
                          是：请说明防止作业中/作业后化学品逸散/翻洒及火灾防护之措施
                        </label>
                      </th>
                      <th colSpan="2">
                        {getFieldDecorator('emergency', {
                          initialValue: ''
                        })(<Input autoComplete="off" />)}
                      </th>
                    </tr>
                  </>
                )}
                {/* 临时施工 */}
                {!isLongBuilder && (
                  <>
                    <tr>
                      <th colSpan="9">
                        <h3>承包商临时作业许可证</h3>
                      </th>
                    </tr>
                    <tr>
                      <th colSpan="3">
                        <label>
                          是否已向承包商作业人员进行危害告知及安全宣导
                          <font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('safetyPropaganda', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            <Option value="不适用">不适用</Option>
                          </Select>
                        )}
                      </th>
                      <th colSpan="4">
                        <label>
                          承包商是否备齐“施工标示板”<font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('constructionMark', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            <Option value="不适用">不适用</Option>
                          </Select>
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th colSpan="3">
                        <label>
                          施工过程是否可能产生异味<font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('peculiarSmell', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            <Option value="不适用">不适用</Option>
                          </Select>
                        )}
                      </th>
                      <th colSpan="4">
                        <label>
                          施工过程使用电器是否符合要求<font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('electricAppliance', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            <Option value="不适用">不适用</Option>
                          </Select>
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th colSpan="3">
                        <label>
                          施工过程是否会使用化学品<font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('useChemist2', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            <Option value="不适用">不适用</Option>
                          </Select>
                        )}
                      </th>
                      <th colSpan="4">
                        <label>
                          作业人员是否有必要的防护具<font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('protection', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            <Option value="不适用">不适用</Option>
                          </Select>
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th colSpan="3">
                        <label>
                          开孔作业是否有围篙和警示标志<font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('denfenceAndWarn', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            <Option value="不适用">不适用</Option>
                          </Select>
                        )}
                      </th>
                      <th colSpan="4">
                        <label>
                          施工器材是否会阻挡消防器材或消防通道
                          <font color="red">*</font>
                        </label>
                      </th>
                      <th>
                        {getFieldDecorator('blockFirePassage', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请输入该信息'
                            }
                          ]
                        })(
                          <Select className="selectCss">
                            <Option value="是">是</Option>
                            <Option value="否">否</Option>
                            <Option value="不适用">不适用</Option>
                          </Select>
                        )}
                      </th>
                    </tr>
                  </>
                )}

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
                        this.props.showPeopleList();
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
                    <label>备注</label>
                  </th>
                </tr>
                {dataSource.map((item, index) => {
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
                        <label>{item.C3_605717318503}</label>
                      </th>
                    </tr>
                  );
                })}
                {/* 审批记录 */}
                {/* <tr>
                  <th colSpan="9">
                    <h3>审批历史：</h3>
                  </th>
                </tr>
                <tr>
                  <th colSpan="2">
                    <label>STEP_ID</label>
                  </th>
                  <th>
                    <label>Group_Name</label>
                  </th>
                  <th>
                    <label>Approver</label>
                  </th>
                  <th>
                    <label>Approve_Action</label>
                  </th>
                  <th>
                    <label>Remark</label>
                  </th>
                  <th colSpan="3">
                    <label>Updated_At</label>
                  </th>
                </tr>
                {this.props.toFormMsg.isControl && (
                  <>
                    <tr>
                      <th colSpan="2">
                        <label>60-总监审批</label>
                      </th>
                      <th>
                        <label></label>
                      </th>
                      <th>
                        {getFieldDecorator('C3_614884016188', {
                          initialValue: this.props.toFormMsg
                            .approvalPeopleList[5].C3_605717998409
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
                      <th>
                        <label></label>
                      </th>
                      <th>
                        <label></label>
                      </th>
                      <th colSpan="3">
                        <label></label>
                      </th>
                    </tr>
                  </>
                )}
                <tr>
                  <th colSpan="2">
                    <label>50-经理审批</label>
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th>
                    {getFieldDecorator('C3_614884004893', {
                      initialValue: this.props.toFormMsg.approvalPeopleList[4]
                        .C3_605717998409
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
                  <th>
                    <label></label>
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th colSpan="3">
                    <label></label>
                  </th>
                </tr>
                <tr>
                  <th colSpan="2">
                    <label>40-厂务经理审批</label>
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th>
                    {getFieldDecorator('FAC_Manager', {
                      initialValue: this.props.toFormMsg.approvalPeopleList[3]
                        .C3_605717998409,
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
                          this.props.changeManager();
                        }}
                        autoComplete="off"
                      />
                    )}
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th colSpan="3">
                    <label></label>
                  </th>
                </tr>
                <tr>
                  <th colSpan="2">
                    <label>30-厂务工程师审批</label>
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th>
                    {getFieldDecorator('factoryEngineer', {
                      initialValue: this.props.toFormMsg.approvalPeopleList[2]
                        .C3_605717998409,
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(
                      <Input
                        onClick={() => {
                          this.props.changeEngineer();
                        }}
                        autoComplete="off"
                      />
                    )}
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th colSpan="3">
                    <label></label>
                  </th>
                </tr>
                <tr>
                  <th colSpan="2">
                    <label>20-施工影响部门主管审批</label>
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th>
                    {getFieldDecorator('influentedManage', {
                      initialValue: this.props.toFormMsg.approvalPeopleList[1]
                        .C3_605717998409
                    })(
                      <Input
                        onClick={() => {
                          this.props.changeEffect();
                        }}
                        autoComplete="off"
                      />
                    )}
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th colSpan="3">
                    <label></label>
                  </th>
                </tr>
                <tr>
                  <th colSpan="2">
                    <label>10-提交施工需求</label>
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th>
                    {getFieldDecorator('C3_605703779087', {
                      initialValue: this.props.toFormMsg.approvalPeopleList[0]
                        .C3_605717998409,
                      rules: [
                        {
                          required: true,
                          message: '请输入该信息'
                        }
                      ]
                    })(
                      <Input
                        onClick={() => {
                          this.props.changeApply();
                        }}
                        autoComplete="off"
                      />
                    )}
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th>
                    <label></label>
                  </th>
                  <th colSpan="3">
                    <label></label>
                  </th>
                </tr> */}
              </tbody>
            </table>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(BuildApprovlForm);
