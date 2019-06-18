import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import './PersonGradeManagement.less';

/**
 * 个人成绩管理
 */
class PersonGradeManagement extends React.Component {
  render() {
    return (
      <div style={{ height: '100vh' }}>
        <TableData
          {...this.props}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Link
                  to={{
                    pathname: '/fnmodule',
                    search: `?resid=考试图表分析&recid=610653889243&type=问卷系统&title=问卷统计分析&num=${
                      record.C3_607171221170
                      }&examTitle=${record.C3_607171220498}`
                  }}
                  target="_self"
                >
                  <Button size={btnSize}>图表分析</Button>
                </Link>

              );
            }
          ]}
        />
      </div>
    );
  }
}

export default PersonGradeManagement;
