import React, { Component } from 'react';
import { Button, Icon, Modal, Popconfirm, message, Tabs } from 'antd';
import './QueryTable.less';
import ClipboardJS from 'clipboard';
import { Link } from 'react-router-dom';
import TableData from '../../common/data/TableData';
import http from '../../../util20/api';
const TabPane = Tabs.TabPane;
/**
 * props:
 * 1. questionnaire：数组，表示所有问卷
 *
 */
class QueryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wid: 450,
      giftVisible: false,
      giftwid: '100%',
      modalGiftId: '',
      sendVisible: false,
      sendListId: '',
      sendwid: '100%',
      loading: false
    };
  }
  sendModal = () => {
    this.setState({
      visible: true
    });
  };
  // 显示中奖人员名单
  showHasgiftList = queryId => {
    this.setState({
      modalGiftId: queryId,
      giftVisible: true
    });
  };
  // 确定关闭中奖人员模态框
  handlegiftOk = () => {
    this.setState({
      giftVisible: false
    });
  };
  // 关闭中奖人员模态框
  handlegiftCancel = () => {
    this.setState({
      giftVisible: false
    });
  };
  // 显示已发送人员名单
  showSendModalList = queryId => {
    this.setState({
      sendListId: queryId,
      sendVisible: true
    });
  };
  // 确定关闭发送人员名单
  handsendListOk = () => {
    this.setState({
      sendVisible: false
    });
  };
  // 关闭发送人员名单
  handlesendListCancel = () => {
    this.setState({
      sendVisible: false
    });
  };
  //
  handleSecondEmail = async personList => {
    console.log(personList);
    const newPersonList = [...personList];
    if (newPersonList) {
      newPersonList.map(person => {
        person.C3_610663309139 = '';
      });
    }
    console.log('新的personList', newPersonList);
    let data = [];
    newPersonList.forEach(person => {
      //  return  {recID:person.REC_ID,sendMail:''}
      const obj = {
        REC_ID: person.REC_ID,
        C3_610663309139: ''
      };
      data.push(obj);
      return data;
    });
    console.log('返回的数组', data);
    let res;
    res = await http()
      .modifyRecords({
        resid: 611867230563,
        data: data
      })
      .then(res => {
        message.success('提醒邮件发送成功');
        console.log('修改返回结果', res);
      })
      .catch(err => {
        message.error(err.message);
        console.error(err.message);
      });
  };
  // 根据问卷的三种状态来渲染不同的界面
  renderButton = item => {
    const { onStopQuery } = this.props;
    switch (item.query_status) {
      case '草稿': {
        return (
          <Link
            to={{
              pathname: '/fnmodule',
              search: `?resid=选择人员&recid=608296075283&type=前端功能入口&title=问卷首页&id=${item.query_id}`
            }}
            target="_self"
          >
            <Button className="stepBtn" type="primary">
              <Icon type="youtube" />
              发送问卷
            </Button>
          </Link>
        );
      }
      case '已发送': {
        return (
          <Popconfirm
            title="请小心停止，停止用户将不能再填写"
            onConfirm={() => {
              onStopQuery(item);
            }}
          >
            <Button className="stepBtn" type="primary">
              <Icon type="pause" />
              停止问卷
            </Button>
          </Popconfirm>
        );
      }
      case '已停止': {
        return (
          <Button disabled className="stepBtn">
            <Icon type="stop" />
            发送问卷
          </Button>
        );
      }
    }
  };
  componentDidMount() {
    const clipboard = new ClipboardJS('.copy');
    clipboard.on('success', function (e) {
      message.success('复制成功,可以到任意地方粘贴去啦~~~');
    });

    clipboard.on('error', function (e) {
      message.error('复制失败');
    });
  }
  render() {
    const { questionnaire, onDelete, onCopyQuery } = this.props;
    return (
      <div className="queryTable">
        {questionnaire.map((item, key) => {
          return (
            <div className="queryItem" key={item.query_id}>
              <div className="queryItem-top">
                <div className="queryItem-left">
                  <span>{item.query_name}</span>
                  <span>ID:{item.query_id}</span>
                  <span>
                    <Button
                      size="small"
                      icon="copy"
                      className="copy"
                      data-clipboard-text={item.query_address}
                    >
                      生成问卷链接
                    </Button>
                  </span>
                </div>
                <div className="queryItem-right">
                  <span>
                    <Icon type="sync" /> {item.query_status}
                  </span>
                  <span>{item.REC_EDTTIME.substring(11, 16)}</span>
                </div>
              </div>
              <div className="queryItem-bottom">
                <div className="queryItem-left">
                  {item.query_status === '已发送' ? (
                    <Button className="stepBtn" type="primary" disabled>
                      <Icon type="setting" />
                      设计问卷
                    </Button>
                  ) : (
                      <Link
                        to={{
                          pathname: '/fnmodule',
                          search: `?resid=问卷设置&recid=608296075283&type=前端功能入口&title=问卷首页&id=${item.query_id}`
                        }}
                        target="_self"
                      >
                        <Button className="stepBtn" type="primary">
                          <Icon type="setting" />
                        设计问卷
                      </Button>
                      </Link>
                    )}
                  {this.renderButton(item)}

                  <Link
                    to={{
                      pathname: '/fnmodule',
                      search: `?resid=问卷统计分析&recid=610653889243&type=问卷系统&title=问卷统计分析&questionnaireRecid=${item.REC_ID}`
                    }}
                    target="_blank"
                  >
                    <Button
                      className="stepBtn"
                      type="primary"
                    // disabled={item.query_status === '草稿' }
                    >
                      <Icon type="download" />
                      分析&下载
                    </Button>
                  </Link>
                </div>
                <div className="queryItem-right">
                  {item.query_status == '草稿' ? (
                    <Button disabled>
                      <Icon type="eye" />
                      查看人员
                    </Button>
                  ) : (
                      <Button
                        onClick={() => {
                          this.showSendModalList(item.query_id);
                        }}
                      >
                        <Icon type="eye" />
                      查看人员
                      </Button>
                    )}
                  {item.gift == '1' ? (
                    <Button
                      onClick={() => {
                        this.showHasgiftList(item.query_id);
                      }}
                    >
                      <Icon type="star" style={{ color: '#f00' }} />
                      获奖名单
                    </Button>
                  ) : (
                      <Button disabled>
                        <Icon type="star" style={{ color: '#f00' }} />
                      获奖名单
                      </Button>
                    )}
                  <Button
                    onClick={() => {
                      onCopyQuery(item);
                    }}
                  >
                    <Icon type="copy" />
                    复制
                  </Button>
                  <Popconfirm
                    title="确认删除此问卷吗"
                    okText="确认"
                    cancelText="取消"
                    onConfirm={() => {
                      onDelete(item);
                    }}
                  >
                    <Button>
                      <Icon type="delete" />
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          );
        })}
        <Modal
          title="获奖名单"
          visible={this.state.giftVisible}
          onOk={this.handlegiftOk}
          onCancel={this.handlegiftCancel}
          width={this.state.giftwid}
          height={500}
          destroyOnClose
        >
          <TableData
            resid={609864608177}
            hasAdd={false}
            hasModify={false}
            hasDelete={false}
            actionBarFixed={true}
            hasRowView={false}
            hasRowDelete={false}
            subtractH={230}
            width={'98%'}
            cmswhere={`query_id='${this.state.modalGiftId}'`}
          />
        </Modal>
        {/* 已发送人员列表 */}
        <Modal
          title="查看人员"
          visible={this.state.sendVisible}
          onOk={this.handsendListOk}
          onCancel={this.handlesendListCancel}
          width={this.state.sendwid}
          destroyOnClose
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="已发送人员列表" key="1">
              <TableData
                resid={609613163948}
                hasAdd={false}
                hasModify={false}
                hasDelete={false}
                actionBarFixed={false}
                hasRowView={false}
                hasRowDelete={false}
                hasRowModify={false}
                width={'98%'}
                height={400}
                subtractH={190}
                cmswhere={`query_id='${this.state.sendListId}'`}
              />
            </TabPane>
            <TabPane tab="未填写人员表" key="2">
              <TableData
                resid={611867230563}
                hasAdd={false}
                hasModify={false}
                hasDelete={false}
                actionBarFixed={false}
                hasRowView={false}
                hasRowDelete={false}
                hasRowModify={false}
                width={'98%'}
                height={400}
                subtractH={190}
                cmswhere={`query_id='${this.state.sendListId}'`}
                actionBarExtra={({ dataSource: dataSource }) => {
                  return (
                    <Popconfirm
                      title="确认发送邮件提醒填写？"
                      onConfirm={() => {
                        this.handleSecondEmail(dataSource);
                      }}
                    >
                      <Button>提醒填写</Button>
                    </Popconfirm>
                  );
                }}
              />
            </TabPane>
            <TabPane tab="问卷试题详细" key="3">
              <TableData
                resid={608838682402}
                hasAdd={false}
                hasModify={false}
                hasDelete={false}
                actionBarFixed={false}
                hasRowView={false}
                hasRowDelete={false}
                hasRowModify={false}
                width={'98%'}
                height={400}
                subtractH={190}
                cmswhere={`query_id='${this.state.sendListId}'`}
              />
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
}

export default QueryTable;
