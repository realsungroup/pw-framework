import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import {
  Tabs,
  Button
} from 'antd';
import http from 'Util20/api';
import './ShVisitManager.less';
/**
 * 上海访客审批
 */
export default class ShVisitManager extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }

  
  render() {
    return (
      <div className="table-data-wrap">
       <Tabs defaultActiveKey="1" size="small">
          <Tabs.TabPane tab="全部" key="1">
          <div className='wrap'>

          <TableData
          resid={'687801999108'}
          hasRowView={false}
          hasAdd={false}
          hasRowDelete={false}
          hasRowModify={false}
          hasModify={false}
          hasDelete={false}
          subtractH={175}
          hasRowView={true}
          customRowBtns={[
            record => {
              return (
                <>
                  <Button
                    onClick={() => {
                      window.open(record.fileUrl)
                    }}
                  >
                    下载来访人员表
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(record.fileUrl2)
                    }}
                  >
                   下载访客绿码
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(record.fileUrl3)
                    }}
                  >
                    下载行动轨迹
                  </Button>
                </>
              );
            }
          ]}
        />
        </div>
            </Tabs.TabPane>
          <Tabs.TabPane tab="访问中" key="2">
          <div className='wrap'>

          <TableData
          resid={'687823076582'}
          hasRowView={false}
          hasAdd={false}
          hasRowDelete={false}
          hasRowModify={false}
          hasModify={false}
          hasDelete={false}
          subtractH={175}
          hasRowView={true}
          customRowBtns={[
            record => {
              return (
                <>
                  <Button
                    onClick={() => {
                      window.open(record.fileUrl)
                    }}
                  >
                    下载来访人员表
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(record.fileUrl2)
                    }}
                  >
                   下载访客绿码
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(record.fileUrl3)
                    }}
                  >
                    下载行动轨迹
                  </Button>
                </>
              );
            }
          ]}
        />
        </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="访问结束" key="3">
            <div className='wrap'>

          <TableData
          resid={'687823090661'}
          hasRowView={false}
          hasAdd={false}
          hasRowDelete={false}
          hasRowModify={false}
          hasModify={false}
          hasDelete={false}
          subtractH={175}
          hasRowView={true}
          customRowBtns={[
            record => {
              return (
                <>
                  <Button
                    onClick={() => {
                      window.open(record.fileUrl)
                    }}
                  >
                    下载来访人员表
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(record.fileUrl2)
                    }}
                  >
                   下载访客绿码
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(record.fileUrl3)
                    }}
                  >
                    下载行动轨迹
                  </Button>
                </>
              );
            }
          ]}
        /></div>
            </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
