import React, { Component } from 'react';
import './IdLindex.less';
import { List, Avatar, Collapse, Select } from 'antd';
import { Tabs } from 'antd';
import http from '../../../util20/api';
import ApplayInformnation from '../ApplayInformnation';
// const { Panel } = Collapse;
// const { Option } = Select;
const { TabPane } = Tabs;
const personList = [
  {
    id: `4113229874637y1`,
    name: `王名字1`,
    job: 'HR',
    department: 'S4',
    isSelected: false,
    formbelongs: [
      {
        formID: `woek1`,
        formName: '工作申请表'
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
        formName: '工作申请表'
      },
      {
        formID: `assments`,
        formName: '面试评估表'
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
        formName: '工作申请表'
      },
      {
        formID: `assments`,
        formName: '面试评估表'
      },
      {
        formID: `background`,
        formName: '背景调查表'
      }
    ]
  }
];

export default class IdLindex extends Component {
  componentDidMount = () => {};
  state = {
    personList: personList,
    currentPersonInfo: personList[0]
  };
  handlePersonOnClick = item => {
    const { personList } = this.state;
    personList.map(item => {
      return (item.isSelected = false);
    });
    item.isSelected = true;
    this.setState({ personList, currentPersonInfo: item });
  };

  getSelectClass = isSelected => {
    if (isSelected) {
      return 'idlindex__person-list__antd-y-item__active';
    } else {
      return 'idlindex__person-list__antd-y-item';
    }
  };
  handleSelectFormChange = value => {
    const { currentPersonInfo } = this.state;
    const tempcurrentPersonInfo = { ...currentPersonInfo };
    const obj = {
      formID: `assments`,
      formName: '背景调查表'
    };
    tempcurrentPersonInfo.formbelongs.push(obj);
    this.setState({ currentPersonInfo: tempcurrentPersonInfo });
  };
  handleAccessFormChange = value => {
    const { currentPersonInfo } = this.state;
    const tempcurrentPersonInfo = { ...currentPersonInfo };
    const obj = {
      formID: `assments`,
      formName: '面试评估表'
    };
    tempcurrentPersonInfo.formbelongs.push(obj);
    this.setState({ currentPersonInfo: tempcurrentPersonInfo });
  };
  // 根据不同表格显示不同表格的内容

  // renderPanelContent = name => {
  //   switch (name) {
  //     case '工作申请表': {
  //       return (
  //         <ApplayInformnation
  //           hasSubmit={false}
  //           initialValues={{ ChName: '袁巧云', EnName: 'Cindy' }}
  //         />
  //       );
  //     }
  //     case '面试评估表': {
  //       return (
  //         <div>
  //           面试评估表的内容
  //           <h1>1111</h1>
  //           <span>2222</span>
  //         </div>
  //       );
  //     }
  //     case '背景调查表': {
  //       return <div>背景调查表的内容</div>;
  //     }
  //   }
  // };
  render() {
    const { personList, currentPersonInfo } = this.state;
    console.log({ personList: personList });
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
                <div>姓名:{item.name}</div>
                <span>职位级别:{item.department}</span>
                <span>申请部门:{item.job}</span>
              </List.Item>
            )}
          />
        </div>
        <div className="idlindex__form-list">
          {/* <h4 className="idlindex__title">候选人事项表</h4>
          <Collapse className="idlindex__form-list__workform">
            {currentPersonInfo.formbelongs.map((form, index) => {
              return (
                <Panel header={form.formName} key={index}>
                 {this.renderPanelContent(form.formName)}
                </Panel>
              );
            })}
          </Collapse> */}
          <Tabs defaultActiveKey="工作申请表" >
            <TabPane tab="工作申请表" key="工作申请表">
           <ApplayInformnation hasSubmit={false}></ApplayInformnation>
            </TabPane>
            <TabPane tab="面试评估表" key="面试评估表">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="背景调查表" key="背景调查表">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </div>

        {/* <div className="idlindex__actionBar">
          <Select
            defaultValue="背景调查表"
            style={{ width: 300 ,marginRight:10}}
            onChange={this.handleSelectFormChange}
          >
            <Option value="HR">Reference Check Letter-HR</Option>
            <Option value="Colleage">
              Reference Check Letter-Supervisor&Colleague
            </Option>
          </Select>
          <Select
            defaultValue="面试评估表"
            style={{ width: 300 }}
            onChange={this.handleAccessFormChange}
          >
            <Option value="T1">T1~T4</Option>
            <Option value="T5">T5</Option>
            <Option value="T6">T6</Option>
          </Select>
        </div> */}
      </div>
    );
  }
}
