import React from 'react';
import { Select, Icon, Input, Button } from 'antd';
import { Tree } from 'antd';
import http from 'Util20/api';

const { TreeNode } = Tree;

// 实例化时必须传入的数据

// {
// el:DOM,
// resid:str,
// ColumnOfID:str,
// ColumnOfPID:str,
// ProductIDs:str
// }

// 这是要将组建渲染进去的外层元素
// 树形查询
class TreeRel extends React.Component {
  // this.props.onChangePosition(offsetTop)
  constructor(props){
    super(props);

    this.state.url=props.url;
    this.state.selectedId=props.ProductIDs;
    this.state.ProductIDs=props.ProductIDs;
    this.state.resid=props.resid;
    this.state.ColumnOfID=props.ColumnOfID;
    this.state.ColumnOfPID=props.ColumnOfPID;

    console.log(this.state)
    // 输出选中项ID的方法
    // this.getId=this.getIdProto();
    // 输出选中项offsetTop的方法
    // this.getOffsetTop=this.getOffsetTopProto();
  }
  state = {
    treeData: [
      { title: 'Expand to load', key: '0' },
      { title: 'Expand to load', key: '1' },
      { title: 'Tree Node', key: '2', isLeaf: true },
    ],
  };

  onLoadData = treeNode =>
    new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
          { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
        ];
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      }, 1000);
    });

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });

  getIdProto(){
    return this.state.selectedId;
  }
  getOffsetTopProto(){
    return this.state.selectedOffsetTop;
  }



  // 获取树的数据
  getData = async id => {
    console.log('进来了')
    try {
      let res = await http().postTreeData({
        resid:this.state.resid,//表ID
        Levels:2,//查找的层级，比如查父节点-子节点-孙节点就写3，查父节点-子节点就写2
        MoveDirection:1,//不用管它，数据写死，照抄就行
        MoveLevels:1,//不用管它，数据写死，照抄就行
        ColumnOfID:this.state.ColumnOfID,//要查的人的ID的字段名
        ColumnOfPID:this.state.ColumnOfPID,//要查的人的父ID的字段名
        ProductIDs:this.state.ProductIDs//要查的人的ID
      });
      console.log(res)
      var arr=[];
      var n=0;
      while(n<res.nodes.length){
        arr.push({title:res.nodes[n].C3_613753776398,key:res.nodes[n].C3_602347243263});
        n++;
      }
      console.log(arr)
      this.setState('treeData',arr)
      console.log(arr)
    } catch (error) {
      console.log(error.message);
    }
  };

  state = {
      selectedId:'',
      selectedOffsetTop:'',
      resid:'',
      ColumnOfID:'',
      ColumnOfPID:'',
      ProductIDs:'',
      treeData: [
        { title: 'Expand to load', key: '0' }
      ],
  };

  componentDidMount = () => {
    this.getData();
  };

  render() {
    return (
        <Tree defaultSelectedKeys={['0']} loadData={this.onLoadData}>{this.renderTreeNodes(this.state.treeData)}</Tree>
    )
  }
}


export default TreeRel;
