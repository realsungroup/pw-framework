import React from 'react';
import {Spin,Button,Icon} from 'antd';
import http from 'Util20/api';
import './PersonInfoManager.less';
import PersonInfoInFile from '../PersonInfoInFile/';
import TableData from '../../common/data/TableData';

/**
 * 档案管理内的个人信息
 */
class PersonInfoManager extends React.Component {

    constructor(props) {
      // resid:612530416359

      super(props);
      this.state = {
        showDetail:false,
        selectedRecord:''
      }
     
    } 
    componentDidMount(){

    }
   

  render() {
    return (
     <div style={{width:'100%',height:'100%'}}>
      <TableData
                resid={621422585590}
                hasRowView={false}
                hasAdd={false}
                hasRowSelection={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                hasDelete={false}
                style={{ height: '100%' }}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
  
                      <div>
                        <Button

                          onClick={() => {
                            this.setState({showDetail:true, selectedRecord:record.C3_464172117706});
  
                          }}
                        >
                         详情
                        </Button>
  
                      </div>
                    );
                  }
                ]}
              />
      {this.state.showDetail?(
        <div className='overlay'>
          <Icon type='close-circle' onClick={()=>{this.setState({showDetail:false})}} style={{zIndex:'1000',position:'fixed',right:'24px',top:'16px',cursor:'pointer'
        }}></Icon>
          <PersonInfoInFile edit={true} memberId={this.state.selectedRecord}></PersonInfoInFile>
         </div>
      ):null}
      
      </div>

    );
  }
}
export default PersonInfoManager;