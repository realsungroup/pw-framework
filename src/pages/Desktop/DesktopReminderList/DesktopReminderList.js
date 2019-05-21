import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './DesktopReminderList.less';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { List, Icon } from 'antd';
import { FormattedMessage as FM } from 'react-intl';

/**
 * 桌面提醒列表
 */
export default class DesktopReminderList extends React.Component {
  static propTypes = {
    /**
     * 提醒数据
     * 默认：-
     */
    list: PropTypes.array,

    /**
     * 是否显示
     * 默认：false
     */
    visible: PropTypes.bool,

    /**
     * 加载状态
     * 默认：false
     */
    loading: PropTypes.bool,

    /**
     * 列表项点击回调，如：(url, title) => console.log(url)
     * 默认：-
     */
    onItemClick: PropTypes.func
  };

  static defaultProps = {
    visible: false
  };

  handleItemClick = itemData => {
    const url = `/reminder?resid=${itemData.REMINDER_RESID}&title=${
      itemData.REMINDER_TITLE
    }&count=${itemData.REMINDER_TASKNUM}`;

    const { onItemClick } = this.props;
    onItemClick && onItemClick(url, itemData.REMINDER_TITLE);
  };

  render() {
    const { visible, list, loading } = this.props;
    const classes = classNames('desktop-reminder-list', {
      'desktop-reminder-list--hide': !visible
    });
    const loadingClasses = classNames('desktop-reminder-list__loading', {
      'desktop-reminder-list__loading--hide': !loading
    });

    let child = (
      <div className={classes} onClick={e => e.stopPropagation()}>
        <h1>
          <span>提醒</span>
          <Icon type="loading" className={loadingClasses} />
        </h1>

        {!!list.length ? (
          <List
            dataSource={list}
            renderItem={item => (
              <div onClick={() => this.handleItemClick(item)}>
                <List.Item
                  key={item.REMINDER_TITLE}
                  className="desktop-reminder-list__item"
                >
                  <List.Item.Meta title={item.REMINDER_TITLE} />
                  <div>{item.REMINDER_TASKNUM}</div>
                </List.Item>
              </div>
            )}
          />
        ) : (
          <div className="reminder-list__no-data">
            <FM id="HomeBody.noData" defaultMessage="暂无提醒数据" />
          </div>
        )}
      </div>
    );

    const container = document.querySelector('.desktop__main');
    if (container) {
      return ReactDOM.createPortal(child, container);
    }
    return null;
  }
}
