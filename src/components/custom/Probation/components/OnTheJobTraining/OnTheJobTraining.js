import React from 'react';
import './OnTheJobTraining.less';
import { Card, Table, Button, Popconfirm } from 'antd';

const { Column } = Table;

/**
 * @description 在岗培训
 * @author 邓铭
 */
const OnTheJobTraining = props => {
  const {
    auth,
    openModifyOnJobTrainingModal,
    deleteOnJobTraining,
    setAddOnJobTrainingVisible,
    onTheJobTraining,
    inviteConfirm,
    editable,
    roleName
  } = props;
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
          auth.hasAdd &&
          editable && (
            <Button
              onClick={() => {
                setAddOnJobTrainingVisible(true);
              }}
            >
              添加记录
            </Button>
          )
        }
      >
        <Table
          dataSource={onTheJobTraining}
          pagination={false}
          scroll={{ x: 1200 }}
        >
          <Column title="序号/No" dataIndex="no" fixed="left" width={100} />
          <Column title="课程/Courses" dataIndex="course" />
          <Column title="培训师/Trainer" dataIndex="trainer" />
          <Column
            title="已通知确认/IsNoticeConfirm"
            dataIndex="isNoticeTrainer"
          />
          {/* <Column title="培训日期/Date" dataIndex="trainDate" style={{display:'none'}}/> */}
          <Column
            title="操作/operation"
            dataIndex="operation"
            fixed="right"
            width={160}
            render={(text, record) => (
              <div>
                {auth.hasDelete && auth.hasModify && editable && (
                  <>
                    <a
                      href="javascript:;"
                      onClick={() => openModifyOnJobTrainingModal(record)}
                    >
                      修改
                    </a>
                    &nbsp;|&nbsp;
                    <Popconfirm
                      title="确认删除吗?"
                      onConfirm={() => deleteOnJobTraining(record.REC_ID)}
                    >
                      <a href="javascript:;">删除</a>
                    </Popconfirm>
                    &nbsp;|&nbsp;
                  </>
                )}
                {roleName === '员工' ||
                roleName === 'HR' ||
                roleName === '主管' ? (
                  <Popconfirm
                    title="确认邀请吗?"
                    onConfirm={() =>
                      inviteConfirm({ ...record, isNoticeTrainer: 'Y' })
                    }
                  >
                    <a href="javascript:;">邀请确认</a>
                  </Popconfirm>
                ) : null}
              </div>
            )}
          />
        </Table>
      </Card>
    </div>
  );
};

export default OnTheJobTraining;
