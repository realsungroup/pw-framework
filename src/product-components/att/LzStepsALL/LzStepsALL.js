import React from 'react';
import PropTypes from 'prop-types';
import { message, Form, Input, Table } from 'antd';
import './LzStepsALL.less';
import classNames from 'classnames';

import LzSteps from '../LzSteps';
import { addRecords, CheckOTApplication } from 'Util/api';
import DateTimePicker from '../../../pages/components/DateTimePicker';

const FormItem = Form.Item;
const { TextArea } = Input;

/**
 * 年假登记
 */
class LzStepsALL extends React.Component {
  static propTypes = {
    resid: PropTypes.number.isRequired
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      personList: [], // 选择的人员列表
      stepsLoading: false,
      isVerify: false, // 是否处于验证状态
      mainTableData: [], // 主表数据
      subTableData: [], // 子表数据
      mainColumns: [], // 主表 columns
      subColumns: [] // 子表 columns
    };
    this.stepList = [
      {
        stepTitle: '填写信息',
        renderContent: this.renderSelectTime
      }
    ];
  }

  renderSelectTime = current => {
    const { getFieldDecorator } = this.props.form;
    return (
      <div
        className={classNames('lz-steps-all__2', {
          show: current === 1,
          hide: current !== 1
        })}
      >
        <Form>
          <FormItem label="开始时间">
            {getFieldDecorator('DATE1', {
              rules: [{ required: true, message: '请选择开始时间' }]
            })(<DateTimePicker timePickerProps={{ minuteStep: 30 }} />)}
          </FormItem>
          <FormItem label="结束时间">
            {getFieldDecorator('DATE2', {
              rules: [{ required: true, message: '请选择结束时间' }]
            })(<DateTimePicker timePickerProps={{ minuteStep: 30 }} />)}
          </FormItem>
          <FormItem label="考勤项目编号">
            <div>{23}</div>
          </FormItem>
          <FormItem label="时长">
            {getFieldDecorator('C3_448121118680', {
              rules: [{ required: true, message: '请输入时长' }]
            })(<Input />)}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('BZ', {
              rules: [{ required: false, message: '请输入备注' }]
            })(<TextArea />)}
          </FormItem>
        </Form>
      </div>
    );
  };

  renderExpandedRow = (record, index, indent, expanded) => {
    const { subColumns } = this.state;
    return (
      <Table
        className="lz-steps-all__table"
        columns={subColumns}
        dataSource={record['593714792402']}
        pagination={false}
        pagination={false}
        scroll={{ x: 1400 }}
        rowKey="REC_ID"
      />
    );
  };

  getTableData = res => {
    const mainTableData = res.data;
    const mainColumns = res.cmscolumninfo.map(item => {
      return {
        title: item.text,
        dataIndex: item.id,
        width: 150
      };
    });

    const subColumns = res.subcmscolumninfo['593714792402'].map(item => {
      return {
        title: item.text,
        dataIndex: item.id,
        width: 150
      };
    });
    subColumns.push({
      title: '操作',
      dataIndex: '操作',
      fixed: 'right',
      width: 150,
      render: (text, record, rowIndex) => (
        <a
          href="javascript:;"
          onClick={() => this.handleDelete(record, rowIndex)}
        >
          删除
        </a>
      )
    });
    this.setState({ mainTableData, mainColumns, subColumns, isVerify: true });
  };

  handleDelete = (record, rowIndex) => {
    const { mainTableData, personList } = this.state;
    let mainTableRow, mapId;
    mainTableData.some(item1 => {
      return item1['593714792402'].some(item2 => {
        if (item2.REC_ID === record.REC_ID) {
          mainTableRow = item1;
          mapId = item2.C3_593779302632;
          return true;
        }
      });
    });
    mainTableRow['593714792402'].splice(rowIndex, 1);

    personList.splice(
      personList.findIndex(person => person.mapId === mapId),
      1
    );

    this.setState({ mainTableData, personList });
  };

  handleVerify = () => {
    const { isVerify } = this.state;
    if (!isVerify) {
      const { validateFields } = this.props.form;
      validateFields(async (err, values) => {
        if (!err) {
          this.setState({ stepsLoading: true });
          const params = this.getParams(values);
          let res;
          try {
            res = await CheckOTApplication(this.props.resid, params);
          } catch (err) {
            this.setState({ stepsLoading: false });
            return message.error(err.message);
          }
          this.setState({ stepsLoading: false });
          this.getTableData(res);
        }
      });
    }
  };

  handleSelect = personList => {
    personList.forEach((person, index) => (person.mapId = index + 1));
    this.setState({ personList, isVerify: false });
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
          // res = await CheckOTApplication(this.props.resid, params);
        } catch (err) {
          this.setState({ stepsLoading: false });
          return message.error(err.message);
        }
        message.success('添加成功');
        this.props.onClose && this.props.onClose();
      }
    });
  };

  getParams = values => {
    const { personList } = this.state;
    const params = personList.map((person, index) => ({
      PNID: person['C3_305737857578'], // 人员编号
      DATE1: values.DATE1.format('YYYY-MM-DD HH:mm'), // 开始时间
      DATE2: values.DATE2.format('YYYY-MM-DD HH:mm'), // 结束时间
      C3_448121118680: values.C3_448121118680, // 小时
      BZ: values.BZ, // 备注
      FLAGS: 23
      // map_id: person.mapId
    }));
    return params;
  };

  render() {
    const { stepsLoading } = this.state;
    return (
      <div className="lz-steps-all">
        <LzSteps
          stepList={this.stepList}
          onComplete={this.handleComplete}
          onSelectPerson={this.handleSelect}
          stepsLoading={stepsLoading}
        />
      </div>
    );
  }
}

export default Form.create()(LzStepsALL);
