import React from 'react';
import {
  Icon,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Button,
  Divider
} from 'antd';

const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const formItemLayout1 = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 }
};
class NewRecord extends React.Component {
  handleSubmit = () => {
    this.props.form.validateFields((errors, values) => {
      console.log(errors, values);
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="head-count__new-record">
        <header>
          <div className="head-count__new-record__return">
            <Icon type="rollback" style={{ marginRight: 8 }} />
            返回
          </div>
        </header>
        <content className="head-count__new-record__form">
          <Form layout="horizontal" {...formItemLayout} colon={false}>
            <h2>招聘员工申请表/Employment Requisition</h2>
            <section>
              <Row>
                <Col span={8}>
                  <Form.Item label="职业性质/Specity">
                    {getFieldDecorator('specity', {
                      rules: [
                        {
                          required: true,
                          message: 'Input something!'
                        }
                      ]
                    })(<Input placeholder="" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="申请职位/Position">
                    {getFieldDecorator('position', {
                      rules: []
                    })(<Input placeholder="" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="申请职位数（同一职位）/Headcount No."
                    labelCol={{ span: 16 }}
                    wrapperCol={{ span: 8 }}
                  >
                    {getFieldDecorator('headcountNo', {
                      rules: []
                    })(<InputNumber />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="工作地点/Location">
                    {getFieldDecorator('location', {
                      rules: []
                    })(<Input placeholder="" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="预算/Budget">
                    {getFieldDecorator('budget', {
                      rules: []
                    })(<Input placeholder="" />)}
                  </Form.Item>
                </Col>
              </Row>
            </section>
            <Divider />
            <section style={{ marginBottom: 40 }}>
              <h4>
                替代人员信息/Replacement Info
                <Button style={{ marginLeft: 40 }}>添加</Button>
              </h4>
              <Row className="head-count__new-record__form__replacement">
                <Col span={8}>
                  <Form.Item label="姓名/Name">
                    {getFieldDecorator('replacement[0].name', {
                      rules: []
                    })(<Input placeholder="" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="工号/Employee No.">
                    {getFieldDecorator('replacement[0].employeeNo', {
                      rules: []
                    })(<Input placeholder="" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="部门/Department">
                    {getFieldDecorator('replacement[0].department', {
                      rules: []
                    })(<Input placeholder="" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="职位/Title">
                    {getFieldDecorator('replacement[0].title', {
                      rules: []
                    })(<Input placeholder="" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="级别/Level">
                    {getFieldDecorator('replacement[0].level', {
                      rules: []
                    })(<Input placeholder="" />)}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="离职日期/Term Date">
                    {getFieldDecorator('replacement[0].termDate', {
                      rules: []
                    })(<Input placeholder="" />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="离职人员工作地点/Location of Replacement"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator('replacement[0].location', {
                      rules: []
                    })(<Input placeholder="" />)}
                  </Form.Item>
                </Col>
              </Row>
            </section>
            <section>
              <h4>申请职位信息/Request Info</h4>
              <div>
                <Row>
                  <Col span={8}>
                    <Form.Item label="级别/Level" {...formItemLayout1}>
                      {getFieldDecorator('level', {
                        rules: []
                      })(<Input placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="部门/Department" {...formItemLayout1}>
                      {getFieldDecorator('department', {
                        rules: []
                      })(<Input placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}></Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item label="部门代码/Dept Code" {...formItemLayout1}>
                      {getFieldDecorator('deptCode', {
                        rules: []
                      })(<Input placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="项目代码/Project Code"
                      {...formItemLayout1}
                    >
                      {getFieldDecorator('projectCode', {
                        rules: []
                      })(<Input placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="项目名称/Project Name"
                      {...formItemLayout1}
                    >
                      {getFieldDecorator('projectName', {
                        rules: []
                      })(<Input placeholder="" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      label="部门经理/Hiring Manager"
                      {...formItemLayout1}
                    >
                      {getFieldDecorator('hiringManager', {
                        rules: []
                      })(<Input placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="直接主管职位/Immediate Supervisor"
                      labelCol={{ span: 12 }}
                      wrapperCol={{ span: 12 }}
                    >
                      {getFieldDecorator('immediateSupervisor', {
                        rules: []
                      })(<Input placeholder="" />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="直接下属职位/Subornidate"
                      {...formItemLayout1}
                    >
                      {getFieldDecorator('subornidate', {
                        rules: []
                      })(<Input placeholder="" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="岗位描述/Job Summary"
                      labelCol={8}
                      wrapperCol={16}
                    >
                      {getFieldDecorator('jobSummary', {
                        rules: []
                      })(<TextArea rows={6} placeholder="" />)}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </section>
            <Divider />
            <section>
              <h4>
                岗位职责/Resbosibilities
                <Button style={{ marginLeft: 40 }}>添加</Button>
              </h4>
              <div>
                <ol>
                  <li>
                    <Input style={{ width: 440 }} />
                  </li>
                </ol>
              </div>
            </section>
            <Divider />
            <section>
              <h4>
                任职要求/Qualification
                <Button style={{ marginLeft: 40 }}>添加</Button>
              </h4>
              <div>
                <ol>
                  <li>
                    <Input style={{ width: 440 }} />
                  </li>
                </ol>
              </div>
            </section>
            <Divider />
            <section>
              <h4>职位申请原因概述/Reason foe Headcount Application</h4>
              {getFieldDecorator('reason', {
                rules: []
              })(<TextArea rows={6} />)}
            </section>
          </Form>
        </content>
        <div className="head-count__new-record__footer">
          <Button type="primary" onClick={this.handleSubmit}>
            同意
          </Button>
          <Button type="danger">拒绝</Button>
        </div>
      </div>
    );
  }
}

export default Form.create()(NewRecord);
