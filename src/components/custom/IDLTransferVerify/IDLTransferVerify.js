import React, { Component } from 'react';
import {
  Table,
  Steps,
  Button,
  Select,
  Tabs,
  Spin,
  Modal,
  message,
  Input,
  DatePicker
} from 'antd';
import './IDLTransferVerify.less';
import TableData from '../../common/data/TableData';
import http from 'Util20/api';
import moment from 'moment';
import { async } from 'q';

function compare(property) {
  return function(a, b) {
    return a[property] - b[property];
  };
}
// 排序

const { Step } = Steps;
const attr = [
  '部门名',
  '岗位名',
  '级别',
  '主管',
  '项目代码',
  'BU CODE',
  '一级部门',
  '二级部门',
  '三级部门',
  '四级部门'
];
const showAfter = [
  'nDepart', //部门名
  'nJobName', //职务名
  'nLevel', //级别
  'nDriectorName', //主管
  'nProj_Code', //项目代码
  'nBuCode', //bucode
  'nFirstDepart', //一级部门
  'nSecondDepart', //二级部门
  'nThirdDepart', //三级部门
  'nFourthDepart' //四级部门
];
class IDLTransferVerify extends Component {
  constructor(props) {
    super(props);
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    var jobNum = userInfo.UserInfo.EMP_ID;
    this.state = {
      approveRec: [], //临时储存的审批记录
      mode: props.mode,
      loading: false,
      conUnpass: false,
      selection: 1,
      canApprove: false, //是否为当前审批人
      cms: `(headcount = 'waiting' or hrPreAprrove ='waiting')`,
      userId: jobNum,
      cmsView: `(headcount = 'waiting' or hrPreAprrove ='waiting') and applyPersonNum = '${jobNum}'`,
      visible: false,
      C3_632503844784: '', //记录编号
      toCheck: [],
      member: [], //同一审批单的人员
      C3_632503853105: '', //审批说明
      toCheckFront: {
        C3_632503853105: null,
        effortDate: null, //生效日期
        changeReason: '' //变动原因
      },
      curStep: 0,
      // '原部门主管审批','原部门经理审批','原部门总监审批','现部门经理审批','现部门总监审批','现部门主管审批','HR专员审批','HR总监审批'
      stream: [],
      memberDetail: {}
    };
  }
  componentDidMount() {}
  //  判断是否为发起人
  judgetrigger = v => {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    var jobNum = userInfo.UserInfo.EMP_USERCODE;
    if (v == jobNum) {
      this.setState({ isBeginner: true });
    }
    console.info(v, jobNum);
  };
  getMem = async v => {
    this.setState({ loading: true });
    try {
      let res = await http().getTable({
        resid: 632314958317,
        cmswhere: `C3_632503844784='${v}'`
      });
      this.setState({ member: res.data });
      console.log('resqq', res);
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
    try {
      let res2 = await http().getTable({
        resid: 634660498796,
        cmswhere: `C3_634660564341='${v}'`
      });
      this.setState({ approveRec: res2 });
      var n = 0;
      var arr = [];
      var c = 0;
      var isFin = 0;

      while (n < res2.data.length) {
        arr.push({
          stepName: res2.data[n].C3_634660565034,
          stepPeople: res2.data[n].C3_634660565583,
          stepTime: res2.data[n].edit_time,
          order: res2.data[n].C3_634660566076
        });
        if (res2.data[n].C3_637177232366 == 'Y') {
          var c = res2.data[n].C3_635250483297;
        }
        if (res2.data[n].C3_634660565837 == 'Y') {
          isFin = isFin + 1;
        }
        arr = arr.sort(compare('order'));
        n++;
      }

      // 判断是否为当前审批人
      //   var c2=c+1;
      // var jobNum = this.state.userId;
      // n=0;
      // while(n<res2.data.length){
      //   if(res2.data[n].C3_634660566076==c2){
      //     if(jobNum==res2.data[n].C3_634660565295){
      //       this.setState({canApprove:true});

      //     }else{
      //       this.setState({canApprove:false});
      //       this.setState({curAPe:res2.data[n].C3_634660565583})
      //     }
      //   }
      //   n++;
      // }
      // c=Number(c)-1;
      if (isFin == res2.data.length) {
        c = res2.data.length + 1;
      }
      this.setState({ loading: false, curStep: c, stream: arr });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };
  approve = async v => {
    this.setState({ loading: true });
    var res = '';
    var arr = this.state.approveRec.data;
    var n = 0;
    var c = Number(this.state.curStep);
    c = c + 2;
    var obj;
    while (n < arr.length) {
      if (c == arr[n].C3_634660566076) {
        arr[n].C3_634660565837 = v;
        obj = arr[n];
      }
      n++;
    }
    console.log(obj);
    try {
      res = await http().modifyRecords({
        resid: 634660498796,
        data: [obj]
      });
      if (v == 'N') {
        this.unPass();
      } else {
        console.log(c);
        if (arr.length == c) {
          this.passStream();
        } else {
          var date = this.state.toCheckFront.effortDate;
          if (date) {
            date = moment(date).format('YYYY-MM-DD');
          }
          var res4 = '';
          try {
            res4 = await http().modifyRecords({
              resid: 632255761674,
              data: [
                {
                  REC_ID: this.state.toCheckFront.REC_ID,
                  effortDate: date
                }
              ]
            });
            console.log('res', res);
          } catch (error) {
            message.error(error.message);
            this.setState({ loading: false });
          }
        }
      }
      this.setState({ conUnpass: false, visible: false, loading: false });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };
  passStream = async () => {
    var res = '';
    var date = this.state.toCheckFront.effortDate;
    if (date) {
      date = moment(date).format('YYYY-MM-DD');
    }
    try {
      res = await http().modifyRecords({
        resid: 632255761674,
        data: [
          {
            REC_ID: this.state.toCheckFront.REC_ID,
            Approve: '已通过',
            effortDate: date
          }
        ]
      });
      console.log('res', res);
      if (res.Error === 0) {
        message.success(res.message);
        this.tableDataRef.handleRefresh();
      }
    } catch (error) {
      message.error(error.message);
      this.setState({ loading: false });
    }
  };
  unPass = async () => {
    var res = '';
    try {
      res = await http().modifyRecords({
        resid: 632255761674,
        data: [
          {
            REC_ID: this.state.toCheckFront.REC_ID,
            Approve: '未通过',
            ApproveRemark: this.state.C3_632503853105
          }
        ]
      });
      console.log('res', res);
      if (res.Error === 0) {
        message.success(res.message);
        this.tableDataRef.handleRefresh();
      }
    } catch (error) {
      message.error(error.message);
      this.setState({ loading: false });
    }
  };
  showOverlay = r => {
    this.judgetrigger(r.applyPersonId);
    var n = 0;
    var arr = [];
    while (n < attr.length) {
      var a = r[showAfter[n]] || '';
      arr.push(a);
      n++;
    }
    let object = {};
    Object.assign(object, r);
    let myDate = object.effortDate;
    if (myDate) {
      myDate = moment(myDate);
    }
    object.effortDate = myDate;
    this.getMem(object.changeID);
    this.setState({
      memberDetail: null,
      visible: true,
      toCheck: arr,
      toCheckFront: object,
      C3_632503844784: object.changeID
    });
  };
  judgeMulti = async (dataSource, selectedRowKeys, bol) => {
    var j = bol ? '已通过' : '未通过';
    var arr = [];
    if (selectedRowKeys.length) {
      this.setState({ loading: true });

      dataSource.map(item => {
        selectedRowKeys.map(items => {
          if (item.REC_ID === items) {
            var obj = item;
            obj.Approve = j;
            arr.push(item);
          }
        });
      });
      var res = '';
      try {
        res = await http().modifyRecords({
          resid: 632314958317,
          data: arr
        });
        if (res.Error === 0) {
          message.success(res.message);
          this.tableDataRef.handleRefresh();

          this.setState({ loading: false });
        }
      } catch (error) {
        message.error(error.message);
        this.setState({ loading: false });
      }
    } else {
      message.error('请选勾选记录！');
    }
  };
  render() {
    return (
      <div className="IDLTransferVerify">
        <Spin spinning={this.state.loading}>
          <Modal
            width={'60vw'}
            visible={this.state.conUnpass}
            onCancel={() => this.setState({ conUnpass: false })}
            footer={
              <>
                <Button
                  onClick={() => {
                    this.setState({ conUnpass: false });
                  }}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    this.approve('N');
                  }}
                >
                  确认
                </Button>
              </>
            }
          >
            <h3>请输入审核未通过的理由</h3>
            <p>({this.state.C3_632503853105.length}/200字)</p>
            <Input.TextArea
              maxLength={200}
              style={{
                marginTop: 16,
                width: '60vw',
                height: 120,
                resize: 'none'
              }}
              value={this.state.C3_632503853105}
              onChange={v => {
                this.setState({ C3_632503853105: v.target.value });
              }}
              placeholder="最多输入200字"
            />
          </Modal>
          <Modal
            width={'90vw'}
            visible={this.state.visible}
            footer={
              this.state.toCheckFront.Approve == '审核中' &&
              this.state.mode != 'view' ? (
                this.state.isBeginner ? (
                  <span>您是发起人</span>
                ) : this.state.canApprove ? (
                  <>
                    <Button
                      type="danger"
                      style={{ marginLeft: '8px' }}
                      onClick={() => {
                        this.setState({ conUnpass: true });
                      }}
                    >
                      不通过审核
                    </Button>
                    <Button type="primary" onClick={() => this.approve('Y')}>
                      保存并通过审核
                    </Button>
                  </>
                ) : (
                  <span>您不是当前审批人,当前审批人是:{this.state.curAPe}</span>
                )
              ) : null
            }
            onCancel={() => this.setState({ visible: false })}
          >
            <div className="toCheck" style={{ height: '60vh' }}>
              <div
                className="steps"
                style={{ width: 'calc(100% - 48px)', marginLeft: '24px' }}
              >
                {this.state.loading ? null : (
                  <Steps
                    size="small"
                    status={
                      this.state.cms == `Approve = '未通过'`
                        ? 'error'
                        : this.state.cms == `isStreamEnd = 'Y'`
                        ? 'finish'
                        : 'process'
                    }
                    current={this.state.curStep - 1}
                  >
                    {this.state.stream.map((item, key) => {
                      return (
                        <Step
                          title={item.stepName}
                          description={
                            <span>
                              {item.stepPeople}
                              <br />
                              {item.stepTime}
                            </span>
                          }
                        />
                      );
                    })}
                  </Steps>
                )}

                <div
                  className="showContent"
                  style={{ marginTop: 24, width: '100%', marginLeft: '0' }}
                >
                  <b>生效时间：</b>
                  <DatePicker
                    value={this.state.toCheckFront.effortDate}
                    onChange={v =>
                      this.setState({
                        toCheckFront: {
                          ...this.state.toCheckFront,
                          effortDate: v
                        }
                      })
                    }
                  />
                  <b>变动类型：{this.state.toCheckFront.changeType}</b>
                  {/* <b>调动对象姓名：</b><span>{this.state.toCheckFront.C3_632503839336}</span>
                <b>调动对象工号：</b><span>{this.state.toCheckFront.C3_632503839068}</span> */}
                  <br />
                  <br />
                  <b>变动原因：</b>
                  <span>{this.state.toCheckFront.changeReason}</span>
                  <br />
                  {this.state.toCheckFront.C3_632503853105 ? (
                    <div>
                      <b>审核反馈信息：</b>
                      <span>{this.state.toCheckFront.C3_632503853105}</span>
                    </div>
                  ) : null}
                  <div className="tableWrap">
                    <Spin spinning={this.state.loading}>
                      <div style={{ float: 'left' }}>
                        <ul style={{ padding: '0' }}>
                          <li>
                            {' '}
                            <b>姓名: </b>
                            {this.state.toCheckFront.person}
                          </li>
                          <li>
                            <b>部门名: </b>
                            {this.state.toCheckFront.depart ===
                            this.state.toCheck[0] ? (
                              this.state.toCheckFront.depart
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {this.state.toCheckFront.depart +
                                  ' => ' +
                                  this.state.toCheck[0]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>岗位名: </b>
                            {this.state.toCheckFront.jobName ===
                            this.state.toCheck[1] ? (
                              this.state.toCheckFront.jobName
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {this.state.toCheckFront.jobName +
                                  ' => ' +
                                  this.state.toCheck[1]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>级别: </b>
                            {this.state.toCheckFront.level ===
                            this.state.toCheck[2] ? (
                              this.state.toCheckFront.level
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {this.state.toCheckFront.level +
                                  ' => ' +
                                  this.state.toCheck[2]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>主管: </b>
                            {this.state.toCheckFront.driectorName ===
                            this.state.toCheck[3] ? (
                              this.state.toCheckFront.driectorName
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {this.state.toCheckFront.driectorName +
                                  ' => ' +
                                  this.state.toCheck[3]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>项目代码: </b>
                            {this.state.toCheckFront.proj_code ===
                            this.state.toCheck[4] ? (
                              this.state.toCheckFront.proj_code
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {this.state.toCheckFront.proj_code +
                                  ' => ' +
                                  this.state.toCheck[4]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>BU CODE: </b>
                            {(this.state.toCheckFront.bucode || '') ===
                            this.state.toCheck[5] ? (
                              this.state.toCheckFront.bucode
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {(this.state.toCheckFront.bucode || '') +
                                  ' => ' +
                                  this.state.toCheck[5]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>一级部门: </b>
                            {(this.state.toCheckFront.firstDepart || '') ===
                            this.state.toCheck[6] ? (
                              this.state.toCheckFront.firstDepart
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {(this.state.toCheckFront.firstDepart || '') +
                                  ' => ' +
                                  this.state.toCheck[6]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>二级部门: </b>
                            {(this.state.toCheckFront.secondDepart || '') ===
                            this.state.toCheck[7] ? (
                              this.state.toCheckFront.secondDepart
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {(this.state.toCheckFront.secondDepart || '') +
                                  ' => ' +
                                  this.state.toCheck[7]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>三级部门: </b>
                            {(this.state.toCheckFront.thirdDepart || '') ===
                            this.state.toCheck[8] ? (
                              this.state.toCheckFront.thirdDepart
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {(this.state.toCheckFront.thirdDepart || '') +
                                  ' => ' +
                                  this.state.toCheck[8]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>四级部门: </b>
                            {(this.state.toCheckFront.fourthDepart || '') ===
                            this.state.toCheck[9] ? (
                              this.state.toCheckFront.fourthDepart
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {(this.state.toCheckFront.fourthDepart || '') +
                                  ' => ' +
                                  this.state.toCheck[9]}
                              </b>
                            )}
                          </li>
                        </ul>
                      </div>
                      {this.state.toCheckFront.ApproveRemark ? (
                        <>
                          <br />
                          <b>审批说明:</b>
                          <p>{this.state.toCheckFront.ApproveRemark}</p>
                        </>
                      ) : null}
                      <div style={{ float: 'left' }}>
                        <ul style={{ padding: '0', marginLeft: '-1px' }}>
                          <li>
                            <b>是否涉及Headcount：</b>
                            <span>
                              {this.state.toCheckFront.C3_637425449725
                                ? this.state.toCheckFront.C3_637425449725
                                : ''}
                            </span>
                          </li>

                          <li>
                            <b>headcount变更类型：</b>
                            <span>
                              {this.state.toCheckFront.C3_637425577105
                                ? this.state.toCheckFront.C3_637425577105
                                : ''}
                            </span>
                          </li>
                          <li>
                            <b>替代人：</b>
                            <span>
                              {this.state.toCheckFront.C3_637617454519
                                ? this.state.toCheckFront.C3_637617454519
                                : ''}
                            </span>
                          </li>
                          <li>
                            <b>招聘人员备注：</b>
                            <span>
                              {this.state.toCheckFront.C3_637425470106
                                ? this.state.toCheckFront.C3_637425470106
                                : ''}
                            </span>
                          </li>

                          <li>
                            <b>招聘人员确认人姓名：</b>
                            <span>
                              {this.state.toCheckFront.C3_637425935795
                                ? this.state.toCheckFront.C3_637425935795
                                : ''}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </Spin>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <div className="sider">
            <p
              className={this.state.selection == '1' ? 'current' : null}
              onClick={() => {
                this.setState({
                  selection: '1',
                  cms: `(hrPreAprrove ='waiting' or headcount = 'waiting')`,
                  cmsView: `(hrPreAprrove ='waiting' or headcount = 'waiting') and applyPersonNum = '${this.state.userId}'`
                });
              }}
            >
              未开始
            </p>
            <p
              className={this.state.selection == '2' ? 'current' : null}
              onClick={() => {
                this.setState({
                  selection: '2',
                  cms: `Approve = '审核中' and isnull(isStreamEnd,'') = ''`,
                  cmsView: `Approve = '审核中' and isnull(isStreamEnd,'') = '' and applyPersonNum = '${this.state.userId}'`
                });
              }}
            >
              审核中
            </p>
            <p
              className={this.state.selection == '3' ? 'current' : null}
              onClick={() => {
                this.setState({
                  selection: '3',
                  cms: `Approve = '未通过'`,
                  cmsView: `Approve = '未通过' and applyPersonNum = '${this.state.userId}'`
                });
              }}
            >
              未通过
            </p>
            <p
              className={this.state.selection == '4' ? 'current' : null}
              onClick={() => {
                this.setState({
                  selection: '4',
                  cms: `isStreamEnd = 'Y'`,
                  cmsView: `isStreamEnd = 'Y' and applyPersonNum = '${this.state.userId}' and hrEndApprove = 'Y'`
                });
              }}
            >
              已通过
            </p>
            {/* <p className={this.state.selection=='4'?'current':null} onClick={()=>{this.setState({selection:'4',cms:'all'})}}>全部</p> */}
          </div>
          <div
            style={{
              float: 'left',
              width: 'calc(100% - 144px)',
              marginLeft: '24px',
              height: 'calc(100vh - 60px)'
            }}
          >
            <TableData
              resid={632255761674}
              cmswhere={
                this.state.mode == 'view' ? this.state.cmsView : this.state.cms
              }
              hasRowView={false}
              hasAdd={false}
              refTargetComponentName="TableData"
              wrappedComponentRef={element => (this.tableDataRef = element)}
              hasRowDelete={false}
              hasRowModify={false}
              hasModify={false}
              hasDelete={false}
              style={{ height: '100%' }}
              hasRowView={false}
              actionBarWidth={100}
              actionBarFixed={true}
              customRowBtns={[
                record => {
                  return (
                    <Button
                      onClick={() => {
                        this.showOverlay(record);
                      }}
                    >
                      确认信息
                    </Button>
                  );
                }
              ]}
            />
          </div>
        </Spin>
      </div>
    );
  }
}

export default IDLTransferVerify;
