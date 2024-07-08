import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Modal, Button, message, Tabs, Popconfirm } from 'antd';
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
    {id:3,title:"考勤日报处理1",superior:2},
],
  founcs:[
  {
      name: 'TableData', 
      title: '人员信息查询',
      class:1,
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
    class:3,
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
    curSelectedFonc:{
      name: 'TableData', 
      title: '人员信息查询',
      class:1,
      id:1,
      props: {
        resid: 722083677725,
        baseURL: 'http://10.108.2.66:9091/',
        downloadBaseURL: 'http://10.108.2.66:80/',
      }
    },
    curfilter1:null,
    curfilter2:null,
    filtRes: [{title:'人员信息查询',id:1},{title:'考勤日报处理2',id:2}]
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
    for(let i=0;i<config.classes1.length;i++){
      if(config.classes1[i].id===id){
        this.setState({curfilter1:config.classes1[i].id});
      }
    }
  }
  selectFilter2=(id)=>{
    for(let i=0;i<config.classes2.length;i++){
      if(config.classes2[i].id===id){
        this.setState({curfilter1:config.classes2[i].id});
      }
    }
  }
  render() {
    const{curSelectedFonc,curfilter1,curfilter2}=this.state;
    return (
      <div className='ultimate-query'>
        <div className='side-bar'>
          <div className='searchBar'></div>
          <div className='filters1'>
            {config.classes1.map((item)=>{
              return(
                <div class={curfilter1===item.id?'cur':''} onClick={()=>{this.selectFilter1(item.id)}}>{item.title}</div>
              )
            })}
          </div>
          <div className="filters2">
            {config.classes1.map((item)=>{
              return(
                <div class={curfilter2===item.id?'cur':''} onClick={()=>{this.selectFilter2(item.id)}}>{item.title}</div>
              )
            })}
          </div>
          <div className="funcs">
            {
              this.state.filtRes.map((item)=>{
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
