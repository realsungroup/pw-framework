import React from 'react';
import './StaffComplain.less';
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
const residIng = 648669826228; //投诉处理中
const residNo = 648841220130; //投诉未处理
const residEd = 648841245548; //投诉已处理
const residBack = 649441695337; //投诉已处理
const residCancel = 648841262145; //投诉已撤销
const residall = 648841291439; //投诉全部

class StaffComplain extends React.Component {
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
    selectedProofs: [],
    backVisible: false, //退回模态窗是否显示
    backReason: '', //退回理由
    backLoading: '' //
  };

  componentDidMount = () => {
    this.getColumnData();
  };

  getColumnData = async () => {
    let res;
    let type = [];
    try {
      res = await http({ baseURL: this.baseURL }).getTableColumnDefine({
        resid: '648050843809'
      });
      res.data.forEach(col => {
        if (col.ColName == 'typeComplaint') {
          for (let i = 0; i < col.DisplayOptions.length; i++) {
            if (col.DisplayOptions[i]) {
              type.push(col.DisplayOptions[i]);
            }
          }
        }
      });
      this.setState({
        typeComplaint: type
      });
    } catch (error) {
      message.error(error.message);
    }
  };
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
    if (record.status === '未阅读') {
      await this.markRead(record);
    }
    let res;
    let img = [],
      audio = [],
      video = [];
    let imgD = [],
      audioD = [],
      videoD = [];

    //获取子表证据记录
    try {
      res = await http({ baseURL: this.baseURL }).getTable({
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
      resD = await http({ baseURL: this.baseURL }).getTable({
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

  noticeLeader = async () => {
    const { targetInfo, selectRecord } = this.state;
    let leaderNotice;
    let leaderData = {
      leaderId: targetInfo.C3_429966115761,
      leaderName: targetInfo.C3_417993433650,
      isSend: 'Y'
    };
    try {
      this.setState({ noticeLoading: true });
      leaderNotice = await http().addRecords({
        resid: '648849344996',
        data: [leaderData]
      });
      await http({ baseURL: this.baseURL }).modifyRecords({
        resid,
        data: [
          {
            REC_ID: selectRecord.REC_ID,
            mailed: 'Y',
            leaderID: leaderData.leaderId,
            leaderName: leaderData.leaderName
          }
        ]
      });
      message.success('已通知部门负责人');
      this.setState({ showRecord: false });
      this.tableDataRef.handleRefresh();
    } catch (error) {
      console.log(error);
      message.error(error.messsage);
    }
    this.setState({ noticeLoading: false });
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

  reply = selectedRecords => {
    this.setState({
      replyTextModal: true,
      selectedProofs: selectedRecords
    });
  };

  submitReply = async () => {
    const { selectedProofs, isBatchReply, selectedRecords } = this.state;
    const now = new Date().getTime();
    const addData = selectedProofs.map(item => {
      return { ...item, replyID: now };
    });
    try {
      await http({ baseURL: this.baseURL }).addRecords({
        resid: '648756387329',
        data: addData
      });
      const data = isBatchReply
        ? selectedRecords.map(item => ({
            REC_ID: item.recordID,
            replyID: now,
            replication: this.state.replyContent,
            replicationHR: 'Y',
            status: '已处理',
            renew: 'Y'
          }))
        : [
            {
              REC_ID: this.state.selectRecord.recordID,
              replyID: now,
              replication: this.state.replyContent,
              replicationHR: 'Y',
              status: '已处理',
              renew: 'Y'
            }
          ];
      await http({ baseURL: this.baseURL }).modifyRecords({
        resid,
        data
      });
      message.success('回复成功');
      this.setState({
        proofListModal: false,
        replyTextModal: false,
        showRecord: false,
        selectedRecords: [],
        selectedProofs: [],
        isBatchReply: false
      });
      this.tableDataRef.handleRefresh();
    } catch (error) {
      message.error(error.message);
    }
  };

  openProofList = record => {
    this.setState({
      proofListModal: true,
      selectRecord: record,
      isBatchReply: false,
      showRecord: false
    });
  };

  closeProofList = () => {
    this.setState({
      proofListModal: false,
      isBatchReply: false,
      selectedProofs: []
    });
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
  downloadFile = () => {
    const file = this.state.leaderProofRecord;
    var xmlHttp = null;
    if (window.XMLHttpRequest) {
      // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
      xmlHttp = new XMLHttpRequest();
    }
    //2.如果实例化成功，就调用open（）方法：
    if (xmlHttp != null) {
      xmlHttp.open('get', file.fileURL, true);
      xmlHttp.send();
      xmlHttp.onreadystatechange = doResult; //设置回调函数
    }
    function doResult() {
      if (xmlHttp.readyState == 4) {
        //4表示执行完成
        if (xmlHttp.status == 200) {
          //200表示执行成功
          //引用js库：download.js
          download(xmlHttp.responseText, '证据文件', 'text/plain');
        }
      }
    }
  };
  openProof = record => {
    this.setState({
      proofModal: true,
      leaderProofRecord: record
    });
  };
  cancelProof = () => {
    this.setState({
      proofModal: false
    });
  };
  cancelModal = () => {
    this.setState({
      showRecord: false
    });
  };
  leaderChange = value => {
    this.setState({
      replyCondition: value
    });
  };
  typeChange = value => {
    this.setState({
      complainType: value
    });
  };
  isRealChange = value => {
    this.setState({
      isAms: value
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
    //typeComplaint
    let cmsWhere = '';

    if (this.state.replyCondition !== '全部') {
      cmsWhere = `leaderRep = '${this.state.replyCondition}'`;
    }
    if (this.state.complainType !== '全部') {
      cmsWhere += `${cmsWhere ? ' and ' : ''}typeComplaint = '${
        this.state.complainType
      }' `;
    }
    if (this.state.isAms !== '全部') {
      cmsWhere += `${cmsWhere ? ' and ' : ''}signed = '${this.state.isAms}' `;
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
    // cmsWhere = `${this.state.replyCondition?`typeComplaint ='${replyCondition}'`:null} and ${this.state.complainType}`
  };

  noticeLeaders = selectedRecords => async () => {
    if (!selectedRecords.length) {
      return message.info('请选择记录');
    }
    let idArr = selectedRecords.map(item => item.targetID);
    const ids = idArr.join(',');
    try {
      this.setState({ noticeLoading: true });
      const res = await http().getTable({
        resid: '609599795438',
        cmswhere: `C3_227192472953 in (${ids})`
      });
      this.setState({ noticeLoading: true });
      const leaderData = res.data.map(item => ({
        leaderId: item.C3_429966115761,
        leaderName: item.C3_417993433650,
        isSend: 'Y'
      }));
      await http().addRecords({
        resid: '648849344996',
        data: leaderData
      });
      await http({ baseURL: this.baseURL }).modifyRecords({
        resid,
        data: selectedRecords.map(item => ({
          ...item,
          mailed: 'Y'
        }))
      });
      this.tableDataRef.handleRefresh();
      message.success('已通知部门负责人');
    } catch (error) {
      message.error(error.message);
    }
    this.setState({ noticeLoading: false });
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
    const {
      typeComplaint,
      cmswhere,
      markReadLoading,
      noticeLoading,
      selectKey
    } = this.state;
    return (
      <div>
        <div className="staff-contain_menu">
          <div className="staff-contain_menu_headerMenu">
            <span>负责人已回复:</span>
            <Select
              size="small"
              defaultValue="全部"
              style={{ width: 100, height: 24, marginLeft: 3 }}
              onChange={this.leaderChange}
            >
              <Option value="全部">全部</Option>
              <Option value="N">未回复</Option>
              <Option value="Y">已回复</Option>
            </Select>
          </div>
          <div className="staff-contain_menu_headerMenu">
            <span>投诉类型:</span>
            <Select
              defaultValue="全部"
              style={{ width: 200, height: 24, marginLeft: 3 }}
              onChange={this.typeChange}
              size="small"
            >
              <Option value="全部">全部</Option>
              {typeComplaint.length
                ? typeComplaint.map((item, index) => {
                    return <Option value={item}>{item}</Option>;
                  })
                : null}
            </Select>
          </div>
          <div className="staff-contain_menu_headerMenu">
            <span>是否实名:</span>
            <Select
              defaultValue="全部"
              size="small"
              style={{ width: 80, height: 24, marginLeft: 3 }}
              onChange={this.isRealChange}
            >
              <Option value="全部">全部</Option>
              <Option value="Y">是</Option>
              <Option value="N">否</Option>
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
                        title="确认通知负责人吗？"
                        onConfirm={this.noticeLeaders(selectedRecords)}
                      >
                        <Button size="small" loading={noticeLoading}>
                          通知负责人
                        </Button>
                      </Popconfirm>
                      <Popconfirm
                        title="确认标记已阅读吗？"
                        onConfirm={this.markAllRead(selectedRecords)}
                      >
                        <Button size="small" loading={markReadLoading}>
                          标记为已阅读
                        </Button>
                      </Popconfirm>
                    </>
                  )}
                  {(selectKey === '1' || selectKey === '2') && (
                    <Button
                      size="small"
                      onClick={() => {
                        if (!selectedRecords.length) {
                          return message.info('请选择记录');
                        }
                        this.setState({
                          selectedRecords,
                          isBatchReply: true,
                          proofListModal: true
                        });
                      }}
                    >
                      批量回复
                    </Button>
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
                        this.openProofList(record);
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
        return this.renderContentBody(residNo, false);
      case '2':
        return this.renderContentBody(residIng, true);
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
      dImgProofRecord,
      dAudioProof,
      dVideoProof,
      depInfoRecord,
      leaderProofRecord,
      noticeLoading,
      isBatchReply,
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
            // defaultOpenKeys={['sub1']}
            mode={this.state.mode}
            onSelect={this.onSelect}
            // inlineCollapsed={this.state.collapsed}
            // selectedKeys = {selectKeys}
          >
            <Menu.Item key="1">
              <span> 未处理 </span>
            </Menu.Item>
            <Menu.Item key="2">
              <span> 处理中 </span>
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
              <h3>员工信息</h3>
              <Row className="recordInfo">
                <Col span={12}>
                  <div>
                    <label>姓名：</label>
                    {selectRecord.name}
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label>是否实名：</label>
                    {selectRecord.signed}
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
                    <label>投诉类型：</label>
                    {selectRecord.typeComplaint}
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <label>投诉对象：</label>
                    {selectRecord.target}-{selectRecord.targetID}
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
              <hr />
              <h3>负责部门信息</h3>
              <Row className="depInfo">
                <Col span={12}>
                  <span>
                    <label>部门：</label>
                    {depInfoRecord && depInfoRecord.C3_422840508142}
                  </span>
                </Col>
                <Col span={12}>
                  <span>
                    <label>部门英文名：</label>
                    {depInfoRecord && depInfoRecord.C3_422840463535}
                  </span>
                </Col>
                <Col span={12}>
                  <span>
                    <label>部门负责人：</label>
                    {depInfoRecord && depInfoRecord.C3_417993433650}
                  </span>
                </Col>
                <Col span={12}>
                  <span>
                    <label>部门负责人英文名：</label>
                    {depInfoRecord && depInfoRecord.C3_417993433650}
                  </span>
                </Col>
                <Col span={12}>
                  <span>
                    <label>部门负责人工号：</label>
                    {depInfoRecord && depInfoRecord.C3_429966115761}
                  </span>
                </Col>
                <Col span={12}>
                  <span>
                    <label>回复时间：</label>
                    {selectRecord.leaderReplyTime}
                  </span>
                </Col>
                <Col span={24}>
                  <p>
                    <label>回复内容：</label>
                    {selectRecord.leaderReplyContent}
                  </p>
                </Col>
              </Row>
              <div className="picProof">
                <h4>图片证据：</h4>
                {dImgProofRecord.length ? (
                  dImgProofRecord.map(item => {
                    return <img src={item.fileURL} />;
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
                        style={{ width: '50%' }}
                      />
                    );
                  })
                ) : (
                  <span style={{ textAlign: 'center' }}>暂无视频</span>
                )}
              </div>
              <hr />
              {selectKey === '1' && (
                <Popconfirm
                  title="确认通知部门负责人？"
                  onConfirm={this.noticeLeader}
                >
                  <Button
                    type="primary"
                    style={{ marginRight: 8 }}
                    loading={noticeLoading}
                  >
                    通知部门负责人
                  </Button>
                </Popconfirm>
              )}
              {(selectKey === '1' || selectKey === '2') && (
                <Button
                  onClick={() => {
                    this.openProofList(this.state.selectRecord);
                  }}
                  style={{ marginRight: 8 }}
                >
                  回复
                </Button>
              )}
              {(selectKey === '1' || selectKey === '2') && (
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
          visible={this.state.proofListModal}
          title="证据列表"
          width={1000}
          onCancel={this.closeProofList}
          onOk={this.closeProofList}
          destroyOnClose={true}
          footer={null}
        >
          <div style={{ width: '100%', height: 570 }}>
            <TableData
              baseURL={this.baseURL}
              resid="648055005558"
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
              cmswhere={
                isBatchReply
                  ? ''
                  : `recordID = '${this.state.selectRecord.recordID}'`
              }
              customRowBtns={[
                record => {
                  return (
                    <Button
                      onClick={() => {
                        this.openProof(record);
                      }}
                    >
                      证据详情
                    </Button>
                  );
                }
              ]}
              actionBarExtra={({ dataSource, selectedRowKeys }) => {
                const selectedRecords = selectedRowKeys.map(key => {
                  return dataSource.find(item => item.REC_ID === key);
                });
                return (
                  <Button
                    onClick={() => {
                      this.reply(selectedRecords);
                    }}
                  >
                    回复
                  </Button>
                );
              }}
            />
          </div>
        </Modal>
        <Modal
          visible={this.state.proofModal}
          title="证据详情"
          onCancel={this.cancelProof}
          destroyOnClose={true}
          width={600}
          height={500}
          footer={null}
        >
          {leaderProofRecord.mediaType == '图片' && (
            <div className="picProof">
              <p>图片证据：</p>
              <img src={leaderProofRecord.fileURL}></img>
            </div>
          )}
          {leaderProofRecord.mediaType == '音频' && (
            <div className="audioProofs">
              <p>音频证据：</p>
              <div className="audioProof">
                <audio controls autoPlay={false}>
                  <source src={leaderProofRecord.fileURL}></source>
                </audio>
                <img
                  src={downloadImg}
                  onClick={this.downloadFile}
                  alt="点击下载证据文件"
                ></img>
              </div>
            </div>
          )}
          {leaderProofRecord.mediaType == '视频' && (
            <div className="videoProof">
              <p>视频证据：</p>
              <video
                controls
                src={leaderProofRecord.fileURL}
                autoPlay={false}
                style={{ width: '100%' }}
              ></video>
              <img
                src={downloadImg}
                onClick={this.downloadFile}
                alt="点击下载证据文件"
              ></img>
            </div>
          )}
        </Modal>
        <Modal
          title="回复内容"
          visible={this.state.replyTextModal}
          onCancel={this.onCancelText}
          onOk={this.submitReply}
          width={500}
          destroyOnClose={true}
        >
          <TextArea
            value={this.replyText}
            onChange={e => {
              this.replyText(e.target.value);
            }}
          />
        </Modal>
        <Modal
          visible={backVisible}
          title="退回投诉"
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
          />
        </Modal>
      </div>
    );
  }
}

export default StaffComplain;
