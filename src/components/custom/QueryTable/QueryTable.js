import React, { Component } from 'react';
import { Button, Icon, Modal, Input, Popconfirm, message, Spin } from 'antd';
import './QueryTable.less';
import ClipboardJS from 'clipboard';
import { Link } from 'react-router-dom';
import TableData from '../../common/data/TableData';

/**
 * props:
 * 1. questionnaire：数组，表示所有问卷
 *
 */
class QueryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // questionnaire: [],
      wid: 450,
      giftVisible: false,
      giftwid: 850,
      modalGiftId: '',
      sendVisible: false,
      sendListId: '',
      sendwid: 1000,
      loading: false
    };
  }
  sendModal = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = () => {
    this.setState({
      visible: false
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
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
  // 根据问卷的三种状态来渲染不同的界面
  renderButton = item => {
    const { onStopQuery } = this.props;
    switch (item.query_status) {
      case '草稿': {
        return (
          <Link
            to={{
              pathname: '/fnmodule',
              search: `?resid=选择人员&recid=608296075283&type=前端功能入口&title=问卷首页&id=${
                item.query_id
              }`
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
            title="请小心停止，停止后此问卷将作废"
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
    clipboard.on('success', function(e) {
      message.success('复制成功,可以到任意地方粘贴去啦~~~');
    });

    clipboard.on('error', function(e) {
      message.error('复制失败');
    });
  }
  render() {
    const { questionnaire, onDelete, loading } = this.props;
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
                  {/* <span className="answercount">答卷:{item.answercount}</span> */}
                  <span>{item.start_time.substring(0, 10)}</span>
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
                        search: `?resid=问卷设置&recid=608296075283&type=前端功能入口&title=问卷首页&id=${
                          item.query_id
                        }`
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
                  <Modal
                    title="提交问卷"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={this.state.wid}
                  >
                    {/* <Button style={{marginTop:10}} type="primary">复制链接</Button> */}
                    <p style={{ marginTop: 10, color: '#f00' }}>
                      恭喜您获得礼品一份，请输入手机号领取并到人力资源部去领取
                    </p>
                    <Input
                      style={{ marginTop: 10 }}
                      placeholder="请输入您的手机号码"
                    />
                    {/* <Button style={{marginTop:10}} type="primary">
                    <Icon type="plus" />
                    选择人员
                  </Button> */}
                  </Modal>
                  <Link
                    to={{
                      pathname: '/fnmodule',
                      search: `?resid=统计分析&recid=608296075283&type=前端功能入口&title=问卷首页&id=${
                        item.query_id
                      }`
                    }}
                    target="_self"
                  >
                    <Button className="stepBtn" type="primary">
                      <Icon type="download" />
                      分析&下载
                    </Button>
                  </Link>
                </div>
                <div className="queryItem-right">
                  {/* <Link to={{
                   pathname:'/fnmodule',
                   search:`?resid=发送问卷&recid=608296075283&type=前端功能入口&title=问卷首页&id=${
                    item.query_id
                  }`
                 }}
                 target="_self"
                 >
                 <Button className="stepBtn" type="primary">
                    <Icon type="plus" />
                    选择人员
                  </Button>
                  </Link>  */}
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
                  {/* <Button>
                    <Icon type="copy" />
                    复制
                  </Button> */}
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
                  {/* <Button>
                    <Icon type="bell" />
                    提醒
                  </Button> */}
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
          destroyOnClose
        >
          <TableData
            resid={609864608177}
            hasAdd={false}
            hasModify={false}
            hasDelete={false}
            actionBarFixed={false}
            hasRowView={false}
            hasRowDelete={false}
            width={800}
            cmswhere={`query_id='${this.state.modalGiftId}'`}
          />
        </Modal>
        {/* 已发送人员列表 */}
        <Modal
          title="已发送人员名单"
          visible={this.state.sendVisible}
          onOk={this.handsendListOk}
          onCancel={this.handlesendListCancel}
          width={this.state.sendwid}
          destroyOnClose
        >
          <TableData
            resid={609613163948}
            hasAdd={false}
            hasModify={false}
            hasDelete={false}
            actionBarFixed={false}
            hasRowView={false}
            hasRowDelete={false}
            hasRowModify={false}
            width={950}
            height={400}
            subtractH={190}
            cmswhere={`query_id='${this.state.sendListId}'`}
          />
        </Modal>
      </div>
    );
  }
}

export default QueryTable;
