
import React, { Component } from 'react';
import './PhysicalExamination.less';
import http from 'Util20/api';
import {
  Button,
  Icon,
  Modal,
  Spin,
  Upload
} from 'antd';
class PhysicalExamination extends React.Component {
  state = {
    hosName:'',
	imgUrl:'',
    address:'',
    phone1:'',
    phone2:'',
    traffic:'',
    traffic2:'',
    traffic3:'',
	loading:false

  };

 
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
  onPrinting = () => {
    const bodyHtml = window.document.body.innerHTML;

     var footstr = "</body>";
     var newstr = document.getElementById('toPrint').innerHTML;
     var headstr = "<html><head><title></title></head><body>";
     document.body.innerHTML = headstr + newstr + footstr;
     window.print();
    window.document.body.innerHTML = bodyHtml;
    window.location.reload();
  };

  handlechange(key,val,ref){

        this.setState({
            [key]:val.target.value   
        })
        // 解决radio打印不出选中项的问题
        if(ref){
          if(document.getElementById(ref).checked==true){
            document.getElementById(ref).defaultChecked=true
          }else{
            document.getElementById(ref).defaultChecked=false
          }
        }

    }
	getData = async(ID) =>{
		this.setState({loading:true});
		let res;
		try {
		  res = await http().getTable({
			resid: 623152957838,
		  });
		  console.log('体检',res);
		  this.setState({
			  hosName:res.data[0].hospital,
			  imgUrl:res.data[0].picUrl,
			  address:res.data[0].address,
			  phone1:res.data[0].tel,
			  phone2:res.data[0].tel2,
			  traffic:res.data[0].traffic,
			  traffic2:res.data[0].traffic2,
			  traffic3:res.data[0].traffic3,
			  REC_ID:res.data[0].REC_ID
		  })
		  this.setState({loading:false});
		} catch (error) {
		  console.log(error);
		  this.setState({loading:false});
		}
	  }
	 subData = async(ID) =>{

		 this.setState({loading:true});
	 	let res;
	 	try {
	 	  res = await http().modifyRecords({
	 		resid: 623152957838,

			data:[{
				REC_ID:this.state.REC_ID,
			 hospital:this.state.hosName,
			 picUrl:this.state.imgUrl,
			 address:this.state.address,
			 tel:this.state.phone1,
			 tel2:this.state.phone2,
			 traffic:this.state.traffic,
			traffic2:this.state.traffic2,
			traffic3:this.state.traffic3,}]
	 	  });
		  this.setState({loading:false});
		  Modal.success({
		    title: '提交成功',
		    content: ''
		  });
	 	  
	 	} catch (error) {
			Modal.error({
			  title: '提示',
			  content: error.message
			});
	 	  console.log(error);
	 	}
	   } 
	  
  componentDidMount(){
    this.getData();
	

  }
  imgUp(e){
	  this.setState({imgfile:e});
	  
	  let files = e.target.files || e.dataTransfer.files;
	  
	  if (!files.length) return;
	  let type = files[0].type; //文件的类型，判断是否是图片
	  let size = files[0].size; //文件的大小，判断图片的大小
	  // if (this.imgCropperData.accept.indexOf(type) == -1) {
	  
	  // alert("请选择我们支持的图片格式！");
	  
	  // return false;
	  
	  // }
	  if (size > 5242880) {
	  alert("请选择5M以内的图片！");
	  return false;
	  }
	  this.setState({loading:true})
	  this.uploadFile(files[0], `http://kingofdinner.realsun.me:1201/api/AliyunOss/PutOneImageObject?bucketname=nutritiontower&srctype=${type[1]}`,"cloud").then((result) =>{
	      this.setState({loading:false,imgUrl:result})
		
	  }, (err) => {
	      //图片上传异常！
	      this.setState({loading:false})
	  

	  })   
  }
  render() {
    return (
      <div className='PE'>
	  <Spin spinning={this.state.loading}>
        <div className='buttonLine'>
          <Button onClick={this.onPrinting}>打印</Button>
          <Button onClick={this.subData} type='primary'>提交</Button>
		  <div className='file ant-btn' style={{marginTop:'12px',float:'right',marginRight:'16px'}}>
		  <input id="ss" name="ss" type="file" onChange={v=>{this.imgUp(v)}} accept='image' /> 
			点击替换图片
		  </div>

		</div>
        <div class='wrap'>
          <div id='toPrint'>

          <rect style={{display:'block',width:'100%',height:'1020px'}}>
            <h4 style={{fontSize:'20px'}}>无锡本地体检</h4>
            <h3 style={{fontSize:'24px',textAlign:'center',marginBottom:'24px'}}>
            <input style={{textAlign:'center',fontSize:'24px',width:'auto',fontWeight:'bold',border:'none'}} onChange={v=>{this.handlechange("hosName",v)}} value={this.state.hosName}/>
            </h3>
			<div style={{width:'100%',textAlign:'center'}}>,
			 
            <img src={this.state.imgUrl?this.state.imgUrl:'http://iph.href.lu/200x200?"点击上传图片"'} style={{cursor:'pointer',background:'#dcdcdc',minwidth:'50px',filter:'grayscale(100%)',height:'364px',marginBottom:'16px',marginTop:'8px'}}/>
            </div>
			<p style={{margin:0,fontSize:'16px',width:'100%',padding:'24px',boxSizing:'border-box'}}>请您提前打电话到医院预约体检日期，报个人信息和医院说明是菲尼萨新员工入职体检。体检费用由个人进行垫付，请医院开具发票，在入职后进行报销。体检报告无需自取，体检后2~3天医院会直接给公司。<br/><br/><b>注：早晨空腹体检</b></p>
            <div style={{height:'24px',borderTop:'1px dashed #000',width:'calc(100% - 48px)',marginLeft:'24px'}}></div>
            <b style={{fontSize:'16px',marginLeft:'24px'}}>地址：</b><input style={{fontSize:'16px',width:'400px',border:'none'}} value={this.state.address} onChange={v=>{this.handlechange("address",v)}}/>
            <div style={{height:'16px',width:'100%'}}></div>
            <b style={{fontSize:'16px',marginLeft:'24px'}}>电话：</b>
            <input style={{fontSize:'16px',width:'200px',border:'none'}} onChange={v=>{this.handlechange("phone1",v)}} value={this.state.phone1}/>
            <input style={{fontSize:'16px',width:'200px',border:'none'}} onChange={v=>{this.handlechange("phone2",v)}} value={this.state.phone2}/>
            <div style={{height:'16px',width:'100%'}}></div>
            <b style={{fontSize:'16px',marginLeft:'24px'}}>交通：</b>
            <div style={{height:'16px',width:'100%'}}></div>
            <input style={{fontSize:'16px',marginLeft:'56px',width:'calc(100% - 56px)',border:'none'}} onChange={v=>{this.handlechange("traffic",v)}} value={this.state.traffic}/>


            <div style={{height:'16px',width:'100%'}}></div>
            <input style={{fontSize:'16px',marginLeft:'56px',width:'calc(100% - 56px)',border:'none'}} onChange={v=>{this.handlechange("traffic2",v)}} value={this.state.traffic2}/>

            <div style={{height:'16px',width:'100%'}}></div>
            <input style={{fontSize:'16px',marginLeft:'56px',width:'calc(100% - 56px)',border:'none'}} onChange={v=>{this.handlechange("traffic3",v)}} value={this.state.traffic3}/>



          </rect>
          <rect style={{display:'block',width:'100%'}}>
            <h4 style={{fontSize:'20px'}}>异地体检</h4>
            <p style={{margin:0,fontSize:'16px',width:'100%',padding:'24px',boxSizing:'border-box'}}>如您居住在外地，请您到当地公办三级甲等医院办理入职体检。体检费用由个人进行垫付，请医院开具发票，在入职后进行报销。体检报告需要有医生的体检总结建议和医院公章。拿到体检报告请邮件回复并上传体检信息。<br/><br/><b>注：早晨空腹体检</b></p>
            <h3 style={{fontSize:'16px',marginBottom:'24px'}}>检查项列表如下图:</h3>
            <table border="1" style={{width:'100%'}}>
              <tr>
                <th colspan="6" style={{textAlign:'center',lineHeight:'24px',fontSize:'16px'}}>菲尼萨光电通讯科技（无锡）有限公司入职体检项目</th>
              </tr>
              <tr>
                <th style={{textAlign:'center',width:'40%'}} colspan="2">体检项目</th>
                <th style={{textAlign:'center',width:'36%'}}>临床意义</th>
                <th style={{textAlign:'center',width:'8%'}}>男性</th>
                <th style={{textAlign:'center',width:'8%'}}>女未婚</th>
                <th style={{textAlign:'center',width:'8%'}}>女已婚</th>
              </tr>
              <tr>
                <td style={{padding:'4px'}}>一般检查</td>
                <td style={{padding:'4px'}}>身高、体重、体重指数（BMI） 血压（BP）、脉搏（P）</td>
                <td style={{padding:'4px'}}>体重是否正常，有无体重不足、超重或肥胖；有无血压脉搏异常等</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px'}}>内科</td>
                <td style={{padding:'4px'}}>心、肺听诊，腹部触诊</td>
                <td style={{padding:'4px'}}>心肺有无异常   肝脾有无肿大、腹部有无包块等</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px'}}>外科</td>
                <td style={{padding:'4px'}}>浅表淋巴结，甲状腺、乳房、脊柱、四肢、外生殖器、前列腺、皮肤、肛肠指检等</td>
                <td style={{padding:'4px'}}>淋巴结有无肿大，甲状腺、乳房、外生殖器、前列腺、肛肠有无异常、四肢脊柱有无畸形等</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px'}} rowspan="2">眼科</td>
                <td style={{padding:'4px'}}>视力</td>
                <td style={{padding:'4px'}}>视力是否正常</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px'}}>外眼、色觉</td>
                <td style={{padding:'4px'}}>检查眼角膜和晶状体有无病变（如白内障）</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px'}}>耳鼻喉科</td>
                <td style={{padding:'4px'}}>耳鼻喉检查</td>
                <td style={{padding:'4px'}}>耳、鼻、咽（如中耳炎、鼓膜穿孔、扁桃体肿大）有无异常等</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px'}}>心电图</td>
                <td style={{padding:'4px'}}>十二导心电图</td>
                <td style={{padding:'4px'}}>用于心律失常（如早搏、传导障碍等）、心肌缺血、心肌梗塞、心房、心室肥大等诊断</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px'}}>血常规23项</td>
                <td style={{padding:'4px'}}>白细胞（WBC）、淋巴细胞比率（Lym%）、单核细胞比率（MONO%）等</td>
                <td style={{padding:'4px'}}>可提示：小细胞性贫血，巨幼细胞贫血，恶性贫血，再生障碍性贫血，溶血性贫血，白血病，粒细胞减少，血小板减少，淋巴细胞减少，感染等。</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px'}}>肝功能2项</td>
                <td style={{padding:'4px'}}>谷丙转氨酶（ALT)<hr/>谷草转氨酶（AST)</td>
                <td style={{padding:'4px'}}>是肝细胞受损最敏感的指标，升高可提示肝胆系统疾病：如急性传染性肝炎、中毒性肝炎、药物中毒性肝炎等</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px'}} rowspan="2">血脂2项</td>
                <td style={{padding:'4px'}}>总胆固醇(TC)</td>
                <td style={{padding:'4px'}}>脂肪肝，胆管炎，胆囊炎，药物中毒性肝炎，酒精性肝炎和黄疸等</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px'}}>甘油三脂（TG）</td>
                <td style={{padding:'4px'}}>血脂升高是导致高血压、冠心病、心肌梗塞、动脉粥样硬化的高度危险因素</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px',height:'95px'}}>肾功能3项</td>
                <td style={{padding:'4px'}}>尿素氮、肌酐、尿酸</td>
                <td style={{padding:'4px'}}>可提示：嘌呤代谢有无异常如高尿酸血症、痛风及肾脏功能损害</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>

              <tr>
                <td style={{padding:'4px'}}>血糖</td>
                <td style={{padding:'4px'}}>空腹血糖</td>
                <td style={{padding:'4px'}}>从血糖水平了解是否有低血糖、糖尿病.了解血糖控制情况等</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px'}}>尿常规14项</td>
                <td style={{padding:'4px'}}>颜色、透明度、酸碱度、红细胞、白细胞、上皮细胞、管型、蛋白质、比重、尿胆原、胆红素、亚硝酸盐、隐血、酮体</td>
                <td style={{padding:'4px'}}>可提示有无泌尿系统疾患：如急、慢性肾炎，肾盂肾炎，膀胱炎，尿道炎，肾病综合征，狼疮性肾炎，血红蛋白尿，肾梗塞、肾小管重金属盐及药物导致急性肾小管坏死，肾或膀胱肿瘤以及有无尿糖等</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px'}}>全数字X光检查（DR）</td>
                <td style={{padding:'4px'}}>胸部正位检查</td>
                <td style={{padding:'4px'}}>有无肺炎、肺气肿、肺结核、肺癌及心脏、主动脉、纵膈、横膈疾病等</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
              <tr>
                <td style={{padding:'4px'}} colspan="2">尿妊娠实验（HCG)</td>
                <td style={{padding:'4px'}}>早孕诊断：受孕10天尿中即可检出；检出葡萄胎、绒癌时，尿中HCG显著提高。</td>
                <td style={{textAlign:'center'}}>✕</td>
                <td style={{textAlign:'center'}}>✓</td>
                <td style={{textAlign:'center'}}>✓</td>
              </tr>
            </table>

          </rect>
          </div>
        </div>
		</Spin>
      </div>
    );
  }
}

export default PhysicalExamination;
