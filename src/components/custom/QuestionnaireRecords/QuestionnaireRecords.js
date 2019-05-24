import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

/**
 * 问卷统计
 */
class QuestionnaireRecords extends React.Component {
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
                    search: `?resid=问卷统计分析&recid=610653889243&type=问卷系统&title=问卷统计分析&questionnaireRecid=${
                      record.REC_ID
                    }&fromTitle=问卷统计`
                  }}
                  target="_self"
                >
                  <Button size={btnSize}>统计分析</Button>
                </Link>
              );
            }
          ]}
        />
      </div>
    );
  }
}

export default QuestionnaireRecords;
