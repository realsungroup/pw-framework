import React, { Component } from "react";
import "./FinisarMenjin.less";
import { Table, Divider, Button, Input, message, Popconfirm } from "antd";
// import { setItem } from "../src/util/localCache";
// import {
//   getTable,
//   getTableByVal,
//   addRecord,
//   modRecords,
//   defaultLogin
// } from "Util/api";
import http from 'Util20/api';
import exportJsonExcel from "js-export-excel";
const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03BaseURL;
const downloadURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03DownloadBaseURL;
// import { NonsupportIE } from "nonsupport-ie-react";
const { Column, ColumnGroup } = Table;

const Search = Input.Search;

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: record => ({
    name: record.name
  })
};
function onChange(pagination, filters, sorter) {
  // console.log("params", pagination, filters, sorter);
}

class FinisarMenjin extends Component {
  componentDidMount() {
    this.loadTasks();
  }


  loadTasks = async () => {
    this.setState({ loading: true });
    try {
      const getOilDataRes = await http({ baseURL }).getTable({
        resid: 595199561778
      });
      if (!getOilDataRes.error) {
        // const approveData = [];
        const predata = [];
        getOilDataRes.data.map(val => {
          predata.push(val);
        });
        await this.setState({
          data: predata,
          loading: false
        });
        if (getOilDataRes.data.length > 0) {
          this.setState({
            show: false
          });
        }
        this.getColumns();
      }

      // const getSubDatalog = getSubData(
      //   587042302970,
      //   587584630447,
      //   getOilDataRes.data[0].REC_ID
      // );
      // const subDataRes = await getSubDatalog;
    } catch (err) {
      alert(err.message);
      console.error(err.message);
    }
  };

  getTableData = async (
    options = Object.assign(this.state.pagination || {}, {
      key: ""
    }),
    cmswhere
  ) => {
    let res;
    const { resid, cmscolumns } = this.props;
    cmswhere = `${cmswhere ? cmswhere + " and " : ""} ${this.props.cmswhere}`;

    try {
      // res = await getTableByVal(595199561778, options.key);
      res = await http({ baseURL }).getTable({ resid: 595199561778, key: options.key });


      if (!res.error) {
        // const approveData = [];
        const predata = [];
        res.data.map(val => {
          predata.push(val);
          predata["checked"] = true;
        });
        await this.setState({
          data: predata,
          loading: false
        });
      }
    } catch (err) {
      this.setState({ loading: false });

      return message.error(err.message);
    }

    // 开启了分页功能
    let pagination;
    if (this.props.pagination) {
      pagination = {
        ...this.state.pagination,
        ...{
          pageSize: options.pageSize,
          current: options.current + 1,
          total: res.total
        }
      };
    }
  };
  search = value => {
    const { pagination, key } = this.state;
    let o = {};
    if (this.props.pagination) {
      o = { current: 0, pageSize: pagination.pageSize };
    }
    this.getTableData(Object.assign(o, { key: value }));
  };
  rightconfirm = async () => {
    this.setState({
      loading: true
    });
    let datas = {};
    if (this.state.data) {
      datas = {
        C3_607095799890: this.state.data[0].C3_595166992528,
        C3_607095801341: this.state.data[0].C3_596622658354
      };
    } else {
      message.error("暂无数据！");
      return;
    }
    let res;
    // this.state.data.forEach(item => (item.C3_595192402751 = 'Y',item.formulalayer = '0'));
    // this.state.data.map((item) => {
    //   datas.push({"C3_595192402751":item.C3_595192402751,"REC_ID":item.REC_ID,C3_595192402751:item.C3_595192402751,formulalayer:"0"})
    // }
    // )
    try {
      // res = await addRecord(595191379002, datas);
      res = await http({ baseURL }).addRecords({ resid: 595191379002, data: [datas] });
    } catch (err) {
      this.setState({
        loading: false
      });
      return message.error(err.message);
    }
    if (!res.data.length) {
      this.setState({
        loading: false
      });
      return message.error(res.message);
    }
    message.success("操作成功");
    this.loadTasks();
    this.setState({
      loading: false,
      show: false
    });
  };

  getColumns = () => {
    this.setState({
      columns: [
        {
          title: "姓名",
          dataIndex: "C3_595166693246",
          key: "C3_595166693246",
          // filters: this.state.filter,
          filterMultiple: false,
          onFilter: (value, record) =>
            record.C3_595166693246.indexOf(value) === 0,
          sorter: (a, b) => a.C3_595166693246.length - b.C3_595166693246.length,
          render: text => <a href="javascript:;">{text}</a>
        },
        {
          title: "工号",
          dataIndex: "C3_595166604634",
          key: "C3_595166604634",

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595166604634.indexOf(value) === 0,
          sorter: (a, b) => a.C3_595166604634.length - b.C3_595166604634.length
        },
        {
          title: "部门",
          dataIndex: "C3_595166712341",
          key: "C3_595166712341",

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595166712341.indexOf(value) === 0,
          sorter: (a, b) => a.C3_595166712341.length - b.C3_595166712341.length
        },
        {
          title: "所属门权限组名称",
          dataIndex: "C3_595166751093",
          key: "C3_595166751093",

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595166751093.indexOf(value) === 0,
          sorter: (a, b) => a.C3_595166751093.length - b.C3_595166751093.length
        },
        {
          title: "管理员工号",
          dataIndex: "C3_595166775274",
          key: "C3_595166775274",

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595166775274.indexOf(value) === 0,
          sorter: (a, b) =>
            parseInt(a.C3_595166775274, 10) - parseInt(b.C3_595166775274, 10)
        },
        {
          title: "管理员姓名",
          dataIndex: "C3_595166794150",
          key: "C3_595166794150",

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595166794150.indexOf(value) === 0,
          sorter: (a, b) => a.C3_595166794150.length - b.C3_595166794150.length
        },
        {
          title: "是否新增",
          dataIndex: "C3_595168410919",
          key: "C3_595168410919",

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595168410919.indexOf(value) === 0,
          sorter: (a, b) => {
            const aLen = a.C3_595168410919 ? a.C3_595168410919.length : 0;
            const bLen = b.C3_595168410919 ? b.C3_595168410919.length : 0;
            return aLen - bLen;
          }
        },
        {
          title: "确认无误",
          dataIndex: "C3_595192402751",
          key: "C3_595192402751",

          filterMultiple: true,
          onFilter: (value, record) =>
            record.C3_595192402751.indexOf(value) === 0,
          sorter: (a, b) => {
            if (a.C3_595192402751 !== b.C3_595192402751) {
              return -1;
            } else if (a.C3_595192402751 === b.C3_595192402751) {
              return 0;
            } else {
              return 1;
            }
          }
        }
      ]
    });
  };
  export = () => {
    const sheetHeader = this.state.columns.map(column => column.title);
    const dataIndex = this.state.columns.map(column => column.dataIndex);

    const sheetData = this.state.data.map(record =>
      dataIndex.map(item => record[item])
    );

    const columnWidths = this.state.columns.map(() => 10);
    const option = {
      datas: [
        {
          sheetHeader,
          // sheetName: tableTitle,
          sheetData,
          columnWidths
        }
      ]
    };
    const toExcel = new exportJsonExcel(option);
    toExcel.saveExcel();
  };
  state = {
    data: [{}],
    columns: [{}],
    selectedRowKeys: [],
    loading: false,
    show: true
  };
  onSelectedRowKeysChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  confirm = async () => {
    const { selectedRowKeys, data } = this.state;

    if (!selectedRowKeys.length) {
      return message.error("请先勾选记录");
    }
    let filteredData = [];
    selectedRowKeys.forEach(key => {
      let item;
      if ((item = data.find(dataItem => dataItem.REC_ID === key))) {
        filteredData.push(item);
      }
    });

    filteredData = JSON.parse(JSON.stringify(filteredData));
    filteredData.forEach(item => (item["C3_595192402751"] = "N"));
    let res;
    try {
      // res = await modRecords(595199561778, filteredData);
      res = await http({ baseURL }).modifyRecords({ resid: 595199561778, data: filteredData });
    } catch (err) {
      return message.error(err.message);
    }

    if (!res.data.length) {
      return message.error("操作失败");
    }
    this.loadTasks();
    this.setState({ selectedRowKeys: [] });
    message.success("操作成功");
  };

  render() {
    const { data, columns, selectedRowKeys, loading, show } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange
    };
    return (
      // <NonsupportIE
      //   devMode
      //   reminder="app is not support IE, please use other modern browser."
      // >
      <div className="FinisarMenjin">
        <div className="btns">
          <div style={{ float: "left" }}>
            <Search
              style={{ width: 200 }}
              onSearch={this.search}
              enterButton
              disabled={show}
              // value={value}
              onChange={() => { }}
            />
          </div>
          <div style={{ float: "right" }}>
            {show ? (
              <Button
                className="btn-approve"
                type="danger"
                disabled={show}
              // disabled={!hasSelected}
              // loading={loading}
              >
                确认有误
              </Button>
            ) : (
                <Popconfirm
                  title="确认有误并发送邮件吗？"
                  okText="确认"
                  cancelText="取消"
                  onCancel={this.cancel}
                  onConfirm={this.confirm}
                >
                  <Button
                    className="btn-approve"
                    type="danger"
                    disabled={show}
                  // disabled={!hasSelected}
                  // loading={loading}
                  >
                    确认有误
                </Button>
                </Popconfirm>
              )}

            <Popconfirm
              title="确认全部无误并通过吗？"
              okText="确认"
              cancelText="取消"
              onCancel={this.cancel}
              onConfirm={this.rightconfirm}
            >
              {" "}
              <Button
                className="btn-reject"
                type="primary"
                disabled={show}
              // disabled={!hasSelected}
              // loading={loading}
              >
                全部无误
              </Button>{" "}
            </Popconfirm>

            <Button
              className="btn-export"
              type="primary"
              disabled={show}
              onClick={this.export}
            // disabled={!hasSelected}
            // loading={loading}
            >
              导出
            </Button>
          </div>
        </div>
        <div className="tab">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            onChange={onChange}
            dataSource={data}
            rowKey={data => data.REC_ID}
            loading={loading}
          />
        </div>
      </div>

      // {/* </NonsupportIE> */}
    );
  }
}

export default FinisarMenjin;