import React from 'react';
import ArchitectureDiagram from '../../../common/data/ArchitectureDiagram';
import './PostArchitecture.less';
import TableData from '../../../common/data/TableData';


const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureBaseURL;
/*
 *岗位架构管理
 *
 */
class PostArchitecture extends React.Component {
  state={
    emp:false,
  }
  render() {
    return (
      <div className="post-architecture">
        <div onClick={()=>this.setState({emp:false})} style={this.state.emp?{cursor:'pointer',float:'left'}:{cursor:'pointer',color:'#1890ff',float:'left'}} className="post-architecture_title">企业架构</div>
        <div onClick={()=>this.setState({emp:true})} style={this.state.emp?{cursor:'pointer',float:'left',marginLeft:'16px',lineHeight:'48px',color:'#1890ff'}:{cursor:'pointer',float:'left',marginLeft:'16px',lineHeight:'48px'}}>查看无对应人员的空职位</div>
        
        <div style={{clear:'both'}}></div>
        {this.state.emp?
        <div style={{width:'100%',height:'calc(100vh - 49px)',backgroundColor:'#FFF',borderTop:'1px solid #e8e8e8'}}>
          <TableData
                    baseURL={baseURL}
                    resid="627649390227"
                    key="7"
                    subtractH={240}
                    hasAdd={false}
                    tableComponent="ag-grid"
                    hasRowView={false}
                    hasRowDelete={false}
                    hasRowEdit={false}
                    hasDelete={false}
                    hasModify={false}
                    hasRowModify={false}
                    hasRowSelection={false}
                  />
        </div>:
        <div className="post-architecture_diagram-container">
          <ArchitectureDiagram
            resid="627649390227"
            historyResid="627649406457"//历史
            rootResid="627649574324"//根节点
            idField="personid"//主表id字段名
            pidField="directorId"//父节点id字段名
            level={3}
            remarkField="C3_627679142400"//历史情况的title
            displayFileds={{
              firstField: 'name',
              secondaryField: 'userId',
              imgField: 'img'
            }}
            groupConfig={[
              {
                ResourceOfTag: '628082603616',//获取分组信息
                SourceColumnOfGroupName: 'groupname',
                SourceColumnOfTagName: 'tagname',
                ColumnOfTagName: 'tagname',
                IsGroupTag: true
              }
            ]}
            baseURL={baseURL}
          />
        </div>}
      </div>
    );
  }
}

export default PostArchitecture;
