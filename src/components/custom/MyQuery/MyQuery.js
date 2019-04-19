import React from 'react';
import { Button, Icon, Input, Select, Tag, Modal, Tabs } from 'antd';
import './MyQuery.less';
import { QueryTable, QueryType, Paging } from '../loadableCustom';
import TableData from '../../common/data/TableData';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import http from '../../../util20/api';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const CheckableTag = Tag.CheckableTag;
class MyQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wid: 1250,
      floders: [],
      typewid: 1200,
      questionnaire: []
    };
  }
  //获取问卷文件夹
  getFloders = () => {
    http()
      .getTable({
        resid: 608822887704
      })
      .then(res => {
        console.log('文件夹', res.data);
        let floders = res.data;
        this.setState({
          floders: floders
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  componentDidMount() {
    this.getData();
  }

  componentWillMount() {
    //组件将要被创建的时候，也即一旦加载该组件的时候。
    this.getFloders();
  }
  componentWillUpdate() {
    //页面将要更新时执行的函数
  }
  componentDidUpdate() {}

  //获取问卷
  getData = async () => {
    http()
      .getTable({
        resid: 608822905547
      })
      .then(res => {
        console.log('问卷', res.data);
        this.setState({
          questionnaire: res.data
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  删除问卷;
  deleQuery = item => {
    console.log('问卷对象', item);
    const recid = item.REC_ID;
    http()
      .removeRecords({
        resid: 608822905547,
        data: [
          {
            REC_ID: recid
          }
        ]
      })
      .then(res => {
        this.getData();
      })
      .catch(err => {
        console.error(err);
      });
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  typeShow = () => {
    this.setState({
      visibleType: true
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
      visibleType: false
    });
  };
  flodersOk = () => {
    this.setState({
      visible: false
    });
    this.getFloders();
  };
  delFloder = () => {
    alert('你确定要删除整个文件夹么');
    //这里弹出的框点击后，标签就会自动消失。到时候只需保证用户再次进来的时候这个文件夹不存在就好了。
  };
  callback = key => {
    console.log(key);
  };
  queryStatusChange = value => {
    console.log('问卷状态', `${value}`);
    const status = `${value}`;
    if (`${value}` == '问卷状态') {
      // console.log(11111);
      this.getData();
    } else {
      http()
        .getTable({
          resid: 608822905547,
          cmswhere: `query_status = '${status}'`
        })
        .then(res => {
          console.log('筛选出来的状态问卷', res.data);
          this.setState({
            questionnaire: res.data
          });
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  //筛选查询渲染
  sortShow = item => {
    //  console.log('筛选',item)
    const floderId = item.floder_id;
    console.log(floderId);
    http()
      .getTable({
        resid: 608822905547,
        cmswhere: 'floder_id =' + floderId
      })
      .then(res => {
        this.setState({ questionnaire: res.data });
      })
      .catch(err => {
        console.error(err);
      });
  };

  //问卷名搜索渲染
  handleSearchChange = value => {
    console.log({ value });
    http()
      .getTable({
        resid: 608822905547,
        cmswhere: `query_name LIKE '%${value}%'`
      })
      .then(res => {
        this.setState({ questionnaire: res.data });
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleSelectFolder = id => {
    console.log({ id });
  };

  render() {
    const { questionnaire } = this.state;
    return (
      // <Router>
      <div className="query">
        <div className="query-top">
          {/* <Link to="/querytype"> */}
          <Button type="primary" onClick={this.typeShow}>
            <Icon type="plus" />
            创建问卷
          </Button>
          {/* </Link> */}
          <Modal
            title="选择问卷类型"
            width={this.state.typewid}
            visible={this.state.visibleType}
            onCancel={this.handleCancel}
          >
            <QueryType />
          </Modal>
          <Input.Search
            style={{ width: 480, padding: 10 }}
            onSearch={this.handleSearchChange}
          />
          <Select
            defaultValue="问卷状态"
            style={{ width: 120 }}
            onChange={this.queryStatusChange}
          >
            <Option value="问卷状态">问卷状态</Option>
            <Option value="已停止">已停止</Option>
            <Option value="已发送">已发送</Option>
            <Option value="草稿">草稿</Option>
          </Select>
          <Button type="danger" style={{ float: 'right' }}>
            <Icon type="delete" />
            回收站
          </Button>
        </div>
        <div className="folder">
          <Button type="primary" icon="plus" onClick={this.showModal}>
            管理文件夹
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.getData}>
            全部
          </Button>
          <Modal
            title="管理文件夹"
            // borderstyle= {color}
            width={this.state.wid}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onOk={this.flodersOk}
          >
            <Tabs defaultActiveKey="1" onChange={this.callback}>
              <TabPane tab="文件夹操作" key="1">
                <TableData
                  resid={608822887704}
                  hasModify={false}
                  hasDelete={false}
                  width={1200}
                  hasAdvSearch={false}
                  height={400}
                  subtractH={190}
                  actionBarFixed={false}
                  hasRowView={false}
                  recordFormName={'前端窗体'}
                />
              </TabPane>
              <TabPane tab="移动问卷" key="2">
                <TableData
                  resid={608822905547}
                  hasModify={false}
                  hasDelete={false}
                  width={1200}
                  height={400}
                  subtractH={190}
                  hasRowView={false}
                  hasAdd={false}
                  actionBarFixed={false}
                  recordFormName={'default1'}
                />
              </TabPane>
            </Tabs>
          </Modal>
          {this.state.floders.map((item, index) => {
            return (
              <Button
                className="personalTags"
                key={index}
                onClick={() => {
                  this.sortShow(item);
                }}
              >
                {item.floder_name}
              </Button>
            );
          })}
        </div>
        <QueryTable questionnaire={questionnaire} onDelete={this.deleQuery} />
        <Paging />
      </div>
    );
  }
}

export default MyQuery;
