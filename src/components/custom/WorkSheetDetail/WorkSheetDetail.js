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
                    接单时间：<DatePicker showTime/>
                  </div>
                  <div>
                    交货时间：<DatePicker showTime/>
                  </div>
                  <table border="1">
                    
                    <tr>
                      <td>业务部</td>
                      <td>客户名称</td>
                      <td>A1111</td>
                      <td>产品名称</td>
                      <td>abcdefgh</td>
                      <td>数量</td>
                      <td>12</td>
                    </tr>
                    <tr>
                      <td>图面</td>
                      <td>正切</td>
                      <td>反切</td>
                      <td>入刀</td>
                      <td>净介</td>
                      <td>参照</td>
                      <td>菲林</td>
                      <td>色位</td>
                      <td>图纸尺寸</td>
                      <td>传真</td>
                      <td>邮件</td>
                      <td>实样（物）</td>
                    </tr>
                    <tr>
                      <td>稿数情况</td>
                      <td>菲林</td>
                      <td>图纸</td>
                      <td>稿</td>
                      <td>实物</td>
                      <td>稿样是否归还客户</td>
                      <td>是</td>
                      <td>否</td>
                      <td>板度要求</td>
                      <td>要求123</td>
                    </tr>
                    <tr>
                      <td>接单人</td>
                      <td>张三</td>
                      <td>送货单号</td>
                      <td>价格</td>
                      <td>1234</td>
                      <td>含税</td>
                      <td>不含税</td>
                      <td>复核人</td>
                      <td>李四</td>
                    </tr>
                    <tr>
                      <td>
                        <div>
                          接单绘图说明：
                          <TextArea/>
                        </div>
                      </td>

                    </tr>
                    <tr>
                      <td>
                        刀材名称
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        规格
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        数量
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        齿刀名称
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        规格
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        数量
                      </td>
                      <td>
                        a
                      </td>
                    </tr>
                    <tr>
                      <td>
                        痕线名称
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        规格
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        数量
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        孔类名称
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        规格
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        数量
                      </td>
                      <td>
                        a
                      </td>
                    </tr>
                    <tr>
                      <td>
                        销类名称
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        规格
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        数量
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        其他
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        规格
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        数量
                      </td>
                      <td>
                        a
                      </td>
                    </tr>
                    <tr>
                      <td>
                        板材要求
                      </td>
                      <td>
                        a
                      </td>
                      <td>
                        木板厚度
                      </td>
                      <td>
                        22
                      </td>
                      <td>
                        20
                      </td>
                      <td>
                        18
                      </td>
                      <td>
                        15
                      </td>
                      <td>
                        12
                      </td>
                      <td>
                        10
                      </td>
                      <td>
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
                      <td>
                        工程部
                      </td>
                      <td>
                        制图人
                      </td>
                      <td>
                        张三
                      </td>
                      <td>
                        制图档号
                      </td>
                      <td>
                        aaa
                      </td>
                      <td>
                        制图尺寸
                      </td>
                      <td>
                        <Input/>X<Input/>
                      </td>
                      <td>
                      孔径1
                      </td>
                      <td>
                        10
                      </td>
                      <td>
                        孔径2
                      </td>
                      <td>
                        10
                      </td>
                    </tr>
                    <tr>
                      <td>
                        制米数
                      </td>
                      <td>
                        刀长
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        线长
                      </td>
                      <td>
                        222
                      </td>
                      <td>
                        半穿刀
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                      齿刀
                      </td>
                      <td>
                        制图时间
                      </td>
                      <td>
                      <Input/>至<Input/>
                      </td>
                      </tr>
                      <tr>
                      <td>
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
                      <td>
                        激光部
                      </td>
                      <td>
                        割板人
                      </td>
                      <td>
                        张三
                      </td>
                      <td>
                        割板时间
                      </td>
                      <td>
                      <Input/>至<Input/>
                      </td>
                      <td>
                        切割板尺寸
                      </td>
                      <td>
                      <Input/>X<Input/>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        割缝宽度
                      </td>
                      <td>
                        1.0
                      </td>
                      <td>
                       0.71
                      </td>
                      <td>
                        0.53
                      </td>
                      <td>
                      0.45
                      </td>
                      <td>
                        其他
                      </td>
                      <td>
                      。。。
                      </td>
                      <td>
                        切割方式
                      </td>
                      <td>
                        连续
                      </td>
                      <td>
                        脉冲
                      </td>
                      <td>
                        半穿
                      </td>
                      
                    </tr>
                    <tr>
                      <td>
                        <div>
                          切割要备注：
                          <TextArea/>
                        </div>
                      </td>

                    </tr>
                    <tr>
                      <td>
                        重割原因
                      </td>
                      <td>
                        1111
                      </td>
                      <td>
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
                      <td>
                      确认人
                      </td>
                      <td>
                        张三
                      </td>
                      <td>
                        检验人
                      </td>
                      <td>
                        李四
                      </td>
                    </tr>
                    <tr>
                      <td>
                        制造部
                      </td>
                      <td>
                        装刀人
                      </td>
                      <td>
                       时间
                      </td>
                      <td>
                        <Input/>至<Input/>
                      </td>
                      <td>
                      第二装刀人
                      </td>
                      <td>
                       时间
                      </td>
                      <td>
                        <Input/>至<Input/>
                      </td>
                      <td>
                      弯刀人
                      </td>
                      <td>
                       时间
                      </td>
                      <td>
                        <Input/>至<Input/>
                      </td>
                      <td>
                      弯刀米数
                      </td>
                      <td>
                       123
                      </td>
                      <td>
                      弯刀机工作量
                      </td>
                      <td>
                       <Input/>%
                      </td>
                      <td>
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
                      <td>
                        仓库
                      </td>
                      <td>
                        刀材名称
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        规格
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        实用
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        齿刀名称
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        规格
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        实用
                      </td>
                      <td>
                        123
                      </td>
                    </tr>
                    <tr>
                      <td>
                        痕线名称
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        规格
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        实用
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        孔类名称
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        规格
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        实用
                      </td>
                      <td>
                        123
                      </td>
                    </tr>
                    <tr>
                      <td>
                        销类名称
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        规格
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        实用
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        领料人
                      </td>
                      <td>
                        123
                      </td>
                      <td>
                        发料人
                      </td>
                      <td>
                        123
                      </td>
                    </tr>
                  </table>
                </div>


              </div>
          </div>
        </div>

      </div>

    );
  }
}

export default WorkSheetDetail;
