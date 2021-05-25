import React from 'react';
import './Statistics.less';
import { DatePicker, Table, Button, message, Input } from 'antd';
import ExportJsonExcel from 'js-export-excel';
import http from 'Util20/api';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Search } = Input;
class Statistics extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[
        process.env.NODE_ENV
      ].customURLs.comprehensiveQueryBaseURL;
    this.state = {
      scrollHeight: 520,
      data: [],
      loading: true,
      dateRange: [moment().date(1), moment().endOf('month')],
      searchName: ''
    };
  }

  columns = [];
  componentDidMount() {
    this.setState({
      scrollHeight: this.tableRef.offsetHeight - 38 - 24 - 56
    });
    this.getData();
  }
  componentDidUpdate(preProps) {
    if (preProps.person.C3_305737857578 !== this.props.person.C3_305737857578) {
      this.getData();
    }
  }
  getData = async () => {
    const { person } = this.props;
    const { dateRange, searchName } = this.state;
    try {
      this.setState({ loading: true });
      const res = await http({
        baseURL: this.baseURL
      }).getByProcedure({
        procedure: 'IIVI_GetOtHours',
        paranames: 'dates1,dates2,pnid,name',
        paratypes: 'string,string,int,string',
        paravalues: `${dateRange[0].format('YYYYMMDD')},${dateRange[1].format(
          'YYYYMMDD'
        )},${person.C3_305737857578},${searchName}`,
        resid: '674830300475'
      });
      this.columns = res.cmscolumninfo.map(item => {
        return {
          title: item.text,
          dataIndex: item.id,
          key: item.id,
          width: 100
        };
      });
      this.setState({
        data: res.data,
        loading: false
      });
    } catch (error) {
      message.error(error.message);
      this.setState({ loading: false });
    }
  };
  handleDownloadExcel = async () => {
    var option = {};
    const { data } = this.state;
    const exportData = data.map(item => {
      const obj = {};
      this.columns.forEach(col => {
        obj[col.title] = item[col.dataIndex];
      });
      return obj;
    });

    option.fileName = '下属超时工时统计';
    option.datas = [
      {
        sheetData: exportData,
        sheetName: '下属超时工时统计',
        sheetHeader: this.columns.map(item => item.title)
      }
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };
  render() {
    const { scrollHeight, data, loading, dateRange } = this.state;
    return (
      <div
        ref={ref => {
          this.tableRef = ref;
        }}
        className="cq-statistics"
      >
        <div>
          <RangePicker
            value={dateRange}
            onChange={(dates, datesString) => {
              this.setState({ dateRange: dates }, this.getData);
            }}
            allowClear={false}
            size="small"
            style={{ width: 450, marginRight: 8 }}
          />
          <Button onClick={this.handleDownloadExcel} size="small">
            导出
          </Button>
          <Search
            style={{
              float: 'right',
              width: 250,
              marginLeft: 100,
              marginRight: 5
            }}
            enterButton="搜索"
            placeholder="请输入姓名查看"
            allowClear
            onSearch={value => {
              this.setState(
                {
                  searchName: value
                },
                () => {
                  this.getData();
                }
              );
            }}
          ></Search>
        </div>
        <Table
          className="cq-statistics__table"
          columns={this.columns}
          dataSource={data}
          bordered
          size="small"
          pagination={{ pageSize: 40, size: 'small' }}
          loading={loading}
          scroll={{ y: scrollHeight }}
        />
      </div>
    );
  }
}

export default Statistics;
