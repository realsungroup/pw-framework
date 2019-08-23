import React from 'react';
import './IDPAnalyze.less';
import EchartsOfReact from 'echarts-of-react';
import http from 'Util20/api';

class IDPAnalyze extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    SquareCardArr: [],
    val: null,
    option: {
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
    let option = this.state.option;
    let deepOption = this.ondeepClone(option);
    let newOption = [];
    try {
      res = await http().getTable({
        resid: 619800922361
      });
      let data = res.data[0];
      console.log('option', option);
      option.series[1].data.map(item => {
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
          case '主管确认':
            item.value = data.managerAffirm;
            break;
          case '员工确认':
            item.value = data.employeeAffirm;
            break;
          case '未确认':
            item.value = data.noAffirm;
            break;
        }
        newOption.push(item);
      });
      deepOption.series[1].data = newOption;
      this.setState({
        option: deepOption
      });
    } catch (error) {}
  };
  render() {
    const { option } = this.state;
    return (
      <div className="idp-analyze">
        <div className="">
          <EchartsOfReact
            option={option}
            defaultWidth={1000}
            defaultHeight={600}
          />
        </div>
      </div>
    );
  }
}

export default IDPAnalyze;
