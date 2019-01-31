import React from 'react';
import http, { makeCancelable } from 'Util20/api';
import { Spin, List } from 'antd';
import { Link } from 'react-router-dom';
import './ReminderList.less';
import { FormattedMessage as FM } from 'react-intl';

export default class ReminderList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      loading: true
    };
  }

  componentDidMount = () => {
    this.getReminderData();
  };

  componentWillUnmount = () => {
    this.p1 && this.p1.cancel();
  };

  getReminderData = async () => {
    this.p1 = makeCancelable(http().getReminderData());
    let res;
    try {
      res = await this.p1.promise;
    } catch (err) {
      return console.error(err);
    }
    const list = [...res.data];
    this.setState({ list, loading: false });
  };

  render() {
    const { list, loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div className="reminder-list">
          <div className="reminder-list__title">
            <FM id="HomeBody.reminder" defaultMessage="提醒" />
          </div>
          {!!list.length ? (
            <List
              dataSource={list}
              renderItem={item => (
                <Link
                  to={{
                    pathname: '/reminder',
                    search: `?resid=${item.REMINDER_RESID}&title=${
                      item.REMINDER_TITLE
                    }&count=${item.REMINDER_TASKNUM}`
                  }}
                >
                  <List.Item
                    key={item.REMINDER_TITLE}
                    className="reminder-list__item"
                  >
                    <List.Item.Meta title={item.REMINDER_TITLE} />
                    <div>{item.REMINDER_TASKNUM}</div>
                  </List.Item>
                </Link>
              )}
            />
          ) : (
            <div className="reminder-list__no-data">
              <FM id="HomeBody.noData" defaultMessage="暂无提醒数据" />
            </div>
          )}
        </div>
      </Spin>
    );
  }
}
