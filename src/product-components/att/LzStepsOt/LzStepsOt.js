import React from 'react';
import PropTypes from 'prop-types';
import { message, DatePicker, Form, Select, Input } from 'antd';
import './LzStepsOt.less';
import classNames from 'classnames';
import LzSteps from '../LzSteps';
import { getMainTableData, addRecords } from 'Util/api';
import DateTimePicker from '../../../pages/components/DateTimePicker';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

const otResid = 593202607992; // 请假项目表 id

/**
 * 加班登记批量添加
 */
class LzStepsOt extends React.Component {
  static propTypes = {
    resid: PropTypes.number.isRequired
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      personList: [], // 选择的人员列表
      otList: [], // 班次列表
      stepsLoading: false
    };
    this.stepList = [
      {
        stepTitle: '填写信息',
        renderContent: this.renderFillInInfo
      }
    ];
  }

  componentDidMount() {
    this.getOtList();
  }

  renderFillInInfo = current => {
    const { otList } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div
        className={classNames('lz-steps-ot__3', {
          show: current === 1,
          hide: current !== 1
        })}
      >
        <Form>
          <FormItem label="开始时间">
            {getFieldDecorator('startDateTime', {
              rules: [{ required: true, message: '请选择开始时间' }]
            })(<DateTimePicker timePickerProps={{ minuteStep: 30 }} />)}
          </FormItem>
          <FormItem label="结束时间">
            {getFieldDecorator('endDateTime', {
              rules: [{ required: true, message: '请选择结束时间' }]
            })(<DateTimePicker timePickerProps={{ minuteStep: 30 }} />)}
          </FormItem>
          <FormItem label="加班项目">
            {getFieldDecorator('C3_425213243010', {
              rules: [{ required: true, message: '请选择加班项目' }]
            })(
              <Select>
                {otList.map(item => (
                  <Option key={item.FLAGSNUMBER} value={item.FLAGSNUMBER}>
                    {item.FLAGSNAME}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="登记小时">
            {getFieldDecorator('C3_448121118680', {
              rules: [{ required: true, message: '请输入登记小时' }]
            })(<Input />)}
          </FormItem>
          <FormItem label="加班事由">
            {getFieldDecorator('BZ')(<TextArea />)}
          </FormItem>
        </Form>
      </div>
    );
  };

  // 获取加班项目列表
  getOtList = async () => {
    let res;
    try {
      res = await getMainTableData(otResid);
    } catch (err) {
      message.error(err.message);
    }
    this.setState({ otList: res.data });
  };

  handleSelect = personList => {
    this.setState({ personList });
  };

  handleComplete = async () => {
    const { validateFields } = this.props.form;
    validateFields(async (err, values) => {
      if (!err) {
        this.setState({ stepsLoading: true });
        const params = this.getParams(values);
        let res;
        try {
          res = await addRecords(this.props.resid, params);
        } catch (err) {
          message.error(err.message);
        }
        message.success('添加成功');
        this.props.onClose && this.props.onClose();
      }
    });
  };

  getParams = values => {
    const { personList } = this.state;
    const startDateTime = values.startDateTime;
    const endDateTime = values.endDateTime;

    const params = personList.map(person => ({
      PNID: person['C3_305737857578'], // 人员编号
      DATE1: startDateTime.format('YYYY-MM-DD HH:mm'), // 开始时间
      DATE2: endDateTime.format('YYYY-MM-DD HH:mm'), // 结束时间
      C3_448121118680: values.C3_448121118680, // 登记时间
      C3_425213243010: values.C3_425213243010 // 加班项目
    }));
    return params;
  };

  render() {
    const stepList = this.stepList;
    return (
      <div className="lz-steps-ot">
        <LzSteps
          stepList={stepList}
          onComplete={this.handleComplete}
          onSelectPerson={this.handleSelect}
          stepsLoading={this.state.stepsLoading}
        />
      </div>
    );
  }
}
export default Form.create()(LzStepsOt);
