import React from 'react';
import { Button } from 'antd';
import { TableData } from '../../common/loadableCommon';
import NewRecord from './NewRecord';
import './HeadCount.less';

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.HeadCountBaseURL;
/**
 * HeadCount
 */
class HeadCount extends React.Component {
  state = {
    isNewRecording: false
  };
  render() {
    const { isNewRecording } = this.state;
    return (
      <div className="head-count">
        {isNewRecording ? (
          <NewRecord />
        ) : (
          <TableData
            resid="518460953577"
            baseURL={baseURL}
            subtractH={220}
            hasRowView={false}
            hasModify={false}
            hasDelete={false}
            hasAdd={false}
            hasRowModify={false}
            hasRowDelete={false}
            hasRowSelection={false}
            actionBarWidth={100}
            hasBeBtns={true}
            recordFormUseAbsolute={true}
            formProps={{ width: 1150 }}
            backendButtonPopConfirmProps={{placement: 'bottom' }}
            customRowBtns={[
              (record, btnSize) => {
                return (
                  <Button type="danger" size={btnSize}>
                    撤回
                  </Button>
                );
              }
            ]}
            // actionBarExtra={
            //   <div>
            //     <Button
            //       type="primary"
            //       onClick={() => {
            //         this.setState({ isNewRecording: true });
            //       }}
            //     >
            //       填写申请
            //     </Button>
            //   </div>
            // }
          />
        )}
      </div>
    );
  }
}

export default HeadCount;
