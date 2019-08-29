import React from 'react';
import { Button ,Icon} from 'antd';
import TableData from '../../../../common/data/TableData';
import './WorkInfo.less'


class WorkInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curPage:'Home',
    };
    this.onCliJob = this.onCliJob.bind(this);
    this.backHome = this.backHome.bind(this);

  }
  onCliMon(){
    this.setState({curPage:'monRepo'})
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
        {this.state.curPage=='monRepo'&&(
          <div className='monRepo'>
            <div className='buttonLine'>
              <Button onClick={this.backHome}><Icon type="left" />后退</Button>
            </div>

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
