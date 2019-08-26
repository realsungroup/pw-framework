import React from 'react';
import './IDPAnalyze.less';
import http from 'Util20/api';
import EchartsOfReact from 'echarts-of-react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;


class IDPAnalyze extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    optionWrite: {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: [
          '员工填写',
          '主管填写',
          '未填写',
          '主管确认',
          '员工确认',
          '未确认'
        ]
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],

          label: {
            normal: {
              position: 'inner'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            // {value:335, name:'直达', selected:true},
            // {value:679, name:'营销广告'},
            // {value:1548, name:'搜索引擎'}
          ]
        },
        {
          name: '访问来源',
          type: 'pie',
          radius: ['40%', '55%'],
          label: {
            normal: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            }
          },
          data: [
            { value: 0, name: '员工填写' },
            { value: 0, name: '主管填写' },
            { value: 0, name: '未填写' },
          ]
        }
      ]
    },
    optionAffirm: {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: [
          '主管确认',
          '员工确认',
          '未确认'
        ]
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],

          label: {
            normal: {
              position: 'inner'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            // {value:335, name:'直达', selected:true},
            // {value:679, name:'营销广告'},
            // {value:1548, name:'搜索引擎'}
          ]
        },
        {
          name: '访问来源',
          type: 'pie',
          radius: ['40%', '55%'],
          label: {
            normal: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            }
          },
          data: [
            { value: 0, name: '员工确认' },
            { value: 0, name: '主管确认' },
            { value: 0, name: '未确认' }
          ]
        }
      ]
    }
  };
  ondeepClone = obj => {
    return JSON.parse(JSON.stringify(obj));
  };
  componentDidMount = async () => {
    let res;
    let optionAffirm = this.state.optionAffirm;
    let optionWrite = this.state.optionWrite;
    let deepOptionWrite = this.ondeepClone(optionWrite);
    let deepOptionAffirm = this.ondeepClone(optionAffirm);
    let newOptionWrite = [];
    let newOptionAffirm = [];
    try {
      res = await http().getTable({
        resid: 619800922361
      });
      let data = res.data[0];
      optionWrite.series[1].data.map(item => {
        switch (item.name) {
          case '主管填写':
            item.value = data.directorFilled;
            break;
          case '员工填写':
            item.value = data.memberFilled;
            break;
          case '未填写':
            item.value = data.noWrite;
            break;
        }
        newOptionWrite.push(item);
      });
      optionAffirm.series[1].data.map(item => {
        switch (item.name) {
          case '主管确认':
            item.value = data.isManagerAffirm;
            break;
          case '员工确认':
            item.value = data.isEmployeeAffirm;
            break;
          case '未确认':
            item.value = data.noAffirm;
            break;
        }
        newOptionAffirm.push(item);
      });
      deepOptionWrite.series[1].data = newOptionWrite;
      deepOptionAffirm.series[1].data = newOptionAffirm;
      this.setState({
        optionWrite:deepOptionWrite,
        optionAffirm:deepOptionAffirm
      });
    } catch (error) {}
  };
  render() {
    const { optionWrite, optionAffirm} = this.state;
    return (
      <div className="idp-analyze">
        <Tabs defaultActiveKey="1" >
    <TabPane tab="填写情况" key="1">
    <EchartsOfReact
        id="my-chart-1"
        defaultWidth={1000}
        defaultHeight={600}
        option={optionWrite}
      />
    </TabPane>
    <TabPane tab="确认情况" key="2">
    <EchartsOfReact
        id="my-chart-2"
        defaultWidth={1000}
        defaultHeight={600}
        option={optionAffirm}
      />
    </TabPane>
    </Tabs>
       
      </div>
    );
  }
}

export default IDPAnalyze;
