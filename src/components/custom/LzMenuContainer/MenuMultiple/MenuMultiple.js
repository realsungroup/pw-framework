import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { message, Button, Timeline } from 'antd';
import './MenuMultiple.less';
import LzFormWithFooter from 'UnitComponent/components/LzFormWithFooter';
import { getFormData, getSubTableData } from 'Util/api';
import dealControlArr from 'Util/controls';
import LzFormModalContainer from 'UnitComponent/components/LzFormModalContainer';
import LzAdvSearch from 'UnitComponent/LzTable/LzAdvSearch';
import HeightWeightChart from 'Custom/HeightWeightChart';
import { LzModal } from '../../loadableCustom';

const modalTitleMap = {
  身高: '身高曲线',
  体重: '体重曲线'
};

const hasChart = formTitle => {
  return formTitle.indexOf('生长发育评估') !== -1;
};

/**
 * MenuMultiple
 */
export default class MenuMultiple extends React.Component {
  static propTypes = {
    /**
     * 记录列表
     * 默认：-
     */
    recordList: PropTypes.array,

    /**
     * 显示记录值的内部字段名
     */
    innerFieldName: PropTypes.string,

    /**
     * 主表 id
     */
    resid: PropTypes.number.isRequired,

    /**
     * 子表 id
     */
    subresid: PropTypes.number.isRequired,

    /**
     * 主表记录 id
     */
    hostrecid: PropTypes.number.isRequired,

    /**
     * 表单标题
     * 默认：''
     */
    formTitle: PropTypes.string,

    /**
     * 高级搜索配置
     */
    advSearchConfig: PropTypes.object
  };
  static defaultProps = {
    formTitle: ''
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedRecord: {}, // 被选中记录的 recid
      formFormData: {
        subTableArr: [],
        allControlArr: [],
        canOpControlArr: [],
        containerControlArr: []
      },
      operation: 'check',
      viewStatus: 'view',
      recordList: [],
      innerFieldName: '',
      modalVisible: false,
      advSearchVisible: false, // 高级搜索是否显示
      chartType: '身高', // 图表类型
      chartVisible: false
    };
  }

  componentDidMount = async () => {
    if (!this.props.resid) {
      return;
    }
    this.getFormData();
    this.getRecordList();
  };

  getRecordList = async (selectedRecord, wheres = '') => {
    const { resid, subresid, hostrecid } = this.props;
    let res;
    try {
      res = await getSubTableData(resid, subresid, hostrecid, {
        cmswhere: wheres
      });
    } catch (err) {
      return message.error(err.message);
    }
    this.setState({
      recordList: res.data,
      selectedRecord: selectedRecord || res.data[0],
      innerFieldName: res.cmscolumninfo[0].id
    });
  };

  getFormData = async () => {
    const { subresid } = this.props;
    if (!subresid) {
      return;
    }
    let res;
    try {
      res = await getFormData(subresid, 'default');
    } catch (err) {
      return message.error(err.message);
    }
    const formFormData = dealControlArr(res.data.columns);
    this.setState({ formFormData });
  };

  handleAddClick = () => {
    this.setState({ modalVisible: true });
  };

  handleFilterClick = () => {
    this.setState({ advSearchVisible: !this.state.advSearchVisible });
  };

  saveCb = () => {
    message.success('保存成功');
    this.getRecordList(this.state.selectedRecord);
  };

  delCb = () => {
    this.getRecordList();
  };

  conditionChange = wheres => {
    this.getRecordList(this.state.selectedRecord, wheres);
  };

  handleOpenChart = (chartType = '身高') => {
    this.setState({ chartType, chartVisible: true });
  };

  renderForm = () => {
    const { selectedRecord, formFormData, operation } = this.state;
    const { formTitle } = this.props;
    const header = (
      <div className="menu-multiple-form-header">
        <span className="menu-multiple-form-header-title">{formTitle}</span>

        {hasChart(formTitle) && (
          <Button
            style={{ margin: '0 4px' }}
            type="primary"
            onClick={() => this.handleOpenChart('身高')}
          >
            身高曲线图
          </Button>
        )}
        {hasChart(formTitle) && (
          <Button
            style={{ margin: '0 4px' }}
            type="primary"
            onClick={() => this.handleOpenChart('体重')}
          >
            体重曲线图
          </Button>
        )}

        <Button
          style={{ margin: '0 4px' }}
          type="primary"
          onClick={this.handleAddClick}
        >
          添加
        </Button>
      </div>
    );
    const { resid, subresid, hostrecid } = this.props;
    const props = {
      dataMode: 'sub',
      header,
      key: selectedRecord && selectedRecord.REC_ID,
      record: selectedRecord,
      formFormData,
      operation: 'mod',
      cancelBtn: true,
      resid,
      subresid,
      hostrecid,
      viewStatus: this.state.viewStatus,
      saveCb: this.saveCb,
      delCb: this.delCb
    };
    return <LzFormWithFooter {...props} />;
  };

  switchRecord = record => {
    this.setState({ selectedRecord: record });
  };

  cancelAddRecord = () => {
    this.setState({ modalVisible: false });
  };

  addRecordCb = () => {
    message.success('添加成功');
    this.setState({ modalVisible: false });
    this.getRecordList(this.state.selectedRecord);
  };

  closeAdvSearch = () => {
    this.setState({ advSearchVisible: false });
  };

  render() {
    const {
      selectedRecord,
      recordList,
      innerFieldName,
      modalVisible,
      formFormData,
      advSearchVisible,
      chartVisible,
      chartType
    } = this.state;
    const { resid, subresid, hostrecid, advSearchConfig, record } = this.props;
    const modalProps = {
      dataMode: 'sub',
      operation: 'add',
      resid,
      subresid,
      hostrecid,
      onCancel: this.cancelAddRecord,
      onConfirm: this.addRecordCb,
      formFormData
    };
    return (
      <div className="menu-multiple">
        <div className="form-wrap">
          {!!recordList.length ? (
            this.renderForm()
          ) : (
            <div>
              暂无数据
              <Button type="primary" onClick={this.handleAddClick}>
                添加
              </Button>
            </div>
          )}
        </div>

        <Timeline className="record-list">
          <div className="record-list-title">
            <i
              className="iconfont icon-adv-search"
              onClick={this.handleFilterClick}
            />
          </div>
          {recordList.map(record => (
            <Timeline.Item
              key={record.REC_ID}
              className={classNames('record-item', {
                selected: selectedRecord.REC_ID === record.REC_ID
              })}
              onClick={() => this.switchRecord(record)}
            >
              {record[innerFieldName]}
            </Timeline.Item>
          ))}
          {!recordList.length && <div>暂无数据</div>}
        </Timeline>
        {modalVisible && <LzFormModalContainer {...modalProps} />}

        <LzAdvSearch
          advSearchConfig={advSearchConfig}
          conditionChange={this.conditionChange}
          advSearchVisible={advSearchVisible}
          onClose={this.closeAdvSearch}
          cssSelector=".lz-menu-container"
        />

        {chartVisible && (
          <LzModal
            defaultScaleStatus="max"
            onClose={() => this.setState({ chartVisible: false })}
          >
            <HeightWeightChart
              sex={record.C3_589053299408}
              chartType={chartType}
              userData={recordList}
              recordMonthField={'C3_603833255097'}
              recordHeightField={'C3_586880026948'}
              recordWeightField={'C3_586880035091'}
            />
          </LzModal>
        )}
      </div>
    );
  }
}
