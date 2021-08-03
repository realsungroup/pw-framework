import React from 'react';
import './WorkSheetDetail.less';
import { Select, Button,message,Icon,Input,DatePicker } from 'antd';
import { TableData } from '../../common/loadableCommon';

import http from 'Util20/api';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

class WorkSheetDetail extends React.Component {
  constructor(props){
    super(props)
  }
  
  async componentDidMount() {
   
  }
  
  render() {
    return (
      

      <div className='sheetDetails'>
        <div className='streamList'>
            {
              this.props.hasBack?
              <div className='backLine'>
                <div onClick={()=>{this.props.backFunc();}}>
                  <Icon type='left'/>
                  返回
                </div>
              </div>
              :null
            }
            <ul style={this.props.hasBack?{margin:'3.3rem .5rem .8rem'}:{margin:'.8rem .5rem'}}>
              <li>
                <div>
                  <div>1</div>
                  <b>业务部</b>
                </div>
                <ul>
                  <li>
                    <b>1.1</b>
                    <div>
                      <span>2021-07-23 12:00:01</span>
                      <span>张三</span>
                      <span>业务员</span>
                    </div>
                  </li>
                </ul>
              </li>
              <li className="current">
                <div>
                  <div>2</div>
                  <b>部门A</b>
                </div>
                <ul>
                  <li className="current">
                    <b>2.1</b>
                    <div>

                    <span>进行中</span>
                    <span>张三</span>
                    <span>业务员</span>
                    </div>

                  </li>
                  <li>
                    <b>2.2</b>
                    <div>

                    <span>进行中</span>
                    <span>张三</span>
                    <span>业务员</span>
                    </div>

                  </li>
                </ul>
              </li>
              <li className="willDo">
                <div>
                  <div>3</div>
                  <b>部门B</b>
                </div>
                <ul>
                  <li>
                    <b>3.1</b>
                    <div>

                    <span>未开始</span>
                    <span>张三</span>
                    <span>业务员</span>
                    </div>

                  </li>
                  <li>
                    <b>3.2</b>
                    <div>

                    <span>未开始</span>
                    <span>张三</span>
                    <span>业务员</span>
                    </div>

                  </li>
                </ul>
              </li>
            </ul>
        </div>
        <div className='sheet'>
          
          <div className='historySelections'>
            <ul style={{minWidth:'100%',width:(2*10)+'rem'}}>
              <li className='current'>
              2021-07-24 12:00
              </li>
              <li>
              2021-07-24 12:00
              </li>
            </ul>
            
          </div>
          
        <div className='rightContent'>
            <div className='pics'>
              <div className='toChange'>
              </div>
              <div className='picsMenu'>
                <div>下载</div>
                <div>替换</div>

              </div>
            </div>
            <div className='reasons'>
              <b>
                修改原因：
              </b>
              <p>
                原因AAAA
              </p>
            </div>
            <div className='feedback'>
              <b>
                用户反馈：
              </b>
              <span>产看关联反馈</span>
              <p>
                反馈AAAA
              </p>
            </div>
          </div>

          <div className='menu'>
            <ul>
              <li>
                保存
              </li>
              <li>
                复制新建
              </li>
              <li>
                开始当前流程
              </li>
              <li>
                结束当前流程
              </li>
              <li>
                打印
              </li>
              <li className='right'>
                取消订单
              </li>
              <li className='right'>
                报废订单
              </li>
            </ul>
          </div>
          <div className='workSheetForm'>
              <div id='toPrint'>
                <div className='header'>
                  <div>logo</div>
                  <h4>无锡美银精工磨具有限公司产品制作工程单</h4>
                  <p>No <b>112377</b></p>
                </div>
                <div className='timer'>
                  <div>
                    接单时间：<DatePicker size='small'showTime/>
                  </div>
                  <div>
                    交货时间：<DatePicker size='small' showTime/>
                  </div>
                  <div>
                  <table border="1">
                    
                    <tr>
                      <td rowspan="9" colspan="1">业务部</td>
                      <td colspan="3">客户名称</td>
                      <td colspan="4">A1111</td>
                      <td colspan="3">产品名称</td>
                      <td colspan="6">abcdefgh</td>
                      <td colspan="4">数量</td>
                      <td colspan="7">12</td>
                    </tr>
                    <tr>
                      <td width='40px'>图面</td>
                      <td width='40px'>正切</td>
                      <td width='40px'>反切</td>
                      <td width='40px'>入刀</td>
                      <td width='40px'>净介</td>
                      <td width='40px'>参照</td>
                      <td width='40px'>菲林</td>
                      <td width='40px'>色位</td>
                      <td colspan="4">图纸尺寸</td>
                      <td colspan="2">传真</td>
                      <td colspan="2">邮件</td>
                      <td colspan="10">实样（物）</td>
                    </tr>
                    <tr>
                      <td colspan="2">稿数情况</td>
                      <td colspan="1">菲林</td>
                      <td colspan="2">图纸</td>
                      <td colspan="1">稿</td>
                      <td colspan="2">实物</td>
                      <td colspan="6">稿样是否归还客户</td>
                      <td colspan="1">是</td>
                      <td colspan="1">否</td>
                      <td colspan="4">板度要求</td>
                      <td colspan="7">要求123</td>
                    </tr>
                    <tr>
                      <td colspan="2">接单人</td>
                      <td colspan="2">张三</td>
                      <td colspan="2">送货单号</td>
                      <td colspan="3">12345678</td>
                      <td colspan="2">价格</td>
                      <td colspan="2">1234</td>
                      <td colspan="2">含税</td>
                      <td colspan="3">不含税</td>
                      <td colspan="3">复核人</td>
                      <td colspan="5">李四</td>
                    </tr>
                    <tr>
                      <td colspan="26">
                        <div>
                          接单绘图说明：
                          <TextArea/>
                        </div>
                      </td>

                    </tr>
                    <tr>
                      <td colspan="2">
                        刀材名称
                      </td>
                      <td colspan="2">
                        a
                      </td>
                      <td colspan="2">
                        规格
                      </td>
                      <td colspan="1">
                        a
                      </td>
                      <td colspan="2">
                        数量
                      </td>
                      <td colspan="2">
                        a
                      </td>
                      <td colspan="4">
                        齿刀名称
                      </td>
                      <td colspan="2">
                        a
                      </td>
                      <td colspan="2">
                        规格
                      </td>
                      <td colspan="3">
                        a
                      </td>
                      <td colspan="2"> 
                        数量
                      </td>
                      <td colspan="2">
                        a
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        痕线名称
                      </td>
                      <td colspan="2">
                        a
                      </td>
                      <td colspan="2">
                        规格
                      </td>
                      <td colspan="1">
                        a
                      </td>
                      <td colspan="2">
                        数量
                      </td>
                      <td colspan="2">
                        a
                      </td>
                      <td colspan="4">
                        孔类名称
                      </td>
                      <td colspan="2">
                        a
                      </td>
                      <td colspan="2">
                        规格
                      </td>
                      <td colspan="3">
                        a
                      </td>
                      <td colspan="2">
                        数量
                      </td>
                      <td colspan="2">
                        a
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        销类名称
                      </td>
                      <td colspan="2">
                        a
                      </td>
                      <td colspan="2">
                        规格
                      </td>
                      <td colspan="1">
                        a
                      </td>
                      <td colspan="2">
                        数量
                      </td>
                      <td colspan="2">
                        a
                      </td>
                      <td colspan="2">
                        其他
                      </td>
                      <td colspan="4">
                        a
                      </td>
                      <td colspan="2">
                        规格
                      </td>
                      <td colspan="3">
                        a
                      </td>
                      <td colspan="2">
                        数量
                      </td>
                      <td colspan="2">
                        a
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        板材要求
                      </td>
                      <td colspan="2">
                        a
                      </td>
                      <td colspan="2">
                        木板厚度
                      </td>
                      <td colspan="1">
                        22
                      </td>
                      <td colspan="2">
                        20
                      </td>
                      <td colspan="2">
                        18
                      </td>
                      <td colspan="2">
                        15
                      </td>
                      <td colspan="2">
                        12
                      </td>
                      <td colspan="2">
                        10
                      </td>
                      <td colspan="4">
                        塑料板
                      </td>
                      <td>
                        10
                      </td>
                      <td>
                        8
                      </td>
                      <td>
                        6
                      </td>
                      <td>
                        5
                      </td>
                      <td>
                        4
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="3">
                        工程部
                      </td>
                      <td colspan="2">
                        制图人
                      </td>
                      <td colspan="2">
                        张三
                      </td>
                      <td colspan="3">
                        制图档号
                      </td>
                      <td colspan="1">
                        aaa
                      </td>
                      <td colspan="4">
                        制图尺寸
                      </td>
                      <td colspan="5">
                        <Input/>X<Input/>
                      </td>
                      <td colspan="3">
                      孔径1
                      </td>
                      <td colspan="2">
                        10
                      </td>
                      <td colspan="3">
                        孔径2
                      </td>
                      <td colspan="1">
                        10
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        制米数
                      </td>
                      <td colspan="2">
                        刀长
                      </td>
                      <td colspan="1">
                        123
                      </td>
                      <td colspan="2">
                        线长
                      </td>
                      <td colspan="1">
                        222
                      </td>
                      <td colspan="3">
                        半穿刀
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="2">
                      齿刀
                      </td>
                      <td colspan="2">齿刀</td>
                      <td colspan="4">
                        制图时间
                      </td>
                      <td colspan="6">
                      <Input/>至<Input/>
                      </td>
                      </tr>
                      <tr>
                      <td colspan="26">
                        <div>
                          制图备注：
                          <TextArea/>
                        </div>
                        <div>
                          检验人：
                        </div>
                      </td>

                    </tr>
                    <tr>
                      <td rowspan="4">
                        激光部
                      </td>
                      <td colspan="2">
                        割板人
                      </td>
                      <td colspan="3">
                        张三
                      </td>
                      <td colspan="3">
                        割板时间
                      </td>
                      <td colspan="6">
                      <Input/>至<Input/>
                      </td>
                      <td colspan="6">
                        切割板尺寸
                      </td>
                      <td colspan="6">
                      <Input/>X<Input/>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        割缝宽度
                      </td>
                      <td colspan="2">
                        1.0
                      </td>
                      <td colspan="2">
                       0.71
                      </td>
                      <td colspan="2">
                        0.53
                      </td>
                      <td colspan="2">
                      0.45
                      </td>
                      <td colspan="2">
                        其他
                      </td>
                      <td colspan="2">
                      。。。
                      </td>
                      <td colspan="5">
                        切割方式
                      </td>
                      <td colspan="2">
                        连续
                      </td>
                      <td colspan="2">
                        脉冲
                      </td>
                      <td colspan="2">
                        半穿
                      </td>
                      
                    </tr>
                    <tr>
                      <td colspan="26">
                        <div>
                          切割要备注：
                          <TextArea/>
                        </div>
                      </td>

                    </tr>
                    <tr>
                      <td colspan="3">
                        重割原因
                      </td>
                      <td colspan="3">
                        1111
                      </td>
                      <td colspan="3">
                       重割次数
                      </td>
                      <td>
                        1
                      </td>
                      <td>
                      2
                      </td>
                      <td>
                        3
                      </td>
                      <td colspan="3">
                      确认人
                      </td>
                      <td colspan="4">
                        张三
                      </td>
                      <td colspan="3">
                        检验人
                      </td>
                      <td colspan="4">
                        李四
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="3">
                        制造部
                      </td>
                      <td colspan="2">
                        装刀人
                      </td>
                      <td colspan="1">
                       时间
                      </td>
                      <td colspan="6">
                        <Input/>至<Input/>
                      </td>
                      <td colspan="5">
                      第二装刀人
                      </td>
                      <td colspan="3">
                       时间
                      </td>
                      <td colspan="9">
                        <Input/>至<Input/>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                      弯刀人
                      </td>
                      <td colspan="1">
                       时间
                      </td>
                      <td colspan="6">
                        <Input/>至<Input/>
                      </td>
                      <td colspan="4">
                      弯刀米数
                      </td>
                      <td >
                       123
                      </td>
                      <td colspan="5">
                      弯刀机工作量
                      </td>
                      <td colspan="7">
                       <Input/>%
                      </td>
                    </tr>
                    <tr>
                      <td colspan="26">
                        <div>
                        装刀备注：
                        <TextArea/>
                        </div>
                        <div>
                          检验人：
                        </div>

                      </td>
                    </tr>
                    <tr>
                      <td rowspan="3">
                        仓库
                      </td>
                      <td colspan="2">
                        刀材名称
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="2">
                        规格
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="2">
                        实用
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="4">
                        齿刀名称
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="2">
                        规格
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="2">
                        实用
                      </td>
                      <td colspan="2">
                        123
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        痕线名称
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="2">
                        规格
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="2">
                        实用
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="4">
                        孔类名称
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="2">
                        规格
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="2">
                        实用
                      </td>
                      <td colspan="2">
                        123
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        销类名称
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="2">
                        规格
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="2">
                        实用
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="4">
                        领料人
                      </td>
                      <td colspan="2">
                        123
                      </td>
                      <td colspan="4">
                        发料人
                      </td>
                      <td colspan="4">
                        123
                      </td>
                    </tr>
                    <tr>
                      <td rowspan="4">
                        检验
                      </td>
                      <td colspan="2">
                        检验内容
                      </td>
                      <td>
                        尺寸
                      </td>
                      <td>
                        正反
                      </td>
                      <td>
                        结构
                      </td>
                      <td>
                        拼板
                      </td>
                      <td>
                        咬口
                      </td>
                      <td>
                        木板
                      </td>
                      <td>
                        桥位
                      </td>
                      <td>
                        清废
                      </td>
                      <td>
                        平衡
                      </td><td>
                        定位
                      </td><td>
                        半桥
                      </td><td>
                        刻字
                      </td><td>
                        钢刀
                      </td><td>
                        齿刀
                      </td><td>
                        钢孔
                      </td><td>
                        销
                      </td><td>
                        稿数
                      </td><td>
                        半穿
                      </td><td>
                        接刀
                      </td><td>
                        出图
                      </td><td>
                        板度
                      </td>
                      <td>
                        海绵
                      </td>
                      <td>
                        版面
                      </td>
                      <td>
                        检验时间_至_
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        制图
                      </td>
                      <td>
                        尺寸
                      </td>
                      <td>
                        正反
                      </td>
                      <td>
                        结构
                      </td>
                      <td>
                        拼板
                      </td>
                      <td>
                        咬口
                      </td>
                      <td>
                        木板
                      </td>
                      <td>
                        桥位
                      </td>
                      <td>
                        清废
                      </td>
                      <td>
                        平衡
                      </td><td>
                        定位
                      </td><td>
                        半桥
                      </td><td>
                        刻字
                      </td><td>
                        钢刀
                      </td><td>
                        齿刀
                      </td><td>
                        钢孔
                      </td><td>
                        销
                      </td><td>
                        稿数
                      </td><td>
                        半穿
                      </td><td>
                        接刀
                      </td><td>
                        出图
                      </td><td>
                        板度
                      </td>
                      <td>
                        海绵
                      </td>
                      <td>
                        版面
                      </td>
                      <td>
                        检验时间_至_
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        品管
                      </td>
                      <td>
                        尺寸
                      </td>
                      <td>
                        正反
                      </td>
                      <td>
                        结构
                      </td>
                      <td>
                        拼板
                      </td>
                      <td>
                        咬口
                      </td>
                      <td>
                        木板
                      </td>
                      <td>
                        桥位
                      </td>
                      <td>
                        清废
                      </td>
                      <td>
                        平衡
                      </td><td>
                        定位
                      </td><td>
                        半桥
                      </td><td>
                        刻字
                      </td><td>
                        钢刀
                      </td><td>
                        齿刀
                      </td><td>
                        钢孔
                      </td><td>
                        销
                      </td><td>
                        稿数
                      </td><td>
                        半穿
                      </td><td>
                        接刀
                      </td><td>
                        出图
                      </td><td>
                        板度
                      </td>
                      <td>
                        海绵
                      </td>
                      <td>
                        版面
                      </td>
                      <td>
                        检验时间_至_
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        出货方式
                      </td>
                      <td colspan="2">
                        送
                      </td>
                      <td colspan="2">
                        自取
                      </td>
                      <td colspan="2">
                        托运
                      </td>
                      <td colspan="2">
                        快递
                      </td>
                      <td colspan="3">
                        最终评定
                      </td>
                      <td>
                        OK
                      </td>
                      <td>
                        NG
                      </td>
                      <td colspan="3">
                        送货人
                      </td><td colspan="3">
                        123
                      </td>
                      <td colspan="3">
                        检验人
                      </td>
                      <td colspan="2">
                        123
                      </td>
                    </tr>
                  </table>
                  </div>
                </div>


              </div>
          </div>
        </div>

      </div>

    );
  }
}

export default WorkSheetDetail;
