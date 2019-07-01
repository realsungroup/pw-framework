import React from 'react';
import { TableData } from '../../../common/loadableCommon';
import { Button, Collapse, message, Popconfirm } from 'antd';
import './DefinePlan.less';

const Panel = Collapse.Panel;

class DefinePlan extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  componentDidMount = async () => {
    this.props.onGetSelectedPlan();
  };
  applyPlan = () => {
    this.props.applyPlan();
  };

  render() {
    return (
      <Collapse defaultActiveKey={['1']}>
        <Panel
          header={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              计划基本信息
              <Popconfirm
                placement="topRight"
                title={'确认要删除么?'}
                onConfirm={this.applyPlan}
                okText="确认"
                cancelText="取消"
                onCancel={event => {
                  event.stopPropagation();
                }}
              >
                <Button
                  type="link"
                  shape='round'
                  onClick={event => {
                    event.stopPropagation();
                  }}
                >
                  提交计划
                </Button>
              </Popconfirm>
            </div>
          }
          key="1"
        >
          <div className="plan_infos">
            {/* <div className="plan_infos_item">编号:{item.C3_609616660273}</div> */}
            <div className="plan_infos_item">
              财年: {this.props.selectedPlan.C3_609615869581}
            </div>
            <div className="plan_infos_item">
              制定者：{this.props.selectedPlan.C3_609615939753}
            </div>
            <div className="plan_infos_item">
              下属人数：{this.props.selectedPlan.C3_609615996253}
            </div>
            <div className="plan_infos_item">
              {' '}
              部门：{this.props.selectedPlan.C3_609616487709}
            </div>
            <div className="plan_infos_item">
              总预算：{this.props.selectedPlan.C3_609616030566}
            </div>
            <div className="plan_infos_item">
              人均预算：{this.props.selectedPlan.C3_611074040082}
            </div>
            <div className="plan_infos_item">
              实际费用：{this.props.selectedPlan.C3_609616051191}
            </div>
            {/* <div className="plan_infos_item">
              是否提交：{this.props.selectedPlan.C3_609874867626}
            </div> */}
            {/* <div className="plan_infos_item">
              状态：{this.props.selectedPlan.C3_609874879829}
            </div> */}
            {/* <div className="plan_infos_item">一级部门编号：{this.props.selectedPlan.C3_609874956063}</div> */}
            <div className="plan_infos_item">
              一级部门经理：{this.props.selectedPlan.C3_609874982844}
            </div>
            <div className="plan_infos_item">
              HR：{this.props.selectedPlan.C3_609874947298}
            </div>
          </div>
        </Panel>
        <Panel header="计划详细信息" key="2">
          <TableData
            resid={611315248461}
            key="611315248461"
            hasBeBtns={true}
            subtractH={200}
            height={400}
            hasAdd={false}
            hasRowView={false}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            actionBarFixed={true}
            hasRowModify={false}
            cmswhere={`C3_609616805633 = '${this.props.selectedPlan.C3_609616660273}'`}
            // actionBarExtra={(dataSource, selectedRowKeys) => {
            //   return (
            //     <Popconfirm
            //       title="是否确认提交？"
            //       onConfirm={this.applyPlan}
            //       okText="是"
            //       cancelText="否"
            //     >
            //       <Button>提交计划</Button>
            //     </Popconfirm>
            //   );
            // }}
          />
        </Panel>
      </Collapse>
    );
  }
}
export default DefinePlan;
