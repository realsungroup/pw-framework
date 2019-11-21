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
            resid="627492761872"
            historyResid="627492790130"
            baseURL="http://10.108.2.66:9091/"
          />
        </div>
      </div>
    );
  }
}

export default PostArchitecture;
