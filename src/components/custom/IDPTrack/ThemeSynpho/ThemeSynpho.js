import React from 'react';
import { Icon, Popover, Modal } from 'antd';
import AbilityIndicator from '../AbilityIndicator';
import './ThemeSynpho.less';

/**
 * 主题——交响
 */
class ThemeSynpho extends React.PureComponent {
  state = {
    currentYear: {},
    visible: false
  };

  handleScroll = direction => () => {
    this.cardsRef.scrollTo({
      left: direction
        ? this.cardsRef.scrollLeft - window.innerWidth * 0.1576
        : this.cardsRef.scrollLeft + window.innerWidth * 0.1576,
      top: 0,
      behavior: 'smooth'
    });
  };

  handleChooseSkin = skin => () => {
    this.props.onChooseSkin && this.props.onChooseSkin(skin);
  };
  render() {
    const { name, yearData } = this.props;
    const { currentYear, visible } = this.state;
    return (
      <div className="IDPTrack-theme1">
        <div className="IDPTrack-theme1__bg">
          <div className="IDPTrack-theme1__bg__div1"></div>
          <div className="IDPTrack-theme1__bg__div2"></div>
          <div className="IDPTrack-theme1__bg__div3"></div>
          <div className="IDPTrack-theme1__bg__div4"></div>
          <div className="IDPTrack-theme1__bg__div5"></div>
          <div className="IDPTrack-theme1__bg__div6"></div>
          <div className="IDPTrack-theme1__bg__div7"></div>
          <div className="IDPTrack-theme1__bg__div8"></div>
        </div>
        <div className="IDPTrack-theme1__main">
          <div className="IDPTrack-theme1__top">
            <div className="IDPTrack-theme1__top__left">
              <Popover
                placement="rightTop"
                trigger="hover"
                overlayClassName="IDPTrack-theme__popovor--skin"
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
                <Icon type="skin" />
              </Popover>
            </div>
            <div
              className="IDPTrack-theme1__top__right"
              onClick={() => this.props.viewReportForm()}
            >
              <span className="IDPTrack-theme1__top__right__main">
                <span className="IDPTrack-theme1__top__right__main__title">
                  查看历年培训统计
                </span>
                <Icon type="right" style={{ margin: '0 28px 0 20px' }} />
              </span>
            </div>
          </div>
          <div className="IDPTrack-theme1__header">
            <h3>个人能力发展轨迹</h3>
            <h2>{name}</h2>
            <div className="IDPTrack-theme1__header__bottom">
              <div className="IDPTrack-theme1__header__bar IDPTrack-theme1__header__bar--l"></div>
              <div
                style={{
                  width: 320,
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div className="IDPTrack-theme1__header__bar IDPTrack-theme1__header__bar--m"></div>
                  <div className="IDPTrack-theme1__header__bar IDPTrack-theme1__header__bar--s"></div>
                </div>
                <div>
                  From &nbsp;
                  {yearData.length
                    ? yearData[yearData.length - 1].year
                    : '????'}
                  &nbsp; To &nbsp;{yearData.length ? yearData[0].year : '????'}
                </div>
              </div>
            </div>
          </div>
          <div className="IDPTrack-theme1__content">
            <div
              className="IDPTrack-theme1__content__previous"
              onClick={this.handleScroll(true)}
            >
              <Icon type="left" />
            </div>
            <div
              className="IDPTrack-theme1__content__cards"
              ref={e => (this.cardsRef = e)}
            >
              {yearData.map(year => {
                return (
                  <div className="IDPTrack-theme1__card">
                    <div className="IDPTrack-theme1__card__header">
                      {year.score ? (
                        <ul>
                          {year.score.map(item => {
                            return <li key={item}>{item}</li>;
                          })}
                        </ul>
                      ) : (
                        'N/A'
                      )}
                    </div>
                    <div
                      className="IDPTrack-theme1__card__train-times"
                      onClick={() => this.props.viewDot(year)}
                    >
                      <div className="IDPTrack-theme1__card__train-times__number">
                        {year.course ? year.course.length : 0}
                      </div>
                      <span style={{ flex: 1 }}>次培训</span>
                      <Icon type="right" />
                    </div>
                    <div className="IDPTrack-theme1__card__content">
                      <div className="IDPTrack-theme1__card__content__header">
                        培训课程
                      </div>
                      <ul>
                        {year.course &&
                          year.course.map(course => {
                            return (
                              <li key={course.REC_ID}>
                                {course.C3_613941384592}
                              </li>
                            );
                          })}
                      </ul>
                      <div
                        className="IDPTrack-theme1__card__content__footer"
                        onClick={() => {
                          this.setState({ currentYear: year, visible: true });
                        }}
                      >
                        <span>查看能力指标</span>
                        <Icon type="right" />
                      </div>
                    </div>
                    <div className="IDPTrack-theme1__card__footer">
                      {year.year}
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className="IDPTrack-theme1__content__next"
              onClick={this.handleScroll(false)}
            >
              <Icon type="right" />
            </div>
          </div>
        </div>
        <Modal
          visible={visible}
          onCancel={() => {
            this.setState({ currentYear: {}, visible: false });
          }}
          footer={null}
          width={800}
        >
          <div className="IDPTrack__modal--ability">
            <AbilityIndicator currentYear={currentYear} />
          </div>
        </Modal>
      </div>
    );
  }
}
export default ThemeSynpho;
