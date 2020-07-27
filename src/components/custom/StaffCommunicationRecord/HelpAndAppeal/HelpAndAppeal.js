import React from 'react';
import './HelpAndAppeal.less';
import {
  Modal,
  Button,
  message,
  Tabs,
  Popconfirm,
  Input,
  Menu,
  Icon,
  Select,
  DatePicker,
  Spin
} from 'antd';
import TableData from '../../../common/data/TableData';
import downloadImg from './下载.png';
import http, { makeCancelable } from 'Util20/api';
import download from 'downloadjs';
import moment from 'moment';
import DateTimePicker from '../../../../pages/components/DateTimePicker';


const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const TextArea = Input.TextArea;

const resid = 648050843809;
const residIng = 648669826228; //投诉处理中
const residNo = 648841220130; //投诉未处理
const residEd = 648841245548; //投诉已处理
const residCancel = 648841262145; //投诉已撤销
const residall = 648841291439; //投诉全部

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
    typeComplaint:[],
    replyCondition:'全部',//负责人回复情况
    complainType:'全部',//投诉类型
    isAms:'全部',//是否实名
    beginTime:'',//开始时间
    endTime:'',//结束时间
    cmswhere:''
  };

  componentDidMount = () =>{
    this.getColumnData()
  }

  getColumnData = async() =>{
    let res;
    let type = [];
    try{
      res = await http({baseURL:this.baseURL}).getTableColumnDefine({
        resid:'648050843809'
      })
          res.data.forEach(col =>{
           if(col.ColName == "typeComplaint"){
             for(let i = 0;i < col.DisplayOptions.length;i++){
              if(col.DisplayOptions[i]){
                type.push(col.DisplayOptions[i])
               }
             }
           }
          })
      this.setState({
        typeComplaint:type
      })
    }catch(error){
      message.error(error.message)
    }
  }
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
     if(userInfo.data[0]){
      user1Info:{}
     }
      
    } catch (error) {
      message.error(error.message);
    }
    
    let leaderNotice;
    let leaderData = {
      leaderId:userInfo.C3_429966115761,
      leaderName:userInfo.C3_417993433650,
      isSend:"Y"
    }
    try{
      leaderNotice = await http().addRecords({
          resid:'648849344996',
          data:leaderData
      })
    }catch(error){
      console.log(error.message)
    }
    //获取主管证据表的的记录
    let resD;
    try {
      resD = await http({ baseURL: this.baseURL }).getTable({
        resid: '648055005558',
        cmswhere: `recordID = ${record.recordID}`
      });
      console.log('resD', resD);
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

    console.log('depInfoRecord', this.state.depInfoRecord);
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
  // replyTextModal = (e) =>{
  //   console.log("e",e)
  //   // this.setState({
  //   //    replyContent:e.
  //   // })
  // }
  //648756387329

  reply = (dataSource, selectedRowKeys) => {
    this.setState({
      replyTextModal: true,
      dataSource: dataSource,
      selectedRowKeys: selectedRowKeys
    });
  };

  submitReply = async () => {
    console.log(this.state.selectRecord);
    const { dataSource, selectedRowKeys } = this.state;
    let now;
    let addData = [];
    now = new Date().getTime();
    dataSource.map(item => {
      if (selectedRowKeys.includes(item.REC_ID)) {
        addData.push({ ...item, replyID: now });
      }
    });
    let res;
    try {
      res = await http({ baseURL: this.baseURL }).addRecords({
        resid: '648756387329',
        data: addData
      });
      try {
        res = await http({ baseURL: this.baseURL }).modifyRecords({
          resid,
          data: [
            {
              REC_ID: this.state.selectRecord.recordID,
              replyID: now,
              replication: this.state.replyContent
            }
          ]
        });
        message.success('回复成功');
        this.setState({
          proofListModal: false,
          replyTextModal: false
        });
      } catch (error) {
        message.error(error.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  openProofList = record => {
    console.log(record);
    this.setState({
      proofListModal: true,
      selectRecord: record
    });
  };
  closeProofList = () => {
    this.setState({
      proofListModal: false
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
      leaderProofRecord:record
    });
  };
  cancelProof = () => {
    this.setState({
      proofModal: false,
    });
  };
  cancelModal = () => {
    this.setState({
      showRecord: false
    });
  };
  leaderChange = (value)=>{
      this.setState({
        replyCondition:value
      })
  }
  typeChange = (value) =>{
    this.setState({
      complainType:value
    })
  }
  isRealChange =(value) =>{
    this.setState({
      isAms:value
    })

  }
  timeChange = (value) =>{
    console.log(value)
    if(value.length){
      this.setState({
        beginTime:value[0].format("YYYY-MM-DD HH:mm:ss"),
        endTime:value[1].format("YYYY-MM-DD HH:mm:ss")
      })
    }else{
      this.setState({
        beginTime:'',
        endTime:''
      })
    }
  }

  SearchData = () => {
    //typeComplaint 
    let cmsWhere = '';
    
    if(this.state.replyCondition !== '全部'){
      cmsWhere = `leaderRep = '${this.state.replyCondition}'`
    }
    if(this.state.complainType !== '全部'){
      cmsWhere += `${cmsWhere ?' and ':''}typeComplaint = '${this.state.complainType}' `
    }
    if(this.state.isAms !== '全部'){
      cmsWhere += `${cmsWhere?' and ':''}signed = '${this.state.isAms}' `
    }
    if(this.state.beginTime !== ''){
      cmsWhere += `${cmsWhere?' and ':''}REC_CRTTIME > '${this.state.beginTime}' and REC_CRTTIME < '${this.state.endTime}'`
    }
    console.log("cmsWhere",cmsWhere)
    this.setState({
      cmswhere:cmsWhere
    })
    // cmsWhere = `${this.state.replyCondition?`typeComplaint ='${replyCondition}'`:null} and ${this.state.complainType}`
  };

  renderContentBody =(resid,hasButton) =>{
    const {selectKey,typeComplaint ,cmswhere} = this.state;
    return(
      <div>
      <div className="staff-contain_menu">
        <div className="staff-contain_menu_headerMenu">
          <span>负责人已回复:</span>
          <Select
            defaultValue="全部"
            style={{ width: 100, height: 24, marginLeft: 3 }}
            onChange = {this.leaderChange}
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
            onChange = {this.typeChange}
          >
            <Option value="全部">全部</Option>
            {typeComplaint.length?typeComplaint.map((item,index)=>{
             return(<Option value = {item}>{item}</Option>) 
            }):null}
          </Select>
        </div>
        <div className="staff-contain_menu_headerMenu">
          <span>是否实名:</span>
          <Select
            defaultValue="全部"
            style={{ width: 80, height: 24, marginLeft: 3 }}
            onChange = {this.isRealChange}
          >
            <Option value="全部">全部</Option>
            <Option value="Y">是</Option>
            <Option value="N">否</Option>
          </Select>
        </div>
        <div className="staff-contain_menu_headerMenu">
          <span>时间起止:</span>
          <RangePicker 
          style={{ marginLeft: 5 }} 
          onChange = {this.timeChange}
          showTime={{ format: 'HH:mm:ss' }}
          format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        <Button
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
            hasButton&&(record => {
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
    )
  }
  renderContent = () => {
    const {selectKey,typeComplaint ,cmswhere} = this.state;
    switch (selectKey) {
      case '1':
        return this.renderContentBody(residNo,false);
        break;
        case '2':
        return this.renderContentBody(residIng,true);
        break;
        case '3':
          return this.renderContentBody(residEd,false);
        case '4':
          return this.renderContentBody(residCancel,false);
        case '5':
          return this.renderContentBody(residall,false);

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
      leaderProofRecord
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
          title={'记录编号'+ selectRecord.recordID}
          onCancel={this.cancelModal}
          destroyOnClose={true}
        >
          <Spin spinning={this.state.loading}>
            <div className="modalContainer">
              <span>员工信息</span>
              <div className="recordInfo">
                <div>姓名：{selectRecord.name}</div>
                <div>是否实名：{selectRecord.signed}</div>
                <div>工号：{selectRecord.id}</div>
                <div>联系方式：{selectRecord.phone}</div>
                <div>投诉类型：{selectRecord.typeComplaint}</div>
                <div>
                  投诉对象：{selectRecord.target}-{selectRecord.targetID}
                </div>
                <div>发生时间：{selectRecord.time}</div>
              </div>
              <p>事件概述：{selectRecord.theme}</p>
              <p>事件概述：{selectRecord.detail}</p>
              <div className="picProof">
                <p>图片证据：</p>
                {imgProofRecord.length ? (
                  imgProofRecord.map(item => {
                    return <img src={item.fileURL}></img>;
                  })
                ) : (
                  <span>暂无图片</span>
                )}
              </div>
              <p>音频证据：</p>
              <div className="audioProofs">
                {audioProof.length ? (
                  audioProof.map((item, index) => {
                    return (
                      <div className="audioProof">
                        {' '}
                        <span>{index + 1}.</span>
                        <audio controls autoPlay={false}>
                          <source src={item.fileURL}></source>
                        </audio>
                        <img
                          src={downloadImg}
                          onClick={() => {
                            this.downloadAudio(index);
                          }}
                        ></img>
                      </div>
                    );
                  })
                ) : (
                  <span>暂无音频</span>
                )}
              </div>
              <div className="videoProof">
                <p>视频证据：</p>
                {videoProof.length ? (
                  videoProof.map((item, index) => {
                    return (
                      <>
                        <video
                          controls
                          src={item.fileURL}
                          autoPlay={false}
                          style = {{width:'25%'}}
                        ></video>
                        <img
                          src={downloadImg}
                          onClick={() => {
                            this.downloadVideo(index);
                          }}
                        />
                      </>
                    );
                  })
                ) : (
                  <span style={{ textAlign: 'center' }}>暂无视频</span>
                )}
              </div>
              <hr />
              <p>负责部门信息</p>
              <div className="depInfo">
                <span>部门:{depInfoRecord.C3_422840508142?depInfoRecord.C3_422840508142:''}</span>
                <span>部门英文名:{depInfoRecord.C3_422840463535?depInfoRecord.C3_422840463535:''}</span>
                <span>部门负责人:{depInfoRecord.C3_417993433650?depInfoRecord.C3_417993433650:''}</span>
                <span>部门负责人英文名:{depInfoRecord.C3_417993433650?depInfoRecord.C3_417993433650:''}</span>
                <span>部门负责人工号:{depInfoRecord.C3_429966115761?depInfoRecord.C3_429966115761:''}</span>
                <span>回复时间：{selectRecord.leaderReplyTime}</span>
              </div>
              <p>回复：{selectRecord.leaderReplyContent}</p>
              <div className="picProof">
                <p>图片证据：</p>
                {dImgProofRecord.length ? (
                  dImgProofRecord.map(item => {
                    console.log('img', item);
                    return <img src={item.fileURL}></img>;
                  })
                ) : (
                  <span>暂无图片</span>
                )}
              </div>
              <p>音频证据：</p>
              <div className="audioProofs">
                {dAudioProof.length ? (
                  dAudioProof.map((item, index) => {
                    return (
                      <div className="audioProof">
                        {' '}
                        <span>{index + 1}</span>
                        <audio controls autoPlay={false}>
                          <source src={item.fileURL}></source>
                        </audio>
                        <img
                          src={downloadImg}
                          onClick={this.downloadAudio}
                        ></img>
                      </div>
                    );
                  })
                ) : (
                  <span>暂无音频</span>
                )}
              </div>
              <div className="videoProof">
                <p>视频证据：</p>
                {dVideoProof.length ? (
                  dVideoProof.map((item, index) => {
                    return (
                      <video
                        controls
                        src={item.fileURL}
                        autoPlay={false}
                      ></video>
                    );
                  })
                ) : (
                  <span style={{ textAlign: 'center' }}>暂无视频</span>
                )}
              </div>
              <hr />
              <Button
                type="primary"
                onClick={() => {
                  this.openProofList();
                }}
              >
                回复
              </Button>
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
              cmswhere={`recordID = '${this.state.selectRecord.recordID}'`}
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
                return (
                  <Button
                    onClick={() => {
                      this.reply(dataSource, selectedRowKeys);
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
          onCancel= {this.cancelProof}
          destroyOnClose={true}
          width={600}
          height={500}
        >
          <p>已选人员</p>
          <span>
            {selectRecord.name}-{selectRecord.id}
          </span>
          {leaderProofRecord.mediaType == '图片' ? (
            <div className="picProof">
              <p>图片证据：</p>
              <img src={leaderProofRecord.fileURL}></img>
            </div>
          ) : null}
          {leaderProofRecord.mediaType == '音频' ? (
            <div className="audioProofs">
              <p>音频证据：</p>
              <div className="audioProof">
                <audio controls autoPlay={false}>
                  <source src={leaderProofRecord.fileURL}></source>
                </audio>
                <img
                    src={downloadImg}
                    onClick={this.downloadFile}
                    alt = '点击下载证据文件'
                    ></img>
              </div>
            </div>
          ) : null}
          {leaderProofRecord.mediaType == '视频' ? (
            <div className="videoProof">
              <p>视频证据：</p>
              <video controls src={leaderProofRecord.fileURL} autoPlay={false} style = {{width:'50%'}}></video>
              <img
                    src={downloadImg}
                    onClick={this.downloadFile}
                    alt = '点击下载证据文件'
                    ></img>
            </div>
          ) : null}
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
            onChange={e => {
              this.replyText(e.target.value);
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default HelpAndAppeal;
