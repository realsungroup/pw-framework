import React from 'react';
import { Icon } from 'antd';
import defaultAbbreviation from './assets/default-abbreviation.png';
import html2canvas from 'html2canvas';
import Spin from 'Common/ui/Spin';
import './AbbreviationApp.less';
import Img from 'Common/ui/Img';
import folderPng from './assets/folder.png';

/**
 * 缩略图
 */
export default class AbbreviationApp extends React.PureComponent {
  state = {
    abbreviation: '',
    showDefaultAbbreviation: false
  };

  componentDidMount = () => {
    const { ready, dom } = this.props;
    !this.state.abbreviation && ready && dom && this.toimag();
  };

  componentDidUpdate = () => {
    const { ready, dom } = this.props;
    !this.state.abbreviation && ready && dom && this.toimag();
  };

  toimag = () => {
    const { dom } = this.props;
    //   let dom = item.contentDocument.querySelector('.functions');
    if (dom.querySelector('.pw-redirect')) {
      return this.setState({
        showDefaultAbbreviation: true,
        abbreviation: defaultAbbreviation
      });
    }
    const promise = new Promise((resolve, reject) => {
      html2canvas(dom)
        .then(canvas => {
          const imgDataURL = canvas.toDataURL('image/png', 1.0);
          resolve(imgDataURL);
        })
        .catch(error => {
          reject(error);
        });
    });
    promise
      .then(val => {
        this.setState({ abbreviation: val });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { app, onCloseActiveApp, onClick } = this.props;
    const { abbreviation, showDefaultAbbreviation } = this.state;
    return (
      <div className="abbreviation-app" key={app.REC_ID}>
        <header className="abbreviation-app__header">
          <div className="abbreviation-app__header-title">
            <Img
              src={app.appIconUrl}
              className="new-home-app-icon"
              alt={app.appIconUrl}
              defaultImg={folderPng}
            />
            {app.appName}
          </div>
          <div>
            <Icon
              type="close"
              className="abbreviation-app__header-close-btn"
              onClick={() => {
                onCloseActiveApp(app);
              }}
            />
          </div>
        </header>
        <div
          className="abbreviation-app__body"
          onClick={() => {
            onClick(app);
          }}
        >
          {abbreviation ? (
            showDefaultAbbreviation ? (
              <div className="abbreviation-app__default-wrapper">
                <div className="abbreviation-app__default-content">
                  <div className="abbreviation-app__default-content__app-name">
                    {app.appName}
                  </div>
                  <img
                    src={abbreviation}
                    className="abbreviation-app__default-content__img"
                    alt={abbreviation}
                  />
                  <div className="abbreviation-app__default-content__tip">
                    点击查看详情
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={abbreviation}
                style={{ height: '100%', width: '100%' }}
                alt={abbreviation}
              />
            )
          ) : (
            <Spin />
          )}
        </div>
      </div>
    );
  }
}
