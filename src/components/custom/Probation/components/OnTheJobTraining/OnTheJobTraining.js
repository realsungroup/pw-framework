import React from 'react';
import './OnTheJobTraining.less';
import { Card, Table, Button, Popconfirm } from 'antd';

const columns = [
  {
    title: '序号/No',
    dataIndex: 'no'
  },
  {
    title: '课程/Courses',
    dataIndex: 'courses',
    editable: true
  },
  {
    title: '培训师/Trainer',
    dataIndex: 'trainer'
  },
  {
    title: '培训日期/Date',
    dataIndex: 'date'
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    render: (text, record) => (
      <div>
        <a href="javascript:;">修改</a> |
        <Popconfirm
          title="确认删除吗?"
          onConfirm={() => this.handleDelete(record.key)}
        >
          <a href="javascript:;">删除</a>
        </Popconfirm>
      </div>
    )
  }
];
const OnTheJobTraining = props => {
  return (
    <div id="on-the-job-training" className="probation-form">
      <Card
        title={
          <React.Fragment>
            <span className="card_title_name__zh">在岗培训</span>
            <span className="card_title_name__en">On-the-job Training</span>
          </React.Fragment>
        }
        extra={
          <Button
            onClick={() => {
              props.setAddOnJobTrainingVisible(true);
            }}
          >
            添加记录
          </Button>
        }
      >
        <Table
          dataSource={props.onTheJobTraining}
          pagination={false}
          columns={columns}
          rowClassName={() => 'editable-row'}
        />
      </Card>
    </div>
  );
};

export default OnTheJobTraining;
