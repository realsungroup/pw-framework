import { Button, Form, Modal, Select, Input, message } from 'antd';
import React from 'react';
import '../LzAFFOS/LzAFFOS.less';

class BuildApprovlForm extends React.Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      isLongBuilder,
      builderList,
      approvalInfo,
      approvalList
    } = this.props.toBuilderFormInfo;
    const isControl = approvalInfo.C3_605703930741 === '管控区' ? true : false;
    console.log(approvalInfo);

    return (
      <Form>
        <div className="changeAntCss">
          <table border="1">
            <tbody>
              <tr>
                <th colSpan="9">
                  <h3>基本信息</h3>
                </th>
              </tr>
              <tr>
                <th>
                  <label>申请人</label>
                </th>
                <th>
                  {getFieldDecorator('C3_605703779087', {
                    initialValue: approvalInfo.C3_605703779087
                  })(<Input disabled />)}
                </th>
                <th colSpan="2">
                  <label>申请人所属部门</label>
                </th>
                <th colSpan="5">
                  {getFieldDecorator('C3_605703793342', {
                    initialValue: approvalInfo.C3_605703793342
                  })(<Input disabled />)}
                </th>
              </tr>
              <tr>
                <th colSpan="2">
                  <label>来访单位</label>
                </th>
                <th colSpan="2">
                  {getFieldDecorator('C3_605703828345', {
                    initialValue: approvalInfo.C3_605703828345
                  })(<Input disabled />)}
                </th>
                <th colSpan="2">
                  <label>来访事由</label>
                </th>
                <th colSpan="3">
                  {getFieldDecorator('C3_605703896083', {
                    initialValue: approvalInfo.C3_605703896083
                  })(<Input disabled />)}
                </th>
              </tr>
              <tr>
                <th>
                  <label>工程描述</label>
                </th>
                <th colSpan="8">
                  {getFieldDecorator('projectIntro', {
                    initialValue: approvalInfo.projectIntro
                  })(<Input disabled />)}
                </th>
              </tr>
              <tr>
                <th colSpan="2">
                  <label>机台名称或作业地点</label>
                </th>
                <th>
                  {getFieldDecorator('platformOrPlace', {
                    initialValue: approvalInfo.platformOrPlace
                  })(<Input disabled />)}
                </th>
                <th colSpan="2">
                  <label>是否为长期作业(最长十四日)</label>
                </th>
                <th colSpan="1">
                  {getFieldDecorator('isLong', {
                    initialValue: approvalInfo.isLong
                  })(<Input disabled />)}
                </th>
                <th colSpan="2">
                  <label>受施工影响部门负责人</label>
                </th>
                <th>
                  {getFieldDecorator('influentedManage', {
                    initialValue: approvalInfo.influentedManage
                  })(<Input disabled />)}
                </th>
              </tr>
              <tr>
                <th colSpan="2">
                  <label>申请作业时间</label>
                </th>
                <th colSpan="3">
                  {getFieldDecorator('C3_605703980025', {
                    initialValue: `${approvalInfo.C3_605703980025}~${approvalInfo.C3_605703992046}`
                  })(<Input disabled />)}
                </th>
                <th>
                  <label>作业时段</label>
                </th>
                <th colSpan="3">
                  {getFieldDecorator('workTime', {
                    initialValue: approvalInfo.workTime
                  })(<Input disabled />)}
                </th>
              </tr>
              <tr>
                <th colSpan="2">
                  <label>施工管理部门</label>
                </th>
                <th>
                  {getFieldDecorator('buildArrangeDept', {
                    initialValue: approvalInfo.buildArrangeDept
                  })(<Input disabled />)}
                </th>
                <th colSpan="1">
                  <label>Finisar施工/作业负责人</label>
                </th>
                <th>
                  {getFieldDecorator('factoryEngineer', {
                    initialValue: approvalInfo.factoryEngineer
                  })(<Input disabled />)}
                </th>
                <th>
                  <label>负责人电话</label>
                </th>
                <th colSpan="3">
                  {getFieldDecorator('factoryEngineerTel', {
                    initialValue: approvalInfo.factoryEngineerTel
                  })(<Input disabled />)}
                </th>
              </tr>
              <tr>
                <th colSpan="2">
                  <label>作业承包商公司名称</label>
                </th>
                <th>
                  {getFieldDecorator('contractor', {
                    initialValue: approvalInfo.contractor
                  })(<Input disabled />)}
                </th>
                <th colSpan="1">
                  <label>安全管理人员姓名</label>
                </th>
                <th>
                  {getFieldDecorator('securityName', {
                    initialValue: approvalInfo.securityName
                  })(<Input disabled />)}
                </th>
                <th>
                  <label>安全管理人员电话</label>
                </th>
                <th colSpan="3">
                  {getFieldDecorator('securityTel', {
                    initialValue: approvalInfo.securityTel
                  })(<Input disabled />)}
                </th>
              </tr>
              <tr>
                <th>
                  <label>访问区域</label>
                </th>
                <th colSpan="2">
                  {getFieldDecorator('C3_605703930741', {
                    initialValue: approvalInfo.C3_605703930741
                  })(<Input disabled />)}
                </th>
                <th colSpan={isControl ? '2' : '5'}>
                  <label>非管控区负责人</label>
                </th>
                <th>
                  {getFieldDecorator('C3_614884004893', {
                    initialValue: approvalInfo.C3_614884004893
                  })(<Input disabled />)}
                </th>
                {isControl && (
                  <>
                    <th colSpan="2">
                      <label>管控区负责人</label>
                    </th>
                    <th>
                      {getFieldDecorator('C3_614884016188', {
                        initialValue: approvalInfo.C3_614884016188
                      })(<Input disabled />)}
                    </th>
                  </>
                )}
              </tr>
              {/* 长期施工 */}
              {isLongBuilder && (
                <>
                  <tr>
                    <th colSpan="9">
                      <h3>承包商长期作业许可证</h3>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="3">
                      <label>承包方的Finisar施工EHS培训是否完成</label>
                    </th>
                    <th>
                      {getFieldDecorator('isTrained', {
                        initialValue: approvalInfo.isTrained
                      })(<Input disabled />)}
                    </th>
                    <th colSpan="4">
                      <label>
                        承包商是否穿着[识别背心或公司制服]并备妥[施工标示板]
                      </label>
                    </th>
                    <th>
                      {getFieldDecorator('isFormulated', {
                        initialValue: approvalInfo.isFormulated
                      })(<Input disabled />)}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="3">
                      <label>
                        承包商作业人员是否已取得作业所需要的相关证照
                      </label>
                    </th>
                    <th>
                      {getFieldDecorator('isLicenced', {
                        initialValue: approvalInfo.isLicenced
                      })(<Input disabled />)}
                    </th>
                    <th colSpan="4">
                      <label>
                        气体钢瓶、化学品、工具箱、氩/电焊机、切割机，宽或高超过40公分之电气设施是否已标示作业厂商名称及联络人姓名及电话
                      </label>
                    </th>
                    <th>
                      {getFieldDecorator('isSpecialSigned', {
                        initialValue: approvalInfo.isSpecialSigned
                      })(<Input disabled />)}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="3">
                      <label>作业过程中是否可能碰撞[消防喷淋系统]</label>
                    </th>
                    <th>
                      {getFieldDecorator('isTall', {
                        initialValue: approvalInfo.isTall
                      })(<Input disabled />)}
                    </th>
                    <th colSpan="4">
                      <label>牵涉本作业之作业许可证</label>
                    </th>
                    <th>
                      {getFieldDecorator('specialLicence', {
                        initialValue: approvalInfo.specialLicence
                      })(<Input disabled />)}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="3">
                      <label>是否是洁净室作业</label>
                    </th>
                    <th>
                      {getFieldDecorator('isClean', {
                        initialValue: approvalInfo.isClean
                      })(<Input disabled />)}
                    </th>
                    <th colSpan="4">
                      <label>承包商作业人员是否已完成[洁净室培训]</label>
                    </th>
                    <th>
                      {getFieldDecorator('isCleanTrained', {
                        initialValue: approvalInfo.isCleanTrained
                      })(<Input disabled />)}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="3">
                      <label>作业过程中是否可能产生灰尘污染洁净室</label>
                    </th>
                    <th>
                      {getFieldDecorator('maybePolluted', {
                        initialValue: approvalInfo.maybePolluted
                      })(<Input disabled />)}
                    </th>
                    <th colSpan="3">
                      <label>
                        是：请说明防止作业中产生之灰尘污染结净室的措施[洁净室培训]
                      </label>
                    </th>
                    <th colSpan="2">
                      {getFieldDecorator('measureDefence', {
                        initialValue: approvalInfo.measureDefence
                      })(<Input disabled />)}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="3">
                      <label>
                        是否使用solvent（溶剂类）或可能产生异味之化学品
                      </label>
                    </th>
                    <th>
                      {getFieldDecorator('useChemist', {
                        initialValue: approvalInfo.useChemist
                      })(<Input disabled />)}
                    </th>
                    <th colSpan="3">
                      <label>
                        是：请说明防止作业中/作业后化学品逸散/翻洒及火灾防护之措施
                      </label>
                    </th>
                    <th colSpan="2">
                      {getFieldDecorator('emergency', {
                        initialValue: approvalInfo.emergency
                      })(<Input disabled />)}
                    </th>
                  </tr>
                </>
              )}
              {/* 临时施工 */}
              {!isLongBuilder && (
                <>
                  <tr>
                    <th colSpan="9">
                      <h3>承包商临时作业许可证</h3>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="3">
                      <label>
                        是否已向承包商作业人员进行危害告知及安全宣导
                      </label>
                    </th>
                    <th>
                      {getFieldDecorator('safetyPropaganda', {
                        initialValue: approvalInfo.safetyPropaganda
                      })(<Input disabled />)}
                    </th>
                    <th colSpan="4">
                      <label>承包商是否备齐“施工标示板”</label>
                    </th>
                    <th>
                      {getFieldDecorator('constructionMark', {
                        initialValue: approvalInfo.constructionMark
                      })(<Input disabled />)}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="3">
                      <label>施工过程是否可能产生异味</label>
                    </th>
                    <th>
                      {getFieldDecorator('peculiarSmell', {
                        initialValue: approvalInfo.peculiarSmell
                      })(<Input disabled />)}
                    </th>
                    <th colSpan="4">
                      <label>施工过程使用电器是否符合要求</label>
                    </th>
                    <th>
                      {getFieldDecorator('electricAppliance', {
                        initialValue: approvalInfo.electricAppliance
                      })(<Input disabled />)}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="3">
                      <label>施工过程是否会使用化学品</label>
                    </th>
                    <th>
                      {getFieldDecorator('useChemist2', {
                        initialValue: approvalInfo.useChemist2
                      })(<Input disabled />)}
                    </th>
                    <th colSpan="4">
                      <label>作业人员是否有必要的防护具</label>
                    </th>
                    <th>
                      {getFieldDecorator('protection', {
                        initialValue: approvalInfo.protection
                      })(<Input disabled />)}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="3">
                      <label>开孔作业是否有围篙和警示标志</label>
                    </th>
                    <th>
                      {getFieldDecorator('denfenceAndWarn', {
                        initialValue: approvalInfo.denfenceAndWarn
                      })(<Input disabled />)}
                    </th>
                    <th colSpan="4">
                      <label>施工器材是否会阻挡消防器材或消防通道</label>
                    </th>
                    <th>
                      {getFieldDecorator('blockFirePassage', {
                        initialValue: approvalInfo.blockFirePassage
                      })(<Input disabled />)}
                    </th>
                  </tr>
                </>
              )}

              {/* 施工人员清单 */}
              <tr>
                <th colSpan="9">
                  <h3>施工人员清单</h3>
                </th>
              </tr>
              <tr>
                <th className="thCss">
                  <label>访客姓名</label>
                </th>
                <th className="thCss">
                  <label>登记证件类型</label>
                </th>

                <th colSpan="2" className="thCss">
                  <label>登记证件号码</label>
                </th>
                <th colSpan="2" className="thCss">
                  <label>访客手机号码</label>
                </th>
                <th colSpan="3" className="thCss">
                  <label>备注</label>
                </th>
              </tr>
              {builderList.map((item, index) => {
                return (
                  <tr>
                    <th className="thCss">
                      <label>{item.C3_605716828937}</label>
                    </th>
                    <th className="thCss">
                      <label>{item.C3_605716867680}</label>
                    </th>
                    <th colSpan="2" className="thCss">
                      <label>{item.C3_614704116070}</label>
                    </th>
                    <th colSpan="2" className="thCss">
                      <label>{item.C3_606412134505}</label>
                    </th>
                    <th colSpan="3" className="thCss">
                      <label>{item.C3_605717318503}</label>
                    </th>
                  </tr>
                );
              })}
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
                    <th>
                      {getFieldDecorator('C3_614884016188', {
                        initialValue: approvalInfo.C3_614884016188
                      })(<Input disabled />)}
                    </th>
                    <th>
                      <label></label>
                    </th>
                    <th>
                      <label></label>
                    </th>
                    <th colSpan="3">
                      <label></label>
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
                <th>
                  {getFieldDecorator('C3_614884004893', {
                    initialValue: approvalInfo.C3_614884004893
                  })(<Input disabled />)}
                </th>
                <th>
                  <label></label>
                </th>
                <th>
                  <label></label>
                </th>
                <th colSpan="3">
                  <label></label>
                </th>
              </tr>
              <tr>
                <th colSpan="2">
                  <label>40-厂务经理审批</label>
                </th>
                <th>
                  <label>FAC_Manager</label>
                </th>
                <th>
                  {getFieldDecorator('FAC_Manager', {
                    initialValue: approvalInfo.FAC_Manager
                  })(<Input disabled />)}
                </th>
                <th>
                  <label></label>
                </th>
                <th>
                  <label></label>
                </th>
                <th colSpan="3">
                  <label></label>
                </th>
              </tr>
              <tr>
                <th colSpan="2">
                  <label>30-厂务工程师审批</label>
                </th>
                <th>
                  <label>ASSIGNED-Zhang.Zhou</label>
                </th>
                <th>
                  {getFieldDecorator('factoryEngineer', {
                    initialValue: approvalInfo.factoryEngineer
                  })(<Input disabled />)}
                </th>
                <th>
                  <label></label>
                </th>
                <th>
                  <label></label>
                </th>
                <th colSpan="3">
                  <label></label>
                </th>
              </tr>
              <tr>
                <th colSpan="2">
                  <label>20-施工影响部门主管审批</label>
                </th>
                <th>
                  <label>ASSIGNED-NA</label>
                </th>
                <th>
                  {getFieldDecorator('influentedManage', {
                    initialValue: approvalInfo.influentedManage
                  })(<Input disabled />)}
                </th>
                <th>
                  <label></label>
                </th>
                <th>
                  <label></label>
                </th>
                <th colSpan="3">
                  <label></label>
                </th>
              </tr>
              <tr>
                <th colSpan="2">
                  <label>10-提交施工需求</label>
                </th>
                <th>
                  <label>Approver</label>
                </th>
                <th>
                  {getFieldDecorator('C3_605703779087', {
                    initialValue: approvalInfo.C3_605703779087
                  })(<Input disabled />)}
                </th>
                <th>
                  <label></label>
                </th>
                <th>
                  <label></label>
                </th>
                <th colSpan="3">
                  <label></label>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </Form>
    );
  }
}

export default Form.create()(BuildApprovlForm);
