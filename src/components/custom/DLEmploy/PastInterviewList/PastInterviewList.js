import React from 'react';
import './PastInterviewList.less';
import TabsTableData from '../../TabsTableData';
import { Modal, Button, message, Tabs, Popconfirm, Input, Form } from 'antd';
import http from '../../../../util20/api';
class PastInterviewList extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.dlEmployBaseURL;
    this.dlEmployDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.dlEmployDownloadURL;
  }
  state = {
    SquareCardArr: [],
    val: null,
    showModal: false,
    EDate:'',
    BDate:'',
    dataSource:[],
    selectRowKeys:[]

  };
  onHandleMessage = async (dataSource, selectedRowKeys) => {
    // console.log(dataSource,selectedRowKeys)
    if (selectedRowKeys.length) {
      const data = dataSource;
      const Reldata = [];
      data.map(item => {
        selectedRowKeys.map(items => {
          if (item.REC_ID === items) {
            console.log(item);
            item.sendPEMsg = 'Y';
            item.C3_629981689063 = this.state.EDate;
            item.C3_629981704421 = this.state.BDate;
            item.sendRPMsg = 'Y';
            Reldata.push(item);
          }
        });
      });
      let res;
      try {
        res = await http({
          baseURL: this.baseURL
        }).modifyRecords({
          resid: 618666297012,
          data: Reldata,
          isEditoRAdd: false
        });
        if (res.Error === 0) {
          this.tableDataRef.handleRefresh();
          message.success('操作成功！');
        } else {
          message.error(res.message);
        }
      } catch (error) {
        message.error(error);
      }
    } else {
      message.error('请勾选记录！');
    }
  };
  render() {
    return (
      <div>
        <TabsTableData
          arr={[
            {
              wrappedComponentRef: element => (this.tableDataRef = element),
              refTargetComponentName: 'TableData',
              baseURL: this.baseURL,
              downloadBaseURL: this.dlEmployDownloadURL,
              resid: 618666297012,
              TabsTitle: '未通知',
              OutHeight: '91vh',
              recordFormFormWidth: '90%',
              hasBeBtns: false,
              hasModify: false,
              hasDelete: false,
              hasAdd: false,
              hasRowDelete: true,
              hasRowSelection: true,
              hasRowModify: true,
              hasRowView: true,
              subtractH: 190,
              actionBarWidth: 220,
              recordFormType: 'drawer',
              formProps: {
                height: 650
              },
              columnsWidth: {
                面试时间: 180,
                姓名: 90,
                年龄: 90,
                申请职位: 115,
                申请时间: 130,
                考试结果: 115,
                面试结果: 115,
                签到: 90,
                劳务公司: 115,
                面试官: 115,
                面试官反馈: 130,
                体检结果: 115,
                发送报到通知: 160,
                预约已过期: 130,
                身份证号: 200,
                考试分数: 115
              },
              actionBarExtra: ({
                dataSource: dataSource,
                selectedRowKeys: selectedRowKeys
              }) => {
                return (
                  <div>
                    <Button
                      onClick={() => {
                        this.setState({
                          showModal: true,
                          dataSource:dataSource,
                          selectRowKeys:selectedRowKeys
                         });
                      }}
                      style = {{height: '24px',padding:'0 7px ',fontSize:'14px'}}
                    >
                      录用体检报到通知
                    </Button>
                  </div>
                );
              },
              recordFormContainerProps: {
                placement: 'right',
                height: 700
              }
            },
            {
              baseURL: this.baseURL,
              downloadBaseURL: this.dlEmployDownloadURL,
              resid: 618666595021,
              TabsTitle: '已通知',
              OutHeight: '91vh',
              recordFormFormWidth: '90%',
              hasBeBtns: true,
              hasModify: false,
              hasDelete: false,
              hasAdd: false,
              hasRowDelete: true,
              hasRowModify: true,
              hasRowView: true,
              subtractH: 195,
              actionBarWidth: 220,
              formProps: {
                height: 650
              },
              columnsWidth: {
                面试时间: 180,
                姓名: 90,
                年龄: 90,
                申请职位: 115,
                申请时间: 130,
                考试结果: 115,
                面试结果: 115,
                签到: 90,
                劳务公司: 115,
                面试官: 115,
                面试官反馈: 130,
                体检结果: 115,
                发送报到通知: 160,
                预约已过期: 130,
                身份证号: 200,
                考试分数: 115
              },
              recordFormType: 'drawer',
              recordFormContainerProps: {
                placement: 'right',
                height: 700
              }
            }
          ]}
        />
        <Modal
          title="设定体检日期"
          width={'50%'}
          destroyOnClose={true}
          visible={this.state.showModal}
          onOk={() => {
            this.onHandleMessage(this.state.dataSource, this.state.selectRowKeys)
            this.setState({showModal:false})
          }}
          onCancel={() => this.setState({ showModal: false })}
        >
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 15 }}>
            <Form.Item label="体检日期">
              <Input size="large" 
              placeholder = '请输入体检日期'
              onChange={e => {
                this.setState({
                  EDate: e.target.value
                });
              }}
              />
            </Form.Item>
            <Form.Item label="报道日期">
              <Input size="large"
              placeholder = '请输入报道日期'
              onChange={e => {
                this.setState({
                BDate: e.target.value
                });
              }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default PastInterviewList;
