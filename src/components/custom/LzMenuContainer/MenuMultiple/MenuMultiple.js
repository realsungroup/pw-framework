import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { message, Button, Timeline, Modal, Tree } from 'antd';
import './MenuMultiple.less';
import LzFormWithFooter from 'UnitComponent/components/LzFormWithFooter';
import { getFormData, getSubTableData } from 'Util/api';
import dealControlArr from 'Util/controls';
import LzFormModalContainer from 'UnitComponent/components/LzFormModalContainer';
import LzAdvSearch from 'UnitComponent/LzTable/LzAdvSearch';
import HeightWeightChart from './HeightWeightChart';
import LabExaminationChart from './LabExaminationChart';
import { LzModal } from '../../loadableCustom';
const { TreeNode } = Tree;

// 含有 “生长发育评估” 的表才有身高、体重按钮
const hasHeightWeightChartBtn = formTitle => {
  return formTitle.indexOf('生长发育评估') !== -1;
};

// 实验室检查表才有选择字段按钮
const hasChooseFieldBtn = formTitle => {
  return formTitle.indexOf('实验室检查') !== -1;
};

const assortFields = controlArr => {
  if (!controlArr || !controlArr.length) {
    return [];
  }
  const filteredControlArr = controlArr.filter(
    control => control.ColResDataSort
  );
  const klasses = [];
  filteredControlArr.forEach(control => {
    let i;
    if (
      !klasses.some((klass, index) => {
        if (klass.title === control.ColResDataSort) {
          i = index;
          return true;
        }
      })
    ) {
      klasses.push({
        title: control.ColResDataSort,
        renderControlArr: [control]
      });
    } else {
      klasses[i].renderControlArr.push(control);
    }
  });
  return klasses;
};

const getCanChooseFields = canOpControlArr => {
  const arr = assortFields(canOpControlArr);
  return arr;
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
      chartVisible: false,
      chooseFieldModalVisible: false, // 选择字段的模态窗是否显示
      fields: [], // 已选择的需要在实验室检查中显示的字段
      treeData: [], // 选择字段的树节点数据
      selectedKeys: [] // 已选中的树节点
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
    const pArr = [
      getFormData(subresid, 'default'),
      getFormData(subresid, 'title-choose')
    ];
    try {
      res = await Promise.all(pArr);
    } catch (err) {
      return message.error(err.message);
    }
    const formFormData = dealControlArr(res[0].data.columns);
    const chooseFieldFormData = dealControlArr(res[1].data.columns);

    const treeData = getCanChooseFields(chooseFieldFormData.canOpControlArr);

    this._canOpControlArr = chooseFieldFormData.canOpControlArr;

    this.setState({ formFormData, treeData });
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

  handleOpenChooseFieldModal = () => {
    this.setState({ chooseFieldModalVisible: true });
  };

  renderForm = () => {
    const { selectedRecord, formFormData } = this.state;
    const { formTitle, displayMod } = this.props;
    const header = (
      <div className="menu-multiple-form-header">
        <span className="menu-multiple-form-header-title">{formTitle}</span>

        {hasHeightWeightChartBtn(formTitle) && (
          <Button
            style={{ margin: '0 4px' }}
            type="primary"
            onClick={() => this.handleOpenChart('身高')}
          >
            身高曲线图
          </Button>
        )}
        {hasHeightWeightChartBtn(formTitle) && (
          <Button
            style={{ margin: '0 4px' }}
            type="primary"
            onClick={() => this.handleOpenChart('体重')}
          >
            体重曲线图
          </Button>
        )}

        {hasChooseFieldBtn(formTitle) && (
          <Button
            style={{ margin: '0 4px' }}
            type="primary"
            onClick={() => this.handleOpenChooseFieldModal()}
          >
            选择字段
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
      displayMod,
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

  renderTreeNodes = data =>
    data.map(item => {
      if (item.renderControlArr) {
        return (
          <TreeNode title={item.title} key={item.title} dataRef={item}>
            {this.renderTreeNodes(item.renderControlArr)}
          </TreeNode>
        );
      }
      return (
        <TreeNode key={item.ColName} title={item.ColDispName} dataRef={item} />
      );
    });

  getTreeRef = element => {
    this.treeRef = element;
  };

  handleCompleteFieldsChoose = () => {
    const { selectedKeys } = this.state;
    const newSelectedKeys = selectedKeys.filter(
      key => key.indexOf('C3_') !== -1
    );

    if (!selectedKeys.length) {
      return message.error('您未选择字段');
    }

    const fields = [];

    this._canOpControlArr.forEach(item => {
      const curItem = newSelectedKeys.some(key => key === item.ColName);
      if (curItem) {
        fields.push({
          field: item.ColName,
          title: item.ColDispName
        });
      }
    });

    this.setState({ chartVisible: true, fields });
  };

  handleNodeCheck = selectedKeys => {
    this.setState({ selectedKeys });
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
      chartType,
      fields,
      chooseFieldModalVisible,
      treeData,
      selectedKeys
    } = this.state;
    const {
      resid,
      subresid,
      hostrecid,
      advSearchConfig,
      record,
      formTitle
    } = this.props;
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
            {formTitle === '实验室检查' ? (
              <LabExaminationChart
                data={recordList}
                fields={fields}
                dateField={innerFieldName}
              />
            ) : (
              <HeightWeightChart
                sex={record.C3_589053299408}
                chartType={chartType}
                userData={recordList}
                recordMonthField={'C3_603833255097'}
                recordHeightField={'C3_586880026948'}
                recordWeightField={'C3_586880035091'}
              />
            )}
          </LzModal>
        )}

        <Modal
          title="选择字段"
          visible={chooseFieldModalVisible}
          onCancel={() => this.setState({ chooseFieldModalVisible: false })}
          onOk={this.handleCompleteFieldsChoose}
        >
          <Tree
            checkable
            ref={this.getTreeRef}
            selectedKeys={selectedKeys}
            onCheck={this.handleNodeCheck}
          >
            {this.renderTreeNodes(treeData)}
          </Tree>
        </Modal>
      </div>
    );
  }
}
