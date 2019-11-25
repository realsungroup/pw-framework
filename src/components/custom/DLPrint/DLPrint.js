import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, message, Modal ,Icon} from 'antd';
import './DLPrint.less';

class DLPrint extends React.Component {
  constructor(props) {
    super(props);
    
  }
  state={
    showPrint:false,
    data:{}
  }
  showHidden(v){
    console.log(v)
    this.setState({
      showPrint:true,
      data:v
    })
  }
  render() {
    const { data } = this.state;

    return (
      <div
        className="table-data-wrap"
        style={{ height: '100vh' }}
      >
        <div className={this.state.showPrint?'viewPrint':'hidden'}>
          <Icon className='clz' type="close-circle" onClick={()=>this.setState({showPrint:false})}/>
          <div id='toPrint'>
            <h3>基本信息</h3>
            <div className='sm-wrap alter'>
              <div style={{height:'100px',width:'33%',float:'left',backgroundImage:'url(https://www.baidu.com/img/bd_logo1.png)',backgroundSize:'100% 100%',backgroundPosition:'center'}}>
              </div>
              <div style={{height:'100px',width:'65%',float:'right',backgroundImage:'url(https://www.baidu.com/img/bd_logo1.png)',backgroundSize:'100% 100%',backgroundPosition:'center'}}>
              </div>
            </div>
            <div className='sm-wrap'>
              <div>
                <span><b>姓名：</b>{data.name}</span>
              </div>
              <div>
                <span><b>出生年月：</b>{data.birthdate}</span>
              </div>
              <div>
                <span><b>性别：</b>{data.sex}</span>
              </div>
            </div>
            <div className='sm-wrap'>
              <div>
                <span><b>在职状态：</b>{data.hasJob}</span>
              </div>
              <div>
                <span><b>工作年限：</b>{data.seniority}</span>
              </div>
              <div>
                <span><b>职业：</b>{data.job}</span>
              </div>
            </div>
            <div className='clearfix'></div>

            <div className='sm-wrap'>
              <div>
                <span><b>身高(cm)：</b>{data.height}</span>
              </div>
              <div>
                <span><b>体重(kg)：</b>{data.weight}</span>
              </div>
              <div>
                <span><b>血型：</b>{data.bloodType}</span>
              </div>
            </div>
            <div className='sm-wrap'>
              <div>
                <span><b>宗教信仰：</b>{data.religion}</span>
              </div>
              <div>
                <span><b>兴趣爱好：</b>{data.hobby}</span>
              </div>
              <div>
                <span><b>身份证号：</b>{data.ID}</span>
              </div>
            </div>
            <div className='sm-wrap'>
              <div>
                <span><b>宗教信仰：</b>{data.religion}</span>
              </div>
              <div>
                <span><b>兴趣爱好：</b>{data.hobby}</span>
              </div>
              <div>
                <span><b>身份证号：</b>{data.ID}</span>
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
