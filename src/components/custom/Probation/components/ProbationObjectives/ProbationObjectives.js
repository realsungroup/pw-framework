import React from 'react';
import './ProbationObjectives.less';
import { Card, Select, Input, Icon, InputNumber, Popconfirm } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const ProbationObjectives = props => {
  let { probationObjectives, assessmentCycle } = props;
  return (
    <div id="probation-objectives" className="probation-form">
      <Card
        title={
          <React.Fragment>
            <span className="card_title_name__zh">试用期工作目标</span>
            <span className="card_title_name__en">Probation Objectives</span>
          </React.Fragment>
        }
      >
        <div>
          <p>
            ※绩效评分标准Standard for Evaluation：
            <br />
            &nbsp;&nbsp;&nbsp;5-实际达成大大超过原定目标（达成率130%-150%； 4-
            实际达成超过原定目标（达成率105%-129%）；
            3-实际达成达到原定目标（达成率95%-104%）；
            <br />
            &nbsp;&nbsp;&nbsp;2-实际达成低于原定目标（达成率70-96%）；
            1-实际达成远远低于目标（达成率50-69%）；
            <br />
            &nbsp;&nbsp;&nbsp;评分在3分以下的目标请在“评语”栏说明改进措施。
          </p>
        </div>
        <div className="probation-objectives_cards">
          {probationObjectives.map((item, index) => (
            <div className="probation-objectives_card__wrapper">
              <div className="probation-objectives_card">
                <Popconfirm
                  title="确认删除吗？"
                  icon={
                    <Icon type="question-circle-o" style={{ color: 'red' }} />
                  }
                  onConfirm={() => {
                    props.removeObjective(index);
                  }}
                >
                  <Icon
                    type="close"
                    className="probation-objectives_card_action-btn__delete"
                  />
                </Popconfirm>
                <div className="probation-objectives_card_item">
                  评估周期/Assessment Cycle
                  <Select
                    style={{ width: 80, marginLeft: '1.25vw' }}
                    placeholder="请选择"
                    value={item.cycle}
                    onChange={v => {
                      item.cycle = v;
                      props.modifyObjective(index, item);
                    }}
                  >
                    {assessmentCycle.map(item => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="probation-objectives_card_item">
                  工作目标/Objectives
                  <TextArea
                    placeholder="请输入工作目标"
                    rows={3}
                    value={item.target}
                    onChange={v => {
                      item.target = v.target.value;
                      props.modifyObjective(index, item);
                    }}
                  />
                </div>
                <div className="probation-objectives_card_item">
                  结果指标/Measurable Indicator
                  <TextArea
                    placeholder="请输入结果指标"
                    rows={3}
                    value={item.quota}
                    onChange={v => {
                      item.quota = v.target.value;
                      props.modifyObjective(index, item);
                    }}
                  />
                </div>
                <div className="probation-objectives_card_item">
                  目标绩效完成评估/Comments
                  <TextArea
                    placeholder="请输入目标绩效完成评估"
                    value={item.assessment}
                    rows={3}
                    onChange={v => {
                      item.assessment = v.target.value;
                      props.modifyObjective(index, item);
                    }}
                  />
                </div>
                <div className="probation-objectives_card_item probation-objectives_card_item__mark">
                  评分/Mark
                  <InputNumber
                    min={0}
                    max={10}
                    defaultValue={0}
                    value={item.score}
                    onChange={v => {
                      console.log(v);
                      item.score = v;
                      props.modifyObjective(index, item);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="probation-objectives_card__wrapper">
            <div
              className="probation-objectives_card__addition"
              onClick={props.addObjective}
            >
              <div className="probation-objectives_card__addition_icon">
                <Icon type="plus" />
              </div>
              <div>
                <p>添加新的工作目标</p>
                <p>Add a new objective</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProbationObjectives;
