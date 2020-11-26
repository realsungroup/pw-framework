import React from 'react';
import './MyAssessmentTable.less';
import { Menu, Select, Input, Button, message, Icon, Modal } from 'antd';
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
const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.AchievementsBaseURL;
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
    resid: subresids.员工绩效反馈,
    mode: 'main',
    parent: '员工绩效反馈'
  },
  '12': {
    resid: subresids.员工绩效反馈历史,
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
    fetching: true,
    submitBtnLoading: false,
    modalVisible: false,
    selectedInterview: {},
    fetcingForm: true
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
      const res = await http({ baseURL }).getTable({
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
    财年评语查看: {},
    default: {}
  };
  /**
   * 获取后台窗体数据
   */
  fetchFormData = async () => {
    const param = { baseURL };
    try {
      const pArr = [];
      pArr[0] = http(param).getFormData({
        resid: mainResid,
        formName: '员工自评'
      });
      pArr[1] = http(param).getFormData({
        resid: mainResid,
        formName: '员工年末自评'
      });
      pArr[2] = http(param).getFormData({
        resid: mainResid,
        formName: '财年评语查看'
      });
      pArr[3] = http(param).getFormData({
        resid: subresids.员工绩效反馈,
        formName: 'default'
      });
      this.setState({ fetcingForm: true });
      const resArr = await Promise.all(pArr);
      this._formDataObj.员工自评 = dealControlArr(resArr[0].data.columns);
      this._formDataObj.员工年末自评 = dealControlArr(resArr[1].data.columns);
      this._formDataObj.财年评语查看 = dealControlArr(resArr[2].data.columns);
      this._formDataObj.default = dealControlArr(resArr[3].data.columns);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      this.setState({ fetcingForm: false });
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
        if (record.C3_420949377789 == 'Y' && record.C3_420953811304 !== 'Y') {
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
      const res = await http({ baseURL }).getTable({
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

  handleSubmitTarget = async isSubmit => {
    const { selectedMainData, mainData } = this.state;
    try {
      this.setState({
        submitBtnLoading: true
      });
      const res = await http({ baseURL }).modifyRecords({
        resid: mainResid,
        data: [{ REC_ID: selectedMainData.REC_ID, C3_420953811304: isSubmit }]
      });
      const newData = [...mainData];
      newData[
        newData.findIndex(item => item.REC_ID === selectedMainData.REC_ID)
      ] = res.data[0];
      this.setState({
        selectedMainData: res.data[0],
        mainData: newData,
        submitBtnLoading: false
      });
    } catch (error) {
      console.error(error);
      message.error(error.message);
      this.setState({
        submitBtnLoading: false
      });
    }
  };

  /**
   * 提交年中目标
   */
  showComfirmSubmitMiddleYear = () => {
    const { selectedMainData, mainData } = this.state;
    Modal.confirm({
      content: '请确定您的目标自评已完成。选择“确定”后您的优缺点将一并提交',
      onOk: async () => {
        try {
          this.setState({
            submitBtnLoading: true
          });
          const res = await http({ baseURL }).modifyRecords({
            resid: mainResid,
            data: [{ REC_ID: selectedMainData.REC_ID, C3_431169212491: 'Y' }]
          });
          const newData = [...mainData];
          newData[
            newData.findIndex(item => item.REC_ID === selectedMainData.REC_ID)
          ] = res.data[0];
          this.setState({
            selectedMainData: res.data[0],
            mainData: newData,
            submitBtnLoading: false
          });
        } catch (error) {
          console.error(error);
          message.error(error.message);
          this.setState({
            submitBtnLoading: false
          });
        }
      }
    });
  };
  /**
   * 提交年末目标
   */
  showComfirmSubmitEndYear = () => {
    const { selectedMainData, mainData } = this.state;
    Modal.confirm({
      content: '请确定您的目标自评已完成。选择“确定”后您的优缺点将一并提交',
      onOk: async () => {
        try {
          this.setState({
            submitBtnLoading: true
          });
          const res = await http({ baseURL }).modifyRecords({
            resid: mainResid,
            data: [{ REC_ID: selectedMainData.REC_ID, C3_436734687131: 'Y' }]
          });
          const newData = [...mainData];
          newData[
            newData.findIndex(item => item.REC_ID === selectedMainData.REC_ID)
          ] = res.data[0];
          this.setState({
            selectedMainData: res.data[0],
            mainData: newData,
            submitBtnLoading: false
          });
        } catch (error) {
          console.error(error);
          message.error(error.message);
          this.setState({
            submitBtnLoading: false
          });
        }
      }
    });
  };
  closeModal = () =>
    this.setState({ modalVisible: false, selectedInterview: {} });

  afterSave = () => {
    this.setState({ modalVisible: false }, () =>
      this.tableDataRef.handleRefresh()
    );
  };

  render() {
    const {
      currentYear,
      mainData,
      selectedMainData,
      tableConfig,
      isShink,
      fetching,
      submitBtnLoading,
      modalVisible,
      selectedInterview
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
          {selectedMainData.REC_ID && (
            <div className="my-assessment-table__table-container">
              <div className="my-assessment-table__table__top">
                {tableConfig.parent === '目标' &&
                  selectedMainData.C3_420949377789 === 'Y' &&
                  (selectedMainData.C3_420953811304 === 'Y' ? (
                    <Button
                      type="danger"
                      size="small"
                      onClick={() => this.handleSubmitTarget('N')}
                      loading={submitBtnLoading}
                    >
                      取消提交目标
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => this.handleSubmitTarget('Y')}
                      loading={submitBtnLoading}
                    >
                      提交目标
                    </Button>
                  ))}
                {tableConfig.parent === '年中自评' &&
                  selectedMainData.C3_431169212491 !== 'Y' && (
                    <Button
                      type="primary"
                      size="small"
                      onClick={this.showComfirmSubmitMiddleYear}
                      loading={submitBtnLoading}
                    >
                      提交年中自评
                    </Button>
                  )}
                {tableConfig.parent === '年末自评' &&
                  selectedMainData.C3_436734687131 !== 'Y' && (
                    <Button
                      type="primary"
                      size="small"
                      onClick={this.showComfirmSubmitEndYear}
                      loading={submitBtnLoading}
                    >
                      提交年末自评
                    </Button>
                  )}
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
          )}
        </div>
        <Modal
          visible={modalVisible}
          title="面谈是否完成"
          width={800}
          footer={null}
          onCancel={this.closeModal}
          destroyOnClose
        >
          {modalVisible && (
            <FormData
              info={{ dataMode: 'main', resid: subresids.员工绩效反馈 }}
              operation="modify"
              data={getDataProp(
                this._formDataObj.default,
                selectedInterview,
                true,
                false,
                false
              )}
              record={selectedInterview}
              // useAbsolute={true}
              // formProps={{ width: 500 }}
              onCancel={this.closeModal}
              onSuccess={this.afterSave}
            />
          )}
        </Modal>
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
    tableDataProps.hasRowSelection = true;
    tableDataProps.isUseFormDefine = false;
    // tableDataProps.noWidthFieldsIndex = 1;
    const modifiable = this.modifiableTable(
      selectedMainData,
      tableConfig.resid
    );
    if (modifiable) {
      tableDataProps.hasAdd = true;
      tableDataProps.hasDelete = true;
      tableDataProps.hasRowEdit = true;
      tableDataProps.hasRowEditAdd = true;
      tableDataProps.actionBarWidth = 150;
      tableDataProps.actionBarFixed = false;
      if (
        tableConfig.resid === subresids.endYearTargetSelf ||
        tableConfig.resid === subresids.middleYearTargetSelf
      ) {
        tableDataProps.isUseFormDefine = true;
        tableDataProps.rowEditFormName = 'default1';
      }
    }
    if (
      tableConfig.resid === subresids.员工绩效反馈 ||
      tableConfig.resid === subresids.员工绩效反馈历史
    ) {
      tableDataProps.cmswhere = `C3_558098038537 = '${selectedMainData.C3_420148203323}' and C3_558108462803 ='${selectedMainData.C3_420150922019}'`;
    }
    if (tableConfig.resid === subresids.员工绩效反馈) {
      tableDataProps.actionBarExtra = ({
        dataSource = [],
        selectedRowKeys = []
      }) => (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            if (selectedRowKeys.length !== 1) {
              return message.info('请选择一条记录');
            }
            const record = dataSource.find(data => {
              return data.REC_ID == selectedRowKeys[0];
            });
            this.setState({ modalVisible: true, selectedInterview: record });
          }}
        >
          面谈是否完成
        </Button>
      );
      tableDataProps.wrappedComponentRef = element =>
        (this.tableDataRef = element);
      tableDataProps.refTargetComponentName = 'TableData';
    }

    return (
      <TableData
        key={tableConfig.resid}
        {...tableDataProps}
        isWrap={true}
        subtractH={180}
      />
    );
  };

  renderForm = () => {
    const { selectedMainData, tableConfig, fetcingForm } = this.state;
    if (fetcingForm) {
      return message('正在获取窗体数据，请稍等。');
    }
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
