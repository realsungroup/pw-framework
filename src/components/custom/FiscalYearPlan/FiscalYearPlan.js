import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, Popconfirm, message, Spin, Tabs } from 'antd';
import http from 'Util20/api';
import { Link } from 'react-router-dom';
import { getItem } from 'Util20/util';

const TabPane = Tabs.TabPane;
/**
 * 财年计划
 */
class FiscalYearPlan extends React.Component {
  state = {
    loading: false
  };
  async componentDidMount() {
    let createableGroups = this.props.CreateableGroups; //可创建财年计划id组
    let userinfo = JSON.parse(getItem('userInfo')).UserInfo;
    let grouplist = userinfo.GroupList.replace('(', '')
      .replace(')', '')
      .replace(/'/g, '');
    let listArr = grouplist.split(', ');
    let tag = false;
    //判断当前用户是否可以创建财年计划
    createableGroups.forEach(element => {
      if (listArr.includes(element)) {
        tag = true;
      }
    });
    if (tag) {
      let res;
      try {
        res = await http().addRecords({
          resid: '609615842690', // 表资源 id
          data: [{ C3_609616006519: 'WX' }, { C3_609616006519: 'SHG' }], // 要添加的记录；如 [{ name: '1', age: 18 }, { name: '2', age: 19 }]
          isEditOrAdd: true, // 添加记录的状态是否为 'editoradd'；默认为 false，即状态为 'added'
          uniquecolumns: 'C3_609616006519,C3_609615869581,C3_609615909659' //分公司，财年，制定者
        });
      } catch (error) {}
    }
  }

  handleConfirm = async (dataSource, selectedRowKeys) => {
    if (!selectedRowKeys.length) {
      return message.error('请选择记录');
    }
    const { resid } = this.props;
    this.setState({ loading: true });
    const data = selectedRowKeys.map(recid => ({
      REC_ID: recid,
      C3_605619907534: 'Y'
    }));

    let res;
    try {
      res = await http().modifyRecords({
        resid,
        data
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
    message.success('操作成功');
    this.tableDataRef.handleRefresh();
  };

  renderActionBarExtra = ({ dataSource, selectedRowKeys }) => {
    return (
      <Popconfirm
        title="您确定要操作吗？"
        onConfirm={() => this.handleConfirm(dataSource, selectedRowKeys)}
      >
        <Button>确认</Button>
      </Popconfirm>
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div style={{ height: '100vh' }}>
          <Tabs
            defaultActiveKey="1"
            style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
          >
            <TabPane
              tab="待提交"
              key="1"
              style={{ width: '100%', height: 'calc(100vh - 64px)' }}
            >
              <TableData
                resid={609883172764}
                addText="创建财年计划"
                actionBarWidth={450}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
                      <Link
                        to={{
                          pathname: '/fnmodule',
                          search: `?resid=财年培训课表管理&recid=610555815210&type=前端功能入口&title=财年计划管理&planid=${
                            record.C3_609616660273
                          }`
                        }}
                        target="_self"
                      >
                        <Button size={btnSize}>制定计划</Button>
                      </Link>
                    );
                  }
                ]}
                subTableArrProps={[
                  {
                    subTableName: '审批记录',
                    subResid: 611144001666,
                    tableProps: {
                      hasAdd: false,
                      hasModify: false,
                      hasRowDelete: false,
                      hasRowModify: false,
                      hasDelete: false,
                      subtractH: 190,
                      height: 500,
                      hasRowView: false
                    }
                  },
                  {
                    subTableName: '计划详情',
                    subResid: 611315248461,
                    tableProps: {
                      hasAdd: false,
                      hasModify: false,
                      hasRowDelete: false,
                      hasRowModify: false,
                      hasDelete: false,
                      subtractH: 190,
                      height: 500,
                      hasRowView: false
                    }
                  }
                ]}
                hasBeBtns={true}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
              />
            </TabPane>
            <TabPane
              tab="已提交"
              key="2"
              style={{ width: '100%', height: 'calc(100vh - 64px)' }}
            >
              <TableData
                resid={611165813996}
                hasBeBtns={true}
                hasAdd={false}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                subTableArrProps={[
                  {
                    subTableName: '审批记录',
                    subResid: 611144001666,
                    tableProps: {
                      hasAdd: false,
                      hasModify: false,
                      hasRowDelete: false,
                      hasRowModify: false,
                      hasDelete: false,
                      subtractH: 190,
                      height: 500,
                      hasRowView: false
                    }
                  },
                  {
                    subTableName: '计划详情',
                    subResid: 611315248461,
                    tableProps: {
                      hasAdd: false,
                      hasModify: false,
                      hasRowDelete: false,
                      hasRowModify: false,
                      hasDelete: false,
                      subtractH: 190,
                      height: 500,
                      hasRowView: false
                    }
                  }
                ]}
              />
            </TabPane>
          </Tabs>
        </div>
      </Spin>
    );
  }
}

export default FiscalYearPlan;
