import React from 'react';
import TableData from '../../common/data/TableData';
import { Button, message, Modal, DatePicker, Progress } from 'antd';
import http from 'Util20/api';
import './PaySettleAccounts.less';
import moment from 'moment';
import { compose } from 'recompose';
import withDownloadFile from '../../common/hoc/withDownloadFile';
import withImport from '../../common/hoc/withImport';

/*
 * 薪资结算
 */
class PaySettleAccounts extends React.Component {
  state = {
    createVisible: false,
    month: moment(),
    confirmLoading: false,
    progressVisible: false,
    totalIndex: 0,
    curIndex: 0,
    isTaskComplete: false,
    listVisible: false,
    tableDataKey: 1
  };

  actionBarExtra = record => {
    return (
      <div>
        <Button
          onClick={() => this.setState({ createVisible: true })}
          size="small"
        >
          新建工资结算
        </Button>
      </div>
    );
  };

  handleImport = () => {
    const { openImportView, baseURL, dblinkname } = this.props;
    const url = baseURL || window.pwConfig[process.env.NODE_ENV].baseURL;

    const importConfig = {
      mode: 'be',
      saveState: 'editoradd',
      containerType: 'drawer',
      containerProps: {},
      saveFE: false,
      downloadLoading: false
    };

    const {
      mode = 'be',
      containerType = 'drawer',
      saveState = 'editoradd',
      containerProps = {},
      saveFE = false
    } = importConfig;

    let disabledSave = false;
    if (saveFE) {
      disabledSave = true;
    }

    openImportView &&
      openImportView(
        dblinkname,
        url,
        675809001517,
        mode,
        containerType,
        saveState,
        containerProps,
        null,
        {},
        {},
        false,
        null,
        null,
        disabledSave,
        () => {}
      );
  };

  handleDownload = async () => {
    this.setState({ downloadLoading: true });
    const {
      downloadFile,
      baseURL,
      downloadBaseURL,
      cparm1 = '',
      cparm2 = '',
      cparm3 = '',
      cparm4 = '',
      cparm5 = '',
      cparm6 = ''
    } = this.props;

    await downloadFile(
      baseURL,
      downloadBaseURL,
      '薪资详情',
      675809001517,
      '',
      '',
      '',
      undefined,
      undefined,
      cparm1,
      cparm2,
      cparm3,
      cparm4,
      cparm5,
      cparm6,
      undefined,
      []
    );
    this.setState({ downloadLoading: false });
  };

  payActionBarExtra = () => {
    return (
      <div>
        <Button type="primary" onClick={this.handleImport}>
          导入手动项目
        </Button>
        <Button type="primary" onClick={this.handleDownload}>
          导出薪资详情
        </Button>
      </div>
    );
  };

  handleConfirm = async () => {
    const { baseURL = 'http://kingofdinner.realsun.me:30001' } = this.props;
    const { month } = this.state;
    if (!month) {
      return message.error('请填写月份');
    }
    this.setState({ confirmLoading: true });
    let res;
    try {
      res = await http({
        baseURL
      }).PostRunAutoImport({
        id: 675961915108,
        parms: {
          month: month.format('YYYYMM')
        }
      });
    } catch (err) {
      this.setState({ confirmLoading: false });
      return message.error(err.message);
    }

    this._taskid = res.data;
    this.setState({ confirmLoading: false, progressVisible: true }, () => {
      this.getTaskInfo();
    });
  };

  _taskid = null;

  addRecord = async () => {
    const { baseURL } = this.props;
    const { month } = this.state;
    try {
      await http({ baseURL }).addRecords({
        resid: 675808935048,
        data: [
          {
            Month: month.format('YYYYMM')
          }
        ],
        isEditOrAdd: true
      });
    } catch (err) {
      message.error(err.message);
      return;
    }
    this.setState({ tableDataKey: this.state.tableDataKey + 1 });
  };

  /**
   * 获取进度
   */
  getTaskInfo = async () => {
    let res;
    try {
      res = await http({
        baseURL: this.props.baseURL
      }).getAutoImportStatusByTaskId({
        taskid: this._taskid
      });
    } catch (err) {
      if (err.message === '没有正在运行的任务') {
        message.error(err.message);
        this.setState({
          progressVisible: false,
          curIndex: 0,
          totalIndex: 0,
          isTaskComplete: false,
          createVisible: false
        });
        return;
      }
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo();
        }
      }, 1000);
      return message.error(err.message);
    }
    if (res.error !== 0) {
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo();
        }
      }, 1000);
      return message.error(res.message);
    }
    // 当前任务已完成
    if (res.IsComplete) {
      this.setState({
        totalIndex: res.data.Total,
        curIndex: res.data.Index,
        isTaskComplete: true
      });
      message.success('同步完成');
      this._taskid = null;
      this.addRecord();
    } else {
      // 当前任务未完成
      this.setState({
        totalIndex: res.data.Total,
        curIndex: res.data.Index,
        isTaskComplete: false
      });
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo();
        }
      }, 1000);
    }
  };

  renderFooter = () => {
    const { isTaskComplete } = this.state;
    if (isTaskComplete) {
      return (
        <Button
          onClick={() =>
            this.setState({ listVisible: true, createVisible: false })
          }
        >
          查看薪资名单
        </Button>
      );
    }
    return null;
  };

  handleViewDetail = record => {
    const monthStr = `${record.Month.substring(0, 4)}-${record.Month.substring(
      4
    )}-01`;
    const month = moment(monthStr);
    this.setState({ month, listVisible: true });
  };

  render() {
    const { baseURL = 'http://kingofdinner.realsun.me:30001' } = this.props;
    const {
      createVisible,
      month,
      confirmLoading,
      progressVisible,
      curIndex,
      totalIndex,
      isTaskComplete,
      listVisible,
      downloadLoading,
      tableDataKey
    } = this.state;

    let progress;
    if (totalIndex !== 0) {
      progress = (curIndex / totalIndex).toFixed(2) * 100;
    }
    if (isTaskComplete) {
      progress = 100;
    }

    return (
      <div className="pay-settle-accounts">
        <TableData
          key={tableDataKey}
          baseURL={baseURL}
          resid="675808935048"
          subtractH={230}
          hasAdvSearch={false}
          hasAdd={false}
          hasRowView={true}
          hasRowDelete={false}
          hasRowEdit={false}
          hasDelete={false}
          hasModify={false}
          hasRowModify={false}
          hasRowSelection={true}
          actionBarWidth={100}
          actionBarExtra={this.actionBarExtra}
          hasDownload={false}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          height="100%"
          hasZoomInOut={false}
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Button
                  type="primary"
                  size={btnSize}
                  onClick={() => this.handleViewDetail(record)}
                >
                  查看薪资详情
                </Button>
              );
            }
          ]}
          hasBeBtns
        />
        <Modal
          title="新建薪资结算"
          visible={createVisible}
          okText="开始结算"
          onOk={this.handleConfirm}
          destroyOnClose
          confirmLoading={confirmLoading}
          onCancel={() => this.setState({ createVisible: false })}
        >
          <div className="pay-settle-accounts__create-modal-content">
            <span>请输入结薪月份：</span>
            <DatePicker.MonthPicker
              value={month}
              onChange={month => this.setState({ month })}
            ></DatePicker.MonthPicker>
          </div>
        </Modal>

        <Modal
          title={null}
          visible={progressVisible}
          footer={this.renderFooter()}
          onCancel={() => this.setState({ progressVisible: false })}
        >
          <div>
            <div className="pay-settle-accounts__progress-wrapper">
              <Progress type="circle" percent={progress} />
            </div>
            {isTaskComplete && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                结薪名单生成完毕！
              </div>
            )}
          </div>
        </Modal>

        <Modal
          title={null}
          visible={listVisible}
          destroyOnClose
          footer={null}
          width="100%"
          onCancel={() => this.setState({ listVisible: false })}
        >
          <div style={{ height: 500 }}>
            <TableData
              loading={downloadLoading}
              title="薪资详情"
              baseURL={baseURL}
              resid="675809001517"
              subtractH={230}
              hasAdvSearch={false}
              hasAdd={false}
              hasRowView={true}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={false}
              hasRowSelection={true}
              actionBarWidth={100}
              actionBarExtra={this.payActionBarExtra}
              hasDownload={false}
              refTargetComponentName="TableData"
              height="100%"
              hasZoomInOut={false}
              cmswhere={`Month = '${month.format('YYYYMM')}'`}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

const composedHoc = compose(
  withDownloadFile,
  withImport
);

export default composedHoc(PaySettleAccounts);
