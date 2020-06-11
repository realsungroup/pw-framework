import React from 'react';
import {
  Menu,
  Select,
  Input,
  Pagination,
  Tree,
  Button,
  message,
  Empty
} from 'antd';
import http, { makeCancelable } from 'Util20/api';
import moment from 'moment';
import { getItem } from 'Util20/util';
import Spin from 'Common/ui/Spin';
import TableData from 'Common/data/TableData';
import FormData from 'Common/data/FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';

const { SubMenu } = Menu;
const { Search } = Input;
const { TreeNode } = Tree;
const { Option } = Select;

const subresids = window.pwConfig[process.env.NODE_ENV].achievementSubResid;
const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureBaseURL;
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
class ByOrganization extends React.Component {
  state = {
    treeData: [],
    loading: false,
    fetching: false,
    tableConfig: {},
    selectedMainData: {},
    mainData: [],
    selectedYear: '',
    selectedEmployee: ''
  };

  componentDidMount() {
    const userInfo = JSON.parse(getItem('userInfo'));
    this.userNo = userInfo ? userInfo.UserInfo.EMP_USERCODE : '';
    this.getData();
    this.fetchFormData();
  }
  static getDerivedStateFromProps(props, state) {
    if (!state.selectedYear) {
      return { selectedYear: props.currentYear.C3_420161949106 };
    }
  }
  getData = async (needLoading = true) => {
    const { resid, idField, pidField, procedureConfig, rootId } = this.props;
    const options = {
      ...procedureConfig,
      resid,
      paravalues: moment().format('YYYYMMDD'),
      idcolumn: idField,
      pidcolumn: pidField,
      id: this.userNo,
      totallevels: 200
    };
    needLoading && this.setState({ loading: true });
    try {
      const httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      this.p1 = makeCancelable(http(httpParams).getByProcedureWithId(options));
      const res = await this.p1.promise;
      const treeData = this.getTreeData(res.data);
      this.setState({ treeData, loading: false });
    } catch (error) {
      console.error(error);
      message.error(error.message);
      this.setState({ loading: false });
    }
  };

  getTreeData = (data = []) => {
    let rootNode = [];
    const { idField, pidField } = this.props;

    rootNode = data.filter(item => {
      return !data.some(i => i[idField] == item[pidField]);
    });
    rootNode.forEach(item => {
      this.getChildrenNodes(item, data);
    });
    // console.log(rootNode);
    return rootNode;
  };

  getChildrenNodes = (node = {}, allNode = []) => {
    const { idField, pidField } = this.props;
    const children = allNode.filter(item => {
      return item[pidField] === node[idField];
    });
    if (children.length) {
      node.children = children;
      children.forEach(item => {
        this.getChildrenNodes(item, allNode);
      });
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
    const mainResid = subresids.myAssessment;
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
      pArr[3] = http().getFormData({
        resid: subresids.员工绩效反馈,
        formName: 'default'
      });
      const resArr = await Promise.all(pArr);
      this._formDataObj.员工自评 = dealControlArr(resArr[0].data.columns);
      this._formDataObj.员工年末自评 = dealControlArr(resArr[1].data.columns);
      this._formDataObj.财年评语查看 = dealControlArr(resArr[2].data.columns);
      this._formDataObj.default = dealControlArr(resArr[3].data.columns);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  fetchmyAssessment = async id => {
    const { selectedYear } = this.state;
    try {
      this.setState({ fetching: true });
      const res = await http().getTable({
        resid: subresids.绩效评估表,
        cmswhere: `C3_420148203323 = '${id}'`
      });
      this.setState({
        mainData: res.data,
        selectedMainData: res.data.find(
          item => item.C3_420150922019 === selectedYear
        )
      });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
    this.setState({ fetching: false });
  };

  onTreeNodeSelect = param => {
    if (param.length) {
      this.setState({ selectedEmployee: param[0] });
      this.fetchmyAssessment(param[0]);
    } else {
      this.setState({
        selectedEmployee: '',
        mainData: [],
        selectedMainData: {}
      });
    }
  };

  render() {
    const {
      treeData,
      loading,
      tableConfig,
      selectedYear,
      selectedEmployee,
      mainData
    } = this.state;
    const { years } = this.props;
    return (
      <div className="subordinate-achievements">
        <div className="subordinate-achievements__menu">
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
        <div className="subordinate-achievements__main">
          <div className="subordinate-achievements__main-container">
            {loading && <Spin />}
            <Tree
              onSelect={this.onTreeNodeSelect}
              checkable={false}
              defaultExpandAll
            >
              {this.renderTree(treeData)}
            </Tree>
          </div>
        </div>
        <div className="subordinate-achievements__table">
          <div className="subordinate-achievements__table-container">
            <Select
              style={{ width: 100, marginBottom: 8 }}
              value={selectedYear}
              size="small"
              onChange={v => {
                this.setState({
                  selectedYear: v,
                  selectedMainData: mainData.find(
                    item => item.C3_420150922019 === v
                  )
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
            <div className="subordinate-achievements-tabledata-container">
              {tableConfig.mode && selectedEmployee ? (
                tableMode.some(item => item === tableConfig.mode) ? (
                  this.renderTable()
                ) : (
                  this.renderForm()
                )
              ) : (
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  请在左侧选择要查看的内容和员工
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderTree = (data = []) => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode key={item.C3_305737857578} title={item.C3_419343735913}>
            {this.renderTree(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode key={item.C3_305737857578} title={item.C3_419343735913} />
      );
    });
  };
  renderTable = () => {
    const {
      tableConfig,
      selectedMainData,
      fetching,
      selectedYear
    } = this.state;
    if (fetching) {
      return <Spin />;
    }
    if (!selectedMainData) {
      return (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          该员工没有{selectedYear}财年的数据
        </div>
      );
    }
    const mainResid = subresids.myAssessment;
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
    if (
      tableConfig.resid === subresids.员工绩效反馈 ||
      tableConfig.resid === subresids.员工绩效反馈历史
    ) {
      tableDataProps.cmswhere = `C3_558098038537 = '${selectedMainData.C3_420148203323}' and C3_558108462803 ='${selectedMainData.C3_420150922019}'`;
    }

    return (
      <TableData
        key={tableConfig.resid}
        {...tableDataProps}
        subtractH={160}
        isUseFormDefine={false}
      />
    );
  };

  renderForm = () => {
    const {
      selectedMainData,
      tableConfig,
      fetching,
      selectedYear
    } = this.state;
    const operation = 'view';
    const mainResid = subresids.myAssessment;
    if (fetching) {
      return <Spin />;
    }
    if (!selectedMainData) {
      return (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          该员工没有{selectedYear}财年的数据
        </div>
      );
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

export default ByOrganization;
