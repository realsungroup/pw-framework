import React from 'react';
import { Button, Icon } from 'antd';
import TableData from '../../../../common/data/TableData';
import JobInfo from './JobInfo';
import './personInfo.less';

class PersonInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curPage: 'Home'
    };
    this.onCliJob = this.onCliJob.bind(this);
    this.backHome = this.backHome.bind(this);
  }
  onCliJob() {
    this.setState({ curPage: 'JobInfo' });
  }
  backHome() {
    this.setState({ curPage: 'Home' });
  }
  render() {
    const { person } = this.props;
    let id;
    if (person) {
      id = person.C3_305737857578;
    }
    console.log(id);
    return (
      <div className="personInfoQuery">
        {this.state.curPage == 'JobInfo' && (
          <div className="JobInfo">
            <div className="buttonLine">
              <Button onClick={this.backHome}>
                <Icon type="left" />
                后退
              </Button>
            </div>
            <JobInfo></JobInfo>
          </div>
        )}
        {this.state.curPage == 'Home' && (
          <div className="Home">
            <div className="buttonLine">
              <Button onClick={this.onCliJob}>任职信息</Button>
              <Button>查阅个人发展报告</Button>
              <Button>个人详细信息</Button>
              <Button>人事信息导出</Button>
            </div>
            <TableData
              key="1"
              resid="446576761435"
              subtractH={240}
              hasAdvSearch={false}
              hasAdd={false}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasBeBtns={true}
              hasRowModify={false}
              hasRowSelection={false}
              actionBarWidth={300}
              actionBarExtra={this.actionBarExtra}
              cparm1={id}
              dblinkname="ehr"
              baseURL="http://10.108.2.66:9091/"
            />
          </div>
        )}
      </div>
    );
  }
}
export default PersonInfo;
