import React from 'react';
import './ProbationObjectives.less';
import { Card, Input, Icon, InputNumber, Popconfirm, Button } from 'antd';

const { TextArea } = Input;
const resid1 = '619808533610';
const ProbationObjectives = props => {
  let { probationObjectives, modifyObjective } = props;
  const hasOperation = props.auth.hasDelete && props.auth.hasModify;
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
        <div className="probation-objectives_fill-stage">
          {props.auth.hasAdd && (
            <div className="probation-objectives_fill-stage_fill-area">
              <div className="probation-objectives_fill-stage_fill-area_action">
                <Button
                  type="primary"
                  className="probation-objectives_fill-stage_fill-area_action__addbtn"
                  onClick={props.addObjective}
                >
                  添加
                </Button>
                <Button
                  type="primary"
                  onClick={props.openModifyProbationObjectiveModal}
                >
                  历史修改记录
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="probation-objectives_audit-stage">
          {probationObjectives.map((item, index) => (
            <div className="probation-objectives_audit-stage_objective-card">
              {props.auth.hasDelete && (
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
                    className="probation-objectives_audit-stage_objective-card_btn__delete"
                  />
                </Popconfirm>
              )}
              <div className="probation-objectives_audit-stage_objective-card_item">
                <h4>工作目标/Objectives</h4>
                <TextArea
                  placeholder="请输入工作目标"
                  value={item.target}
                  disabled={!hasOperation}
                  onChange={v => {
                    modifyObjective(index, {
                      ...item,
                      target: v.target.value
                    });
                  }}
                  rows={4}
                />
              </div>
              <div className="probation-objectives_audit-stage_objective-card_item">
                <h4>结果指标/Measurable Indicator</h4>
                <TextArea
                  value={item.quota}
                  placeholder="请输入结果指标"
                  disabled={!hasOperation}
                  rows={4}
                  onChange={v => {
                    modifyObjective(index, {
                      ...item,
                      quota: v.target.value
                    });
                  }}
                />
              </div>
              <div className="probation-objectives_audit-stage_objective-card_item">
                {item[resid1] &&
                  item[resid1].map((i, ind) => {
                    return (
                      <div className="probation-objectives_audit-stage_objective-card_item__assessment-card">
                        <div className="assessment-card_item">
                          <p>评估周期/Assessment Cycle</p>
                          <p style={{ color: '#2593fc' }}>{i.period}</p>
                        </div>
                        <div className="assessment-card_item">
                          <p>目标绩效完成评估/Comments</p>
                          <TextArea
                            rows="8"
                            placeholder="请输入评估"
                            disabled={!hasOperation}
                            value={i.assessment}
                            onChange={v => {
                              let data = [...item[resid1]];
                              data[ind] = { ...i, assessment: v.target.value };
                              modifyObjective(index, {
                                ...item,
                                [resid1]: data
                              });
                            }}
                          />
                        </div>
                        <div className="assessment-card_item">
                          <span>评分/Mark</span>
                          <InputNumber
                            min={0}
                            max={10}
                            value={i.score}
                            disabled={!hasOperation}
                            onChange={v => {
                              let data = [...item[resid1]];
                              data[ind] = { ...i, score: v };
                              modifyObjective(index, {
                                ...item,
                                [resid1]: data
                              });
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProbationObjectives;
