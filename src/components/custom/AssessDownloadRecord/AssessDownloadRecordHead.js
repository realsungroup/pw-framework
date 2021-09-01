import React, { Component } from 'react';
import {
  Button,
  Row,
  Col,
  Form,
  DatePicker,
  Select,
  message,
  Input
} from 'antd';
import './AssessDownloadRecord.less';
import moment from 'moment';

const baseURLAPI = window.pwConfig[process.env.NODE_ENV].customURLs.hikBaseURL;

const { Option } = Select;

//下载类型
const downloadTypeList = [
  { value: '计划模板' },
  { value: '卡片' },
  { value: '人脸' },
  { value: '指纹' },
  { value: '人脸+指纹' }
];

//结果类型
const resultList = [
  { value: '全部' },
  { value: '成功' },
  { value: '失败' },
  { value: '部分失败' }
];

//搜索框样式
const selectStyle = {
  width: '300px'
};

class AssessDownloadRecordHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialDate: [moment().startOf('day'), moment().endOf('day')],
      entrancePointList: [],
      entranceAreaList: [],
      controllerList: []
    };
  }

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
      taskId: '',
      entrancePoint: '',
      controller: '',
      entranceArea: '',
      downloadType: '全部',
      downloadResult: '全部'
    });
    this.setState({
      initialDate: [moment().startOf('day'), moment().endOf('day')]
    });
  };

  render() {
    const {
      initialDate,
      entrancePointList,
      entranceAreaList,
      controllerList
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Row>
          <Col span={6}>
            <div className="colStyle">
              <div className="labelStyle">
                <span>任务编号</span>
              </div>
              <div>
                {getFieldDecorator('taskId', { initialValue: '' })(
                  <Input style={selectStyle} />
                )}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="colStyle">
              <div className="labelStyle">
                <span>控制器</span>
              </div>
              <div>
                {getFieldDecorator('controller', { initialValue: '' })(
                  <Select
                    style={selectStyle}
                    showSearch
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
                <span>门禁点</span>
              </div>
              <div>
                {getFieldDecorator('entrancePoint', { initialValue: [] })(
                  <Select
                    style={selectStyle}
                    showSearch
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
                        <Option
                          value={[item.name, item.indexCode]}
                          key={item.indexCode}
                        >
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
                <span>所在区域</span>
              </div>
              <div>
                {getFieldDecorator('entranceArea', { initialValue: '' })(
                  <Select
                    style={selectStyle}
                    showSearch
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
        </Row>

        <Row>
          <Col span={6}>
            <div className="colStyle">
              <div className="labelStyle">
                <span>下载类型</span>
              </div>
              <div>
                {getFieldDecorator('downloadType', { initialValue: '全部' })(
                  <Select style={selectStyle} mode="multiple">
                    {downloadTypeList.map(item => {
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
                <span>下载结果</span>
              </div>
              <div>
                {getFieldDecorator('downloadResult', { initialValue: '全部' })(
                  <Select style={selectStyle}>
                    {resultList.map(item => {
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
                <span>下载开始时间</span>
              </div>
              <div>
                {getFieldDecorator('startTime', {
                  initialValue: initialDate[0]
                })(
                  <DatePicker
                    style={selectStyle}
                    format="YYYY-MM-DD HH:mm"
                  ></DatePicker>
                )}
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="colStyle">
              <div className="labelStyle">
                <span>下载结束时间</span>
              </div>
              <div>
                {getFieldDecorator('resultType', {
                  initialValue: initialDate[1]
                })(
                  <DatePicker
                    style={selectStyle}
                    format="YYYY-MM-DD HH:mm"
                    showTime={{ format: 'HH:mm' }}
                  ></DatePicker>
                )}
              </div>
            </div>
          </Col>
        </Row>

        <Row style={{ marginTop: '16px' }}>
          <Col span={3} style={{ float: 'right' }}>
            <div>
              <div>
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
    props.getSearchValues(allValues);
  }
})(AssessDownloadRecordHead);
