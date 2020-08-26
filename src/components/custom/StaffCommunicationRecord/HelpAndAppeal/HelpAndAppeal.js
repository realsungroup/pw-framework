import React from 'react';
import './HelpAndAppeal.less';
import {
  Modal,
  Button,
  message,
  Popconfirm,
  Input,
  Menu,
  Icon,
  Select,
  DatePicker,
  Spin,
  Row,
  Col
} from 'antd';
import TableData from '../../../common/data/TableData';
import downloadImg from './下载.png';
import http, { makeCancelable } from 'Util20/api';
import download from 'downloadjs';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const TextArea = Input.TextArea;

const resid = 648050843809;
const residNo = 649263815536; //求助或申诉未处理
const residEd = 649263833028; //求助或申诉已处理
const residCancel = 649263844037; //求助或申诉已撤销
const residall = 649263855605; //求助或申诉全部
const residBack = 649441654428; //求助或申诉退回

class HelpAndAppeal extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.staffComBaseURL;
    this.dlEmployDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.staffComDownloadURL;
  }
  state = {
    mode: 'inline',
    theme: 'light',
    selectKey: '1',
    collapsed: false,
    showRecord: false,
    selectRecord: {}, //选中的记录
    imgProofRecord: [], //img证据
    audioProof: [], //音频证据
    videoProof: [], //视频证据
    loading: false,
    replyModal: false,
    proofModal: false,
    replyTextModal: false,
    replyContent: '', //回复内容
    readFilter: '全部',
    beginTime: '', //开始时间
    endTime: '', //结束时间
    cmswhere: '',
    targetInfo: {},
    noticeLoading: false,
    markReadLoading: false,
    isBatchReply: false,
    selectedRecords: [],
    selectedProofs: [],
    replyButtonLoading: false,
    backVisible: false, //退回模态窗是否显示
    backReason: '', //退回理由
    backLoading: '' //
  };

  componentDidMount = () => {};

  onSelect = e => {
    this.setState({
      selectKey: e.key
    });
  };

  viewRecord = async record => {
    this.setState({
      showRecord: true,
      loading: true
    });
    if (record.status === '未处理') {
      await this.markRead(record);
    }
    let res;
    let img = [],
      audio = [],
      video = [];

    //获取子表证据记录
    try {
      res = await http({ baseURL: this.baseURL }).getTable({
        resid: '648054096833',
        cmswhere: `recordID = ${record.recordID}`
      });
      res.data.forEach(item => {
        if (item.mediaType === '图片') {
          img.push(item);
        } else if (item.mediaType === '音频') {
          audio.push(item);
        } else if (item.mediaType === '视频') {
          video.push(item);
        }
      });
    } catch (error) {
      return message.error(error.message);
    }
    this.setState({
      selectRecord: record,
      imgProofRecord: img,
      audioProof: audio,
      videoProof: video,
      loading: false
    });
  };

  markRead = async record => {
    try {
      http({ baseURL: this.baseURL }).modifyRecords({
        resid,
        data: [{ REC_ID: record.REC_ID, status: '已阅读', renew: 'Y' }]
      });
    } catch (error) {
      message.error(error.message);
    }
  };

  onCancelText = () => {
    this.setState({
      replyTextModal: false
    });
  };

  replyText = value => {
    this.setState({
      replyContent: value
    });
  };

  reply = record => {
    this.setState({
      replyTextModal: true,
      selectRecord: record
    });
  };

  submitReply = async () => {
    const { isBatchReply, selectedRecords } = this.state;
    try {
      const data = isBatchReply
        ? selectedRecords.map(item => ({
            REC_ID: item.recordID,
            replication: this.state.replyContent,
            replicationHR: 'Y',
            status: '已处理',
            renew: 'Y'
          }))
        : [
            {
              REC_ID: this.state.selectRecord.recordID,
              replication: this.state.replyContent,
              replicationHR: 'Y',
              status: '已处理',
              renew: 'Y'
            }
          ];
      this.setState({ replyButtonLoading: true });
      await http({ baseURL: this.baseURL }).modifyRecords({
        resid,
        data
      });
      message.success('回复成功');
      this.setState({
        replyTextModal: false,
        showRecord: false,
        selectedRecords: [],
        isBatchReply: false
      });
      this.tableDataRef.handleRefresh();
    } catch (error) {
      message.error(error.message);
    }
    this.setState({ replyButtonLoading: false });
  };

  //下载音频
  downloadAudio = index => {
    const audios = this.state.audioProof;
    // console.log(audios[index]);
    // window.open(audios[index].fileURL)
    var xmlHttp = null;
    if (window.XMLHttpRequest) {
      // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
      xmlHttp = new XMLHttpRequest();
    }
    //2.如果实例化成功，就调用open（）方法：
    if (xmlHttp != null) {
      xmlHttp.open('get', audios[index].fileURL, true);
      xmlHttp.send();
      xmlHttp.onreadystatechange = doResult; //设置回调函数
    }
    function doResult() {
      if (xmlHttp.readyState == 4) {
        //4表示执行完成
        if (xmlHttp.status == 200) {
          //200表示执行成功
          //引用js库：download.js
          download(xmlHttp.responseText, `音频文件${index}`, 'text/plain');
        }
      }
    }
  };
  //下载视频
  downloadVideo = index => {
    const videos = this.state.videoProof;
    // console.log(audios[index]);
    // window.open(audios[index].fileURL)
    var xmlHttp = null;
    if (window.XMLHttpRequest) {
      // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
      xmlHttp = new XMLHttpRequest();
    }
    //2.如果实例化成功，就调用open（）方法：
    if (xmlHttp != null) {
      xmlHttp.open('get', videos[index].fileURL, true);
      xmlHttp.send();
      xmlHttp.onreadystatechange = doResult; //设置回调函数
    }
    function doResult() {
      if (xmlHttp.readyState == 4) {
        //4表示执行完成
        if (xmlHttp.status == 200) {
          //200表示执行成功
          //引用js库：download.js
          download(xmlHttp.responseText, `视频文件${index}`, 'text/plain');
        }
      }
    }
  };

  cancelModal = () => {
    this.setState({
      showRecord: false
    });
  };

  timeChange = value => {
    if (value.length) {
      this.setState({
        beginTime: value[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: value[1].format('YYYY-MM-DD HH:mm:ss')
      });
    } else {
      this.setState({
        beginTime: '',
        endTime: ''
      });
    }
  };

  SearchData = () => {
    let cmsWhere = '';
    if (this.state.readFilter !== '全部') {
      cmsWhere += `status = '${this.state.readFilter}'`;
    }
    if (this.state.beginTime !== '') {
      cmsWhere += `${cmsWhere ? ' and ' : ''}REC_CRTTIME > '${
        this.state.beginTime
      }' and REC_CRTTIME < '${this.state.endTime}'`;
    }
    console.log('cmsWhere', cmsWhere);
    this.setState({
      cmswhere: cmsWhere
    });
  };

  markAllRead = selectedRecords => async () => {
    if (!selectedRecords.length) {
      return message.info('请选择记录');
    }
    selectedRecords.forEach(item => {
      item.status = '已阅读';
    });
    try {
      this.setState({ markReadLoading: true });
      await http({ baseURL: this.baseURL }).modifyRecords({
        resid,
        data: selectedRecords,
        renew: 'Y'
      });
      this.tableDataRef.handleRefresh();
      message.success('操作成功');
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
    this.setState({
      markReadLoading: false
    });
  };

  handleBackComplain = async () => {
    const { backReason, selectRecord } = this.state;
    if (!backReason) {
      return message.info('请输入退回理由');
    }
    try {
      this.setState({ backLoading: true });
      await http({ baseURL: this.baseURL }).modifyRecords({
        resid,
        data: [
          {
            REC_ID: selectRecord.REC_ID,
            isBack: 'Y',
            status: '已退回',
            renew: 'Y',
            backReason
          }
        ]
      });
      this.tableDataRef.handleRefresh();
      message.success('退回成功');
      this.setState({ backReason: '', backVisible: false, showRecord: false });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
    this.setState({ backLoading: false });
  };
  renderContentBody = (resid, hasButton) => {
    const { cmswhere, markReadLoading, selectKey, readFilter } = this.state;
    return (
      <div>
        <div className="staff-contain_menu">
          <div className="staff-contain_menu_headerMenu">
            <span>是否已读:</span>
            <Select
              size="small"
              defaultValue="全部"
              style={{ width: 100, marginLeft: 3 }}
              value={readFilter}
              onChange={v => {
                this.setState({ readFilter: v });
              }}
            >
              <Option value="全部">全部</Option>
              <Option value="已阅读">已阅读</Option>
              <Option value="未处理">未阅读</Option>
            </Select>
          </div>
          <div className="staff-contain_menu_headerMenu">
            <span>时间起止:</span>
            <RangePicker
              size="small"
              style={{ marginLeft: 5 }}
              onChange={this.timeChange}
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </div>
          <Button
            size="small"
            type="primary"
            onClick={this.SearchData}
            className="staff-contain_menu_headerMenu"
          >
            <Icon type="search"></Icon>
            搜索
          </Button>
        </div>
        <div style={{ height: 570 }}>
          <TableData
            baseURL={this.baseURL}
            resid={resid}
            key={resid}
            wrappedComponentRef={element => (this.tableDataRef = element)}
            refTargetComponentName="TableData"
            hasAdd={false}
            hasBeBtns={false}
            hasModify={false}
            hasBackBtn={false}
            hasDelete={false}
            hasRowModify={false}
            hasRowSelection={true}
            hasRowView={false}
            hasRowDelete={false}
            subtractH={200}
            cmswhere={cmswhere}
            actionBarWidth={200}
            actionBarExtra={({
              dataSource = [],
              selectedRowKeys = [],
              data = [],
              recordFormData,
              size
            }) => {
              const selectedRecords = selectedRowKeys.map(key => {
                return dataSource.find(item => item.REC_ID === key);
              });
              return (
                <div>
                  {selectKey === '1' && (
                    <>
                      <Popconfirm
                        title="确认标记已阅读吗？"
                        onConfirm={this.markAllRead(selectedRecords)}
                      >
                        <Button size="small" loading={markReadLoading}>
                          标记为已阅读
                        </Button>
                      </Popconfirm>
                      <Button
                        size="small"
                        onClick={() => {
                          if (!selectedRecords.length) {
                            return message.info('请选择记录');
                          }
                          this.setState({
                            selectedRecords,
                            isBatchReply: true,
                            replyTextModal: true
                          });
                        }}
                      >
                        批量回复
                      </Button>
                    </>
                  )}
                </div>
              );
            }}
            customRowBtns={[
              record => {
                return (
                  <Button
                    onClick={() => {
                      this.viewRecord(record);
                    }}
                  >
                    查看
                  </Button>
                );
              },
              hasButton &&
                (record => {
                  return (
                    <Button
                      onClick={() => {
                        this.reply(record);
                      }}
                    >
                      回复
                    </Button>
                  );
                })
            ]}
          />
        </div>
      </div>
    );
  };
  renderContent = () => {
    const { selectKey } = this.state;
    switch (selectKey) {
      case '1':
        return this.renderContentBody(residNo, true);
      case '3':
        return this.renderContentBody(residEd, false);
      case '4':
        return this.renderContentBody(residCancel, false);
      case '5':
        return this.renderContentBody(residall, false);
      case '6':
        return this.renderContentBody(residBack, false);
      default:
    }
  };
  render() {
    const {
      selectKey,
      selectRecord,
      imgProofRecord,
      audioProof,
      videoProof,
      replyButtonLoading,
      backVisible,
      backReason,
      backLoading
    } = this.state;
    return (
      <div className="staff-contain" style={{ display: 'flex' }}>
        <div style={{ width: '100px' }}>
          <Menu
            style={{ height: '100vh' }}
            defaultSelectedKeys={['1']}
            mode={this.state.mode}
            onSelect={this.onSelect}
          >
            <Menu.Item key="1">
              <span> 未处理 </span>
            </Menu.Item>
            <Menu.Item key="3">
              <span> 已处理</span>
            </Menu.Item>
            <Menu.Item key="6">
              <span> 已退回</span>
            </Menu.Item>
            <Menu.Item key="4">
              <span> 已撤回 </span>
            </Menu.Item>
            <Menu.Item key="5">
              <span> 全部 </span>
            </Menu.Item>
          </Menu>
        </div>
        <div
          style={{
            overflow: 'auto',
            width: 'calc(100% - 40px)'
          }}
        >
          {this.renderContent()}
        </div>
        <Modal
          visible={this.state.showRecord}
          width={777}
          style={{ height: 'auto' }}
          title={'记录编号:' + selectRecord.recordID}
          onCancel={this.cancelModal}
          destroyOnClose={true}
          footer={null}
        >
          <Spin spinning={this.state.loading}>
            <div className="modalContainer">
              <Row className="recordInfo">
                <Col span={12}>
                  <div>
                    <label>姓名：</label>
                    {selectRecord.name}
                  </div>
                </Col>

                <Col span={12}>
                  <div>
                    <label>工号：</label>
                    {selectRecord.jobId}
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label>联系方式：</label>
                    {selectRecord.phone}
                  </div>
                </Col>

                <Col span={12}>
                  <div>
                    <label>发生时间：</label>
                    {selectRecord.time}
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <label>事件概述：</label>
                    {selectRecord.theme}
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <label>详细内容：</label> {selectRecord.detail}
                  </div>
                </Col>
                <Col span={24}>
                  <div>
                    <label>HR回复内容：</label> {selectRecord.replication}
                  </div>
                </Col>
              </Row>

              <div className="picProof">
                <h4>图片证据：</h4>
                {imgProofRecord.length ? (
                  imgProofRecord.map(item => {
                    return <img src={item.fileURL} alt="" />;
                  })
                ) : (
                  <span>暂无图片</span>
                )}
              </div>

              <div className="videoProof">
                <h4>视频证据：</h4>
                {videoProof.length ? (
                  videoProof.map((item, index) => {
                    return (
                      <>
                        <video
                          controls
                          src={item.fileURL}
                          autoPlay={false}
                          style={{ width: '50%' }}
                        />
                        <img
                          src={downloadImg}
                          onClick={() => {
                            this.downloadVideo(index);
                          }}
                          alt=""
                        />
                      </>
                    );
                  })
                ) : (
                  <span style={{ textAlign: 'center' }}>暂无视频</span>
                )}
              </div>
              {selectKey === '1' && (
                <Button
                  onClick={() => {
                    this.reply();
                  }}
                  style={{ marginRight: 8 }}
                >
                  回复
                </Button>
              )}
              {selectKey === '1' && (
                <Button
                  onClick={() => {
                    this.setState({ backVisible: true });
                  }}
                  type="danger"
                >
                  退回
                </Button>
              )}
            </div>
          </Spin>
        </Modal>
        <Modal
          title="回复内容"
          visible={this.state.replyTextModal}
          onCancel={this.onCancelText}
          onOk={this.submitReply}
          confirmLoading={replyButtonLoading}
          width={500}
          destroyOnClose={true}
        >
          <TextArea
            onChange={e => {
              this.replyText(e.target.value);
            }}
          />
        </Modal>
        <Modal
          visible={backVisible}
          title="退回求助或申诉"
          width={500}
          onCancel={() => {
            this.setState({ backVisible: false, backReason: '' });
          }}
          onOk={this.handleBackComplain}
          confirmLoading={backLoading}
        >
          <TextArea
            value={backReason}
            onChange={e => {
              this.setState({ backReason: e.target.value });
            }}
            placeholder="请输入退回理由"
          />
        </Modal>
      </div>
    );
  }
}

export default HelpAndAppeal;
