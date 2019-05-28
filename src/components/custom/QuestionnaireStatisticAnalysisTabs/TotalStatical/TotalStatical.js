import React, { Component } from 'react';
import { Button, Icon, Input, Tabs, Table, Progress } from 'antd';
import './TotalStatical.less';
import http from 'Util20/api';
import html2canvas from 'html2canvas';

const TabPane = Tabs.TabPane;

class TotalStatical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryName: '',
      queryQuestions: [],
      staticalData: [],
      data: []
    };
  }
  componentDidMount = () => {
    this.getQueryName(this.props.queryId);
    this.getqueryQuestions(this.props.queryId);
  };

  columns = [
    {
      title: '选项',
      dataIndex: 'optionContent'
    },
    {
      title: '小计',
      dataIndex: 'amount'
    },
    {
      title: '比例',
      dataIndex: 'percentage',
      render: (value, record, index) => {
        if (record.optionContent === '本题有效填写人次') {
          return null;
        }
        const percent = parseInt(
          ((record.amount / record.total) * 100).toFixed(0),
          10
        );
        return (
          <div>
            <Progress percent={percent} />
          </div>
        );
      }
    }
  ];

  //根据问卷ID拿到问卷的名称
  getQueryName = async id => {
    let res;
    try {
      res = await http().getTable({
        resid: 608822905547,
        cmswhere: `query_id = ${id}`
      });
    } catch (err) {
      return console.error(err.message);
    }
    this.setState({
      queryName: res.data[0].query_name
    });
  };

  //根据问卷ID 拿到该问卷的题目
  getqueryQuestions = async id => {
    let QuestionsData;
    try {
      QuestionsData = await http().getTable({
        resid: 608828418560,
        cmswhere: `query_id = ${id}`
      });
    } catch (err) {
      console.error(err.message);
    }
    this.setState({
      queryQuestions: QuestionsData.data
    });
    let cmsString;
    cmsString = this.state.queryQuestions
      .map(item => {
        return item.question_id;
      })
      .join(',');

    this.getOptionsTableData(cmsString);
  };

  // 获取问题的选项
  getOptionsTableData = async cstring => {
    let res;
    try {
      res = await http().getTable({
        resid: 610537303261,
        cmswhere: `question_id in (${cstring})`
      });
    } catch (err) {
      console.error(err.message);
    }
    // 要得到的 data
    const data = [];
    res.data.forEach((item, index) => {
      const tempDataItem = data.find(
        dataItem => item.question_topic === dataItem.title
      );
      if (!tempDataItem) {
        data.push({
          title: item.question_topic,
          table: {
            dataSource: [
              {
                optionContent: item.option_content,
                amount: item.amount
              }
            ]
          }
        });
      } else {
        tempDataItem.table.dataSource.push({
          optionContent: item.option_content,
          amount: item.amount
        });
      }
    });
    data.forEach(dataItem => {
      let total = 0;
      dataItem.table.dataSource.forEach(record => {
        total += record.amount;
      });
      dataItem.table.dataSource.forEach(record => {
        record.total = total;
      });
      dataItem.table.dataSource.push({
        optionContent: '本题有效填写人次',
        amount: total
      });
    });
    this.setState({ data });
  };

  handleExportImgBtnClick = () => {
    const { queryName } = this.state;
    // 下载图片
    function download(src, name) {
      if (!src) return;
      const a = document.createElement('a');
      a.setAttribute('download', name);
      a.href = src;
      a.click();
    }
    html2canvas(document.querySelector('.total-statical__main')).then(
      canvas => {
        const imgDataURL = canvas.toDataURL('image/png');
        download(imgDataURL, queryName);
      }
    );
  };

  // renderWhichchart
  renderWhichchart = questionType => {
    if (questionType === '问答题') {
      return this.renderAnswerChart();
    } else {
      return this.renderCommonChart();
    }
  };

  //渲染问答题的东西
  renderAnswerChart = () => {
    return (
      <div>
        <h4 className=" " />
      </div>
    );
  };

  // 渲染单选和多选的表格
  renderCommonChart = () => {
    const { data } = this.state;
    return data.map((item, index) => {
      return (
        <div className="total-statical__chart-wrap" key={item.title}>
          <h4 className="total-statical__chart-wrap__question-topic">
            <span>{index + 1}.</span>
            {item.title}
          </h4>
          <Table
            columns={this.columns}
            dataSource={item.table.dataSource}
            bordered
            size="small"
            pagination={false}
            rowKey="optionContent"
          />
        </div>
      );
    });
  };

  render() {
    const { queryName } = this.state;
    return (
      <React.Fragment>
        <div className="total-statical">
          <Button
            size="small"
            type="primary"
            onClick={this.handleExportImgBtnClick}
          >
            导出 PNG
          </Button>
          <div className="total-statical__main">
            <h3 className="total-statical__title">{queryName}</h3>
            {this.renderCommonChart()}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TotalStatical;
