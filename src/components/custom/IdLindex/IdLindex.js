import React, { Component } from 'react';
import './IdLindex.less';
import { List, Avatar } from 'antd';
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;
export default class IdLindex extends Component {
  componentDidMount = () => {
    this.modleList();
  };
  state = {
    personList: [],
    // listSelecteClass:'idlindex__person-list__antd-y-item',
  };
  // 向后端请求数据
  modleList = () => {
    let personList = [];
    for (var i = 0; i < 10; i++) {
      const obj = {
        id: `4113229874637y${i}`,
        name: `王名字${i}`,
        job: 'HR',
        department: 'S4',
        isSelected:false,
      };
      personList.push(obj);
    }
    this.setState({
      personList
    });
  };
  handlePersonOnClick = item => {
    this.state.personList.map((item)=>{
      return item.isSelected = false;
    });
    item.isSelected = true;
    console.log(this.state.personList);
     this.getSelectClass(item.isSelected);
  };
  getSelectClass=(isSelected)=>{
      if(isSelected){
        return 'idlindex__person-list__antd-y-item__active';
      }else{
       return 'idlindex__person-list__antd-y-item' ;
      }
  }
  render() {
    const { personList ,} = this.state;
    console.log({ personList: personList });
    return (
      <div className="idlindex">
        <div className="idlindex__header">
          <h4 className="idlindex__header__title">候选人名单</h4>
          <h4 className="idlindex__header__title">候选人事项表</h4>
        </div>
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
                <div>姓名:{item.name}</div>
                <span>职位级别:{item.department}</span>
                <span>申请部门:{item.job}</span>
              </List.Item>
            )}
          />
          <div className="idlindex__form-list" />
        </div>
      </div>
    );
  }
}
