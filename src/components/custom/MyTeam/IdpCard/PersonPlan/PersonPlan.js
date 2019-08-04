import React from 'react';
import {
  message,
  Button,
  Card,
  Timeline,
  Icon,
  Checkbox,
  Popconfirm
} from 'antd';
import './PersonPlan.less';
import http from 'Util20/api';
import TableData from '../../../../common/data/TableData';
import SquareCard from './SquareCard';
/**
 * 管理员确认
 */

const selectedColor = '#1890FF';
const color = '#ccc';
const abilityID = '617726097875'; //能力测评表ID
const planID = '617726587425'; //发展行动计划表ID
const typeID = '618000219009'; //类型表ID
const winAbilityID = '618000231193'; //胜任力表ID
const developmentMeasureID = '618225629802'; //发展措施表

const arr = [];

const plans = [];
const emptyAbility = [
  {
    name: '类别/Category:',
    value: '',
    type: 'select',
    options: [],
    authority: 'modify'
  },
  {
    name: '胜任力/Competency:',
    value: '',
    type: 'select',
    options: [],
    authority: 'modify'
  },
  {
    name: '目标/Target:',
    value: '',
    type: 'select',
    options: ['擅长', '不擅长', '过度使用'],
    authority: 'modify'
  },
  {
    name: '实际/Actual:',
    value: '',
    type: 'select',
    options: ['擅长', '不擅长', '过度使用'],
    authority: 'modify'
  },
  {
    name: '行为指标/Behaviour Indicator:',
    value: '',
    type: 'textArea',
    options: [],
    authority: 'modify'
  },
  {
    name: '发展总计划ID',
    value: '',
    type: 'none',
    options: [],
    authority: 'modify'
  },
  {
    name: '人员编号',
    value: '',
    type: 'none',
    options: [],
    authority: 'modify'
  },
  {
    name: '能力测评编号',
    value: '',
    type: 'none',
    options: [],
    authority: 'modify'
  },
  {
    name: '是否优先发展',
    value: '',
    type: 'none',
    options: [],
    authority: 'modify'
  }
];
const emptyPlans = [
  {
    name: '发展措施/Measure:',
    value: '',
    type: 'select',
    options: [],
    authority: 'modify'
  },
  {
    name: '完成日期/Deadline:',
    value: '',
    type: 'date',
    options: [],
    authority: 'modify'
  },
  {
    name: '具体行动计划/Description of concrete measures:',
    value: '',
    type: 'textArea',
    options: [],
    authority: 'modify'
  },
  {
    name: '发展总计划ID',
    value: '',
    type: 'none',
    options: [],
    authority: 'modify'
  },
  {
    name: '发展行动计划编号',
    value: '',
    type: 'none',
    options: [],
    authority: 'modify'
  }
];
const emptyMeasures = [
  {
    name: '发展措施/Measure:',
    value: '',
    type: 'select',
    options: [],
    authority: 'check'
  },
  {
    name: '具体行动计划/Description of concrete measures:',
    value: '',
    type: 'textArea',
    options: [],
    authority: 'check'
  },
  {
    name: '发展总计划ID',
    value: '',
    type: 'none',
    options: [],
    authority: 'modify'
  },
  {
    name: '发展行动计划编号',
    value: '',
    type: 'none',
    options: [],
    authority: 'modify'
  },
  {
    name: '年中回顾',
    value: '',
    type: 'textArea',
    options: [],
    authority: 'modify'
  },
  {
    name: '年末回顾',
    value: '',
    type: 'textArea',
    options: [],
    authority: 'modify'
  }
];
class PersonPlan extends React.Component {
  state = {
    currentPostion: 1,
    personInfo: {}, //个人信息
    ability: [], //能力
    types: [], //所有类别
    // abilitys :[],  //所有胜任力
    plans: [], //计划数组
    measures: [], //措施数组
    SquareCardArr: [], //能力数组
    yearReview: [], //年度回顾
    abilityArr: [], ////所有胜任力
    plainOptions: [], //优先发展能力
    developmentMeasures: [] //发展措施
  };
  constructor(props) {
    super(props);
  }

  onChangeSelect = (subIndex, e, index, type) => {
    if (type === 1) {
      let SquareCardArr = this.state.SquareCardArr;
      let abilityArr = this.state.abilityArr;
      let lastabilityArr = [];
      SquareCardArr[index][subIndex].value = e;
      if (subIndex === 0) {
        abilityArr.map(item => {
          if (item.type === e) {
            lastabilityArr.push(item.ability);
          }
        });
        SquareCardArr[index][subIndex + 1].options = lastabilityArr;
      }
      this.setState({
        SquareCardArr
      });
    } else {
      let plans = this.state.plans;
      let abilityArr = this.state.abilityArr;
      let lastabilityArr = [];
      plans[index][subIndex].value = e;
      if (subIndex === 0) {
        abilityArr.map(item => {
          if (item.type === e) {
            lastabilityArr.push(item.ability);
          }
        });
        plans[index][subIndex + 1].options = lastabilityArr;
      }
      this.setState({
        plans
      });
    }
  };

  onChangeCheckBox = checked => {
    console.log('checked', checked);
  };
  onChangeTextArea = (subIndex, e, index, type) => {
    /**
     * type
     * 1 能力测评表
     * 2 行动计划表
     * 3 措施表
     */
    let SquareCardArr = this.state.SquareCardArr;
    let plans = this.state.plans;
    let measures = this.state.measures;
    if (type === 1) {
      SquareCardArr[index][subIndex].value = e.target.value;
      this.setState({
        SquareCardArr
      });
    } else if (type === 2) {
      plans[index][subIndex].value = e.target.value;
      this.setState({
        SquareCardArr
      });
    } else {
      measures[index][subIndex].value = e.target.value;
      this.setState({
        SquareCardArr
      });
    }
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
        emptyAbility.map(item => {
          item.key = this.state.SquareCardArr.length + 1;
        });
        SquareCardArr.push(this.cloneDeep(emptyAbility));
        this.setState({ SquareCardArr });
        break;
      case 'plans':
        plans.map(item => {
          item.key = this.state.plans.length + 1;
        });
        plans.push(this.cloneDeep(emptyPlans));
        this.setState({ plans });
        break;
      default:
    }
    console.log('add数组', SquareCardArr);
  };
  onRemove = (index, type) => {
    // console.log('SquareCardArr', this.state.SquareCardArr, index);
    if (type === 1) {
      let lastArr = this.state.SquareCardArr.filter((item, aindex) => {
        return index !== aindex;
      });
      this.setState({
        SquareCardArr: lastArr
      });
    } else {
      let lastArr = this.state.plans.filter((item, aindex) => {
        return index !== aindex;
      });
      this.setState({
        plans: lastArr
      });
    }
    this.onDelete(index, type);
  };
  // 获取能力测评表
  getAbilityEvaluation = async record => {
    let res;
    let ability;
    let SquareCardArr = this.state.SquareCardArr;
    let plainOptions = this.state.plainOptions;
    try {
      res = await http().getTable({
        resid: abilityID,
        cmwerhe: `projectId = ${record.projectId}`
      });
      ability = res.data;
      ability.map(item => {
        if (item.competence) {
          plainOptions.push(item.competence);
        }
      });
      console.log('plainOptions', plainOptions);
      let empty = emptyAbility;
      ability.forEach((item, index) => {
        empty.map(item => {
          item.key = index;
        });
        SquareCardArr.push(this.cloneDeep(empty));
      });

      console.log('SquareCardArrSquareCardArr', SquareCardArr, ability);
      if (ability.length > 0) {
        // ability.map((a,index) => {
        let arr;
        arr = SquareCardArr.forEach((item, index) => {
          item.forEach(items => {
            if (items.name === '类别/Category:') {
              items.value = ability[index].categocry;
            } else if (items.name === '胜任力/Competency:') {
              items.value = ability[index].competence;
            } else if (items.name === '目标/Target:') {
              items.value = ability[index].target;
            } else if (items.name === '实际/Actual:') {
              items.value = ability[index].reality;
            } else if (items.name === '行为指标/Behaviour Indicator:') {
              items.value = ability[index].indicator;
            } else if (items.name === '发展总计划ID') {
              items.value = ability[index].projectId;
            } else if (items.name === '人员编号') {
              items.value = ability[index].menberId;
            } else if (items.name === '能力测评编号') {
              items.value = ability[index].skillTestId;
            } else if (items.name === '是否优先发展') {
              items.value = ability[index].isPrecedence;
            }
          });
        });
        this.setState({
          plainOptions
        });
        // })
      } else {
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  //获取发展行动计划表
  getDevelopmentAction = async record => {
    let res;
    let plan;
    let plans = this.state.plans;
    try {
      res = await http().getTable({
        resid: planID,
        cmwerhe: `projectId = ${record.projectId}`
      });
      plan = res.data;

      //定义发展措施
      let measures = this.cloneDeep(plans);
      let empty = emptyPlans;
      plan.forEach((item, index) => {
        empty.map(items => {
          item.key = index;
        });
        plans.push(this.cloneDeep(empty));
        measures.push(this.cloneDeep(emptyMeasures));
      });

      console.log('SquareCardArrSquareCardArr', plans, plan);
      if (plan.length > 0) {
        // ability.map((a,index) => {
        plans.forEach((item, index) => {
          item.forEach(items => {
            if (items.name === '发展措施/Measure:') {
              items.value = plan[index].measures;
            } else if (items.name === '完成日期/Deadline:') {
              items.value = plan[index].endTime;
            } else if (
              items.name === '具体行动计划/Description of concrete measures:'
            ) {
              items.value = plan[index].actionPlan;
            } else if (items.name === '发展总计划ID') {
              items.value = plan[index].projectId;
            } else if (items.name === '发展行动计划编号') {
              items.value = plan[index].moveId;
            }
          });
        });
        measures.forEach((item, index) => {
          item.forEach(items => {
            if (items.name === '发展措施/Measure:') {
              items.value = plan[index].measures;
            } else if (items.name === '完成日期/Deadline:') {
              items.value = plan[index].endTime;
            } else if (
              items.name === '具体行动计划/Description of concrete measures:'
            ) {
              items.value = plan[index].actionPlan;
            } else if (items.name === '发展总计划ID') {
              items.value = plan[index].projectId;
            } else if (items.name === '发展行动计划编号') {
              items.value = plan[index].moveId;
            } else if (items.name === '年中回顾') {
              if(record.status === '年末回顾'){
                items.authority = 'check'
              }
              items.value = plan[index].yearMid;
            } else if (items.name === '年末回顾') {
              items.value = plan[index].yearTail;
            }
          });
        });
        this.setState({
          measures
        });
        // })
      } else {
      }
      // this.setState({ SquareCardArr: res.data });
      // SquareCardArr.map(item => {
      //   item.map(items => {
      //     if (items.name === '类别/Category:') {
      //       items.value = ability.categocry;
      //     }
      //   });
      // });
      //  await this.setState({
      //     SquareCardArr
      //   })
      // if()
      // ability.categocry
      // await this.getTypes();
      // await this.getAbilitys();
    } catch (error) {
      message.error(error.message);
    }
  };
  //获取类别表
  getTypes = async () => {
    console.log('plansplansplansplans', this.state.plans);
    let SquareCardArr = this.state.SquareCardArr;
    let res;
    try {
      res = await http().getTable({
        resid: typeID
      });
      this.setState({ types: res.data });
    } catch (error) {
      message.error(error.message);
    }
    let typeArr = [];
    res.data.map(item => {
      typeArr.push(item.typeName);
    });

    SquareCardArr.map(item => {
      item.map(items => {
        if (items.name === '类别/Category:') {
          items.options = typeArr;
        }
      });
    });
    emptyAbility.map(item => {
      if (item.name === '类别/Category:') {
        item.options = typeArr;
      }
    });
    this.setState({
      SquareCardArr
    });
  };
  //获取胜任力表
  getAbilitys = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: winAbilityID
      });
      this.setState({ types: res.data });
    } catch (error) {
      message.error(error.message);
    }
    let abilityArr = [];
    res.data.map(item => {
      abilityArr.push({ type: item.linkType, ability: item.abilityName });
    });
    this.setState({
      abilityArr
    });
  };
  //获取发展措施表
  getDevelopmentMeasures = async () => {
    let plans = this.state.plans;
    let res;
    try {
      res = await http().getTable({
        resid: developmentMeasureID
      });
      this.setState({ developmentMeasures: res.data });
    } catch (error) {
      message.error(error.message);
    }
    let measuresArr = [];
    res.data.map(item => {
      measuresArr.push(item.measures);
    });
    plans.map(item => {
      item.map(items => {
        if (items.name === '发展措施/Measure:') {
          items.options = measuresArr;
        }
      });
    });
    emptyPlans.map(item => {
      if (item.name === '发展措施/Measure:') {
        item.options = measuresArr;
      }
    });
    this.setState({
      plans,
      developmentMeasures: measuresArr
    });
  };
  onDelete = async (index, type) => {
    let SquareCardArr = this.state.SquareCardArr;
    let plans = this.state.plans;
    let res;
    let record = {};
    let records = [];
    if (type === 1) {
      SquareCardArr.map((item, sindex) => {
        if (index === sindex) {
          record.categocry = item[0].value;
          record.competence = item[1].value;
          record.target = item[2].value;
          record.reality = item[3].value;
          record.indicator = item[4].value;
          record.projectId = item[5].value;
          record.menberId = item[6].value;
          record.REC_ID = item[7].value;
          records.push(this.cloneDeep(record));
        }
      });

      if (record.REC_ID) {
        try {
          res = await http().removeRecords({
            resid: abilityID,
            data: records
          });
          if (res.Error === 0) {
            message.success(res.message);
          }
        } catch (error) {
          message.error(error.message);
        }
      } else {
        return;
      }
    } else {
      plans.map((item, sindex) => {
        if (index === sindex) {
          record.measures = item[0].value;
          record.endTime = item[1].value;
          record.actionPlan = item[2].value;
          record.projectId = item[3].value;
          record.REC_ID = item[4].value;
          records.push(this.cloneDeep(record));
        }
      });
      if (record.REC_ID) {
        try {
          res = await http().removeRecords({
            resid: planID,
            data: records
          });
          if (res.Error === 0) {
            message.success(res.message);
          }
        } catch (error) {
          message.error(error.message);
        }
      } else {
        return;
      }
    }
  };
  cloneDeep = obj => {
    return JSON.parse(JSON.stringify(obj));
  };
  onSave = async () => {
    this.onSaveAbility();
    this.onSavePlans();
  };
  onSaveAbility = async () => {
    let SquareCardArr = this.state.SquareCardArr;
    let plainOptions = this.state.plainOptions;
    let record = {};
    let records = [];
    SquareCardArr.map(item => {
      record.categocry = item[0].value;
      record.competence = item[1].value;
      record.target = item[2].value;
      record.reality = item[3].value;
      record.indicator = item[4].value;
      record.projectId = item[5].value;
      record.menberId = item[6].value;
      record.skillTestId = item[7].value;
      console.log('item[8].value,', item[1].value);
      if (plainOptions.includes(item[1].value)) {
        console.log('truetruetruetrue');
        record.isPrecedence = 'Y';
      } else {
        console.log('falsefalse');
        record.isPrecedence = 'N';
      }
      records.push(this.cloneDeep(record));
    });
    let res;
    try {
      res = await http().addRecords({
        resid: abilityID,
        data: records,
        isEditOrAdd: 'true'
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  onSavePlans = async () => {
    let plans = this.state.plans;
    console.log('this.state.plans', this.state.plans);
    let planRecord = {};
    let planRecords = [];
    plans.map(item => {
      planRecord.measures = item[0].value;
      planRecord.endTime = item[1].value;
      planRecord.actionPlan = item[2].value;
      planRecord.projectId = item[3].value;
      planRecord.moveId = item[4].value;
      planRecords.push(this.cloneDeep(planRecord));
    });
    let res;
    try {
      res = await http().addRecords({
        resid: planID,
        data: planRecords,
        isEditOrAdd: 'true'
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  componentDidMount = async () => {
    let record = this.props.record;
    console.log('record', record);
    await this.getAbilityEvaluation(record);
    await this.getDevelopmentAction(record);
    await this.getTypes();
    await this.getAbilitys();
    await this.getDevelopmentMeasures();

    if (this.state.SquareCardArr.length > 0) {
    } else {
    }

    // await this.setState({
    //   personInfo: record,
    //   SquareCardArr: arr,
    //   plans: plans
    // });
    // try {
    //   res = await http().getTable({
    //     resid: abilityID,
    //     cmwerhe: `projectId = ${record.projectId}`
    //   });
    //   this.setState({ ability: res.data });
    // } catch (error) {
    //   message.error(error.message);
    // }

    // try {
    //   res = await http().getTable({
    //     resid: planID,
    //     cmwerhe: `projectId = ${record.projectId}`
    //   });
    //   this.setState({ plan: res.data });
    // } catch (error) {
    //   message.error(error.message);
    // }
  };
  onChangePostion = currentPostion => {
    console.log('onChangePostion', currentPostion);
    this.setState({
      currentPostion
    });
  };
  renderCard = () => {
    let record = this.state.record;
    //
    let centerContent = (
      <React.Fragment>
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
            </React.Fragment>
          }
          className="personPlan-contain-info"
          bordered={true}
        >
          <div style={{ display: 'flex', padding: '20px', flexWrap: 'wrap' }}>
            {this.state.SquareCardArr.map((SquareCardArr, index) => {
              return (
                <SquareCard
                  key={index}
                  SquareCardArr={SquareCardArr}
                  onRemove={subIndex => {
                    this.onRemove(subIndex, 1);
                  }}
                  index={index}
                  onChangeSelect={(subIndex, e) => {
                    this.onChangeSelect(subIndex, e, index, 1);
                  }}
                  onUpdateSquareCardArr={() => {
                    this.onUpdateSquareCardArr(SquareCardArr);
                  }}
                  onChangeTextArea={(subIndex, e) => {
                    this.onChangeTextArea(subIndex, e, index, 1);
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
            </React.Fragment>
          }
          className="personPlan-contain-info"
          bordered={true}
        >
          <div>
            <span>结合以上能力测评，请最多选出3项优先发展</span>
            <br />
            <span>
              Please choose maxi. 3 priority competencies to develop which refer
              to the assesment
            </span>
          </div>
          <div className="personPlan-contain-plan-check">
            <Checkbox.Group
              options={this.state.plainOptions}
              defaultValue={[]}
              onChange={this.onChangeCheckBox}
            />
          </div>
          <div style={{ display: 'flex', padding: '20px', flexWrap: 'wrap' }}>
            {this.state.plans &&
              this.state.plans.map((SquareCardArr, index) => {
                return (
                  <SquareCard
                    key={index}
                    SquareCardArr={SquareCardArr}
                    onRemove={() => {
                      this.onRemove(index, 2);
                    }}
                    onChangeSelect={(subIndex, e) => {
                      this.onChangeSelect(subIndex, e, index, 2);
                    }}
                    onUpdateSquareCardArr={() => {
                      this.onUpdateSquareCardArr(SquareCardArr);
                    }}
                    onChangeTextArea={(subIndex, e) => {
                      this.onChangeTextArea(subIndex, e, index, 2);
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
      </React.Fragment>
    );
    let bottomContent = (
      <React.Fragment>
      <Card
        title={
          <React.Fragment>
            <span style={{ fontSize: '16px', color: '#000' }}>
              年度回顾 - 回顾职业目标及发展措施
              <span className="personPlan-contain-info-word">
                Review of career goals and measures
              </span>
            </span>
          </React.Fragment>
        }
        className="personPlan-contain-info"
        bordered={true}
      >
        {' '}
        <div
          style={{ display: 'flex', padding: '20px', flexWrap: 'wrap' }}
        >
          {this.state.measures &&
            this.state.measures.map((SquareCardArr, index) => {
              return (
                <SquareCard
                  key={index}
                  SquareCardArr={SquareCardArr}
                  onRemove={() => {
                    this.onRemove(index, 3);
                  }}
                  onChangeSelect={(subIndex, e) => {
                    this.onChangeSelect(subIndex, e, index, 3);
                  }}
                  onUpdateSquareCardArr={() => {
                    this.onUpdateSquareCardArr(SquareCardArr);
                  }}
                  onChangeTextArea={(subIndex, e) => {
                    this.onChangeTextArea(subIndex, e, index, 3);
                  }}
                  onChangeDate={(date, dateString, subIndex) => {
                    this.onChangeDate(date, dateString, subIndex, index);
                  }}
                ></SquareCard>
              );
            })}
        </div>
      </Card>
    </React.Fragment>
    )
    console.log("状态",centerContent)
    if(record&&record.status === '填写中'){
      return (
        centerContent
      )
    }else{
      return (<React.Fragment> {centerContent}{bottomContent}</React.Fragment>)
    }
  };
  render() {
    const {
      personInfo,
      SquareCardArr,
      plans,
      plainOptions,
      measures,
      record
    } = this.state;
    return (
      <div style={{ width: '100%', display: 'flex', background: '#fff' }}>
        <div className="personPlan-contain">
          <span
            style={{
              color: 'rgba(0,0,0)',
              fontSize: '26px',
              fontWeight: 'bold',
              marginTop: '40px'
            }}
          >
            员工职业能力发展计划
          </span>
          <span
            style={{
              color: 'rgba(0,0,0,.65)',
              fontSize: '20px',
              marginBottom: '40px'
            }}
          >
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
          {this.renderCard()}:
         
          }
        </div>
        <div className="personPlan-contain-bottom">
          <div className="personPlan-contain-bottom-btns">
            <Popconfirm
              title="你确定要保存吗"
              onConfirm={this.onSave}
              okText="Yes"
              cancelText="No"
            >
              <Button className="personPlan-contain-bottom-leftbtn">
                保存
              </Button>
            </Popconfirm>
            <Popconfirm
              title="你要确认吗"
              onConfirm={this.onCheck}
              okText="Yes"
              cancelText="No"
            >
              <Button className="personPlan-contain-bottom-leftbtn">
                确认
              </Button>
            </Popconfirm>
            <Popconfirm
              title="你确定要提交吗"
              onConfirm={this.onSubmit}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                className="personPlan-contain-bottom-leftbtn"
              >
                提交
              </Button>
            </Popconfirm>
          </div>
          {/* <div>
            <Popconfirm
              title="你确定要删除吗"
              onConfirm={this.onSubmit}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="danger"
                className="personPlan-contain-bottom-rightbtn"
              >
                删除
              </Button>
            </Popconfirm>
          </div> */}
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
