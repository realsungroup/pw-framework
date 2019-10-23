import React, { Component } from 'react';
import {
  Button,
  Icon,
  Select,
  Modal,
  Spin,
  message
} from 'antd';
import './InterviewAssessment.less';
import http from '../../../util20/api';
import debounce from 'lodash/debounce';
const { Option } = Select;
const { confirm } = Modal;
class InterviewAssessment extends React.Component {
  constructor() {
    super();
    this.handleSearch = debounce(this.handleSearch, 800);

    this.state = {
        userChara:'',
        data:[
        ],
        name:'',
        position:'',
        level:'',
        hiringManger:'',
        interviewer:'',
        interviewer2:'',
        chara:'T1/T2/T3/T4',
        eduOther:'',
        graFrom:'',
        workExp:'',
        wkOther:'',
        groupInter:'',
        p4r:'',
        hiOther:'',
        secRound:'',
        eduBack:'',
        wkExp:'',
        lanSki:'',
        SRI:'',
        GHB:'',

        vIT:'',
        vLA:'',
        vCF:'',
        vDR:'',

        // T1
        vTS:'',
        vEA:'',
        vTE:'',
        vAO:'',
        vPS:'',
        vSd:'',
        vLF:'',
        // T5
        vTS2:'',
        vTO:'',
        vTD:'',
        vTE2:'',
        vCr:'',
        vSA:'',
        vPrA:'',
        // T6
        vTS3:'',
        vTO2:'',
        vTC:'',
        vTE3:'',
        vDwA:'',
        vIM:'',
        vStrA:'',
        //S5
        vTS4:'',
        vAO2:'',
        vPS2:'',
        vSd2:'',
        vLF2:'',
        //S6
        vTS5:'',
        vAO3:'',
        vPS3:'',
        vDO:'',
        vCDR:'',
        //S9
        vTS6:'',
        vDevO:'',
        vPlan:'',
        vOrg:'',
        vPriS:'',
        vMMW:'',
        // S10
        vTS7:'',
        vvBET:'',
        vPM:'',
        vMoOt:'',
        vCM:'',
        //tech
        vTS8:'',
        vPreSk:'',
        vProSol:'',
        vPeRe:'',
        vAcOr:'',
        //Fresh
        vTS9:'',
        vcrea:'',
        vPresentSkill:'',
        vProblemSol:'',
        vPeerRel:'',
        vPersonaLe:'',
        //复试
        round2:false

    }
  }

showConfirm = () => {
  confirm({
    title: 'Are you sure to return this form?',
    onOk:() => {
      this.fightBack();
    },
    onCancel() {},
    okText:'YES',
    cancelText:'NO'
  });
}

showConfirmMail = () => {
  confirm({
    title: 'Are you sure to send a mail ?',
    onOk:() => {
      return this.sendMail();
    },
    onCancel() {},
    okText:'YES',
    cancelText:'NO'
  });
}
// 无需复试直接通过
endStream =()=>{
  confirm({
    title: 'Are you sure that THIS PERSON NEED NOT ATTENDING A REEXAMINE?',
    onOk:() => {
        this.warp();
    },
    onCancel() {},
    okText:'YES',
    cancelText:'NO'
  });
}
warp=async()=>{
  try {
    let res = await http().modifyRecords({
      resid: 613152706922,
      cmswhere: `REC_ID=${this.props.record.REC_ID}`,
      data:[{
         REC_ID:this.props.record.REC_ID,
         C3_622921647557:'已完成',
      }]
    });

    this.setState({loading:false});

    Modal.success({
      title: 'Done!',
      content: '',
      onOk() {
        window.location.reload();
      },
      okText:'YES'
    });


  } catch (err) {
    Modal.error({
      title: 'Alert!',
      content: err.message,
      okText:'YES'
    });
    this.setState({loading:false});

  }

}
subConfirm = () => {
  // 验证
  var bol=true;
  var str='';
  if(!this.state.level){
     bol=false;
     str+='level';
  }
  if(!this.state.hiringManger){
     bol=false;
     str+='hiringManger';

  }
  if(!this.state.interviewer){
     bol=false;
     str+='interviewer';

  }
  if(!this.state.graFrom){
     bol=false;
     str+='graFrom';

  }

  if(!this.state.eduBack){
     bol=false;
     str+='eduBack';

  }
  if(!this.state.workExp){
     bol=false;
     str+='workExp';

  }
  if(!this.state.lanSki){
     bol=false;
     str+='lanSki';

  }
  if(!this.state.wkExp){
     bol=false;
     str+='wkExp';

  }
  if(!this.state.vIT){
     bol=false;
     str+='vIT';


  }
  if(!this.state.vLA){
     bol=false;
     str+='vLA';

  }
  if(!this.state.vCF){
     bol=false;
     str+='vCF';

  }
  if(!this.state.vDR){
     bol=false;
     str+='vDR';

  }
  if(!this.state.groupInter){
     bol=false;
     str+='groupInter';

  }
  if(!this.state.vDR){
     bol=false;
     str+='vDR';

  }
  if(!this.state.GHB){
     bol=false;
     str+='GHB';

  }
  if(!this.state.date){
     bol=false;
     str+='date';

  }

  // 复试
  if(this.state.round2=='Y'){
    if(!this.state.SRI){
       bol=false;
    }
    if(!this.state.date2){
       bol=false;
    }
  }

  if(this.state.chara=='T1/T2/T3/T4'){
    if(!this.state.vTS){
      bol=false;
    }
    if(!this.state.vEA){
      bol=false;
    }
    if(!this.state.vTE){
      bol=false;
    }
    if(!this.state.vAO){
      bol=false;
    }
    if(!this.state.vPS){
      bol=false;
    }
    if(!this.state.vSd){
      bol=false;
    }
    if(!this.state.vLF){
      bol=false;
    }
  }

  if(this.state.chara=='T5'){
    if(!this.state.vTS2){
      bol=false;
    }
    if(!this.state.vTO){
      bol=false;
    }
    if(!this.state.vTD){
      bol=false;
    }
    if(!this.state.vTE2){
      bol=false;
    }
    if(!this.state.vCr){
      bol=false;
    }
    if(!this.state.vSA){
      bol=false;
    }
    if(!this.state.vPrA){
      bol=false;
    }
  }

  if(this.state.chara=='T6'){
    if(!this.state.vTS3){
      bol=false;
    }
    if(!this.state.vTO2){
      bol=false;
    }
    if(!this.state.vTC){
      bol=false;
    }
    if(!this.state.vTE3){
      bol=false;
    }
    if(!this.state.vDwA){
      bol=false;
    }
    if(!this.state.vIM){
      bol=false;
    }
    if(!this.state.vStrA){
      bol=false;
    }
  }

  if(this.state.chara=='S5/S6/Sr.Specialist'){
    if(!this.state.vTS4){
      bol=false;
    }
    if(!this.state.vAO2){
      bol=false;
    }
    if(!this.state.vPS2){
      bol=false;
    }
    if(!this.state.vSd2){
      bol=false;
    }
    if(!this.state.vLF2){
      bol=false;
    }
  }

  if(this.state.chara=='S6/Supervisor/S7/S8/T4/ManagerI'){
    if(!this.state.vTS5){
      bol=false;
    }
    if(!this.state.vAO3){
      bol=false;
    }
    if(!this.state.vPS3){
      bol=false;
    }
    if(!this.state.vDO){
      bol=false;
    }
    if(!this.state.vCDR){
      bol=false;
    }
  }

  if(this.state.chara=='S9/T5/ManagerII'){
    if(!this.state.vTS6){
      bol=false;
    }
    if(!this.state.vDevO){
      bol=false;
    }
    if(!this.state.vPlan){
      bol=false;
    }
    if(!this.state.vOrg){
      bol=false;
    }
    if(!this.state.vPriS){
      bol=false;
    }
    if(!this.state.vMMW){
      bol=false;
    }
  }

  if(this.state.chara=='S10/T6/Sr.Manager'){
    if(!this.state.vTS7){
      bol=false;
    }
    if(!this.state.vBET){
      bol=false;
    }
    if(!this.state.vPM){
      bol=false;
    }
    if(!this.state.vMoOt){
      bol=false;
    }
    if(!this.state.vCM){
      bol=false;
    }
    if(!this.state.vDQ){
      bol=false;
    }
  }

  if(this.state.chara=='Technician'){
    if(!this.state.vTS8){
      bol=false;
    }
    if(!this.state.vPreSk){
      bol=false;
    }
    if(!this.state.vProSol){
      bol=false;
    }
    if(!this.state.vPeRe){
      bol=false;
    }
    if(!this.state.vAcOr){
      bol=false;
    }
  }

  if(this.state.chara=='应届生'){
    if(!this.state.vTS9){
      bol=false;
    }
    if(!this.state.vcrea){
      bol=false;
    }
    if(!this.state.vPresentSkill){
      bol=false;
    }
    if(!this.state.vProblemSol){
      bol=false;
    }
    if(!this.state.vPeerRel){
      bol=false;
    }
    if(!this.state.vPersonaLe){
      bol=false;
    }
  }

  if(bol==true){
    confirm({
      title: 'Are you sure to submit?',
      onOk:() => {
          this.subData();
      },
      onCancel() {},
      okText:'YES',
      cancelText:'NO'
    });
  }else{
    confirm({
      title: 'You still have something to fill in!'+this.state.chara,
      onOk(){
      },
      onCancel() {},
      okText:'YES',
      cancelText:'NO'
    });
  }


}
handleChangeS=(value,obj)=>{
  console.log(this.state.postID)
  this.setState({
      value,
      data:[],
      postName:obj.props.children,
      postID:value,
      fetching: false,
    });
}
  handleSearch = async (value) => {
    if (value) {
      // this.getF(value);

      this.setState({fetching:true});

      let res;
      try {
        res = await http().getTable({
          resid: 623153143463,
          key:value
        });
        console.log(res)
        const data =res.data.map(data => ({
                  text: `${data.C3_421886426562}`,
                  value: data.C3_305737857578,
                }));

                  this.setState({ data, fetching: false });
      }catch (err) {
        Modal.error({
          title: 'Alert!',
          content: err.message,
          okText:'YES'
        });
        this.setState({fetching:false});

      }


      // fetch(value, data => this.setState({ data }));
    } else {
      this.setState({ data: [] });
    }
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
  componentDidMount(){
    var usrChara = localStorage.getItem('userInfo');
    usrChara=JSON.parse(usrChara)
    usrChara=usrChara.UserInfo.GroupList;
    var arr=[];
    var n=0;
    var bol=false;
    var str='';
    while(n<usrChara.length){
      if(usrChara.slice(n, n+1)=="\'"){

        if(bol==true){
          bol=false;
          arr.push(str);
          str='';
        }else{
          bol=true;
        }
      }
      if(bol==true){
        str+=usrChara.slice(n+1, n+2)
      }
      n++;
    }
// 判别hr角色
var hrCode='623876215000';
    // var hrCode='demo';
    n=0;
    this.setState({userChara:'others'});

    while(n<arr.length){
      var j=hrCode+"\'"
      if(j==arr[n]){
        this.setState({userChara:'HR'});
      }
      n++;
    }
    // 获取面试官名单
    // 623153143463
    // this.getF();
}


  getInfo = async (resid,id,id2) => {
    this.setState({loading:true});

    let res;
    try {
      res = await http().getTable({
        resid: resid,
        cmswhere: `REC_ID=${id}`
      });

      this.setState({
        progress:'未送邮（初试）',
        eduBack:res.data[0].edBackground,
        eduOther:res.data[0].eduOther,//缺
        level:res.data[0].leveleInterviewee,
        hiringManger:res.data[0].hireManager,
        graFrom:res.data[0].graduateForm,
        workExp:res.data[0].workExperise,
        wkExp:res.data[0].wkExp,//缺
        wkOther:res.data[0].wkOther,//缺
        lanSki:res.data[0].languageSkill,
        vTS:res.data[0].tecSkills,
        vTS2:res.data[0].tecSkills,
        vTS3:res.data[0].tecSkills,
        vTS4:res.data[0].tecSkills,
        vTS5:res.data[0].tecSkills,
        vTS6:res.data[0].tecSkills,
        vTS9:res.data[0].tecSkills,
        vTS8:res.data[0].tecSkills,
        vTS7:res.data[0].tecSkills,
        vEA:res.data[0].executiveAbility,
        vTE:res.data[0].tecExchange,
        vAO:res.data[0].actionOriented,
        vPS:res.data[0].problemSloving,
        vSd:res.data[0].selfDevelopment,
        vLF:res.data[0].learnOnfly,
        vTO:res.data[0].tecOutLook,
        vTD:res.data[0].tecDecomposition,
        vTE2:res.data[0].tecExchange,
        vCr:res.data[0].creativity,
        vSA:res.data[0].standingAlone,
        vPrA:res.data[0].prioritySetting,
        vTC:res.data[0].tecConstruct,
        vTO2:res.data[0].tecOutLook,
        vTE3:res.data[0].tecExchange,
        vDwA:res.data[0].dealWithAug,
        vIM:res.data[0].innovationMange,
        vStrA:res.data[0].strategicAgility,
        vAO2:res.data[0].actionOriented,
        vPS2:res.data[0].problemSloving,
        vSd2:res.data[0].selfDevelopment,
        vLF2:res.data[0].learnOnfly,
        vAO3:res.data[0].actionOriented,
        vPS3:res.data[0].problemSloving,
        vDO:res.data[0].direcOhters,
        vDevO:res.data[0].developOthers,
        vPlan:res.data[0].planning,
        vCDR:res.data[0].confrontDirReports,
        vPriS:res.data[0].prioritySetting,
        vMMW:res.data[0].managerAndMeasure,
        vBET:res.data[0].buildEffictive,
        vPM:res.data[0].processManagement,
        vMoOt:res.data[0].mottivateingOthers,
        vCM:res.data[0].conflictManagement,
        vDQ:res.data[0].decisionQuality,
        vPreSk:res.data[0].presentationSkills,
        vProSol:res.data[0].problemSloving,
        vPeRe:res.data[0].peerRelation,
        vAcOr:res.data[0].actionOriented,
        vcrea:res.data[0].creativity,
        vPresentSkill:res.data[0].presentationSkills,
        vProblemSol:res.data[0].problemSloving,
        vPeerRel:res.data[0].peerRelation,
        vPersonaLe:res.data[0].personlearning,//缺
        vIT:res.data[0].intergintyTrust,
        vLA:res.data[0].learning,
        vCF:res.data[0].customerFocus,
        vDR:res.data[0].driveResults,
        groupInter:res.data[0].groupComments,
        p4r:res.data[0].propsRetrial,
        GHB:res.data[0].groupDecision,
        secRound:res.data[0].secondRound,
        SRI:res.data[0].SRI,//缺
        interviewer:res.data[0].interviewer,
        interviewer2:res.data[0].secondRoundInterviewer,
        round2:res.data[0].isSecondRound,
        isBack:res.data[0].isBack,
        date:res.data[0].date,//缺
        date2:res.data[0].secondRoundDate,
        chara:res.data[0].accessCategority,
        C3_622921647557:res.data[0].C3_622921647557

      })

      console.log(res)
      if(res.data[0].edBackground){
        document.getElementById(res.data[0].edBackground).defaultChecked=true;

      }
      if(res.data[0].edBackground){
        document.getElementById(res.data[0].edBackground).defaultChecked=true;

      }
      if(res.data[0].wkExp){
        document.getElementById(res.data[0].wkExp).defaultChecked=true;

      }
      if(res.data[0].languageSkill){
        document.getElementById(res.data[0].languageSkill).defaultChecked=true;

      }
      if(res.data[0].tecSkills){
        document.getElementById('vTS'+res.data[0].tecSkills).defaultChecked=true;
        document.getElementById('vTS'+(5+Number(res.data[0].tecSkills))).defaultChecked=true;
        document.getElementById('vTS'+(10+Number(res.data[0].tecSkills))).defaultChecked=true;
        document.getElementById('vTS'+(15+Number(res.data[0].tecSkills))).defaultChecked=true;
        document.getElementById('vTS'+(20+Number(res.data[0].tecSkills))).defaultChecked=true;
        document.getElementById('vTS'+(25+Number(res.data[0].tecSkills))).defaultChecked=true;
        document.getElementById('vTS'+(30+Number(res.data[0].tecSkills))).defaultChecked=true;

      }
      if(res.data[0].executiveAbility){
        document.getElementById('vEA'+res.data[0].executiveAbility).defaultChecked=true;

      }
      if(res.data[0].tecExchange){
        document.getElementById('vTE'+res.data[0].tecExchange).defaultChecked=true;
        document.getElementById('vTE'+(5+Number(res.data[0].tecExchange))).defaultChecked=true;
        document.getElementById('vTE'+(10+Number(res.data[0].tecExchange))).defaultChecked=true;

      }
      if(res.data[0].actionOriented){
        document.getElementById('vAO'+res.data[0].actionOriented).defaultChecked=true;
        document.getElementById('vAO'+(5+Number(res.data[0].actionOriented))).defaultChecked=true;
        document.getElementById('vAO'+(10+Number(res.data[0].actionOriented))).defaultChecked=true;

      }
      if(res.data[0].problemSloving){
        document.getElementById('vPS'+res.data[0].problemSloving).defaultChecked=true;
        document.getElementById('vPS'+(5+Number(res.data[0].problemSloving))).defaultChecked=true;
        document.getElementById('vPS'+(10+Number(res.data[0].problemSloving))).defaultChecked=true;

      }
      if(res.data[0].selfDevelopment){
        document.getElementById('vSd'+res.data[0].selfDevelopment).defaultChecked=true;
        document.getElementById('vSd'+(5+Number(res.data[0].selfDevelopment))).defaultChecked=true;

      }
      if(res.data[0].learnOnfly){
        document.getElementById('vLF'+res.data[0].learnOnfly).defaultChecked=true;
        document.getElementById('vLF'+(5+Number(res.data[0].learnOnfly))).defaultChecked=true;

      }
      if(res.data[0].tecOutLook){
        document.getElementById('vTO'+res.data[0].tecOutLook).defaultChecked=true;
        document.getElementById('vTO'+(5+Number(res.data[0].tecOutLook))).defaultChecked=true;

      }
      if(res.data[0].tecDecomposition){
        document.getElementById('vTD'+res.data[0].tecDecomposition).defaultChecked=true;

      }
      if(res.data[0].creativity){
        document.getElementById('vCr'+res.data[0].creativity).defaultChecked=true;

      }
      if(res.data[0].standingAlone){
        document.getElementById('vSA'+res.data[0].standingAlone).defaultChecked=true;

      }
      if(res.data[0].prioritySetting){
        document.getElementById('vPrA'+res.data[0].prioritySetting).defaultChecked=true;

      }
      if(res.data[0].tecConstruct){
        document.getElementById('vTC'+res.data[0].tecConstruct).defaultChecked=true;

      }
      if(res.data[0].dealWithAug){
        document.getElementById('vDwA'+res.data[0].dealWithAug).defaultChecked=true;

      }
      if(res.data[0].innovationMange){
        document.getElementById('vIM'+res.data[0].innovationMange).defaultChecked=true;

      }
      if(res.data[0].strategicAgility){
        document.getElementById('vStrA'+res.data[0].strategicAgility).defaultChecked=true;

      }
      if(res.data[0].direcOhters){
        document.getElementById('vDO'+res.data[0].direcOhters).defaultChecked=true;

      }
      if(res.data[0].developOthers){
        document.getElementById('vDevO'+res.data[0].developOthers).defaultChecked=true;

      }
      if(res.data[0].planning){
        document.getElementById('vPlan'+res.data[0].planning).defaultChecked=true;

      }
      if(res.data[0].confrontDirReports){
        document.getElementById('vCDR'+res.data[0].confrontDirReports).defaultChecked=true;

      }
      if(res.data[0].prioritySetting){
        document.getElementById('vPriS'+res.data[0].prioritySetting).defaultChecked=true;

      }
      if(res.data[0].managerAndMeasure){
        document.getElementById('vMMW'+res.data[0].managerAndMeasure).defaultChecked=true;

      }
      if(res.data[0].buildEffictive){
        document.getElementById('vBET'+res.data[0].buildEffictive).defaultChecked=true;

      }
      if(res.data[0].processManagement){
        document.getElementById('vPM'+res.data[0].processManagement).defaultChecked=true;

      }
      if(res.data[0].mottivateingOthers){
        document.getElementById('vMoOt'+res.data[0].mottivateingOthers).defaultChecked=true;

      }
      if(res.data[0].conflictManagement){
        document.getElementById("vCM"+res.data[0].conflictManagement).defaultChecked=true;

      }
      if(res.data[0].decisionQuality){
        document.getElementById('vDQ'+res.data[0].decisionQuality).defaultChecked=true;

      }
      if(res.data[0].presentationSkills){
        document.getElementById('vPreSk'+res.data[0].presentationSkills).defaultChecked=true;

      }
      if(res.data[0].problemSloving){
        document.getElementById('vProSol'+res.data[0].problemSloving).defaultChecked=true;

      }
      if(res.data[0].peerRelation){
        document.getElementById('vPeRe'+res.data[0].peerRelation).defaultChecked=true;

      }
      if(res.data[0].actionOriented){
        document.getElementById('vAcOr'+res.data[0].actionOriented).defaultChecked=true;

      }
      if(res.data[0].creativity){
        document.getElementById('vcrea'+res.data[0].creativity).defaultChecked=true;

      }
      if(res.data[0].presentationSkills){
        document.getElementById('vPresentSkill'+res.data[0].presentationSkills).defaultChecked=true;

      }
      if(res.data[0].problemSloving){
        document.getElementById('vProblemSol'+res.data[0].problemSloving).defaultChecked=true;

      }
      if(res.data[0].peerRelation){
        document.getElementById('vPeerRel'+res.data[0].peerRelation).defaultChecked=true;

      }
      if(res.data[0].personlearning){
        document.getElementById('vPersonaLe'+res.data[0].personlearning).defaultChecked=true;

      }
      if(res.data[0].intergintyTrust){
        document.getElementById('vIT'+res.data[0].intergintyTrust).defaultChecked=true;

      }
      if(res.data[0].learning){
        document.getElementById('vLA'+res.data[0].learning).defaultChecked=true;

      }
      if(res.data[0].customerFocus){
        document.getElementById('vCF'+res.data[0].customerFocus).defaultChecked=true;

      }
      if(res.data[0].driveResults){
        document.getElementById('vDR'+res.data[0].driveResults).defaultChecked=true;

      }
      if(res.data[0].groupDecision){
        document.getElementById(res.data[0].groupDecision).defaultChecked=true;

      }
      if(res.data[0].SRI){
        document.getElementById(res.data[0].SRI).defaultChecked=true;

      }

        this.setState({
          showMail:false,
          showConBtn:false,
          showSub:false,
          showWarp:false,
          showPrint:false
        })
      if(!this.state.C3_622921647557){
        this.setState({C3_622921647557:'未送邮（初试）'})
      }
      if((this.state.C3_622921647557=='未送邮（初试）')||(this.state.C3_622921647557=='未送邮（复试）')){
        if(this.state.userChara=='HR'){
          this.setState({showMail:true});
        }
        if(this.state.C3_622921647557=='未送邮（复试）'){
          this.setState({showWarp:true});
          if(this.state.userChara=='HR'){
            this.setState({showPrint:true})
          }
        }
      }
      if((this.state.C3_622921647557=='待确认（初试）')||(this.state.C3_622921647557=='待确认（复试）')){
        if(this.state.userChara=='HR'){
          this.setState({showConBtn:true})
        }
      }
      if((this.state.C3_622921647557=='未提交（初试）')||(this.state.C3_622921647557=='未提交（复试）')){
        if(this.state.userChara!='HR'){
          this.setState({showSub:true})
        }
      }
      if(this.state.C3_622921647557=='已完成'){
        this.setState({
          showMail:false,
          showConBtn:false,
          showSub:false,
          showPrint:true
        })
      }

      if(!this.state.round2){
        this.setState({round2:'N'})
      }
      if(!this.state.chara){
        this.setState({chara:'T1/T2/T3/T4'})
      }if(!this.state.isBack){
        this.setState({isBack:'N'})
      }
      this.getInfo2(id2)

    } catch (err) {
      Modal.error({
        title: 'Alert!',
        content: err.message,
        okText:'YES'
      });
      this.setState({loading:false});

    }
  };
  getInfo2 = async (id) => {
    this.setState({loading:true});

    let res;
    try {
      res = await http().getTable({
        resid: 613149356409,
        cmswhere: `id=${id}`
      });
      this.setState({position:res.data[0].appPosition,name:res.data[0].ChName});
      this.setState({loading:false});


    } catch (err) {
      Modal.error({
        title: 'Alert!',
        content: err.message,
        okText:'YES'
      });
      this.setState({loading:false});

    }
  };
  componentDidUpdate(prevProps, prevState, snapshot){
    // if(prevProps.record.)
    // if(this.props.data.length>0){
    //   this.setState({name:this.props.data[0].ChName,position:this.props.data[0].appPosition})
    // }
    if(this.props.record.REC_ID !== prevProps.record.REC_ID ){
      this.getInfo(613152706922,this.props.record.REC_ID,this.props.record.ID);

    }
  }
  sendMail = async (id) =>{
    if(this.state.postID){
      this.setState({loading:true});
      var nxtStep;
      if(this.state.C3_622921647557=='未送邮（初试）'){
        nxtStep='未提交（初试）'
      }else if(this.state.C3_622921647557=='未送邮（复试）'){
        nxtStep='未提交（复试）'
      }
      if(this.state.round2=='Y'){
          nxtStep='未提交（复试）'
      }
      let res;
      try {
        res = await http().modifyRecords({
          resid: 613152706922,
          cmswhere: `REC_ID=${this.props.record.REC_ID}`,
          data:[{
             REC_ID:this.props.record.REC_ID,
             C3_622921647557:nxtStep,
             interviewer:this.state.postID,
             accessCategority:this.state.chara,
             isSecondRound:this.state.round2
           }]
         })
         Modal.success({
           title: 'Done!',
           content: '',
           onOk() {
             window.location.reload();
           },
           okText:'YES'
         });

    }catch (err) {
        Modal.error({
          title: 'Alert!',
          content: err.message,
          okText:'YES'
        });
        this.setState({loading:false});

      }
    }else{
      Modal.error({
        title: 'Alert!',
        content: 'Please choose an addressee first!',
        okText:'YES'
      });
    }

  }

  fightBack = async (id) =>{
    this.setState({loading:true});
    var nxtStep;
    if(this.state.C3_622921647557=='待确认（初试）'){
      nxtStep='未提交（初试）'
    }else if(this.state.C3_622921647557=='待确认（复试）'){
      nxtStep='未提交（复试）'
    }
    let res;
    try {
      res = await http().modifyRecords({
        resid: 613152706922,
        cmswhere: `REC_ID=${this.props.record.REC_ID}`,
        data:[{
           REC_ID:this.props.record.REC_ID,
           C3_622921647557:nxtStep,
         }]
       })
       Modal.success({
         title: 'Done!',
         content: '',
         onOk() {
           window.location.reload();
         },
         okText:'YES'
       });

  }catch (err) {
      Modal.error({
        title: 'Alert!',
        content: err.message,
        okText:'YES'
      });
      this.setState({loading:false});

    }
  }

  hrConfirm = async (id) =>{
    this.setState({loading:true});
    var nxtStep;
    if(this.state.C3_622921647557=='待确认（初试）'){
      nxtStep='未送邮（复试）'
    }else if(this.state.C3_622921647557=='待确认（复试）'){
      nxtStep='已完成'
    }
    let res;
    try {
      res = await http().modifyRecords({
        resid: 613152706922,
        cmswhere: `REC_ID=${this.props.record.REC_ID}`,
        data:[{
           REC_ID:this.props.record.REC_ID,
           C3_622921647557:nxtStep,
         }]
       })
       Modal.success({
         title: 'Done!',
         content: '',
         onOk() {
           window.location.reload();
         },
         okText:'YES'
       });

  }catch (err) {
      Modal.error({
        title: 'Alert!',
        content: err.message,
        okText:'YES'
      });
      this.setState({loading:false});

    }
  }

  subData = async (id) => {
    this.setState({loading:true});
    console.log(this.props.record.REC_ID);
    var nxtStep;
    if(this.state.C3_622921647557=='未提交（初试）'){
      nxtStep='待确认（初试）'
    }else{
      nxtStep='待确认（复试）'
    }
    let res;
    try {
      res = await http().modifyRecords({
        resid: 613152706922,
        cmswhere: `REC_ID=${this.props.record.REC_ID}`,
        data:[{
           REC_ID:this.props.record.REC_ID,
           C3_622921647557:nxtStep,
           CandidateName:this.state.name,
           edBackground:this.state.eduBack,
           eduOther:this.state.eduOther,//缺
           leveleInterviewee:this.state.level,
           hireManager:this.state.hiringManger,
           graduateForm:this.state.graFrom,
           workExperise:this.state.workExp,
           wkExp:this.state.wkExp,//缺
           wkOther:this.state.wkOther,//缺
           languageSkill:this.state.lanSki,
           tecSkills:this.state.vTS,
           executiveAbility:this.state.vEA,
           tecExchange:this.state.vTE,
           actionOriented:this.state.vAO,
           problemSloving:this.state.vPS,
           selfDevelopment:this.state.vSd,
           learnOnfly:this.state.vLF,
           tecOutLook:this.state.vTO,
           tecDecomposition:this.state.vTD,
           creativity:this.state.vCr,
           standingAlone:this.state.vSA,
           prioritySetting:this.state.vPrA,
           tecConstruct:this.state.vTC,
           dealWithAug:this.state.vDwA,
           innovationMange:this.state.vIM,
           strategicAgility:this.state.vStrA,
           direcOhters:this.state.vDO,
           developOthers:this.state.vDevO,
           planning:this.state.vPlan,
           confrontDirReports:this.state.vCDR,
           SprioritySetting:this.state.vPri,
           managerAndMeasure:this.state.vMMW,
           buildEffictive:this.state.vBET,
           processManagement:this.state.vPM,
           mottivateingOthers:this.state.vMoOt,
           conflictManagement:this.state.vCM,
           decisionQuality:this.state.vDQ,
           presentationSkills:this.state.vPreSk,
           peerRelation:this.state.vPeRe,
           creativity:this.state.vcrea,
           personlearning:this.state.vPersonaLe,//缺
           intergintyTrust:this.state.vIT,
           learning:this.state.vLA,
           customerFocus:this.state.vCF,
           driveResults:this.state.vDR,
           groupComments:this.state.groupInter,
           propsRetrial:this.state.p4r,
           groupDecision:this.state.GHB,
           secondRound:this.state.secRound,
           SRI:this.state.SRI,//缺
           interviewer:this.state.interviewer,
           secondRoundInterviewer:this.state.interviewer2,
           isSecondRound:this.state.round2,
           isBack:this.state.isBack,
           date:this.state.date,//缺
           secondRoundDate:this.state.date2,
           accessCategority:this.state.chara
        }]
      });

      this.setState({loading:false});

      Modal.success({
        title: 'Done!',
        content: '',
        onOk() {
          window.location.reload();
        },
        okText:'YES'
      });


    } catch (err) {
      Modal.error({
        title: 'Alert!',
        content: err.message,
        okText:'YES'
      });
      this.setState({loading:false});

    }
  }

  changeChara = (v) =>{
    this.setState({chara:v});
  }
  changeRound = (v) =>{
    this.setState({round2:v});
  }
  onPrinting = () => {
    const bodyHtml = window.document.body.innerHTML;

     var footstr = "</body>";
     var newstr = document.getElementById('toPrint').innerHTML;

     var style="<style>.wrap div rect:last-child{border-bottom:none;}ul{padding:0}.hidden{display:none;}h4{margin:0}.wrap{background: #fff;width:842px}h3{text-align:center;margin-top:8px;width:842px;}img{width:120px}ul{list-style: none; overflow: hidden;width:100%;margin-top: 16px;}ul li{width:25%;float:left;overflow: hidden; }ul li b{display: block;float: left;width:50%;}ul li p{width: 50%;float: left;margin:0;} ul li span{font-weight: bold;}rect{display: block;width:842px;border-top:1px solid #000;border-left:1px solid #000;overflow: hidden;box-sizing:border-box;}cell{float:left;display: block;border-right:1px solid #000;padding:10px; min-height:38px;box-sizing: border-box;}cell b{width:100%;font-size: 12px;display: block;}cell:first-child{width:25%;}cell:last-child{width:75%;}input{margin-right:8px;}cell label{margin-right:16px;}cell:last-child b{width:auto;display:inline-block;}.fillText{width:104px;font-size: 12px;outline:none;border:none;border-bottom:1px solid #000;}.byline b{padding-top:5px;padding-bottom:5px;}.uniline{padding-top:16px;padding-bottom:19px;}.triSlice cell:nth-child(3){width:40%;height:38px;}.triSlice cell:nth-child(3) b{position:relative;top:-2px;}.triSlice cell:nth-child(2){width:35%;}.alter1 cell:first-child b{padding-top:10px;padding-bottom:11px;}.alter1 cell:nth-child(2){padding:0; width:35%;}.alter1 cell:nth-child(3){width:40%;padding:0;}.alter1 cell:nth-child(2) b,.alter1 cell:nth-child(3) b{padding:0;line-height:25px;border-bottom:1px solid #000;display:block;width:100%;text-indent:10px;}.alter1 cell b:last-child{border:none;}.alter2 cell:first-child{padding-top:23px;padding-bottom:23px;}.wholeLine{width:100%;padding:10px;border-right:1px solid #000;}textarea{width:100%;border:none;outline:none;height:31px!important;resize:none;}.alter3{padding-top:25px;padding-bottom:26px;}.alterFill{ margin-left: 8px;margin-right: 24px;}h4{text-align: center;}.alter4{padding-top:31px;padding-bottom:31px;}rect:last-child{ border-bottom:1px solid #000;}.GIC{height:56px!important;}.alter5{padding-top:22px;padding-bottom:23px; }.alter6 cell:nth-child(1) b{padding:0; } .alter6 cell:nth-child(2) b{ padding-top:15px;padding-bottom:16px;}.alter6 cell:nth-child(3){padding-top:15px; padding-bottom:16px;}.alter7 cell:nth-child(1) b{padding-top:23px;padding-bottom:24px;}</style>"

     var headstr = "<html><head><title></title>"+style+"</head><body>";
     document.body.innerHTML = headstr + newstr + footstr;
     window.print();
    window.document.body.innerHTML = bodyHtml;
    window.location.reload();
  };

  render() {

    return (
      <div className='IA'>
      <Spin spinning={this.state.loading}>
        <div className={this.state.userChara=='HR'?'chooseClass':'hidden'} >
          <rect className={this.state.chara=='T1/T2/T3/T4'?'current':''} onClick={e => {this.changeChara('T1/T2/T3/T4');}}>
            T1~4
          </rect>
          <rect className={this.state.chara=='T5'?'current':''} onClick={e => {this.changeChara('T5');}}>
            T5
          </rect>
          <rect className={this.state.chara=='T6'?'current':''} onClick={e => {this.changeChara('T6');}}>
            T6
          </rect >
          <rect className={this.state.chara=='S5/S6/Sr.Specialist'?'current':''} onClick={e => {this.changeChara('S5/S6/Sr.Specialist');}}>
            S5 / S6 Sr.Specialist
          </rect>
          <rect className={this.state.chara=='S6/Supervisor/S7/S8/T4/ManagerI'?'current':''} onClick={e => {this.changeChara('S6/Supervisor/S7/S8/T4/ManagerI');}}>
            S6 Supervisor/S7~8/T4/MangerI
          </rect>
          <rect className={this.state.chara=='S9/T5/ManagerII'?'current':''} onClick={e => {this.changeChara('S9/T5/ManagerII');}}>
            S9/T5/ManagerII
          </rect>
          <rect className={this.state.chara=='S10/T6/Sr.Manager'?'current':''} onClick={e => {this.changeChara('S10/T6/Sr.Manager');}}>
            S10/T6/Sr.Manager
          </rect>
          <rect className={this.state.chara=='Technician'?'current':''} onClick={e => {this.changeChara('Technician');}}>
            S3
          </rect>
          <rect className={this.state.chara=='应届生'?'current':''} onClick={e => {this.changeChara('应届生');}}>
            S4
          </rect>
        </div>
        <div className={this.state.userChara=='HR'?'chooseClass chooseRound':'hidden'}>
          <rect className={this.state.round2=='N'?'current':''} onClick={e => {this.changeRound('N');}}>
            Hide Retest
          </rect>
          <rect className={this.state.round2=='Y'?'current':''} onClick={e => {this.changeRound('Y');}}>
            Show Retest
          </rect>
        </div>
        <div className={this.state.showMail?'chooseClass choosePeople':'chooseClass choosePeople hidden'}>
          <div className='innerWrap'>
            <Select
            showSearch

      value={this.state.postName}
      placeholder="Interviewee"
      notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={this.handleSearch}
      onChange={this.handleChangeS}
      style={{ width:'100%',maxHeight:'88px',overflow:'auto'}}

            >
            {this.state.data.map(d => (
                      <Option key={d.value}>{d.text}</Option>
                    ))}
            </Select>
            <Button type='primary' onClick={this.showConfirmMail}>Remind & Mail</Button>
          </div>
        </div>
        <div className='buttonLine'>
          <Button onClick={this.subConfirm} type='primary' className={this.state.showSub==true?'':'hidden'}>Submit</Button>
          <Button type='primary' onClick={this.hrConfirm} className={this.state.showConBtn==true?'':'hidden'}>Approve</Button>
          <Button type='danger' className={this.state.showConBtn==true?'':'hidden'} onClick={this.showConfirm}>Return</Button>
          <Button type='danger' className={this.state.showWarp==true?'':'hidden'} onClick={this.endStream}>Complete</Button>
          <Button className={this.state.showPrint==true?'':'hidden'} onClick={this.onPrinting}>Print</Button>

        </div>
        <div className='cls' style={{position:'fixed'}}onClick={()=>{

            this.props.clsAss();
        }}>
          <Icon type="close-circle" />
        </div>
        <div id='toPrint' ref={p => (this.printer = p)}>
          <div className='wrap'>
            <h3>面试评估表 <br/> Interview Assessment</h3>
            <ul>
              <li>
                <b>应聘者姓名</b><p> {this.state.name}</p>
                <span>Name of Interviewee</span>
              </li>
              <li>
                <b>应聘职位</b><p> {this.state.position}</p>
                <span>Position</span>
              </li>
              <li>
                <b style={{width:'40px'}} className={this.state.level?'':'warning'}>级别</b>
                <input type='text'className='fillText' style={{width:'136px'}}value={this.state.level} onChange={v=>{this.handlechange("level",v)}}/>

                <span className={this.state.level?'':'warning'}>Name of Interviewee</span>
              </li>
              <li>
              <b style={{width:'88px'}} className={this.state.hiringManger?'':'warning'}>岗位招聘经理</b>
              <input type='text'className='fillText' style={{width:'104px'}}value={this.state.hiringManger} onChange={v=>{this.handlechange("hiringManger",v)}}/>
              <span className={this.state.hiringManger?'':'warning'}>Hiring Manger</span>

              </li>
            </ul>
            <rect>
              <cell>
                <b className={this.state.interviewer?'':'warning'}>面试官/Intervieweer</b>
              </cell>
              <cell style={{padding:0}}>
                <textarea style={{paddingTop:'8px',paddingLeft:'8px'}} value={this.state.interviewer} onChange={v=>{this.handlechange("interviewer",v)}}></textarea>
              </cell>
            </rect>
            <rect>
              <cell className='byline'>
                <b className={this.state.eduBack&&this.state.graFrom?'':'warning'}>教育背景/<br/>Education Background</b>
              </cell>
              <cell>
                <input type='radio' value='bachelor' name='eb' checked={this.state.eduBack=='bachelor'?'checked':''} onChange={v=>{this.handlechange("eduBack",v,'bachelor')}} id='bachelor'/><label for='bachelor'>Bachelor 本科</label>
                <input type='radio' value='master' name='eb' checked={this.state.eduBack=='master'?'checked':''} onChange={v=>{this.handlechange("eduBack",v,'master')}} id='master'/><label for='master'>Master 硕士</label>
                <input type='radio' value='doctor' name='eb' checked={this.state.eduBack=='doctor'?'checked':''} onChange={v=>{this.handlechange("eduBack",v,'doctor')}} id='doctor'/><label for='doctor'>Doctor 博士</label>
                <input type='radio' value='otherEb' name='eb' checked={this.state.eduBack=='otherEb'?'checked':''} onChange={v=>{this.handlechange("eduBack",v,'otherEb')}} id='otherEb'/><label for='other'>Other 其他</label>
                <input type='text'className='fillText' value={this.state.eduOther} onChange={v=>{this.handlechange("eduOther",v)}}/>
                <br/>
                <b>Graduated from 毕业学校：</b>
                <input type='text'className='fillText' value={this.state.graFrom} onChange={v=>{this.handlechange("graFrom",v)}}/>
              </cell>
            </rect>
            <rect>
              <cell className='byline'>
                <b className={this.state.workExp&&this.state.wkExp?'':'warning'}>工作经验/<br/>Work Experience</b>
              </cell>
              <cell>
                <input type='number'min='0'className='fillText' value={this.state.workExp} onChange={v=>{this.handlechange("workExp",v)}}/><b>Years 年</b>
                <br/>
                <input type='radio' name='we' id='Huawei' value='Huawei' checked={this.state.wkExp=='Huawei'?'checked':''} onChange={v=>{this.handlechange("wkExp",v,'Huawei')}}/><label for='Huawei'>Huawei</label>
                <input type='radio' name='we' id='Innolight' value='Innolight' checked={this.state.wkExp=='Innolight'?'checked':''} onChange={v=>{this.handlechange("wkExp",v,'Innolight')}}/><label for='Innolight'>Innolight</label>
                <input type='radio' name='we' id='Accelink' value='Accelink' checked={this.state.wkExp=='Accelink'?'checked':''} onChange={v=>{this.handlechange("wkExp",v,'Accelink')}}/><label for='Accelink'>Accelink</label>
                <input type='radio' name='we' id='Neophotonics' value='Neophotonics' checked={this.state.wkExp=='Neophotonics'?'checked':''} onChange={v=>{this.handlechange("wkExp",v,'Neophotonics')}}/><label for='Neophotonics'>Neophotonics</label>
                <input type='radio' name='we' id='otherWe' value='otherWe' checked={this.state.wkExp=='otherWe'?'checked':''} onChange={v=>{this.handlechange("wkExp",v,'otherWe')}}/><label for='other'>Other 其他</label>
                <input type='text'className='fillText' value={this.state.wkOther} onChange={v=>{this.handlechange("wkOther",v)}}/>

              </cell>
            </rect>
            <rect>
              <cell>
                <b className={this.state.lanSki?'':'warning'}>英语技能/<br/>Language Skills</b>
              </cell>
              <cell className='uniline'>
                <input type='radio' name='ls' id='basic' value='basic' checked={this.state.lanSki=='basic'?'checked':''} onChange={v=>{this.handlechange("lanSki",v,'basic')}}/><label for='basic'>Basic</label>
                <input type='radio' name='ls' id='communicative' value='communicative' checked={this.state.lanSki=='communicative'?'checked':''} onChange={v=>{this.handlechange("lanSki",v,'communicative')}}/><label for='communicative'>Communicative</label>
                <input type='radio' name='ls' id='fluent' value='fluent' checked={this.state.lanSki=='fluent'?'checked':''} onChange={v=>{this.handlechange("lanSki",v,'fluent')}}/><label for='fluent'>Fluent</label>
                <input type='radio' name='ls' id='professional' value='professional' checked={this.state.lanSki=='professional'?'checked':''} onChange={v=>{this.handlechange("lanSki",v,'professional')}}/><label for='professional'>Professional</label>
                <input type='radio' name='ls' id='native' value='native' checked={this.state.lanSki=='native'?'checked':''} onChange={v=>{this.handlechange("lanSki",v,'native')}}/><label for='native'>Native</label>

              </cell>
            </rect>
            <rect className='triSlice'>
              <cell>
                <b>项目/Items</b>
              </cell>
              <cell>
                <b>评估因素/Factors</b>
              </cell>
              <cell>
                <b>得分/Items</b>
              </cell>
            </rect>
        <div className={this.state.chara=='T1/T2/T3/T4'?'':'hidden'} ref='T1'>
            <rect className='alter1'>
              <cell>
                <b >
                  技术胜任力<br/>Technical Competency
                </b>
              </cell>
              <cell>
                <b className={this.state.vTS?'':'warning'}>专业技术/Technical Skills</b>
                <b className={this.state.vEA?'':'warning'}>执行力/Executive Ability</b>
                <b className={this.state.vTE?'':'warning'}>技术交流/Technical Exchange</b>
              </cell>
              <cell>
                <b>
                  <input type='radio' name='vTS' id='vTS1' value='1' checked={this.state.vTS=='1'?'checked':''} onChange={v=>{this.handlechange("vTS",v,'vTS1')}}/><label for='vTS1'>1</label>

                  <input type='radio' name='vTS' id='vTS2' value='2' checked={this.state.vTS=='2'?'checked':''} onChange={v=>{this.handlechange("vTS",v,'vTS2')}}/><label for='vTS2'>2</label>

                  <input type='radio' name='vTS' id='vTS3' value='3' checked={this.state.vTS=='3'?'checked':''} onChange={v=>{this.handlechange("vTS",v,'vTS3')}}/><label for='vTS3'>3</label>

                  <input type='radio' name='vTS' id='vTS4' value='4' checked={this.state.vTS=='4'?'checked':''} onChange={v=>{this.handlechange("vTS",v,'vTS4')}}/><label for='vTS4'>4</label>

                  <input type='radio' name='vTS' id='vTS5' value='5' checked={this.state.vTS=='5'?'checked':''} onChange={v=>{this.handlechange("vTS",v,'vTS5')}}/><label for='vTS5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vEA' id='vEA1' value='1' checked={this.state.vEA=='1'?'checked':''} onChange={v=>{this.handlechange("vEA",v,'vEA1')}}/><label for='vEA1'>1</label>

                  <input type='radio' name='vEA' id='vEA2' value='2' checked={this.state.vEA=='2'?'checked':''} onChange={v=>{this.handlechange("vEA",v,'vEA2')}}/><label for='vEA2'>2</label>

                  <input type='radio' name='vEA' id='vEA3' value='3' checked={this.state.vEA=='3'?'checked':''} onChange={v=>{this.handlechange("vEA",v,'vEA3')}}/><label for='vEA3'>3</label>

                  <input type='radio' name='vEA' id='vEA4' value='4' checked={this.state.vEA=='4'?'checked':''} onChange={v=>{this.handlechange("vEA",v,'vEA4')}}/><label for='vEA4'>4</label>

                  <input type='radio' name='vEA' id='vEA5' value='5' checked={this.state.vEA=='5'?'checked':''} onChange={v=>{this.handlechange("vEA",v,'vEA5')}}/><label for='vEA5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vTE' id='vTE1' value='1' checked={this.state.vTE=='1'?'checked':''} onChange={v=>{this.handlechange("vTE",v,'vTE1')}}/><label for='vTE1'>1</label>

                  <input type='radio' name='vTE' id='vTE2' value='2' checked={this.state.vTE=='2'?'checked':''} onChange={v=>{this.handlechange("vTE",v,'vTE2')}}/><label for='vTE2'>2</label>

                  <input type='radio' name='vTE' id='vTE3' value='3' checked={this.state.vTE=='3'?'checked':''} onChange={v=>{this.handlechange("vTE",v,'vTE3')}}/><label for='vTE3'>3</label>

                  <input type='radio' name='vTE' id='vTE4' value='4' checked={this.state.vTE=='4'?'checked':''} onChange={v=>{this.handlechange("vTE",v,'vTE4')}}/><label for='vTE4'>4</label>

                  <input type='radio' name='vTE' id='vTE5' value='5' checked={this.state.vTE=='5'?'checked':''} onChange={v=>{this.handlechange("vEA",v,'vTE5')}}/><label for='vTE5'>5</label>
                </b>
              </cell>
            </rect>
            <rect className='alter1 alter2'>
              <cell>
                <b>
                  岗位胜任力<br/>Technical Competency
                </b>
              </cell>
              <cell>
                <b className={this.state.vAO?'':'warning'}>以行动为导向/Action Oriented</b>
                <b className={this.state.vPS?'':'warning'}>解决问题/Problem Solving</b>
                <b className={this.state.vSd?'':'warning'}>自我发展/Self-development</b>
                <b className={this.state.vLF?'':'warning'}>及时学习/Learning on the Fly</b>
              </cell>
              <cell>
                <b>
                  <input type='radio' name='vAO' id='vAO1' value='1' checked={this.state.vAO=='1'?'checked':''} onChange={v=>{this.handlechange("vAO",v,'vAO1')}}/><label for='vAO1'>1</label>

                  <input type='radio' name='vAO' id='vAO2' value='2' checked={this.state.vAO=='2'?'checked':''} onChange={v=>{this.handlechange("vAO",v,'vAO2')}}/><label for='vAO2'>2</label>

                  <input type='radio' name='vAO' id='vAO3' value='3' checked={this.state.vAO=='3'?'checked':''} onChange={v=>{this.handlechange("vAO",v,'vAO3')}}/><label for='vAO3'>3</label>

                  <input type='radio' name='vAO' id='vAO4' value='4' checked={this.state.vAO=='4'?'checked':''} onChange={v=>{this.handlechange("vAO",v,'vAO4')}}/><label for='vAO4'>4</label>

                  <input type='radio' name='vAO' id='vAO5' value='5' checked={this.state.vAO=='5'?'checked':''} onChange={v=>{this.handlechange("vAO",v,'vAO5')}}/><label for='vAO5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPS' id='vPS1' value='1' checked={this.state.vPS=='1'?'checked':''} onChange={v=>{this.handlechange("vPS",v,'vPS1')}}/><label for='vPS1'>1</label>

                  <input type='radio' name='vPS' id='vPS2' value='2' checked={this.state.vPS=='2'?'checked':''} onChange={v=>{this.handlechange("vPS",v,'vPS2')}}/><label for='vPS2'>2</label>

                  <input type='radio' name='vPS' id='vPS3' value='3' checked={this.state.vPS=='3'?'checked':''} onChange={v=>{this.handlechange("vPS",v,'vPS3')}}/><label for='vPS3'>3</label>

                  <input type='radio' name='vPS' id='vPS4' value='4' checked={this.state.vPS=='4'?'checked':''} onChange={v=>{this.handlechange("vPS",v,'vPS4')}}/><label for='vPS4'>4</label>

                  <input type='radio' name='vPS' id='vPS5' value='5' checked={this.state.vPS=='5'?'checked':''} onChange={v=>{this.handlechange("vPS",v,'vPS5')}}/><label for='vPS5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vSd' id='vSd1' value='1' checked={this.state.vSd=='1'?'checked':''} onChange={v=>{this.handlechange("vSd",v,'vSd1')}}/><label for='vSd1'>1</label>

                  <input type='radio' name='vSd' id='vSd2' value='2' checked={this.state.vSd=='2'?'checked':''} onChange={v=>{this.handlechange("vSd",v,'vSd1')}}/><label for='vSd2'>2</label>

                  <input type='radio' name='vSd' id='vSd3' value='3' checked={this.state.vSd=='3'?'checked':''} onChange={v=>{this.handlechange("vSd",v,'vSd1')}}/><label for='vSd3'>3</label>

                  <input type='radio' name='vSd' id='vSd4' value='4' checked={this.state.vSd=='4'?'checked':''} onChange={v=>{this.handlechange("vSd",v,'vSd1')}}/><label for='vSd4'>4</label>

                  <input type='radio' name='vSd' id='vSd5' value='5' checked={this.state.vSd=='5'?'checked':''} onChange={v=>{this.handlechange("vSd",v,'vSd1')}}/><label for='vSd5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vLF' id='vLF1' value='1' checked={this.state.vLF=='1'?'checked':''} onChange={v=>{this.handlechange("vLF",v,'vLF1')}}/><label for='vLF1'>1</label>

                  <input type='radio' name='vLF' id='vLF2' value='2' checked={this.state.vLF=='2'?'checked':''} onChange={v=>{this.handlechange("vLF",v,'vLF2')}}/><label for='vLF2'>2</label>

                  <input type='radio' name='vLF' id='vLF3' value='3' checked={this.state.vLF=='3'?'checked':''} onChange={v=>{this.handlechange("vLF",v,'vLF3')}}/><label for='vLF3'>3</label>

                  <input type='radio' name='vLF' id='vLF4' value='4' checked={this.state.vLF=='4'?'checked':''} onChange={v=>{this.handlechange("vLF",v,'vLF4')}}/><label for='vLF4'>4</label>

                  <input type='radio' name='vLF' id='vLF5' value='5' checked={this.state.vLF=='5'?'checked':''} onChange={v=>{this.handlechange("vLF",v,'vLF5')}}/><label for='vLF5'>5</label>
                </b>
              </cell>
            </rect>
          </div>

          <div className={this.state.chara=='T5'?'':'hidden'} ref='T5'>
            <rect className='alter1 alter2'>
              <cell>
                <b>
                  技术胜任力<br/>Technical Competency
                </b>
              </cell>
              <cell>
                <b className={this.state.vTS2?'':'warning'}>专业技术/Technical Skills</b>
                <b className={this.state.vTO?'':'warning'}>技术全局观/Technical Outlook</b>
                <b className={this.state.vTD?'':'warning'}>技术分解/Technical Decomposition</b>
                <b className={this.state.vTE2?'':'warning'}>技术交流/Technical Exchange</b>
              </cell>
              <cell>
                <b>
                  <input type='radio' name='vTS2' id='vTS6' value='1' checked={this.state.vTS2=='1'?'checked':''} onChange={v=>{this.handlechange("vTS2",v,'vTS6')}}/><label for='vTS6'>1</label>

                  <input type='radio' name='vTS2' id='vTS7' value='2' checked={this.state.vTS2=='2'?'checked':''} onChange={v=>{this.handlechange("vTS2",v,'vTS7')}}/><label for='vTS7'>2</label>

                  <input type='radio' name='vTS2' id='vTS8' value='3' checked={this.state.vTS2=='3'?'checked':''} onChange={v=>{this.handlechange("vTS2",v,'vTS8')}}/><label for='vTS8'>3</label>

                  <input type='radio' name='vTS2' id='vTS9' value='4' checked={this.state.vTS2=='4'?'checked':''} onChange={v=>{this.handlechange("vTS2",v,'vTS9')}}/><label for='vTS9'>4</label>

                  <input type='radio' name='vTS2' id='vTS10' value='5' checked={this.state.vTS2=='5'?'checked':''} onChange={v=>{this.handlechange("vTS2",v,'vTS10')}}/><label for='vTS10'>5</label>
                </b>
                <b>
                  <input type='radio' name='vTO' id='vTO1' value='1' checked={this.state.vTO=='1'?'checked':''} onChange={v=>{this.handlechange("vTO",v,'vTO1')}}/><label for='vTO1'>1</label>

                  <input type='radio' name='vTO' id='vTO2' value='2' checked={this.state.vTO=='2'?'checked':''} onChange={v=>{this.handlechange("vTO",v,'vTO2')}}/><label for='vTO2'>2</label>

                  <input type='radio' name='vTO' id='vTO3' value='3' checked={this.state.vTO=='3'?'checked':''} onChange={v=>{this.handlechange("vTO",v,'vTO3')}}/><label for='vTO3'>3</label>

                  <input type='radio' name='vTO' id='vTO4' value='4' checked={this.state.vTO=='4'?'checked':''} onChange={v=>{this.handlechange("vTO",v,'vTO4')}}/><label for='vTO4'>4</label>

                  <input type='radio' name='vTO' id='vTO5' value='5' checked={this.state.vTO=='5'?'checked':''} onChange={v=>{this.handlechange("vTO",v,'vTO5')}}/><label for='vTO5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vTD' id='vTD1' value='1' checked={this.state.vTD=='1'?'checked':''} onChange={v=>{this.handlechange("vTD",v,'vTD1')}}/><label for='vTD1'>1</label>

                  <input type='radio' name='vTD' id='vTD2' value='2' checked={this.state.vTD=='2'?'checked':''} onChange={v=>{this.handlechange("vTD",v,'vTD2')}}/><label for='vTD2'>2</label>

                  <input type='radio' name='vTD' id='vTD3' value='3' checked={this.state.vTD=='3'?'checked':''} onChange={v=>{this.handlechange("vTD",v,'vTD3')}}/><label for='vTD3'>3</label>

                  <input type='radio' name='vTD' id='vTD4' value='4' checked={this.state.vTD=='4'?'checked':''} onChange={v=>{this.handlechange("vTD",v,'vTD4')}}/><label for='vTD4'>4</label>

                  <input type='radio' name='vTD' id='vTD5' value='5' checked={this.state.vTD=='5'?'checked':''} onChange={v=>{this.handlechange("vTD",v,'vTD5')}}/><label for='vTD5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vTE2' id='vTE6' value='1' checked={this.state.vTE2=='1'?'checked':''} onChange={v=>{this.handlechange("vTE2",v,'vTE6')}}/><label for='vTE6'>1</label>

                  <input type='radio' name='vTE2' id='vTE7' value='2' checked={this.state.vTE2=='2'?'checked':''} onChange={v=>{this.handlechange("vTE2",v,'vTE7')}}/><label for='vTE7'>2</label>

                  <input type='radio' name='vTE2' id='vTE8' value='3' checked={this.state.vTE2=='3'?'checked':''} onChange={v=>{this.handlechange("vTE2",v,'vTE8')}}/><label for='vTE8'>3</label>

                  <input type='radio' name='vTE2' id='vTE9' value='4' checked={this.state.vTE2=='4'?'checked':''} onChange={v=>{this.handlechange("vTE2",v,'vTE9')}}/><label for='vTE9'>4</label>

                  <input type='radio' name='vTE2' id='vTE10' value='5' checked={this.state.vTE2=='5'?'checked':''} onChange={v=>{this.handlechange("vTE2",v,'vTE10')}}/><label for='vTE10'>5</label>
                </b>
              </cell>
            </rect>
            <rect className='alter1'>
              <cell>
                <b>
                  岗位胜任力<br/>Technical Competency
                </b>
              </cell>
              <cell>
                <b className={this.state.vCr?'':'warning'}>创造力/Creativity</b>
                <b className={this.state.vSA?'':'warning'}>独当一面/Standing Alone</b>
                <b className={this.state.vPrA?'':'warning'}>确定轻重缓急/Priority Setting</b>
              </cell>
              <cell>
                <b>
                  <input type='radio' name='vCr' id='vCr1' value='1' checked={this.state.vCr=='1'?'checked':''} onChange={v=>{this.handlechange("vCr",v,'vCr1')}}/><label for='vCr1'>1</label>

                  <input type='radio' name='vCr' id='vCr2' value='2' checked={this.state.vCr=='2'?'checked':''} onChange={v=>{this.handlechange("vCr",v,'vCr2')}}/><label for='vCr2'>2</label>

                  <input type='radio' name='vCr' id='vCr3' value='3' checked={this.state.vCr=='3'?'checked':''} onChange={v=>{this.handlechange("vCr",v,'vCr3')}}/><label for='vCr3'>3</label>

                  <input type='radio' name='vCr' id='vCr4' value='4' checked={this.state.vCr=='4'?'checked':''} onChange={v=>{this.handlechange("vCr",v,'vCr4')}}/><label for='vCr4'>4</label>

                  <input type='radio' name='vCr' id='vCr5' value='5' checked={this.state.vCr=='5'?'checked':''} onChange={v=>{this.handlechange("vCr",v,'vCr5')}}/><label for='vCr5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vSA' id='vSA1' value='1' checked={this.state.vSA=='1'?'checked':''} onChange={v=>{this.handlechange("vSA",v,'vSA1')}}/><label for='vSA1'>1</label>

                  <input type='radio' name='vSA' id='vSA2' value='2' checked={this.state.vSA=='2'?'checked':''} onChange={v=>{this.handlechange("vSA",v,'vSA2')}}/><label for='vSA2'>2</label>

                  <input type='radio' name='vSA' id='vSA3' value='3' checked={this.state.vSA=='3'?'checked':''} onChange={v=>{this.handlechange("vSA",v,'vSA3')}}/><label for='vSA3'>3</label>

                  <input type='radio' name='vSA' id='vSA4' value='4' checked={this.state.vSA=='4'?'checked':''} onChange={v=>{this.handlechange("vSA",v,'vSA4')}}/><label for='vSA4'>4</label>

                  <input type='radio' name='vSA' id='vSA5' value='5' checked={this.state.vSA=='5'?'checked':''} onChange={v=>{this.handlechange("vSA",v,'vSA5')}}/><label for='vSA5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPrA' id='vPrA1' value='1' checked={this.state.vPrA=='1'?'checked':''} onChange={v=>{this.handlechange("vPrA",v,'vPrA1')}}/><label for='vPrA1'>1</label>

                  <input type='radio' name='vPrA' id='vPrA2' value='2' checked={this.state.vPrA=='2'?'checked':''} onChange={v=>{this.handlechange("vPrA",v,'vPrA2')}}/><label for='vPrA2'>2</label>

                  <input type='radio' name='vPrA' id='vPrA3' value='3' checked={this.state.vPrA=='3'?'checked':''} onChange={v=>{this.handlechange("vPrA",v,'vPrA3')}}/><label for='vPrA3'>3</label>

                  <input type='radio' name='vPrA' id='vPrA4' value='4' checked={this.state.vPrA=='4'?'checked':''} onChange={v=>{this.handlechange("vPrA",v,'vPrA4')}}/><label for='vPrA4'>4</label>

                  <input type='radio' name='vPrA' id='vPrA5' value='5' checked={this.state.vPrA=='5'?'checked':''} onChange={v=>{this.handlechange("vPrA",v,'vPrA5')}}/><label for='vPrA5'>5</label>
                </b>
              </cell>
            </rect>
            </div>
            <div className={this.state.chara== 'T6' ?'':'hidden'} ref='T6'>
              <rect className='alter1 alter2'>
                <cell>
                  <b>
                    技术胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vTS3?'':'warning'}>专业技术/Technical Skills</b>
                  <b className={this.state.vTO2?'':'warning'}>技术全局观/Technical Outlook</b>
                  <b className={this.state.vTC?'':'warning'}>技术构建/Technical Construction</b>
                  <b className={this.state.vTE3?'':'warning'}>技术交流/Technical Exchange</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vTS3' id='vTS11' value='1' checked={this.state.vTS3=='1'?'checked':''} onChange={v=>{this.handlechange("vTS3",v,'vTS11')}}/><label for='vTS11'>1</label>

                    <input type='radio' name='vTS3' id='vTS12' value='2' checked={this.state.vTS3=='2'?'checked':''} onChange={v=>{this.handlechange("vTS3",v,'vTS12')}}/><label for='vTS12'>2</label>

                    <input type='radio' name='vTS3' id='vTS13' value='3' checked={this.state.vTS3=='3'?'checked':''} onChange={v=>{this.handlechange("vTS3",v,'vTS13')}}/><label for='vTS13'>3</label>

                    <input type='radio' name='vTS3' id='vTS14' value='4' checked={this.state.vTS3=='4'?'checked':''} onChange={v=>{this.handlechange("vTS3",v,'vTS14')}}/><label for='vTS14'>4</label>

                    <input type='radio' name='vTS3' id='vTS15' value='5' checked={this.state.vTS3=='5'?'checked':''} onChange={v=>{this.handlechange("vTS3",v,'vTS15')}}/><label for='vTS15'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vTO2' id='vTO6' value='1' checked={this.state.vTO2=='1'?'checked':''} onChange={v=>{this.handlechange("vTO2",v,'vTO6')}}/><label for='vTO6'>1</label>

                    <input type='radio' name='vTO2' id='vTO7' value='2' checked={this.state.vTO2=='2'?'checked':''} onChange={v=>{this.handlechange("vTO2",v,'vTO7')}}/><label for='vTO7'>2</label>

                    <input type='radio' name='vTO2' id='vTO8' value='3' checked={this.state.vTO2=='3'?'checked':''} onChange={v=>{this.handlechange("vTO2",v,'vTO8')}}/><label for='vTO8'>3</label>

                    <input type='radio' name='vTO2' id='vTO9' value='4' checked={this.state.vTO2=='4'?'checked':''} onChange={v=>{this.handlechange("vTO2",v,'vTO9')}}/><label for='vTO9'>4</label>

                    <input type='radio' name='vTO2' id='vTO10' value='5' checked={this.state.vTO2=='5'?'checked':''} onChange={v=>{this.handlechange("vTO2",v,'vTO10')}}/><label for='vTO10'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vTC' id='vTC1' value='1' checked={this.state.vTC=='1'?'checked':''} onChange={v=>{this.handlechange("vTC",v,'vTC1')}}/><label for='vTC1'>1</label>

                    <input type='radio' name='vTC' id='vTC2' value='2' checked={this.state.vTC=='2'?'checked':''} onChange={v=>{this.handlechange("vTC",v,'vTC2')}}/><label for='vTC2'>2</label>

                    <input type='radio' name='vTC' id='vTC3' value='3' checked={this.state.vTC=='3'?'checked':''} onChange={v=>{this.handlechange("vTC",v,'vTC3')}}/><label for='vTC3'>3</label>

                    <input type='radio' name='vTC' id='vTC4' value='4' checked={this.state.vTC=='4'?'checked':''} onChange={v=>{this.handlechange("vTC",v,'vTC4')}}/><label for='vTC4'>4</label>

                    <input type='radio' name='vTC' id='vTC5' value='5' checked={this.state.vTC=='5'?'checked':''} onChange={v=>{this.handlechange("vTC",v,'vTC5')}}/><label for='vTC5'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vTE3' id='vTE11' value='1' checked={this.state.vTE3=='1'?'checked':''} onChange={v=>{this.handlechange("vTE3",v,'vTE11')}}/><label for='vTE11'>1</label>

                    <input type='radio' name='vTE3' id='vTE12' value='2' checked={this.state.vTE3=='2'?'checked':''} onChange={v=>{this.handlechange("vTE3",v,'vTE12')}}/><label for='vTE12'>2</label>

                    <input type='radio' name='vTE3' id='vTE13' value='3' checked={this.state.vTE3=='3'?'checked':''} onChange={v=>{this.handlechange("vTE3",v,'vTE13')}}/><label for='vTE13'>3</label>

                    <input type='radio' name='vTE3' id='vTE14' value='4' checked={this.state.vTE3=='4'?'checked':''} onChange={v=>{this.handlechange("vTE3",v,'vTE14')}}/><label for='vTE14'>4</label>

                    <input type='radio' name='vTE3' id='vTE15' value='5' checked={this.state.vTE3=='5'?'checked':''} onChange={v=>{this.handlechange("vTE3",v,'vTE15')}}/><label for='vTE15'>5</label>
                  </b>
                </cell>
              </rect>
              <rect className='alter1'>
                <cell>
                  <b>
                    岗位胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vDwA?'':'warning'}>应对不明朗局面/Dealing with Ambiguity</b>
                  <b className={this.state.vIM?'':'warning'}>创新管理/Innovation Management</b>
                  <b className={this.state.vStrA?'':'warning'}>策略的敏锐性/Strategic Agility</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vDwA' id='vDwA1' value='1' checked={this.state.vDwA=='1'?'checked':''} onChange={v=>{this.handlechange("vDwA",v,'vDwA1')}}/><label for='vDwA1'>1</label>

                    <input type='radio' name='vDwA' id='vDwA2' value='2' checked={this.state.vDwA=='2'?'checked':''} onChange={v=>{this.handlechange("vDwA",v,'vDwA2')}}/><label for='vDwA2'>2</label>

                    <input type='radio' name='vDwA' id='vDwA3' value='3' checked={this.state.vDwA=='3'?'checked':''} onChange={v=>{this.handlechange("vDwA",v,'vDwA3')}}/><label for='vDwA3'>3</label>

                    <input type='radio' name='vDwA' id='vDwA4' value='4' checked={this.state.vDwA=='4'?'checked':''} onChange={v=>{this.handlechange("vDwA",v,'vDwA4')}}/><label for='vDwA4'>4</label>

                    <input type='radio' name='vDwA' id='vDwA5' value='5' checked={this.state.vDwA=='5'?'checked':''} onChange={v=>{this.handlechange("vDwA",v,'vDwA5')}}/><label for='vDwA5'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vIM' id='vIM1' value='1' checked={this.state.vIM=='1'?'checked':''} onChange={v=>{this.handlechange("vIM",v,'vIM1')}}/><label for='vIM1'>1</label>

                    <input type='radio' name='vIM' id='vIM2' value='2' checked={this.state.vIM=='2'?'checked':''} onChange={v=>{this.handlechange("vIM",v,'vIM2')}}/><label for='vIM2'>2</label>

                    <input type='radio' name='vIM' id='vIM3' value='3' checked={this.state.vIM=='3'?'checked':''} onChange={v=>{this.handlechange("vIM",v,'vIM3')}}/><label for='vIM3'>3</label>

                    <input type='radio' name='vIM' id='vIM4' value='4' checked={this.state.vIM=='4'?'checked':''} onChange={v=>{this.handlechange("vIM",v,'vIM4')}}/><label for='vIM4'>4</label>

                    <input type='radio' name='vIM' id='vIM5' value='5' checked={this.state.vIM=='5'?'checked':''} onChange={v=>{this.handlechange("vIM",v,'vIM5')}}/><label for='vIM5'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vStrA' id='vStrA1' value='1' checked={this.state.vStrA=='1'?'checked':''} onChange={v=>{this.handlechange("vStrA",v,'vStrA1')}}/><label for='vStrA1'>1</label>

                    <input type='radio' name='vStrA' id='vStrA2' value='2' checked={this.state.vStrA=='2'?'checked':''} onChange={v=>{this.handlechange("vStrA",v,'vStrA2')}}/><label for='vStrA2'>2</label>

                    <input type='radio' name='vStrA' id='vStrA3' value='3' checked={this.state.vStrA=='3'?'checked':''} onChange={v=>{this.handlechange("vStrA",v,'vStrA3')}}/><label for='vStrA3'>3</label>

                    <input type='radio' name='vStrA' id='vStrA4' value='4' checked={this.state.vStrA=='4'?'checked':''} onChange={v=>{this.handlechange("vStrA",v,'vStrA4')}}/><label for='vStrA4'>4</label>

                    <input type='radio' name='vStrA' id='vStrA5' value='5' checked={this.state.vStrA=='5'?'checked':''} onChange={v=>{this.handlechange("vStrA",v,'vStrA5')}}/><label for='vStrA5'>5</label>
                  </b>
                </cell>
              </rect>
            </div>

            <div ref='S5' className={this.state.chara=='S5/S6/Sr.Specialist'?'':'hidden'}>
              <rect className='alter1 alter6'>
                <cell>
                  <b>
                    技术胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vTS4?'':'warning'}>专业技术/Technical Skills</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vTS4' id='vTS16' value='1' checked={this.state.vTS4=='1'?'checked':''} onChange={v=>{this.handlechange("vTS4",v,'vTS16')}}/><label for='vTS11'>1</label>

                    <input type='radio' name='vTS4' id='vTS17' value='2' checked={this.state.vTS4=='2'?'checked':''} onChange={v=>{this.handlechange("vTS4",v,'vTS17')}}/><label for='vTS12'>2</label>

                    <input type='radio' name='vTS4' id='vTS18' value='3' checked={this.state.vTS4=='3'?'checked':''} onChange={v=>{this.handlechange("vTS4",v,'vTS18')}}/><label for='vTS13'>3</label>

                    <input type='radio' name='vTS4' id='vTS19' value='4' checked={this.state.vTS4=='4'?'checked':''} onChange={v=>{this.handlechange("vTS4",v,'vTS19')}}/><label for='vTS14'>4</label>

                    <input type='radio' name='vTS4' id='vTS20' value='5' checked={this.state.vTS4=='5'?'checked':''} onChange={v=>{this.handlechange("vTS4",v,'vTS20')}}/><label for='vTS15'>5</label>
                  </b>

                </cell>
              </rect>
              <rect className='alter1 alter2'>
                <cell>
                  <b>
                    岗位胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vAO2?'':'warning'}>以行动为导向/Action Oriented</b>
                  <b className={this.state.vPS2?'':'warning'}>解决问题/Problem Solving</b>
                  <b className={this.state.vSd2?'':'warning'}>自我发展/Self-development</b>
                  <b className={this.state.vLF2?'':'warning'}>及时学习/Learning on the Fly</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vAO2' id='vAO6' value='1' checked={this.state.vAO2=='1'?'checked':''} onChange={v=>{this.handlechange("vAO2",v,'vAO6')}}/><label for='vAO6'>1</label>

                    <input type='radio' name='vAO2' id='vAO7' value='2' checked={this.state.vAO2=='2'?'checked':''} onChange={v=>{this.handlechange("vAO2",v,'vAO7')}}/><label for='vAO7'>2</label>

                    <input type='radio' name='vAO2' id='vAO8' value='3' checked={this.state.vAO2=='3'?'checked':''} onChange={v=>{this.handlechange("vAO2",v,'vAO8')}}/><label for='vAO8'>3</label>

                    <input type='radio' name='vAO2' id='vAO9' value='4' checked={this.state.vAO2=='4'?'checked':''} onChange={v=>{this.handlechange("vAO2",v,'vAO9')}}/><label for='vAO9'>4</label>

                    <input type='radio' name='vAO2' id='vAO10' value='5' checked={this.state.vAO2=='5'?'checked':''} onChange={v=>{this.handlechange("vAO2",v,'vAO10')}}/><label for='vAO10'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vPS2' id='vPS6' value='1' checked={this.state.vPS2=='1'?'checked':''} onChange={v=>{this.handlechange("vPS2",v,'vPS6')}}/><label for='vPS6'>1</label>

                    <input type='radio' name='vPS2' id='vPS7' value='2' checked={this.state.vPS2=='2'?'checked':''} onChange={v=>{this.handlechange("vPS2",v,'vPS7')}}/><label for='vPS7'>2</label>

                    <input type='radio' name='vPS2' id='vPS8' value='3' checked={this.state.vPS2=='3'?'checked':''} onChange={v=>{this.handlechange("vPS2",v,'vPS8')}}/><label for='vPS8'>3</label>

                    <input type='radio' name='vPS2' id='vPS9' value='4' checked={this.state.vPS2=='4'?'checked':''} onChange={v=>{this.handlechange("vPS2",v,'vPS9')}}/><label for='vPS9'>4</label>

                    <input type='radio' name='vPS2' id='vPS10' value='5' checked={this.state.vPS2=='5'?'checked':''} onChange={v=>{this.handlechange("vPS2",v,'vPS10')}}/><label for='vPS10'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vSd2' id='vSd6' value='1' checked={this.state.vSd2=='1'?'checked':''} onChange={v=>{this.handlechange("vSd2",v,'vSd6')}}/><label for='vSd6'>1</label>

                    <input type='radio' name='vSd2' id='vSd7' value='2' checked={this.state.vSd2=='2'?'checked':''} onChange={v=>{this.handlechange("vSd2",v,'vSd7')}}/><label for='vSd7'>2</label>

                    <input type='radio' name='vSd2' id='vSd8' value='3' checked={this.state.vSd2=='3'?'checked':''} onChange={v=>{this.handlechange("vSd2",v,'vSd8')}}/><label for='vSd8'>3</label>

                    <input type='radio' name='vSd2' id='vSd9' value='4' checked={this.state.vSd2=='4'?'checked':''} onChange={v=>{this.handlechange("vSd2",v,'vSd9')}}/><label for='vSd9'>4</label>

                    <input type='radio' name='vSd2' id='vSd10' value='5' checked={this.state.vSd2=='5'?'checked':''} onChange={v=>{this.handlechange("vSd2",v,'vSd10')}}/><label for='vSd10'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vLF2' id='vLF6' value='1' checked={this.state.vLF2=='1'?'checked':''} onChange={v=>{this.handlechange("vLF2",v,'vLF6')}}/><label for='vLF6'>1</label>

                    <input type='radio' name='vLF2' id='vLF7' value='2' checked={this.state.vLF2=='2'?'checked':''} onChange={v=>{this.handlechange("vLF2",v,'vLF7')}}/><label for='vLF7'>2</label>

                    <input type='radio' name='vLF2' id='vLF8' value='3' checked={this.state.vLF2=='3'?'checked':''} onChange={v=>{this.handlechange("vLF2",v,'vLF8')}}/><label for='vLF8'>3</label>

                    <input type='radio' name='vLF2' id='vLF9' value='4' checked={this.state.vLF2=='4'?'checked':''} onChange={v=>{this.handlechange("vLF2",v,'vLF9')}}/><label for='vLF9'>4</label>

                    <input type='radio' name='vLF2' id='vLF10' value='5' checked={this.state.vLF2=='5'?'checked':''} onChange={v=>{this.handlechange("vLF2",v,'vLF10')}}/><label for='vLF10'>5</label>
                  </b>
                </cell>
              </rect>
            </div>

            <div ref='S6' className={this.state.chara=='S6/Supervisor/S7/S8/T4/ManagerI'?'':'hidden'}>
              <rect className='alter1 alter6'>
                <cell>
                  <b>
                    技术胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vTS5?'':'warning'}>专业技术/Technical Skills</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vTS5' id='vTS21' value='1' checked={this.state.vTS5=='1'?'checked':''} onChange={v=>{this.handlechange("vTS5",v,'vTS21')}}/><label for='vTS21'>1</label>

                    <input type='radio' name='vTS5' id='vTS22' value='2' checked={this.state.vTS5=='2'?'checked':''} onChange={v=>{this.handlechange("vTS5",v,'vTS22')}}/><label for='vTS22'>2</label>

                    <input type='radio' name='vTS5' id='vTS23' value='3' checked={this.state.vTS5=='3'?'checked':''} onChange={v=>{this.handlechange("vTS5",v,'vTS23')}}/><label for='vTS23'>3</label>

                    <input type='radio' name='vTS5' id='vTS24' value='4' checked={this.state.vTS5=='4'?'checked':''} onChange={v=>{this.handlechange("vTS5",v,'vTS24')}}/><label for='vTS24'>4</label>

                    <input type='radio' name='vTS5' id='vTS25' value='5' checked={this.state.vTS5=='5'?'checked':''} onChange={v=>{this.handlechange("vTS5",v,'vTS25')}}/><label for='vTS25'>5</label>
                  </b>

                </cell>
              </rect>
              <rect className='alter1 alter2'>
                <cell>
                  <b>
                  领导力胜任力<br/>Leadership Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vAO3?'':'warning'}>以行动为导向/Action Oriented</b>
                  <b className={this.state.vPS3?'':'warning'}>解决问题/Problem Solving</b>
                  <b className={this.state.vDO?'':'warning'}>指导/Direct Others</b>
                  <b className={this.state.vCDR?'':'warning'}>勇于面对下属/Confront Direct Reports</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vAO3' id='vAO11' value='1' checked={this.state.vAO3=='1'?'checked':''} onChange={v=>{this.handlechange("vAO3",v,'vAO11')}}/><label for='vAO11'>1</label>

                    <input type='radio' name='vAO3' id='vAO12' value='2' checked={this.state.vAO3=='2'?'checked':''} onChange={v=>{this.handlechange("vAO3",v,'vAO12')}}/><label for='vAO12'>2</label>

                    <input type='radio' name='vAO3' id='vAO13' value='3' checked={this.state.vAO3=='3'?'checked':''} onChange={v=>{this.handlechange("vAO3",v,'vAO13')}}/><label for='vAO13'>3</label>

                    <input type='radio' name='vAO3' id='vAO14' value='4' checked={this.state.vAO3=='4'?'checked':''} onChange={v=>{this.handlechange("vAO3",v,'vAO14')}}/><label for='vAO14'>4</label>

                    <input type='radio' name='vAO3' id='vAO15' value='5' checked={this.state.vAO3=='5'?'checked':''} onChange={v=>{this.handlechange("vAO3",v,'vAO15')}}/><label for='vAO15'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vPS3' id='vPS11' value='1' checked={this.state.vPS3=='1'?'checked':''} onChange={v=>{this.handlechange("vPS3",v,'vPS11')}}/><label for='vPS11'>1</label>

                    <input type='radio' name='vPS3' id='vPS12' value='2' checked={this.state.vPS3=='2'?'checked':''} onChange={v=>{this.handlechange("vPS3",v,'vPS12')}}/><label for='vPS12'>2</label>

                    <input type='radio' name='vPS3' id='vPS13' value='3' checked={this.state.vPS3=='3'?'checked':''} onChange={v=>{this.handlechange("vPS3",v,'vPS13')}}/><label for='vPS13'>3</label>

                    <input type='radio' name='vPS3' id='vPS14' value='4' checked={this.state.vPS3=='4'?'checked':''} onChange={v=>{this.handlechange("vPS3",v,'vPS14')}}/><label for='vPS14'>4</label>

                    <input type='radio' name='vPS3' id='vPS15' value='5' checked={this.state.vPS3=='5'?'checked':''} onChange={v=>{this.handlechange("vPS3",v,'vPS15')}}/><label for='vPS15'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vDO' id='vDO1' value='1' checked={this.state.vDO=='1'?'checked':''} onChange={v=>{this.handlechange("vDO",v,'vDO1')}}/><label for='vDO1'>1</label>

                    <input type='radio' name='vDO' id='vDO2' value='2' checked={this.state.vDO=='2'?'checked':''} onChange={v=>{this.handlechange("vDO",v,'vDO2')}}/><label for='vDO2'>2</label>

                    <input type='radio' name='vDO' id='vDO3' value='3' checked={this.state.vDO=='3'?'checked':''} onChange={v=>{this.handlechange("vDO",v,'vDO3')}}/><label for='vDO3'>3</label>

                    <input type='radio' name='vDO' id='vDO4' value='4' checked={this.state.vDO=='4'?'checked':''} onChange={v=>{this.handlechange("vDO",v,'vDO4')}}/><label for='vDO4'>4</label>

                    <input type='radio' name='vDO' id='vDO5' value='5' checked={this.state.vDO=='5'?'checked':''} onChange={v=>{this.handlechange("vDO",v,'vDO5')}}/><label for='vDO5'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vCDR' id='vCDR1' value='1' checked={this.state.vCDR=='1'?'checked':''} onChange={v=>{this.handlechange("vCDR",v,'vCDR1')}}/><label for='vCDR1'>1</label>

                    <input type='radio' name='vCDR' id='vCDR2' value='2' checked={this.state.vCDR=='2'?'checked':''} onChange={v=>{this.handlechange("vCDR",v,'vCDR2')}}/><label for='vCDR2'>2</label>

                    <input type='radio' name='vCDR' id='vCDR3' value='3' checked={this.state.vCDR=='3'?'checked':''} onChange={v=>{this.handlechange("vCDR",v,'vCDR3')}}/><label for='vCDR3'>3</label>

                    <input type='radio' name='vCDR' id='vCDR4' value='4' checked={this.state.vCDR=='4'?'checked':''} onChange={v=>{this.handlechange("vCDR",v,'vCDR4')}}/><label for='vCDR4'>4</label>

                    <input type='radio' name='vCDR' id='vCDR5' value='5' checked={this.state.vCDR=='5'?'checked':''} onChange={v=>{this.handlechange("vCDR",v,'vCDR5')}}/><label for='vCDR5'>5</label>
                  </b>
                </cell>
              </rect>
            </div>


            <div ref='S9' className={this.state.chara=='S9/T5/ManagerII'?'':'hidden'}>
              <rect className='alter1 alter6'>
                <cell>
                  <b>
                    技术胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vTS6?'':'warning'}>专业技术/Technical Skills</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vTS6' id='vTS26' value='1' checked={this.state.vTS6=='1'?'checked':''} onChange={v=>{this.handlechange("vTS6",v,'vTS26')}}/><label for='vTS26'>1</label>

                    <input type='radio' name='vTS6' id='vTS27' value='2' checked={this.state.vTS6=='2'?'checked':''} onChange={v=>{this.handlechange("vTS6",v,'vTS27')}}/><label for='vTS27'>2</label>

                    <input type='radio' name='vTS6' id='vTS28' value='3' checked={this.state.vTS6=='3'?'checked':''} onChange={v=>{this.handlechange("vTS6",v,'vTS28')}}/><label for='vTS28'>3</label>

                    <input type='radio' name='vTS6' id='vTS29' value='4' checked={this.state.vTS6=='4'?'checked':''} onChange={v=>{this.handlechange("vTS6",v,'vTS29')}}/><label for='vTS29'>4</label>

                    <input type='radio' name='vTS6' id='vTS30' value='5' checked={this.state.vTS6=='5'?'checked':''} onChange={v=>{this.handlechange("vTS6",v,'vTS30')}}/><label for='vTS30'>5</label>
                  </b>

                </cell>
              </rect>
              <rect className='alter1 alter2 alter7'>
                <cell>
                  <b>
                  领导力胜任力<br/>Leadership Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vDevO?'':'warning'}>培养下属和其他人员/Develop Others</b>
                  <b className={this.state.vPlan?'':'warning'}>制定计划/Planning</b>
                  <b className={this.state.vOrg?'':'warning'}>组织能力/Organization</b>
                  <b className={this.state.vPriS?'':'warning'}>确定轻重缓急/Priority Setting</b>
                  <b className={this.state.vMMW?'':'warning'}>管理与衡量工作/Manager and Measure Work</b>
                </cell>
                <cell>
                <b>
                  <input type='radio' name='vDevO' id='vDevO1' value='1' checked={this.state.vDevO=='1'?'checked':''} onChange={v=>{this.handlechange("vDevO",v,'vDevO1')}}/><label for='vDevO1'>1</label>

                  <input type='radio' name='vDevO' id='vDevO2' value='2' checked={this.state.vDevO=='2'?'checked':''} onChange={v=>{this.handlechange("vDevO",v,'vDevO2')}}/><label for='vDevO2'>2</label>

                  <input type='radio' name='vDevO' id='vDevO3' value='3' checked={this.state.vDevO=='3'?'checked':''} onChange={v=>{this.handlechange("vDevO",v,'vDevO3')}}/><label for='vDevO3'>3</label>

                  <input type='radio' name='vDevO' id='vDevO4' value='4' checked={this.state.vDevO=='4'?'checked':''} onChange={v=>{this.handlechange("vDevO",v,'vDevO4')}}/><label for='vDevO4'>4</label>

                  <input type='radio' name='vDevO' id='vDevO5' value='5' checked={this.state.vDevO=='5'?'checked':''} onChange={v=>{this.handlechange("vDevO",v,'vDevO5')}}/><label for='vDevO5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPlan' id='vPlan1' value='1' checked={this.state.vPlan=='1'?'checked':''} onChange={v=>{this.handlechange("vPlan",v,'vPlan1')}}/><label for='vPlan1'>1</label>

                  <input type='radio' name='vPlan' id='vPlan2' value='2' checked={this.state.vPlan=='2'?'checked':''} onChange={v=>{this.handlechange("vPlan",v,'vPlan2')}}/><label for='vPlan2'>2</label>

                  <input type='radio' name='vPlan' id='vPlan3' value='3' checked={this.state.vPlan=='3'?'checked':''} onChange={v=>{this.handlechange("vPlan",v,'vPlan3')}}/><label for='vPlan3'>3</label>

                  <input type='radio' name='vPlan' id='vPlan4' value='4' checked={this.state.vPlan=='4'?'checked':''} onChange={v=>{this.handlechange("vPlan",v,'vPlan4')}}/><label for='vPlan4'>4</label>

                  <input type='radio' name='vPlan' id='vPlan5' value='5' checked={this.state.vPlan=='5'?'checked':''} onChange={v=>{this.handlechange("vPlan",v,'vPlan5')}}/><label for='vPlan5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vOrg' id='vOrg1' value='1' checked={this.state.vOrg=='1'?'checked':''} onChange={v=>{this.handlechange("vOrg",v,'vOrg1')}}/><label for='vOrg1'>1</label>

                  <input type='radio' name='vOrg' id='vOrg2' value='2' checked={this.state.vOrg=='2'?'checked':''} onChange={v=>{this.handlechange("vOrg",v,'vOrg2')}}/><label for='vOrg2'>2</label>

                  <input type='radio' name='vOrg' id='vOrg3' value='3' checked={this.state.vOrg=='3'?'checked':''} onChange={v=>{this.handlechange("vOrg",v,'vOrg3')}}/><label for='vOrg3'>3</label>

                  <input type='radio' name='vOrg' id='vOrg4' value='4' checked={this.state.vOrg=='4'?'checked':''} onChange={v=>{this.handlechange("vOrg",v,'vOrg4')}}/><label for='vOrg4'>4</label>

                  <input type='radio' name='vOrg' id='vOrg5' value='5' checked={this.state.vOrg=='5'?'checked':''} onChange={v=>{this.handlechange("vOrg",v,'vOrg5')}}/><label for='vOrg5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPriS' id='vPriS1' value='1' checked={this.state.vPriS=='1'?'checked':''} onChange={v=>{this.handlechange("vPriS",v,'vPriS1')}}/><label for='vPriS1'>1</label>

                  <input type='radio' name='vPriS' id='vPriS2' value='2' checked={this.state.vPriS=='2'?'checked':''} onChange={v=>{this.handlechange("vPriS",v,'vPriS2')}}/><label for='vPriS2'>2</label>

                  <input type='radio' name='vPriS' id='vPriS3' value='3' checked={this.state.vPriS=='3'?'checked':''} onChange={v=>{this.handlechange("vPriS",v,'vPriS3')}}/><label for='vPriS3'>3</label>

                  <input type='radio' name='vPriS' id='vPriS4' value='4' checked={this.state.vPriS=='4'?'checked':''} onChange={v=>{this.handlechange("vPriS",v,'vPriS4')}}/><label for='vPriS4'>4</label>

                  <input type='radio' name='vPriS' id='vPriS5' value='5' checked={this.state.vPriS=='5'?'checked':''} onChange={v=>{this.handlechange("vPriS",v,'vPriS5')}}/><label for='vPriS5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vMMW' id='vMMW1' value='1' checked={this.state.vMMW=='1'?'checked':''} onChange={v=>{this.handlechange("vMMW",v,'vMMW1')}}/><label for='vMMW1'>1</label>

                  <input type='radio' name='vMMW' id='vMMW2' value='2' checked={this.state.vMMW=='2'?'checked':''} onChange={v=>{this.handlechange("vMMW",v,'vMMW2')}}/><label for='vMMW2'>2</label>

                  <input type='radio' name='vMMW' id='vMMW3' value='3' checked={this.state.vMMW=='3'?'checked':''} onChange={v=>{this.handlechange("vMMW",v,'vMMW3')}}/><label for='vMMW3'>3</label>

                  <input type='radio' name='vMMW' id='vMMW4' value='4' checked={this.state.vMMW=='4'?'checked':''} onChange={v=>{this.handlechange("vMMW",v,'vMMW4')}}/><label for='vMMW4'>4</label>

                  <input type='radio' name='vMMW' id='vMMW5' value='5' checked={this.state.vMMW=='5'?'checked':''} onChange={v=>{this.handlechange("vMMW",v,'vMMW5')}}/><label for='vMMW5'>5</label>
                </b>
                </cell>
              </rect>
            </div>

            <div ref='S10' className={this.state.chara=='S10/T6/Sr.Manager'?'':'hidden'}>
              <rect className='alter1 alter6'>
                <cell>
                  <b>
                    技术胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vTS7?'':'warning'}>专业技术/Technical Skills</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vTS7' id='vTS31' value='1' checked={this.state.vTS7=='1'?'checked':''} onChange={v=>{this.handlechange("vTS7",v,'vTS31')}}/><label for='vTS31'>1</label>

                    <input type='radio' name='vTS7' id='vTS32' value='2' checked={this.state.vTS7=='2'?'checked':''} onChange={v=>{this.handlechange("vTS7",v,'vTS32')}}/><label for='vTS32'>2</label>

                    <input type='radio' name='vTS7' id='vTS33' value='3' checked={this.state.vTS7=='3'?'checked':''} onChange={v=>{this.handlechange("vTS7",v,'vTS33')}}/><label for='vTS33'>3</label>

                    <input type='radio' name='vTS7' id='vTS34' value='4' checked={this.state.vTS7=='4'?'checked':''} onChange={v=>{this.handlechange("vTS7",v,'vTS34')}}/><label for='vTS34'>4</label>

                    <input type='radio' name='vTS7' id='vTS35' value='5' checked={this.state.vTS7=='5'?'checked':''} onChange={v=>{this.handlechange("vTS7",v,'vTS35')}}/><label for='vTS35'>5</label>
                  </b>

                </cell>
              </rect>
              <rect className='alter1 alter2 alter7'>
                <cell>
                  <b>
                    领导力胜任力<br/>Leadership Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vBET?'':'warning'}>组建高效团队/Build Effective Teams</b>
                  <b className={this.state.vPM?'':'warning'}>流程管理/Process Management</b>
                  <b className={this.state.vMoOt?'':'warning'}>激励他人/Mottivating Others</b>
                  <b className={this.state.vCM?'':'warning'}>冲突管理/Conflict Management</b>
                  <b className={this.state.vDQ?'':'warning'}>决策质量/Decision Quality</b>
                </cell>
                <cell>
                <b>
                  <input type='radio' name='vBET' id='vBET1' value='1' checked={this.state.vBET=='1'?'checked':''} onChange={v=>{this.handlechange("vBET",v,'vBET1')}}/><label for='vBET1'>1</label>

                  <input type='radio' name='vBET' id='vBET2' value='2' checked={this.state.vBET=='2'?'checked':''} onChange={v=>{this.handlechange("vBET",v,'vBET2')}}/><label for='vBET2'>2</label>

                  <input type='radio' name='vBET' id='vBET3' value='3' checked={this.state.vBET=='3'?'checked':''} onChange={v=>{this.handlechange("vBET",v,'vBET3')}}/><label for='vBET3'>3</label>

                  <input type='radio' name='vBET' id='vBET4' value='4' checked={this.state.vBET=='4'?'checked':''} onChange={v=>{this.handlechange("vBET",v,'vBET4')}}/><label for='vBET4'>4</label>

                  <input type='radio' name='vBET' id='vBET5' value='5' checked={this.state.vBET=='5'?'checked':''} onChange={v=>{this.handlechange("vBET",v,'vBET5')}}/><label for='vBET5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPM' id='vPM1' value='1' checked={this.state.vPM=='1'?'checked':''} onChange={v=>{this.handlechange("vPM",v,'vPM1')}}/><label for='vPM1'>1</label>

                  <input type='radio' name='vPM' id='vPM2' value='2' checked={this.state.vPM=='2'?'checked':''} onChange={v=>{this.handlechange("vPM",v,'vPM2')}}/><label for='vPM2'>2</label>

                  <input type='radio' name='vPM' id='vPM3' value='3' checked={this.state.vPM=='3'?'checked':''} onChange={v=>{this.handlechange("vPM",v,'vPM3')}}/><label for='vPM3'>3</label>

                  <input type='radio' name='vPM' id='vPM4' value='4' checked={this.state.vPM=='4'?'checked':''} onChange={v=>{this.handlechange("vPM",v,'vPM4')}}/><label for='vPM4'>4</label>

                  <input type='radio' name='vPM' id='vPM5' value='5' checked={this.state.vPM=='5'?'checked':''} onChange={v=>{this.handlechange("vPM",v,'vPM5')}}/><label for='vPM5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vMoOt' id='vMoOt1' value='1' checked={this.state.vMoOt=='1'?'checked':''} onChange={v=>{this.handlechange("vMoOt",v,'vMoOt1')}}/><label for='vMoOt1'>1</label>

                  <input type='radio' name='vMoOt' id='vMoOt2' value='2' checked={this.state.vMoOt=='2'?'checked':''} onChange={v=>{this.handlechange("vMoOt",v,'vMoOt2')}}/><label for='vMoOt2'>2</label>

                  <input type='radio' name='vMoOt' id='vMoOt3' value='3' checked={this.state.vMoOt=='3'?'checked':''} onChange={v=>{this.handlechange("vMoOt",v,'vMoOt3')}}/><label for='vMoOt3'>3</label>

                  <input type='radio' name='vMoOt' id='vMoOt4' value='4' checked={this.state.vMoOt=='4'?'checked':''} onChange={v=>{this.handlechange("vMoOt",v,'vMoOt4')}}/><label for='vMoOt4'>4</label>

                  <input type='radio' name='vMoOt' id='vMoOt5' value='5' checked={this.state.vMoOt=='5'?'checked':''} onChange={v=>{this.handlechange("vMoOt",v,'vMoOt5')}}/><label for='vMoOt5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vCM' id='vCM1' value='1' checked={this.state.vCM=='1'?'checked':''} onChange={v=>{this.handlechange("vCM",v,'vCM1')}}/><label for='vCM1'>1</label>

                  <input type='radio' name='vCM' id='vCM2' value='2' checked={this.state.vCM=='2'?'checked':''} onChange={v=>{this.handlechange("vCM",v,'vCM2')}}/><label for='vCM2'>2</label>

                  <input type='radio' name='vCM' id='vCM3' value='3' checked={this.state.vCM=='3'?'checked':''} onChange={v=>{this.handlechange("vCM",v,'vCM3')}}/><label for='vCM3'>3</label>

                  <input type='radio' name='vCM' id='vCM4' value='4' checked={this.state.vCM=='4'?'checked':''} onChange={v=>{this.handlechange("vCM",v,'vCM4')}}/><label for='vCM4'>4</label>

                  <input type='radio' name='vCM' id='vCM5' value='5' checked={this.state.vCM=='5'?'checked':''} onChange={v=>{this.handlechange("vCM",v,'vCM5')}}/><label for='vCM5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vDQ' id='vDQ1' value='1' checked={this.state.vDQ=='1'?'checked':''} onChange={v=>{this.handlechange("vDQ",v,'vDQ1')}}/><label for='vDQ1'>1</label>

                  <input type='radio' name='vDQ' id='vDQ2' value='2' checked={this.state.vDQ=='2'?'checked':''} onChange={v=>{this.handlechange("vDQ",v,'vDQ2')}}/><label for='vDQ2'>2</label>

                  <input type='radio' name='vDQ' id='vDQ3' value='3' checked={this.state.vDQ=='3'?'checked':''} onChange={v=>{this.handlechange("vDQ",v,'vDQ3')}}/><label for='vDQ3'>3</label>

                  <input type='radio' name='vDQ' id='vDQ4' value='4' checked={this.state.vDQ=='4'?'checked':''} onChange={v=>{this.handlechange("vDQ",v,'vDQ4')}}/><label for='vDQ4'>4</label>

                  <input type='radio' name='vDQ' id='vDQ5' value='5' checked={this.state.vDQ=='5'?'checked':''} onChange={v=>{this.handlechange("vDQ",v,'vDQ5')}}/><label for='vDQ5'>5</label>
                </b>
                </cell>
              </rect>
            </div>

            <div ref='Tech' className={this.state.chara=='Technician'?'':'hidden'}>
              <rect className='alter1 alter6'>
                <cell>
                  <b>
                    技术胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vTS8?'':'warning'}>专业技术/Technical Skills</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vTS8' id='vTS36' value='1' checked={this.state.vTS8=='1'?'checked':''} onChange={v=>{this.handlechange("vTS8",v,'vTS36')}}/><label for='vTS36'>1</label>

                    <input type='radio' name='vTS8' id='vTS37' value='2' checked={this.state.vTS8=='2'?'checked':''} onChange={v=>{this.handlechange("vTS8",v,'vTS37')}}/><label for='vTS37'>2</label>

                    <input type='radio' name='vTS8' id='vTS38' value='3' checked={this.state.vTS8=='3'?'checked':''} onChange={v=>{this.handlechange("vTS8",v,'vTS38')}}/><label for='vTS38'>3</label>

                    <input type='radio' name='vTS8' id='vTS39' value='4' checked={this.state.vTS8=='4'?'checked':''} onChange={v=>{this.handlechange("vTS8",v,'vTS39')}}/><label for='vTS39'>4</label>

                    <input type='radio' name='vTS8' id='vTS40' value='5' checked={this.state.vTS8=='5'?'checked':''} onChange={v=>{this.handlechange("vTS8",v,'vTS40')}}/><label for='vTS40'>5</label>
                  </b>

                </cell>
              </rect>
              <rect className='alter1 alter2 '>
                <cell>
                  <b>
                    岗位胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vPreSk?'':'warning'}>表达技能/Presentation Skills</b>
                  <b className={this.state.vProSol?'':'warning'}>解决问题/Problem Solving</b>
                  <b className={this.state.vPeRe?'':'warning'}>同事关系/Peer Relationship</b>
                  <b className={this.state.vAcOr?'':'warning'}>以行动为导向/Action Oriented</b>
                </cell>
                <cell>
                <b>
                  <input type='radio' name='vPreSk' id='vPreSk1' value='1' checked={this.state.vPreSk=='1'?'checked':''} onChange={v=>{this.handlechange("vPreSk",v,'vPreSk1')}}/><label for='vPreSk1'>1</label>

                  <input type='radio' name='vPreSk' id='vPreSk2' value='2' checked={this.state.vPreSk=='2'?'checked':''} onChange={v=>{this.handlechange("vPreSk",v,'vPreSk2')}}/><label for='vPreSk2'>2</label>

                  <input type='radio' name='vPreSk' id='vPreSk3' value='3' checked={this.state.vPreSk=='3'?'checked':''} onChange={v=>{this.handlechange("vPreSk",v,'vPreSk3')}}/><label for='vPreSk3'>3</label>

                  <input type='radio' name='vPreSk' id='vPreSk4' value='4' checked={this.state.vPreSk=='4'?'checked':''} onChange={v=>{this.handlechange("vPreSk",v,'vPreSk4')}}/><label for='vPreSk4'>4</label>

                  <input type='radio' name='vPreSk' id='vPreSk5' value='5' checked={this.state.vPreSk=='5'?'checked':''} onChange={v=>{this.handlechange("vPreSk",v,'vPreSk5')}}/><label for='vPreSk5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vProSol' id='vProSol1' value='1' checked={this.state.vProSol=='1'?'checked':''} onChange={v=>{this.handlechange("vProSol",v,'vProSol1')}}/><label for='vProSol1'>1</label>

                  <input type='radio' name='vProSol' id='vProSol2' value='2' checked={this.state.vProSol=='2'?'checked':''} onChange={v=>{this.handlechange("vProSol",v,'vProSol2')}}/><label for='vProSol2'>2</label>

                  <input type='radio' name='vProSol' id='vProSol3' value='3' checked={this.state.vProSol=='3'?'checked':''} onChange={v=>{this.handlechange("vProSol",v,'vProSol3')}}/><label for='vProSol3'>3</label>

                  <input type='radio' name='vProSol' id='vProSol4' value='4' checked={this.state.vProSol=='4'?'checked':''} onChange={v=>{this.handlechange("vProSol",v,'vProSol4')}}/><label for='vProSol4'>4</label>

                  <input type='radio' name='vProSol' id='vProSol5' value='5' checked={this.state.vProSol=='5'?'checked':''} onChange={v=>{this.handlechange("vProSol",v,'vProSol5')}}/><label for='vProSol5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPeRe' id='vPeRe1' value='1' checked={this.state.vPeRe=='1'?'checked':''} onChange={v=>{this.handlechange("vPeRe",v,'vPeRe1')}}/><label for='vPeRe1'>1</label>

                  <input type='radio' name='vPeRe' id='vPeRe2' value='2' checked={this.state.vPeRe=='2'?'checked':''} onChange={v=>{this.handlechange("vPeRe",v,'vPeRe2')}}/><label for='vPeRe2'>2</label>

                  <input type='radio' name='vPeRe' id='vPeRe3' value='3' checked={this.state.vPeRe=='3'?'checked':''} onChange={v=>{this.handlechange("vPeRe",v,'vPeRe3')}}/><label for='vPeRe3'>3</label>

                  <input type='radio' name='vPeRe' id='vPeRe4' value='4' checked={this.state.vPeRe=='4'?'checked':''} onChange={v=>{this.handlechange("vPeRe",v,'vPeRe4')}}/><label for='vPeRe4'>4</label>

                  <input type='radio' name='vPeRe' id='vPeRe5' value='5' checked={this.state.vPeRe=='5'?'checked':''} onChange={v=>{this.handlechange("vPeRe",v,'vPeRe5')}}/><label for='vPeRe5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vAcOr' id='vAcOr1' value='1' checked={this.state.vAcOr=='1'?'checked':''} onChange={v=>{this.handlechange("vAcOr",v,'vAcOr1')}}/><label for='vAcOr1'>1</label>

                  <input type='radio' name='vAcOr' id='vAcOr2' value='2' checked={this.state.vAcOr=='2'?'checked':''} onChange={v=>{this.handlechange("vAcOr",v,'vAcOr2')}}/><label for='vAcOr2'>2</label>

                  <input type='radio' name='vAcOr' id='vAcOr3' value='3' checked={this.state.vAcOr=='3'?'checked':''} onChange={v=>{this.handlechange("vAcOr",v,'vAcOr3')}}/><label for='vAcOr3'>3</label>

                  <input type='radio' name='vAcOr' id='vAcOr4' value='4' checked={this.state.vAcOr=='4'?'checked':''} onChange={v=>{this.handlechange("vAcOr",v,'vAcOr4')}}/><label for='vAcOr4'>4</label>

                  <input type='radio' name='vAcOr' id='vAcOr5' value='5' checked={this.state.vAcOr=='5'?'checked':''} onChange={v=>{this.handlechange("vAcOr",v,'vAcOr5')}}/><label for='vAcOr5'>5</label>
                </b>
                </cell>
              </rect>
            </div>

            <div ref='Fresh' className={this.state.chara=='应届生'?'':'hidden'}>
              <rect className='alter1 alter6'>
                <cell>
                  <b>
                    技术胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vTS9?'':'warning'}>专业技术/Technical Skills</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vTS9' id='vTS41' value='1' checked={this.state.vTS9=='1'?'checked':''} onChange={v=>{this.handlechange("vTS9",v,'vTS41')}}/><label for='vTS41'>1</label>

                    <input type='radio' name='vTS9' id='vTS42' value='2' checked={this.state.vTS9=='2'?'checked':''} onChange={v=>{this.handlechange("vTS9",v,'vTS42')}}/><label for='vTS42'>2</label>

                    <input type='radio' name='vTS9' id='vTS43' value='3' checked={this.state.vTS9=='3'?'checked':''} onChange={v=>{this.handlechange("vTS9",v,'vTS43')}}/><label for='vTS43'>3</label>

                    <input type='radio' name='vTS9' id='vTS44' value='4' checked={this.state.vTS9=='4'?'checked':''} onChange={v=>{this.handlechange("vTS9",v,'vTS44')}}/><label for='vTS44'>4</label>

                    <input type='radio' name='vTS9' id='vTS45' value='5' checked={this.state.vTS9=='5'?'checked':''} onChange={v=>{this.handlechange("vTS9",v,'vTS45')}}/><label for='vTS45'>5</label>
                  </b>

                </cell>
              </rect>
              <rect className='alter1 alter2 alter7'>
                <cell>
                  <b>
                    岗位胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b className={this.state.vcrea?'':'warning'}>创造力/Creativity</b>
                  <b className={this.state.vPresentSkill?'':'warning'}>沟通能力/Presentation Skills</b>
                  <b className={this.state.vProblemSol?'':'warning'}>分析解决问题/Problem Solving</b>
                  <b className={this.state.vPeerRel?'':'warning'}>团队合作/Peer Relationship</b>
                  <b className={this.state.vPersonaLe?'':'warning'}>学习能力/Personal Learning</b>
                </cell>
                <cell>
                <b>
                  <input type='radio' name='vcrea' id='vcrea1' value='1' checked={this.state.vcrea=='1'?'checked':''} onChange={v=>{this.handlechange("vcrea",v,'vcrea1')}}/><label for='vcrea1'>1</label>

                  <input type='radio' name='vcrea' id='vcrea2' value='2' checked={this.state.vcrea=='2'?'checked':''} onChange={v=>{this.handlechange("vcrea",v,'vcrea2')}}/><label for='vcrea2'>2</label>

                  <input type='radio' name='vcrea' id='vcrea3' value='3' checked={this.state.vcrea=='3'?'checked':''} onChange={v=>{this.handlechange("vcrea",v,'vcrea3')}}/><label for='vcrea3'>3</label>

                  <input type='radio' name='vcrea' id='vcrea4' value='4' checked={this.state.vcrea=='4'?'checked':''} onChange={v=>{this.handlechange("vcrea",v,'vcrea4')}}/><label for='vcrea4'>4</label>

                  <input type='radio' name='vcrea' id='vcrea5' value='5' checked={this.state.vcrea=='5'?'checked':''} onChange={v=>{this.handlechange("vcrea",v,'vcrea5')}}/><label for='vcrea5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPresentSkill' id='vPresentSkill1' value='1' checked={this.state.vPresentSkill=='1'?'checked':''} onChange={v=>{this.handlechange("vPresentSkill",v,'vPresentSkill1')}}/><label for='vPresentSkill1'>1</label>

                  <input type='radio' name='vPresentSkill' id='vPresentSkill2' value='2' checked={this.state.vPresentSkill=='2'?'checked':''} onChange={v=>{this.handlechange("vPresentSkill",v,'vPresentSkill2')}}/><label for='vPresentSkill2'>2</label>

                  <input type='radio' name='vPresentSkill' id='vPresentSkill3' value='3' checked={this.state.vPresentSkill=='3'?'checked':''} onChange={v=>{this.handlechange("vPresentSkill",v,'vPresentSkill3')}}/><label for='vPresentSkill3'>3</label>

                  <input type='radio' name='vPresentSkill' id='vPresentSkill4' value='4' checked={this.state.vPresentSkill=='4'?'checked':''} onChange={v=>{this.handlechange("vPresentSkill",v,'vPresentSkill4')}}/><label for='vPresentSkill4'>4</label>

                  <input type='radio' name='vPresentSkill' id='vPresentSkill5' value='5' checked={this.state.vPresentSkill=='5'?'checked':''} onChange={v=>{this.handlechange("vPresentSkill",v,'vPresentSkill5')}}/><label for='vPresentSkill5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vProblemSol' id='vProblemSol1' value='1' checked={this.state.vProblemSol=='1'?'checked':''} onChange={v=>{this.handlechange("vProblemSol",v,'vProblemSol1')}}/><label for='vProblemSol1'>1</label>

                  <input type='radio' name='vProblemSol' id='vProblemSol2' value='2' checked={this.state.vProblemSol=='2'?'checked':''} onChange={v=>{this.handlechange("vProblemSol",v,'vProblemSol2')}}/><label for='vProblemSol2'>2</label>

                  <input type='radio' name='vProblemSol' id='vProblemSol3' value='3' checked={this.state.vProblemSol=='3'?'checked':''} onChange={v=>{this.handlechange("vProblemSol",v,'vProblemSol3')}}/><label for='vProblemSol3'>3</label>

                  <input type='radio' name='vProblemSol' id='vProblemSol4' value='4' checked={this.state.vProblemSol=='4'?'checked':''} onChange={v=>{this.handlechange("vProblemSol",v,'vProblemSol4')}}/><label for='vProblemSol4'>4</label>

                  <input type='radio' name='vProblemSol' id='vProblemSol5' value='5' checked={this.state.vProblemSol=='5'?'checked':''} onChange={v=>{this.handlechange("vProblemSol",v,'vProblemSol5')}}/><label for='vProblemSol5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPeerRel' id='vPeerRel1' value='1' checked={this.state.vPeerRel=='1'?'checked':''} onChange={v=>{this.handlechange("vPeerRel",v,'vPeerRel1')}}/><label for='vPeerRel1'>1</label>

                  <input type='radio' name='vPeerRel' id='vPeerRel2' value='2' checked={this.state.vPeerRel=='2'?'checked':''} onChange={v=>{this.handlechange("vPeerRel",v,'vPeerRel2')}}/><label for='vPeerRel2'>2</label>

                  <input type='radio' name='vPeerRel' id='vPeerRel3' value='3' checked={this.state.vPeerRel=='3'?'checked':''} onChange={v=>{this.handlechange("vPeerRel",v,'vPeerRel3')}}/><label for='vPeerRel3'>3</label>

                  <input type='radio' name='vPeerRel' id='vPeerRel4' value='4' checked={this.state.vPeerRel=='4'?'checked':''} onChange={v=>{this.handlechange("vPeerRel",v,'vPeerRel4')}}/><label for='vPeerRel4'>4</label>

                  <input type='radio' name='vPeerRel' id='vPeerRel5' value='5' checked={this.state.vPeerRel=='5'?'checked':''} onChange={v=>{this.handlechange("vPeerRel",v,'vPeerRel5')}}/><label for='vPeerRel5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPersonaLe' id='vPersonaLe1' value='1' checked={this.state.vPersonaLe=='1'?'checked':''} onChange={v=>{this.handlechange("vPersonaLe",v,'vPersonaLe1')}}/><label for='vPersonaLe1'>1</label>

                  <input type='radio' name='vPersonaLe' id='vPersonaLe2' value='2' checked={this.state.vPersonaLe=='2'?'checked':''} onChange={v=>{this.handlechange("vPersonaLe",v,'vPersonaLe2')}}/><label for='vPersonaLe2'>2</label>

                  <input type='radio' name='vPersonaLe' id='vPersonaLe3' value='3' checked={this.state.vPersonaLe=='3'?'checked':''} onChange={v=>{this.handlechange("vPersonaLe",v,'vPersonaLe3')}}/><label for='vPersonaLe3'>3</label>

                  <input type='radio' name='vPersonaLe' id='vPersonaLe4' value='4' checked={this.state.vPersonaLe=='4'?'checked':''} onChange={v=>{this.handlechange("vPersonaLe",v,'vPersonaLe4')}}/><label for='vPersonaLe4'>4</label>

                  <input type='radio' name='vPersonaLe' id='vPersonaLe5' value='5' checked={this.state.vPersonaLe=='5'?'checked':''} onChange={v=>{this.handlechange("vPersonaLe",v,'vPersonaLe5')}}/><label for='vPersonaLe5'>5</label>
                </b>
                </cell>
              </rect>
            </div>

            <rect className='alter1 alter2'>
              <cell>
                <b>
                  核心胜任力<br/>Core Competency(价值观)
                </b>
              </cell>
              <cell>
                <b className={this.state.vIT?'':'warning'}>诚信为本/Integrity and Trust</b>
                <b className={this.state.vLA?'':'warning'} >善于学习/Learning Agility</b>
                <b className={this.state.vCF?'':'warning'}>客户导向/Customer Focus</b>
                <b className={this.state.vDR?'':'warning'}>追求成效/Drive for Results</b>
              </cell>
              <cell>
                <b>
                  <input type='radio' name='vIT' id='vIT1' value='1' checked={this.state.vIT=='1'?'checked':''} onChange={v=>{this.handlechange("vIT",v,'vIT1')}}/><label for='vIT1'>1</label>

                  <input type='radio' name='vIT' id='vIT2' value='2' checked={this.state.vIT=='2'?'checked':''} onChange={v=>{this.handlechange("vIT",v,'vIT2')}}/><label for='vIT2'>2</label>

                  <input type='radio' name='vIT' id='vIT3' value='3' checked={this.state.vIT=='3'?'checked':''} onChange={v=>{this.handlechange("vIT",v,'vIT3')}}/><label for='vIT3'>3</label>

                  <input type='radio' name='vIT' id='vIT4' value='4' checked={this.state.vIT=='4'?'checked':''} onChange={v=>{this.handlechange("vIT",v,'vIT4')}}/><label for='vIT4'>4</label>

                  <input type='radio' name='vIT' id='vIT5' value='5' checked={this.state.vIT=='5'?'checked':''} onChange={v=>{this.handlechange("vIT",v,'vIT5')}}/><label for='vIT5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vLA' id='vLA1' value='1' checked={this.state.vLA=='1'?'checked':''} onChange={v=>{this.handlechange("vLA",v,'vLA1')}}/><label for='vLA1'>1</label>

                  <input type='radio' name='vLA' id='vLA2' value='2' checked={this.state.vLA=='2'?'checked':''} onChange={v=>{this.handlechange("vLA",v,'vLA2')}}/><label for='vLA2'>2</label>

                  <input type='radio' name='vLA' id='vLA3' value='3' checked={this.state.vLA=='3'?'checked':''} onChange={v=>{this.handlechange("vLA",v,'vLA3')}}/><label for='vLA3'>3</label>

                  <input type='radio' name='vLA' id='vLA4' value='4' checked={this.state.vLA=='4'?'checked':''} onChange={v=>{this.handlechange("vLA",v,'vLA4')}}/><label for='vLA4'>4</label>

                  <input type='radio' name='vLA' id='vLA5' value='5' checked={this.state.vLA=='5'?'checked':''} onChange={v=>{this.handlechange("vLA",v,'vLA5')}}/><label for='vLA5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vCF' id='vCF1' value='1' checked={this.state.vCF=='1'?'checked':''} onChange={v=>{this.handlechange("vCF",v,'vCF1')}}/><label for='vCF1'>1</label>

                  <input type='radio' name='vCF' id='vCF2' value='2' checked={this.state.vCF=='2'?'checked':''} onChange={v=>{this.handlechange("vCF",v,'vCF2')}}/><label for='vCF2'>2</label>

                  <input type='radio' name='vCF' id='vCF3' value='3' checked={this.state.vCF=='3'?'checked':''} onChange={v=>{this.handlechange("vCF",v,'vCF3')}}/><label for='vCF3'>3</label>

                  <input type='radio' name='vCF' id='vCF4' value='4' checked={this.state.vCF=='4'?'checked':''} onChange={v=>{this.handlechange("vCF",v,'vCF4')}}/><label for='vCF4'>4</label>

                  <input type='radio' name='vCF' id='vCF5' value='5' checked={this.state.vCF=='5'?'checked':''} onChange={v=>{this.handlechange("vCF",v,'vCF5')}}/><label for='vCF5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vDR' id='vDR1' value='1' checked={this.state.vDR=='1'?'checked':''} onChange={v=>{this.handlechange("vDR",v,'vDR1')}}/><label for='vDR1'>1</label>

                  <input type='radio' name='vDR' id='vDR2' value='2' checked={this.state.vDR=='2'?'checked':''} onChange={v=>{this.handlechange("vDR",v,'vDR2')}}/><label for='vDR2'>2</label>

                  <input type='radio' name='vDR' id='vDR3' value='3' checked={this.state.vDR=='3'?'checked':''} onChange={v=>{this.handlechange("vDR",v,'vDR3')}}/><label for='vDR3'>3</label>

                  <input type='radio' name='vDR' id='vDR4' value='4' checked={this.state.vDR=='4'?'checked':''} onChange={v=>{this.handlechange("vDR",v,'vDR4')}}/><label for='vDR4'>4</label>

                  <input type='radio' name='vDR' id='vDR5' value='5' checked={this.state.vDR=='5'?'checked':''} onChange={v=>{this.handlechange("vDR",v,'vDR5')}}/><label for='vDR5'>5</label>
                </b>
              </cell>
            </rect>

              <rect className='wholeLine'>
                <b>评分说明/Instructions:</b>
                <p>5-远超职位要求/Extremly exceed the expectation; 4-超过职位要求/Exceed the expectation; 3-符合职位要求/Meet the expectation; 2-未达到职位要求/Below the expextation; 1-远不及职位要求/Extremely below the expectation</p>
              </rect>
              <rect>
                <cell className='alter5'>
                  <b className={this.state.groupInter?'':'warning'}>
                    小组面试评估<br/>Group Interview Comments
                  </b>
                </cell>
                <cell>
                  <textarea className='GIC' value={this.state.groupInter} onChange={v=>{this.handlechange("groupInter",v)}}>
                  </textarea>
                </cell>
              </rect>
              <rect>
                <cell>
                  <b>
                    建议复试项<br/>Propose for Retrial
                  </b>
                </cell>
                <cell>
                  <textarea value={this.state.p4r} onChange={v=>{this.handlechange("p4r",v)}}>
                  </textarea>
                </cell>
              </rect>
              <rect style={{borderBottom:'1px solid #000'}}>
                <cell className='alter3'>
                  <b className={this.state.GHB?'':'warning'}>小组面试结论<br/>Group Hiring Decision</b>
                </cell>
                <cell>
                <input type='radio' name='GHB' id='hire' value='hire' checked={this.state.GHB=='hire'?'checked':''} onChange={v=>{this.handlechange("GHB",v,'hire')}}/><label for='hire'>Hire 聘用</label>
                <input type='radio' name='GHB' id='reject' value='reject' checked={this.state.GHB=='reject'?'checked':''} onChange={v=>{this.handlechange("GHB",v,'reject')}}/><label for='reject'>Reject 淘汰</label>
                <input type='radio' name='GHB' id='backup' value='backup' checked={this.state.GHB=='backup'?'checked':''} onChange={v=>{this.handlechange("GHB",v,'backup')}}/><label for='backup'>Backup 保留</label>
                <br/>
                <input type='radio' name='GHB' id='rec2other' value='rec2other' checked={this.state.GHB=='rec2other'?'checked':''} onChange={v=>{this.handlechange("GHB",v,'rec2other')}}/><label for='rec2other'>Recommend to other position 推荐其他岗位</label>
                <input type='text'className='fillText' value={this.state.hiOther} onChange={v=>{this.handlechange("hiOther",v)}}/>
                <br/>
                <b>签名/Signature:</b>
                <input type='text'className='fillText alterFill'/>
                <b className={this.state.date?'':'warning'}>日期/Date:</b>
                <input  style={{width:'120px'}} type='date'className='fillText' value={this.state.date} onChange={v=>{this.handlechange("date",v)}}/>
                </cell>
              </rect>
              <div className={this.state.round2=='Y'?'':'hidden'}  style={{marginBottom:'80px',borderBottom:'1px solid #000'}}>
                <rect className='wholeLine'>
                  <h4>复试评价记录 Retrial Comments</h4>
                </rect>
                <rect>
                  <cell className='alter4'>
                    <b >复试评语<br/>Second Round Interview</b>
                  </cell>
                  <cell>
                    <textarea value={this.state.secRound} onChange={v=>{this.handlechange("secRound",v)}}></textarea>
                    <b className={this.state.SRI?'':'warning'}>Hiring Decision：</b>
                    <input type='radio' name='SRI' id='hire2' value='hire2' checked={this.state.SRI=='hire2'?'checked':''} onChange={v=>{this.handlechange("SRI",v,'hire2')}}/><label for='hire2'>Hire 聘用</label>
                    <input type='radio' name='SRI' id='reject2' value='reject2' checked={this.state.SRI=='reject2'?'checked':''} onChange={v=>{this.handlechange("SRI",v,'reject2')}}/><label for='reject2'>Reject 淘汰</label>
                    <input type='radio' name='SRI' id='backup2' value='backup2' checked={this.state.SRI=='backup2'?'checked':''} onChange={v=>{this.handlechange("SRI",v,'backup2')}}/><label for='backup2'>Backup 保留</label>
                    <br/>
                    <b style={{marginRight:'24px'}}>面试官/Interviewer:</b><input type='text'className='fillText' style={{width:'136px'}}value={this.state.interviewer2} onChange={v=>{this.handlechange("interviewer2",v)}}/>

                    <b className={this.state.date2?'':'warning'}>日期/Date:</b>
                    <input  style={{width:'120px'}} type='date'className='fillText' value={this.state.date2} onChange={v=>{this.handlechange("date2",v)}}/>

                  </cell>
                </rect>
              </div>
          </div>

        </div>
        </Spin>
      </div>

    )
  }
}
export default InterviewAssessment;
