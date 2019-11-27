import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, message, Modal ,Icon,Table} from 'antd';
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
      width:'30%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
    },
    {
      title: '工作单位',
      dataIndex: 'unit',
      key: 'unit',
      width:'30%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
    },
    {
      title: '担任职务',
      dataIndex: 'job',
      key: 'job',
      width:'10%',
      render: (text, record) =>{
       return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
      }
    },
    {
      title: '直接上级',
      dataIndex: 'supervisor',
      key: 'supervisor',
      width:'10%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
    },
    {
      title: '上级职务',
      dataIndex: 'supervisorJob',
      key: 'supervisorJob',
      width:'10%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
  
    },
    {
      title: '离职原因',
      dataIndex: 'leaveReason',
      key: 'leaveReason',
      width:'10%',
      render: (text, record) =>{
        return( <p style={{width:'100%',wordBreak:'break-all',whiteSpace:'normal'}}>{text}</p>)
       }
    }]
class DLPrint extends React.Component {
  constructor(props) {
    super(props);
    
  }
  state={
    showPrint:false,
    data:{},
    famRelation:[{
      key: '1',
      name: '张三',
      relation: '父亲',
      job:'会计',
      address: '上海市宝山区杨泰二村50号601室',
      phone:'15121176722'
    }],
    emergency:[{
      key: '1',
      name: '张三',
      relation: '父亲',
      job:'会计',
      address: '上海市宝山区杨泰二村50号601室',
      phone:'15121176722'
    }],
    EduInfo:[{
      time:'2019-08-10至2019-12-12',
      school:'无锡蓝翔职业技术学院',
      major:'生命科学技术',
      education:'本科',
      proof:'是',
      eduType:'统招'
    }],
    WkInfo:[{
      time:'2019-08-10至2019-12-12',
      unit:'上海李章智能科技有限公司',
      job:'前端开发',
      supervisor:'王二狗',
      supervisorJob:'高级经理',
      leaveReason:'正常离职'
    }],
    sign:[]
  }
  showHidden=async(v)=>{
    console.log(v)
    this.setState({
      showPrint:true,
      data:v
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
    // 获取学历信息
    try {
      let res = await http().getTable({
        resid:617195073738,
        cmswhere:`ID='${v.ID}'`
      });
     
      console.info('ARR',arr)
    } catch (error) {
      console.log(error)
    }
  } 
  handlePrint = () => {
    // 打印
    const bodyHtml = window.document.body.innerHTML;

    var footstr = "</body>";
     var newstr = document.getElementById('toPrint').innerHTML;
     var style='';
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
    const { data ,sign} = this.state;
    return (
      <div
        className="table-data-wrap"
        style={{ height: '100vh' }}
      >
        
        <div className={this.state.showPrint?'viewPrint':'hidden'}>
        <Button type='primary' className='printBtn' onClick={this.handlePrint}>打印</Button>
          <Icon className='clz' type="close-circle" onClick={()=>this.setState({showPrint:false})}/>
          <div id='toPrint'>
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
              <div>
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
              <div>
                <span><b>工作年限：</b>{data.seniority}</span>
              </div>
              <div>
                <span><b>职业：</b>{data.job}</span>
              </div>
            </div>
            <div className='clearfix'></div>

            <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>身高(cm)：</b>{data.height}</span>
              </div>
              <div>
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
              <div>
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
              <div>
                <span><b>民族：</b>{data.naition}</span>
              </div>
             
            </div>
            <div className='clearfix'></div>

            <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>家庭住址：</b>{data.homeDetailAddress}</span>
              </div>
              <div>
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
              <div>
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
              <div>
                <span><b>暂住邮编：</b>{data.postcode}</span>
              </div>
              <div>
                <span><b>到岗日期：</b>{data.entryTime}</span>
              </div>
            </div>
            <div className='clearfix'></div>
            <hr/>
            <h3>学历信息</h3>
            <Table style={{marginTop:'16px',marginBottom:'16px'}} columns={columnsEdu} dataSource={this.state.EduInfo} size={'small'} bordered pagination={false}/>
            <hr/>
            <h3>工作经历 <i style={{float:'right'}}>{data.hasJob}</i></h3>
            <Table style={{marginTop:'16px',marginBottom:'16px'}} columns={columnsWk} dataSource={this.state.WkInfo} size={'small'} bordered pagination={false}/>
            <hr/>
            <h3>家庭关系</h3>
            <Table style={{marginTop:'16px',marginBottom:'16px'}} columns={columns} dataSource={this.state.famRelation} size={'small'} bordered pagination={false}/>
            <hr/>
            <h3>紧急联络人</h3>
            <Table style={{marginTop:'16px',marginBottom:'16px'}} columns={columns} dataSource={this.state.emergency} size={'small'} bordered pagination={false}/>
            <hr/>
            
            <h3>其他信息</h3>
           
            <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>工伤：</b>{data.injury}</span>
              </div>
              <div>
                <span><b>慢性病：</b>{data.chroDise}</span>
              </div>
            </div>
            <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
              <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
                <span><b>身体状况：</b>{data.health}</span>
              </div>
              <div>
                <span><b>愿意穿防尘服、防静电服：</b>{data.suit}</span>
              </div>
            </div>
            <div className='sm-wrap' style={{width:'30%',height:'auto',float:'left'}}>
              <div>
                <span><b>愿意看显微镜：</b>{data.microscope}</span>
              </div>
             
            </div>
            <div className='clearfix'></div>

            <hr/>

            <h3>能力指标自我评价</h3>
           
           <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
             <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
               <span><b>电脑水平：</b>{data.computer}</span>
             </div>
             <div>
               <span><b>英文水平：</b>{data.English}</span>
             </div>
             <div>
               <span><b>显微镜：</b>{data.microscope}</span>
             </div>
             <div>
               <span><b>目检：</b>{data.measure}</span>
             </div>
           </div>
           <div className='sm-wrap' style={{width:'30%',marginRight:'5%',height:'auto',float:'left'}}>
           <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
               <span><b>眼科疾病：</b>{data.eyeIllness}</span>
             </div>
             <div>
               <span><b>组装：</b>{data.assemble}</span>
             </div>
             <div>
               <span><b>焊接：</b>{data.welding}</span>
             </div>
             <div>
               <span><b>化学品使用：</b>{data.chemi}</span>
             </div>
           </div>
           <div className='sm-wrap' style={{width:'30%',height:'auto',float:'left'}}>
           <div style={{ width:'100%',height:'auto',lineHeight: '22px',marginBottom: '17px'}}>
               <span><b>自动化机台：</b>{data.autoTool}</span>
             </div>
             <div>
               <span><b>包装：</b>{data.package}</span>
             </div>
             <div>
               <span><b>手动贴（夹）物料</b>{data.material}</span>
             </div>
             <div>
               <span><b>视力：</b>{data.sight}</span>
             </div>
            
           </div>
           <div className='clearfix'></div>
           <hr/>
            <h3>1.请描述一下你上一份工作的工作时间及薪资福利情况。</h3>
            <p></p>
            <h3>2.请描述一下你理想中的工作。</h3>
            <p></p>
            <h3>3.请描述一下你对新工作的期望和要求。</h3>
            <p></p>
            <h3>4.工作环境、薪资福利、个人发展、工作地点，请根据那你的重视程度，由高到低进行排序。</h3>
            <p></p>
            <h3>5.你了解的菲尼萨是一家什么样的公司？</h3>
            <p></p>
            <h3>6.你计划在菲尼萨公司工作多久？未来什么原因会促使你从菲尼萨公司离职？</h3>
            <p></p>
            </div>
          </div>
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
