import React from 'react';
import { Select, message, Button, Modal, Skeleton, Spin } from 'antd';
import TableData from '../../../../common/data/TableData';
import './WorkInfo.less';
import http from 'Util20/api';
import { getItem } from 'Util20/util';

const { Option } = Select;
const modalWrapperStyle = { height: '80vh' };
const activeClasssName = 'performance-query_nav_item__active';

/**
 * 考勤查询
 * @author 邓铭
 */
class WorkInfo extends React.Component {
  state = {
    months: [],
    selectMonth: '',
    userCode: '',
    dailyDetailVisible: false,
    yearDetailVisible: false,
    tiaoxiuDetailVisible: false,
    selectRecord: {},
    currentNav: 'monthDetail',
    punchData: [],
    punchLoading: false
  };

  constructor(props) {
    super(props);
    this.UserCode = JSON.parse(getItem('userInfo')).UserInfo.EMP_USERCODE;
    this.EntCode = JSON.parse(getItem('userInfo')).EnterpriseCode;
    this.baseURL =
      window.pwConfig[
        process.env.NODE_ENV
      ].customURLs.comprehensiveQueryBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
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
      let arr = [];
      if (res.data.length) {
        if (this.EntCode === '100' && !this.props.isManager) {
          if (res.data.length > 1) {
            for (let i = 0; i < 2; i++) {
              arr.push(res.data[i]);
            }
            this.setState({
              months: arr,
              selectMonth: res.data[0].C3_424358155202
            })
          }
        } else {
          this.setState({
            months: res.data,
            selectMonth: res.data[0].C3_424358155202
          });
        }

      }
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  renderSelect = () => {
    return (
      <div>
        <span>考勤月份：</span>
        <Select
          placeholder="月份"
          style={{ width: 120 }}
          value={this.state.selectMonth}
          onSelect={selectValue => {
            this.setState({ selectMonth: selectValue });
          }}
          size="small"
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
            <Option value={month.C3_424358155202}>
              {month.C3_424358155202}
            </Option>
          ))}
        </Select>
      </div>
    );
  };

  closeModal = () => {
    this.setState({
      dailyDetailVisible: false,
      yearDetailVisible: false,
      tiaoxiuDetailVisible: false,
      punchDetailVisible: false,
      selectRecord: {},
      punchData: []
    });
  };
  getPunchData = async (selectRecord) => {
    this.setState({
      punchDetailVisible: true,
      selectRecord,
      punchLoading: true
    })
    try {
      let res = await http({ baseURL: this.baseURL }).getTable({
        resid: this.props.isManager ? "736955745277" : "736943826177",
        cmswhere: `C3_425166076426 = '${selectRecord.DATES}' and C3_424965724815 = '${selectRecord.C3_375380046640}' `
      });
      let punchData = []
      for (let i = 0; i < res.data.length; i++) {
        if (i === 0) {
          punchData.push(res.data[i]);
        } else {
          let bol = false
          for (let c = 0; c < punchData.length; c++) {
            if (punchData[c].TIMES === res.data[i].TIMES) {
              bol = true;
            }
          }
          if (bol === false) {
            punchData.push(res.data[i]);
          }
        }
      }
      this.setState({ punchData, punchLoading: false });
    } catch (e) {
      console.log(e.message);
      this.setState({ punchLoading: false });
    }
  }
  openModal =
    (type, selectRecord) => () => {
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
        case 'punch':
          this.getPunchData(selectRecord)

          break;
        case 'tiaoxiu':
          this.setState({
            tiaoxiuDetailVisible: true,
            selectRecord
          });
          break;
        default:
          break;
      }
    };

  handleNavChange = key => {
    return () => {
      this.setState({
        currentNav: key
      });
    };
  };

  render() {
    const {
      selectMonth,
      dailyDetailVisible,
      yearDetailVisible,
      tiaoxiuDetailVisible,
      selectRecord,
      punchDetailVisible,
      currentNav
    } = this.state;
    const { person, showAnnualLeaveDetail, showTiaoXiuDetail } = this.props;
    return (
      <div className="performance-query">
        <div className="WorkInfoQuery">
          <div className="" style={{ height: '100%' }}>
            <nav className="performance-query_nav">
              <div>
                <span
                  className={`performance-query_nav_item ${currentNav ===
                    'monthDetail' && activeClasssName}`}
                  onClick={this.handleNavChange('monthDetail')}
                >
                  月报明细
                </span>
                <span
                  className={`performance-query_nav_item ${currentNav ===
                    'dayDetail' && activeClasssName}`}
                  onClick={this.handleNavChange('dayDetail')}
                >
                  日报明细
                </span>
              </div>

              {this.renderSelect()}
            </nav>
            <Skeleton loading={!person.C3_305737857578 || !selectMonth}>
              <div style={{ height: 'calc(100% - 28px)' }}>
                {currentNav === 'monthDetail' && (
                  <TableData
                    resid="723568595369"
                    subtractH={180}
                    // tableComponent="ag-grid"
                    // rowSelectionAg="single"
                    // sideBarAg={true}
                    size="small"
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
                    downloadBaseURL={this.attendanceDownloadURL}
                    wrappedComponentRef={element =>
                      (this.tableDataRef = element)
                    }
                    refTargetComponentName="TableData"
                    columnsWidth={{
                      平日及超出工时加班调整: 300,
                      上海公出和出差无锡天数: 300,
                      无锡公出和出差上海天数: 300
                    }}
                    customRowBtns={[
                      (record, btnSize) => {
                        return (
                          <Button
                            size="small"
                            onClick={this.openModal('daily', record)}
                          >
                            日报明细
                          </Button>
                        );
                      },
                      showTiaoXiuDetail
                        ? (record, btnSize) => {
                          return (
                            <Button
                              size="small"
                              onClick={this.openModal('tiaoxiu', record)}
                            >
                              调休明细
                            </Button>
                          );
                        }
                        : null,
                      showAnnualLeaveDetail
                        ? (record, btnSize) => {
                          return (
                            <Button
                              size="small"
                              onClick={this.openModal('year', record)}
                            >
                              年假明细
                            </Button>
                          );
                        }
                        : null
                    ]}
                  />
                )}
                {currentNav === 'dayDetail' && (
                  <TableData
                    resid="723570278896"
                    size="small"
                    subtractH={180}
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
                    wrappedComponentRef={element =>
                      (this.tableDataRef = element)
                    }
                    refTargetComponentName="TableData"
                    cparm1={person.C3_305737857578 || this.UserCode}
                    cparm2={selectMonth}
                    baseURL={this.baseURL}
                    downloadBaseURL={this.attendanceDownloadURL}
                    customRowBtns={this.EntCode === '100' ? [(record) => {
                      return (

                        <Button
                          size="small"
                          onClick={this.openModal('punch', record)}
                        >刷卡明细</Button>
                      )
                    }] : null}
                  />
                )}
              </div>
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
                downloadBaseURL={this.attendanceDownloadURL}
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
                downloadBaseURL={this.attendanceDownloadURL}
              />
            </div>
          </Modal>
          <Modal
            title={`调休明细——${selectRecord.YGNAMES}`}
            visible={tiaoxiuDetailVisible}
            onCancel={this.closeModal}
            onOk={this.closeModal}
            width="80%"
            destroyOnClose
          >
            <div style={modalWrapperStyle}>
              <TableData
                resid="674912074304"
                cmswhere={`C3_435431950633 = '${selectRecord.YGNO}'`}
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
                baseURL={this.baseURL}
                downloadBaseURL={this.attendanceDownloadURL}
              />
            </div>
          </Modal>
          <Modal
            title={`刷卡明细——${selectRecord.C3_375380006609 + selectRecord.DATES}`}
            visible={punchDetailVisible}
            onCancel={this.closeModal}
            onOk={this.closeModal}
            width="80%"
            destroyOnClose
          >
            <div style={modalWrapperStyle} className={'csmTable'}>
              {
                this.state.punchData.length === 0 ? '无' : null
              }
              {
                this.state.punchLoading ? <Spin spinning={true}></Spin> : <ul style={this.state.punchData.length > 0 ? {} : { display: 'none' }}>
                  <li>
                    <span>刷卡时间</span>
                    <span>设备编号</span>
                    <span>是否手工输入</span>
                  </li>
                  {
                    this.state.punchData.map(item => {
                      return (
                        <li>
                          <span>{item.TIMES}</span>
                          <span>{item.WINNO}</span>
                          <span>{item.FLAGS}</span>
                        </li>
                      )
                    })
                  }
                </ul>
              }
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
export default WorkInfo;
