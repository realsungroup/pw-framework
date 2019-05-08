import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button } from 'antd';

/**
 * 问卷记录
 */
class QuestionnaireRecords extends React.Component {
  render() {
    return (
      <div style={{ height: 'calc(100vh - 160px)' }}>
        <TableData
          {...this.props}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Button
                  size={btnSize}
                  href={`/fnmodule?resid=问卷统计分析&recid=610653889243&type=问卷系统&title=问卷统计分析&questionnaireRecid=${
                    record.REC_ID
                  }`}
                  target="blank"
                >
                  统计分析
                </Button>
              );
            }
          ]}
        />
      </div>
    );
  }
}

export default QuestionnaireRecords;
