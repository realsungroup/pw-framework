import React from 'react';
import './JobPeopleList.less';
import TableData from '../../../common/data/TableData';
import {Card,Button,Select} from 'antd';


const { Option } = Select;
// const { RangePicker } = DatePicker;
class JobPeopleList extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    SquareCardArr: [],
    val: null,
    selectedRecentPeriod: 'all', //下拉选项的值
    searchPeriod: ['', ''], //搜索时间段
  };


    //设置搜索的最近时间段
    // setPeriodBySelect = e => {
    //   let searchPeriod = [],
    //     formatString = 'YYYY-MM-DD HH:mm:ss';
    //   switch (e) {
    //     case 'all':
    //       searchPeriod = ['', ''];
    //       break;
    //        case '[Pass]':
    //       searchPeriod = ['', ''];
    //       break;
    //     case 'Fail':
    //       searchPeriod = [
            
    //       ];
    //       break;
    //     case 'Conformity':
    //       searchPeriod = [
            
    //       ];
    //       break;
    //     case 'disqualification':
    //       searchPeriod = [
            
    //       ];
    //       break;
    //     default:
    //       break;
    //   }
    //   this.setState({ searchPeriod }, this.searchCourseArrangment);
    // };
    
  render() {
    return (
      <TableData
        baseURL = 'http://kingofdinner.realsun.me:1201/'
        resid={618666208275}
        subtractH={220}
        hasBeBtns={false}
        hasRowSelection={false}
        hasAdd={true}
        hasRowView={false}
        hasModify={false}
        hasRowDelete={true}
        hasDelete={false}
        hasRowModify={true}
        height="100%"
        // actionBarExtra = { record => {
        //   return <div className = 'search'>
        //    <Select
        //        defaultValue="all"
        //        value={this.state.selectedRecentPeriod}
        //        style={{ width: 100, marginRight: 5 }}
        //        onChange={e => {
        //        this.setState({
        //        selectedRecentPeriod: e,
        //          rangePickerValue: [null, null]
        //        });
        //          this.setPeriodBySelect(e);
        //            }}
        //            >
        //              <Option value="all">全部</Option>
        //              <Option value="Pass">通过</Option>
        //              <Option value="Fail">未通过</Option>
        //              <Option value="Conformity">合格</Option>
        //              <Option value="disqualification">不合格</Option>
        //            </Select> 
        //           {/* <RangePicker
         //       showTime={{ format: 'HH:mm' }}
         //       format="YYYY-MM-DD HH:mm"
              //   placeholder={['开始日期', '结束日期']}
              //   onOk={this.onOk}
              //   onChange={this.onRangeSearchChange}
              //   value={this.state.rangePickerValue}
              // /> */
        //            </div>
        //  }}
      ></TableData>
    );
  }
}

export default JobPeopleList;
