import React from 'react';
import TabsTableData from '../TabsTableData';
import { Button, message, Modal } from 'antd';
import http from 'Util20/api';

class ReviewRequisition extends React.Component {
  handleDownMaterial = url => {
    if (!url) {
      return Modal.warning({
        title: '还未上传心得'
      });
    }
    const urls = url.split(',');
    for (let i = 0, len = urls.length; i < len; i++) {
      window.open(urls[i]);
    }
  };
  render() {
    return (
      <div style={{ flex: 1, display: 'flex' }}>
        <TabsTableData
          arr={[
            {
              resid: 614964299827,
              TabsTitle: '待审核',
              OutHeight: '80vh',
              recordFormFormWidth: '90%',
              hasBeBtns: true,
              hasModify: false,
              hasDelete: false,
              hasAdd: false,
              hasRowDelete: false,
              hasRowModify: false,
              hasRowView: true,
              subtractH: 220,
              recordFormType: 'drawer',
              recordFormContainerProps: {
                placement: 'bottom',
                height: 600
              },
              customRowBtns: [
                (record, btnSize) => {
                  return (
                    <Button
                      onClick={() => {
                        this.handleDownMaterial(record.Filepath);
                      }}
                    >
                      下载查阅
                    </Button>
                  );
                }
              ]
            },
            {
              resid: 614964309985,
              TabsTitle: '已审核',
              OutHeight: '80vh',
              recordFormFormWidth: '90%',
              hasBeBtns: true,
              hasModify: false,
              hasDelete: false,
              hasAdd: false,
              hasRowDelete: false,
              hasRowModify: false,
              hasRowView: false,
              subtractH: 220,
              recordFormType: 'drawer',
              recordFormContainerProps: {
                placement: 'bottom',
                height: 600
              }
            }
          ]}
        />
      </div>
    );
  }
}

export default ReviewRequisition;
