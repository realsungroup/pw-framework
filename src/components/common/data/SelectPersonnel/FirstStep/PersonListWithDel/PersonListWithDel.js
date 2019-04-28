import React from 'react';
import './PersonListWithDel.less';
import PersonList from '../PersonList';
/**
 * 带有删除按钮的人员列表组件
 */
export default class PersonListWithDel extends React.Component {
  renderContent = (item, index) => {
    return (
      <a
        href="javascript:;"
        className="person-list-withdel__del"
        onClick={() => this.props.onDelete(item, index)}
      >
        删除
      </a>
    );
  };

  render() {
    const { data, ...restProps } = this.props;
    return (
      <div className="person-list-withdel">
        <PersonList
          header={
            <div className="person-list-withdel__header">
              <span>已选人员</span>
              <span>
                <strong>{data.length}</strong> 名
              </span>
            </div>
          }
          content={this.renderContent}
          data={data}
          {...restProps}
        />
      </div>
    );
  }
}
