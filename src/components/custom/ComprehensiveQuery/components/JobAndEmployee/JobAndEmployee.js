import React from 'react';
import { DatePicker } from 'antd';
import TableData from '../../../../common/data/TableData';
import OrgChartData from 'Common/data/OrgChartData';

import './JobAndEmployee.less';

const OrgChart = window.OrgChart;
const BALKANGraph = window.BALKANGraph;

const orgChartConfig = {
  resid: 602348115218,
  template: 'rony',
  chartId: 'org-chart',
  chartWrapId: 'org-chart-wrap',
  level: 9,
  isExpandAllChildren: false,
  isCanOperation: false,
  pidField: 'C3_602347244770',
  idField: 'C3_602347243263',
  enableDragDrop: false,
  collapse: { level: 1, allChildren: true },

  expand: {},
  showFields: {
    field_0: 'C3_602347243459',
    field_1: 'C3_602347246317',
    field_2: 'C3_602347244217',
    field_3: 'C3_602416916077',
    field_4: 'C3_602417234378',
    img_0: 'C3_602350177952'
  },
  recordFormContainerProps: { width: 500 },
  rootIds: [14938755],
  rootIdsResid: 613754866338,
  groupingConfig: [
    {
      resourceOfTag: '602364331868',
      sourceColumnOfGroupName: 'groupname',
      sourceColumnOfTagName: 'tagname',
      columnOfTagName: 'tagsname',
      isGroupTag: true,
      cmswhere: ''
    }
  ],
  keyField: 'C3_602347243459'
};
class JobAndEmployee extends React.Component {
  state = {
    selectedNode: {}
  };
  componentDidMount() {
    this.chart = new OrgChart(document.getElementById('nodes'), {
      template: 'ula',
      nodeBinding: {
        field_0: 'name',
        field_1: 'title',
        img_0: 'img'
      },
      enableSearch: false,
      onClick: (sender, node) => {
        this.setState({ selectedNode: node });
        let nodes = [...sender.config.nodes];
        nodes = nodes.filter(item => node.id !== item.id);
        if (node.tags && node.tags.includes('dotted')) {
          sender.updateNode({ ...node, tags: [] });
        } else {
          nodes.forEach(item => {
            item.tags = [];
            sender.update(item);
          });
          sender.update({ ...node, tags: ['dotted'] });
          sender.draw();
        }
        return false;
      },
      tags: {
        dotted: 'dotted'
      },
      scaleInitial: BALKANGraph.match.height,
      scaleMin: 0.3,
      mouseScroolBehaviour: BALKANGraph.action.zoom,
      nodeMenu: {
        add: { text: '添加' }
      },
      nodes: [
        {
          id: 1,
          name: '姓名：张三',
          title: 'CEO',
          img: '//balkangraph.com/js/img/1.jpg',
          mobile: '0878108255',
          height: 1.66
        },
        {
          id: 2,
          pid: 1,
          name: 'Ava Field',
          title: 'IT Manager',
          img: '//balkangraph.com/js/img/2.jpg',
          mobile: '0878108255'
        },
        {
          id: 3,
          pid: 1,
          name: 'Peter Stevens',
          title: 'HR Manager',
          img: '//balkangraph.com/js/img/3.jpg'
        },
        {
          id: 4,
          pid: 3,
          name: 'Avery Woods',
          title: 'HR',
          img: '//balkangraph.com/js/img/4.jpg'
        }
      ]
    });
  }
  render() {
    return (
      <div className="training-query">
        <div className="training-query_left">
          <div>
            变化期间
            <DatePicker />
            <DatePicker />
          </div>
          <div>变化项目</div>
          <div></div>
        </div>
        <div className="training-query_right">
          <div id="nodes" />
          <div className="training-query_right_employee_info">
            {this.state.selectedNode.name}
          </div>
          {/* <OrgChartData {...orgChartConfig} /> */}
        </div>
      </div>
    );
  }
}

export default JobAndEmployee;
