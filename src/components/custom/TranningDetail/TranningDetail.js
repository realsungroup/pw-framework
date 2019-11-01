import React from 'react';
import './TranningDetail.less';
import TableData from '../../common/data/TableData';
import {
  Select,
  message,
  Form,
  Input,
  Button,
  Divider,
  Icon,
  Tooltip
} from 'antd';
import http from 'Util20/api';
import debounce from 'lodash/debounce';

// 625854136036
const resid = '625854136036';
const { Option } = Select;
const YEAR_RESID = '420161931474'; //财年表id
const { TextArea } = Input;
class TranningDetail extends React.Component {
  state = {
    years: [],
    selectedYear: '',
    userData: [],
    fetching: false,
    remindData: {
      additionalWords: '',
      selectedApprovaler: {}
    }
  };
  constructor(props) {
    super(props);
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  componentDidMount() {
    this.getYears();
  }

  //获取财年
  getYears = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: YEAR_RESID
      });
      let years = [...res.data];
      let currentYear = years.find(item => item.C3_478179065325 === 'Y');
      this.setState({
        years,
        currentYear,
        selectedYear: currentYear.C3_420161949106
      });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  //根据工号搜索辅导员
  fetchUser = async value => {
    this.setState({ userData: [], fetching: true });
    try {
      const res = await http().getTable({
        resid: '609599795438',
        cmswhere: `C3_227192472953 = '${value}'`
      });
      const userData = res.data.map(user => ({
        label: `${user.C3_227192484125}`,
        key: user.C3_227192472953
      }));

      this.setState({
        userData
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    } finally {
      this.setState({ fetching: false });
    }
  };

  handleApprovalerChange = label =>
    this.setState({
      remindData: {
        ...this.state.remindData,
        selectedApprovaler: label
      }
    });

  handleAdditionalWords = v =>
    this.setState({
      remindData: {
        ...this.state.remindData,
        additionalWords: v.target.value
      }
    });

  sendEmail = () => {
    console.log(this.state.remindData);
    const { remindData } = this.state;
    if (!remindData.selectedApprovaler.key) {
      return message.info('请选择审批人');
    }
  };
  render() {
    const { years, selectedYear, userData, fetching } = this.state;

    return (
      <div className="tranning-detail">
        <Tooltip title="锁定">
          <div className="tranning-detail_lock">
            <Icon type="lock" theme="filled" />
          </div>
        </Tooltip>

        <div className="tranning-detail_tabledata-wrapper">
          <TableData
            resid={resid}
            subtractH={220}
            tableComponent="ag-grid"
            sideBarAg={true}
            hasAdvSearch={true}
            hasAdd={false}
            hasRowView={false}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            hasBeBtns={false}
            hasRowModify={false}
            hasRowSelection={false}
          />
        </div>
        <sider className="tranning-detail_sider">
          <div>
            <Form.Item label="请选择财年：" required>
              <Select style={{ width: '100%' }} value={selectedYear}>
                {years.map(item => (
                  <Option key={item.REC_ID} value={item.C3_420161949106}>
                    {item.C3_420161949106}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="请选择审批人：" required>
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="请输入审批人工号"
                filterOption={false}
                onSearch={this.fetchUser}
                onChange={this.handleApprovalerChange}
                labelInValue
                // value={value}
                loading={fetching}
              >
                {userData.map(d => (
                  <Option key={d.key}>{d.label}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="附语：">
              <TextArea rows={6} onChange={this.handleAdditionalWords} />
            </Form.Item>
            <Button type="primary" onClick={this.sendEmail}>
              发送邮件提醒审批
            </Button>
            <Divider />
            <div className="tranning-detail_sider_approval">
              <div className="tranning-detail_sider_approval_item">
                <span>
                  <b>审批结果:</b>
                </span>
              </div>
              <div className="tranning-detail_sider_approval_item">
                <span>
                  <b>审批时间:</b>
                </span>
              </div>
              <div className="tranning-detail_sider_approval_item">
                <span>
                  <b>审批附语:</b>
                </span>
              </div>
            </div>
          </div>
        </sider>
      </div>
    );
  }
}

export default TranningDetail;
