import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, message, Modal ,Icon,Table,Spin,Tabs} from 'antd';
import './EnterpriseInfo.less';
import http from '../../../util20/api';
const TabPane = Tabs.TabPane;

class EnterpriseInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  
  state={
  }
  
  render() {
    return (
      <div
        className="enterpriseInfo"
      >
       <Tabs defaultActiveKey="1" className="tabs_container">
          <TabPane tab="企业基本信息" key="1">
            <div className='form'>

            </div>
          </TabPane>
          <TabPane tab="职位" key="2">
          <div className='outer'>
              <TableData
                resid={695212874956}
                subtractH={190}
                hasAdd={true}
                hasModify={false}
                hasDelete={false}
                hasRowEdit={false}
                hasRowModify={true}
                hasRowView={true}
                hasRowDelete={true}
                actionBarWidth={100}
              />
            </div>
          </TabPane>
          <TabPane tab="招聘简章" key="3">
            <div className='outer'>
              <TableData
                resid={695211797012}
                subtractH={190}
                hasAdd={true}
                hasModify={false}
                hasDelete={false}
                hasRowEdit={false}
                hasRowModify={true}
                hasRowView={true}
                hasRowDelete={true}
                actionBarWidth={100}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default EnterpriseInfo;
