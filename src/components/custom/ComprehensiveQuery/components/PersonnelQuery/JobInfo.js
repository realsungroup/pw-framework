import React from 'react';
import TableData from '../../../../common/data/TableData';
import { Button } from 'antd';
class JobInfo extends React.Component {
  constructor(props){
    super(props);
    this.state={
      memberId:'12345',//员工工号
      name:'张三',//员工姓名
      oldId:'000',//旧工号
      depa:'HR',//所属部门
      enterDate:'2018-08-19',//入司日期
      nameEn:'Sun',//英文名
      sex:'男',//性别
      phoneNum:'008',//分机号码
      leader:'李四',//直接主管
      class:'L3',//级别
      offiTi:'clerk',//offical title
      mail:'1532445455@qq.com',//个人电邮
      edu:'本科',//学历
      jobEn:'C&B Manger I',//职务英文
      leaderSex:'女',//领导性别
      pact:'劳动合同',//合同类型
      jonCn:'劳资福利经理1',//职务中文
      endTime:'2018-09-16',//试用期结束时间
      pactTime:'2018-09-11',//合同签订时间
      quitTime:'2021-10-15',//合同期满时间
      address:'中华人民共和国上海市宝山区通河新村22号101室'//现住址：
    }
  }
  actionBarExtra = () => {
    return (
      <Button className='viewDetail'>查看合同</Button>
    );
  }
  render() {
    return (
      <div style={{ height: '100%' }}>
      <h4>任职信息</h4>
        <ul className='data'>
          <li>
            <label>员工工号：</label>
            <p>{this.state.memberId}</p>
          </li>
          <li>
            <label>员工姓名：</label>
            <p>{this.state.name}</p>
          </li>
          <li>
            <label>旧工号：</label>
            <p>{this.state.oldId}</p>
          </li>
          <li>
            <label>所属部门：</label>
            <p>{this.state.depa}</p>
          </li>
          <li>
            <label>入司日期：</label>
            <p>{this.state.enterDate}</p>
          </li>
          <li>
            <label>英文名：</label>
            <p>{this.state.nameEn}</p>
          </li>
          <li>
            <label>性别：</label>
            <p>{this.state.sex}</p>
          </li>
          <li>
            <label>分机号码：</label>
            <p>{this.state.phoneNum}</p>
          </li>

          <li>
            <label>直接主管：</label>
            <p>{this.state.leader}</p>
          </li>
          <li>
            <label>级别：</label>
            <p>{this.state.class}</p>
          </li>
          <li>
            <label>offical title：</label>
            <p>{this.state.offiTi}</p>
          </li>
          <li>
            <label>个人电邮：</label>
            <p>{this.state.mail}</p>
          </li>
          <li>
            <label>学历：</label>
            <p>{this.state.edu}</p>
          </li>
          <li>
            <label>职务英文：</label>
            <p>{this.state.jobEn}</p>
          </li>
          <li>
            <label>性别：</label>
            <p>{this.state.leaderSex}</p>
          </li>
          <li>
            <label>合同类型：</label>
            <p>{this.state.pact}</p>
          </li>
          <li>
            <label>职务中文：</label>
            <p>{this.state.jonCn}</p>
          </li>

          <li>
            <label>试用期结束时间：</label>
            <p>{this.state.endTime}</p>
          </li>
          <li>
            <label>合同签订时间：</label>
            <p>{this.state.pactTime}</p>
          </li>
          <li>
            <label>合同期满时间：</label>
            <p>{this.state.quitTime}</p>
          </li>
          <li>
            <label>现住址：</label>
            <p>{this.state.address}</p>
          </li>
        </ul>

        <TableData
          key="1"
          resid="619609481002"
          subtractH={240}
          hasAdvSearch={false}
          hasAdd={false}
          hasRowView={false}
          hasRowDelete={false}
          hasRowEdit={false}
          hasDelete={false}
          hasModify={false}
          hasRowModify={false}
          hasRowSelection={true}
          actionBarWidth={100}
          actionBarExtra={this.actionBarExtra}
        />
      </div>
    );
  }
}
export default JobInfo;
