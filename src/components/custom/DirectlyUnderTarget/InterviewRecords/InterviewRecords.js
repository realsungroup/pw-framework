import React from 'react';
import './InterviewRecords.less';
import { Select, Input, Checkbox, Button, message, Empty } from 'antd';
import http from 'Util20/api';
import Spin from 'Common/ui/Spin';
import moment from 'moment';
import classnames from 'classnames';
import TableData from 'Common/data/TableData';

function stopPropagation(e) {
  e.stopPropagation();
}
const { Option } = Select;
const { Search } = Input;
/**
 * 面谈记录
 */
class InterviewRecords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainData: [],
      yearMainData: [],
      selectedData: {},
      fetcinghMainData: true,
      selectedYear: '',
      filterText: ''
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
      const res = await http({baseURL:this.props.baseURL}).getTable({ resid: residConfig.直属面谈记录 });
      this.setState({
        mainData: res.data,
        yearMainData: res.data.filter(
          item => item.C3_421405230975 === currentYear.C3_420161949106
        )
      });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
    this.setState({ fetcinghMainData: false });
  };

  handleListItemClick = data => this.setState({ selectedData: data });

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
    const { years, residConfig, baseURL } = this.props;
    return (
      <div className="interview-records">
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
                      item => item.C3_421405230975 === v
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
            <DataList
              mainData={yearMainData}
              fetcinghMainData={fetcinghMainData}
              onClick={this.handleListItemClick}
              selectedData={selectedData}
              filterText={filterText}
              checkedData={checkedData}
            />
          </div>
        </div>
        <div className="interview-records__right">
          <header className="target-employee-info">
            {selectedData.REC_ID ? (
              <>
                <div className="employee-info-item">
                  姓名：{selectedData.C3_227192484125}
                </div>
                <div className="employee-info-item">
                  英文名：{selectedData.C3_227192496109}
                </div>
                <div className="employee-info-item">
                  工号：{selectedData.C3_227192472953}
                </div>
                <div className="employee-info-item">
                  部门：{selectedData.C3_227212499515}
                </div>
                <div className="employee-info-item">
                  入司日期：
                  {moment(selectedData.C3_227193233656).format('YYYY-MM-DD')}
                </div>
                <div className="employee-info-item">
                  财年直评人：{selectedData.C3_420056541135}
                </div>
              </>
            ) : (
              '请选择一条记录'
            )}
          </header>
          <div className="approval-target__right__table">
            {selectedData.REC_ID && (
              <TableData
                subresid={residConfig.面谈记录}
                resid={residConfig.直属面谈记录}
                dataMode="sub"
                hostrecid={selectedData.REC_ID}
                actionBarWidth={200}
                hasRowEdit={true}
                hasRowEditAdd={true}
                recordFormUseAbsolute={true}
                actionBarFixed={false}
                hasRowModify={false}
                hasModify={false}
                isSetColumnWidth={false}
                isWrap={true}
                formProps={{ width: 600 }}
                baseURL={baseURL}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default InterviewRecords;

const DataList = React.memo(
  ({ fetcinghMainData, mainData, selectedData, onClick, filterText }) => {
    if (fetcinghMainData) {
      return <Spin />;
    }
    let filtedData = mainData;
    if (filterText && filterText != 0) {
      filtedData = filtedData.filter(item => {
        return (item.C3_227192472953 + '').includes(filterText);
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
            <div>
              <div>
                {data.C3_227192484125}/{data.C3_227192496109}
              </div>
              <div>工号：{data.C3_227192472953}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);
