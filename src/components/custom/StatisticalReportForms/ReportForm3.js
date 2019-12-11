import React from 'react';
import http from 'Util20/api';
import { Spin,Select,Button} from 'antd';
import exportJsonExcel from 'js-export-excel';

const { Option } = Select;

class ReportForm3 extends React.Component {
  state={
    date:[],
    data:[{
      header:'???',
      avgTrain: 0,
      courseScore: 0,
      trainHours: 0,
      trainTime: 0,
      internal:{
        trainTime:0,
        trainHours:0
      },
      external:{
        trainTime:0,
        trainHours:0
      }
    }]
  }
  
  exportExcel = async()=>{
    var _data = this.state.data
    var sheetHeader = ['Key Figure (L3 and above)'];
    var sheetData=[
      {
        one:'Training Person-time 参加培训人数',
      },
      {
        one:'Training Person-time(Internal) 参加培训人数（内训）'
      },
      {
        one:'Training Person-time(External) 参加培训人数（外训）'
      },
      {
        one:'Training Hours 培训总时数'
      },
      {
        one:'Training Hours(Internal) 培训总时数（内训）'
      },
      {
        one:'Training Hours(External) 培训总时数（外训）'
      },
      {
        one:'Training Hours/Person  人均培训时数'
      },
      {
        one:'Statisfaction Rate 内训满意度'
      },
    ]
    var n=0;
    while(n<_data.length){
      sheetHeader.push(_data[n].header);
      sheetData[0]['a'+n]=_data[n].trainTime;
      sheetData[1]['a'+n]=_data[n].internal.trainTime;
      sheetData[2]['a'+n]=_data[n].external.trainTime;
      sheetData[3]['a'+n]=_data[n].trainTime;
      sheetData[4]['a'+n]=_data[n].internal.trainHours;
      sheetData[5]['a'+n]=_data[n].external.trainHours;
      sheetData[6]['a'+n]=_data[n].avgTrain;
      sheetData[7]['a'+n]=_data[n].courseScore+'/5';

      n++;
    }
    
    var fileName = this.state.data[0].header.substring(0,6)
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
  componentDidMount() {
    this.calYeal();
  }
  calYeal=async()=>{
    var myDate = new Date();
    myDate=myDate.getFullYear();
    var t=myDate;
    var n=2012;
    var arr=[];
    while(n<myDate){
      arr.push('FY'+myDate)
      myDate--;
    }
    this.setState({date:arr,curDate:'FY'+t})
    this.getData('FY'+t);

  }
  getData = async (cms) => {
    this.setState({loading:true,data:[{
      header:'???',
      avgTrain: 0,
      courseScore: 0,
      trainHours: 0,
      trainTime: 0,
      internal:{
        trainTime:0,
        trainHours:0
      },
      external:{
        trainTime:0,
        trainHours:0
      }
    }]});
    try{
      let res = await http().getTable({
        resid: '628788952983',
        cmswhere:`C3_611264173184='${cms}'`
      });
      let res2 = await http().getTable({
        resid: '628789112577',
        cmswhere:`C3_611264173184='${cms}'`
      });
      // 1.创建季度数据
      var arr=[];
      var n=0;
      while(n<4){
        if(res2.data[n]){
          var avg=res2.data[n].avgTrain||0;
          var cou=res2.data[n].courseScore||0;
          var trainH=res2.data[n].trainHours||0;
          var trainT=res2.data[n].trainTime||0;
          arr.push({
            header:res2.data[n].C3_611264173184+res2.data[n].quarter,
            quarter:res2.data[n].quarter,
            avgTrain:avg,
            courseScore:cou,
            trainHours:trainH,
            trainTime:trainT,
            internal:{
              trainTime:0,
              trainHours:0},
            external:{
              trainTime:0,
              trainHours:0
            }
          })
        }else{
          arr.push({
            header:res2.data[0].C3_611264173184+'Q'+(n+1),
            quarter:'Q'+(n+1),
            avgTrain:0,
            courseScore:0,
            trainHours:0,
            trainTime:0,
            internal:{
              trainTime:0,
              trainHours:0
            },
            external:{
              trainTime:0,
              trainHours:0
            }
          })
        }
       
        n++;
      }
      // 2.添加内外训详情
      n=0;
      var c=0;
      while(n<res.data.length){
        c=0;
        while(c<4){
          if(res.data[n].quarter==arr[c].quarter){
            if(res.data[n].courseType2=='内训'){
              var tT=res.data[n].trainTime||0;
              var tH=res.data[n].trainHours||0;
              arr[c].internal={
                trainTime:tT,
                trainHours:tH
              }
            }else{ 
              var tT=res.data[n].trainTime||0;
              var tH=res.data[n].trainHours||0;
              arr[c].external={
                trainTime:tT,
                trainHours:tH
              }
            }
          }
          c++;
        }
        n++;
      }
      // 3.计算总和
      arr.push({
        header:res2.data[0].C3_611264173184+'YTD',
        avgTrain:Number(arr[0].avgTrain)+Number(arr[1].avgTrain)+Number(arr[2].avgTrain)+Number(arr[3].avgTrain),
        courseScore:(Number(arr[0].courseScore)+Number(arr[1].courseScore)+Number(arr[2].courseScore)+Number(arr[3].courseScore))/4,
        trainHours:Number(arr[0].trainHours)+Number(arr[1].trainHours)+Number(arr[2].trainHours)+Number(arr[3].trainHours),
        trainTime:Number(arr[0].trainTime)+Number(arr[1].trainTime)+Number(arr[2].trainTime)+Number(arr[3].trainTime),
        internal:{
          trainTime:Number(arr[0].internal.trainTime)+Number(arr[1].internal.trainTime)+Number(arr[2].internal.trainTime)+Number(arr[3].internal.trainTime),
          trainHours:Number(arr[0].internal.trainHours)+Number(arr[1].internal.trainHours)+Number(arr[2].internal.trainHours)+Number(arr[3].internal.trainHours)
        },
        external:{
          trainTime:Number(arr[0].external.trainTime)+Number(arr[1].external.trainTime)+Number(arr[2].external.trainTime)+Number(arr[3].external.trainTime),
          trainHours:Number(arr[0].external.trainHours)+Number(arr[1].external.trainHours)+Number(arr[2].external.trainHours)+Number(arr[3].external.trainHours)
        }
      })
      this.setState({data:arr,loading:false})
    }catch(e){
      console.log(e);
      this.setState({loading:false});

    }
    
  };
  handleChange=async(v)=>{
this.setState({curDate:v});
this.getData(v);
    }
  render() {
    return (
      <Spin spinning={this.state.loading}>
      
      <span style={{marginLeft:'16px'}}>财年：</span><Select value={this.state.curDate} style={{ marginLeft:'8px',width: 120 }} onChange={v=>{this.handleChange(v)}}>
    { this.state.date.map((item) => {
                return(
                  <Option value={item}>{item}</Option>
    )})}
    </Select>
    <Button  onClick={this.exportExcel} style={{marginLeft:'16px'}} type='primary'>导出excel</Button>
      <div className="statistical-report-form-3">
        <div className="statistical-report-form-3_table">
          <div className="statistical-report-form-3_table__sider">
            <div className="statistical-report-form-3_table__sider_header" style={{lineHeight:'25px'}}>
              Key Figure
              <br />
              (L3 and above)
            </div>
            <div className="statistical-report-form-3_table__sider_item">
              Training Person-time
              <br />
              参加培训人数
            </div>
            <div className="statistical-report-form-3_table__sider_item">
              Training Hours
              <br />
              培训总时数
            </div>
            <div className="statistical-report-form-3_table__sider_item">
              Training Hours/Person
              <br />
              人均培训时数
            </div>
            <div className="statistical-report-form-3_table__sider_item">
              Statisfaction Rate
              <br />
              内训满意度
            </div>
          </div>
          <div className="statistical-report-form-3_table__main">
            {/* <div className="statistical-report-form-3_table__header">
              { this.state.data.map((item) => {
                return(
                  <>
                      
                  </>
                )
              })}
            </div> */}
            <div className="statistical-report-form-3_table__main_quarter_list">
            { this.state.data.map((item) => {
                return(
                  <>
                     <div className="statistical-report-form-3_table__main_quarter">
                     <div className="statistical-report-form-3_table__header">
                     <div className="statistical-report-form-3_table__header_item">
                        {item.header}
                      </div>
                      </div>
                        <div className="statistical-report-form-3_table__main_quarter_item">
                          <div className='courseRect'>
                            <div className='internalRect'>
                              Internal<br/>{item.internal.trainTime?item.internal.trainTime:0}
                            </div>
                            <div className='externalRect'>
                              External<br/>{item.external.trainTime?item.external.trainTime:0}
                            </div>
                          </div>
                          
                          <div className='courseRect'>{item.trainTime}</div>
                        </div>
                        <div className="statistical-report-form-3_table__main_quarter_item">
                        <div className='courseRect'>
                            <div className='internalRect'>
                              Internal<br/>{item.internal.trainHours?item.internal.trainHours:0}
                            </div>
                            <div className='externalRect'>
                              External<br/>{item.external.trainHours?item.external.trainHours:0}
                            </div>
                          </div>
                          <div className='courseRect'>
                            {item.trainHours?item.trainHours:0}
                          </div>
                        </div>
                        <div className="statistical-report-form-3_table__main_quarter_item">
                          {item.avgTrain?item.avgTrain:0}
                        </div>
                        <div className="statistical-report-form-3_table__main_quarter_item">
                          {item.courseScore?item.courseScore:0}/5
                        </div>
                      </div>
                  </>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      </Spin>
    );
  }
}

export default ReportForm3;
