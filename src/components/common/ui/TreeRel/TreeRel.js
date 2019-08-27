import React from 'react';
import { Select, Icon, Input, Button } from 'antd';
import { Tree } from 'antd';
import http from 'Util20/api';
import './TreeRel.less';

const { TreeNode } = Tree;
var bol=false;
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
      this.state = {
          selectedId:[props.ProductIDs],
          selectedOffsetTop:'',
          resid:props.resid,
          ColumnOfID:props.ColumnOfID,
          ColumnOfPID:props.ColumnOfPID,
          ProductIDs:'',
          treeData:[],
          hover:true,
          url:props.url,
          ProductIDs:props.ProductIDs,

      };
    //
    // this.state.url=props.url;
    // // this.state.selectedId=[props.ProductIDs];
    // this.state.ProductIDs=props.ProductIDs;
    // this.state.resid=props.resid;
    // this.state.ColumnOfID=props.ColumnOfID;
    // this.state.ColumnOfPID=props.ColumnOfPID;


    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    console.log(this.state)
    // 输出选中项ID的方法
    // this.getId=this.getIdProto();
    // 输出选中项offsetTop的方法
    // this.getOffsetTop=this.getOffsetTopProto();
  }

  onMouseEnter(){
      this.setState({
          hover: true,
      });
  }

  onMouseLeave(){
    console.log(this.state.selectedId)
    if(!this.state.selectedId){
      this.setState({
          hover: false,
      })
    }else{
      this.setState({
          hover: true,
      })
    }

  }

onLoadData = async treeNode =>{
    // new Promise(resolve => {
      if (treeNode.props.children) {
        // resolve();
        return;
      }
      try {
        let res = await http().postTreeData({
          resid:this.state.resid,//表ID
          Levels:2,//查找的层级，比如查父节点-子节点-孙节点就写3，查父节点-子节点就写2
          MoveDirection:1,//不用管它，数据写死，照抄就行
          MoveLevels:1,//不用管它，数据写死，照抄就行
          ColumnOfID:this.state.ColumnOfID,//要查的人的ID的字段名
          ColumnOfPID:this.state.ColumnOfPID,//要查的人的父ID的字段名
          ProductIDs:treeNode.props.dataRef.key//要查的人的ID

        });
        console.log(res)
        var arr=[];
        var n=0;
        while(n<res.nodes.length){
          if(treeNode.props.dataRef.key!=res.nodes[n].C3_602347243263){
            if(res.nodes[n].totalNodes==0){
              arr.push({title:(res.nodes[n].C3_613753776398||'')+(res.nodes[n].C3_602347246317||'')+(res.nodes[n].C3_612377399102||''),key:res.nodes[n].C3_602347243263,isLeaf:true});

            }else{
              arr.push({title:(res.nodes[n].C3_613753776398||'')+(res.nodes[n].C3_602347246317||'')+(res.nodes[n].C3_612377399102||''),key:res.nodes[n].C3_602347243263});

            }
          }
          n++;
        }
        treeNode.props.dataRef.children = arr;
        this.setState({
          treeData: [...this.state.treeData],
        });
        console.log('加载',this.state)
      //   resolve();
      //
      } catch (error) {
        console.log(error.message);
      }

    };

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
      var arr=[];
      var n=0;
      while(n<res.nodes.length){
        if(this.state.ProductIDs==res.nodes[n].C3_602347243263){
          arr.push({title:(res.nodes[n].C3_613753776398||'')+(res.nodes[n].C3_602347246317||'')+(res.nodes[n].C3_612377399102||''),key:res.nodes[n].C3_602347243263});
        }
        n++;
      }
      this.setState({treeData:arr})
    } catch (error) {
      console.log(error.message);
    }
  };



  onSelect = (selectedKeys,e) =>{
    this.setState({selectedOffsetTop:e.node.selectHandle.offsetTop});
    this.setState({selectedId:selectedKeys});
    this.refs.shrink.style.top = e.node.selectHandle.offsetTop+'px';
    if(selectedKeys.length>0){
      this.setState({hover:true});
    }else{
      this.setState({selectedId:''});
      this.setState({hover:false});

    }
    console.log(this.refs.shrink);
  };
  componentDidMount = () => {
    this.getData();
  };

  render() {
    return(
      <div className='sideWrap'>
        <div className='sideWrapInner'>
            <div className='sideBg'>
              <Tree selectedKeys={this.state.selectedId} onSelect={this.onSelect} loadData={this.onLoadData}>{this.renderTreeNodes(this.state.treeData)}</Tree>
              </div>
            <div className={'sideShrink' + ' ' + (this.state.hover?'sideOpen':'')} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} ref='shrink' >
              <Icon type="caret-left" />
            </div>
        </div>
      </div>

    );
  }
}


export default TreeRel;
