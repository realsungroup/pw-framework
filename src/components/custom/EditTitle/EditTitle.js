import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Modal, Button, Tabs, Select, Input, Radio } from 'antd';
import './EditTitle.less';
import EditButton from './EditButton';
import AddTitle from './AddTitle';

export default class EditTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVisible: false,
      currentRecord: ''
    };
  }

  render() {
    return (
      <div>
        <TableData
        refTargetComponentName="TableData"
        wrappedComponentRef={element => (this.tableDataRef = element)}
          resid={607599734723}
          hasAdd={false}
          hasDelete={false}
          hasModify={false}
          hasRowModify={false}
          hasRowView={false}
          hasRowDelete={false}
          actionBarExtra={({
            dataSource: dataSource,
            selectedRowKeys: selectedRowKeys
          }) => {
            return (
              <div className="buttons">
                {/* <Button>下载导入模板</Button> */}
                {/* <Button>上传题目</Button> */}
                {/* <Button>下载题目</Button> */}
                <AddTitle refresh={() => {
      this.tableDataRef.handleRefresh()}}/>
              </div>
            );
          }}
          customRowBtns={[
            (record, btnSize) => {
              // console.log('xiugai', record);
              return <EditButton currentRecord={record} refresh={() => {
      this.tableDataRef.handleRefresh();
                
              }
              } />;
            }
          ]}
        />
      </div>
    );
  }
}
