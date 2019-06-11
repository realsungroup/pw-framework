import React from 'react';
import { TableData } from 'Common/loadableCommon';
import { Button, Modal, message, Spin, Table, Progress } from 'antd';
import './ExamAnalyze.less';
import qs from 'qs';
import http from 'Util20/api';
import EchartsOfReact from 'echarts-of-react';
import PropTypes from 'prop-types';

const modalTitleMap = {
  question: '选择题目',
  department: '选择部门',
  level: '选择级别'
};

let resid;
if (process.env.NODE_ENV === 'development') {
  resid = 613058652374;
} else {
  resid = 613058652374;
}

/**
 * 考试图表分析
 */
class ExamAnalyze extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    const qsObj = qs.parse(window.location.search.substring(1));
    const { num: examId, examTitle } = qsObj;
    this.state = {
      examId, // 考试安排编号
      title: examTitle, // 考试名称
      dataSource: [],
      selectedDepartmentRecord: null, // 选择的部门记录
      selectedLevelRecord: null // 选择的级别记录
    };
  }

  componentDidMount = async () => {
    this.getData();
    window.parent.pwCallback &&
      window.parent.pwCallback.modifyTitle('考试图表分析');

    // 监听父窗口发送的 message 事件
    window.addEventListener(
      'message',
      e => {
        if (!e || !e.source || !e.source.pwCallback) {
          return;
        }
        // 当事件类型为 "goBack"（即返回上一页时）
        // 1. 调用 history.goBack() 方法放回上一页
        // 2. 调用父级 window 对象下的 pwCallback.modifyTitle 方法，来修改窗口左上角的标题，其内容为上一页页面的标题
        if (e.data.type === 'goBack') {
          this.props.history.goBack();
          e.source.pwCallback.modifyTitle &&
            e.source.pwCallback.modifyTitle('统计分析');
        }
      },
      false
    );
  };

  getData = async (dept, level) => {
    let cmswhere = '';
    let flag = false;
    let examId = this.state.examId;
    if (dept) {
      cmswhere += `dept = '${dept}'`;
      flag = true;
    }
    if (level) {
      if (flag) {
        cmswhere += ` and `;
      }
      cmswhere += `level = '${level}'`;
      flag = true;
    }
    if (examId) {
      if (flag) {
        cmswhere += ` and `;
      }
      cmswhere += `examid = '${examId}' `;
    }

    let res;
    try {
      res = await http().getTable({
        resid,
        cmswhere
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    const { barOption, pieOption } = this.dealData(res.data);

    this.setState({
      barOption,
      pieOption,
      data: res.data,
      loading: false,
      modalVisible: false
    });
  };

  renderDepartment = () => {
    const { selectedDepartmentRecord } = this.state;
    if (selectedDepartmentRecord) {
      return selectedDepartmentRecord.DEP_NAME;
    }
    return (
      <span className="exam-analyze__no-select-question-status">
        未选择部门
      </span>
    );
  };

  renderLevel = () => {
    const { selectedLevelRecord } = this.state;
    if (selectedLevelRecord) {
      return selectedLevelRecord.C3_449335790387;
    }
    return (
      <span className="exam-analyze__no-select-question-status">
        未选择级别
      </span>
    );
  };

  handleSelectQuestionBtnClick = () => {
    this.setState({ modalVisible: true, modalMode: 'question' });
  };

  handleSelectDepartmentBtnClick = () => {
    this.setState({ modalVisible: true, modalMode: 'department' });
  };

  handleSelectLevelBtnClick = () => {
    this.setState({ modalVisible: true, modalMode: 'level' });
  };

  handleModalCancel = () => {
    this.setState({ modalVisible: false });
  };

  getStatisticsData = async (
    qeustionId,
    department,
    level,
    selectedQuestion
  ) => {
    const whereFields = {};
    if (qeustionId) {
      whereFields.question_id = qeustionId;
    }
    if (department) {
      whereFields.dept = department;
    }
    if (level) {
      whereFields.level = level;
    }
    let cmswhere = '';
    const keyArr = Object.keys(whereFields);
    keyArr.forEach((key, index) => {
      if (index === keyArr.length - 1) {
        cmswhere += `${key} = '${whereFields[key]}'`;
      } else {
        cmswhere += `${key} = '${whereFields[key]}' and `;
      }
    });
    // 根据题目 id 获取统计表中的数据
    let res;
    try {
      res = await http().getTable({
        resid: this.props.resid,
        cmswhere
      });
    } catch (err) {
      this.setState({ modalVisible: false });
      console.error(err);
      return message.error(err.message);
    }

    const {
      singleSelectColumns,
      dataSource,
      barOption,
      pieOption
    } = this.dealData(res.data, selectedQuestion);

    this.setState({
      loading: false,
      singleSelectColumns,
      dataSource,
      barOption,
      pieOption
    });
  };

  handleSelectDepartment = async record => {
    const { selectedLevelRecord } = this.state;
    this.setState({ selectedDepartmentRecord: record });
    this.getData(
      record.DEP_ID,
      selectedLevelRecord && selectedLevelRecord.C3_587136281870
    );
  };

  handleSelectLevel = async record => {
    const { selectedDepartmentRecord } = this.state;
    this.setState({ selectedLevelRecord: record });
    this.getData(
      selectedDepartmentRecord && selectedDepartmentRecord.DEP_NAME,
      record.C3_587136281870
    );
  };

  dealData = resData => {
    const { barOption, pieOption } = this.getOption(resData);

    return {
      barOption,
      pieOption
    };
  };

  getOption = resData => {
    const passData = resData.filter(item => item.isPass === '通过');
    const passLen = passData.length;
    const unPassLen = resData.length - passLen;

    const barOptionSeries = [
      {
        type: 'bar',
        data: [passLen, unPassLen]
      }
    ];

    // barOption
    const barOption = {
      title: {
        text: this.state.title
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['通过', '未通过']
      },
      yAxis: {
        type: 'value'
      },
      series: barOptionSeries
    };

    const pieOptionSeriesData = [
      {
        value: passLen,
        name: '通过'
      },
      {
        value: unPassLen,
        name: '未通过'
      }
    ];

    // pieOption
    const pieOption = {
      title: {
        text: this.state.title
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        data: ['通过', '未通过']
      },
      series: [
        {
          name: `${this.state.title}`,
          type: 'pie',
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: pieOptionSeriesData
        }
      ]
    };
    return { barOption, pieOption };
  };

  renderChartAnalyseTableTitle = () => {
    const { selectedQuestion } = this.state;
    return (
      <span>
        {selectedQuestion.question_topic}{' '}
        <span style={{ color: '#666' }}>
          [{selectedQuestion.question_type}]
        </span>
      </span>
    );
  };

  renderChartAnalyse = () => {
    const {
      singleSelectColumns,
      dataSource,
      barOption,
      pieOption,
      title
    } = this.state;

    return (
      <React.Fragment>
        <div className="exam-analyze__chart-wrap">
          <EchartsOfReact
            id="exam-analyze__chart-bar"
            option={barOption}
            defaultWidth={760}
            defaultHeight={400}
          />
        </div>

        <div className="exam-analyze__chart-wrap">
          <EchartsOfReact
            id="exam-analyze__chart-pie"
            option={pieOption}
            defaultWidth={760}
            defaultHeight={400}
          />
        </div>
      </React.Fragment>
    );
  };

  renderModalContent = () => {
    const { modalMode } = this.state;
    if (modalMode === 'department') {
      return (
        <TableData
          resid={613478801590}
          width={'96%'}
          height={420}
          subtractH={160}
          hasRowModify={false}
          hasRowView={false}
          hasRowDelete={false}
          hasAdd={false}
          hasModify={false}
          hasDelete={false}
          hasAdvSearch={false}
          hasRefresh={false}
          hasDownload={false}
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Button
                  size={btnSize}
                  onClick={() => this.handleSelectDepartment(record)}
                  key="选择部门"
                >
                  选择
                </Button>
              );
            }
          ]}
        />
      );
    } else if (modalMode === 'level') {
      return (
        <TableData
          resid={449335746776}
          width={'96%'}
          height={420}
          subtractH={160}
          hasRowModify={false}
          hasRowView={false}
          hasRowDelete={false}
          hasAdd={false}
          hasModify={false}
          hasDelete={false}
          hasAdvSearch={false}
          hasRefresh={false}
          hasDownload={false}
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Button
                  size={btnSize}
                  onClick={() => this.handleSelectLevel(record)}
                  key="选择级别"
                >
                  选择
                </Button>
              );
            }
          ]}
        />
      );
    }
  };

  render() {
    const {
      modalVisible,
      loading,
      modalMode,
      selectedQuestion,
      selectedDepartmentRecord,
      selectedLevelRecord,
      title
    } = this.state;
    return (
      <Spin spinning={loading}>
        <div className="exam-analyze">
          <h1 style={{ textAlign: 'center' }}>{title}</h1>
          <h2>筛选</h2>
          <div className="exam-analyze__condition">
            <div className="exam-analyze__department">
              <h3 style={{ display: 'inline-block' }}>所选部门：</h3>
              <span>{this.renderDepartment()}</span>
              <Button
                type="primary"
                onClick={this.handleSelectDepartmentBtnClick}
                style={{ marginLeft: 16 }}
              >
                选择部门
              </Button>
              {selectedDepartmentRecord && (
                <Button
                  onClick={() => {
                    this.setState({ selectedDepartmentRecord: null });
                    this.getData(
                      null,
                      this.state.selectedLevelRecord &&
                        this.state.selectedLevelRecord.C3_587136281870
                    );
                  }}
                  style={{ marginLeft: 4 }}
                >
                  清除
                </Button>
              )}
            </div>
            <div className="exam-analyze__level">
              <h3 style={{ display: 'inline-block' }}>所选级别：</h3>
              <span>{this.renderLevel()}</span>
              <Button
                type="primary"
                onClick={this.handleSelectLevelBtnClick}
                style={{ marginLeft: 16 }}
              >
                选择级别
              </Button>
              {selectedLevelRecord && (
                <Button
                  onClick={() => {
                    this.setState({ selectedLevelRecord: null });
                    this.getData(
                      this.state.selectedDepartmentRecord &&
                        this.state.selectedDepartmentRecord.DEP_NAME,
                      null
                    );
                  }}
                  style={{ marginLeft: 4 }}
                >
                  清除
                </Button>
              )}
            </div>
          </div>

          <h2 className="exam-analyze__chart-title">图表分析</h2>

          <div className="exam-analyze__chart">{this.renderChartAnalyse()}</div>

          <Modal
            visible={modalVisible}
            title={modalTitleMap[modalMode]}
            footer={null}
            onCancel={this.handleModalCancel}
            width={'100%'}
            destroyOnClose
          >
            {this.renderModalContent()}
          </Modal>
        </div>
      </Spin>
    );
  }
}

export default ExamAnalyze;
