import React from 'react';
import './WorkSheetShowBoard.less';
import echarts from 'echarts';
import moment from 'moment';
import { Select, Button, message, DatePicker, Modal, Spin } from 'antd';
import WorkSheetDetail from '../WorkSheetDetail';
import http from 'Util20/api';

const { Option } = Select;
const { RangePicker } = DatePicker;
class WorkSheetShowBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '全部',
      sheets: [{}],
      showDetails:false,
      editRight:{
        part1:false
      }
    };
  }

  async componentDidMount() {
    this.getRight();
  }

  //实例化echarts
  instantiation = chartObj => {
    let myDate = new Date();
    myDate = moment(myDate).format('YYYY-MM-DD');
    let chartDom = document.getElementById('showBoard');
    let myChart = echarts.init(chartDom);
    let option;
    let total = 0;
    if (chartObj.total) {
      total = chartObj.total;
    }
    option = {
      title: {
        text: myDate + ' ' + total + '件',
        textStyle: {
          height: '32px'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '32px',
        left: 'left'
      },
      series: [
        {
          name: '工作单',
          top: '50%',
          type: 'pie',
          center: ['50%', '60%'],
          radius: ['30%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold',
              color: '#333333'
            }
          },
          labelLine: {
            show: false
          },
          data: chartObj.data,
          color: ['#13c2c2', '#faad14', '#1890ff', '#f5222d','#666666']
        }
      ]
    };

    option && myChart.setOption(option);
  };

  //获取新建订单权限
  getRight = async (v) => {
    //获取localstorage的部门代码
    // this.setState({loading2:true});
    // let res;
    // let depaID = localStorage.getItem('userInfo');
    // depaID = JSON.parse(depaID);
    // depaID = depaID.UserInfo.EMP_DEPID;
    //获取pw后台的新建权限
    // try {
    //   res = await http().getTable({
    //     resid: 681075873039,
    //     cmswhere: `C3_682274906470 = '${depaID}'`
    //   });
      // console.log(res);
      // let n = 0;
      let obj = {};
      let mesId = '';
      // while (n < res.data.length) {
        if (this.props.depaId == '681076033443') {
          obj.part1 = true;
          mesId = '681076033443';
        }
        if (this.props.depaId == '681076169400') {
          obj.part2 = true;
          mesId = '681076169400';
        }
        if (this.props.depaId == '681076179960') {
          obj.part3 = true;
          mesId = '681076179960';
        }
        if (this.props.depaId == '681076187961') {
          obj.part4 = true;
          mesId = '681076187961';
        }
        if (this.props.depaId == '681076196461') {
          obj.part5 = true;
          mesId = '681076196461';
        }
        if (this.props.depaId == '681076208531') {
          obj.part6 = true;
          mesId = '681076208531';
        }
      //   n++;
      // }
      this.setState({ editRight: obj, mesId: mesId });
      this.getSheets(mesId,v);
    // } catch (error) {
    //   message.error(error.message);
    //   console.log(error);
    // }
  };

  //显示详情页
  showDetails = (v, id ,b) => {
    console.log('id', id);
    if(b){
      this.setState({reSheet:true});
    }
    let value = true;
    let ID = '';
    let isNew = true;
    if (v != null) {
      value = v;
      ID = id;
      isNew = false;
    }
    console.log('value', value, v);
    this.getRight();
    if(!v){
      this.setState({reSheet:false});
       //获取已读状态
    let newArr=this.state.sheetsAll;
    let readStatus=localStorage.getItem('readStatus');
      if(readStatus){
        readStatus=JSON.parse(readStatus);
      }else{
        readStatus=[];
    }
    let sc=0;
    while(sc<readStatus.length){
      let sc2=0;
      while(sc2<readStatus[sc].length){
        let nn=0;
        while(nn<newArr.length){
          let j=newArr[nn].REC_ID;
          if(newArr[nn].C3_684868072961){
            j=newArr[nn].C3_682377626479;
          }
          if((newArr[nn].REC_EDTTIME==readStatus[sc][sc2].REC_EDTTIME)&&(j==readStatus[sc][sc2].REC_ID)){
            newArr[nn].isNew='';
          }
          nn++
        }
        sc2++;
      }
      sc++;
    }
    console.log('G',newArr)
    this.setState({sheetsAll:newArr});
    }
    this.setState({
      showDetails: value,
      clearData: value,
      curSheetId: ID,
      isNew: isNew
    });
  };
  //获取当前进行中和未开始的订单
  getSheets = async (mesId,needRe) => {
    this.setState({ loading2: true });
    let stDate = new Date();
      stDate = moment(stDate).format('YYYY-MM-DD');
    let resCol = await http().getTableColumnDefine({
      resid: 678790254230,
    });
    this.setState({colData:resCol.data});
    let res;
    let res2;
    try {
      res = await http().getTable({
        resid: 679066070181,
        cmswhere: `(curDepaId = '${mesId}' and C3_678796788873 > '${stDate}' and C3_682377833865 = '已完成') or (curDepaId = '${mesId}' and C3_682377833865 = '进行中' ) or (curDepaId = '${mesId}' and C3_682377833865 = '非正常终止') or (C3_682540124939 = '${mesId}' and C3_682377833865 = '已完成')`
      });
      let n = 0;
      let emergy = [];
      let arr = [];
      let unstart = [];
      let zf = [];
      let qx = [];
      let ing = [];
      let done = [];
      while (n < res.data.length) {
        if (res.data[n].C3_682507133563 == 'Y') {
          emergy.push(res.data[n]);
        } else {
          arr.push(res.data[n]);
        }
        if (
          res.data[n].C3_682377833865 == '已完成'
        ) {
          if(( res.data[n].curDepaId != mesId) && (res.data[n].C3_682540168336 == 'N')){
            unstart.push(res.data[n]);
          }else if(( res.data[n].curDepaId == mesId) && (res.data[n].C3_682540168336 == 'Y')){
            ing.push(res.data[n]);
          }
        } else if (res.data[n].C3_682377833865 == '进行中') {
          ing.push(res.data[n]);
        } else if (res.data[n].sheetStatus == '已作废') {
          zf.push(res.data[n]);
        } else if (res.data[n].sheetStatus == '已取消') {
          qx.push(res.data[n]);
        }
        n++;
      }
      //获取已完成的
      
      res2 = await http().getTable({
        resid: 682377608634,
        cmswhere: `C3_682379434328 > '${stDate}' and C3_682377764470 = '${mesId}' and C3_682378769806 = '已完成' and islast = 'Y'`
      });

      done=res2.data;
      console.log(res2,done)
      let newArr = emergy.concat(arr);
      n =0;
      let cms=``;
      while(n<done.length){
        if(n==0){
          cms=`REC_ID = '${done[n].C3_682377626479}'`
        }else{
          cms=cms+` or REC_ID = '${done[n].C3_682377626479}'`
        }
        n++;
      }
      if(cms==``){
        cms=`1=0`
      }
      let res3=await http().getTable({
        resid: 687113114913,
        cmswhere: cms
      });
      
      if(res3.data.length>0){
        n=0;
        let res3Arr = res3.data
        let res3N=[];
        while(n<res3Arr.length){
          res3Arr[n].finished=true;
          let v = 0;
          let bol=false;
          while(v<done.length){
            if(res3Arr[n].C3_684517500134==done[v].C3_684868072961){
              if(res3Arr[n].C3_682377764470==mesId){
                bol=true;
              }
            }
            v++;
          }
          if(!bol){
            res3N.push(res3Arr[n])
          }
          n++;
        }
        newArr = newArr.concat(res3N);
      }
      let chartObj = {
        total: done.length+ing.length+unstart.length+qx.length+zf.length,
        data: [
          { value: done.length, name: '已完成：' + done.length },
          { value: ing.length, name: '进行中：' + ing.length },
          { value: unstart.length, name: '未开始：' + unstart.length },
          { value: qx.length, name: '取消：' + qx.length },
          { value: zf.length, name: '作废：' + zf.length }
        ]
      };
      this.instantiation(chartObj);
      console.log('A',newArr)
      //获取已读状态
      let readStatus=localStorage.getItem('readStatus');
        if(readStatus){
          readStatus=JSON.parse(readStatus);
        }else{
          readStatus=[];
      }
      let sc=0;
      while(sc<readStatus.length){
        let sc2=0;
        while(sc2<readStatus[sc].length){
          let nn=0;
          while(nn<newArr.length){
            let j=newArr[nn].REC_ID;
            if(newArr[nn].C3_684868072961){
              j=newArr[nn].C3_682377626479;
            }
            if((newArr[nn].REC_EDTTIME==readStatus[sc][sc2].REC_EDTTIME)&&(j==readStatus[sc][sc2].REC_ID)){
              newArr[nn].isNew='';
            }
            nn++
          }
          sc2++;
        }
        sc++;
      }
      this.setState({ sheets: newArr, loading2: false, sheetsAll: newArr ,needRe});
      if(needRe){
        let t = setTimeout(()=>{
          this.setState({needRe:false});
        },1000);
      }
      console.log('newArr',newArr);
    } catch (error) {
      message.error(error.message);
      this.setState({ loading2: false });
      console.log(error);
    }
  };

  //改变筛选器
  changeFilter = v => {
    let n = 0;
    let arr = this.state.sheetsAll;
    let arrUn = [];
    let arrAl = [];
    while (n < arr.length) {
      if (arr[n].C3_682377833865 == '进行中') {
        arrAl.push(arr[n]);
      } else {
        arrUn.push(arr[n]);
      }
      n++;
    }
    if (v == '全部') {
      this.setState({ sheets: this.state.sheetsAll });
    } else if (v == '未开始') {
      this.setState({ sheets: arrUn });
    } else if (v == '已开始') {
      this.setState({ sheets: arrAl });
    }
    this.setState({ filter: v });
  };
  render() {
    return (
      <div style={{width:'100vw'}}>
        <Spin spinning={this.state.loading2}>
      <div className="cardWrap">
        <Modal
          visible={this.state.showImg}
          footer={null}
          onCancel={() => {
            this.setState({ showImg: false });
          }}
          destroyOnClose
          width={'80vw'}
          style={{background:'#999'}}
        >
          <div
            style={{
              width: '100%',
              height: '80vh',
              background: 'url(' + this.state.imgUrl + ')',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
        </Modal>
        <div>
          <div className="filter">
            <div
              className={this.state.filter == '全部' ? 'current' : ''}
              onClick={() => {
                this.changeFilter('全部');
              }}
            >
              全部
            </div>
            <div
              className={this.state.filter == '未开始' ? 'current' : ''}
              onClick={() => {
                this.changeFilter('未开始');
              }}
            >
              未开始
            </div>
            <div
              className={this.state.filter == '已开始' ? 'current' : ''}
              onClick={() => {
                this.changeFilter('已开始');
              }}
            >
              已开始
            </div>
            <div
              onClick={() => {
                this.getRight();
              }}
            >
              刷新数据
            </div>
          </div>
          <div id="showBoard"></div>
          {this.state.sheets.map(item => {
            return (
              <div
                className={
                  item.finished?'finished sheet':(item.C3_682507133563 == 'Y' ? 'emergy sheet' : 'sheet')
                }
               style={(item.sheetStatus=='已完成'&&(!item.finished))?{display:'none'}:{}}
              >
                <div>
                  <label>
                    {item.finished?'已完成':
                    (item.C3_682507133563 == 'Y' ? '加急' : '不加急')
                    }
                  </label>
                  <h3>{item.C3_678796779827}</h3>
                </div>
                <div>
                  {item.finished?'':(item.sheetStatus=='已作废'||item.sheetStatus=='已取消'?
                  <p>已{item.sheetStatus=='已作废'?'作废':'取消'}</p>
                  :<><p>
                  {item.C3_682377833865 == '进行中'
                    ? item.curProName
                    : item.C3_682444267100}{' '}
                  {item.C3_682377833865 == '进行中'
                    ? item.C3_682371274376
                    : ''}
                </p>
                <p>
                  {item.C3_682377833865 == '进行中'
                    ? item.C3_682379482255 + '开始'
                    : '未开始'}
                </p></>)
                  }
                  
                </div>
                <div>
                <p
                     onClick={
                      ()=>{this.showDetails(true,item.C3_682281119677)}
                    }
                  >
                    查看详情
                  </p>
                  <p
                    onClick={() => {
                      this.setState({
                        showImg: true,
                        imgUrl: item.imgUrl
                      });
                    }}
                  >
                    查看图纸
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        </div>
        </Spin>
        <div className='detailContent' style={this.state.showDetails?{display:'block'}:{display:'none'}}>
             
             <WorkSheetDetail
                hasBack={true}
                backFunc={()=>{this.showDetails(false)}}
                editRight={this.state.editRight}
                clearData={this.state.clearData}
                curSheetId={this.state.curSheetId}
                mesId={this.state.mesId}
                colData={this.state.colData}
                sheetData={this.state.sheetsAll}
                changeId={(v,v2)=>{this.showDetails(true,v,v2)}}
                reSheet={this.state.reSheet}
                needRe={this.state.needRe}
                freshData={()=>{this.getRight(true);}}
             >
              </WorkSheetDetail>   
        </div>

      </div>
    );
  }
}

export default WorkSheetShowBoard;
