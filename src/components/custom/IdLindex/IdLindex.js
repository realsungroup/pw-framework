import React, { Component } from 'react';
import './IdLindex.less';
import { List, Avatar, Tabs, Modal, Button, Select, Input, Menu } from 'antd';
import http from '../../../util20/api';
import ApplayInformnation from '../ApplayInformnation';
import TableData from '../../common/data/TableData';
import { assementForm, referenceCheck } from './config.js';
import { withRecordForm } from '../../common/hoc/withRecordForm';
import dealControlArr from '../../../util20/controls';
import { getDataProp } from '../../../util20/formData2ControlsData';
const { Option } = Select;
const { SubMenu } = Menu;
const MenuList = [
  {
    label: '个人资料',
    value: '个人资料',
    icon: 'user'
  },
  {
    label: '教育背景',
    value: '教育背景',
    icon: 'trophy'
  },
  {
    label: '工作经历',
    value: '工作经历',
    icon: 'apartment'
  },
  {
    label: '家庭成员关系',
    value: '家庭成员关系',
    icon: 'apartment'
  },
  {
    label: '专业培训',
    value: '专业培训',
    icon: 'usergroup-add'
  },
  {
    label: '相关技能',
    value: '相关技能',
    icon: 'schedule'
  },
  {
    label: '其他',
    value: '其他',
    icon: 'user-add'
  }
];
class IdLindex extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    this.getPersonList();
  };
  state = {
    personList: [],
    currentPersonInfo: {},
    currentPersonId: '',
    recordFormName: 'default',
    modalType: '',
    typeVisible: false,
    accessCategority: '',
    activeKey: '工作申请表'
  };
  handlePersonOnClick = item => {
    const { personList } = this.state;
    const tempPersonList = [...personList];
    tempPersonList.forEach(item => {
      item.isSelected = false;
    });
    item.isSelected = true;
    // 并获取该人的详细信息
    this.setState({ personList: tempPersonList, currentPersonId: item.ID });
    this.getPersonalInfo(item.ID);
  };
  getSelectClass = isSelected => {
    if (isSelected) {
      return 'idlindex__person-list__antd-y-item__active';
    } else {
      return 'idlindex__person-list__antd-y-item';
    }
  };
  handleClick = e => {
    console.log(e.key);
    this.setState({
      activeKey: e.key
    });
  };
  // 获取人员列表
  getPersonList = async key => {
    let res;
    try {
      res = await http().getTable({
        resid: 613152690063,
        key: key
      });
    } catch (err) {
      console.log(err);
    }
    if (0 < res.total) {
      res.data.map(item => {
        return (item.isSelected = false);
      });
      res.data[0].isSelected = true;
      // console.log(res.data);
      this.getPersonalInfo(res.data[0].ID);
      this.setState({
        personList: res.data,
        currentPersonId: res.data[0].ID
      });
    } else {
      console.log('获取人员列表失败');
    }
  };
  // 获取人员详细信息
  getPersonalInfo = async id => {
    let res;
    try {
      res = await http().getTable({
        resid: 613149356409,
        cmswhere: `ID=${id}`
      });
      // console.log('人员详细信息',res.data)
      this.setState({ currentPersonInfo: res.data[0] });
    } catch (err) {
      Modal.error({
        title: '提示',
        content: err.message
      });
    }
  };
  // 窗体点击确定
  ModalOK = () => {
    this.setState({
      typeVisible: false
    });
  };
  // addFormOK
  addFormOK = () => {
    const { modalType, currentPersonId, accessCategority } = this.state;
    let resid;
    if (modalType === 'accessment') {
      resid = 613152706922;
    } else {
      resid = 613152614705;
    }
    http()
      .addRecords({
        resid: resid,
        data: [
          {
            ID: currentPersonId,
            accessCategority
          }
        ]
      })
      .then(res => {
        this.tableDataRef.handleRefresh();
      })
      .catch(err => {
        console.error(err.message);
      });
    this.setState({
      typeVisible: false
    });
  };
  //监听添加表类型变化
  handleSelectChange = value => {
    this.setState({
      accessCategority: value
    });
  };
  // 窗体点击取消
  ModalCancel = () => {
    this.setState({
      typeVisible: false
    });
  };
  //获取formData数据
  getFormData = async record => {
    // 1.看懂高阶组件接收的东西，打开一个模态窗。
    let res;
    try {
      res = await http().getFormData({
        resid: 613152706922,
        formname: record.accessCategority
      });
    } catch (err) {
      return console.error(err.message);
    }
    console.log('获取到窗体的数据', res);
    const formMidData = dealControlArr(res.data.columns);
    // console.log('中间数据', formMidData);
    const terminalData = getDataProp(formMidData, record, false, true); //得到了最终的data
    // console.log('最终的数据', terminalData);
    /**
     *第一步： 在withRecordForm组件中传过来一个方法叫openRecordForm,
     *第二步：this.props.openRecordForm 所接收的参数看文档。
     *第三步:this.props.openRecordForm 其中所接收的一个参数是data,需要从后端取出来然后自己处理，所以回到第1步先处理数据。
     */
    //2.打开这个模态窗
    this.props.openRecordForm({
      title: '面试评估表',
      operation: 'modify',
      formProps: {
        displayMode: 'classify'
      },
      record: record,
      info: {
        dataMode: 'main',
        resid: 613152706922,
        hostrecid: record.REC_ID
      },
      data: terminalData,
      onSuccess: () => {
        alert('success');
      },
      onCancel: () => {
        this.props.closeRecordForm();
      }
    });
  };
  // 渲染不同模态框中的内容
  renderContent = () => {
    const { modalType } = this.state;
    if (modalType === 'reference') {
      return (
        <Select
          defaultValue="背景调查表"
          style={{ width: 300 }}
          onChange={this.handleSelectChange}
        >
          <Option value="HR">人事调查</Option>
          <Option value="Colleague">上级调查</Option>
        </Select>
      );
    } else {
      return (
        <Select
          defaultValue="面试评估表"
          style={{ width: 300 }}
          onChange={this.handleSelectChange}
        >
          <Option value="T1T2T3T4">T1T2T3T4</Option>
          <Option value="T6">T6</Option>
          <Option value="T5">T5</Option>
          <Option value="T4">T4</Option>
          <Option value="应届生">应届生</Option>
          <Option value="Manager">Manager</Option>
        </Select>
      );
    }
  };
  addFormCategory = modalType => {
    this.setState({
      typeVisible: true,
      modalType
    });
  };
  handleSearchClick = value => {
    //  console.log(value);
    this.getPersonList(value);
  };
  renderContent = () => {
    const { activeKey, currentPersonInfo } = this.state;
    switch (activeKey) {
      case '工作申请表':
        return (
          <div>
            <div className="idlindex__applayBox">
              <ApplayInformnation
                hasSubmit={true}
                initialValue={currentPersonInfo}
              />
            </div>
          </div>
        );
      case '面试评估表':
        return (
          <div>
            <TableData
              key={613152706922}
              {...assementForm}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              actionBarExtra={() => {
                return (
                  <Button
                    onClick={() => {
                      this.addFormCategory('accessment');
                    }}
                  >
                    添加
                  </Button>
                );
              }}
              customRowBtns={[
                (record, btnSize) => {
                  return (
                    <Button
                      onClick={() => {
                        this.getFormData(record);
                      }}
                    >
                      评估详情
                    </Button>
                  );
                }
              ]}
            />
          </div>
        );
      case '背景调查表':
        return (
          <div>
            <TableData
             key={613152614705}
              resid={613152614705}
              height={500}
              hasAdd={false}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              actionBarExtra={() => {
                return (
                  <Button
                    onClick={() => {
                      this.addFormCategory('reference');
                    }}
                  >
                    添加
                  </Button>
                );
              }}
            />
          </div>
        );
    }
  };
  render() {
    const { personList, currentPersonInfo } = this.state;
    // console.log(currentPersonInfo);
    return (
      <div className="idlindex">
        <div className="idlindex__person-list">
          <div className="idlindex__search">
            <Input.Search
              placeholder="请输入关键词进行搜索"
              onSearch={value => this.handleSearchClick(value)}
            />
          </div>
          <List
            className="idlindex-left"
            itemLayout="horizontal"
            dataSource={personList}
            renderItem={item => (
              <List.Item
                className={this.getSelectClass(item.isSelected)}
                onClick={() => {
                  this.handlePersonOnClick(item);
                }}
              >
                <Avatar icon="user" />
                <div
                  style={{
                    fontSize: 14,
                    width: 50,
                    height: 40
                  }}
                >
                  <span style={{ display: 'block' }}>{item.ChName}</span>
                  <span>{item.Sex}</span>
                </div>
                <div style={{ width: 70 }}>{item.appPosition}</div>
              </List.Item>
            )}
          />
        </div>
        <div className="idlindex__form-list">
          <div className="idlindex__form-list-nav">
            <Menu
              mode="horizontal"
              onClick={this.handleClick}
              selectedKeys={[this.state.activeKey]}
            >
              <SubMenu title="工作申请表" style={{ witth: '33%' }} key='工作申请表'>
                <Menu.Item key="工作申请表">
                  <a href="#工作申请表">个人资料</a>
                </Menu.Item>
                <Menu.Item key="工作申请表">
                  <a href="#教育背景">教育背景</a>
                </Menu.Item>
                <Menu.Item key="工作申请表">
                  <a href="#工作经历">工作经历</a>
                </Menu.Item>
                <Menu.Item key="工作申请表">
                  <a href="#家庭成员及主要社会关系">家庭成员</a>
                </Menu.Item>
                <Menu.Item key="工作申请表">
                  <a href="#培训经历">培训经历</a>
                </Menu.Item>
                <Menu.Item key="工作申请表">
                  <a href="#相关技能">相关技能</a>
                </Menu.Item>
                <Menu.Item key="工作申请表">
                  <a href="#其他">其他</a>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="面试评估表" style={{ witth: '33%' }}>
                面试评估表
              </Menu.Item>
              <Menu.Item key="背景调查表" style={{ witth: '33%' }}>
                背景调查表
              </Menu.Item>
            </Menu>
          </div>
          <div className="idlindex__form-list-content">
            {this.renderContent()}
          </div>
          {/* <Tabs defaultActiveKey="工作申请表">
            <TabPane tab="工作申请表" key="工作申请表">
              <div className="idlindex__applayBox">
                <ApplayInformnation
                  hasSubmit={true}
                  initialValue={currentPersonInfo}
                />
              </div>
            </TabPane>
            <TabPane tab="面试评估表" key="面试评估表">
             
            </TabPane>
            <TabPane tab="背景调查表" key="背景调查表">
              
            </TabPane>
          </Tabs> */}
          <Modal
            title="添加背景调查表/面试评估表"
            visible={this.state.typeVisible}
            onOk={this.addFormOK}
            onCancel={this.ModalCancel}
          >
            <div style={{ height: 300 }}>{this.renderContent()}</div>
          </Modal>
        </div>
      </div>
    );
  }
}
export default withRecordForm()(IdLindex);
