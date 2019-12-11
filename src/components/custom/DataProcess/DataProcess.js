import React from 'react';
import { List, Skeleton, message } from 'antd';
import http from 'Util20/api';

import './DataProcess.less';

class DataProcess extends React.Component {
  state = {
    initLoading: false,
    loading: false,
    list: []
  };

  componentDidMount() {
    this.getData();
  }
  getData = () => {
    try {
      http().getTable({
        resid: '629373035772'
      });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };
  render() {
    const { initLoading, loading, list } = this.state;

    return (
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={item => (
          <List.Item
            actions={[
              <a key="list-loadmore-edit">edit</a>,
              <a key="list-loadmore-more">more</a>
            ]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                title={<a href="https://ant.design">{item.name.last}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
              <div>content</div>
            </Skeleton>
          </List.Item>
        )}
      />
    );
  }
}

export default DataProcess;
