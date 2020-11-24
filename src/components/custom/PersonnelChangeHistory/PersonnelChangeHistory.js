import React from 'react';
import {
  DatePicker,
  Select,
  Button,
  Spin,
  Timeline,
  Icon,
  Table,
  message,
  Collapse
} from 'antd';
import './PersonnelChangeHistory.less';
import TableData from 'Common/data/TableData';
import http from 'Util20/api';

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Option } = Select;
const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureBaseURL;
const downloadBaseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs
    .PostArchitectureDownloadBaseURL;

class PersonnelChangeHistory extends React.Component {
  state = {
    rangeDate: [],
    categories: [],
    selectedRecord: {},
    historyVisible: false,
    cmswhere: '',
    types: []
  };
  componentDidMount() {
    this.fetchTypes();
  }
  fetchTypes = async () => {
    const { typesResid } = this.props;
    try {
      const res = await http({ baseURL }).getTableColumnDefine({
        resid: typesResid
      });
      const types = res.data.map(item => item.ColResDataSort);

      const set = new Set(types);
      this.setState({ types: [...set].filter(item => item) });
    } catch (error) {
      message.error(error.message);
    }
  };
  handleChange = value => {
    this.setState({ categories: value }, this.changeCmswhere);
  };
  handleViewHistory = record => {
    this.setState({ historyVisible: true, selectedRecord: record });
  };
  changeCmswhere = () => {
    const { rangeDate, categories } = this.state;
    const { effectiveDateField } = this.props;
    let cmswhere = '';
    if (rangeDate.length) {
      cmswhere = `${effectiveDateField} >= '${rangeDate[0].format(
        'YYYYMMDD'
      )}' and ${effectiveDateField} <= '${rangeDate[1].format('YYYYMMDD')}'`;
    }
    if (categories.length) {
      cmswhere += `${cmswhere ? ' and ' : ''} changeType in (${categories
        .map(item => `'${item}'`)
        .join(',')}) `;
    }
    this.setState({ cmswhere });
  };
  handleRangeDateChange = v => {
    this.setState({ rangeDate: v }, this.changeCmswhere);
  };
  render() {
    const { resid, employeeNumberField, effectiveDateField } = this.props;
    const {
      categories,
      historyVisible,
      selectedRecord,
      rangeDate,
      cmswhere,
      types
    } = this.state;
    return (
      <div className="personnel-chang-history">
        <div className="pch-header">
          <div className="pch-header-times">
            <div className="pch-header-times-item">
              <span>变动时间</span>
              <RangePicker
                value={rangeDate}
                onChange={this.handleRangeDateChange}
              />
            </div>
          </div>
          <div className="pch-header-type">
            <span style={{ marginRight: 8 }}>变动分类</span>
            <Select
              mode="multiple"
              placeholder="请选择变动分类"
              onChange={this.handleChange}
              style={{ width: 360 }}
              showArrow
              allowClear
              value={categories}
            >
              {types.map(type => (
                <Option key={type}>{type}</Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="pch-tabledata-container">
          <TableData
            resid={resid}
            baseURL={baseURL}
            recordFormUseAbsolute={true}
            downloadBaseURL={downloadBaseURL}
            hasRowView={false}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            hasRowModify={false}
            hasRowSelection={false}
            hasAdd={false}
            cmswhere={cmswhere}
            subtractH={180}
            customRowBtns={[
              (record, btnSize) => {
                return (
                  <Button
                    type="primary"
                    size={btnSize}
                    onClick={() => this.handleViewHistory(record)}
                  >
                    查看变动历史
                  </Button>
                );
              }
            ]}
          />
        </div>
        {historyVisible && (
          <ChangeHistory
            visible={historyVisible}
            record={selectedRecord}
            onClose={this.handleClose}
            employeeNumberField={employeeNumberField}
            effectiveDateField={effectiveDateField}
            resid={resid}
          />
        )}
      </div>
    );
  }

  handleClose = () => {
    this.setState({ historyVisible: false });
  };
}

export default PersonnelChangeHistory;

const columns = [
  {
    title: '变动项目',
    dataIndex: 'changeColumnName',
    key: 'changeColumnName'
  },
  {
    title: '变动前',
    dataIndex: 'changeBefore',
    key: 'changeBefore'
  },
  {
    title: '变动后',
    dataIndex: 'changeAfter',
    key: 'changeAfter'
  },
  {
    title: '操作人',
    dataIndex: 'completeUser',
    key: 'completeUser'
  },
  {
    title: '操作人工号',
    dataIndex: 'completeUserId',
    key: 'completeUserId'
  }
];
const customPanelStyle = {
  background: '#ffffff',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden'
};
class ChangeHistory extends React.PureComponent {
  state = {
    employee: {},
    histories: [],
    selectedHistory: [],
    spinning: true
  };
  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const {
      record,
      resid,
      employeeNumberField,
      effectiveDateField
    } = this.props;
    try {
      const res = await http().getTable({
        resid: '227186227531',
        cmswhere: ` C3_305737857578 = '${record[employeeNumberField]}'`
      });
      if (!res.data.length) {
        return message.error('未查到此人员');
      }
      const res1 = await http({ baseURL }).getTable({
        resid,
        cmswhere: ` ${employeeNumberField} = '${record[employeeNumberField]}'`
      });
      const historiesMap = new Map();
      res1.data.forEach(item => {
        try {
          if (historiesMap.has(item[effectiveDateField])) {
            historiesMap.get(item[effectiveDateField]).push(item);
          } else {
            historiesMap.set(item[effectiveDateField], [item]);
          }
        } catch (error) {
          console.log(error);
        }
      });
      const arr = [...historiesMap];
      arr.forEach(item => {
        const typeMap = new Map();
        item[1].forEach(it => {
          try {
            if (typeMap.has(it.changeType)) {
              typeMap.get(it.changeType).push(it);
            } else {
              typeMap.set(it.changeType, [it]);
            }
          } catch (error) {
            console.log(error);
          }
        });
        item[2] = [...typeMap];
      });
      this.setState({
        employee: res.data[0],
        histories: arr,
        selectedHistory: arr[0]
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({ spinning: false });
    }
  };

  handleClose = () => {
    this.setState({ employee: {}, histories: [] });
    this.props.onClose();
  };
  render() {
    const { employee, histories, selectedHistory, spinning } = this.state;
    return (
      <div className="pch-change-history">
        <Spin spinning={spinning}>
          <header>
            <div className="change-history__employee-info">
              <img src={employee.C3_461934233303} alt="员工照片" />
              <span>
                {employee.C3_227192484125} - {employee.C3_466455145903}
              </span>
              <span>工号：{employee.C3_227192472953}</span>
              <span>部门：{employee.C3_227212499515}</span>
            </div>
            <Icon type="close" onClick={this.handleClose} />
          </header>
          <div className="change-history-main">
            <aside>
              <h3>变动历史</h3>
              <Timeline>
                {histories.map(item => {
                  return (
                    <Timeline.Item
                      onClick={() => {
                        this.setState({ selectedHistory: item });
                      }}
                      key={item[0]}
                    >
                      <p
                        style={{
                          color:
                            item[0] == selectedHistory[0] ? '#1890FF' : '#000'
                        }}
                      >
                        {item[0]}
                      </p>
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            </aside>
            <content>
              <h3>变动日期： {selectedHistory[0] && selectedHistory[0]}</h3>
              {selectedHistory[2] && (
                <Collapse
                  bordered={false}
                  defaultActiveKey={selectedHistory[2].map(item => item[0])}
                  expandIcon={({ isActive }) => (
                    <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                  )}
                >
                  {selectedHistory[2].map(item => {
                    return (
                      <Panel
                        header={<h2>{item[0]}</h2>}
                        key={item[0]}
                        style={customPanelStyle}
                      >
                        <Table
                          dataSource={item[1]}
                          columns={columns}
                          pagination={false}
                          size="small"
                          bordered
                        />
                      </Panel>
                    );
                  })}
                </Collapse>
              )}
            </content>
          </div>
        </Spin>
      </div>
    );
  }
}
