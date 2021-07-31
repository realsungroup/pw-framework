import React from 'react';
import './WorkSheet.less';
import { Select, Button,message,DatePicker } from 'antd';
import { TableData } from '../../common/loadableCommon';

import http from 'Util20/api';

const { Option } = Select;
const { RangePicker } = DatePicker;
class WorkSheet extends React.Component {
  constructor(props){
    super(props)
   this.state={
      depa:[
        {
          depaId:'',
          depaName:''
        }
      ],//部门
      sheetStatus:[],//审批单状态
      filerStatus:'',
      filterSTA:'',
      filterSTB:'',
      filterEDA:'',
      filterEDB:'',
      filterDepa:'',
      cms: ``
  }
  }
  
  async componentDidMount() {
   
this.getFilters()
  }
  getFilters=async()=>{
    let res;
    try {
      res = await http().getTableColumnDefine({
        resid: 678790254230,
      });
      console.log(res)
      let n =0;
      while(n<res.data.length){
        if(res.data[n].ColName=='sheetStatus'){
          this.setState({sheetStatus:res.data[n].DisplayOptions})
        }
        n++;
      }
      this.getDepa();
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }

  }
  getDepa=async()=>{
    let res;
    try {
      res = await http().getTable({
        resid: 681075873039,
      });
      this.setState({depa:res.data})
      console.log(res)
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }

  }
  getData=async()=>{
    let cms =``;
    if(this.state.filterStatus){
      cms+=`sheetStatus = '${this.state.filterStatus}'`
    };
    if(this.state.filterDepa){
      if(this.state.filterStatus){
        cms+=` and curDepaId = '${this.state.filterDepa}'`
      }else{
        cms+=`curDepaId = '${this.state.filterDepa}'`
      }
    };
    if(this.state.filterSTA){
      if(this.state.filterStatus || this.state.filterDepa){
      cms+=` and C3_678796788873 > '${this.state.filterSTA}' and C3_678796788873 < '${this.state.filterSTB}'`
      }else{
      cms+=`C3_678796788873 > '${this.state.filterSTA}' and C3_678796788873 < '${this.state.filterSTB}'`

      }
    };
    if(this.state.filterEDA){
      if(this.state.filterStatus || this.state.filterDepa || this.state.filterSTA){
      cms+=` and C3_678796797075 > '${this.state.filterEDA}' and C3_678796788873 < '${this.state.filterEDB}'`
      }else{
        cms+=`C3_678796797075 > '${this.state.filterEDA}' and C3_678796788873 < '${this.state.filterEDB}'`
      }
    };
    console.log('cms',cms)
    this.setState({
      cms
    })
  }
  render() {
    return (
      <div className="sheetlist">
        <div className='filterLine'>
          <ul>
          <li>
              状态：
              <Select
                style={{ width: 120 }}
                placeholder="请选择状态"
                value={this.state.filterStatus}
                onChange={(v) =>{
                  this.setState({filterStatus: v})
                }}
              >
                {this.state.sheetStatus.map(item => (
                  <Option value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </li>
            <li>
              接单时间：
              <RangePicker
                value={this.state.filterST}

                onChange={(dates, dateString) => {
                  console.log(dates, dateString);
                  let cmswhere = this.state.cmswhere;
                  if (dateString[0] && dateString[1]) {
                    this.setState({filterST:dates,filterSTA:dateString[0],filterSTB:dateString[1]});
                  }
                }}
              ></RangePicker>
            </li>
            <li>
              交货时间：
              <RangePicker
                value={this.state.filterED}
                onChange={(dates, dateString) => {
                  console.log(dates, dateString);
                  let cmswhere = this.state.cmswhere;
                  if (dateString[0] && dateString[1]) {
                    this.setState({filterED:dates,filterEDA:dateString[0],filterEDB:dateString[1]});
                  }
                }}
              ></RangePicker>
            </li>
            <li>
              部门：
              <Select
                style={{ width: 120 }}
                placeholder="请选择部门"
                value={this.state.filterDepa}
                onChange={(v) =>{
                  this.setState({filterDepa: v})
                }}
              >
                {this.state.depa.map(item => (
                  <Option value={item.depaId}>
                    {item.depaName}
                  </Option>
                ))}
              </Select>
            </li>
            <li>
            <Button type='primary' style={{marginRight:'.5rem'}}onClick={()=>{
              this.getData();
            }}>确认</Button>
            <Button
              onClick={
                ()=>{
                  this.setState({
                    filterStatus:'',
                    filterST:null,
                    filterED:null,
                    filterSTA:'',
                    filterSTB:'',
                    filterEDA:'',
                    filterEDB:'',
                    filterDepa:'',
                    cms: ``
                  })
                }
              }
            >
              重置
            </Button>
            </li>
          </ul>
        </div>
        <div className='table'>
              <TableData
                resid="678790254230"
                wrappedComponentRef={element =>
                  (this.addModalTableDataRef = element)
                }
                cmswhere={this.state.cms}
                refTargetComponentName="TableData"
                subtractH={180}
                hasAdd={false}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasRowSelection={false}
                hasAdvSearch={false}
                importConfig={null}
              />
          </div>
      </div>

    );
  }
}

export default WorkSheet;
