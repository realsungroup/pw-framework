import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Modal, Button, message, Tabs, Popconfirm,Input } from 'antd';
import MainTableSubTables from '../../common/data/MainTableSubTables/';
import './UltimateQuery.less';
import http from '../../../util20/api';
import Selected from '../Selected/Selected';
const config = {
  classes1:[
      {id:1,title:"人员信息",superior:null},
      {id:2,title:"考勤信息",superior:null},
      {id:5,title:"合同信息",superior:null}
  ],
  classes2:[
    {id:3,title:"人员信息",superior:1},
    {id:4,title:"考勤日报",superior:2},
    {id:6,title:"合同信息",superior:5},
    {id:7,title:"人事信息变动",superior:1},
    {id:8,title:"年假台账",superior:2},
    {id:9,title:"哺乳假台账",superior:2},
    {id:10,title:"调休假台账",superior:2},
    {id:11,title:"其他假期台账",superior:2},
    {id:12,title:"考勤数据查询",superior:2},


],
  founcs:[
  {
      name: 'TableData', 
      title: '全部人员信息',
      class:3,
      id:1,
      props: {
        resid: 722083677725,
        baseURL: 'http://10.108.2.66:9091/',
        downloadBaseURL: 'http://10.108.2.66:80/',
      }
  },
  {
    name: 'MainTableSubTables',
    title: '考勤日报处理1',
    id:2,
    class:4,
    props: {
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
      resid: 676572028895,
      mainTableProps: {
        actionBarWidth: 200,
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: true,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowSelection: true,
        hasRowDelete: false,
        isUseFormDefine: false,
        backendButtonPopConfirmProps: { placement: 'bottom' },
        advSearch: {
          isRequestFormData: false
        },
        isUseBESize: true,
        hasBeSort: false,
        subtractH: 200
      },
      subTablesProps: {
        676573379187: {
          hasBeBtns: true,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/',
          isUseBESize: true,
          hasBeSort: false,
          advSearch: {
            isRequestFormData: false
          }
        },
        676573571624: {
          hasBeBtns: true,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/',
          isUseBESize: true,
          hasBeSort: false,
          advSearch: {
            isRequestFormData: false
          }
        },
        676573590282: {
          hasBeBtns: true,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/',
          isUseBESize: true,
          hasBeSort: false,
          advSearch: {
            isRequestFormData: false
          }
        },
        676573619175: {
          hasBeBtns: true,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/',
          isUseBESize: true,
          hasBeSort: false,
          advSearch: {
            isRequestFormData: false
          }
        },
        676573667991: {
          hasBeBtns: true,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/',
          isUseBESize: true,
          hasBeSort: false,
          advSearch: {
            isRequestFormData: false
          }
        }
      }
    }
  },
  {
    name: 'custom', 
    title: '合同管理',
    class:6,
    id:3,
    src:"/fnmodule?resid=640189772997&recid=640189232960&type=合同管理&title=合同管理"
  },
  {
    name: 'custom', 
    title: '人事调动审批',
    class:7,
    id:4,
    src:"/fnmodule?resid=635350002067&recid=635350084447&type=人事信息管理&title=人事调动审批"
  },
  {
    name: 'TableData', 
    title: '在职人员信息',
    class:3,
    id:5,
    props: {
      resid: 424537954415,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '离职人员信息',
    class:3,
    id:6,
    props: {
      resid: 659550084796,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'custom', 
    title: '年假管理（2020年后）',
    class:8,
    id:8,
    src:"/fnmodule?resid=663690700084&recid=663690929711&type=假期管理&title=年假管理"
  },
  {
    name: 'TableData', 
    title: '年假管理（2020年前）',
    class:8,
    id:9,
    props: {
      resid: 775130963822,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '年假年度剩余调整（2020年前）',
    class:8,
    id:10,
    props: {
      resid: 441994427244,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '年假当年新增调整（2020年以前）',
    class:8,
    id:11,
    props: {
      resid: 630169827334,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '哺乳假台账',
    class:9,
    id:12,
    props: {
      resid: 435412554124,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '哺乳假使用明细',
    class:9,
    id:13,
    props: {
      resid: 435419664427,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '调休假台账',
    class:10,
    id:14,
    props: {
      resid: 435431842051,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '调休假使用明细',
    class:10,
    id:15,
    props: {
      resid: 442578987574,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '事假台账',
    class:11,
    id:16,
    props: {
      resid: 518262920381,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '三期名单',
    class:11,
    id:17,
    props: {
      resid: 608738442390,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '育儿假台账',
    class:11,
    id:18,
    props: {
      resid: 775135706998,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '父母陪护假台账',
    class:11,
    id:19,
    props: {
      resid: 712075069963,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '班组调整记录查询',
    class:12,
    id:20,
    props: {
      resid: 423660730564,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '班次调整记录查询',
    class:12,
    id:21,
    props: {
      resid: 423666035454,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '刷卡明细记录查询',
    class:12,
    id:22,
    props: {
      resid: 423660885541,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '请假登记记录查询',
    class:12,
    id:23,
    props: {
      resid: 425274222825,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '加班登记记录查询',
    class:12,
    id:24,
    props: {
      resid: 425274253986,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  }, {
    name: 'TableData', 
    title: '请假导入错误记录',
    class:12,
    id:25,
    props: {
      resid: 432648732840,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  }, {
    name: 'TableData', 
    title: '加班记录导入错误',
    class:12,
    id:26,
    props: {
      resid: 432648481019,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  }, {
    name: 'TableData', 
    title: '刷卡导入错误查询',
    class:12,
    id:27,
    props: {
      resid: 429706598519,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  }, {
    name: 'TableData', 
    title: '请假登记异常明细',
    class:12,
    id:28,
    props: {
      resid: 431960259688,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  }, {
    name: 'TableData', 
    title: '考勤异常日报明细',
    class:12,
    id:29,
    props: {
      resid: 431956725893,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '活动中心刷卡记录',
    class:12,
    id:30,
    props: {
      resid: 439383544231,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '加班请假登记记录',
    class:12,
    id:30,
    props: {
      resid: 509634460766,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  }, {
    name: 'TableData', 
    title: '刷卡记录',
    class:12,
    id:31,
    props: {
      resid: 375296681546,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  
  
]}
const TabPane = Tabs.TabPane;
class UltimateQuery extends Component {
  state = {
    curSelectedFonc:{name:''},
    curfilter1:null,
    curfilter2:null,
    filtRes: [],
    classes1Show:[],
    classes2Show:[]
  };
  componentDidMount(){
    this.setState({classes1Show:config.classes1})
  }
  setCurSelected=async(id)=>{
    console.log('id',id)
    await this.setState({curSelectedFonc:{name:''}});
    for(let i=0;i<config.founcs.length;i++){
      if(config.founcs[i].id===id){
        console.log(config.founcs[i])
        this.setState({curSelectedFonc:config.founcs[i]});
      }
    }
  }
  selectFilter1=(id)=>{
    for(let i=0;i<this.state.classes1Show.length;i++){
      if(this.state.classes1Show[i].id===id){
        this.setState({curfilter1:this.state.classes1Show[i].id});
      }
    }
    //选择filter1的情况下，筛选filter2
    let classes2Show=[]
    for(let i=0;i<config.classes2.length;i++){
      if(config.classes2[i].superior===id){
        classes2Show.push(config.classes2[i]);
      }
    }
    //遍历arr，将所有下级都放到filtres
    let filtRes=[];
    for(let i=0;i<classes2Show.length;i++){
      for(let c=0;c<config.founcs.length;c++){
        if(config.founcs[c].class===classes2Show[i].id){
          filtRes.push(config.founcs[c]);
        }
      }
    }
    console.log(classes2Show,filtRes)
    this.setState({classes2Show,filtRes});
  }
  selectFilter2=(id)=>{
    const classes2Show=this.state.classes2Show;
    for(let i=0;i<classes2Show.length;i++){
      if(classes2Show[i].id===id){
        this.setState({curfilter2:classes2Show[i].id});
      }
    }
    let filtRes=[];
      for(let c=0;c<config.founcs.length;c++){
        if(config.founcs[c].class===id){
          filtRes.push(config.founcs[c]);
        }
      }
    this.setState({filtRes});
  }
  handleSearch(value){
      let v=value;
      if(v){
        if(v==='all'){v=''};
        //分别展示所有的classes和filres,并取消所有选中状态
        let classes1Show=[]
        for(let i=0;i<config.classes1.length;i++){
          let str = config.classes1[i].title;
          if(str.indexOf(v)!=-1){
            classes1Show.push(config.classes1[i]);
          }
        }
        let classes2Show=[]
        for(let i=0;i<config.classes2.length;i++){
          let str = config.classes2[i].title;
          if(str.indexOf(v)!=-1){
            classes2Show.push(config.classes2[i]);
          }
        }
        let filtRes=[]
        for(let i=0;i<config.founcs.length;i++){
          let str = config.founcs[i].title;
          if(str.indexOf(v)!=-1){
            filtRes.push(config.founcs[i]);
          }
        }
        this.setState({classes1Show,classes2Show,filtRes,curSelectedFonc:{name:''},curfilter1:null,curfilter2:null})
      }else{
        this.setState({classes1Show:config.classes1,classes2Show:[],filtRes:[],curSelectedFonc:{name:''},curfilter1:null,curfilter2:null})
      }
    }
  render() {
    const{curSelectedFonc,curfilter1,curfilter2,classes1Show,classes2Show,filtRes}=this.state;
    return (
      <div className='ultimate-query'>
        <div className='side-bar'>
          <div className='searchBar'>
              <Input.Search
                      placeholder='输入all可以查看所有功能'
                      onSearch={(v) => {
                        this.handleSearch(v);
                      }}
                      onPressEnter={v => {
                        this.handleSearch(v.target.value);
                      }}
               />
          </div>
          <div className='filters filters1'>
            {classes1Show.map((item)=>{
              return(
                <div class={curfilter1===item.id?'cur':''} onClick={()=>{this.selectFilter1(item.id)}}>{item.title}</div>
              )
            })}
          </div>
          <div className="filters filters2">
            {classes2Show.map((item)=>{
              return(
                <div class={curfilter2===item.id?'cur':''} onClick={()=>{this.selectFilter2(item.id)}}>{item.title}</div>
              )
            })}
          </div>
          <div className="funcs">
            {
              filtRes.map((item)=>{
                return(
                <div class={curSelectedFonc.id===item.id?'cur':''} onClick={()=>{this.setCurSelected(item.id)}}>{item.title}</div>
                )
              })
            }
          </div>
        </div>
        <div className='ulti-main-frame'>
          {curSelectedFonc.name==='TableData'?
          <TableData 
            resid={curSelectedFonc.props.resid} 
            baseURL={curSelectedFonc.props.baseURL} 
            downloadBaseURL={curSelectedFonc.props.downloadBaseURL}
            hasRowModify={false}
            hasAdd={false}
            hasRowDelete={false}
            hasRowView={true}
            height={"100vh"}
            subtractH={240}
            hasBeBtns={false}
            hasDelete={false}
            hasModify={false}
            hasAdvSearch={true}
          />:null}
          {
           curSelectedFonc.name==='MainTableSubTables'?<MainTableSubTables {...curSelectedFonc.props}></MainTableSubTables>:null
          }
          {
            curSelectedFonc.name==='custom'?<iframe src={window.location.origin+curSelectedFonc.src}/>:null
          }
        </div>
      </div>
    );
  }
}
export default UltimateQuery;
