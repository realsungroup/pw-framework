import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import moment from 'moment';
import {
  Tabs,
  Button,
  Modal
} from 'antd';
import http from 'Util20/api';
import './VisitorPunch.less';
/**
 * 访客就餐人数统计
 */
class VisitorPunch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVis: false,
      cms: ``
    }
  }
  showModal = (record) => {
    let cms = `C3_738251884742 = '${record.C3_738254205815}'`;
    this.setState({ modalVis: true, cms });
  }
  componentDidMount() {

  }
  render() {
    return (
      <div className="vizPunch">

        <Modal
          visible={this.state.modalVis}
          title={'详情'}
          width={'80vw'}
          footer={null}
          onCancel={() => { this.setState({ modalVis: false, cms: `` }); }}
          destroyOnClose
        >

          <div className="vizPunch_modal">
            <TableData
              resid={this.props.resiDetail}
              baseURL={this.props.baseURL}
              cmswhere={this.state.cms}
              subtractH={180}
              defaultColumnWidth={112}
              downloadBaseURL={this.props.downloadBaseURL}
              hasAdd={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={false}
              hasAdvSearch={true}
              hasRowView={true}
              importConfig={null}
            />
          </div>
        </Modal>
        <Tabs>
          <Tabs.TabPane tab="访客就餐卡刷卡次数统计" key="1">
            <div className="vizPunch_main">
              <TableData
                resid={this.props.resid}
                subtractH={200}
                defaultColumnWidth={112}
                hasAdd={false}
                baseURL={this.props.baseURL}
                downloadBaseURL={this.props.downloadBaseURL}
                hasRowView={true}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasAdvSearch={true}
                importConfig={null}
                customRowBtns={[
                  record => {
                    return (
                      <Button
                        onClick={() => {
                          this.showModal(record)
                        }}
                      >刷卡详情</Button>
                    )
                  }
                ]}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="访客就餐卡刷卡详情" key="2">
            <div className="vizPunch_main">
              <TableData
                resid={this.props.resiDetail}
                subtractH={180}
                defaultColumnWidth={104}
                hasAdd={false}
                baseURL={this.props.baseURL}
                downloadBaseURL={this.props.downloadBaseURL}
                hasRowView={true}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasAdvSearch={true}
                importConfig={null}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
export default VisitorPunch