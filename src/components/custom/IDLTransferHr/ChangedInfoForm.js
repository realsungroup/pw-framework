import React from 'react';
import { Form, Modal, Select, Button, Input, DatePicker } from 'antd';
import TableData from '../../common/data/TableData';
import http from 'Util20/api';

const { Option } = Select;
const InputGroup = Input.Group;
const formItemLayout = {
  labelCol: {
    span: 3
  }
};
const WuxiHr03BaseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03BaseURL;
//正式环境与测试环境分别建表，resid不一致
const bucodeResid =
  WuxiHr03BaseURL !== 'http://10.108.2.66:7001/'
    ? '668190417178'
    : '668189585712';

class ChangedInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
    this.state = {
      loading: false,
      searchDepaV: false,
      searchJobV: false,
      searchSuperV: false,
      searchBucode: false,
      selectJobcodeModal: false,
      depaFilter: '', //选择部门时的公司筛选
      companyArr: [],
      lvList: [], //级别数组
      currentLevel: '请选择级别', //当前级别
      canChangeProCode: true //是否可以编辑项目代码
    };
  }

  componentDidMount = () => {
    this.getCompany();
    this.getLv();
  };

  //获取公司基本信息
  getCompany = async () => {
    let res;
    res = await http().getTable({
      resid: 548936690604
    });
    this.setState({ companyArr: res.data });
    if (res.data) {
      this.setState({ depaFilter: res.data[1].C3_419448436728 });
    }
  };

  //获取级别信息
  getLv = async () => {
    this.setState({ loading: true });
    var res = '';
    try {
      res = await http({ baseURL: this.baseURL }).getTable({
        resid: 666268376334
      });
      var n = 0;
      var arr = [];
      while (n < res.data.length) {
        arr.push({
          value: res.data[n].type,
          key: res.data[n].type
        });
        n++;
      }
      this.setState({ lvList: arr });
    } catch (e) {
      this.setState({ loading: false });
      console.log(e);
    }
  };

  render() {
    const {
      toCheckFront,
      toCheck,
      isShowButton,
      HCPreApprove,
      isHREnd
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      lvList,
      currentLevel,
      canChangeProCode,
      selectJobcodeModal
    } = this.state;
    this.props.form.getFieldDecorator('nDriectorCode', { preserve: true });
    this.props.form.getFieldDecorator('nDepartCode', { preserve: true });
    return (
      <Form className="formClass" {...formItemLayout}>
        {HCPreApprove !== 'Y' && (
          <>
            {isHREnd && (
              <Form.Item
                label="Job Code"
                style={{ display: 'flex', marginBottom: '5px' }}
              >
                <span style={{ color: '#f5222d' }}>*</span>
                {getFieldDecorator('iiviJobCode', {
                  initialValue: toCheckFront.iiviJobCode
                })(
                  <>
                    <Input
                      style={{
                        width: 200,
                        pointerEvents: 'none',
                        textAlign: 'center'
                      }}
                      value={getFieldValue('iiviJobCode')}
                    />
                    <Button
                      icon="search"
                      type="primary"
                      onClick={() => {
                        this.setState({ selectJobcodeModal: true });
                      }}
                    >
                      选择Job Code
                    </Button>
                  </>
                )}
              </Form.Item>
            )}
            <Form.Item
              label="是否涉及Headcount"
              style={{ display: 'flex', marginBottom: '5px' }}
            >
              {getFieldDecorator('C3_637425449725', {
                initialValue: toCheckFront.C3_637425449725
              })(
                <Input
                  style={{
                    width: 200,
                    pointerEvents: 'none',
                    textAlign: 'center'
                  }}
                />
              )}
            </Form.Item>
            <Form.Item
              label="headcount变更类型"
              style={{ display: 'flex', marginBottom: '5px' }}
            >
              {getFieldDecorator('C3_637425577105', {
                initialValue: toCheckFront.C3_637425577105
              })(
                <Input
                  style={{
                    width: 200,
                    pointerEvents: 'none',
                    textAlign: 'center'
                  }}
                />
              )}
            </Form.Item>
            <Form.Item
              label="替代人"
              style={{ display: 'flex', marginBottom: '5px' }}
            >
              {getFieldDecorator('C3_637617454519', {
                initialValue: toCheckFront.C3_637617454519
              })(
                <Input
                  style={{
                    width: 200,
                    pointerEvents: 'none',
                    textAlign: 'center'
                  }}
                />
              )}
            </Form.Item>
            <Form.Item
              label="招聘人员备注"
              style={{ display: 'flex', marginBottom: '5px' }}
            >
              {getFieldDecorator('C3_637425470106', {
                initialValue: toCheckFront.C3_637425470106
              })(
                <Input
                  style={{
                    width: 200,
                    pointerEvents: 'none',
                    textAlign: 'center'
                  }}
                />
              )}
            </Form.Item>
            <Form.Item
              label="招聘人员确认人姓名"
              style={{ display: 'flex', marginBottom: '5px' }}
            >
              {getFieldDecorator('C3_637425935795', {
                initialValue: toCheckFront.C3_637425935795
              })(
                <Input
                  style={{
                    width: 200,
                    pointerEvents: 'none',
                    textAlign: 'center'
                  }}
                />
              )}
            </Form.Item>
          </>
        )}
        <Form.Item
          label="姓名"
          style={{ display: 'flex', marginBottom: '5px' }}
        >
          {getFieldDecorator('person', {
            initialValue: toCheckFront.person
          })(
            <Input
              style={{ width: 200, pointerEvents: 'none', textAlign: 'center' }}
            />
          )}
        </Form.Item>
        <Form.Item
          label="变更前后部门"
          style={{ display: 'flex', marginBottom: '5px', height: '40px' }}
        >
          {
            (getFieldDecorator('nDepart', {
              initialValue: toCheck[0]
            }),
              getFieldDecorator('depart', {
                initialValue: toCheckFront.depart
              })(
                <InputGroup compact>
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderRight: 0
                    }}
                    value={getFieldValue('depart')}
                  />
                  <Input
                    style={{
                      width: 30,
                      borderLeft: 0,
                      borderRight: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff'
                    }}
                    placeholder=">>"
                    disabled
                  />
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderLeft: 0
                    }}
                    value={getFieldValue('nDepart')}
                  />
                  {isShowButton && (
                    <Button
                      icon="search"
                      type="primary"
                      onClick={() => {
                        this.setState({ searchDepaV: true });
                      }}
                    >
                      变更部门
                    </Button>
                  )}
                </InputGroup>
              ))
          }
        </Form.Item>
        <Form.Item
          label="岗位名"
          style={{ display: 'flex', marginBottom: '5px', height: '40px' }}
        >
          {
            (getFieldDecorator('jobName', {
              initialValue: toCheckFront.jobName
            }),
              getFieldDecorator('nJobName', {
                initialValue: toCheck[1]
              })(
                <InputGroup compact>
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderRight: 0
                    }}
                    value={getFieldValue('jobName')}
                  />
                  <Input
                    style={{
                      width: 30,
                      borderLeft: 0,
                      borderRight: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff'
                    }}
                    placeholder=">>"
                    disabled
                  />
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderLeft: 0
                    }}
                    value={getFieldValue('nJobName')}
                  />
                  {isShowButton && (
                    <Button
                      icon="search"
                      onClick={() => this.setState({ searchJobV: true })}
                      type="primary"
                    >
                      变更岗位
                    </Button>
                  )}
                </InputGroup>
              ))
          }
        </Form.Item>
        <Form.Item
          label="级别"
          style={{ display: 'flex', marginBottom: '5px', height: '40px' }}
        >
          {
            (getFieldDecorator('level', {
              initialValue: toCheckFront.level
            }),
              getFieldDecorator('nLevel', {
                initialValue: toCheck[2]
              })(
                <InputGroup compact>
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderRight: 0
                    }}
                    value={getFieldValue('level')}
                  />
                  <Input
                    style={{
                      width: 30,
                      borderLeft: 0,
                      borderRight: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff'
                    }}
                    placeholder=">>"
                    disabled
                  />
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderLeft: 0
                    }}
                    value={getFieldValue('nLevel')}
                  />
                  {isShowButton && (
                    <Select
                      placeholder="请选择级别"
                      style={{ width: 160 }}
                      value={currentLevel}
                      onChange={v => {
                        this.props.form.setFieldsValue({
                          nLevel: v
                        });
                        this.setState({
                          currentLevel: v
                        });
                      }}
                    >
                      {lvList.map(item => {
                        return (
                          <Option value={item.value} key={item.key}>
                            {item.value}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </InputGroup>
              ))
          }
        </Form.Item>
        <Form.Item
          label="主管"
          style={{ display: 'flex', marginBottom: '5px', height: '40px' }}
        >
          {
            (getFieldDecorator('driectorName', {
              initialValue: toCheckFront.driectorName
            }),
              getFieldDecorator('nDriectorName', {
                initialValue: toCheck[3]
              })(
                <InputGroup compact>
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderRight: 0
                    }}
                    value={getFieldValue('driectorName')}
                  />
                  <Input
                    style={{
                      width: 30,
                      borderLeft: 0,
                      borderRight: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff'
                    }}
                    placeholder=">>"
                    disabled
                  />
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderLeft: 0
                    }}
                    value={getFieldValue('nDriectorName')}
                  />
                  {isShowButton && (
                    <Button
                      icon="search"
                      onClick={() => this.setState({ searchSuperV: true })}
                      type="primary"
                    >
                      变更主管
                    </Button>
                  )}
                </InputGroup>
              ))
          }
        </Form.Item>
        <Form.Item
          label="项目代码"
          style={{ display: 'flex', marginBottom: '5px', height: '40px' }}
        >
          <Form.Item
            style={{
              display: 'inline-block'
            }}
          >
            {getFieldDecorator('proj_code', {
              initialValue: toCheckFront.proj_code
            })(
              <Input
                style={{
                  width: 200,
                  pointerEvents: 'none',
                  textAlign: 'center',
                  borderRight: 0
                }}
              />
            )}
          </Form.Item>
          <Form.Item
            style={{
              display: 'inline-block'
            }}
          >
            <Input
              style={{
                width: 30,
                borderLeft: 0,
                borderRight: 0,
                pointerEvents: 'none',
                backgroundColor: '#fff'
              }}
              placeholder=">>"
              disabled
            />
          </Form.Item>
          <Form.Item
            style={{
              display: 'inline-block'
            }}
          >
            {getFieldDecorator('nProj_Code', {
              initialValue: toCheck[4]
            })(
              <Input
                style={{
                  width: 200,
                  textAlign: 'center',
                  borderLeft: 0
                }}
                disabled={canChangeProCode}
                onChange={e => {
                  this.props.form.setFieldsValue({
                    nProj_Code: e.target.value
                  });
                }}
              />
            )}
          </Form.Item>
          <Form.Item
            style={{
              display: 'inline-block',
              width: '16px'
            }}
          >
            {isShowButton && (
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ canChangeProCode: !canChangeProCode });
                }}
              >
                {canChangeProCode === true ? '变更项目代码' : '确定'}
              </Button>
            )}
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="BU CODE"
          style={{ display: 'flex', marginBottom: '5px', height: '40px' }}
        >
          {
            (getFieldDecorator('bucode', {
              initialValue: toCheckFront.BUCode
            }),
              getFieldDecorator('nBuCode', {
                initialValue: toCheck[5]
              })(
                <InputGroup compact>
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderRight: 0
                    }}
                    value={getFieldValue('bucode')}
                  />
                  <Input
                    style={{
                      width: 30,
                      borderLeft: 0,
                      borderRight: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff'
                    }}
                    placeholder=">"
                    disabled
                  />
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderLeft: 0
                    }}
                    value={getFieldValue('nBuCode')}
                  />
                  {isShowButton && (
                    <Button
                      type="primary"
                      icon="search"
                      onClick={() => this.setState({ searchBucode: true })}
                    >
                      变更BU CODE
                    </Button>
                  )}
                </InputGroup>
              ))
          }
        </Form.Item>
        <Form.Item
          label="一级部门"
          style={{ display: 'flex', marginBottom: '5px', height: '40px' }}
        >
          {
            (getFieldDecorator('firstDepart', {
              initialValue: toCheckFront.firstDepart
            }),
              getFieldDecorator('nFirstDepart', {
                initialValue: toCheck[6]
              })(
                <InputGroup compact>
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderRight: 0
                    }}
                    value={getFieldValue('firstDepart')}
                  />
                  <Input
                    style={{
                      width: 30,
                      borderLeft: 0,
                      borderRight: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff'
                    }}
                    placeholder=">>"
                    disabled
                  />
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderLeft: 0
                    }}
                    value={getFieldValue('nFirstDepart')}
                  />
                </InputGroup>
              ))
          }
        </Form.Item>
        <Form.Item
          label="二级部门"
          style={{ display: 'flex', marginBottom: '5px', height: '40px' }}
        >
          {
            (getFieldDecorator('secondDepart', {
              initialValue: toCheckFront.secondDepart
            }),
              getFieldDecorator('nSecondDepart', {
                initialValue: toCheck[7]
              })(
                <InputGroup compact>
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderRight: 0
                    }}
                    value={getFieldValue('secondDepart')}
                  />
                  <Input
                    style={{
                      width: 30,
                      borderLeft: 0,
                      borderRight: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff'
                    }}
                    placeholder=">>"
                    disabled
                  />
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderLeft: 0
                    }}
                    value={getFieldValue('nSecondDepart')}
                  />
                </InputGroup>
              ))
          }
        </Form.Item>
        <Form.Item
          label="三级部门"
          style={{ display: 'flex', marginBottom: '5px', height: '40px' }}
        >
          {
            (getFieldDecorator('thirdDepart', {
              initialValue: toCheckFront.thirdDepart
            }),
              getFieldDecorator('nThirdDepart', {
                initialValue: toCheck[8]
              })(
                <InputGroup compact>
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderRight: 0
                    }}
                    value={getFieldValue('thirdDepart')}
                  />
                  <Input
                    style={{
                      width: 30,
                      borderLeft: 0,
                      borderRight: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff'
                    }}
                    placeholder=">>"
                    disabled
                  />
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderLeft: 0
                    }}
                    value={getFieldValue('nThirdDepart')}
                  />
                </InputGroup>
              ))
          }
        </Form.Item>
        <Form.Item
          label="四级部门"
          style={{ display: 'flex', marginBottom: '5px', height: '40px' }}
        >
          {
            (getFieldDecorator('fourthDepart', {
              initialValue: toCheckFront.fourthDepart
            }),
              getFieldDecorator('nFourthDepart', {
                initialValue: toCheck[9]
              })(
                <InputGroup compact>
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderRight: 0
                    }}
                    value={getFieldValue('fourthDepart')}
                  />
                  <Input
                    style={{
                      width: 30,
                      borderLeft: 0,
                      borderRight: 0,
                      pointerEvents: 'none',
                      backgroundColor: '#fff'
                    }}
                    placeholder=">>"
                    disabled
                  />
                  <Input
                    style={{
                      width: 200,
                      pointerEvents: 'none',
                      textAlign: 'center',
                      borderLeft: 0
                    }}
                    value={getFieldValue('nFourthDepart')}
                  />
                </InputGroup>
              ))
          }
        </Form.Item>
        <Modal
          title="部门列表"
          visible={this.state.searchDepaV}
          footer={null}
          onCancel={() => {
            this.setState({ searchDepaV: false });
          }}
          width={'80vw'}
          height={'80vh'}
        >
          <Select
            placeholder="请选择级别"
            style={{ width: 240 }}
            value={this.state.depaFilter}
            onChange={v => {
              this.setState({ depaFilter: v });
            }}
          >
            {this.state.companyArr.map((item, key) => {
              return (
                <Option value={item.C3_419448436728} key={key}>
                  {item.C3_419448436728}
                </Option>
              );
            })}
          </Select>
          <br />
          <br />
          <div
            style={{
              width: '100%',
              height: 'calc(80vh - 104px)',
              position: 'relative'
            }}
          >
            <TableData
              resid={632327119162}
              cmswhere={`C3_419448436728 = '${this.state.depaFilter}'`}
              hasRowView={false}
              subtractH={220}
              hasAdd={false}
              hasRowSelection={false}
              hasRowDelete={false}
              hasRowModify={false}
              hasModify={false}
              hasDelete={false}
              style={{ height: '100%' }}
              hasRowView={false}
              customRowBtns={[
                record => {
                  return (
                    <Button
                      onClick={() => {
                        this.props.form.setFieldsValue({
                          nDepartCode: record.DEP_ID,
                          nDepart: record.DEP_NAME,
                          nFirstDepart: record.C3_461011989083,
                          nSecondDepart: record.C3_461011989333,
                          nThirdDepart: record.C3_461011989568,
                          nFourthDepart: record.C3_461011989771
                        });
                        this.setState({
                          searchDepaV: false
                        });
                      }}
                    >
                      选择
                    </Button>
                  );
                }
              ]}
            />
          </div>
        </Modal>
        <Modal
          title="岗位列表"
          visible={this.state.searchJobV}
          footer={null}
          onCancel={() => {
            this.setState({ searchJobV: false });
          }}
          width={'80vw'}
          height={'80vh'}
        >
          <div
            style={{
              width: '100%',
              height: 'calc(80vh - 104px)',
              position: 'relative'
            }}
          >
            <TableData
              resid={666280127026}
              baseURL={this.baseURL}
              downloadURL={this.downloadURL}
              hasRowView={false}
              subtractH={220}
              hasAdd={false}
              hasRowSelection={false}
              hasRowDelete={false}
              hasRowModify={false}
              hasModify={false}
              hasDelete={false}
              style={{ height: '100%' }}
              hasRowView={false}
              customRowBtns={[
                record => {
                  return (
                    <Button
                      onClick={() => {
                        this.props.form.setFieldsValue({
                          nJobName: record.C3_662164716971
                        });
                        this.setState({
                          searchJobV: false
                        });
                      }}
                    >
                      选择
                    </Button>
                  );
                }
              ]}
            />
          </div>
        </Modal>
        <Modal
          title="人员列表"
          visible={this.state.searchSuperV}
          footer={null}
          onCancel={() => {
            this.setState({ searchSuperV: false });
          }}
          width={'80vw'}
          height={'80vh'}
        >
          <div
            style={{
              width: '100%',
              height: 'calc(80vh - 104px)',
              position: 'relative'
            }}
          >
            <TableData
              resid={609599795438}
              hasRowView={false}
              subtractH={220}
              hasAdd={false}
              hasRowSelection={false}
              hasRowDelete={false}
              hasRowModify={false}
              hasModify={false}
              hasDelete={false}
              style={{ height: '100%' }}
              hasRowView={false}
              customRowBtns={[
                record => {
                  return (
                    <Button
                      onClick={() => {
                        this.props.form.setFieldsValue({
                          nDriectorCode: record.C3_305737857578,
                          nDriectorName: record.C3_227192484125
                        });

                        this.setState({
                          searchSuperV: false
                        });
                      }}
                    >
                      选择
                    </Button>
                  );
                }
              ]}
            />
          </div>
        </Modal>
        <Modal
          title="BU CODE列表"
          visible={this.state.searchBucode}
          footer={null}
          onCancel={() => {
            this.setState({ searchBucode: false });
          }}
          width={'80vw'}
          height={'80vh'}
        >
          <div
            style={{
              width: '100%',
              height: 'calc(80vh - 104px)',
              position: 'relative'
            }}
          >
            <TableData
              baseURL={WuxiHr03BaseURL}
              resid={bucodeResid}
              hasRowView={false}
              subtractH={220}
              hasAdd={false}
              hasRowSelection={false}
              hasRowDelete={false}
              hasRowModify={false}
              hasModify={false}
              hasDelete={false}
              style={{ height: '100%' }}
              hasRowView={false}
              customRowBtns={[
                record => {
                  return (
                    <Button
                      onClick={() => {
                        this.props.form.setFieldsValue({
                          nBuCode: record.C3_668189623493
                        });
                        this.setState({
                          searchBucode: false
                        });
                      }}
                    >
                      选择
                    </Button>
                  );
                }
              ]}
            />
          </div>
        </Modal>
        <Modal
          title={'选择Job Code'}
          width={'90vw'}
          visible={this.state.selectJobcodeModal}
          footer={null}
          onCancel={() => this.setState({ selectJobcodeModal: false })}
        >
          <div
            style={{
              width: '100%',
              height: 'calc(80vh - 104px)',
              position: 'relative'
            }}
          >
            <TableData
              resid={659552172710}
              baseURL={WuxiHr03BaseURL}
              hasRowView={false}
              subtractH={220}
              hasAdd={false}
              hasRowSelection={false}
              hasRowDelete={false}
              hasRowModify={false}
              hasModify={false}
              hasDelete={false}
              style={{ height: '100%' }}
              hasRowView={false}
              customRowBtns={[
                record => {
                  return (
                    <Button
                      onClick={() => {
                        this.props.form.setFieldsValue({
                          iiviJobCode: record.JobCode
                        });
                        this.setState({
                          selectJobcodeModal: false
                        });
                      }}
                    >
                      选择
                    </Button>
                  );
                }
              ]}
            />
          </div>
        </Modal>
      </Form>
    );
  }
}

export default Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    props.sendFormDataToFather(allValues);
  }
})(ChangedInfoForm);
