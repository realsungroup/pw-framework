import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import './QueryTable.less';
class QueryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionnaire: [
        {
          name: '2019年餐厅满意度调查',
          id: '11111',
          status: '已暂停',
          answercount: '9',
          sendtime: '2019年03月29日'
        },
        {
          name: '2019员工满意调查',
          id: '11111',
          status: '运行中',
          answercount: '10',
          sendtime: '2019年03月29日'
        },
        {
          name: '2019年考试满意调查',
          id: '11111',
          status: '草稿',
          answercount: '8',
          sendtime: '2019年03月29日'
        },
        {
          name: '2015年升值调查',
          id: '11111',
          status: '草稿',
          answercount: '8',
          sendtime: '2019年03月29日'
        },
        {
          name: '随便调查',
          id: '11111',
          status: '运行中',
          answercount: '15',
          sendtime: '2019年03月27日'
        }
      ]
    };
  }
  render() {
    return (
      <div className="queryTable">
        {this.state.questionnaire.map((item, index) => {
          return (
            <div className="queryItem">
              <div className="queryItem-top">
                <div className="queryItem-left">
                  <span>{item.name}</span>
                  <span>ID:{item.id}</span>
                </div>
                <div className="queryItem-right">
                  <span>
                    <Icon type="sync" /> {item.status}
                  </span>
                  <span>答卷：{item.answercount}</span>
                  <span>{item.sendtime}</span>
                </div>
              </div>
              <div className="queryItem-bottom">
                <div className="queryItem-left">
                  <Button type="primary">
                    <Icon type="setting" />
                    设计问卷
                  </Button>
                  <Button type="primary">
                    <Icon type="file-done" />
                    发送问卷
                  </Button>
                  <Button type="primary">
                    <Icon type="download" />
                    分析&下载
                  </Button>
                </div>
                <div className="queryItem-right">
                  <Button>
                    <Icon type="pause" />
                    停止
                  </Button>
                  <Button>
                    <Icon type="copy" />
                    复制
                  </Button>
                  <Button>
                    <Icon type="delete" />
                    删除
                  </Button>
                  <Button>
                    <Icon type="folder" />
                    文件夹
                  </Button>
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
