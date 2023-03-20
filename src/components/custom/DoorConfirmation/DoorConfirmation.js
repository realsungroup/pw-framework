import React, { Component } from 'react';
import {
  Pagination,
  message,
  Tabs,
  Button,
  Table,
  Spin,
  Progress,
  Modal,
  DatePicker,
  Select,
  Input
} from 'antd';
import './DoorConfirmation.less';
import TableData from '../../common/data/TableData';
import http, { makeCancelable } from 'Util20/api';
import moment from 'moment';
import { indexOf } from 'lodash';
const { Option } = Select;
class DoorConfirmation extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
    this.state = {
      vis: false
    };
  }
  componentDidMount() {

  }
  show = (resid, cms) => {
    this.setState({
      resid,
      vis: true,
      cms: cms
    })
  }
  render() {
    const { activeKey } = this.state;
    return (
      <div className="DoorConfirmation">
        <Modal
          visible={this.state.vis}
          footer={null}
          width={'80vw'}
          destroyOnClose
          onCancel={() => {
            this.setState({ vis: false });
          }}
        >
          <div className='tableWrap'>
            <TableData
              baseURL={this.baseURL}
              downloadBaseURL={this.downloadURL}
              cmswhere={this.state.cms}
              resid={this.state.resid}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              subtractH={240}
              defaultPagination={
                {
                  pageSize: 100,
                  current: 1,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  pageSizeOptions: ['10', '20', '30', '40', '100', '500', '1000']
                }
              }
              hasAdd={false}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={true}
              hasModify={false}
              hasBeBtns={true}
              hasRowModify={false}
              hasRowSelection={false}
              hasAdvSearch={true}
            />
          </div>
        </Modal>
        <TableData
          baseURL={this.baseURL}
          downloadBaseURL={this.downloadURL}
          resid={'732196031004'}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          subtractH={240}
          defaultPagination={
            {
              pageSize: 100,
              current: 1,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '20', '30', '40', '100', '500', '1000']
            }
          }
          hasAdd={false}
          hasRowView={false}
          hasRowDelete={false}
          hasRowEdit={false}
          hasDelete={false}
          hasModify={false}
          hasBeBtns={true}
          hasRowModify={false}
          hasRowSelection={false}
          hasAdvSearch={true}
          customRowBtns={[
            record => {
              return (
                <>
                  <Button onClick={() => this.show('732201281939', `C3_731348693897 = '${record.C3_714501632089}'`)}>
                    门禁减少确认记录
                  </Button>
                  <Button onClick={() => this.show('732201573133', `C3_595166775274 = '${record.C3_714501632089}'`)}>
                    现有门禁
                  </Button>
                </>

              );
            }
          ]}
        />
      </div>
    );
  }
}

export default DoorConfirmation;
