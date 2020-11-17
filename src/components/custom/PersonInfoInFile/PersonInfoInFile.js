import React from 'react';
import {Spin,Button,Input,Select,DatePicker,InputNumber,message,Icon } from 'antd';
import http from 'Util20/api';
import './PersonInfoInFile.less';
import moment from 'moment';
import { isString } from 'util';

/**
 * 档案管理内的个人信息
 */
const { Option } = Select;
class PersonInfoInFile extends React.Component {

    constructor(props) {
      // resid:612530416359
      
      super(props);
      var baseURL=window.pwConfig[
        process.env.NODE_ENV
      ].customURLs.comprehensiveQueryBaseURL;
      var laowuURL=window.pwConfig[
        process.env.NODE_ENV
      ].customURLs.laowuURL;
      console.log(props.isOuter)
      if(props.isOuter==true){
        baseURL =laowuURL
      }
      var memberId = this.props.memberId;
      console.log(memberId)

      this.state = {
        isOuter:props.isOuter,
        baseURL:baseURL,
        edit:false,
        loading:false,
        hasRelated:false,
        memberId:memberId,
        data:{
          C3_464172117706:'',//人员编号
          C3_464702128504:'',//人员工号
          C3_464172127930:'',//中文名
          C3_464172148589:'',//英文名
          C3_464172157606:'',//性别
          C3_464172188709:'',//国籍
          C3_464172212871:'',//籍贯
          C3_464172226868:'',//民族
          C3_464172239173:'',//血型
          C3_464172266942:'',//证件类型
          C3_464172300168:'',//证件号码
          C3_464172321287:'',//出生日期
          C3_464172350271:'',//文书送达地址
          C3_464172402553:'',//现居住地址
          C3_464172444813:'',//邮编
          C3_464172486192:'',//家庭号码
          C3_464172500234:'',//手机号码
          C3_464172522558:'',//公司邮箱
          C3_464172654284:'',//学历
          C3_464172707004:'',//政治面貌
          C3_464172722124:'',//户籍类别
          C3_464172819253:'',//婚姻状况
          C3_464172852423:'',//生育状况

          C3_464173481804:'',//教育开始日期1
          C3_464173514735:'',//教育开始日期2
          C3_464173524810:'',//教育开始日期3
          C3_464173535280:'',//教育开始日期4
          C3_464173629942:'',//教育结束日期1
          C3_464173639392:'',//教育结束日期2
          C3_464173646851:'',//教育结束日期3
          C3_464173667723:'',//教育结束日期4
          C3_464173711606:'',//学校名称1
          C3_464173723045:'',//学校名称2
          C3_464173733523:'',//学校名称3
          C3_464173750564:'',//学校名称4
          C3_464173836290:'',//专业1
          C3_464173847918:'',//专业2
          C3_464173861459:'',//专业3
          C3_464173879808:'',//专业4
          C3_464173912562:'',//学历1
          C3_464173926575:'',//学历2
          C3_464173937460:'',//学历3
          C3_464173949368:'',//学历4

          C3_464174073888:'',//名称1
          C3_464174102741:'',//名称2
          C3_464174124614:'',//名称3
          C3_464174135706:'',//名称4
          C3_464174245669:'',//等级1
          C3_464174263309:'',//等级2
          C3_464174274118:'',//等级3
          C3_464174314278:'',//等级4
          C3_464174345857:'',//颁发机构1
          C3_464174365244:'',//颁发机构2
          C3_464174394548:'',//颁发机构3
          C3_464174405591:'',//颁发机构4
          C3_464174451732:'',//获得日期1
          C3_464174461446:'',//获得日期2
          C3_464174473180:'',//获得日期3
          C3_464174481889:'',//获得日期4  

          C3_464174535762:'',//工作开始日期1  
          C3_464174545465:'',//工作开始日期2  
          C3_464174554658:'',//工作开始日期3  
          C3_464174563152:'',//工作开始日期4  
          C3_464174605218:'',//工作结束日期1  
          C3_464174895167:'',//工作结束日期2  
          C3_464174904208:'',//工作结束日期3  
          C3_464174917676:'',//工作结束日期4  
          C3_464174974466:'',//公司名称1  
          C3_464174984491:'',//公司名称2  
          C3_464174996449:'',//公司名称3  
          C3_464175006600:'',//公司名称4  
          C3_464175049944:'',//职位1  
          C3_464175060992:'',//职位2  
          C3_464175072014:'',//职位3  
          C3_464175085490:'',//职位4  
          C3_464458881276:'',//离职原因1  
          C3_464458911775:'',//离职原因2  
          C3_464458921788:'',//离职原因3  
          C3_464458930539:'',//离职原因4  

          C3_464175119119:'',//家庭成员姓名1  
          C3_464175141966:'',//家庭成员姓名2  
          C3_464175301544:'',//家庭成员姓名3  
          C3_464175313029:'',//家庭成员姓名4  
          C3_464175402821:'',//关系1
          C3_464175419381:'',//关系2
          C3_464175427954:'',//关系3
          C3_464175436022:'',//关系4
          C3_464175464598:'',//联系方式1
          C3_464175479476:'',//联系方式2
          C3_464175490285:'',//联系方式3
          C3_464175539610:'',//联系方式4
          C3_464175628311:'',//工作单位1
          C3_464175642417:'',//工作单位2
          C3_464175653685:'',//工作单位3
          C3_464175665668:'',//工作单位4

          C3_464175727918:'',//紧急联系人姓名
          C3_464175750587:'',//紧急联系人与员工的关系
          C3_464175768379:'',//紧急联系人现居住地址
          C3_464175781611:'',//紧急联系人电话
          C3_464175812688:'',//紧急联系人邮箱
          C3_464175797109:'',//紧急联系人手机

          C3_464175890357:'',//有亲友在菲尼撒任职

          C3_464276899657:'',//亲友姓名1
          C3_464277095370:'',//亲友姓名2
          C3_464276983864:'',//亲友关系1
          C3_464277151777:'',//亲友关系2
          C3_464277008583:'',//亲友联系方式1
          C3_464277179556:'',//亲友联系方式2

          C3_464184775908:'',//简答1=备注1
          C3_464184788901:'',//简答2=备注2
          C3_464277267009:'',//简答3=备注3
          C3_550784878452:'',//犯罪记录
          C3_551806597769:'',//劳务公司犯罪记录

          C3_544732637200:null,//电子签名
          C3_464700452077:'N',//提交
          // C3_471002935941:'N'//归档
        }
      };
      if(props.edit){
        this.state.edit=true;
      }
      if(props.private){
        this.state.private=true;

      }
    } 
    componentDidMount(){
      this.getData(this.state.memberId);
    }
    // 提交前验证
    judge=()=>{
      var str=''
      if(!this.state.data.C3_464172127930){
        str='姓名'
      }
      // else if(!this.state.data.C3_464172148589){
      //   str='英文名'
      // }
      else if(!this.state.data.C3_464172157606){
        str='性别'
      }else if(!this.state.data.C3_464172188709){
        str='国籍'
      }else if(!this.state.data.C3_464172212871){
        str='籍贯'
      }else if(!this.state.data.C3_464172226868){
        str='民族'
      }else if(!this.state.data.C3_464172266942){
        str='血型'
      }else if(!this.state.data.C3_464172321287){
        str='出生日期'
      }else if(!this.state.data.C3_464172350271){
        str='文书送达地址'
      }else if(!this.state.data.C3_464172402553){
        str='现居住地址'
      }
      // else if(!this.state.data.C3_464172444813){
      //   str='邮编'
      // }
      else if(!this.state.data.C3_464172486192){
        str='家庭号码'
      }else if(!this.state.data.C3_464172500234){
        str='手机号码'
      }
      // else if(!this.state.data.C3_464172522558){
      //   str='公司邮箱'
      // }
      else if(!this.state.data.C3_464172654284){
        str='学历'
      }else if(!this.state.data.C3_464172707004){
        str='政治面貌'
      }else if(!this.state.data.C3_464172722124){
        str='户籍类别'
      }else if(!(this.state.data.C3_464173481804&&this.state.data.C3_464173629942&&this.state.data.C3_464173711606&&this.state.data.C3_464173836290&&this.state.data.C3_464173912562)
              ||
              (this.state.data.C3_464173514735&&this.state.data.C3_464173639392&&this.state.data.C3_464173723045&&this.state.data.C3_464173847918&&this.state.data.C3_464173926575)
              ||
              (this.state.data.C3_464173524810&&this.state.data.C3_464173646851&&this.state.data.C3_464173733523&&this.state.data.C3_464173861459&&this.state.data.C3_464173937460)
              ||
              (this.state.data.C3_464173535280&&this.state.data.C3_464173667723&&this.state.data.C3_464173750564&&this.state.data.C3_464173879808&&this.state.data.C3_464173949368)
              ){
        str='学历/学位'
      }
      // else if(!(this.state.data.C3_464174073888&&this.state.data.C3_464174245669&&this.state.data.C3_464174345857&&this.state.data.C3_464174451732)
      //     ||
      //     (this.state.data.C3_464174102741&&this.state.data.C3_464174263309&&this.state.data.C3_464174365244&&this.state.data.C3_464174461446)
      //     ||
      //     (this.state.data.C3_464174124614&&this.state.data.C3_464174274118&&this.state.data.C3_464174394548&&this.state.data.C3_464174473180)
      //     ||
      //     (this.state.data.C3_464174135706&&this.state.data.C3_464174314278&&this.state.data.C3_464174405591&&this.state.data.C3_464174481889)
      //     ){
      //   str='专业/执业资格'
      // }
      else if(!(this.state.data.C3_464174535762&&this.state.data.C3_464174605218&&this.state.data.C3_464174974466&&this.state.data.C3_464175049944&&this.state.data.C3_464458881276)
          ||
          (this.state.data.C3_464174545465&&this.state.data.C3_464174895167&&this.state.data.C3_464174984491&&this.state.data.C3_464175060992&&this.state.data.C3_464458911775)
          ||
          (this.state.data.C3_464174554658&&this.state.data.C3_464174904208&&this.state.data.C3_464174996449&&this.state.data.C3_464175072014&&this.state.data.C3_464458921788)
          ||
          (this.state.data.C3_464174563152&&this.state.data.C3_464174917676&&this.state.data.C3_464175006600&&this.state.data.C3_464175085490&&this.state.data.C3_464458930539)
          ){
        str='工作经验'
      }else if(!(this.state.data.C3_464175119119&&this.state.data.C3_464175402821&&this.state.data.C3_464175464598&&this.state.data.C3_464175628311)
            ||
            (this.state.data.C3_464175141966&&this.state.data.C3_464175419381&&this.state.data.C3_464175479476&&this.state.data.C3_464175642417)
            ||
            (this.state.data.C3_464175301544&&this.state.data.C3_464175427954&&this.state.data.C3_464175490285&&this.state.data.C3_464175653685)
            ||
            (this.state.data.C3_464175313029&&this.state.data.C3_464175436022&&this.state.data.C3_464175539610&&this.state.data.C3_464175665668)
            ){
        str='家庭成员及主要社会关系'
      }else if(!this.state.data.C3_464175727918){
        str='紧急联系人姓名';
      }else if(!this.state.data.C3_464175750587){
        str='紧急联系人与员工的关系';
      }else if(!this.state.data.C3_464175797109){
        str='紧急联系人手机号码';
      }else if(!this.state.data.C3_464175768379){
        str='现居住地址';
      }else if(!this.state.data.C3_464184775908){
        str='问答1';
      }else if(!this.state.data.C3_464184788901){
        str='问答2';
      }else if(!this.state.data.C3_464277267009){
        str='问答3';
      }
      console.log(str)
      if(str==''){
        return true;

      }else{
        str+='尚未填写';
        message.error(str);
        return false;
      }
    }
    getData = async(memberId) =>{
      this.setState({loading:true});
      let res;
      let cms = `C3_464172117706 = '${memberId}'`;
      if(!this.props.private){
        cms = `C3_464702128504 = '${this.props.gonghao}' and C3_464172300168 = '${this.props.idNum}'`
      }
      try {
        res = await http({baseURL:this.state.baseURL}).getTable({
          resid: 464705942338,
          cmswhere: cms
          // cmswhere: `C3_464172117706 = '${memberId}'`
        });
        var obj = res.data[0];
        console.log('org',obj)
        console.log(isString(obj.C3_464173535280))
        // 格式化时间
        if(isString(obj.C3_464172321287)){
          obj.C3_464172321287=moment(obj.C3_464172321287 );
        }
        if(isString(obj.C3_464173481804)){
          obj.C3_464173481804=moment(obj.C3_464173481804 );

        }
        if(isString(obj.C3_464173629942)){
          obj.C3_464173629942=moment(obj.C3_464173629942 );

        }
        if(isString(obj.C3_464173514735)){
          obj.C3_464173514735=moment(obj.C3_464173514735 );

        }
        if(isString(obj.C3_464173639392)){
          obj.C3_464173639392=moment(obj.C3_464173639392 );

        }
        if(isString(obj.C3_464173524810)){
          obj.C3_464173524810=moment(obj.C3_464173524810 );

        }
        if(isString(obj.C3_464173646851)){
          obj.C3_464173646851=moment(obj.C3_464173646851 );

        }
        if(isString(obj.C3_464173535280)){
          obj.C3_464173535280=moment(obj.C3_464173535280 );

        }
        if(isString(obj.C3_464173667723)){
          obj.C3_464173667723=moment(obj.C3_464173667723 );

        }
        if(isString(obj.C3_464174451732)){
          obj.C3_464174451732=moment(obj.C3_464174451732 );

        }
        if(isString(obj.C3_464174461446)){
          obj.C3_464174461446=moment(obj.C3_464174461446 );

        }
        if(isString(obj.C3_464174473180)){
          obj.C3_464174473180=moment(obj.C3_464174473180 );

        }
        if(isString(obj.C3_464174481889)){
          obj.C3_464174481889=moment(obj.C3_464174481889 );

        }
        if(isString(obj.C3_464174535762)){
          obj.C3_464174535762=moment(obj.C3_464174535762 );

        }
        if(isString(obj.C3_464174605218)){
          obj.C3_464174605218=moment(obj.C3_464174605218 );

        }
        if(isString(obj.C3_464174545465)){
          obj.C3_464174545465=moment(obj.C3_464174545465 );

        }
        if(isString(obj.C3_464174895167)){
          obj.C3_464174895167=moment(obj.C3_464174895167 );

        }
        if(isString(obj.C3_464174554658)){
          obj.C3_464174554658=moment(obj.C3_464174554658 );

        }
        if(isString(obj.C3_464174904208)){
          obj.C3_464174904208=moment(obj.C3_464174904208 );

        }
        if(isString(obj.C3_464174563152)){
          obj.C3_464174563152=moment(obj.C3_464174563152 );

        }
        if(isString(obj.C3_464174917676)){
          obj.C3_464174917676=moment(obj.C3_464174917676 );

        }
        // 是否有亲属
        if(obj.C3_464175890357==0){
         this.setState({hasRelated:false});
          
        }else{
          this.setState({hasRelated:true});

        }
        // 已提交个人不可编辑
        if(obj.C3_464700452077=='Y'){

            this.setState({edit:false});


        }
        // // 已归档的场合不可编辑
        // if(obj.C3_471002935941=='Y'){
        //   this.setState({edit:false});

        // }
        this.setState({data:obj,loading:false});
      } catch (err) {

        this.setState({loading:false});

        console.error(err.message);
      }
    }
    onSubmit = async(value) =>{
      var j=this.judge();
      // var j=true;
      if(j==false){
        return false;
      }else{
        // 判断归档、撤销归档、保存
        var obj=this.state.data;
        if(value=='sub'){
          obj.C3_464700452077='Y';
        }else{
          // obj.C3_464700452077='N';
        }
        // if(value=='sav'){
        //   obj.C3_464700452077='Y';
        // }
        console.log('提交前',obj)
       let res;
       this.setState({loading:true});
      try {
        res = await http({baseURL:this.state.baseURL}).modifyRecords({
          resid: 464705942338,
          data:[obj]
        });
        this.setState({loading:false});
        message.success('提交成功');

        console.log(res);
      } catch (err) {
        this.setState({loading:false});
        message.error('提交失败');

        console.error(err.message);
      }
      }
      
    }
    onChange=(index,v)=>{
      if(this.state.edit){
        var obj=this.state.data;
        obj[index]=v;
        this.setState({data:obj});
      }
      console.log(this.state)
    } 
    onPrinting = () => {
      const bodyHtml = window.document.body.innerHTML;
  
       var footstr = "</body>";
       var newstr = document.getElementById('toPrint').innerHTML;
  
       var style="<style media='print'>@page {size: auto; margin: 0mm;}.toHide{display:none!important}b,h4,h3{font-weight:normal}input{border:none!important;}.page{height:100vh;}footer{display:none;}.ant-select-selection{border:none!important;}.ant-select-arrow{display:none;}.date i{display:none}.fix{display:none;}.ant-input-number{border:none;}*{font-size:12px!important;color:#333333!important;border-color:#333333!important;}i{color:#fff!important;display:none!important}</style>"
       var headstr = "<html><head><title></title>"+style+"</head><body>";
       document.body.innerHTML = headstr + newstr + footstr;
       window.print();
      window.document.body.innerHTML = bodyHtml;
      window.location.reload();
    };

  render() {
    return (
     <div className={this.state.edit?'PersonInfoInFile':'PersonInfoInFile PersonInfoInFileForbid'} id='toPrint'>
       <Spin spinning={this.state.loading}>
       <div className='page' style={{
         background:'#fff',
         padding:'16px',
         boxSizing:'border-box'
       }}>
         <h3 style={{textAlign:'center',fontWeight:'bold',cursor:'default',fontSize:'14px',paddingBottom:'4px',borderBottom:'1px solid #e8e8e8'}}>个人详细信息表</h3>
        <h4 style={{width:'100%',marginBottom:'4px'}}>一、个人基本信息</h4>
        <div style={{border:'1px solid #333'}}>
          <div style={{width:'33.33%',float:'left',borderRight:'1px solid #333'}}>
            <b className={this.state.data.C3_464172127930?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>姓名：</b>
            <Input disabled={!this.state.edit} value={this.state.data.C3_464172127930} onChange={(v)=>{this.onChange('C3_464172127930',v.target.value)}} size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left',borderRight:'1px solid #333'}}>
          {/* className={this.state.data.C3_464172148589?'':'alert'} */}
            <b  style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>英文名：</b>
            <Input disabled={!this.state.edit} value={this.state.data.C3_464172148589} onChange={(v)=>{this.onChange('C3_464172148589',v.target.value)}} size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b className={this.state.data.C3_464172157606?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>性别：</b>
            <Select disabled={!this.state.edit} size='small' value={this.state.data.C3_464172157606} onChange={(v)=>{this.onChange('C3_464172157606',v)}} style={{ width: 'calc(100% - 120px)' }}>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </div>
          <div style={{clear:'both',height:'1px',borderBottom:'1px solid #333',boxSizing:'border-box'}}></div>
          <div style={{width:'33.33%',float:'left',borderRight:'1px solid #333'}}>
            <b className={this.state.data.C3_464172188709?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>国籍：</b>
            <Input disabled={!this.state.edit} value={this.state.data.C3_464172188709} onChange={(v)=>{this.onChange('C3_464172188709',v.target.value)}} size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left',borderRight:'1px solid #333'}}>
            <b className={this.state.data.C3_464172212871?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>籍贯：</b>
            <Input disabled={!this.state.edit} value={this.state.data.C3_464172212871} onChange={(v)=>{this.onChange('C3_464172212871',v.target.value)}} size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b className={this.state.data.C3_464172226868?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>民族：</b>
            <Input disabled={!this.state.edit} value={this.state.data.C3_464172226868} onChange={(v)=>{this.onChange('C3_464172226868',v.target.value)}} size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{clear:'both',height:'1px',borderBottom:'1px solid #333',boxSizing:'border-box'}}></div>

          <div style={{width:'33.33%',float:'left',borderRight:'1px solid #333'}}>
            <b className={this.state.data.C3_464172239173?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>血型：</b>
            <Select size='small' value={this.state.data.C3_464172239173} onChange={(v)=>{this.onChange('C3_464172239173',v)}} style={{ width: 'calc(100% - 120px)' }}>
              
              <Option value='A'>A</Option>
              <Option value='AB'>AB</Option>
              <Option value='B'>B</Option>
              <Option value='O'>O</Option>
            </Select>
          </div>
          <div style={{width:'33.33%',float:'left',borderRight:'1px solid #333'}}>
            <b className={this.state.data.C3_464172321287?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>出生日期：</b>
            <DatePicker disabled={!this.state.edit}  value={this.state.data.C3_464172321287} onChange={(v)=>{this.onChange('C3_464172321287',v)}} size='small' placeholder={null} style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b className={this.state.data.C3_464172654284?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>学历：</b>
            <Select value={this.state.data.C3_464172654284} onChange={(v)=>{this.onChange('C3_464172654284',v)}} size='small' style={{ width: 'calc(100% - 120px)' }}>
              <Option value='初中'>初中</Option>
              <Option value='中专'>中专</Option>
              <Option value='高中'>高中</Option>
              <Option value='大专'>大专</Option>
              <Option value='本科'>本科</Option>
              <Option value='硕士'>硕士</Option>
              <Option value='博士'>博士</Option>
              <Option value='其他'>其他</Option>
            </Select>
          </div>
          <div style={{clear:'both',height:'1px',borderBottom:'1px solid #333',boxSizing:'border-box'}}></div>

          <div style={{width:'33.33%',float:'left',borderRight:'1px solid #333'}}>
            <b className={this.state.data.C3_464172266942?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>证件类型：</b>
            <Input value={this.state.data.C3_464172266942} onChange={(v)=>{this.onChange('C3_464172266942',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'66.66%',float:'left'}}>
            <b className={this.state.data.C3_464172300168?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>证件号码：</b>
            <Input value={this.state.data.C3_464172300168} onChange={(v)=>{this.onChange('C3_464172300168',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{clear:'both',height:'1px',borderBottom:'1px solid #333',boxSizing:'border-box'}}></div>

          <div style={{width:'100%',float:'left'}}>
            <b className={this.state.data.C3_464172350271?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>文书送达地址：</b>
            <Input value={this.state.data.C3_464172350271} onChange={(v)=>{this.onChange('C3_464172350271',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{clear:'both',height:'1px',borderBottom:'1px solid #333',boxSizing:'border-box'}}></div>

          <div style={{width:'100%',float:'left'}}>
            <b className={this.state.data.C3_464172402553?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>现居住地址：</b>
            <Input value={this.state.data.C3_464172402553} onChange={(v)=>{this.onChange('C3_464172402553',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
         
          <div style={{clear:'both',height:'1px',borderBottom:'1px solid #333',boxSizing:'border-box'}}></div>
          <div style={{width:'33.33%',float:'left',borderRight:'1px solid #333'}}>
          {/* className={this.state.data.C3_464172444813?'':'alert'} */}
            <b  style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>邮编：</b>
            <InputNumber disabled={!this.state.edit} value={this.state.data.C3_464172444813} onChange={(v)=>{this.onChange('C3_464172444813',v)}} size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left',borderRight:'1px solid #333'}}>
            <b className={this.state.data.C3_464172486192?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>家庭号码：</b>
            <InputNumber disabled={!this.state.edit} value={this.state.data.C3_464172486192} onChange={(v)=>{this.onChange('C3_464172486192',v)}} size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b className={this.state.data.C3_464172500234?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>手机号码：</b>
            <InputNumber disabled={!this.state.edit} value={this.state.data.C3_464172500234} onChange={(v)=>{this.onChange('C3_464172500234',v)}} size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          
          <div style={{clear:'both',height:'1px',borderBottom:'1px solid #333',boxSizing:'border-box'}}></div>

          <div style={{width:'33.33%',float:'left',borderRight:'1px solid #333'}}>
            <b className={this.state.data.C3_464172707004?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>政治面貌：</b>
            <Input value={this.state.data.C3_464172707004} onChange={(v)=>{this.onChange('C3_464172707004',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>

          <div style={{width:'66.66%',float:'left'}}>
          {/* className={this.state.data.C3_464172522558?'':'alert'} */}
            <b  style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>公司邮箱：</b>
            <Input value={this.state.data.C3_464172522558} onChange={(v)=>{this.onChange('C3_464172522558',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>

          <div style={{clear:'both',height:'1px',borderBottom:'1px solid #333',boxSizing:'border-box'}}></div>

          
          <div style={{width:'33.33%',float:'left',borderRight:'1px solid #333'}}>
            <b className={this.state.data.C3_464172722124?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>户籍类别：</b>
            <Input value={this.state.data.C3_464172722124} onChange={(v)=>{this.onChange('C3_464172722124',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left',borderRight:'1px solid #333'}}>
            <b className={this.state.data.C3_464172819253?'':'alert'} style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>婚姻状况：</b>
            <Select value={this.state.data.C3_464172819253} onChange={(v)=>{this.onChange('C3_464172819253',v)}} size='small' style={{ width: 'calc(100% - 120px)' }}>
              <Option value='未婚'>未婚</Option>
              <Option value='已婚'>已婚</Option>
            </Select>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>生育状况：</b>
            <Input value={this.state.data.C3_464172852423} onChange={(v)=>{this.onChange('C3_464172852423',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{clear:'both',height:'1px',borderBottom:'1px solid #333',boxSizing:'border-box'}}></div>

          
          <div style={{width:'100%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',verticalAlign:'middle',textAlign:'left',marginLeft:'4px'}}>个人邮箱：</b>
            <Input disabled={!this.state.edit}size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{clear:'both',height:'1px'}}></div>

          </div>
          <h4 style={{width:'100%',marginTop:'4px',marginBottom:'4px'}}>二、教育和培训</h4>
          <div style={{marginBottom:'4px'}}
            className={
              (this.state.data.C3_464173481804&&this.state.data.C3_464173629942&&this.state.data.C3_464173711606&&this.state.data.C3_464173836290&&this.state.data.C3_464173912562)
              ||
              (this.state.data.C3_464173514735&&this.state.data.C3_464173639392&&this.state.data.C3_464173723045&&this.state.data.C3_464173847918&&this.state.data.C3_464173926575)
              ||
              (this.state.data.C3_464173524810&&this.state.data.C3_464173646851&&this.state.data.C3_464173733523&&this.state.data.C3_464173861459&&this.state.data.C3_464173937460)
              ||
              (this.state.data.C3_464173535280&&this.state.data.C3_464173667723&&this.state.data.C3_464173750564&&this.state.data.C3_464173879808&&this.state.data.C3_464173949368)
              ?'':'alert'}
          
          >学历/学位（请填写高中以上学历）</div>
          <table border="1" style={{width:'100%',border:'1px solid #333'}}>
          <tr>
            <th  style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>开始日期</th>
            <th  style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>结束日期</th>
            <th  style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>学校名称</th>
            <th  style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>专业</th>
            <th  style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>学历</th>
          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464173481804} onChange={(v)=>{this.onChange('C3_464173481804',v)}}  size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464173629942} onChange={(v)=>{this.onChange('C3_464173629942',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464173711606} onChange={(v)=>{this.onChange('C3_464173711606',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464173836290} onChange={(v)=>{this.onChange('C3_464173836290',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464173912562} onChange={(v)=>{this.onChange('C3_464173912562',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>

          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464173514735} onChange={(v)=>{this.onChange('C3_464173514735',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464173639392} onChange={(v)=>{this.onChange('C3_464173639392',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input  value={this.state.data.C3_464173723045} onChange={(v)=>{this.onChange('C3_464173723045',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464173847918} onChange={(v)=>{this.onChange('C3_464173847918',v.target.value)}} disabled={!this.state.edit} size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464173926575} onChange={(v)=>{this.onChange('C3_464173926575',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464173524810} onChange={(v)=>{this.onChange('C3_464173524810',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464173646851} onChange={(v)=>{this.onChange('C3_464173646851',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input  value={this.state.data.C3_464173733523} onChange={(v)=>{this.onChange('C3_464173733523',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464173861459} onChange={(v)=>{this.onChange('C3_464173861459',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464173937460} onChange={(v)=>{this.onChange('C3_464173937460',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464173535280} onChange={(v)=>{this.onChange('C3_464173535280',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464173667723} onChange={(v)=>{this.onChange('C3_464173667723',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464173750564} onChange={(v)=>{this.onChange('C3_464173750564',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464173879808} onChange={(v)=>{this.onChange('C3_464173879808',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464173949368} onChange={(v)=>{this.onChange('C3_464173949368',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
          </tr>
        </table>
        {/* className={
          (this.state.data.C3_464174073888&&this.state.data.C3_464174245669&&this.state.data.C3_464174345857&&this.state.data.C3_464174451732)
          ||
          (this.state.data.C3_464174102741&&this.state.data.C3_464174263309&&this.state.data.C3_464174365244&&this.state.data.C3_464174461446)
          ||
          (this.state.data.C3_464174124614&&this.state.data.C3_464174274118&&this.state.data.C3_464174394548&&this.state.data.C3_464174473180)
          ||
          (this.state.data.C3_464174135706&&this.state.data.C3_464174314278&&this.state.data.C3_464174405591&&this.state.data.C3_464174481889)
          ?'':'alert'} */}
        <div
       
       style={{marginTop:'4px',marginBottom:'4px'}}>专业/执业资格：</div>
          <table border="1" style={{width:'100%',border:'1px solid #333'}}>
          <tr>
          <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px'}}>名称</th>
            <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px',width:'104px'}}>等级</th>
            <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px'}}>颁发机构</th>
            <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px'}}>获得日期</th>
          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464174073888} onChange={(v)=>{this.onChange('C3_464174073888',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px'}}>
            <Select value={this.state.data.C3_464174245669} onChange={(v)=>{this.onChange('C3_464174245669',v)}} size='small' style={{ width: '100%' }}>
              <Option value="无">无</Option>
              <Option value="TEM-8">TEM-8</Option>
              <Option value="TEM-4">TEM-4</Option>
              <Option value="CET-6">CET-6</Option>
              <Option value="CET-4">CET-4</Option>
            </Select>
            </td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464174345857} onChange={(v)=>{this.onChange('C3_464174345857',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464174451732} onChange={(v)=>{this.onChange('C3_464174451732',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>

          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464174102741} onChange={(v)=>{this.onChange('C3_464174102741',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px'}}>
              <Select value={this.state.data.C3_464174263309} onChange={(v)=>{this.onChange('C3_464174263309',v)}} size='small' style={{ width: '100%' }}>
              <Option value="无">无</Option>
              <Option value="TEM-8">TEM-8</Option>
              <Option value="TEM-4">TEM-4</Option>
              <Option value="CET-6">CET-6</Option>
              <Option value="CET-4">CET-4</Option>
            </Select></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464174365244} onChange={(v)=>{this.onChange('C3_464174365244',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464174461446} onChange={(v)=>{this.onChange('C3_464174461446',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464174124614} onChange={(v)=>{this.onChange('C3_464174124614',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px'}}>
              <Select value={this.state.data.C3_464174274118} onChange={(v)=>{this.onChange('C3_464174274118',v)}} size='small' style={{ width: '100%' }}>
              <Option value="无">无</Option>
              <Option value="TEM-8">TEM-8</Option>
              <Option value="TEM-4">TEM-4</Option>
              <Option value="CET-6">CET-6</Option>
              <Option value="CET-4">CET-4</Option>
            </Select></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464174394548} onChange={(v)=>{this.onChange('C3_464174394548',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464174473180} onChange={(v)=>{this.onChange('C3_464174473180',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464174135706} onChange={(v)=>{this.onChange('C3_464174135706',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px'}}>
              <Select value={this.state.data.C3_464174314278} onChange={(v)=>{this.onChange('C3_464174314278',v)}} size='small' style={{ width: '100%' }}>
              <Option value="无">无</Option>
              <Option value="TEM-8">TEM-8</Option>
              <Option value="TEM-4">TEM-4</Option>
              <Option value="CET-6">CET-6</Option>
              <Option value="CET-4">CET-4</Option>
            </Select></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464174405591} onChange={(v)=>{this.onChange('C3_464174405591',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464174481889} onChange={(v)=>{this.onChange('C3_464174481889',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
          </tr>
        </table>

        <h4 
        className={
          (this.state.data.C3_464174535762&&this.state.data.C3_464174605218&&this.state.data.C3_464174974466&&this.state.data.C3_464175049944&&this.state.data.C3_464458881276)
          ||
          (this.state.data.C3_464174545465&&this.state.data.C3_464174895167&&this.state.data.C3_464174984491&&this.state.data.C3_464175060992&&this.state.data.C3_464458911775)
          ||
          (this.state.data.C3_464174554658&&this.state.data.C3_464174904208&&this.state.data.C3_464174996449&&this.state.data.C3_464175072014&&this.state.data.C3_464458921788)
          ||
          (this.state.data.C3_464174563152&&this.state.data.C3_464174917676&&this.state.data.C3_464175006600&&this.state.data.C3_464175085490&&this.state.data.C3_464458930539)
          ?'':'alert'}
        style={{marginTop:'4px',marginBottom:'4px'}}>三、工作经验（请务必填写完整工作经历）</h4>
          <table border="1" style={{width:'100%',border:'1px solid #333'}}>
          <tr>
          <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>开始日期</th>
            <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>结束日期</th>
            <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>公司名称</th>
            <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>职位</th>
            <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>离职原因</th>
          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464174535762} onChange={(v)=>{this.onChange('C3_464174535762',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464174605218} onChange={(v)=>{this.onChange('C3_464174605218',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464174974466} onChange={(v)=>{this.onChange('C3_464174974466',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175049944} onChange={(v)=>{this.onChange('C3_464175049944',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464458881276} onChange={(v)=>{this.onChange('C3_464458881276',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/>
              </td>

          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464174545465} onChange={(v)=>{this.onChange('C3_464174545465',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464174895167} onChange={(v)=>{this.onChange('C3_464174895167',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input  value={this.state.data.C3_464174984491} onChange={(v)=>{this.onChange('C3_464174984491',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175060992} onChange={(v)=>{this.onChange('C3_464175060992',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
            <Input value={this.state.data.C3_464458911775} onChange={(v)=>{this.onChange('C3_464458911775',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/>
            </td>
              
          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464174554658} onChange={(v)=>{this.onChange('C3_464174554658',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464174904208} onChange={(v)=>{this.onChange('C3_464174904208',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input  value={this.state.data.C3_464174996449} onChange={(v)=>{this.onChange('C3_464174996449',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175072014} onChange={(v)=>{this.onChange('C3_464175072014',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
            <Input value={this.state.data.C3_464458921788} onChange={(v)=>{this.onChange('C3_464458921788',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/>
            </td>
          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464174563152} onChange={(v)=>{this.onChange('C3_464174563152',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <DatePicker disabled={!this.state.edit} value={this.state.data.C3_464174917676} onChange={(v)=>{this.onChange('C3_464174917676',v)}} size='small'  className='date' placeholder={null} style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input  value={this.state.data.C3_464175006600} onChange={(v)=>{this.onChange('C3_464175006600',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175085490} onChange={(v)=>{this.onChange('C3_464175085490',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
            <Input value={this.state.data.C3_464458930539} onChange={(v)=>{this.onChange('C3_464458930539',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/>
            </td>
          </tr>
        </table>
        <h4 
          style={{marginBottom:'4px'}}>四、家庭信息及紧急联系人</h4>
          <div  className={
            (this.state.data.C3_464175119119&&this.state.data.C3_464175402821&&this.state.data.C3_464175464598&&this.state.data.C3_464175628311)
            ||
            (this.state.data.C3_464175141966&&this.state.data.C3_464175419381&&this.state.data.C3_464175479476&&this.state.data.C3_464175642417)
            ||
            (this.state.data.C3_464175301544&&this.state.data.C3_464175427954&&this.state.data.C3_464175490285&&this.state.data.C3_464175653685)
            ||
            (this.state.data.C3_464175313029&&this.state.data.C3_464175436022&&this.state.data.C3_464175539610&&this.state.data.C3_464175665668)
            ?'':'alert'}style={{marginBottom:'4px'}}>1.家庭成员及主要社会关系（父母、配偶、兄弟姐妹及子女）</div>
          <table border="1" style={{width:'100%',border:'1px solid #333'}}>
          <tr>
          <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>姓名</th>
            <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>关系</th>
            <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>联系方式</th>
            <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>工作单位</th>
          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175119119} onChange={(v)=>{this.onChange('C3_464175119119',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175402821} onChange={(v)=>{this.onChange('C3_464175402821',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <InputNumber disabled={!this.state.edit} value={this.state.data.C3_464175464598} onChange={(v)=>{this.onChange('C3_464175464598',v)}} size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175628311} onChange={(v)=>{this.onChange('C3_464175628311',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>

          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175141966} onChange={(v)=>{this.onChange('C3_464175141966',v.target.value)}}  disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175419381} onChange={(v)=>{this.onChange('C3_464175419381',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <InputNumber disabled={!this.state.edit} value={this.state.data.C3_464175479476} onChange={(v)=>{this.onChange('C3_464175479476',v)}} size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175642417} onChange={(v)=>{this.onChange('C3_464175642417',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175301544} onChange={(v)=>{this.onChange('C3_464175301544',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175427954} onChange={(v)=>{this.onChange('C3_464175427954',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <InputNumber disabled={!this.state.edit} value={this.state.data.C3_464175490285} onChange={(v)=>{this.onChange('C3_464175490285',v)}} size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175653685} onChange={(v)=>{this.onChange('C3_464175653685',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175313029} onChange={(v)=>{this.onChange('C3_464175313029',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175436022} onChange={(v)=>{this.onChange('C3_464175436022',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <InputNumber disabled={!this.state.edit} value={this.state.data.C3_464175539610} onChange={(v)=>{this.onChange('C3_464175539610',v)}} size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175665668} onChange={(v)=>{this.onChange('C3_464175665668',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
          </tr>
        </table>
        </div>

        
        
        <div className='page' style={{
         
         padding:'16px',
         boxSizing:'border-box',
       }}>
          <div style={{marginBottom:'4px'}}>2.紧急联系人（直系亲属）</div>
          <table border="1" style={{width:'100%',border:'1px solid #333'}}>
          <tr>
          <th className={this.state.data.C3_464175727918?'':'alert'} style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>姓名</th>
            <th className={this.state.data.C3_464175750587?'':'alert'} style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>与员工的关系</th>
            <th className={this.state.data.C3_464175797109?'':'alert'} style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>手机号码</th>
            {/* <th className={this.state.data.C3_464175768379?'':'alert'} style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>现居住地址</th> */}
            <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>电话</th>
            <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>邮箱</th>
          </tr>
          <tr>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175727918} onChange={(v)=>{this.onChange('C3_464175727918',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175750587} onChange={(v)=>{this.onChange('C3_464175750587',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <InputNumber disabled={!this.state.edit} value={this.state.data.C3_464175797109} onChange={(v)=>{this.onChange('C3_464175797109',v)}} size='small' style={{width:'100%'}}/></td>
            {/* <td style={{height:'4px',lineHeight:'24px' }}> */}
              {/* <Input value={this.state.data.C3_464175768379} onChange={(v)=>{this.onChange('C3_464175768379',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td> */}
            <td style={{height:'4px',lineHeight:'24px' }}>
              <InputNumber disabled={!this.state.edit} value={this.state.data.C3_464175781611} onChange={(v)=>{this.onChange('C3_464175781611',v)}}  size='small' style={{width:'100%'}}/></td>
            <td style={{height:'4px',lineHeight:'24px' }}>
              <Input value={this.state.data.C3_464175812688} onChange={(v)=>{this.onChange('C3_464175812688',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>

          </tr>
          
        </table>
          <div style={{border:'1px solid #333',width:'100%',borderTop:'none'}}>
            <b className={this.state.data.C3_464175768379?'':'alert'} style={{display:'inline-block',width:'144px',textAlign:'left',marginLeft:'4px'}}>紧急联系人现住地址：</b>
            <Input disabled={!this.state.edit} value={this.state.data.C3_464175768379} onChange={(v)=>{this.onChange('C3_464175768379',v.target.value)}} size='small' style={{width:'calc(100% - 148px)'}}/>
          </div>
        
        <div style={{marginTop:'4px',marginBottom:'4px'}}>
      <span style={{marginLeft:'4px'}}>3.是否有亲属在本公司任职：<input style={this.state.edit?{marginRight:'4px'}:{display:'none'}} className='toHide' type='checkbox' value={this.state.hasRelated} onChange={()=>{
        var v=!this.state.hasRelated;
        v=v?1:0;
        this.setState({
      data: {
        ...this.state.data,
        C3_464175890357: v
      }
      
    });
    this.setState({hasRelated:(!this.state.hasRelated)});
    
    }}/><span style={{color:'#fff'}}>{this.state.hasRelated?'是':'否'}</span> </span>
       </div>
       {this.state.hasRelated?
        <table border="1" style={{width:'100%',border:'1px solid #333'}}>
        <tr>
        <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>姓名</th>
          <th  style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>与员工的关系</th>
          <th style={{height:'4px',lineHeight:'24px',fontWeight:'normal',textIndent:'4px' }}>联系方式</th>
        </tr>
        <tr>
          <td style={{height:'4px',lineHeight:'24px' }}>
            <Input value={this.state.data.C3_464276899657} onChange={(v)=>{this.onChange('C3_464276899657',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
          <td style={{height:'4px',lineHeight:'24px' }}>
            <Input value={this.state.data.C3_464276983864} onChange={(v)=>{this.onChange('C3_464276983864',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
          <td style={{height:'4px',lineHeight:'24px' }}>
            <Input value={this.state.data.C3_464277008583} onChange={(v)=>{this.onChange('C3_464277008583',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>

        </tr>
        <tr>
          <td style={{height:'4px',lineHeight:'24px' }}>
            <Input value={this.state.data.C3_464277095370} onChange={(v)=>{this.onChange('C3_464277095370',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
          <td style={{height:'4px',lineHeight:'24px' }}>
            <Input value={this.state.data.C3_464277151777} onChange={(v)=>{this.onChange('C3_464277151777',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
          <td style={{height:'4px',lineHeight:'24px' }}>
            <Input value={this.state.data.C3_464277179556} onChange={(v)=>{this.onChange('C3_464277179556',v.target.value)}} disabled={!this.state.edit}size='small' style={{width:'100%'}}/></td>
        </tr>
 
      </table>
      :null}
      <div style={{height:'4px',borderTop:'1px solid #e8e8e8'}}></div>
      <h4 style={{marginBottom:'4px'}}>五、其他需要告知公司信息</h4>
      <div className={this.state.data.C3_464184775908?'':'alert'}  style={{marginBottom:'4px'}}>1.是否得过严重的疾病？目前身体状况如何？是否有传染病，慢性病或怀孕等？如是，请详细说明。</div>
      <Input.TextArea disabled={!this.state.edit} value={this.state.data.C3_464184775908} onChange={(v)=>{this.onChange('C3_464184775908',v.target.value)}}  style={{resize:'none',height:'72px'}}/>
      <div className={this.state.data.C3_464184788901?'':'alert'} style={{marginTop:'4px',marginBottom:'4px'}}>2.是否有过4个月以上的失业经历？如有，请详细说明。</div>
      <Input.TextArea disabled={!this.state.edit} value={this.state.data.C3_464184788901} onChange={(v)=>{this.onChange('C3_464184788901',v.target.value)}} style={{resize:'none',height:'72px'}}/>
      <div className={this.state.data.C3_464277267009?'':'alert'}  style={{marginTop:'4px',marginBottom:'4px'}}>3.与前任雇主是否已经办妥离职手续，是否签有竞业限制协议，如有，请详细说明。</div>
      <Input.TextArea disabled={!this.state.edit} value={this.state.data.C3_464277267009} onChange={(v)=>{this.onChange('C3_464277267009',v.target.value)}} style={{resize:'none',height:'72px'}}/>
      <div style={{marginTop:'4px',marginBottom:'4px'}}>4.本人最近两年是否有违法犯罪记录或者失信行为记录？</div>
      <Input.TextArea disabled={!this.state.edit} 
      value={this.state.isOuter?this.state.data.C3_551806597769=='N'?'否':this.state.data.C3_551806597769:(this.state.data.C3_550784878452=='N'?'否':this.state.data.C3_550784878452)} 
      onChange={(v)=>{
        if(this.state.isOuter){
        this.onChange('C3_551806597769',v.target.value)

        }else{
          this.onChange('C3_550784878452',v.target.value)
        }
      } }
      style={{resize:'none',height:'72px'}}/>
       
      <p style={{marginTop:'4px'}}>
         本人承诺：<br/>
         &nbsp;&nbsp;&nbsp;&nbsp;1 ）所有填表内容真实、准确，如有虚假愿意接受处分包括解除劳动合同。<br/>
         &nbsp;&nbsp;&nbsp;&nbsp;2）本人确认同意使用小菲员工助手微信公众号，已首次提交的微信号注册小菲员工助手公众号。本人保证该账户均有本人操作，不会交由其他人操作。对于填写内容及提交的各类申请，均是本人真实意思表示，本人愿承担所有法律责任。<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;3）本人同意公司进行背景调查。<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;4）本人同意公司根据生产需要安排的排班（包括加班）。公司现有的排班形式包括但不限于：上二休二、上四休三、上五休二等。<br/>
        &nbsp;&nbsp;&nbsp;&nbsp;5）薪资计算补充说明：如员工出勤不满一整月，该月工资按照以下方式计算：劳动合同中约定的月工资-劳工合同中约定的月工资/21.75*当月缺勤天数。我已经阅读并认可上述计算方法。<br/>
         </p>
         
        <div style={{marginTop:'4px'}}>
          <span>申请人签名：</span>
          <div style={{display:'inline-block',width:'144px',borderBottom:'1px solid #333'}}>
            <Input disabled size='small' style={{width:'100%',border:'none',background:'#fff'}}/>
          </div>
          <span style={{marginLeft:'4px'}}>日期：</span>
          <div style={{display:'inline-block',width:'144px',borderBottom:'1px solid #333'}}>
          <Input disabled size='small' style={{width:'100%',border:'none',background:'#fff'}}/>
          </div>
        </div>
        
        <div style={{marginTop:'4px'}}>
           {this.state.data.C3_544732637200?
           <img style={{maxHeight:'120px',width:'auto'}} src = {this.state.data.C3_544732637200}/>
           :null}
          </div>
       
       </div>
       {/* <Button className='toHide' style={{position:'fixed',top:'64px',right:'24px',width:'64px',height:'64px',padding:'0'}}onClick={this.onPrinting}><Icon style={{transform:'scale(2)'}} type='printer' /></Button> */}
       
       <div className='fix'>_</div>
        <footer>
          <Button style={{width:'92px'}} onClick={this.onPrinting}>打印</Button>
          {((this.state.data.C3_464700452077=='Y')||(this.state.isOuter==true))?null:<Button type='primary' style={{width:'92px'}} onClick={this.onSubmit}>保存</Button>}
          {((this.state.data.C3_464700452077=='Y')||(this.state.isOuter==true))?null:<Button type='primary' style={{width:'92px',background:'#fa8c16',borderColor:'#fa8c16'}}onClick={()=>this.onSubmit('sub')}>保存并归档</Button>}  
          {/* {this.state.data.C3_464700452077=='Y'?null:(this.props.private?<Button type='primary' style={{marginLeft:'4px',background:'#fa8c16',borderColor:'#fa8c16'}}onClick={()=>this.onSubmit('sav')}>保存并提交</Button>:null)}  */}
          {/* {this.props.private?null:(
            this.state.data.C3_464700452077=='Y'?<Button style={{marginLeft:'4px'}} type='danger' onClick={this.onSubmit}>取消归档</Button>:null
          )
          } */}
        </footer>
      </Spin>
      </div>

    );
  }
}
export default PersonInfoInFile;