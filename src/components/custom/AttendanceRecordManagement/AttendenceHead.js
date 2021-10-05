import React, { Component } from 'react';
import { Button, Row, Col, Form, DatePicker, Select, message } from 'antd';
import './AttendanceRecordManagement.less';
import moment from 'moment';

const baseURLAPI = window.pwConfig[process.env.NODE_ENV].customURLs.hikBaseURL;

const { RangePicker } = DatePicker;
const { Option } = Select;

//事件类型
const eventType = [
  { value: '输入密码而非卡号' },
  { value: '卡未分配权限' },
  { value: '合法卡比对通过' },
  { value: '输入卡号错误' },
  { value: '无此卡号' },
  { value: '互锁中无法开门' },
  { value: '互锁门未关闭' },
  { value: '假期权限不合' },
  { value: '胁迫卡比对通过' },
  { value: '刷卡+密码认证失败' },
  { value: '卡号过期' },
  { value: '黑名单事件' },
  { value: '解除警报' },
  { value: '权限不合' },
  { value: '指纹比对通过' },
  { value: '反潜回认证失败' },
  { value: '卡号数字检查错误' },
  { value: '反潜回读卡器刷卡无效' },
  { value: '卡号认证超次警报' },
  { value: '来宾卡认证通过' },
  { value: '卡号长度错误' },
  { value: '胁迫报警' },
  { value: '残疾人卡比对通过' },
  { value: '首卡比对通过' },
  { value: '指纹比对失败' },
  { value: '时段组错误' },
  { value: '智能锁中心远程开锁' },
  { value: '刷卡+指纹认证失败' },
  { value: '多重认证成功' },
  { value: '残疾人卡未分配权限' },
  { value: '指纹+密码认证失败' },
  { value: '多重认证远程认证失败' },
  { value: '刷卡+指纹+密码认证超时' },
  { value: '多重认证超级密码错误' },
  { value: '刷卡+指纹+密码认证失败' },
  { value: '卡不在多重认证时段内' },
  { value: '指纹+密码认证通过' },
  { value: '人脸+密码认证失败' },
  { value: '刷卡+指纹+密码认证通过' },
  { value: '来宾卡无权限' },
  { value: '人脸+指纹认证超时' },
  { value: '刷卡+指纹认证通过' },
  { value: '人脸+指纹认证失败' },
  { value: '超级卡未分配权限' },
  { value: '指纹不存在多重认证超级密码成功' },
  { value: '胁迫卡未分配权限' },
  { value: '人脸+密码+指纹认证通过' },
  { value: '人脸+密码+指纹认证失败' },
  { value: '人脸+刷卡认证通过' },
  { value: '人脸+刷卡认证超时' },
  { value: '人脸+密码认证通过' },
  { value: '人脸+刷卡认证失败' },
  { value: '多重认证超时' },
  { value: '人脸+指纹认证通过' },
  { value: '人脸+密码认证超时' },
  { value: '多重认证重复认证' },
  { value: '人脸认证失败' },
  { value: '人脸+刷卡+指纹认证超时' },
  { value: '人脸认证通过' },
  { value: '人脸+刷卡+指纹认证失败' },
  { value: '人脸+刷卡+指纹认证通过' },
  { value: '人脸+密码+指纹认证超时' },
  { value: '非正规Mifare卡认证失败' },
  { value: '工号+密码认证通过' },
  { value: '工号+密码认证失败' },
  { value: '人证比对失败' },
  { value: '人证比对通过' },
  { value: '真人检测失败' },
  { value: '人脸识别失败' },
  { value: '翻阅' },
  { value: '外力冲撞' },
  { value: '反向闯入' },
  { value: '尾随通行' },
  { value: '通行超时' },
  { value: '认证计划休眠模式认证失败' },
  { value: '门状态常闭或休眠状态认证失败' },
  { value: '卡加密校验失败' },
  { value: '密码不匹配' },
  { value: '组合认证超时' },
  { value: '组合认证通过' },
  { value: '智能锁认证错误次数过多' }
];

class AttendenceHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialDate: [moment().startOf('day'), moment().endOf('day')],
      nameList: [],
      noList: [],
      orgList: [],
      entrancePointList: [],
      entranceAreaList: [],
      controllerList: []
    };
  }

  /**
   * 获取人员列表
   * @param {string} value
   */
  getNameList = value => {
    const url = `${baseURLAPI}api/v1/queryPersonsByName?personName=${value}`;
    value !== '' &&
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(res => {
          this.setState({
            nameList: res.data.list
          });
        })
        .catch(error => {
          console.log(error);
          message.info(error.message);
        });
  };

  /**
   * 获取工号列表
   * @param {string} value
   */
  getNoList = value => {
    const url = `${baseURLAPI}api/v1/queryPersonsByJobNo?jobNo=${value}`;
    value !== '' &&
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(res => {
          this.setState({
            noList: res.data.list
          });
        })
        .catch(error => {
          console.log(error);
          message.info(error.message);
        });
  };

  /**
   * 获取组织列表
   * @param {string} value
   */
  getOrgList = value => {
    const url = `${baseURLAPI}api/v1/queryOrgsByName?orgName=${value}`;
    value !== '' &&
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(res => {
          this.setState({
            orgList: res.data.list
          });
        })
        .catch(error => {
          console.log(error);
          message.info(error.message);
        });
  };

  /**
   * 获取门禁点列表
   * @param {string} value
   */
  getEntrancePointList = value => {
    const url = `${baseURLAPI}api/v1/queryDoorsByName?name=${value}`;
    value !== '' &&
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(res => {
          this.setState({
            entrancePointList: res.data.list
          });
        })
        .catch(error => {
          console.log(error);
          message.info(error.message);
        });
  };

  /**
   * 获取门禁区域列表
   * @param {string} value
   */
  getEntranceAreaList = value => {
    const url = `${baseURLAPI}api/v1/queryRegionsByName?regionName=${value}`;
    value !== '' &&
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(res => {
          this.setState({
            entranceAreaList: res.data.list
          });
        })
        .catch(error => {
          console.log(error);
          message.info(error.message);
        });
  };

  /**
   * 获取控制器列表
   * @param {string} value
   */
  getControllerList = value => {
    const url = `${baseURLAPI}api/v1/queryDevicesByName?name=${value}`;
    value !== '' &&
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(res => {
          this.setState({
            controllerList: res.data.list
          });
        })
        .catch(error => {
          console.log(error);
          message.info(error.message);
        });
  };

  /**
   * 重置所有搜索条件
   */
  handleReset = () => {
    this.props.form.setFieldsValue({
      userName: '',
      personNum: '',
      org: '',
      entrancePoint: '',
      controller: '',
      entranceArea: '',
      eventType: '全部',
      pic: '全部',
      date: [moment().startOf('day'), moment().endOf('day')]
    });
    this.setState({
      initialDate: [moment().startOf('day'), moment().endOf('day')]
    });
  };

  render() {
    const {
      initialDate,
      nameList,
      noList,
      orgList,
      entrancePointList,
      entranceAreaList,
      controllerList
    } = this.state;
    const { getFieldDecorator, setFieldsValue } = this.props.form;

    getFieldDecorator('date', {
      initialValue: [moment().startOf('day'), moment().endOf('day')]
    });

    return (
      <div>
        <Row>
          <Col span={6}>
            <div className="colStyle">
              <div className="labelStyle">
                <span>人员姓名</span>
              </div>
              <div>
                {getFieldDecorator('userName', { initialValue: '' })(
                  <Select
                    showSearch
                    style={{ width: 'calc(25vw - 24px)' }}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={value => {
                      this.getNameList(value);
                    }}
                    notFoundContent={null}
                  >
                    {nameList.map(item => {
                      return (
                        <Option value={item.personName} key={item.personName}>
                          {item.personName}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="colStyle">
              <div className="labelStyle">
                <span>工号</span>
              </div>
              <div>
                {getFieldDecorator('personNum', { initialValue: '' })(
                  <Select
                    showSearch
                    style={{ width: 'calc(25vw - 24px)' }}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={value => {
                      this.getNoList(value);
                    }}
                    notFoundContent={null}
                  >
                    {noList.map(item => {
                      return (
                        <Option value={item.jobNo} key={item.jobNo}>
                          {item.jobNo}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="colStyle">
              <div className="labelStyle">
                <span>所属组织</span>
              </div>
              <div>
                {getFieldDecorator('org', { initialValue: '' })(
                  <Select
                    showSearch
                    style={{ width: 'calc(25vw - 24px)' }}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={value => {
                      this.getOrgList(value);
                    }}
                    notFoundContent={null}
                  >
                    {orgList.map(item => {
                      return (
                        <Option value={item.orgName} key={item.orgName}>
                          {item.orgName}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="colStyle">
              <div className="labelStyle">
                <span>门禁点</span>
              </div>
              <div>
                {getFieldDecorator('entrancePoint', {})(
                  <Select
                    showSearch
                    style={{ width: 'calc(25vw - 24px)' }}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={value => {
                      this.getEntrancePointList(value);
                    }}
                    notFoundContent={null}
                  >
                    {entrancePointList.map(item => {
                      return (
                        <Option value={item.indexCode} key={item.indexCode}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <div className="colStyle">
              <div className="labelStyle">
                <span>控制器</span>
              </div>
              <div>
                {getFieldDecorator('controller', { initialValue: '' })(
                  <Select
                    showSearch
                    style={{ width: 'calc(25vw - 24px)' }}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={value => {
                      this.getControllerList(value);
                    }}
                    notFoundContent={null}
                  >
                    {controllerList.map(item => {
                      return (
                        <Option value={item.name} key={item.name}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="colStyle">
              <div className="labelStyle">
                <span>门禁点区域</span>
              </div>
              <div>
                {getFieldDecorator('entranceArea', { initialValue: '' })(
                  <Select
                    showSearch
                    style={{ width: 'calc(25vw - 24px)' }}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={value => {
                      this.getEntranceAreaList(value);
                    }}
                    notFoundContent={null}
                  >
                    {entranceAreaList.map(item => {
                      return (
                        <Option value={item.indexCode} key={item.name}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="colStyle">
              <div className="labelStyle">
                <span>事件类型</span>
              </div>
              <div>
                {getFieldDecorator('eventType', { initialValue: '全部' })(
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder={'全部'}
                    style={{ width: 'calc(25vw - 24px)' }}
                    optionFilterProp="children"
                    onChange={() => {}}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {eventType.map(item => {
                      return (
                        <Option value={item.value} key={item.value}>
                          {item.value}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="colStyle">
              <div className="labelStyle">
                <span>抓拍图片</span>
              </div>
              <div>
                {getFieldDecorator('pic', { initialValue: '全部' })(
                  <Select
                    showSearch
                    style={{ width: 'calc(25vw - 24px)' }}
                    optionFilterProp="children"
                    onChange={() => {}}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="全部">全部</Option>
                    <Option value="有">有</Option>
                    <Option value="无">无</Option>
                  </Select>
                )}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={9}>
            <div className="colStyle">
              <div className="labelStyle">
                <span>事件时间</span>
              </div>
              <div>
                <RangePicker
                  format={'YYYY-MM-DD HH:mm:ss'}
                  showTime={{ format: 'HH:mm:ss' }}
                  defaultValue={[
                    moment().startOf('day'),
                    moment().endOf('day')
                  ]}
                  value={initialDate}
                  onChange={(dates, dateString) => {
                    setFieldsValue({ date: dates });
                    this.setState({
                      initialDate: dates
                    });
                  }}
                />
              </div>
            </div>
          </Col>
          <Col span={3} style={{ float: 'right' }}>
            <div className="colStyle">
              <div className="labelStyle">
                <span></span>
              </div>
              <div>
                <Button
                  type="primary"
                  key="search"
                  style={{ marginRight: '12px' }}
                  onClick={this.props.getDoorEvents}
                >
                  查询
                </Button>
                <Button type="default" key="reset" onClick={this.handleReset}>
                  重置
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    console.log({ allValues });
    props.getSearchValues(allValues);
  }
})(AttendenceHead);
