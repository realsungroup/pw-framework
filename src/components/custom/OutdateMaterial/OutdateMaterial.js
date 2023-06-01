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
      cms: ``,
    }
  }
  showModal = (record) => {
    let cms = `C3_738081610040 = '${record.C3_733667272073}'`;
    this.setState({ cms, modalVis: true })
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
                  >查看详情</Button>
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