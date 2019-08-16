import React from 'react';
import './InternalTraining.less';
import { Card, Table, Button } from 'antd';

const { Column } = Table;
const data = [
  {
    key: '1',
    no: '1',
    courses: '行政管理制度、工会介绍',
    trainer: '邓铭',
    date: '2019-08-07'
  },
  {
    key: '2',
    no: '2',
    courses: '行政管理制度、工会介绍',
    trainer: '邓铭',
    date: '2019-08-07'
  },
  {
    key: '3',
    no: '3',
    courses: '行政管理制度、工会介绍',
    trainer: '邓铭',
    date: '2019-08-07'
  },
  {
    key: '4',
    no: '4',
    courses: '行政管理制度、工会介绍',
    trainer: '邓铭',
    date: '2019-08-07'
  }
];
const InternalTraining = props => {
  return (
    <div id="internal-training" className="probation-form">
      <Card
        title={
          <React.Fragment>
            <span className="card_title_name__zh">内训课程</span>
            <span className="card_title_name__en">Internal Training</span>
          </React.Fragment>
        }
        extra={<Button>添加记录</Button>}
      >
        <div>
          <p>
            ※1.新员工需在试用期内完成至少5个学时的内训课程，才能进入最终转正流程；
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;2.课程具体安排详见每周内训通知邮件；
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;3.内训课为公开课程，鼓励员工参加与工作有关或感兴趣的非必修课程，并在上述表格中做培训记录。
          </p>
        </div>
        <Table dataSource={data} pagination={false}>
          <Column title="序号/No" dataIndex="no" key="no" />
          <Column title="课程/Courses" dataIndex="courses" key="courses" />
          <Column title="培训师/Trainer" dataIndex="trainer" key="trainer" />
          <Column title="培训日期/Date" dataIndex="date" key="date" />
          <Column
            title="操作/operation"
            render={() => {
              return (
                <div>
                  <a href="javascript:;">修改</a> |
                  <a href="javascript:;">删除</a>
                </div>
              );
            }}
            key="operation"
          />
        </Table>
      </Card>
    </div>
  );
};

export default InternalTraining;
