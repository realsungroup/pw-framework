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
      {id:2,title:"考勤管理",superior:null},
  ],
  classes2:[
    {id:3,title:"人员信息",superior:1},
    {id:4,title:"考勤日报",superior:2},
],
  founcs:[
  {
      name: 'TableData', 
      title: '人员信息查询',
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
  }
]}
const TabPane = Tabs.TabPane;
class UltimateQuery extends Component {
  state = {
    curSelectedFonc:{name:''},
    curfilter1:null,
    curfilter2:null,
    filtRes: [],
    classes1Show:[
      {id:1,title:"人员信息",superior:null},
      {id:2,title:"考勤管理",superior:null},
    ],
    classes2Show:[]
  };
  componentDidMount(){
  }
  setCurSelected=(id)=>{
    console.log('id',id)
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
    for(let i=0;i<classes2Show.length;i++){
      for(let c=0;c<config.founcs.length;c++){
        if(config.founcs[c].class===classes2Show[i].id){
          filtRes.push(config.founcs[c]);
        }
      }
    }
    this.setState({filtRes});
  }
  handleSearch(v){
    //分别展示所有的classes和filres,并取消所有选中状态
    console.log(v)
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
  }
  render() {
    const{curSelectedFonc,curfilter1,curfilter2,classes1Show,classes2Show,filtRes}=this.state;
    return (
      <div className='ultimate-query'>
        <div className='side-bar'>
          <div className='searchBar'>
              <Input.Search
                      placeholder='输入关键字进行搜索'
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
        <div className='main-frame'>
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
            hasAdvSearch={false}
          />:null}
          {
           curSelectedFonc.name==='MainTableSubTables'?<MainTableSubTables {...curSelectedFonc.props}></MainTableSubTables>:null
          }
        </div>
      </div>
    );
  }
}
export default UltimateQuery;
