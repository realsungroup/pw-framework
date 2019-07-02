import React, { Component } from 'react';
import './IdLindex.less';
import { List, Avatar, Modal, Button, Input, Menu, Icon } from 'antd';
import http from '../../../util20/api';
import MoveTo from 'moveto';
import ApplayInformnation from '../ApplayInformnation';
import TableData from '../../common/data/TableData';
import { assementForm, referenceCheck } from './config.js';
import { withRecordForm } from '../../common/hoc/withRecordForm';
import dealControlArr from '../../../util20/controls';
import { getDataProp } from '../../../util20/formData2ControlsData';
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
      return 'idlindex__content-person__active';
    } else {
      return;
    }
  };
  handleClick = activeKey => {
    console.log(activeKey);
    this.setState({
      activeKey
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
          <React.Fragment>
            <ApplayInformnation
              hasSubmit={true}
              initialValue={currentPersonInfo}
            />
            <div className="idlindex__content-form__info-nav">
              <Menu style={{ width: 265 ,height:'100vh'}} defaultSelectedKeys={['个人资料']}>
                {MenuList.map((menuItem, index) => {
                  return (
                    <Menu.Item
                      key={menuItem.value}
                      onClick={() => {
                        this.hanleMoveTo(menuItem.value);
                      }}
                    >
                      <Icon type={menuItem.icon} />
                      {menuItem.label}
                    </Menu.Item>
                  );
                })}
              </Menu>
            </div>
          </React.Fragment>
        );
      case '面试评估表':
        return (
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
        );
      case '背景调查表':
        return (
          <div>
            <TableData
            {...referenceCheck}
              key={613152614705}
              // actionBarExtra 
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
            />
          </div>
        );
    }
  };
  // 移动
  hanleMoveTo = id => {
    const moveTo = new MoveTo({
      duration: 365,
      tolerance: 195,
      container: document.querySelector('.applay__informnation')
    });
    // console.log(id);
    const tempid = document.getElementById(id);
    moveTo.move(tempid);
  };
  render() {
    const { personList, currentPersonInfo } = this.state;
    // console.log(currentPersonInfo);
    return (
      <div className="idlindex">
        <div className="idlindex__header">
          <div className="idlindex__header-search">
            <Input.Search
              placeholder="请输入关键词进行搜索"
              onSearch={value => this.handleSearchClick(value)}
            />
          </div>
          <div className="idlindex__header-nav">
            <Menu
              mode="horizontal"
              selectedKeys={[this.state.activeKey]}
              onClick={e => {
                this.handleClick(e.key);
              }}
            >
              <Menu.Item style={{ width: '30%' }} key="工作申请表">
                工作申请表
              </Menu.Item>
              <Menu.Item style={{ width: '30%' }} key="面试评估表">
                面试评估表
              </Menu.Item>
              <Menu.Item style={{ width: '30%' }} key="背景调查表">
                背景调查表
              </Menu.Item>
            </Menu>
          </div>
        </div>
        <div className="idlindex__content">
          <div className="idlindex__content-person">
            <List
              itemLayout="horizontal"
              dataSource={personList}
              renderItem={item => (
                <List.Item
                  className={this.getSelectClass(item.isSelected)}
                  onClick={() => {
                    this.handlePersonOnClick(item);
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon="user" />}
                    title={item.ChName}
                    description={item.appPosition}
                  />
                  <div style={{ padding: '0 10px' }}>{item.Sex}</div>
                </List.Item>
              )}
            />
          </div>
          <div className="idlindex__content-form">{this.renderContent()}</div>
          <Modal
            title="添加背景调查表/面试评估表"
            visible={this.state.typeVisible}
            onOk={this.addFormOK}
            onCancel={this.ModalCancel}
          >
            {/* <div style={{ height: 300 }}>{this.renderContent()}</div> */}
          </Modal>
        </div>
      </div>
    );
  }
}
export default withRecordForm()(IdLindex);
