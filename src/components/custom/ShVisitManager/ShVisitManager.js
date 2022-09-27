import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import {
  Tabs,
  Button,
  Input,
  Modal,
  Select,
  message
} from 'antd';
import http from 'Util20/api';
import './ShVisitManager.less';
const { Option } = Select;

/**
 * 上海访客前台登记
 */
export default class ShVisitManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      fileUrl: '',
      activated: '',
      showModal: false,
      loading: false,
      REC_ID: '',
      isAdd: false,
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
      }
    ]
    this.setState({
      fileArr,
      modalVis: true
    })
  }
  openModal = (v, a) => {
    if (v) {
      this.setState({
        fileName: v.fileName,
        fileUrl: v.fileUrl,
        activated: v.activated,
        showModal: true,
        REC_ID: v.REC_ID,
        isAdd: false
      })
    } else {
      this.setState({
        fileName: '',
        fileUrl: '',
        activated: '',
        showModal: true,
        REC_ID: '',
        isAdd: true
      })
    }

  }
  handleUpload = (e) => {
    let files = e.target.files || e.dataTransfer.files;

    if (!files.length) return;
    let type = files[0].name.split('.');
    let size = files[0].size;
    if (size > 5242880) {
      alert("请选择5M以内的文件！");
      return false;
    }
    this.uploadFile(files[0], `http://kingofdinner.realsun.me:1201/api/AliyunOss/PutOneImageObject?bucketname=nutritiontower&srctype=${type[type.length - 1]}`, "cloud").then((result) => {

      this.setState({ loading: false, fileUrl: result })

    }, (err) => {
      this.setState({ loading: false })
    })
  }
  uploadFile = (file, url, mode) => {
    return new Promise((resolve, reject) => {
      let fd = new FormData();
      fd.append('file', file, file.name);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        if (xhr.status === 200 && (data.error === 0 || data.error === '0')) {
          let fileUrl;
          if (mode === 'local') {
            fileUrl = data.httpfilename;
          } else if (mode === 'cloud') {
            fileUrl = data.data;
          }
          resolve(fileUrl);
        } else {
          reject(data);
        }
      };
      xhr.send(fd);
    });
  };
  handleSub = async () => {
    let res;
    try {
      this.setState({ loading: true });
      res = await http().modifyRecords({
        resid: 700158571490,
        data: [this.state]
      })
      this.clearState();
      message.success('成功');
      this.tableDataRef.handleRefresh();
    } catch (e) {
      console.log(e.message);
      message.error(e.message)
      this.setState({ loading: false })
    }
  }
  handleAdd = async () => {
    let res;
    try {
      this.setState({ loading: true });
      res = await http().addRecords({
        resid: 700158571490,
        data: [this.state]
      })
      this.clearState();
      message.success('成功');
      this.tableDataRef.handleRefresh();
    } catch (e) {
      console.log(e.message);
      message.error(e.message)
      this.setState({ loading: false })
    }
  }
  clearState = () => {
    this.setState({
      fileName: '',
      loading: false,
      fileUrl: '',
      activated: '',
      showModal: false,
      REC_ID: ''
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
              <td>
                访客绿码
                  </td>
              <td>
                行动轨迹
                  </td>
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
                      <td>
                        <a target='
                            _blank' href={item.fileUrl2}>{item.fileUrl2}</a>
                      </td>
                      <td>
                        <a target='
                            _blank' href={item.fileUrl3}>{item.fileUrl3}</a>
                      </td>
                    </tr>
                  )
                }
              )
            }
          </table>
        </Modal>
        <Tabs defaultActiveKey="1" size="small">
          <Tabs.TabPane tab="全部" key="1">
            <div className='wrap'>

              <TableData
                resid={'687801999108'}
                hasRowView={false}
                hasAdd={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                hasDelete={false}
                hasBeBtns={true}
                subtractH={175}
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
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="访问中" key="2">
            <div className='wrap'>

              <TableData
                resid={'687823076582'}
                hasRowView={false}
                hasAdd={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                hasDelete={false}
                subtractH={175}
                hasBeBtns={true}
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
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="访问结束" key="3">
            <div className='wrap'>

              <TableData
                resid={'687823090661'}
                hasRowView={false}
                hasAdd={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                hasDelete={false}
                subtractH={175}
                hasRowView={true}
                hasBeBtns={true}
                customRowBtns={[
                  record => {
                    return (<Button
                      onClick={() => {
                        this.setFiles(record);
                      }}
                    >
                      查阅附件
                    </Button>
                    );
                  }
                ]}
              /></div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="文件模板管理" key="4">
            <Modal
              visible={this.state.showModal}
              width={'80vw'}
              title={'文件模板'}
              onCancel={() => {
                this.setState({ showModal: false });
              }}
              destroyOnClose
              footer={
                this.state.viewMode == 'Y' ? null : (
                  <Button
                    loading={this.state.loading}
                    type="primary"
                    onClick={() => {
                      if (this.state.isAdd) {
                        this.handleAdd();
                      } else {
                        this.handleSub();
                      }
                    }}
                  >
                    提交
                  </Button>
                )
              }
            >
              <div className='form'>
                <div>
                  <span>文件名：</span>
                  <Input
                    value={this.state.fileName}
                    onChange={(v) => { this.setState({ fileName: v.target.value }) }}
                  />
                </div>
                <div>
                  <span>是否生效：</span>
                  <Select
                    style={{ width: 120, marginRight: 16 }}
                    size="small"
                    onChange={v => {
                      this.setState({ activated: v });
                    }}
                    value={this.state.activated}
                  >
                    <Select.Option value=""></Select.Option>
                    <Select.Option value="Y">Y</Select.Option>
                  </Select>
                </div>
                <div>
                  <b style={{ color: '#f5222d' }}>*</b>上传文件：<input id="ss" name="ss" type="file" onChange={v => { this.handleUpload(v) }} />
                </div>
              </div>
            </Modal>
            <div className='wrap'>

              <TableData
                resid={'700158437331'}
                hasRowView={false}
                hasAdd={false}
                hasRowDelete={true}
                hasRowModify={false}
                hasModify={false}
                hasDelete={true}
                subtractH={175}
                hasBeBtns={true}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                hasRowView={true}
                actionBarExtra={({ dataSource, selectedRowKeys }) => {
                  return (
                    <>
                      <Button
                        size={'small'}
                        onClick={() => {
                          this.openModal(null, 'Add');
                        }}>
                        添加
                </Button>
                    </>
                  )
                }}
                customRowBtns={[
                  record => {
                    return (
                      <>
                        <Button
                          onClick={
                            () => {
                              this.openModal(record);
                            }
                          }
                        >
                          修改
                  </Button>
                        <Button
                          onClick={() => {
                            window.open(record.fileUrl)
                          }}
                        >
                          下载
                    </Button>
                      </>
                    );
                  }
                ]}
              /></div>
          </Tabs.TabPane>

        </Tabs>
      </div>
    );
  }
}
