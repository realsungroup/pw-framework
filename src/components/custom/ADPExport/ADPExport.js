import React from 'react';
import TableData from 'Common/data/TableData';
import './ADPExport.less';
import { Button, DatePicker, message } from 'antd';
import moment from 'moment';

const { MonthPicker } = DatePicker;
function exportRaw(data, name) {
  var urlObject = window.URL || window.webkitURL || window;
  var export_blob = new Blob([data]);
  var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  save_link.href = urlObject.createObjectURL(export_blob);
  save_link.download = name;
  save_link.click();
}

const columns = [
  {
    name: '交通津贴',
    filed: 'C3_427813146661',
    number1: '3012',
    number2: '0015',
    isFront: true,
    isSameBegin: true
  },
  {
    name: '管理费',
    filed: 'C3_659462467442',
    number1: '9600',
    number2: '0014',
    isFront: true,
    isSameBegin: false
  },
  {
    name: '中夜班津贴',
    filed: 'C3_431876780675',
    number1: '3027',
    number2: '0015',
    isFront: true,
    isSameBegin: true
  },
  {
    name: '住宿补贴',
    filed: 'C3_427813167303',
    number1: '3500',
    number2: '0015',
    isFront: true,
    isSameBegin: true
  },
  {
    name: '全勤津贴',
    filed: 'C3_456101596314',
    number1: '4120',
    number2: '0015',
    isFront: true,
    isSameBegin: true
  },
  {
    name: '病假扣款比例',
    filed: 'C3_456247344400',
    number1: '25SR',
    number2: '2100',
    isFront: true,
    isSameBegin: true
  },
  {
    name: '产前假扣款比例',
    filed: 'C3_456247368964',
    number1: '25PR',
    number2: '2100',
    isFront: true,
    isSameBegin: true
  },
  {
    name: '路程假扣款比例',
    filed: 'C3_456247870527',
    number1: '25RR',
    number2: '2100',
    isFront: true,
    isSameBegin: true
  },

  {
    name: '加班费（加班系数）',
    filed: 'C3_427240958358',
    number1: '2OTA',
    number2: '2100',
    isFront: false,
    isSameBegin: true
  },
  {
    name: '旷工缺勤',
    filed: 'C3_659462980919',
    number1: '2500',
    number2: '2100',
    isFront: false,
    isSameBegin: true
  },
  {
    name: '无薪假扣款',
    filed: 'C3_659462988420',
    number1: '2501',
    number2: '2100',
    isFront: false,
    isSameBegin: true
  },
  {
    name: '病假扣款',
    filed: 'F_14',
    number1: '25SL',
    number2: '2100',
    isFront: false,
    isSameBegin: true
  },
  {
    name: '产前假扣款',
    filed: 'F_36',
    number1: '25PL',
    number2: '2100',
    isFront: false,
    isSameBegin: true
  },
  {
    name: '路程假扣款',
    filed: 'F_54',
    number1: '25RL',
    number2: '2100',
    isFront: false,
    isSameBegin: true
  },
  {
    name: '产假扣款',
    filed: 'F_16',
    number1: '2506',
    number2: '2100',
    isFront: false,
    isSameBegin: true
  },
  {
    name: '迟到早退缺勤',
    filed: 'C3_659462995171',
    number1: '2507',
    number2: '2100',
    isFront: false,
    isSameBegin: true
  }
];
class ADPExport extends React.Component {
  state = {
    yearMonth: moment()
  };
  _actionBarExtra = gridApi => {
    return (
      <Button
        size="small"
        type="primary"
        onClick={() => {
          const records = gridApi.getSelectedRows();
          if (!records.length) {
            return message.info('请选择记录');
          }
          const now = moment();
          const fileName = `PP3104_${now.format(
            'YYYYMMDDHHmmss'
          )}_CN2890_HRMD01_MUT8G2I-sample.sap`;
          let data = `HEADR|"GVIIVI|"IIVIINC|"LEO_CHEN|"+86 591 88052823|"FZCN.Payroll@ii-vi.com|"${fileName}|"${now.format(
            'YYYYMMDD'
          )}|"51222|"P|"1|"|"|"\n`;
          records.forEach(record => {
            columns.forEach(column => {
              data += `P${column.number2}|"${record.personnumber}|"CN|"|"INS|"${
                column.number2
              }|"${column.number1}|"${record.C3_659465238204}|"${
                column.isSameBegin ? record.C3_659465238204 : '99991231'
              }|"|"|"|"|"${column.number1}|"`;
              if (column.isFront) {
                data += `${
                  record[column.filed] ? record[column.filed] : ''
                }|"CNY|"|"|"|"|"|"|"|"|"\n`;
              } else {
                data += `|"|"|"|"CNY|"${
                  record[column.filed] ? record[column.filed] : ''
                }|"|"|"|"|"\n`;
              }
            });
          });
          data += `TRAIL|"${records.length * columns.length + 2}`;
          exportRaw(data, fileName);
        }}
      >
        导出
      </Button>
    );
  };

  render() {
    const { resid, baseURL, company } = this.props;
    const { yearMonth } = this.state;
    return (
      <div className="adp-export">
        <div style={{ padding: 12 }}>
          <MonthPicker
            value={yearMonth}
            onChange={date => {
              this.setState({ yearMonth: date });
            }}
            placeholder="请选择月份"
          />
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <TableData
            resid={resid}
            baseURL={baseURL}
            actionBarExtraAg={this._actionBarExtra}
            hasModify={false}
            hasAdd={false}
            hasDelete={false}
            cmswhere={
              yearMonth
                ? `YEARMONTH = '${yearMonth.format(
                    'YYYYMM'
                  )}' and DEPT1ID = '${company}'`
                : ''
            }
            subtractH={200}
            hasRowModify={false}
            hasRowView={false}
            hasRowDelete={false}
            tableComponent="ag-grid"
          />
        </div>
      </div>
    );
  }
}

export default ADPExport;
