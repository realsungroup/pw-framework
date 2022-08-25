import React from 'react';
import './OverdueApprovalRecord.less';
import TableData from '../../../common/data/TableData';
import { Button } from 'antd';

/*
 * 过期未审批记录
 */

class OverdueApprovalRecord extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  render() {
    const {
      // intl: { locale }
      locale
    } = this.props;
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="invalid-application-form"
          resid="532606010925"
          subtractH={200}
          hasAdvSearch={false}
          hasAdd={false}
          hasRowView={false}
          hasRowDelete={false}
          hasRowEdit={false}
          hasDelete={false}
          hasModify={false}
          hasRowModify={false}
          hasRowSelection={true}
          actionBarWidth={100}
          downloadBaseURL={this.attendanceDownloadURL}
          dblinkname="ehr"
          baseURL={this.baseURL}
          isSetColumnWidth={false}
          isUseBESize={true}
          hasBeSort={false}
          isWrap={true}
          customRowBtns={[
            (record, size) => {
              return (
                <>
                  <Button
                    size={size}
                    onClick={() => {
                      window.open(record.fileUrl)
                    }}
                  >
                    {locale == 'en' ? 'Attachments' : '查看附件'}
                  </Button>
                </>
              );
            }
          ]}
        // noWidthFields='C3_447031495725'
        />
      </div>
    );
  }
}

export default OverdueApprovalRecord;
