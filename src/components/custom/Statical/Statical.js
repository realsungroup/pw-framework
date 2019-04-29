import React, { Component } from 'react';
import { Button, Icon, Input, Tabs } from 'antd';
import './Statical.less';
import qs from 'qs';
import http from '../../../util20/api';
const TabPane = Tabs.TabPane;
// import EchartsOfReact from 'echarts-of-react';
// const TabPane = Tabs.TabPane;
//   // 图表的配置
//   const option = {
//     xAxis: {
//       type: 'category',
//       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//     },
//     yAxis: {
//       type: 'value'
//     },
//     series: [
//       {
//         data: [820, 932, 901, 934, 1290, 1330, 1320],
//         type: 'line'
//       }
//     ]
//   };
class Statical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryId: '',
      AllStaticalDatas: []
    };
  }

  getStatsticalData = (id) => {
    http()
      .getTable({
        resid: 608838682402,
        cmswhere: 'query_id =' + id
      })
      .then(res => {
        console.log(res.data);
         this.setState({
          //  res.data[0]
         })
      })
      .catch(err => {
        console.error(err);
      });
  };


  componentDidMount() {
    const quertString = window.location.search;
    const qsObj = qs.parse(quertString.substring(1));
    console.log('问卷ID', qsObj.id);
     this.getStatsticalData(qsObj.id);
  }
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" className="temp">
          <TabPane
            tab={
              <span>
                <Icon type="file-sync" />
                统计&分析
              </span>
            }
            key="1"
          >
         11111
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="download" />
                下载
              </span>
            }
            key="2"
          >
            {/* <TableData /> */}
            这里下载的页面
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Statical;
