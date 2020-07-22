import React, { Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  Modal,
  Input,
  message,
  Spin,
  Menu,
  Icon,
  Avatar,
  Button,
  Tree,
  Tabs
} from "antd";
import "./LzMenuContainer.less";
import { LzTable } from "../../../loadableComponents";
import MenuMultiple from "./MenuMultiple";
import { getMainTableData, getFormData, getSubTableData } from "Util/api";
import dealControlArr from "Util/controls";
import LzRowCols from "UnitComponent/components/LzRowCols";
import { LzModal } from "../loadableCustom";
import LabExaminationChart from "./MenuMultiple/LabExaminationChart";

const patientPeriodID = 648300111771; //周期信息
const baseInfoID = 648300066963; //基本信息
const manID = 648300080566; //男方病历
const womanID = 648300096608; //女方病历
const Search = Input.Search;
const SubMenu = Menu.SubMenu;
const { TreeNode } = Tree;
const { TabPane } = Tabs;

const getCanChooseFields = canOpControlArr => {
  const arr = assortFields(canOpControlArr);
  return arr;
};
const assortFields = controlArr => {
  if (!controlArr || !controlArr.length) {
    return [];
  }
  const filteredControlArr = controlArr.filter(
    control => control.ColResDataSort
  );
  const klasses = [];
  filteredControlArr.forEach(control => {
    let i;
    if (
      !klasses.some((klass, index) => {
        if (klass.title === control.ColResDataSort) {
          i = index;
          return true;
        }
      })
    ) {
      klasses.push({
        title: control.ColResDataSort,
        renderControlArr: [control]
      });
    } else {
      klasses[i].renderControlArr.push(control);
    }
  });
  return klasses;
};

/**
 * 菜单容器组件
 */
export default class LzMenuContainer extends React.Component {
  static propTypes = {
    /**
     * 模式
     * 可选：'single' 单张子表 | 'multiple' 多张子表
     * 默认：'single'
     */
    mode: PropTypes.oneOf(["single", "multiple"]).isRequired,

    /**
     * 主表 id
     * 默认：-
     */
    resid: PropTypes.number,

    /**
     * 获取导航列表的 resid（在 mode 为 'multiple' 时需要该参数）
     */
    navListResid: PropTypes.number,

    /**
     * 表格记录
     * 默认：-
     */
    record: PropTypes.object,

    /**
     * 右侧没有数据时的提示文字
     * 默认：''
     */
    noDataTip: PropTypes.string,

    /**
     * 搜索的字段
     * 默认：-
     */
    // 例如：
    // [
    //   {
    //     text: '姓名',
    //     innerFieldName: 'yyy',
    //   },
    //   {
    //     text: '工号',
    //     innerFieldName: 'xxx',
    //   }
    // ]
    searchFields: PropTypes.array.isRequired,

    /**
     * 用户信息的内部字段
     * 默认：[]
     */
    // 例如：
    // [
    //   {
    //     label: '姓名',
    //     innerFieldName: 'C3_590510740042'
    //   },
    //   {
    //     label: '工号',
    //     innerFieldName: 'C3_590510737521'
    //   },
    //   {
    //     label: '职务',
    //     innerFieldName: 'C3_590512134594'
    //   },
    //   {
    //     label: '部门',
    //     innerFieldName: 'C3_590510763625'
    //   },
    // ]
    userInfoFields: PropTypes.array,

    /**
     * 默认组件的 props
     * 默认：-
     */
    defaultComponentProps: PropTypes.object,

    /**
     * 搜索文案
     * 默认：'请选择员工'
     */
    searchText: PropTypes.string,

    /**
     * 显示头像的内部字段名称
     * 默认：''（使用 antd 默认的头像）
     */
    avatarFieldName: PropTypes.string,

    /**
     * 是否有字段的 label
     * 可选：true | false
     * 默认：true
     */
    hasFieldsLabel: PropTypes.bool,

    /**
     * 用户字段的显示模式配置
     * 默认：{ mode: 'block' }
     */
    userFieldsViewConfig: PropTypes.object
    // 例如：
    // {
    //   mode: 'inline', // 'block' 每个字段占一行 | 'inline' 每一行可放多个字段
    //   colCount: 2 // 在 mode 为 'inline' 时，每一行的字段数量
    // }
  };
  static defaultProps = {
    mode: "single",
    userInfoFields: [],
    noDataTip: "暂无数据，请选择员工",
    searchText: "请选择员工",
    avatarFieldName: "",
    hasFieldsLabel: true,
    userFieldsViewConfig: { mode: "block" }
  };
  constructor(props) {
    super(props);
    const record = this.props.record ? { ...this.props.record } : null;
    const { resid } = props;
    this.state = {
      avatar:
        "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1804819840,2974605393&fm=27&gp=0.jpg",
      name: "张楠楠",
      position: "市场部经理",
      menuStatus: "expand", // 菜单栏的装填：'expand' 展开 | 'shrink' 收缩
      selectedIndex: -1,
      record, // 搜索工号得到的记录
      modalVisible: false,
      searchValue: "", // 搜索值：工号
      searchLoading: false,
      selectedKeys: [],
      resid: 0, // 主表 id
      subresid: 0, // 子表 id
      hostrecid: 0, // 主表记录 id
      chooseFieldModalVisible: false,
      data: {
        实验室检查: null,
        CDAI: null,
        用药: null,
        内镜: null
      },
      selectedFileds: {
        实验室检查: [],
        CDAI: [],
        用药: [],
        内镜: []
      },
      spinning: false,
      chartVisible: false,
      recordList: {
        实验室检查: [],
        CDAI: [],
        用药: [],
        内镜: []
      },
      innerFieldName: {
        实验室检查: "",
        CDAI: "",
        用药: "",
        内镜: ""
      }
    };
  }

  componentDidMount() {}

  isFirst = true;
  componentWillReceiveProps(preProps) {
    const menuList = preProps.menuList;
    const { record } = this.state;
    if (menuList.length && this.isFirst) {
      const { data } = this.state;
      let nj;
      menuList.forEach(menu => {
        if (menu.RES_NAME === "实验室检查") {
          data["实验室检查"] = menu;
        }
        if (menu.RES_NAME.includes("评分")) {
          data["CDAI"] = menu;
        }
        if (menu.RES_NAME === "用药信息") {
          data["用药"] = menu;
        }
        if (menu.RES_NAME.includes("内镜")) {
          data["内镜"] = menu;
          nj = { ...menu };
        }
      });
      // if (record.C3_617809531670 === "UC") {
      //   data["CDAI"] = nj;
      // }
      this.setState({ data });
      this.isFirst = false;
    }
  }

  // 切换菜单
  toggleMenu = index => {
    this.setState({ selectedIndex: index });
  };

  renderContent = () => {
    const { record } = this.state;
    const { mode, noDataTip } = this.props;

    // 记录为空时
    if (!record) {
      return (
        <div className="no-data-tip">
          <div className="icon-wrap">
            <i className="iconfont icon-default-nodata" />
          </div>
          <p>{noDataTip}</p>
        </div>
      );
    } else {
      // 有记录时

      // 显示默认的视图
      if (mode === "single") {
        const { defaultComponetProps } = this.props;
        const { record } = this.state;
        const props = {
          ...defaultComponetProps,
          hostrecid: record.REC_ID,
          searchValue: this.state.searchValue
        };
        return <LzTable {...props} key={props.hostrecid} />;
      } else {
        const { subresid, resid, hostrecid } = this.state;
        const { advSearchConfig, record, displayMod } = this.props;
        const formTitle = this.getFormTitle(this.props.menuList, subresid);
        const props = {
          formTitle,
          key: subresid,
          resid,
          subresid,
          hostrecid,
          record,
          displayMod
        };
        return <MenuMultiple {...props} advSearchConfig={advSearchConfig} />;
      }
    }
  };

  getFormTitle = (menuList, resid) => {
    console.log({menuList},this.props)
    let formTitle = "";
    menuList.some(menu => {
      if (menu.subMenuList) {
        const flag = menu.subMenuList.some(subMenu => {
          if (subMenu.RES_ID === resid) {
            formTitle = subMenu.RES_NAME;
            return true;
          }
        });
        return flag;
      } else {
        if (menu.RES_ID === resid) {
          formTitle = menu.RES_NAME;
          return true;
        }else{
          formTitle = '周期信息'
        }
      }
    });
    return formTitle;
  };

  chooseStaff = () => {
    this.setState({ modalVisible: true });
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  getPlaceholder = () => {
    const { searchFields } = this.props;
    if (!searchFields) {
      return "";
    }
    let text = "请输入";
    let textArr = [];
    searchFields.forEach(field => textArr.push(field.text));
    text += ` ${textArr.join("/")}`;
    return text;
  };

  getCmswhere = () => {
    const { searchValue } = this.state;
    const { searchFields } = this.props;
    let where = "";
    searchFields.forEach((searchField, index) => {
      where +=
        index === searchFields.length - 1
          ? ` (${searchField.innerFieldName} = '${searchValue}') `
          : ` (${searchField.innerFieldName} = '${searchValue}') or`;
    });
    return where;
  };

  searchStaff = async value => {
    this.setState({ searchLoading: true });
    let res;
    try {
      const cmswhere = this.getCmswhere();
      res = await getMainTableData(this.props.resid, undefined, {
        cmswhere
      });
    } catch (err) {
      this.setState({ searchLoading: false });
      return message.error(err.message);
    }
    if (!res.data.length) {
      this.setState({ searchLoading: false });
      return message.error("没有该员工");
    }
    message.success("搜索成功");
    const record = res.data[0];
    this.setState({
      modalVisible: false,
      searchLoading: false,
      record
    });
  };

  searchChange = event => {
    this.setState({
      searchValue: event.target.value
    });
  };

  changeMenuStatus = menuStatus => {
    if (this.state.menuStatus === menuStatus) {
      return;
    }
    this.setState({ menuStatus });
  };

  switchMenuItem = async ({ item, key, selectedKeys }) => {
    const { record } = this.props;
    if (!record) {
      return message.error("请选择员工");
    }
    const { resid } = this.props;
    const hostrecid = record.REC_ID;
    const subresid = parseInt(key, 10);
    this.setState({
      resid,
      subresid,
      hostrecid,
      selectedKeys
    });
  };

  // 渲染导航列表
  renderNavList = () => {
    const { mode } = this.props;
    if (mode === "single") {
    } else if (mode === "multiple") {
      const { menuList } = this.props;
      const { selectedKeys } = this.state;
      return (
        <Menu
          mode="inline"
          className="nav-list"
          onSelect={this.switchMenuItem}
          selectedKeys={selectedKeys}
        >
          {menuList.map((menu, menuIndex) => {
            if (!menu.subMenuList) {
              return (
                <Menu.Item key={menu.RES_ID}>
                  <Icon type="align-right" theme="outlined" />
                  <span>{menu.RES_NAME}</span>
                </Menu.Item>
              );
            } else {
              return (
                <SubMenu
                  key={menu.RES_ID}
                  title={
                    <span>
                      <span>{menu.RES_NAME}</span>
                    </span>
                  }
                >
                  {menu.subMenuList.map(subMenu => (
                    <Menu.Item key={subMenu.RES_ID}>
                      <Icon type="align-right" theme="outlined" />
                      <span>
                        {subMenu.RES_NAME}（{subMenu.totalCount}）
                      </span>
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            }
          })}
        </Menu>
      );
    }
  };

  getAvatarSrc = () => {
    const { record } = this.state;
    const { avatarFieldName } = this.props;
    if (avatarFieldName && record) {
      return {
        src: record[avatarFieldName]
      };
    } else {
      return {};
    }
  };

  getRenderData = (userInfoFields, record, hasFieldsLabel) => {
    if (!Array.isArray(userInfoFields)) {
      return [];
    }
    const arr = [];
    userInfoFields.forEach(userInfoField => {
      let text = record[userInfoField.innerFieldName];
      if (hasFieldsLabel) {
        text = userInfoField.label + "：" + text;
      }
      arr.push({
        label: userInfoField.label,
        innerFieldName: userInfoField.innerFieldName,
        text,
        id: userInfoField.innerFieldName
      });
    });
    return arr;
  };

  renderUserFields = () => {
    const { record } = this.state;
    // console.log(record);
    const { searchText } = this.props;
    // console.log('this.props.record:', this.props.record);
    // 没有选取人员时
    if (!record) {
      return (
        <p style={{ marginTop: 16 }}>
          <span>{searchText}</span>

          <i className="iconfont icon-search" onClick={this.chooseStaff} />
        </p>
      );
    }
    // 选取了人员时
    const { userInfoFields, hasFieldsLabel, userFieldsViewConfig } = this.props;
    const mode = userFieldsViewConfig.mode;

    const renderData = this.getRenderData(
      userInfoFields,
      record,
      hasFieldsLabel
    );
    let colCount = 1;
    if (mode === "inline") {
      colCount = userFieldsViewConfig.colCount || 1;
    }
    return (
      <Fragment>
        <p style={{ marginTop: 16 }}>
          {!this.props.record && (
            <i className="iconfont icon-search" onClick={this.chooseStaff} />
          )}
        </p>
        <LzRowCols renderData={renderData} colCount={colCount} keyName="id">
          {data => {
            return (
              <div className="user-info-item">
                {hasFieldsLabel && (
                  <div
                    className={classNames("label", {
                      "haslabel-block": hasFieldsLabel && mode === "block",
                      "haslabel-inline": hasFieldsLabel && mode === "inline",

                      "nolabel-inline": !hasFieldsLabel && mode === "inline"
                    })}
                  >
                    {data.label + "："}
                  </div>
                )}
                <div
                  className={classNames("item-value", {
                    "haslabel-block": hasFieldsLabel && mode === "block",
                    "haslabel-inline": hasFieldsLabel && mode === "inline",

                    "nolabel-block": !hasFieldsLabel && mode === "block",
                    "nolabel-inline": !hasFieldsLabel && mode === "inline"
                  })}
                >
                  {record[data.innerFieldName]}
                </div>
              </div>
            );
          }}
        </LzRowCols>
      </Fragment>
    );
  };

  _canOpControlArr = { 实验室检查: [], CDAI: [], 用药: [], 内镜: [] };
  getFormData = async (key, subresid) => {
    let res;
    const { data } = this.state;
    const pArr = [
      // getFormData(subresid, "default"),
      getFormData(subresid, "title-choose")
    ];
    try {
      this.setState({ spinning: true });
      res = await Promise.all(pArr);
      this.setState({ spinning: false });
    } catch (err) {
      return message.error(err.message);
    }
    // const formFormData = dealControlArr(res[0].data.columns);
    const chooseFieldFormData = dealControlArr(res[0].data.columns);

    const treeData = getCanChooseFields(chooseFieldFormData.canOpControlArr);

    this._canOpControlArr[key] = chooseFieldFormData.canOpControlArr;
    // data[key].formFormData = formFormData;
    data[key].treeData = treeData;
    this.setState({ data });
  };

  handleNodeCheck = key => selectedKeys => {
    const selectedFileds = {
      ...this.state.selectedFileds
    };
    selectedFileds[key] = selectedKeys;
    this.setState({ selectedFileds });
  };

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.renderControlArr) {
        return (
          <TreeNode title={item.title} key={item.title} dataRef={item}>
            {this.renderTreeNodes(item.renderControlArr)}
          </TreeNode>
        );
      }
      return (
        <TreeNode key={item.ColName} title={item.ColDispName} dataRef={item} />
      );
    });
  };

  getRecordList = async (key, subresid) => {
    const { resid } = this.props;
    const { recordList, innerFieldName, record } = this.state;
    console.log({record})
    const hostrecid = record.REC_ID;
    let res;
    try {
      res = await getSubTableData(resid, subresid, hostrecid);
    } catch (err) {
      return message.error(err.message);
    }
    recordList[key] = res.data;
    innerFieldName[key] = res.cmscolumninfo[0].id;
    this.setState({
      recordList,
      innerFieldName
    });
  };

  handleCompleteFieldsChoose = () => {
    const { selectedFileds } = this.state;
    const newSelectedFileds = { ...selectedFileds };
    const keys = Object.keys(selectedFileds);
    // keys.forEach(key => {
    //   newSelectedFileds[key] = selectedFileds[key].filter(
    //     key => key.indexOf("C3_") !== -1
    //   );
    // });
    if (keys.every(key => !selectedFileds[key].length)) {
      return message.error("您未选择字段");
    }
    // const fields = { 实验室检查: [], CDAI: [], 用药: [], 内镜: [] };
    const sortFields = {
      实验室检查: new Map(),
      CDAI: new Map(),
      用药: new Map(),
      内镜: new Map()
    };

    keys.forEach(key => {
      newSelectedFileds[key].forEach(item => {
        const curItem = this._canOpControlArr[key].find(
          i => i.ColName === item
        );
        if (curItem) {
          let mapValue = sortFields[key].get(curItem.ColResDataSort);
          if (mapValue) {
            mapValue.push({
              field: curItem.ColName,
              title: curItem.ColDispName
            });
          } else {
            sortFields[key].set(curItem.ColResDataSort, [
              {
                field: curItem.ColName,
                title: curItem.ColDispName
              }
            ]);
          }
        }
      });
    });

    // keys.forEach(key => {
    //   this._canOpControlArr[key].forEach(item => {
    //     const curItem = newSelectedFileds[key].some(
    //       key => key === item.ColName
    //     );
    //     if (curItem) {
    //       fields[key].push({
    //         field: item.ColName,
    //         title: item.ColDispName
    //       });
    //     }
    //   });
    // });
    this.setState({
      chartVisible: true,
      // fields,
      sortFields
    });
  };

  render() {
    const {
      menuStatus,
      modalVisible,
      searchValue,
      searchLoading,
      chooseFieldModalVisible,
      data,
      selectedFileds,
      spinning,
      chartVisible,
      sortFields,
      recordList,
      innerFieldName
    } = this.state;
    const { searchText } = this.props;
    return (
      <div className="lz-menu-container">
        {/* menu */}
        <div
          className={classNames("menu", {
            expand: menuStatus === "expand",
            shrink: menuStatus === "shrink"
          })}
        >
          <div className="user-info">
            <Avatar
              className="avatar"
              size={120}
              icon="user"
              {...this.getAvatarSrc()}
            />
            {this.renderUserFields()}
            <div className="user-info__button">
              <Button
                type="primary"
                onClick={() => {
                  // this.setState({
                  //   chooseFieldModalVisible: true
                  // });
                  // const { data } = this.state;
                  // if (data.实验室检查 && !data.实验室检查.treeData) {
                  //   this.getFormData("实验室检查", data.实验室检查.RES_ID);
                  //   this.getRecordList("实验室检查", data.实验室检查.RES_ID);
                  // }
                  this.switchMenuItem( {item:{}, key:`${patientPeriodID}`, selectedKeys:[patientPeriodID]} )
                }}
              >
                周期信息
              </Button>
            </div>
          </div>
          {this.renderNavList()}
          <i
            className="iconfont icon-expand-v"
            onClick={() =>
              this.changeMenuStatus(
                menuStatus === "expand" ? "shrink" : "expand"
              )
            }
            onMouseEnter={() =>
              this.setState({
                menuStatus: "expand"
              })
            }
          />
        </div>
        {/* container */}
        <div
          className={classNames("lz-menu-container-container", {
            expand: menuStatus === "expand",
            shrink: menuStatus === "shrink"
          })}
        >
          {this.renderContent()}
        </div>
        <Modal
          title="选择人员"
          visible={modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
          footer={null}
          bodyStyle={{ height: 120 }}
        >
          <Spin spinning={searchLoading}>
            <Search
              style={{ marginTop: 20 }}
              placeholder={this.getPlaceholder()}
              value={searchValue}
              onChange={this.searchChange}
              onSearch={this.searchStaff}
              autoFocus
            />
          </Spin>
        </Modal>
        <Modal
          title="选择字段"
          visible={chooseFieldModalVisible}
          onCancel={() =>
            this.setState({
              chooseFieldModalVisible: false
            })
          }
          onOk={this.handleCompleteFieldsChoose}
        >
          <Spin spinning={spinning}>
            <Tabs
              onChange={key => {
                if (data[key] && !data[key].treeData) {
                  this.getFormData(key, data[key].RES_ID);
                  this.getRecordList(key, data[key].RES_ID);
                }
              }}
            >
              <TabPane tab="实验室检查" key="实验室检查">
                {!data.实验室检查 ? (
                  <div
                    style={{
                      padding: 40,
                      fontSize: 18,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    无此项
                  </div>
                ) : (
                  <Tree
                    checkable
                    ref={this.getTreeRef}
                    selectedKeys={selectedFileds.实验室检查}
                    onCheck={this.handleNodeCheck("实验室检查")}
                  >
                    {this.renderTreeNodes(data.实验室检查.treeData || [])}
                  </Tree>
                )}
              </TabPane>
              <TabPane tab="评分" key="CDAI">
                {!data.CDAI ? (
                  <div
                    style={{
                      padding: 40,
                      fontSize: 18,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    无此项
                  </div>
                ) : (
                  <Tree
                    checkable
                    ref={this.getTreeRef}
                    selectedKeys={selectedFileds.CDAI}
                    onCheck={this.handleNodeCheck("CDAI")}
                  >
                    {this.renderTreeNodes(data.CDAI.treeData || [])}
                  </Tree>
                )}
              </TabPane>
              <TabPane tab="用药" key="用药">
                {!data.用药 ? (
                  <div
                    style={{
                      padding: 40,
                      fontSize: 18,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    无此项
                  </div>
                ) : (
                  <Tree
                    checkable
                    ref={this.getTreeRef}
                    selectedKeys={selectedFileds.用药}
                    onCheck={this.handleNodeCheck("用药")}
                  >
                    {this.renderTreeNodes(data.用药.treeData || [])}
                  </Tree>
                )}
              </TabPane>
              <TabPane tab="内镜" key="内镜">
                {!data.内镜 ? (
                  <div
                    style={{
                      padding: 40,
                      fontSize: 18,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    无此项
                  </div>
                ) : (
                  <Tree
                    checkable
                    ref={this.getTreeRef}
                    selectedKeys={selectedFileds.内镜}
                    onCheck={this.handleNodeCheck("内镜")}
                  >
                    {this.renderTreeNodes(data.内镜.treeData || [])}
                  </Tree>
                )}
              </TabPane>
            </Tabs>
          </Spin>
        </Modal>
        {chartVisible && (
          <LzModal
            defaultScaleStatus="max"
            onClose={() =>
              this.setState({
                chartVisible: false
              })
            }
          >
            <Spin spinning={spinning}>
              <Tabs>
                <TabPane tab="实验室检查" key="实验室检查">
                  {!data.实验室检查 && (
                    <div
                      style={{
                        padding: 40,
                        fontSize: 18,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      无此项
                    </div>
                  )}
                  {data.实验室检查 && sortFields.实验室检查.size < 1 && (
                    <div
                      style={{
                        padding: 40,
                        fontSize: 18,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      未选择字段
                    </div>
                  )}
                  <Tabs>
                    {Array.from(sortFields.实验室检查.entries()).map(item => {
                      return (
                        <TabPane tab={item[0]} key={item[0]}>
                          <LabExaminationChart
                            colInfo={this._canOpControlArr["实验室检查"]}
                            data={recordList.实验室检查}
                            fields={item[1]}
                            dateField={innerFieldName.实验室检查}
                            chartid={item[0]}
                          />
                        </TabPane>
                      );
                    })}
                  </Tabs>
                </TabPane>
                <TabPane tab="评分" key="CDAI">
                  {!data.CDAI && (
                    <div
                      style={{
                        padding: 40,
                        fontSize: 18,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      无此项
                    </div>
                  )}
                  {data.CDAI && sortFields.CDAI.size < 1 && (
                    <div
                      style={{
                        padding: 40,
                        fontSize: 18,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      未选择字段
                    </div>
                  )}
                  <Tabs>
                    {Array.from(sortFields.CDAI.entries()).map(item => {
                      return (
                        <TabPane tab={item[0]} key={item[0]}>
                          <LabExaminationChart
                            colInfo={this._canOpControlArr["CDAI"]}
                            data={recordList.CDAI}
                            fields={item[1]}
                            dateField={innerFieldName.CDAI}
                            chartid={item[0]}
                          />
                        </TabPane>
                      );
                    })}
                  </Tabs>
                </TabPane>
                <TabPane tab="用药" key="用药">
                  {!data.用药 && (
                    <div
                      style={{
                        padding: 40,
                        fontSize: 18,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      无此项
                    </div>
                  )}
                  {data.用药 && sortFields.用药.size < 1 && (
                    <div
                      style={{
                        padding: 40,
                        fontSize: 18,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      未选择字段
                    </div>
                  )}
                  <Tabs>
                    {Array.from(sortFields.用药.entries()).map(item => {
                      return (
                        <TabPane tab={item[0]} key={item[0]}>
                          <LabExaminationChart
                            colInfo={this._canOpControlArr["用药"]}
                            data={recordList.用药}
                            fields={item[1]}
                            dateField={innerFieldName.用药}
                            chartid={item[0]}
                            chartVisible={false}
                          />
                        </TabPane>
                      );
                    })}
                  </Tabs>
                </TabPane>
                <TabPane tab="内镜" key="内镜">
                  {!data.内镜 && (
                    <div
                      style={{
                        padding: 40,
                        fontSize: 18,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      无此项
                    </div>
                  )}
                  {data.内镜 && sortFields.内镜.size < 1 && (
                    <div
                      style={{
                        padding: 40,
                        fontSize: 18,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      未选择字段
                    </div>
                  )}
                  <Tabs>
                    {Array.from(sortFields.内镜.entries()).map(item => {
                      return (
                        <TabPane tab={item[0]} key={item[0]}>
                          <LabExaminationChart
                            colInfo={this._canOpControlArr["内镜"]}
                            data={recordList.内镜}
                            fields={item[1]}
                            dateField={innerFieldName.内镜}
                            chartid={item[0]}
                            chartVisible={false}
                          />
                        </TabPane>
                      );
                    })}
                  </Tabs>
                </TabPane>
              </Tabs>
            </Spin>
          </LzModal>
        )}
      </div>
    );
  }
}
