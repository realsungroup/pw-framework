import React from 'react';
import { Button ,Icon} from 'antd';
import TableData from '../../../../common/data/TableData';
import './WorkInfo.less'
import Repo from './Repo';


class WorkInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curPage:'Home',
      node:props.node
    };

    this.onCliMon = this.onCliMon.bind(this);
    this.onCliYea = this.onCliYea.bind(this);
    this.backHome = this.backHome.bind(this);

  }
  onCliMon(){
    this.setState({curPage:'monRepo'})
    console.log('333',this.state.node)
  }
  onCliYea(){
    this.setState({curPage:'yeaRepo'})
  }
  backHome(){
    this.setState({curPage:'Home'})
  }
  render() {
    return (
      <div className='WorkInfoQuery'>
        {(this.state.curPage=='monRepo'||this.state.curPage=='yeaRepo')&&(
          <div className='monRepo'>
            <div className='buttonLine'>
              <Button onClick={this.backHome}><Icon type="left" />后退</Button>
            </div>

          </div>)}
          {(this.state.curPage=='monRepo'||this.state.curPage=='yeaRepo')&&(
            <div className='monRepo'>
              <Repo curPage={this.state.curPage} node={this.state.node}></Repo>

            </div>)}
        {this.state.curPage=='Home'&&(
          <div className='Home'>
            <div className='buttonLine'>
              <Button onClick={this.onCliMon}>月报明细</Button>
              <Button onClick={this.onCliYea}>年报明细</Button>
              <Button>导出月报</Button>
            </div>
            <TableData
              key="1"
              resid="619609481002"
              subtractH={240}
              hasAdvSearch={false}
              hasAdd={false}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={false}
              hasRowSelection={true}
              actionBarWidth={100}
              actionBarExtra={this.actionBarExtra}
            />
          </div>
        )}
      </div>
    );
  }
}
export default WorkInfo;
