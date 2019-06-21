import React from 'react';
import './PersonInfo.less';
import TableData from '../../common/data/TableData';
import { Tabs, Select, Menu ,Radio} from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;
const { SubMenu } = Menu;

class PersonInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '工作申请表'
    };
  }
  handleClick = value => {
    console.log(value);
    this.setState({
      activeKey: value
    });
  };
  renderContent = () => {
    const { activeKey } = this.state;
    switch (activeKey) {
      case '工作申请表':
        return (
          <div style={{width:1000}}>
            <div
              id="个人资料"
              style={{
                height: 300,
                border: '1px solid #000000',
                marginBottom: 10
              }}
            >
              个人资料
            </div>
            <div
              id="教育背景"
              style={{
                height: 400,
                border: '1px solid #000000',
                marginBottom: 10
              }}
            >
              教育背景
            </div>
            <div
              id="工作经历"
              style={{
                height: 500,
                border: '1px solid #000000',
                marginBottom: 10
              }}
            >
              工作经历
            </div>
            <div
              id="家庭成员"
              style={{
                height: 500,
                border: '1px solid #000000',
                marginBottom: 10
              }}
            >
              家庭成员
            </div>
          </div>
        );
      case '面试评估表':
        return <div>2222222</div>;
      case '背景调查表':
        return <div>333333</div>;
    }
  };
  render() {
    return (
      <div>
        <div>
          {/* <Menu
            mode="horizontal"
            onClick={this.handleClick}
            selectedKeys={[this.state.activeKey]}
          >
            <SubMenu title="工作申请表" style={{witth:'33%'}} key='工作申请表'>
              <Menu.Item >
                <a href="#个人资料" >个人资料</a>
              </Menu.Item>
              <Menu.Item key="工作申请表"><a href="#教育背景" >教育背景</a></Menu.Item>
              <Menu.Item key="工作申请表"><a href="#工作经历" >工作经历</a></Menu.Item>
              <Menu.Item key="工作申请表"><a href="#家庭成员" >家庭成员</a></Menu.Item>
            </SubMenu>
            <Menu.Item key="面试评估表" style={{witth:'33%'}}>面试评估表</Menu.Item>
            <Menu.Item key="背景调查表" style={{witth:'33%'}}>背景调查表</Menu.Item>
          </Menu> */}
          <Radio.Group defaultValue="工作申请表" buttonStyle="solid" onChange={(e)=>{this.handleClick(e.target.value)}}>
            <Radio.Button value="工作申请表">工作申请表</Radio.Button>
            <Radio.Button value="面试评估表">面试评估表</Radio.Button>
            <Radio.Button value="背景调查表">背景调查表</Radio.Button>
          </Radio.Group>
        </div>
        <div>{this.renderContent()}</div>
      </div>
    );
  }
}

export default PersonInfo;
