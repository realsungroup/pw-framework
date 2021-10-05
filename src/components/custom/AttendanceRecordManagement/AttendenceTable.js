import React, { Component } from 'react';
import { Button, Divider, DatePicker, Table } from 'antd';
import './AttendanceRecordManagement.less';
import ExportJsonExcel from 'js-export-excel';

class AttendenceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  columns = [
    {
      title: '人员姓名',
      dataIndex: 'personName',
      key: 'personName',
      // ellipsis: true,
      width: 150
    },
    {
      title: '工号',
      dataIndex: 'jobNo',
      key: 'jobNo',
      // ellipsis: true,
      width: 150
    },
    {
      title: '卡号',
      dataIndex: 'cardNo',
      ellipsis: true,
      key: 'cardNo',
      width: 150
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
      ellipsis: true,
      key: 'orgName',
      width: 250
    },
    {
      title: '门禁点',
      dataIndex: 'doorName',
      ellipsis: true,
      key: 'doorName',
      width: 150
    },
    {
      title: '控制器',
      dataIndex: 'devName',
      ellipsis: true,
      key: 'devName',
      width: 150
    },
    {
      title: '门禁点区域',
      dataIndex: 'doorRegionIndexCode',
      ellipsis: true,
      key: 'doorRegionIndexCode',
      width: 250
    },
    {
      title: '出/入',
      dataIndex: 'inAndOutType',
      ellipsis: true,
      key: 'inAndOutType',
      width: 100
    },
    {
      title: '事件类型',
      dataIndex: 'eventType',
      ellipsis: true,
      key: 'eventType',
      width: 150
    },
    {
      title: '抓拍图片',
      dataIndex: 'picUri',
      ellipsis: false,
      key: 'picUri',
      width: 250,
      render: text => {
        return <div style={{ width: 220 }}>{text}</div>;
      }
    },
    {
      title: '事件时间',
      dataIndex: 'eventTime',
      ellipsis: true,
      key: 'eventTime',
      fixed: 'right',
      width: 200
    }
  ];

  componentDidMount = () => {};

  /**
   * 导出数据
   * @returns void
   */
  exportData = () => {
    const { eventData } = this.props;
    const option = {};
    option.fileName = '考勤记录';
    const sheetHeader = [
      '人员姓名',
      '工号',
      '卡号',
      '所属组织',
      '门禁点',
      '控制器',
      '门禁点区域',
      '出/入',
      '事件类型',
      '抓拍图片',
      '事件时间'
    ];
    const sheetHeaderMap = {
      人员姓名: 'personName',
      工号: 'jobNo',
      卡号: 'cardNo',
      所属组织: 'orgName',
      门禁点: 'doorName',
      控制器: 'devName',
      门禁点区域: 'doorRegionIndexCode',
      '出/入': 'inAndOutType',
      事件类型: 'eventType',
      抓拍图片: 'picUri',
      事件时间: 'eventTime'
    };
    const sheetData = eventData.map(item => {
      const obj = {};
      Object.entries(sheetHeaderMap).forEach(([key, value]) => {
        obj[key] = item[value];
      });
      return obj;
    });
    option.datas = [
      {
        sheetData: sheetData,
        sheetName: '考勤记录',
        sheetHeader: sheetHeader
      }
    ];

    console.log({ option });
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  getScroll = () => {
    const x = this.columns.reduce((acc, cur) => {
      return acc + cur.width;
    }, 0);

    return { x, y: 240 };
  };

  render() {
    const {} = this.state;
    const { eventData } = this.props;

    return (
      <div
        className="page"
        style={{
          width: '100vw',
          height: 'calc(100vh - 216px)',
          background: '#fff'
        }}
      >
        <div style={{ paddingTop: '8px', paddingBottom: '8px' }}>
          <Divider />
          <Button
            type="primary"
            style={{ margin: '8px 12px' }}
            onClick={() => {
              this.exportData();
            }}
          >
            导出
          </Button>
          <div className="tableStyle">
            <Table
              style={{
                marginRight: '8px',
                marginLeft: '8px'
              }}
              columns={this.columns}
              dataSource={eventData}
              bordered
              size="middle"
              scroll={this.getScroll()}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['5', '10', '20'],
                showTotal: () => {
                  return <p>共 {eventData.length} 条记录</p>;
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AttendenceTable;
