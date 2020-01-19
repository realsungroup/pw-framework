import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { message, Skeleton } from 'antd';
import http from 'Util20/api';
import './FJList.less';

class FJList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      totalData: [] //统计数据
    };
  }

  async componentDidMount() {
    //const qsObj = qs.parse(window.location.search.substring(1));
    this.planid = this.props.planid;
    this.year = this.props.year;
    await this.totalData();
  }

  /**
   * 获取统计数据
   */
  async totalData() {
    let cmswhere = "C3_609616660273='" + this.planid + "'";
    let res = await http().getTable({ resid: this.props.totalResid, cmswhere });
    try {
      if (res.error === 0) {
        let totalData = res.data[0];
        this.setState({ totalData });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  render() {
    let totalData = this.state.totalData;
    return (
      <div className="fj-list">
        <div>
          <div
            style={{
              display: 'flex',
              flex: 3,
              padding: '5px 0',
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            <div
              style={{
                flex: 2,
                display: 'flex',
                justifyContent: 'space-around',
                padding: '0 10px'
              }}
            >
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {totalData.C3_609616006519 == 'SHG' ? '上海' : '无锡'}
              </span>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                财年: {totalData.C3_609615869581}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '14px' }}>
                人数:
                <span className="fjlist-header-number">
                  {totalData.C3_609615996253}
                </span>
              </span>

              <span style={{ fontSize: '14px' }}>
                总费用:
                <span className="fjlist-header-number">
                  {totalData.C3_609616051191}
                </span>
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '14px' }}>
                总预算:
                <span className="fjlist-header-number">
                  {totalData.C3_609616030566}
                </span>
              </span>
              <span style={{ fontSize: '14px' }}>
                人均预算:
                <span className="fjlist-header-number">
                  {totalData.C3_611074040082}
                </span>
              </span>
            </div>
          </div>
          <div style={{ height: 'calc(100% - 60px)' }}>
            <Skeleton loading={!totalData.C3_609616006519}>
              <TableData
                resid={this.props.resid}
                tableComponent="ag-grid"
                rowSelectionAg="single"
                sideBarAg={true}
                hasAdvSearch={false}
                hasAdd={true}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasBeBtns={false}
                hasRowModify={false}
                hasRowSelection={false}
                // cmswhere={` C3_613828994025 = '${totalData.C3_609616006519}'`}
              />
            </Skeleton>
          </div>
        </div>
      </div>
    );
  }
}

export default FJList;
