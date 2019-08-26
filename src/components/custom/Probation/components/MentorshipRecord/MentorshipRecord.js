import React from 'react';
import './MentorshipRecord.less';
import moment from 'moment';
import { Card, Input, Icon, Popconfirm, DatePicker, Button } from 'antd';

const { TextArea } = Input;
const MentorshipRecord = props => {
  let {
    mentorshipRecord,
    auth,
    roleName,
    addMentor,
    confirmMentor,
    modifyMentor,
    removeMentor
  } = props;
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
                {auth.hasDelete && (
                  <Popconfirm
                    title="确认删除吗？"
                    icon={
                      <Icon type="question-circle-o" style={{ color: 'red' }} />
                    }
                    onConfirm={() => {
                      removeMentor(index);
                    }}
                  >
                    <Icon
                      type="close"
                      className="mentorshi-record_card_action-btn__delete"
                    />
                  </Popconfirm>
                )}
                <div className="mentorshi-record_card_item">
                  日期/Date
                  {auth.hasModify ? (
                    <DatePicker
                      style={{ width: 140, marginLeft: '1.25vw' }}
                      onChange={v => {
                        item.editDate = v && v.format('YYYY-MM-DD');
                        modifyMentor(index, item);
                      }}
                      value={item.editDate ? moment(item.editDate) : undefined}
                    />
                  ) : (
                    <span style={{ marginLeft: '1.25vw' }}>
                      {item.editDate}
                    </span>
                  )}
                </div>
                <div className="mentorshi-record_card_item">
                  辅导记录/Mentorship Record
                  {auth.hasModify ? (
                    <TextArea
                      placeholder="请输入辅导记录"
                      value={item.instructionRecord}
                      onChange={v => {
                        item.instructionRecord = v.target.value;
                        modifyMentor(index, item);
                      }}
                      rows={3}
                    />
                  ) : (
                    <p className="mentorshi-record_card_item_content">
                      {item.instructionRecord}
                    </p>
                  )}
                </div>
                <div className="mentorshi-record_card_item">
                  状态/Status：
                  {item.isConfirm === 'Y' ? (
                    <span style={{ color: '#2593fc' }}>已确认</span>
                  ) : (
                    <span style={{ color: '#f22635' }}>待确认</span>
                  )}
                </div>
                <footer className="mentorshi-record_card_buttons">
                  {(roleName === '员工' || roleName === 'HR') &&
                    item.isConfirm !== 'Y' && (
                      <Button
                        type="primary"
                        onClick={() => confirmMentor(index)}
                      >
                        确认
                      </Button>
                    )}
                </footer>
              </div>
            </div>
          ))}
          {auth.hasAdd && (
            <div className="mentorshi-record_card__wrapper">
              <div
                className="mentorshi-record_card__addition"
                onClick={addMentor}
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
          )}
        </div>
      </Card>
    </div>
  );
};

export default MentorshipRecord;
