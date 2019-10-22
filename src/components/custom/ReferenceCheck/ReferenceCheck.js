
import React, { Component } from 'react';
import './ReferenceCheck.less';
import http from 'Util20/api';
import {
  Button,
  Icon,
  Spin,
  Modal
} from 'antd';

class ReferenceCheck extends React.Component {
  state = {
    chara:'hr',
    date:'',
    candiName:'',
    coName:'',
    reName:'',
    title:'',
    phone:'',
    mail:'',
    rel:'',
    Management:'',
    LineManager:'',
    Colleague:'',
    Client:'',
    q1:'',
    q2:'',
    q3:'',
    q4:'',
    q5:'',
    q6:'',
    q7:'',
    q8:'',
    q9:'',
    q10:'',
    q11:'',
    q12:'',
    q13:'',
    q14:'',
    Management2:'',
    directManager:'',
    coworkers:'',
    Client2:'',
    skillWO:'',
    skillTM:'',
    q1hr:'',
    q2hr:'',
    q3hr:'',
    q5hr:''
  };

  subData = async (id) =>{
    this.setState({loading:true});

    let res;
    try {
      res = await http().modifyRecords({
        resid: 613152614705,
        cmswhere: `REC_ID=${this.props.record.REC_ID}`,
        data:[{
         REC_ID:this.props.record.REC_ID,
         checkDateHr:this.state.date,
         CandidateName:this.state.candiName,
         comNameHr:this.state.coName,
         nameHr:this.state.reName,
         refereceTitleHr:this.state.title,
         referPhoneHr:this.state.phone,
         referenceEmaiHr:this.state.mail,
         RelationAndCandidate:this.state.rel,
         candidateOndate:this.state.q1hr,
         candidateTerminalDateHr:this.state.q2hr,
         candidateTitleAndDeptHr:this.state.q3hr,
         LineRealationHr:this.state.LineManager,
         colleagueRealationHr:this.state.Colleague,
         manangeRealtionHr:this.state.Management,
         clientRealationHr:this.state.Client,
         reasonForLeaveHr:this.state.q5hr,
         knowLongSuper:this.state.q1,
         positionAndJobSuper:this.state.q2,
         projectSuper:this.state.q3,
         commentAndAttitudeSuper:this.state.q4,
         confirmEmployeDateSuper:this.state.q5,
         considerStrengthSuper:this.state.q6,
         considerAreaImprovSuper:this.state.q7,
         describeOrientedSuper:this.state.q9,
         manageRelationSuper:this.stateManagement2,
         directManagerRelationSuper:this.state.directManager,
         coworkerRelationSuper:this.state.coworkers,
         clientRelationSuper:this.state.Client2,
         skillWO:this.state.skillWO,//缺
         commentManageSkillsSuper:this.state.q10,
         commentTimeManageSkillsSuper:this.state.q11,//缺
         skillTM:this.state.skillTM,//缺
         positionSuitSuper:this.state.q12,
         reasonForleaveSuper:this.state.q13,
         reHireSuper:this.state.q14,
         referenceCategory:this.state.chara

      }]
    });

      this.setState({loading:false});
      Modal.success({
        title: '提交成功',
        content: '',
        onOk() {
          window.location.reload();
        }
      });

    } catch (err) {
      Modal.error({
        title: '提示',
        content: err.message
      });
      this.setState({loading:false});

    }
  }
  getInfo = async (id) => {
    this.setState({loading:true});

    let res;
    try {
      res = await http().getTable({
        resid: 613152614705,
        cmswhere: `REC_ID=${id}`
      });
      this.setState({
        chara:res.data[0].referenceCategory,
        date:res.data[0].checkDateHr,
        candiName:res.data[0].CandidateName,
        coName:res.data[0].comNameHr,
        reName:res.data[0].nameHr,
        title:res.data[0].refereceTitleHr,
        phone:res.data[0].referPhoneHr,
        mail:res.data[0].referenceEmaiHr,
        rel:res.data[0].RelationAndCandidate,
        q1hr:res.data[0].candidateOndate,
        q2hr:res.data[0].candidateTerminalDateHr,
        q3hr:res.data[0].candidateTitleAndDeptHr,
        LineManager:res.data[0].LineRealationHr,
        Colleague:res.data[0].colleagueRealationHr,
        Management:res.data[0].manangeRealtionHr,
        Client:res.data[0].clientRealationHr,
        q5hr:res.data[0].reasonForLeaveHr,
        q1:res.data[0].knowLongSuper,
        q2:res.data[0].positionAndJobSuper,
        q3:res.data[0].projectSuper,
        q4:res.data[0].commentAndAttitudeSuper,
        q5:res.data[0].confirmEmployeDateSuper,
        q6:res.data[0].considerStrengthSuper,
        q7:res.data[0].considerAreaImprovSuper,
        q9:res.data[0].describeOrientedSuper,
        Management2:res.data[0].manageRelationSuper,
        directManager:res.data[0].directManagerRelationSuper,
        coworkers:res.data[0].coworkerRelationSuper,
        Client2:res.data[0].clientRelationSuper,
        skillWO:res.data[0].skillWO,//缺
        q10:res.data[0].commentManageSkillsSuper,
        q11:res.data[0].commentTimeManageSkillsSuper,//缺
        skillTM:res.data[0].skillTM,//缺
        q12:res.data[0].positionSuitSuper,
        q13:res.data[0].reasonForleaveSuper,
        q14:res.data[0].reHireSuper,


      })
      this.setState({loading:false});


    } catch (err) {
      Modal.error({
        title: '提示',
        content: err.message
      });
      this.setState({loading:false});

    }
  };
  onPrinting = () => {
    const bodyHtml = window.document.body.innerHTML;
     var footstr = "</body>";
     var newstr = document.getElementById('toPrint').innerHTML;
     var headstr = "<html><head><title></title><style>.hidden{display:none}</style></head><body>";
     document.body.innerHTML = headstr + newstr + footstr;
     window.print();
    window.document.body.innerHTML = bodyHtml;
    window.location.reload();
  };
  componentDidUpdate(prevProps, prevState, snapshot){
    // if(prevProps.record.)

    if(this.props.record.REC_ID !== prevProps.record.REC_ID ){
      this.getInfo(this.props.record.REC_ID)

    }
  }
  changeChara(v){
    this.setState({chara:v})
  }
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
  render() {
    return (
      <div className='reference'>
        <Spin spinning={this.state.loading}>
        <div className='buttonLine'>
          <Button type='primary' onClick={this.subData}>保存</Button>
          <Button onClick={this.onPrinting}>打印</Button>

          <ul className='charaChange'>
            <li id='selHR' className={this.state.chara=='HR'?'current':''} onClick={() => this.changeChara('HR')}>HR</li>
            <li id='selSup' className={this.state.chara=='supervisor'?'current':''} onClick={() => this.changeChara('supervisor')}>主管</li>
            <li id='selCol' className={this.state.chara=='colleague'?'current':''} onClick={() => this.changeChara('colleague')}>同事</li>
          </ul>

        </div>

        <div id='toPrint' style={{width:'842px',marginLeft:'calc(50% - 421px)',background:'#fff',paddingBottom:'56px'}}>
          <div style={{width:'842px',height:'100vh',overflow:'auto',background:'#fff'}}>
            <h3 style={{lineHeight:'4',fontSize:'20px',textAlign:'center'}}>Reference Check</h3>

            <div style={{width:'60%',float:'left', }}>
              <b>Candidate’s Name：</b><input value={this.state.candiName} onChange={v=>{this.handlechange("candiName",v)}} type='text' style={{outline:'none',border:'none',borderBottom:'1px solid #000'}}/>
            </div>

            <div style={{width:'40%',float:'left', }}>
              <b>Date：</b><input type='date' value={this.state.date} onChange={v=>{this.handlechange("date",v)}} style={{outline:'none',border:'none',borderBottom:'1px solid #000'}}/>
            </div>

            <div style={{clear:'both',width:'100%', height:'16px'}}></div>

            <div style={{width:'60%',float:'left', }}>
              <b>Company Name：</b><input value={this.state.coName} onChange={v=>{this.handlechange("coName",v)}} type='text' style={{outline:'none',border:'none',borderBottom:'1px solid #000'}}/>
            </div>
            <div style={{width:'40%',float:'left', }}>
              <b>Reference Name：</b><input value={this.state.reName} onChange={v=>{this.handlechange("reName",v)}} type='text' style={{outline:'none',border:'none',borderBottom:'1px solid #000'}}/>
            </div>

            <div style={{clear:'both',width:'100%', height:'16px'}}></div>

            <div style={{width:'60%',float:'left', }}>
              <b>Title：</b><input value={this.state.title} onChange={v=>{this.handlechange("title",v)}} type='text' style={{outline:'none',border:'none',borderBottom:'1px solid #000'}}/>
            </div>
            <div style={{width:'40%',float:'left', }}>

              <b>Phone Number：</b><input value={this.state.phone} onChange={v=>{this.handlechange("phone",v)}} type='text' style={{outline:'none',border:'none',borderBottom:'1px solid #000'}}/>
            </div>

            <div style={{clear:'both',width:'100%', height:'16px'}}></div>

            <div style={{width:'50%',float:'left', }}>

              <b>E-mail：</b><input value={this.state.mail} onChange={v=>{this.handlechange("mail",v)}} type='text' style={{outline:'none',border:'none',borderBottom:'1px solid #000'}}/>
            </div>
              <div style={{clear:'both',width:'100%',height:'16px'}}></div>
            <div style={{width:'100%',float:'left', }}>
              <b>Relationship between Candidate and Reference：</b><input value={this.state.rel} onChange={v=>{this.handlechange("rel",v)}} type='text' style={{outline:'none',border:'none',borderBottom:'1px solid #000'}}/>
            </div>

            <div style={{clear:'both',width:'100%',height:'40px',borderBottom:'1px dashed #000'}}></div>

            <h4 style={{marginTop:'24px',marginBottom:'16px'}}>Questions</h4>

            <ul ref='hr' className={this.state.chara=='HR'?'':'hidden'} style={{listStyle:'none'}}>
              <li>
                <label style={{marginBottom:'16px'}}>1.What is the candidate’s on-board date?</label>
                <textarea value={this.state.q1hr} onChange={v=>{this.handlechange("q1hr",v)}} style={{resize:'none',width:'100%',height:'120px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>2.What is the candidate’s terminate date?</label>
                <textarea value={this.state.q2hr} onChange={v=>{this.handlechange("q2hr",v)}} style={{resize:'none',width:'100%',height:'120px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>3.What were the title and department of the candidate before he left the company?</label>
                <textarea value={this.state.q3hr} onChange={v=>{this.handlechange("q3hr",v)}} style={{resize:'none',width:'100%',height:'120px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>4.How about the relationship between the candidate and co-worker? </label>
                <ul style={{marginTop:'16px',marginBottom:'40px'}}>
                  <li style={{marginTop:'8px'}}>
                    <span style={{marginRight:'16px'}}>Management</span>
                    <input type='radio' name='Management' id='mana1' value='Good' checked={this.state.Management=='Good'?'checked':''} onChange={v=>{this.handlechange("Management",v,'mana1')}}/><label for='mana1' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                    <input type='radio' name='Management' id='mana2' value='Normal' checked={this.state.Management=='Normal'?'checked':''} onChange={v=>{this.handlechange("Management",v,'mana2')}}/><label for='mana2' style={{marginLeft:'8px',marginRight:'16px'}}>Normal</label>
                    <input type='radio' name='Management' id='mana3' value='Bad' checked={this.state.Management=='Bad'?'checked':''} onChange={v=>{this.handlechange("Management",v,'mana3')}}/><label for='mana3' style={{marginLeft:'8px',marginRight:'16px'}}>Bad</label>
                    <input type='radio' name='Management' id='mana4' value='Not sure' checked={this.state.Management=='Not sure'?'checked':''} onChange={v=>{this.handlechange("Management",v,'mana4')}}/><label for='mana4' style={{marginLeft:'8px',marginRight:'16px'}}>Not sure</label>
                  </li>
                  <li style={{marginTop:'8px'}}>
                    <span style={{marginRight:'16px'}}>Line manager </span>
                    <input type='radio' name='LineManager ' id='LM1' value='Good' checked={this.state.LineManager=='Good'?'checked':''} onChange={v=>{this.handlechange("LineManager",v,'LM1')}}/><label for='LM1' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                    <input type='radio' name='LineManager ' id='LM2' value='Normal' checked={this.state.LineManager=='Normal'?'checked':''} onChange={v=>{this.handlechange("LineManager",v,'LM2')}}/><label for='LM2' style={{marginLeft:'8px',marginRight:'16px'}}>Normal</label>
                    <input type='radio' name='LineManager ' id='LM3' value='Bad' checked={this.state.LineManager=='Bad'?'checked':''} onChange={v=>{this.handlechange("LineManager",v,'LM3')}}/><label for='LM3' style={{marginLeft:'8px',marginRight:'16px'}}>Bad</label>
                    <input type='radio' name='LineManager ' id='LM4' value='Not sure' checked={this.state.LineManager=='Not sure'?'checked':''} onChange={v=>{this.handlechange("LineManager",v,'LM4')}}/><label for='LM4' style={{marginLeft:'8px',marginRight:'16px'}}>Not sure</label>
                  </li>
                  <li style={{marginTop:'8px'}}>
                    <span style={{marginRight:'16px'}}>Colleague</span>
                    <input type='radio' name='Colleague ' id='CL1' value='Good' checked={this.state.Colleague=='Good'?'checked':''} onChange={v=>{this.handlechange("Colleague",v,'CL1')}}/><label for='CL1' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                    <input type='radio' name='Colleague ' id='CL2' value='Normal' checked={this.state.Colleague=='Normal'?'checked':''} onChange={v=>{this.handlechange("Colleague",v,'CL2')}}/><label for='CL2' style={{marginLeft:'8px',marginRight:'16px'}}>Normal</label>
                    <input type='radio' name='Colleague ' id='CL3' value='Bad' checked={this.state.Colleague=='Bad'?'checked':''} onChange={v=>{this.handlechange("Colleague",v,'CL3')}}/><label for='CL3' style={{marginLeft:'8px',marginRight:'16px'}}>Bad</label>
                    <input type='radio' name='Colleague ' id='CL4' value='Not sure' checked={this.state.Colleague=='Not sure'?'checked':''} onChange={v=>{this.handlechange("Colleague",v,'CL4')}}/><label for='CL4' style={{marginLeft:'8px',marginRight:'16px'}}>Not sure</label>
                  </li>
                  <li style={{marginTop:'8px'}}>
                    <span style={{marginRight:'16px'}}>Client</span>
                    <input type='radio' name='Client ' id='CT1' value='Good' checked={this.state.Client=='Good'?'checked':''} onChange={v=>{this.handlechange("Client",v,'CT1')}}/><label for='CT1' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                    <input type='radio' name='Client ' id='CT2' value='Normal' checked={this.state.Client=='Normal'?'checked':''} onChange={v=>{this.handlechange("Client",v,'CT2')}}/><label for='CT2' style={{marginLeft:'8px',marginRight:'16px'}}>Normal</label>
                    <input type='radio' name='Client ' id='CT3' value='Bad' checked={this.state.Client=='Bad'?'checked':''} onChange={v=>{this.handlechange("Client",v,'CT3')}}/><label for='CT3' style={{marginLeft:'8px',marginRight:'16px'}}>Bad</label>
                    <input type='radio' name='Client ' id='CT4' value='Not sure' checked={this.state.Client=='Not sure'?'checked':''} onChange={v=>{this.handlechange("Client",v,'CT4')}}/><label for='CT4' style={{marginLeft:'8px',marginRight:'16px'}}>Not sure</label>
                  </li>
                </ul>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>5.  Why the candidate leave your company?</label>
                <textarea value={this.state.q5hr} onChange={v=>{this.handlechange("q5hr",v)}} style={{resize:'none',width:'100%',height:'120px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
            </ul>

            <ul style={{listStyle:'none'}} className={this.state.chara=='supervisor'?'':'hidden'} ref='supervisor'>
              <li>
                <label style={{marginBottom:'16px'}}>1.How long have you known/supervised the candidate?</label>
                <textarea value={this.state.q1} onChange={v=>{this.handlechange("q1",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>2.What was his/her position and main job responsibilities?</label>
                <textarea value={this.state.q2} onChange={v=>{this.handlechange("q2",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>3.What kind of important project has he/she done?</label>
                <textarea value={this.state.q3} onChange={v=>{this.handlechange("q3",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>4.Can you comment on his/her performance? How would you consider his/her attitude towards his/her work?</label>
                <textarea value={this.state.q4} onChange={v=>{this.handlechange("q4",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>5.Can you confirm his/her employment dates?</label>
                <textarea value={this.state.q5} onChange={v=>{this.handlechange("q5",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>6.What do you consider his/her strengths were?</label>
                <textarea value={this.state.q6} onChange={v=>{this.handlechange("q6",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>7.Would you consider that there were any areas that needed improvement?</label>
                <textarea value={this.state.q7} onChange={v=>{this.handlechange("q7",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>8.How well did he/she get along with: </label>
                <ul style={{marginTop:'16px',marginBottom:'16px'}}>
                  <li style={{marginTop:'8px'}}>
                    <span style={{marginRight:'16px'}}>Management</span>
                    <input type='radio' name='Management2' id='mana5' value='Good' checked={this.state.Management2=='Good'?'checked':''} onChange={v=>{this.handlechange("Management2",v,'mana5')}}/><label for='mana5' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                    <input type='radio' name='Management2' id='mana6' value='Fair' checked={this.state.Management2=='Fair'?'checked':''} onChange={v=>{this.handlechange("Management2",v,'mana6')}}/><label for='mana6' style={{marginLeft:'8px',marginRight:'16px'}}>Fair</label>
                    <input type='radio' name='Management2' id='mana7' value='Poor' checked={this.state.Management2=='Poor'?'checked':''} onChange={v=>{this.handlechange("Management2",v,'mana7')}}/><label for='mana7' style={{marginLeft:'8px',marginRight:'16px'}}>Poor</label>

                  </li>
                  <li style={{marginTop:'8px'}}>
                    <span style={{marginRight:'16px'}}>Direct Manager </span>
                    <input type='radio' name='directManager' id='DM1' value='Good' checked={this.state.directManager=='Good'?'checked':''} onChange={v=>{this.handlechange("directManager",v,'DM1')}}/><label for='DM1' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                    <input type='radio' name='directManager' id='DM2' value='Fair' checked={this.state.directManager=='Fair'?'checked':''} onChange={v=>{this.handlechange("directManager",v,'DM2')}}/><label for='DM2' style={{marginLeft:'8px',marginRight:'16px'}}>Fair</label>
                    <input type='radio' name='directManager' id='DM3' value='Poor' checked={this.state.directManager=='Poor'?'checked':''} onChange={v=>{this.handlechange("directManager",v,'DM3')}}/><label for='DM3' style={{marginLeft:'8px',marginRight:'16px'}}>Poor</label>

                  </li>
                  <li style={{marginTop:'8px'}}>
                    <span style={{marginRight:'16px'}}>Coworkers</span>
                    <input type='radio' name='coworkers' id='CW1' value='Good' checked={this.state.coworkers=='Good'?'checked':''} onChange={v=>{this.handlechange("coworkers",v,'CW1')}}/><label for='CW1' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                    <input type='radio' name='coworkers' id='CW2' value='Fair' checked={this.state.coworkers=='Fair'?'checked':''} onChange={v=>{this.handlechange("coworkers",v,'CW2')}}/><label for='CW2' style={{marginLeft:'8px',marginRight:'16px'}}>Fair</label>
                    <input type='radio' name='coworkers' id='CW3' value='Poor' checked={this.state.coworkers=='Poor'?'checked':''} onChange={v=>{this.handlechange("coworkers",v,'CW3')}}/><label for='CW3' style={{marginLeft:'8px',marginRight:'16px'}}>Poor</label>

                  </li>
                  <li style={{marginTop:'8px'}}>
                    <span style={{marginRight:'16px'}}>Clients/Customers</span>
                    <input type='radio' name='Client2' id='CT5' value='Good' checked={this.state.Client2=='Good'?'checked':''} onChange={v=>{this.handlechange("Client2",v,'CT5')}}/><label for='CT5' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                    <input type='radio' name='Client2' id='CT6' value='Fair' checked={this.state.Client2=='Fair'?'checked':''} onChange={v=>{this.handlechange("Client2",v,'CT6')}}/><label for='CT6' style={{marginLeft:'8px',marginRight:'16px'}}>Fair</label>
                    <input type='radio' name='Client2' id='CT7' value='Poor' checked={this.state.Client2=='Poor'?'checked':''} onChange={v=>{this.handlechange("Client2",v,'CT7')}}/><label for='CT7' style={{marginLeft:'8px',marginRight:'16px'}}>Poor</label>

                  </li>


                </ul>
              </li>

              <li>
                <label style={{marginBottom:'16px'}}>9.Would you describe this person as being people oriented or result oriented?</label>
                <textarea value={this.state.q9} onChange={v=>{this.handlechange("q9",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>

              <li>
                <label style={{marginBottom:'8px'}}>10.Can you comment on his/her written and oral communication skills?</label>
                <div style={{width:'100%',height:'8px'}}></div>
                <input style={{marginLeft:'24px'}} type='radio' name='skillWO' id='CT1' value='VeryGood' checked={this.state.skillWO=='VeryGood'?'checked':''} onChange={v=>{this.handlechange("skillWO",v,'CT1')}}/><label for='CT1' style={{marginLeft:'8px',marginRight:'16px'}}>Very Good </label>
                <input type='radio' name='skillWO' id='SWO2' value='Good' checked={this.state.skillWO=='Good'?'checked':''} onChange={v=>{this.handlechange("skillWO",v,'SWO2')}}/><label for='SWO2' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                <input type='radio' name='skillWO' id='SWO3' value='Average' checked={this.state.skillWO=='Average'?'checked':''} onChange={v=>{this.handlechange("skillWO",v,'SWO3')}}/><label for='SWO3' style={{marginLeft:'8px',marginRight:'16px'}}>Average</label>
                <input type='radio' name='skillWO' id='SWO4' value='NotGood' checked={this.state.skillWO=='NotGood'?'checked':''} onChange={v=>{this.handlechange("skillWO",v,'SWO4')}}/><label for='SWO4' style={{marginLeft:'8px',marginRight:'16px'}}>Not Good</label>
                <input type='radio' name='skillWO' id='SWO5' value='Bad' checked={this.state.skillWO=='Bad'?'checked':''} onChange={v=>{this.handlechange("skillWO",v,'SWO5')}}/><label for='SWO5' style={{marginLeft:'8px',marginRight:'16px'}}>Bad</label>
                <div style={{width:'100%',height:'8px'}}></div>
                <label style={{marginLeft:'24px',marginBottom:'8px'}}>Reasons:</label>
                <textarea value={this.state.q10} onChange={v=>{this.handlechange("q10",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>

              <li>
                <label style={{marginBottom:'8px'}}>11.Can you comment on his/her time management skills?</label>
                <div style={{width:'100%',height:'8px'}}></div>
                <input style={{marginLeft:'24px'}} type='radio' name='skillTM' id='STM1' value='VeryGood' checked={this.state.skillTM=='VeryGood'?'checked':''} onChange={v=>{this.handlechange("skillTM",v,'STM1')}}/><label for='STM1' style={{marginLeft:'8px',marginRight:'16px'}}>Very Good </label>
                <input type='radio' name='skillTM' id='STM2' value='Good' checked={this.state.skillTM=='Good'?'checked':''} onChange={v=>{this.handlechange("skillTM",v,'STM2')}}/><label for='STM2' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                <input type='radio' name='skillTM' id='STM3' value='Average' checked={this.state.skillTM=='Average'?'checked':''} onChange={v=>{this.handlechange("skillTM",v,'STM3')}}/><label for='STM3' style={{marginLeft:'8px',marginRight:'16px'}}>Average</label>
                <input type='radio' name='skillTM' id='STM4' value='NotGood' checked={this.state.skillTM=='NotGood'?'checked':''} onChange={v=>{this.handlechange("skillTM",v,'STM4')}}/><label for='STM4' style={{marginLeft:'8px',marginRight:'16px'}}>Not Good</label>
                <input type='radio' name='skillTM' id='STM5' value='Bad' checked={this.state.skillTM=='Bad'?'checked':''} onChange={v=>{this.handlechange("skillTM",v,'STM5')}}/><label for='STM5' style={{marginLeft:'8px',marginRight:'16px'}}>Bad</label>
                <div style={{width:'100%',height:'8px'}}></div>
                <label style={{marginLeft:'24px',marginBottom:'8px'}}>Reasons:</label>
                <textarea value={this.state.q11} onChange={v=>{this.handlechange("q11",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>12.What kind of work environment and position do you think best suits this person?</label>
                <textarea value={this.state.q12} onChange={v=>{this.handlechange("q12",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>13.Do you know why he/she left your company?</label>
                <textarea value={this.state.q13} onChange={v=>{this.handlechange("q13",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
              <li>
                <label style={{marginBottom:'16px'}}>14.Do you think that this person be eligible for a re-hire with your company?</label>
                <textarea value={this.state.q14} onChange={v=>{this.handlechange("q14",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
              </li>
            </ul>


                        <ul style={{listStyle:'none'}} className={this.state.chara=='colleague'?'':'hidden'} ref='supervisor'>
                          <li>
                            <label style={{marginBottom:'16px'}}>1.How long have you known/supervised the candidate?</label>
                            <textarea value={this.state.q1} onChange={v=>{this.handlechange("q1",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
                          </li>
                          <li>
                            <label style={{marginBottom:'16px'}}>2.What was his/her position and main job responsibilities?</label>
                            <textarea value={this.state.q2} onChange={v=>{this.handlechange("q2",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
                          </li>
                          <li>
                            <label style={{marginBottom:'16px'}}>3.What kind of important project has he/she done?</label>
                            <textarea value={this.state.q3} onChange={v=>{this.handlechange("q3",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
                          </li>
                          <li>
                            <label style={{marginBottom:'16px'}}>4.Can you comment on his/her performance? How would you consider his/her attitude towards his/her work?</label>
                            <textarea value={this.state.q4} onChange={v=>{this.handlechange("q4",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
                          </li>
                          <li>
                            <label style={{marginBottom:'16px'}}>5.Can you confirm his/her employment dates?</label>
                            <textarea value={this.state.q5} onChange={v=>{this.handlechange("q5",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
                          </li>
                          <li>
                            <label style={{marginBottom:'16px'}}>6.What do you consider his/her strengths were?</label>
                            <textarea value={this.state.q6} onChange={v=>{this.handlechange("q6",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
                          </li>
                          <li>
                            <label style={{marginBottom:'16px'}}>7.Would you consider that there were any areas that needed improvement?</label>
                            <textarea value={this.state.q7} onChange={v=>{this.handlechange("q7",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
                          </li>
                          <li>
                            <label style={{marginBottom:'16px'}}>8.How well did he/she get along with: </label>
                            <ul style={{marginTop:'16px',marginBottom:'16px'}}>
                              <li style={{marginTop:'8px'}}>
                                <span style={{marginRight:'16px'}}>Management</span>
                                <input type='radio' name='Management2' id='mana5' value='Good' checked={this.state.Management2=='Good'?'checked':''} onChange={v=>{this.handlechange("Management2",v,'mana5')}}/><label for='mana5' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                                <input type='radio' name='Management2' id='mana6' value='Fair' checked={this.state.Management2=='Fair'?'checked':''} onChange={v=>{this.handlechange("Management2",v,'mana6')}}/><label for='mana6' style={{marginLeft:'8px',marginRight:'16px'}}>Fair</label>
                                <input type='radio' name='Management2' id='mana7' value='Poor' checked={this.state.Management2=='Poor'?'checked':''} onChange={v=>{this.handlechange("Management2",v,'mana7')}}/><label for='mana7' style={{marginLeft:'8px',marginRight:'16px'}}>Poor</label>

                              </li>
                              <li style={{marginTop:'8px'}}>
                                <span style={{marginRight:'16px'}}>Direct Manager </span>
                                <input type='radio' name='directManager' id='DM1' value='Good' checked={this.state.directManager=='Good'?'checked':''} onChange={v=>{this.handlechange("directManager",v,'DM1')}}/><label for='DM1' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                                <input type='radio' name='directManager' id='DM2' value='Fair' checked={this.state.directManager=='Fair'?'checked':''} onChange={v=>{this.handlechange("directManager",v,'DM2')}}/><label for='DM2' style={{marginLeft:'8px',marginRight:'16px'}}>Fair</label>
                                <input type='radio' name='directManager' id='DM3' value='Poor' checked={this.state.directManager=='Poor'?'checked':''} onChange={v=>{this.handlechange("directManager",v,'DM3')}}/><label for='DM3' style={{marginLeft:'8px',marginRight:'16px'}}>Poor</label>

                              </li>
                              <li style={{marginTop:'8px'}}>
                                <span style={{marginRight:'16px'}}>Coworkers</span>
                                <input type='radio' name='coworkers' id='CW1' value='Good' checked={this.state.coworkers=='Good'?'checked':''} onChange={v=>{this.handlechange("coworkers",v,'CW1')}}/><label for='CW1' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                                <input type='radio' name='coworkers' id='CW2' value='Fair' checked={this.state.coworkers=='Fair'?'checked':''} onChange={v=>{this.handlechange("coworkers",v,'CW2')}}/><label for='CW2' style={{marginLeft:'8px',marginRight:'16px'}}>Fair</label>
                                <input type='radio' name='coworkers' id='CW3' value='Poor' checked={this.state.coworkers=='Poor'?'checked':''} onChange={v=>{this.handlechange("coworkers",v,'CW3')}}/><label for='CW3' style={{marginLeft:'8px',marginRight:'16px'}}>Poor</label>

                              </li>
                              <li style={{marginTop:'8px'}}>
                                <span style={{marginRight:'16px'}}>Clients/Customers</span>
                                <input type='radio' name='Client2' id='CT5' value='Good' checked={this.state.Client2=='Good'?'checked':''} onChange={v=>{this.handlechange("Client2",v,'CT5')}}/><label for='CT5' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                                <input type='radio' name='Client2' id='CT6' value='Fair' checked={this.state.Client2=='Fair'?'checked':''} onChange={v=>{this.handlechange("Client2",v,'CT6')}}/><label for='CT6' style={{marginLeft:'8px',marginRight:'16px'}}>Fair</label>
                                <input type='radio' name='Client2' id='CT7' value='Poor' checked={this.state.Client2=='Poor'?'checked':''} onChange={v=>{this.handlechange("Client2",v,'CT7')}}/><label for='CT7' style={{marginLeft:'8px',marginRight:'16px'}}>Poor</label>

                              </li>


                            </ul>
                          </li>

                          <li>
                            <label style={{marginBottom:'16px'}}>9.Would you describe this person as being people oriented or result oriented?</label>
                            <textarea value={this.state.q9} onChange={v=>{this.handlechange("q9",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
                          </li>

                          <li>
                            <label style={{marginBottom:'8px'}}>10.Can you comment on his/her written and oral communication skills?</label>
                            <div style={{width:'100%',height:'8px'}}></div>
                            <input style={{marginLeft:'24px'}} type='radio' name='skillWO' id='CT1' value='VeryGood' checked={this.state.skillWO=='VeryGood'?'checked':''} onChange={v=>{this.handlechange("skillWO",v,'CT1')}}/><label for='CT1' style={{marginLeft:'8px',marginRight:'16px'}}>Very Good </label>
                            <input type='radio' name='skillWO' id='SWO2' value='Good' checked={this.state.skillWO=='Good'?'checked':''} onChange={v=>{this.handlechange("skillWO",v,'SWO2')}}/><label for='SWO2' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                            <input type='radio' name='skillWO' id='SWO3' value='Average' checked={this.state.skillWO=='Average'?'checked':''} onChange={v=>{this.handlechange("skillWO",v,'SWO3')}}/><label for='SWO3' style={{marginLeft:'8px',marginRight:'16px'}}>Average</label>
                            <input type='radio' name='skillWO' id='SWO4' value='NotGood' checked={this.state.skillWO=='NotGood'?'checked':''} onChange={v=>{this.handlechange("skillWO",v,'SWO4')}}/><label for='SWO4' style={{marginLeft:'8px',marginRight:'16px'}}>Not Good</label>
                            <input type='radio' name='skillWO' id='SWO5' value='Bad' checked={this.state.skillWO=='Bad'?'checked':''} onChange={v=>{this.handlechange("skillWO",v,'SWO5')}}/><label for='SWO5' style={{marginLeft:'8px',marginRight:'16px'}}>Bad</label>
                            <div style={{width:'100%',height:'8px'}}></div>
                            <label style={{marginLeft:'24px',marginBottom:'8px'}}>Reasons:</label>
                            <textarea value={this.state.q10} onChange={v=>{this.handlechange("q10",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
                          </li>

                          <li>
                            <label style={{marginBottom:'8px'}}>11.Can you comment on his/her time management skills?</label>
                            <div style={{width:'100%',height:'8px'}}></div>
                            <input style={{marginLeft:'24px'}} type='radio' name='skillTM' id='STM1' value='VeryGood' checked={this.state.skillTM=='VeryGood'?'checked':''} onChange={v=>{this.handlechange("skillTM",v,'STM1')}}/><label for='STM1' style={{marginLeft:'8px',marginRight:'16px'}}>Very Good </label>
                            <input type='radio' name='skillTM' id='STM2' value='Good' checked={this.state.skillTM=='Good'?'checked':''} onChange={v=>{this.handlechange("skillTM",v,'STM2')}}/><label for='STM2' style={{marginLeft:'8px',marginRight:'16px'}}>Good</label>
                            <input type='radio' name='skillTM' id='STM3' value='Average' checked={this.state.skillTM=='Average'?'checked':''} onChange={v=>{this.handlechange("skillTM",v,'STM3')}}/><label for='STM3' style={{marginLeft:'8px',marginRight:'16px'}}>Average</label>
                            <input type='radio' name='skillTM' id='STM4' value='NotGood' checked={this.state.skillTM=='NotGood'?'checked':''} onChange={v=>{this.handlechange("skillTM",v,'STM4')}}/><label for='STM4' style={{marginLeft:'8px',marginRight:'16px'}}>Not Good</label>
                            <input type='radio' name='skillTM' id='STM5' value='Bad' checked={this.state.skillTM=='Bad'?'checked':''} onChange={v=>{this.handlechange("skillTM",v,'STM5')}}/><label for='STM5' style={{marginLeft:'8px',marginRight:'16px'}}>Bad</label>
                            <div style={{width:'100%',height:'8px'}}></div>
                            <label style={{marginLeft:'24px',marginBottom:'8px'}}>Reasons:</label>
                            <textarea value={this.state.q11} onChange={v=>{this.handlechange("q11",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
                          </li>
                          <li>
                            <label style={{marginBottom:'16px'}}>12.What kind of work environment and position do you think best suits this person?</label>
                            <textarea value={this.state.q12} onChange={v=>{this.handlechange("q12",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
                          </li>
                          <li>
                            <label style={{marginBottom:'16px'}}>13.Do you know why he/she left your company?</label>
                            <textarea value={this.state.q13} onChange={v=>{this.handlechange("q13",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
                          </li>
                          <li>
                            <label style={{marginBottom:'16px'}}>14.Do you think that this person be eligible for a re-hire with your company?</label>
                            <textarea value={this.state.q14} onChange={v=>{this.handlechange("q14",v)}} style={{resize:'none',width:'100%',height:'104px',outline:'none',textIndent:'1rem',border:'none'}}></textarea>
                          </li>
                        </ul>
          </div>
        </div>
        </Spin>
      </div>
    );
  }
}

export default ReferenceCheck;
