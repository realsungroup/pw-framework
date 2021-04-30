import React from 'react';
import { Spin, Button, Icon, Tabs } from 'antd';
// import http from 'Util20/api';
import './PersonInfoManager.less';
import PersonInfoInFile from '../PersonInfoInFile/';
import TableData from '../../common/data/TableData';
import TableDataSavePage from '../../common/data/TableDataSavePage';
import DepartmentTree from '../PersonnelInformation/DepartmentTree';
let laowuURL = '';
let laowuDownURL = '';
/**
 * 档案管理内的个人信息
 */
const { TabPane } = Tabs;
class PersonInfoManager extends React.Component {
  constructor(props) {
    // resid:612530416359

    super(props);
    var baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs
        .comprehensiveQueryBaseURL;
    laowuURL = window.pwConfig[process.env.NODE_ENV].customURLs.laowuURL;
    laowuDownURL = window.pwConfig[process.env.NODE_ENV].customURLs.staffComDownloadURL;
    console.log(laowuURL);
    let downloadUrl = window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureDownloadBaseURL


    var bol = false; //是否为劳务公司
    var usercode = localStorage.getItem('userInfo');
    var usrChara = JSON.parse(usercode);
    var userCode = usrChara.UserInfo.EMP_USERCODE;
    if (userCode == '632830432866') {
      bol = true;
      baseURL = laowuURL;
      downloadUrl = window.pwConfig[process.env.NODE_ENV].customURLs.staffComDownloadURL
      this.state = {
        showDetail: false,
        selectedRecord: '',
        baseURL: baseURL,
        isOuter: bol,
        selectedDepartment: '',
        laowu: true,
        downloadUrl,
        // laowuURL: laowuURL,
        // laowuDownURL: window.pwConfig[process.env.NODE_ENV].customURLs.staffComDownloadURL
      };
    } else {
      this.state = {
        showDetail: false,
        selectedRecord: '',
        baseURL: baseURL,
        isOuter: bol,
        selectedDepartment: '',
        laowu: false,
        downloadUrl,
        // laowuURL: laowuURL,
        // laowuDownURL: window.pwConfig[process.env.NODE_ENV].customURLs.staffComDownloadURL
      };
    }


  }
  componentDidMount() { }

  render() {
    const { baseURL, selectedDepartment } = this.state;
    return (
      <div className="PersonInfoManager">
        <Tabs defaultActiveKey="1" style={{ width: '100vw', height: '100vh' }}>
          <TabPane key='1' tab='微信后台数据'>

            <div className="table-data-wrapper">
              <TableDataSavePage
                // 464171754083
                resid={464705942338}
                hasRowView={false}
                baseURL={laowuURL}
                downloadBaseURL={laowuDownURL}
                hasAdd={false}
                refTargetComponentName="TableData"
                wrappedComponentRef={element => (this.tableDataRef = element)}
                hasRowSelection={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                hasDelete={false}
                style={{ height: '100%' }}
                hasBeBtns={true}
                subtractH={180}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
                      <div>
                        <Button
                          onClick={() => {
                            let t;
                            let num;
                            let gonghao;
                            t = 'C3_464172117706'
                            num = 'C3_464172300168'
                            gonghao = 'C3_464702128504'

                            this.setState({
                              showDetail: true,
                              selectedRecord: record[t],
                              idNum: record[num],
                              gonghao: record[gonghao]
                            });
                          }}
                        >
                          详情
                    </Button>
                      </div>
                    );
                  }
                ]}
              />
            </div>
            {this.state.showDetail ? (
              <div className="overlay">
                <Icon
                  type="close-circle"
                  onClick={() => {
                    this.tableDataRef.handleRefresh();
                    this.setState({ showDetail: false });
                  }}
                  style={{
                    zIndex: '1000',
                    position: 'fixed',
                    right: '24px',
                    top: '16px',
                    cursor: 'pointer',
                    fontSize: '24px',
                    color: '#333'
                  }}
                ></Icon>
                <PersonInfoInFile
                  edit={true}
                  isOuter={this.state.isOuter}
                  memberId={this.state.selectedRecord}
                  baseURL={laowuURL}
                  idNum={this.state.idNum}
                  gonghao={this.state.gonghao}
                ></PersonInfoInFile>
              </div>
            ) : null}
          </TabPane>
          {this.state.laowu ? null :

            <TabPane key='2' tab='内网人员数据'>
              <div className="table-data-wrapper">

                {!this.state.laowu ? <div className="department-tree-wrapper">
                  <DepartmentTree
                    resid="417643880834"
                    baseURL={baseURL}
                    idField="DEP_ID"
                    pidField="DEP_PID"
                    titleField="DEP_NAME"
                    style={{ float: 'left' }}
                    rootNode={{
                      title: 'Enterprise',
                      key: 0
                    }}
                    onSelect={selectedKeys => {
                      this.setState({
                        selectedDepartment: selectedKeys[0] ? selectedKeys[0] : ''
                      });
                    }}
                    treeClassName="personnel-information-tree"
                  />
                </div> : null}
                <div className='tableRight'>
                  <TableDataSavePage
                    // 464171754083
                    resid={this.state.laowu ? 464705942338 : 637772568684}
                    hasRowView={false}
                    baseURL={baseURL}
                    downloadBaseURL={this.state.downloadUrl}
                    hasAdd={false}
                    refTargetComponentName="TableData"
                    wrappedComponentRef={element => (this.tableDataRef = element)}
                    hasRowSelection={false}
                    hasRowDelete={false}
                    hasRowModify={false}
                    hasModify={false}
                    hasDelete={false}
                    style={{ height: '100%' }}
                    hasBeBtns={true}
                    subtractH={180}
                    cmswhere={
                      this.state.laowu ? '' : (
                        selectedDepartment
                          ? `HRUSER_DEP2ID = '${selectedDepartment}' or HRUSER_DEP3ID = '${selectedDepartment}' or HRUSER_DEP4ID = '${selectedDepartment}' or HRUSER_DEP5ID = '${selectedDepartment}'`
                          : '')
                    }
                    customRowBtns={[
                      (record, btnSize) => {
                        return (
                          <div>
                            <Button
                              onClick={() => {
                                let t;
                                let num;
                                let gonghao;
                                if (this.state.laowu) {
                                  t = 'C3_464172117706'
                                  num = 'C3_464172300168'
                                  gonghao = 'C3_464702128504'
                                } else {
                                  t = 'C3_305737857578'
                                  num = 'C3_308778699827'
                                  gonghao = 'C3_227192472953'
                                }

                                this.setState({
                                  showDetail: true,
                                  selectedRecord: record[t],
                                  idNum: record[num],
                                  gonghao: record[gonghao]
                                });
                              }}
                            >
                              详情
                    </Button>
                          </div>
                        );
                      }
                    ]}
                  />
                </div>
              </div>
              {this.state.showDetail ? (
                <div className="overlay">
                  <Icon
                    type="close-circle"
                    onClick={() => {
                      this.tableDataRef.handleRefresh();
                      this.setState({ showDetail: false });
                    }}
                    style={{
                      zIndex: '1000',
                      position: 'fixed',
                      right: '24px',
                      top: '16px',
                      cursor: 'pointer',
                      fontSize: '24px',
                      color: '#333'
                    }}
                  ></Icon>
                  <PersonInfoInFile
                    edit={true}
                    isOuter={this.state.isOuter}
                    memberId={this.state.selectedRecord}
                    idNum={this.state.idNum}
                    gonghao={this.state.gonghao}
                  ></PersonInfoInFile>
                </div>
              ) : null}

            </TabPane>

          }

        </Tabs>
      </div>
    );
  }
}
export default PersonInfoManager;
