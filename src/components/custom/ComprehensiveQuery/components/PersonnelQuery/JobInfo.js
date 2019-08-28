import React from 'react';
import TableData from '../../../../common/data/TableData';
import { Button } from 'antd';
class JobInfo extends React.Component {
  actionBarExtra = () => {
    return (
      <Button>查看合同</Button>
    );
  };
  render() {
    return (
      <div style={{ height: '100%' }}>
      <h4>任职信息</h4>
        <ul className='data'>
          <li>
            <label>员工工号：</label>
            <p>12345</p>
          </li>
          <li>
            <label>员工姓名：</label>
            <p>张三</p>
          </li>
          <li>
            <label>旧工号：</label>
            <p>000</p>
          </li>
          <li>
            <label>所属部门：</label>
            <p>HR</p>
          </li>
          <li>
            <label>入司日期：</label>
            <p>2018-08-19：</p>
          </li>
          <li>
            <label>英文名：</label>
            <p>Sun</p>
          </li>
          <li>
            <label>性别：</label>
            <p>男</p>
          </li>
          <li>
            <label>分机号码：</label>
            <p>0288</p>
          </li>

          <li>
            <label>直街主管：</label>
            <p>李四</p>
          </li>
          <li>
            <label>级别：</label>
            <p>L3</p>
          </li>
          <li>
            <label>offical title：</label>
            <p>clerk</p>
          </li>
          <li>
            <label>个人电邮：</label>
            <p>1532445455@qq.com</p>
          </li>
          <li>
            <label>学历：</label>
            <p>本科</p>
          </li>
          <li>
            <label>职务英文：</label>
            <p>C&B Manger I</p>
          </li>
          <li>
            <label>性别：</label>
            <p>女</p>
          </li>
          <li>
            <label>合同类型：</label>
            <p>劳动合同</p>
          </li>
          <li>
            <label>职务中文：</label>
            <p>劳资福利经理1</p>
          </li>

          <li>
            <label>试用期结束时间：</label>
            <p>2018-09-16</p>
          </li>
          <li>
            <label>合同签订时间：</label>
            <p>2018-09-11</p>
          </li>
          <li>
            <label>合同期满时间：</label>
            <p>2021-10-15</p>
          </li>
          <li>
            <label>现住址：</label>
            <p>中华人民共和国上海市宝山区通河新村22号101室</p>
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
