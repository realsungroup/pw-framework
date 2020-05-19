import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'antd';
import defaultAbbreviation from './assets/default-abbreviation.png';
import html2canvas from 'html2canvas';
import Spin from 'Common/ui/Spin';
import './AbbreviationApp.less';

/**
 * 缩略图
 */
export default class AbbreviationApp extends React.Component {
  state = {
    abbreviation: '',
    showDefaultAbbreviation: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (nextProps.ready && nextProps.dom != this.props.dom) ||
      nextState.abbreviation != this.state.abbreviation
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { ready, dom } = this.props;
    if (dom != prevProps.dom) {
      ready && dom && this.toimag();
    }
  }

  toimag = () => {
    const { dom } = this.props;
    if (dom) {
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
    }
  };

  render() {
    const { app, onCloseActiveApp, onClick } = this.props;
    const { abbreviation, showDefaultAbbreviation } = this.state;
    return (
      <div className="abbreviation-app" key={app.REC_ID}>
        <header className="abbreviation-app__header">
          <div className="abbreviation-app__header-title">
            {app.appIconUrl && app.appIconUrlValidate ? (
              <div className="overlay">
                <div className="overlay-inner"></div>
                <img
                  src={app.appIconUrl}
                  className="abbreviation-app__app-icon"
                  alt={abbreviation}
                />
              </div>
            ) : (
              <Icon type="mail" className="abbreviation-app__app-icon-mail" />
            )}
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
