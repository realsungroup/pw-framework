import React from 'react';
import './GradeAppraising.less';
import { Select, Button, Table } from 'antd';

const { Option } = Select;
const columns = [
  {
    title: '(SH&WX)FY2019年末',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '总人数',
    dataIndex: 'totalNumber',
    key: 'totalNumber'
  },
  {
    title: '优秀10%',
    dataIndex: 'excellent',
    key: 'excellent'
  },
  {
    title: '优良20%',
    dataIndex: 'good',
    key: 'good'
  },
  {
    title: '不合格5%',
    dataIndex: 'unqualified',
    key: 'unqualified'
  },
  {
    title: '星级员工10%',
    dataIndex: 'starEmployee',
    key: 'starEmployee'
  },
  {
    title: '优秀员工',
    dataIndex: 'excellentEmployee',
    key: 'excellentEmployee'
  }
];
const dataSource = [
  {
    key: '1',
    title: '下属额定',
    totalNumber: 804,
    excellent: 80,
    good: 161,
    unqualified: 38,
    starEmployee: 80,
    excellentEmployee: 161
  },
  {
    key: '2',
    title: '下属实际',
    totalNumber: 804,
    excellent: 83,
    good: 163,
    unqualified: 39,
    starEmployee: 83,
    excellentEmployee: 163
  }
];
/**
 * 评级评优
 */
class GradeAppraising extends React.Component {
  render() {
    return <iframe src="" height="100%" width="100%" frameBorder="none" />;
    return (
      <div className="grade-appraising">
        <div
          style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}
        >
          合同地:
          <Select style={{ width: 120, marginLeft: 4 }} size="small"></Select>
          <Button type="primary" size="small" style={{ marginLeft: 24 }}>
            下属评级评优导出
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          size="small"
          pagination={false}
          bordered
        />
        <div
          style={{ display: 'flex', alignItems: 'center', padding: '16px 0' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{ height: 16, width: 16, background: '#F5222D' }}
            ></span>
            <span style={{ padding: '0 16px 0 4px' }}>不参评</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{ height: 16, width: 16, background: '#1890FF' }}
            ></span>
            <span style={{ padding: '0 16px 0 4px' }}>上级已评级</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{ height: 16, width: 16, background: '#52C41A' }}
            ></span>
            <span style={{ padding: '0 16px 0 4px' }}>已提交</span>
          </div>
        </div>
      </div>
    );
  }
}

export default GradeAppraising;
