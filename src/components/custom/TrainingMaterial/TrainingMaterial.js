import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, message, Modal } from 'antd';
class TrainingMaterial extends React.Component {
  constructor(props) {
    super(props);
  }
  handleDownMaterial = url => {
    if (!url) {
      return Modal.warning({
        title: '您还未上传过资料'
      });
    }
    const urls = url.split(';file;');
    for (let i = 0, len = urls.length; i < len; i++) {
      window.open(urls[i]);
    }
  };
  render() {
    return (
      <div
        className="table-data-wrap"
        style={{ height: 'calc(100vh - 220px)' }}
      >
        <TableData
          resid={607189025758}
          hasModify={false}
          hasDelete={false}
          subtractH={190}
          hasRowView={false}
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Button
                  onClick={() => {
                    this.handleDownMaterial(record.C3_607185283034);
                  }}
                >
                  下载
                </Button>
              );
            }
          ]}
        />
      </div>
    );
  }
}

export default TrainingMaterial;
