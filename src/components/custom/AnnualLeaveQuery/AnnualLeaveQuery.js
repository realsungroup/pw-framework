import React from 'react';
import {
  Tabs,
  message,
  Select,
  Table,
  DatePicker,
  Modal,
  Icon,
  Button,
  Collapse,
  TreeSelect,
  Spin
} from 'antd';
import './AnnualLeaveQuery.less';
import { getItem } from 'Util20/util';
import http from 'Util20/api';
import TableData from 'Common/data/TableData';
import memoize from 'memoize-one';
import moment from 'moment';
import ExportJsonExcel from 'js-export-excel';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { TreeNode } = TreeSelect;

class AnnualLeaveQuery extends React.Component {
  constructor(props) {
    super(props);
    const userInfoJson = JSON.parse(getItem('userInfo'));
    this.state = {
      UserCode: userInfoJson.UserCode,
      UserName: userInfoJson.Data,
      synj: null, //抬头上的信息
      snsy: null, //抬头上的信息
      djfp: null //抬头上的信息
    };
  }

  render() {
    const { 员工年假季度账户表, 员工年假使用明细表, baseURL } = this.props;
    const { UserCode } = this.state;
    return (
      <div className="page-annual-leave-query">
        <Tabs>
          <TabPane tab="账户明细" key="1">
            <Summary
              baseURL={baseURL}
              subResid={员工年假使用明细表}
              resid={员工年假季度账户表}
              userCode={UserCode}
            />
          </TabPane>
          {/* <TabPane tab="使用明细" key="2">
            <Detail
              baseURL={baseURL}
              resid={员工年假使用明细表}
              userCode={UserCode}
            />
          </TabPane> */}
          <TabPane tab="年假季度结算" key="3">
            <CopySummary
              baseURL={baseURL}
              subResid={员工年假使用明细表}
              resid={员工年假季度账户表}
              userCode={UserCode}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default AnnualLeaveQuery;

const quarters = [
  { title: '第1季度', value: 1 },
  { title: '第2季度', value: 2 },
  { title: '第3季度', value: 3 },
  { title: '第4季度', value: 4 }
];
const styles = {
  selectStyle: {
    width: 100,
    margin: '0 4px'
  }
};
// 输出base64编码
const base64 = s => window.btoa(unescape(encodeURIComponent(s)));
const tableToExcel = str => {
  console.log(str);
  // Worksheet名
  const worksheet = '员工年假';
  const uri = 'data:application/vnd.ms-excel;base64,';

  // 下载的表格模板数据
  const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
	xmlns:x="urn:schemas-microsoft-com:office:excel" 
	xmlns="http://www.w3.org/TR/REC-html40">
	<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
	<x:Name>${worksheet}</x:Name>
	<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
	</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
	</head><body><table>${str}</table></body></html>`;
  // 下载模板
  window.location.href = uri + base64(template);
};
class Summary extends React.PureComponent {
  state = {
    allAnnualLeaveQuery: [], //全部年假数据
    years: [], //员工从入职到当前的年份
    startYear: undefined,
    startQuarter: 1,
    endYear: undefined,
    endQuarter: 4,
    subTableModalVisible: false,
    usesubTableModalVisible: false,
    applyRecordsModalVisible: false,
    selectedRecord: {},
    selectedSubRecord: {},
    treeData: [],
    selectValue: '',
    loading: false
  };
  columns = [
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year'
      // width: 100,
    },
    {
      title: '季度',
      dataIndex: 'quarter',
      key: 'quarter'
      // width: 100,
    },
    {
      title: '合计可用年假',
      dataIndex: 'hjky',
      key: 'hjky'
      // width: 120,
    },
    {
      title: '剩余可用年假',
      dataIndex: 'synj',
      key: 'synj'
      // width: 120,
    },
    {
      title: '累积使用',
      dataIndex: 'ljsq',
      key: 'ljsq'
      // width: 120,
    },
    // {
    //   title: '当季分配年假天数',
    //   children: [
    //     {
    //       title: '已用',
    //       dataIndex: 'sydjfp',
    //       key: 'sydjfp'
    //     },
    //     {
    //       title: '未用',
    //       dataIndex: 'djfp',
    //       key: 'djfp'
    //     },
    //     {
    //       title: '合计',
    //       dataIndex: 'djhj',
    //       key: 'djhj'
    //     }
    //   ]
    // },
    // {
    //   title: '往季分配年假天数',
    //   children: [
    //     {
    //       title: '已用',
    //       dataIndex: 'ljsysjsy',
    //       key: 'ljsysjsy'
    //     },
    //     {
    //       title: '未用',
    //       dataIndex: 'sjsy',
    //       key: 'sjsy'
    //     },
    //     {
    //       title: '合计',
    //       dataIndex: 'wjhj',
    //       key: 'wjhj'
    //     }
    //   ]
    // },
    // {
    //   title: '往年分配年假天数',
    //   children: [
    //     {
    //       title: '已用',
    //       dataIndex: 'ljsysnsy',
    //       key: 'ljsysnsy'
    //     },
    //     {
    //       title: '未用',
    //       dataIndex: 'snsy',
    //       key: 'snsy'
    //     },
    //     {
    //       title: '合计',
    //       dataIndex: 'wnhj',
    //       key: 'wnhj'
    //     }
    //   ]
    // },
    {
      title: '是否结算',
      dataIndex: 'SendBack',
      key: 'SendBack'
      // width: 100,
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <>
          <span
            className="table-action--view"
            onClick={() => {
              this.setState({
                selectedRecord: record,
                usesubTableModalVisible: true
              });
            }}
          >
            使用明细
          </span>
          {/* <span
            className="table-action--view"
            onClick={() => {
              this.setState({
                selectedRecord: record,
                subTableModalVisible: true
              });
            }}
          >
            交易明细
          </span> */}
        </>
      )
    }
  ];
  componentDidMount() {
    this.fetchAnnualLeaves();
    this.getData();
  }

  getData = async () => {
    const bianhao = JSON.parse(localStorage.getItem('userInfo')).UserInfo
      .EMP_USERCODE;
    this.setState({
      selectValue: bianhao
    });
    try {
      let res = await http({ baseURL: 'http://10.108.2.66:2001' }).postTreeData(
        {
          resid: '609599795438',
          Levels: 3,
          MoveDirection: 1,
          MoveLevels: 1,
          ColumnOfID: 'C3_305737857578', //人员编号
          ColumnOfPID: 'C3_417993417686', //直接主管编号
          ProductIDs: bianhao //当前人员编号1751
        }
      );
      let arr = [];
      let n = 0;
      while (n < res.nodes.length) {
        if (n === 0) {
          arr.push({
            title: res.nodes[n].C3_227192484125 || '',
            value: res.nodes[n].C3_305737857578,
            key: res.nodes[n].C3_305737857578,
            pid: 'cur'
          });
          n++;
        } else {
          arr.push({
            title: res.nodes[n].C3_227192484125 || '',
            value: res.nodes[n].C3_305737857578,
            key: res.nodes[n].C3_305737857578,
            pid: res.nodes[n].C3_417993417686
          });
          n++;
        }
      }
      this.setState({ treeData: this.toTree(arr, 'cur') });
    } catch (error) {
      console.log(error.message);
    }
  };

  toTree = (list, ppid) => {
    if (
      list.some(node => {
        return node.pid === ppid;
      })
    ) {
      return list
        .filter(item => item.pid === ppid)
        .map(item => {
          return {
            ...item,
            children: this.toTree(list, item.key)
          };
        });
    } else {
      return;
    }
  };

  fetchAnnualLeaves = async () => {
    const { resid, userCode, baseURL } = this.props;
    const numID = JSON.parse(localStorage.getItem('userInfo')).UserInfo.EMP_ID;
    const curYear = parseInt(moment().year());
    const curQuarter = parseInt(moment().quarter());

    let res1;
    try {
      res1 = await http({ baseURL }).getTable({
        resid: '662169383744',
        cmswhere: `NumberID = '${numID}' and Quarter = '${curYear}'`
      });
      this.setState({
        snsy: res1.data.length !== 0 ? res1.data[0].Residue : 0
      });
    } catch (error) {
      console.log(error.message);
      message.info(error.message);
    }
    let res;
    try {
      res = await http({ baseURL }).getTable({
        resid: '662169346288',
        cmswhere: `numberID = ${numID} and year = ${curYear}`
      });
      let synj1 = 0;
      let hjky = 0;
      res.data.map(item => {
        if (item.synj >= 0) {
          synj1 = item.synj + synj1;
        }
        if (item.quarter === curQuarter) {
          hjky = item.hjky;
        }
      });
      this.setState({
        synj: synj1,
        djfp: hjky
      });
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
    try {
      const res = await http({ baseURL }).getTable({
        resid,
        cmswhere: `numberID = '${userCode}'`
      });
      const yearSet = new Set();
      res.data.forEach(item => {
        item.sydjfp = item.sydjfp || 0;
        item.djhj = item.sydjfp + item.djfp; //当季合计

        item.ljsysjsy = item.ljsysjsy || 0;
        item.wjhj = item.ljsysjsy + item.sjsy; //往季合计

        item.ljsysnsy = item.ljsysnsy || 0;
        item.wnhj = item.ljsysnsy + item.snsy; //往年合计
        yearSet.add(item.year);
      });
      const years = [...yearSet];
      this.setState({
        allAnnualLeaveQuery: res.data,
        years,
        startYear: years[0],
        endYear: years[0]
      });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  fetchAnnualLeavesCopy = async value => {
    const { resid, baseURL } = this.props;
    const curYear = parseInt(moment().year());
    const curQuarter = parseInt(moment().quarter());
    let numID;
    try {
      let res3 = await http({ baseURL }).getTable({
        resid: '227186227531',
        cmswhere: `C3_305737857578 = '${value}'`
      });
      numID = res3.data[0].C3_227192472953;
    } catch (error) {
      console.log(error.message);
      message.info(error.message);
    }

    let res1;
    try {
      res1 = await http({ baseURL }).getTable({
        resid: '662169383744',
        cmswhere: `NumberID = '${numID}' and Quarter = '${curYear}'`
      });
      this.setState({
        snsy: res1.data.length !== 0 ? res1.data[0].Residue : 0
      });
    } catch (error) {
      console.log(error.message);
      message.info(error.message);
    }
    let res;
    try {
      res = await http({ baseURL }).getTable({
        resid: '662169346288',
        cmswhere: `numberID = ${numID} and year = ${curYear}`
      });
      let synj1 = 0;
      let hjky = 0;
      res.data.map(item => {
        if (item.synj >= 0) {
          synj1 = item.synj + synj1;
        }
        if (item.quarter === curQuarter) {
          hjky = item.hjky;
        }
      });
      this.setState({
        synj: synj1,
        djfp: hjky
      });
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
    try {
      const res = await http({ baseURL }).getTable({
        resid,
        cmswhere: `numberID = '${numID}'`
      });
      const yearSet = new Set();
      res.data.forEach(item => {
        item.sydjfp = item.sydjfp || 0;
        item.djhj = item.sydjfp + item.djfp; //当季合计

        item.ljsysjsy = item.ljsysjsy || 0;
        item.wjhj = item.ljsysjsy + item.sjsy; //往季合计

        item.ljsysnsy = item.ljsysnsy || 0;
        item.wnhj = item.ljsysnsy + item.snsy; //往年合计
        yearSet.add(item.year);
      });
      const years = [...yearSet];
      this.setState({
        allAnnualLeaveQuery: res.data,
        years,
        startYear: years[0],
        endYear: years[0]
      });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
    this.setState({
      loading: false
    });
  };

  calcAnnualLeaves = memoize(
    (
      startYear,
      startQuarter,
      endYear,
      endQuarter,
      allAnnualLeaveQuery = []
    ) => {
      return allAnnualLeaveQuery.filter(item => {
        return (
          item.year >= startYear &&
          item.quarter >= startQuarter &&
          item.year <= endYear &&
          item.quarter <= endQuarter
        );
      });
    }
  );

  handleDownloadExcel = async () => {
    var option = {};
    const { allAnnualLeaveQuery } = this.state;
    const exportData = allAnnualLeaveQuery.map(item => {
      return {
        year: item.year,
        quarter: item.quarter,
        hjky: item.hjky,
        synj: item.synj,
        ljsq: item.ljsq
      };
    });

    option.fileName = '年假账户明细';
    option.datas = [
      {
        sheetData: exportData,
        sheetName: '年假账户明细',
        sheetHeader: [
          '年份',
          '季度',
          '合计可用年假',
          '剩余可用年假',
          '累积使用'
        ]
      }
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  render() {
    const {
      selectedSubRecord,
      applyRecordsModalVisible,
      usesubTableModalVisible,
      selectedRecord,
      allAnnualLeaveQuery,
      years,
      startQuarter,
      startYear,
      endQuarter,
      endYear,
      subTableModalVisible,
      snsy,
      synj,
      djfp
    } = this.state;
    const { subResid, resid, baseURL } = this.props;
    const annualLeaves1 = this.calcAnnualLeaves(
      startYear,
      startQuarter,
      endYear,
      endQuarter,
      allAnnualLeaveQuery
    );
    const annualLeaves = annualLeaves1.map(item => {
      if (item.synj < 0) {
        item.synj = 0;
      }
      return item;
    });
    return (
      <div className="alq-summary">
        <Spin spinning={this.state.loading}>
          <div>
            <span>当季可用年假</span>
            <span>{djfp}天</span>
            <span>总结余</span>
            <span>{synj}天</span>
            <span>上年转结年假</span>
            <span>{snsy}天</span>
            <TreeSelect
              style={{ width: '250px' }}
              value={this.state.selectValue}
              dropdownStyle={{ overflow: 'auto' }}
              placeholder={
                JSON.parse(localStorage.getItem('userInfo')).EMP_NAME
              }
              treeData={this.state.treeData}
              onChange={value => {
                this.setState({ selectValue: value, loading: true });
                this.fetchAnnualLeavesCopy(value);
              }}
            ></TreeSelect>
            <p style={{ color: 'red' }}>每年7月1日会清空上年结转年假；</p>
          </div>
          <div className="collapseStyle">
            <Collapse
              bordered={false}
              style={{ background: '#f7f7f7', border: 0, overflow: 'hidden' }}
            >
              <Panel header="更多信息" key="1">
                <header className="alq-summary__header">
                  <div>
                    从
                    <Select
                      onChange={value => {
                        this.setState({
                          startYear: value
                        });
                      }}
                      value={startYear}
                      size="small"
                      style={styles.selectStyle}
                    >
                      {years.map(item => {
                        return <Option value={item}>{item}</Option>;
                      })}
                    </Select>
                    <Select
                      onChange={value => {
                        this.setState({
                          startQuarter: value
                        });
                      }}
                      value={startQuarter}
                      size="small"
                      style={styles.selectStyle}
                    >
                      {quarters.map(item => {
                        return <Option value={item.value}>{item.title}</Option>;
                      })}
                    </Select>
                    至
                    <Select
                      onChange={value => {
                        this.setState({
                          endYear: value
                        });
                      }}
                      value={endYear}
                      size="small"
                      style={styles.selectStyle}
                    >
                      {years.map(item => {
                        return <Option value={item}>{item}</Option>;
                      })}
                    </Select>
                    <Select
                      onChange={value => {
                        this.setState({
                          endQuarter: value
                        });
                      }}
                      value={endQuarter}
                      size="small"
                      style={styles.selectStyle}
                    >
                      {quarters.map(item => {
                        return <Option value={item.value}>{item.title}</Option>;
                      })}
                    </Select>
                    <Button
                      icon="download"
                      size="small"
                      onClick={() => {
                        // tableToExcel(
                        //   document.querySelector('.annual-leave .ant-table-body')
                        //     .innerHTML
                        // );
                        this.handleDownloadExcel();
                      }}
                    >
                      下载
                    </Button>
                  </div>
                  {/* <Icon
                  onClick={() => {
                    Modal.info({
                      title: '提示',
                      content:
                        '1.在每个季度（或者年）的第一天，上个季度（或者年）剩余的年假将会被结算至当前季度。'
                    });
                  }}
                  type="question-circle"
                  style={{ color: '#1890ff' }}
                /> */}
                </header>
                <div>
                  <Table
                    className="annual-leave"
                    columns={this.columns}
                    dataSource={annualLeaves}
                    bordered
                    size="small"
                    pagination={false}
                    // scroll={{ x: 'calc(700px + 50%)', y: 240 }}
                  />
                  <p style={{ marginTop: 16 }}>
                    <span style={{ fontWeight: 'bold' }}>说明：</span>
                    按季度划分后，每季度的年假明细作为一行数据。
                  </p>
                </div>
                <Modal
                  title="年假月度使用情况"
                  visible={usesubTableModalVisible}
                  footer={null}
                  width="80vw"
                  onCancel={() => {
                    this.setState({ usesubTableModalVisible: false });
                  }}
                >
                  <TableData
                    key={selectedRecord.REC_ID}
                    dataMode="sub"
                    resid={resid}
                    subresid={'662737017622'}
                    hostrecid={selectedRecord.REC_ID}
                    baseURL={baseURL}
                    subtractH={200}
                    hasAdd={false}
                    hasModify={false}
                    hasDelete={false}
                    hasRowEdit={false}
                    hasRowModify={false}
                    hasRowView={true}
                    hasRowDelete={false}
                    actionBarWidth={100}
                    height={500}
                    customRowBtns={[
                      (record, btnSize) => {
                        return (
                          <Button
                            onClick={() => {
                              this.setState({
                                selectedSubRecord: record,
                                applyRecordsModalVisible: true
                              });
                            }}
                            size={btnSize}
                          >
                            申请记录
                          </Button>
                        );
                      }
                    ]}
                  />
                </Modal>
                <Modal
                  title="申请记录"
                  visible={applyRecordsModalVisible}
                  footer={null}
                  width="70vw"
                  onCancel={() => {
                    this.setState({ applyRecordsModalVisible: false });
                  }}
                >
                  <TableData
                    key={selectedSubRecord.REC_ID}
                    dataMode="sub"
                    resid={resid}
                    subresid={'662737017622'}
                    hostrecid={selectedSubRecord.REC_ID}
                    baseURL={baseURL}
                    subtractH={200}
                    hasAdd={false}
                    hasModify={false}
                    hasDelete={false}
                    hasRowEdit={false}
                    hasRowModify={false}
                    hasRowView={true}
                    hasRowDelete={false}
                    actionBarWidth={100}
                    height={500}
                  />
                </Modal>
                <Modal
                  title="年假交易明细"
                  visible={subTableModalVisible}
                  footer={null}
                  width="80vw"
                  onCancel={() => {
                    this.setState({ subTableModalVisible: false });
                  }}
                >
                  <TableData
                    key={selectedRecord.REC_ID}
                    dataMode="sub"
                    resid={resid}
                    subresid={subResid}
                    hostrecid={selectedRecord.REC_ID}
                    baseURL={baseURL}
                    subtractH={200}
                    hasAdd={false}
                    hasModify={false}
                    hasDelete={false}
                    hasRowEdit={false}
                    hasRowModify={false}
                    hasRowView={true}
                    hasRowDelete={false}
                    actionBarWidth={100}
                    height={500}
                  />
                </Modal>
              </Panel>
            </Collapse>
          </div>
        </Spin>
      </div>
    );
  }
}

class CopySummary extends React.PureComponent {
  state = {
    allAnnualLeaveQuery: [], //全部年假数据
    years: [], //员工从入职到当前的年份
    startYear: undefined,
    startQuarter: 1,
    endYear: undefined,
    endQuarter: 4,
    subTableModalVisible: false,
    usesubTableModalVisible: false,
    applyRecordsModalVisible: false,
    selectedRecord: {},
    selectedSubRecord: {}
  };
  columns = [
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year'
      // width: 100,
    },
    {
      title: '季度',
      dataIndex: 'quarter',
      key: 'quarter'
      // width: 100,
    },
    // {
    //   title: '合计可用年假',
    //   dataIndex: 'hjky',
    //   key: 'hjky'
    //   // width: 120,
    // },
    // {
    //   title: '剩余可用年假',
    //   dataIndex: 'synj',
    //   key: 'synj'
    //   // width: 120,
    // },
    // {
    //   title: '累积使用',
    //   dataIndex: 'ljsq',
    //   key: 'ljsq'
    //   // width: 120,
    // },
    {
      title: '当季分配年假天数',
      children: [
        {
          title: '已用',
          dataIndex: 'sydjfp',
          key: 'sydjfp'
        },
        {
          title: '未用',
          dataIndex: 'djfp',
          key: 'djfp'
        },
        {
          title: '合计',
          dataIndex: 'djhj',
          key: 'djhj'
        }
      ]
    },
    {
      title: '往季分配年假天数',
      children: [
        {
          title: '已用',
          dataIndex: 'ljsysjsy',
          key: 'ljsysjsy'
        },
        {
          title: '未用',
          dataIndex: 'sjsy',
          key: 'sjsy'
        },
        {
          title: '合计',
          dataIndex: 'wjhj',
          key: 'wjhj'
        }
      ]
    },
    {
      title: '往年分配年假天数',
      children: [
        {
          title: '已用',
          dataIndex: 'ljsysnsy',
          key: 'ljsysnsy'
        },
        {
          title: '未用',
          dataIndex: 'snsy',
          key: 'snsy'
        },
        {
          title: '合计',
          dataIndex: 'wnhj',
          key: 'wnhj'
        }
      ]
    }
    // {
    //   title: '是否结算',
    //   dataIndex: 'SendBack',
    //   key: 'SendBack'
    //   // width: 100,
    // },
    // {
    //   title: '操作',
    //   key: 'action',
    //   render: (text, record) => (
    //     <>
    //       <span
    //         className="table-action--view"
    //         onClick={() => {
    //           this.setState({
    //             selectedRecord: record,
    //             usesubTableModalVisible: true
    //           });
    //         }}
    //       >
    //         使用明细
    //       </span>
    //       {/* <span
    //         className="table-action--view"
    //         onClick={() => {
    //           this.setState({
    //             selectedRecord: record,
    //             subTableModalVisible: true
    //           });
    //         }}
    //       >
    //         交易明细
    //       </span> */}
    //     </>
    //   )
    // }
  ];
  componentDidMount() {
    this.fetchAnnualLeaves();
  }
  fetchAnnualLeaves = async () => {
    const { resid, userCode, baseURL } = this.props;
    const numID = JSON.parse(localStorage.getItem('userInfo')).UserInfo.EMP_ID;
    const curYear = parseInt(moment().year());
    const curQuarter = parseInt(moment().quarter());

    let res1;
    try {
      res1 = await http({ baseURL }).getTable({
        resid: '662169383744',
        cmswhere: `NumberID = '${numID}' and Quarter = '${curYear}'`
      });
      this.setState({
        snsy: res1.data.length !== 0 ? res1.data[0].Residue : 0
      });
    } catch (error) {
      console.log(error.message);
      message.info(error.message);
    }
    let res;
    try {
      res = await http({ baseURL }).getTable({
        resid: '662169346288',
        cmswhere: `numberID = ${numID} and year = ${curYear}`
      });
      let synj1 = 0;
      let hjky = 0;
      res.data.map(item => {
        if (item.synj >= 0) {
          synj1 = item.synj + synj1;
        }
        if (item.quarter === curQuarter) {
          hjky = item.hjky;
        }
      });
      this.setState({
        synj: synj1,
        djfp: hjky
      });
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
    try {
      const res = await http({ baseURL }).getTable({
        resid,
        cmswhere: `numberID = '${userCode}'`
      });
      const yearSet = new Set();
      res.data.forEach(item => {
        item.sydjfp = item.sydjfp || 0;
        item.djhj = item.sydjfp + item.djfp; //当季合计

        item.ljsysjsy = item.ljsysjsy || 0;
        item.wjhj = item.ljsysjsy + item.sjsy; //往季合计

        item.ljsysnsy = item.ljsysnsy || 0;
        item.wnhj = item.ljsysnsy + item.snsy; //往年合计
        yearSet.add(item.year);
      });
      const years = [...yearSet];
      this.setState({
        allAnnualLeaveQuery: res.data,
        years,
        startYear: years[0],
        endYear: years[0]
      });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  calcAnnualLeaves = memoize(
    (
      startYear,
      startQuarter,
      endYear,
      endQuarter,
      allAnnualLeaveQuery = []
    ) => {
      return allAnnualLeaveQuery.filter(item => {
        return (
          item.year >= startYear &&
          item.quarter >= startQuarter &&
          item.year <= endYear &&
          item.quarter <= endQuarter
        );
      });
    }
  );

  handleDownloadExcel = async () => {
    var option = {};
    const { allAnnualLeaveQuery } = this.state;
    const exportData = allAnnualLeaveQuery.map(item => {
      return {
        year: item.year,
        quarter: item.quarter,
        sydjfp: item.sydjfp,
        djfp: item.djfp,
        djhj: item.djhj, //当季合计
        ljsysjsy: item.ljsysjsy,
        sjsy: item.sjsy,
        wjhj: item.wjhj, //往季合计
        ljsysnsy: item.ljsysnsy,
        snsy: item.snsy,
        wnhj: item.wnhj //往年合计
      };
    });

    option.fileName = '年假季度结算';
    option.datas = [
      {
        sheetData: exportData,
        sheetName: '年假季度结算',
        sheetHeader: [
          '年份',
          '季度',
          '当季-已用',
          '当季-未用',
          '当季-合计',
          '往季-已用',
          '往季-未用',
          '往季-合计',
          '往年-已用',
          '往年-未用',
          '往年-合计'
        ]
      }
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  render() {
    const {
      selectedSubRecord,
      applyRecordsModalVisible,
      usesubTableModalVisible,
      selectedRecord,
      allAnnualLeaveQuery,
      years,
      startQuarter,
      startYear,
      endQuarter,
      endYear,
      subTableModalVisible,
      snsy,
      synj,
      djfp
    } = this.state;
    const { subResid, resid, baseURL } = this.props;
    const annualLeaves = this.calcAnnualLeaves(
      startYear,
      startQuarter,
      endYear,
      endQuarter,
      allAnnualLeaveQuery
    );
    return (
      <div className="alq-summary">
        {/* <div>
          <span>当季可用年假</span>
          <span>{djfp}天</span>
          <span>总结余</span>
          <span>{synj}天</span>
          <span>上年转结年假</span>
          <span>{snsy}天</span>
        </div> */}
        <div className="collapseStyle">
          {/* <Collapse
            bordered={false}
            style={{ background: '#f7f7f7', border: 0, overflow: 'hidden' }}
          >
            <Panel header="更多信息" key="1"> */}
          <header className="alq-summary__header">
            <div>
              从
              <Select
                onChange={value => {
                  this.setState({
                    startYear: value
                  });
                }}
                value={startYear}
                size="small"
                style={styles.selectStyle}
              >
                {years.map(item => {
                  return <Option value={item}>{item}</Option>;
                })}
              </Select>
              <Select
                onChange={value => {
                  this.setState({
                    startQuarter: value
                  });
                }}
                value={startQuarter}
                size="small"
                style={styles.selectStyle}
              >
                {quarters.map(item => {
                  return <Option value={item.value}>{item.title}</Option>;
                })}
              </Select>
              至
              <Select
                onChange={value => {
                  this.setState({
                    endYear: value
                  });
                }}
                value={endYear}
                size="small"
                style={styles.selectStyle}
              >
                {years.map(item => {
                  return <Option value={item}>{item}</Option>;
                })}
              </Select>
              <Select
                onChange={value => {
                  this.setState({
                    endQuarter: value
                  });
                }}
                value={endQuarter}
                size="small"
                style={styles.selectStyle}
              >
                {quarters.map(item => {
                  return <Option value={item.value}>{item.title}</Option>;
                })}
              </Select>
              <Button
                icon="download"
                size="small"
                onClick={() => {
                  // tableToExcel(
                  //   document.querySelector('.annual-leave .ant-table-body')
                  //     .innerHTML
                  // );
                  this.handleDownloadExcel();
                }}
              >
                下载
              </Button>
            </div>
            <Icon
              onClick={() => {
                Modal.info({
                  title: '提示',
                  content:
                    '1.在每个季度（或者年）的第一天，上个季度（或者年）剩余的年假将会被结算至当前季度。'
                });
              }}
              type="question-circle"
              style={{ color: '#1890ff' }}
            />
          </header>
          <div>
            <Table
              className="annual-leave"
              columns={this.columns}
              dataSource={annualLeaves}
              bordered
              size="small"
              pagination={false}
              // scroll={{ x: 'calc(700px + 50%)', y: 240 }}
            />
            <p style={{ marginTop: 16 }}>本表数据每季度刷新一次</p>
            <p>
              <span style={{ fontWeight: 'bold' }}>当季分配</span>
              是指每年按季初始分配的年假；
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>往季分配</span>
              是指之前所有季度未使用完的结余年假；
            </p>
            <p>
              <span style={{ fontWeight: 'bold' }}>往年分配</span>
              是指去年结余的年假；
            </p>
          </div>
          <Modal
            title="年假月度使用情况"
            visible={usesubTableModalVisible}
            footer={null}
            width="80vw"
            onCancel={() => {
              this.setState({ usesubTableModalVisible: false });
            }}
          >
            <TableData
              key={selectedRecord.REC_ID}
              dataMode="sub"
              resid={resid}
              subresid={'662737017622'}
              hostrecid={selectedRecord.REC_ID}
              baseURL={baseURL}
              subtractH={200}
              hasAdd={false}
              hasModify={false}
              hasDelete={false}
              hasRowEdit={false}
              hasRowModify={false}
              hasRowView={true}
              hasRowDelete={false}
              actionBarWidth={100}
              height={500}
              customRowBtns={[
                (record, btnSize) => {
                  return (
                    <Button
                      onClick={() => {
                        this.setState({
                          selectedSubRecord: record,
                          applyRecordsModalVisible: true
                        });
                      }}
                      size={btnSize}
                    >
                      申请记录
                    </Button>
                  );
                }
              ]}
            />
          </Modal>
          <Modal
            title="申请记录"
            visible={applyRecordsModalVisible}
            footer={null}
            width="70vw"
            onCancel={() => {
              this.setState({ applyRecordsModalVisible: false });
            }}
          >
            <TableData
              key={selectedSubRecord.REC_ID}
              dataMode="sub"
              resid={resid}
              subresid={'662737017622'}
              hostrecid={selectedSubRecord.REC_ID}
              baseURL={baseURL}
              subtractH={200}
              hasAdd={false}
              hasModify={false}
              hasDelete={false}
              hasRowEdit={false}
              hasRowModify={false}
              hasRowView={true}
              hasRowDelete={false}
              actionBarWidth={100}
              height={500}
            />
          </Modal>
          <Modal
            title="年假交易明细"
            visible={subTableModalVisible}
            footer={null}
            width="80vw"
            onCancel={() => {
              this.setState({ subTableModalVisible: false });
            }}
          >
            <TableData
              key={selectedRecord.REC_ID}
              dataMode="sub"
              resid={resid}
              subresid={subResid}
              hostrecid={selectedRecord.REC_ID}
              baseURL={baseURL}
              subtractH={200}
              hasAdd={false}
              hasModify={false}
              hasDelete={false}
              hasRowEdit={false}
              hasRowModify={false}
              hasRowView={true}
              hasRowDelete={false}
              actionBarWidth={100}
              height={500}
            />
          </Modal>
          {/* </Panel>
          </Collapse> */}
        </div>
      </div>
    );
  }
}

class Detail extends React.PureComponent {
  state = {
    startDate: '',
    endDate: '',
    cmswhere: ''
  };
  render() {
    const { resid, baseURL, userCode } = this.props;
    const { cmswhere } = this.state;
    return (
      <div className="alq-detail">
        <div className="alq-detail__header">
          假期开始时间的范围:
          <RangePicker
            style={{ marginLeft: 8 }}
            size="small"
            onChange={(dates, dateString) => {
              console.log(dates, dateString);
              let cmswhere = this.state.cmswhere;
              if (dateString[0] && dateString[1]) {
                cmswhere = ` and startBreak >= '${
                  dateString[0]
                }' and startBreak <= '${dateString[1]}'`;
              } else {
                cmswhere = '';
              }
              this.setState({
                cmswhere
              });
            }}
          ></RangePicker>
        </div>
        <div>
          <TableData
            resid={resid}
            baseURL={baseURL}
            subtractH={200}
            hasAdd={false}
            hasModify={false}
            hasDelete={false}
            hasRowEdit={false}
            hasRowModify={false}
            hasRowView={true}
            hasRowDelete={false}
            actionBarWidth={100}
            height={500}
            cmswhere={`numberID = '${userCode}' ${cmswhere}`}
          />
        </div>
      </div>
    );
  }
}
