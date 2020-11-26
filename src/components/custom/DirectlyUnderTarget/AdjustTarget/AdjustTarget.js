import React from 'react';
import './AdjustTarget.less';
import { Select, Input, Checkbox, Button, message, Empty } from 'antd';
import http from 'Util20/api';
import Spin from 'Common/ui/Spin';
import moment from 'moment';
import classnames from 'classnames';
import TableData from 'Common/data/TableData';

const { Option } = Select;
const { Search } = Input;
function stopPropagation(e) {
  e.stopPropagation();
}
const tableTab = [
  { key: 'current', title: '当前目标' },
  { key: 'history', title: '历史目标' }
];
/**
 * 调整目标
 */
class AdjustTarget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainData: [],
      yearMainData: [],
      selectedData: {},
      fetcinghMainData: true,
      selectedYear: '',
      filterText: '',
      checkedData: [],
      submitLoading: false,
      selectedTableTab: 'current'
    };
    const { residConfig } = props;

    this._tableConfig = {
      current: {
        resid: residConfig.目标调整栏
      },
      history: {
        resid: residConfig.目标历史记录栏
      }
    };
  }

  componentDidMount() {
    this.fetchMainData();
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.selectedYear) {
      return { selectedYear: props.currentYear.C3_420161949106 };
    }
  }

  fetchMainData = async () => {
    const { residConfig, currentYear } = this.props;
    try {
      const res = await http({ baseURL: this.props.baseURL }).getTable({
        resid: residConfig.可调整目标
      });
      this.setState({
        mainData: res.data,
        yearMainData: res.data.filter(
          item => item.C3_420150922019 === currentYear.C3_420161949106
        )
      });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
    this.setState({ fetcinghMainData: false });
  };

  handleListItemClick = data => this.setState({ selectedData: data });

  handleListItemCheck = (data, checked) => {
    const { checkedData } = this.state;
    const newcheckedData = [...checkedData];
    if (checked) {
      newcheckedData.push(data);
      this.setState({ checkedData: newcheckedData });
    } else {
      newcheckedData.splice(
        newcheckedData.findIndex(item => item.REC_ID === data.REC_ID),
        1
      );
      this.setState({ checkedData: newcheckedData });
    }
  };
  handleCheckAllChange = e => {
    const { yearMainData } = this.state;
    this.setState({ checkedData: e.target.checked ? [...yearMainData] : [] });
  };
  handleSubmit = async () => {
    const { checkedData, selectedData } = this.state;
    const { residConfig } = this.props;

    if (!checkedData.length) {
      return message.info('请选择记录');
    }
    checkedData.forEach(item => {
      item.C3_421247472054 = moment().format('YYYY-MM-DD');
    });
    try {
      this.setState({ submitLoading: true });
      await http({ baseURL: this.props.baseURL }).modifyRecords({
        resid: residConfig.可调整目标,
        data: checkedData
      });
      const data = { checkedData: [] };
      if (checkedData.some(item => item.REC_ID === selectedData.REC_ID)) {
        data.selectedData = {};
      }
      this.setState({ checkedData: [] }, () => {
        this.fetchMainData();
      });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
    this.setState({ submitLoading: false });
  };
  render() {
    const {
      mainData,
      fetcinghMainData,
      selectedData,
      selectedYear,
      filterText,
      checkedData,
      yearMainData,
      submitLoading,
      selectedTableTab
    } = this.state;
    const { years } = this.props;
    return (
      <div className="adjust-target">
        <div className="target-emlpoyee-list">
          <header className="target-emlpoyee-list__header">
            <div className="header__left">
              <Select
                style={{ width: '100%' }}
                value={selectedYear}
                size="small"
                onChange={v => {
                  this.setState({
                    selectedYear: v,
                    yearMainData: mainData.filter(
                      item => item.C3_420150922019 === v
                    ),
                    checkedData: []
                  });
                }}
              >
                {years.map(year => {
                  return (
                    <Option value={year.C3_420161949106}>
                      {year.C3_420161949106}
                    </Option>
                  );
                })}
              </Select>
            </div>
            <div className="header__right">
              <Search
                placeholder="输入工号查询"
                size="small"
                value={filterText}
                onChange={e => this.setState({ filterText: e.target.value })}
              />
            </div>
          </header>
          <div className="target-emlpoyee-list__content">
            <div className="content__header">
              <Checkbox
                indeterminate={
                  !!checkedData.length &&
                  checkedData.length < yearMainData.length
                }
                checked={
                  !!checkedData.length &&
                  checkedData.length === yearMainData.length
                }
                onChange={this.handleCheckAllChange}
              >
                全选
              </Checkbox>
              <Button
                size="small"
                type="primary"
                loading={submitLoading}
                onClick={this.handleSubmit}
              >
                通知下属目标已调整
              </Button>
            </div>
            <DataList
              mainData={yearMainData}
              fetcinghMainData={fetcinghMainData}
              onClick={this.handleListItemClick}
              onCheck={this.handleListItemCheck}
              selectedData={selectedData}
              filterText={filterText}
              checkedData={checkedData}
            />
          </div>
        </div>
        <div className="adjust-target__right">
          <header className="target-employee-info">
            {selectedData.REC_ID ? (
              <>
                <div className="employee-info-item">
                  姓名：{selectedData.C3_420148204159}
                </div>
                <div className="employee-info-item">
                  英文名：{selectedData.C3_420148204312}
                </div>
                <div className="employee-info-item">
                  工号：{selectedData.C3_420148204015}
                </div>
                <div className="employee-info-item">
                  部门：{selectedData.C3_420148204731}
                </div>
                <div className="employee-info-item">
                  入司日期：
                  {moment(selectedData.C3_420148205735).format('YYYY-MM-DD')}
                </div>
                <div className="employee-info-item">
                  表内权重之和：
                  {selectedData.C3_420950779816}
                </div>
                <div className="employee-info-item">
                  财年直评人：{selectedData.C3_425912302236}
                </div>
              </>
            ) : (
              '请选择一条记录'
            )}
          </header>
          <div className="adjust-target__right__table">
            <div className="adjust-target-table-tab">
              {tableTab.map(tab => {
                return (
                  <div
                    className={classnames('adjust-target-table-tab-item', {
                      'adjust-target-table-tab-item--selected':
                        tab.key === selectedTableTab
                    })}
                    key={tab.key}
                    onClick={() => {
                      this.setState({
                        selectedTableTab: tab.key
                      });
                    }}
                  >
                    {tab.title}
                  </div>
                );
              })}
            </div>
            <div style={{ flex: 1 }}>
              {selectedData.REC_ID && this.renderTable()}
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderTable = () => {
    const { selectedData, selectedTableTab } = this.state;
    const { residConfig, baseURL } = this.props;
    const tableDataProps = {};

    tableDataProps.hasAdd = false;
    tableDataProps.hasModify = false;
    tableDataProps.hasDelete = false;
    tableDataProps.hasRowAdd = false;
    tableDataProps.hasRowModify = false;
    tableDataProps.hasRowDelete = false;
    tableDataProps.hasRowEdit = false;
    tableDataProps.actionBarWidth = 150;
    if (
      selectedTableTab &&
      selectedData.C3_420953811304 === 'Y' &&
      selectedData.C3_420976746773 === 'Y'
    ) {
      // tableDataProps.hasAdd = true;
      // tableDataProps.hasDelete = true;
      tableDataProps.hasRowEdit = true;
      tableDataProps.hasRowEditAdd = true;
      tableDataProps.actionBarFixed = false;
      tableDataProps.isUseFormDefine = false;
    }
    return (
      <TableData
        key={selectedData.REC_ID + selectedTableTab}
        subresid={this._tableConfig[selectedTableTab].resid}
        resid={residConfig.可调整目标}
        dataMode="sub"
        hostrecid={selectedData.REC_ID}
        {...tableDataProps}
        baseURL={baseURL}
      />
    );
  };
}

export default AdjustTarget;

const DataList = React.memo(
  ({
    fetcinghMainData,
    mainData,
    selectedData,
    onClick,
    onCheck,
    filterText,
    checkedData
  }) => {
    if (fetcinghMainData) {
      return <Spin />;
    }
    let filtedData = mainData;
    if (filterText && filterText != 0) {
      filtedData = filtedData.filter(item => {
        return (item.C3_420148204015 + '').includes(filterText);
      });
    }
    if (!filtedData.length) {
      return <Empty style={{ marginTop: 16 }} />;
    }
    return (
      <div className="content__list">
        {filtedData.map(data => (
          <div
            className={classnames('content__list-item', {
              'content__list-item--selected':
                data.REC_ID === selectedData.REC_ID
            })}
            key={data.REC_ID}
            onClick={() => onClick(data)}
          >
            <div
              className="content__list-item__checkbox-container"
              onClick={stopPropagation}
            >
              <Checkbox
                onChange={e => {
                  e.stopPropagation();
                  onCheck && onCheck(data, e.target.checked);
                }}
                checked={checkedData.some(item => item.REC_ID === data.REC_ID)}
              />
            </div>
            <div>
              <div>
                {data.C3_420148204159}/{data.C3_420148204312}
              </div>
              <div>工号：{data.C3_420148204015}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);
