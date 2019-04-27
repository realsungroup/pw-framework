import React, { Component } from 'react';
import { Button, Icon, Modal, Input, Popconfirm, message } from 'antd';
import './QueryTable.less';
import ClipboardJS from 'clipboard';
import { Link } from 'react-router-dom';
import SelectPersonnel from 'Common/data/SelectPersonnel';

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
      wid: 450
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
    const { questionnaire, onDelete } = this.props;
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
                      data-clipboard-text={item.query_name}
                    >
                      复制链接
                    </Button>
                  </span>
                </div>
                <div className="queryItem-right">
                  <span>
                    <Icon type="sync" /> {item.query_status}
                  </span>
                  <span className="answercount">答卷:{item.answercount}</span>
                  <span>{item.start_time.substring(0,10)}</span>
                </div>
              </div>
              <div className="queryItem-bottom">
                <div className="queryItem-left">
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
                  {item.query_status == '已发送' ? (
                    <Button className="stepBtn" type="primary">
                      <Icon type="pause" />
                      停止问卷
                    </Button>
                  ) : (
                    <Link
                      to={{
                        pathname: '/fnmodule',
                        search: `?resid=选择人员&recid=608296075283&type=前端功能入口&title=问卷首页`
                      }}
                      target="_self"
                    >
                      <Button className="stepBtn" type="primary">
                        <Icon type="youtube" />
                        发送问卷
                      </Button>
                    </Link>
                  )}

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
                 <Link to={{
                   pathname:'/fnmodule',
                   search:`?resid=统计分析&recid=608296075283&type=前端功能入口&title=问卷首页&id=${
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
                <Link to={{
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
                  </Link> 
                  {item.query_status == '已发送' ? (
                    <Button>
                      <Icon type="eye" />
                      查看人员
                    </Button>
                  ) : (
                    <Button disabled>
                      <Icon type="eye" />
                      查看人员
                    </Button>
                  )}
                 {item.gift=='1'?(<Button>
                    <Icon type="star" style={{ color: '#f00' }} />
                    获奖名单
                  </Button>):(<Button disabled>
                    <Icon type="star" style={{ color: '#f00' }} />
                    获奖名单
                  </Button>)} 
                  <Button>
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
                  <Button>
                    <Icon type="bell" />
                    提醒
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default QueryTable;
