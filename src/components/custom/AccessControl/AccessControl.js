import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button,Input, message, Modal ,Icon,Table,Spin,Tabs} from 'antd';
import './AccessControl.less';
import http from '../../../util20/api';
const { TabPane } = Tabs;
class AccessControl extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[
        process.env.NODE_ENV
      ].customURLs.attendanceMonthChangeUrl;
  }
  
  state={
    rightList:[
      {
        name:'权限组名',
        time:'全天',
        recid:'12345678'
      },
      {
        name:'权限组名',
        time:'00:00-12:00',
        recid:'12345679'
      },
      {
        name:'权限组名2',
        time:'全天',
        recid:'12345680'
      },
    ],
    currentRight:'12345678'
  }
  render() {
    const { data ,sign,dataOther,dataAbi,discription} = this.state;
    return (
      <div
        className='ac'
      >
      <Tabs>
              <TabPane tab={'权限查阅'} key={0}>
                <div className='l'>
                  <div className='search'><Input style={{width:'calc(100% - 1rem - 144px)'}}/><Button style={{width:'72px',marginLeft:'.5rem'}} type={'primary'}>搜索</Button><Button style={{width:'72px',marginLeft:'.5rem'}}>重置</Button></div>
                  <ul>
                    {
                      this.state.rightList.map(
                        item=>{
                          return(
                            <li key={item.recid}
                              onClick={()=>{this.setState({currentRight:item.recid})}}
                              className={this.state.currentRight==item.recid?'current':''}>
                              <span>{item.name} {item.time}</span>
                              <Button size={'small'} type={this.state.currentRight==item.recid?'primary':'normal'}>查看涉及的门</Button>
                            </li>
                          )
                        }
                      )
                    }
                  </ul>
                </div>
                <div className='r'>
                <TableData
                baseURL={this.props.baseURL}
                resid="691171872439"
                wrappedComponentRef={element =>
                  (this.addModalTableDataRef = element)
                }
                refTargetComponentName="TableData"
                subtractH={180}
                hasAdd={false}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasRowSelection={true}
                hasAdvSearch={false}
                importConfig={null}
               />
                </div>
              </TabPane>
              <TabPane tab={'权限导入'} key={1}>
               
              </TabPane>
      </Tabs>  
       
      </div>
    );
  }
}

export default AccessControl;
