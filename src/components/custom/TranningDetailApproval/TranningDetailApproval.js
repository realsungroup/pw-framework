import React from 'react';
import TableData from '../../common/data/TableData';
import { Divider, Form, Input, Button } from 'antd';
import './TranningDetailApproval.less';

const resid = '625854136036';
const { TextArea } = Input;
class TranningDetailApproval extends React.Component {
  render() {
    return (
      <div className="tranning-detail-approval">
        <div className="tranning-detail-approval_tabledata-wrapper">
          <TableData
            resid={resid}
            subtractH={220}
            tableComponent="ag-grid"
            sideBarAg={true}
            hasAdvSearch={true}
            hasAdd={false}
            hasRowView={false}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            hasBeBtns={false}
            hasRowModify={false}
            hasRowSelection={false}
          />
        </div>
        <sider className="tranning-detail-approval_sider">
          <div className="tranning-detail-approval_sider_item">
            <b>财年:</b>
            <span>FY2019</span>
          </div>
          <div className="tranning-detail-approval_sider_item">
            <b>发起人:</b>
            <span>丁雪梅</span>
          </div>
          <div className="tranning-detail-approval_sider_item">
            <b>发起时间:</b>
            <span>2019-9-1</span>
          </div>
          <div className="tranning-detail-approval_sider_item">
            <b>发起人附语:</b>
            <p>2019-9-1</p>
          </div>
          <Divider />
          <Form.Item label="附语">
            <TextArea placeholder="请输入附语" rows={6} />
          </Form.Item>
          <div>
            <Button type="primary" style={{ marginRight: 8 }}>
              同意
            </Button>
            <Button type="danger">拒绝</Button>
          </div>
        </sider>
      </div>
    );
  }
}

export default TranningDetailApproval;
