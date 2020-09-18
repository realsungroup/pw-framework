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
      current: 1,
      pageSize: 5,
      total: 0,
      folderId: '', // 文件夹 id
      queryStatus: '', // 问卷状态
      selectedFolderText: '全部', // 选中的文件夹的文本
      searchValue: '' // 搜索值
    };
  }

  //获取问卷文件夹
  getFloders = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: 608822887704
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    res.data.unshift({ floder_name: '全部', floder_id: '' });
    this.setState({
      floders: res.data,
      loading: false
    });
  };
  // 复制问卷
  copyQuery = async item => {
    // 此处的item是所要复制的问卷的详细信息,复制分为两步，
    /**第1步先复制问卷的信息,
     * 第2步复制该问卷中所包含的问卷试题
     */
    // console.log('复制', item);
    const newItem = [
      {
        query_name: item.query_name,
        query_description: item.query_description,
        floder_name: item.floder_name
      }
    ];
    this.setState({ loading: true });

    // 1 复制问卷的信息，在此场景中问卷信息包括问卷的名称和问卷描述,在问卷表中添加一条新的记录。
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
    this.setState({ loading: false });
    const {
      current,
      pageSize,
      folderId,
      queryStatus,
      searchValue
    } = this.state;
    this.getData(current, pageSize, folderId, queryStatus, searchValue);
    /**
     * 第二步:复制问卷试题,
     * 2.1:首先拿到原问卷的试题，去后台查表的内容(问卷试题表和试题选项表)
     */
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
    // 处理拿到的原问卷试题和试题的选项,subdata对应的是该试题的选项,一个试题多个选项
    let AllQuestionsArrdata = [];
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
      // console.log('复制的试题', res.data[index]);
      AllQuestionsArrdata.push(obj);
    });

    // console.log('所有的试题和试题选项', AllQuestionsArrdata);

    /**
     * 对所有的试题和试题选项改成后端要的数据。
     */
    let AllQuestionDataBack = [];
    AllQuestionsArrdata.map((questionB, index) => {
      const objB = {
        resid: 608828418560,
        maindata: {
          query_id: questionB.query_id,
          question_topic: questionB.question_topic,
          question_must: questionB.question_must,
          question_type: questionB.question_type,
          subdata: questionB.subdata,
          _state: 'added',
          _id: index + 1
        }
      };
      objB.subdata = questionB.subdata.map((subdataBckItem, index) => {
        return {
          resid: 608828722533,
          maindata: {
            option_content: subdataBckItem.option_content,
            option_write: subdataBckItem.option_write,
            _state: 'added',
            _id: index + 1
          }
        };
      });
      AllQuestionDataBack.push(objB);
    });
    console.log('后端要的数据', AllQuestionDataBack);

    //利用saveRecords向后端发送数据,向试题表和试题选项表中加数据
    http()
      .saveRecordAndSubTables({
        data: AllQuestionDataBack
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
    //组件将要被创建的时候，也即一旦加载该组件的时候。
    this.getFloders();
    this.getData(1, this.state.pageSize, '', '', '');
  }

  componentWillUpdate() {
    //页面将要更新时执行的函数
  }
  componentDidUpdate() { }

  /**
   * 获取数据
   * current:当前页码
   * pageSize:每页数量
   * folderId:文件夹 id
   * status:问卷状态
   * searchValue:搜索值
   */
  getData = async (current, pageSize, folderId, status, searchValue = '') => {
    this.setState({ loading: true, foloderbuttonChecked: '全部' });
    let cmswhere = '',
      temp = false;
    if (folderId) {
      cmswhere += `floder_id = '${folderId}'`;
      temp = true;
    }
    if (status) {
      if (temp) {
        cmswhere += ' and ';
      }
      cmswhere += `query_status = '${status}'`;
      temp = true;
    }
    if (searchValue) {
      if (temp) {
        cmswhere += ' and ';
      }
      cmswhere += `query_name LIKE '%${searchValue}%'`;
    }

    http()
      .getTable({
        resid: 608822905547,
        pageindex: current - 1,
        pagesize: pageSize,
        cmswhere
      })
      .then(res => {
        console.log('问卷', res.data);

        let n = 0;
        let arr = res.data;
        while (n < arr.length) {
          arr[n].query_address = window.location.host + arr[n].query_address;
          n++;
        }
        this.setState({
          questionnaire: arr,
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
    const { selectedFolderText } = this.state;
    if (selectedFolderText == flodername) {
      return 'primary';
    }
    return 'default';
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
        const {
          current,
          pageSize,
          folderId,
          queryStatus,
          searchValue
        } = this.state;
        this.getData(current, pageSize, folderId, queryStatus, searchValue);
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

  // 问卷状态切换
  queryStatusChange = value => {
    this.setState({ loading: true });
    const { pageSize, folderId, searchValue } = this.state;
    this.setState({ queryStatus: value });
    this.getData(1, pageSize, folderId, value, searchValue);
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
        const {
          current,
          pageSize,
          folderId,
          queryStatus,
          searchValue
        } = this.state;
        this.getData(current, pageSize, folderId, queryStatus, searchValue);
      })
      .catch(err => {
        console.error('修改失败原因', err);
        message.error('MyQuery停止问卷失败', err.message);
        this.setState({ loading: false });
      });
  };

  //筛选查询渲染
  sortShow = item => {
    const floderId = item.floder_id;
    console.log({ floderId });
    const { pageSize, queryStatus, searchValue } = this.state;

    this.getData(1, pageSize, floderId, queryStatus, searchValue);

    this.setState({ folderId: floderId, selectedFolderText: item.floder_name });
  };

  //问卷名搜索渲染
  handleSearchChange = value => {
    this.setState({ loading: true });
    const { pageSize, folderId, queryStatus } = this.state;
    this.getData(1, pageSize, folderId, queryStatus, value);
  };

  handleSelectFolder = id => {
    console.log({ id });
  };

  // 页码
  handlePageChange = (page, pageSize) => {
    const { folderId, queryStatus, searchValue } = this.state;
    this.getData(page, pageSize, folderId, queryStatus, searchValue);
    this.setState({
      current: page
    });
  };

  render() {
    const {
      questionnaire,
      loading,
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
              value={this.state.searchValue}
              onChange={e => this.setState({ searchValue: e.target.value })}
              onSearch={this.handleSearchChange}
            />
            <Select
              defaultValue="问卷状态"
              style={{ width: 120 }}
              onChange={this.queryStatusChange}
            >
              <Option value="">问卷状态</Option>
              <Option value="已停止">已停止</Option>
              <Option value="已发送">已发送</Option>
              <Option value="草稿">草稿</Option>
            </Select>
          </div>
          <div className="folder">
            <Button type="primary" icon="plus" onClick={this.showModal}>
              管理文件夹
            </Button>

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
                  key={item.floder_name}
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
            history={this.props.history}
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
