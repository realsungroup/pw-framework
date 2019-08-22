import React from 'react';
import './ProbationObjectives.less';
import {
  Card,
  Select,
  Input,
  Icon,
  InputNumber,
  Popconfirm,
  Button
} from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const ProbationObjectives = props => {
  let { probationObjectives, assessmentCycle } = props;
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
          <div className="probation-objectives_fill-stage_show-area">
            <div className="probation-objectives_fill-stage_show-area_header">
              <div className=" probation-objectives_fill-stage_show-area_header_item">
                序号
              </div>
              <div className=" probation-objectives_fill-stage_show-area_header_item">
                工作目标
              </div>
              <div className=" probation-objectives_fill-stage_show-area_header_item">
                评估指标
              </div>
              {hasOperation && (
                <div className=" probation-objectives_fill-stage_show-area_header_item">
                  操作
                </div>
              )}
            </div>
            <div className="probation-objectives_fill-stage_show-area_content">
              {probationObjectives.map((item, index) => (
                <div className="probation-objectives_fill-stage_show-area_content_item">
                  <div className="probation-objectives_fill-stage_show-area_content_item__no">
                    {index + 1}
                  </div>
                  <div className="probation-objectives_fill-stage_show-area_content_item__objective">
                    {item.target}
                  </div>
                  <div className="probation-objectives_fill-stage_show-area_content_item__assessment">
                    {item.assessment}
                  </div>
                  {hasOperation && (
                    <div className="probation-objectives_fill-stage_show-area_content_item__actions">
                      <a
                        href="javascript:;"
                        onClick={() =>
                          props.openModifyProbationObjectiveModal(item, index)
                        }
                      >
                        修改
                      </a>
                      &nbsp;|&nbsp;
                      <Popconfirm
                        title="确认删除吗？"
                        onConfirm={() => props.removeObjective(index)}
                      >
                        <a href="javascript:;">删除</a>
                      </Popconfirm>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {props.auth.hasAdd && (
            <div className="probation-objectives_fill-stage_fill-area">
              <div className="probation-objectives_fill-stage_fill-area_item">
                <span>工作目标：</span>
                <TextArea
                  placeholder="请输入工作目标"
                  value={props.addProbationObjective.objective}
                  rows={4}
                  onChange={v => {
                    props.onAddProbationObjectiveChange({
                      ...props.addProbationObjective,
                      objective: v.target.value
                    });
                  }}
                />
              </div>
              <div className="probation-objectives_fill-stage_fill-area_item">
                <span>评估指标：</span>
                <TextArea
                  placeholder="请输入评估指标"
                  value={props.addProbationObjective.assessment}
                  onChange={v => {
                    props.onAddProbationObjectiveChange({
                      ...props.addProbationObjective,
                      assessment: v.target.value
                    });
                  }}
                  rows={4}
                />
              </div>
              <div className="probation-objectives_fill-stage_fill-area_item probation-objectives_fill-stage_fill-area_action">
                <Button type="primary" onClick={props.addObjective}>
                  添加
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="probation-objectives_audit-stage">
          {probationObjectives.map(item => (
            <div className="probation-objectives_audit-stage_objective-card">
              <div className="probation-objectives_audit-stage_objective-card_item">
                <h4>工作目标/Objectives</h4>
                <p>{item.target}</p>
              </div>
              <div className="probation-objectives_audit-stage_objective-card_item">
                <h4>评估指标/Objectives</h4>
                <p>{item.assessment}</p>
              </div>
              <div className="probation-objectives_audit-stage_objective-card_item">
                <div className="probation-objectives_audit-stage_objective-card_item__assessment-card">
                  <div className="assessment-card_item">
                    <p>评估周期/Assessment Cycle</p>
                    <p>3个月</p>
                  </div>
                  <div className="assessment-card_item">
                    <p>目标绩效完成评估/Comments</p>
                    <TextArea rows="8" placeholder="请输入评估" />
                  </div>
                  <div className="assessment-card_item">
                    <span>评分/Mark</span>
                    <InputNumber min={0} max={10} />
                  </div>
                </div>
                <div className="probation-objectives_audit-stage_objective-card_item__assessment-card">
                  <div className="assessment-card_item">
                    <p>评估周期/Assessment Cycle</p>
                    <p>5个月</p>
                  </div>
                  <div className="assessment-card_item">
                    <p>目标绩效完成评估/Comments</p>
                    <TextArea rows="8" placeholder="请输入评估" />
                  </div>
                  <div className="assessment-card_item">
                    <span>评分/Mark</span>
                    <InputNumber min={0} max={10} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProbationObjectives;
