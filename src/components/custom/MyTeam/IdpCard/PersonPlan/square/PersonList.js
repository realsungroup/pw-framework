import React from 'react';
import { message, Button } from 'antd';
import './PersonList.less';
import http from './node_modules/Util20/api';
import TableData from '../../../../common/data/TableData';
/**
 * 管理员确认
 */

class PersonList extends React.Component {
  state = {
    mode: 'inline',
    theme: 'light',
    selectKey: '1',
    collapsed: false,
    currentPlan: {},
    historyPlan: []
  };
  componentDidMount = async () => {
  };
  render() {
    return (
      <div className="personlist-contain" style={{ height: '100%' }}>
        <TableData
          resid="617725883137"
          subtractH={220}
          hasBeBtns={false}
          hasRowSelection={true}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          hasAdd={false}
          hasRowView={false}
          hasModify={false}
          hasRowDelete={false}
          hasDelete={false}
          hasRowModify={false}
          actionBarFixed={true}
          height="100%"
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Button
                  onClick={() => {
                    this.props.onLookPerson(record);
                  }}
                >
                  修改
                </Button>
              );
            }
          ]}
          actionBarExtra={[
            <Button
              onClick={() => {
                this.setState({ applyByCourseVisible: true });
              }}
            >
              提醒员工
            </Button>,
            <Button
              onClick={() => {
                this.setState({ applyByUnexistCourseVisible: true });
              }}
            >
              开启员工填写
            </Button>,
            <Button
              onClick={() => {
                this.setState({ applyByUnexistCourseVisible: true });
              }}
            >
              开启主管填写
            </Button>,
            <Button
              onClick={() => {
                this.setState({ applyByUnexistCourseVisible: true });
              }}
            >
              关闭填写
            </Button>
          ]}
        />
      </div>
    );
  }
}

export default PersonList;
