import React from 'react';
import './DLHasInterview.less';
import TableData from '../../../common/data/TableData';
import { Button, message, Modal } from 'antd';
import http from 'Util20/api';
import moment from 'moment';

class DLHasInterview extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.dlEmployBaseURL;
    this.dlEmployDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.dlEmployDownloadURL;
    this.state = {
      SquareCardArr: [],
      val: null,
      selectedMan: {},
      passAssessData: [],
      assessData: [], //面试评估数据
      assessModal: false //展示面试评估表
    };
  }

  componentDidMount = () => {
    this.getAssessData();
  };

  getAssessData = async () => {
    let res;
    try {
      res = await http({ baseURL: this.baseURL }).getRecordAndSubTables({
        resid: '671567146062',
        subresid: '671567627981',
        getsubresource: 1
      });
      this.setState({
        assessData: res.data
      });
    } catch (error) {
      console.log(error.message);
      message.info(error.message);
    }
  };

  //获取评估数据结果
  getPassAssessData = async id => {
    let res;
    try {
      res = await http({ baseURL: this.baseURL }).getTable({
        resid: 671552039670,
        cmswhere: `C3_671556149700 = ${id}`
      });
      this.setState({
        passAssessData: res.data[0],
        assessModal: true
      });
    } catch (error) {
      console.log(error);
      message.info('当前员工没有填写面试评估表');
    }
  };

  //计算当前阶段的评估结果
  getcurrentRes = item => {
    const { passAssessData } = this.state;
    if (item === '沟通与逻辑') {
      return passAssessData.CommunicationAndLogic;
    } else if (item === '工作经历和求职动机') {
      return passAssessData.experienceAndMotivation;
    } else if (item === '外表') {
      return passAssessData.surface;
    } else if (item === '适应能力') {
      return passAssessData.adaptiveCapacity;
    } else if (item === '稳定性') {
      return passAssessData.stability;
    }
  };

  render() {
    const { assessModal, selectedMan, assessData, passAssessData } = this.state;
    return (
      <>
        <TableData
          cmswhere={`interviewResult != ''`}
          baseURL={this.baseURL}
          resid={617190472818}
          hasBeBtns={true}
          hasRowSelection={false}
          hasAdd={false}
          hasRowView={false}
          hasModify={false}
          hasRowDelete={false}
          hasDelete={false}
          hasRowModify={false}
          height="100%"
          downloadBaseURL={this.dlEmployDownloadURL}
          customRowBtns={[
            record => {
              return (
                <Button
                  onClick={() => {
                    this.getPassAssessData(record.C3_617971057763);
                    this.setState({
                      selectedMan: record
                    });
                  }}
                >
                  查看面试评估表
                </Button>
              );
            }
          ]}
        ></TableData>
        <Modal
          width="61%"
          title={'面试评估表'}
          visible={assessModal}
          onCancel={() => {
            this.setState({
              assessModal: false
            });
          }}
        >
          <table border="1" className="tableStyle">
            <thead>
              <tr>
                <th colSpan="22" className="thCss">
                  DL面试评估表
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th colSpan="5">申请人姓名：{selectedMan.name}</th>
                <th colSpan="12">面试官：{selectedMan.Interviewer}</th>
                <th colSpan="5">
                  面试日期：
                  {moment(selectedMan.interviewTime).format('YYYY - MM - DD')}
                </th>
              </tr>
              <tr>
                <th colSpan="2" className="thCss">
                  考核项目
                </th>
                <th colSpan="3" className="thCss">
                  评分
                </th>
                <th colSpan="12" className="thCss">
                  评价标准
                </th>
                <th colSpan="5" className="thCss">
                  参考问题
                </th>
              </tr>
              {assessData.map((item, key) => {
                const currentRes = this.getcurrentRes(item.item);
                return (
                  <>
                    <tr>
                      <th className="thCss" colSpan="2" rowSpan="3">
                        {item.item}
                      </th>
                      <th colSpan="3">
                        {item[671567627981][0].selection}
                        {currentRes === item[671567627981][0].selection
                          ? '√'
                          : ''}
                      </th>
                      <th colSpan="12">{item[671567627981][0].description}</th>
                      <th colSpan="5" rowSpan="3">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.questions
                              .replace(/《/g, '<')
                              .replace(/》/g, '>')
                          }}
                        ></div>
                      </th>
                    </tr>
                    <tr>
                      <th colSpan="3">
                        {item[671567627981][1].selection}
                        {currentRes === item[671567627981][1].selection
                          ? '√'
                          : ''}
                      </th>
                      <th colSpan="12">{item[671567627981][1].description}</th>
                    </tr>
                    <tr>
                      <th colSpan="3">
                        {item[671567627981][2].selection}
                        {currentRes === item[671567627981][2].selection
                          ? '√'
                          : ''}
                      </th>
                      <th colSpan="12">{item[671567627981][2].description}</th>
                    </tr>
                  </>
                );
              })}
              <tr>
                <th colSpan="2" rowSpan="2">
                  核心胜任力（价值观）
                </th>
                <th colSpan="3">
                  符合 {passAssessData.value === '符合' ? '√' : ''}
                </th>
                <th colSpan="12" rowSpan="2">
                  I CARE = Integrity Collaboration Accountability Respect
                  Enthusiasm
                </th>
                <th colSpan="5" rowSpan="2">
                  综上评价
                </th>
              </tr>
              <tr>
                <th colSpan="3">
                  {' '}
                  不符合{passAssessData.value === '不符合' ? '√' : ''}
                </th>
              </tr>
              <tr>
                <th colSpan="2">面试官反馈</th>
                <th colSpan="20">{selectedMan.C3_617994089301}</th>
              </tr>
            </tbody>
          </table>
        </Modal>
      </>
    );
  }
}

export default DLHasInterview;
