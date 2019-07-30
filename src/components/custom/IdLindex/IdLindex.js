import React, { Component } from 'react';
import './IdLindex.less';
import { List, Avatar, Modal, Button, Input, Menu, Icon } from 'antd';
import http from '../../../util20/api';
import MoveTo from 'moveto';
import ApplayInformnation from '../ApplayInformnation'; //中间申请表的内容
import TableData from '../../common/data/TableData';
import { assementForm, referenceCheck } from './config.js'; //面试评估表和背景调查表的配置
import { withRecordForm } from '../../common/hoc/withRecordForm';
//高阶组件,点击评估详情弹出后台对应不同的窗体需要用到高阶组件withRecordForm
import dealControlArr from '../../../util20/controls'; //处理数据
import { getDataProp } from '../../../util20/formData2ControlsData'; //处理数据
// 左侧导航栏列表的清单
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
    personList: [], //人员列表
    currentPersonInfo: {}, //当前选中人员的信息
    currentPersonId: '', //当前选中人员ID
    recordFormName: 'default',
    typeVisible: false,
    activeKey: '工作申请表'
  };
  // 点击某个人时候设置样式
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
  // 给当前选中的人添加类名控制样式
  getSelectClass = isSelected => {
    if (isSelected) {
      return 'idlindex__content-person__active';
    } else {
      return;
    }
  };
  // 监听Tabs页的变化
  handleClick = activeKey => {
    // console.log(activeKey);
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
  // 获取当前人员人员详细信息
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
  //获取formData数据
  getFormData = async record => {
    // 1.看高阶组件接收的东西，打开一个模态窗。
    let res;
    try {
      res = await http().getFormData({
        resid: 613152706922,
        formname: record.accessCategority
      });
    } catch (err) {
      return console.error(err.message);
    }
    // 处理数据的过程参考docs下面的form-data.md文件的说明
    /**
     *
     *1 通过调用 `http().getFormData(params)` 来获取得到`窗体数据`
     *2 将得到的`窗体数据`传给 `util20/controls.js` 中的 `dealControlArr()` 函数处理，得到 `处理后的窗体`
     *3 最后，将得到的 `处理后的窗体数据` 传给 `util20/formData2ControlsData.js` 中的 `getDataProp()` 函数处理，得到 `data`。此 `data` 便是 `FormData` 组件所接收的 `data` 属性值。
     */
    // console.log('获取到窗体的数据', res);
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
            <div className="idlindex__content-form__info-nav">
              <Menu
                style={{ width: 265, height: '100vh' }}
                defaultSelectedKeys={['个人资料']}
              >
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
            <ApplayInformnation
              hasSubmit={true}
              initialValue={currentPersonInfo}
            />
          </React.Fragment>
        );
      case '面试评估表':
        return (
          <TableData
            key={613152706922}
            {...assementForm}
            wrappedComponentRef={element => (this.tableDataRef = element)}
            cmswhere={`ID='${this.state.currentPersonId}'`}
            refTargetComponentName="TableData"
            customRowBtns={[
              (record, btnSize) => {
                return (
                  <Button
                    onClick={() => {
                      this.getFormData(record);
                    }}
                  >
                    填写
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
              cmswhere={`ID='${this.state.currentPersonId}'`}
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
    const { personList } = this.state;
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
        </div>
      </div>
    );
  }
}
export default withRecordForm()(IdLindex);
