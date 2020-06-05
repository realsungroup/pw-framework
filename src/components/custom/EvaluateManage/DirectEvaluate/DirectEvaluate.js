import React from 'react';
import './DirectEvaluate.less';
import { Select, Input, Checkbox, Button } from 'antd';

const { Option } = Select;
const { Search } = Input;
/**
 * 直评管理
 */
class DirectEvaluate extends React.Component {
  render() {
    return (
      <div className="direct-evaluate">
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
        <div className="direct-evaluate__right">
          <header className="target-employee-info">
            <div className="employee-info-item">姓名：张三</div>
            <div className="employee-info-item">英文名：Sun.zhang</div>
            <div className="employee-info-item">工号：12345678</div>
            <div className="employee-info-item">部门：HR</div>
            <div className="employee-info-item">入司日期：2020-03-04</div>
            <div className="employee-info-item">表内权重之和：6</div>
            <div className="employee-info-item">财年直评人：王五</div>
          </header>
          <div className="direct-evaluate__right__table">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Select style={{ width: 120 }}></Select>
              <div style={{ marginLeft: 24 }}>目标</div>
              <div style={{ marginLeft: 24 }}>优缺点</div>
              <div style={{ marginLeft: 24 }}>互评总结</div>
            </div>
            <div style={{ color: '#F5222D' }}>
              注意：当前选择的财年是FY2020,下属章三不参评，或不在评价期间内，当前评价阶段是年末。
            </div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }
}

export default DirectEvaluate;
