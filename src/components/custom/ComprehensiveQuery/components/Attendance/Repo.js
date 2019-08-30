import React from 'react';
import { Button ,Icon} from 'antd';
import TableData from '../../../../common/data/TableData';
import './WorkInfo.less'


class Repo extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      name:'张三',//  姓名
      month:'201905',//考勤月份
      memberId:'12345',//员工ID
      EnI:'HR',//一级英文
      EnII:'HR',//二级英文
      EnIII:'HR',//三级英文
      node:props.node
    }
  }
  render() {
    return (
      <div className='Repo'>
        {(this.props.curPage=='monRepo')&&(
          <h4>月报明细</h4>)}
        {(this.props.curPage=='yeaRepo')&&(
          <h4>年报明细</h4>)}

          <ul className='data'>
            <li>
              <label>姓名：</label>
              <p>{this.state.name}</p>
            </li>
            <li>
              <label>考勤月份：</label>
              <p>{this.state.month}</p>
            </li>
            <li>
              <label>员工工号：</label>
              <p>{this.state.memberId}</p>
            </li>
            <li>
              <label>一级英文：</label>
              <p>{this.state.EnI}</p>
            </li>
            <li>
              <label>二级英文：</label>
              <p>{this.state.EnII}</p>
            </li>
            <li>
              <label>三级英文：</label>
              <p>{this.state.EnIII}</p>
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
export default Repo;
