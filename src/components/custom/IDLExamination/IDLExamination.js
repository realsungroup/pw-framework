import React, { Component } from 'react';
import './IDLExamination.less';
import {
  Menu,
  Icon,
  Form,
  Input,
  DatePicker,
  Radio,
  Button,
  Select,
  Modal,
  Spin,
  message,
  Row,
  Table
} from 'antd';
import moment from 'moment';
import logo from '../../../assets/logo.png';
// const { getFieldDecorator } = this.props.form;

class IDLExamination extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }
  componentDidMount = () => {
  };

  onPrinting = () => {
    const bodyHtml = window.document.body.innerHTML;
    window.document.body.innerHTML = this.printer.innerHTML;
    window.print();
    window.document.body.innerHTML = bodyHtml;
    window.location.reload();
  };
  render() {
    return (
      <div className="container">
        <div id="content" ref={p => (this.printer = p)}>

          <div style={{ textAlign: 'center' }}>
            <h2 className="header">Job Application Form / 工作申请表</h2>
          </div>
          <div style={{ float: 'left', fontWeight: 'bold' }}>
            Personal Information 个人资料
          </div>
          <div style={{ clear: 'both', marginBottom: '10px',width:'100%' }}>
            <table border="1" className='baseInfo' style={{width:'100%'}}>
              <tr style={{ fontSize: '12px', height: '35px' }}>
                <th style={{width:'311px'}} >
                  <div style={{ float: 'left', marginLeft: '5px'}}>
                    <p>Position for Applied</p>
                    <p>申请职位名称:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '10px',
                      marginLeft: '20x',
                      float: 'right'
                    }}
                  >
                  {this.props.data.appPosition}
                  </div>
                </th>
                <th style={{ width: '190px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Name in China</p>
                    <p>中文姓名:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '15px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.ChName}
                  </div>
                </th>
                <th style={{ width: '190px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Name in English</p>
                    <p>英文姓名:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '15px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.EnName}
                  </div>
                </th>
                <th style={{ width: '152px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Gender</p>
                    <p>性别:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '20px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.Sex}
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '12px', height: '35px' }}>
                <th>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Number of ID Card</p>
                    <p>身份证号码:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '10px',
                      marginLeft: '20x',
                      float: 'right'
                    }}
                  >
                    {this.props.data.IDCardNumber}
                  </div>
                </th>
                <th style={{ width: '190px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Nationality</p>
                    <p>国籍:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '15px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.Nationality}
                  </div>
                </th>
                <th style={{ width: '190px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Nationality</p>
                    <p style={{ width: '73px' }}>民族:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '15px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.Nation}
                  </div>
                </th>
                <th style={{ width: '152px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Party Affiliation</p>
                    <p style={{ width: '70px' }}>政治面貌:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '20px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.Party}
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '12px', height: '35px' }}>
                <th>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Date of Birth ( year/month/day )</p>
                    <p style={{ width: '100px' }}>出生日期 :</p>
                  </div>
                  <div
                    style={{
                      marginTop: '10px',
                      marginLeft: '20x',
                      float: 'right'
                    }}
                  >
                    <p style={{width:"78px",whiteSpace:'nowrap',overflow:'hidden'}}>{this.props.data.BirthDate}</p>
                  </div>
                </th>
                <th style={{ width: '190px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Place of Birth</p>
                    <p>出生地点:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '15px',
                      float: 'right'
                      ,width:'90px'
                    }}
                  >
                    {this.props.data.BirthPlace}
                  </div>
                </th>
                <th style={{ width: '190px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Native Place</p>
                    <p>籍贯:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '15px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.NativePlace}
                  </div>
                </th>
                <th style={{ width: '152px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Blood Type</p>
                    <p style={{ width: '73px' }}>血型:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '20px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.BloodType}
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '12px', height: '35px' }}>
                <th>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Place of Hukou Registered (Province/City)</p>
                    <p style={{ width: '106px' }}>户口所在地:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '20px',
                      marginLeft: '20x',
                      float: 'right'
                    }}
                  >
                    {this.props.data.PlaceOfHuKou}
                  </div>
                </th>
                <th style={{ width: '190px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p style={{ width: '48px' }}>MP </p>
                    <p style={{ width: '60px' }}>手机:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '15px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.Tel}
                  </div>
                </th>
                <th style={{ width: '190px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Marital Status(Optional)</p>
                    <p style={{ width: '132px' }}>婚姻状况(选填):</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '15px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.MaritalStatus}
                  </div>
                </th>
                <th style={{ width: '152px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Children,if any </p>
                    <p>有无子女(选填):</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '20px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.ChildIf}
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '12px', height: '35px' }}>
                <th colSpan="2">
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Current Correspondence Address</p>
                    <p style={{ width: '106px' }}>现通讯地址:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '20px',
                      marginLeft: '20x',
                      float: 'right'
                    }}
                  >
                    {this.props.data.CurrentAddress}
                  </div>
                </th>

                <th style={{ width: '380px' }} colSpan="2">
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>E-mail</p>
                    <p style={{ width: '77px' }}>邮箱:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '15px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.Email}
                  </div>
                </th>
                {/* <th style = {{borderLeft:"none"}}></th> */}
              </tr>
              <tr style={{ fontSize: '12px', height: '35px' }}>
                <th>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Recommended by Finisar employee or not? </p>
                    <p style={{ width: '170px' }}>是否由菲尼萨员工推荐?:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '10px',
                      marginLeft: '20x',
                      float: 'right'
                    }}
                  >
                    {this.props.data.Recommender?'是':'否'}
                  </div>
                </th>
                <th style={{ width: '190px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Recommended by </p>
                    <p style={{ width: '67px' }}>推荐人:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '15px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.Recommender}
                  </div>
                </th>
                <th colspan="2" style={{ width: '190px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Relationship</p>
                    <p>关系:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '15px',
                      float: 'right'
                    }}
                  >
                    {this.props.data.RecomenderRelation}
                  </div>
                </th>
              </tr>
            </table>
          </div>
          <p style={{ float: 'left', fontWeight: 'bold'}}>
            Education Background (Please start from latest education to middle
            school) / 教育背景（请从最近教育开始填写至中学）
          </p>
          <div style={{ clear: 'both', marginBottom: '10px' ,width:'100%'}}>
            <dl >
              <dd >
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
                  <div>Period(Year/Month)<p>年限（年/月）</p></div>
                  <div>From由</div>
                  <div>To至</div>
                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
                  <div>Name of School/Colleges/Universities</div><div>学校/学院/大学</div>
                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
                  <div>Major</div><div>专业</div>
                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
                  <div>Degree</div><div>学位</div>
                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
                  <div>Reference</div><div>证明人</div>
                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
                  <div>Telephone</div><div>电话</div>
                </div>
              </dd>
              <dt>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
                {this.props.data.EdStartTime1}<br/>{this.props.data.EdEndTime1}
                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdSchool1}</p>
                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdMajor1}</p>
                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdDegree1}</p>

                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdReference1}</p>

                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdReferenceTel1}</p>
                </div>
              </dt>
              <dt>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
                {this.props.data.EdStartTime2}<br/>{this.props.data.EdEndTime2}

                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdSchool2}</p>

                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p> {this.props.data.EdMajor2}</p>

                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdDegree2}</p>

                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdReference2}</p>

                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdReferenceTel2}</p>

                </div>
              </dt>
              <dt>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
                {this.props.data.EdStartTime3}<br/>{this.props.data.EdEndTime3}

                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdSchool3}</p>

                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdMajor3}</p>

                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdDegree3}</p>

                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdReference3}</p>

                </div>
                <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
                <p>{this.props.data.EdReferenceTel3}</p>

                </div>
              </dt>
              <dt>
              <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
              {this.props.data.EdStartTime4}<br/>{this.props.data.EdEndTime4}

              </div>
              <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
              <p>{this.props.data.EdSchool4}</p>

              </div>
              <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
              <p>{this.props.data.EdMajor4}</p>

              </div>
              <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
              <p>{this.props.data.EdDegree4}</p>

              </div>
              <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
              <p>{this.props.data.EdReference4}</p>

              </div>
              <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
              <p>{this.props.data.EdReferenceTel4}</p>

              </div>
              </dt>
            </dl>
          </div>

         <p style={{ float: 'left', fontWeight: 'bold' }}>
          Working History (Please start with latest one)
          工作经验（请从最近职位开始填写）
        </p>
        <div style={{ clear: 'both', marginBottom: '10px' }}>
        <dl>
          <dd>
            <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
              <div>Post Period<p>任职年限</p></div>
              <div>From由</div>
              <div>To至</div>
            </div>
            <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
              <div>Name of Company&Type</div><div>公司名称及类型</div>
            </div>
            <div className='innerRect' style={{width:'120px',fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
              <div>Position</div><div>职位</div>
            </div>
            <div className='innerRect' style={{width:'200px',fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
              <div>Reason For Leaving</div><div>离职原因</div>
            </div>
            <div className='innerRect' style={{width:'70px',fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
              <div>Reference</div><div>证明人</div>
            </div>
            <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
              <div>Telephone</div><div>电话</div>
            </div>
          </dd>
          <dt>
            <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
            {this.props.data.WorkStartTime1}<br/>{this.props.data.WorkEndTime1}
            </div>
            <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
            <p>{this.props.data.WorkComName1}</p>
            </div>
            <div className='innerRect' style={{width:'120px',fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
            <p>{this.props.data.WorkRank1}</p>

            </div>
            <div className='innerRect' style={{width:'200px',fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
            <p>{this.props.data.ReasonForLeave1}</p>

            </div>
            <div className='innerRect' style={{width:'70px',fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
            <p>{this.props.data.WorkReference1}</p>

            </div>
            <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
            <p>{this.props.data.WorkReferenceTel1}</p>

            </div>
          </dt>
          <dt>
          <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
          {this.props.data.WorkStartTime2}<br/>{this.props.data.WorkEndTime2}
          </div>
          <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p>{this.props.data.WorkComName2}</p>
          </div>
          <div className='innerRect' style={{width:'120px',fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p>{this.props.data.WorkRank2}</p>

          </div>
          <div className='innerRect' style={{width:'200px',fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p> {this.props.data.ReasonForLeave2}</p>

          </div>
          <div className='innerRect' style={{width:'70px',fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p>{this.props.data.WorkReference2}</p>

          </div>
          <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p>{this.props.data.WorkReferenceTel2}</p>

          </div>
          </dt>
          <dt>
          <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
          {this.props.data.WorkStartTime3}<br/>{this.props.data.WorkEndTime3}
          </div>
          <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p>{this.props.data.WorkComName3}</p>
          </div>
          <div className='innerRect' style={{width:'120px',fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p>{this.props.data.WorkRank3}</p>

          </div>
          <div className='innerRect' style={{width:'200px',fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p>{this.props.data.ReasonForLeave3}</p>

          </div>
          <div className='innerRect' style={{width:'70px',fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p>{this.props.data.WorkReference3}</p>

          </div>
          <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p> {this.props.data.WorkReferenceTel3}</p>

          </div>
          </dt>
          <dt>
          <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px'}}>
          {this.props.data.WorkStartTime4}<br/>{this.props.data.WorkEndTime4}
          </div>
          <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p> {this.props.data.WorkComName4}</p>
          </div>
          <div className='innerRect' style={{width:'120px',fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p> {this.props.data.WorkRank4}</p>

          </div>
          <div className='innerRect' style={{width:'200px',fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p> {this.props.data.ReasonForLeave4}</p>

          </div>
          <div className='innerRect' style={{width:'70px',fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p> {this.props.data.WorkReference4}</p>

          </div>
          <div className='innerRect' style={{fontSize:'12px',textAlign:'center',paddingTop:'2px',display:'flex',alignItems:'center'}}>
          <p> {this.props.data.WorkReferenceTel4}</p>

          </div>
          </dt>
        </dl>
        </div>

        <p style={{ float: 'left', fontWeight: 'bold' }}>
          Professional Qualification / Training 专业资格 / 培训
        </p>
        <div style={{ clear: 'both', marginBottom: '10px' }}>
          <table border="1">
            <tr style={{ fontSize: '12px', height: '35px' }}>
              <th style={{ width: '137px', padding: '0px' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>Date/Period</p>
                  <p>日期</p>
                </div>
              </th>
              <th style={{ width: '190px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>Name of Training Institute</p>
                  <p>培训机构</p>
                </div>
              </th>
              <th style={{ width: '190px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>Training Courses</p>
                  <p>培训课程</p>
                </div>
              </th>
              <th style={{ width: '100px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>Professional Qualification</p>
                  <p>专业资格</p>
                </div>
              </th>
              <th style={{ width: '100px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>Reference</p>
                  <p>证明人</p>
                </div>
              </th>
              <th style={{ width: '122px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>Telephone</p>
                  <p>电话</p>
                </div>
              </th>
            </tr>
            <tr style={{ fontSize: '12px', height: '35px' }}>
              <th
                style={{
                  width: '68px',
                  borderLeft: 'none',
                  borderBottom: '1px solid #000',
                  borderTop: 'none'
                }}
              >
              <div style={{ float: 'middle', marginLeft: '5px' ,fontSize:'12px',wordBreak:'normal'}}>
                <p>  {this.props.data.TrainingDate1}</p>
              </div>

              </th>

              <th style={{ width: '190px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingInstitute1}</p>
                </div>
              </th>
              <th style={{ width: '190px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px'}}>
                  <p>{this.props.data.TrainingCourese1}</p>
                </div>
              </th>
              <th style={{ width: '100px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingQualification1}</p>
                </div>
              </th>
              <th style={{ width: '100px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingReference1}</p>
                </div>
              </th>
              <th style={{ width: '122px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingRefTel1}</p>
                </div>
              </th>
            </tr>
            <tr style={{ fontSize: '12px', height: '35px' }}>
              <th
                style={{
                  width: '68px',
                  borderLeft: 'none',
                  borderBottom: '1px solid #000',
                  fontSize:'12px',
                  borderTop: 'none'
                }}
              >
                {this.props.data.TrainingDate2}
              </th>

              <th style={{ width: '190px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingInstitute2}</p>
                </div>
              </th>
              <th style={{ width: '190px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingCourese2}</p>
                </div>
              </th>
              <th style={{ width: '100px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingQualification2}</p>
                </div>
              </th>
              <th style={{ width: '100px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingReference2}</p>
                </div>
              </th>
              <th style={{ width: '122px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingRefTel2}</p>
                </div>
              </th>
            </tr>
            <tr style={{ fontSize: '12px', height: '35px' }}>
            <th
              style={{
                width: '68px',
                borderLeft: 'none',
                borderBottom: '1px solid #000',
                fontSize:'12px',
                borderTop: 'none'
              }}
            >
              {this.props.data.TrainingDate3}
            </th>

            <th style={{ width: '190px', clear: 'both' }}>
              <div style={{ float: 'middle', marginLeft: '5px' }}>
                <p>{this.props.data.TrainingInstitute3}</p>
              </div>
            </th>
            <th style={{ width: '190px', clear: 'both' }}>
              <div style={{ float: 'middle', marginLeft: '5px' }}>
                <p>{this.props.data.TrainingCourese3}</p>
              </div>
            </th>
            <th style={{ width: '100px', clear: 'both' }}>
              <div style={{ float: 'middle', marginLeft: '5px' }}>
                <p>{this.props.data.TrainingQualification3}</p>
              </div>
            </th>
            <th style={{ width: '100px', clear: 'both' }}>
              <div style={{ float: 'middle', marginLeft: '5px' }}>
                <p>{this.props.data.TrainingReference3}</p>
              </div>
            </th>
            <th style={{ width: '122px', clear: 'both' }}>
              <div style={{ float: 'middle', marginLeft: '5px' }}>
                <p>{this.props.data.TrainingRefTel3}</p>
              </div>
            </th>
            </tr>
            <tr style={{ fontSize: '12px', height: '35px' }}>
              <th
                style={{
                  width: '68px',
                  borderLeft: 'none',
                  borderBottom: 'none',
                  borderTop: 'none',
                  fontSize:'12px'
                }}
              >
                {this.props.data.TrainingDate4}
              </th>

              <th style={{ width: '190px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingInstitute4}</p>
                </div>
              </th>
              <th style={{ width: '190px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingCourese4}</p>
                </div>
              </th>
              <th style={{ width: '100px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingQualification4}</p>
                </div>
              </th>
              <th style={{ width: '100px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingReference4}</p>
                </div>
              </th>
              <th style={{ width: '122px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.TrainingRefTel4}</p>
                </div>
              </th>
            </tr>
          </table>
        </div>
        <p style={{ float: 'left', fontWeight: 'bold' }}>
          Family Members and Mainly Social Relationship 家庭成员及主要社会关系
        </p>
        <div style={{ clear: 'both', marginBottom: '20px' }}>
          <table border="1">
            <tr style={{ fontSize: '12px', height: '35px' }}>
              <th style={{ width: '90px', padding: '0px' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>Name</p>
                  <p>姓名</p>
                </div>
              </th>
              <th style={{ width: '90px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>Relationship</p>
                  <p>关系</p>
                </div>
              </th>
              <th style={{ width: '190px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>Date of Birth</p>
                  <p>出生年月</p>
                </div>
              </th>
              <th style={{ width: '100px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>Position</p>
                  <p>职务</p>
                </div>
              </th>
              <th style={{ width: '250px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>Name of Company & Address</p>
                  <p>公司名称及地址</p>
                </div>
              </th>
              <th style={{ width: '120px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>Telephone</p>
                  <p>电话</p>
                </div>
              </th>
            </tr>
            <tr style={{ fontSize: '12px', height: '35px' }}>
              <th
                style={{
                  width: '68px',
                  borderLeft: 'none',
                  borderBottom: '1px solid #000',
                  borderTop: 'none'
                }}
              >
                {this.props.data.FamName1}
              </th>

              <th style={{ width: '190px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.FamRelation1}</p>
                </div>
              </th>
              <th style={{ width: '190px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.FamBirthDate1?moment(this.props.data.FamBirthDate1).format("YYYY-MM-DD"):null}</p>
                </div>
              </th>
              <th style={{ width: '100px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.FamPosition1}</p>
                </div>
              </th>
              <th style={{ width: '100px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.FamComAndAdd1}</p>
                </div>
              </th>
              <th style={{ width: '122px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.FamTel1}</p>
                </div>
              </th>
            </tr>
            <tr style={{ fontSize: '12px', height: '35px' }}>
              <th
                style={{
                  width: '68px',
                  borderLeft: 'none',
                  borderBottom: 'none',
                  borderTop: 'none'
                }}
              >
                {this.props.data.FamName2}
              </th>

              <th style={{ width: '190px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.FamRelation2}</p>
                </div>
              </th>
              <th style={{ width: '190px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.FamBirthDate2?moment(this.props.data.FamBirthDate2).format("YYYY-MM-DD"):null}</p>
                </div>
              </th>
              <th style={{ width: '100px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.FamPosition2}</p>
                </div>
              </th>
              <th style={{ width: '100px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.FamComAndAdd2}</p>
                </div>
              </th>
              <th style={{ width: '122px', clear: 'both' }}>
                <div style={{ float: 'middle', marginLeft: '5px' }}>
                  <p>{this.props.data.FamTel2}</p>
                </div>
              </th>
            </tr>
          </table>
        </div>
        <div style={{ clear: 'both', marginBottom: '10px' }}>

        </div>
        <p style={{ float: 'left', fontWeight: 'bold',marginTop:'60px'}}>
          Related Qualification / Skill (If any) 相关技能
        </p>
        <div style={{ clear: 'both', marginBottom: '10px' }}>
          <table border="1">
            <tr style={{ fontSize: '12px', height: '35px' }}>
              <th style={{ width: '842px', padding: '0px' }} colspan="6">
                <div
                  style={{
                    float: 'middle',
                    marginLeft: '5px',
                    textAlign: 'left'
                  }}
                >
                  <p>Language Ability&nbsp;&nbsp;语言能力</p>
                  <p>
                    Please indicate by using请列明程度E (Excellent优秀) , G
                    (Good良好) , A(Average一般) or I (Inferior欠佳){' '}
                  </p>
                </div>
              </th>
            </tr>
            <tr>
              <td colspan="1" style={{ float: 'left', border: 'none' ,fontWeight:'bold',lineHeight:'45px'}}>
                {this.props.data.Language}
              </td>
              <td style={{ width: '140px' ,fontWeight:'bold'}}>
                  {this.props.data.EnCET}
              </td>
              <th style={{ width: '140px', textAlign: 'left' }}>
                <p style={{ float: 'left', marginLeft: 5 }}>Writing</p>
                <br />
                <p style={{ float: 'left', marginLeft: 5 }}>写作</p>
                <p style={{ float: 'right', marginTop: '-10px' }}>
                  {this.props.data.Writing}
                </p>
              </th>
              <th style={{ width: '150px', textAlign: 'left' }}>
                <p style={{ float: 'left', marginLeft: 5 }}>Reading</p>
                <br />
                <p style={{ float: 'left', marginLeft: 5 }}>阅读</p>
                <p style={{ float: 'right', marginTop: '-10px' }}>
                  {this.props.data.Reading}
                </p>
              </th>
              <th style={{ width: '150px', textAlign: 'left' }}>
                <p style={{ float: 'left', marginLeft: 5 }}>Speaking</p>
                <br />
                <p style={{ float: 'left', marginLeft: 5 }}>口语</p>
                <p style={{ float: 'right', marginTop: '-10px' }}>
                  {this.props.data.Speaking}
                </p>
              </th>
              <th style={{ width: '150px', textAlign: 'left' }}>
                <p style={{ float: 'left', marginLeft: 5 }}>Listening</p>
                <br />
                <p style={{ float: 'left', marginLeft: 5 }}>听力</p>
                <p style={{ float: 'right', marginTop: '-10px' }}>
                  {this.props.data.Listening}
                </p>
              </th>
            </tr>
            <tr style={{}}>
              <td style={{ width: 842 }} colspan="6">
                <span style={{ float: 'left', padding: '3px 0 3px 0' ,marginLeft:'8px',fontWeight:'bold'}}>
                  Computer Skill 计算机技能：
                </span>
                <span style={{ float: 'right', padding: '3px 0 3px 0' ,marginRight:'8px',fontWeight:'bold'}}>
                  {this.props.data.ComputerSkills}
                </span>
              </td>
            </tr>
            <tr style={{}}>
              <td style={{ width: 842 }} colspan="6">
                <p style={{ float: 'left' ,marginLeft:'8px',fontWeight:'bold'}}>List Name of Software Used</p>
                <br />
                <p style={{ float: 'left',marginLeft:'8px',fontWeight:'bold' }}>列出常用软件</p>
                <p style={{ float: 'right', marginTop: '-10px' ,fontWeight:'bold',marginRight:'8px'}}>
                  {this.props.data.SoftList}
                </p>
              </td>
            </tr>
            <tr style={{}}>
              <td style={{ width: 842 }} colspan="6">
                <span style={{ float: 'left', padding: '3px 0 3px 0' ,marginLeft:'8px',fontWeight:'bold'}}>
                  Other Skill(If any)其他技能：
                </span>
                <span style={{ float: 'right', padding: '3px 0 3px 0' ,marginRight:'8px',fontWeight:'bold'}}>
                  {this.props.data.OtherSkills}
                </span>
              </td>
            </tr>
          </table>
        </div>
        <div style={{ textAlign: 'left',marginTop:'10px' }}>
          <p style={{ fontWeight: 'bold' }}>Other Information 其他资料</p>
          <p style={{ fontWeight: 'bold' }}>
            Please answer the following questions. 请回答下列问题
          </p>
        </div>
        <div style={{ clear: 'both', marginBottom: '10px' }}>
          <table border="1">
            <tr style={{ width: 842 }}>
              <th style={{ width: '150px', textAlign: 'left' }}>
                <p style={{ float: 'left', marginLeft: 5 }}>Weight</p>
                <br />
                <p style={{ float: 'left', marginLeft: 5 }}>体重</p>
                <p style={{ float: 'right', marginTop: '-10px' }}>
                  {this.props.data.Weight}KG
                </p>
              </th>
              <th style={{ width: '150px', textAlign: 'left' }}>
                <p style={{ float: 'left', marginLeft: 5 }}>Height</p>
                <br />
                <p style={{ float: 'left', marginLeft: 5 }}>身高</p>
                <p style={{ float: 'right', marginTop: '-10px' }}>
                  {this.props.data.Height}CM
                </p>
              </th>
              <th style={{ width: '542px', textAlign: 'left' }}>
                <div style={{ marginLeft: 5, float: 'left', height: 45 }}>
                  <p style={{ float: 'left', marginLeft: 5 }}>Eye Sight</p>
                  <br />
                  <p style={{ float: 'left', marginLeft: 5 }}>视力</p>
                </div>
                <div
                  style={{
                    marginLeft: 40,
                    float: 'left',
                    height: 45,
                    width: 100
                    ,borderLeft:'1px solid grey'
                  }}
                >
                  <p style={{ float: 'left', marginLeft: 5 }}>Left</p>
                  <br />
                  <p style={{ float: 'left', marginLeft: 5 }}>左</p>
                  <p style={{ float: 'right', marginTop: '-10px' }}>
                    {this.props.data.EyeSight}
                  </p>
                </div>
                <div
                  style={{
                    marginLeft: 40,
                    float: 'left',
                    height: 45,
                    width: 100
                    ,borderLeft:'1px solid grey'

                  }}
                >
                  <p style={{ float: 'left', marginLeft: 5 }}>Right</p>
                  <br />
                  <p style={{ float: 'left', marginLeft: 5 }}>右</p>
                  <p style={{ float: 'right', marginTop: '-10px' }}>
                    {this.props.data.EyeSightR}
                  </p>
                </div>
              </th>
            </tr>
            <tr style={{ width: 842 }}>
              <td colspan="6">
                <p style={{ textAlign: 'left', marginLeft: 5 }}>
                  Have you ever been suffering from any severe disease? What
                  are your current health? Are you sick for contagion, or
                  chronic etc. now? Do you have criminal history or discredit
                  history? If yes, please give the details.
                  <br />
                  是否得过严重的疾病？目前身体状况如何？是否患有传染病，慢性病等？是否有犯罪记录或失信行为记录？如是，请详细说明。
                </p>
                  <p style={{ textAlign: 'left',  padding:'8px' }}>
                    {this.props.data.DiseaseStatus}
                  </p>

              </td>
            </tr>
            <tr style={{ width: 842 }}>
              <td colspan="6">
                <p style={{ textAlign: 'left',  padding:'8px'  }}>
                  Do you have any unemployed period of more than 4 months? If
                  yes, please give the details.
                  <br />
                  是否有过4个月以上的失业经历？如有，请详细说明。
                </p>

                  <p style={{ textAlign: 'left', padding:'8px' }}>
                  {this.props.data.UnemployedStatus}
                  </p>

              </td>
            </tr>
            <tr style={{ width: 842 }}>
              <td colspan="6">
                <p style={{ textAlign: 'left', marginLeft: 5 }}>
                  Do you know any employee of Finisar Shanghai Inc.? If yes,
                  please give his/her name and relationship.
                  <br />
                  是否认识本公司的员工？如是，请详细指出姓名及与其关系。
                </p>
                {this.props.data.KnowColleageStatus ? (
                  <p style={{ textAlign: 'left', padding:'8px'}}>
                    {this.props.data.KnowColleageStatus?'是':'否'}{this.props.data.KnowColleageStatus}
                  </p>
                ) : (
                  <div>
                    <br />
                    <br />
                    <br />
                  </div>
                )}
              </td>
            </tr>
            <tr style={{ width: 842 }}>
              <td colspan="6">
                <p style={{ textAlign: 'left', marginLeft: 5,whiteSpace:'normal'}}>
                  Do you have any unexpired contract or service agreement with
                  your present employer? Do you have ever signed
                  non-competition agreement or confidentiality agreement?
                  Please explain when does the contract or agreement at term?
                  Do you need to pay compensation for demission? How long do
                  you carry out demission? When would be available for you?{' '}
                  <br />
                  与现任雇主的合同或服务协议是否到期？是否签署过竞业限制协议或保密协议？请说明何时到期及是否需赔款？办理离职手续需多长时间？如被录用何时可以上班？
                </p>
                  <p style={{ textAlign: 'left', padding:'8px' }}>
                    {this.props.data.OtherAgreement} {this.props.data.CompetitionAgreement} {this.props.data.ifToNeedReparations} {this.props.data.HowLong}
                  </p>
              </td>
            </tr>
          </table>
        </div>
        <div style={{ textAlign: 'left' ,marginTop:'10px'}}>
          <p style={{ fontWeight: 'bold' }}>Self Appraisement自我评价：</p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <table border="1">
            <tr>
              <td colspan="6" style={{ width: 842 }}>
                {this.props.data.SelfAccessment ? (
                  <p style={{padding:'8px'}}>{this.props.data.SelfAccessment}</p>
                ) : (
                  <div>
                    <br />
                    <br />
                    <br />
                  </div>
                )}
              </td>
            </tr>
          </table>
        </div>
        <div style={{ float: 'left', marginBottom: 20 }}>
          <p style={{ fontWeight: 'bold', float: 'left' ,marginTop:'10px'}}>
            Commitments / 本人承诺:
          </p>
          <br />
          <br />
          <p style={{ textAlign: 'left' }}>
            1)&nbsp;&nbsp;All information given are true and accurate,
            otherwise I’m willing to be punished even dismissed. /
            所有填表内容真实、准确，如有虚假愿意接受处分包括辞退。
          </p>
          <p style={{ float: 'left' }}>
            2)&nbsp;&nbsp;I agree with further background check. /
            本人同意公司进行背景调查。
          </p>
        </div>
        <div style ={{clear:"both",marginBottom:20}}>
          <p className = "signPerson">Signature of Applicant/申请人签名<b></b></p>
          <p className = "signDate">Date/日期<b></b></p>
        </div>
        </div>
        <div>
          <Button
            type="primary"
            onClick={this.onPrinting}
            style={{ marginLeft: '300px' }}
          >
            预览打印
          </Button>
        </div>
      </div>
    );
  }
}

export default IDLExamination;
