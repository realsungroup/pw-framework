import React, { Component } from 'react';
import { Icon, Spin, Tooltip, Tabs, message, Popover } from 'antd';
import { TableData } from '../../common/loadableCommon';

import './IDPTrack.less';
import ReportForm2 from '../StatisticalReportForms/ReportForm2';
import echarts from 'echarts';
import http from '../../../util20/api';
import { getItem } from '../../../util20/util';
import ThemeSynpho from './ThemeSynpho';
import ThemeChina from './ThemeChina';
import ThemeCyber from './ThemeCyber';
import AbilityIndicator from './AbilityIndicator';

const { TabPane } = Tabs;

const backColor = [
  '#FFC800',
  '#FF8316',
  '#FF3F69',
  '#6B36C9',
  '#02B3DA',
  '#00B779'
];

class IDPTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTheme: 'synpho',
      courseLi: [['', '', '']],
      showRepo: false,
      dataCourse: [{}],
      loading: false,
      visible: false,
      name: '???',
      abilityVisible: false,
      currentYear: {},
      data: [
        {
          year: '??????',
          abi: ['暂无数据'],
          status: ['暂无数据'],
          score: [],
          color: '#FFC800'
        }
      ]
    };
  }
  async componentDidMount() {
    var id;
    if (this.props.id) {
      id = this.props.id;
    } else {
      let user = JSON.parse(getItem('userInfo'));
      id = user.UserInfo.EMP_USERCODE;
    }
    this.setState({ personID: id });
    await this.getData(id);
    await this.getYearCourse(id);
    await this.getAbility(id);
    await this.getMeasures(id);
  }
  getData = async id => {
    this.setState({ loading: true });
    let res;
    var score;
    try {
      let res2 = await http().getTable({
        resid: 420130498195,
        cmswhere: `C3_420148203323 = '${id}'`
      });
      var n2 = 0;
      var arr2 = [];
      var data2 = res2.data;
      while (n2 < data2.length) {
        var bol2 = false;
        var c2 = 0;
        while (c2 < arr2.length) {
          if (data2[n2].REC_YEAR == arr2[c2].year) {
            bol2 = true;
            arr2[c2].abi.push(data2[n2].C3_431106931302);
            arr2[c2].status.push(data2[n2].C3_431102475269);
          }
          c2++;
        }
        if (bol2 == false) {
          arr2.push({
            year: data2[n2].REC_YEAR,
            abi: [data2[n2].C3_431106931302],
            status: [data2[n2].C3_431102475269]
          });
        }
        n2++;
      }
      score = arr2;
    } catch (e) {
      this.setState({ loading: false });
      console.log(e);
    }
    //  var score=this.getScore(id);
    try {
      res = await http().getTable({
        resid: 629825195225,
        cmswhere: `personID = '${id}'`
      });
      this.setState({ name: res.data[0].personName });
      var data = res.data;
      var arr = [];
      var year = [];
      var n = 0;
      // 构建数组
      while (n < data.length) {
        var bol = false;
        var c = 0;
        while (c < year.length) {
          if (data[n].finicialYear == year[c].year) {
            bol = true;
            year[c].abi.push(data[n].competency);
            year[c].status.push(data[n].status);
          }
          c++;
        }
        if (bol == false) {
          year.push({
            year: data[n].finicialYear,
            abi: [data[n].competency],
            status: [data[n].status]
          });
        }
        n++;
      }
      n = 0;

      while (n < score.length) {
        var str = 'FY' + score[n].year;
        c = 0;
        while (c < year.length) {
          if (year[c].year == str) {
            var x = 0;
            var str2 = [];

            while (x < score[n].abi.length) {
              str2.push(score[n].abi[x] + '-' + score[n].status[x]);
              x++;
            }
            year[c].score = str2;
          }
          c++;
        }
        n++;
      }
      this.setState({ data: year });

      this.renderColor();
    } catch (e) {
      this.setState({ loading: false });

      console.log(e);
    }
  };
  getScore = async id => {
    var score;
    try {
      let res2 = await http().getTable({
        resid: 420130498195,
        cmswhere: `C3_420148203323 = '${id}'`
      });
      var n = 0;
      var arr = [];
      var data = res2.data;
      while (n < data.length) {
        var bol = false;
        var c = 0;
        while (c < arr.length) {
          if (data[n].REC_YEAR == arr[c].year) {
            bol = true;
            arr[c].abi.push(data[n].C3_431106931302);
            arr[c].status.push(data[n].C3_431102475269);
          }
          c++;
        }
        if (bol == false) {
          arr.push({
            year: data[n].REC_YEAR,
            abi: [data[n].C3_431106931302],
            status: [data[n].C3_431102475269]
          });
        }
        n++;
      }
      score = arr;
      this.setState({ score: arr });
    } catch (e) {
      console.log(e);
      score = false;
    }
    return score;
  };

  getAbility = async id => {
    const { data } = this.state;
    try {
      const res = await http().getTable({
        resid: '617726097875',
        cmswhere: `menberId = ${id}`
      });
      res.data.forEach(item => {
        const year = data.find(i => i.year === item.year);
        if (year.ability) {
          year.ability.push(item);
        } else {
          year.ability = [item];
        }
      });
      this.setState({
        data: [...data]
      });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  getMeasures = async id => {
    const { data } = this.state;
    try {
      const res = await http().getTable({
        resid: '617726587425',
        cmswhere: `menberId = ${id}`
      });
      // console.log('Measures', res);
      res.data.forEach(item => {
        const year = data.find(i => i.year === item.year);
        if (year.ability) {
          let ability = year.ability.find(i => {
            return i.competence === item.ability;
          });
          if (ability.measures) {
            ability.measures.push(item);
          } else {
            ability.measures = [item];
          }
        }
        // if (year.ability) {
        //   year.ability.push(item);
        // } else {
        //   year.ability = [item];
        // }
      });
      this.setState({
        data: [...data]
      });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };
  showChart = item => {
    this.setState({ visible: true });
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('chart'));
    var arr = [];
    if (item.abi.length > 0) {
      var indi = [];
      var n = 0;
      while (n < item.abi.length) {
        indi.push({ name: item.abi[n], max: 2.8 });
        n++;
      }
      arr = [];
      n = 0;
      while (n < item.status.length) {
        if (item.status[n] == '不擅长') {
          arr.push(1);
        } else if (item.status[n] == '不擅长') {
          arr.push(2);
        } else {
          arr.push(3);
        }
        n++;
      }
      // 没有三个指标的场合配置条形图
      // 有三个以上指标的场合配置雷达图
      var option = {};
      option = {
        title: {
          text: item.year + '年能力指标统计图'
        },
        toolbox: {
          show: true,
          right: 32,
          feature: {
            mark: { show: true },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        tooltip: {},
        legend: {
          data: ['能力值'],
          left: 0,
          top: 32
        },
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#1890ff',
              borderRadius: 3,
              padding: [8, 8]
            }
          },
          indicator: indi
        },
        series: [
          {
            name: '能力值',
            type: 'radar',
            color: '#1890ff',
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: [
              {
                value: arr,
                name: '能力值'
              }
            ]
          }
        ]
      };
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  };
  renderColor = () => {
    var n = 0;
    var c = 0;
    var obj = this.state.data;
    while (n < this.state.data.length) {
      obj[n].color = backColor[c];
      c++;
      if (c == 6) {
        c = 0;
      }
      n++;
    }
    this.setState({ data: obj, loading: false });
  };

  getYearCourse = async id => {
    let { data } = this.state;
    try {
      let res = await http().getTable({
        resid: 629824871972,
        cmswhere: ` C3_613941384832 = '${id}'`
      });
      res.data.forEach(item => {
        const year = data.find(i => i.year === item.C3_613941384328);
        if (year.course) {
          year.course.push(item);
        } else {
          year.course = [item];
        }
      });
      this.setState({ data: [...data] });
    } catch (error) {
      console.error(error);
    }
  };

  renderCourse = async item => {
    this.setState({ loading: true });
    this.setState({ resizeMemo: item });
    var year = item.year;
    // 财年C3_613941384328
    var id = this.state.personID;
    //人员 C3_613941384832

    //已完成 C3_626260901454

    this.setState({ courseYear: year, courseTarget: id });

    try {
      // let res = await http().getTable({
      //   resid: 629824871972,
      //   cmswhere: `C3_613941384328 = '${year}' and C3_613941384832 = '${id}'`
      // });
      var data = [[]];
      var n = 0;
      var arr = [];
      let course = item.course || [];
      while (n < course.length) {
        var keshi = course[n].C3_613941385843 || 0;
        var signInStartTime = course[n].signInStartTime || 0;
        if (signInStartTime != 0) {
          signInStartTime = signInStartTime.substring(5, 7);
          signInStartTime = Number(signInStartTime);
        }
        arr.push([
          signInStartTime,
          keshi,
          keshi * 3,
          course[n].C3_613941384592
        ]);
        n++;
      }
      data[0] = arr;
      // 渲染图表
      var myChart = echarts.init(document.getElementById('chart3'));
      window.onresize = myChart.resize;
      var option = {
        backgroundColor: '#ffffff',
        title: {
          text: year + '财年课程培训图示'
        },
        xAxis: {
          name: '月份',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          name: '课时',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          scale: true
        },
        series: [
          {
            showAllSymbol: true,
            name: year,
            data: data[0],
            type: 'scatter',
            symbolSize: function(data) {
              return data[2];
            },
            label: {
              emphasis: {
                show: true,
                formatter: function(param) {
                  return param.data[3] + '\n' + '课时：' + param.data[1];
                },
                position: 'top'
              }
            },
            itemStyle: {
              normal: {
                color: '#1890ff'
              }
            }
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.clear();
      myChart.setOption(option);
      this.setState({ loading: false, showCourse: true, courseLi: data[0] });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false, showCourse: true });
    }
  };

  handleChooseSkin = skin => {
    this.setState({
      currentTheme: skin
    });
  };

  onChooseSkin = skin => () => this.handleChooseSkin(skin);

  handleViewAbility = year => {
    this.setState({ currentYear: year, abilityVisible: true });
  };

  renderBar = () => {
    var n = this.state.data.length;
    n = n / 6;
    n = Math.ceil(n);
    var dom = [];
    var c = 0;
    while (c < n) {
      dom.push(<bar></bar>);
      c++;
    }

    return <div className="barGroup">{dom.map(item => item)}</div>;
  };

  renderReportForm = () => {
    return (
      <div
        className="repo_track"
        style={this.state.showRepo ? { left: 0 } : { left: '100vw' }}
      >
        <div
          className="clz_track"
          onClick={() => {
            this.setState({ showRepo: false });
          }}
        >
          <Icon
            type="right"
            style={{ lineHeight: '100vh', color: '#fff', width: '24px' }}
          />
        </div>
        <div style={{ width: 'calc(100% - 24px)', float: 'left' }}>
          <ReportForm2 chara="individual" />
        </div>
      </div>
    );
  };

  renderCourseModal = () => {
    return (
      <div
        style={
          this.state.showCourse
            ? { transform: 'scaleY(1)', top: '0vh' }
            : { transform: 'scaleY(0)', top: '-50vh' }
        }
        className="courseWrap pop"
      >
        <div
          className="popClz"
          onClick={() => this.setState({ showCourse: false })}
        ></div>
        <div id="chart2" className={this.state.showCourse ? 'show' : null}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="课程统计图" key="1">
              <ul className="courseUl">
                {this.state.courseLi.map((item, key) => (
                  <li>
                    {item[3]}
                    <br />
                    {item[0]}月 - {item[1]}课时
                  </li>
                ))}
              </ul>

              <div id="chart3"></div>
            </TabPane>
            <TabPane tab="课程明细" key="2">
              <div style={{ width: '100%', position: 'relative',height:'68vh' }}>
                <TableData
                  resid="629824871972"
                  cmswhere={`C3_613941384328 = '${this.state.courseYear}' and C3_613941384832 = '${this.state.courseTarget}'`}
                  subtractH={240}
                  hasRowView={false}
                  hasAdd={false}
                  hasModify={false}
                  hasDelete={false}
                  hasRowSelection={false}
                  hasRowDelete={false}
                  actionBarWidth={0}
                  hasRowModify={false}
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  };

  renderAbility = () => {
    return (
      <div
        style={
          this.state.abilityVisible
            ? { transform: 'scaleY(1)', top: '0vh' }
            : { transform: 'scaleY(0)', top: '-50vh' }
        }
        className="courseWrap pop"
      >
        <div
          className="popClz"
          onClick={() => this.setState({ abilityVisible: false })}
        ></div>
        <div className="IDPTrack__modal--ability">
          <AbilityIndicator currentYear={this.state.currentYear} />
        </div>
      </div>
    );
  };

  renderStatisticsChart = () => {
    return (
      <div
        style={
          this.state.visible
            ? { transform: 'scaleY(1)', top: '0vh' }
            : {
                transform: 'scaleY(0)',
                top: '-50vh'
              }
        }
        className="pop"
      >
        <div
          className="popClz"
          onClick={() => this.setState({ visible: false })}
        ></div>

        <div id="chart" className={this.state.visible ? 'show' : null}></div>
      </div>
    );
  };

  renderTheme = () => {
    return (
      <>
        <div
          style={{
            zIndex: '12',
            right: '0',
            position: 'fixed',
            width: '24px',
            height: '100vh',
            background: '#13c2c2',
            boxShadow: '0px 0px 8px #006d75'
          }}
        ></div>
        <header>
          <div className="IDPTrack__top__left">
            <Popover
              placement="rightTop"
              trigger="hover"
              overlayClassName="IDPTrack-theme__popovor--skin"
              content={
                <div className="IDPTrack-theme__popover--choose-skin">
                  <div className="popover--choose-skin__title">选择皮肤</div>
                  <div
                    className="popover--choose-skin__item popover--choose-skin__synpho"
                    onClick={this.onChooseSkin('synpho')}
                  >
                    交响
                  </div>
                  <div
                    className="popover--choose-skin__item popover--choose-skin__china"
                    onClick={this.onChooseSkin('china')}
                  >
                    陶瓷
                  </div>
                  <div
                    className="popover--choose-skin__item popover--choose-skin__cyber"
                    onClick={this.onChooseSkin('cyber')}
                  >
                    赛博
                  </div>
                  <div
                    className="popover--choose-skin__item popover--choose-skin__vividness"
                    onClick={this.onChooseSkin('vividness')}
                  >
                    绚丽
                  </div>
                </div>
              }
            >
              <div className="IDPTrack__top__left__icon">
                <Icon type="skin" />
              </div>
            </Popover>
          </div>
          <h3>{this.state.name}的个人能力发展轨迹</h3>
          <div className="IDPTrack__top__right">
            <h4
              onClick={() => {
                this.setState({ showRepo: true });
              }}
            >
              <Icon type="left" /> 历年培训统计
            </h4>
          </div>
        </header>
        <content>
          <div>
            {this.renderBar()}
            {this.state.data.map((item, key) => (
              <div>
                <Tooltip placement="top" title={'点击查看统计图'}>
                  <h4
                    onClick={() => {
                      this.setState({
                        currentYear: item,
                        abilityVisible: true
                      });
                    }}
                    style={{ background: item.color }}
                  >
                    {item.year.substring(2, 6)}
                  </h4>
                </Tooltip>
                <div>
                  <div
                    className="ovalLine"
                    onClick={() => {
                      this.renderCourse(item);
                    }}
                  >
                    <oval style={{ background: item.color }}></oval>
                    <a style={{ color: item.color }}>查看课程</a>
                  </div>
                  <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    能力提升：
                  </p>
                  <div className="cardWrap" style={{ clear: 'both' }}>
                    {item.abi.map(abi => (
                      <span>{abi}</span>
                    ))}
                  </div>
                </div>
                <div className="score">
                  <p>{item.score}</p>
                </div>
              </div>
            ))}
          </div>
        </content>
        <footer></footer>
      </>
    );
  };

  render() {
    const { name, data, currentTheme } = this.state;
    let theme = null;
    switch (currentTheme) {
      case 'synpho':
        theme = (
          <ThemeSynpho
            name={name}
            yearData={data}
            viewDot={this.renderCourse}
            viewReportForm={() => {
              this.setState({ showRepo: true });
            }}
            onViewAbility={this.handleViewAbility}
            onChooseSkin={this.handleChooseSkin}
          />
        );
        break;
      case 'china':
        theme = (
          <ThemeChina
            name={name}
            yearData={data}
            viewDot={this.renderCourse}
            viewReportForm={() => {
              this.setState({ showRepo: true });
            }}
            onChooseSkin={this.handleChooseSkin}
          />
        );
        break;
      case 'cyber':
        theme = (
          <ThemeCyber
            name={name}
            yearData={data}
            viewDot={this.renderCourse}
            viewReportForm={() => {
              this.setState({ showRepo: true });
            }}
            onChooseSkin={this.handleChooseSkin}
          />
        );
        break;
      case 'vividness':
        theme = this.renderTheme();
        break;
      default:
        break;
    }
    return (
      <div className="wrap">
        <Spin
          style={{ width: '100%', height: '100%', position: 'fixed' }}
          spinning={this.state.loading}
        >
          {this.renderReportForm()}
          {this.renderCourseModal()}
          {this.renderAbility()}
          {theme}
        </Spin>
      </div>
    );
  }
}

export default IDPTrack;
