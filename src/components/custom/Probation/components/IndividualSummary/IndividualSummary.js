import React from 'react';
import './IndividualSummary.less';
import { Card, Input } from 'antd';
import moment from 'moment';

const { TextArea } = Input;

const IndividualSummary = React.memo(props => {
  const { roleName, editable } = props;
  const disabled = !((roleName === 'HR' || roleName === '员工') && editable);
  const time = moment(props.endTime);
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
        <p className="new-employee-tip">
          请新员工在
          <strong className="new-employee-tip_highlight__words">
            {time.year()}年{time.month() + 1}月{time.date()}日
          </strong>
          前完成上述若干项，人力资源部将综合部门考核意见，对新员工试用期考核结果进行公布
        </p>
      )}
    </div>
  );
});

export default IndividualSummary;
