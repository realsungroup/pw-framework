import React from 'react';
import ArchitectureDiagram from '../../../common/data/ArchitectureDiagram';
import './PostArchitecture.less';
import TableData from '../../../common/data/TableData';
import classNames from 'classnames';

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureBaseURL;
/*
 *岗位架构管理
 *
 */
class PostArchitecture extends React.Component {
  state = {
    emp: false,
    selectedTab: 'job'
  };
  render() {
    const { selectedTab } = this.state;
    return (
      <div className="post-architecture">
        <div
          onClick={() => this.setState({ selectedTab: 'job' })}
          className={classNames('post-architecture_title', {
            'tab-selected': selectedTab === 'job'
          })}
        >
          岗位架构
        </div>
        <div
          onClick={() => this.setState({ selectedTab: 'person' })}
          className={classNames('post-architecture_title', {
            'tab-selected': selectedTab === 'person'
          })}
        >
          人事架构
        </div>
        <div
          onClick={() => this.setState({ selectedTab: 'vacancy' })}
          className={classNames('post-architecture_title', {
            'tab-selected': selectedTab === 'vacancy'
          })}
        >
          空缺岗位列表
        </div>
        <div style={{ clear: 'both' }}></div>
        {selectedTab === 'job' && (
          <div className="post-architecture_diagram-container">
            <ArchitectureDiagram
              key="job"
              resid="638632769633"
              historyResid="638632807929" //历史
              rootResid="638559408357" //根节点
              idField="orgcode" //主表id字段名
              pidField="orgSupCode" //父节点id字段名
              level={3}
              displayFileds={{
                firstField: 'orgName',
                secondaryField: 'orgcode'
              }}
              procedureConfig={{
                procedure: 'pw_orgstaffbydates',
                paranames: 'dates',
                paratypes: 'string'
              }}
              baseURL={baseURL}
              createWindowName="CreateWindow"
              editWindowName="EditWindow"
              hasImport={false}
            />
          </div>
        )}
        {selectedTab === 'person' && (
          <div className="post-architecture_diagram-container">
            <ArchitectureDiagram
              key="person"
              resid="627649390227"
              historyResid="627649406457" //历史
              rootResid="627649574324" //根节点
              idField="personid" //主表id字段名
              pidField="directorId" //父节点id字段名
              level={3}
              hasOpration={false}
              remarkField="C3_627679142400" //历史情况的title
              displayFileds={{
                firstField: 'name',
                secondaryField: 'userId',
                imgField: 'img'
              }}
              groupConfig={[
                {
                  ResourceOfTag: '628082603616', //获取分组信息
                  SourceColumnOfGroupName: 'groupname',
                  SourceColumnOfTagName: 'tagname',
                  ColumnOfTagName: 'tagname',
                  IsGroupTag: true
                }
              ]}
              baseURL={baseURL}
            />
          </div>
        )}
        {selectedTab === 'vacancy' && (
          <div
            style={{
              width: '100%',
              height: 'calc(100vh - 49px)',
              backgroundColor: '#FFF',
              borderTop: '1px solid #e8e8e8'
            }}
          >
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
          </div>
        )}
      </div>
    );
  }
}

export default PostArchitecture;
