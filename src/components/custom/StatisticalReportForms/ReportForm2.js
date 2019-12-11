import React from 'react';
import { message ,Spin} from 'antd';
import echarts from 'echarts';
import http from 'Util20/api';
import './StatisticalReportForms.less';

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
      console.log(arr)
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
        arr[n][4].courseScore=((arr2[0]+arr2[1]+arr2[2]+arr2[3])*0.25)+'%'
      // 求和第五项
        arr[n][4].CourseCos=Number(arr[n][0].CourseCos)+Number(arr[n][1].CourseCos)+Number(arr[n][2].CourseCos)+Number(arr[n][3].CourseCos)

        n++;
      }
      var w = arr.length*600;
      w=w+'px';
      this.setState({width:w,data:arr});

      this._echarts.hideLoading();
      console.log(res.data);
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
