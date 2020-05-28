import React from 'react';
import './InternalTraining.less';
import { Input, Icon, Popover } from 'antd';

const { Search } = Input;

class InternalTraining extends React.Component {
  render() {
    return (
      <div className="online-internal-training">
        <div className="course-container">
          <Search placeholder="搜索课程" />
          <div>
            <div className="entry-training-course selected">
              <span className="course-name">内训课1</span>
              <Popover
                trigger="click"
                placement="rightTop"
                content={
                  <div className="course-more-actions">
                    <div className="action">修改</div>
                    <div className="action danger-action">删除</div>
                  </div>
                }
              >
                <Icon type="more" />
              </Popover>
            </div>
            <div className="entry-training-course">
              <span className="course-name">内训课2</span>
              <Popover
                trigger="click"
                placement="rightTop"
                content={
                  <div className="course-more-actions">
                    <div className="action">修改</div>
                    <div className="action danger-action">删除</div>
                  </div>
                }
              >
                <Icon type="more" />
              </Popover>
            </div>
            <div className="entry-training-course">
              <span className="course-name">内训课3</span>
              <Popover
                trigger="click"
                placement="rightTop"
                content={
                  <div className="course-more-actions">
                    <div className="action">修改</div>
                    <div className="action danger-action">删除</div>
                  </div>
                }
              >
                <Icon type="more" />
              </Popover>
            </div>
            <div className="add-course-btn">点击新建入职培训课程</div>
          </div>
        </div>
        <div className="test-table"></div>
      </div>
    );
  }
}

export default InternalTraining;
