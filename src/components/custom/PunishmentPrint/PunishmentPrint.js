import React, { Component, Fragment } from 'react';
// import logo from './assets/logo3.jpg';
import './PunishmentPrint.less';
import qs from 'qs';
import http from 'Util20/api';
// import { getRecord, getSubTableData, getRecord2 } from '../../util/api';
import moment from 'moment';

const recordID = '590863325025'; //违纪表
const warnID = '617814775752'; //警告
const moreWarnID = '617814800356'; //较重警告
const betterWarnID = '617814826190'; //严重警告
export default class PunishmentPrint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {}, //当前开的记录
      subrecords: [], //历史记录
      relevanceRecords: [], //累计记录
    };
  }

  async componentDidMount() {
    const querystring = window.location.search.substring(1);
    const qsObj = qs.parse(querystring);
    // const qs = qsToJson(this.props.location.search);
    let res;

    try {
      res = await http().getTable({
        resid: 590863325025,
        cmswhere: `(C3_727372048682 = 'Y') or (REC_ID = '${qsObj.subrecid}')`
      })
      console.log('进来了', res)
    } catch (err) {
      return console.error(err.message);
    }
    let record = {};
    let subrecords = [];
    for (let i = 0; i < res.data.length; i++) {
      if (res.data[i].REC_ID == qsObj.subrecid) {
        record = res.data[i];
      } else {
        subrecords.push(res.data[i])
      }
    }
    console.log('record', res)
    record.C3_590511645885 = moment(record.C3_590511645885).format(
      'YYYY-MM-DD'
    );
    record.C3_598379437999 = moment(record.C3_598379437999).format(
      'YYYY-MM-DD'
    );
    this.setState({ record, subrecords });
  }

  doPrint = () => {
    document.getElementById('top').style.display = 'none';
    window.print();
    window.location.reload();
  };

  render() {
    const { record } = this.state;
    return (
      <div className="Print">
        <div calss="top" id="top">
          <button onClick={this.doPrint.bind(this)}>打印</button>
        </div>

        {/* {/* <!--startprint--> */}
        {/* <!--注意要加上html里star和end的这两个标记--> */}
        <div
          id="all"
          style={{
            padding: '15px',
            borderColor: '#000',
            width: '900px',
            margin: '0 auto',
          }}
        >
          <div className="head">
            {/* <img id="logo" style={{ marginLeft: '-450px' }} src={logo} />
            <span id="warn" style={{ marginLeft: '150px' }}>
              警告单
            </span>
            <span id="company">外包公司</span> */}
          </div>

          <center>
            <div class="content">
              <table class="tab">
                <tr style={{ border: '0', height: '10px' }}>
                  <td style={{ border: '0', height: '10px' }} colspan="6" />
                  <td
                    style={{
                      border: '0',
                      fontSize: '14px',
                      height: '12px',
                      height: '10px',
                    }}
                    colspan="2"
                  >
                    {/* 序列号：{record.C3_590516721796} */}
                  </td>
                </tr>
                <tr style={{ border: 0 }}>
                  <td style={{ border: 0 }} colspan="2">
                    {/* {record.C3_592656850191 === '公司' ? (
                      <img id="logo" src={logo} />
                    ) : (
                      ''
                    )} */}
                  </td>
                  <td colspan="4" style={{ border: 0 }}>
                    <span id="warn" style={{ marginLeft: '150px' }}>
                      违纪通知
                    </span>
                  </td>
                  <td colspan="2" style={{ border: 0 }}>
                    {record.C3_592656850191 === '公司' ? (
                      ''
                    ) : (
                        <span id="company">
                          外包公司：{record.C3_592656850191}
                        </span>
                      )}
                  </td>
                </tr>
                <tr>
                  <td class="content-center">工号</td>
                  <td class="content-center">{record.C3_590510737521}</td>
                  <td class="content-center">姓名</td>
                  <td class="content-center">{record.C3_590510740042}</td>
                  <td class="content-center">职务</td>
                  <td class="content-center">{record.C3_590512134594}</td>
                  <td class="content-center">部门</td>
                  <td class="content-center">{record.C3_590510763625}</td>
                </tr>

                <tr>
                  <td colspan="8" style={{ fontWeight: '900' }}>
                    违纪记录：
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="8"
                    style={{ fontWeight: '900' }}
                    class="content-center"
                  >
                    违纪行为（请详细阐述违纪内容）
                  </td>
                </tr>
                <tr style={{ borderBottom: 0 }}>
                  <td colspan="4" class="remove-all">
                    违纪日期：
                    {record.C3_590511645885}
                  </td>
                  <td colspan="4" style={{ borderLeft: 0, borderBottom: 0 }}>
                    违纪时所在地点：
                    {record.C3_591363510625}
                  </td>
                </tr>
                {/* style={{ }} */}
                <tr class="remove-top-bottom warn">
                  <td
                    colspan="8"
                    class="remove-all"
                    style={{ borderRight: '1px solid #999' }}
                  >
                    请详细描述违纪行为：
                    {record.C3_590511661330}
                  </td>
                  {/* <td colspan="1" class="remove-t-b-l" /> */}
                </tr>
                <tr class="remove-top-bottom">
                  <td colspan="4" class="remove-all">
                    请详细罗列违纪证据（违纪证据需保存原件以备随时核查）:
                  </td>
                  <td colspan="6" class="remove-all" />
                </tr>
                <tr style={{ borderTop: 0 }}>
                  <td colspan="5" class="remove-all" />
                  <td colspan="3" class="remove-t-b-l">
                    {record.C3_591363578448}
                  </td>
                </tr>

                {/* <tr>
                  <td class="content-center" style={{ fontWeight: "900" }}>
                    编号
                  </td>
                  <td
                    class="content-center"
                    style={{ fontWeight: "900" }}
                    colspan="7"
                  >
                    惩处依据
                  </td>
                </tr> */}

                {/* <tr>
                  <td class="content-center">{record.C3_591459792639}</td>
                  <td class="content-center" colspan="7">
                    {record.C3_590511744313}
                  </td>
                </tr> */}

                <tr>
                  <td
                    class="content-center"
                    colspan="1"
                    style={{ fontWeight: '900' }}
                  >
                    行政处分
                  </td>
                  <td
                    class="content-center"
                    colspan="1"
                    style={{ fontWeight: '900' }}
                  >
                    开单日期
                  </td>
                  <td
                    class="content-center"
                    colspan="5"
                    style={{ fontWeight: '900' }}
                  >
                    奖惩依据
                  </td>
                  {/* <td
                    class="content-center"
                    colspan="1"
                    style={{ fontWeight: "900" }}
                  >
                    本月绩效
                  </td> */}
                  <td
                    class="content-center"
                    colspan="1"
                    style={{ fontWeight: '900' }}
                  >
                    编号
                  </td>
                </tr>
                <tr>
                  <td class="content-center" colspan="1">
                    {record.C3_590512169985}
                  </td>
                  <td class="content-center" colspan="1">
                    {record.C3_598379437999}
                  </td>
                  <td class="content-center" colspan="5">
                    {record.C3_590511744313}
                  </td>
                  {/* <td class="content-center" colspan="1">
                    {record.C3_591376119012}
                  </td> */}
                  <td class="content-center" colspan="1">
                    {record.C3_591459792639}
                  </td>
                </tr>
                {this.state.subrecords.length > 0 ? (
                  <Fragment>
                    <tr>
                      <td
                        colspan="8"
                        style={{ textAlign: 'center', fontWeight: '800' }}
                      >
                        未撤销的全部违纪记录
                      </td>
                    </tr>

                    <tr>
                      <td colspan="2" class="content-center">
                        开单日期
                      </td>
                      <td colspan="2" class="content-center">
                        违纪日期
                      </td>

                      <td colspan="2" class="content-center">
                        惩处结果
                      </td>
                      <td colspan="1" class="content-center">
                        编号
                      </td>
                      <td colspan="1" class="content-center">
                        序列号
                      </td>
                    </tr>
                  </Fragment>
                ) : null}

                <Fragment>
                  {this.state.subrecords.map((subrecord) => (
                    <tr>
                      <td colspan="2" class="content-center">
                        {subrecord.C3_591363552098}
                      </td>
                      <td colspan="2" class="content-center">
                        {subrecord.C3_590511645885}
                      </td>
                      <td colspan="2" class="content-center">
                        {subrecord.C3_590512169985}
                      </td>
                      <td colspan="1" class="content-center">
                        {subrecord.C3_591459792639}
                      </td>
                      <td colspan="1" class="content-center">
                        {subrecord.C3_590516721796}
                      </td>
                    </tr>
                  ))}
                </Fragment>
                {this.state.relevanceRecords.length > 0 && record.C3_641052769375 === 'Y' ? (
                  <tr>
                    <td
                      class="content-center"
                      colspan="1"
                      style={{ fontWeight: '900' }}
                    >
                      行政处分
                    </td>
                    <td
                      class="content-center"
                      colspan="1"
                      style={{ fontWeight: '900' }}
                    >
                      开单日期
                    </td>
                    <td
                      class="content-center"
                      colspan="4"
                      style={{ fontWeight: '900' }}
                    >
                      奖惩依据
                    </td>
                    <td
                      class="content-center"
                      colspan="1"
                      style={{ fontWeight: '900' }}
                    >
                      编号
                    </td>
                    <td
                      class="content-center"
                      colspan="1"
                      style={{ fontWeight: '900' }}
                    >
                      序列号
                    </td>
                  </tr>
                ) : null}
                {record.C3_641052769375 === 'Y' ? (
                  <Fragment>
                    {this.state.relevanceRecords.map((res) => {
                      return (
                        <tr>
                          <td class="content-center" colspan="1">
                            {res.C3_590512169985}
                          </td>
                          <td class="content-center" colspan="1">
                            {res.C3_591363552098}
                          </td>
                          <td class="content-center" colspan="4">
                            {res.C3_590511744313}
                          </td>
                          <td class="content-center" colspan="1">
                            {res.C3_591459792639}
                          </td>
                          <td class="content-center" colspan="1">
                            {res.C3_590516721796}
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>) : null}
                <tr class="remove-top-bottom">
                  <td colspan="8" class="opinion">
                    以上内容由开单人填写并核实
                  </td>
                </tr>

                <tr class="remove-top-bottom">
                  <td colspan="6" class="remove-all" />
                  <td colspan="2" class="remove-t-b-l">
                    签名：
                  </td>
                </tr>
                <tr class="remove-top-bottom">
                  <td colspan="6" class="remove-all" />
                  <td colspan="2" class="remove-t-b-l">
                    日期：
                  </td>
                </tr>
                <tr style={{ borderBottom: 0 }}>
                  <td colspan="8" rowspan="1" class="opinion">
                    员工本人意见
                  </td>
                </tr>

                <tr class="remove-top-bottom">
                  <td
                    rowspan="2"
                    colspan="6"
                    style={{ borderRight: 0, fontSize: '12px' }}
                    class="remove-top-bottom"
                  >
                    请注意：如您对公司的处理决定有异议请详细陈述，未陈述意见的，无论您是否签署本违纪单我们均视为您认同公司所调查的违纪事实以及作出的处理决定。拒绝签收本违纪单并不影响本违纪单的生效，公司将通过短信，微信，电子邮件，邮寄等多种方式向您送达
                  </td>
                  <td colspan="2" class="remove-t-b-l">
                    签名：
                  </td>
                </tr>
                <tr class="remove-all">
                  <td colspan="2" class="remove-t-b-l">
                    日期：
                  </td>
                </tr>
                <tr class="opinion">
                  <td colspan="8" class="opinion">
                    部门主管建议
                  </td>
                </tr>

                <tr class="remove-top-bottom">
                  <td colspan="6" class="remove-all" />
                  <td colspan="2" class="remove-t-b-l">
                    签名：
                  </td>
                </tr>
                <tr class="remove-top-bottom">
                  <td colspan="6" class="remove-all" />
                  <td colspan="2" class="remove-t-b-l">
                    日期：
                  </td>
                </tr>
                <tr class="opinion">
                  <td colspan="8" class="opinion">
                    部门经理建议
                  </td>
                </tr>

                <tr class="remove-top-bottom">
                  <td colspan="6" class="remove-all" />
                  <td colspan="2" class="remove-t-b-l">
                    签名：
                  </td>
                </tr>
                <tr class="remove-top-bottom">
                  <td colspan="6" class="remove-all" />
                  <td colspan="2" class="remove-t-b-l">
                    日期：
                  </td>
                </tr>
                <tr class="opinion">
                  <td colspan="8" class="opinion">
                    运营培训部建议（仅限运营部H01-H04员工）
                  </td>
                </tr>

                <tr class="remove-top-bottom">
                  <td colspan="6" class="remove-all" />
                  <td colspan="2" class="remove-t-b-l">
                    签名：
                  </td>
                </tr>
                <tr class="remove-top-bottom">
                  <td colspan="6" class="remove-all" />
                  <td colspan="2" class="remove-t-b-l">
                    日期：
                  </td>
                </tr>

                <tr class="opinion">
                  <td colspan="8" class="opinion">
                    人力资源部意见
                  </td>
                </tr>

                <tr class="remove-top-bottom">
                  <td colspan="6" class="remove-all" />
                  <td colspan="2" class="remove-t-b-l">
                    签名：
                  </td>
                </tr>
                <tr class="remove-top-bottom">
                  <td colspan="6" class="remove-all" />
                  <td colspan="2" class="remove-t-b-l">
                    日期：
                  </td>
                </tr>

                <tr class="opinion">
                  <td colspan="8" class="opinion" id="changeManager">
                    {record.C3_592656850191 === '公司'
                      ? ' 总经理意见（S04及以上员工）'
                      : '外包公司意见'}
                  </td>
                </tr>

                <tr class="remove-top-bottom">
                  <td colspan="6" class="remove-all" />
                  <td colspan="2" class="remove-t-b-l">
                    签名：
                  </td>
                </tr>
                <tr style={{ borderTop: 0 }}>
                  <td colspan="6" class="remove-all" />
                  <td colspan="2" class="remove-t-b-l">
                    日期：
                  </td>
                </tr>
              </table>
            </div>

            {/* <!--endprint--> */}
          </center>
        </div>
      </div>
    );
  }
}
