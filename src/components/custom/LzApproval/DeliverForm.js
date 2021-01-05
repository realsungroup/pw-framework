import { Button, Form, Input } from 'antd';
import React from 'react';
import '../LzAFFOS/LzAFFOS.less';

class DeliverApprovalForm extends React.Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      approvalInfo,
      deliverList,
      approvalList
    } = this.props.toDeliverFormInfo;
    const isControl = approvalInfo.C3_605703930741 === '管控区' ? true : false;
    return (
      <Form>
        <div className="changeAntCss">
          <table className="tableStyle" border="1">
            <tbody>
              <tr>
                <th colSpan="9">
                  <h3>基本信息</h3>
                </th>
              </tr>
              <tr>
                <th colSpan="2">
                  <label>申请人姓名</label>
                </th>
                <th colSpan="2">
                  <label>{approvalInfo.C3_605703779087}</label>
                </th>
                <th colSpan="3">
                  <label>申请人工号</label>
                </th>
                <th colSpan="2">
                  <label>{approvalInfo.C3_605703754022}</label>
                </th>
              </tr>
              <tr>
                <th>
                  <label>来访单位</label>
                </th>
                <th colSpan="2">
                  <label>{approvalInfo.C3_605703828345}</label>
                </th>
                <th>
                  <label>来访事由</label>
                </th>
                <th colSpan="2">
                  <label>{approvalInfo.C3_605703896083}</label>
                </th>
                <th>
                  <label>访问区域</label>
                </th>
                <th colSpan="2">
                  <label>{approvalInfo.C3_605703930741}</label>
                </th>
              </tr>
              {isControl && (
                <>
                  <tr>
                    <th colSpan="2">
                      <label>管控区审批人</label>
                    </th>
                    <th>
                      <label>{approvalInfo.C3_614884016188}</label>
                    </th>
                    <th colSpan="2">
                      <label>管控区审批人工号</label>
                    </th>
                    <th>
                      <label>{approvalInfo.C3_614884015488}</label>
                    </th>
                    <th colSpan="2">
                      <label>管控区审批人编号</label>
                    </th>
                    <th>
                      <label>{approvalInfo.C3_614884015210}</label>
                    </th>
                  </tr>
                </>
              )}
              <tr>
                <th colSpan="2">
                  <label>非管控区负责人</label>
                </th>

                <th>
                  <label>{approvalInfo.C3_614884004893}</label>
                </th>
                <th colSpan="2">
                  <label>非管控区审批人工号</label>
                </th>
                <th>
                  <label>{approvalInfo.C3_614883990443}</label>
                </th>
                <th colSpan="2">
                  <label>非管控区审批人编号</label>
                </th>
                <th>
                  <label>{approvalInfo.C3_614883971652}</label>
                </th>
              </tr>
              <tr>
                <th>
                  <label>申请人手机号</label>
                </th>
                <th colSpan="2">
                  <label>{approvalInfo.C3_619693496163}</label>
                </th>
                <th>
                  <label>申请人分机号</label>
                </th>
                <th colSpan="2">
                  <label>{approvalInfo.C3_619693518811}</label>
                </th>
                <th>
                  <label>车牌号</label>
                </th>
                <th colSpan="2">
                  <label>{approvalInfo.C3_645723637160}</label>
                </th>
              </tr>
              <tr>
                <th colSpan="2">
                  <label>有效开始时间</label>
                </th>
                <th colSpan="2">
                  <label>{approvalInfo.C3_605703980025}</label>
                </th>
                <th colSpan="2">
                  <label>有效结束时间</label>
                </th>
                <th colSpan="3">
                  <label>{approvalInfo.C3_605703992046}</label>
                </th>
              </tr>

              {/* 施工人员清单 */}
              {/* <tr>
                <th colSpan="9">
                  <h3>施工人员清单</h3>
                </th>
              </tr>
              <tr>
                <th className="thCss">
                  <label>访客姓名</label>
                </th>
                <th colSpan="2" className="thCss">
                  <label>登记证件类型</label>
                </th>
                <th colSpan="2" className="thCss">
                  <label>登记证件号码</label>
                </th>
                <th colSpan="2" className="thCss">
                  <label>访客手机号码</label>
                </th>
                <th colSpan="2" className="thCss">
                  <label>照片链接</label>
                </th>
              </tr>
              {deliverList.map((item, index) => {
                // console.log(item);
                return (
                  <tr>
                    <th className="thCss">
                      <label>{item.C3_605716828937}</label>
                    </th>
                    <th colSpan="2" className="thCss">
                      <label>{item.C3_605716867680}</label>
                    </th>
                    <th colSpan="2" className="thCss">
                      <label>{item.C3_614704116070}</label>
                    </th>
                    <th colSpan="2" className="thCss">
                      <label>{item.C3_606412134505}</label>
                    </th>
                    <th colSpan="2" className="thCss">
                      <label>{item.photo}</label>
                    </th>
                  </tr>
                );
              })} */}
              {/* 审批记录 */}
              <tr>
                <th colSpan="9">
                  <h3>审批历史：</h3>
                </th>
              </tr>
              <tr>
                <th colSpan="2">
                  <label>STEP_ID</label>
                </th>
                <th>
                  <label>Group_Name</label>
                </th>
                <th>
                  <label>Approver</label>
                </th>
                <th>
                  <label>Approve_Action</label>
                </th>
                <th>
                  <label>Remark</label>
                </th>
                <th colSpan="3">
                  <label>Updated_At</label>
                </th>
              </tr>
              {isControl && (
                <>
                  <tr>
                    <th colSpan="2">
                      <label>60-总监审批</label>
                    </th>
                    <th>
                      <label>Director</label>
                    </th>
                    <th className="thCss">
                      <label>{approvalInfo.C3_614884016188}</label>
                    </th>
                    <th className="thCss">
                      <label>
                        {approvalList.length > 1
                          ? approvalList[5].C3_605718009813
                          : null}
                      </label>
                    </th>
                    <th>
                      <label></label>
                    </th>
                    <th colSpan="3">
                      <label>
                        {approvalList.length > 1
                          ? approvalList[5].C3_605718014873
                          : null}
                      </label>
                    </th>
                  </tr>
                </>
              )}
              <tr>
                <th colSpan="2">
                  <label>50-经理审批</label>
                </th>
                <th>
                  <label>Manager</label>
                </th>
                <th className="thCss">
                  <label>{approvalInfo.C3_614884004893}</label>
                </th>
                <th className="thCss">
                  <label>
                    {approvalList.length > 1
                      ? approvalList[4].C3_605718009813
                      : null}
                  </label>
                </th>
                <th>
                  <label></label>
                </th>
                <th colSpan="3">
                  <label>
                    {approvalList.length > 1
                      ? approvalList[4].C3_605718014873
                      : null}
                  </label>
                </th>
              </tr>
              <tr>
                <th colSpan="2">
                  <label>10-提交施工需求</label>
                </th>
                <th>
                  <label>Approver</label>
                </th>
                <th className="thCss">
                  <label>{approvalInfo.C3_605703779087}</label>
                </th>
                <th className="thCss">
                  <label>
                    {approvalList.length > 1
                      ? approvalList[0].C3_605718009813
                      : null}
                  </label>
                </th>
                <th>
                  <label></label>
                </th>
                <th colSpan="3">
                  <label>
                    {approvalList.length > 1
                      ? approvalList[0].C3_605718014873
                      : null}
                  </label>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </Form>
    );
  }
}

export default Form.create()(DeliverApprovalForm);
