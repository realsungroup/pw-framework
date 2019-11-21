import React from 'react';
import ArchitectureDiagram from '../../../common/data/ArchitectureDiagram';
import './PostArchitecture.less';

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
            idField="id"
            pidField="directorId"
            level={3}
            remarkField="C3_627679142400"
            displayFileds={['name', 'userId']}
            baseURL="http://10.108.2.66:9091/"
          />
        </div>
      </div>
    );
  }
}

export default PostArchitecture;
