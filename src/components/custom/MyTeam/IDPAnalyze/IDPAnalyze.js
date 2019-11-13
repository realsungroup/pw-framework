import React from 'react';

import './IDPAnalyze.less';
import http from 'Util20/api';
import EchartsOfReact from 'echarts-of-react';
import { BIGrid } from 'lz-components-and-utils/lib/index';

import { Tabs ,message,Icon} from 'antd';
const { TabPane } = Tabs;
const hrMangerID = '617725533684'; //发展计划总表

class IDPAnalyze extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    selectedMonth:'',
    selectedPersonid:'',
	data:[]
  };
  componentDidMount(){
	  this.getData();
  }
  getData = async() => {
	  let res;
	  try {
	    res = await http().getTable({
	      resid: hrMangerID,
	    });
		var arr=[];
		var n=0;
		while(n<res.data.length){
			arr.push(res.data[n].year)
			n++;
		}
		var val;
		val=arr[0]||'FY2020'
		this.setState({data:arr,cur:val})
		}catch(e){
			message.error(e)
			console.log(e)
		}
	
  }
  handleClick=async(v)=>{
	  console.log(v)
	  var val;
	  val=v||'FY2020'
	  this.setState({cur:val})
  }
  render() {
    const { selectedPersonid, selectedMonth} = this.state;
    return (
      <div className="idp-analyze">
	  <div className='fy'>
	  <span>财年:</span>
	  <ul>
	  {this.state.data.map((item) => {
	    return (
	  <li className={this.state.cur==item?'current':''} onClick={()=>{this.handleClick(item)}}>{item}</li>
	  )})}
	  </ul>
      </div>
			<div className={this.state.windowEnlarge?'enlarged-bigrid':'normal-bigrid'}>
			{this.state.windowEnlarge?<Icon type="fullscreen-exit" onClick={()=>this.setState({windowEnlarge:false})}/>:<Icon type="fullscreen" onClick={()=>this.setState({windowEnlarge:true})}/>}
	  <BIGrid
        height={'100%'}
        gridProps={[
          {
            resid: '626529247444',
            baseURL: window.pwConfig[process.env.NODE_ENV].baseURL,
			cmswhere:`财年='${this.state.cur}'`
          }
        ]}
        
      />
			</div>
      </div>
    );
  }
}

export default IDPAnalyze;
