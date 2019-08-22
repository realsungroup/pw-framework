import React from 'react';
import './OnTheJobTraining.less';
import { Card, Table, Button, Popconfirm } from 'antd';

const OnTheJobTraining = props => {
  const columns = [
    {
      title: '序号/No',
      dataIndex: 'no',
      width: 100
    },
    {
      title: '课程/Courses',
      dataIndex: 'course',
      width: 300
    },
    {
      title: '培训师/Trainer',
      dataIndex: 'trainer'
    },
    {
      title: '培训日期/Date',
      dataIndex: 'trainDate'
    },
    {
      title: '操作/operation',
      dataIndex: 'operation',
      render: (text, record) =>
        props.auth.hasDelete &&
        props.auth.hasModify && (
          <div>
            <a
              href="javascript:;"
              onClick={() => props.openModifyOnJobTrainingModal(record)}
            >
              修改
            </a>
            &nbsp;|&nbsp;
            <Popconfirm
              title="确认删除吗?"
              onConfirm={() => props.deleteOnJobTraining(record.REC_ID)}
            >
              <a href="javascript:;">删除</a>
            </Popconfirm>
          </div>
        )
    }
  ];
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
          props.auth.hasAdd && (
            <Button
              onClick={() => {
                props.setAddOnJobTrainingVisible(true);
              }}
            >
              添加记录
            </Button>
          )
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
