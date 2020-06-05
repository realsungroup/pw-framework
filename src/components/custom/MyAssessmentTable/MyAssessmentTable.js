import React from 'react';
import './MyAssessmentTable.less';
import { Menu, Select, Input, Button, message, Icon } from 'antd';
import http from 'Util20/api';
import classnames from 'classnames';
import TableData from 'Common/data/TableData';
import FormData from 'Common/data/FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';
import Spin from 'Common/ui/Spin';

const { SubMenu } = Menu;
const { Search } = Input;
const { Option } = Select;

const subresids = window.pwConfig[process.env.NODE_ENV].achievementSubResid;

const tableMode = ['sub', 'main'];
const _tableConfig = {
  '1': {
    resid: subresids.target, //子表
    mode: 'sub',
    parent: '目标'
  },
  '2': {
    resid: subresids.history, //子表
    mode: 'sub',
    parent: '目标'
  },
  '3': {
    resid: subresids.middleYearTargetSelf, //子表
    mode: 'sub',
    parent: '年中自评'
  },
  '4': {
    mode: 'form',
    formName: '员工自评',
    parent: '年中自评'
  },
  '5': {
    resid: subresids.endYearTargetSelf, //子表
    mode: 'sub',
    parent: '年末自评'
  },
  '6': {
    mode: 'form',
    formName: '员工年末自评',
    parent: '年末自评'
  },
  '7': {
    resid: subresids.targetView, //子表
    mode: 'sub',
    parent: '直评查询'
  },
  '8': {
    formName: '财年评语查看',
    mode: 'form',
    parent: '直评查询'
  },
  '9': {
    resid: subresids.gradeRate, //子表
    mode: 'sub',
    parent: '直评查询'
  },
  '10': {
    resid: subresids.interview, //子表
    mode: 'sub',
    parent: '面谈记录'
  },
  '11': {
    resid: 558178954112,
    mode: 'main',
    parent: '员工绩效反馈'
  },
  '12': {
    resid: 558638569486,
    mode: 'main',
    parent: '员工绩效反馈'
  }
};

const mainResid = 462400643808;
/**
 * 我的评估表
 */
class MyAssessmentTable extends React.Component {
  state = {
    currentYear: {},
    mainData: [],
    selectedMainData: {},
    tableConfig: {},
    isShink: false,
    fetching: true
  };
  async componentDidMount() {
    await this.fetchMainData();
    this.setState({ fetching: false });
    this.fetchFYear();
    this.fetchFormData();
  }

  /**
   * 获取当前财年情况
   */
  fetchFYear = async () => {
    try {
      const res = await http().getTable({
        resid: '420161931474',
        cmswhere: `C3_420162027612 = 'Y'`
      });
      this.setState({ currentYear: res.data[0] });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  fetchMainData = async () => {
    try {
      const res = await http().getTable({
        resid: mainResid
      });
      this.setState({ mainData: res.data });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  _formDataObj = {
    员工自评: {},
    员工年末自评: {},
    财年评语查看: {}
  };
  /**
   * 获取后台窗体数据
   */
  fetchFormData = async () => {
    try {
      const pArr = [];
      pArr[0] = http().getFormData({ resid: mainResid, formName: '员工自评' });
      pArr[1] = http().getFormData({
        resid: mainResid,
        formName: '员工年末自评'
      });
      pArr[2] = http().getFormData({
        resid: mainResid,
        formName: '财年评语查看'
      });
      const resArr = await Promise.all(pArr);
      this._formDataObj.员工自评 = dealControlArr(resArr[0].data.columns);
      this._formDataObj.员工年末自评 = dealControlArr(resArr[1].data.columns);
      this._formDataObj.财年评语查看 = dealControlArr(resArr[2].data.columns);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };
  modifiableTable = (record, resid) => {
    let result = false;
    if (!resid || !record.REC_ID) {
      return result;
    }
    switch (resid) {
      //年中自评-目标自评
      case subresids.middleYearTargetSelf:
        if (
          record.C3_420949753683 == 'Y' &&
          record.C3_420976746773 == 'Y' &&
          record.C3_431106931302 == '年中' &&
          record.C3_431256957943 !== 'Y' &&
          record.C3_431169212491 !== 'Y'
        ) {
          result = true;
        }
        break;
      //年末自评-目标自评
      case subresids.endYearTargetSelf:
        if (
          record.C3_420949753683 == 'Y' &&
          record.C3_420976746773 == 'Y' &&
          record.C3_431106931302 == '年末' &&
          record.C3_431256959975 !== 'Y' &&
          record.C3_436734687131 !== 'Y'
        ) {
          result = true;
        }
        break;
      // 目标
      case subresids.target:
        if (record.C3_420949377789 == 'Y') {
          result = true;
        }
        break;
      default:
        break;
    }
    return result;
  };
  handleShinkChange = () => {
    this.setState({ isShink: !this.state.isShink });
  };

  handleSearch = async v => {
    try {
      this.setState({ fetching: true });
      const res = await http().getTable({
        resid: mainResid,
        key: v
      });
      this.setState({ mainData: res.data });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
    this.setState({ fetching: false });
  };

  render() {
    const {
      currentYear,
      mainData,
      selectedMainData,
      tableConfig,
      isShink,
      fetching
    } = this.state;
    return (
      <div className="my-assessment-table">
        <div
          className={classnames('my-assessment-table__main', {
            'my-assessment-table__main--shink': isShink
          })}
        >
          <div className="my-assessment-table__main-container">
            <header className="my-assessment-table__main__header">
              <Icon
                type={isShink ? 'menu-unfold' : 'menu-fold'}
                className="my-assessment-table-shrink-btn"
                onClick={this.handleShinkChange}
              />
            </header>
            <Search
              placeholder="输入工号查询"
              className="my-assessment-table__search"
              size="small"
              onSearch={this.handleSearch}
              loading={true}
            />
            {fetching && <Spin />}
            <div className="my-assessment-table__main__list">
              {mainData.map(data => {
                return (
                  <div
                    key={data.REC_ID}
                    className={classnames(
                      'my-assessment-table__main__list-item',
                      {
                        'my-assessment-table__main__list-item--selected':
                          data.REC_ID == selectedMainData.REC_ID
                      }
                    )}
                    onClick={() => {
                      this.setState({ selectedMainData: data });
                    }}
                  >
                    <div className="my-assessment-table__main__list-item-year">
                      {data.C3_420150922019}
                    </div>
                    <div className="my-assessment-table__main__list-item__left">
                      <div>财年直评人：{data.C3_425912302236}</div>
                      <div>当前直评人：{data.C3_420309049218}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="my-assessment-table__menu">
          <Menu
            mode="inline"
            style={{ width: '100%' }}
            onSelect={param => {
              this.setState({ tableConfig: _tableConfig[param.key] });
            }}
          >
            <SubMenu key="sub1" title="目标">
              <Menu.Item key="1">目标</Menu.Item>
              <Menu.Item key="2">历史记录</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title="年中自评">
              <Menu.Item key="3">目标自评</Menu.Item>
              <Menu.Item key="4">优缺点</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" title="年末自评">
              <Menu.Item key="5">目标自评</Menu.Item>
              <Menu.Item key="6">优缺点 </Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title="直评查询">
              <Menu.Item key="7">目标查看</Menu.Item>
              <Menu.Item key="8">评语查看</Menu.Item>
              <Menu.Item key="9">评级评优记录</Menu.Item>
            </SubMenu>
            <SubMenu key="sub5" title="面谈记录">
              <Menu.Item key="10">面谈记录</Menu.Item>
            </SubMenu>
            <SubMenu key="sub6" title="员工绩效反馈">
              <Menu.Item key="11">员工绩效反馈</Menu.Item>
              <Menu.Item key="12">历史记录</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
        <div className="my-assessment-table__table">
          <div className="my-assessment-table__table-container">
            <div className="my-assessment-table__table__top">
              <Button type="primary" size="small">
                提交目标
              </Button>
              <span className="current-stage">
                当前阶段：{currentYear.C3_431106800828}
              </span>
            </div>
            <div className="my-assessment-tabledata-container">
              {tableConfig.mode &&
                (tableMode.some(item => item === tableConfig.mode)
                  ? this.renderTable()
                  : this.renderForm())}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderTable = () => {
    const { tableConfig, selectedMainData } = this.state;

    const tableDataProps = {};
    if (tableConfig.mode === 'main') {
      tableDataProps.resid = tableConfig.resid;
    } else if (tableConfig.mode === 'sub') {
      tableDataProps.subresid = tableConfig.resid;
      tableDataProps.resid = mainResid;
      tableDataProps.dataMode = tableConfig.mode;
      tableDataProps.hostrecid = selectedMainData.REC_ID;
    } else {
      return null;
    }
    tableDataProps.hasAdd = false;
    tableDataProps.hasModify = false;
    tableDataProps.hasDelete = false;
    tableDataProps.hasRowAdd = false;
    tableDataProps.hasRowModify = false;
    tableDataProps.hasRowDelete = false;
    tableDataProps.hasRowEdit = false;
    tableDataProps.actionBarWidth = 150;
    const modifiable = this.modifiableTable(
      selectedMainData,
      tableConfig.resid
    );
    if (modifiable) {
      tableDataProps.hasAdd = true;
      tableDataProps.hasDelete = true;
      tableDataProps.hasRowEdit = true;
      tableDataProps.hasRowEditAdd = true;
      tableDataProps.actionBarFixed = false;
      tableDataProps.isUseFormDefine = false;
    }
    if (
      tableConfig.resid === 558178954112 ||
      tableConfig.resid === 558638569486
    ) {
      tableDataProps.cmswhere = `C3_558098038537 = '${selectedMainData.C3_420148203323}' and C3_558108462803 ='${selectedMainData.C3_420150922019}'`;
    }

    return <TableData key={tableConfig.resid} {...tableDataProps} />;
  };

  renderForm = () => {
    const { selectedMainData, tableConfig } = this.state;
    let operation = 'view';
    const formName = tableConfig.formName;
    if (formName === '员工自评') {
      if (
        selectedMainData.C3_420949753683 == 'Y' &&
        selectedMainData.C3_420976746773 == 'Y' &&
        selectedMainData.C3_431106931302 == '年中' &&
        selectedMainData.C3_431256957943 !== 'Y' &&
        selectedMainData.C3_431169212491 !== 'Y'
      ) {
        operation = 'modify';
      }
    } else if (formName === '员工年末自评') {
      if (
        selectedMainData.C3_420949753683 == 'Y' &&
        selectedMainData.C3_420976746773 == 'Y' &&
        selectedMainData.C3_431106931302 == '年末' &&
        selectedMainData.C3_431256959975 !== 'Y' &&
        selectedMainData.C3_436734687131 !== 'Y'
      ) {
        operation = 'modify';
      }
    } else if (formName === '财年评语查看') {
    }
    return (
      <FormData
        info={{ dataMode: 'main', resid: mainResid }}
        operation={operation}
        key={selectedMainData.REC_ID + tableConfig.formName}
        data={getDataProp(
          this._formDataObj[tableConfig.formName],
          selectedMainData,
          true,
          false,
          false
        )}
        record={selectedMainData}
        useAbsolute={true}
        saveMode="single"
        resid={mainResid}
        // formProps={{ width: 500 }}
      />
    );
  };
}

export default MyAssessmentTable;
