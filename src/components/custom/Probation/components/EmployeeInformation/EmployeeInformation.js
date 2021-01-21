import React from 'react';
import './EmployeeInformation.less';
import { Card, Row, Col, Select, message, Popover, Steps } from 'antd';
import http from 'Util20/api';
import moment from 'moment';
import debounce from 'lodash/debounce';

const { Option } = Select;
const { Step } = Steps;

/**
 * @description 员工基本信息
 * @author 邓铭
 */
//609599795438  全部人员
class EmployeeInformation extends React.Component {
  state = {
    data: [],
    data2: [],
    fetching: false
  };
  constructor(props) {
    super(props);
    this.fetchUser = debounce(this.fetchUser, 800);
    this.fectchSemi = debounce(this.fectchSemi, 800);
  }

  //根据工号搜索辅导员
  fetchUser = async value => {
    if (!value.trim()) return;
    this.setState({ data: [], fetching: true });
    try {
      const res = await http().getTable({
        resid: '619281130628',
        key: value
      });
      const data = res.data.map(user => ({
        label: `${user.name}-${user.userID}`,
        key: user.userID
      }));

      this.setState({
        data: data
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    } finally {
      this.setState({ fetching: false });
    }
  };

  fectchSemi = async value => {
    if (!value.trim()) return;
    this.setState({ data2: [], fetching: true });
    try {
      const res = await http().getTable({
        resid: '609599795438',
        key: value
      });
      const data2 = res.data.map(user => ({
        label: `${user.C3_227192484125}-${user.C3_227192472953}`,
        key: user.C3_305737857578
      }));

      this.setState({
        data2: data2
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    } finally {
      this.setState({ fetching: false });
    }
  };

  handleChange = value => {
    this.props.setTutorship({ name: value.label, userMemberId: value.key });
  };
  handleChange2 = value => {
    this.props.setTutorshipSemi({ name: value.label, userMemberId: value.key });
  };
  handleChange3 = value => {
    this.props.setTutorship2({ name: value.label, userMemberId: value.key });
  };
  handleChange4 = value => {
    this.props.setTutorshipSemi2({
      name: value.label,
      userMemberId: value.key
    });
  };
  ck = () => {
    if (this.props.employeeInformation.isSemi == true) {
      this.props.isSemi(false);
    } else {
      this.props.isSemi(true);
    }
  };
  ck2 = () => {
    if (this.props.employeeInformation.isSemi2 == true) {
      this.props.isSemi2(false);
    } else {
      this.props.isSemi2(true);
    }
  };
  // 是否自定义辅导员
  toReco = v => {
    console.log(v);
    if (v.target.checked == false) {
      this.props.setTutorship({ name: null, userMemberId: null }, true);
    } else {
      this.props.setTutorshipSemi({ name: null, userMemberId: null }, true);
    }
    this.props.isSemi(v.target.checked);
  };
  toReco2 = v => {
    console.log(v);
    if (v.target.checked == false) {
      this.props.setTutorship2({ name: null, userMemberId: null }, true);
    } else {
      this.props.setTutorshipSemi2({ name: null, userMemberId: null }, true);
    }
    this.props.isSemi2(v.target.checked);
  };
  render() {
    const {
      employeeInformation,
      roleName,
      editable,
      approveNodes
    } = this.props;
    let value = employeeInformation.instructor
      ? {
          label: employeeInformation.instructor,
          key: employeeInformation.instructorID
        }
      : undefined;
    let valueSemi = employeeInformation.instructorDirectorId
      ? {
          label: employeeInformation.instructorDirectorName,
          key: employeeInformation.instructorDirectorId
        }
      : undefined;
    let value2 = employeeInformation.C3_637084526216
      ? {
          label: employeeInformation.C3_637084539039,
          key: employeeInformation.C3_637084526216
        }
      : undefined;
    let valueSemi2 = employeeInformation.instructorDirectorId2
      ? {
          label: employeeInformation.instructorDirectorName2,
          key: employeeInformation.instructorDirectorId2
        }
      : undefined;
    let { fetching, data } = this.state;
    return (
      <div id="employee-imformation" className="probation-form">
        <Card
          title={
            <React.Fragment>
              <span className="card_title_name__zh">个人信息</span>
              <span className="card_title_name__en">Employee Information</span>
            </React.Fragment>
          }
        >
          <Row style={{ paddingBottom: 26, paddingTop: 8 }}>
            <Col span={8}>
              <span className="employee-imformation_lable">姓名/Name:</span>
              {employeeInformation.userName}
            </Col>
            <Col span={8}>
              <span className="employee-imformation_lable">
                工号/Job Number:
              </span>
              {employeeInformation.C3_620142532140}
            </Col>
            <Col span={8}>
              <span className="employee-imformation_lable">
                入职日期/Join Date:
              </span>
              {employeeInformation.joinCompanyDate
                ? moment(employeeInformation.joinCompanyDate).format(
                    'YYYY-MM-DD'
                  )
                : 'UNKNOWN'}
            </Col>
          </Row>
          <Row style={{ paddingBottom: 26 }}>
            <Col span={8}>
              <span className="employee-imformation_lable">
                部门/Department:
              </span>
              {employeeInformation.Department}
            </Col>
            <Col span={8}>
              <span className="employee-imformation_lable">职位/Position:</span>
              {employeeInformation.Position}
            </Col>
            <Col span={8}>
              <span className="employee-imformation_lable">级别/Level:</span>
              {employeeInformation.Level}
            </Col>
          </Row>
          <Row style={{ paddingBottom: 21 }}>
            <Col span={8}>
              <span className="employee-imformation_lable">
                直接主管/Supervisor:
              </span>
              {employeeInformation.director}
            </Col>
            <Col span={8}>
              <span className="employee-imformation_lable">
                转正状态/Status:
              </span>
              {employeeInformation.regStatus}
              {employeeInformation.C3_622649502021 === 'Y' &&
                (roleName === 'HR' ||
                  roleName === '员工' ||
                  roleName === '主管' ||
                  roleName === '经理' ||
                  roleName === 'HR经理' ||
                  roleName === '总监') && (
                  <Popover
                    placement="right"
                    content={
                      <Steps direction="vertical">
                        {approveNodes.map(item => {
                          let status = 'wait';
                          if (item.auditPerson === 'Y') {
                            status = 'finish';
                          } else if (item.auditPerson === 'N') {
                            status = 'error';
                          }
                          return (
                            <Step
                              title={item.name}
                              description={item.C3_659447231160}
                              status={status}
                            />
                          );
                        })}
                      </Steps>
                    }
                  >
                    <span style={{ marginLeft: 12, color: '#2593fc' }}>
                      审批节点
                    </span>
                  </Popover>
                )}
            </Col>
            <Col span={8}>
              <span className="employee-imformation_lable">转正日期/Date:</span>
              {employeeInformation.endTime
                ? moment(employeeInformation.endTime).format('YYYY-MM-DD')
                : 'UNKNOWN'}
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <span className="employee-imformation_lable">辅导员/Mentor:</span>
              {(roleName === '主管' || roleName === 'HR') && editable ? (
                <div>
                  {employeeInformation.isSemi == false ? (
                    <Select
                      showSearch
                      style={{ width: 150 }}
                      placeholder="请输入辅导员工号"
                      filterOption={false}
                      onSearch={this.fetchUser}
                      onChange={this.handleChange}
                      labelInValue
                      value={value}
                      key={0}
                      loading={fetching}
                    >
                      {data.map(d => (
                        <Option key={d.key}>{d.label}</Option>
                      ))}
                    </Select>
                  ) : null}
                  <div className="clearfix"></div>
                  {employeeInformation.isSemi == false ? null : (
                    <Select
                      style={{ width: 150, display: 'block' }}
                      placeholder="请输入员工工号"
                      showSearch
                      filterOption={false}
                      onSearch={this.fectchSemi}
                      onChange={this.handleChange2}
                      labelInValue
                      key={1}
                      value={valueSemi}
                      loading={fetching}
                    >
                      {this.state.data2.map(d => (
                        <Option key={d.key}>{d.label}</Option>
                      ))}
                    </Select>
                  )}
                  <input
                    defaultChecked={employeeInformation.isSemi}
                    type="checkbox"
                    ref="semiStatus"
                    value={employeeInformation.isSemi}
                    style={{
                      marginTop: '8px',
                      marginBottom: '8px',
                      marginRight: '8px'
                    }}
                    onClick={this.ck}
                    onChange={v => {
                      this.toReco(v);
                    }}
                  />
                  <span>
                    我没有找到想要的辅导员，我想申请其他人成为辅导员。
                    <br />I can't find the mentor ,and I want to recommend
                    another who will become a mentor.
                  </span>
                </div>
              ) : (
                employeeInformation.instructor
              )}
            </Col>
            <Col span={12}>
              <span className="employee-imformation_lable">
                辅导员2/Mentor2:
              </span>
              {(roleName === '主管' || roleName === 'HR') && editable ? (
                <div>
                  {employeeInformation.isSemi2 == false ? (
                    <Select
                      showSearch
                      style={{ width: 150 }}
                      placeholder="请输入辅导员2工号"
                      filterOption={false}
                      onSearch={this.fetchUser}
                      onChange={this.handleChange3}
                      labelInValue
                      value={value2}
                      key={0}
                      loading={fetching}
                    >
                      {data.map(d => (
                        <Option key={d.key}>{d.label}</Option>
                      ))}
                    </Select>
                  ) : null}
                  <div className="clearfix"></div>
                  {employeeInformation.isSemi2 == false ? null : (
                    <Select
                      style={{ width: 150, display: 'block' }}
                      placeholder="请输入员工工号"
                      showSearch
                      filterOption={false}
                      onSearch={this.fectchSemi}
                      onChange={this.handleChange4}
                      labelInValue
                      key={1}
                      value={valueSemi2}
                      loading={fetching}
                    >
                      {this.state.data2.map(d => (
                        <Option key={d.key}>{d.label}</Option>
                      ))}
                    </Select>
                  )}
                  <input
                    defaultChecked={employeeInformation.isSemi2}
                    type="checkbox"
                    ref="semiStatus"
                    value={employeeInformation.isSemi2}
                    style={{
                      marginTop: '8px',
                      marginBottom: '8px',
                      marginRight: '8px'
                    }}
                    onClick={this.ck2}
                    onChange={v => {
                      this.toReco2(v);
                    }}
                  />
                  <span>
                    我没有找到想要的辅导员，我想申请其他人成为辅导员。
                    <br />I can't find the mentor ,and I want to recommend
                    another who will become a mentor.
                  </span>
                </div>
              ) : (
                employeeInformation.C3_637084539039
              )}
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default EmployeeInformation;
