import React, { Fragment } from 'react';
import './WzApprove.less';
import TableData from '../../common/data/TableData';
import { Icon, LocaleProvider, Button, message, Modal } from 'antd';
import http from '../../../util20/api';
import { TabsTableData } from '../loadableCustom';

const resid = 564580620519;
class WzApprove extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.WzBaseURL;
    this.dlEmployDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.WzDownloadURL;
  }
  state = {
    SquareCardArr: [],
    val: null,
    showDetail: false,
    goodsDetail: []
  };

  onShowGoodsDetail = async record => {
    console.log('data', record);
    this.setState({
      showDetail: true
    });
    let res;
    const httpParams = {};
    httpParams.baseURL = this.baseURL;
    try {
      res = await http(httpParams).getTable({
        resid: resid,
        cmswhere: `C3_561660071657='${record.REC_ID}'`
      });
      console.log('res', res);
      this.setState({
        goodsDetail: res.data
      });
    } catch (error) {
      error.message(message.error);
    }
  };

  renderGoodDetail = () => {
    const { goodsDetail } = this.state;
    return goodsDetail.map(subrecord => (
      <div className="showData">
        <div>
          <span>固定资产编号:</span>
          <input value={subrecord.C3_563398068629} disabled />
        </div>
        <div>
          <span>物品名称:</span>
          <input value={subrecord.C3_561660086724} disabled />
        </div>
        <div>
          <span>单位:</span>
          <input value={subrecord.C3_561660095455} disabled />
        </div>
        <div>
          <span>数量:</span>
          <input value={subrecord.C3_561660118451} disabled />
        </div>
        <div>
          <span>备注:</span>
          <input value={subrecord.C3_561660151378} disabled />
        </div>
        {subrecord.C3_564586355793&&(<img src={subrecord.C3_564586355793} alt="" />)} 
        {subrecord.C3_564586356936&&(<img src={subrecord.C3_564586356936} alt="" />)}
        {subrecord.C3_564586366720&&(<img src={subrecord.C3_564586366720} alt="" />)}
        {subrecord.C3_576509688476&&(<img src={subrecord.C3_576509688476} alt="" />)}
        {subrecord.C3_576509688694&&(<img src={subrecord.C3_576509688694} alt="" />)}
        {subrecord.C3_576509688897&&(<img src={subrecord.C3_576509688897} alt="" />)}
        {subrecord.C3_561812970226&&(<img src={subrecord.C3_561812970226} alt="" />)}
        {subrecord.C3_561812973382&&(<img src={subrecord.C3_561812973382} alt="" />)}
        {subrecord.C3_561812974789&&(<img src={subrecord.C3_561812974789} alt="" />)}
        <hr />
      </div>
    ));
  };

  render() {
    const { showDetail, goodsDetail } = this.state;
    return (
      <div className="container">
        <TabsTableData
          arr={[
            {
              TabsTitle: '未审批',
              baseURL: this.baseURL,
              resid: 564488788005,
              subtractH: 320,
              hasBeBtns: true,
              hasRowSelection: false,
              hasAdd: true,
              hasRowSelection: true,
              hasRowView: false,
              hasRowModify: false,
              hasModify: false,
              hasRowDelete: false,
              hasDelete: false,
              height: '100%',
              actionBarWidth: 240,
              hasDownload :false,
              backendButtonPopConfirmProps:{placement: 'bottom' },
              customRowBtns:[
                record => (
                  <Button
                    type="primary"
                    onClick={() => {
                      this.onShowGoodsDetail(record);
                    }}
                  >
                    详情
                  </Button>
                )
              ] 
            },
              {
                TabsTitle: '已审批',
                baseURL: this.baseURL,
                resid: 564685792690,
                subtractH: 320,
                hasBeBtns: true,
                hasRowSelection: false,
                hasAdd: true,
                hasRowSelection: true,
                hasRowView: false,
                hasRowModify: false,
                hasModify: false,
                hasRowDelete: false,
                hasDelete: false,
                height: '100%',
                actionBarWidth: 240,
                hasDownload :false,
                backendButtonPopConfirmProps:{placement: 'bottom' },
                customRowBtns:[
                  record => (
                    <Button
                      type="primary"
                      onClick={() => {
                        this.onShowGoodsDetail(record);
                      }}
                    >
                      详情
                    </Button>
                  )
                ] 
              },
              {
                TabsTitle: '已拒绝',
                baseURL: this.baseURL,
                resid: 564685812390,
                subtractH: 320,
                hasBeBtns: true,
                hasRowSelection: false,
                hasAdd: true,
                hasRowSelection: true,
                hasRowView: false,
                hasRowModify: false,
                hasModify: false,
                hasRowDelete: false,
                hasDelete: false,
                height: '100%',
                actionBarWidth: 240,
                hasDownload:false,
                backendButtonPopConfirmProps:{placement: 'bottom' },
                customRowBtns: [
                  record => (
                    <Button
                      type="primary"
                      onClick={() => {
                        this.onShowGoodsDetail(record);
                      }}
                    >
                      详情
                    </Button>
                  )
                ] 
              },
              
          ]}
        />
        <Modal
          visible={showDetail}
          title="物品详情"
          onCancel={() => this.setState({ showDetail: false })}
          onOk={() => this.setState({ showDetail: false })}
        >
          {this.renderGoodDetail() ? (
            this.renderGoodDetail()
          ) : (
            <div>未添加物品</div>
          )}
        </Modal>
      </div>
    );
  }
}

export default WzApprove;
