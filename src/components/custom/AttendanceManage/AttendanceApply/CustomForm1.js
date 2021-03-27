import React from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Cascader,
  DatePicker,
  InputNumber,
  Select,
  message,
  Upload,
  Icon
} from 'antd';
import http from 'Util20/api';
import { getItem } from 'Util/util';
import moment from 'moment';
import { uploadFile } from '../../../../util/api';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
};
const { TextArea } = Input;
const { Option } = Select;
const vacateHours = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23'
];
const seconds = new Array(60).fill('1').map((item, index) => { return index < 10 ? '0' + index : '' + index });
console.log(seconds)
/**
 * 加班申请
 * @author 邓铭
 */
class CustomForm1 extends React.Component {
  state = {
    types: [], //类型列表
    typeSubData: {},
    selectedTypeId: null,
    applyType: '', // 申请类型：加班或请假
    submitting: false, //是否正在提交
    isNeedAttachment: false, //是否需要附件
    filledData: {
      reason: '', //事由
      startTime: '',
      startDate: null, //开始日期
      startHour: '', //开始小时
      startMinute: '', //开始分钟
      endTime: '',
      endDate: null, //结束日期
      endHour: '', //结束小时
      endMinute: '', //结束分钟
      timeLength: null, //时间长度
      attachmentURL: '' //附件地址
    },
    errors: {
      type: true,
      reason: true,
      startTime: true,
      endTime: true,
      timeLength: false, //时间长度
      attachmentURL: false //附件地址
    },
    currentUser: JSON.parse(getItem('userInfo')).Data,
    currentUserCode: JSON.parse(getItem('userInfo')).UserInfo.EMP_ID,
    fileList: [] //附件列表
  };

  componentDidMount() {
    this.getType();
  }

  componentDidUpdate(preProps, preState) {
    // 填写的时间变化时自动计算加班时长
    const { filledData, selectedTypeId, currentUserCode } = this.state;
    const {
      startDate,
      endDate,
      startHour,
      endHour,
      startMinute,
      endMinute
    } = filledData;
    const startTime = `${startDate} ${startHour}:${startMinute}`;
    const endTime = `${endDate} ${endHour}:${endMinute}`;
    const preStartTime = `${preState.filledData.startDate} ${preState.filledData.startHour}:${preState.filledData.startMinute}`;
    const preEndTime = `${preState.filledData.endDate} ${preState.filledData.endHour}:${preState.filledData.endMinute}`;
    if (
      startDate &&
      startHour &&
      startMinute &&
      endDate &&
      endMinute &&
      endHour
    ) {
      if (startTime !== preStartTime || endTime !== preEndTime) {
        this.setState({
          filledData: {
            ...filledData,
            startTime,
            endTime
          },
          errors: {
            ...this.state.errors,
            startTime: false,
            endTime: false
          }
        });
        this.getTimeLength(startTime, endTime, selectedTypeId, currentUserCode);
      }
    }
  }

  /**
   * 获取加班时长
   * @param {string}startTime 开始时间
   * @param {string}endTime 结束时间
   * @param {string}selectedTypeId 加班类型id
   * @param {string}currentUserCode 当前登录用户
   * @returns {void}
   */
  getTimeLength = async (
    startTime,
    endTime,
    selectedTypeId,
    currentUserCode
  ) => {
    try {
      let res = await http().getFieldBySql({
        dblink: 'ehr',
        sql: `select dbo.[fn_get_regvocationhours](${selectedTypeId},'${startTime}','${endTime}','${currentUserCode}',0)`
      });
      const timeLength = Number(res.data);
      if (isNaN(timeLength)) {
        message.info(res.data);
        this.setState({
          filledData: {
            ...this.state.filledData,
            timeLength: null
          },
          errors: {
            ...this.state.errors,
            timeLength: true
          }
        });
      } else {
        this.setState({
          filledData: {
            ...this.state.filledData,
            timeLength
          },
          errors: {
            ...this.state.errors,
            timeLength: false
          }
        });
      }
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  /**
   * 获取加班类型数据
   */
  getType = async () => {
    try {
      let res = await http().getRecordAndSubTables({
        resid: '621424834362',
        subresid: '621425473104,621425450273',
        getsubresource: 1,
        dblinkname: 'ehr'
      });
      let data = [...res.data];
      let typesData = [
        { label: '请假', value: '请假', children: [] },
        { label: '加班', value: '加班', children: [] }
      ];
      let typeSubData = {};
      data.forEach(item => {
        typeSubData[item.C3_449351914543] = {
          startHours: item[621425473104].map(i => i.C3_471276963242),
          endHours: item[621425450273].map(i => i.C3_471277296169),
          isNeedAttachment: item.C3_451217431379 === 'Y'
        };
        let _item = {
          label: item.C3_449351902999,
          value: item.C3_449351914543
        };
        if (item.C3_449443137826 === '请假') {
          typesData[0].children.push(_item);
        } else {
          typesData[1].children.push(_item);
        }
      });
      this.setState({
        types: typesData,
        typeSubData
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  /**
   * 提交表单
   */
  handleSubmit = async e => {
    this.setState({ submitting: true });

    // e.preventDefault();
    let {
      filledData,
      selectedTypeId,
      currentUserCode,
      isNeedAttachment,
      fileList,
      errors
    } = this.state;
    for (let v of Object.values(errors)) {
      if (v) {
        this.setState({ submitting: false });

        return message.info('信息未填写完整');
      }
    }
    if (isNeedAttachment && fileList.length === 0) {
      this.setState({ submitting: false });

      return message.info('请上传附件');
    }
    const { startTime, endTime, timeLength } = filledData;
    try {
      let result = await this.judgeCanSubmit(
        startTime,
        endTime,
        timeLength,
        selectedTypeId,
        currentUserCode
      );
      if (result.data === 'ok' || result.data === false) {
        let res = await http().addRecords({
          resid: '449440966625',
          data: [
            {
              C3_449349153817: selectedTypeId, //项目编号
              C3_449349070185: filledData.startDate, //开始日期
              C3_449349087938: filledData.startHour, //开始小时
              C3_449349105582: filledData.startMinute, //开始分钟
              C3_449349077689: filledData.endDate, //结束日期
              C3_449349100590: filledData.endHour, //结束小时
              C3_449349105691: filledData.endMinute, //结束分钟
              C3_449663289150: filledData.reason, //事由
              C3_449349168372: filledData.timeLength, // 时间长度 小时
              C3_621426172314: isNeedAttachment ? fileList[0].url : ''
            }
          ],
          dblinkname: 'ehr'
        });
        message.success(res.message);
        this.props.goBack();
        this.props.getNotices();
      } else {
        message.error(result.data);
        this.setState({ submitting: false });
      }
    } catch (error) {
      console.log(error);
      message.error(error.message);
      this.setState({ submitting: false });
    } finally {
      this.setState({ submitting: false });
    }
  };

  /**
   * 判断是否可以提交
   * @param {string}startTime 开始时间
   * @param {string}endTime 结束时间
   * @param {number}timeLength 加班时长
   * @param {string}selectedTypeId 加班类型id
   * @param {string}currentUserCode 当前登录用户
   * @returns {object}
   */
  judgeCanSubmit = async (
    startTime,
    endTime,
    timeLength,
    selectedTypeId,
    currentUserCode
  ) => {
    try {
      let res = await http().getFieldBySql({
        dblink: 'ehr',
        sql: `select dbo.[fn_check_regvocation](${selectedTypeId},'${startTime}','${endTime}','${currentUserCode}',${timeLength} )`
      });
      return res;
    } catch (error) {
      throw error;
    }
  };
  handleDateChange = item => v => {
    this.setState({
      filledData: {
        ...this.state.filledData,
        [item]: v && v.format('YYYY-MM-DD')
      }
    });
    this.setDateError();
  };

  setDateError = () => {
    this.setState({
      errors: {
        ...this.state.errors,
        startTime: this.state.filledData.startTime ? false : true,
        endTime: this.state.filledData.endTime ? false : true
      }
    });
  };

  handleStringChange = item => v => {
    this.setState({
      filledData: { ...this.state.filledData, [item]: v }
    });
    this.setDateError();
  };

  handleEventChange = item => e => {
    this.setState({
      filledData: { ...this.state.filledData, [item]: e.target.value },
      errors: {
        ...this.state.errors,
        [item]: e.target.value ? false : true
      }
    });
  };

  handleFileChange = info => {
    let fileList = [...info.fileList];
    this.setState({ fileList });
  };

  handleTypeChange = v => {
    if (v.length) {
      this.setState({
        selectedTypeId: v[1],
        isNeedAttachment: this.state.typeSubData[v[1]].isNeedAttachment,
        applyType: v[0],
        errors: {
          ...this.state.errors,
          type: false
        }
      });
    } else {
      this.setState({
        selectedTypeId: null,
        isNeedAttachment: false,
        applyType: '',
        errors: {
          ...this.state.errors,
          type: true
        }
      });
    }
  };
  render() {
    const {
      currentUser,
      types,
      typeSubData,
      selectedTypeId,
      filledData,
      submitting,
      applyType,
      isNeedAttachment,
      errors
    } = this.state;
    let startHours = [], //可选的开始时间点
      endHours = [], //可选的结束时间点
      disabled = true; //时间长度是否不可手动输入

    // 已选择了申请类型
    if (selectedTypeId) {
      startHours = typeSubData[selectedTypeId].startHours;
      endHours = typeSubData[selectedTypeId].endHours;
      // 所选的类型没有规定时间点，则0-24整点都可选
      if (!startHours.length) {
        endHours = startHours = vacateHours;
        if (applyType === '加班') {
          disabled = false;
        }
      }
    }
    return (
      <div className="attendace-aplly_form__wrapper">
        <Form className="attendace-aplly_form">
          <h2>请假/加班申请单</h2>
          <Row style={{ fontWeight: 600, marginBottom: 32 }}>
            <Col span={8}>填单人：{currentUser}</Col>
            <Col span={16}>
              填单时间：{moment().format('YYYY-MM-DD HH:mm:ss')}
            </Col>
          </Row>
          <Form.Item
            {...formItemLayout}
            label="类别："
            required
            validateStatus={errors.type && 'error'}
            help={errors.type && '请选择类别'}
          >
            <Cascader
              options={types}
              placeholder="请选择类别"
              onChange={this.handleTypeChange}
            />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="开始时间："
            required
            validateStatus={errors.startTime && 'error'}
            help={errors.startTime && '请输入完整的开始时间'}
          >
            <DatePicker onChange={this.handleDateChange('startDate')} />
            <Select
              placeholder="时"
              style={{ width: 100, marginLeft: 8 }}
              onChange={this.handleStringChange('startHour')}
              notFoundContent="未选择类别"
            >
              {startHours.map(hour => (
                <Option value={hour}>{hour}</Option>
              ))}
            </Select>
            <Select
              placeholder="分"
              onChange={this.handleStringChange('startMinute')}
              style={{ width: 100, marginLeft: 8 }}
            >
              {seconds.map(item => <Option key={item} value={item}>{item}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="结束时间："
            required
            validateStatus={errors.endTime && 'error'}
            help={errors.endTime && '请输入完整的结束时间'}
          >
            <DatePicker onChange={this.handleDateChange('endDate')} />
            <Select
              placeholder="时"
              style={{ width: 100, marginLeft: 8 }}
              onChange={this.handleStringChange('endHour')}
              notFoundContent="未选择类别"
            >
              {endHours.map(hour => (
                <Option value={hour}>{hour}</Option>
              ))}
            </Select>
            <Select
              placeholder="分"
              style={{ width: 100, marginLeft: 8 }}
              onChange={this.handleStringChange('endMinute')}
            >
              {seconds.map(item => <Option key={item} value={item}>{item}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="事由："
            required
            validateStatus={errors.reason && 'error'}
            help={errors.reason && '请输入事由'}
          >
            <TextArea
              placeholder="请输入事由"
              onChange={this.handleEventChange('reason')}
            />
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="时间长度："
            required
            validateStatus={errors.timeLength && 'error'}
            help={errors.timeLength && '输入时间有误'}
          >
            <InputNumber disabled={disabled} value={filledData.timeLength} />
          </Form.Item>
          {isNeedAttachment && (
            <Form.Item {...formItemLayout} label="附件：" required>
              <Upload
                onChange={this.handleFileChange}
                fileList={this.state.fileList}
                onRemove={v => {
                  this.setState({ fileList: [] });
                }}
                customRequest={async file => {
                  const res = await uploadFile(file.file);
                  this.setState({
                    fileList: [
                      {
                        name: file.file.name,
                        url: res,
                        status: 'done',
                        uid: moment().format()
                      }
                    ]
                  });
                }}
              >
                <Button>
                  <Icon type="upload" /> 上传附件
                </Button>
              </Upload>
            </Form.Item>
          )}

          <Row>
            <Button
              style={{ marginRight: 8 }}
              type="primary"
              // htmlType="submit"
              onClick={() => {
                this.handleSubmit();
              }}
              loading={submitting}
            >
              提交
            </Button>
            <Button onClick={this.props.goBack}>返回</Button>
          </Row>
        </Form>
      </div>
    );
  }
}
export default Form.create({})(CustomForm1);
