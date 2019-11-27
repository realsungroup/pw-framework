import React from 'react';
import './LaborCorSelect.less';
import TableData from '../../../common/data/TableData';
import { Button, Select, message, Modal } from 'antd';
import http from '../../../../util20/api';

const { Option } = Select;
// const { RangePicker } = DatePicker;
class LaborCorSelect extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.dlEmployBaseURL;
    this.dlEmployDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.dlEmployDownloadURL;
  }
  state = {
    personList: [], //需要分配的记录
    selectedPersonList: [], //已选择的记录
    showModal: false,
    laborCors: [], // 劳务公司
    selectLaborCorsId: '', //选中的劳务公司编号
    selectLaborCorsName: '' ,//选中的劳务公司名称
    loading:false
  };
  componentDidMount() {
    this.getLaborCors();
  }

  getLaborCors = async () => {
    let res;
    try {
      res = await http({
        baseURL: 'http://kingofdinner.realsun.me:1201/'
      }).getTable({
        resid: '617194995537'
      });
      this.setState({
        laborCors: res.data
      });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  handleOk = async () => {
    this.setState({
      loading:true
    })
    let res;
    try {
      let data = this.state.selectedPersonList.map(item => {
        return {
          REC_ID: item.REC_ID,
          serviceCorpId: this.state.selectLaborCorsId,
          serviceCorp: this.state.selectLaborCorsName
        };
      });
      console.log('data', data);
      res = await http({
        baseURL: 'http://kingofdinner.realsun.me:1201/'
      }).modifyRecords({
        resid: 620816140260,
        data
      });
      this.setState({
        showModal: false
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
    this.setState({
      loading:false
    })
    this.tableDataRef.handleRefresh();
  };

  handleCancel = e => {
    this.setState({
      showModal: false
    });
  };

  changeLaborCor = (v, serviceCorpName) => {
    console.log('v', v);
    console.log('serviceCorpName', serviceCorpName.props.children);
    this.setState({
      selectLaborCorsId: v,
      selectLaborCorsName: serviceCorpName.props.children
    });
  };

  render() {
    return (
      <div style={{width:'100'+'%',height:'100'+'%'}}>
        <TableData
          baseURL={this.baseURL}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          resid={620816140260}
          subtractH={240}
          hasBeBtns={false}
          hasRowSelection={true}
          hasAdd={true}
          hasRowView={false}
          hasModify={false}
          hasRowDelete={true}
          hasDelete={false}
          hasRowModify={true}
          downloadBaseURL={this.dlEmployDownloadURL}
          height="100%"
          actionBarExtra={records => (
            <Button
              onClick={() => {
                if (!records.selectedRowKeys.length) {
                  return message.error('请选择一条记录');
                }
                let selectedPersonList = records.selectedRowKeys.map(item => {
                  return records.dataSource.find(dataSource => {
                    return dataSource.interviewId === item.toString();
                  });
                });
                console.log(selectedPersonList);
                this.setState({
                  showModal: true,
                  selectedPersonList
                });
              }}
            >
              分配劳务公司
            </Button>
          )}
        ></TableData>
        <Modal
          title="分配劳务公司"
          visible={this.state.showModal}
          onOk={this.handleOk}
          okButtonProps = {{loading:this.state.loading}}
          onCancel={this.handleCancel}
        >
          <label style={{ marginRight: 10 }}>请选择劳务公司</label>
          <Select
            placeholder="请选择劳务公司"
            style={{ width: 120 }}
            onChange={this.changeLaborCor}
          >
            {this.state.laborCors.map(item => (
              <Option key={item.serviceCorpId} value={item.serviceCorpId}>
                {item.service}
              </Option>
            ))}
          </Select>
        </Modal>
      </div>
    );
  }
}

export default LaborCorSelect;
