import React from 'react';
import './DirectEvaluate.less';
import {
  Select,
  Input,
  Checkbox,
  Button,
  message,
  Pagination,
  Empty
} from 'antd';
import http from 'Util20/api';
import moment from 'moment';
import classnames from 'classnames';
import TableData from 'Common/data/TableData';
import FormData from 'Common/data/FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';
import Spin from 'Common/ui/Spin';

const { Option } = Select;
const { Search } = Input;

const getTableConfig = (tabKey, stage) => {
  if (stage === '年中') {
    if (tabKey === 'target') {
      return tableConfig['1'];
    } else if (tabKey === 'advAndDisadv') {
      return tableConfig['2'];
    }
  } else {
    if (tabKey === 'target') {
      return tableConfig['3'];
    } else if (tabKey === 'advAndDisadv') {
      return tableConfig['4'];
    }
  }
};

const resid = 462636047259;
const tableMode = ['sub', 'main'];
const tableTab = [
  { key: 'target', title: '目标' },
  { key: 'advAndDisadv', title: '优缺点' }
  // { key: 'summary', title: '互评总结' }
];
let tableConfig = {};
/**
 * 直评管理
 */
class DirectEvaluate extends React.Component {
  constructor(props) {
    super(props);
    const { residConfig } = props;
    tableConfig = {
      '1': {
        resid: residConfig.年中目标, //子表
        mode: 'sub'
      },
      '2': {
        resid: residConfig.年中目标, //子表
        mode: 'form',
        formName: '员工直评'
      },
      '3': {
        resid: residConfig.年末目标, //子表
        mode: 'sub'
      },
      '4': {
        resid: residConfig.年末目标, //子表
        mode: 'form',
        formName: '员工年末直评'
      }
    };
    this.state = {
      selectedYear: '', //选中的财年
      mainData: [],
      selectedData: {},
      selectedTableTab: 'target', //选中的tab key
      selectedStage: '年中', //选中的财年阶段
      tableConfig: tableConfig['1'],
      pagination: {
        total: 0
      },
      fetcinghMainData: true,
      submitLoading: false,
      filterText: ''
    };
  }

  componentDidMount() {
    this.fetchFormData();
    this.fetchMainData();
  }
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.currentYear !== this.props.currentYear) {
  //     this.fetchMainData();
  //   }
  // }
  static getDerivedStateFromProps(props, state) {
    if (!state.selectedYear) {
      return {
        selectedYear: props.currentYear.C3_420161949106,
        selectedStage: props.currentYear.C3_431106800828,
        tableConfig: getTableConfig(
          state.selectedTableTab,
          props.currentYear.C3_431106800828
        )
      };
    }
  }

  fetchMainData = async () => {
    try {
      this.setState({ fetcinghMainData: true });
      const res = await http({ baseURL: this.props.baseURL }).getTable({
        resid
      });
      this.setState({
        mainData: res.data
      });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
    this.setState({ fetcinghMainData: false });
  };

  _formDataObj = {
    员工直评: {},
    员工年末直评: {}
  };
  /**
   * 获取后台窗体数据
   */
  fetchFormData = async () => {
    try {
      const pArr = [];
      pArr[0] = http({ baseURL: this.props.baseURL }).getFormData({
        resid,
        formName: '员工直评'
      });
      pArr[1] = http({ baseURL: this.props.baseURL }).getFormData({
        resid,
        formName: '员工年末直评'
      });
      const resArr = await Promise.all(pArr);
      this._formDataObj.员工直评 = dealControlArr(resArr[0].data.columns);
      this._formDataObj.员工年末直评 = dealControlArr(resArr[1].data.columns);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  modifiableTable = (record, resid) => {
    let result = false;
    const { residConfig } = this.props;
    if (!resid || !record.REC_ID) {
      return result;
    }
    switch (resid) {
      //年中自评-目标自评
      case residConfig.年中目标:
        if (
          !(
            record.C3_420949753683 !== 'Y' ||
            record.C3_420976746773 !== 'Y' ||
            record.C3_431106931302 !== '年中' ||
            record.C3_436733617722 == 'Y'
          )
        ) {
          result = true;
        }
        break;
      //年末自评-目标自评
      case residConfig.年末目标:
        if (
          !(
            record.C3_420949753683 !== 'Y' ||
            record.C3_420976746773 !== 'Y' ||
            record.C3_431106931302 !== '年末' ||
            record.C3_436734710960 == 'Y'
          )
        ) {
          result = true;
        }
        break;

      default:
        break;
    }
    return result;
  };

  submitTarget = stage => async () => {
    const { selectedData, mainData } = this.state;
    let modifyData = { REC_ID: selectedData.REC_ID };
    if (stage === 'middle') {
      modifyData.C3_436733617722 = 'Y';
    } else {
      modifyData.C3_436734710960 = 'Y';
    }
    try {
      this.setState({ submitLoading: true });
      const res = await http({ baseURL: this.props.baseURL }).modifyRecords({
        resid,
        data: [modifyData]
      });
      const newData = [...mainData];
      newData[newData.findIndex(item => item.REC_ID === selectedData.REC_ID)] =
        res.data[0];
      this.setState({
        selectedData: res.data[0],
        mainData: newData
      });
      message.success('提交成功');
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
    this.setState({ submitLoading: false });
  };

  handleListItemClick = data => this.setState({ selectedData: data });
  render() {
    const { years, currentYear, residConfig } = this.props;
    const {
      selectedYear,
      pagination,
      selectedData,
      selectedTableTab,
      tableConfig,
      selectedStage,
      fetcinghMainData,
      filterText,
      mainData,
      submitLoading
    } = this.state;
    return (
      <div className="direct-evaluate">
        <div className="target-emlpoyee-list">
          <header className="target-emlpoyee-list__header">
            <div className="header__left">
              <Select
                style={{ width: '100%' }}
                value={selectedYear}
                size="small"
                onChange={v => {
                  this.setState({ selectedYear: v });
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
            <DataList
              mainData={mainData}
              fetcinghMainData={fetcinghMainData}
              onClick={this.handleListItemClick}
              selectedData={selectedData}
              year={selectedYear}
              filterText={filterText}
            />
            <footer>{/* <Pagination {...pagination} size="small" /> */}</footer>
          </div>
        </div>
        <div className="direct-evaluate__right">
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
                  财年直评人：{selectedData.C3_425912302236}
                </div>
              </>
            ) : (
              '请选择一条记录'
            )}
          </header>
          <div className="direct-evaluate__right__table">
            <div className="direct-evaluate-table-tab">
              <div className="direct-evaluate-table-tab__left">
                <Select
                  style={{ width: 120 }}
                  value={selectedStage}
                  size="small"
                  onChange={v => {
                    this.setState({
                      selectedStage: v,
                      tableConfig: getTableConfig(selectedTableTab, v)
                    });
                  }}
                >
                  <Option value="年中">年中</Option>
                  <Option value="年末">年末</Option>
                </Select>
                {tableTab.map(tab => {
                  return (
                    <div
                      className={classnames('direct-evaluate-table-tab-item', {
                        'direct-evaluate-table-tab-item--selected':
                          tab.key === selectedTableTab
                      })}
                      key={tab.key}
                      onClick={() => {
                        this.setState({
                          selectedTableTab: tab.key,
                          tableConfig: getTableConfig(tab.key, selectedStage)
                        });
                      }}
                    >
                      {tab.title}
                    </div>
                  );
                })}
              </div>
              <div>
                {tableConfig.resid === residConfig.年中目标 ? (
                  <Button
                    type="primary"
                    size="small"
                    onClick={this.submitTarget('middle')}
                    disabled={
                      selectedData.C3_420949753683 !== 'Y' ||
                      selectedData.C3_420976746773 !== 'Y' ||
                      selectedData.C3_431106931302 !== '年中' ||
                      selectedData.C3_436733617722 == 'Y'
                    }
                    loading={submitLoading}
                  >
                    年中直评提交
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="small"
                    onClick={this.submitTarget('end')}
                    loading={submitLoading}
                    disabled={
                      selectedData.C3_420949753683 !== 'Y' ||
                      selectedData.C3_420976746773 !== 'Y' ||
                      selectedData.C3_431106931302 !== '年末' ||
                      selectedData.C3_436734710960 == 'Y'
                    }
                  >
                    年末直评提交
                  </Button>
                )}
              </div>
            </div>
            {selectedYear &&
              (selectedYear !== currentYear.C3_420161949106 ||
                selectedStage !== currentYear.C3_431106800828) && (
                <div style={{ color: '#F5222D' }}>
                  注意：当前选择的财年是{selectedYear},当前选择的评价阶段是
                  {selectedStage}。
                </div>
              )}
            <div className="direct-evaluate__tabledata-container">
              {selectedData.REC_ID
                ? tableMode.some(item => item === tableConfig.mode)
                  ? this.renderTable()
                  : this.renderForm()
                : '请选择一条记录'}
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderTable = () => {
    const { tableConfig, selectedData } = this.state;
    const { baseURL } = this.props;

    const tableDataProps = {};
    if (tableConfig.mode === 'main') {
      tableDataProps.resid = tableConfig.resid;
    } else if (tableConfig.mode === 'sub') {
      tableDataProps.subresid = tableConfig.resid;
      tableDataProps.resid = resid;
      tableDataProps.dataMode = tableConfig.mode;
      tableDataProps.hostrecid = selectedData.REC_ID;
    } else {
      return null;
    }
    tableDataProps.hasAdd = false;
    tableDataProps.hasModify = false;
    tableDataProps.hasDelete = false;
    tableDataProps.hasRowAdd = false;
    tableDataProps.hasRowModify = false;
    tableDataProps.hasRowDelete = false;
    tableDataProps.hasRowView = false;
    tableDataProps.hasRowEdit = false;
    tableDataProps.actionBarWidth = 150;
    tableDataProps.wrappedComponentRef = element =>
      (this.tableDataRef = element);
    tableDataProps.refTargetComponentName = 'TableData';
    const modifiable = this.modifiableTable(selectedData, tableConfig.resid);
    console.log('modifiable', modifiable);
    // const modifiable = true;
    if (modifiable) {
      tableDataProps.hasAdd = true;
      tableDataProps.hasDelete = true;
      tableDataProps.hasRowEdit = true;
      tableDataProps.hasRowEditAdd = true;
      tableDataProps.actionBarFixed = false;
      tableDataProps.actionBarWidth = 150;
      tableDataProps.isUseFormDefine = true;
      tableDataProps.rowEditFormName = 'default1';
    }

    return (
      <TableData
        key={tableConfig.resid}
        {...tableDataProps}
        baseURL={baseURL}
      />
    );
  };

  renderForm = () => {
    const { selectedData, tableConfig } = this.state;
    let operation = 'view';
    const formName = tableConfig.formName;
    if (formName === '员工直评') {
      if (
        selectedData.C3_420949753683 == 'Y' &&
        selectedData.C3_420976746773 == 'Y' &&
        selectedData.C3_431106931302 == '年中' &&
        selectedData.C3_436733617722 !== 'Y'
      ) {
        operation = 'modify';
      }
    } else if (formName === '员工年末直评') {
      if (
        selectedData.C3_420949753683 == 'Y' &&
        selectedData.C3_420976746773 == 'Y' &&
        selectedData.C3_431106931302 == '年末' &&
        selectedData.C3_431256959975 !== 'Y' &&
        selectedData.C3_436734710960 !== 'Y'
      ) {
        operation = 'modify';
      }
    }
    return (
      <FormData
        info={{ dataMode: 'main', resid }}
        operation={operation}
        key={selectedData.REC_ID + tableConfig.formName}
        data={getDataProp(
          this._formDataObj[tableConfig.formName],
          selectedData,
          true,
          false,
          false
        )}
        record={selectedData}
        useAbsolute={true}
        saveMode="single"
        resid={resid}
        // formProps={{ width: 500 }}
      />
    );
  };
}

export default DirectEvaluate;

const DataList = React.memo(
  ({ fetcinghMainData, mainData, selectedData, onClick, year, filterText }) => {
    if (fetcinghMainData) {
      return <Spin />;
    }
    let filtedData = mainData.filter(item => item.C3_420150922019 === year);
    if (filterText && filterText != 0) {
      filtedData = filtedData.filter(item => {
        return (item.C3_420148204015 + '').includes(filterText);
      });
    }
    if (!filtedData.length) {
      return <Empty />;
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
