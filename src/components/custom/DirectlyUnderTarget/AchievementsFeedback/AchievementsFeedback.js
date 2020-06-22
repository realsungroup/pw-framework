import React from 'react';
import './AchievementsFeedback.less';
import TableData from 'Common/data/TableData';
import { Button } from 'antd';

/**
 * 绩效反馈
 */
class AchievementsFeedback extends React.Component {
  render() {
    const { residConfig, baseURL } = this.props;
    return (
      <div className="achievements-feedback">
        <TableData
          resid={residConfig.绩效反馈}
          hasBeBtns
          recordFormUseAbsolute={true}
          hasRowDelete={false}
          hasDelete={false}
          hasAdd={false}
          hasModify={false}
          hasRowModify={false}
          hasRowSelection={true}
          baseURL={baseURL}
        />
      </div>
    );
  }
}

export default AchievementsFeedback;
