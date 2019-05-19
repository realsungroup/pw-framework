import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, Modal, message, Spin, Table, Progress } from 'antd';
import './QuestionnaireStatisticAnalysis.less';
import qs from 'qs';
import http from 'Util20/api';
import EchartsOfReact from 'echarts-of-react';

const modalTitleMap = {
  question: '选择题目',
  department: '选择部门',
  level: '选择级别'
};

/**
 * 问卷统计分析
 */
class QuestionnaireStatisticAnalysis extends React.Component {
  constructor(props) {
    super(props);
    const qsObj = qs.parse(window.location.search.substring(1));
    const { questionnaireRecid } = qsObj;
    this.state = {
      modalVisible: false,
      hostrecid: parseInt(questionnaireRecid, 10), // 主表记录 id
      selectedQuestion: null, // 选择的题目记录
      selectedDepartment: null, // 选择的部门
      selectedLevel: null, // 选择的级别
      loading: false,
      singleSelectColumns: [], // 单选题 columns
      dataSource: [], // 表格数据
      barOption: {}, // 柱状图 options
      pieOption: {}, // 饼图 options
      modalMode: '' // 模态窗模式：'question' 显示选择的题目；'department' 显示选择的部门；'level' 显示选择的级别
    };
  }

  renderQuestionTitle = () => {
    const { selectedQuestion } = this.state;
    if (selectedQuestion) {
      return selectedQuestion.question_topic;
    }
    return (
      <span className="questionnaire-statistic-analysis__no-select-question-status">
        未选择题目
      </span>
    );
  };

  renderDepartment = () => {
    const { selectedDepartment } = this.state;
    if (selectedDepartment) {
      return selectedDepartment.DEP_NAME;
    }
    return (
      <span className="questionnaire-statistic-analysis__no-select-question-status">
        未选择部门
      </span>
    );
  };

  renderLevel = () => {
    const { selectedLevel } = this.state;
    if (selectedLevel) {
      return selectedLevel.C3_449335790387;
    }
    return (
      <span className="questionnaire-statistic-analysis__no-select-question-status">
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
        resid: 611518608474,
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

  handleSelectQuestion = async record => {
    this.setState(
      {
        selectedQuestion: { ...record },
        modalVisible: false,
        loading: true
      },
      () => {
        const {
          selectedQuestion,
          selectedDepartment,
          selectedLevel
        } = this.state;
        if (!selectedQuestion) {
          this.setState({ loading: false });
          return message.info('请选择题目');
        }
        this.getStatisticsData(
          selectedQuestion.question_id,
          selectedDepartment && selectedDepartment.DEP_NAME,
          selectedLevel && selectedLevel.C3_587136281870,
          selectedQuestion
        );
      }
    );
  };

  handleSelectDepartment = async record => {
    this.setState(
      {
        selectedDepartment: { ...record },
        modalVisible: false,
        loading: true
      },
      () => {
        const {
          selectedQuestion,
          selectedDepartment,
          selectedLevel
        } = this.state;
        if (!selectedQuestion) {
          this.setState({ loading: false });
          return message.info('请选择题目');
        }
        this.getStatisticsData(
          selectedQuestion.question_id,
          selectedDepartment && selectedDepartment.DEP_NAME,
          selectedLevel && selectedLevel.C3_587136281870,
          selectedQuestion
        );
      }
    );
  };

  handleSelectLevel = async record => {
    this.setState(
      {
        selectedLevel: { ...record },
        modalVisible: false,
        loading: true
      },
      () => {
        const {
          selectedQuestion,
          selectedDepartment,
          selectedLevel
        } = this.state;
        if (!selectedQuestion) {
          this.setState({ loading: false });
          return message.info('请选择题目');
        }
        this.getStatisticsData(
          selectedQuestion.question_id,
          selectedDepartment && selectedDepartment.DEP_NAME,
          selectedLevel && selectedLevel.C3_587136281870,
          selectedQuestion
        );
      }
    );
  };

  dealData = (resData, record) => {
    const sum = resData.reduce(
      (result, record) => (result += record.amount),
      0
    );

    resData.push({
      amount: sum,
      option_content: '本题有效填写人次',
      isLastRecord: true
    });

    const columns = [
      {
        title: '选项',
        dataIndex: 'option_content'
      },
      {
        title: '小计',
        dataIndex: 'amount'
      },
      {
        title: '比例',
        dataIndex: 'percenage',
        render: (value, record, index) => {
          if (record.isLastRecord) {
            return;
          }
          const percent = (record.amount / sum).toFixed(2) * 100;
          return (
            <Progress
              style={{ width: '90%' }}
              percent={percent}
              format={percent => percent.toFixed(2) + '%'}
            />
          );
        }
      }
    ];

    const { barOption, pieOption } = this.getOption(resData, record, sum);

    return {
      singleSelectColumns: columns,
      dataSource: resData,
      barOption,
      pieOption
    };
  };

  getOption = (resData, record, sum) => {
    const barOptionYAxis = {
      type: 'category',
      data: []
    };
    const barOptionSeries = [
      {
        type: 'bar',
        data: []
      }
    ];
    const pieOptionLegend = {
      orient: 'vertical',
      x: 'right',
      data: []
    };

    const seriesData = [];
    resData.forEach(record => {
      if (!record.isLastRecord) {
        barOptionYAxis.data.push(record.option_content);
        barOptionSeries[0].data.push(record.amount);
        pieOptionLegend.data.push(record.option_content);
        seriesData.push({
          value: record.amount,
          name: record.option_content
        });
      }
    });
    barOptionYAxis.data.push('总人数');
    barOptionSeries[0].data.push(sum);

    // barOption
    const barOption = {
      title: {
        text: `${record.question_topic}[${record.question_type}]`
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
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: barOptionYAxis,
      series: barOptionSeries
    };

    // pieOption
    const pieOption = {
      title: {
        text: `${record.question_topic}[${record.question_type}]`
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: pieOptionLegend,
      series: [
        {
          name: `${record.question_topic}[${record.question_type}]`,
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
          data: seriesData
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
      selectedQuestion,
      singleSelectColumns,
      dataSource,
      barOption,
      pieOption
    } = this.state;
    if (!selectedQuestion) {
      return (
        <span className="questionnaire-statistic-analysis__no-select-question-status">
          请先选择题目
        </span>
      );
    }

    return (
      <React.Fragment>
        <div className="questionnaire-statistic-analysis__chart-wrap">
          <Table
            title={this.renderChartAnalyseTableTitle}
            columns={singleSelectColumns}
            dataSource={dataSource}
            bordered
            size="small"
            pagination={false}
            rowKey="option_content"
          />
        </div>

        <div className="questionnaire-statistic-analysis__chart-wrap">
          <EchartsOfReact
            id="questionnaire-statistic-analysis__chart-bar"
            option={barOption}
            defaultWidth={760}
            defaultHeight={400}
          />
        </div>

        <div className="questionnaire-statistic-analysis__chart-wrap">
          <EchartsOfReact
            id="questionnaire-statistic-analysis__chart-pie"
            option={pieOption}
            defaultWidth={760}
            defaultHeight={400}
          />
        </div>
      </React.Fragment>
    );
  };

  renderModalContent = () => {
    const { modalMode, hostrecid } = this.state;
    if (modalMode === 'question' && hostrecid) {
      return (
        <TableData
          resid={608822905547}
          dataMode="sub"
          subresid={608828418560}
          hostrecid={hostrecid}
          width={740}
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
                  onClick={() => this.handleSelectQuestion(record)}
                  key="选择题目"
                >
                  选择
                </Button>
              );
            }
          ]}
        />
      );
    } else if (modalMode === 'department') {
      return (
        <TableData
          resid={417643880834}
          width={740}
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
          width={740}
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
      selectedDepartment,
      selectedLevel
    } = this.state;
    return (
      <Spin spinning={loading}>
        <div className="questionnaire-statistic-analysis">
          <h2>筛选</h2>
          <div className="questionnaire-statistic-analysis__condition">
            <div className="questionnaire-statistic-analysis__question">
              <h3 style={{ display: 'inline-block' }}>所选题目：</h3>
              <span>{this.renderQuestionTitle()}</span>
              <Button
                type="primary"
                onClick={this.handleSelectQuestionBtnClick}
                style={{ marginLeft: 16 }}
              >
                选择题目
              </Button>
              {selectedQuestion && (
                <Button
                  onClick={() => {
                    this.setState({ selectedQuestion: null });
                  }}
                  style={{ marginLeft: 4 }}
                >
                  清除
                </Button>
              )}
            </div>
            <div className="questionnaire-statistic-analysis__department">
              <h3 style={{ display: 'inline-block' }}>所选部门：</h3>
              <span>{this.renderDepartment()}</span>
              <Button
                type="primary"
                onClick={this.handleSelectDepartmentBtnClick}
                style={{ marginLeft: 16 }}
              >
                选择部门
              </Button>
              {selectedDepartment && (
                <Button
                  onClick={() => {
                    this.setState({ selectedDepartment: null });
                    if (!selectedQuestion) {
                      return message.info('请选择题目');
                    }
                    this.getStatisticsData(
                      selectedQuestion.question_id,
                      null,
                      selectedLevel && selectedLevel.C3_587136281870,
                      selectedQuestion
                    );
                  }}
                  style={{ marginLeft: 4 }}
                >
                  清除
                </Button>
              )}
            </div>
            <div className="questionnaire-statistic-analysis__level">
              <h3 style={{ display: 'inline-block' }}>所选级别：</h3>
              <span>{this.renderLevel()}</span>
              <Button
                type="primary"
                onClick={this.handleSelectLevelBtnClick}
                style={{ marginLeft: 16 }}
              >
                选择级别
              </Button>
              {selectedLevel && (
                <Button
                  onClick={() => {
                    this.setState({ selectedLevel: null });
                    if (!selectedQuestion) {
                      return message.info('请选择题目');
                    }
                    this.getStatisticsData(
                      selectedQuestion.question_id,
                      selectedDepartment && selectedDepartment.DEP_NAME,
                      null,
                      selectedQuestion
                    );
                  }}
                  style={{ marginLeft: 4 }}
                >
                  清除
                </Button>
              )}
            </div>
          </div>

          <h2 className="questionnaire-statistic-analysis__chart-title">
            图表分析
          </h2>

          <div className="questionnaire-statistic-analysis__chart">
            {this.renderChartAnalyse()}
          </div>

          <Modal
            visible={modalVisible}
            title={modalTitleMap[modalMode]}
            footer={null}
            onCancel={this.handleModalCancel}
            width={800}
            destroyOnClose
          >
            {this.renderModalContent()}
          </Modal>
        </div>
      </Spin>
    );
  }
}

export default QuestionnaireStatisticAnalysis;
