import React, { Component } from 'react';
import { Button, Divider, Icon, Table } from 'antd';
import './AssessDownloadRecord.less';
import ExportJsonExcel from 'js-export-excel';
import moment from 'moment';

const columns = [
  {
    title: '任务编号',
    dataIndex: 'taskId',
    key: 'taskId',
    width: 250
  },
  {
    title: '控制器/门禁点',
    dataIndex: 'control',
    key: 'control',
    width: 150
  },
  {
    title: '所在区域',
    dataIndex: 'area',
    key: 'area',
    width: 150
  },
  {
    title: '下载类型',
    dataIndex: 'downloadType',
    key: 'downloadType',
    width: 100
  },
  {
    title: '下载结果',
    dataIndex: 'downloadResult',
    key: 'downloadResult',
    width: 100
  },
  {
    title: '下载开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
    width: 180
  },
  {
    title: '下载结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
    width: 180
  },
  {
    title: '描述',
    dataIndex: 'describe',
    key: 'describe',
    width: 200
  },
  {
    title: '操作',
    fixed: 'right',
    dataIndex: '',
    key: 'x',
    width: 80,
    render: (text, record) => {
      return (
        <div>
          <span style={{ marginRight: '24px' }}>
            <Icon
              type="snippets"
              onClick={() => {
                this.setState({});
              }}
            />
          </span>
          <span>
            <Icon
              type="api"
              onClick={() => {
                this.setState({});
              }}
            />
          </span>
        </div>
      );
    }
  }
];
const dataSource = [
  {
    taskId: '12ijoidsbiougnoieiahgfiouuew',
    control: '1',
    area: '111mem',
    downloadType: '指纹',
    downloadResult: '1-1成功',
    startTime: '2021/08/31 11:50:51',
    endTime: '2021/08/31 11:50:52',
    describe: '下载成功'
  },
  {
    taskId: '12ijoidsbiougnoieiahgfiouuew',
    control: '1',
    area: '111mem',
    downloadType: '指纹',
    downloadResult: '1-1成功',
    startTime: '2021/08/31 11:50:51',
    endTime: '2021/08/31 11:50:52',
    describe: '下载成功'
  },
  {
    taskId: '12ijoidsbiougnoieiahgfiouuew',
    control: '1',
    area: '111mem',
    downloadType: '指纹',
    downloadResult: '1-1成功',
    startTime: '2021/08/31 11:50:51',
    endTime: '2021/08/31 11:50:52',
    describe: '下载成功'
  },
  {
    taskId: '12ijoidsbiougnoieiahgfiouuew',
    control: '1',
    area: '111mem',
    downloadType: '指纹',
    downloadResult: '1-1成功',
    startTime: '2021/08/31 11:50:51',
    endTime: '2021/08/31 11:50:52',
    describe: '下载成功'
  },
  {
    taskId: '12ijoidsbiougnoieiahgfiouuew',
    control: '1',
    area: '111mem',
    downloadType: '指纹',
    downloadResult: '1-1成功',
    startTime: '2021/08/31 11:50:51',
    endTime: '2021/08/31 11:50:52',
    describe: '下载成功'
  },
  {
    taskId: '12ijoidsbiougnoieiahgfiouuew',
    control: '1',
    area: '111mem',
    downloadType: '指纹',
    downloadResult: '1-1成功',
    startTime: '2021/08/31 11:50:51',
    endTime: '2021/08/31 11:50:52',
    describe: '下载成功'
  },

  {
    taskId: '12ijoidsbiougnoieiahgfiouuew',
    control: '1',
    area: '111mem',
    downloadType: '指纹',
    downloadResult: '1-1成功',
    startTime: '2021/08/31 11:50:51',
    endTime: '2021/08/31 11:50:52',
    describe: '下载成功'
  },
  {
    taskId: '12ijoidsbiougnoieiahgfiouuew',
    control: '1',
    area: '111mem',
    downloadType: '指纹',
    downloadResult: '1-1成功',
    startTime: '2021/08/31 11:50:51',
    endTime: '2021/08/31 11:50:52',
    describe: '下载成功'
  },
  {
    taskId: '12ijoidsbiougnoieiahgfiouuew',
    control: '1',
    area: '111mem',
    downloadType: '指纹',
    downloadResult: '1-1成功',
    startTime: '2021/08/31 11:50:51',
    endTime: '2021/08/31 11:50:52',
    describe: '下载成功'
  }
];

class AssessDownloadRecordTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};

  /**
   * 导出数据
   * @returns void
   */
  exportData = () => {
    const { eventData } = this.props;
    const option = {};
    option.fileName = '权限下载记录';
    const sheetHeader = [
      '任务编号',
      '控制器/门禁点',
      '所在区域',
      '下载类型',
      '下载结果',
      '下载开始时间',
      '下载结束时间',
      '描述'
    ];
    const sheetData = eventData.map(item => {
      return {
        任务编号: item.taskId,
        '控制器/门禁点': item.control,
        所在区域: item.area,
        下载类型: item.downloadType,
        下载结果: item.downloadResult,
        下载开始时间: item.startTime,
        下载结束时间: item.endTime,
        描述: item.describe
      };
    });
    option.datas = [
      {
        sheetData: sheetData,
        sheetName: '权限下载记录1',
        sheetHeader: sheetHeader
      }
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  render() {
    const {} = this.state;
    const { eventData } = this.props;

    return (
      <div
        className="page"
        style={{
          // width: '100vw',
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
              columns={columns}
              // dataSource={eventData}
              dataSource={dataSource}
              bordered
              size="middle"
              scroll={{ x: 220, y: 240 }}
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

export default AssessDownloadRecordTable;
