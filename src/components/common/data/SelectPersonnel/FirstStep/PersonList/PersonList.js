import React from 'react';
import { List, Avatar, Spin } from 'antd';
import './PersonList.less';
/**
 * 人员列表组件
 */
export default class PersonList extends React.Component {
  static defaultProps = {
    loadMore: page => {
      console.log(page);
    }
  };

  render() {
    const {
      data,
      header,
      content,
      loading,
      field_1,
      field_2,
      field_3
    } = this.props;
    return (
      <List
        className="person-list"
        dataSource={data}
        header={header}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon="user" style={{ marginTop: 10 }} />}
              title={item[field_1]}
              description={item[field_2]}
            />
            {content(item, index, field_3)}
          </List.Item>
        )}
      >
        {loading && (
          <div className="person-list__spin">
            <Spin />
          </div>
        )}
      </List>
    );
  }
}
