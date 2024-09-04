import React from 'react';
import { Button, Modal, message, Spin, Skeleton } from 'antd';
import http from 'Util20/api';
import TableData from '../../../../common/data/TableData';
import FormData from '../../../../common/data/FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';
import './personInfo.less';

/**
 * 人事信息
 * @author 邓铭
 */

class PersonInfo extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[
        process.env.NODE_ENV
      ].customURLs.comprehensiveQueryBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
    let comID=localStorage.getItem('userInfo');
    comID=JSON.parse(comID);
    comID=comID.EnterpriseCode;
      this.state = {
      personalInfoVisible: false,
      personInfo: {},
      dataProp: [],
      loadingPersonInfo: false,
      modalVis:'',
      numberId:'',
      comID
    };
  }

  getPersonalInfo = async id => {
    try {
      this.setState({ loadingPersonInfo: true });
      const res = await http().getTable({
        resid: '622576278943',
        dblinkname: 'ehr',
        cmswhere: `C3_464172117706 = ${id}`
      });
      this.setState({
        personInfo: res.data[0]
      });
      this.getFormData(res.data[0]);
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      this.setState({ loadingPersonInfo: false });
    }
  };

  getFormData = async record => {
    let res;
    try {
      res = await http().getFormData({
        resid: '622576278943',
        formName: '个人详细信息',
        dblinkname: 'ehr'
      });
      const formData = dealControlArr(res.data.columns);
      const dataProp = getDataProp(formData, record, true, false, false);
      this.setState({ dataProp });
    } catch (err) {
      console.log(err);
      return message.error(err.message);
    }
  };
  render() {
    const { person } = this.props;
    const {
      personalInfoVisible,
      personInfo,
      dataProp,
      loadingPersonInfo,
      modalVis,
      comID
    } = this.state;
    let id;
    if (person) {
      id = person.C3_305737857578;
    }
    return (
      <div className="performance-query">
        <div className="personInfoQuery">
          <div style={{ height: '100%' }}>
            <Skeleton loading={!id}>
              <TableData
                key="1"
                size="small"
                resid={this.props.resid||723564615206}
                cmswhere={this.props.cms||``}
                isFrontEndPagination={true}
                subtractH={200}
                hasAdvSearch={true}
                hasAdd={false}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasBeBtns={false}
                hasRowModify={false}
                hasRowSelection={false}
                actionBarWidth={400}
                cparm1={id}
                formProps={{ width: 1000 }}
                baseURL={this.baseURL}
                downloadBaseURL={this.attendanceDownloadURL}
                recordFormUseAbsolute={true}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                customRowBtns={[
                  record => {
                    return (<>
                      <Button
                        size="small"
                        onClick={async () => {
                          this.setState({
                            personalInfoVisible: true
                          });
                          await this.getPersonalInfo(record.C3_305737857578);
                        }}
                      >
                        个人信息详情
                      </Button>
                      <Button
                      size="small"
                      onClick={() => {
                        this.setState({
                          modalVis: '合同',
                          numberId:record.C3_227192472953
                        });
                      }}
                    >
                      合同历史
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        this.setState({
                          modalVis: '变动',
                          numberId:record.C3_227192472953
                        });
                      }}
                    >
                      变动历史
                    </Button>
                    </>
                    );
                  }
                ]}
                subTableArrProps={[
                  {
                    subTableName: '合同记录', // 必选（若不选则标签页标题为子表的 resid）
                    subResid: 446580376907, // 必选
                    tableProps: {
                      hasAdvSearch: false,
                      hasDelete: false,
                      hasRowDelete: false,
                      hasRowModify: false,
                      hasRowView: true,
                      hasBeBtns: false,
                      actionBarWidth: 100,
                      baseURL: this.baseURL,
                      height: 600,
                      subtractH: 170,
                      downloadBaseURL: this.attendanceDownloadURL
                    }
                  }
                ]}
              />
            </Skeleton>
          </div>
          <Modal
            title="个人信息详情"
            visible={personalInfoVisible}
            onOk={() => this.setState({ personalInfoVisible: false })}
            onCancel={() => this.setState({ personalInfoVisible: false })}
            destroyOnClose
            width="70%"
          >
            <div>
              <Spin spinning={loadingPersonInfo}>
                <FormData
                  info={{ dataMode: 'main', resid: '622576278943' }}
                  operation="view"
                  data={dataProp}
                  record={personInfo}
                  useAbsolute={true}
                />
              </Spin>
            </div>
          </Modal>
          <Modal
            title={modalVis+"历史"}
            visible={modalVis!=''}
            onOk={() => this.setState({ modalVis: '' })}
            onCancel={() => this.setState({ modalVis: '' })}
            destroyOnClose
            width="70%"
          >
            <div style={{height:'80vh'}}>
                {
                  modalVis==='合同'?
                  <TableData 
                resid={436624421847} 
                cmswhere={`C3_436624448098 = '${this.state.numberId}'`}
                baseURL={comID==='2000'?'http://10.108.2.66:9091/':'http://10.108.2.66:1001/'} 
                downloadBaseURL={comID==='2000'?'http://10.108.2.66:80/':'http://10.108.2.66:1000/'}
                hasRowModify={false}
                hasAdd={false}
                hasRowDelete={false}
                hasRowView={true}
                subtractH={240}
                hasBeBtns={false}
                hasDelete={false}
                hasModify={false}
                hasAdvSearch={true}
              />
                  :
                  <TableData 
                resid={638466404110} 
                cmswhere={`C3_227192472953 = '${this.state.numberId}'`}
                baseURL={'http://10.108.2.66:9091/'} 
                downloadBaseURL={'http://10.108.2.66:80/'}
                hasRowModify={false}
                hasAdd={false}
                hasRowDelete={false}
                hasRowView={true}
                subtractH={240}
                hasBeBtns={false}
                hasDelete={false}
                hasModify={false}
                hasAdvSearch={true}
              />
                }
              
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
export default PersonInfo;
