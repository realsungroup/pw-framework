import React from 'react';
import { Tabs, Card, message, Tag, Spin } from 'antd';
import './LzWorkOvertime.less';
import LzTable from '../../../lib/unit-component/LzTable';
import moment from 'moment';
import { getMainTableData } from 'Util/api';
import LzTabsDataDashboard from '../LzTabsDataDashboard';
const TabPane = Tabs.TabPane;

const lzTableProps = {
  pagination: {
    current: 0,
    pageSize: 10
  },
  isSortBE: true,
  isSearch: true,
  hasRefresh: true,
  hasDownloadExcel: true,
  tableSize: 'small',
  advSearchConfig: {
    // 高级搜索配置
    defaultVisible: false,
    containerName: 'drawer',
    drawerWidth: 500,
    labelWidth: '24%',
    rowWidth: '100%',
    search: [
      {
        title: '工号/姓名',
        innerFieldNames: ['C3_593201544378', 'C3_593718803621']
      }
    ],
    dateRanges: [
      {
        title: '开始结束日期',
        visible: [false, false, false, false],
        innerFieldName: 'C3_593361491636'
      }
    ],
    tag: [
      // tag
      {
        title: '累计是否超额',
        op: 'or', // 操作符：'or' | 'and'
        tags: [
          {
            label: '是',
            value: 'Y',
            isSelected: false,
            innerFieldName: 'C3_593719109530'
          },
          {
            label: '否',
            value: 'N',
            isSelected: false,
            innerFieldName: 'C3_593719109530'
          }
        ]
      }
    ]
  },

  isBackEndBtnsVisible: true,
  opIsFixed: true
};

/**
 * 加班审批
 */
export default class LzWorkOvertime extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cardRecord: {},
      cardLoading: false
    };
  }

  componentDidMount = () => {
    this.getCardRecord();
  };

  getCardRecord = async () => {
    this.setState({ cardLoading: true });
    let res;
    try {
      res = await getMainTableData(593795891953, {
        cmswhere: `dates = ${moment().format('YYYYMMDD')}`
      });
    } catch (err) {
      this.setState({ cardLoading: false });
      message.error(err.message);
    }
    let cardRecord = {};
    if (res.data.length) {
      cardRecord = res.data[0];
    }
    this.setState({ cardRecord, cardLoading: false });
  };

  render() {
    const { cardRecord, cardLoading } = this.state;
    const hasCards = !!Object.keys(cardRecord).length;
    return (
      <div className="lz-work-overtime">
        <Tabs defaultActiveKey="待审批">
          <TabPane tab="待审批" key="待审批">
            <LzTable
              resid={593634015037}
              {...lzTableProps}
              pagination={{
                current: 0,
                pageSize: 50
              }}
              customColumnWidth={{
                员工工号: 120,
                员工姓名: 100,
                小时: 100,
                日剩余加班额度: 150,
                累计加班小时: 150,
                月剩余加班额度: 150,
                是否超额: 100
              }}
              batchBtn={{
                btnName: '一键审批',
                title: '一键审批'
              }}
            />
          </TabPane>
          <TabPane tab="已审批" key="已审批">
            <LzTable
              resid={593689582453}
              {...lzTableProps}
              customColumnWidth={{
                审批节点: 100,
                审批流编号: 150,
                审批序号: 100,
                员工工号: 120,
                员工姓名: 100,
                小时: 100,
                审批结果: 100,
                日期s: 120,
                日剩余加班额度: 150,
                累计加班小时: 150,
                月剩余加班额度: 150,
                是否超额: 100
              }}
            />
          </TabPane>
          <TabPane tab="已拒绝" key="已拒绝">
            <LzTable
              resid={593689653276}
              {...lzTableProps}
              customColumnWidth={{
                审批节点: 100,
                审批流编号: 150,
                审批序号: 100,
                员工工号: 120,
                员工姓名: 100,
                小时: 100,
                审批结果: 100,
                日期s: 120,
                日剩余加班额度: 150,
                累计加班小时: 150,
                月剩余加班额度: 150,
                是否超额: 100
              }}
            />
          </TabPane>
          <TabPane tab="历史记录" key="历史记录">
            <LzTable
              resid={593689668754}
              {...lzTableProps}
              customColumnWidth={{
                审批节点: 100,
                审批流编号: 150,
                审批序号: 100,
                员工工号: 120,
                员工姓名: 100,
                小时: 100,
                审批结果: 100,
                日期s: 120,
                日剩余加班额度: 150,
                累计加班小时: 150,
                月剩余加班额度: 150,
                是否超额: 100
              }}
            />
          </TabPane>
          <TabPane tab="实际加班看板" key="实际加班看板">
            <LzTabsDataDashboard boardType="实际加班" />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
