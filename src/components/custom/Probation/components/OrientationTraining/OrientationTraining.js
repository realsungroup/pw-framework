import React from 'react';
import './OrientationTraining.less';
import { Card, Table } from 'antd';

const { Column } = Table;

/**
 * @description 入职培训
 * @author 邓铭
 */
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
        <Table dataSource={props.orientationTraining} pagination={false}>
          <Column title="序号/No" dataIndex="no" key="no" width={100} />
          <Column
            title="课程/Courses"
            dataIndex="course"
            key="course"
            // width={300}
          />
          <Column title="培训师/Trainer" dataIndex="trainer" key="trainer" />
          <Column title="培训日期/Date" dataIndex="trainDate" key="trainDate" />
        </Table>
      </Card>
    </div>
  );
};

export default OrientationTraining;
