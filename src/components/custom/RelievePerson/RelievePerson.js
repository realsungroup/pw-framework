import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, Popconfirm, message, Spin, Modal, Input } from 'antd';
import http from 'Util20/api';
// import TableData from '../../common/data/TableData'

/**
 * 奖惩-符合解除人员
 */
class RelievePerson extends React.Component {
  state = {
    loading: false,
    deleteReason: '',
    sendBackReason: null
  };

  handleConfirm = async (dataSource, selectedRowKeys) => {
    if (!selectedRowKeys.length) {
      return message.error('请选择记录');
    }
    const { resid } = this.props;
    this.setState({ loading: true });
    const data = selectedRowKeys.map(recid => ({
      REC_ID: recid,
      C3_605619907534: 'Y'
    }));

    let res;
    try {
      res = await http().modifyRecords({
        resid,
        data
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
    message.success('操作成功');
    this.tableDataRef.handleRefresh();
  };
  handleDownMaterial = url => {
    if (!url) {
      return Modal.warning({
        title: '您还未上传过资料'
      });
    }
    const urls = url.split(';file;');
    for (let i = 0, len = urls.length; i < len; i++) {
      const obj = JSON.parse(urls[i]);
      window.open(obj.url);
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div style={{ height: '100vh' }}>
          <TableData
            {...this.props}
            resid="614709186509"
            wrappedComponentRef={element => (this.tableDataRef = element)}
            refTargetComponentName="TableData"
            hasRowModify={false}
            hasRowDelete={false}
            subtractH={220}
            hasAdvSearch={true}
            advSearch = {
              {
                searchComponent:'both',
                containerType:'drawer',
                formName:'default'


            }
            }
            customRowBtns={[
              record => {
                return (
                  <Button
                    onClick={() => {
                      this.handleDownMaterial(
                        record.C3_590515131157 || record.C3_590516276367
                      );
                    }}
                  >
                    下载查阅
                  </Button>
                );
              }
            ]}
          />
        </div>
      </Spin>
    );
  }
}

export default RelievePerson;
