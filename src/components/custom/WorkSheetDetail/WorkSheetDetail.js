import React from 'react';
import './WorkSheetDetail.less';
import { Row,Col,Select, Button,message,Icon,Input,DatePicker } from 'antd';
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
                  <div className='tableWrap'>
                  <div className='depas'>
                    业务部
                  </div>
                  <div className='table'>
                    
                    <Row>
                      <Col span={5}>客户名称</Col>
                      <Col span={4}><input/></Col>
                      <Col span={5}>产品名称</Col>
                      <Col span={4}><input/></Col>
                      <Col span={3}>数量</Col>
                      <Col span={3}><input/></Col>
                    </Row>
                    <Row>
                      <Col style={{width:'8%'}}>图面</Col>
                      <Col style={{width:'8%'}}>正切</Col>
                      <Col style={{width:'8%'}}>反切</Col>
                      <Col style={{width:'8%'}}>入刀</Col>
                      <Col style={{width:'8%'}}>净介</Col>
                      <Col style={{width:'8%'}}>参照</Col>
                      <Col style={{width:'8%'}}>菲林</Col>
                      <Col style={{width:'8%'}}>色位</Col>
                      <Col style={{width:'8%'}}>图纸尺寸</Col>
                      <Col style={{width:'8%'}}>传真</Col>
                      <Col style={{width:'8%'}}>邮件</Col>
                      <Col style={{width:'12%'}}>实样（物）</Col>
                    </Row>
                    <Row>
                      <Col span={2}>稿数情况</Col>
                      <Col span={2}>菲林</Col>
                      <Col span={2}>图纸</Col>
                      <Col span={2}>稿</Col>
                      <Col span={2}>实物</Col>
                      <Col span={4}>稿样是否归还客户</Col>
                      <Col span={2}>是</Col>
                      <Col span={2}>否</Col>
                      <Col span={2}>板度要求</Col>
                      <Col span={4}><input/></Col>
                    </Row>
                    <Row>
                      <Col span={2}>接单人</Col>
                      <Col span={3}><input/></Col>
                      <Col span={2}>送货单号</Col>
                      <Col span={3}><input/></Col>
                      <Col span={2}>价格</Col>
                      <Col span={2}><input/></Col>
                      <Col span={2}>含税</Col>
                      <Col span={2}>不含税</Col>
                      <Col span={2}>复核人</Col>
                      <Col span={4}><input/></Col>
                    </Row>
                    <Row>
                      <Col span={24} >
                        <div>
                          接单绘图说明：
                          <TextArea/>
                        </div>
                      </Col>

                    </Row>
                    <Row>
                      <Col span={2}>
                        刀材名称
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        齿刀名称
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}> 
                        数量
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        痕线名称
                      </Col>
                      <Col span={2} >
                      <input/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        孔类名称
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        销类名称
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        其他
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                    </Row>
                    <Row>
                      <Col span={4}>
                        板材要求
                      </Col>
                      <Col span={4}>
                        木板厚度
                      </Col>
                      <Col span={1}>
                        22
                      </Col>
                      <Col span={1}>
                        20
                      </Col>
                      <Col span={1}>
                        18
                      </Col>
                      <Col span={1}>
                        15
                      </Col>
                      <Col span={1}>
                        12
                      </Col>
                      <Col span={1}>
                        10
                      </Col>
                      <Col span={3}>
                        塑料板
                      </Col>
                      <Col span={1}>
                        10
                      </Col>
                      <Col span={1}>
                        8
                      </Col>
                      <Col span={1}>
                        6
                      </Col>
                      <Col span={1}>
                        5
                      </Col>
                      <Col span={1}>
                        4
                      </Col>
                    </Row>
                    <Row>
                      <Col >
                        制图人
                      </Col>
                      <Col >
                        张三
                      </Col>
                      <Col >
                        制图档号
                      </Col>
                      <Col >
                        aaa
                      </Col>
                      <Col >
                        制图尺寸
                      </Col>
                      <Col >
                        <Input/>X<Input/>
                      </Col>
                      <Col >
                      孔径1
                      </Col>
                      <Col >
                        10
                      </Col>
                      <Col >
                        孔径2
                      </Col>
                      <Col >
                        10
                      </Col>
                    </Row>
                    <Row>
                      <Col >
                        制米数
                      </Col>
                      <Col >
                        刀长
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        线长
                      </Col>
                      <Col >
                        222
                      </Col>
                      <Col >
                        半穿刀
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                      齿刀
                      </Col>
                      <Col >齿刀</Col>
                      <Col >
                        制图时间
                      </Col>
                      <Col >
                      <Input/>至<Input/>
                      </Col>
                      </Row>
                      <Row>
                      <Col >
                        <div>
                          制图备注：
                          <TextArea/>
                        </div>
                        <div>
                          检验人：
                        </div>
                      </Col>

                    </Row>
                    <Row>
                      <Col rowspan="4">
                        激光部
                      </Col>
                      <Col >
                        割板人
                      </Col>
                      <Col >
                        张三
                      </Col>
                      <Col >
                        割板时间
                      </Col>
                      <Col >
                      <Input/>至<Input/>
                      </Col>
                      <Col >
                        切割板尺寸
                      </Col>
                      <Col >
                      <Input/>X<Input/>
                      </Col>
                    </Row>
                    <Row>
                      <Col >
                        割缝宽度
                      </Col>
                      <Col >
                        1.0
                      </Col>
                      <Col >
                       0.71
                      </Col>
                      <Col >
                        0.53
                      </Col>
                      <Col >
                      0.45
                      </Col>
                      <Col >
                        其他
                      </Col>
                      <Col >
                      。。。
                      </Col>
                      <Col >
                        切割方式
                      </Col>
                      <Col >
                        连续
                      </Col>
                      <Col >
                        脉冲
                      </Col>
                      <Col >
                        半穿
                      </Col>
                      
                    </Row>
                    <Row>
                      <Col >
                        <div>
                          切割要备注：
                          <TextArea/>
                        </div>
                      </Col>

                    </Row>
                    <Row>
                      <Col >
                        重割原因
                      </Col>
                      <Col >
                        1111
                      </Col>
                      <Col >
                       重割次数
                      </Col>
                      <Col>
                        1
                      </Col>
                      <Col>
                      2
                      </Col>
                      <Col>
                        3
                      </Col>
                      <Col >
                      确认人
                      </Col>
                      <Col >
                        张三
                      </Col>
                      <Col >
                        检验人
                      </Col>
                      <Col >
                        李四
                      </Col>
                    </Row>
                    <Row>
                      <Col rowspan="3">
                        制造部
                      </Col>
                      <Col >
                        装刀人
                      </Col>
                      <Col >
                       时间
                      </Col>
                      <Col >
                        <Input/>至<Input/>
                      </Col>
                      <Col >
                      第二装刀人
                      </Col>
                      <Col >
                       时间
                      </Col>
                      <Col >
                        <Input/>至<Input/>
                      </Col>
                    </Row>
                    <Row>
                      <Col >
                      弯刀人
                      </Col>
                      <Col >
                       时间
                      </Col>
                      <Col >
                        <Input/>至<Input/>
                      </Col>
                      <Col >
                      弯刀米数
                      </Col>
                      <Col >
                       123
                      </Col>
                      <Col >
                      弯刀机工作量
                      </Col>
                      <Col >
                       <Input/>%
                      </Col>
                    </Row>
                    <Row>
                      <Col >
                        <div>
                        装刀备注：
                        <TextArea/>
                        </div>
                        <div>
                          检验人：
                        </div>

                      </Col>
                    </Row>
                    <Row>
                      <Col rowspan="3">
                        仓库
                      </Col>
                      <Col >
                        刀材名称
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        规格
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        实用
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        齿刀名称
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        规格
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        实用
                      </Col>
                      <Col >
                        123
                      </Col>
                    </Row>
                    <Row>
                      <Col >
                        痕线名称
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        规格
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        实用
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        孔类名称
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        规格
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        实用
                      </Col>
                      <Col >
                        123
                      </Col>
                    </Row>
                    <Row>
                      <Col >
                        销类名称
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        规格
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        实用
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        领料人
                      </Col>
                      <Col >
                        123
                      </Col>
                      <Col >
                        发料人
                      </Col>
                      <Col >
                        123
                      </Col>
                    </Row>
                    <Row>
                      <Col rowspan="4">
                        检验
                      </Col>
                      <Col >
                        检验内容
                      </Col>
                      <Col>
                        尺寸
                      </Col>
                      <Col>
                        正反
                      </Col>
                      <Col>
                        结构
                      </Col>
                      <Col>
                        拼板
                      </Col>
                      <Col>
                        咬口
                      </Col>
                      <Col>
                        木板
                      </Col>
                      <Col>
                        桥位
                      </Col>
                      <Col>
                        清废
                      </Col>
                      <Col>
                        平衡
                      </Col><Col>
                        定位
                      </Col><Col>
                        半桥
                      </Col><Col>
                        刻字
                      </Col><Col>
                        钢刀
                      </Col><Col>
                        齿刀
                      </Col><Col>
                        钢孔
                      </Col><Col>
                        销
                      </Col><Col>
                        稿数
                      </Col><Col>
                        半穿
                      </Col><Col>
                        接刀
                      </Col><Col>
                        出图
                      </Col><Col>
                        板度
                      </Col>
                      <Col>
                        海绵
                      </Col>
                      <Col>
                        版面
                      </Col>
                      <Col>
                        检验时间_至_
                      </Col>
                    </Row>
                    <Row>
                      <Col >
                        制图
                      </Col>
                      <Col>
                        尺寸
                      </Col>
                      <Col>
                        正反
                      </Col>
                      <Col>
                        结构
                      </Col>
                      <Col>
                        拼板
                      </Col>
                      <Col>
                        咬口
                      </Col>
                      <Col>
                        木板
                      </Col>
                      <Col>
                        桥位
                      </Col>
                      <Col>
                        清废
                      </Col>
                      <Col>
                        平衡
                      </Col><Col>
                        定位
                      </Col><Col>
                        半桥
                      </Col><Col>
                        刻字
                      </Col><Col>
                        钢刀
                      </Col><Col>
                        齿刀
                      </Col><Col>
                        钢孔
                      </Col><Col>
                        销
                      </Col><Col>
                        稿数
                      </Col><Col>
                        半穿
                      </Col><Col>
                        接刀
                      </Col><Col>
                        出图
                      </Col><Col>
                        板度
                      </Col>
                      <Col>
                        海绵
                      </Col>
                      <Col>
                        版面
                      </Col>
                      <Col>
                        检验时间_至_
                      </Col>
                    </Row>
                    <Row>
                      <Col >
                        品管
                      </Col>
                      <Col>
                        尺寸
                      </Col>
                      <Col>
                        正反
                      </Col>
                      <Col>
                        结构
                      </Col>
                      <Col>
                        拼板
                      </Col>
                      <Col>
                        咬口
                      </Col>
                      <Col>
                        木板
                      </Col>
                      <Col>
                        桥位
                      </Col>
                      <Col>
                        清废
                      </Col>
                      <Col>
                        平衡
                      </Col><Col>
                        定位
                      </Col><Col>
                        半桥
                      </Col><Col>
                        刻字
                      </Col><Col>
                        钢刀
                      </Col><Col>
                        齿刀
                      </Col><Col>
                        钢孔
                      </Col><Col>
                        销
                      </Col><Col>
                        稿数
                      </Col><Col>
                        半穿
                      </Col><Col>
                        接刀
                      </Col><Col>
                        出图
                      </Col><Col>
                        板度
                      </Col>
                      <Col>
                        海绵
                      </Col>
                      <Col>
                        版面
                      </Col>
                      <Col>
                        检验时间_至_
                      </Col>
                    </Row>
                    <Row>
                      <Col >
                        出货方式
                      </Col>
                      <Col >
                        送
                      </Col>
                      <Col >
                        自取
                      </Col>
                      <Col >
                        托运
                      </Col>
                      <Col >
                        快递
                      </Col>
                      <Col >
                        最终评定
                      </Col>
                      <Col>
                        OK
                      </Col>
                      <Col>
                        NG
                      </Col>
                      <Col >
                        送货人
                      </Col><Col >
                        123
                      </Col>
                      <Col >
                        检验人
                      </Col>
                      <Col >
                        123
                      </Col>
                    </Row>
                  </div>
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
