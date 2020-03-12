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
            historyResid="627649406457"
            rootResid="627649574324"
            idField="personid"
            pidField="directorId"
            level={3}
            remarkField="C3_627679142400"
            displayFileds={{
              firstField: 'name',
              secondaryField: 'userId',
              imgField: 'img'
            }}
            groupConfig={[
              {
                ResourceOfTag: '628082603616',
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
