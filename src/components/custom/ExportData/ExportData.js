import React from "react";
import { propTypes, defaultProps } from "./propTypes";
import TableData from "Common/data/TableData";
import "./ExportData.less";
import { Button, message, Tabs, Drawer, Modal, Spin, Tree } from "antd";
import { LzModal, LzMenuForms } from "../loadableCustom";
import AdvSearch from "lz-components-and-utils/lib/AdvSearch";
import "lz-components-and-utils/lib/AdvSearch/style/index.css";
import http, { makeCancelable } from "Util20/api";
import dealControlArr from "Util/controls";
import { getAllAppLinks } from "../../../util/api";
import ExportJsonExcel from "js-export-excel";
import { getMainTableData, getFormData, getSubTableData } from "Util/api";

const { TabPane } = Tabs;
const { TreeNode } = Tree;
const customBtnStyle = {
  margin: "0 4px",
};

const getCanChooseFields = (canOpControlArr) => {
  const arr = assortFields(canOpControlArr);
  return arr;
};
const assortFields = (controlArr) => {
  if (!controlArr || !controlArr.length) {
    return [];
  }
  const filteredControlArr = controlArr.filter(
    (control) => control.ColResDataSort
  );
  const klasses = [];
  filteredControlArr.forEach((control) => {
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
        renderControlArr: [control],
      });
    } else {
      klasses[i].renderControlArr.push(control);
    }
  });
  return klasses;
};

/**
 * 患者信息
 */
class ExportData extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      record: {},
      navListResidField: "",
      cdLen: {},
      ucLen: {},
      menuList: [],
      searchList: [],
      advSearchVisible: false,
      chooseFieldModalVisible: false,
      data: {
        实验室检查: null,
        CDAI: null,
        用药: null,
        内镜: null,
      },
      selectedFileds: {
        实验室检查: [],
        CDAI: [],
        用药: [],
        内镜: [],
      },
      spinning: false,
      chartVisible: false,
      recordList: [],
      innerFieldName: {
        实验室检查: "",
        CDAI: "",
        用药: "",
        内镜: "",
      },
      currentIndex: 0,

      treeData: [], // 选择字段的树节点数据
      selectedKeys: [], // 已选中的树节点
      loading: false,
      cmswhere: "",
    };
  }

  componentDidMount = async () => {
    const firstNavs = await this.getNavList();
    this.getFormData(firstNavs);
    this.getRecordList(firstNavs[0].RES_ID);
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
  };

  handleInputCaseClick = (record) => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      navListResidField: "C3_620929565473",
    });
  };

  handleQSClick = (record) => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      navListResidField: "C3_620929861096",
    });
  };

  handleHistoryClick = (record) => {
    this.setState({
      modalVisible: true,
      record: { ...record },
      navListResidField: "C3_620929845890",
    });
  };

  customRowBtns = [
    (record, size) => {
      return (
        <Button
          key="输入病例"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleInputCaseClick(record)}
        >
          输入病例
        </Button>
      );
    },
    (record, size) => {
      return (
        <Button
          key="问卷调差"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleQSClick(record)}
        >
          问卷调查
        </Button>
      );
    },
    (record, size) => {
      return (
        <Button
          key="历史记录"
          style={customBtnStyle}
          size={size}
          onClick={() => this.handleHistoryClick(record)}
        >
          历史记录
        </Button>
      );
    },
  ];

  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  handleCompleteFieldsChoose = () => {
    const { selectedKeys, selectedRecord, recordList } = this.state;
    if (!selectedKeys.length) {
      return message.error("您未选择字段");
    }
    const fields = [];
    const sortFields = new Map();
    selectedKeys.forEach((item) => {
      const curItem = this._canOpControlArr.find((i) => i.ColName === item);
      if (curItem) {
        let mapValue = sortFields.get(curItem.ColResDataSort);
        if (mapValue) {
          mapValue.push({
            field: curItem.ColName,
            title: curItem.ColDispName,
          });
        } else {
          sortFields.set(curItem.ColResDataSort, [
            { field: curItem.ColName, title: curItem.ColDispName },
          ]);
        }
      }
    });

    this._canOpControlArr.forEach((item) => {
      const curItem = selectedKeys.some((key) => key === item.ColName);
      if (curItem) {
        fields.push({
          field: item.ColName,
          title: item.ColDispName,
        });
      }
    });

    //筛选出导出数据
    let sheetData = [],
      sheetHeader = [],
      arr = [];
    recordList.forEach((record) => {
      let arr1 = [];
      fields.forEach((item, index) => {
        arr1.push(record[item.field] ? record[item.field] : "");
      });
      arr.push(arr1);
    });

    fields.forEach((item, index) => {
      sheetHeader.push(item.title);
    });
    sheetData.push(...arr);

    let fileName = "数据";
    const option = {
      fileName: fileName,
      columnWidths: [30, 20],
      datas: [
        {
          sheetHeader: sheetHeader,
          sheetName: "sheet",
          sheetData: sheetData,
        },
      ],
    };
    var toExcel = new ExportJsonExcel(option); //new
    toExcel.saveExcel(); //保存

    this.setState({
      chooseFieldModalVisible: false,
    });
  };

  renderActionBarExtra = () => {
    const { cdLen, ucLen } = this.state;
    return (
      <div>
        <Button
          onClick={() => {
            this.setState({
              chooseFieldModalVisible: true,
            });
          }}
        >
          导出
        </Button>
        <Button
          onClick={() => {
            this.setState({
              advSearchVisible: true,
            });
          }}
        >
          筛选
        </Button>
        {/* <span style={{ margin: "0 4px" }}>UC：{2}</span> */}
      </div>
    );
  };

  getRecordList = async (subresid, wheres = "") => {
    // const { resid, subresid, hostrecid } = this.props;
    this.setState({
      loading: true,
    });
    let res;
    try {
      res = await getMainTableData(subresid, {
        cmswhere: wheres.cmswhere,
      });
    } catch (err) {
      return message.error(err.message);
    }
    this.fields = this.getFields(res.cmscolumninfo);
    this.setState({
      recordList: res.data,
      loading: false,
    });
    this.forceUpdate();
  };

  getFields = (columnInfo) => {
    return columnInfo.map((column) => ({
      value: column.id,
      label: column.text,
      control: "Input",
    }));
  };

  getFormData = async (
    firstNavs = this.state.menuList,
    index = this.state.currentIndex
  ) => {
    const { currentIndex } = this.state;
    let res;
    const pArr = [
      getFormData(firstNavs[index].RES_ID, "default"),
      getFormData(firstNavs[index].RES_ID, "export"),
    ];
    try {
      res = await Promise.all(pArr);
    } catch (err) {
      return message.error(err.message);
    }
    const formFormData = dealControlArr(res[0].data.columns);
    const chooseFieldFormData = dealControlArr(res[1].data.columns);

    const treeData = getCanChooseFields(chooseFieldFormData.canOpControlArr);

    this._canOpControlArr = chooseFieldFormData.canOpControlArr;

    this.setState({ formFormData, treeData, chooseFieldFormData });
  };

  getNavList = async () => {
    const { navListResid } = this.props;
    const cmswhere = `people_number = ''`;

    let res;
    try {
      res = await getAllAppLinks(navListResid, true, cmswhere);
    } catch (err) {
      return message.error(err.message);
    }
    if (res.data.length) {
      const firstNavs = await this.dealNavList(res.data[0]);
      return firstNavs;
    }
  };

  dealNavList = (navData) => {
    const { data } = this.state;
    const resid = navData.resid;
    const apps = navData.AppLinks;
    const firstNavs = apps.filter((app) => app.RES_PID === resid);
    const secondNavs = apps.filter((app) => app.RES_PID !== resid);
    firstNavs.forEach((app) => {
      secondNavs.forEach((secondApp) => {
        if (app.RES_ID === secondApp.RES_PID) {
          if (!app.subMenuList) {
            app.subMenuList = [];
          }
          app.subMenuList.push(secondApp);
        }
      });
    });
    this.setState({ menuList: firstNavs });

    return firstNavs;
  };

  handleNodeCheck = (selectedKeys) => {
    this.setState({ selectedKeys });
  };
  //高级搜索
  handleFirstColAdvSearchConfirm = (where, searchList) => {
    const { menuList, currentIndex } = this.state;
    const option = { cmswhere: where };
    // this.getRecordList(menuList[currentIndex].RES_ID, option);
    this.setState({
      searchList,
      cmswhere: where,
    });
  };
  renderTreeNodes = (data) => {
    return data.map((item) => {
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
  render() {
    const { tableDataProps, sets } = this.props;
    const {
      menuList,
      searchList,
      advSearchVisible,
      chooseFieldModalVisible,
      spinning,
      data,
      selectedKeys,
      currentIndex,
      treeData,
      loading,
      recordList,
      cmswhere,
    } = this.state;
    return (
      <Spin spinning={loading}>
        <div className="patient-info">
          <Tabs
            defaultActiveKey="0"
            onChange={(index) => {
              this.setState({
                currentIndex: index,
                cmswhere: "",
              });
              this.getFormData(menuList, index);
              this.getRecordList(menuList[index].RES_ID);
            }}
          >
            {menuList.map((menu, index) => {
              return (
                <TabPane tab={menu.RES_NAME} key={index}>
                  <TableData
                    key={cmswhere}
                    cmswhere={cmswhere}
                    hasAdvSearch={true}
                    hasBeBtns={false}
                    resid={menu.RES_ID}
                    // {...sets[currentIndex]}
                    {...tableDataProps}
                    // customRowBtns={this.customRowBtns}
                    actionBarExtra={this.renderActionBarExtra}
                  />
                </TabPane>
              );
            })}
          </Tabs>
          <Drawer
            title="高级搜索"
            placement="right"
            closable={false}
            className="menu-multiple-drawer"
            width={500}
            onClose={() => {
              this.setState({
                advSearchVisible: false,
              });
            }}
            visible={advSearchVisible}
          >
            <AdvSearch
              fields={this.fields}
              onConfirm={this.handleFirstColAdvSearchConfirm}
              initialSearchList={searchList}
            />
          </Drawer>
          <Modal
            title="选择字段"
            visible={chooseFieldModalVisible}
            onCancel={() =>
              this.setState({
                chooseFieldModalVisible: false,
              })
            }
            onOk={this.handleCompleteFieldsChoose}
          >
            <Spin spinning={spinning}>
              <Tabs>
                <TabPane
                  tab={
                    menuList &&
                    menuList[currentIndex] &&
                    menuList[currentIndex].RES_NAME
                  }
                  key={
                    menuList &&
                    menuList[currentIndex] &&
                    menuList[currentIndex].RES_ID
                  }
                >
                  <Tree
                    checkable
                    ref={this.getTreeRef}
                    selectedKeys={selectedKeys}
                    onCheck={this.handleNodeCheck}
                  >
                    {this.renderTreeNodes(treeData)}
                  </Tree>
                </TabPane>
              </Tabs>
            </Spin>
          </Modal>
        </div>
      </Spin>
    );
  }
}

export default ExportData;
