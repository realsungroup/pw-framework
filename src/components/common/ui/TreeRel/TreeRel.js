import React from 'react';
import { Select, Icon, Input, Button } from 'antd';
import { Tree } from 'antd';
import http from 'Util20/api';
import './TreeRel.less';

const { TreeNode } = Tree;
var bol = false;
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
  constructor(props) {
    super(props);
    this.state = {
      selectedId: [props.ProductIDs],
      selectedOffsetTop: '',
      resid: props.resid,
      ColumnOfID: props.ColumnOfID,
      ColumnOfPID: props.ColumnOfPID,
      ProductIDs: '',
      treeData: [],
      hover: true,
      url: props.url,
      ProductIDs: props.ProductIDs,
      shrink: false,
      orgID: props.ProductIDs,
      prevID: 'top',
      prevIDAction: 'top',
      showBack: false,
      treeHis: [],
      name:props.nameOfID,
      location:props.locationOfID,
      nameEn:props.nameEnOfID,
      dataNode:[]
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
    this.onShrinkClick = this.onShrinkClick.bind(this);
    this.onSetRoot = this.onSetRoot.bind(this);
    this.onSetBack = this.onSetBack.bind(this);
    this.onExpand = this.onExpand.bind(this);

    // 输出选中项ID的方法
    // this.getId=this.getIdProto();
    // 输出选中项offsetTop的方法
    // this.getOffsetTop=this.getOffsetTopProto();
  }

  onSetRoot = async () => {
    console.log('set root');
    var sel = this.state.selectedId[0];
    var prev = this.state.prevID;
    console.log(this.state.selectedId);
    this.setState({ ProductIDs: sel });
    this.setState({ selectedKeys: [sel.toString()] });
    this.setState({ showBack: true });
    this.setState({ prevIDAction: prev });
    this.refs.setRoot.style.top = '-40px';
    this.refs.shrink.style.top = '8px';
    try {
      let res = await http().postTreeData({
        resid: this.state.resid, //表ID
        Levels: 2, //查找的层级，比如查父节点-子节点-孙节点就写3，查父节点-子节点就写2
        MoveDirection: 1, //不用管它，数据写死，照抄就行
        MoveLevels: 1, //不用管它，数据写死，照抄就行
        ColumnOfID: this.state.ColumnOfID, //要查的人的ID的字段名
        ColumnOfPID: this.state.ColumnOfPID, //要查的人的父ID的字段名
        ProductIDs: sel //要查的人的ID
      });
      var arr = [];
      var n = 0;
      while (n < res.nodes.length) {
        if (this.state.ProductIDs == res.nodes[n][this.state.ColumnOfID]) {
          arr.push({
            title:
              (res.nodes[n][this.state.name] || '') +
              (res.nodes[n][this.state.location] || '') +
              (res.nodes[n][this.state.nameEn] || ''),
            key: res.nodes[n][this.state.ColumnOfID],
            prevID: 'top'
          });
        }
        n++;
      }
      console.log(this.state.prevIDAction);
      this.setState({ treeData: arr });
      var arr2 = this.state.treeHis;
      arr2.push(arr);
      this.setState({ treeHis: arr2 });
    } catch (error) {
      console.log(error.message);
    }
    // this.setState({treeData:[]})
  };
  onSetBack = async treeNode => {
    console.log('set back');
    var sel = this.state.prevIDAction;
    console.log(sel, this.state.orgID);
    if (sel == this.state.orgID || sel == 0) {
      this.setState({ showBack: false });
    } else {
      this.setState({ showBack: true });
    }
    this.setState({ ProductIDs: sel });
    this.setState({ selectedKeys: [sel.toString()] });
    this.refs.setRoot.style.top = '-40px';
    this.refs.shrink.style.top = '8px';
    try {
      let res = await http().postTreeData({
        resid: this.state.resid, //表ID
        Levels: 2, //查找的层级，比如查父节点-子节点-孙节点就写3，查父节点-子节点就写2
        MoveDirection: 1, //不用管它，数据写死，照抄就行
        MoveLevels: 1, //不用管它，数据写死，照抄就行
        ColumnOfID: this.state.ColumnOfID, //要查的人的ID的字段名
        ColumnOfPID: this.state.ColumnOfPID, //要查的人的父ID的字段名
        ProductIDs: sel //要查的人的ID
      });
      var arr = [];
      var n = 0;
      while (n < res.nodes.length) {
        if (this.state.ProductIDs == res.nodes[n][this.state.ColumnOfID]) {
          arr.push({
            title:
              (res.nodes[n][this.state.name] || '') +
              (res.nodes[n][this.state.location] || '') +
              (res.nodes[n][this.state.nameEn] || ''),
            key: res.nodes[n][this.state.ColumnOfID],
            prevID: 'top'
          });
          this.setState({ prevIDAction: res.nodes[n][this.state.ColumnOfPID] });
        }
        n++;
      }
      console.log(arr);
      this.setState({ treeData: arr });
      // treeNode.props.dataRef.children = arr;
      // this.setState({
      //   treeData: [...this.state.treeData],
      // });
      console.log(this.state);
    } catch (error) {
      console.log(error.message);
    }
    // this.setState({treeData:[]})
  };

  // onSetBack(){
  //   var sT=this.refs.sideBg.scrollTop;
  //   var arr=this.state.treeHis;
  //   // console.log(arr)
  //   arr.pop();
  //   console.log(arr)
  //   this.setState({treeData:arr[arr.length-1]});
  //   this.setState({treeHis:arr});
  //   console.log(this.refs.tree)
  //   if(arr.length==1){
  //     this.setState({showBack:false});
  //   }else{
  //     this.setState({showBack:true});
  //   }
  //   this.props.onSelect(this.refs.tree.tree.props.selectedKeys);
  //   this.refs.shrink.style.top = (this.state.selectedOffsetTop-sT)+'px';
  //   this.refs.setRoot.style.top = (this.state.selectedOffsetTop)+'px';
  //
  // }
  onExpand(selectedKeys, e) {
    // console.log('66666',selectedKeys,e)
    var sT = this.refs.sideBg.scrollTop;
    // console.log(e.node.props.selected);
    if (e.node.props.selected == false) {
      this.refs.shrink.style.top = '8px';
      this.refs.setRoot.style.top = '-40px';
    }
  }
  onMouseEnter() {
    this.setState({
      hover: true
    });
  }

  onMouseLeave() {
    if (!this.state.selectedId) {
      this.setState({
        hover: false
      });
    } else {
      this.setState({
        hover: true
      });
    }
  }
  onShrinkClick() {
    if (this.state.shrink == false) {
      this.setState({
        shrink: true
      });
      this.props.onShrinkChange(this.state.shrink);
    } else {
      this.setState({
        shrink: false
      });
      this.props.onShrinkChange(this.state.shrink);
    }
  }
  onLoadData = async treeNode => {
    // new Promise(resolve => {
    if (treeNode.props.children) {
      // resolve();
      return;
    }
    try {
      let res = await http().postTreeData({
        resid: this.state.resid, //表ID
        Levels: 2, //查找的层级，比如查父节点-子节点-孙节点就写3，查父节点-子节点就写2
        MoveDirection: 1, //不用管它，数据写死，照抄就行
        MoveLevels: 1, //不用管它，数据写死，照抄就行
        ColumnOfID: this.state.ColumnOfID, //要查的人的ID的字段名
        ColumnOfPID: this.state.ColumnOfPID, //要查的人的父ID的字段名
        ProductIDs: treeNode.props.dataRef.key //要查的人的ID
      });

      var arr = [];
      var arrData=this.state.dataNode;
      var n = 0;
      while (n < res.nodes.length) {
        if (treeNode.props.dataRef.key != res.nodes[n][this.state.ColumnOfID]) {
          if (res.nodes[n].totalNodes == 0) {
            arrData.push(res.nodes[n]);
            arr.push({
              title:
                (res.nodes[n][this.state.name] || '') +
               (res.nodes[n][this.state.nameEn] || '')+
                (res.nodes[n][this.state.location] || ''),
              key: res.nodes[n][this.state.ColumnOfID],
              isLeaf: true
            });
          } else {
            arrData.push(res.nodes[n])
            arr.push({
              title:
                (res.nodes[n][this.state.name] || '') +
                (res.nodes[n][this.state.nameEn] || '')+
                (res.nodes[n][this.state.location] || ''),
              key: res.nodes[n][this.state.ColumnOfID],
              prevID: treeNode.props.dataRef.key
            });
          }
        }
        n++;
      }
      treeNode.props.dataRef.children = arr;
      this.setState({
        treeData: [...this.state.treeData]
      });
      this.setState({ dataNode: arrData });

      // var arr2 = this.state.treeHis;
      // arr2.pop();
      // arr2.push(this.state.treeData);
      // this.setState({ treeHis: arr2 });
      //   resolve();
      //
    } catch (error) {
      console.log(error.message);
    }
  };

  renderTreeNodes = data => {
    // console.log(data)
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });
  };

  // 获取树的数据
  getData = async id => {
    try {
      let res = await http().postTreeData({
        resid: this.state.resid, //表ID
        Levels: 2, //查找的层级，比如查父节点-子节点-孙节点就写3，查父节点-子节点就写2
        MoveDirection: 1, //不用管它，数据写死，照抄就行
        MoveLevels: 1, //不用管它，数据写死，照抄就行
        ColumnOfID: this.state.ColumnOfID, //要查的人的ID的字段名
        ColumnOfPID: this.state.ColumnOfPID, //要查的人的父ID的字段名
        ProductIDs: this.state.ProductIDs //要查的人的ID
      });
      var arr = [];
      var arrData=this.state.dataNode;

      var n = 0;
      while (n < res.nodes.length) {
        if (this.state.ProductIDs == res.nodes[n][this.state.ColumnOfID]) {
          arrData.push(res.nodes[n])
          arr.push({
            title:
              (res.nodes[n][this.state.name] || '') +
              (res.nodes[n][this.state.nameEn] || '')+
              (res.nodes[n][this.state.location] || '')
              ,
            key: res.nodes[n][this.state.ColumnOfID],
            prevID: 'top'
          });
        }
        n++;
      }

      this.setState({ treeData: arr });
      // var arr2 = this.state.treeHis;
      // arr2.push(arr);
      this.setState({ dataNode: arrData });
      var obj=this.state.dataNode[0];
      this.props.onSelect(obj);
    } catch (error) {
      console.log(error.message);
    }
  };

  onSelect = (selectedKeys, e) => {
    var sT = this.refs.sideBg.scrollTop;
    this.setState({ selectedOffsetTop: e.node.selectHandle.offsetTop });
    this.setState({ selectedId: selectedKeys });
    console.log(selectedKeys);
    if (e.selectedNodes[0]) {
      this.setState({ prevID: e.selectedNodes[0].props.prevID || '' });
    } else {
      this.setState({ prevID: '' });
    }

    this.refs.shrink.style.top = e.node.selectHandle.offsetTop - sT + 'px';
    if (selectedKeys.length > 0) {
      this.setState({ hover: true });
      if (e.node.selectHandle.offsetTop != 8) {
        if (e.node.props.isLeaf != true) {
          this.refs.setRoot.style.top = e.node.selectHandle.offsetTop + 'px';
        } else {
          this.refs.setRoot.style.top = '-40px';
        }
      } else {
        this.refs.setRoot.style.top = '-40px';
      }
    } else {
      this.setState({ selectedId: '' });
      this.setState({ hover: false });
      this.refs.setRoot.style.top = '-40px';
    }
    var i=0
    var obj;
    while(i<this.state.dataNode.length){
      if(this.state.dataNode[i][this.state.ColumnOfID]==selectedKeys[0]){
        obj=this.state.dataNode[i];
      };
      i++;
    }
    this.props.onSelect(obj);

  };
  componentDidMount = () => {
    this.getData();
  };

  render() {
    console.log(this.state.selectedId);
    return (
      <div className="sideWrap">
        <div className={'sideWrapInner' + ' ' + (this.state.shrink ? 'shrinkOuter' : '')}>
          <div
            ref="sideBg"
            className={'sideBg' + ' ' + (this.state.shrink ? 'shrink' : '')}
          >
            <Tree
              selectedKeys={this.state.selectedId}
              ref="tree"
              onSelect={this.onSelect}
              onExpand={this.onExpand}
              loadData={this.onLoadData}
            >
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
            <div className="iconbar">
              <div
                onClick={this.onSetBack}
                className={this.state.showBack ? '' : 'hidden'}
              >
                <Icon type="arrow-up" />
              </div>
              <div>
                <Icon type="box-plot" />
              </div>
              <div ref="setRoot" onClick={this.onSetRoot}>
                <Icon type="folder-open" />
              </div>
            </div>
          </div>
          <div
            className={
              'sideShrink' + ' ' + (this.state.hover ? 'sideOpen' : '')
            }
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            ref="shrink"
            onClick={this.onShrinkClick}
          >
            <Icon type="caret-left" />
          </div>
        </div>
      </div>
    );
  }
}

export default TreeRel;
