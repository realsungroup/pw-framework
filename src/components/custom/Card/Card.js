import React, { Component } from 'react';
import './Card.css';
import logo from '../image/logo.png';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      person: [
        {
          name: '张三',
          part: '生产部',
          jobnumber: '141184018'
        },
        {
          name: '李四',
          part: '生产部',
          jobnumber: '141184019'
        },
        {
          name: '王五',
          part: '生产部',
          jobnumber: '141184020'
        },
        {
          name: '嘻嘻',
          part: '代码部',
          jobnumber: '141184021'
        },
        {
          name: '呜呜',
          part: '代码部',
          jobnumber: '141184022'
        },
        {
          name: '哈哈',
          part: '测试部',
          jobnumber: '141184023'
        }
      ]
    };
  }
  render() {
    return (
      <div className="carComponent">
        {this.state.person.map((item, index) => {
          return (
            <div className="car" key={index}>
              <div className="logo">
                <div className="pic-box">
                  <img className="pic" src={logo} />
                </div>
                <div className="txt-box">
                  <p className="logo-txt">雷勃（电气）常州有限公司</p>
                  <p className="logo-txt">huhaeibodianqichangzhou LED</p>
                </div>
              </div>
              <ul className="info">
                <li key="0">
                  姓名：<h5>{item.name}</h5>
                </li>
                <li key="1">
                  部门：<h5>{item.part}</h5>
                </li>
                <li key="2">
                  工号：<h5>{item.jobnumber}</h5>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    );
  }
}

// class BusinessCard extends Component {
//   render() {
//     return (
//       <div className="car">
//         <div className="logo">
//           <div className="title">
//             <image src="" />
//             <h3>雷勃（电气）常州有限公司</h3>
//           </div>
//           <div className="title-en">leibodianqichangzhou LED</div>
//         </div>
//       </div>
//     );
//   }
// }
export default Card;
