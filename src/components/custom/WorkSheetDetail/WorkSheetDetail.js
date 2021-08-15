import React from 'react';
import './WorkSheetDetail.less';
import { Row,Col,Select, Button,message,Icon,Input,DatePicker,Modal ,Spin} from 'antd';
import { TableData } from '../../common/loadableCommon';
import moment from 'moment';
import debounce from 'lodash/debounce';

import http from 'Util20/api';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;


class WorkSheetDetail extends React.Component {
  constructor(props){
    super(props)
  }

  state={
    loading:false,
    process:'',
    productLines:[],
    productLinesValue:'请选择工作流',
    productLineTree:
      {
        678789327168:[
          
          {
            678789448828:[],
            display:'N'
          }
        ]
      },
    histories:[],
    imgUrl:null,
    curModiReason:'',
    curFeedBack:'',
    sheetData:{},
    customers:[],
   }
  async componentDidMount() {
    
    
  }

  componentWillReceiveProps = async(nextProps) => {
    //初始化
    if(nextProps.new){
      this.setState({loading:true});
      this.getProductLines();
      this.setState({
        productLines:[],
        productLinesValue:'请选择工作流',
        productLineTree:
          {
            678789327168:[
              
              {
                678789448828:[],
                display:'N'
              }
            ]
          },
        histories:[{status:'current',value:'新的工作单'}],
        imgUrl:'',
        showImg:false,
        curModiReason:'',
        curFeedBack:'',
        loading:false,
        process:'',
        sheetData:{C3_682281119677 :''},
      })
    }else{
      await this.getHistories(nextProps.curSheetId);

   }
  }
   //获取历史数据
   getHistories=async(v)=>{
     this.setState({loading:true,process:'正在读取历史数据'});
     let res;
     try{
      res = await http().getTable({
        resid: '678790254230',
        cmswhere:`C3_682281119677 = '${v}'`
      });
      console.log('his',res)
      let n = 0;
      let his=[]
      let lineID=''
      let curID=''
      while(n<res.data.length){
        let str='';
        if(res.data[n].C3_680644403785=='Y'){
          str='current'
        }
        his.push(
          {
            status:str,
            value:res.data[n].C3_680644411481
          }
        );
        lineID=res.data[n].C3_682267546275;
        curID=res.data[n].curChara;
        let sheetData1=res.data[n];
        sheetData1.C3_678796788873=moment(sheetData1.C3_678796788873);
        sheetData1.C3_678796797075=moment(sheetData1.C3_678796797075);
          
        this.setState({imgUrl:res.data[n].imgUrl,curModiReason:res.data[n].C3_680644227339,curFeedBack:res.data[n].C3_682368706409,sheetData:sheetData1,C3_678796767356:res.data[n].C3_678796767356});
        n++;
      }
      this.setState({loading:false,process:'',histories:his});
      this.getTargetLine(lineID,curID);
    
    }catch(e){
      console.log(e.message);
      message.error(e.message);
      this.setState({loading:false,process:''});
    }
   }
   //填写input
   changeSheet=(key,v)=>{
    let obj = this.state.sheetData;
    obj[key]=v; 
    this.setState({sheetData:obj});
   }
   //多选
   changeBol=(key)=>{
     let obj = this.state.sheetData;
    if(obj[key]=='Y'){
      obj[key]=''
    }else{
      obj[key]='Y'
    }
    this.setState({sheetData:obj});
   }
   //单选
   changeCheck=(key)=>{
    let obj = this.state.sheetData;
    if(obj[key]=='Y'){
      obj[key]='N'
    }else if(obj[key]=='N'){
      obj[key]=''
    }else{
      obj[key]='Y'
    }
    this.setState({sheetData:obj});
   }
   //上传图片
   imgUp(e) {
    this.setState({ imgfile: e });
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    let type = files[0].type; //文件的类型，判断是否是图片
    let size = files[0].size; //文件的大小，判断图片的大小
    if (size > 5242880) {
      alert("请选择5M以内的图片！");
      return false;
    }
    this.setState({ loading: true ,process:'正在读取图片'})
    this.uploadFile(files[0], `http://kingofdinner.realsun.me:1201/api/AliyunOss/PutOneImageObject?bucketname=nutritiontower&srctype=${type[1]}`, "cloud").then((result) => {
      this.setState({ loading: false, imgUrl: result })

    }, (err) => {
      //图片上传异常！
      this.setState({ loading: false,process:'' })


    })
  }
   uploadFile = (file, url, mode) => {
    return new Promise((resolve, reject) => {
      let fd = new FormData();
      fd.append('file', file, file.name);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        if (xhr.status === 200 && (data.error === 0 || data.error === '0')) {
          let imgUrl;
          if (mode === 'local') {
            imgUrl = data.httpfilename;
          } else if (mode === 'cloud') {
            imgUrl = data.data;
          }
          resolve(imgUrl);
        } else {
          reject(data);
        }
      };
      xhr.send(fd);
    });
  };

  handlePrint = () => {
    // 打印
    const bodyHtml = window.document.body.innerHTML;

    var footstr = "</body>";
     var newstr = document.getElementById('toPrint').innerHTML;
     var style='<style>  .ant-calendar-picker {    box-sizing: border-box;    margin: 0;    padding: 0;    color: rgba(0, 0, 0, 0.65);    font-size: 14px;    font-variant: tabular-nums;    line-height: 1.5;    list-style: none;    -webkit-font-feature-settings: "tnum";    font-feature-settings: "tnum", "tnum";    position: relative;    display: inline-block;    outline: none;    cursor: text;    -webkit-transition: opacity 0.3s;    transition: opacity 0.3s;}.ant-calendar-picker {    box-sizing: border-box;    margin: 0;    padding: 0;    color: rgba(0, 0, 0, 0.65);    font-size: 14px;    font-variant: tabular-nums;    line-height: 1.5;    list-style: none;    -webkit-font-feature-settings: "tnum", "tnum";    font-feature-settings: "tnum", "tnum";    position: relative;    display: inline-block;    outline: none;    cursor: text;    -webkit-transition: opacity 0.3s;    transition: opacity 0.3s;}    .ant-input {    box-sizing: border-box;    margin: 0;    padding: 0;    font-variant: tabular-nums;    list-style: none;    -webkit-font-feature-settings: "tnum", "tnum";    font-feature-settings: "tnum", "tnum";    position: relative;    display: inline-block;    width: 100%;    height: 32px;    padding: 4px 11px;    color: rgba(0, 0, 0, 0.65);    font-size: 14px;    line-height: 1.5;    background-color: #fff;    background-image: none;    border: 1px solid #d9d9d9;    border-radius: 4px;    -webkit-transition: all 0.3s;    transition: all 0.3s;}.ant-input-sm {    height: 24px;    padding: 1px 7px;}    .ant-input {    color: rgba(0, 0, 0, 0.65);    background-color: #fff;    background-image: none;    border: 1px solid #d9d9d9;    border-radius: 4px;}    .ant-calendar-picker-input.ant-input-sm {    padding-top: 0;    padding-bottom: 0;}    textarea.ant-input {    max-width: 100%;    height: auto;    min-height: 32px;    vertical-align: bottom;    -webkit-transition: all 0.3s, height 0s;    transition: all 0.3s, height 0s;}    .ant-row {    position: relative;    height: auto;    margin-right: 0;    margin-left: 0;    zoom: 1;    display: block;    box-sizing: border-box;    }.ant-row::before, .ant-row::after {    content: "";    display: table;}.ant-col{    position: relative;}.ant-col-1 {    display: block;    box-sizing: border-box;    width: 4.16666667%;}.ant-col-2 {    display: block;    box-sizing: border-box;    width: 8.33333333%;}.ant-col-3 {    display: block;    box-sizing: border-box;    width: 12.5%;}.ant-col-4 {    display: block;    box-sizing: border-box;    width: 16.66666667%;}.ant-col-5 {    display: block;    box-sizing: border-box;    width: 20.83333333%;}   .ant-col-6 {    display: block;    box-sizing: border-box;    width: 25%;}.ant-col-7 {    display: block;    box-sizing: border-box;    width: 29.16666667%;}.ant-col-24 {    display: block;    box-sizing: border-box;    width: 100%;}        *{margin:0;padding:0;box-sizing: border-box;text-align: center;}    .toPrint {  display: inline-block;  width: 794px;  height: 1090px;  padding: 2rem;  font-size: 14px;}.toPrint input {  border: 0px solid #fff;}.toPrint i {  display: none;}.toPrint .header {  width: 100%;}.toPrint .header div {  float: left;  width: calc(50% - 7.5rem);}.toPrint .header h4 {  display: inline-block;  font-size: 1.2rem;  width: 15rem;}.toPrint .header p {  float: right;  font-size: 1.2rem;  width: calc(50% - 7.5rem);}.toPrint .header p b {  color: #f5222d;}.toPrint .timer {  width: 100%;  overflow: hidden;}.toPrint .timer>div {  float: left;  line-height: 1.5rem;}.toPrint .timer div input {  position: relative;  0px;  border-bottom: 0px solid #000;  border-radius: 0px;}.toPrint .timer>div:nth-child(2) {  float: right;}   .table .selected:after{ display: block;content:"√";text-align: left; width: 100%;height:24px; position: absolute;top:0;left:0; color:#1890ff;font-weight: bold;} .toPrint .timer .tableWrap {  width: 100%;  overflow: hidden;}.toPrint .timer .tableWrap .depas {  float: left;  overflow: hidden;  width: 1.5rem;  margin-top: 0.5rem;  border-left: 1px solid #000;  border-top: 1px solid #000;  border-bottom: 1px solid #000;}.toPrint .timer .tableWrap .depas div {  border-bottom: 1px solid #000;}.toPrint .timer .tableWrap .depas div:first-child {  height: calc(15.5rem + 9px);}.toPrint .timer .tableWrap .depas div:nth-child(2) {  height: calc(8rem + 4px);}.toPrint .timer .tableWrap .depas div:nth-child(3) {  height: calc(8rem + 3px);}.toPrint .timer .tableWrap .depas div:nth-child(4) {  height: calc(8rem + 3px);}.toPrint .timer .tableWrap .depas div:nth-child(5) {  height: calc(4.5rem + 3px);}.toPrint .timer .tableWrap .depas div:nth-child(6) {  height: calc(7.5rem + 3px);  border-bottom: 0px solid #000;}.toPrint .timer .tableWrap .table {  float: left;  width: calc(100% - 1.5rem);  margin-top: 0.5rem;  height: 851px;}.toPrint .timer .tableWrap .table div {  float: none;}.toPrint .timer .tableWrap .table .ant-row {  display: flex;  border-top: 1px solid #000;  border-left: 1px solid #000;  border-right: 1px solid #000;  box-sizing: border-box;}.toPrint .timer .tableWrap .table .ant-row:last-child {  border-bottom: 1px solid #000;}.toPrint .timer .tableWrap .table .ant-col {  border-right: 1px solid #000;  box-sizing: border-box;}.toPrint .timer .tableWrap .table .ant-col:last-child {  border-right: 0px solid #000;}.toPrint .timer .tableWrap .table .ant-col input {  top: 0;  border: 0px solid #fff;  line-height: 1.5rem;  width: 100%;transform: scale(0.95);}.toPrint .timer .tableWrap .table .ant-col textarea {  width: 100%;  border: 0px solid #fff;  resize: none;  height: 1rem;}.toPrint .timer .tableWrap .table .multInput input {  width: 44%;}.toPrint .timer .tableWrap .table .multInput span {  width: 10%;}</style>';
     var headstr = "<html><head><title></title>"+style+"</head><body>";
     document.body.innerHTML = headstr + newstr + footstr;
     window.print();
    window.document.body.innerHTML = bodyHtml;
    window.location.reload();
  };

  //获取产品线
  getProductLines = async()=>{
    this.setState({process:'获取产品线中...',loading:true});
    let res;
    try{
      res = await http().getRecordAndSubTables({
        resid: '678789264059',
        subresid: '678789327168,678789448828',
        getsubresource: 1
      });
      
      this.setState({
        productLines:res.data,

        loading:false
      })
    }catch(e){
      this.setState({loading:false});
      console.log(e.message);
      message.error(e.message);
    }
  }

  //获取指定产品线并整理
  getTargetLine = async(v,curID)=>{
    this.setState({process:'获取产品线中...',loading:true});
    let res;
    try{
      res = await http().getRecordAndSubTables({
        resid: '678789264059',
        subresid: '678789327168,678789448828',
        cmswhere:`productflowid = '${v}'`,
        getsubresource: 1
      });
      if(res.data.length>0){
        let obj=res.data[0];
      let n =0
      while(n<obj[678789327168].length){
        let nn=0;
        while(nn<obj[678789327168][n][678789448828].length){
          if(obj[678789327168][n][678789448828][nn].productflowjobroleid==curID){
            obj[678789327168][n][678789448828][nn].current=true;
            obj[678789327168][n].current=true;
          }
          nn++
        }
        n++;
      }
      console.log('line',obj,curID)
      this.setState({
        productLineTree:obj,
        loading:false
      })
      }else{
        this.setState({
          loading:false
        })
      }
      
    }catch(e){
      console.log(e.message);
      message.error(e.message);
    }
  }
  //计算下一步骤

  //修改产品线
  changeProductLine=(v)=>{
    let obj = this.state.productLines;
    let n = 0;
    while(n<obj.length){
      if(obj[n].productflowid==v){
        this.setState({productLineTree:obj[n]});
      }
      n++;
    }
  }

  //新建工单
  handleCreat=async()=>{
    //检查生产线是否选择
    if(!this.state.productLinesValue||this.state.productLinesValue=='请选择工作流'){
      message.error('请选择生产线！')
      return false
    };
    console.log('line',this.state.productLinesValue)
    //检查图纸
    if(!this.state.imgUrl){
      message.error('请添加图纸！')
      return false
    };
    let obj = this.state.sheetData;
    obj.C3_682267546275=this.state.productLinesValue;
    obj.sheetStatus='进行中';
    obj.C3_680644403785='Y';
    obj.curPro=this.state.productLineTree[678789327168][0].productflowjobid;
    obj.imgUrl=this.state.imgUrl
    let res;
    try{
      res = await http().addRecords({
        resid: '678790254230',
        data:[
          this.state.sheetData
        ]
      });
      message.success('添加成功');
      this.props.handleRefresh();
      this.props.backFunc();
    }catch(e){
      message.error(e.message)
      console.log(e.message);
    }

  }

  render() {
    return (
      
      <div className='sheetDetails'>
        <div className='mask' 
        style={this.state.loading?{display:'flex'}:{display:'none'}}
        >
          <span>
            {this.state.process}
          </span>
        </div>
        <Modal
        visible={this.state.showCustomers}
        footer={null}
        onCancel={()=>{this.setState({showCustomers:false})}}
        destroyOnClose
        width={'80vw'}
        >
          <div style={{width:'100%',height:'80vh'}}>
          <TableData
                resid="680643338700"
                wrappedComponentRef={element =>
                  (this.addModalTableDataRef = element)
                }
                refTargetComponentName="TableData"
                subtractH={180}
                hasAdd={true}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasRowSelection={false}
                hasAdvSearch={false}
                importConfig={null}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
                      <Button
                        type="primary"
                        onClick={() => {
                           let obj = this.state.sheetData;
                          this.state.sheetData.C3_682184234543=record.idCustomer;
                          this.state.sheetData.C3_678796767356=record.nameCustomer;
                          this.setState({
                            
                            showCustomers:false,
                            sheetData:obj
                          })
                        }}
                      >
                        选择
                      </Button>
                    );
                  }
                ]}
              />
          </div>
        </Modal>

        <Modal
        visible={this.state.showGoods}
        footer={null}
        onCancel={()=>{this.setState({showGoods:false})}}
        destroyOnClose
        width={'80vw'}
        >
          <div style={{width:'100%',height:'80vh'}}>
          <TableData
                resid="678789197967"
                wrappedComponentRef={element =>
                  (this.addModalTableDataRef = element)
                }
                refTargetComponentName="TableData"
                subtractH={180}
                hasAdd={true}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasRowSelection={false}
                hasAdvSearch={false}
                importConfig={null}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
                      <Button
                        type="primary"
                        onClick={() => {
                          let obj = this.state.sheetData;
                          this.state.sheetData.C3_682369620435=record.productid;
                          this.state.sheetData.C3_678796779827=record.C3_679066211152;

                          this.setState({
                            showGoods:false,
                            sheetData:obj
                          })
                        }}
                      >
                        选择
                      </Button>
                    );
                  }
                ]}
              />
          </div>
        </Modal>

        <Modal
        visible={this.state.showImg}
        footer={null}
        onCancel={()=>{this.setState({showImg:false})}}
        destroyOnClose
        width={'80vw'}
        >
          <div style={{width:'100%',height:'80vh',background:'url('+this.state.imgUrl+')',backgroundSize:'contain',backgroundPosition:'center',backgroundRepeat:'no-repeat'}}>
          </div>
        </Modal>
        <div className='streamList'>
            {
              this.props.hasBack?
              <div className='backLine'>
                <div onClick={()=>{this.props.backFunc();}}>
                  <Icon type='left'/>
                  返回
                </div>
              </div>
              :null
            }
           
            <ul style={this.props.hasBack?{margin:'3.3rem .5rem .8rem'}:{margin:'.8rem .5rem'}}>
            {
              this.props.new?
              <div className='PLSelection'>
                <Select
                 style={{ width: '100%',textIndent:'1rem',marginBottom:'1rem'}}
                 placeholder="请选择生产线"
                 value={this.state.productLinesValue}
                 onChange={(v) =>{
                   this.changeProductLine(v);
                   this.setState({productLinesValue: v});
                 }}
                
                >
                {this.state.productLines.map(item => (
                  <Option value={item.productflowid}>
                    {item.productflowname}
                  </Option>
                ))}
                </Select>
              </div>
              :null
            }
            {
              this.state.productLineTree[678789327168].map((item)=>{return(
                
                <li className={item.current?'current':''} style={item.display=='N'?{display:'none'}:{}}>
                <div>
                  <div>{item.jobid}</div>
                  <b>{item.depname}</b>
                </div>
                <ul>
                    {item[678789448828].map((item2)=>{return(
                    <li className={item2.current?'current':''}>
                    <b>{item.jobid}.{item2.roleid}</b>
                    <div>
                      <span>{item2.date?item2.date:'--'}</span>
                      <span>{item2.name?item2.name:'--'}</span>
                      <span>{item2.rolename}</span>
                    </div>
                  </li>
                    )})}
                  
                </ul>
              </li>
                
              )})
            }
              {/* <li>
                <div>
                  <div>1</div>
                  <b>业务部</b>
                </div>
                <ul>
                  <li>
                    <b>1.1</b>
                    <div>
                      <span>2021-07-23 12:00:01</span>
                      <span>张三</span>
                      <span>业务员</span>
                    </div>
                  </li>
                </ul>
              </li>
              <li className="current">
                <div>
                  <div>2</div>
                  <b>部门A</b>
                </div>
                <ul>
                  <li className="current">
                    <b>2.1</b>
                    <div>

                    <span>进行中</span>
                    <span>张三</span>
                    <span>业务员</span>
                    </div>

                  </li>
                  <li>
                    <b>2.2</b>
                    <div>

                    <span>进行中</span>
                    <span>张三</span>
                    <span>业务员</span>
                    </div>

                  </li>
                </ul>
              </li>
              <li className="willDo">
                <div>
                  <div>3</div>
                  <b>部门B</b>
                </div>
                <ul>
                  <li>
                    <b>3.1</b>
                    <div>

                    <span>未开始</span>
                    <span>张三</span>
                    <span>业务员</span>
                    </div>

                  </li>
                  <li>
                    <b>3.2</b>
                    <div>

                    <span>未开始</span>
                    <span>张三</span>
                    <span>业务员</span>
                    </div>

                  </li>
                </ul>
              </li> */}
            </ul>
        </div>
        <div className='sheet'>
          
          <div className='historySelections'>
            <ul style={{minWidth:'100%',width:(2*10)+'rem'}}>
              {
                this.state.histories.map(item=>(<li className={item.status=='current'?'current':''}>{item.value}</li>))
              }
              {/* <li className='current'>
              2021-07-24 12:00
              </li>
              <li>
              2021-07-24 12:00
              </li> */}
            </ul>
            
          </div>
          
        <div className='rightContent'>
            <div className='pics'>
              <div className='toChange'>
                {
                  this.state.imgUrl?
                 <img src={this.state.imgUrl} onClick={()=>{this.setState({showImg:true})}}/>:'点击下方“选择文件”添加图纸'
                }
              </div>
              <div className='picsMenu'>
                { this.state.imgUrl?<a href={this.state.imgUrl} target='_blank'><div>下载</div></a>:null}
                <div className='left'>
                <input id="ss" name="ss" type="file" onChange={v => { this.imgUp(v) }} accept='image' />
                </div>

              </div>
            </div>
            {this.props.new?null:<>
            
              <div className='reasons'>
              <b>
                修改原因：
              </b>
              <p>
                {this.state.curModiReason}
              </p>
            </div>
            <div className='feedback'>
              <b>
                用户反馈：
              </b>
              <span>产看关联反馈</span>
              <p>
              {this.state.curFeedBack}
              </p>
            </div>
            
            </>}
            
          </div>

          <div className='menu'>
            <ul>
              <li onClick={()=>{this.handleCreat();}}>
                保存
              </li>
              {
                this.props.new?null:
                <>
                <li>
                复制新建
                </li>
                <li>
                开始当前流程
                </li>
                <li>
                  结束当前流程
                </li>
                <li onClick={()=>{this.handlePrint();}}>
                打印
              </li>
                </>
              }
             
              {
                this.props.new?null:<>
              <li className='right'>
                取消订单
              </li>
              <li className='right'>
                报废订单
              </li></>}
            </ul>
          </div>
          <div className='workSheetForm'>
            <div className={this.props.editRight.part1?'block hidden':'block part1'}>
            </div>
            <div className={this.props.editRight.part2?'block hidden':'block part2'}>
            </div>
            <div className={this.props.editRight.part3?'block hidden':'block part3'}>
            </div>
            <div className={this.props.editRight.part4?'block hidden':'block part4'}>
            </div>
            <div className={this.props.editRight.part5?'block hidden':'block part5'}>
            </div>
            <div className={this.props.editRight.part6?'block hidden':'block part6'}>
            </div>
              <div id='toPrint'>
                <div className='toPrint'>
                <div className='header'>
                  <div>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAA5CAIAAAAX74ozAAAACXBIWXMAAAsTAAALEwEAmpwYAAA57GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjEtMDgtMDhUMTY6NTU6MzIrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDIxLTA4LTA4VDE2OjU1OjMyKzA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAyMS0wOC0wOFQxNjo1NTozMiswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6Mzk1Y2NkOTYtNjZkOC01YzQ2LTgzODgtZTBhM2M1MGQ5NmE5PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6MTU5NjhkZTktZjgyNi0xMWViLThhNjYtOWZjMTM4MDA3NWFkPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YjMxMmMyN2UtOWI0MC01YTRjLTg2YzYtZjEyZGMwYzc0M2EzPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmIzMTJjMjdlLTliNDAtNWE0Yy04NmM2LWYxMmRjMGM3NDNhMzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMS0wOC0wOFQxNjo1NTozMiswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDozOTVjY2Q5Ni02NmQ4LTVjNDYtODM4OC1lMGEzYzUwZDk2YTk8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjEtMDgtMDhUMTY6NTU6MzIrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+Nzg8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NTc8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pi15F8EAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAACcNJREFUeNrsW39Mmukd/6rFKpRY6xzlNIyyc6TGxcyYcKWzZi4uTbhjYbNj0dJzIedCLmQsJizsSN1CwsLFxIVFY8LNhc6diXc25Gi4ubM0XuysPWvD7CilpUgdRUphCAcFFJ798dKXV+oP/EHr7Xz+et/n+32f9/k8z/f5fj/P93nfAoQQfD1KIXxtygHUA6gHUA+gHkD9v4V67cpH4adLd2/d2lIz+Sya366gvSshz6JCLOKwmMnVBFYT8LjxF43oBjd/HFMjFxVZpqdQHsreQJ00jApbm3FUCqk0LYhmJqqrrS0XqABQBJCKxxFCQZ9XJGyzzc+9eqhup03IbyUTbIRBIY9p+zIaqSQu4jc1bd6aSi7DNCmFgFbjCKGGWhZWQyujRoOBVwM1HPTxW5uqy6nkQqgupzbWMEcHtfPmCbWkq45WGQ0GcU06pQTrbnVZ2Rb27/fg4zKkVvG5HPy2ubEBV1uNhl/2rDawmXhXlBKxUtpVU1mO3aqUClxNeLY5d7+AaxItpUchwxV0Wg2luLCezXLarPmCGgx4smp0fep1/RybQRsfN+JqamV37lA5bFZWa8ZRPS5NJjIrv5bJyAvUuRkzACgV0jW1iTixT/VMukQkGB7sM47q+7VaDocjEYsRQqZRfe5Qu9r5uHJNZYXLNk+UtjY34lKpWLT3UHUaJf4C87iBKFKIxbjIpB80G4bbCOZKAlh02HxuZ+5QS0iZsXM77ETRzJSJOLLhkJ8otVutu4UqkwqzLMpqmcWlHod9o3BNL6/s7VFhjtS76IhHgrkMPOk5o+G3Nm20jAFgdnqCIEk11LAAwO9Z3A3UFL2S8iKMeZsF13iRbSllXalEYsfeLpWMDQ/1x2Nr3KyuvxdvX8BrJoqYFWW4SN0j3/msWuamsFYsxtGMeywuCobSszQ2osfjvnvt0tqrkkLJtfQumTE6cXvu5G8dmV43WMNk2J/3G2uCw6p2TE4Qg0HA68UUjCNDOdrnjks1oyLNw+TpwBPwLlZQirfFc7NlQn4rIaDJ49HwsL4fb0VFGMXx0TH0Eksg4BvUabHr+dlpNoOG96TieRTm1tZgCiaTAbe7daCG/B4ewZunZ68QBM9Zy6BGjhCStbfRSkpskzPo1ZXy5wwMAAyjg+OGIex6zjyOEBrUqAGAXFIyOzu7PtRxQgAkAdQx6XndBu2m9Pem2YtpRIcQUiml2G3M750dN1ZTqelFx+FsaMAtnLpMtCAXa3sUgqYmItRYOLBP0Fpmpu3z6UBQTU8TUmETt7woM1u2teQxe6IYZVQc2Nn6urDHbZ2aamSxAEApk6J9WfAO426KRiW7XfYt3FI8ECgjTKOouSVt3oadO6G+HrlBr8sb0lTWKmtgMpLRSE7Bxm2zEYlBf1/vrnoST3N0kYCXjEXygbWZm/GmHDZ7exTC53JixkAFmN9dEiARCeL9oJAgEdlstxkJBTpFwh28pZXLwdYnSia3zZYS0ciQpnf3Qx4PB7IMLOBxb7LqOA21O3uRx+l4GbmlTUo0mA2VRachlHpRUyzgAYBELMyX98o31LDfjyH0e70ZXq5SZLPRIQ0mmp4wfVWhxkJhnH6sJlZxtF5/xoz1w70ElrL6VYWKJw2xO4fFlt7lT2DRK+Z0zhET8HkMv5uL5y0z0i4xoSKp6JalVre3Hc0ilSJ+GwC0NNcjhKIRT0VZEQ61r6dn3Rb0fSoSoQVxZ3stm9mrVvZpepq5HFIhzOaQJd8CqtM+z6RXNnEaEEIotdolEvb3qlEyvi2oFFJRFn/GgKWSYZ/XlgvHZpSRAaBbLlVrVIlEDAv7U2aT1+3sErUDwKh+aMtubHhmc/fOrZvXry55Fi8qfvPF7NyFn7x5+a9/AUieZL/+r5s3bnz+j5X4lzmelVz8bXdWjUzSCQCfmS5f++zTTKqxmr5RC57laKeAd6Hj7TOnT5NIhzF+RCoq/uZrjPfeUwLAN44d2/mZjc+76LBZ3C6722ET8loAwGwacztsDuucdW7a5VgnbWW1zPg8rkjQF/AuRkN+PF2QjEUAIBTIJL7CIX8JCTj1TE59Jpkc2SB/P2EcAwCvM8NpsWSbRCScNBltc3MAMGM2bzmrhzYaAsPHH9+/f7ei7Gg4ELxvfwAA5qsTX8zMFJNLT7zOevPH5158pK6eQ+SjFeTin73FE7/zDhQWAcCvfyX94NLfMNER6rEf/ZB75e//xPUryijksvJ1e6L+w/v0kmLaie80NtafOsXVagdWABrYNQOXRgAKbn1+DQDIlNI9OYlLtvPPAkA0FMAmajUZ28DZJiqpxLw8cGtr2PRK7JpZvSZJ7XWtyTa6Xc4tfZs/4CUudYVMqlH1cOpqAcA6N7vDtfqfhYc3r1+7ef3qnds3Pr08Zn/gBADrv61Pnz7573LAF/A/eryQSq1kP1ZAehKKDGn7MmvyXZnt8ZO0h3vkIuouLDzAr5k02msM5uYzAgB37mV8GJ1W8b3Gxqqq6p+LzlPJxcvh4JaTWoDW+0Tr0cN7oeXlIhIcJpFXovHHS55PjMbzFzruLyw8ePQwHP6SevToOf5P2TUnN/Rq1280fP9UDMvEi0TaS5eyFN747rdn7jzELWujdlbiz6rotEQkupxI0pn0p0t++717J751Qinv5vF4d+/e+cUvpR8M/Oni737/+MnTPThKbm/n7zjb4rQ7JBKJQCAgVsplmWOB6cmtPQpKJAAgGo8ihFIoBQCKHrnNYT3LaxnW99Np5bn0ZH23dOXyR2NjY6VHSqmHS4NB34cffgIAFzrOlR45suTzHT9+vKOj48zpH+QSaZg1rIGBgTUTfvvG+3/8c3q9dUveOJNDOyQSAJQWlwLASioFAMWHStmsk49cS+fffhfl+O3g1mdwnsW0J1Qqds/Ogl4vnhZRyaXbolxpf+b3AYBKpUIIjZtMADBuMOwNB+awWSUAEZ+P39Ks1ah3tU2PxcmFaUfYI5Pk+JTLaVdL5QAgk8kQQn6fHwC6OsWxaLRP00spKgEAVjVzV1AnJ0ztbXxJpxBL3sejEcHZ1jo2S8jnmU3GneRvyekTIJ1Gs418ShOXy66XiMQejyeRSLTxBQBAKS5RKhQOm91tX8z1nHqjWDpvme7Xqq3z2antIV0/k0FvbWnaFkjfootTV4cl9WYnJ7f3rNeTjGZYN6ehsYXTNDKkj0XT4T3g8QvPCvbBJg6hGXP6sKepru5V5lDz/YJhnRbDGfX7X3G6OK+78q5OIQDwmrn7IjOep3bHjQYAqCynRsJBtD/KoT3/ku/m9Wu35yxVVVVon/0VULC3HXoWDZeSqfvzy9ECdPBHxgHUr3D53wA0QUaz1wwniAAAAABJRU5ErkJggg=="/>
                  </div>
                  <h4>无锡美银精工磨具有限公司产品制作工程单</h4>
                  <p>No. <b>{this.state.sheetData.C3_682281119677 }</b></p>
                </div>
                <div className='timer'>
                  <div>
                    接单时间：<DatePicker size='small'showTime value={this.state.sheetData.C3_678796788873} onChange={(v)=>{this.changeSheet('C3_678796788873',v)}}/>
                  </div>
                  <div>
                    交货时间：<DatePicker size='small' showTime value={this.state.sheetData.C3_678796797075} onChange={(v)=>{this.changeSheet('C3_678796797075',v)}}/>
                  </div>
                  <div className='tableWrap'>
                  <div className='depas'>
                    <div>
                      业务部
                    </div>
                    <div>
                      工程部
                    </div>
                    <div>
                      激光部
                    </div>
                    <div>
                      制造部
                    </div>
                    <div>
                      仓库
                    </div>
                    <div>
                      校验
                    </div>
                  </div>
                  <div className='table'>
                    
                    <Row>
                      <Col span={3}>客户名称</Col>
                      <Col span={7} style={{height:'24px'}}>
                        <div onClick={()=>{this.setState({showCustomers:true})}} style={{height:'24px',cursor:'pointer'}}>
                          {this.state.sheetData.C3_678796767356}
                        </div>
                       </Col>
                      <Col span={3}>产品名称</Col>
                      <Col span={7}>
                      <div onClick={()=>{this.setState({showGoods:true})}} style={{height:'24px',cursor:'pointer'}}>
                          {this.state.sheetData.C3_678796779827}
                        </div>
                       
                      </Col>
                      <Col span={2}>数量</Col>
                      <Col span={2}><input value={this.state.sheetData.C3_681946447748} onChange={(v)=>{this.changeSheet('C3_681946447748',v.target.value)}}/></Col>
                    </Row>
                    <Row>
                      <Col style={{width:'8%'}} 
                      // className={this.state.sheetData.C3_681946842309=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681946842309')}}
                      >图面</Col>
                      <Col style={{width:'8%',cursor:'pointer'}} className={this.state.sheetData.C3_681946858588=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681946858588')}}>正切</Col>
                      <Col style={{width:'8%',cursor:'pointer'}} className={this.state.sheetData.C3_681946866036=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681946866036')}}>反切</Col>
                      <Col style={{width:'8%',cursor:'pointer'}} className={this.state.sheetData.C3_681946874849=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681946874849')}}>入刀</Col>
                      <Col style={{width:'8%',cursor:'pointer'}} className={this.state.sheetData.C3_681946885747=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681946885747')}}>净介</Col>
                      <Col style={{width:'8%'}} 
                      // className={this.state.sheetData.C3_681946893259=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681946893259')}}
                      >参照</Col>
                      <Col style={{width:'8%',cursor:'pointer'}} className={this.state.sheetData.C3_681946907063=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681946907063')}}>菲林</Col>
                      <Col style={{width:'8%',cursor:'pointer'}} className={this.state.sheetData.C3_681946916803=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681946916803')}}>色位</Col>
                      <Col style={{width:'9%',cursor:'pointer'}} className={this.state.sheetData.C3_681946932592=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681946932592')}}
                      //  className={this.state.sheetData.C3_681946932592=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681946932592')}}
                      >图纸尺寸</Col>
                      <Col style={{width:'8%',cursor:'pointer'}} className={this.state.sheetData.C3_681946943505=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681946943505')}}>传真</Col>
                      <Col style={{width:'8%',cursor:'pointer'}} className={this.state.sheetData.C3_681946949984=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681946949984')}}>邮件</Col>
                      <Col style={{width:'11%',cursor:'pointer'}} className={this.state.sheetData.C3_681946967641=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681946967641')}}>实样（物）</Col>
                    </Row>
                    <Row>
                      <Col span={2}>稿数情况</Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_681948129430=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681948129430')}}>菲林</Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_681948140445=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681948140445')}}>图纸</Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_681948156177=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681948156177')}}>稿</Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_681948368196=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681948368196')}}>实物</Col>
                      <Col span={4}>稿样是否归还客户</Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678796830965=='是'?'selected':''} onClick={()=>{this.changeSheet('C3_678796830965','是')}}>是</Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678796830965=='否'?'selected':''} onClick={()=>{this.changeSheet('C3_678796830965','否')}}>否</Col>
                      <Col span={2}>板度要求</Col>
                      <Col span={4}><input value={this.state.sheetData.C3_678796840511} onChange={(v)=>{this.changeSheet('C3_678796840511',v.target.value)}}/></Col>
                    </Row>
                    <Row>
                      <Col span={2}>接单人</Col>
                      <Col span={3}><input value={this.state.sheetData.C3_678796887001} onChange={(v)=>{this.changeSheet('C3_678796887001',v.target.value)}}/></Col>
                      <Col span={2}>送货单号</Col>
                      <Col span={3}><input value={this.state.sheetData.C3_678796898023} onChange={(v)=>{this.changeSheet('C3_678796898023',v.target.value)}}/></Col>
                      <Col span={2}>价格</Col>
                      <Col span={2}><input value={this.state.sheetData.C3_678796906793} onChange={(v)=>{this.changeSheet('C3_678796906793',v.target.value)}}/></Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_681948661141=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681948661141')}}>含税</Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_681948667231=='Y'?'selected':''} onClick={()=>{this.changeBol('C3_681948667231')}}>不含税</Col>
                      <Col span={2}>复核人</Col>
                      <Col span={4}><input value={this.state.sheetData.C3_678796943530} onChange={(v)=>{this.changeSheet('C3_678796943530',v.target.value)}}/></Col>
                    </Row>
                    <Row>
                      <Col span={24} >
                        <div>
                          <span style={{width:'100%',textAlign:'left',display:'inline-block',textIndent:'.5rem'}}>
                          接单绘图说明：
                          </span>
                          <TextArea value={this.state.sheetData.C3_678796951598} onChange={(v)=>{this.changeSheet('C3_678796951598',v.target.value)}}/>
                        </div>
                      </Col>

                    </Row>
                    <Row>
                      <Col span={2}>
                        刀材名称
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678796959023} onChange={(v)=>{this.changeSheet('C3_678796959023',v.target.value)}}/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678796966324} onChange={(v)=>{this.changeSheet('C3_678796966324',v.target.value)}}/>
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678796973541} onChange={(v)=>{this.changeSheet('C3_678796973541',v.target.value)}}/>
                      </Col>
                      <Col span={2}>
                        齿刀名称
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797062420} onChange={(v)=>{this.changeSheet('C3_678797062420',v.target.value)}}/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797068641} onChange={(v)=>{this.changeSheet('C3_678797068641',v.target.value)}}/>
                      </Col>
                      <Col span={2}> 
                        数量
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797075331} onChange={(v)=>{this.changeSheet('C3_678797075331',v.target.value)}}/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2} >
                        痕线名称
                      </Col>
                      <Col span={2} >
                      <input value={this.state.sheetData.C3_678796981497} onChange={(v)=>{this.changeSheet('C3_678796981497',v.target.value)}}/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678796989327} onChange={(v)=>{this.changeSheet('C3_678796989327',v.target.value)}}/>
                        
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797024313} onChange={(v)=>{this.changeSheet('C3_678797024313',v.target.value)}}/>
                        
                      </Col>
                      <Col span={2}>
                        孔类名称
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797082671} onChange={(v)=>{this.changeSheet('C3_678797082671',v.target.value)}}/>
                        
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797088953} onChange={(v)=>{this.changeSheet('C3_678797088953',v.target.value)}}/>
                        
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797095425} onChange={(v)=>{this.changeSheet('C3_678797095425',v.target.value)}}/>
                        
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        销类名称
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797032289} onChange={(v)=>{this.changeSheet('C3_678797032289',v.target.value)}}/>
                        
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797041936} onChange={(v)=>{this.changeSheet('C3_678797041936',v.target.value)}}/>
                        
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797050598} onChange={(v)=>{this.changeSheet('C3_678797050598',v.target.value)}}/>
                        
                      </Col>
                      <Col span={2}>
                        其他
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797101119} onChange={(v)=>{this.changeSheet('C3_678797101119',v.target.value)}}/>
                        
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797109062} onChange={(v)=>{this.changeSheet('C3_678797109062',v.target.value)}}/>
                        
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_681949749757} onChange={(v)=>{this.changeSheet('C3_681949749757',v.target.value)}}/>
                        
                      </Col>
                    </Row>
                    <Row>
                      <Col span={4}>
                        板材要求
                      </Col>
                      <Col span={4}>
                        木板厚度
                      </Col>
                      <Col span={1} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797141752=='22'?'selected':''} onClick={()=>{this.changeSheet('C3_678797141752','22')}}>
                        22
                      </Col>
                      <Col span={1} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797141752=='20'?'selected':''} onClick={()=>{this.changeSheet('C3_678797141752','20')}}>
                        20
                      </Col>
                      <Col span={1} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797141752=='18'?'selected':''} onClick={()=>{this.changeSheet('C3_678797141752','18')}}>
                        18
                      </Col>
                      <Col span={1} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797141752=='15'?'selected':''} onClick={()=>{this.changeSheet('C3_678797141752','15')}}>
                        15
                      </Col>
                      <Col span={1} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797141752=='12'?'selected':''} onClick={()=>{this.changeSheet('C3_678797141752','12')}}>
                        12
                      </Col>
                      <Col span={1} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797141752=='10'?'selected':''} onClick={()=>{this.changeSheet('C3_678797141752','10')}}>
                        10
                      </Col>
                      <Col span={5}>
                        塑料板
                      </Col>
                      <Col span={1} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797207647=='10'?'selected':''} onClick={()=>{this.changeSheet('C3_678797207647','10')}}>
                        10
                      </Col>
                      <Col span={1} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797207647=='8'?'selected':''} onClick={()=>{this.changeSheet('C3_678797207647','8')}}>
                        8
                      </Col>
                      <Col span={1} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797207647=='6'?'selected':''} onClick={()=>{this.changeSheet('C3_678797207647','6')}}>
                        6
                      </Col>
                      <Col span={1} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797207647=='5'?'selected':''} onClick={()=>{this.changeSheet('C3_678797207647','5')}}>
                        5
                      </Col>
                      <Col span={1} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797207647=='4'?'selected':''} onClick={()=>{this.changeSheet('C3_678797207647','4')}}>
                        4
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        制图人
                      </Col>
                      <Col span={3}>
                      <input value={this.state.sheetData.C3_678797238397} onChange={(v)=>{this.changeSheet('C3_678797238397',v.target.value)}}/>
                      </Col>
                      <Col span={3}>
                        制图档号
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797244550} onChange={(v)=>{this.changeSheet('C3_678797244550',v.target.value)}}/>
                      </Col>
                      <Col span={3}>
                        制图尺寸
                      </Col>
                      <Col span={3} className='multInput'>
                        <input value={this.state.sheetData.C3_678797254113} onChange={(v)=>{this.changeSheet('C3_678797254113',v.target.value)}}/><span>X</span><input value={this.state.sheetData.C3_681950556005} onChange={(v)=>{this.changeSheet('C3_681950556005',v.target.value)}}/>
                      </Col>
                      <Col span={2}>
                      孔径1
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797264469} onChange={(v)=>{this.changeSheet('C3_678797264469',v.target.value)}}/>
                      </Col>
                      <Col span={2}>
                        孔径2
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797278156} onChange={(v)=>{this.changeSheet('C3_678797278156',v.target.value)}}/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        制米数
                      </Col>
                      <Col span={1}>
                        刀长
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797285605} onChange={(v)=>{this.changeSheet('C3_678797285605',v.target.value)}}/>
                      </Col>
                      <Col span={1}>
                        线长
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797294013} onChange={(v)=>{this.changeSheet('C3_678797294013',v.target.value)}}/>
                      </Col>
                      <Col span={2}>
                        半穿刀
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797303604} onChange={(v)=>{this.changeSheet('C3_678797303604',v.target.value)}}/>
                      </Col>
                      <Col span={1}>
                      齿刀
                      </Col>
                      <Col span={2}><input value={this.state.sheetData.C3_678797311216} onChange={(v)=>{this.changeSheet('C3_678797311216',v.target.value)}}/></Col>
                      <Col span={2}>
                        制图时间
                      </Col>
                      <Col className='multInput' span={7}>
                      {/* <DatePicker showTime style={{width:'45%'}} value={this.state.sheetData.C3_678797319517} onChange={(v)=>{this.changeSheet('C3_678797319517',v)}}/> */}
                      <input style={{width:'45%'}} value={this.state.sheetData.C3_678797319517} onChange={(v)=>{this.changeSheet('C3_678797319517',v.target.value)}}/>
                      <span style={{width:'10%'}}>至</span>
                      {/* <DatePicker showTime style={{width:'45%'}} value={this.state.sheetData.C3_678797328067} onChange={(v)=>{this.changeSheet('C3_678797328067',v)}}/> */}
                      <input style={{width:'45%'}} value={this.state.sheetData.C3_678797328067} onChange={(v)=>{this.changeSheet('C3_678797328067',v.target.value)}}/>
                      </Col>
                      </Row>
                      <Row>
                      <Col span={24}>
                        <div>
                          <span style={{width:'100%',textAlign:'left',display:'inline-block',textIndent:'.5rem'}}>
                          制图备注：
                          </span>
                          <TextArea value={this.state.sheetData.C3_678797335509} onChange={(v)=>{this.changeSheet('C3_678797335509',v.target.value)}}/>
                        </div>
                        <div>
                          <span style={{width:'10%'}}>
                          检验人：
                          </span>
                          <input style={{width:'90%'}} value={this.state.sheetData.C3_681950832269} onChange={(v)=>{this.changeSheet('C3_681950832269',v.target.value)}}/>
                        </div>
                      </Col>

                    </Row>
                    <Row>
                      <Col span={2}>
                        割板人
                      </Col>
                      <Col span={4}>
                      <input value={this.state.sheetData.C3_678797343880} onChange={(v)=>{this.changeSheet('C3_678797343880',v.target.value)}}/>
                      </Col>
                      <Col span={3}>
                        割板时间
                      </Col>
                      <Col className='multInput' span={5}>
                      <input value={this.state.sheetData.C3_678797351896} onChange={(v)=>{this.changeSheet('C3_678797351896',v.target.value)}}/>
                      <span>至</span>
                      <input value={this.state.sheetData.C3_678797359840} onChange={(v)=>{this.changeSheet('C3_678797359840',v.target.value)}}/>
                      </Col>
                      <Col span={5}>
                        切割板尺寸
                      </Col>
                      <Col className='multInput' span={5}>
                      <input value={this.state.sheetData.C3_678797366895} onChange={(v)=>{this.changeSheet('C3_678797366895',v.target.value)}}/>
                      <span>X</span>
                      <input value={this.state.sheetData.C3_681951306434} onChange={(v)=>{this.changeSheet('C3_681951306434',v.target.value)}}/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={3}>
                        割缝宽度
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797373416=='1.0'?'selected':''} onClick={()=>{this.changeSheet('C3_678797373416','1.0')}}>
                        1.0
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797373416=='0.71'?'selected':''} onClick={()=>{this.changeSheet('C3_678797373416','0.71')}}>
                       0.71
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797373416=='0.53'?'selected':''} onClick={()=>{this.changeSheet('C3_678797373416','0.53')}}>
                        0.53
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797373416=='0.45'?'selected':''} onClick={()=>{this.changeSheet('C3_678797373416','0.45')}}>
                      0.45
                      </Col>
                      <Col>
                        其他
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797373416=='1.0'||this.state.sheetData.C3_678797373416=='0.71'||this.state.sheetData.C3_678797373416=='0.53'||this.state.sheetData.C3_678797373416=='0.45'?'':this.state.sheetData.C3_678797373416} onChange={(v)=>{this.changeSheet('C3_678797373416',v.target.value)}}/>
                      </Col>
                      <Col span={4}>
                        切割方式
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797379549=='连续'?'selected':''} onClick={()=>{this.changeSheet('C3_678797379549','连续')}}>
                        连续
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797379549=='脉冲'?'selected':''} onClick={()=>{this.changeSheet('C3_678797379549','脉冲')}}>
                        脉冲
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797379549=='半穿'?'selected':''} onClick={()=>{this.changeSheet('C3_678797379549','半穿')}}>
                        半穿
                      </Col>
                      
                    </Row>
                    <Row>
                      <Col span={24}>
                        <div>
                          <span style={{width:'100%',textAlign:'left',display:'inline-block',textIndent:'.5rem'}}>
                          切割要备注：
                          </span>
                          <TextArea value={this.state.sheetData.C3_678797387551} onChange={(v)=>{this.changeSheet('C3_678797387551',v.target.value)}}/>
                        </div>
                      </Col>

                    </Row>
                    <Row>
                      <Col span={3}>
                        重割原因
                      </Col>
                      <Col span={4}>
                      <input value={this.state.sheetData.C3_682032954218} onChange={(v)=>{this.changeSheet('C3_682032954218',v.target.value)}}/>
                      </Col>
                      <Col span={3}>
                       重割次数
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_682033106245=='1'?'selected':''} onClick={()=>{this.changeSheet('C3_682033106245','1')}}>
                        1
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_682033106245=='2'?'selected':''} onClick={()=>{this.changeSheet('C3_682033106245','2')}}>
                      2
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_682033106245=='3'?'selected':''} onClick={()=>{this.changeSheet('C3_682033106245','3')}}>
                        3
                      </Col>
                      <Col span={2}>
                      确认人
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_682033137280} onChange={(v)=>{this.changeSheet('C3_682033137280',v.target.value)}}/>
                      </Col>
                      <Col span={2}>
                        检验人
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_682033154189} onChange={(v)=>{this.changeSheet('C3_682033154189',v.target.value)}}/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        装刀人
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797430424} onChange={(v)=>{this.changeSheet('C3_678797430424',v.target.value)}}/>
                      </Col>
                      <Col span={1}>
                       时间
                      </Col>
                      <Col className='multInput' span={7}>
                      <input value={this.state.sheetData.C3_678797436775} onChange={(v)=>{this.changeSheet('C3_678797436775',v.target.value)}}/>
                      <span>至</span>
                      <input value={this.state.sheetData.C3_678797442606} onChange={(v)=>{this.changeSheet('C3_678797442606',v.target.value)}}/>
                      </Col>
                      <Col span={3}>
                      第二装刀人
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797462885} onChange={(v)=>{this.changeSheet('C3_678797462885',v.target.value)}}/>
                      </Col>
                      <Col span={1}>
                       时间
                      </Col>
                      <Col className='multInput' span={6}>
                      <input value={this.state.sheetData.C3_678797469831} onChange={(v)=>{this.changeSheet('C3_678797469831',v.target.value)}}/>
                      <span>至</span>
                      <input value={this.state.sheetData.C3_678797479749} onChange={(v)=>{this.changeSheet('C3_678797479749',v.target.value)}}/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                      弯刀人
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797394318} onChange={(v)=>{this.changeSheet('C3_678797394318',v.target.value)}}/>
                      </Col>
                      <Col span={2} >
                       时间
                      </Col>
                      <Col className='multInput'span={7} >
                      <input value={this.state.sheetData.C3_678797402765} onChange={(v)=>{this.changeSheet('C3_678797402765',v.target.value)}}/>
                      <span>至</span>
                      <input value={this.state.sheetData.C3_678797411331} onChange={(v)=>{this.changeSheet('C3_678797411331',v.target.value)}}/>
                      </Col>
                      <Col span={2}>
                      弯刀米数
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_678797448380} onChange={(v)=>{this.changeSheet('C3_678797448380',v.target.value)}}/>
                      </Col>
                      <Col span={4}>
                      弯刀机工作量
                      </Col>
                      <Col span={3}>
                      <input style={{width:'79%'}} value={this.state.sheetData.C3_678797454244} onChange={(v)=>{this.changeSheet('C3_678797454244',v.target.value)}}/><span>%</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <div>
                          <span style={{width:'100%',textAlign:'left',display:'inline-block',textIndent:'.5rem'}}>
                        装刀备注：
                        </span>
                        <TextArea
                        value={this.state.sheetData.C3_682034065524} onChange={(v)=>{this.changeSheet('C3_682034065524',v.target.value)}}
                        />
                        </div>
                        <div>
                          <span style={{width:'10%'}}>
                          检验人：
                          </span>
                          <input style={{width:'90%'}} value={this.state.sheetData.C3_678797488455} onChange={(v)=>{this.changeSheet('C3_678797488455',v.target.value)}}/>
                        </div>

                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        刀材名称
                      </Col>
                      <Col span={2}>
                      {this.state.sheetData.C3_678796959023}
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2} >
                      {this.state.sheetData.C3_678796966324}
                      </Col>
                      <Col span={2}>
                        实用
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_682034416594} onChange={(v)=>{this.changeSheet('C3_682034416594',v.target.value)}}/>
                      </Col>
                      <Col span={2}>
                        齿刀名称
                      </Col>
                      <Col span={2}>
                      {this.state.sheetData.C3_678797062420}
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      {this.state.sheetData.C3_678797068641}
                      </Col>
                      <Col span={2}>
                        实用
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_682034438872} onChange={(v)=>{this.changeSheet('C3_682034438872',v.target.value)}}/>

                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        痕线名称
                      </Col>
                      <Col span={2}>
                      {this.state.sheetData.C3_678796981497}
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      {this.state.sheetData.C3_678796989327}
                      </Col>
                      <Col span={2}>
                        实用
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_682034463638} onChange={(v)=>{this.changeSheet('C3_682034463638',v.target.value)}}/>

                      </Col>
                      <Col span={2}>
                        孔类名称
                      </Col>
                      <Col span={2}>
                      {this.state.sheetData.C3_678797082671}
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      {this.state.sheetData.C3_678797088953}
                      </Col>
                      <Col span={2}>
                        实用
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_682034476603} onChange={(v)=>{this.changeSheet('C3_682034476603',v.target.value)}}/>

                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        销类名称
                      </Col>
                      <Col span={2}>
                      {this.state.sheetData.C3_678797032289}
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      {this.state.sheetData.C3_678797041936}
                      </Col>
                      <Col span={2}>
                        实用
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_682034489751} onChange={(v)=>{this.changeSheet('C3_682034489751',v.target.value)}}/>
                      </Col>
                      <Col span={2}>
                        领料人
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_682034505726} onChange={(v)=>{this.changeSheet('C3_682034505726',v.target.value)}}/>

                      </Col>
                      <Col span={2}>
                        发料人
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_682034516838} onChange={(v)=>{this.changeSheet('C3_682034516838',v.target.value)}}/>

                      </Col>
                    </Row>
                    <Row>
                      <Col style={{width:'2rem'}}>
                        检验内容
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        尺寸
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        正反
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        结构
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        拼板
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        咬口
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        木板
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        桥位
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        清废
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        平衡
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        定位
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        半桥
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        刻字
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        钢刀
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        齿刀
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        钢孔
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        销
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        稿数
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        半穿
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        接刀
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        出图
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        板度
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        海绵
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        版面
                      </Col>
                      <Col style={{width:'calc(100% - 36.5rem)'}}>
                        检验时间
                        <br/>_至_
                      </Col>
                    </Row>
                    <Row className='checkLine'>
                      <Col  style={{width:'2rem'}}>
                        制图
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035409773')}}>
                        {this.state.sheetData.C3_682035409773=='Y'?'√':null}
                        {this.state.sheetData.C3_682035409773=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035422036')}}>
                        {this.state.sheetData.C3_682035422036=='Y'?'√':null}
                        {this.state.sheetData.C3_682035422036=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035432227')}}>
                        {this.state.sheetData.C3_682035432227=='Y'?'√':null}
                        {this.state.sheetData.C3_682035432227=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035453457')}}>
                        {this.state.sheetData.C3_682035453457=='Y'?'√':null}
                        {this.state.sheetData.C3_682035453457=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035468232')}}>
                        {this.state.sheetData.C3_682035468232=='Y'?'√':null}
                        {this.state.sheetData.C3_682035468232=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035481689')}}>
                        {this.state.sheetData.C3_682035481689=='Y'?'√':null}
                        {this.state.sheetData.C3_682035481689=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035505668')}}>
                        {this.state.sheetData.C3_682035505668=='Y'?'√':null}
                        {this.state.sheetData.C3_682035505668=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035523851')}}>
                        {this.state.sheetData.C3_682035523851=='Y'?'√':null}
                        {this.state.sheetData.C3_682035523851=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035536745')}}>
                        {this.state.sheetData.C3_682035536745=='Y'?'√':null}
                        {this.state.sheetData.C3_682035536745=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035545851')}}>
                        {this.state.sheetData.C3_682035545851=='Y'?'√':null}
                        {this.state.sheetData.C3_682035545851=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035556211')}}>
                        {this.state.sheetData.C3_682035556211=='Y'?'√':null}
                        {this.state.sheetData.C3_682035556211=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035564241')}}>
                        {this.state.sheetData.C3_682035564241=='Y'?'√':null}
                        {this.state.sheetData.C3_682035564241=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035579077')}}>
                        {this.state.sheetData.C3_682035579077=='Y'?'√':null}
                        {this.state.sheetData.C3_682035579077=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035591233')}}>
                        {this.state.sheetData.C3_682035591233=='Y'?'√':null}
                        {this.state.sheetData.C3_682035591233=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035607308')}}>
                        {this.state.sheetData.C3_682035607308=='Y'?'√':null}
                        {this.state.sheetData.C3_682035607308=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035616412')}}>
                        {this.state.sheetData.C3_682035616412=='Y'?'√':null}
                        {this.state.sheetData.C3_682035616412=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035630789')}}>
                        {this.state.sheetData.C3_682035630789=='Y'?'√':null}
                        {this.state.sheetData.C3_682035630789=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035641583')}}>
                        {this.state.sheetData.C3_682035641583=='Y'?'√':null}
                        {this.state.sheetData.C3_682035641583=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035652553')}}>
                        {this.state.sheetData.C3_682035652553=='Y'?'√':null}
                        {this.state.sheetData.C3_682035652553=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035663922')}}>
                        {this.state.sheetData.C3_682035663922=='Y'?'√':null}
                        {this.state.sheetData.C3_682035663922=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035672756')}}>
                        {this.state.sheetData.C3_682035672756=='Y'?'√':null}
                        {this.state.sheetData.C3_682035672756=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035682083')}}>
                        {this.state.sheetData.C3_682035682083=='Y'?'√':null}
                        {this.state.sheetData.C3_682035682083=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035693207')}}>
                        {this.state.sheetData.C3_682035693207=='Y'?'√':null}
                        {this.state.sheetData.C3_682035693207=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'calc(100% - 36.5rem)'}}>
                      <input value={this.state.sheetData.C3_678797494510} onChange={(v)=>{this.changeSheet('C3_678797494510',v.target.value)}}/>
                      </Col>
                    </Row>
                    <Row  className='checkLine'>
                      <Col style={{width:'2rem'}}>
                        品管
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035940283')}}>
                        {this.state.sheetData.C3_682035940283=='Y'?'√':null}
                        {this.state.sheetData.C3_682035940283=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035978006')}}>
                        {this.state.sheetData.C3_682035978006=='Y'?'√':null}
                        {this.state.sheetData.C3_682035978006=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682035993475')}}>
                        {this.state.sheetData.C3_682035993475=='Y'?'√':null}
                        {this.state.sheetData.C3_682035993475=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036005367')}}>
                        {this.state.sheetData.C3_682036005367=='Y'?'√':null}
                        {this.state.sheetData.C3_682036005367=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036014460')}}>
                        {this.state.sheetData.C3_682036014460=='Y'?'√':null}
                        {this.state.sheetData.C3_682036014460=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036025355')}}>
                        {this.state.sheetData.C3_682036025355=='Y'?'√':null}
                        {this.state.sheetData.C3_682036025355=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036032521')}}>
                        {this.state.sheetData.C3_682036032521=='Y'?'√':null}
                        {this.state.sheetData.C3_682036032521=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036045272')}}>
                        {this.state.sheetData.C3_682036045272=='Y'?'√':null}
                        {this.state.sheetData.C3_682036045272=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036054520')}}>
                        {this.state.sheetData.C3_682036054520=='Y'?'√':null}
                        {this.state.sheetData.C3_682036054520=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036063617')}}>
                        {this.state.sheetData.C3_682036063617=='Y'?'√':null}
                        {this.state.sheetData.C3_682036063617=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036072508')}}>
                        {this.state.sheetData.C3_682036072508=='Y'?'√':null}
                        {this.state.sheetData.C3_682036072508=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036080089')}}>
                        {this.state.sheetData.C3_682036080089=='Y'?'√':null}
                        {this.state.sheetData.C3_682036080089=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036095286')}}>
                        {this.state.sheetData.C3_682036095286=='Y'?'√':null}
                        {this.state.sheetData.C3_682036095286=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036110172')}}>
                        {this.state.sheetData.C3_682036110172=='Y'?'√':null}
                        {this.state.sheetData.C3_682036110172=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036130895')}}>
                        {this.state.sheetData.C3_682036130895=='Y'?'√':null}
                        {this.state.sheetData.C3_682036130895=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036139234')}}>
                        {this.state.sheetData.C3_682036139234=='Y'?'√':null}
                        {this.state.sheetData.C3_682036139234=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036147319')}}>
                        {this.state.sheetData.C3_682036147319=='Y'?'√':null}
                        {this.state.sheetData.C3_682036147319=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036155378')}}>
                        {this.state.sheetData.C3_682036155378=='Y'?'√':null}
                        {this.state.sheetData.C3_682036155378=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036164862')}}>
                        {this.state.sheetData.C3_682036164862=='Y'?'√':null}
                        {this.state.sheetData.C3_682036164862=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036174495')}}>
                        {this.state.sheetData.C3_682036174495=='Y'?'√':null}
                        {this.state.sheetData.C3_682036174495=='N'?'×':null}
                      </div>
                      </Col><Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036186441')}}>
                        {this.state.sheetData.C3_682036186441=='Y'?'√':null}
                        {this.state.sheetData.C3_682036186441=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036195755')}}>
                        {this.state.sheetData.C3_682036195755=='Y'?'√':null}
                        {this.state.sheetData.C3_682036195755=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <div style={{cursor:'pointer'}} onClick={()=>{this.changeCheck('C3_682036206954')}}>
                        {this.state.sheetData.C3_682036206954=='Y'?'√':null}
                        {this.state.sheetData.C3_682036206954=='N'?'×':null}
                      </div>
                      </Col>
                      <Col style={{width:'calc(100% - 36.5rem)'}}>
                      <input value={this.state.sheetData.C3_678797501456} onChange={(v)=>{this.changeSheet('C3_678797501456',v.target.value)}}/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        出货方式
                      </Col>
                      <Col span={1} style={{cursor:'pointer'}} className={this.state.sheetData.C3_682039536836=='送'?'selected':''} onClick={()=>{this.changeSheet('C3_682039536836','送')}}>
                        送
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_682039536836=='自取'?'selected':''} onClick={()=>{this.changeSheet('C3_682039536836','自取')}}>
                        自取
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_682039536836=='托运'?'selected':''} onClick={()=>{this.changeSheet('C3_682039536836','托运')}}>
                        托运
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_682039536836=='快递'?'selected':''} onClick={()=>{this.changeSheet('C3_682039536836','快递')}}>
                        快递
                      </Col>
                      <Col span={2}>
                        最终评定
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797509260=='OK'?'selected':''} onClick={()=>{this.changeSheet('C3_678797509260','OK')}}>
                        OK
                      </Col>
                      <Col span={2} style={{cursor:'pointer'}} className={this.state.sheetData.C3_678797509260=='NG'?'selected':''} onClick={()=>{this.changeSheet('C3_678797509260','NG')}}>
                        NG
                      </Col>
                      <Col span={2}>
                        送货人
                      </Col><Col span={3}>
                      <input value={this.state.sheetData.C3_678797515839} onChange={(v)=>{this.changeSheet('C3_678797515839',v.target.value)}}/>
                      </Col>
                      <Col span={2}>
                        检验人
                      </Col>
                      <Col span={2}>
                      <input value={this.state.sheetData.C3_682039853604} onChange={(v)=>{this.changeSheet('C3_682039853604',v.target.value)}}/>
                      </Col>
                    </Row>
                  </div>
                  </div>
                </div>

              </div>
              </div>
          </div>
        </div>

      </div>

    );
  }
}

export default WorkSheetDetail;
