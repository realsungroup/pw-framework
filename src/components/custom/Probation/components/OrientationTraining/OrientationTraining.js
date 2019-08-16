import React from 'react';
import './OrientationTraining.less';
import { Card, Table, Tag } from 'antd';

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
const OrientationTraining = props => {
  return (
    <div id="orientation-training" className="probation-form">
      <Card
        title={
          <React.Fragment>
            <span className="card_title_name__zh">入职培训（必修）</span>
            <span className="card_title_name__en">Orientation Training</span>
          </React.Fragment>
        }
      >
        <Table dataSource={data} pagination={false}>
          <Column title="序号/No" dataIndex="no" key="no" />
          <Column title="课程/Courses" dataIndex="courses" key="courses" />
          <Column title="培训师/Trainer" dataIndex="trainer" key="trainer" />
          <Column title="培训日期/Date" dataIndex="date" key="date" />
        </Table>
      </Card>
    </div>
  );
};

export default OrientationTraining;
