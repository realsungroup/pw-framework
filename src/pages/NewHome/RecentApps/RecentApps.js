import React from 'react';
import noHistoryImage from '../assets/nohistory.png';
import './RecentApps.less';
import { Icon, message } from 'antd';
import { removeFns, addWorkbenchApps } from '../../../util/api';

class RecentApps extends React.PureComponent {
  handleFixAppp = app => async e => {
    e.stopPropagation();
    let addFnsParams = {
      resid: 582414136652,
      data: [{ ResID: app.ResID }]
    };
    let res;
    try {
      res = await addWorkbenchApps(addFnsParams);
    } catch (error) {
      return message.error(error.message);
    }
    message.success('已添加至固定功能');
    this.props.onRefresh && this.props.onRefresh(false);
  };

  render() {
    const { apps } = this.props;

    return (
      <div className="new-home__recent-apps">
        <div className="new-home-title">最近</div>
        {apps.length ? (
          <ul className="new-home__recent-apps-list">
            {apps.map(app => {
              return (
                <li
                  className="new-home__recent-apps-item"
                  onClick={() => {
                    this.props.onClick([{ app, typeName: app.BusinessNode }]);
                  }}
                >
                  <div className="new-home__recent-apps-item__title">
                    {app.appIconUrl && app.appIconUrlValidate ? (
                      <div className='overlay'>
                      <img src={app.appIconUrl} className="new-home-app-icon" />
                      </div>
                    ) : (
                      <Icon type="mail" className="new-home-app-icon-mail" />
                    )}
                    {app.title}
                  </div>
                  <Icon type="pushpin" onClick={this.handleFixAppp(app)} />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="new-home__recent-apps__norecent">
            <img
              src={noHistoryImage}
              className="new-home__recent-apps__norecent-img"
              width="50%"
              height="auto"
              alt=""
            />
            <p>最新没有使用任何功能</p>
          </div>
        )}
      </div>
    );
  }
}

export default RecentApps;
