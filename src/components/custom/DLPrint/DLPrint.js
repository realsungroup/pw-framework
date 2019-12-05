import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, message, Modal ,Icon,Table,Spin} from 'antd';
import './DLPrint.less';
import http from '../../../util20/api';
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width:'10%',
    render: (text, record) =>{
      return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
     }
  },
  {
    title: '关系',
    dataIndex: 'relation',
    key: 'relation',
    width:'10%',
    render: (text, record) =>{
      return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
     }
  },
  {
    title: '职务',
    dataIndex: 'job',
    key: 'job',
    width:'15%',
    render: (text, record) =>{
      return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
     }
  },
  {
    title: '家庭住址',
    dataIndex: 'address',
    key: 'address',
    ellipsis:false,
    width:'45%',
    render: (text, record) =>{
      return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
     }
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    width:'20%',
    render: (text, record) =>{
      return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
     }

  }]
  // 学历信息
  const columnsEdu = [
    {
      title: '起止年月',
      dataIndex: 'time',
      key: 'time',
      width:'30%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
    },
    {
      title: '学校名称',
      dataIndex: 'school',
      key: 'school',
      width:'26%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
      width:'16%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
    },
    {
      title: '教育类型',
      dataIndex: 'eduType',
      key: 'eduType',
      width:'13%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
    },
    {
      title: '学历',
      dataIndex: 'education',
      key: 'education',
      width:'8%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
  
    },
    {
      title: '学历证书',
      dataIndex: 'proof',
      key: 'proof',
      width:'12%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
    }]
    // 工作经历
  const columnsWk = [
    {
      title: '起止年月',
      dataIndex: 'time',
      key: 'time',
      width:'20%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
    },
    {
      title: '工作单位',
      dataIndex: 'unit',
      key: 'unit',
      width:'20%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
    },
    {
      title: '担任职务',
      dataIndex: 'job',
      key: 'job',
      width:'12%',
      render: (text, record) =>{
       return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
      }
    },
    {
      title: '直接上级',
      dataIndex: 'supervisor',
      key: 'supervisor',
      width:'12%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
    },
    {
      title: '上级职务',
      dataIndex: 'supervisorJob',
      key: 'supervisorJob',
      width:'12%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
  
    },
    {
      title: '离职原因',
      dataIndex: 'leaveReason',
      key: 'leaveReason',
      width:'14%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
      },
       {
        title: '离职类别',
        dataIndex: 'quitType',
        key: 'quitType',
        width:'14%',
        render: (text, record) =>{
          return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
         }
    }
  ]
class DLPrint extends React.Component {
  constructor(props) {
    super(props);
    
  }
  state={
    showPrint:false,
    data:{},
    famRelation:[{
      
    }],
    emergency:[{
      
    }],
    EduInfo:[{
      
    }],
    WkInfo:[{
     
    }],
    sign:[],
    dataOther:{},
    dataAbi:{},
    discription:[{C3_618313028667:''},{C3_618313028667:''},{C3_618313028667:''},{C3_618313028667:''},{C3_618313028667:''},{C3_618313028667:''}]
  }
  showHidden=async(v)=>{
    this.setState({
      showPrint:true,
      data:v,
      loading:true
    });
    let emgAdd=v.emgAddress.split('【');
    let emgStr='';
    var n=0;
    while(n<emgAdd.length){
      emgStr+=emgAdd[n]
      n++;
    }
    emgAdd=emgStr+v.emgDetailAddress;
    let emergency =[{
      key:n,
      name: v.emergency,
      relation:v.emgRelation,
      job:v.emgJob,
      address: emgAdd,
      phone:v.emgPhone
    }]
this.setState({emergency:emergency})
    let arr=[];
    let str=v.C3_618419447565;
    arr=str.split('【');
    this.setState({
      sign:arr
    })
    // 获取工作经历
    try {
      let res = await http({baseURL:'http://kingofdinner.realsun.me:1201/'}).getTable({
        resid:617195083937,
        cmswhere:`InterviewerId='${v.intervieweeId}'`
      });
     var arrWk=[];
     var n=0;
     while(n<res.data.length){
       arrWk.push({
        key:n,
        time:res.data[n].startTime+'至'+res.data[n].endTime,
        unit:res.data[n].unit,
        job:res.data[n].job,
        supervisor:res.data[n].boss,
        supervisorJob:res.data[n].bossJob,
        leaveReason:res.data[n].quitReason,
        quitType:res.data[n].quitType,
       })
       n++;
     }
     this.setState({
        WkInfo:arrWk
     })
      console.info('工作经历',res)
    } catch (error) {
      console.log(error)
    }
    // 获取学历信息
    try {
      let res2 = await http({baseURL:'http://kingofdinner.realsun.me:1201/'}).getTable({
        resid:617195073738,
        cmswhere:`IntervieweeId='${v.intervieweeId}'`
      });
     var arrEdu=[];
     var n=0;
     while(n<res2.data.length){
       var sTime=res2.data[n].startTime.split(' ');
       var eTime=res2.data[n].endTime.split(' ');
       sTime=sTime[0].split('/')
       sTime=sTime[0]+'-'+sTime[1]+'-'+sTime[2];
       eTime=eTime[0].split('/')
       eTime=eTime[0]+'-'+eTime[1]+'-'+eTime[2];
      arrEdu.push({
        time:sTime+'至'+eTime,
        school:res2.data[n].school,
        major:res2.data[n].major,
        education:res2.data[n].eduBg,
        proof:res2.data[n].eduCertificate,
        eduType:res2.data[n].schoolType
       })
       n++;
     }
     this.setState({
      EduInfo:arrEdu
     })
      console.info('教育经历',res2)
    } catch (error) {
      console.log(error)
    }
    // 获取家庭关系
    try {
      let res3 = await http({baseURL:'http://kingofdinner.realsun.me:1201/'}).getTable({
        resid:617195098273,
        cmswhere:`InterviewerId='${v.intervieweeId}'`
      });
     var famRe=[];
     var n=0;
     while(n<res3.data.length){
       var arrAddress=res3.data[n].address.split('【');
       var c=0;
       var addresString='';
       while(c<arrAddress.length){
        addresString+=arrAddress[c]
         c++;
       }
      famRe.push({
        key:n,
        name:res3.data[n].name,
        relation:res3.data[n].relation,
        job:res3.data[n].job,
        address:addresString+res3.data[n].detailAddress,
        phone:res3.data[n].phone,
       })
       n++;
     }
     this.setState({
      famRelation:famRe
     })
      console.info('家庭背景',res3)
    } catch (error) {
      console.log(error)
    }
    // 获取其他信息
    try {
      let res4 = await http({baseURL:'http://kingofdinner.realsun.me:1201/'}).getTable({
        resid:617195125330,
        cmswhere:`InterviewerId='${v.intervieweeId}'`
      });
     
     this.setState({
      dataOther:res4.data[0]
     })
      console.info('其他信息',res4)
    } catch (error) {
      console.log(error)
    }
    // 获取能力指标
    try {
      let res5 = await http({baseURL:'http://kingofdinner.realsun.me:1201/'}).getTable({
        resid:617195136194,
        cmswhere:`InterviewerId='${v.intervieweeId}'`
      });
     
     this.setState({
      dataAbi:res5.data[0]
     })
      console.info('能力指标',res5)
    } catch (error) {
      console.log(error)
    }
    // 获取简答题
    try {
      let res6 = await http({baseURL:'http://kingofdinner.realsun.me:1201/'}).getTable({
        resid:618312967605,
        cmswhere:`REC_CRTID='${v.ID}'`
      });
     this.setState({
      discription:res6.data,
      loading:false
     })
      console.info('简答题',res6)
    } catch (error) {
      console.log(error)
    }
  } 
  handlePrint = () => {
    // 打印
    const bodyHtml = window.document.body.innerHTML;

    var footstr = "</body>";
     var newstr = document.getElementById('toPrint').innerHTML;
     var style='<style>p{margin:0}</style>';
      // var style="<style media='print'>#toPrint .sm-wrap{width:30%;margin-right:5%;height:auto;float:left;}	@page {	size: auto; margin: 0;	}</style><style>#toPrint .sm-wrap{width:30%;margin-right:5%;height:auto;float:left;}#toPrint .sm-wrap:nth-child(4n-1){margin-right:0;}.alter>div{margin:0;}#toPrint .sm-wrap>div{width:100%;height:auto;line-height: 22px;margin-bottom: 17px;}#toPrint .sm-wrap>div:last-child{margin-bottom: 0;}.clearfix{clear:both;margin-bottom: 32px;}.printBtn{position:fixed;top:16px;left:16px;}</style>";
     var headstr = "<html><head><title></title>"+style+"</head><body>";
     document.body.innerHTML = headstr + newstr + footstr;
     window.print();
    window.document.body.innerHTML = bodyHtml;
    window.location.reload();
    // const newEle = document.querySelector('#toPrint').innerHTML;


     
    // var oldstr = document.body.innerHTML; //保存当前页面
    // document.body.innerHTML = newEle; //把当前页面内容替换为要打印的内容
    // window.print();
    // document.body.innerHTML = oldstr; //恢复原来的页面
    // window.location.reload();
  };
  render() {
    const { data ,sign,dataOther,dataAbi,discription} = this.state;
    return (
      <div
        className="table-data-wrap"
        style={{ height: '100vh' }}
      >
        
        <div className={this.state.showPrint?'viewPrint':'hidden'}>
        <Spin spinning={this.state.loading}>
        <Button type='primary' className='printBtn' onClick={this.handlePrint}>打印</Button>
          <Icon className='clz' type="close-circle" onClick={()=>this.setState({showPrint:false})}/>
          <div id='toPrint' style={{background:'#fff'}}>
            {/* <div style={{padding:'10mm',width:'100%',boxSizing:'border-box'}}> */}
            <h3>基本信息</h3>
            <div>
            <div className='sm-wrap alter' style={{height:'100px',overflow:'hidden',width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
              <img src={data.photoLInk} style={{width:'30%',height:'auto',float:'left'}}/>
              <div style={{width:'65%',float:'right',marginTop:0.5*(100-100/sign.length)+'px'}}>
              {sign.map((item)=>(
                <img src={item} style={{width:(100/sign.length)+'%'}}/>
              ))}
              </div>
            </div>
            <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>姓名：</b>{data.name}</span>
              </div>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>出生年月：</b>{data.birthdate}</span>
              </div>
              <div>
                <span><b>性别：</b>{data.sex}</span>
              </div>
            </div>
            <div className='sm-wrap' style={{width:'30%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>在职状态：</b>{data.hasJob}</span>
              </div>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>工作年限：</b>{data.seniority}</span>
              </div>
              <div>
                <span><b>职业：</b>{data.job}</span>
              </div>
            </div>
            <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>

            <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>身高(cm)：</b>{data.height}</span>
              </div>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>体重(kg)：</b>{data.weight}</span>
              </div>
              <div>
                <span><b>血型：</b>{data.bloodType}</span>
              </div>
            </div>
            <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>宗教信仰：</b>{data.religion}</span>
              </div>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>兴趣爱好：</b>{data.hobby}</span>
              </div>
              <div>
                <span><b>身份证号：</b>{data.ID}</span>
              </div>
            </div>
            <div className='sm-wrap' style={{width:'30%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>籍贯：</b>{data.nativePlace}</span>
              </div>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>民族：</b>{data.naition}</span>
              </div>
             
            </div>
            <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>

            <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>家庭住址：</b>{data.homeDetailAddress}</span>
              </div>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>暂住地址：</b>{data.detailAddress}</span>
              </div>
              <div>
                <span><b>手机号码：</b>{data.mobilephone}</span>
              </div>
            </div>
            <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>家庭电话：</b>{data.homePhone}</span>
              </div>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>暂住电话：</b>{data.phone}</span>
              </div>
              <div>
                <span><b>电子邮箱：</b>{data.email}</span>
              </div>
            </div>
            <div className='sm-wrap' style={{width:'30%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>家庭邮编：</b>{data.homePostcode}</span>
              </div>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>暂住邮编：</b>{data.postcode}</span>
              </div>
              <div>
                <span><b>到岗日期：</b>{data.entryTime}</span>
              </div>
            </div>
            <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>
            <hr/>
            <h3>学历信息</h3>
            <Table style={{marginTop:'16px',marginBottom:'16px',pageBreakBefore: 'auto'}} columns={columnsEdu} dataSource={this.state.EduInfo} size={'small'} bordered pagination={false}/>
            <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>
            <hr/>
            <h3>工作经历 <span style={{float:'right'}}>劳动关系现状：{data.hasJob}</span></h3>
            <Table style={{marginTop:'16px',marginBottom:'16px',pageBreakBefore: 'auto'}} columns={columnsWk} dataSource={this.state.WkInfo} size={'small'} bordered pagination={false}/>
            <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>
            <hr/>
            <h3 >家庭关系</h3>
            <Table style={{marginTop:'16px',marginBottom:'16px',pageBreakBefore: 'auto'}} columns={columns} dataSource={this.state.famRelation} size={'small'} bordered pagination={false}/>
            <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>
            <hr/>
            <h3 >紧急联络人</h3>
            <Table style={{marginTop:'16px',marginBottom:'16px',pageBreakBefore: 'auto'}} columns={columns} dataSource={this.state.emergency} size={'small'} bordered pagination={false}/>
            <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>

            <hr/>
            
            <h3>其他信息</h3>
           
            <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>工伤：</b>{dataOther.injury}</span>
              </div>
              <div>
                <span><b>慢性病：</b>{dataOther.chroDise}</span>
              </div>
            </div>
            <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>身体状况：</b>{dataOther.health}</span>
              </div>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>愿意穿防尘服、防静电服：</b>{dataOther.suit?'是':'否'}</span>
              </div>
            </div>
            <div className='sm-wrap' style={{width:'30%',height:'auto',float:'left'}}>
              <div>
                <span><b>愿意看显微镜：</b>{dataOther.microscope?'是':'否'}</span>
              </div>
             
            </div>
            <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>

            <hr/>

            <h3>能力指标自我评价</h3>
           
           <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
             <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
               <span><b>电脑水平：</b>{dataAbi.computer}</span>
             </div>
             <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
               <span><b>英文水平：</b>{dataAbi.English}</span>
             </div>
             <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
               <span><b>显微镜：</b>{dataAbi.microscope}</span>
             </div>
             <div>
               <span><b>目检：</b>{dataAbi.measure}</span>
             </div>
           </div>
           <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
           <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
               <span><b>眼科疾病：</b>{dataAbi.eyeIllness}</span>
             </div>
             <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
               <span><b>组装：</b>{dataAbi.assemble}</span>
             </div>
             <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
               <span><b>焊接：</b>{dataAbi.welding}</span>
             </div>
             <div>
               <span><b>化学品使用：</b>{dataAbi.chemi}</span>
             </div>
           </div>
           <div className='sm-wrap' style={{width:'30%',height:'auto',float:'left'}}>
           <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
               <span><b>自动化机台：</b>{dataAbi.autoTool}</span>
             </div>
             <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
               <span><b>包装：</b>{dataAbi.package}</span>
             </div>
             <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
               <span><b>手动贴（夹）物料：</b>{dataAbi.material}</span>
             </div>
             <div>
               <span><b>视力：</b>{dataAbi.sight}</span>
             </div>
            
           </div>
           <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>
           <hr/>
            <h3>1.请描述一下你上一份工作的工作时间及薪资福利情况。</h3>
              <p>{discription.length>0?discription[5].C3_618313028667:null}</p>
            <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>

            <h3>2.请描述一下你理想中的工作。</h3>
            <p>{discription.length>0?discription[4].C3_618313028667:null}</p>
            <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>

            <h3>3.请描述一下你对新工作的期望和要求。</h3>
            <p>{discription.length>0?discription[3].C3_618313028667:null}</p>
            <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>

            <h3>4.工作环境、薪资福利、个人发展、工作地点，请根据那你的重视程度，由高到低进行排序。</h3>
            <p>{discription.length>0?discription[2].C3_618313028667:null}</p>
            <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>

            <h3>5.你了解的菲尼萨是一家什么样的公司？</h3>
            <p>{discription.length>0?discription[1].C3_618313028667:null}</p>
            <div className='clearfix' style={{clear:'both',marginBottom: '32px'}}></div>

            <h3>6.你计划在菲尼萨公司工作多久？未来什么原因会促使你从菲尼萨公司离职？</h3>
            <p>{discription.length>0?discription[0].C3_618313028667:null}</p>
            </div>
          </div>
          </Spin>
          {/* </div> */}
        </div>
         
        <TableData
          resid={628007834561}
          hasModify={false}
          hasDelete={false}
          hasAdd={false}
          baseURL = 'http://kingofdinner.realsun.me:1201/'
          subtractH={190}
          hasRowDelete={false}
          hasRowModify={false}
          hasRowView={false}
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Button
                  onClick={() => {
                    this.showHidden(record);
                  }}
                >
                  预览打印
                </Button>
              );
            }
          ]}
        />
       
      </div>
    );
  }
}

export default DLPrint;
