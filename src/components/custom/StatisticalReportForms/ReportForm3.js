import React from 'react';
import http from 'Util20/api';

class ReportForm3 extends React.Component {
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    http().getTable({
      resid: '628788952983'
    });
    http().getTable({
      resid: '628789112577'
    });
  };
  render() {
    return (
      <div className="statistical-report-form-3">
        <div className="statistical-report-form-3_table">
          <div className="statistical-report-form-3_table__sider">
            <div className="statistical-report-form-3_table__sider_header">
              Key Figure
              <br />
              (L3 and above)
            </div>
            <div className="statistical-report-form-3_table__sider_item">
              Training Person-time
              <br />
              参加培训人数
            </div>
            <div className="statistical-report-form-3_table__sider_item">
              Training Hours
              <br />
              培训总时数
            </div>
            <div className="statistical-report-form-3_table__sider_item">
              Training Hours/Person
              <br />
              人均培训时数
            </div>
            <div className="statistical-report-form-3_table__sider_item">
              Statisfaction Rate
              <br />
              内训满意度
            </div>
          </div>
          <div className="statistical-report-form-3_table__main">
            <div className="statistical-report-form-3_table__header">
              <div className="statistical-report-form-3_table__header_item">
                FY14Q1
              </div>
              <div className="statistical-report-form-3_table__header_item">
                FY14Q2
              </div>
              <div className="statistical-report-form-3_table__header_item">
                FY14Q3
              </div>
              <div className="statistical-report-form-3_table__header_item">
                FY14Q4
              </div>
              <div className="statistical-report-form-3_table__header_item">
                FY14YTD
              </div>
            </div>
            <div className="statistical-report-form-3_table__main_quarter_list">
              <div className="statistical-report-form-3_table__main_quarter">
                <div className="statistical-report-form-3_table__main_quarter_item">
                  917
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  3891.5
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  6.1
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  4.66/5
                </div>
              </div>
              <div className="statistical-report-form-3_table__main_quarter">
                <div className="statistical-report-form-3_table__main_quarter_item">
                  917
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  3891.5
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  6.1
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  4.66/5
                </div>
              </div>
              <div className="statistical-report-form-3_table__main_quarter">
                <div className="statistical-report-form-3_table__main_quarter_item">
                  917
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  3891.5
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  6.1
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  4.66/5
                </div>
              </div>
              <div className="statistical-report-form-3_table__main_quarter">
                <div className="statistical-report-form-3_table__main_quarter_item">
                  917
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  3891.5
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  6.1
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  4.66/5
                </div>
              </div>
              <div className="statistical-report-form-3_table__main_quarter">
                <div className="statistical-report-form-3_table__main_quarter_item">
                  917
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  3891.5
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  6.1
                </div>
                <div className="statistical-report-form-3_table__main_quarter_item">
                  4.66/5
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReportForm3;
