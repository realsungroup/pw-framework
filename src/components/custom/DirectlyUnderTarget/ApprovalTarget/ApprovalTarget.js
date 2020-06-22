import React from 'react';
import './ApprovalTarget.less';
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
/**
 * 核准目标
 */
class ApprovalTarget extends React.Component {
  state = {
    mainData: [],
    yearMainData: [],
    selectedData: {},
    fetcinghMainData: true,
    selectedYear: '',
    filterText: '',
    checkedData: [],
    submitLoading: false
  };

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentYear !== this.props.currentYear) {
      this.fetchMainData();
    }
  }
  static getDerivedStateFromProps(props, state) {
    if (!state.selectedYear) {
      return { selectedYear: props.currentYear.C3_420161949106 };
    }
  }

  fetchMainData = async () => {
    const { residConfig, currentYear } = this.props;
    try {
      const res = await http({baseURL:this.props.baseURL}).getTable({ resid: residConfig.待核准目标 });
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
      item.C3_420976746773 = 'Y';
    });
    try {
      this.setState({ submitLoading: true });
      await http({baseURL:this.props.baseURL}).modifyRecords({
        resid: residConfig.待核准目标,
        data: checkedData
      });
      const data = { checkedData: [] };
      if (checkedData.some(item => item.REC_ID === selectedData.REC_ID)) {
        data.selectedData = {};
      }
      this.setState(data, () => {
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
      submitLoading
    } = this.state;
    const { years } = this.props;
    return (
      <div className="approval-target">
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
                onClick={this.handleSubmit}
                loading={submitLoading}
              >
                核准目标
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
        <div className="approval-target__right">
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
          <div className="approval-target__right__table">
            {selectedData.REC_ID && this.renderTable()}
          </div>
        </div>
      </div>
    );
  }
  renderTable = () => {
    const { selectedData } = this.state;
    const { residConfig , baseURL} = this.props;
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
      selectedData.C3_420953811304 === 'Y' &&
      selectedData.C3_420976746773 === 'Y'
    ) {
      tableDataProps.hasAdd = true;
      tableDataProps.hasDelete = true;
      tableDataProps.hasRowEdit = true;
      tableDataProps.hasRowEditAdd = true;
      tableDataProps.actionBarFixed = false;
      tableDataProps.isUseFormDefine = false;
    }
    return (
      <TableData
        key={selectedData.REC_ID}
        subresid={residConfig.目标核准栏}
        resid={residConfig.待核准目标}
        dataMode="sub"
        hostrecid={selectedData.REC_ID}
        {...tableDataProps}
        baseURL={baseURL}
      />
    );
  };
}

export default ApprovalTarget;

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
