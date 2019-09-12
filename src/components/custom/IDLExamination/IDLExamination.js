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
  Row
} from 'antd';
import logo from '../../../assets/logo.png';
// const { getFieldDecorator } = this.props.form;

class IDLExamination extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {
        test: 'Sr.Web development engineer',
        chinaName: '李三四',
        englishName: 'Karl.Zhang',
        sex: 'male',
        date: '2019-09-08',
        place: '北京市北京市朝阳区',
        status: '否',
        mail: '12939128391@163.com',
        isRecom: '是',
        ability:"良好"
      }
    };
  }
  componentDidMount = () => {};

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
          <img src={logo}></img>
          <div style={{ textAlign: 'center' }}>
            <h2 className="header">Job Application From / 工作申请表</h2>
          </div>
          <div style={{ float: 'left', fontWeight: 'bold' }}>
            Personal Information 个人资料
          </div>
          <div style={{ clear: 'both', marginBottom: '10px' }}>
            <table border="1">
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <th>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
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
                    {this.state.data.test}
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
                    {this.state.data.chinaName}
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
                    {this.state.data.englishName}
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
                    {this.state.data.sex}
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
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
                    {this.state.data.test}
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
                    {this.state.data.chinaName}
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
                    {this.state.data.englishName}
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
                    {this.state.data.sex}
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
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
                    {this.state.data.date}
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
                    }}
                  >
                    {this.state.data.chinaName}
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
                    {this.state.data.englishName}
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
                    {this.state.data.sex}
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <th>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Place of Hukou Registered (Province/City)</p>
                    <p style={{ width: '106px' }}>户口所在地:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '-16px',
                      marginLeft: '20x',
                      float: 'right'
                    }}
                  >
                    {this.state.data.place}
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
                    {this.state.data.chinaName}
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
                    {this.state.data.status}
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
                    {this.state.data.sex}
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <th>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Current Correspondence Address</p>
                    <p style={{ width: '106px' }}>现通讯地址:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '-20px',
                      marginLeft: '20x',
                      float: 'right'
                    }}
                  >
                    {this.state.data.test}
                  </div>
                </th>
                <th style={{ width: '190px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>Zip Card</p>
                    <p>邮编:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '15px',
                      float: 'right'
                    }}
                  >
                    {this.state.data.chinaName}
                  </div>
                </th>
                <th style={{ width: '190px' }} colSpan="2">
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
                    {this.state.data.mail}
                  </div>
                </th>
                {/* <th style = {{borderLeft:"none"}}></th> */}
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
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
                    {this.state.data.isRecom}
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
                    {this.state.data.chinaName}
                  </div>
                </th>
                <th colspan="2" style={{ width: '190px' }}>
                  <div style={{ float: 'left', marginLeft: '5px' }}>
                    <p>relationship</p>
                    <p>关系:</p>
                  </div>
                  <div
                    style={{
                      marginTop: '7px',
                      marginLeft: '15px',
                      float: 'right'
                    }}
                  >
                    {this.state.data.englishName}
                  </div>
                </th>
              </tr>
            </table>
          </div>
          <p style={{ float: 'left', fontWeight: 'bold' }}>
            Education Background (Please start from latest education to middle
            school) / 教育背景（请从最近教育开始填写至中学）
          </p>
          <div style={{ clear: 'both', marginBottom: '10px' }}>
            <table border="1">
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <th style={{ width: '137px', padding: '0px' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p>Period (Year / Month)</p>
                    <p>年限(年/月)</p>
                  </div>
                  <tr>
                    <th
                      style={{
                        width: '68px',
                        borderLeft: 'none',
                        borderBottom: 'none'
                      }}
                    >
                      From 由
                    </th>
                    <th
                      style={{
                        width: '69px',
                        borderRight: 'none',
                        borderBottom: 'none'
                      }}
                    >
                      To 至{' '}
                    </th>
                  </tr>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p>Name of School/Colleges/Universities</p>
                    <p>学校/学院/大学:</p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p>Major</p>
                    <p>专业</p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p>Degree</p>
                    <p>学位</p>
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
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <tr style={{ height: '35px' }}>
                  <th
                    style={{
                      width: '68px',
                      borderLeft: 'none',
                      borderBottom: 'none',
                      borderTop: 'none'
                    }}
                  ></th>
                  <th
                    style={{
                      width: '69px',
                      borderRight: 'none',
                      borderBottom: 'none',
                      borderTop: 'none'
                    }}
                  ></th>
                </tr>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <tr style={{ height: '35px' }}>
                  <th
                    style={{
                      width: '68px',
                      borderLeft: 'none',
                      borderBottom: 'none'
                      // borderTop:"none"
                    }}
                  ></th>
                  <th
                    style={{
                      width: '69px',
                      borderRight: 'none',
                      borderBottom: 'none'
                      // borderTop:"none"
                    }}
                  ></th>
                </tr>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <tr style={{ height: '35px' }}>
                  <th
                    style={{
                      width: '68px',
                      borderLeft: 'none',
                      borderBottom: 'none'
                      // borderTop:"none"
                    }}
                  ></th>
                  <th
                    style={{
                      width: '69px',
                      borderRight: 'none',
                      borderBottom: 'none'
                      // borderTop:"none"
                    }}
                  ></th>
                </tr>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <tr style={{ height: '35px' }}>
                  <th
                    style={{
                      width: '68px',
                      borderLeft: 'none',
                      borderBottom: 'none'
                      // borderTop:"none"
                    }}
                  ></th>
                  <th
                    style={{
                      width: '69px',
                      borderRight: 'none',
                      borderBottom: 'none'
                      // borderTop:"none"
                    }}
                  ></th>
                </tr>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
              </tr>
            </table>
          </div>
          <p style={{ float: 'left', fontWeight: 'bold' }}>
            Working History (Please start with latest one)
            工作经验（请从最近职位开始填写）
          </p>
          <div style={{ clear: 'both', marginBottom: '10px' }}>
            <table border="1">
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <th style={{ width: '137px', padding: '0px' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p>Post Period</p>
                    <p>任职年限</p>
                  </div>
                  <tr>
                    <th
                      style={{
                        width: '68px',
                        borderLeft: 'none',
                        borderBottom: 'none'
                      }}
                    >
                      From 由
                    </th>
                    <th
                      style={{
                        width: '69px',
                        borderRight: 'none',
                        borderBottom: 'none'
                      }}
                    >
                      To 至{' '}
                    </th>
                  </tr>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p>Name of Company & Type</p>
                    <p>公司名称及类型</p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p>Position</p>
                    <p>职位</p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p>Reason For Leaving</p>
                    <p>离职原因</p>
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
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <tr style={{ height: '35px' }}>
                  <th
                    style={{
                      width: '68px',
                      borderLeft: 'none',
                      borderBottom: 'none',
                      borderTop: 'none'
                    }}
                  ></th>
                  <th
                    style={{
                      width: '69px',
                      borderRight: 'none',
                      borderBottom: 'none',
                      borderTop: 'none'
                    }}
                  ></th>
                </tr>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <tr style={{ height: '35px' }}>
                  <th
                    style={{
                      width: '68px',
                      borderLeft: 'none',
                      borderBottom: 'none'
                      // borderTop:"none"
                    }}
                  ></th>
                  <th
                    style={{
                      width: '69px',
                      borderRight: 'none',
                      borderBottom: 'none'
                      // borderTop:"none"
                    }}
                  ></th>
                </tr>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <tr style={{ height: '35px' }}>
                  <th
                    style={{
                      width: '68px',
                      borderLeft: 'none',
                      borderBottom: 'none'
                      // borderTop:"none"
                    }}
                  ></th>
                  <th
                    style={{
                      width: '69px',
                      borderRight: 'none',
                      borderBottom: 'none'
                      // borderTop:"none"
                    }}
                  ></th>
                </tr>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <tr style={{ height: '35px' }}>
                  <th
                    style={{
                      width: '68px',
                      borderLeft: 'none',
                      borderBottom: 'none'
                      // borderTop:"none"
                    }}
                  ></th>
                  <th
                    style={{
                      width: '69px',
                      borderRight: 'none',
                      borderBottom: 'none'
                      // borderTop:"none"
                    }}
                  ></th>
                </tr>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
              </tr>
            </table>
          </div>

          <p style={{ float: 'left', fontWeight: 'bold' }}>
            Professional Qualification / Training 专业资格 / 培训
          </p>
          <div style={{ clear: 'both', marginBottom: '10px' }}>
            <table border="1">
              <tr style={{ fontSize: '10px', height: '35px' }}>
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
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <th
                  style={{
                    width: '68px',
                    borderLeft: 'none',
                    borderBottom: 'none',
                    borderTop: 'none'
                  }}
                ></th>

                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <th
                  style={{
                    width: '68px',
                    borderLeft: 'none',
                    borderBottom: 'none'
                    // borderTop:"none"
                  }}
                ></th>

                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <th
                  style={{
                    width: '68px',
                    borderLeft: 'none',
                    borderBottom: 'none'
                    // borderTop:"none"
                  }}
                ></th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <th
                  style={{
                    width: '68px',
                    borderLeft: 'none',
                    borderBottom: 'none'
                    // borderTop:"none"
                  }}
                ></th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
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
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <th style={{ width: '90px', padding: '0px' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p>Name</p>
                    <p>姓名</p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
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
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p>Telephone</p>
                    <p>电话</p>
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <th
                  style={{
                    width: '68px',
                    borderLeft: 'none',
                    borderBottom: 'none',
                    borderTop: 'none'
                  }}
                ></th>

                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
              </tr>
              <tr style={{ fontSize: '10px', height: '35px' }}>
                <th
                  style={{
                    width: '68px',
                    borderLeft: 'none',
                    borderBottom: 'none'
                    // borderTop: 'none'
                  }}
                ></th>

                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '190px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '100px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
                <th style={{ width: '122px', clear: 'both' }}>
                  <div style={{ float: 'middle', marginLeft: '5px' }}>
                    <p></p>
                    <p></p>
                  </div>
                </th>
              </tr>
            </table>
          </div>
          <div style={{ clear: 'both', marginBottom: '10px' }}>
            <img src={logo} style={{}}></img>
          </div>
          <p style={{ float: 'left', fontWeight: 'bold' }}>
            Related Qualification / Skill (If any) 相关技能
          </p>
          <div style={{ clear: 'both', marginBottom: '10px' }}>
            <table border="1">
              <tr style={{ fontSize: '10px', height: '35px' }} >
                <th style={{ width: '842px', padding: '0px' }}>
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
              <tr >
                <td rowspan= "1">
                  <p>English</p>
                  <p>英语</p>
                </td>
                <td>
                  <p>CET</p>
                  <p>{this.state.data.ability}</p>
                </td>
                <th> </th>
                <th> </th>
                <th> </th>
                <th> </th>
              </tr>
            </table>
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
