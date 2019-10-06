import React from 'react';
import { Button, Modal, message, Spin, Skeleton } from 'antd';
import http from 'Util20/api';
import TableData from '../../../../common/data/TableData';
import FormData from '../../../../common/data/FormData';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';
import './personInfo.less';

// 622576278943
class PersonInfo extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[
        process.env.NODE_ENV
      ].customURLs.comprehensiveQueryBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
    this.state = {
      personalInfoVisible: false,
      personInfo: {},
      dataProp: [],
      loadingPersonInfo: false
    };
  }

  getPersonalInfo = async id => {
    try {
      this.setState({ loadingPersonInfo: true });
      const res = await http().getTable({
        resid: '622576278943',
        dblinkname: 'ehr',
        cmswhere: `C3_464172117706 = ${id}`
      });
      this.setState({
        personInfo: res.data[0]
      });
      this.getFormData(res.data[0]);
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      this.setState({ loadingPersonInfo: false });
    }
  };

  getFormData = async record => {
    let res;
    try {
      res = await http().getFormData({
        resid: '622576278943',
        formName: '个人详细信息',
        dblinkname: 'ehr'
      });
      const formData = dealControlArr(res.data.columns);
      const dataProp = getDataProp(formData, record, true, false, false);
      this.setState({ dataProp });
    } catch (err) {
      console.log(err);
      return message.error(err.message);
    }
  };
  render() {
    const { person } = this.props;
    const {
      personalInfoVisible,
      personInfo,
      dataProp,
      loadingPersonInfo
    } = this.state;
    let id;
    if (person) {
      id = person.C3_305737857578;
    }
    return (
      <div className="personInfoQuery">
        <div style={{ height: '100%' }}>
          <Skeleton loading={!id}>
            <TableData
              key="1"
              resid="446576761435"
              subtractH={200}
              hasAdvSearch={false}
              hasAdd={false}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasBeBtns={true}
              hasRowModify={false}
              hasRowSelection={false}
              actionBarWidth={400}
              cparm1={id}
              formProps={{ width: 1000 }}
              baseURL={this.baseURL}
              downloadBaseURL={this.attendanceDownloadURL}
              recordFormUseAbsolute={true}
              customRowBtns={[
                record => {
                  return (
                    <Button
                      onClick={async () => {
                        this.setState({
                          personalInfoVisible: true
                        });
                        await this.getPersonalInfo(record.C3_305737857578);
                      }}
                    >
                      个人信息详情
                    </Button>
                  );
                }
              ]}
              subTableArrProps={[
                {
                  subTableName: '合同记录', // 必选（若不选则标签页标题为子表的 resid）
                  subResid: 446580376907, // 必选
                  tableProps: {
                    hasAdvSearch: false,
                    hasDelete: false,
                    hasRowDelete: false,
                    hasRowModify: false,
                    hasRowView: true,
                    hasBeBtns: false,
                    baseURL: this.baseURL
                  }
                }
              ]}
            />
          </Skeleton>
        </div>
        <Modal
          title="个人信息详情"
          visible={personalInfoVisible}
          onOk={() => this.setState({ personalInfoVisible: false })}
          onCancel={() => this.setState({ personalInfoVisible: false })}
          destroyOnClose
          width="70%"
        >
          <div>
            <Spin spinning={loadingPersonInfo}>
              <FormData
                info={{ dataMode: 'main', resid: '622576278943' }}
                operation="view"
                data={dataProp}
                record={personInfo}
                useAbsolute={true}
              />
            </Spin>
          </div>
        </Modal>
      </div>
    );
  }
}
export default PersonInfo;
