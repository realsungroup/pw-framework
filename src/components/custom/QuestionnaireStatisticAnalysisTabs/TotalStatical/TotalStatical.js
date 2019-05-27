import React, { Component } from 'react';
import { Button, Icon, Input, Tabs, Table } from 'antd';
import './TotalStatical.less';
import http from 'Util20/api';
const TabPane = Tabs.TabPane;
// 单选多选的表头
const columns = [
  {
    title: '选项',
    dataIndex: 'option-content'
  },
  {
    title: '小计',
    dataIndex: 'amount'
  },
  {
    title: '比例',
    dataIndex: 'percentage'
  }
];

class TotalStatical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryName: '',
      queryQuestions: [],
      staticalData: []
    };
  }
  componentDidMount = () => {
    this.getQueryName(this.props.queryId);
    this.getqueryQuestions(this.props.queryId);
  };
  //根据问卷ID拿到问卷的名称
  getQueryName = async id => {
    console.log(id);
    let res;
    try {
      res = await http().getTable({
        resid: 608822905547,
        cmswhere: `query_id = ${id}`
      });
    } catch (err) {
      console.log(err.message);
    }
    console.log(res);
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
    console.log('拿到问卷试题', QuestionsData.data);
    this.setState({
      queryQuestions: QuestionsData.data
    });
    let cmsString;
    // console.log(this.state.queryQuestions);
    cmsString = this.state.queryQuestions
      .map(item => {
        return item.question_id;
      })
      .join(',');
    // console.log(cmsString);

    this.getOptionsTableData(cmsString);
  };
  // 获取问题的选项
  getOptionsTableData = async cstring => {
    let resOptions;
    try {
      resOptions = await http().getTable({
        resid: 610537303261,
        cmswhere: `question_id in (${cstring})`
      });
    } catch (err) {
      console.error(err.message);
    }
    console.log('试题选项', resOptions);
    let terdata = [];
    let repeated = []; //记住子添加过的id
    resOptions.data.forEach((item, index) => {
      // if(item[index].question_id==item[index+1].question_id){
      // const obj = {
      //   title: item.question_topic,
      //   table: {
      //     dataSource: []
      //   }
      // };
      for (var i = 0; i < resOptions.data.length; i++) {
        if (
          !repeated.includes(item.question_id) &&
          item.question_id === resOptions.data[i].question_id
        ) {
          // 记住这个ID，下次进来就不再循环了
          repeated.push(item.question_id);
        }
        const obj = {
          title: item.question_topic,
          table: {
            dataSource: []
          }
        };
        obj.table.dataSource = [];
        const dataSourceObj = {
          option_content: item.option_content,
          amount: item.amount
        };
        obj.table.dataSource.push(dataSourceObj);
        console.log(obj);
      }

      // terdata.push(obj);
    });
    console.log(terdata);
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
    const data = [
      {
        title: '天气怎么样？',
        table: {
          dataSource: [
            {
              'option-content': '好',
              'amount': 1
            },
            {
              'option-content': '很好',
              'amount': 2
            },
            {
              'option-content': '非常好',
              'amount': 1
            },
            {
              'option-content': '特别好',
              'amount': 1
            }
          ]
        }
      },
      {
        title: '喜欢的城市',
        table: {
          dataSource: [
            {
              'option-content': '上海',
              'amount': 3
            },
            {
              'option-content': '北京',
              'amount': 5
            },
            {
              'option-content': '广州',
              'amount': 4
            },
            {
              'option-content': '深圳',
              'amount': 3
            }
          ]
        }
      },
      {
        title: '喜欢的美食',
        table: {
          dataSource: [
            {
              'option-content': '面包',
              'amount': 2
            },
            {
              'option-content': '牛奶',
              'amount': 2
            },
            {
              'option-content': '咖啡',
              'amount': 2
            },
            {
              'option-content': '饮料',
              'amount': 2
            }
          ]
        }
      },
      {
        title: '中奖的概率',
        table: {
          dataSource: [
            {
              'option-content': '10%',
              'amount': 2
            },
            {
              'option-content': '20%',
              'amount': 1
            },
            {
              'option-content': '30%',
              'amount': 1
            },
            {
              'option-content': '40%',
              'amount': 0
            }
          ]
        }
      }
    ];
    return data.map((item, index) => {
      return (
        <div className="total-statical__chart-wrap" key={index}>
          <h4 className="total-statical__chart-wrap__question-topic">
            <span>{index + 1}.</span>
            {item.title}
          </h4>
          <Table
            columns={columns}
            dataSource={item.table.dataSource}
            bordered
            size="small"
            pagination={false}
            rowKey="option_content"
          />
        </div>
      );
    });
  };
  render() {
    const { queryName } = this.state;
    return (
      <div className="total-statical">
        <h3 className="total-statical__title">{queryName}</h3>
        {this.renderCommonChart()}
      </div>
    );
  }
}

export default TotalStatical;
