import React from 'react';
import './AchievementsGradeAppraising.less';
import { Tree, Tabs, message } from 'antd';
import http, { makeCancelable } from 'Util20/api';
import TableData from 'Common/data/TableData';
import PWRedirect from 'Common/data/PWRedirect';
import { getItem } from 'Util20/util';

const { TabPane } = Tabs;
const tabBarStyle = { background: '#ffffff', marginBottom: 0 };

/**
 * 绩效评级评优
 */
class AchievementsGradeAppraising extends React.Component {
  constructor(props) {
    super(props);
    const userInfo = JSON.parse(getItem('userInfo'));
    this.state = {
      id: userInfo.UserInfo.EMP_USERCODE
    };
  }
  componentDidMount() {}

  render() {
    const { id } = this.state;
    const { mangerConfig } = this.props;
    const config = mangerConfig[id];
    const tableDataProps = {};
    tableDataProps.resid = config.tableDataResid;
    tableDataProps.hasAdd = false;
    tableDataProps.hasModify = false;
    tableDataProps.hasDelete = false;
    tableDataProps.hasRowAdd = false;
    tableDataProps.hasRowModify = false;
    tableDataProps.hasRowDelete = false;
    tableDataProps.hasRowEdit = false;
    tableDataProps.hasRowView = true;
    tableDataProps.actionBarWidth = 150;

    const { iframeResid, replaceBaseUrl, baseURL } = config;
    return (
      <Tabs
        defaultActiveKey="3"
        className="achievements-grade-appraising-tabs"
        size="small"
        tabBarStyle={tabBarStyle}
      >
        <TabPane tab="总经理查看" key="1">
          <TableData {...tableDataProps} />
        </TabPane>
        <TabPane tab="评级评优" key="2">
          <PWRedirect
            resid={iframeResid}
            replaceBaseUrl={replaceBaseUrl}
            baseURL={baseURL}
          />
        </TabPane>
      </Tabs>
    );
  }
}

export default AchievementsGradeAppraising;
