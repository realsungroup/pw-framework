import React, { Component } from 'react';
import {Radio, Button,Icon,Input} from 'antd';
import './CyberMoney.less'

 class CyberMoney extends  Component{
   constructor(props){
    super(props);
    this.state ={
      teamData:[
        {
          Name:'王大麻子',
          status:98

        },{
          Name:'王二麻子',
          status:70
        }
      ]
    };
   }
   render(){
     return (
       <div className='bg'>
       <div class="CyberMoney">
 				<div class='user'>
 					<img src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1569761587689&di=31eb9e8d7ecde90494fc1a771f2f4636&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201704%2F27%2F20170427155254_Kctx8.thumb.700_0.jpeg'/>
 					<p>王大麻子</p>
 					<span>昨日增加 5</span>
 					<oval>
 						<p>105</p>
 					</oval>
 				</div>
 				<div class='shop shop_cls'>
 					<rect></rect>
 					<p>进入积分商城</p>
 				</div>
 				<div class='history'>
 					<h4>我的积分记录</h4>
 					<ul>
 						<li>
 							<p>2019-09-17 16:00</p>
 							<p>参加内训课程</p>
 							<p>+5</p>
 							<div class='clearfix'></div>
 							<oval>
 								<p>105</p>
 							</oval>
 						</li>
 						<li>
 							<p>2019-09-17 16:00</p>
 							<p>参加内训课程</p>
 							<p>+5</p>
 							<div class='clearfix'></div>
 							<oval>
 								<p>105</p>
 							</oval>
 						</li><li>
 							<p>2019-09-17 16:00</p>
 							<p>参加内训课程</p>
 							<p>+5</p>
 							<div class='clearfix'></div>
 							<oval>
 								<p>105</p>
 							</oval>
 						</li><li>
 							<p>2019-09-17 16:00</p>
 							<p>参加内训课程</p>
 							<p>+5</p>
 							<div class='clearfix'></div>
 							<oval>
 								<p>105</p>
 							</oval>
 						</li><li>
 							<p>2019-09-17 16:00</p>
 							<p>参加内训课程</p>
 							<p>+5</p>
 							<div class='clearfix'></div>
 							<oval>
 								<p>105</p>
 							</oval>
 						</li><li>
 							<p>2019-09-17 16:00</p>
 							<p>参加内训课程</p>
 							<p>+5</p>
 							<div class='clearfix'></div>
 							<oval>
 								<p>105</p>
 							</oval>
 						</li><li>
 							<p>2019-09-17 16:00</p>
 							<p>参加内训课程</p>
 							<p>+5</p>
 							<div class='clearfix'></div>
 							<oval>
 								<p>105</p>
 							</oval>
 						</li>

 					</ul>
 				</div>
 				<div class='team'>
          <div>
            <h4>团队成长记录</h4>
            <button className='current'>季度</button>
            <button>月</button>
            <button>周</button>

          </div>
          <ul>
            <li>
              <span><b>王大麻子</b> 108</span>
              <bar>
                <filter style={{width:'100%'}}>
                </filter>
              </bar>
            </li>
          </ul>
        </div>

 			</div>
      </div>
     );
   }
 }


 export default CyberMoney;
