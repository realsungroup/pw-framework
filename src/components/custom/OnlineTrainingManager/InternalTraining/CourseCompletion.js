import React from 'react';
import http, { makeCancelable } from 'Util20/api';
import { message, Table, Button } from 'antd';
import exportJsonExcel from 'js-export-excel';
import TableData from 'Common/data/TableData';
import moment from 'moment';

const baseURLDownload =
  window.pwConfig[process.env.NODE_ENV].customURLs.onlineTrainningDownload;
class CourseCompletion extends React.Component {
  state = { authData: [], dataSource: [], loading: true };
  _column = [
    {
      title: '姓名',
      dataIndex: 'C3_636040900146',
      key: 'C3_636040900146',
      width: 100,
      fixed: 'left'
    },
    {
      title: '工号',
      dataIndex: 'jobId',
      key: 'jobId',
      width: 100,
      fixed: 'left'
    },
    { title: '是否通过', dataIndex: 'pass', key: 'pass', width: 100 },
    {
      title: '满分',
      dataIndex: 'C3_644180138370',
      key: 'C3_644180138370',
      width: 100
    },
    { title: '及格成绩', dataIndex: 'score', key: 'score', width: 100 },
    {
      title: '得分',
      dataIndex: 'C3_644180155102',
      key: 'C3_644180155102',
      width: 100
    },
    {
      title: '答题时间',
      dataIndex: 'REC_CRTTIME',
      key: 'REC_CRTTIME'
      // width: 200
    }
  ];
  componentDidMount() {
    const { chapter } = this.props;
    if (chapter.C3_636735464189) this.getData();
  }

  getData = async () => {
    const { course, chapter } = this.props;

    const pArr = [];
    pArr.push(this.fetchCouseAuth(course.REC_ID));
    pArr.push(this.fetchPaperResult(chapter));
    this.setState({ loading: true });
    try {
      this.p1 = makeCancelable(Promise.all(pArr));
      const [authData, dataSourceData] = await this.p1.promise;
      let dataSource = dataSourceData.data.filter(item => {
        return authData.data.some(i => i.ID == item.C3_636040949514);
      });
      dataSource.forEach(item => {
        const data = authData.data.find(i => i.ID == item.C3_636040949514);
        item.jobId = data.jobId;
        item.REC_CRTTIME = data.REC_CRTTIME;
      });
      dataSourceData.cmscolumninfo.forEach(item => {
        this._column.push({
          title: item.text,
          dataIndex: item.id,
          key: item.id,
          width: 200
        });
      });
      this.setState({
        authData: authData.data,
        dataSource: dataSource
      });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
    this.setState({ loading: false });
  };

  /**
   * 获取课程
   */
  fetchCouseAuth = async courseId => {
    try {
      const p = makeCancelable(
        http({ baseURL: this.props.baseURL }).getTable({
          resid: 640021774020,
          cmswhere: `courseId = '${courseId}'`
        })
      );
      return p.promise;
    } catch (error) {
      return Promise.reject();
    }
  };

  /**
   * 获取考试记录
   */
  fetchPaperResult = async (chapter = []) => {
    try {
      const p = makeCancelable(
        http({ baseURL: this.props.baseURL }).getTable({
          resid: chapter.C3_636735464189,
          getcolumninfo: 1
        })
      );
      return p.promise;
    } catch (error) {
      return Promise.reject();
    }
  };

  handleExport = () => {
    const columns = this._column;
    const { dataSource } = this.state;
    const sheetHeader = columns.map(column => column.title);
    const dataIndex = columns.map(column => column.dataIndex);

    const sheetData = dataSource.map(record =>
      dataIndex.map(item => record[item])
    );

    const columnWidths = columns.map(() => 10);
    const option = {
      fileName:
        this.props.chapter.C3_636735399221 +
        '完成情况 ' +
        moment().format('YYYY-MM-DD'),
      datas: [
        {
          sheetHeader,
          sheetName:
            this.props.chapter.C3_636735399221 +
            '完成情况 ' +
            moment().format('YYYY-MM-DD'),
          sheetData,
          columnWidths
        }
      ]
    };
    const toExcel = new exportJsonExcel(option);
    toExcel.saveExcel();
  };
  render() {
    const { dataSource, loading } = this.state;
    const { chapter, baseURL, course } = this.props;
    return chapter.C3_636735464189 ? (
      <div>
        <Button
          size="small"
          type="primary"
          style={{ marginBottom: 8 }}
          icon="export"
          onClick={this.handleExport}
        >
          导出
        </Button>
        <Table
          size="small"
          dataSource={dataSource}
          loading={loading}
          columns={this._column}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 40 }}
          bordered
        />
      </div>
    ) : (
      <TableData
        resid={640021774020}
        downloadBaseURL={baseURLDownload}
        baseURL={baseURL}
        recordFormFormWidth="90%"
        hasBeBtns={false}
        hasModify={false}
        hasDelete={false}
        hasAdd={false}
        hasRowDelete={false}
        hasRowModify={false}
        hasRowView={false}
        subtractH={200}
        cmswhere={`courseId = '${course.REC_ID}'`}
      />
    );
  }
}

export default CourseCompletion;
