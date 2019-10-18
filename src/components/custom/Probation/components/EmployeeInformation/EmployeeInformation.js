import React from 'react';
import './EmployeeInformation.less';
import { Card, Row, Col, Select, message,Checkbox } from 'antd';
import http from 'Util20/api';
import debounce from 'lodash/debounce';

const { Option } = Select;

//609599795438  全部人员
class EmployeeInformation extends React.Component {
  state = {
    data: [],
    data2:[],
    fetching: false,
  };
  constructor(props) {
    super(props);
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  //根据工号搜索辅导员
  fetchUser = async value => {
    this.setState({ data: [], fetching: true });
    try {
      const res = await http().getTable({
        resid: '619281130628',
        cmswhere: `userID = '${value}'`
      });
      const data = res.data.map(user => ({
        label: `${user.name}`,
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

  fectchSemi= async value => {
    this.setState({ data2: [], fetching: true });
    try {
      const res = await http().getTable({
        resid: '609599795438',
        cmswhere: `C3_227192472953 = '${value}'`
      });
      console.log(res)
      const data2 = res.data.map(user => ({
        label: `${user.C3_227192484125}`,
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

  // 是否自定义辅导员
  toReco=(v)=>{
    if(v.target.checked==false){
      this.props.setTutorship({ name: null, userMemberId:null},true);
    }else{
      this.props.setTutorshipSemi({ name: null, userMemberId: null},true);
    }
    this.props.isSemi(v.target.checked);
  }

  render() {

    const { employeeInformation, roleName, editable } = this.props;
    let value = {
      label: employeeInformation.instructor,
      key: employeeInformation.instructorID
    };
    let valueSemi = {
      label: employeeInformation.instructorDirectorName,
      key: employeeInformation.instructorDirectorID
    };
    let { fetching, data } = this.state;
    console.log(employeeInformation)
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
              {employeeInformation.joinCompanyDate}
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
            </Col>
            <Col span={8}>

              <span className="employee-imformation_lable">辅导员/Mentor:</span>
              {(roleName === '主管' || roleName === 'HR') && editable ? (

                <div>
                {(employeeInformation.isSemi==false)?(
                <Select
                  style={{ width: 150 }}
                  placeholder="请输入辅导员工号"
                  showSearch
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
                </Select>):null
              }
                <Checkbox value={employeeInformation.isSemi} style={{marginTop:'8px',marginBottom:'8px'}}onChange={v=>{this.toReco(v)}}>我要填写自定义推荐人<br/>I want to recommend another who will become my mentor.</Checkbox>
                {(employeeInformation.isSemi==false)?null:(<Select
                  style={{ width: 150 }}
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
                </Select>)}
                </div>

              ) : (
                employeeInformation.instructor
              )}

            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default EmployeeInformation;
