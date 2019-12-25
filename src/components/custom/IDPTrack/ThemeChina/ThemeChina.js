import React from 'react';
import { Icon, Popover } from 'antd';
import moment from 'moment';
import AbilityIndicator from '../AbilityIndicator';
import './ThemeChina.less';

class ThemeChina extends React.PureComponent {
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
      <div className="IDPTrack-theme--china">
        <div className="IDPTrack-theme--china__top">
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
                {/* <div
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
                </div> */}
              </div>
            }
          >
            <div className="IDPTrack-theme--china__top__left background-china">
              <Icon type="skin" />
            </div>
          </Popover>
          <div className="IDPTrack-theme--china__top__center">
            {name}的个人发展轨迹
          </div>
          <div
            className="IDPTrack-theme--china__top__right background-china"
            onClick={() => this.props.viewReportForm()}
          >
            查看历年培训统计
          </div>
        </div>
        <div className="IDPTrack-theme--china__content">
          <div className="IDPTrack-theme--china__content__left">
            {yearData.map(year => {
              return (
                <div
                  className={
                    'IDPTrack-theme--china__content__left__year background-china ' +
                    (year.year === currentYear.year
                      ? 'background-china--check'
                      : '')
                  }
                  onClick={this.handleChooseYear(year)}
                >
                  <div
                    style={{
                      position: 'relative',
                      textAlign: 'center',
                      width: '100%',
                      lineHeight: '28px',
                      height: 28,
                      zIndex: 90
                    }}
                  >
                    {year.year}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="IDPTrack-theme--china__content__center">
            <div
              className="background-china IDPTrack-theme--china__content__center__train-times"
              onClick={() => this.props.viewDot(currentYear)}
            >
              <div className="IDPTrack-theme--china__content__center__train-times__number">
                {currentYear.course ? currentYear.course.length : 0}
              </div>
              <span>次培训</span>
              <Icon type="right" />
            </div>
            <div className="IDPTrack-theme--china__content__center__grade-rate">
              <div className="background-china IDPTrack-theme--china__content__center__title packTitle">
                <div>
                    
                </div>
                <div>
                  评优
                </div>
                <div>
                  评级
                </div>
              </div>
              {currentYear && currentYear.score ? (
                <div className='packWrap'>
                
                      <div className='pack_year'>
                        {currentYear.detail.map(item =>{
                          return(
                          <p>
                          {item.abi}
                          </p>
                          )
                        })}
                    </div>
                    <div className='pack_score'>
                        {currentYear.score.map(item =>{return(
                          <p>
                          {item.substring(3,item.length)}
                          </p>)
                        })}
                    </div>
                        {currentYear.detail.map(item =>{
                          return(
                            <div className='pack_detail'>

                          <p>
                          {item.detail}
                          </p>
                          </div>

                          )
                        })}
                    </div>
                ) : (
                  <div className="IDPTrack-theme--china__content__center__grade-rate__item">
                    <p style={{width:'100%',lineHeight:'91px',textAlign:'center'}}>N/A</p>
                  </div>
                )}
              
              {/* <div>
                {currentYear && currentYear.score ? (
                  currentYear.score.map(item => {
                    return (
                      <div className="IDPTrack-theme--china__content__center__grade-rate__item">
                        {item}
                      </div>
                    );
                  })
                ) : (
                  <div className="IDPTrack-theme--china__content__center__grade-rate__item">
                    无
                  </div>
                )}
              </div> */}
            </div>
            <div className="IDPTrack-theme--china__content__center__train-course">
              <div className="background-china IDPTrack-theme--china__content__center__title">
                培训课程
              </div>
              {currentYear && currentYear.course ? (
                <ul>
                  {currentYear.course.map(item => {
                    return (
                      <li
                        key={item.REC_ID}
                        className="IDPTrack-theme--china__content__center__train-course__item"
                      >
                        {item.C3_613941384592}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div
                  style={{ paddingLeft: 16 }}
                  className="IDPTrack-theme--china__content__center__train-course__item"
                >
                  N/A
                </div>
              )}
            </div>
          </div>
          <div className="IDPTrack-theme--china__content__right">
            <div className="background-china IDPTrack-theme--china__content__right__title">
              {currentYear.year}的能力指标
            </div>
            <div className="IDPTrack-theme--china__content__right__content">
              <AbilityIndicator currentYear={currentYear} />
              {/* {currentYear &&
                currentYear.ability &&
                currentYear.ability.map(item => (
                  <div className="IDPTrack__ability" key={item.REC_ID}>
                    <div className="IDPTrack__ability__header">
                      <div className="IDPTrack__ability__header__left">
                        <div>{item.categocry}</div>
                        <div>{item.competence}</div>
                      </div>
                      <div className="IDPTrack__ability__header__right">
                        {item.reality}
                      </div>
                    </div>
                    <div className="IDPTrack__ability__measures">
                      {item.measures ? (
                        item.measures.map(measure => {
                          return (
                            <div
                              key={measure.REC_ID}
                              className="IDPTrack__ability__measures__item"
                            >
                              <span className="ability__measure__date">
                                {moment(measure.endTime).format('MM-DD')}
                              </span>
                              <span className="ability__measure__name">
                                {measure.measures}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="IDPTrack__ability__measures__nomeasures">
                          无
                        </div>
                      )}
                    </div>
                  </div>
                ))} */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ThemeChina;
