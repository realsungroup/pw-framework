import React from 'react';
import {Spin,Button,Input,Select} from 'antd';
import './PersonInfoInFile.less';
/**
 * 档案管理内的个人信息
 */
const { Option } = Select;
class PersonInfoInFile extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        viewMode:'edit',
        loading:false,
      };
    } 

    onPrinting = () => {
      const bodyHtml = window.document.body.innerHTML;
  
       var footstr = "</body>";
       var newstr = document.getElementById('toPrint').innerHTML;
  
       var style="<style media='print'>@page {size: auto; margin: 0mm;}footer{display:none;}</style>"
       var headstr = "<html><head><title></title>"+style+"</head><body>";
       document.body.innerHTML = headstr + newstr + footstr;
       window.print();
      window.document.body.innerHTML = bodyHtml;
      window.location.reload();
    };

  render() {
    return (
     <div className='PersonInfoInFile' id='toPrint'>
       <Spin spinning={this.state.loading}>
       <div className='page' style={{
         
         padding:'24px',
         boxSizing:'border-box',
       }}>
         <h3 style={{textAlign:'center',cursor:'default',fontSize:'16px',paddingBottom:'16px',borderBottom:'1px solid #e8e8e8'}}>个人基本信息</h3>
        <h4 style={{width:'100%',marginBottom:'24px'}}>一、个人基本信息</h4>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>姓名：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>英文名：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>性别：</b>
            <Select size='small' style={{ width: 'calc(100% - 120px)' }}>
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </div>
          <div style={{clear:'both',height:'8px'}}></div>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>国籍：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>籍贯：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>民族：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{clear:'both',height:'8px'}}></div>

          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>血型：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>出生日期：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>学历：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{clear:'both',height:'8px'}}></div>

          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>证件类型：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'66.66%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>证件号码：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{clear:'both',height:'8px'}}></div>

          <div style={{width:'100%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>文书送达地址：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{clear:'both',height:'8px'}}></div>

          <div style={{width:'100%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>现居住地址：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
         
          <div style={{clear:'both',height:'8px'}}></div>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>邮编：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>家庭号码：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>手机号码：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          
          <div style={{clear:'both',height:'8px'}}></div>

          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>政治面貌：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>

          <div style={{width:'66.66%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>公司邮箱：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>

          <div style={{clear:'both',height:'8px'}}></div>

          
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>户籍类别：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>婚姻状况：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{width:'33.33%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>生育状况：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{clear:'both',height:'8px'}}></div>

          
          <div style={{width:'100%',float:'left'}}>
            <b style={{display:'inline-block',width:'104px',textAlign:'right'}}>个人邮箱：</b>
            <Input size='small' style={{width:'calc(100% - 120px)'}}/>
          </div>
          <div style={{clear:'both',height:'24px',borderBottom:'1px solid #e8e8e8'}}></div>
          {/* 教育和培训 */}
          <h4 style={{width:'100%',marginTop:'16px',marginBottom:'16px'}}>二、教育和培训</h4>
          <div style={{marginBottom:'16px'}}>学历/学位（请填写高中以上学历）</div>
          <table border="1" style={{width:'100%'}}>
          <tr>
            <th>教育开始日期</th>
            <th>教育结束日期</th>
            <th>学校名称</th>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
        </table>
        </div>
        <footer>
          <Button style={{marginRight:'8px'}} onClick={this.onPrinting}>打印</Button>
          <Button type='primary'>保存</Button>
        </footer>
      </Spin>
      </div>

    );
  }
}
export default PersonInfoInFile;