import React from 'react';
import './InterviewRecords.less';
import { Select, Input, Checkbox, Button } from 'antd';

const { Option } = Select;
const { Search } = Input;
/**
 * 面谈记录
 */
class InterviewRecords extends React.Component {
  render() {
    return (
      <div className="interview-records">
        <div className="target-emlpoyee-list">
          <header className="target-emlpoyee-list__header">
            <div className="header__left">
              <Select style={{ width: '100%' }} value="FY2020" size="small">
                <Option value="FY2020">FY2020</Option>
                <Option value="FY2019">FY2019</Option>
              </Select>
            </div>
            <div className="header__right">
              <Search placeholder="输入工号查询" size="small" />
            </div>
          </header>
          <div className="target-emlpoyee-list__content">
            <div className="content__list">
              <div className="content__list-item">
                <div className="content__list-item__checkbox-container">
                  <Checkbox />
                </div>
                <div>
                  <div>张三/Sun. Zhang</div>
                  <div>工号：12345678</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="interview-records__right">
          <header className="target-employee-info">
            <div className="employee-info-item">姓名：张三</div>
            <div className="employee-info-item">英文名：Sun.zhang</div>
            <div className="employee-info-item">工号：12345678</div>
            <div className="employee-info-item">部门：HR</div>
            <div className="employee-info-item">入司日期：2020-03-04</div>
            <div className="employee-info-item">表内权重之和：6</div>
            <div className="employee-info-item">财年直评人：王五</div>
          </header>
          <div className="approval-target__right__table"></div>
        </div>
      </div>
    );
  }
}

export default InterviewRecords;
