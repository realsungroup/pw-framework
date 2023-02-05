import React, { Component, Fragment } from 'react';
import './PunishmentHistory.less';
import qs from 'qs';
import http from 'Util20/api';
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
  Spin
} from 'antd';
import dealControlArr from 'Util20/controls';
import FormData from 'Common/data/FormData';
import { getDataProp } from 'Util20/formData2ControlsData';

class PunishmentHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cms: `isnull(C3_727368213460,'') = ''`,
      cmshistory: [`isnull(C3_727368213460,'') = ''`],
      cmsBread: [],
      visible: false,
      selectedRecord: null
    };
    this._formData = null
  }
  handleReset = () => {
    this.setState({ cms: `isnull(C3_727368213460,'') = ''`, cmshistory: [`isnull(C3_727368213460,'') = ''`], cmsBread: [] });
  }
  handleSelect = (record) => {
    if (record.C3_727368242635 || record.C3_727368272169 || record.C3_727368404398) {
      let arr = this.state.cmshistory;
      arr.push(`C3_590516721796 = '${record.C3_727368242635}' or C3_590516721796 = '${record.C3_727368272169}' or C3_590516721796 = '${record.C3_727368404398}'`);
      let arrBread = this.state.cmsBread;
      arrBread.push(record.C3_590510737521 + ' ' + record.C3_590510740042 + ' ' + record.C3_590512169985);
      this.setState({ cmshistory: arr, cmsBread: arrBread, cms: `C3_590516721796 = '${record.C3_727368242635}' or C3_590516721796 = '${record.C3_727368272169}' or C3_590516721796 = '${record.C3_727368404398}'` });
    } else {
      message.error('没有关联记录')
    }
  }
  getFormData = async (record) => {
    let res;
    try {
      this.setState({ loading: true });
      res = await http().getFormData({
        resid: 590863325025,
        formName: 'default4'
      });
      console.log('res', res)
      this._formData = dealControlArr(res.data.columns);
      this.setState({ selectedRecord: record }, () => {
        this._dataProp = getDataProp(
          this._formData,
          this.state.selectedRecord,
          true,
          false,
          false
        );

        this.setState({ visible: true });
      });
    } catch (err) {
      console.log(err);
      return message.error(err.message);
    }
  };

  openModal = record => {
    if (this._formData) {
      this.setState({ selectedRecord: record }, () => {
        this._dataProp = getDataProp(
          this._formData,
          this.state.selectedRecord,
          true,
          false,
          false
        );

        this.setState({ visible: true });
      });
    } else {
      this.getFormData(record);
    }

  };
  handlePrev = () => {
    let arr = [];
    let arr2 = [];
    for (let i = 0; i < this.state.cmsBread.length - 1; i++) {
      arr.push(this.state.cmsBread[i]);
    }
    for (let i = 0; i < this.state.cmshistory.length - 1; i++) {
      arr2.push(this.state.cmshistory[i]);
    }

    this.setState({ cmshistory: arr2, cmsBread: arr, cms: arr2[arr2.length - 1] });
  }
  async componentDidMount() {
    const querystring = window.location.search.substring(1);
    const qsObj = qs.parse(querystring);
  }
  render() {
    const { visible, selectedRecord } = this.state;
    return (
      <div className="punishmentHistory">
        <div className='main'>
          <Modal
            visible={visible}
            title="详情"
            width={800}
            footer={null}
            onCancel={() => {
              this.setState({ visible: false });
            }}
            destroyOnClose
          >
            <FormData
              info={{ dataMode: 'main', resid: 590863325025 }}
              operation="view"
              data={this._dataProp}
              record={selectedRecord}
              onCancel={() => {
                this.setState({ visible: false });
              }}
            />
          </Modal>
          <TableData
            resid={590863325025}
            hasRowView={false}
            cmswhere={this.state.cms}
            hasAdd={false}
            refTargetComponentName="TableData"
            wrappedComponentRef={element => (this.tableDataRef = element)}
            hasRowDelete={false}
            hasRowModify={false}
            hasModify={false}
            hasDelete={false}
            hasRowView={false}
            subtractH={200}
            actionBarExtra={() => {
              return (
                <>
                  <Button
                    onClick={
                      () => {
                        this.handleReset()
                      }
                    }
                  >
                    重置
                </Button>
                  <Button
                    onClick={
                      () => {
                        this.handlePrev()
                      }
                    }
                  >
                    返回上一级
                </Button>
                  <span style={{ marginLeft: 8 }}>
                    {
                      this.state.cmsBread.map(
                        (item, key) => {
                          return (
                            <span style={key === this.state.cmsBread.length - 1 ? { color: '#333' } : { color: '#999' }}>{item}{key === this.state.cmsBread.length - 1 ? '' : '>'}</span>
                          )
                        }
                      )
                    }
                  </span>
                </>
              )
            }}
            customRowBtns={[
              record => {
                return (
                  <>
                    <Button onClick={() => {
                      this.openModal(record)
                    }}>
                      查看详情
                    </Button>
                    <Button
                      style={record.C3_727368242635 || record.C3_727368272169 || record.C3_727368404398 ? {} : { display: 'none' }}
                      onClick={() => {
                        this.handleSelect(record);
                      }}
                    >
                      查看关联
                  </Button>
                  </>
                );
              }
            ]}
          />
        </div>
      </div>
    );
  }
}

export default PunishmentHistory;