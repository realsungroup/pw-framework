import React from 'react';
import './IndividualSummary.less';
import { Card, Input } from 'antd';

const { TextArea } = Input;

/**
 * @description 试用期个人总结
 * @author 邓铭
 */

const IndividualSummary = React.memo(props => {
  const {
    roleName,
    editable,
    directorEvaluate,
    directorEvaluateChange,
    managerEvaluate,
    managerEvaluateChange,
    hrManagerEvaluate,
    hrManagerEvaluateChange
  } = props;
  const disabled = !((roleName === 'HR' || roleName === '员工') && editable);
  // const time = moment(props.endTime);
  return (
    <div id="individual-summary" className="probation-form">
      <Card
        title={
          <React.Fragment>
            <span className="card_title_name__zh">试用期个人小结</span>
            <span className="card_title_name__en">Individual Summary</span>
          </React.Fragment>
        }
      >
        <TextArea
          placeholder="请输入个人小结"
          value={props.summary}
          disabled={disabled}
          onChange={v => {
            props.summaryChange(v.target.value);
          }}
          rows={5}
        />
      </Card>
      {(roleName === 'HR' || roleName === '员工') && (
        <p className="new-employee-tip" style={{ marginLeft: '24px' }}>
          请新员工在&nbsp;
          <strong className="new-employee-tip_highlight__words">
            {props.endTime ? props.endTime.substring(0, 10) : '- - - -'}
            {/* {time.year()?time.year():'- - - -'}年{time.month()?(time.month() + 1):'- -'}月{time.date()?time.date():'- -'}日 */}
          </strong>
          前完成上述若干项，人力资源部将综合部门考核意见，对新员工试用期考核结果进行公布
        </p>
      )}
      <Card
        title={
          <React.Fragment>
            <span className="card_title_name__zh">试用期主管评价</span>
            <span className="card_title_name__en">Supervisor Evaluate</span>
          </React.Fragment>
        }
        style={{ marginBottom: 24 }}
      >
        <TextArea
          placeholder="试用期主管评价"
          value={directorEvaluate}
          disabled={roleName !== '主管'}
          onChange={v => {
            directorEvaluateChange(v.target.value);
          }}
          rows={5}
        />
      </Card>
      <Card
        title={
          <React.Fragment>
            <span className="card_title_name__zh">试用期经理/总监评价</span>
            <span className="card_title_name__en">Manager Evaluate</span>
          </React.Fragment>
        }
        style={{ marginBottom: 24 }}
      >
        <TextArea
          placeholder="试用期经理/总监评价"
          value={managerEvaluate}
          disabled={!(roleName === '经理' || roleName === '总监')}
          onChange={v => {
            managerEvaluateChange(v.target.value);
          }}
          rows={5}
        />
      </Card>
      <Card
        title={
          <React.Fragment>
            <span className="card_title_name__zh">试用期HR经理评价</span>
            <span className="card_title_name__en">HR Manager Evaluate</span>
          </React.Fragment>
        }
        style={{ marginBottom: 24 }}
      >
        <TextArea
          placeholder="试用期HR经理评价"
          value={hrManagerEvaluate}
          disabled={roleName !== 'HR经理'}
          onChange={v => {
            hrManagerEvaluateChange(v.target.value);
          }}
          rows={5}
        />
      </Card>
    </div>
  );
});

export default IndividualSummary;
