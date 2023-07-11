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
    name: '病假扣款比例',
    filed: 'C3_660058502793',
    number1: '25SR',
    number2: '2010',
    isFront: false,
    isSameBegin: true
  },
  {
    name: '加班费（加班系数）',
    filed: 'C3_427240958358',
    number1: '2OTA',
    number2: '2010',
    isFront: false,
    isSameBegin: true
  },
  {
    name: '旷工缺勤',
    filed: 'C3_659462980919',
    number1: '2500',
    number2: '2010',
    isFront: false,
    isSameBegin: true
  },
  {
    name: '无薪假扣款',
    filed: 'C3_659462988420',
    number1: '2501',
    number2: '2010',
    isFront: false,
    isSameBegin: true
  },
  {
    name: '病假扣款',
    filed: 'F_14',
    number1: '25SL',
    number2: '2010',
    isFront: false,
    isSameBegin: true
  },
  {
    name: '产前假扣款',
    filed: 'F_36',
    number1: '25PL',
    number2: '2010',
    isFront: false,
    isSameBegin: false
  },
  {
    name: '路程假扣款',
    filed: 'F_54',
    number1: '25RL',
    number2: '2010',
    isFront: false,
    isSameBegin: false
  },
  {
    name: '产假扣款',
    filed: 'F_16',
    number1: '2506',
    number2: '2010',
    isFront: false,
    isSameBegin: true
  },
  {
    name: '迟到早退缺勤',
    filed: 'C3_659462995171',
    number1: '2507',
    number2: '2010',
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
          const monthFirstDay = this.state.yearMonth.format("YYYYMM") + '01';
          const now = moment().format('YYYYMMDDHHmmss');
          const fileName = `PP3104_${now}_CN2890_HRMD01_MUT8G2I.sap`;
          let data = `HEADR|"GVIIVI|"IIVIINC|"LEO_CHEN|"+86 591 88052823|"FZCN.Payroll@ii-vi.com|"${fileName}|"${moment().format(
            'YYYYMMDD'
          )}|"51222|"P|"1|"|"|"                                                                                                                                                                                                                                                                                                                                                                                                         |"|"|"|"|"|"|"|"|"|"|"\n`;

          let counts = 2;
          //需要判断是否使用入职日期作为开始日期的item
          const newJoinArray = ["管理费", "产前假扣款", "路程假扣款"];
          records.forEach(record => {
            const isDownload = record.personnuumber && (record.C3_424653346778 != "实习协议");
            if (isDownload) {
              console.log('col', columns)
              columns.forEach(column => {
                //去掉值为null或0的数据
                if (record[column.filed]) {
                  let startDate = record.C3_659465238204;
                  if (newJoinArray.some(item => item == column.name)) {
                    //当月入职
                    if (record.C3_427590520804 == 'Y') {
                      startDate = record.C3_427552757162;
                    } else {
                      startDate = monthFirstDay;
                    }
                  }
                  let row = `P${column.number2}|"${
                    record.personnuumber
                    }|"CN|"|"INS|"${column.number2}|"${column.number1}|"${
                    startDate
                    }|"${
                    column.isSameBegin ? record.C3_659465238204 : '99991231'
                    }|"|"|"|"|"${column.number1}|"`;
                  if (column.isFront) {
                    row += `${
                      record[column.filed] ? record[column.filed] : ''
                      }|"CNY|"|"|"|"|"|"|"|"|"\n`;
                  } else {
                    row += `|"|"|"|"CNY|"${
                      record[column.filed] ? record[column.filed] : ''
                      }|"|"|"|"|"\n`;
                  }
                  data += row;
                  counts++;
                }
              });
              let startDate = "";
              //当月入职
              if (record.C3_427590520804 == 'Y') {
                startDate = record.C3_427552757162;
              } else {
                startDate = monthFirstDay;
              }
              data += `P0009|"${record.personnuumber}|"CN|"0|"INS|"0009|"0|"${startDate}|"99991231|"|"|"|"|"|"${record.YGNAMES}|"|"|"CN|"${record.bankkey}|"${record.C3_661873440126 ? record.C3_661873440126.substring(0, 18) : ''}|"T|"|"CNY|"0|"0|"|"|"01|"|"|"|"|"|"|"|"|"|"|"|"|"|"|"|"${record.C3_661873440126 ? record.C3_661873440126.substring(18) : ''}|"|"|"|"\n`;
              counts++;
            }
          });
          data += `TRAIL|"${counts}`;
          exportRaw(data, `PP3104_${now}_CN2890_HRMD01_MUT8G2I-sample.sap`);
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
                )}' and DEPT1ID = '${company}' and C3_429786712779 = 'Y'`
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
