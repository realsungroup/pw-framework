import React from 'react';
import './StaffComplain.less';
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
  DatePicker
} from 'antd';
import TableData from '../../../common/data/TableData';
import download from './下载.png';
import http, { makeCancelable } from 'Util20/api';
import { resolveModuleNameFromCache } from 'typescript';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

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
    depInfoRecord: {}
  };

  onSelect = e => {
    this.setState({
      selectKey: e.key
    });
  };

  SearchData = () => {};

  viewRecord = async record => {
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
        cmswhere: `C3_227192472953 = '20465'`
      });
      console.log('userInfo', userInfo);
    } catch (error) {
      message.error(error.message);
    }
    let resD;
    try {
      resD = await http({ baseURL: this.baseURL }).getTable({
        resid: '648055005558',
        cmswhere: `recordID = ${record.recordID}`
      });
      console.log('resD', resD);
      res.data.forEach(item => {
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
      showRecord: true,
      selectRecord: record,
      imgProofRecord: img,
      audioProof: audio,
      videoProof: video,
      dImgProofRecord: imgD,
      dAudioProof: audioD,
      dVideoProof: videoD,
      depInfoRecord: userInfo.data[0]
    });
    console.log('record', record);
  };

  reply = e => {};
  //下载音频
  downloadAudio = e => {};
  cancelModal = () => {
    this.setState({
      showRecord: false
    });
  };
  renderContent = () => {
    const selectKey = this.state.selectKey;
    switch (selectKey) {
      case '1':
        return (
          <div>
            <div className="staff-contain_menu">
              <div className="staff-contain_menu_headerMenu">
                <span>负责人已回复:</span>
                <Select
                  defaultValue="all"
                  style={{ width: 120, height: 24, marginLeft: 5 }}
                >
                  <Option value="all">全部</Option>
                  <Option value="No">未回复</Option>
                  <Option value="Yes">已回复</Option>
                </Select>
              </div>
              <div className="staff-contain_menu_headerMenu">
                <span>投诉类型:</span>
                <Select
                  defaultValue="all"
                  style={{ width: 120, height: 24, marginLeft: 5 }}
                >
                  <Option value="all">全部</Option>
                  <Option value="No">未回复</Option>
                  <Option value="Yes">已回复</Option>
                </Select>
              </div>
              <div className="staff-contain_menu_headerMenu">
                <span>是否实名:</span>
                <Select
                  defaultValue="all"
                  style={{ width: 120, height: 24, marginLeft: 5 }}
                >
                  <Option value="all">全部</Option>
                  <Option value="No">未回复</Option>
                  <Option value="Yes">已回复</Option>
                </Select>
              </div>
              <div className="staff-contain_menu_headerMenu">
                <span>时间起止:</span>
                <RangePicker style={{ marginLeft: 5 }} />
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
            <div style={{ height: 600 }}>
              <TableData
                baseURL={this.baseURL}
                resid="648669826228"
                hasAdd={false}
                hasBeBtns={false}
                hasModify={false}
                hasBackBtn={false}
                hasDelete={false}
                hasRowModify={false}
                hasRowView={false}
                hasRowDelete={false}
                subtractH={200}
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
                          this.viewRecord(record);
                        }}
                      >
                        回复
                      </Button>
                    );
                  }
                ]}
              />
            </div>
          </div>
        );
        break;
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
      depInfoRecord
    } = this.state;
    return (
      <div className="staff-contain" style={{ display: 'flex' }}>
        <div style={{ width: '100px' }}>
          <Menu
            style={{ height: 'calc(100vh - 90px)' }}
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
          title="记录编号：12312313"
          onCancel={this.cancelModal}
        >
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
                      <span>{index}</span>
                      <audio controls autoPlay={false}>
                        <source src={item.fileURL}></source>
                      </audio>
                      <img src={download} onClick={this.downloadAudio}></img>
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
                    <video controls src={item.fileURL} autoPlay={false}></video>
                  );
                })
              ) : (
                <span style={{ textAlign: 'center' }}>暂无视频</span>
              )}
            </div>
            <hr />
            <p>负责部门信息</p>
            <div className="depInfo">
              <span>部门:{depInfoRecord.C3_422840508142}</span>
              <span>部门英文名:{depInfoRecord.C3_422840463535}</span>
              <span>部门负责人:{depInfoRecord.C3_417993433650}</span>
              <span>部门负责人英文名:{depInfoRecord.C3_417993433650}</span>
              <span>部门负责人工号:{depInfoRecord.C3_429966115761}</span>
              <span>回复时间：{selectRecord.leaderReplyTime}</span>
            </div>
            <p>回复：{selectRecord.leaderReplyContent}</p>
            <div className="picProof">
              <p>图片证据：</p>
              {dImgProofRecord.length ? (
                dImgProofRecord.map(item => {
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
                      <span>{index}</span>
                      <audio controls autoPlay={false}>
                        <source src={item.fileURL}></source>
                      </audio>
                      <img src={download} onClick={this.downloadAudio}></img>
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
                    <video controls src={item.fileURL} autoPlay={false}></video>
                  );
                })
              ) : (
                <span style={{ textAlign: 'center' }}>暂无视频</span>
              )}
            </div>
            <hr />
            <Button type="primary" onClick={this.reply}>
              回复
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default StaffComplain;
