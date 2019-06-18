import React, { Component } from 'react';
import './IdLindex.less';
import { List, Avatar, Tabs, Modal, Button, Select } from 'antd';
import http from '../../../util20/api';
import ApplayInformnation from '../ApplayInformnation';
import TableData from '../../common/data/TableData';
import { assementForm, referenceCheck } from './config.js';
import { withRecordForm } from '../../common/hoc/withRecordForm';
import dealControlArr from '../../../util20/controls';
import { getDataProp } from '../../../util20/formData2ControlsData';
const { Option } = Select;
const { TabPane } = Tabs;
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
    accessCategority: ''
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

  // 获取人员列表
  getPersonList = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: 613152690063
      });
    } catch (err) {
      console.log(err);
    }
    res.data.map(item => {
      return (item.isSelected = false);
    });
    res.data[0].isSelected = true;
    console.log(res.data);
    this.getPersonalInfo(res.data[0].ID);
    this.setState({
      personList: res.data,
      currentPersonId: res.data[0].ID
    });
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
      info:{
        dataMode:'main',
        resid:613152706922,
        hostrecid:record.REC_ID,
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
  render() {
    const { personList, currentPersonInfo } = this.state;
    console.log(currentPersonInfo);
    return (
      <div className="idlindex">
        <div className="idlindex__person-list">
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
                <div>姓名:{item.ChName}</div>
                <span>职位级别:{item.EnName}</span>
                <span>申请部门:{item.appPosition}</span>
              </List.Item>
            )}
          />
        </div>
        <div className="idlindex__form-list">
          <Tabs defaultActiveKey="工作申请表">
            <TabPane tab="工作申请表" key="工作申请表">
              <div className="idlindex__applayBox">
                <ApplayInformnation
                  hasSubmit={true}
                  initialValue={currentPersonInfo}
                />
              </div>
            </TabPane>
            <TabPane tab="面试评估表" key="面试评估表">
              <TableData
                {...assementForm}
                subtractH={210}
                hasModify={false}
                hasAdd={false}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                hasRowSelection={false}
                hasBeBtns={true}
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
                        弹出不同窗体
                      </Button>
                    );
                  }
                ]}
              />
            </TabPane>
            <TabPane tab="背景调查表" key="背景调查表">
              <TableData
                resid={613152614705}
                height={500}
                hasAdd={false}
                displayMode="classify"
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
            </TabPane>
          </Tabs>
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
