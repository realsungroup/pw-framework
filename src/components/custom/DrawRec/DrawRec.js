import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import {
  Modal,
  Button,
  message,
  Input,
  Row,
  Col,
  Radio,
  Checkbox,
  DatePicker,
  Select,
  Spin, Tabs
} from 'antd';
import http from 'Util20/api';
import './DrawRec.less';
import moment from 'moment';
const { Option } = Select;

/**
 * 我的就餐账户
 */
export default class DrawRec extends Component {
  constructor(props) {
    super(props);
    this.baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadBaseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  state = {
    loading: false,
    visible: false,
    curMember: {},
    month: '',
    cms: null
  };
  componentDidMount() {
  }
  viewDepDetail = (record) => {
    this.setState({ curMember: record, visible: true })
  }
  render() {
    const { curMember, visible, month, cms } = this.state
    return (
      <div className='drawRec'>
        <div>
          <span>考勤月份：</span>
          <Input
            type={'text'}
            onChange={(v) => {
              this.setState({
                month: v.target.value
              });
            }}
            onPressEnter={() => { this.setState({ cms: month ? `month = '${month}'` : null }) }}
            value={month}
            style={{ width: '160px' }}
            placeholder={'YYYYMM'}
          />
          <Button type='primary' onClick={() => { this.setState({ cms: month ? `month = '${month}'` : null }) }}>确认</Button>
        </div>
        <div>
          <TableData
            resid={this.props.depTableId}
            cmswhere={cms ? cms : null}
            baseURL={this.baseURL}
            downloadBaseURL={this.downloadBaseURL}
            hasRowView={true}
            hasAdd={false}
            wrappedComponentRef={element => (this.tableDataRef = element)}
            hasRowDelete={false}
            hasRowModify={false}
            hasModify={false}
            hasDelete={false}
            hasImport={true}
            subtractH={175}
            hasBeBtns={true}
            hasRowSelection={true}
            customRowBtns={[
              record => {
                return (
                  <>
                    <Button
                      onClick={() => {
                        this.viewDepDetail(record);
                      }}
                    >
                      查看详情
                      </Button>
                  </>
                );
              }
            ]}
          />
        </div>
        <Modal
          visible={visible}
          width={'80vw'}
          title={'详情'}
          onCancel={() => {
            this.setState({
              visible: false,
              curMember: {}
            });
          }}
          footer={null}
        >
          <div className={'drawRec_modal'} style={{ height: '70vh' }}>
            <TableData
              resid={this.props.drawId}
              cmswhere={this.props.noRelaMem ? `creMonth = '${curMember.month}'` : (this.props.MOC_No ? `MOC_No = '${curMember.mId}' and ${this.props.monthName} = '${curMember.month}' ` : `numberId = '${curMember.numberId}' and ${this.props.monthName} = '${curMember.month}' `)}
              baseURL={this.baseURL}
              downloadBaseURL={this.downloadBaseURL}
              hasRowView={true}
              hasAdd={false}
              wrappedComponentRef={element => (this.tableDataRef2 = element)}
              hasRowDelete={false}
              hasRowModify={false}
              hasModify={false}
              hasDelete={false}
              hasBeBtns={true}
              hasImport={true}
              subtractH={175}
              hasRowSelection={true}
            />
          </div>
        </Modal>
      </div>

    );
  }
}
