import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import {
  Tabs,
  Button,
  Modal
} from 'antd';
import http from 'Util20/api';
import './ShVisitApprove.less';
/**
 * 上海访客审批
 */
export default class ShVisitApprove extends Component {
  constructor(props) {
    super(props);
    this.baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.shVisitURL;
    this.downloadBaseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.shVisitDownLoadURL;
    this.state = {
      modalVis: false,
      fileArr: []
    }
  }
  componentDidMount() {

  }

  setFiles = (record) => {
    let fileArr = [
      {
        fileUrl: record.fileUrl,
        fileUrl2: record.fileUrl2,
        fileUrl3: record.fileUrl3,
      },
      {
        fileUrl: record.fileUrlA,
        fileUrl2: record.fileUrl2A,
        fileUrl3: record.fileUrl3A,
      }, {
        fileUrl: record.fileUrlB,
        fileUrl2: record.fileUrl2B,
        fileUrl3: record.fileUrl3B,
      }, {
        fileUrl: record.fileUrlC,
        fileUrl2: record.fileUrl2C,
        fileUrl3: record.fileUrl3C,
      }, {
        fileUrl: record.fileUrlD,
        fileUrl2: record.fileUrl2D,
        fileUrl3: record.fileUrl3D,
      }, {
        fileUrl: record.fileUrlE,
        fileUrl2: record.fileUrl2E,
        fileUrl3: record.fileUrl3E,
      },
      {
        fileUrl: record.fileUrlF,
        fileUrl2: record.fileUrl2F,
        fileUrl3: record.fileUrl3F,
      },
      {
        fileUrl: record.fileUrlG,
        fileUrl2: record.fileUrl2G,
        fileUrl3: record.fileUrl3G,
      },
      {
        fileUrl: record.fileUrlH,
        fileUrl2: record.fileUrl2H,
        fileUrl3: record.fileUrl3H,
      },
      {
        fileUrl: record.fileUrlI,
        fileUrl2: record.fileUrl2I,
        fileUrl3: record.fileUrl3I,
      }
    ]
    this.setState({
      fileArr,
      modalVis: true
    })
  }
  render() {
    return (
      <div className="table-data-wrap">
        <Modal
          visible={this.state.modalVis}
          onCancel={() => { this.setState({ modalVis: false, fileArr: [] }) }}
          footer={null}
          destroyOnClose
          title={'查看附件'}
          width={800}
        >
          <table>
            <tr>
              <td>
                序号
                  </td>
              <td>
                来访人员表
                  </td>
              {/* <td>
                访客绿码
                  </td> */}
              {/* <td>
                行动轨迹
                  </td> */}
            </tr>
            {
              this.state.fileArr.map(
                (item, key) => {
                  return (
                    <tr>
                      <td>
                        {key + 1}
                      </td>
                      <td>
                        <a target='
                            _blank' href={item.fileUrl}>{item.fileUrl}</a>
                      </td>
                      {/* <td>
                        <a target='
                            _blank' href={item.fileUrl2}>{item.fileUrl2}</a>
                      </td> */}
                      {/* <td>
                        <a target='
                            _blank' href={item.fileUrl3}>{item.fileUrl3}</a>
                      </td> */}
                    </tr>
                  )
                }
              )
            }
          </table>
        </Modal>
        <Tabs defaultActiveKey="1" size="small">
          <Tabs.TabPane tab="未审批" key="1">
            <div className='wrap'>
              <TableData
                resid={this.props.pendingResid}
                baseURL={this.baseURL}
                downloadBaseURL={this.downloadBaseURL}
                hasRowView={false}
                hasAdd={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                hasDelete={false}
                hasRowSelection={true}
                hasBeBtns={true}
                subtractH={175}
                isUseFormDefine={true}
                recordFormUseAbsolute={true}
                hasRowView={true}
                customRowBtns={[
                  record => {
                    return (<Button
                      onClick={() => {
                        this.setFiles(record)
                      }}
                    >
                      查阅附件
                    </Button>
                    );
                  }
                ]}
              /></div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="已审批通过" key="2">
            <div className='wrap'>

              <TableData
                resid={this.props.approvedResid}
                hasRowView={false}
                baseURL={this.baseURL}
                downloadBaseURL={this.downloadBaseURL}
                hasAdd={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasBeBtns={true}
                hasModify={false}
                hasDelete={false}
                subtractH={175}
                hasRowView={true}
                isUseFormDefine={true}
                recordFormUseAbsolute={true}
                customRowBtns={[
                  record => {
                    return (
                      <Button
                        onClick={() => {
                          this.setFiles(record)
                        }}
                      >
                        查阅附件
                      </Button>
                    );
                  }
                ]}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="已审批拒绝" key="3">
            <div className='wrap'>

              <TableData
                resid={this.props.refusedResid}
                hasRowView={false}
                baseURL={this.baseURL}
                downloadBaseURL={this.downloadBaseURL}
                hasAdd={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasBeBtns={true}
                hasModify={false}
                hasDelete={false}
                subtractH={175}
                hasRowView={true}
                isUseFormDefine={true}
                recordFormUseAbsolute={true}
                customRowBtns={[
                  record => {
                    return (
                      <Button
                        onClick={() => {
                          this.setFiles(record)
                        }}
                      >
                        查阅附件
                      </Button>
                    );
                  }
                ]}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
