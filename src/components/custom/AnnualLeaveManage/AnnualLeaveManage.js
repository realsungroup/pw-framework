import React from 'react';
import { Menu, Select, Button, Radio, Spin, Modal, Icon, message } from 'antd';
import './AnnualLeaveManage.less';
import TableData from 'Common/data/TableData';
import SelectPersonnel from 'Common/data/SelectPersonnel';
import debounce from 'lodash/debounce';
import http from 'Util20/api';
import SelectPersonSecond from '../SelectPersonSecond';
import moment from 'moment';
import { reject } from 'lodash';
// import { SubMenu, MenuItem } from 'react-contextmenu';

const { Option } = Select;
const { SubMenu } = Menu;
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
      tip: '年初创建提示',
      render: () => {
        const { baseURL } = this.props;
        return (
          <NianChuChuangJian
            baseURL={baseURL}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '上年结转',
      tip: '上年结转提示',
      render: () => {
        const { baseURL } = this.props;
        return (
          <ShangNianJieZhuan
            baseURL={baseURL}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '月度新增',
      tip: '月度新增提示',
      render: () => {
        const { baseURL } = this.props;
        return (
          <YueDuXinZeng
            baseURL={baseURL}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    // {
    //   title: '季度使用',
    //   tip: '季度使用提示',
    //   render: () => {
    //     const { baseURL } = this.props;
    //     return (
    //       <YueDuShiYong
    //         baseURL={baseURL}
    //         onOpenSelectPerson={this.handleOpenSelectPerson}
    //       />
    //     );
    //   }
    // },
    {
      title: '季度结算',
      tip: '季度结算提示',
      render: () => {
        const { baseURL } = this.props;
        return (
          <JiDuJieSuan
            baseURL={baseURL}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '入职分配',
      tip: '入职分配提示',
      render: () => {
        const { baseURL } = this.props;
        return (
          <RuZhiFenPei
            baseURL={baseURL}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '季度分配',
      tip: '季度分配提示',
      render: () => {
        const { baseURL } = this.props;
        return (
          <JiDuFenPei
            baseURL={baseURL}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '上年剩余',
      tip: '上年剩余提示',
      render: () => {
        const { baseURL } = this.props;
        return (
          <ShangNianShengYu
            baseURL={baseURL}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '年假查询',
      tip: '年假查询提示',
      render: () => {
        const { baseURL } = this.props;
        return <NianJiaChaXun baseURL={baseURL} />;
      }
    },
    {
      title: '老员工社保信息查询',
      tip: '老员工社保信息查询提示',
      render: () => {
        const { baseURL } = this.props;
        return (
          <LaoYuanGongSheBao
            baseURL={baseURL}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '新员工社保信息维护',
      tip: '新员工社保信息维护提示',
      render: () => {
        const { baseURL } = this.props;
        return (
          <XinYuanGongSheBao
            baseURL={baseURL}
            onOpenSelectPerson={this.handleOpenSelectPerson}
          />
        );
      }
    },
    {
      title: '考勤月度结算',
      tip: '考勤月度结算提示',
      render: () => {
        const { baseURL } = this.props;
        return <KaoQinYueDuJieSuan baseURL={baseURL} />;
      }
    },
    {
      title: '季度结算报错信息',
      tip: '季度结算报错信息提示',
      render: () => {
        const { baseURL } = this.props;
        return <JiDuJieSuanBaoCuo baseURL={baseURL} />;
      }
    }
  ];
  state = {
    selectedKeys: [this.menus[0].title],
    selectedMenu: this.menus[0],
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
    const { jiesuanQuarter, numList, refreshCallback } = this.state;
    numList.map(item => {
      const url = `http://10.108.21.43/api/QuarterSmeettlent/settlement?numberID=${item}&year=${curYear}&quarter=${jiesuanQuarter}`;
      fetch(url)
        .then(response => {
          return response.json();
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
    setTimeout(() => {
      this.setState({ spinning: false });
      refreshCallback && refreshCallback();
    }, 2000);
  };
  /**
   *
   */
  handleComplete = () => {
    const { refreshCallback, selectedKeys, numList } = this.state;
    this.setState({ selectPersonVisible: false, spinning: true });
    if (selectedKeys[0] === '入职分配') {
      numList.map(item => {
        const url = `http://10.108.21.43/api/EntryAssignment/assignment?numberID=${item}`;
        fetch(url)
          .then(response => {
            return response.json();
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
      setTimeout(() => {
        this.setState({ spinning: false });
        refreshCallback && refreshCallback();
      }, 2000);
    }
    if (selectedKeys[0] === '季度结算') {
      this.setState({
        selectQuarterModal: true
      });
    }
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
            <SubMenu key="submenu1" title="交易明细">
              {this.menus.map((menu, index) => {
                if (index < 7) {
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
            {this.menus.map((menu, index) => {
              if (index >= 7) {
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
          </Menu>
          <div className="annual-leave-manage__content">
            {selectedMenu.render()}
          </div>
          <Modal
            title="选择季度"
            visible={this.state.selectQuarterModal}
            onCancel={() => {
              this.setState({
                selectQuarterModal: false
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
    const { baseURL } = this.props;
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
    const { baseURL } = this.props;
    const { cms } = this.state;
    return (
      <TableData
        key="shangNianJieZhuan"
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
    const { baseURL } = this.props;
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
    const { baseURL } = this.props;
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
    const { baseURL } = this.props;
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
    const { baseURL } = this.props;
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
    const { baseURL } = this.props;
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
    const { baseURL } = this.props;
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
    const { baseURL } = this.props;
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
    const { baseURL } = this.props;
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
      />
    );
  }
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
    const { baseURL } = this.props;
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
    const { baseURL } = this.props;
    return (
      <TableData
        key="JiDuJieSuanBaoCuo"
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        resid={663967392209}
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
        // actionBarExtra={this.actionBarExtra}
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
    const { baseURL } = this.props;
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
            resid={selectedRadio === 'zhmx' ? 662169346288 : 662169358054}
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
                );
              }
            ]}
            cmswhere={
              selectedRadio === 'zhmx'
                ? selectedEmpolyee
                  ? cmszhmx + ` and numberID = ${selectedEmpolyee.key}`
                  : cmszhmx
                : selectedEmpolyee
                ? cmssymx + ` and NumberID = '${selectedEmpolyee.key}'`
                : cmssymx
            }
          />
        </div>
      </div>
    );
  }
}
export default AnnualLeaveManage;
