import React from 'react';
import './WorkSheetDetail.less';
import { Select, Button,message,DatePicker,Icon } from 'antd';
import { TableData } from '../../common/loadableCommon';

import http from 'Util20/api';

const { Option } = Select;
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
                    接单时间：2021年5月19日12时
                  </div>
                  <div>
                    交货时间：2021年5月29日12时
                  </div>
                </div>


              </div>
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

        </div>

      </div>

    );
  }
}

export default WorkSheetDetail;
