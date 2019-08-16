import React from 'react';
import './MentorshipRecord.less';
import moment from 'moment';
import { Card, Select, Input, Icon, Popconfirm, DatePicker } from 'antd';

const { TextArea } = Input;
const MentorshipRecord = props => {
  let { mentorshipRecord } = props;
  console.log(mentorshipRecord);
  return (
    <div id="mentorshi-record" className="probation-form">
      <Card
        title={
          <React.Fragment>
            <span className="card_title_name__zh">辅导记录</span>
            <span className="card_title_name__en">Mentorship Record</span>
          </React.Fragment>
        }
      >
        <div>
          <p>
            ※辅导员在新员工试用期内每月至少一次正式面谈，做三次正式面谈记录，面谈后分别确认内容。
          </p>
        </div>
        <div className="mentorshi-record_cards">
          {mentorshipRecord.map((item, index) => (
            <div className="mentorshi-record_card__wrapper">
              <div className="mentorshi-record_card">
                <Popconfirm
                  title="确认删除吗？"
                  icon={
                    <Icon type="question-circle-o" style={{ color: 'red' }} />
                  }
                  onConfirm={() => {
                    props.removeMentor(index);
                  }}
                >
                  <Icon
                    type="close"
                    className="mentorshi-record_card_action-btn__delete"
                  />
                </Popconfirm>
                <div className="mentorshi-record_card_item">
                  日期/Date
                  <DatePicker
                    style={{ width: 140, marginLeft: '1.25vw' }}
                    onChange={v => {
                      item.editDate = v && v.format('YYYY-MM-DD');
                      props.modifyMentor(index, item);
                    }}
                    value={item.editDate ? moment(item.editDate) : undefined}
                  />
                </div>
                <div className="mentorshi-record_card_item">
                  辅导记录/Mentorship Record
                  <TextArea
                    placeholder="请输入辅导记录"
                    value={item.instructionRecord}
                    onChange={v => {
                      item.instructionRecord = v.target.value;
                      props.modifyMentor(index, item);
                    }}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="mentorshi-record_card__wrapper">
            <div
              className="mentorshi-record_card__addition"
              onClick={props.addMentor}
            >
              <div className="mentorshi-record_card__addition_icon">
                <Icon type="plus" />
              </div>
              <div>
                <p>添加新的辅导记录</p>
                <p>Add a mentorship record</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MentorshipRecord;
