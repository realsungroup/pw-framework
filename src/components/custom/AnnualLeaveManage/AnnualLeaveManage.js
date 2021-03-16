import React from 'react';
import {
  Pagination,
  Tabs,
  Menu,
  Select,
  Button,
  Radio,
  Spin,
  Modal,
  Icon,
  message,
  Input,
  Table
} from 'antd';
import './AnnualLeaveManage.less';
import TableData from 'Common/data/TableData';
import SelectPersonnel from 'Common/data/SelectPersonnel';
import debounce from 'lodash/debounce';
import http from 'Util20/api';
import SelectPersonSecond from '../SelectPersonSecond';
import moment from 'moment';
import { reject } from 'lodash';
import { TabStop } from 'docx';
import { constants } from 'os';
// import { SubMenu, MenuItem } from 'react-contextmenu';
const { TabPane } = Tabs;
const { Option } = Select;
const { SubMenu } = Menu;
const NJGLColums = [
  {
    title: '工号',
    dataIndex: 'number',
    key: 'number'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '上年剩余',
    dataIndex: 'snsy',
    key: 'snsy'
  },
  {
    title: '当年新增',
    dataIndex: 'dnxz',
    key: 'dnxz'
  },
  {
    title: '第1季度分配',
    dataIndex: 'q1fenpei',
    key: 'q1fenpei'
  },
  {
    title: '第2季度分配',
    dataIndex: 'q2fenpei',
    key: 'q2fenpei'
  },
  {
    title: '第3季度分配',
    dataIndex: 'q3fenpei',
    key: 'q3fenpei'
  },
  {
    title: '第4季度分配',
    dataIndex: 'q4fenpei',
    key: 'q4fenpei'
  },
  {
    title: '1月使用',
    dataIndex: 'january',
    key: 'january'
  },
  {
    title: '2月使用',
    dataIndex: 'february',
    key: 'february'
  },
  {
    title: '3月使用',
    dataIndex: 'march',
    key: 'march'
  },
  {
    title: '4月使用',
    dataIndex: 'april',
    key: 'april'
  },
  {
    title: '5月使用',
    dataIndex: 'may',
    key: 'may'
  },
  {
    title: '6月使用',
    dataIndex: 'june',
    key: 'june'
  },
  {
    title: '7月使用',
    dataIndex: 'july',
    key: 'july'
  },
  {
    title: '8月使用',
    dataIndex: 'august',
    key: 'august'
  },
  {
    title: '9月使用',
    dataIndex: 'september',
    key: 'september'
  },
  {
    title: '10月使用',
    dataIndex: 'october',
    key: 'october'
  },
  {
    title: '11月使用',
    dataIndex: 'november',
    key: 'november'
  },
  ,
  {
    title: '12月使用',
    dataIndex: 'december',
    key: 'december'
  },
  {
    title: '第1季度剩余',
    dataIndex: 'q1sy',
    key: 'q1sy'
  },
  {
    title: '第2季度剩余',
    dataIndex: 'q2sy',
    key: 'q2sy'
  },
  {
    title: '第3季度剩余',
    dataIndex: 'q3sy',
    key: 'q3sy'
  },
  {
    title: '第4季度剩余',
    dataIndex: 'q4sy',
    key: 'q4sy'
  },
  {
    title: '上年结余',
    dataIndex: 'snjy',
    key: 'snjy'
  },
  {
    title: '当年结余',
    dataIndex: 'dnjy',
    key: 'dnjy'
  },
  {
    title: '总结余',
    dataIndex: 'zjy',
    key: 'zjy'
  }
];
const months = [
  { label: 1, value: '01' },
  { label: 2, value: '02' },
  { label: 3, value: '03' },
  { label: 4, value: '04' },
  { label: 5, value: '05' },
  { label: 6, value: '06' },
  { label: 7, value: '07' },
  { label: 8, value: '08' },
  { label: 9, value: '09' },
  { label: 10, value: '10' },
  { label: 11, value: '11' },
  { label: 12, value: '12' }
];
const quarters = [
  { title: '第1季度', value: 1 },
  { title: '第2季度', value: 2 },
  { title: '第3季度', value: 3 },
  { title: '第4季度', value: 4 }
];
const years = [
  { title: '2021', value: 2021 },
  { title: '2022', value: 2022 },
  { title: '2023', value: 2023 }
];

const curMonth = moment().format('MM');
const curYear = moment().format('YYYY');
const curQuarter = moment().quarter();
// const years = [2021];
const styles = {
  selectStyle: {
    width: 120,
    margin: '0 4px'
  },
  nianJiaChaXun: { height: '100%', display: 'flex', flexDirection: 'column' },
  tableDataContainer: { flex: 1, overflow: 'hidden' },
  header: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px'
  }
};

class AnnualLeaveManage extends React.Component {
  menus = [
    {
      title: '年初创建',
      tip:
        '每年年初，系统会将今年的年假平均分配给四个季度。前三个季度会根据平均分配值向上进0.5（例：1.3变成1.5;1.6变成2），第四季度分配到的年假数量等同于总年假数量扣除前三个季度进0.5的年假数量之和后的数值。',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <NianChuChuangJian
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '系统上年结转',
      tip:
        '每年年末将当年剩余年假转出，移入下一年。每年系统将会把上年剩余的年假转入当年',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <ShangNianJieZhuan
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '入职分配',
      tip:
        '员工入职时分配的年假，其数值等同于当年员工剩余服务天数除以365乘以对应社会工龄应得年假后取整的值。',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <RuZhiFenPei
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '季度结转',
      tip:
        '季度转入是由上季度转入的可用年假。季度转出是将季度的可用年假全部转到下个季度。',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <JiDuJieSuan
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '上年年假结转清零',
      tip: '每年7月1日，系统将会清空上年未使用的年假。',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <ShengYuQingLing
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '社保新增月份',
      tip:
        '当2021年后入职的员工的社会工龄发生了变化导致可用年假数量增加的场合，系统会将这些年假平均分配给当年剩余季度。除最后一个季度外，所有季度实际分配到的年假数量是平均数进0.5（例：1.3变成1.5，1.6变成2）。最后一个季度分配到的年假数量等同于新增年假数量扣除自己以外应当分配剩余年假的季度所实际分配到的年假数量之和后的数值。',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <YueDuXinZeng
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    // {
    //   title: '季度使用',
    //   tip: '季度使用提示',
    //   render: () => {
    //     const { baseURL,baseURLFromAppConfig } = this.props;
    //     return (
    //       <YueDuShiYong
    //         baseURL={baseURL}
    // baseURLFromAppConfig={baseURLFromAppConfig}
    //         onOpenSelectPerson={this.handleOpenSelectPerson}
    //       />
    //     );
    //   }
    // },
    {
      title: '年假使用调整',
      tip: '管理员根据实际情况增加或扣除了年假使用信息。',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <NianJiaShiYong
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '调整季度剩余',
      tip: '管理员根据实际情况增加或扣除了上年剩余年假。',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <JiDuFenPei
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '调整上年剩余',
      tip: '管理员根据实际情况增加或扣除了上年剩余年假。',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <ShangNianShengYu
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '年假查询',
      tip: '查询年假具体信息',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <NianJiaChaXun
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
          />
        );
      }
    },
    {
      title: '老员工社保信息查询',
      tip: '老员工社保信息查询提示',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <LaoYuanGongSheBao
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '新员工社保信息维护',
      tip: '新员工社保信息维护提示',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <XinYuanGongSheBao
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '年假每月使用明细',
      tip: '考勤月度结算提示',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <KaoQinYueDuJieSuan
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
          />
        );
      }
    },
    {
      title: '季度结算报错信息',
      tip: '季度结算报错信息提示',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <JiDuJieSuanBaoCuo
            baseURL={baseURL}
            baseURLFromAppConfig={baseURLFromAppConfig}
          />
        );
      }
    },
    {
      title: '年假台账管理',
      tip: '年假台账管理',
      render: () => {
        const { baseURL, baseURLFromAppConfig } = this.props;
        return (
          <NianJiaGaiLan
            baseURL={baseURL}
            resid="668272811088"
            baseURLFromAppConfig={baseURLFromAppConfig}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    }
  ];
  state = {
    selectedKeys: [this.menus[14].title],
    selectedMenu: this.menus[14],
    selectPersonVisible: false,
    spinning: false,
    persons: [],
    numList: [],
    selectQuarterModal: false,
    jiesuanQuarter: curQuarter,
    refreshCallback: () => {}
  };
  handleOpenSelectPerson = callback => {
    this.setState({ selectPersonVisible: true, refreshCallback: callback });
  };
  handleSelectPerson = personList => {
    //获取工号，API传入工号数组，批量添加
    const numList = personList.map(item => {
      return item.C3_227192472953;
    });
    this.setState({ numList: numList, persons: personList });
  };

  /**
   * 季度结算
   */
  handleJiDuJieSuan = () => {
    const { baseURLAPI } = this.props;
    const { jiesuanQuarter, numList, refreshCallback } = this.state;
    numList.map(item => {
      const url = `${baseURLAPI}/api/QuarterSmeettlent/settlement?numberID=${item}&year=${curYear}&quarter=${jiesuanQuarter}`;
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(res => {
          if (res.error === 0) {
            console.log(res);
            message.info('操作成功');
          } else {
            message.info(res.message);
          }
        })
        .catch(error => {
          console.log(error);
          message.info(error.message);
        });
    });
    setTimeout(() => {
      this.setState({ spinning: false });
      refreshCallback && refreshCallback();
    }, 2000);
  };
  /**
   *根据交易类型不同调用API
   */
  handleComplete = () => {
    const { baseURLAPI } = this.props;
    const { refreshCallback, selectedKeys, numList } = this.state;
    this.setState({ selectPersonVisible: false, spinning: true });
    if (selectedKeys[0] === '入职分配') {
      numList.map(item => {
        const url = `${baseURLAPI}/api/EntryAssignment/assignment?numberID=${item}`;
        fetch(url)
          .then(response => {
            return response.json();
          })
          .then(res => {
            if (res.error === 0) {
              console.log(res);
              message.info('操作成功');
            } else {
              message.info(res.message);
            }
          })
          .catch(error => {
            console.log(error);
            message.info(error.message);
          });
      });
    }
    if (selectedKeys[0] === '季度结转') {
      this.setState({
        selectQuarterModal: true
      });
    }
    if (selectedKeys[0] === '年初创建') {
      numList.map(item => {
        const url = `${baseURLAPI}/api/CreatYearBeginningAndIntoYearLeft?year=${curYear}&numberIDs=${item}`;
        fetch(url)
          .then(response => {
            console.log(typeof response);
            return response.json();
          })
          .then(res => {
            if (res.error === 0) {
              console.log(res);
              message.info('操作成功');
            } else {
              message.info(res.message);
            }
          })
          .catch(error => {
            console.log(error);
            message.info(error.message);
          });
      });
    }
    if (selectedKeys[0] === '上年年假结转清零') {
      numList.map(item => {
        const url = `${baseURLAPI}/api/AnnualLeaveResidueReset?year=${curYear}&numberIDs=${item}`;
        fetch(url)
          .then(response => {
            return response.json();
            // return response;
          })
          .then(res => {
            if (res.error === 0) {
              console.log(res);
            } else {
              message.info(res.message);
            }
          })
          .catch(error => {
            console.log(error);
            message.info(error.message);
          });
      });
    }
    setTimeout(() => {
      this.setState({ spinning: false });
      refreshCallback && refreshCallback();
    }, 2000);
  };
  render() {
    const {
      selectedKeys,
      selectedMenu,
      selectPersonVisible,
      spinning
    } = this.state;
    return (
      <Spin spinning={spinning}>
        <div className="page-annualLeaveManage">
          <Menu
            onClick={this.handleClick}
            className="annual-leave-manage__menu"
            selectedKeys={selectedKeys}
            mode="inline"
            onSelect={({ selectedKeys }) => {
              this.setState({
                selectedKeys,
                selectedMenu: this.menus.find(
                  item => item.title === selectedKeys[0]
                )
              });
            }}
          >
            <Menu.Item key="年假台账管理">
              <div className="menu-item__body">年假台账管理</div>
            </Menu.Item>
            <SubMenu key="submenu1" title="交易明细">
              <SubMenu key="submenu2" title="系统行为">
                {this.menus.map((menu, index) => {
                  if (index < 6) {
                    return (
                      <Menu.Item key={menu.title}>
                        <div className="menu-item__body">
                          {menu.title}
                          {selectedKeys[0] === menu.title && (
                            <span
                              onClick={() => {
                                Modal.info({
                                  title: '提示',
                                  content: menu.tip
                                });
                              }}
                              className="menu-item-tip-container"
                            >
                              <Icon
                                style={{ color: '#faad14', margin: 0 }}
                                type="info-circle"
                                theme="filled"
                              />
                            </span>
                          )}
                        </div>
                      </Menu.Item>
                    );
                  }
                })}
              </SubMenu>
              <SubMenu key="submenu3" title="日常维护">
                {this.menus.map((menu, index) => {
                  if (index >= 6 && index < 9) {
                    return (
                      <Menu.Item key={menu.title}>
                        <div className="menu-item__body">
                          {menu.title}
                          {selectedKeys[0] === menu.title && (
                            <span
                              onClick={() => {
                                Modal.info({
                                  title: '提示',
                                  content: menu.tip
                                });
                              }}
                              className="menu-item-tip-container"
                            >
                              <Icon
                                style={{ color: '#faad14', margin: 0 }}
                                type="info-circle"
                                theme="filled"
                              />
                            </span>
                          )}
                        </div>
                      </Menu.Item>
                    );
                  }
                })}
              </SubMenu>
            </SubMenu>
            {this.menus.map((menu, index) => {
              if (index >= 9) {
                return menu.title === '年假台账管理' ? null : (
                  <Menu.Item key={menu.title}>
                    <div className="menu-item__body">
                      {menu.title}
                      {/* {selectedKeys[0] === menu.title && (
                      <span
                        onClick={() => {
                          Modal.info({
                            title: '提示',
                            content: menu.tip
                          });
                        }}
                        className="menu-item-tip-container"
                      ></span>
                    )} */}
                    </div>
                  </Menu.Item>
                );
              }
            })}
          </Menu>
          <div className="annual-leave-manage__content">
            {selectedMenu.render()}
          </div>
          <Modal
            title="选择季度"
            visible={this.state.selectQuarterModal}
            onCancel={() => {
              this.setState({
                selectQuarterModal: false,
                spinning: false
              });
            }}
            onOk={() => {
              this.handleJiDuJieSuan();
              this.setState({
                selectQuarterModal: false
              });
            }}
          >
            <Select
              onChange={v => {
                this.setState({
                  jiesuanQuarter: v
                });
              }}
              value={this.state.jiesuanQuarter}
              size="small"
              style={{ width: 120 }}
            >
              {quarters.map(quarter => {
                return (
                  <Select.Option value={quarter.value}>
                    {quarter.title}
                  </Select.Option>
                );
              })}
            </Select>
          </Modal>
          <Modal
            destroyOnClose
            onCancel={() => {
              this.setState({ selectPersonVisible: false });
            }}
            width="80vw"
            visible={selectPersonVisible}
            footer={null}
          >
            <div style={{ height: 600 }}>
              <SelectPersonnel
                radioGroupConfig={[
                  {
                    type: 'list',
                    title: '按级别添加',
                    resid: 449335746776,
                    nameField: 'C3_587136281870'
                  },
                  {
                    type: 'tree',
                    title: '按部门添加',
                    resid: 466282405067,
                    nameField: 'DEP_NAME',
                    idField: 'DEP_ID',
                    pidField: 'DEP_PID'
                  },
                  {
                    type: 'search',
                    title: '输入关键词搜索'
                  },
                  {
                    type: 'file',
                    title: '请选择要上传的文件'
                  }
                ]}
                subResid={609599795438}
                secondFilterInputPlaceholder="输入关键词搜索"
                personFields={[
                  '',
                  'C3_227192472953',
                  'C3_227192484125',
                  'C3_227212499515'
                ]}
                personPrimaryKeyField="C3_227192472953"
                stepList={[
                  {
                    stepTitle: '确认',
                    renderContent: current => {
                      return (
                        <SelectPersonSecond
                          persons={this.state.persons}
                          onCheckboxChange={this.handleCheckboxChange}
                        />
                      );
                    }
                  }
                ]}
                completeText="完成"
                onSelectPerson={this.handleSelectPerson}
                onComplete={this.handleComplete}
              />
            </div>
          </Modal>
        </div>
      </Spin>
    );
  }
}

class NianChuChuangJian extends React.PureComponent {
  state = {
    selectedCalculationRule: 'old',
    cms: `joinDate <= '2020-12-31' and Year = ${curYear} and Type = '年初创建'`,
    selectedYear: curYear
  };
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    const { selectedCalculationRule, cms, selectedYear } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          添加人员
        </Button>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>财年：</span>
          <Select
            size="small"
            style={{ width: 120 }}
            value={selectedYear}
            onChange={v => {
              this.setState({
                selectedYear: v
              });
              if (selectedCalculationRule === 'old') {
                this.setState({
                  cms: `joinDate <= '2020-12-31' and Year = ${v} and Type = '年初创建'`
                });
              } else {
                this.setState({
                  cms: `joinDate > '2020-12-31' and Year = ${v} and Type = '年初创建'`
                });
              }
            }}
          >
            {years.map(year => {
              return (
                <Select.Option value={year.value}>{year.title}</Select.Option>
              );
            })}
          </Select>
        </div>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>年假计算规则：</span>
          <Select
            value={selectedCalculationRule}
            onChange={v => {
              this.setState({ selectedCalculationRule: v });
              if (v === 'old') {
                this.setState({
                  cms: `joinDate <= '2020-12-31' and Year = ${selectedYear} and Type = '年初创建'`
                });
              } else {
                this.setState({
                  cms: `joinDate > '2020-12-31' and Year = ${selectedYear} and Type = '年初创建'`
                });
              }
            }}
            size="small"
            style={{ width: 120 }}
          >
            <Select.Option value="old">老员工</Select.Option>
            <Select.Option value="new">新员工</Select.Option>
          </Select>
        </div>
      </div>
    );
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    const { cms } = this.state;
    console.table({ cms });
    return (
      <TableData
        key="NianChuChuangJian"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={662169358054}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={false}
        hasModify={false}
        hasDelete={false}
        hasRowEdit={false}
        hasRowModify={false}
        hasRowView={true}
        hasRowDelete={false}
        actionBarWidth={100}
        actionBarExtra={this.actionBarExtra}
        cmswhere={cms}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}
class ShangNianJieZhuan extends React.PureComponent {
  state = {
    cms: `Year = ${curYear} and Type = '上年转入' or Type = '当年转出'`,
    selectedYear: curYear
  };
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    const { selectedYear } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>财年：</span>
          <Select
            size="small"
            style={{ width: 120 }}
            value={selectedYear}
            onChange={v => {
              this.setState({
                selectedYear: v,
                cms: `Year = ${v} and Type = '上年转入' or Type = '当年转出'`
              });
            }}
          >
            {years.map(year => {
              return (
                <Select.Option value={year.value}>{year.title}</Select.Option>
              );
            })}
          </Select>
        </div>
        {/* <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          添加人员
        </Button> */}
      </div>
    );
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    const { cms } = this.state;
    return (
      <TableData
        key="shangNianJieZhuan"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={662169358054}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={false}
        hasModify={false}
        hasDelete={false}
        hasRowEdit={false}
        hasRowModify={false}
        hasRowView={true}
        hasRowDelete={false}
        actionBarWidth={100}
        actionBarExtra={this.actionBarExtra}
        cmswhere={cms}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}

class YueDuXinZeng extends React.PureComponent {
  state = {
    selectedYear: curYear,
    selectedQuarter: moment().quarter(),
    cms: `Type = '月度新增' and Year = '${curYear}' and Quarter = '${curQuarter}'`
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    const { selectedQuarter, selectedYear } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>财年：</span>
          <Select
            size="small"
            style={{ width: 120 }}
            value={selectedYear}
            onChange={v => {
              this.setState({
                selectedYear: v,
                cms: `Type = '月度新增' and Year = '${v}' and Quarter = '${selectedQuarter}'`
              });
            }}
          >
            {years.map(year => {
              return (
                <Select.Option value={year.value}>{year.title}</Select.Option>
              );
            })}
          </Select>
        </div>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>季度：</span>
          <Select
            onChange={v => {
              this.setState({
                selectedQuarter: v,
                cms: `Year = '${selectedYear}' and Quarter = '${v}' and Type = '月度新增'`
              });
            }}
            value={selectedQuarter}
            size="small"
            style={{ width: 120 }}
          >
            {quarters.map(quarter => {
              return (
                <Select.Option value={quarter.value}>
                  {quarter.title}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        {/* <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          添加人员
        </Button> */}
      </div>
    );
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    const { cms } = this.state;
    console.log(cms);
    return (
      <TableData
        key="YueDuXinZeng"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={662169358054}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={false}
        hasModify={false}
        hasDelete={false}
        hasRowEdit={false}
        hasRowModify={false}
        hasRowView={true}
        hasRowDelete={false}
        actionBarWidth={100}
        actionBarExtra={this.actionBarExtra}
        cmswhere={cms}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}

class YueDuShiYong extends React.PureComponent {
  state = {
    selectedYear: curYear,
    selectedQuarter: moment().quarter(),
    cms: `Year = '${curYear}' and Quarter = '${curQuarter}' and Type = '季度使用'`
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    const { selectedQuarter, selectedYear } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>财年：</span>
          <Select
            size="small"
            style={{ width: 120 }}
            value={selectedYear}
            onChange={v => {
              this.setState({
                selectedYear: v,
                cms: `Year = '${v}' and Quarter = '${selectedQuarter}' and Type = '季度使用'`
              });
            }}
          >
            {years.map(year => {
              return (
                <Select.Option value={year.value}>{year.title}</Select.Option>
              );
            })}
          </Select>
        </div>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>季度：</span>
          <Select
            onChange={v => {
              this.setState({
                selectedQuarter: v,
                cms: `Year = '${selectedYear}' and Quarter = '${v}' and Type = '季度使用'`
              });
            }}
            value={selectedQuarter}
            size="small"
            style={{ width: 120 }}
          >
            {quarters.map(quarter => {
              return (
                <Select.Option value={quarter.value}>
                  {quarter.title}
                </Select.Option>
              );
            })}
          </Select>
        </div>
        {/* <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          添加人员
        </Button> */}
      </div>
    );
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    const { cms } = this.state;
    console.log(cms);
    return (
      <TableData
        key="YueDuShiYong"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={662169358054}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={true}
        hasModify={false}
        hasDelete={false}
        hasRowEdit={false}
        hasRowModify={false}
        hasRowView={true}
        hasRowDelete={false}
        actionBarWidth={100}
        actionBarExtra={this.actionBarExtra}
        cmswhere={cms}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}

class JiDuJieSuan extends React.PureComponent {
  state = {
    selectedYear: curYear,
    selectedQuarter: moment().quarter(),
    cms: `Year = '${curYear}' and Quarter = '${curQuarter}' and (Type = '季度转入' or Type = '季度转出')`
  };
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    const { selectedQuarter, selectedYear } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          添加人员
        </Button>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>财年：</span>
          <Select
            size="small"
            style={{ width: 120 }}
            value={selectedYear}
            onChange={v => {
              this.setState({
                selectedYear: v,
                cms: `Year = '${v}' and Quarter = '${curQuarter}' and (Type = '季度转入' or Type = '季度转出')`
              });
            }}
          >
            {years.map(year => {
              return (
                <Select.Option value={year.value}>{year.title}</Select.Option>
              );
            })}
          </Select>
        </div>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>季度：</span>
          <Select
            value={selectedQuarter}
            onChange={v => {
              this.setState({
                selectedQuarter: v,
                cms: `Year = '${curYear}' and Quarter = '${v}' and (Type = '季度转入' or Type = '季度转出')`
              });
            }}
            size="small"
            style={{ width: 120 }}
          >
            {quarters.map(item => {
              return <Option value={item.value}>{item.title}</Option>;
            })}
          </Select>
        </div>
      </div>
    );
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    const { cms } = this.state;
    console.log({ cms });
    return (
      <TableData
        key="JiDuJieSuan"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={662169358054}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={false}
        hasModify={false}
        hasDelete={false}
        hasRowEdit={false}
        hasRowModify={false}
        hasRowView={true}
        hasRowDelete={false}
        actionBarWidth={100}
        actionBarExtra={this.actionBarExtra}
        cmswhere={cms}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}
class RuZhiFenPei extends React.PureComponent {
  state = {
    cms: `Type = '入职分配'`
  };
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    return (
      <div style={{ display: 'flex' }}>
        <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          添加人员
        </Button>
      </div>
    );
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    const { cms } = this.state;
    console.log({ cms });
    return (
      <TableData
        key="RuZhiFenPei"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={662169358054}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={false}
        hasModify={false}
        hasDelete={false}
        hasRowEdit={false}
        hasRowModify={false}
        hasRowView={true}
        hasRowDelete={false}
        actionBarWidth={100}
        actionBarExtra={this.actionBarExtra}
        cmswhere={cms}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}

class NianJiaShiYong extends React.PureComponent {
  state = {
    selectedYear: curYear,
    selectedQuarter: curQuarter,
    cms: `year = '${curYear}' and quarter = '${curQuarter}'`
  };
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    const { selectedQuarter, selectedYear } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>财年：</span>
          <Select
            size="small"
            style={{ width: 120 }}
            value={selectedYear}
            onChange={v => {
              this.setState({
                selectedYear: v,
                cms: `year = '${v}' and quarter = '${selectedQuarter}'`
              });
            }}
          >
            {years.map(year => {
              return (
                <Select.Option value={year.value}>{year.title}</Select.Option>
              );
            })}
          </Select>
        </div>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>季度：</span>
          <Select
            value={selectedQuarter}
            onChange={v => {
              this.setState({
                selectedQuarter: v,
                cms: `year = '${selectedYear}' and quarter = '${v}'`
              });
            }}
            size="small"
            style={{ width: 120 }}
          >
            {quarters.map(item => {
              return <Option value={item.value}>{item.title}</Option>;
            })}
          </Select>
        </div>
        {/* <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          添加人员
        </Button> */}
      </div>
    );
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    const { cms } = this.state;
    console.log({ cms });
    return (
      <TableData
        key="NianJiaShiYong"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={666181543960}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={true}
        hasModify={false}
        hasDelete={false}
        hasRowEdit={false}
        hasRowModify={true}
        hasRowView={true}
        hasRowDelete={false}
        actionBarWidth={100}
        actionBarExtra={this.actionBarExtra}
        cmswhere={cms}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}

class JiDuFenPei extends React.PureComponent {
  state = {
    selectedYear: curYear,
    selectedQuarter: curQuarter,
    cms: `C3_663257630622 = ${curYear} and C3_663257633669 = ${curQuarter}`
  };
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    const { selectedQuarter, selectedYear } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>财年：</span>
          <Select
            size="small"
            style={{ width: 120 }}
            value={selectedYear}
            onChange={v => {
              this.setState({
                selectedYear: v,
                cms: `C3_663257630622 = ${v} and C3_663257633669 = ${selectedQuarter}`
              });
            }}
          >
            {years.map(year => {
              return (
                <Select.Option value={year.value}>{year.title}</Select.Option>
              );
            })}
          </Select>
        </div>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>季度：</span>
          <Select
            value={selectedQuarter}
            onChange={v => {
              this.setState({
                selectedQuarter: v,
                cms: `C3_663257630622 = ${selectedYear} and C3_663257633669 = ${v}`
              });
            }}
            size="small"
            style={{ width: 120 }}
          >
            {quarters.map(item => {
              return <Option value={item.value}>{item.title}</Option>;
            })}
          </Select>
        </div>
        {/* <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          添加人员
        </Button> */}
      </div>
    );
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    const { cms } = this.state;
    console.log({ cms });
    return (
      <TableData
        key="JiDuFenPei"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={663257512519}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={true}
        hasModify={false}
        hasDelete={false}
        hasRowEdit={false}
        hasRowModify={false}
        hasRowView={true}
        hasRowDelete={false}
        actionBarWidth={100}
        actionBarExtra={this.actionBarExtra}
        cmswhere={cms}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}

class ShengYuQingLing extends React.PureComponent {
  state = {
    selectedYear: curYear,
    selectedQuarter: curQuarter,
    cms: `Type = '剩余清零'`
  };
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    const { selectedQuarter, selectedYear } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        {/* <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>财年：</span>
          <Select
            size="small"
            style={{ width: 120 }}
            value={selectedYear}
            onChange={v => {
              this.setState({
                selectedYear: v,
                cms: `C3_663257630622 = ${v} and C3_663257633669 = ${selectedQuarter}`
              });
            }}
          >
            {years.map(year => {
              return (
                <Select.Option value={year.value}>{year.title}</Select.Option>
              );
            })}
          </Select>
        </div>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>季度：</span>
          <Select
            value={selectedQuarter}
            onChange={v => {
              this.setState({
                selectedQuarter: v,
                cms: `C3_663257630622 = ${selectedYear} and C3_663257633669 = ${v}`
              });
            }}
            size="small"
            style={{ width: 120 }}
          >
            {quarters.map(item => {
              return <Option value={item.value}>{item.title}</Option>;
            })}
          </Select>
        </div> */}
        <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          剩余清零
        </Button>
      </div>
    );
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    const { cms } = this.state;
    console.log({ cms });
    return (
      <TableData
        key="ShengYuQingLing"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={662169358054}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={false}
        hasModify={false}
        hasDelete={false}
        hasRowEdit={false}
        hasRowModify={false}
        hasRowView={true}
        hasRowDelete={false}
        actionBarWidth={100}
        actionBarExtra={this.actionBarExtra}
        cmswhere={cms}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}

class ShangNianShengYu extends React.PureComponent {
  state = {
    selectedYear: curYear,
    selectedQuarter: curQuarter,
    cms: `C3_663248496440 = '${curYear}' and C3_663248505925 = '${curQuarter}'`
  };
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    const { selectedYear, selectedQuarter } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>财年：</span>
          <Select
            size="small"
            style={{ width: 120 }}
            value={selectedYear}
            onChange={v => {
              this.setState({
                selectedYear: v,
                cms: `C3_663248496440 = '${v}' and C3_663248505925 = '${selectedQuarter}'`
              });
            }}
          >
            {years.map(year => {
              return (
                <Select.Option value={year.value}>{year.title}</Select.Option>
              );
            })}
          </Select>
        </div>
        <div style={{ marginRight: 12, marginLeft: 35 }}>
          <span>季度：</span>
          <Select
            value={selectedQuarter}
            onChange={v => {
              this.setState({
                selectedQuarter: v,
                cms: `C3_663248496440 = '${selectedYear}' and C3_663248505925 = '${v}'`
              });
            }}
            size="small"
            style={{ width: 120 }}
          >
            {quarters.map(item => {
              return <Option value={item.value}>{item.title}</Option>;
            })}
          </Select>
        </div>
        {/* <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          添加人员
        </Button> */}
      </div>
    );
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    const { cms } = this.state;
    console.log({ cms });
    return (
      <TableData
        key="ShangNianShengYu"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={663248318082}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={true}
        hasModify={false}
        hasDelete={false}
        hasRowEdit={false}
        hasRowModify={false}
        hasRowView={true}
        hasRowDelete={false}
        actionBarWidth={100}
        actionBarExtra={this.actionBarExtra}
        cmswhere={cms}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}

class LaoYuanGongSheBao extends React.PureComponent {
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    return (
      <div style={{ display: 'flex' }}>
        {/* <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          添加人员
        </Button> */}
      </div>
    );
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    return (
      <TableData
        key="LaoYuanGongSheBao"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={663860930064}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={false}
        hasModify={false}
        hasDelete={false}
        hasRowEdit={false}
        hasRowModify={false}
        hasRowView={true}
        hasRowDelete={false}
        actionBarWidth={100}
        actionBarExtra={this.actionBarExtra}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}

class XinYuanGongSheBao extends React.PureComponent {
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    return (
      <div style={{ display: 'flex' }}>
        {/* <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          添加人员
        </Button> */}
      </div>
    );
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    return (
      <TableData
        key="XinYuanGongSheBao"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={663860903672}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={true}
        hasModify={true}
        hasDelete={true}
        hasRowEdit={false}
        hasRowModify={false}
        hasRowView={true}
        hasRowDelete={false}
        actionBarWidth={100}
        actionBarExtra={this.actionBarExtra}
        hasBeBtns={true}
        hasRowSelection={true}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}
function exportExcel(data, headerData = [], fileName) {
  //要导出的json数据

  let header = '';
  headerData.forEach(item => {
    header += item.title + ',';
  });
  header = header.substring(0, header.length - 1);
  header += `\n`;
  //列标题，逗号隔开，每一个逗号就是隔开一个单元格
  // let str = `姓名,电话,邮箱\n`;
  let str = header;
  //增加\t为了不让表格显示科学计数法或者其他格式
  // for (let i = 0; i < data.length; i++) {
  //   for (let item in data[i]) {
  //     str += `${data[i][item] + '\t'},`;
  //   }
  //   str += '\n';
  // }
  data.forEach(_data => {
    headerData.forEach(item => {
      const value = _data[item.dataIndex];
      if (value !== null && value !== undefined) {
        str += `${value + '\t'},`;
      } else {
        str += ',';
      }
    });
    str += '\n';
  });

  //encodeURIComponent解决中文乱码
  let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
  //通过创建a标签实现
  let link = document.createElement('a');
  link.href = uri;
  //对下载的文件命名
  link.download = fileName + '.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
const monthArr = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];
class NianJiaGaiLan extends React.PureComponent {
  state = {
    data: [],
    total: 100,
    current: 1,
    year: moment().year(),
    spinning: false,
    downloading: false,
    selectedData: {},
    downloadData: [],
    pageSize: 10
  };
  componentDidMount() {
    this.getData({ pageIndex: this.state.current - 1 });
  }
  handlePageChange = page => {
    this.setState({ current: page }, () => {
      this.getData({ pageIndex: this.state.current - 1 });
    });
  };
  handleSearch = key => {
    this.setState({ current: 1 }, () => {
      this.getData({ pageIndex: this.state.current - 1, key });
    });
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    const {
      data,
      total,
      current,
      spinning,
      selectedData,
      pageSize,
      downloading,
      downloadData
    } = this.state;
    return (
      <div className="NJGL">
        {/* <div className='tools'>
          <Input.Search
            size="small"
            onSearch={this.handleSearch}
            className="search"
            enterButton={true}
            placeholder={'输入关键字搜索'}
          />
          <div className='page'>
            <Pagination onChange={this.handlePageChange} pageSize={pageSize} size="small" style={{ width: '480px' }} current={current} showQuickJumper defaultCurrent={2} total={total} />
          </div>
          <div className='down'>

            <Button loading={downloading} onClick={this.downloadExcel} size="small" style={{ marginRight: 8 }}>
              {downloading ? `${downloadData.length} / ${total}` : "下载"}
            </Button>
            <Button onClick={() => { this.getData({ pageIndex: this.state.current - 1 }) }} size="small">
              刷新
            </Button>
          </div>
        </div> */}
        <div className="maindata">
          <TableData
            key="xinYueBao"
            wrappedComponentRef={element => (this.tableDataRef = element)}
            refTargetComponentName="TableData"
            resid={668272811088}
            baseURL={baseURL}
            subtractH={190}
            isUseBESize={true}
            onRowClick={v => {
              console.log(v, v.numberID);
              this.setState({
                selectedData: {
                  number: v.numberID
                }
              });
            }}
            hasAdd={false}
            hasModify={false}
            hasDelete={false}
            hasRowEdit={false}
            hasRowModify={false}
            hasRowView={false}
            hasRowDelete={false}
            actionBarWidth={100}
            // actionBarExtra={this.actionBarExtra}
            downloadBaseURL={baseURLFromAppConfig}
          />
          {/* <div className='maindata'>
            <ul>
              {NJGLColums.map((item) => {
                return (
                  <li key={item.dataIndex} className='head'>
                    {item.title}
                  </li>
                )
              })}
            </ul>
            {data.map((item) => {
              return <ul key={item.number} className={item.number == selectedData.number ? 'selected' : ''}
                onClick={() => { this.setState({ selectedData: item }) }}>
                {NJGLColums.map((col) => {
                  return (
                    <li key={col.dataIndex}>
                      {item[col.dataIndex]}
                    </li>
                  )
                })}
              </ul>
            })}
          </div> */}
        </div>

        <div className="subdata">
          <Tabs defaultActiveKey="1" tabPosition="left">
            <TabPane tab="上年剩余调整" key="1">
              <div className="outer">
                <TableData
                  key="ShangNianShengYu"
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  refTargetComponentName="TableData"
                  resid={663248318082}
                  baseURL={baseURL}
                  subtractH={190}
                  hasAdd={true}
                  hasAdvSearch={true}
                  hasModify={false}
                  hasDelete={false}
                  hasRowEdit={false}
                  hasRowModify={false}
                  hasRowView={true}
                  hasRowDelete={false}
                  actionBarWidth={100}
                  defaultAddRecord={{ C3_663248494033: selectedData.number }}
                  // actionBarExtra={this.actionBarExtra}
                  cmswhere={
                    selectedData.number
                      ? `C3_663248494033 = ${selectedData.number}`
                      : '1 != 1'
                  }
                  downloadBaseURL={baseURLFromAppConfig}
                />
              </div>
            </TabPane>
            <TabPane tab="每月使用调整" key="2">
              <div className="outer">
                <TableData
                  key="NianJiaShiYong"
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  refTargetComponentName="TableData"
                  resid={666181543960}
                  baseURL={baseURL}
                  subtractH={190}
                  hasAdd={true}
                  hasModify={false}
                  hasDelete={true}
                  hasRowEdit={true}
                  hasRowModify={true}
                  hasRowView={true}
                  hasRowDelete={false}
                  actionBarWidth={180}
                  downloadBaseURL={baseURLFromAppConfig}
                  defaultAddRecord={{ numberID: selectedData.number }}
                  cmswhere={
                    selectedData.number
                      ? `numberID = ${selectedData.number}`
                      : '1 != 1'
                  }
                />
              </div>
            </TabPane>
            <TabPane tab="季度分配调整" key="3">
              <div className="outer">
                <TableData
                  key="JiDuFenPei"
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  refTargetComponentName="TableData"
                  resid={663257512519}
                  baseURL={baseURL}
                  subtractH={190}
                  hasAdd={true}
                  hasModify={false}
                  hasDelete={false}
                  hasRowEdit={false}
                  hasRowModify={false}
                  hasRowView={true}
                  hasRowDelete={false}
                  actionBarWidth={100}
                  defaultAddRecord={{ C3_663257630012: selectedData.number }}
                  cmswhere={
                    selectedData.number
                      ? `C3_663257630012 = ${selectedData.number}`
                      : '1 != 1'
                  }
                  downloadBaseURL={baseURLFromAppConfig}
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }

  getData = async ({ pageIndex = 0, key = '' }) => {
    const { baseURL, resid } = this.props;
    const { year, pageSize } = this.state;
    try {
      this.setState({ spinning: true });
      const employeeRes = await http({ baseURL }).getTable({
        resid,
        pageSize,
        pageIndex,
        cmswhere: `year = ${year}`,
        key
      });
      if (employeeRes.data.length <= 0) {
        this.setState({
          data: [],
          total: employeeRes.total,
          spinning: false
        });
        return;
      }
      const data = employeeRes.data.map(item => ({
        number: item.numberID,
        name: item.name,
        snsy: item.snsy,
        dnxz: item.dnxz,
        zjy: item.zjy,
        snjy: item.snjy,
        dnjy: item.dnjy,
        q1fenpei: item.season1fp,
        q1sy: item.season1sy,
        q2fenpei: item.season2fp,
        q2sy: item.season2sy,
        q3fenpei: item.season3fp,
        q3sy: item.season3sy,
        q4fenpei: item.season4fp,
        q4sy: item.season4sy,
        january: item.use1,
        february: item.use2,
        march: item.use3,
        april: item.use4,
        may: item.use5,
        june: item.use6,
        july: item.use7,
        august: item.use8,
        september: item.use9,
        october: item.use10,
        november: item.use11,
        december: item.use12
      }));
      // const indexMap = {};
      // data.forEach((item, index) => {
      //   indexMap[item.number] = index;
      // });
      // const numbers = data.map(item => item.number).join(',');
      // const reqArr = [
      //   http({ baseURL }).getTable({
      //     resid: 662169346288,
      //     cmswhere: `year = ${year} and numberID in (${numbers})`
      //   }),
      //   http({ baseURL }).getTable({
      //     resid: 662169383744,
      //     cmswhere: `Quarter = ${year} and NumberID in (${numbers})`
      //   }),
      //   http({ baseURL }).getTable({
      //     resid: 311025002785,
      //     cmswhere: `C3_424652509987 = ${year} and YGNO in (${numbers})`
      //   })
      // ]
      // const [res, res1, res2] = await Promise.all(reqArr);
      // res.data.forEach(item => {
      //   const index = indexMap[item.numberID];
      //   const mainData = data[index];
      //   mainData.snsy += item.snsy;
      //   mainData.dnxz += item.djfp + item.sydjfp;
      //   mainData.zjy += item.hjky;
      //   switch (item.quarter) {
      //     case 1:
      //       mainData.q1fenpei = item.djfp;
      //       mainData.q1sy = item.synj;
      //       break;
      //     case 2:
      //       mainData.q2fenpei = item.djfp;
      //       mainData.q2sy = item.synj;
      //       break;
      //     case 3:
      //       mainData.q3fenpei = item.djfp;
      //       mainData.q3sy = item.synj;
      //       break;
      //     case 4:
      //       mainData.q4fenpei = item.djfp;
      //       mainData.q4sy = item.synj;
      //       break;
      //     default:
      //       break;
      //   }
      // });
      // //计算上年结余
      // res1.data.forEach(item => {
      //   const index = indexMap[item.NumberID];
      //   const mainData = data[index];
      //   mainData.snjy = item.Residue;
      //   mainData.dnjy = mainData.zjy - item.Residue;
      // });
      // res2.data.forEach((item) => {
      //   const index = indexMap[item.YGNO];
      //   const mainData = data[index];
      //   mainData[monthArr[item.C3_469046133471 - 1]] = item.F_23 / 8
      // });
      this.setState({
        data,
        total: employeeRes.total,
        spinning: false
      });
    } catch (error) {
      this.setState({ spinning: false });
      message.error(error.message);
    }
  };
  downloadExcel = async ({ pageIndex = 0 }) => {
    const { baseURL, resid } = this.props;
    const { year } = this.state;
    try {
      this.setState({ downloading: true });
      const employeeRes = await http({ baseURL }).getTable({
        resid,
        pageSize: 100,
        pageIndex,
        cmswhere: `year = ${year}`
      });
      const data = employeeRes.data.map(item => ({
        number: item.numberID,
        name: item.name,
        snsy: item.snsy,
        dnxz: item.dnxz,
        zjy: item.zjy,
        snjy: item.snjy,
        dnjy: item.dnjy,
        q1fenpei: item.season1fp,
        q1sy: item.season1sy,
        q2fenpei: item.season2fp,
        q2sy: item.season2sy,
        q3fenpei: item.season3fp,
        q3sy: item.season3sy,
        q4fenpei: item.season4fp,
        q4sy: item.season4sy,
        january: item.use1,
        february: item.use2,
        march: item.use3,
        april: item.use4,
        may: item.use5,
        june: item.use6,
        july: item.use7,
        august: item.use8,
        september: item.use9,
        october: item.use10,
        november: item.use11,
        december: item.use12
      }));
      const downloadData = this.state.downloadData.concat(data);
      this.setState({ downloadData });
      if (data.length == 100) {
        this.downloadExcel({ pageIndex: pageIndex + 1 });
      } else {
        exportExcel(downloadData, NJGLColums, '年假');
        this.setState({ downloading: false, downloadData: [] });
      }
    } catch (error) {
      this.setState({ downloading: false });
      message.error(error.message);
    }
  };
}

class KaoQinYueDuJieSuan extends React.PureComponent {
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    return (
      <div style={{ display: 'flex' }}>
        {/* <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          添加人员
        </Button> */}
      </div>
    );
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    return (
      <TableData
        key="KaoQinYueDuJieSuan"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={664997954195}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={false}
        hasModify={false}
        hasDelete={false}
        hasRowEdit={false}
        hasRowModify={false}
        hasRowView={false}
        hasRowDelete={false}
        actionBarWidth={100}
        // actionBarExtra={this.actionBarExtra}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}

class JiDuJieSuanBaoCuo extends React.PureComponent {
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    return (
      <div style={{ display: 'flex' }}>
        {/* <Button
          onClick={() => {
            this.props.onOpenSelectPerson(this.handleRefresh);
          }}
          type="primary"
          size="small"
        >
          添加人员
        </Button> */}
      </div>
    );
  };
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };
  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    return (
      <TableData
        key="JiDuJieSuanBaoCuo"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={663967392209}
        baseURL={baseURL}
        subtractH={190}
        hasAdd={false}
        hasModify={false}
        hasDelete={false}
        hasRowEdit={false}
        hasRowModify={false}
        hasRowView={true}
        hasRowDelete={false}
        actionBarWidth={100}
        // actionBarExtra={this.actionBarExtra}
        downloadBaseURL={baseURLFromAppConfig}
      />
    );
  }
}

class NianJiaChaXun extends React.PureComponent {
  state = {
    startYear: curYear,
    startQuarter: 1,
    endYear: curYear,
    endQuarter: 4,
    selectedRadio: 'zhmx',
    employeeResult: [],
    fetching: false,
    selectedEmpolyee: undefined,
    selectedRecord: {},
    selectedSubRecord: {},
    subTableModalVisible: false,
    usesubTableModalVisible: false,
    applyRecordsModalVisible: false,

    cmssymx: `Year >= '${curYear}' and Year <= '${curYear}' and Quarter >= '${1}' and Quarter <= '${4}'`,
    cmszhmx: `year >= ${curYear} and year <= ${curYear} and quarter >= ${1} and quarter <= ${4}`
  };
  actionBarExtra = ({
    dataSource = [],
    selectedRowKeys = [],
    data = [],
    recordFormData,
    size
  }) => {
    const {
      startQuarter,
      startYear,
      endQuarter,
      endYear,
      selectedEmpolyee
    } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginLeft: 35 }}>
          从
          <Select
            onChange={value => {
              this.setState({
                startYear: value,
                cmssymx: `Year >= '${value}' and Year <= '${endYear}' and Quarter >= '${startQuarter}' and Quarter <= '${endQuarter}'`,
                cmszhmx: `year >= ${value} and year <= ${endYear} and quarter >= ${startQuarter} and quarter <= ${endQuarter}`
              });
            }}
            value={startYear}
            size="small"
            style={styles.selectStyle}
          >
            {years.map(year => {
              return <Option value={year.value}>{year.title}</Option>;
            })}
          </Select>
          <Select
            onChange={value => {
              this.setState({
                startQuarter: value,
                cmssymx: `Year >= '${startYear}' and Year <= '${value}' and Quarter >= '${startQuarter}' and Quarter <= '${endQuarter}'`,
                cmszhmx: `year >= ${startYear} and year <= ${endYear} and quarter >= ${value} and quarter <= ${endQuarter}`
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
                endYear: value,
                cmssymx: `Year >= '${startYear}' and Year <= '${endYear}' and Quarter >= '${value}' and Quarter <= '${endQuarter}'`,
                cmszhmx: `year >= ${startYear} and year <= ${value} and quarter >= ${startQuarter} and quarter <= ${endQuarter}`
              });
            }}
            value={endYear}
            size="small"
            style={styles.selectStyle}
          >
            {years.map(year => {
              return <Option value={year.value}>{year.title}</Option>;
            })}
          </Select>
          <Select
            onChange={value => {
              this.setState({
                endQuarter: value,
                cmssymx: `Year >= '${startYear}' and Year <= '${endYear}' and Quarter >= '${startQuarter}' and Quarter <= '${value}'`,
                cmszhmx: `year >= ${startYear} and year <= ${endYear} and quarter >= ${startQuarter} and quarter <= ${value}`
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
        </div>
      </div>
    );
  };
  lastFetchId = 0;
  fetchUser = debounce(async value => {
    if (!value) {
      return;
    }
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ employeeResult: [], fetching: true });
    try {
      const res = await http({ baseURL: this.props.baseURL }).getTable({
        resid: 227186227531,
        key: value
      });
      if (fetchId !== this.lastFetchId) {
        return;
      }
      const data = res.data.map(user => ({
        text: user.C3_227192484125,
        value: user.C3_448032387764
      }));
      this.setState({ employeeResult: data, fetching: false });
    } catch (error) {
      console.error(error);
    }
  }, 800);

  handleEmployeeChange = value => {
    console.log(value);
    //
    const { startYear, endYear, startQuarter, endQuarter } = this.state;
    this.setState({
      selectedEmpolyee: value,
      // cmssymx: `Year >= '${startYear}' and Year <= '${endYear}' and Quarter >= '${startQuarter}' and Quarter <= '${endQuarter}' and NumberID = '${value.key}'`,
      // cmszhmx: `year >= ${startYear} and year <= ${endYear} and quarter >= ${startQuarter} and quarter <= ${endQuarter} and numberID = ${value.key}`,
      employeeResult: [],
      fetching: false
    });
  };

  render() {
    const { baseURL, baseURLFromAppConfig } = this.props;
    const {
      selectedRadio,
      fetching,
      employeeResult,
      selectedEmpolyee,
      cmszhmx,
      cmssymx,
      subTableModalVisible,
      usesubTableModalVisible,
      applyRecordsModalVisible,
      selectedRecord,
      selectedSubRecord
    } = this.state;
    console.table({ cmszhmx, cmssymx, selectedRadio });
    return (
      <div style={styles.nianJiaChaXun}>
        <div style={styles.header}>
          <div style={{ marginRight: 12 }}>
            姓名：{selectedEmpolyee ? selectedEmpolyee.label : '未选择员工'}
          </div>
          <div style={{ marginRight: 12 }}>
            工号：{selectedEmpolyee ? selectedEmpolyee.key : '未选择员工'}
          </div>
          <Select
            size="small"
            labelInValue
            showSearch
            value={selectedEmpolyee}
            placeholder="搜索员工"
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={false}
            onSearch={this.fetchUser}
            onChange={this.handleEmployeeChange}
            style={{ width: 200, marginRight: 12 }}
          >
            {employeeResult.map(d => (
              <Option key={d.value}>{d.text}</Option>
            ))}
          </Select>
          <Radio.Group
            onChange={e => {
              this.setState({ selectedRadio: e.target.value });
            }}
            value={selectedRadio}
            size="small"
            buttonStyle="outline"
          >
            <Radio.Button value="zhmx">账户明细</Radio.Button>
            <Radio.Button value="symx">使用明细</Radio.Button>
          </Radio.Group>
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
            resid={662169346288}
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
            resid={662169346288}
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
            resid={662169346288}
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
          />
        </Modal>
        <div style={styles.tableDataContainer}>
          <TableData
            key="NianJiaChaXun"
            resid={selectedRadio === 'zhmx' ? 662169346288 : 448999733055}
            baseURL={baseURL}
            subtractH={190}
            hasAdd={true}
            hasModify={false}
            hasDelete={false}
            hasRowEdit={false}
            hasRowModify={false}
            hasRowView={false}
            hasRowDelete={false}
            actionBarWidth={100}
            actionBarExtra={this.actionBarExtra}
            customRowBtns={[
              record => {
                return (
                  selectedRadio === 'zhmx' && (
                    <div>
                      <Button
                        onClick={() => {
                          this.setState({
                            selectedRecord: record,
                            usesubTableModalVisible: true
                          });
                        }}
                      >
                        使用明细
                      </Button>
                      <Button
                        onClick={() => {
                          this.setState({
                            selectedRecord: record,
                            subTableModalVisible: true
                          });
                        }}
                      >
                        交易明细
                      </Button>
                    </div>
                  )
                );
              }
            ]}
            cmswhere={
              selectedRadio === 'zhmx'
                ? selectedEmpolyee
                  ? cmszhmx + ` and numberID = ${selectedEmpolyee.key}`
                  : cmszhmx
                : `C3_449349153817 = 23 and C3_449011111447 = 'Y'`
            }
          />
        </div>
      </div>
    );
  }
}
export default AnnualLeaveManage;

//拼接表的数据来源（80后台）： 424537954415
// 表 662169346288 里面的员工姓名、工号、四个季度的当季分配余额、四个季度的剩余可用年假。
// 上年剩余是表 662169346288 四个季度的上年剩余之和
// 当年新增是表 662169346288 四个季度的当季分配余额之和加累上四个季度的计使用当季分配之和
// 总结余是表 662169346288 四个季度的累计可用年假之和

// 表 311025002785 里面的根据考勤月份进行拼接。例：202101到202112的记录里的年假拼到同一条记录里。
// 上年结余要取表 662169383744 里对应年份交易名称是‘上年转入’的上年剩余年假
