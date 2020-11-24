import React from 'react';
import { Tabs, Button, Popconfirm, Modal, Input, message } from 'antd';
import TableData from '../../common/data/TableData';
import http from 'Util20/api';

import './ContractApproval.less';

const { TabPane } = Tabs;
const { TextArea } = Input;
const tabsStyle = { width: '100%', height: '100%', backgroundColor: '#fff' };
const tabPaneStyle = { width: '100%', height: 'calc(100vh - 64px)' };
const waitingResid = '640785369308'; //待处理
const passedResid = '640796960036'; //已通过
const refusedResid = '460263988039'; //已拒绝

/**
 * 合同审批
 *
 */
class ContractApproval extends React.Component {
  state = {
    refuseVisible: false,
    refuseReson: '',
    refuseConfirmLoading: false,
    selectedRecord: {},
    loading:false
  };
  waitingCustomRowBtns = [
    (record, btnSize) => {
      return (
        <Popconfirm
          title="确认同意吗？"
          onConfirm={() => {
            this.approval({
              ...record,
              C3_640779681600: 'Y'
            });
          }}
        >
          <Button
            className="table-data__action-btn"
            type="primary"
            size={btnSize}
          >
            同意
          </Button>
        </Popconfirm>
      );
    },
    (record, btnSize) => {
      return (
        <Button
          size={btnSize}
          onClick={() => {
            this.setState({
              selectedRecord: record,
              refuseVisible: true
            });
          }}
          type="danger"
          className="table-data__action-btn"
        >
          拒绝
        </Button>
      );
    }
  ];

  approval = async record => {
    try {
      await http().modifyRecords({
        resid: waitingResid,
        data: [record]
      });
      this.setState({
        refuseConfirmLoading: false,
        selectedRecord: {},
        refuseVisible: false,
        refuseReson: ''
      });
      this.tableDataRef.handleRefresh();
    } catch (error) {
      message.error(error.message);
      console.error(error);
      this.setState({ refuseConfirmLoading: false });
    }
  };
  multiApproval = async (dataSource, selectedRowKeys,val) =>{
    // console.log(dataSource, selectedRowKeys,val)
    if (selectedRowKeys.length) {
    this.setState({loading:true});

      let selectedRecords = selectedRowKeys.map(
        key => {
          return {
            ...dataSource.find(item => {
              return item.REC_ID === key;
            })
          };
        }
      );
      let n=0;
      while(n<selectedRecords.length){
        if(val){
        selectedRecords[n].C3_640779681600='Y'
        }else{
        selectedRecords[n].C3_640785923825='Y'
        }
        n++;
      }
      try{
        let res = http().modifyRecords({
          resid:waitingResid,
          data:selectedRecords
        });
        var _this=this;
        message.success('操作成功');
        var t =setTimeout(function(){
          _this.tableDataRef.handleRefresh();
          _this.setState({loading:false});
        },2000)
       
        
      }catch(e){
        console.log(e.message);
        this.setState({loading:false});
      }
      console.log(selectedRecords);
    this.setState({loading:false});

    } else {
      message.info('请勾选记录！');

    }
  
  }

  render() {
    const {
      refuseVisible,
      refuseReson,
      refuseConfirmLoading,
      selectedRecord
    } = this.state;
    return (
      <div className="contract-approval">
        <Tabs defaultActiveKey="1" style={tabsStyle}>
          <TabPane tab="待处理" key="1" style={tabPaneStyle}>
            <div className="tabledata-container">
              <TableData
                resid={waitingResid}
                subtractH={180}
                // tableComponent="ag-grid"
                // sideBarAg={true}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                hasAdvSearch={true}
                hasAdd={false}
                hasRowView={true}
                hasRowDelete={false}
                hasRowEdit={false}
                hasRowModify={false}
                hasDelete={false}
                hasModify={false}
                hasBeBtns={false}
                hasRowSelection={true}
              recordFormUseAbsolute={true}

                customRowBtns={this.waitingCustomRowBtns}
                actionBarExtra={({ dataSource, selectedRowKeys }) => {
                  return (
                    <>
                      
                          <Button type='primary' loading={this.state.loading} onClick={()=>this.multiApproval(dataSource,selectedRowKeys,true)}>批量同意</Button>
                          <Button type='danger' loading={this.state.loading} onClick={()=>this.multiApproval(dataSource,selectedRowKeys,false)}>批量拒绝</Button>
                    
                    </>
                  );
                }}
              />
            </div>
          </TabPane>
          <TabPane tab="已通过" key="2" style={tabPaneStyle}>
            <div className="tabledata-container">
              <TableData
                resid={passedResid}
                subtractH={180}
                // tableComponent="ag-grid"
                // sideBarAg={true}
                hasAdvSearch={true}
                hasAdd={false}
                hasRowView={true}
                hasRowDelete={false}
                hasRowEdit={false}
              recordFormUseAbsolute={true}

                hasRowModify={false}
                hasDelete={false}
                hasModify={false}
                hasBeBtns={false}
                hasRowSelection={false}
                isUseFormDefine={false}
              />
            </div>
          </TabPane>
          <TabPane tab="已拒绝" key="3" style={tabPaneStyle}>
            <div className="tabledata-container">
              <TableData
                resid={refusedResid}
                subtractH={180}
                // tableComponent="ag-grid"
                // sideBarAg={true}
                hasAdvSearch={true}
                hasAdd={false}
                hasRowView={true}
              recordFormUseAbsolute={true}

                hasRowDelete={false}
                hasRowEdit={false}
                hasRowModify={false}
                hasDelete={false}
                hasModify={false}
                hasBeBtns={false}
                hasRowSelection={false}
              />
            </div>
          </TabPane>
        </Tabs>
        <Modal
          visible={refuseVisible}
          title="请输入拒绝理由"
          onOk={() => {
            if (!refuseReson) {
              return message.info('请填写拒绝理由');
            }
            this.setState({ refuseConfirmLoading: true });
            this.approval({
              ...selectedRecord,
              C3_640785923825: 'Y',
              C3_640264966061: refuseReson
            });
          }}
          confirmLoading={refuseConfirmLoading}
          onCancel={() =>
            this.setState({ refuseVisible: false, refuseReson: '' })
          }
        >
          <TextArea
            value={refuseReson}
            rows={4}
            onChange={e => {
              this.setState({ refuseReson: e.target.value });
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default ContractApproval;
