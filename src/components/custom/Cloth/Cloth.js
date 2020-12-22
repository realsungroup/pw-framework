import React, { Component } from 'react';
import { Radio, Button, Icon, Input, Spin, Modal, Empty,message } from 'antd';
import TableData from '../../common/data/TableData';
import http from 'Util20/api';
import moment from 'moment';
import './Cloth.less';
import debounce from 'lodash/debounce';

class Cloth extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:{
        C3_661863718947:'',//状态
        C3_661875860175:'',//编号
        C3_661944632055:'',//领取时间
        C3_661863607204:'',//尺寸
        C3_661863597766:'',//颜色
        C3_661863572451:'',//姓名
        C3_661863563966:'',//工号
        C3_661863637191:'',//卡号
      },
      visible:false,
      currentId:'',
      loading:false
    }
    this.search = debounce(this.search, 800);

    this.PostArchitectureBaseURL =
    window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureBaseURL;
    }
    selectText=(id)=>{
      document.getElementById(id).select();
    }
    submit=async()=>{
      this.setState({loading:true});
      let data=this.state.data;
      data.C3_661863718947='Y';
      let myDate = new Date();
      data.C3_661944632055= moment(myDate).format('YYYY-MM-DD HH:mm');
      console.log(data);

      try {
        let res = await http({baseURL:this.PostArchitectureBaseURL}).modifyRecords({
          resid: 661863546699,
          data:[data]
        });
        if (res.data.length) {
          this.setState({data:res.data[0]});
        }
        message.success('保存成功');
      this.setState({loading:false});


      } catch (error) {
        message.error(error.message);
        console.log(error.message);
      this.setState({loading:false});

      }
    }
    search=async(id)=>{

      if(id){
      this.setState({loading:true});

        try {
          let res = await http({baseURL:this.PostArchitectureBaseURL}).getTable({
            resid: 661863546699,
            cmswhere: `C3_661863637191 = '${id}'`
          });
          if (res.data.length) {
            this.setState({data:res.data[0]});
          }
          message.success('查询成功');
          this.setState({loading:false,currentId:''});
  
        } catch (error) {
          message.error(error.message);
          console.log(error.message);
      this.setState({loading:false});

        }
      }else{
        this.setState({
          data:{
            C3_661863718947:'',//状态
            C3_661875860175:'',//编号
            C3_661944632055:'',//领取时间
            C3_661863607204:'',//尺寸
            C3_661863597766:'',//颜色
            C3_661863572451:'',//姓名
            C3_661863563966:'',//工号
            C3_661863637191:'',//卡号
          },
        })
      }
      
    }
  render() {
    return (
      <div className="bg">
        <div style={{width:'100vw',height:'100vh'}}>
        <TableData
                resid={661863546699}
                baseURL={this.PostArchitectureBaseURL}
                subtractH={180}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                hasAdvSearch={true}
                hasAdd={false}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasRowModify={false}
                hasDelete={false}
                hasModify={false}
                hasBeBtns={false}
                hasRowSelection={true}
                customRowBtns={[
                  (record) => {
                    return (
                      <Button
                        type="primary"
                        onClick={() => {this.setState({visible:true,currentId:record.C3_661863637191});this.search(record.C3_661863637191);}}
                      >
                        查看详情
                      </Button>
                    );
                  }
                ]}
                actionBarExtra={({ dataSource, selectedRowKeys }) => {
                  return (
                    <>
                      <Button
                      onClick={
                        ()=>{this.setState({visible:true})}
                      }
                      >开始刷卡</Button>
                    </>
                  );
                }}
              />
        </div>
        <Modal
        visible={this.state.visible}
        centered={true}
        title={'领取详情'}
        width={'80vw'}
        onCancel={
          ()=>{this.setState({
            visible:false,
            currentId:'',
            data:{
              C3_661863718947:'',//状态
              C3_661875860175:'',//编号
              C3_661944632055:'',//领取时间
              C3_661863607204:'',//尺寸
              C3_661863597766:'',//颜色
              C3_661863572451:'',//姓名
              C3_661863563966:'',//工号
              C3_661863637191:'',//卡号
            }
          
          })}
        }
        footer={
          <>
          <Button
            type="primary"
            disabled={(this.state.data.C3_661863718947=='Y')||(this.state.currentId=='')||(!this.state.data.REC_ID)}
            onClick={()=>this.submit()}
          >
            确认领取
          </Button>
          <Button
            onClick={
              ()=>{this.setState({
                visible:false,
                currentId:'',
                data:{
                  C3_661863718947:'',//状态
                  C3_661875860175:'',//编号
                  C3_661944632055:'',//领取时间
                  C3_661863607204:'',//尺寸
                  C3_661863597766:'',//颜色
                  C3_661863572451:'',//姓名
                  C3_661863563966:'',//工号
                  C3_661863637191:'',//卡号
                }
              })}
            }
          >
            关闭
          </Button>
          </>
        }
        style={{ top: 50, bottom: 20 }}
      >
          <Spin spinning={this.state.loading}>
            <div style={{width:'70vw'}}>
              <div>
              <span style={{fontSize:'1.5rem'}}>请刷卡读取卡号：</span>
              <Input autoFocus={true} type='text' style={{width:'120px',lineHeight:'2rem',fontSize:'1.5rem'}} id='input' onChange={(v)=>{this.setState({currentId:v.target.value});this.search(v.target.value)}} value={this.state.currentId} allowClear={true}/>
               </div>
              <ul style={{marginTop:16}} className='status'>
                <li style={this.state.data.C3_661863718947=='Y'?{color:'red'}:{}}>
                领取状态：{this.state.data.C3_661863718947}
                </li>
                <li>
                编号：{this.state.data.C3_661875860175}
                </li>
                <li>
                工号：{this.state.data.C3_661863563966}
                </li>
                <li>
                姓名：{this.state.data.C3_661863572451}
                </li>
                <li>
                颜色：{this.state.data.C3_661863597766}
                </li>
                <li>
                尺寸：{this.state.data.C3_661863607204}
                </li>
                <li>
                卡号：{this.state.data.C3_661863637191}
                </li>
                <li>
                领取时间：{this.state.data.C3_661944632055}
                </li>
              </ul>

            </div>
            </Spin>

        </Modal>
      </div>
    );
  }
}

export default Cloth;
