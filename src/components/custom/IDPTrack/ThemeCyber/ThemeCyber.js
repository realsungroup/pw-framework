import React from 'react';
import { Icon, Popover } from 'antd';
import AbilityIndicator from '../AbilityIndicator';
import './ThemeCyber.less';

class ThemeCyber extends React.PureComponent {
  state = {
    currentYear: undefined
  };
  handleChooseSkin = skin => () => {
    this.props.onChooseSkin && this.props.onChooseSkin(skin);
  };

  handleChooseYear = year => () => {
    this.setState({
      currentYear: year
    });
  };
  render() {
    const { name, yearData } = this.props;
    let currentYear =
      this.state.currentYear || (yearData.length && yearData[0]);
    return (
      <div className="IDPTrack-theme--cyber">
        <div className="IDPTrack-theme--cyber__content">
          <div className="IDPTrack-theme--cyber__top">
            <div className="IDPTrack-theme--cyber__top__left ">
              <Popover
                placement="rightTop"
                trigger="hover"
                overlayClassName="IDPTrack-theme__popovor--skin IDPTrack-theme__popovor--skin-cyber"
                content={
                  <div className="IDPTrack-theme__popover--choose-skin">
                    <div className="popover--choose-skin__title">选择皮肤</div>
                    <div
                      className="popover--choose-skin__item popover--choose-skin__synpho"
                      onClick={this.handleChooseSkin('synpho')}
                    >
                      交响
                    </div>
                    <div
                      className="popover--choose-skin__item popover--choose-skin__china"
                      onClick={this.handleChooseSkin('china')}
                    >
                      陶瓷
                    </div>
                    <div
                      className="popover--choose-skin__item popover--choose-skin__cyber"
                      onClick={this.handleChooseSkin('cyber')}
                    >
                      赛博
                    </div>
                    <div
                      className="popover--choose-skin__item popover--choose-skin__vividness"
                      onClick={this.handleChooseSkin('vividness')}
                    >
                      绚丽
                    </div>
                  </div>
                }
              >
                <div>
                  <Icon type="skin" />
                </div>
              </Popover>
            </div>
            <div className="IDPTrack-theme--cyber__top__center">
              {name}的个人发展轨迹
            </div>
            <div className="IDPTrack-theme--cyber__top__right ">
              <div
                className="IDPTrack-theme--cyber__top__right__button"
                onClick={() => {
                  this.props.viewReportForm();
                }}
              >
                <span>查看历年培训统计</span>
                <Icon
                  type="right"
                  className="IDPTrack-theme--cyber__top__right__icon__right"
                />
              </div>
            </div>
          </div>
          <div className="IDPTrack-theme--cyber__main">
            <div className="IDPTrack-theme--cyber__main__bars__left">
              <div className="IDPTrack-theme--cyber__bar IDPTrack-theme--cyber__bar--s"></div>
            </div>
            <div className="IDPTrack-theme--cyber__main__content">
              <div className="IDPTrack-theme--cyber__main__ability">
                <div className="IDPTrack-theme--cyber__main__ability__title">
                  {currentYear.year}的能力指标
                </div>
                <div className="IDPTrack-theme--cyber__main__ability__content">
                  <AbilityIndicator currentYear={currentYear} />
                </div>
              </div>
              <div className="IDPTrack-theme--cyber__main__content__bars">
                <div className="IDPTrack-theme--cyber__bar IDPTrack-theme--cyber__bar--l"></div>
                <div className="IDPTrack-theme--cyber__bar IDPTrack-theme--cyber__bar--m"></div>
                <div className="IDPTrack-theme--cyber__bar IDPTrack-theme--cyber__bar--s"></div>
              </div>
              <div className="IDPTrack-theme--cyber__main__years">
                <div className="IDPTrack-theme--cyber__main__years__stripe"></div>
                <div className="IDPTrack-theme--cyber__main__years__cards">
                  <ul>
                    {yearData.map(year => {
                      return (
                        <li key={year.year}>
                          <div
                            className={
                              'IDPTrack-theme--cyber__main__years__card' +
                              (currentYear.year === year.year
                                ? ' IDPTrack-theme--cyber__main__years__card--checked'
                                : '')
                            }
                            onClick={() => {
                              this.setState({ currentYear: year });
                            }}
                          >
                            <div className="IDPTrack-theme--cyber__main__years__card__left">
                              <h3 className="IDPTrack-theme--cyber__main__years__card__year-name">
                                {year.year}
                              </h3>
                              <div>
                                {year.score &&
                                  year.score.map(i => {
                                    return (
                                      <div className="IDPTrack-theme--cyber__main__years__card__grade">
                                        {i}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                            <div className="IDPTrack-theme--cyber__main__years__card__right">
                              <div
                                className="IDPTrack-theme--cyber__main__years__card__right__header"
                                onClick={() => {
                                  this.props.viewDot(year);
                                }}
                              >
                                <span className="IDPTrack-theme--cyber__main__years__card__right__header__dot"></span>
                                <div className="IDPTrack-theme--cyber__main__years__card__right__header__train-count">
                                  <span>培训</span>
                                  <span>
                                    {year.course ? year.course.length : 0}次
                                  </span>
                                </div>
                                <Icon type="right" />
                              </div>
                              <div className="IDPTrack-theme--cyber__main__years__card__right__courses">
                                <h4 className="IDPTrack-theme--cyber__main__years__card__right__courses__title">
                                  培训课程：
                                </h4>
                                <div className="IDPTrack-theme--cyber__main__years__card__right__courses--list">
                                  {year.course
                                    ? year.course.map(item => {
                                        return (
                                          <div
                                            key={item.REC_ID}
                                            className="IDPTrack-theme--cyber__main__years__card__right__course"
                                          >
                                            {item.C3_613941384592}
                                          </div>
                                        );
                                      })
                                    : '无'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="IDPTrack-theme--cyber__main__bars__right">
              <div className="IDPTrack-theme--cyber__bar IDPTrack-theme--cyber__bar--s"></div>
              <div className="IDPTrack-theme--cyber__bar IDPTrack-theme--cyber__bar--m"></div>
              <div className="IDPTrack-theme--cyber__bar IDPTrack-theme--cyber__bar--l"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ThemeCyber;
