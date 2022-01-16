import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, message,Popconfirm, Modal,Icon ,Spin,Tabs,Input,Select} from 'antd';
import './EmpMember.less';
import moment from 'moment';
import http from '../../../util20/api';
import TextArea from 'antd/lib/input/TextArea';
const TabPane = Tabs.TabPane;
const { Option } = Select;

class EmpMember extends React.Component {
  constructor(props) {
    super(props);
  }
  
  state={
  }
  componentDidMount=async()=>{
  }
  
  render() {
    return (
      <div
        className="empMember"
      >
           <Tabs defaultActiveKey="1" className="tabs_container">
         
         <TabPane tab="报表生成" key="1">
        </TabPane>
        <TabPane tab="历史报表" key="2">
        </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default EmpMember;
