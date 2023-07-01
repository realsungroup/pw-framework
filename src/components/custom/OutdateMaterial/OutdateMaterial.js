import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import moment from 'moment';
import {
  Tabs,
  Button,
  Modal
} from 'antd';
import http from 'Util20/api';
import './OutdateMaterial.less';
/**
 * 物资逾期未归统计
 */
class OutdateMaterial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVis: false,
      modalVis2: false,
      cms: ``,
      cms2: ``
    }
  }
  showModal = (record) => {
    let cms = `C3_738081610040 = '${record.C3_733667272073}'`;
    this.setState({ cms, modalVis: true })
  }
  showModal2 = (record) => {
    let cms2 = `C3_561660071657 = '${record.C3_561663372838}'`
    this.setState({ cms2, modalVis2: true })

  }
  componentDidMount() {

  }
  render() {
    return (
      <div className="ODMeal">
        <Modal
          visible={this.state.modalVis}
          title={'详情'}
          width={'80vw'}
          footer={null}
          onCancel={() => { this.setState({ modalVis: false, cms: `` }); }}
          destroyOnClose
        >
          <div className="ODMeal_modal">
            <TableData
              resid={this.props.resiDetail}
              downloadBaseURL={this.props.downloadBaseURL}
              cmswhere={this.state.cms}
              baseURL={this.props.baseURL}
              subtractH={180}
              defaultColumnWidth={104}
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
                    >物品详情</Button>
                  )
                }
              ]}
            />
          </div>
        </Modal>
        <Modal
          visible={this.state.modalVis2}
          title={'物品详情'}
          width={'80vw'}
          footer={null}
          onCancel={() => { this.setState({ modalVis2: false, cms2: `` }); }}
          destroyOnClose
        >
          <div className="ODMeal_modal">
            <TableData
              resid={this.props.residItem}
              cmswhere={this.state.cms2}
              downloadBaseURL={this.props.downloadBaseURL}
              baseURL={this.props.baseURL}
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
        <div className="ODMeal_main">
          <TableData
            resid={this.props.resid}
            baseURL={this.props.baseURL}
            downloadBaseURL={this.props.downloadBaseURL}
            subtractH={180}
            hasAdd={false}
            hasRowView={false}
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
                  >物资详情</Button>
                )
              }
            ]}
          />
        </div>
      </div>
    );
  }
}
export default OutdateMaterial