import React, { Component } from 'react';
import './IdLindex.less';
import { List, Avatar, Tabs } from 'antd';
import http from '../../../util20/api';
import ApplayInformnation from '../ApplayInformnation';
import TableData from '../../common/data/TableData';
// const { Panel } = Collapse;
// const { Option } = Select;
const { TabPane } = Tabs;

export default class IdLindex extends Component {
  componentDidMount = () => {
    // 获取数据
    this.getPersonList();
  };
  state = {
    personList: [],
    currentPersonInfo: {}
  };
  handlePersonOnClick = item => {
    const { personList } = this.state;
    personList.map(item => {
      return (item.isSelected = false);
    });
    item.isSelected = true;
    console.log({item:item});
    this.setState({ personList, currentPersonInfo: item });
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
        resid: 613149356409
      });
    } catch (err) {
      console.log(err);
    }
    console.log(res.data);
    this.setState({ personList: res.data });
  };
  render() {
    const { personList, currentPersonInfo } = this.state;
    // console.log({ personList: personList });
    console.log({ currentPersonInfo: currentPersonInfo });
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
                <span>职位级别:{item.JobTitle}</span>
                <span>申请部门:{item.Sex}</span>
              </List.Item>
            )}
          />
        </div>
        <div className="idlindex__form-list">
          <Tabs defaultActiveKey="工作申请表">
            <TabPane tab="工作申请表" key="工作申请表">
              <div className='idlindex__applayBox'>
                <ApplayInformnation hasSubmit={false}  initialValue={currentPersonInfo}/>
              </div>
            </TabPane>
            <TabPane tab="面试评估表" key="面试评估表">
              <TableData />
            </TabPane>
            <TabPane tab="背景调查表" key="背景调查表">
              <TableData />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
