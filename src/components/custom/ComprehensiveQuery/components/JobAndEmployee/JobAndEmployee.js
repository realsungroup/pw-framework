import React from 'react';
import { DatePicker } from 'antd';
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
OrgChart.templates.myTemplate = Object.assign({}, OrgChart.templates.ula);

OrgChart.templates.myTemplate.node =
  '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect>';
OrgChart.templates.myTemplate.field_2 =
  '<text width="145" class="field_2" style="font-size: 16px;" fill="#039BE5" x="100" y="34">{val}</text>';

class JobAndEmployee extends React.Component {
  state = {
    selectedNode: {}
  };
  componentDidMount() {
    this.chart = new OrgChart(document.getElementById('nodes'), {
      template: 'myTemplate',
      nodeBinding: {
        field_0: 'name',
        field_1: 'title',
        field_2: 'tag',
        img_0: 'img'
      },
      enableSearch: false,
      onClick: (sender, node) => {
        if (node.tags.includes('deleted')) {
          return false;
        }
        this.setState({ selectedNode: node });
        let nodes = [...sender.config.nodes];
        nodes = nodes.filter(item => node.id !== item.id);
        // if (node.tags && node.tags.includes('dotted')) {
        //   sender.updateNode({ ...node, tags: [] });
        // } else {
        nodes.forEach(item => {
          let index = item.tags.findIndex(item => item === 'selected');
          if (index > -1) {
            item.tags.splice(index, 1);
            sender.update(item);
          }
        });
        let selectedNode = { ...node, tags: [...node.tags, 'selected'] };
        sender.update(selectedNode);
        sender.draw();
        // }
        return false;
      },
      tags: {
        selected: 'selected',
        deleted: 'deleted'
      },
      scaleInitial: BALKANGraph.match.height,
      scaleMin: 0.3,
      mouseScroolBehaviour: BALKANGraph.action.zoom,
      // nodeMenu: {
      //   // add: { text: '添加' }
      // },
      nodes: [
        {
          id: 1,
          name: '姓名：张三',
          title: 'CEO',
          img: '//balkangraph.com/js/img/1.jpg',
          mobile: '0878108255',
          tag: '新成员',
          tags: []
        },
        {
          id: 2,
          pid: 1,
          name: 'Ava Field',
          title: 'IT Manager',
          img: '//balkangraph.com/js/img/2.jpg',
          mobile: '0878108255',
          tags: ['deleted'],
          tag: '新成员'
        },
        {
          id: 3,
          pid: 1,
          name: 'Peter Stevens',
          title: 'HR Manager',
          img: '//balkangraph.com/js/img/3.jpg',
          tag: '新成员',
          tags: []
        },
        {
          id: 4,
          pid: 3,
          name: 'Avery Woods',
          title: 'HR',
          img: '//balkangraph.com/js/img/4.jpg',
          tag: '新成员',
          tags: []
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
