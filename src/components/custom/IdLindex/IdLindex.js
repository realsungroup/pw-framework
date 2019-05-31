import React, { Component } from 'react';
import './IdLindex.less';
import { List, Avatar } from 'antd';
import { Layout } from 'antd';
import http from '../../../util20/api';
const pl = [
  {
    id: `4113229874637y1`,
    name: `王名字1`,
    job: 'HR',
    department: 'S4',
    isSelected: false,
    formbelongs: [
      {
        formID: `woek1`,
        formNmae: '工作申请表'
      }
    ]
  },
  {
    id: `4113229874637y2`,
    name: `王名字2`,
    job: 'HR',
    department: 'S4',
    isSelected: false,
    formbelongs: [
      {
        formID: `work1`,
        formNmae: '工作申请表'
      },
      {
        formID: `assments`,
        formNmae: '评估表'
      }
    ]
  },
  {
    id: `4113229874637y3`,
    name: `王名字3`,
    job: 'HR',
    department: 'S4',
    isSelected: false,
    formbelongs: [
      {
        formID: `woek1`,
        formNmae: '工作申请表'
      },
      {
        formID: `assments`,
        formNmae: '评估表'
      },
      {
        formID: `background`,
        formNmae: '背景调查'
      }
    ]
  }
];
const { Header, Footer, Sider, Content } = Layout;
export default class IdLindex extends Component {
  componentDidMount = () => {
    // this.modleList();
    this.getPerson();
  };
  state = {
    personList: pl,
    currentPersonInfo:'',
    // listSelecteClass:'idlindex__person-list__antd-y-item',
  };
  // 模拟人员表
  modleList = () => {
    let personList = [];
    for (var i = 0; i < 10; i++) {
      const obj = {
        id: `4113229874637y${i}`,
        name: `王名字${i}`,
        job: 'HR',
        department: 'S4',
        isSelected: false,
        formbelongs: [
          {
            formID: `woek${i}`
          }
        ]
      };
      personList.push(obj);
    }
    this.setState({
      personList
    });
  };
  handlePersonOnClick = item => {
    const { personList } = this.state;
    personList.map(item => {
      return (item.isSelected = false);
    });
    item.isSelected = true;
    this.setState({ personList ,currentPersonInfo:item});
  };

  getSelectClass = isSelected => {
    if (isSelected) {
      return 'idlindex__person-list__antd-y-item__active';
    } else {
      return 'idlindex__person-list__antd-y-item';
    }
  };
  // 获取另外一个基地址的数据
  getPerson = async () => {
    let res;
    try {
      res = await http({ baseURL: 'http://kingofdinner.realsun.me/' }).getTable(
        {
          resid: 611775282600
        }
      );
    } catch (err) {
      console.error(err);
    }
    console.log(res);
  };
  render() {
    const { personList,currentPersonInfo } = this.state;
    console.log({ personList: personList });
    return (
      <div className="idlindex">
        <h4 className="idlindex__title">候选人名单</h4>
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
        </div>
        <div className="idlindex__form-list">
          <h4 className="idlindex__title">候选人事项表</h4>
          
        </div>
      </div>
    );
  }
}
