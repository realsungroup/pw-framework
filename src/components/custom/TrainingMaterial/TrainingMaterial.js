import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, message,Modal} from 'antd';
class TrainingMaterial extends React.Component {
  constructor(props) {
    super(props);
  }
  handleDownMaterial = url => {
    if(url){
      window.open(url);
    }else{
      return Modal.warning({
        title:'您还未上传过资料'
      })
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
                    this.handleDownMaterial(record.C3_611263607692);
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
