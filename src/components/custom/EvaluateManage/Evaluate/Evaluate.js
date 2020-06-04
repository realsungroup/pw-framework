import React from 'react';
import './Evaluate.less';
import { Select, Input, Pagination, Checkbox, Button } from 'antd';

const { Option } = Select;
const { Search } = Input;
/**
 * 互评评价
 */
class Evaluate extends React.Component {
  render() {
    return (
      <div className="evaluate-manage-evaluate">
        <div className="evaluate-manage-evaluate__left"></div>
        <div className="evaluate-manage-evaluate__right">
          <div className="evaluate-manage-evaluate__right__header">
            互评记录
          </div>
          <div className="evaluate-manage-evaluate__right__list">
            <div className="evaluate-manage-evaluate__right__list-item">
              <div>工作成绩：blabla</div>
              <div>优点：blabla</div>
              <div>待改善：blabla</div>
            </div>
            <div className="evaluate-manage-evaluate__right__list-item">
              <div>工作成绩：blabla</div>
              <div>优点：blabla</div>
              <div>待改善：blabla</div>
            </div>
          </div>
          <footer>
            <Pagination total={50} size="small" />
          </footer>
        </div>
      </div>
    );
  }
}

export default Evaluate;
