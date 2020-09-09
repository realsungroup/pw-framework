import React from 'react';
import './ReplyComplain.less';
import {
  Tabs,
  Button,
  message,
  Modal,
  Spin,
  Row,
  Col,
  Input,
  Upload,
  Icon
} from 'antd';
import TableData from 'Common/data/TableData';
import moment from 'moment';
import { getItem } from '../../../util20/util';
import http from '../../../util20/api';

const { TextArea } = Input;
const { TabPane } = Tabs;
const uploadURL =
  'https://finisarinterview.realsun.me/api/AliyunOss/PutFilesObject?bucketname=nutritiontower&randomfilename=true';
const residUntreated = 648669826228; //投诉处理中
const resid = 648050843809;
const subResid = 648055005558;

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.staffComBaseURL;

const downloadURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.staffComDownloadURL;

const userInfo = JSON.parse(getItem('userInfo'));

/**
 * 负责人回复员工投诉
 */
class ReplyComplain extends React.Component {
  state = {
    showRecord: false,
    selectRecord: {}, //选中的记录
    imgProofRecord: [], //img证据
    audioProof: [], //音频证据
    videoProof: [], //视频证据
    dImgProofRecord: [], //主管img证据
    dAudioProof: [], //主管音频证据
    dVideoProof: [], //主管视频证据
    depInfoRecord: {}, //部门信息
    loading: false,
    replyModal: false,
    proofModal: false,
    proofListModal: false,
    replyTextModal: false,
    replyContent: '', //回复内容
    dataSource: [],
    selectedRowKeys: [],
    leaderProofRecord: [],
    typeComplaint: [],
    replyCondition: '全部', //负责人回复情况
    complainType: '全部', //投诉类型
    isAms: '全部', //是否实名
    beginTime: '', //开始时间
    endTime: '', //结束时间
    cmswhere: '',
    targetInfo: {},
    noticeLoading: false,
    markReadLoading: false,
    isBatchReply: false,
    selectedRecords: [],
    replyVisible: false,
    previewVisible: false,
    previewFile: '',
    previewFileType: '',
    replyData: {
      text: '',
      pictures: [],
      videos: []
    },
    submitLoading: false,
    selectedTab: 'untreated'
  };
  cancelModal = () => {
    this.setState({
      showRecord: false
    });
  };
  viewRecord = async record => {
    this.setState({
      showRecord: true,
      loading: true
    });

    let res;
    let img = [],
      audio = [],
      video = [];
    let imgD = [],
      audioD = [],
      videoD = [];

    //获取子表证据记录
    try {
      res = await http({ baseURL }).getTable({
        resid: '648054096833',
        cmswhere: `recordID = ${record.recordID}`
      });
      console.log('res', res);
      res.data.forEach(item => {
        if (item.mediaType == '图片') {
          img.push(item);
        } else if (item.mediaType == '音频') {
          audio.push(item);
        } else if (item.mediaType == '视频') {
          video.push(item);
        }
      });
    } catch (error) {
      message.error(error.message);
    }
    //HRUSER_DEPID
    let userInfo;
    try {
      userInfo = await http().getTable({
        resid: '609599795438',
        cmswhere: `C3_227192472953 = '${record.targetID}'`
      });
      if (userInfo.data.length) {
        this.setState({ targetInfo: userInfo.data[0] });
      }
    } catch (error) {
      message.error(error.message);
    }

    //获取主管证据表的的记录
    let resD;
    try {
      resD = await http({ baseURL }).getTable({
        resid: '648055005558',
        cmswhere: `recordID = ${record.recordID}`
      });
      resD.data.forEach(item => {
        if (item.mediaType == '图片') {
          imgD.push(item);
        } else if (item.mediaType == '音频') {
          audioD.push(item);
        } else if (item.mediaType == '视频') {
          videoD.push(item);
        }
      });
    } catch (error) {
      message.error(error.message);
    }

    this.setState({
      selectRecord: record,
      imgProofRecord: img,
      audioProof: audio,
      videoProof: video,
      dImgProofRecord: imgD,
      dAudioProof: audioD,
      dVideoProof: videoD,
      depInfoRecord: userInfo.data[0],
      loading: false
    });
  };

  reply = record => {
    this.setState({
      selectRecord: record,
      replyVisible: true,
      isBatchReply: false
    });
  };

  handlePictureChange = ({ fileList }) =>
    this.setState({
      replyData: { ...this.state.replyData, pictures: fileList }
    });

  handleVideoChange = ({ fileList }) =>
    this.setState({
      replyData: { ...this.state.replyData, videos: fileList }
    });

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file, type) => {
    this.setState({
      previewFile: file.response.data[0],
      previewVisible: true,
      previewFileType: type
    });
  };

  handleCloseReply = () => {
    this.setState({
      replyVisible: false,
      replyData: { text: '', pictures: [], videos: [] }
    });
  };

  handleReplyTextChange = e => {
    this.setState({
      replyData: { ...this.state.replyData, text: e.target.value }
    });
  };

  handleSubmit = async () => {
    const {
      replyData: { videos, text, pictures },
      selectRecord
    } = this.state;
    if (videos.length) {
      if (
        videos.some(item => {
          return !(
            item.response &&
            item.response.data &&
            item.response.data[0]
          );
        })
      ) {
        return message.info('有文件正在上传，请稍后');
      }
    }
    if (!text) {
      return message.info('请输入回复内容');
    }
    const time = moment().format('YYYY-MM-DD HH:mm:ss');

    const data = [
      {
        resid,
        maindata: {
          REC_ID: selectRecord.REC_ID,
          leaderReplyContent: text,
          leaderReplyTime: time,
          leaderRep: 'Y',
          _state: 'modified',
          _id: 1
        },
        subdata: [],
        _id: 1
      }
    ];
    pictures.forEach((item, index) => {
      data[0].subdata.push({
        resid: subResid,
        maindata: {
          fileURL: item.response.data[0],
          mediaType: '图片',
          _state: 'added',
          _id: 1
        },
        _id: index
      });
    });
    videos.forEach((item, index) => {
      data[0].subdata.push({
        resid: subResid,
        maindata: {
          fileURL: item.response.data[0],
          mediaType: '视频',
          _state: 'added',
          _id: 1
        },
        _id: index
      });
    });
    try {
      this.setState({ submitLoading: true });
      await http({ baseURL }).saveRecordAndSubTables({
        data
      });
      // 负责人处理完通知HR
      http().modifyRecords({
        resid: 648849344996,
        data: [
          {
            REC_ID: selectRecord.leaderNoticeID,
            leaderIsReply: 'Y',
            targetName: selectRecord.target
          }
        ]
      });
      this.tableDataRef.handleRefresh();
      this.setState({
        replyVisible: false,
        replyData: { text: '', pictures: [], videos: [] }
      });
      message.success('回复成功');
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
    this.setState({ submitLoading: false });
  };

  handleBatchSubmit = async () => {
    const {
      replyData: { videos, text, pictures },
      selectedRecords
    } = this.state;
    if (videos.length) {
      if (
        videos.some(item => {
          return !(
            item.response &&
            item.response.data &&
            item.response.data[0]
          );
        })
      ) {
        return message.info('有文件正在上传，请稍后');
      }
    }
    if (!text) {
      return message.info('请输入回复内容');
    }
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    const data = selectedRecords.map(item => {
      return {
        resid,
        maindata: {
          REC_ID: item.REC_ID,
          leaderReplyContent: text,
          leaderRep: 'Y',
          leaderReplyTime: time,
          _state: 'modified',
          _id: 1
        },
        subdata: [],
        _id: 1
      };
    });
    data.forEach(item => {
      pictures.forEach((i, index) => {
        item.subdata.push({
          resid: subResid,
          maindata: {
            fileURL: i.response.data[0],
            mediaType: '图片',
            _state: 'added',
            _id: 1
          },
          _id: index
        });
      });
      videos.forEach((i, index) => {
        item.subdata.push({
          resid: subResid,
          maindata: {
            fileURL: i.response.data[0],
            mediaType: '视频',
            _state: 'added',
            _id: 1
          },
          _id: index
        });
      });
    });
    try {
      this.setState({ submitLoading: true });
      await http({ baseURL }).saveRecordAndSubTables({
        data
      });
      // 负责人处理完通知HR
      http().modifyRecords({
        resid: 648849344996,
        data: selectedRecords.map(item => {
          return {
            REC_ID: item.leaderNoticeID,
            leaderIsReply: 'Y'
          };
        })
      });
      this.tableDataRef.handleRefresh();
      this.setState({
        replyVisible: false,
        replyData: { text: '', pictures: [], videos: [] }
      });
      message.success('回复成功');
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
    this.setState({ submitLoading: false });
  };
  handleTabChange = key => {
    this.setState({ selectedTab: key });
  };

  render() {
    const {
      selectRecord,
      imgProofRecord,
      videoProof,
      dImgProofRecord,
      dVideoProof,
      depInfoRecord,
      isBatchReply,
      replyVisible,
      previewFile,
      previewVisible,
      replyData,
      previewFileType,
      submitLoading,
      selectedTab,
      showRecord
    } = this.state;
    return (
      <div className="reply-complain">
        <Tabs onChange={this.handleTabChange}>
          <TabPane tab="未处理" key="untreated">
            <div className="reply-complain__untreated">
              <TableData
                baseURL={baseURL}
                download={this.downloadURL}
                resid={residUntreated}
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
                actionBarWidth={200}
                cmswhere={`leaderRep != 'Y' and leaderID = '${userInfo.UserCode}'`}
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
                    <Button
                      size={size}
                      onClick={() => {
                        if (!selectedRecords.length) {
                          return message.info('请选择记录');
                        }
                        this.setState({
                          selectedRecords,
                          isBatchReply: true,
                          replyVisible: true
                        });
                      }}
                    >
                      批量回复
                    </Button>
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
                  record => {
                    return (
                      <Button
                        onClick={() => {
                          this.reply(record);
                        }}
                      >
                        回复
                      </Button>
                    );
                  }
                ]}
              />
            </div>
          </TabPane>
          <TabPane tab="已处理" key="treated">
            <div className="reply-complain__treated">
              <TableData
                baseURL={baseURL}
                resid={resid}
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
                actionBarWidth={200}
                cmswhere={`leaderRep = 'Y' and leaderID = '${userInfo.UserCode}'`}
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
                  }
                ]}
              />
            </div>
          </TabPane>
          <TabPane tab="全部" key="all">
            <div className="reply-complain__all">
              <TableData
                baseURL={baseURL}
                resid={resid}
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
                actionBarWidth={200}
                cmswhere={`leaderID = '${userInfo.UserCode}'`}
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
                  }
                ]}
              />
            </div>
          </TabPane>
        </Tabs>
        <Modal
          visible={showRecord}
          width={800}
          style={{ height: 'auto' }}
          title={
            '记录编号:' + (selectRecord.recordID ? selectRecord.recordID : '')
          }
          onCancel={this.cancelModal}
          destroyOnClose={true}
          footer={null}
        >
          <Spin spinning={this.state.loading}>
            <div className="reply-complain-view-modal-content">
              <h3>员工信息</h3>
              <div>
                <Row>
                  <Col span={12}>
                    <div>
                      <label>姓名：</label> {selectRecord.name}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <label>是否实名：</label> {selectRecord.signed}
                    </div>
                  </Col>
                </Row>
                <Row>
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
                </Row>
                <Row>
                  <Col span={12}>
                    <div>
                      <label>投诉类型：</label>
                      {selectRecord.typeComplaint}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <label>投诉对象：</label> {selectRecord.target}-
                      {selectRecord.targetID}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div>
                      <label>发生时间：</label>
                      {selectRecord.time}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div>
                      <label>事件概述：</label>
                      {selectRecord.theme}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div>
                      <label>详细内容：</label>
                      {selectRecord.detail}
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="picProof">
                <h4>图片证据：</h4>
                {imgProofRecord.length ? (
                  imgProofRecord.map(item => {
                    return (
                      <img
                        src={item.fileURL}
                        style={{ width: 200, height: 'auto' }}
                      />
                    );
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
                      <div>
                        <video
                          controls
                          src={item.fileURL}
                          autoPlay={false}
                          style={{ width: '50%' }}
                        />
                      </div>
                    );
                  })
                ) : (
                    <span style={{ textAlign: 'center' }}>暂无视频</span>
                  )}
              </div>
              <hr />
              <h3>负责部门信息</h3>
              <div>
                <Row>
                  <Col span={12}>
                    <div>
                      <label>部门：</label>
                      {depInfoRecord && depInfoRecord.C3_422840508142}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <label>部门英文名：</label>
                      {depInfoRecord && depInfoRecord.C3_422840463535}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <div>
                      <label>部门负责人:</label>
                      {depInfoRecord && depInfoRecord.C3_417993433650}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <label>部门负责人英文名：</label>
                      {depInfoRecord && depInfoRecord.C3_417993433650}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <div>
                      <label>部门负责人工号：</label>
                      {depInfoRecord && depInfoRecord.C3_429966115761}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <label>回复时间：</label>
                      {selectRecord.leaderReplyTime}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <div>
                      <label>回复：</label>
                      {selectRecord.leaderReplyContent}
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="picProof">
                <h4>图片证据：</h4>
                {dImgProofRecord.length ? (
                  dImgProofRecord.map(item => {
                    return (
                      <img
                        src={item.fileURL}
                        style={{ width: 200, height: 'auto' }}
                      />
                    );
                  })
                ) : (
                    <span>暂无图片</span>
                  )}
              </div>

              <div className="videoProof">
                <h4>视频证据：</h4>
                {dVideoProof.length ? (
                  dVideoProof.map((item, index) => {
                    return (
                      <video
                        controls
                        src={item.fileURL}
                        autoPlay={false}
                        style={{ width: '40%', marginRight: 8 }}
                      />
                    );
                  })
                ) : (
                    <span style={{ textAlign: 'center' }}>暂无视频</span>
                  )}
              </div>
              <hr />

              {selectedTab === 'untreated' && (
                <Button
                  onClick={() => {
                    this.setState({
                      replyVisible: true,
                      isBatchReply: false,
                      showRecord: false
                    });
                  }}
                >
                  回复
                </Button>
              )}
            </div>
          </Spin>
        </Modal>
        <Modal
          title="回复投诉"
          visible={replyVisible}
          width={800}
          onCancel={this.handleCloseReply}
          onOk={() => {
            if (isBatchReply) {
              this.handleBatchSubmit();
            } else {
              this.handleSubmit();
            }
          }}
          confirmLoading={submitLoading}
        >
          <Row>
            <h4>回复内容</h4>
            <TextArea
              placeholder="请输入回复内容"
              value={replyData.text}
              onChange={this.handleReplyTextChange}
            />
          </Row>
          <Row>
            <h4>上传照片</h4>
            <Upload
              action={uploadURL}
              listType="picture-card"
              fileList={replyData.pictures}
              onPreview={file => this.handlePreview(file, 'image')}
              onChange={this.handlePictureChange}
              accept="image/*"
              multiple
            >
              选择照片
            </Upload>
          </Row>
          <Row>
            <h4>上传视频</h4>
            <Upload
              action={uploadURL}
              listType="picture"
              fileList={replyData.videos}
              onPreview={file => this.handlePreview(file, 'video')}
              onChange={this.handleVideoChange}
              accept="video/*"
              multiple
            >
              <Button>
                <Icon type="upload" /> Upload
              </Button>
            </Upload>
          </Row>
        </Modal>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          {previewFileType === 'image' && (
            <img alt="照片" style={{ width: '100%' }} src={previewFile} />
          )}
          {previewFileType === 'video' && (
            <video style={{ width: '100%' }} src={previewFile} controls />
          )}
        </Modal>
      </div>
    );
  }
}

export default ReplyComplain;
