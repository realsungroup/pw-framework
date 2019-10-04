import React from 'react';
import { Select, message, Button, Modal, Skeleton } from 'antd';
import TableData from '../../../../common/data/TableData';
import './WorkInfo.less';
import http from 'Util20/api';
import { getItem } from 'Util20/util';
// import BIGrid from 'lz-components-and-utils/lib/BIGrid';

const { Option } = Select;
const modalWrapperStyle = { height: '80vh' };

class WorkInfo extends React.Component {
  state = {
    months: [],
    selectMonth: '',
    userCode: '',
    dailyDetailVisible: false,
    yearDetailVisible: false,
    selectRecord: {}
  };

  constructor(props) {
    super(props);
    this.UserCode = JSON.parse(getItem('userInfo')).UserInfo.EMP_USERCODE;
    this.baseURL =
      window.pwConfig[
        process.env.NODE_ENV
      ].customURLs.comprehensiveQueryBaseURL;
  }

  componentDidMount = async () => {
    await this.getYearMonths();
  };

  getYearMonths = async () => {
    try {
      const res = await http().getTable({
        resid: '447426327525',
        dblinkname: 'ehr'
      });
      if (res.data.length) {
        this.setState({
          months: res.data,
          selectMonth: res.data[0].C3_424358155202
        });
      }
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  renderSelect = () => {
    return (
      <Select
        placeholder="月份"
        style={{ width: 120, marginBottom: 16 }}
        value={this.state.selectMonth}
        onSelect={selectValue => {
          this.setState({ selectMonth: selectValue });
        }}
        showSearch
        filterOption={(input, option) => {
          return (
            option.props.children
              .toString()
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          );
        }}
      >
        {this.state.months.map(month => (
          <Option value={month.C3_424358155202}>{month.C3_424358155202}</Option>
        ))}
      </Select>
    );
  };

  closeModal = () => {
    this.setState({
      dailyDetailVisible: false,
      yearDetailVisible: false,
      selectRecord: {}
    });
  };

  openModal = (type, selectRecord) => () => {
    switch (type) {
      case 'daily':
        this.setState({
          dailyDetailVisible: true,
          selectRecord
        });
        break;
      case 'year':
        this.setState({
          yearDetailVisible: true,
          selectRecord
        });
        break;

      default:
        break;
    }
  };

  render() {
    const {
      selectMonth,
      dailyDetailVisible,
      yearDetailVisible,
      selectRecord
    } = this.state;
    const { person } = this.props;
    return (
      <div className="WorkInfoQuery">
        <div className="Home">
          <div className="buttonLine">{this.renderSelect()}</div>
          <Skeleton loading={!person.C3_305737857578 || !selectMonth}>
            <TableData
              resid="460481857607"
              subtractH={220}
              hasAdvSearch={false}
              hasAdd={false}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasBeBtns={false}
              hasRowModify={false}
              hasRowSelection={false}
              actionBarWidth={200}
              cparm1={person.C3_305737857578 || this.UserCode}
              cparm2={selectMonth}
              baseURL={this.baseURL}
              customRowBtns={[
                (record, btnSize) => {
                  return (
                    <Button onClick={this.openModal('daily', record)}>
                      日报明细
                    </Button>
                  );
                },
                (record, btnSize) => {
                  return (
                    <Button onClick={this.openModal('year', record)}>
                      年假明细
                    </Button>
                  );
                }
              ]}
            />
          </Skeleton>
        </div>
        <Modal
          title={`日报明细——${selectRecord.YGNAMES}`}
          visible={dailyDetailVisible}
          onCancel={this.closeModal}
          onOk={this.closeModal}
          width="80%"
          destroyOnClose
        >
          <div style={modalWrapperStyle}>
            <TableData
              resid="447426097689"
              subtractH={200}
              hasAdvSearch={false}
              hasAdd={false}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasBeBtns={false}
              hasRowModify={false}
              hasRowSelection={false}
              actionBarWidth={100}
              cmswhere={`C3_375380046640 = '${selectRecord.YGNO}' and YEARMONTH= '${selectMonth}'`}
              baseURL={this.baseURL}
            />
          </div>
        </Modal>
        <Modal
          title={`年假明细——${selectRecord.YGNAMES}`}
          visible={yearDetailVisible}
          onCancel={this.closeModal}
          onOk={this.closeModal}
          width="80%"
          destroyOnClose
        >
          <div style={modalWrapperStyle}>
            <TableData
              resid="467148145344"
              subtractH={200}
              hasAdvSearch={false}
              hasAdd={false}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasBeBtns={false}
              hasRowModify={false}
              hasRowSelection={false}
              actionBarWidth={100}
              cmswhere={`C3_426438637535 = '${selectRecord.YGNO}'`}
              baseURL={this.baseURL}
            />
          </div>
        </Modal>
      </div>
    );
  }
}
export default WorkInfo;
