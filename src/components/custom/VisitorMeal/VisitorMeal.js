import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import moment from 'moment';
import {
  Tabs,
  Button,
  Modal
} from 'antd';
import http from 'Util20/api';
import './VisitorMeal.less';
/**
 * 访客就餐人数统计
 */
class VisitorMeal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVis: false,
      cms: ``,
      cms2: ``,
      cms3: ``,
      cmsRel: ``
    }
  }
  showModal = (record) => {
    let y = record.C3_738259898197.substring(0, 4);
    let m = record.C3_738259898197.substring(4, 7);
    let date = y + '-' + m + '-01'
    let st = moment(date).startOf('month').format('YYYY-MM-DD');
    let ed = moment(date).endOf('month').format('YYYY-MM-DD');
    let cms = `C3_605703980025 >= '${st}' and C3_605703980025 <= '${ed}'`;
    let cms2 = `C3_605719340594 >= '${st}' and C3_605719340594 <= '${ed}'`;
    let cms3 = `C3_606054613160 >= '${st}' and C3_606054613160 <= '${ed}'`;
    this.setState({ cms, cms2, cms3, modalVis: true });
  }
  showModal2 = (record) => {
    let recid = (record.C3_605718092628) || (record.C3_605993242597);
    this.setState({ modalVis2: true, cmsRel: `C3_606070699582 = '${recid}'` });

  }
  componentDidMount() {

  }
  render() {
    return (
      <div className="vizMeal">
        <Modal
          visible={this.state.modalVis2}
          title={'详情'}
          width={'80vw'}
          footer={null}
          onCancel={() => { this.setState({ modalVis2: false }); }}
          destroyOnClose
        >
          <div className="vizMeal_modal">
            <TableData
              resid={this.props.residRegistration}
              cmswhere={this.state.cmsRel}
              subtractH={180}
              hasAdd={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={false}
              hasAdvSearch={false}
              hasRowView={true}
              importConfig={null}
            />
          </div>
        </Modal>
        <Modal
          visible={this.state.modalVis}
          title={'详情'}
          width={'80vw'}
          footer={null}
          onCancel={() => { this.setState({ modalVis: false }); }}
          destroyOnClose
        >
          <Tabs>
            <Tabs.TabPane tab="非长期申请" key="1">
              <div className="vizMeal_modal">
                <TableData
                  resid={this.props.residSheetShort}
                  cmswhere={this.state.cms}
                  subtractH={180}
                  hasAdd={false}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasDelete={false}
                  hasModify={false}
                  hasRowModify={false}
                  hasAdvSearch={false}
                  hasRowView={true}
                  importConfig={null}
                  customRowBtns={[
                    record => {
                      return (
                        <Button
                          onClick={() => {
                            this.showModal2(record)
                          }}
                        >查看相关进厂人员</Button>
                      )
                    }
                  ]}
                />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="长期申请" key="2">
              <div className="vizMeal_modal">
                <TableData
                  resid={this.props.residSheetLong}
                  cmswhere={this.state.cms2}
                  subtractH={180}
                  hasAdd={false}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasDelete={false}
                  hasModify={false}
                  hasRowModify={false}
                  hasAdvSearch={false}
                  hasRowView={true}
                  importConfig={null}
                  customRowBtns={[
                    record => {
                      return (
                        <Button
                          onClick={() => {
                            this.showModal2(record)
                          }}
                        >查看相关进厂人员</Button>
                      )
                    }
                  ]}
                />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="保安登记信息" key="3">
              <div className="vizMeal_modal">
                <TableData
                  resid={this.props.residRegistration}
                  cmswhere={this.state.cms3}
                  subtractH={180}
                  hasAdd={false}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasDelete={false}
                  hasModify={false}
                  hasRowModify={false}
                  hasAdvSearch={false}
                  hasRowView={true}
                  importConfig={null}
                />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Modal>
        <div className="vizMeal_main">
          <TableData
            resid={this.props.resid}
            subtractH={180}
            hasAdd={false}
            hasRowView={true}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            hasRowModify={false}
            hasAdvSearch={false}
            importConfig={null}
            customRowBtns={[
              record => {
                return (
                  <Button
                    onClick={() => {
                      this.showModal(record)
                    }}
                  >访客详情</Button>
                )
              }
            ]}
          />
        </div>
      </div>
    );
  }
}
export default VisitorMeal