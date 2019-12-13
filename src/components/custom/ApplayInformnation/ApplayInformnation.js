import React, { Component } from 'react';
import './ApplayInformnation.less';
import { Form, Input, DatePicker, Radio, Button, Select ,Icon,Modal} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import IDLExamination from '../IDLExamination';
import http from '../../../util20/api';
import PropTypes from 'prop-types';
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};
const { RangePicker } = DatePicker;
const formItemLayout2 = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};
const languageAbility = [
  {
    label: '优秀',
    value: '优秀'
  },
  {
    label: '良好',
    value: '良好'
  },
  {
    label: '一般',
    value: '一般'
  },
  {
    label: '欠佳',
    value: '欠佳'
  }
];
const englishgarde = [
  {
    label: 'CET-4',
    value: 'CET-4'
  },
  {
    label: 'CET-6',
    value: 'CET-6'
  },
  {
    label: 'TEM-4',
    value: 'TEM-4'
  },
  {
    label: 'TEM-8',
    value: 'TEM-8'
  },
  {
    label: '公共英语三级',
    value: '公共英语三级'
  }
];
const eduResid = 620392895622;//教育背景
class Applayinformation extends Component {
  static propTypes = {
    /**
     * 表达初始化值
     */
    initialValue: PropTypes.object
  };

  static defaultProps = {
    initialValue: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      showPrint:false,
      currentInfo: {},
      mode: ['month', 'month'],
      value: [],
      eduInfo:[],
      ID:''
    };

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
	// 判别是不是平板用户
	let usrCode = '623876173360'
  n=0;

  while(n<arr.length){
    var j=usrCode+"\'"
    if(j==arr[n]){
      this.setState({userChara:'IDLUser'});
    }
    n++;
  }
  }

  componentWillReceiveProps = (nextProps) => {
    if( typeof nextProps.personDetail !== "undefined" ){
      this.setState({
        currentInfo: nextProps.personDetail,
        ChName:nextProps.personDetail.ChName,
        ID:nextProps.personDetail.ID,
        REC_ID:nextProps.personDetail.REC_ID,
		
      }, () => {
        this.searchEdu(this.state.ID);
      });
    }
    // let ID = ''

  }

  // 查询教育背景
  searchEdu = async(ID) =>{
    let res;
    try {
      res = await http().getTable({
        resid: eduResid,
        cmswhere:`ID=${ID}`
      });
      this.setState({ eduInfo: res.data.data });

    } catch (error) {
      console.log(error);
    }
  }

  // 时间选择器
  handlePanelChange = (value, mode) => {
    this.setState({
      value,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    });
  };

  handleChange = value => {
    this.setState({ value });
  };
  // 确认修改并打印
  handleModifyAndPrint = () => {
    // 打印
    const newEle = document.querySelector('.applay__information').innerHTML;
    var oldstr = document.body.innerHTML; //保存当前页面
    document.body.innerHTML = newEle; //把当前页面内容替换为要打印的内容
    window.print();
    document.body.innerHTML = oldstr; //恢复原来的页面
    return false;
  };
  // 退回重填
  reFill = async()=>{
	  this.setState({ loading: true });
	  let res;
	  try {
	    res = http().modifyRecords({
	      resid: 613149356409, //工作申请表 业务数据
	      data: [
	  
	        {REC_ID:this.state.REC_ID,isReturn:'Y'}]
	    })
	    Modal.success({
	      title: '提示',
        content: '退回成功',
        okText:'OK',
	      onOk: () => {
	        window.location.reload();
	  
	      }
	    });
	    this.setState({ loading: false });}catch (err) {
        console.error(err.message);
        this.setState({ loading: false });

        Modal.error({
          title: '退回失败',
          okText:'OK',
          content: err.message
        });
      }
  }
  handleSave=()=>{
    this.props.form.validateFields((err,values)=>{
      console.log(values)
      this.setState({ loading: true });
      let res;
      try {
        res = http().modifyRecords({
          resid: 613149356409, //工作申请表 业务数据
          data: [

            {...values,REC_ID:this.state.REC_ID,isReturn:'N'}]
        })
        Modal.success({
          title: '提示',
          content: '保存成功',
          okText:'OK',
          onOk: () => {
            window.location.reload();

          }
        });
        this.setState({ loading: false });

      }catch (err) {
        console.error(err.message);
        this.setState({ loading: false });

        Modal.error({
          title: '保存失败',
          okText:'OK',
          content: err.message
        });
      }
    })
  }
  printClz=()=>{
    document.getElementById('idlEx').classList.add('hidden');
  }
  handleClick =() =>{
    document.getElementById('idlEx').classList.remove('hidden');

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { initialValue } = this.props;
    // console.log(initialValue);
    let {currentInfo} = this.state;
    // console.log("currentInfo",currentInfo);
    const { value, mode } = this.state;
    return (
      <div
        className="applay__information"
        style={{ width:'100%',height: '90vh', overflow: 'scroll',background:'#fff',padding:'0' }}
      >
        <rect className='idlEx hidden' id='idlEx'>
          <Icon type="close-circle" style={{cursor:'pointer',position:'fixed',right:'32px',top:'16px'}} onClick={this.printClz}/>
          <IDLExamination data={this.state.currentInfo}></IDLExamination>
        </rect>
        <Form style={{padding:'16px',boxSizing:'border-box'}}>
          <div className="information__boundary">
            <h3 className="applay__information-title" id="个人资料">
            Personal Information 个人资料
            </h3>
            <Form.Item label="中文姓名/Chinese Name" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('ChName', {
                initialValue: currentInfo.ChName,
                rules: [
                  {
                    required: true,
                    message: '请输入中文姓名'
                  }
                ]
              })(<Input  />)}
            </Form.Item>
            <Form.Item
              label="英文姓名/Name in English"
              {...formItemLayout}
              className="applay__information-content"
            >
              {getFieldDecorator('EnName', {
                initialValue: currentInfo.EnName,
                rules: [
                  {
                    required: true,
                    message: '请输入英文姓名'
                  }
                ]
              })(<Input   />)}
            </Form.Item>
            <Form.Item label="申请职位名称/Position for Applied" {...formItemLayout}
              className="applay__information-content">
              {getFieldDecorator('appPosition', {
                initialValue: currentInfo.appPosition,
                rules: [
                  {
                    required: true,
                    message: '请输入申请职位名称!'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="身份证号码/Number of ID Card" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('IDCardNumber', {
                initialValue: currentInfo.IDCardNumber,
                rules: [
                  {
                    required: true,
                    message: 'Please input your ID Card number!'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="性别/Gender" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('Sex', {
                initialValue: currentInfo.Sex,
                rules: [
                  {
                    message: '请选择性别'
                  }
                ]
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="手机/MP" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('Tel', {
                initialValue: currentInfo.Tel,
                rules: [
                  {
                    required: true,
                    message: '请务必输入手机号，方便我们联系您'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="个人邮箱/E-mail" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('Email', {
                initialValue: currentInfo.Email,
                rules: [
                  {
                    required: true,
                    message: '请务必输入邮箱，方便我们联系您'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="国籍/Nationality" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('Nationality', {
                initialValue: currentInfo.Nationality,
                rules: [
                  {
                    required: true,
                    message: '输入国籍'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="籍贯/NativePlace" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('NativePlace', {
                initialValue: currentInfo.NativePlace,
                rules: [
                  {
                    required: true,
                    message: '输入籍贯'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="民族/Nationality" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('Nation', {
                initialValue: currentInfo.Nation,
                rules: [
                  {
                    required: true,
                    message: '输入民族'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="政治面貌/Party Affiliation" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('Party', {
                initialValue: currentInfo.Party,
                rules: [
                  {
                    required: true,
                    message: '输入政党'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="出生日期/Date Of Birth(year/month/day)" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('BirthDate', {
                initialValue: currentInfo.BirthDate,
                rules: [
                  {
                    required: true,
                    message: '输入出生日期'
                  }
                ]
              })(
              // <DatePicker />
              <Input />
              )}
            </Form.Item>
            <Form.Item label="出生地点/Place of Birth" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('BirthPlace', {
                initialValue: currentInfo.BirthPlace,
                rules: [
                  {
                    required: true,
                    message: '输入出生地点'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="户口所在地/Native Place" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('PlaceOfHuKou', {
                initialValue: currentInfo.PlaceOfHuKou,
                rules: [
                  {
                    required: true,
                    message: '户口所在地必填'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="血型/Blood Type" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('BloodType', {
                initialValue: currentInfo.BloodType,
                rules: [
                  {
                  
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="现通讯地址/Current Correspond Address" {...formItemLayout} className="applay__information-content" >
              {getFieldDecorator('CurrentAddress', {
                initialValue: currentInfo.CurrentAddress,
                rules: [
                  {
                    required: true,
                    message: '输入现居住的地址'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="有无推荐人/If have recommender"
              {...formItemLayout}
              className="applay__information-content"
            >
              {getFieldDecorator('IfRecommendByF', {
                initialValue: currentInfo.IfRecommendByF,
                rules: [
                  {
                    required: true,
                    message: '输入国籍'
                  }
                ]
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="推荐人姓名/Recommended by" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('Recommender', {
                initialValue: currentInfo.Recommender
              })(<Input />)}
            </Form.Item>
            <Form.Item label="和推荐人关系/Relationship" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('RecomenderRelation', {
                initialValue: currentInfo.RecomenderRelation
              })(<Input />)}
            </Form.Item>
            <Form.Item label="婚姻状况（选填）/Marital Status(Optional)" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('MaritalStatus', {
                initialValue: currentInfo.MaritalStatus
              })(<Input />)}
            </Form.Item>
            <Form.Item label="有无子女（选填）/Children,of any(Optional)" {...formItemLayout} className="applay__information-content">
              {getFieldDecorator('ChildIf', {
                initialValue: currentInfo.ChildIf
              })(<Input />)}
            </Form.Item>
          </div>
          <h3 className="applay__information-title" id="教育背景" >
          Education Background (Please start from latest education to middle school)/教育背景(请从最近教育开始填写至中学)
          </h3>
          <div className="information__boundary">
            <Form.Item label="开始日期（年/月）/StartTime(Year/Month)" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdStartTime1', {
                initialValue: currentInfo.EdStartTime1
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="结束日期（年/月）/EndTime(Year/Month)" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdEndTime1', {
                initialValue: currentInfo.EdEndTime1
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="学校/学院/大学Name of School/Colleges/Universities" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdSchool1', {
                initialValue: currentInfo.EdSchool1
              })(<Input />)}
            </Form.Item>

            <Form.Item label="专业名称/Major" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdMajor1', {
                initialValue: currentInfo.EdMajor1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="学位/Degree" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdDegree1', {
                initialValue: currentInfo.EdDegree1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdReference1', {
                initialValue: currentInfo.EdReference1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdReferenceTel1', {
                initialValue: currentInfo.EdReferenceTel1
              })(<Input />)}
            </Form.Item>
            <hr/>
            <div className={currentInfo.EdStartTime2?'':'hidden'}>
            <Form.Item label="开始日期（年/月）/StartTime(Year/Month)" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdStartTime2', {
                initialValue: currentInfo.EdStartTime2
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="结束日期（年/月）/EndTime(Year/Month)" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdEndTime2', {
                initialValue: currentInfo.EdEndTime2
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="学校/学院/大学Name of School/Colleges/Universities" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdSchool2', {
                initialValue: currentInfo.EdSchool2
              })(<Input />)}
            </Form.Item>
            <Form.Item label="专业名称/Major" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdMajor2', {
                initialValue: currentInfo.EdMajor2
              })(<Input />)}
            </Form.Item>
            <Form.Item label="学位/Degree" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdDegree2', {
                initialValue: currentInfo.EdDegree2
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdReference2', {
                initialValue: currentInfo.EdReference2
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdReferenceTel2', {
                initialValue: currentInfo.EdReferenceTel2
              })(<Input />)}
            </Form.Item>
            <hr/>
            </div>
            <div className={currentInfo.EdStartTime3?'':'hidden'}>

            <Form.Item label="开始日期（年/月）/StartTime(Year/Month)" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdStartTime3', {
                initialValue: currentInfo.EdStartTime3
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="结束日期（年/月）/EndTime(Year/Month)" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdEndTime3', {
                initialValue: currentInfo.EdEndTime3
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="学校/学院/大学Name of School/Colleges/Universities" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdSchool3', {
                initialValue: currentInfo.EdSchool3
              })(<Input />)}
            </Form.Item>
            <Form.Item label="专业名称/Major" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdMajor3', {
                initialValue: currentInfo.EdMajor3
              })(<Input />)}
            </Form.Item>
            <Form.Item label="学位/Degree" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdDegree3', {
                initialValue: currentInfo.EdDegree3
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdReference3', {
                initialValue: currentInfo.EdReference3
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdReferenceTel3', {
                initialValue: currentInfo.EdReferenceTel3
              })(<Input />)}
            </Form.Item>
            <hr/>
            </div>
            <div className={currentInfo.EdStartTime4?'':'hidden'}>

            <Form.Item label="开始日期（年/月）/StartTime(Year/Month)" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdStartTime4', {
                initialValue: currentInfo.EdStartTime4
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="结束日期（年/月）/EndTime(Year/Month)" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdEndTime4', {
                initialValue: currentInfo.EdEndTime4
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="学校/学院/大学Name of School/Colleges/Universities" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdSchool4', {
                initialValue: currentInfo.EdSchool4
              })(<Input />)}
            </Form.Item>
            <Form.Item label="专业名称/Major" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdMajor4', {
                initialValue: currentInfo.EdMajor4
              })(<Input />)}
            </Form.Item>
            <Form.Item label="学位/Degree" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdDegree4', {
                initialValue: currentInfo.EdDegree4
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdReference4', {
                initialValue: currentInfo.EdReference4
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('EdReferenceTel4', {
                initialValue: currentInfo.EdReferenceTel4
              })(<Input />)}
            </Form.Item>
            </div>
          </div>
          <h3 className="applay__information-title" id="工作经验">
            Working History (Please start with latest one)/工作经历(请从最近职位开始填写)
          </h3>
          <div className="information__boundary">
            <Form.Item
              label="开始时间(年/月)/StartTime(Year/Month)  "
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkStartTime1', {
                initialValue: currentInfo.WorkStartTime1
                  })(
              <Input />
              )}
            </Form.Item>
            <Form.Item
              label="结束时间(年/月)/EndTime(Year/Month)  "
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkEndTime1', {
                initialValue: currentInfo.WorkEndTime1
                  })(
              <Input />
              )}
            </Form.Item>
            <Form.Item
              label="公司名称及类型/Name of Company & Type"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkComName1', {
                initialValue: currentInfo.WorkComName1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="职位/Position" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkRank1', {
                initialValue: currentInfo.WorkRank1
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="离职原因/Reason For Leaving"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('ReasonForLeave1', {
                initialValue: currentInfo.ReasonForLeave1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkReference1', {
                initialValue: currentInfo.WorkReference1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkReferenceTel1', {
                initialValue: currentInfo.WorkReferenceTel1
              })(<Input />)}
            </Form.Item>
            <hr/>
            <div className={currentInfo.WorkStartTime2?'':'hidden'}>

            <Form.Item
              label="开始时间(年/月)/StartTime(Year/Month)  "
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkStartTime2', {
                initialValue: currentInfo.WorkStartTime2
                  })(
              <Input />
              )}
            </Form.Item>
            <Form.Item
              label="结束时间(年/月)/EndTime(Year/Month)  "
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkEndTime2', {
                initialValue: currentInfo.WorkEndTime2
                  })(
              <Input />
              )}
            </Form.Item>
            <Form.Item
              label="公司名称及类型/Name of Company & Type"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkComName2', {
                initialValue: currentInfo.WorkComName2
              })(<Input />)}
            </Form.Item>
            <Form.Item label="职位/Position" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkRank2', {
                initialValue: currentInfo.WorkRank2
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="离职原因/Reason For Leaving"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('ReasonForLeave2', {
                initialValue: currentInfo.ReasonForLeave2
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkReference2', {
                initialValue: currentInfo.WorkReference2
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkReferenceTel2', {
                initialValue: currentInfo.WorkReferenceTel2
              })(<Input />)}
            </Form.Item>
            <hr/>
            </div>
            <div className={currentInfo.WorkStartTime3?'':'hidden'}>

            <Form.Item
              label="开始时间(年/月)/StartTime(Year/Month)  "
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkStartTime3', {
                initialValue: currentInfo.WorkStartTime3
                  })(
              <Input />
              )}
            </Form.Item>
            <Form.Item
              label="结束时间(年/月)/EndTime(Year/Month)  "
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkEndTime3', {
                initialValue: currentInfo.WorkEndTime3
                  })(
              <Input />
              )}
            </Form.Item>
            <Form.Item
              label="公司名称及类型/Name of Company & Type"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkComName3', {
                initialValue: currentInfo.WorkComName3
              })(<Input />)}
            </Form.Item>
            <Form.Item label="职位/Position" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkRank3', {
                initialValue: currentInfo.WorkRank3
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="离职原因/Reason For Leaving"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('ReasonForLeave3', {
                initialValue: currentInfo.ReasonForLeave3
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkReference3', {
                initialValue: currentInfo.WorkReference3
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkReferenceTel3', {
                initialValue: currentInfo.WorkReferenceTel3
              })(<Input />)}
            </Form.Item>
            <hr/>
            </div>
            <div className={currentInfo.WorkStartTime4?'':'hidden'}>

            <Form.Item
              label="开始时间(年/月)/StartTime(Year/Month)  "
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkStartTime4', {
                initialValue: currentInfo.WorkStartTime4
                  })(
              <Input />
              )}
            </Form.Item>
            <Form.Item
              label="结束时间(年/月)/EndTime(Year/Month)  "
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkEndTime4', {
                initialValue: currentInfo.WorkEndTime4
                  })(
              <Input />
              )}
            </Form.Item>
            <Form.Item
              label="公司名称及类型/Name of Company & Type"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('WorkComName4', {
                initialValue: currentInfo.WorkComName4
              })(<Input />)}
            </Form.Item>
            <Form.Item label="职位/Position" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkRank4', {
                initialValue: currentInfo.WorkRank4
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="离职原因/Reason For Leaving"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('ReasonForLeave14', {
                initialValue: currentInfo.ReasonForLeave4
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkReference4', {
                initialValue: currentInfo.WorkReference4
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('WorkReferenceTel4', {
                initialValue: currentInfo.WorkReferenceTel4
              })(<Input />)}
            </Form.Item>
            </div>
          </div>
          <h3 className="applay__information-title" id="家庭成员关系">
            Family Members and Mainly Social Relationship 家庭成员及主要社会关系
          </h3>
          <div className="information__boundary">
            <Form.Item label="姓名/Name" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamName1', {
                initialValue: currentInfo.FamName1,
                rules: [
                  {
                    required: true,
                    message: '输入姓名'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="关系/Relationship" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamRelation1', {
                initialValue: currentInfo.FamRelation1,
                rules: [
                  {
                    required: true,
                    message: '输入与该成员的关系'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="出生年月/Date of Birth" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamBirthDate1', {
                initialValue: moment(currentInfo.FamBirthDate1).format("YYYY-MM-DD")
              })(<Input />)}
            </Form.Item>
            <Form.Item label="职务/Position" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamPosition1', {
                initialValue: currentInfo.FamPosition1
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="公司名称及地址/Name of Company&Address"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('FamComAndAdd1', {
                initialValue: currentInfo.FamComAndAdd1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamTel1', {
                initialValue: currentInfo.FamTel1,
                rules: [
                  {
                    required: true,
                    message: '输入该成员的电话号码'
                  }
                ]
              })(<Input />)}
            </Form.Item>

            <hr/>
            <div className={currentInfo.FamName2?'':'hidden'}>

            <Form.Item label="姓名/Name" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamName2', {
                initialValue: currentInfo.FamName2,
                rules: [
                  {
                    message: '输入姓名'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="关系/Relationship" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamRelation2', {
                initialValue: currentInfo.FamRelation2,
                rules: [
                  {
                    message: '输入与该成员的关系'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="出生年月/Date of Birth" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamBirthDate2', {
                initialValue: currentInfo.FamBirthDate2
              })(<Input />)}
            </Form.Item>
            <Form.Item label="职务/Position" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamPosition2', {
                initialValue: currentInfo.FamPosition2
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="公司名称及地址/Name of Company&Address"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('FamComAndAdd2', {
                initialValue: currentInfo.FamComAndAdd2
              })(<Input />)}
            </Form.Item>
            <Form.Item label="电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('FamTel2', {
                initialValue: currentInfo.FamTel2,
                rules: [
                  {
                    message: '输入该成员的电话号码'
                  }
                ]
              })(<Input />)}
            </Form.Item>
              </div>
          </div>
          <h3 className="applay__information-title" id="专业培训" >
            Professional Qualification/Training 专业资格/培训
          </h3>
          <div className="information__boundary">
            <Form.Item label="日期/Date/Period " {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingDate1', {
                initialValue: currentInfo.TrainingDate1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="培训机构/Name of Training Institute" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingInstitute1', {
                initialValue: currentInfo.TrainingInstitute1
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="培训课程/Training Courses"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('TrainingCourese1', {
                initialValue: currentInfo.TrainingCourese1
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="专业资格/Pofessional Qualification"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('TrainingQualification1', {
                initialValue: currentInfo.TrainingQualification1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingReference1', {
                initialValue: currentInfo.TrainingReference1
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingRefTel1', {
                initialValue: currentInfo.TrainingRefTel1
              })(<Input />)}
            </Form.Item>
            <hr/>
            <div className={currentInfo.TrainingDate2?'':'hidden'}>
            
            <Form.Item label="日期/Date/Period " {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingDate2', {
                initialValue: currentInfo.TrainingDate2
              })(<Input />)}
            </Form.Item>
            <Form.Item label="培训机构/Name of Training Institute" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingInstitute2', {
                initialValue: currentInfo.TrainingInstitute2
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="培训课程/Training Courses"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('TrainingCourese2', {
                initialValue: currentInfo.TrainingCourese2
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="专业资格/Pofessional Qualification"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('TrainingQualification2', {
                initialValue: currentInfo.TrainingQualification2
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingReference2', {
                initialValue: currentInfo.TrainingReference2
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingRefTel2', {
                initialValue: currentInfo.TrainingRefTel2
              })(<Input />)}
            </Form.Item>
            <hr/>
            
            </div>
            <div className={currentInfo.TrainingDate3?'':'hidden'}>

            <Form.Item label="日期/Date/Period " {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingDate3', {
                initialValue: currentInfo.TrainingDate3
              })(<Input />)}
            </Form.Item>
            <Form.Item label="培训机构/Name of Training Institute" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingInstitute3', {
                initialValue: currentInfo.TrainingInstitute3
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="培训课程/Training Courses"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('TrainingCourese3', {
                initialValue: currentInfo.TrainingCourese3
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label="专业资格/Pofessional Qualification"
              {...formItemLayout2}
              className="applay__information-content"
            >
              {getFieldDecorator('TrainingQualification3', {
                initialValue: currentInfo.TrainingQualification3
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人/Reference" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingReference3', {
                initialValue: currentInfo.TrainingReference3
              })(<Input />)}
            </Form.Item>
            <Form.Item label="证明人电话/Telephone" {...formItemLayout2} className="applay__information-content">
              {getFieldDecorator('TrainingRefTel3', {
                initialValue: currentInfo.TrainingRefTel3
              })(<Input />)}
            </Form.Item>
            </div>
          </div>
          <h3 className="applay__information-title" id="相关技能">
          Related Qualification / Skill (If any) 相关技能
          </h3>
          <Form.Item label="常用外语/CommonLanguage" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Language', {
              initialValue: currentInfo.Language
            })(<Input />)}
          </Form.Item>
          <Form.Item label="外语等级/Level" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('EnCET', {
              initialValue: currentInfo.EnCET
            })(<Select>
              {englishgarde.map((item, index) => {
                return (
                  <Option key={index} value={item.value}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>)}
          </Form.Item>
          <Form.Item label="写作/Writing" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Writing', {
              initialValue: currentInfo.Writing
            })(
              <Select>
                {languageAbility.map((item, index) => {
                  return (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="阅读/Reading" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Reading', {
              initialValue: currentInfo.Reading
            })(
              <Select>
                {languageAbility.map((item, index) => {
                  return (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="口语/Speaking" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Speaking', {
              initialValue: currentInfo.Speaking
            })(
              <Select>
                {languageAbility.map((item, index) => {
                  return (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="听力/Listening" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Listening', {
              initialValue: currentInfo.Listening
            })(
              <Select>
                {languageAbility.map((item, index) => {
                  return (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          {/* <Form.Item label="计算机技能/ComputerSkills" /> */}
          <Form.Item label="计算机技能/Computer Skill" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('ComputerSkills', {
              initialValue: currentInfo.ComputerSkills
            })(
              <Select>
                {languageAbility.map((item, index) => {
                  return (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="列出常用软件/List Name of Software Used" className="applay__information-content">
            {getFieldDecorator('SoftList', {
              initialValue: currentInfo.SoftList
            })(<Input />)}
          </Form.Item>
          <Form.Item label="其他技能/Other Skill(If any)" className="applay__information-content">
            {getFieldDecorator('OtherSkills', {
              initialValue: currentInfo.OtherSkills
            })(<Input />)}
          </Form.Item>
          <h3 className="applay__information-title" id="其他">
            Other information 其他资料
          </h3>
          <Form.Item label="身高(CM)/Height" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Height', {
              initialValue: currentInfo.Height
            })(<Input />)}
          </Form.Item>
          <Form.Item label="体重(KG)/Weight" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('Weight', {
              initialValue: currentInfo.Weight
            })(<Input />)}
          </Form.Item>
          <Form.Item label="视力左 /Eye Left sight" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('EyeSight', {
              initialValue: currentInfo.EyeSight
            })(<Input />)}
          </Form.Item>
          <Form.Item label="视力右 /Eye Right sight" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('EyeSightR', {
              initialValue: currentInfo.EyeSightR
            })(<Input />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                是否得过严重的疾病？目前身体状况如何？是否患有传染病，慢性病等？
                <br />
                Have you ever been suffering from any severe disease? What are
                your current health? Are you sick for contagion, or chronic etc.
              </p>
            }
          >
            {getFieldDecorator('DiseaseStatus', {
              initialValue: currentInfo.DiseaseStatus
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }} >
                是否有犯罪记录或失信行为记录？如是，请详细说明
                <br />
                Do you have criminal history or discredit history? If yes,
                please give the details.
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('Criminal', {
              initialValue: currentInfo.Criminal
            })(
              <TextArea/>
            )}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }} >
                是否有过4个月以上的失业经历？如有，请详细说明。
                <br />
                Do you have any unemployed period of more than 4 months? If yes,
                please give the details.
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('UnemployedStatus', {
              initialValue: currentInfo.UnemployedStatus
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                是否认识本公司的员工？
                <br />
                Do you know any employee of Finisar Inc.?
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('KnowColleageStatus', {
              initialValue: currentInfo.KnowColleageStatus
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                请详细指出姓名。
                <br />
                Please give his/her name and relationship.
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('Recommender', {
              initialValue: [
                currentInfo.Recommender
              ]
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                请详细指出与其关系。
                <br />
                Please give his/her name and relationship.
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('RecomenderRelation', {
              initialValue: [
                currentInfo.RecomenderRelation
              ]
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                与现任雇主的合同或服务协议是否到期？
                <br />
                Do you have any unexpired contract or service agreement with
                your present employer?
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('OtherAgreement', {
              initialValue: currentInfo.OtherAgreement
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                是否签署过竞业限制协议或保密协议？请说明何时到期及是否需赔款？
                <br />
                Do you have ever signed non-competition agreement or
                confidentiality agreement?Please explain when does the contract
                or agreement at term?
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('CompetitionAgreement', {
              initialValue: [
                currentInfo.CompetitionAgreement,
              ]
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                办理离职手续需多长时间？
                <br />
                Do you need to pay compensation for demission?
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('HowLong', {
              initialValue: currentInfo.HowLong
            })(<TextArea />)}
          </Form.Item>
          <Form.Item
            colon={false}
            label={
              <p style={{ height: 25 }}>
                如被录用何时可以上班？
                <br />
                When would be available for you?
              </p>
            }
            className="applay__information-content"
          >
            {getFieldDecorator('WhenOn', {
              initialValue: currentInfo.WhenOn
            })(<TextArea />)}
          </Form.Item>
          <h3 className="applay__information-title" id="自我评价">
          自我评价/Self Appraisement
          </h3>
          <Form.Item label="自我评价/Appraisement" {...formItemLayout2} className="applay__information-content">
            {getFieldDecorator('SelfAccessment', {
              initialValue: currentInfo.SelfAccessment
            })(<TextArea />)}
          </Form.Item>
          <div>
              <h3>Commitments/本人承诺</h3>
              <p style={{padding:5,textAlign:'left'}}>1) All informantion given are true and accurate ,otherwise I'm willing to be punished even dismissed.<br/>  
              <div style = {{textIndent:'1em'}}>所有填表内容真实、准确,如有虚假愿意接受处分包括辞退</div>
              </p>
              <p style={{padding:5,textAlign:'left'}}>2) I agree with further background check.
                <br/>
                <div style = {{textIndent:'1em'}}>本人同意公司进行背景调查</div>
                </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style = {{width:"100%",height:"40px"}}>
              <div className = "applay__informnation-signPerson" > 申请人签名/Signature of Applicant </div>
              <div className = "applay__informnation-date">日期/Date</div>
            </div>
			
            <Form.Item  style={{ textAlign: 'center',position:'fixed',bottom:'-17px',background:"#fff",width:'calc( 100% - 249px)',paddingRight:'24px',right:0,height:'40px'}}>
            <div  style={{marginTop:'-4px',float:'right'}}>
              <Button style={{marginLeft:'8px'}} onClick={this.handleClick}>
                预览
              </Button>
              
			  {(this.state.currentInfo.isReturn=='Y')?(<span style={{marginLeft:'8px',color:'red'}}>该记录已退回</span>):(<Button type='danger' className={this.state.userChara=='HR'?'':'hidden'}style={{marginLeft:'8px'}} onClick={this.reFill}>退回</Button>)}
              </div>
              <Button type="primary" style={this.state.userChara=='HR'?{float:'right'}:{display:'none'}} onClick={this.handleSave}>保存</Button>
              <Button type="primary" style={(this.state.userChara=='IDLUser')&&(this.state.currentInfo.isReturn=='Y')?{float:'right'}:{display:'none'}} onClick={this.handleSave}>保存</Button>
              
            </Form.Item>
			
          </div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Applayinformation);
