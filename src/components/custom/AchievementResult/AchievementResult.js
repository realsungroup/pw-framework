import React from 'react';
import './AchievementResult.less';
import { Select, Button } from 'antd';
const { Option } = Select;
class AchievementResult extends React.Component {
  render() {
    return (
      <div className="achievement-result">
        <div style={{ width: '30%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex' }}>
              <Select style={{ width: 100 }} size="small" value="FY2020">
                <Option value="FY2020">FY2020</Option>
              </Select>
              <div>
                <span style={{ marginLeft: 16 }}>年中</span>
                <span style={{ marginLeft: 16 }}>年末</span>
              </div>
            </div>
            <Button type="primary" size="small">
              下载报表
            </Button>
          </div>
        </div>
        <div style={{ flex: 1 }}></div>
      </div>
    );
  }
}

export default AchievementResult;
