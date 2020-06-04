import React from 'react';
import './MyAssessmentTable.less';
import { Menu, Select, Input, Pagination } from 'antd';

const { SubMenu } = Menu;
const { Search } = Input;
const { Option } = Select;
/**
 * 我的评估表
 */
class MyAssessmentTable extends React.Component {
  render() {
    return (
      <div className="my-assessment-table">
        <div className="my-assessment-table__menu">
          <Menu
            mode="inline"
            // openKeys={this.state.openKeys}
            // onOpenChange={this.onOpenChange}
            style={{ width: '100%' }}
          >
            <SubMenu key="sub1" title="目标">
              <Menu.Item key="1">目标</Menu.Item>
              <Menu.Item key="2">历史记录</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title="年中自评">
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title="年末自评">
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title="直评查询">
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title="面谈记录">
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title="员工绩效反馈">
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
        <div className="my-assessment-table__main">
          <div className="my-assessment-table__main-container">
            <header className="my-assessment-table__main__header">
              <div className="my-assessment-table__main__header__left">
                <Select style={{ width: '100%' }} value="FY2020" size="small">
                  <Option value="FY2020">FY2020</Option>
                  <Option value="FY2019">FY2019</Option>
                </Select>
              </div>
              <div className="my-assessment-table__main__header__right">
                <Search placeholder="输入工号查询" size="small" />
              </div>
            </header>
            <div className="my-assessment-table__main__list">
              <div className="my-assessment-table__main__list-item my-assessment-table__main__list-item--selected">
                <div className="my-assessment-table__main__list-item__left">
                  <div>财年直评人：Wei.Wang</div>
                  <div>当前直评人：Wei.Wang</div>
                </div>
                <div>已提交</div>
              </div>
              <div className="my-assessment-table__main__list-item">
                <div className="my-assessment-table__main__list-item__left">
                  <div>财年直评人：Wei.Wang</div>
                  <div>当前直评人：Wei.Wang</div>
                </div>
                <div>未提交</div>
              </div>
            </div>
            <footer className="my-assessment-table__main__footer">
              <Pagination size="small" total={50} />
            </footer>
          </div>
        </div>
        <div className="my-assessment-table__table">
          <div className="my-assessment-table__table-container"></div>
        </div>
      </div>
    );
  }
}

export default MyAssessmentTable;
