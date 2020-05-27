import React from 'react';
import './EntryTraining.less';
import { Input, Icon, Popover } from 'antd';

const { Search } = Input;
class EntryTraining extends React.Component {
  render() {
    return (
      <div className="online-entry-training">
        <div className="course-container">
          <Search placeholder="搜索课程" />
          <div>
            <div className="add-course-btn">点击新建入职培训课程</div>
            <div className="entry-training-course selected">
              <span className="course-number">1</span>
              <span>HR合规政策解读</span>
              <Popover
                trigger="click"
                placement="rightTop"
                content={
                  <div className="course-more-actions">
                    <div className="action">上移</div>
                    <div className="action">下移</div>
                    <div className="action">修改</div>
                    <div className="action danger-action">删除</div>
                  </div>
                }
              >
                <Icon type="more" />
              </Popover>
            </div>
            <div className="entry-training-course">
              <span className="course-number">2</span>
              <span>微信考勤系统登录</span>
              <Popover
                trigger="click"
                placement="rightTop"
                content={
                  <div className="course-more-actions">
                    <div className="action">上移</div>
                    <div className="action">下移</div>
                    <div className="action">修改</div>
                    <div className="action danger-action">删除</div>
                  </div>
                }
              >
                <Icon type="more" />
              </Popover>
            </div>
            <div className="entry-training-course">
              <span className="course-number">3</span>
              <span>行政管理是否完成</span>
              <Popover
                trigger="click"
                placement="rightTop"
                content={
                  <div className="course-more-actions">
                    <div className="action">上移</div>
                    <div className="action">下移</div>
                    <div className="action">修改</div>
                    <div className="action danger-action">删除</div>
                  </div>
                }
              >
                <Icon type="more" />
              </Popover>
            </div>
          </div>
        </div>
        <div className="test-table"></div>
      </div>
    );
  }
}

export default EntryTraining;
