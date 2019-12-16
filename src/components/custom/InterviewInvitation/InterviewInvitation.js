import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, message,Modal, Spin,Input,DatePicker} from 'antd';
import http from 'Util20/api';
import './InterviewInvitation.less';
import moment from 'moment';

// 6295 4542 3118
/**
 * 面试邀请
 */
class InterviewInvitation extends React.Component {
  state = {
    loading: false,
    isAdd:false,
    visible:false,
    // 候选人姓名
    C3_629487955668:'',
    // 面试时间
    C3_629487983297:'',
    // 联系人
    C3_629488005816:'',
    // 联系电话
    C3_629488028156:'',
    // 候选人邮箱
    C3_629488075916:'',
    // 招聘负责人
    C3_629488277894:'',
    // 招聘负责人工号
    C3_629488291308:'',
    // 发送邮件通知
    C3_629488387048:''
  };
  refreState=()=>{
    this.setState({
      visible:false,
      C3_629487955668:'',
    // 面试时间
    C3_629487983297:'',
    // 联系人
    C3_629488005816:'',
    // 联系电话
    C3_629488028156:'',
    // 候选人邮箱
    C3_629488075916:'',
    // 招聘负责人
    C3_629488277894:'',
    // 招聘负责人工号
    C3_629488291308:'',
    // 发送邮件通知
    C3_629488387048:''
    })
  }

  subData = async() =>{
    var email = this.state.C3_629488075916;
		var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
		if(reg.test(email)){
     
		}else{
      message.error("邮箱格式不正确");
      return false;
		}
    this.setState({loading:true})
    let res;
    try{
      res = await http().addRecords({
        resid: 629488415416,
        data:[this.state]
      
      });
      this.setState({ visible: false,loading:false});
      message.success('添加成功');
      this.tableDataRef.handleRefresh();
      this.refreState();
    }catch(e){
      console.log(e);
      message.error(e);

    }
  }
  modiData=async()=>{
    var email = this.state.C3_629488075916;
		var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
		if(reg.test(email)){
     
		}else{
      message.error("邮箱格式不正确");
      return false;
		}
    this.setState({loading:true})
    let res;
    var obj=this.state;
    obj.REC_ID=this.state.toModi;
    try{
      res = await http().modifyRecords({
        resid: 629488415416,
        data:[obj]
      
      });
      this.setState({ visible: false,loading:false,toModi:''});
      message.success('修改成功');
      this.tableDataRef.handleRefresh();
      this.refreState();
    }catch(e){
      console.log(e);
      message.error(e);

    }
  }
  showAdd = async()=>{
    this.setState({ visible: true,isAdd:true ,timeV:null});

  }
  showModi = async(data)=>{
    this.setState({ visible: true,isAdd:false });
    var t = moment(data.C3_629487983297);
    this.setState({
      C3_629487955668:data.C3_629487955668,
      // 面试时间
      C3_629487983297:data.C3_629487983297,
      // 联系人
      C3_629488005816:data.C3_629488005816,
      // 联系电话
      C3_629488028156:data.C3_629488028156,
      // 候选人邮箱
      C3_629488075916:data.C3_629488075916,
      // 招聘负责人
      C3_629488277894:data.C3_629488277894,
      // 招聘负责人工号
      C3_629488291308:data.C3_629488291308,
      // 发送邮件通知
      C3_629488387048:data.C3_629488387048,
      timeV:t,
      toModi:data.REC_ID
    })
  }
  onChange = (value, dateString) => {
   console.log(value)
    this.setState({C3_629487983297:dateString,timeV:value});
  }
  sendMail = async(id)=>{
    this.setState({loading:true})
    let res;
    try{
      res = await http().modifyRecords({
        resid: 629488415416,
        data:[{
          REC_ID:id,
          C3_629488387048:'Y'
        }]
      
      });
      this.setState({ visible: false,loading:false});
      message.success('操作成功');
      this.tableDataRef.handleRefresh();

    }catch(e){
      console.log(e);
      message.error(e);

    }
  }
  
 onOk = (value) => {
    console.log('onOk: ', value);
  }
  render() {
    const { loading ,visible } = this.state;
    return (
      <Spin spinning={loading}>
        <Modal
          visible={visible}
          onOk={this.state.isAdd?() => this.subData():() => this.modiData()}
          onCancel={() => this.refreState()}
          title={'人员信息'}
        >
          <div>
          <span>候选人姓名：</span>
          <Input
                style={{ width: 200 }}
                value={this.state.C3_629487955668}
                onChange={(v)=>{this.setState({C3_629487955668:v.target.value})}}
              />
          <div className="clearfix"> </div>
          <span>面试时间：</span>
            <DatePicker showTime placeholder="请选择时间" value={this.state.timeV} onChange={this.onChange} onOk={this.onOk} />
          <div className="clearfix"> </div>
          <span>联系人：</span>
          <Input
                style={{ width: 200 }}
                value={this.state.C3_629488005816}
                onChange={(v)=>{this.setState({C3_629488005816:v.target.value})}}
              />
          <div className="clearfix"> </div>
          <span>联系电话：</span>
          <Input
                style={{ width: 200 }}
                type='number'
                value={this.state.C3_629488028156}
                onChange={(v)=>{this.setState({C3_629488028156:v.target.value})}}
              />
          <div className="clearfix"> </div>
          <span>候选人邮箱：</span>
          <Input
                style={{ width: 200 }}
                value={this.state.C3_629488075916}
                onChange={(v)=>{this.setState({C3_629488075916:v.target.value})}}
              />
          <div className="clearfix"> </div>
          {/* <span>招聘负责人：</span>
          <Input
                style={{ width: 200 }}
                value={this.state.C3_629488277894}
                onChange={(v)=>{this.setState({C3_629488277894:v.target.value})}}
              />
          <div className="clearfix"> </div>
          <span>招聘负责人工号：</span>
          <Input
                style={{ width: 200 }}
                type='number'
                value={this.state.C3_629488291308}
                onChange={(v)=>{this.setState({C3_629488291308:v.target.value})}}
              />
           */}


          </div>
          
        </Modal>
        <div style={{ height: '100vh' }}>
          <TableData
            resid={629488415416}
            hasDelete={true}
            hasAdd={false}
            hasModify={false}
            hasRowDelete= {true}
            hasRowModify={false}
            hasRowView={false}
            wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
            actionBarExtra={records => (
              <Button onClick={() => {this.showAdd()}}>添加</Button>

            )}
            customRowBtns={[
              record => {
                return (
                  <Button
                  style={{marginRight:'4px'}}
                    onClick={() => {
                      this.showModi(record);
                    }}
                  >
                    修改
                  </Button>)
              },
              record => {
                return (
                  record.C3_629488387048!='Y'?(
                  <Button
                    onClick={() => {
                      this.sendMail(record.REC_ID);
                    }}
                  >
                    发送邮件
                  </Button>):(<span style={{color:'red',marginLeft:'8px'}}>邮件已发送</span>)
                
                );
              }
            ]}
          />
        </div>
      </Spin>
    );
  }
}

export default InterviewInvitation;
