import React from 'react';
import { DatePicker, Collapse, Button } from 'antd';
import './PostChanges.less';
import BatchTask from '../../../../common/data/BatchTask';

const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const OrgChart = window.OrgChart;
const BALKANGraph = window.BALKANGraph;
OrgChart.templates.myTemplate = Object.assign({}, OrgChart.templates.ula);
OrgChart.templates.myTemplate.node =
  '<rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect>';
OrgChart.templates.myTemplate.field_2 =
  '<text width="145" class="field_2" style="font-size: 16px;" fill="#039BE5" x="100" y="34">{val}</text>';

/*
 *岗位变动
 */
class PostChanges extends React.Component {
  componentDidMount() {
    this.chart = new OrgChart(document.getElementById('subordinates'), {
      template: 'myTemplate',
      nodeBinding: {
        field_0: 'name',
        field_1: 'title',
        field_2: 'tag',
        img_0: 'img'
      },
      toolbar: {
        // layout: true,
        zoom: true,
        fit: true
        // expandAll: false
      },
      enableSearch: false,
      onClick: (sender, node) => {
        if (node.tags.includes('deleted')) {
          return false;
        }
        this.setState({ selectedNode: node });
        let nodes = [...sender.config.nodes];
        nodes = nodes.filter(item => node.id !== item.id);
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
      <div className="personnel-changes_tabpane" id="post-changes">
        {/* <BatchTask
          ref={element => {
            this.batchTask = element;
          }}
          id={626873124921}
          resid={424712995011}
          keycolumn="C3_424712901404"
          keyparm="idstr"
          batchsize={500}
        /> */}
        <div className="post-changes_subordinates">
          <header>
            <div className="change-dates_item">
              <b>今日日期：</b>2019-09-10
            </div>
            <Button onClick={() => this.batchTask.startTask()}>开始</Button>
            <div className="change-dates">
              <div className="change-dates_item">
                <b>当前变动日期：</b>2019-09-11
              </div>
              <div className="change-dates__right">
                <div className="change-dates_item">
                  <b>上次变动日期：</b>2019-09-11
                </div>
                <div className="change-dates_item">
                  <b>下次变动日期：</b>????-??-??
                </div>
              </div>
            </div>
          </header>
          <div className="post-changes_subordinates_architecture-diagram">
            <div className="architecture-diagram__header">
              <div>
                <b>变化期间：</b>
                <RangePicker />
              </div>
            </div>
            <div id="subordinates"></div>
          </div>
        </div>
        <div className="post-changes_change-detail">
          <div className="change-detail_text-item">
            <span className="change-detail_employee-name">王五</span>的变化详情
          </div>
          <div className="change-detail_text-item">
            <span>下级:</span>300人
          </div>
          <div className="change-detail_text-item">
            <span>一级部门:</span>HR
          </div>
          <div className="change-detail_text-item">
            <span>二级部门:</span>HR
          </div>
          <div className="change-detail_text-item">
            <span>三级部门:</span>HR
          </div>
          <div className="change-detail_text-item">
            <span>四级部门:</span>HR
          </div>
          <Collapse bordered={false} expandIconPosition="right">
            <Panel
              header={
                <>
                  <span>岗位:</span>HR
                </>
              }
            ></Panel>
            <Panel
              header={
                <>
                  <span>职位:</span>高级文员
                </>
              }
            ></Panel>
            <Panel
              header={
                <>
                  <span>薪资:</span>8000/月
                </>
              }
            ></Panel>
            <Panel
              header={
                <>
                  <span>级别:</span>S6
                </>
              }
            ></Panel>
          </Collapse>
        </div>
      </div>
    );
  }
}

export default PostChanges;
