import React from 'react';
import ArchitectureDiagram from '../../../common/data/ArchitectureDiagram';
import './PostArchitecture.less';

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureBaseURL;
/*
 *岗位架构管理
 *
 */
class PostArchitecture extends React.Component {
  render() {
    return (
      <div className="post-architecture">
        <div className="post-architecture_title">企业架构</div>
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
        </div>
      </div>
    );
  }
}

export default PostArchitecture;
