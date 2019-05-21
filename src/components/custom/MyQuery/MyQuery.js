import React from 'react';
import {
  Button,
  Icon,
  Input,
  Select,
  Modal,
  Tabs,
  Spin,
  message,
  Pagination
} from 'antd';
import './MyQuery.less';
import { QueryTable } from '../loadableCustom';
import TableData from '../../common/data/TableData';
import { Link } from 'react-router-dom';
import http from '../../../util20/api';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
class MyQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wid: 1250,
      floders: [],
      typewid: 1200,
      questionnaire: [],
      loading: false,
      foloderbuttonChecked: '全部',
      current: 1,
      pageSize: 5,
      total: 0,
    };
  }
  //获取问卷文件夹
  getFloders = () => {
    http()
      .getTable({
        resid: 608822887704
      })
      .then(res => {
        // console.log('文件夹', res.data);
        let floders = res.data;
        this.setState({
          floders: floders,
          loading: false
        });
      })
      .catch(err => {
        console.error(err);
        message.error('MyQuery获取文件夹失败', err.message);
      });
  };
  // 复制问卷开始
  copyQuery = async item => {
    console.log('复制', item);
    const newItem = [
      {
        query_name: item.query_name,
        query_description: item.query_description
      }
    ];
    this.setState({ loading: true });

    // 1
    let res;
    try {
      res = await http().addRecords({
        resid: 608822905547,
        data: newItem
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    message.success('复制成功');
    // console.log(res.data[0].query_id);
    this.setState({ loading: false,  });
    this.getData(this.state.current, this.state.pageSize);
    // 2
    let res2;
    try {
      res2 = await http().getTable({
        resid: 608828418560,
        subresid: 608828722533,
        cmswhere: 'query_id =' + item.query_id
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
     let  AllQuestionsArrdata=[];
    res2.data.map((question, index) => {
      const obj = {
        query_id: res.data[0].query_id,
        question_topic: question.question_topic,
        question_must: question.question_must,
        question_type: question.question_type,
        subdata: []
      };

      obj.subdata = question.subdata.map(subdataItem => {
        return {
          option_content: subdataItem.option_content,
          option_write: subdataItem.option_write
        };
      });
      res.data[index] = obj;
      console.log('复制的试题', res.data[index]);
      AllQuestionsArrdata.push(obj);
    });
   
    console.log('所有的试题和试题选项',AllQuestionsArrdata);
    
    /**
     * 对所有的试题和试题选项改成后端要的数据。
     */
    let AllQuestionDataBack=[];
    AllQuestionsArrdata.map((questionB,index)=>{
      const objB={
        resid:608828418560,
        maindata:{
          query_id:questionB.query_id,
          question_topic:questionB.question_topic,
          question_must:questionB.question_must,
          question_type:questionB.question_type,
          subdata: questionB.subdata,
          _state:'added',
          _id:index+1,
        }
      };
      objB.subdata=questionB.subdata.map((subdataBckItem,index)=>{
        return {
          resid:608828722533,
          maindata:{
            option_content:subdataBckItem.option_content,
            option_write:subdataBckItem.option_write,
            _state:'added',
            _id:index+1,
          }
        }
      });
      AllQuestionDataBack.push(objB);
    })
    console.log('后端要的数据',AllQuestionDataBack);

    //利用saveRecords向后端发送数据,向试题表和试题选项表中加数据
    http()
    .saveRecordAndSubTables({
      data:AllQuestionDataBack,
    })
    .then(copyres => {
      console.log(copyres);
    })
    .catch(err => {
      console.error('添加错误原因', err);
      message.error('复制问卷试题和试题选项', err.message);
    });
  };
  // 复制问卷结束
  componentDidMount() {
    this.getData(this.state.current, this.state.pageSize);
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
  getData = async (current, pageSize) => {
    this.setState({ loading: true, foloderbuttonChecked: '全部' });
    http()
      .getTable({
        resid: 608822905547,
        pageindex: current - 1,
        pagesize: pageSize
      })
      .then(res => {
        console.log('问卷', res.data);
        this.setState({
          questionnaire: res.data,
          loading: false,
          total: res.total
        });
      })
      .catch(err => {
        this.setState({ loading: false });
        console.error(err);
        message.error('MyQuery获取问卷失败', err.message);
      });
  };
  // 判断选中按钮的类型
  getType = flodername => {
    const { foloderbuttonChecked } = this.state;
    if (foloderbuttonChecked == flodername) {
      return 'primary';
    }
  };
  // 删除问卷;
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
        this.setState({ loading: false });
        message.error('MyQuery删除问卷失败', err.message);
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
    this.setState({ loading: true });
    console.log('问卷状态', `${value}`);
    const status = `${value}`;
    if (`${value}` == '问卷状态') {
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
            questionnaire: res.data,
            loading: false
          });
        })
        .catch(err => {
          console.error(err);
          message.error('MyQuery筛选失败', err.message);
          this.setState({ loading: false });
        });
    }
  };

  //停止问卷
  stopQuery = item => {
    const queryID = item.query_id;
    this.setState({ loading: true });

    http()
      .modifyRecords({
        resid: 608822905547,
        data: [
          {
            REC_ID: queryID,
            query_status: '已停止'
          }
        ]
      })
      .then(res => {
        // console.log('问卷停止');
        this.getData();
      })
      .catch(err => {
        console.error('修改失败原因', err);
        message.error('MyQuery停止问卷失败', err.message);
        this.setState({ loading: false });
      });
  };
  //筛选查询渲染
  sortShow = item => {
    //  console.log('筛选',item)
    const floderId = item.floder_id;
    console.log(floderId);
    this.setState({ loading: true, foloderbuttonChecked: item.floder_name });

    http()
      .getTable({
        resid: 608822905547,
        cmswhere: 'floder_id =' + floderId
      })
      .then(res => {
        this.setState({ questionnaire: res.data, loading: false });
      })
      .catch(err => {
        console.error(err);
        message.error('MyQuery筛选失败', err.message);
        this.setState({ loading: false });
      });
  };

  //问卷名搜索渲染
  handleSearchChange = value => {
    console.log({ value });
    this.setState({ loading: true });

    http()
      .getTable({
        resid: 608822905547,
        cmswhere: `query_name LIKE '%${value}%'`
      })
      .then(res => {
        this.setState({ questionnaire: res.data, loading: false });
      })
      .catch(err => {
        console.error(err);
        message.error('MyQuery问卷搜索', err.message);
        this.setState({ loading: false });
      });
  };

  handleSelectFolder = id => {
    console.log({ id });
  };
  // 页码
  handlePageChange = (page, pageSize) => {
    // console.log(page, pageSize);
    this.setState({
      current: page
    });
    this.getData(page, pageSize);
  };
  render() {
    const {
      questionnaire,
      loading,
      foloderbuttonChecked,
      current,
      total,
      pageSize
    } = this.state;
    return (
      <Spin spinning={loading}>
        <div className="query">
          <div className="query-top">
            <Link
              to={{
                pathname: '/fnmodule',
                search: `?resid=问卷设置&recid=608296075283&type=前端功能入口&title=问卷首页&id=`
              }}
              target="_self"
            >
              <Button type="primary">
                <Icon type="plus" />
                创建问卷
              </Button>
            </Link>
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
          </div>
          <div className="folder">
            <Button type="primary" icon="plus" onClick={this.showModal}>
              管理文件夹
            </Button>
            {foloderbuttonChecked == '全部' ? (
              <Button
                style={{ marginLeft: 8 }}
                onClick={this.getData}
                type="primary"
              >
                全部
              </Button>
            ) : (
              <Button style={{ marginLeft: 8 }} onClick={this.getData}>
                全部
              </Button>
            )}
            <Modal
              title="管理文件夹"
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
                  type={this.getType(item.floder_name)}
                  onClick={() => {
                    this.sortShow(item);
                  }}
                >
                  {item.floder_name}
                </Button>
              );
            })}
          </div>
          <QueryTable
            questionnaire={questionnaire}
            onDelete={this.deleQuery}
            onStopQuery={this.stopQuery}
            onCopyQuery={this.copyQuery}
          />
          <div className="My-qiery__paging">
            <Pagination
              current={current}
              pageSize={pageSize}
              total={total}
              showQuickJumper
              onChange={this.handlePageChange}
            />
          </div>
        </div>
      </Spin>
    );
  }
}

export default MyQuery;
