import React from 'react';
import './ManagerCurrentMonthRecord.less';
import TableData from '../../../common/data/TableData';
import { Button, Modal } from 'antd';
import http from '../../../../util20/api'

/*
 * 经理当月审批记录
 */

class ManagerCurrentMonthRecord extends React.Component {
  constructor(props) {
    super(props);
    this.mediaFieldBaseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.mediaFieldBaseURL;
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  state = {
    showLink: false,
    curLink: ''
  }
  getLink = async (record) => {
    try {
      let res2 = await http({ baseURL: this.baseURL }).getBinImage({
        resid: 516107915085,
        colname: 'C3_451391568463',
        recid: record.C3_446915623989,
      });
      this.setState({ curLink: res2.data ? this.mediaFieldBaseURL + res2.data : '', showLink: true })
    } catch (e) {
      console.log(e.error)
    }
  }
  render() {
    const {
      locale
      // intl: { locale }
    } = this.props;

    return (
      <div className="attendance-manage_tabledata__wrapper">
        <Modal
          title={'查阅附件'}
          visible={this.state.showLink}
          footer={null}
          destroyOnClose
          onCancel={() => { this.setState({ showLink: false, curLink: '' }) }}
        >
          <div>
            <span>文件链接：</span>
            {
              this.state.curLink ? <a href={this.state.curLink} target='_blank'>{this.state.curLink}</a> : '无'
            }
          </div>
        </Modal>
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
                      if (record.fileUrl && record.fileUrl != 'http://wux-hr03.chn.ii-vi.net') {
                        this.setState({ curLink: record.fileUrl, showLink: true })
                      } else {
                        this.getLink(record)
                      }
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
