import React from 'react';
import {
  message,
  Button,
  Card,
  Icon,
  Checkbox,
  Popconfirm,
  Steps,
  Popover
} from 'antd';
import './PersonPlan.less';
import http from 'Util20/api';
import SquareCard from './SquareCard';

const { Step } = Steps;
const personID = '618488751596'; //发展人员表
const abilityID = '617726097875'; //能力测评表ID
const planID = '617726587425'; //发展行动计划表ID
const typeID = '618000219009'; //类型表ID
const winAbilityID = '618000231193'; //胜任力表ID
const developmentMeasureID = '618225629802'; //发展措施表

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        状态:{' '}
        {status === 'finish'
          ? '已结束'
          : status === 'wait'
          ? '等待中'
          : '进行中'}{' '}
      </span>
    }
  >
    {dot}
  </Popover>
);

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
    type: 'tagSelect',
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
  },
  {
    name: '人员编号',
    value: '',
    type: 'none',
    options: [],
    authority: 'modify'
  },
  {
    name: '胜任力/Competency:',
    value: '',
    type: 'select',
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
  constructor(props) {
    super(props);
    this.state = {
      currentPostion: 1, //左边菜单的位置
      personInfo: {}, //个人信息
      checkType: null, //查看类型  如果是自己查看，需判断是否有权限修改，如果是主管查看，需查看主管有无权限修改，如果是HR查看，则可直接修改。
      ability: [], //能力
      types: [], //所有类别
      plans: [], //计划数组
      measures: [], //措施数组
      SquareCardArr: [], //能力数组
      yearReview: [], //年度回顾
      abilityArr: [], ////所有胜任力
      plainOptions: [], //优先发展能力数组
      checked: [], //优先发展的能力
      developmentMeasures: [] //发展措施
    };
  }

  //子组件修改下拉框，触发父组件方法
  onChangeSelect = (subIndex, e, index, type) => {
    if (type === 1) {
      let SquareCardArr = this.state.SquareCardArr;
      let abilityArr = this.state.abilityArr;
      let lastabilityArr = []; //胜任力数组
      let lastabilityDetailArr = []; //胜任力描述数组
      SquareCardArr[index][subIndex].value = e;
      if (subIndex === 0) {
        abilityArr.map(item => {
          if (item.type === e) {
            lastabilityArr.push(item.ability);
            lastabilityDetailArr.push({
              adept: item.adept,
              notAdept: item.notAdept,
              overuse: item.overuse,
              ability: item.ability
            });
          }
        });
        SquareCardArr[index][subIndex + 1].options = lastabilityArr;
        SquareCardArr[index][subIndex + 1].detailOptions = lastabilityDetailArr;
      }
      this.onChangePlainOptions();
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
  onChangeTagSelect = (subIndex, e, index, type) => {
    if (type === 1) {
      let SquareCardArr = this.state.SquareCardArr;
      let abilityArr = this.state.abilityArr;
      let lastabilityArr = [];
      SquareCardArr[index][subIndex].value = e[0];
      if (subIndex === 0) {
        abilityArr.map(item => {
          if (item.type === e[0]) {
            lastabilityArr.push(item.ability);
          }
        });
        SquareCardArr[index][subIndex + 1].options = lastabilityArr;
      }
      this.onChangePlainOptions();
      this.setState({
        SquareCardArr
      });
    } else {
      let plans = this.state.plans;
      let abilityArr = this.state.abilityArr;
      let lastabilityArr = [];
      plans[index][subIndex].value = e[0];
      if (subIndex === 0) {
        abilityArr.map(item => {
          if (item.type === e[0]) {
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

  //子组件修改checkbox，触发父组件方法
  onChangeCheckBox = checked => {
    this.setState({
      checked
    });
  };
  //子组件修改文本域，触发父组件方法
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
  //子组件修改日期，触发父组件方法
  onChangeDate = (subIndex, date, dateString, index) => {
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
  onChangePlainOptions = () => {
    let plainOptions = [];

    this.state.SquareCardArr.map(item => {
      item.forEach(items => {
        if (items.name === '胜任力/Competency:') {
          plainOptions.push(items.value);
        }
      });
    });
    emptyPlans.map(item => {
      if (item.name === '胜任力/Competency:') {
        item.options = plainOptions;
      }
    });
    this.setState({
      plainOptions
    });
  };
  //添加能力或计划
  onAdd = type => {
    let SquareCardArr = this.state.SquareCardArr;
    let plans = this.state.plans;
    switch (type) {
      case 'ability':
        emptyAbility.map(item => {
          item.key = this.state.SquareCardArr.length + 1;
        });
        SquareCardArr.push(this.cloneDeep(emptyAbility));
        this.onChangePlainOptions();
        this.setState({ SquareCardArr });
        break;
      case 'plans':
        if (!this.state.plainOptions.length) {
          return message.info('请先添加至少一项能力测评');
        }
        plans.map(item => {
          item.key = this.state.plans.length + 1;
        });
        plans.push(this.cloneDeep(emptyPlans));
        this.setState({ plans });
        break;
      default:
    }
  };

  onRemove = (index, type) => {
    let plainOptions = [];
    if (type === 1) {
      let lastArr = this.state.SquareCardArr.filter((item, aindex) => {
        return index !== aindex;
      });
      //删除后修改显示的checkbox group数组
      lastArr.map(item => {
        item.forEach(items => {
          if (items.name === '胜任力/Competency:') {
            plainOptions.push(items.value);
          }
        });
      });
      this.setState({
        plainOptions,
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
  getAbilityEvaluation = async (record, isUpdateAuth) => {
    let res;
    let ability;
    let SquareCardArr = this.state.SquareCardArr;
    let plainOptions = this.state.plainOptions;
    let checked = this.state.checked;
    try {
      res = await http().getTable({
        resid: abilityID,
        cmswhere: `projectId = '${record.projectId}' and menberId = '${record.memberId}' `
      });
      ability = res.data;
      ability.map(item => {
        if (item.competence) {
          plainOptions.push(item.competence);
          if (item.isPrecedence === 'Y') {
            checked.push(item.competence);
          }
        }
      });
      await this.setState({
        checked,
        plainOptions
      });

      let empty = emptyAbility;
      ability.forEach((item, index) => {
        empty.map(item => {
          item.key = index;
        });
        SquareCardArr.push(this.cloneDeep(empty));
      });

      if (ability.length > 0) {
        if (
          record.status === '年中回顾' ||
          record.status === '年末回顾' ||
          record.status === '已完成' ||
          isUpdateAuth !== 'Y' ||
          (record.isMangerSubmit === 'Y' &&
            this.props.checkType !== 'oneself') ||
          (record.isPersonSubmit === 'Y' && this.props.checkType === 'oneself')
        ) {
          SquareCardArr.forEach((item, index) => {
            item.forEach(items => {
              if (items.name === '类别/Category:') {
                items.value = ability[index].categocry;
                items.authority = 'check';
              } else if (items.name === '胜任力/Competency:') {
                items.value = ability[index].competence;
                items.options = this.state.abilityArr
                  .filter(i => i.type === item[0].value)
                  .map(i => i.ability);
                items.authority = 'check';
              } else if (items.name === '目标/Target:') {
                items.value = ability[index].target;
                items.authority = 'check';
              } else if (items.name === '实际/Actual:') {
                items.value = ability[index].reality;
                items.authority = 'check';
              } else if (items.name === '行为指标/Behaviour Indicator:') {
                items.value = ability[index].indicator;
                items.authority = 'check';
              } else if (items.name === '发展总计划ID') {
                items.value = ability[index].projectId;
                items.authority = 'check';
              } else if (items.name === '人员编号') {
                items.value = ability[index].menberId;
                items.authority = 'check';
              } else if (items.name === '能力测评编号') {
                items.value = ability[index].skillTestId;
                items.authority = 'check';
              } else if (items.name === '是否优先发展') {
                items.value = ability[index].isPrecedence;
                items.authority = 'check';
              }
            });
          });
        } else {
          SquareCardArr.forEach((item, index) => {
            // console.log('item',item)
            item.forEach(items => {
              if (items.name === '类别/Category:') {
                items.value = ability[index].categocry;
              } else if (items.name === '胜任力/Competency:') {
                items.options = this.state.abilityArr
                  .filter(i => i.type === item[0].value)
                  .map(i => {
                    // console.log(i);
                    return i.ability;
                  });
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
        }
        this.setState({ SquareCardArr });
        // })
      } else {
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  //获取发展行动计划表
  getDevelopmentAction = async (record, isUpdateAuth) => {
    let res;
    let plan;
    let plans = this.state.plans;
    let personInfo = this.state.personInfo;
    try {
      res = await http().getTable({
        resid: planID,
        cmswhere: `projectId = '${record.projectId}' and menberId = '${record.memberId}' `
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

      if (plan.length > 0) {
        if (
          personInfo.status === '年中回顾' ||
          personInfo.status === '年末回顾' ||
          personInfo.status === '已完成' ||
          (personInfo.isMangerSubmit === 'Y' &&
            this.props.checkType !== 'oneself') ||
          (personInfo.isPersonSubmit === 'Y' &&
            this.props.checkType === 'oneself') ||
          isUpdateAuth !== 'Y'
        ) {
          plans.forEach((item, index) => {
            item.forEach(items => {
              if (items.name === '胜任力/Competency:') {
                items.value = plan[index].ability;
                items.authority = 'check';
              } else if (items.name === '发展措施/Measure:') {
                items.value = plan[index].measures;
                items.authority = 'check';
              } else if (items.name === '完成日期/Deadline:') {
                items.value = plan[index].endTime;
                items.authority = 'check';
              } else if (
                items.name === '具体行动计划/Description of concrete measures:'
              ) {
                items.value = plan[index].actionPlan;
                items.authority = 'check';
              } else if (items.name === '发展总计划ID') {
                items.value = plan[index].projectId;
                items.authority = 'check';
              } else if (items.name === '发展行动计划编号') {
                items.value = plan[index].moveId;
                items.authority = 'check';
              } else if (items.name === '人员编号') {
                items.value = plan[index].menberId;
                items.authority = 'check';
              }
            });
          });
        } else {
          console.log('Competency', this.state.plainOptions);
          plans.forEach((item, index) => {
            item.forEach(items => {
              if (items.name === '胜任力/Competency:') {
                items.value = plan[index].ability;
              } else if (items.name === '发展措施/Measure:') {
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
              } else if (items.name === '人员编号') {
                items.value = plan[index].menberId;
              }
            });
          });
        }

        measures.forEach((item, index) => {
          item.forEach(items => {
            if (items.name === '胜任力/Competency:') {
              items.value = plan[index].ability;
            } else if (items.name === '发展措施/Measure:') {
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
              if (record.status === '年末回顾' || record.status === '已完成') {
                items.authority = 'check';
              }
              items.value = plan[index].yearMid;
            } else if (items.name === '年末回顾') {
              if (record.status === '年中回顾' || record.status === '已完成') {
                items.type = 'none';
              }
              items.value = plan[index].yearTail;
            }
          });
        });
        this.setState({
          measures
        });
      } else {
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  //获取类别表
  getTypes = async () => {
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
      abilityArr.push({
        type: item.linkType,
        ability: item.abilityName,
        adept: item.C3_622921779282,
        notAdept: item.C3_622921790616,
        overuse: item.C3_622921804575
      });
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
    console.log('measuresArr', measuresArr);
    plans.map(item => {
      item.map(items => {
        if (items.name === '发展措施/Measure:') {
          items.options = measuresArr;
        } else if (items.name === '胜任力/Competency:') {
          items.options = this.state.plainOptions;
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
    try {
      this.state.SquareCardArr.forEach(SquareCard => {
        SquareCard.forEach(item => {
          if (item.name === '能力测评编号' || item.name === '是否优先发展') {
            return;
          }
          if (!item.value.trim()) {
            throw new Error('请将能力测评内容填写完整');
          }
        });
      });
    } catch (error) {
      return message.info(error.message);
    }
    try {
      this.state.plans.forEach(plan => {
        plan.forEach(item => {
          if (item.name === '发展行动计划编号') {
            return;
          }
          if (!item.value.trim()) {
            throw new Error('请将职业能力发展计划内容填写完整');
          }
        });
      });
    } catch (error) {
      return message.info(error.message);
    }
    this.onSaveAbility();
    this.onSavePlans();
    this.props.goBack();
  };
  onSubmit = async () => {
    this.onSaveAbility();
    this.onSavePlans();
    let res;
    let personInfo = this.state.personInfo;
    if (this.state.checkType === 'oneself') {
      personInfo.isPersonSubmit = 'Y';
    } else {
      personInfo.isMangerSubmit = 'Y';
    }
    try {
      res = await http().modifyRecords({
        resid: personID,
        data: [personInfo]
      });
      if (res.Error === 0) {
        // message.success(res.message);
        this.props.goBack();
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  onSubmitMid = async () => {
    this.onSaveAbility();
    this.onSavePlans();
    let res;
    let personInfo = this.state.personInfo;
    personInfo.yearMidSubmit = 'Y';
    personInfo.midManageApply = '';
    try {
      res = await http().modifyRecords({
        resid: personID,
        data: [personInfo]
      });
      if (res.Error === 0) {
        // message.success(res.message);
        this.props.goBack();
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  onSubmitTail = async () => {
    this.onSaveAbility();
    this.onSavePlans();
    let res;
    let personInfo = this.state.personInfo;
    personInfo.yearTailSubmit = 'Y';
    personInfo.tailManageApply = '';
    try {
      res = await http().modifyRecords({
        resid: personID,
        data: [personInfo]
      });
      if (res.Error === 0) {
        // message.success(res.message);
        this.props.goBack();
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  onAffirm = async () => {
    this.onSavePlans();
    let res;
    let personInfo = this.state.personInfo;
    personInfo.isAffirm = 'Y';
    try {
      res = await http().modifyRecords({
        resid: personID,
        data: [personInfo]
      });
      if (res.Error === 0) {
        message.success(res.message);
        this.props.goBack();
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  //确认年中回顾
  onAffirmMid = async () => {
    this.onSavePlans();
    let res;
    let personInfo = this.state.personInfo;
    personInfo.midManageApply = 'Y';
    try {
      res = await http().modifyRecords({
        resid: personID,
        data: [personInfo]
      });
      if (res.Error === 0) {
        message.success(res.message);
        this.props.goBack();
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  //确认年末回顾
  onAffirmTail = async () => {
    this.onSavePlans();
    let res;
    let personInfo = this.state.personInfo;
    personInfo.tailManageApply = 'Y';
    try {
      res = await http().modifyRecords({
        resid: personID,
        data: [personInfo]
      });
      if (res.Error === 0) {
        message.success(res.message);
        this.props.goBack();
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  //退回操作
  onReject = async type => {
    let personInfo = this.state.personInfo;
    if (type === 'mid') {
      personInfo.midManageApply = 'N';
      personInfo.yearMidSubmit = '';
      personInfo.midYearReturnEmail = 'N';
      personInfo.noticeMidYearEmail = 'N';
    } else {
      personInfo.tailManageApply = 'N';
      personInfo.yearTailSubmit = '';
      personInfo.tailYearReturnEmail = 'N';
      personInfo.noticeTailSubmit = 'N';
    }
    let res;
    try {
      res = await http().modifyRecords({
        resid: personID,
        data: [personInfo]
      });
      if (res.Error === 0) {
        message.success(res.message);
        this.props.goBack();
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  onSaveAbility = async () => {
    let SquareCardArr = this.state.SquareCardArr;
    let checked = this.state.checked;
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
      if (checked.includes(item[1].value)) {
        record.isPrecedence = 'Y';
      } else {
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
    let measures = this.state.measures;
    let planRecord = {};
    let planRecords = [];
    plans.map(item => {
      planRecord.measures = item[0].value;
      planRecord.endTime = item[1].value;
      planRecord.actionPlan = item[2].value;
      planRecord.projectId = item[3].value;
      planRecord.moveId = item[4].value;
      planRecord.menberId = item[5].value;
      planRecord.ability = item[6].value;
      measures.map(items => {
        if (items[3].value === item[4].value) {
          planRecord.yearMid = items[4].value;
          planRecord.yearTail = items[5].value;
        }
      });
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
        // message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  judgeRender = () => {
    let personInfo = this.state.personInfo;
    if (this.props.role === 'HR') {
      return false;
    }
    if (
      personInfo.status === '年中回顾' ||
      personInfo.status === '年末回顾' ||
      personInfo.status === '已完成' ||
      (personInfo.isMangerSubmit === 'Y' &&
        this.props.checkType !== 'oneself') ||
      (personInfo.isPersonSubmit === 'Y' &&
        this.props.checkType === 'oneself') ||
      this.state.isUpdateAuth !== 'Y'
    ) {
      return true;
    } else {
      return false;
    }
  };
  componentDidMount = async () => {
    let record = this.props.record;
    let isUpdateAuth; //是否有权限修改
    this.setState({
      personInfo: this.props.record,
      checkType: this.props.checkType
    });
    if (record.isUpdateAuth === 'Y' && this.props.checkType === 'oneself') {
      isUpdateAuth = 'Y';
    } else if (
      this.props.checkType !== 'oneself' &&
      record.isMangerUpdateAuth === 'Y'
    ) {
      isUpdateAuth = 'Y';
    } else if (this.props.role === 'HR') {
      isUpdateAuth = 'Y';
    }
    this.setState({
      isUpdateAuth
    });
    await this.getAbilitys();
    await this.getAbilityEvaluation(record, isUpdateAuth);
    await this.getDevelopmentAction(record, isUpdateAuth);
    await this.getTypes();
    await this.getDevelopmentMeasures();
    emptyAbility.forEach(item => {
      if (item.name === '发展总计划ID') {
        item.value = record.projectId;
      }
      if (item.name === '人员编号') {
        item.value = record.memberId;
      }
    });
    emptyPlans.forEach(item => {
      if (item.name === '发展总计划ID') {
        item.value = record.projectId;
      }
      if (item.name === '人员编号') {
        item.value = record.memberId;
      }
    });
  };
  onChangePostion = currentPostion => {
    this.setState({
      currentPostion
    });
  };
  renderCard = () => {
    let personInfo = this.state.personInfo;
    let centerContent = (
      <React.Fragment>
        <Card
          title={
            <React.Fragment>
              <span style={{ fontSize: '16px', color: '#000' }}>
                能力测评 - 选出目前及未来需要发展的3-6项能力
                <span className="personPlan-contain-info-word">
                  Competency Assessment - Choose 3~6 compentecies meet
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
                  icon={this.judgeRender() ? 'noClose' : null}
                  key={index}
                  SquareCardArr={SquareCardArr}
                  onRemove={subIndex => {
                    this.onRemove(subIndex, 1);
                  }}
                  index={index}
                  onChangeSelect={(subIndex, e) => {
                    this.onChangeSelect(subIndex, e, index, 1);
                  }}
                  onChangeTagSelect={(subIndex, e) => {
                    this.onChangeTagSelect(subIndex, e, index, 1);
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

            {this.judgeRender() ? null : (
              <Card
                className="personPlan-contain-smallcards-card"
                onClick={() => {
                  this.onAdd('ability');
                }}
                hidden={this.state.SquareCardArr.length > 5}
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
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                >
                  添加新的能力
                </span>
                <span style={{ color: '#999' }}>Add a new compentecy</span>
              </Card>
            )}
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
              to the assessment
            </span>
          </div>
          {/* <div className="personPlan-contain-plan-check">
            <Checkbox.Group
              options={this.state.plainOptions}
              value={[...this.state.checked]}
              onChange={this.onChangeCheckBox}
              disabled={this.judgeRender()}
            />
          </div> */}
          <div style={{ display: 'flex', padding: '20px', flexWrap: 'wrap' }}>
            {this.state.plans &&
              this.state.plans.map((SquareCardArr, index) => {
                return (
                  <SquareCard
                    icon={this.judgeRender() ? 'noClose' : null}
                    key={index}
                    SquareCardArr={SquareCardArr}
                    onRemove={() => {
                      this.onRemove(index, 2);
                    }}
                    onChangeSelect={(subIndex, e) => {
                      this.onChangeSelect(subIndex, e, index, 2);
                    }}
                    onChangeTagSelect={(subIndex, e) => {
                      this.onChangeTagSelect(subIndex, e, index, 2);
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
            {this.judgeRender() ? null : (
              <Card
                className="personPlan-contain-smallcards-card"
                hidden={this.state.plans.length > 2}
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
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                >
                  添加新的发展计划
                </span>
                <span style={{ color: '#999' }}>
                  Add a new development plan
                </span>
              </Card>
            )}
          </div>
        </Card>
      </React.Fragment>
    );
    let bottomContent = (
      <React.Fragment>
        {personInfo && personInfo.status !== '初次填写' ? (
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
            <div style={{ display: 'flex', padding: '20px', flexWrap: 'wrap' }}>
              {this.state.measures &&
                this.state.measures.map((SquareCardArr, index) => {
                  return (
                    <SquareCard
                      key={index}
                      icon="noClose"
                      SquareCardArr={SquareCardArr}
                      onRemove={() => {
                        this.onRemove(index, 3);
                      }}
                      onChangeSelect={(subIndex, e) => {
                        this.onChangeSelect(subIndex, e, index, 3);
                      }}
                      onChangeTagSelect={(subIndex, e) => {
                        this.onChangeTagSelect(subIndex, e, index, 3);
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
        ) : null}
      </React.Fragment>
    );
    if (personInfo && personInfo.status === '填写中') {
      return centerContent;
    } else {
      return (
        <React.Fragment>
          {centerContent}
          {bottomContent}
        </React.Fragment>
      );
    }
  };

  renderSaveBtn = () => {
    if (this.props.role === 'HR') {
      return (
        <Popconfirm
          title="你确定要保存吗"
          onConfirm={this.onSave}
          okText="Yes"
          cancelText="No"
        >
          <Button className="personPlan-contain-bottom-leftbtn">保存</Button>
        </Popconfirm>
      );
    } else {
      if (
        this.state.checkType === 'oneself' &&
        this.state.isUpdateAuth === 'Y' &&
        this.state.personInfo.isPersonSubmit !== 'Y' &&
        this.state.personInfo.isAffirm !== 'Y'
      ) {
        return (
          <Popconfirm
            title="你确定要保存吗"
            onConfirm={this.onSave}
            okText="Yes"
            cancelText="No"
          >
            <Button className="personPlan-contain-bottom-leftbtn">保存</Button>
          </Popconfirm>
        );
      } else if (
        this.state.checkType !== 'oneself' &&
        this.state.isUpdateAuth === 'Y' &&
        this.state.personInfo.isMangerSubmit !== 'Y' &&
        this.state.personInfo.isAffirm !== 'Y' &&
        this.state.personInfo.status !== '已完成'
      ) {
        return (
          <Popconfirm
            title="你确定要保存吗"
            onConfirm={this.onSave}
            okText="Yes"
            cancelText="No"
          >
            <Button className="personPlan-contain-bottom-leftbtn">保存</Button>
          </Popconfirm>
        );
      } else if (
        this.state.checkType == 'oneself' &&
        this.state.personInfo.yearMidSubmit !== 'Y' &&
        this.state.personInfo.status === '年中回顾'
      ) {
        return (
          <Popconfirm
            title="你确定要保存吗"
            onConfirm={this.onSave}
            okText="Yes"
            cancelText="No"
          >
            <Button className="personPlan-contain-bottom-leftbtn">保存</Button>
          </Popconfirm>
        );
      } else if (
        this.state.checkType == 'oneself' &&
        this.state.personInfo.yearTailSubmit !== 'Y' &&
        this.state.personInfo.status === '年末回顾'
      ) {
        return (
          <Popconfirm
            title="你确定要保存吗"
            onConfirm={this.onSave}
            okText="Yes"
            cancelText="No"
          >
            <Button className="personPlan-contain-bottom-leftbtn">保存</Button>
          </Popconfirm>
        );
      }
    }
  };
  renderSubmitBtn = () => {
    if (this.props.role === 'HR') {
      return (
        <Popconfirm
          title="你确定要提交吗"
          onConfirm={this.onSubmit}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" className="personPlan-contain-bottom-leftbtn">
            提交
          </Button>
        </Popconfirm>
      );
    } else {
      if (
        this.state.checkType === 'oneself' &&
        this.state.isUpdateAuth === 'Y' &&
        this.state.personInfo.isPersonSubmit !== 'Y' &&
        this.state.personInfo.isAffirm !== 'Y'
      ) {
        return (
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
        );
      } else if (
        this.state.checkType !== 'oneself' &&
        this.state.isUpdateAuth === 'Y' &&
        this.state.personInfo.isMangerSubmit !== 'Y' &&
        this.state.personInfo.isAffirm !== 'Y' &&
        this.state.personInfo.status !== '已完成'
      ) {
        return (
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
        );
      } else if (
        this.state.checkType === 'oneself' &&
        this.state.personInfo.isAffirm === 'Y' &&
        this.state.personInfo.yearMidSubmit !== 'Y' &&
        this.state.personInfo.status !== '已完成'
      ) {
        return (
          <Popconfirm
            title="你确定要提交吗"
            onConfirm={this.onSubmitMid}
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
        );
      } else if (
        this.state.checkType === 'oneself' &&
        this.state.personInfo.isAffirm === 'Y' &&
        this.state.personInfo.yearMidSubmit === 'Y' &&
        this.state.personInfo.yearTailSubmit !== 'Y' &&
        this.state.personInfo.status === '年末回顾'
      ) {
        return (
          <Popconfirm
            title="你确定要提交吗"
            onConfirm={this.onSubmitTail}
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
        );
      }
    }
  };
  render() {
    const { personInfo } = this.state;
    const { record } = this.props;
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ marginTop: '16px', marginLeft: '32px' }}>
          <Steps
            current={
              record && record.status === '初次填写'
                ? 0
                : record && record.status === '年中回顾'
                ? 1
                : 3
            }
            progressDot={customDot}
          >
            <Step title="初次填写" style={{ color: '#fff' }} />
            <Step title="年中回顾" style={{ color: '#fff' }} />
            <Step title="年末回顾" style={{ color: '#fff' }} />
          </Steps>
        </div>
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
          <span
            style={{
              color: '#999',
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
                  Personal Information
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
                <span className="personPlan-contain-info-filed-wordValue">
                  {personInfo.jobNumber}
                </span>
              </div>
              <div className="personPlan-contain-info-filed">
                <span className="personPlan-contain-info-filed-word">
                  姓名：
                </span>
                <span className="personPlan-contain-info-filed-wordValue">
                  {personInfo.memberName}
                </span>
              </div>
              <div className="personPlan-contain-info-filed">
                <span className="personPlan-contain-info-filed-word">
                  主管编号：
                </span>
                <span className="personPlan-contain-info-filed-wordValue">
                  {personInfo.directorId}
                </span>
              </div>
              <div className="personPlan-contain-info-filed">
                <span className="personPlan-contain-info-filed-word">
                  部门：
                </span>
                <span className="personPlan-contain-info-filed-wordValue">
                  {personInfo.department}
                </span>
              </div>
              <div className="personPlan-contain-info-filed">
                <span className="personPlan-contain-info-filed-word">
                  级别：
                </span>
                <span className="personPlan-contain-info-filed-wordValue">
                  {personInfo.level}
                </span>
              </div>
              <div className="personPlan-contain-info-filed">
                <span className="personPlan-contain-info-filed-word">
                  人数：
                </span>
                <span className="personPlan-contain-info-filed-wordValue">
                  {personInfo.num}
                </span>
              </div>
              <div className="personPlan-contain-info-filed">
                <span className="personPlan-contain-info-filed-word">
                  发起时间：
                </span>
                <span className="personPlan-contain-info-filed-wordValue">
                  {personInfo.startTime}
                </span>
              </div>
            </div>
          </Card>
          {this.renderCard()}
        </div>
        <div
          className="personPlan-contain-bottom"
          style={this.props.role === 'HR' ? { display: 'none' } : {}}
        >
          <div className="personPlan-contain-bottom-btns">
            {this.renderSaveBtn()}
            {this.state.checkType === 'oneself' &&
            this.state.personInfo.isMangerSubmit === 'Y' &&
            this.state.personInfo.isAffirm !== 'Y' ? (
              <Popconfirm
                title="你要确认吗"
                onConfirm={this.onAffirm}
                okText="Yes"
                cancelText="No"
              >
                <Button className="personPlan-contain-bottom-leftbtn">
                  确认
                </Button>
              </Popconfirm>
            ) : this.state.checkType !== 'oneself' &&
              this.state.personInfo.isPersonSubmit === 'Y' &&
              this.state.personInfo.isAffirm !== 'Y' ? (
              <Popconfirm
                title="你要确认吗"
                onConfirm={this.onAffirm}
                okText="Yes"
                cancelText="No"
              >
                <Button className="personPlan-contain-bottom-leftbtn">
                  确认
                </Button>
              </Popconfirm>
            ) : null}

            {this.state.checkType !== 'oneself' &&
            this.state.personInfo.yearMidSubmit === 'Y' &&
            this.state.personInfo.midManageApply !== 'Y' &&
            this.state.personInfo.midManageApply !== 'N' ? (
              <Popconfirm
                title="你要确认吗"
                onConfirm={this.onAffirmMid}
                okText="Yes"
                cancelText="No"
              >
                <Button className="personPlan-contain-bottom-leftbtn">
                  确认年中回顾
                </Button>
              </Popconfirm>
            ) : null}

            {this.state.checkType !== 'oneself' &&
            this.state.personInfo.yearMidSubmit === 'Y' &&
            this.state.personInfo.midManageApply !== 'Y' &&
            this.state.personInfo.midManageApply !== 'N' ? (
              <Popconfirm
                title="你确定要退回吗"
                onConfirm={() => {
                  this.onReject('mid');
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  className="personPlan-contain-bottom-leftbtn"
                  type="danger"
                >
                  退回年中回顾
                </Button>
              </Popconfirm>
            ) : null}

            {this.state.checkType !== 'oneself' &&
            this.state.personInfo.yearTailSubmit === 'Y' &&
            this.state.personInfo.tailManageApply !== 'Y' &&
            this.state.personInfo.tailManageApply !== 'N' ? (
              <Popconfirm
                title="你确定要退回吗"
                onConfirm={() => {
                  this.onReject('tail');
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  className="personPlan-contain-bottom-leftbtn"
                  type="danger"
                >
                  退回年末回顾
                </Button>
              </Popconfirm>
            ) : null}
            {this.state.checkType !== 'oneself' &&
            this.state.personInfo.yearTailSubmit === 'Y' &&
            this.state.personInfo.tailManageApply !== 'Y' &&
            this.state.personInfo.tailManageApply !== 'N' ? (
              <Popconfirm
                title="你要确认吗"
                onConfirm={this.onAffirmTail}
                okText="Yes"
                cancelText="No"
              >
                <Button className="personPlan-contain-bottom-leftbtn">
                  确认年末回顾
                </Button>
              </Popconfirm>
            ) : null}

            {this.renderSubmitBtn()}
          </div>
        </div>
      </div>
    );
  }
}

export default PersonPlan;
