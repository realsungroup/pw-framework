import React from 'react';
import './ManagerCurrentMonthRecord.less';
import TableData from '../../../common/data/TableData';
import { Button } from 'antd';

/*
 * 经理当月审批记录
 */

class ManagerCurrentMonthRecord extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  render() {
    const {
      locale
      // intl: { locale }
    } = this.props;
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="invalid-application-form"
          resid="450383351695"
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
          dblinkname="ehr"
          baseURL={this.baseURL}
          downloadBaseURL={this.attendanceDownloadURL}
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
        />
      </div>
    );
  }
}

export default ManagerCurrentMonthRecord;
