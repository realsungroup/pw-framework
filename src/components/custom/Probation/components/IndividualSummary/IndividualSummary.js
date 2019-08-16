import React from 'react';
import './IndividualSummary.less';
import { Card, Input, Col } from 'antd';

const { TextArea } = Input;

const IndividualSummary = props => {
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
          onChange={v => {
            props.summaryChange(v.target.value);
          }}
          rows={5}
        />
      </Card>
    </div>
  );
};

export default IndividualSummary;
