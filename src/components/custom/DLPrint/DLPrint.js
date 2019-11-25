import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, message, Modal ,Icon} from 'antd';
import './DLPrint.less';

class DLPrint extends React.Component {
  constructor(props) {
    super(props);
    
  }
  state={
    showPrint:false
  }
  showHidden(v){
    console.log(v)
    this.setState({
      showPrint:true
    })
  }
  render() {
    return (
      <div
        className="table-data-wrap"
        style={{ height: '100vh' }}
      >
        <div className={this.state.showPrint?'viewPrint':'hidden'}>
          <Icon className='clz' type="close-circle" onClick={()=>this.setState({showPrint:false})}/>
          <div id='toPrint'>
            <h3>基本信息</h3>
            <div className='sm-wrap'>
              <div style={{height:'100px',width:'33%',float:'left',backgroundImage:'url(https://www.baidu.com/img/bd_logo1.png)',backgroundSize:'100% 100%',backgroundPosition:'center'}}>
              </div>
              <div style={{height:'100px',width:'65%',float:'right',backgroundImage:'url(https://www.baidu.com/img/bd_logo1.png)',backgroundSize:'100% 100%',backgroundPosition:'center'}}>
              </div>
            </div>
            <div className='sm-wrap'>
              <div>
                <span><b>姓名：</b>王大麻子</span>
              </div>
              <div>
                <span><b>出身年月：</b>1995-05-06</span>
              </div>
              <div>
                <span><b>性别：</b>男</span>
              </div>
            </div>
          </div>
        </div>
        <TableData
          resid={628007834561}
          hasModify={false}
          hasDelete={false}
          hasAdd={false}
          baseURL = 'http://kingofdinner.realsun.me:1201/'
          subtractH={190}
          hasRowDelete={false}
          hasRowModify={false}
          hasRowView={false}
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Button
                  onClick={() => {
                    this.showHidden(record);
                  }}
                >
                  预览打印
                </Button>
              );
            }
          ]}
        />
      </div>
    );
  }
}

export default DLPrint;
