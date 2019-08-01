import React from 'react';
import { message, Button, Card, Timeline, Icon, Checkbox } from 'antd';
import './PersonPlan.less';
import http from 'Util20/api';
import TableData from '../../../../common/data/TableData';
import SquareCard from './SquareCard';
/**
 * 管理员确认
 */

const selectedColor = '#1890FF';
const color = '#ccc';
const abilityID = '617726097875';
const planID = '617726587425';
const typeID = '618000219009';
const winAbilityID = '618000231193'

const arr = [
  [
    {
      name: '类别/Category:',
      value: '',
      type: 'input',
      options: ['111', '222', '333'],
      authority: 'modify'
    },
    {
      name: '胜任力/Competency:',
      value: '',
      type: 'input',
      options: ['555', '666', '777'],
      authority: 'modify'
    },
    {
      name: '目标/Target:',
      value: '',
      type: 'input',
      options: ['555', '666', '777'],
      authority: 'modify'
    },
    {
      name: '实际/Actual:',
      value: '',
      type: 'input',
      options: ['555', '666', '777'],
      authority: 'modify'
    },
    {
      name: '行为指标/Behaviour Indicator:',
      value: '',
      type: 'textArea',
      options: ['888', '999', '000'],
      authority: 'modify'
    }
  ],
  [
    {
      name: '类别/Category:',
      value: '',
      type: 'input',
      options: ['111', '222', '333'],
      authority: 'modify'
    },
    {
      name: '胜任力/Competency:',
      value: '',
      type: 'input',
      options: ['555', '666', '777'],
      authority: 'modify'
    },
    {
      name: '目标/Target:',
      value: '',
      type: 'input',
      options: ['555', '666', '777'],
      authority: 'modify'
    },
    {
      name: '实际/Actual:',
      value: '',
      type: 'input',
      options: ['555', '666', '777'],
      authority: 'modify'
    },
    {
      name: '行为指标/Behaviour Indicator:',
      value: '',
      type: 'textArea',
      options: ['888', '999', '000'],
      authority: 'modify'
    }
  ],
  [
    {
      name: '类别/Category:',
      value: '',
      type: 'input',
      options: ['111', '222', '333']
    },
    {
      name: '胜任力/Competency:',
      value: '',
      type: 'input',
      options: ['555', '666', '777'],
      authority: 'modify'
    },
    {
      name: '目标/Target:',
      value: '',
      type: 'input',
      options: ['555', '666', '777'],
      authority: 'modify'
    },
    {
      name: '实际/Actual:',
      value: '',
      type: 'input',
      options: ['555', '666', '777'],
      authority: 'modify'
    },
    {
      name: '行为指标/Behaviour Indicator:',
      value: '',
      type: 'textArea',
      options: ['888', '999', '000'],
      authority: 'modify'
    }
  ]
];

const plans = [
  [
    {
      name: '发展措施/Measure',
      value: '',
      type: 'input',
      options: ['111', '222', '333'],
      authority: 'modify'
    },
    {
      name: '完成日期/Deadline',
      value: '',
      type: 'date',
      options: ['555', '666', '777'],
      authority: 'modify'
    },
    {
      name: '具体行动计划/Description of concrete measures',
      value: '',
      type: 'textArea',
      options: ['555', '666', '777'],
      authority: 'modify'
    }
  ],
  [
    {
      name: '发展措施/Measure',
      value: '',
      type: 'input',
      options: ['111', '222', '333'],
      authority: 'modify'
    },
    {
      name: '完成日期/Deadline',
      value: '',
      type: 'date',
      options: ['555', '666', '777'],
      authority: 'modify'
    },
    {
      name: '具体行动计划/Description of concrete measures',
      value: '',
      type: 'textArea',
      options: ['555', '666', '777'],
      authority: 'modify'
    }
  ],
  [
    {
      name: '发展措施/Measure',
      value: '',
      type: 'input',
      options: ['111', '222', '333'],
      authority: 'modify'
    },
    {
      name: '完成日期/Deadline',
      value: '',
      type: 'date',
      options: ['555', '666', '777'],
      authority: 'modify'
    },
    {
      name: '具体行动计划/Description of concrete measures',
      value: '',
      type: 'textArea',
      options: ['555', '666', '777'],
      authority: 'modify'
    }
  ]
];
const emptyAbility = [
  {
    name: '类别/Category:',
    value: '',
    type: 'input',
    options: ['111', '222', '333'],
    authority: 'modify'
  },
  {
    name: '胜任力/Competency:',
    value: '',
    type: 'input',
    options: ['555', '666', '777'],
    authority: 'modify'
  },
  {
    name: '目标/Target:',
    value: '',
    type: 'input',
    options: ['555', '666', '777'],
    authority: 'modify'
  },
  {
    name: '实际/Actual:',
    value: '',
    type: 'input',
    options: ['555', '666', '777'],
    authority: 'modify'
  },
  {
    name: '行为指标/Behaviour Indicator:',
    value: '',
    type: 'textArea',
    options: ['888', '999', '000'],
    authority: 'modify'
  }
];
const emptyPlans = [
  {
    name: '发展措施/Measure',
    value: '',
    type: 'input',
    options: ['111', '222', '333'],
    authority: 'modify'
  },
  {
    name: '完成日期/Deadline',
    value: '',
    type: 'date',
    options: ['555', '666', '777'],
    authority: 'modify'
  },
  {
    name: '具体行动计划/Description of concrete measures',
    value: 'aaaa',
    type: 'textArea',
    options: ['555', '666', '777'],
    authority: 'modify'
  }
];

const plainOptions = ['确定轻重缓急', '技术全局观', '流量管理', '制定计划'];
class PersonPlan extends React.Component {
  state = {
    currentPostion: 1,
    personInfo: {},
    ability: [],
    types:[],
    plan: [],
    yearReview: [],
    SquareCardArr: []
  };
  constructor(props) {
    super(props);
  }

  onChangeSelect = (subIndex, e, index) => {
    let SquareCardArr = this.state.SquareCardArr;
    console.log('e', subIndex, e, index);
    SquareCardArr[index][subIndex].value = e;
    this.setState({
      SquareCardArr
    });
  };

  onChangeCheckBox = checked => {
    console.log('checked', checked);
  };
  onChangeTextArea = (subIndex, e, index) => {
    let SquareCardArr = this.state.SquareCardArr;
    SquareCardArr[index][subIndex].value = e.target.value;
    this.setState({
      SquareCardArr
    });
  };
  onChangeDate = (subIndex, date, dateString, index) => {
    console.log('onChangeDate', subIndex, date, dateString, index);
    let plans = this.state.plans;
    plans[index][subIndex].value = dateString;
    this.setState({
      plans
    });
  };
  onUpdateSquareCardArr = SquareCardArr => {
    this.setState({
      SquareCardArr
    });
  };
  onAdd = type => {
    let SquareCardArr = this.state.SquareCardArr;
    let plans = this.state.plans;
    switch (type) {
      case 'ability':
        SquareCardArr.push(emptyAbility);
        this.setState({ SquareCardArr });
        break;
      case 'plans':
        plans.push(emptyPlans);
        this.setState({ plans });
        break;
      default:
    }
    console.log('add数组', SquareCardArr);
  };
  onRemove = (index, type) => {
    // console.log('SquareCardArr', this.state.SquareCardArr, index);
    let arr;
    if (type === 1) {
      arr = this.state.SquareCardArr;
      let lastArr = this.state.plans.filter((item, aindex) => {
        console.log('aindex', aindex, index);
        return index != aindex;
      });
      this.setState({
        SquareCardArr: lastArr,
        plans: lastArr
      });
    } else {
      arr = this.state.plans;
      let lastArr = this.state.plans.filter((item, aindex) => {
        console.log('aindex', aindex, index);
        return index != aindex;
      });
      this.setState({
        SquareCardArr: lastArr,
        plans: lastArr
      });
    }
  };
  getTypes = async() => {
    console.log("plansplansplansplans",this.state.plans)
    let SquareCardArr = this.state.SquareCardArr;
    let res;
    try {
      res = await http().getTable({
        resid: typeID,
      });
      this.setState({ types: res.data });
    } catch (error) {
      message.error(error.message);
    }
    let typeArr = []
    res.data.map((item) => {
      typeArr.push(item.typeName)
    })
    SquareCardArr.map((item) => {
      item.map((items) => {
        items.options = typeArr
      })
    })
    this.setState({
      SquareCardArr
    })
    
  }
  getAbilitys = async() => {
    console.log("plansplansplansplans",this.state.SquareCardArr)
    let SquareCardArr = this.state.SquareCardArr;
    let res;
    try {
      res = await http().getTable({
        resid: winAbilityID,
      });
      this.setState({ types: res.data });
    } catch (error) {
      message.error(error.message);
    }
    let typeArr = []
    res.data.map((item) => {
      typeArr.push(item.typeName)
    })
    plans.map((item) => {
      item.map((items) => {
        items.options = typeArr
      })
    })
    this.setState({
      plans
    })
    
  }
  componentDidMount = async () => {
    let res;
    let record = this.props.record;
   await this.setState({
      personInfo: record,
      SquareCardArr: arr,
      plans: plans
    });
    try {
      res = await http().getTable({
        resid: abilityID,
        cmwerhe: `projectId = ${record.projectId}`
      });
      this.setState({ ability: res.data });
    } catch (error) {
      message.error(error.message);
    }

    try {
      res = await http().getTable({
        resid: planID,
        cmwerhe: `projectId = ${record.projectId}`
      });
      this.setState({ plan: res.data });
    } catch (error) {
      message.error(error.message);
    }

    await  this.getTypes();
     this.getAbilitys();
  };
  onChangePostion = currentPostion => {
    console.log('onChangePostion', currentPostion);
    this.setState({
      currentPostion
    });
  };
  render() {
    const { currentPostion, personInfo, SquareCardArr, plans } = this.state;
    return (
      <div style={{ width: '100%', display: 'flex', background: '#fff' }}>
        <div className="personPlan-contain">
          <span
            style={{
              color: 'rgba(0,0,0)',
              fontSize: '26px',
              fontWeight: 'bold'
            }}
          >
            员工职业能力发展计划
          </span>
          <span style={{ color: 'rgba(0,0,0,.65)', fontSize: '20px' }}>
            Individual Development Plan
          </span>

          <Card
            title={
              <span style={{ fontSize: '16px', color: '#000' }}>
                个人信息{' '}
                <span className="personPlan-contain-info-word">
                  Personal Infomation
                </span>
              </span>
            }
            className="personPlan-contain-info"
            bordered={true}
          >
            <div className="personPlan-contain-info-fileds">
              <div className="personPlan-contain-info-filed">
                <span className="personPlan-contain-info-filed-word">
                  工号：
                </span>
                <span>{personInfo.jobNumber}</span>
              </div>
              <div className="personPlan-contain-info-filed">
                <span className="personPlan-contain-info-filed-word">
                  姓名：
                </span>
                <span>{personInfo.memberName}</span>
              </div>
              <div className="personPlan-contain-info-filed">
                <span className="personPlan-contain-info-filed-word">
                  主管编号：
                </span>
                <span>{personInfo.directorId}</span>
              </div>
              <div className="personPlan-contain-info-filed">
                <span className="personPlan-contain-info-filed-word">
                  部门：
                </span>
                <span>{personInfo.department}</span>
              </div>
              <div className="personPlan-contain-info-filed">
                <span className="personPlan-contain-info-filed-word">
                  级别：
                </span>
                <span>{personInfo.level}</span>
              </div>
              <div className="personPlan-contain-info-filed">
                人数：{personInfo.num}
              </div>
              <div className="personPlan-contain-info-filed">
                发起时间：{personInfo.startTime}
              </div>
              <div className="personPlan-contain-info-filed">
                状态：{personInfo.status}
              </div>
            </div>
          </Card>
          <Card
            title={
              <React.Fragment>
                <span style={{ fontSize: '16px', color: '#000' }}>
                  能力测评 - 选出目前及未来需要发展的3-6项能力
                  <span className="personPlan-contain-info-word">
                    Competency Assesment - Chhose 3~6 compentecies meet
                    development at present and in the future.
                  </span>
                </span>
                <Button className="personPlan-contain-lookhistory">
                  查看历史
                </Button>
              </React.Fragment>
            }
            className="personPlan-contain-info"
            bordered={true}
          >
            <div style={{ display: 'flex', padding: '20px', flexWrap: 'wrap' }}>
              {SquareCardArr.map((SquareCardArr, index) => {
                return (
                  <SquareCard
                    SquareCardArr={SquareCardArr}
                    onRemove={() => {
                      this.onRemove(index, 1);
                    }}
                    onChangeSelect={(subIndex, e) => {
                      this.onChangeSelect(subIndex, e, index);
                    }}
                    onUpdateSquareCardArr={() => {
                      this.onUpdateSquareCardArr(SquareCardArr);
                    }}
                    onChangeTextArea={(subIndex, e) => {
                      this.onChangeTextArea(subIndex, e, index);
                    }}
                  ></SquareCard>
                );
              })}
              <Card
                className="idp-contain-smallcards-card"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '390px',
                  height: '180px',
                  margin: '10px 20px'
                }}
                onClick={() => {
                  this.onAdd('ability');
                }}
              >
                <Icon
                  type="plus"
                  style={{
                    display: 'block',
                    fontSize: '60px',
                    fontWeight: 'bold'
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  添加新的能力
                </span>
              </Card>
            </div>
          </Card>
          <Card
            title={
              <React.Fragment>
                <span style={{ fontSize: '16px', color: '#000' }}>
                  职业能力发展计划
                  <span className="personPlan-contain-info-word">
                    Individual development Plan
                  </span>
                </span>
                <Button className="personPlan-contain-lookhistory">
                  查看历史
                </Button>
              </React.Fragment>
            }
            className="personPlan-contain-info"
            bordered={true}
          >
            <div>
              <span>结合以上能力测评，请最多选出3项优先发展</span>
              <br />
              <span>
                Please choose maxi. 3 priority competencies to develop which
                refer to the assesment
              </span>
            </div>
            <div className="personPlan-contain-plan-check">
              <Checkbox.Group
                options={plainOptions}
                defaultValue={['Apple']}
                onChange={this.onChangeCheckBox}
              />
            </div>
            <div style={{ display: 'flex', padding: '20px', flexWrap: 'wrap' }}>
              {plans &&
                plans.map((SquareCardArr, index) => {
                  return (
                    <SquareCard
                      SquareCardArr={SquareCardArr}
                      onRemove={() => {
                        this.onRemove(index, 2);
                      }}
                      onChangeSelect={(subIndex, e) => {
                        this.onChangeSelect(subIndex, e, index);
                      }}
                      onUpdateSquareCardArr={() => {
                        this.onUpdateSquareCardArr(SquareCardArr);
                      }}
                      onChangeTextArea={(subIndex, e) => {
                        this.onChangeTextArea(subIndex, e, index);
                      }}
                      onChangeDate={(date, dateString, subIndex) => {
                        this.onChangeDate(date, dateString, subIndex, index);
                      }}
                    ></SquareCard>
                  );
                })}
              <Card
                className="idp-contain-smallcards-card"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '390px',
                  height: '180px',
                  margin: '10px 20px'
                }}
                onClick={() => {
                  this.onAdd('plans');
                }}
              >
                <Icon
                  type="plus"
                  style={{
                    display: 'block',
                    fontSize: '60px',
                    fontWeight: 'bold'
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  添加新的发展计划
                </span>
              </Card>
            </div>
          </Card>
          <Card
            title={
              <React.Fragment>
                <span style={{ fontSize: '16px', color: '#000' }}>
                  年度回顾 - 回顾职业目标及发展措施
                  <span className="personPlan-contain-info-word">
                    Review of career goals and measures
                  </span>
                </span>

                <Button className="personPlan-contain-lookhistory">
                  查看历史
                </Button>
              </React.Fragment>
            }
            className="personPlan-contain-info"
            bordered={true}
          ></Card>
        </div>
        <div className="personPlan-contain-bottom">
          <div className="personPlan-contain-bottom-btns">
            <Button className="personPlan-contain-bottom-leftbtn">保存</Button>
            <Button className="personPlan-contain-bottom-leftbtn">确认</Button>
            <Button
              type="primary"
              className="personPlan-contain-bottom-leftbtn"
            >
              提交
            </Button>
          </div>
          <div>
          <Button type="danger" className="personPlan-contain-bottom-rightbtn">
            删除
          </Button></div>
        </div>
        {/* <div className="info-line">
          <Timeline>
            <Timeline.Item
              onClick={() => {
                this.onChangePostion(1);
              }}
              color={currentPostion === 1 ? selectedColor : color}
            >
              个人信息
            </Timeline.Item>
            <Timeline.Item
              onClick={() => {
                this.onChangePostion(2);
              }}
              color={currentPostion === 2 ? selectedColor : color}
            >
              能力测评
            </Timeline.Item>
            <Timeline.Item
              onClick={() => {
                this.onChangePostion(3);
              }}
              color={currentPostion === 3 ? selectedColor : color}
            >
              职业能力发展计划
            </Timeline.Item>
            <Timeline.Item
              onClick={() => {
                this.onChangePostion(4);
              }}
              color={currentPostion === 4 ? selectedColor : color}
            >
              年度回顾
            </Timeline.Item>
          </Timeline>
        </div> */}
      </div>
    );
  }
}

export default PersonPlan;
