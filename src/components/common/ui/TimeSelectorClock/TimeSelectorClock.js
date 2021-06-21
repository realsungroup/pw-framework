import React from 'react';
import '../../styles/TimeSelectorClock.less';
var retOk;
var timeType;
class TimeSelectorClock extends React.Component {
  constructor(props) {
    super(props);
    retOk=this.props.onOk;
    timeType=this.props.timeType;
    this.state = {
      curTime:1,
      selectMode:'hour',
      AorP:'AM',
      curHour:'12',
      curMinute:'00',
      hour:[12,1,2,3,4,5,6,7,8,9,10,11],
      minute:[0,5,10,15,20,25,30,35,40,45,50,55],
      curVal:12,
      res:'12:00'
    };
  }

  setVal=(v)=>{
    var val=v;
    if(v<10){
      val = '0'+v;
    }
    this.setState({curVal:val});
    if(this.state.selectMode=='hour'){
      this.setState({curHour:val});
    }else{
      this.setState({curMinute:val});
    }
  }
  componentDidMount = () => {
  };
onOk=()=>{
  var t;
    if(this.state.AorP=='AM'){
      t=this.state.curHour+':'+this.state.curMinute;
    }else{
      t=(12+Number(this.state.curHour))+':'+this.state.curMinute;
    }
  retOk(t);
}
  render() {
    return (
      <div className='TimeSelectorClock'>
      <div className='clz_layer'></div>
      <div className='main'>
        <header className='blink'>
          <span className={this.state.selectMode=='hour'?'current':null} onClick={()=>{this.setState({selectMode:'hour',curVal:this.state.curHour})}}>{this.state.curHour}</span>
           <span className={this.state.selectMode=='minute'?'current':null} onClick={()=>{this.setState({selectMode:'minute',curVal:this.state.curMinute})}}>:{this.state.curMinute}</span>
          <small>{this.state.AorP}</small>
        </header>
        <content>
          <oval>
            <div className='dot'></div>
            <div className={this.state.selectMode=='hour'?('indicator indicator'+this.state.curVal):('indicator indicator_'+this.state.curVal)}>
              <label className='blink'></label>
              <div></div>
            </div>
            <ul>
              {this.state.selectMode=='hour'?this.state.hour.map(item => (
                <li className={this.state.curVal==(item<10?('0'+item):item)?'current':null}>
                  <p onClick={()=>this.setVal(item)}>
                    {item}
                  </p>
                </li>
              )):
              this.state.minute.map(item => (
                <li className={this.state.curVal==(item<10?('0'+item):item)?'current':null}>
                  <p onClick={()=>this.setVal(item)}>
                    {item}
                  </p>
                </li>
              ))
              }
            </ul>
            
          </oval>
          <selector className={this.state.AorP=='AM'?'active blink':'blink'} onClick={()=>this.setState({AorP:'AM'})}>
            AM
          </selector>
          <selector className={this.state.AorP=='PM'?'active blink':'blink'} onClick={()=>this.setState({AorP:'PM'})}>
            PM
          </selector>
        </content>
        <footer>
          <button className='blink' onClick={this.props.onCancel}>取消</button>
          <button className='blink' onClick={()=>{this.onOk()}}>确定</button>
        </footer>
      </div>
    </div>
    );
  }
}

export default TimeSelectorClock;
