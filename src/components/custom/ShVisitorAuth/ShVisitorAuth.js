import React from 'react';
import './ShVisitorAuth.less';
import TableData from '../../common/data/TableData';
import {
  Modal,
  Button,
  DatePicker,
  Select,
  message
} from 'antd';
import moment from 'moment'
import http from 'Util20/api';

export default class ShVisitorAuth extends React.Component {
  state = {
    visible: false,
    visible2: false,
    laoding: false
  };
  constructor(props) {
    super(props);
    this.baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.AchievementsBaseURL;
    this.ShgBaseURL = window.pwConfig[process.env.NODE_ENV].customURLs.ShgBaseURL;

  }

  componentDidMount() {
  }
  selectMem = (record) => {
    this.setState({
      C3_730206436368: record.C3_227192484125,
      C3_730206427243: record.C3_227192472953,
      C3_730294703047: record.C3_384367557332,
      visible2: false
    })
  }
  selectMem2 = (record) => {
    this.setState({
      C3_730206436368: record.C3_227192484125,
      C3_730206427243: record.C3_227192472953,
      C3_730294703047: record.C3_384367557332,
      visible3: false
    })
  }
  handleSubmit = async () => {
    let res;
    this.setState({ loading: true });
    try {
      res = await http({ baseURL: this.baseURL }).addRecords({
        resid: 730207554421,
        data: [this.state]
      })
      this.setState({
        visible: false,
        visible2: false,
        visible3: false,
        C3_730294703047: '',
        C3_730206427243: '',
        C3_730206436368: '',
        C3_730206491497: '',
        C3_730206500857: '',
        C3_730206516187: '',
        laoding: false
      })
      this.tableDataRef.handleRefresh();

    } catch (e) {
      console.log(e.message);
      message.error(e.message);
    }
  }
  render() {

    return (
      <div className="shVisitorAuth">
        <Modal
          visible={this.state.visible}
          title="添加"
          width={800}
          footer={null}
          onCancel={() => {
            this.setState({
              visible: false,
              visible2: false,
              visible3: false,
              C3_730294703047: '',
              C3_730206427243: '',
              C3_730206436368: '',
              C3_730206491497: '',
              C3_730206500857: '',
              C3_730206516187: ''
            })
          }}
          destroyOnClose
        >
          <div className='shVisitorAuth_modal'>
            <div>
              <span>开始时间：</span>
              <DatePicker value={this.state.C3_730206491497} showToday onChange={(v) => { this.setState({ C3_730206491497: v }) }} />
            </div>
            <div>
              <span>结束时间：</span>
              <DatePicker value={this.state.C3_730206500857} showToday onChange={(v) => { this.setState({ C3_730206500857: v }) }} />
            </div>
            <div>
              <span>选择人员：{this.state.C3_730206436368}</span>
              {
                this.ShgBaseURL ?
                  <Button type={'primary'} style={{ margin: '0 8px' }} onClick={() => { this.setState({ visible3: true }) }}>点击选择</Button>
                  :
                  <Button type={'primary'} style={{ margin: '0 8px' }} onClick={() => { this.setState({ visible2: true }) }}>点击选择</Button>
              }
            </div>
            <div>
              <span>是否生效：</span>
              <Select
                style={{ width: 120 }}
                size="small"
                onChange={v => {
                  this.setState({ C3_730206516187: v });
                }}
                value={this.state.C3_730206516187}
              >
                <Select.Option value=""></Select.Option>
                <Select.Option value="Y">Y</Select.Option>
              </Select>
            </div>
            <div><Button type={'primary'} loading={this.state.loading} onClick={() => { this.handleSubmit(); }}>提交</Button></div>
          </div>
        </Modal>
        <Modal
          visible={this.state.visible2}
          title="选择人员"
          width={'80vw'}
          footer={null}
          onCancel={() => { this.setState({ visible2: false }) }}
          destroyOnClose
        >
          <div className='shVisitorAuth_modal_table'>
            <TableData
              baseURL={this.baseURL}
              resid={730305434592}
              subtractH={240}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasDownload={false}
              hasAdd={false}
              hasBeBtns={true}
              hasRowModify={false}
              hasRowSelection={false}
              customRowBtns={[
                (record, btnSize) => {
                  return (
                    <Button
                      type="primary"
                      size={btnSize}
                      onClick={() => this.selectMem(record)}
                    >
                      选择
                    </Button>
                  );
                }
              ]}
            />
          </div>
        </Modal>
        <Modal
          visible={this.state.visible3}
          title="选择人员"
          width={'80vw'}
          footer={null}
          onCancel={() => { this.setState({ visible3: false }) }}
          destroyOnClose
        >
          <div className='shVisitorAuth_modal_table'>
            <TableData
              baseURL={this.ShgBaseURL}
              resid={730307412823}
              subtractH={240}
              hasRowView={false}
              hasRowDelete={false}
              hasDownload={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasAdd={false}
              hasBeBtns={true}
              hasRowModify={false}
              hasRowSelection={false}
              customRowBtns={[
                (record, btnSize) => {
                  return (
                    <Button
                      type="primary"
                      size={btnSize}
                      onClick={() => this.selectMem2(record)}
                    >
                      选择
                    </Button>
                  );
                }
              ]}
            />
          </div>
        </Modal>
        <div className="shVisitorAuth_tabledata-wrapper">
          <TableData
            baseURL={this.baseURL}
            refTargetComponentName="TableData"
            wrappedComponentRef={element => (this.tableDataRef = element)}
            resid={730207554421}
            subtractH={220}
            hasDownload={false}
            hasAdvSearch={true}
            hasRowView={true}
            hasRowDelete={true}
            hasDelete={true}
            hasAdd={false}
            hasBeBtns={true}
            hasRowModify={true}
            hasModify={true}
            actionBarExtra={() => {
              return (
                <Button size={'small'} onClick={() => { this.setState({ visible: true }) }}>新建</Button>
              );
            }}
          />
        </div>

      </div>
    );
  }
}

