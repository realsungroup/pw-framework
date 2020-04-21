import React from 'react';
import ArchitectureDiagram from '../../../common/data/ArchitectureDiagram';
import JobArchitectureDiagram from './ArchitectureDiagram';
import './PostArchitecture.less';
import TableData from '../../../common/data/TableData';
import classNames from 'classnames';
import http, { makeCancelable } from 'Util20/api';
import { message } from 'antd';
import moment from 'moment';
import EmptyJobs from './EmptyJobs';

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureBaseURL;
/*
 *岗位架构管理
 *
 */
class PostArchitecture extends React.Component {
  state = {
    emp: false,
    selectedTab: 'job',
    hasUnhandleRecords: false
  };
  componentDidMount() {
    this.getUnhandleRecords();
  }
  componentWillUnmount() {
    this.p1 && this.p1.cancel();
  }
  getUnhandleRecords = async () => {
    try {
      const pArr = [];
      pArr.push(
        http({ baseURL }).getTable({
          resid: '638646009862'
        })
      );
      pArr.push(
        http({ baseURL }).getTable({
          resid: '638645984799'
        })
      );
      this.p1 = makeCancelable(Promise.all(pArr));
      const res = await this.p1.promise;
      const [res1, res2] = res;
      if (res1.data.length || res2.data.length) {
        this.setState({ hasUnhandleRecords: true, selectedTab: 'person' });
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  render() {
    const { selectedTab, hasUnhandleRecords } = this.state;
    const { role } = this.props;
    const hasGroup = role === 'manager' ? false : true;
    const hasDepartmentFilter = hasGroup;
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
          岗位任职
        </div>
        {/* <div
          onClick={() => this.setState({ selectedTab: 'vacancy' })}
          className={classNames('post-architecture_title', {
            'tab-selected': selectedTab === 'vacancy'
          })}
        >
          空缺岗位列表
        </div> */}
        <div style={{ clear: 'both' }}></div>
        {selectedTab === 'job' && (
          <div className="post-architecture_diagram-container">
            <JobArchitectureDiagram
              key="job"
              name="job"
              resid="638632769633"
              historyResid="638632807929" //历史
              // rootResid="638559408357" //根节点
              idField="orgcode" //主表id字段名
              pidField="orgSupCode" //父节点id字段名
              level={3}
              displayFileds={{
                firstField: 'orgJobEN',
                secondaryField: 'orgNumber',
                thirdField: 'orgDepEN'
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
              hasGroup={hasGroup}
              hasDepartmentFilter={hasDepartmentFilter}
              role={role}
            />
          </div>
        )}
        {selectedTab === 'person' && (
          <div className="post-architecture_diagram-container">
            <ArchitectureDiagram
              key="person"
              name="person"
              resid="638642823696"
              hasUnhandleRecords={hasUnhandleRecords}
              historyResid="638643664427" //历史
              // rootResid="627649574324" //根节点
              idField="orgcode" //主表id字段名
              pidField="orgSupCode" //父节点id字段名
              level={3}
              hasOpration={false}
              displayFileds={{
                firstField: 'memberEN',
                secondaryField: 'orgJobEN',
                thirdField: 'orgDepEN',
                imgField: 'memberAvatar'
              }}
              procedureConfig={{
                procedure: 'pw_orgstaffbydates',
                paranames: 'dates',
                paratypes: 'string'
              }}
              baseURL={baseURL}
              importConfig={{
                mode: 'fe',
                saveState: 'editoradd',
                containerType: 'drawer'
              }}
              hasView
              importResid="638645137963"
              hasGroup={hasGroup}
              hasDepartmentFilter={hasDepartmentFilter}
              role={role}
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
            <EmptyJobs
              baseURL={baseURL}
              resid="638632769633"
              procedureConfig={{
                procedure: 'pw_orgstaffbydates',
                paranames: 'dates',
                paratypes: 'string',
                paravalues: moment().format('YYYYMMDD')
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default PostArchitecture;
