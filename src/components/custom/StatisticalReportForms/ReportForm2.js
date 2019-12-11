import React from 'react';
import { message ,Spin,Button} from 'antd';
import echarts from 'echarts';
import http from 'Util20/api';
import './StatisticalReportForms.less';
import { isNumber } from 'util';
import exportJsonExcel from 'js-export-excel';

/**
 *
 */
class ReportForm1 extends React.Component {
  constructor(props) {
    super(props);
  }
  state={
    loading:false,
    data:[
      [
        // {
        //   C3_611264173184:'FY2019',
        //   quarter:'Q1',
        //   avgTrain:2.8,
        //   trainHours:1372,
        //   trainTime:62,
        //   courseScore:'40%',
        //   CourseCos:1835,
        // },{
        //   C3_611264173184:'FY2019',
        //   quarter:'Q2',
        //   avgTrain:7.8,
        //   trainHours:2372,
        //   trainTime:612,
        //   courseScore:'90%',
        //   CourseCos:18395,
        // },{

        // },{

        // },{
        //   C3_611264173184:'FY2019',
        //   quarter:'FY2019',
        //   avgTrain:7.8,
        //   trainHours:2372,
        //   trainTime:612,
        //   courseScore:'90%',
        //   CourseCos:18395,
        // }
    ]
  ]
  }
  async componentDidMount() {
    this._echarts = echarts.init(
      document.getElementById('report-form2'),
      'light'
    );
    var h = ''
    if (this.props.chara=='individual'){
      // 个人查看自己
      h='培训时数'
    }else{
      h='平均培训时数'
    }
    this._echarts.setOption({
      title: {
        text: h,
        left: 'center',
      },
      legend: { data: [''] },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      toolbox: {
        feature: {
          // dataView: { show: true, readOnly: false },
          // restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: { type: 'category' },
      yAxis: {},
      series: [
        {
          type: 'line',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          }
        }
      ]
      // dataset: {
      //   source: [
      //     // ['product', 'Overall Training Cost',],
      //     ['Q1FY14', 43.3],
      //     ['Q2FY14', 83.1],
      //     ['Q3FY14', 86.4],
      //     ['Q4FY14', 72.4]
      //   ]
      // }
    });
    if(this.props.chara=='HR'){
      await this.getData('628789285884');

    }else if(this.props.chara=='director'){
      // 主管的场合查下属
      await this.getData('629289152048');

      
    }else if (this.props.chara=='individual'){
      // 个人查看自己
      await this.getData('629289292082');
    }
  }

  exportExcel = async()=>{
    var _data = this.state.data
    var sheetHeader = ['Key Figure'];
    var sheetData=[
      {
        one:'Training Person-time',
      },
      {
        one:'Training Hours'
      },
      {
        one:'Training Hours/Person'
      },
      {
        one:'Satisfaction on Rate'
      },
      {
        one:'External Training Cost'
      }
    ]
    var n=0;
    while(n<_data.length){
      var c=0;
      while(c<_data[n].length){
        sheetHeader.push(_data[n][c].quarter);
        sheetData[0]['a'+n+c]=_data[n][c].trainTime||0;
        sheetData[1]['a'+n+c]=_data[n][c].trainHours||0;
        sheetData[2]['a'+n+c]=_data[n][c].avgTrain||0;
        sheetData[3]['a'+n+c]=_data[n][c].courseScore||0;
        sheetData[4]['a'+n+c]=_data[n][c].CourseCos||0;
        c++;
      }
      
      n++;
    }
    
    var fileName = '培训历年财年人均变化统计';
    const option = {
      fileName : fileName,
      columnWidths: [20, ''],
      datas: [
        {
          sheetHeader:sheetHeader,
          sheetName: 'sheet',
          sheetData:sheetData
        }
      ]
    };
    const toExcel = new exportJsonExcel(option);
    toExcel.saveExcel();
  }

  getData = async (id) => {
    this.setState({loading:true})
    try {
      let httpParams = {};
      var toSearch=localStorage.getItem('userInfo');
      toSearch=JSON.parse(toSearch);
      toSearch=toSearch.UserInfo.EMP_USERCODE;

      this._echarts.showLoading();
      var res 
      var cms=''
      if(this.props.chara=='individual'){
       cms=`C3_613941384832 = '${toSearch}'`
      }else if (this.props.chara=='director'){
        cms=`directorId = '${toSearch}'`
      }
      res= await http(httpParams).getTable({
        resid: id,
        cmswhere:cms
      })
      // 创建表格数据源
      // 1.添加季度数据
      var arr=[];
      var n=0;
      var c=0;
      while(n<res.data.length){
        var bol=false;
        c=0;
        while(c<arr.length){
          if(res.data[n].C3_611264173184==arr[c][4].C3_611264173184){
            var num =res.data[n].quarter;
            num=num.substring(1,2);
            num=Number(num)-1;
            arr[c][num]=res.data[n];
            bol=true;
          }
          c++;
        }
        if(bol==false){
          arr.push([res.data[n],{},{},{},{C3_611264173184:res.data[n].C3_611264173184,quarter:res.data[n].C3_611264173184,className:'alter'}])
        }
        n++;
      }
      // 2.计算财年数据
      n=0;
      c=0;
      while(n<arr.length){
      // 求和第一项
        arr[n][4].trainTime=Number(arr[n][0].trainTime)+Number(arr[n][1].trainTime)+Number(arr[n][2].trainTime)+Number(arr[n][3].trainTime)
      // 求和第二项
        arr[n][4].trainHours=Number(arr[n][0].trainHours)+Number(arr[n][1].trainHours)+Number(arr[n][2].trainHours)+Number(arr[n][3].trainHours)
      // 求和第三项
        arr[n][4].avgTrain=Number(arr[n][0].avgTrain)+Number(arr[n][1].avgTrain)+Number(arr[n][2].avgTrain)+Number(arr[n][3].avgTrain)
      // 取平均值第四项
        var arr2=[];
        while(c<4){
          var numnum=arr[n][c].courseScore||'0%';
          numnum=numnum.substring(0,numnum.length-1);
          numnum=Number(numnum);
          arr2.push(numnum)
          c++;
        }
        var m=((arr2[0]+arr2[1]+arr2[2]+arr2[3])*0.25);
        
        arr[n][4].courseScore=m+'%'
        if(arr[n][4].courseScore=='NaN%'){
          arr[n][4].courseScore='0'
        }
      // 求和第五项
        arr[n][4].CourseCos=Number(arr[n][0].CourseCos)+Number(arr[n][1].CourseCos)+Number(arr[n][2].CourseCos)+Number(arr[n][3].CourseCos)

        n++;
      }
      var w = arr.length*600;
      w=w+'px';
      this.setState({width:w,data:arr});

      this._echarts.hideLoading();
      let source = res.data.map(item => {
        return [item.C3_611264173184 + item.quarter, item.trainHours];
      });
      this._echarts.setOption({
        dataset: {
          source: source
        }
      });
      this.setState({loading:false});

    } catch (error) {
      message.error(error.message);
      this.setState({loading:false});

      console.error(error);
    }
  };

  render() {
    return <div style={{width:'100%',height:'auto',background:'#fff',overflow:'auto'}}>
      <Spin spinning={this.state.loading}>
        {
          this.props.chara=='HR'?( <Button  onClick={this.exportExcel} style={{marginTop:'16px',marginLeft:'5vw'}} type='primary'>导出excel</Button>):null
        }
     

      <div className='tableWrap' style={this.props.chara=='individual'||this.props.chara=='director'?{height:'240px'}:{}}>
          <dl style={{boxShadow:'0px 0px 8px rgba(0,0,0,0.4)',position:'relative'}}>
            <dt>
              <p>Key Figure</p>
            </dt>
            <dd>
            <p>Training Person-time</p>
            </dd>
            <dd>
            <p>Training Hours</p>
            </dd>
            {
                  this.props.chara=='individual'||this.props.chara=='director'?null:(
            <>
            <dd>
              <p> Training Hours/Person</p>
              </dd>
            <dd>
            <p> Satisfaction on Rate</p>
            </dd>
            <dd>
            <p>  External Training Cost</p>
            </dd>
            </>
            )}
          </dl>
          <div className='innerWrap' >
            <rect style={{width:this.state.width}}>
              {
            this.state.data.map((item) => {
              return (
                <>
                  {
            item.map((item2) => {
              return (
                <dl className={item2.className}>
                  <dt>
                    <p>
                      {item2.quarter?item2.quarter:0}
                    </p>
                  </dt>
                  <dd>
                    <p>
                      {item2.trainTime?item2.trainTime:0}
                    </p>
                  </dd>
                  <dd>
                    <p>
                     {item2.trainHours?item2.trainHours:0}
                    </p>
                  </dd> 
                  {
                    this.props.chara=='individual'||this.props.chara=='director'?null:(
                      <dd>
                        <p>
                          {item2.avgTrain?item2.avgTrain:0}
                        </p>
                      </dd> 
                    )
                  }
                {
                  this.props.chara=='individual'||this.props.chara=='director'?null:(
<dd>
                    <p>
                      {item2.courseScore?item2.courseScore:0}
                    </p>
                  </dd> 
                  )
                }
                {
                  this.props.chara=='individual'||this.props.chara=='director'?null:(  
                  <dd>
                    <p>
                      {item2.CourseCos?item2.CourseCos:0}
                    </p>
                  </dd> 
                  )}
                </dl>
              );
            })
          }
                </>
              );
            })
          }
          </rect>
          </div>
      </div>
      <div id="report-form2" style={this.props.chara=='individual'||this.props.chara=='director'?{display:'none'}:{ height: 400 }}></div>
      </Spin>
      </div>;
  }
}

export default ReportForm1;
