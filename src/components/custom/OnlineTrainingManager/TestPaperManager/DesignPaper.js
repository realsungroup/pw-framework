import React from 'react';
import {
  Input,
  Icon,
  Popover,
  Modal,
  Select,
  Form,
  Divider,
  Checkbox,
  message,
  Empty,
  Spin,
  Popconfirm,
  InputNumber
} from 'antd';
import http, { makeCancelable } from 'Util20/api';
import classnames from 'classnames';
import PwSpin from 'Common/ui/Spin';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import memoize from 'memoize-one';

const designPaperLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
// 设置样式
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  // 拖拽的时候背景变化
  background: isDragging ? 'lightgreen' : '',

  // styles we need to apply on draggables
  ...draggableStyle
});
// 重新记录数组顺序
const reorder = (list, startIndex, endIndex) => {
  const result = [...list];

  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);
  return result;
};
const { Search, TextArea } = Input;
const { Option } = Select;
function stopPropagation(e) {
  e.stopPropagation();
}
const workNumber = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
  5: 'E',
  6: 'F',
  7: 'G',
  8: 'H',
  9: 'I',
  10: 'J',
  11: 'K',
  12: 'L',
  13: 'M',
  14: 'N',
  15: 'O',
  16: 'P',
  17: 'Q',
  18: 'R',
  19: 'S',
  20: 'T',
  21: 'U',
  22: 'V',
  23: 'W',
  24: 'X',
  25: 'Y',
  26: 'Z'
};
function getWordFromNumber(number) {
  return workNumber[number] || 'Z';
}
class DesignPaper extends React.Component {
  state = {
    columnInfo: [],
    loading: false,
    selectedQuestion: {},
    scoreCol: {}, //合格成绩字段
    addQuestionVisible: false,
    createBtnLoading: false,
    savingQuestion: false,
    singleRes: {}, //单选下拉字典
    mulptiRes: {}, //多选下拉字典
    mulptiRecords: [], //多选字典记录
    singleRecords: [], //单选字典记录
    extendColumnInfo: [], // 继承表的字段定义
    extendRes: {},
    filterText: ''
  };
  async componentDidMount() {
    const { paper } = this.props;
    const resid = paper.RES_ID;
    this.setState({ loading: true });
    await this.fetchSelectRes(resid);
    await this.fetchColumnInfo(resid);
    await this.fetchExtendRes(resid);
    this.setState({ loading: false });
  }

  fetchSelectRes = async resid => {
    try {
      const res = await http({ baseURL: this.props.baseURL }).getUserAppLinks({
        parentresid: resid
      });
      const singleRes = res.data.find(item => item.RES_NAME.includes('单选'));
      const mulptiRes = res.data.find(item => item.RES_NAME.includes('多选'));
      this.setState({
        singleRes,
        mulptiRes
      });
      const res1 = await http({ baseURL: this.props.baseURL }).getTable({
        resid: mulptiRes.RES_ID
      });
      const res2 = await http({ baseURL: this.props.baseURL }).getTable({
        resid: singleRes.RES_ID
      });
      this.setState({
        mulptiRecords: res1.data.sort(
          (a, b) => Date.parse(a.REC_CRTTIME) - Date.parse(b.REC_CRTTIME)
        ),
        singleRecords: res2.data.sort(
          (a, b) => Date.parse(a.REC_CRTTIME) - Date.parse(b.REC_CRTTIME)
        )
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  fetchColumnInfo = async resid => {
    try {
      const res = await http({
        baseURL: this.props.baseURL
      }).getTableColumnDefine({
        resid
      });
      let scoreCol = {};
      const columnInfo = [];
      res.data.forEach(item => {
        if (item.ColName === 'score') {
          scoreCol = item;
        }
        if (item.ColNotes) {
          columnInfo.push(item);
        }
      });
      this.setState({
        columnInfo,
        scoreCol
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };
  fetchExtendRes = async resid => {
    try {
      const res = await http({
        baseURL: this.props.baseURL
      }).getInheritResIDsByHostResid({
        id: resid
      });
      const res1 = await http({
        baseURL: this.props.baseURL
      }).getTableColumnDefine({
        resid: res.data[0].RES_ID
      });

      this.setState({ extendColumnInfo: res1.data, extendRes: res.data[0] });
    } catch (error) {
      console.error(error);
      // message.error(error.message);
    }
  };

  addColumn = async () => {
    const { baseURL, paper } = this.props;
    const { mulptiRes, singleRes } = this.state;
    const paperName = this.paperNameRef.state.value;
    const isMultiple = this.isMulptiRef.rcSelect.state.value;
    if (!paperName || !paperName.trim()) {
      return message.info('请输入题干');
    }
    const resid = paper.RES_ID;
    try {
      this.setState({ createBtnLoading: true });
      const res = await http({
        baseURL
      }).addColumnOfUserResource({
        ColType: 1,
        ColDispName: paperName,
        ColSize: 200,
        ColNotes: paperName,
        ColValConstant: '',
        ColIndepResID: resid
      });
      const mainColname = res.data.data[res.data.data.length - 1].ColName;
      const res1 = await http({
        baseURL
      }).addColumnOfUserResource({
        ColType: 1,
        ColDispName: paperName,
        ColSize: 200,
        ColNotes: paperName,
        ColIndepResID: isMultiple[0] ? mulptiRes.RES_ID : singleRes.RES_ID
      });
      const selectColname = res1.data.data[res1.data.data.length - 1].ColName;
      const res2 = await http({
        baseURL
      }).setFieldAdvOptionDict({
        resid,
        colname: mainColname,
        dictresid: isMultiple[0] ? mulptiRes.RES_ID : singleRes.RES_ID,
        valuecolumn: selectColname,
        textcolumn: selectColname,
        emptyisfirstitem: false,
        notshowrepeatitem: true,
        mutiselect: isMultiple[0]
      });
      this.setState({
        columnInfo: res2.data,
        createBtnLoading: false,
        addQuestionVisible: false
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
      this.setState({ createBtnLoading: false });
    }
  };

  deleteColumn = async colname => {
    const { baseURL, paper } = this.props;
    const resid = paper.RES_ID;
    try {
      const res = await http({ baseURL }).setColToShowDisable({
        resid,
        colname
      });
      this.setState({
        columnInfo: res.data.data
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  modifyColumn = async data => {
    const { baseURL, paper } = this.props;
    try {
      this.setState({ savingQuestion: true });
      const res = await http({ baseURL }).editColumnOfUserResource(data);
      this.setState({ savingQuestion: false, columnInfo: res.data.data });
    } catch (error) {
      console.log(error);
      message.error(error.message);
      this.setState({ savingQuestion: false });
    }
  };

  setScore = async data => {
    const { baseURL, paper } = this.props;
    const resid = paper.RES_ID;
    try {
      this.setState({ savingQuestion: true });
      const res = await http({ baseURL }).setColScore({ ...data, resid });
      this.setState({ savingQuestion: false, columnInfo: res.data });
    } catch (error) {
      console.log(error);
      message.error(error.message);
      this.setState({ savingQuestion: false });
    }
  };

  openAddQuestionModal = () => {
    this.setState({ addQuestionVisible: true });
  };
  setSingleOption = async (data = { colname: '', options: '' }) => {
    const { baseURL, paper } = this.props;
    const resid = paper.RES_ID;
    try {
      this.setState({ savingQuestion: true });
      const res = await http({ baseURL }).setfieldoptions({
        ...data,
        resid
      });
      this.setState({ savingQuestion: false, columnInfo: res.data.data });
    } catch (error) {
      console.log(error);
      message.error(error.message);
      this.setState({ savingQuestion: false });
    }
  };

  addMulptiRecords = async data => {
    const { baseURL } = this.props;
    const { mulptiRes, mulptiRecords } = this.state;
    const resid = mulptiRes.RES_ID;
    try {
      this.setState({ savingQuestion: true });
      const res = await http({ baseURL }).addRecords({
        resid,
        data: [data]
      });
      mulptiRecords.push(res.data[0]);
      this.setState({
        savingQuestion: false,
        mulptiRecords: [...mulptiRecords]
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
      this.setState({ savingQuestion: false });
    }
  };

  modifyMulptiRecords = async data => {
    const { baseURL } = this.props;
    const { mulptiRes, mulptiRecords } = this.state;
    const resid = mulptiRes.RES_ID;
    try {
      this.setState({ savingQuestion: true });
      const res = await http({ baseURL }).modifyRecords({
        resid,
        data: [data]
      });
      mulptiRecords[
        mulptiRecords.findIndex(item => item.REC_ID === data.REC_ID)
      ] = res.data[0];
      this.setState({
        savingQuestion: false,
        mulptiRecords: [...mulptiRecords]
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
      this.setState({ savingQuestion: false });
    }
  };
  addSingleRecords = async data => {
    const { baseURL } = this.props;
    const { singleRes, singleRecords } = this.state;
    const resid = singleRes.RES_ID;
    try {
      this.setState({ savingQuestion: true });
      const res = await http({ baseURL }).addRecords({
        resid,
        data: [data]
      });
      singleRecords.push(res.data[0]);
      this.setState({
        savingQuestion: false,
        singleRecords: [...singleRecords]
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
      this.setState({ savingQuestion: false });
    }
  };

  modifySingleRecords = async data => {
    const { baseURL } = this.props;
    const { singleRes, singleRecords } = this.state;
    const resid = singleRes.RES_ID;
    try {
      this.setState({ savingQuestion: true });
      const res = await http({ baseURL }).modifyRecords({
        resid,
        data: [data]
      });
      singleRecords[
        singleRecords.findIndex(item => item.REC_ID === data.REC_ID)
      ] = res.data[0];
      this.setState({
        savingQuestion: false,
        singleRecords: [...singleRecords]
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
      this.setState({ savingQuestion: false });
    }
  };

  handleOptionChange = (isMultiple, record, index, valueCol, value) => {
    const { mulptiRecords, singleRecords } = this.state;
    if (isMultiple) {
      mulptiRecords[
        mulptiRecords.findIndex(item => item.REC_ID === record.REC_ID)
      ][valueCol] = value ? value : getWordFromNumber(index + 1);
      this.setState({});
    } else {
      singleRecords[
        singleRecords.findIndex(item => item.REC_ID === record.REC_ID)
      ][valueCol] = value ? value : getWordFromNumber(index + 1);
      this.setState({});
    }
  };

  handleMoveUp = (info, index) => async e => {
    e.stopPropagation();
    const res = await this.moveUpColumn(info.ColName, 1);
    if (res) {
      const columnInfo = [...this.state.columnInfo];
      columnInfo[index] = columnInfo[index - 1];
      columnInfo[index - 1] = info;
      this.setState({ columnInfo });
    }
  };

  handleMoveDown = (info, index) => async e => {
    e.stopPropagation();
    const res = await this.moveDownColumn(info.ColName, 1);
    if (res) {
      const columnInfo = [...this.state.columnInfo];
      columnInfo[index] = columnInfo[index + 1];
      columnInfo[index + 1] = info;
      this.setState({ columnInfo });
    }
  };

  moveUpColumn = async (colname, step) => {
    const { baseURL, paper } = this.props;
    const resid = paper.RES_ID;
    try {
      await http({ baseURL }).moveUpColumn({ resid, colname, step });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  moveDownColumn = async (colname, step) => {
    const { baseURL, paper } = this.props;
    const resid = paper.RES_ID;
    try {
      await http({ baseURL }).moveDownColumn({ resid, colname, step });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  onDragEnd = async result => {
    if (this.state.filterText) {
      return message.info('请清空搜索框');
    }
    if (!result.destination) {
      return;
    }

    const { columnInfo } = this.state;
    const sourceIndex = result.source.index;
    const targetIndex = result.destination.index;
    const difference = sourceIndex - targetIndex;
    const source = columnInfo[sourceIndex];
    if (difference > 0) {
      // 向上移
      const res = this.moveUpColumn(source.ColName, difference);
      if (res) {
        const newColumn = reorder(columnInfo, sourceIndex, targetIndex);
        this.setState({ columnInfo: newColumn });
      }
    } else if (difference < 0) {
      // 向下移
      const res = this.moveUpColumn(source.ColName, -difference);
      if (res) {
        const newColumn = reorder(columnInfo, sourceIndex, targetIndex);
        this.setState({ columnInfo: newColumn });
      }
    }
  };

  /**
   * 设置字段显示或隐藏
   */
  setFieldShow = async (col, show) => {
    try {
      this.setState({ savingQuestion: true });
      const { baseURL } = this.props;
      const { extendRes } = this.state;
      const res = await http({ baseURL }).setFieldShow({
        resid: extendRes.RES_ID,
        colname: col.ColName,
        show
      });
      const extendColumnInfo = [...this.state.extendColumnInfo];
      if (show) {
        extendColumnInfo.push({ ...col });
      } else {
        extendColumnInfo.splice(
          extendColumnInfo.findIndex(item => item.ColName == col.ColName),
          1
        );
      }
      this.setState({ savingQuestion: false, extendColumnInfo });
    } catch (error) {
      console.error(error);
      message.error(error.message);
      this.setState({ savingQuestion: false });
    }
  };

  renderEditor = () => {
    const {
      selectedQuestion,
      savingQuestion,
      mulptiRecords,
      singleRecords,
      extendColumnInfo
    } = this.state;
    if (!selectedQuestion.ColName) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            background: '#ffffff'
          }}
        >
          <Empty description="请选择一个题目" />
        </div>
      );
    }
    let isMultiple;
    let rightAnwsers = [];
    const ColValType = selectedQuestion.ColValType;
    if (ColValType === 1) {
      isMultiple = false;
    }
    let _mulptiRecords = [];
    if (ColValType === 14) {
      if (selectedQuestion.ColOptionDictData.IsMutiSelectCol) {
        //多选
        isMultiple = true;
        rightAnwsers = selectedQuestion.ColValConstant
          ? selectedQuestion.ColValConstant.split(',')
          : [];
        _mulptiRecords = mulptiRecords.filter(
          item => item[selectedQuestion.ColOptionDictData.valueCol]
        );
      } else {
        isMultiple = false;
        _mulptiRecords = singleRecords.filter(
          item => item[selectedQuestion.ColOptionDictData.valueCol]
        );
      }
    }

    return (
      <div className="question-editor">
        <Spin spinning={savingQuestion}>
          <Form {...designPaperLayout}>
            <Form.Item label="能否多选：">
              <Select value={isMultiple ? '是' : '否'} disabled>
                <Option value="是">是</Option>
                <Option value="否">否</Option>
              </Select>
            </Form.Item>
            <Form.Item label="题干：">
              <TextArea
                rows={4}
                value={selectedQuestion.ColNotes}
                onBlur={() => {
                  this.modifyColumn({
                    ...selectedQuestion
                  });
                }}
                onChange={e => {
                  this.setState({
                    selectedQuestion: {
                      ...selectedQuestion,
                      ColNotes: e.target.value
                    }
                  });
                }}
              />
            </Form.Item>
            <Divider />
            <Form.Item label="选项：">
              {ColValType === 14 &&
                _mulptiRecords.map((record, index) => {
                  const valueCol = selectedQuestion.ColOptionDictData.valueCol;
                  return (
                    <div className="question-option" key={record.REC_ID}>
                      <Input
                        value={record[valueCol]}
                        onBlur={() => {
                          if (isMultiple) {
                            this.modifyMulptiRecords(record);
                          } else {
                            this.modifySingleRecords(record);
                          }
                        }}
                        onChange={e => {
                          this.handleOptionChange(
                            isMultiple,
                            record,
                            index,
                            valueCol,
                            e.target.value
                          );
                        }}
                      />
                      <div className="question-option-actions">
                        <Popconfirm
                          title="确认删除吗？"
                          onConfirm={() => {
                            if (isMultiple) {
                              this.modifyMulptiRecords({
                                ...record,
                                [valueCol]: ''
                              });
                            } else {
                              this.modifySingleRecords({
                                ...record,
                                [valueCol]: ''
                              });
                            }
                          }}
                        >
                          <Icon
                            type="delete"
                            className="question-option-action question-option-action--danger"
                          />
                        </Popconfirm>
                      </div>
                    </div>
                  );
                })}
              {ColValType === 1 &&
                selectedQuestion.ValueOptions.map(option => {
                  return (
                    <div className="question-option" key={option}>
                      <Input value={option} />
                      <div className="question-option-actions">
                        <Icon
                          type="delete"
                          className="question-option-action question-option-action--danger"
                        />
                      </div>
                    </div>
                  );
                })}
              <div
                className="add-option-btn"
                onClick={() => {
                  if (isMultiple) {
                    if (mulptiRecords[_mulptiRecords.length]) {
                      this.modifyMulptiRecords({
                        [selectedQuestion.ColOptionDictData
                          .valueCol]: getWordFromNumber(
                          _mulptiRecords.length + 1
                        ),
                        REC_ID: mulptiRecords[_mulptiRecords.length].REC_ID
                      });
                    } else {
                      this.addMulptiRecords({
                        [selectedQuestion.ColOptionDictData
                          .valueCol]: getWordFromNumber(
                          _mulptiRecords.length + 1
                        )
                      });
                    }
                  } else {
                    if (ColValType === 1) {
                      this.setSingleOption({
                        colname: selectedQuestion.ColName,
                        options: selectedQuestion.ValueOptions.concat([
                          ''
                        ]).join(',')
                      });
                    } else {
                      if (singleRecords[_mulptiRecords.length]) {
                        this.modifySingleRecords({
                          [selectedQuestion.ColOptionDictData
                            .valueCol]: getWordFromNumber(
                            _mulptiRecords.length + 1
                          ),
                          REC_ID: singleRecords[_mulptiRecords.length].REC_ID
                        });
                      } else {
                        this.addSingleRecords({
                          [selectedQuestion.ColOptionDictData
                            .valueCol]: getWordFromNumber(
                            _mulptiRecords.length + 1
                          )
                        });
                      }
                    }
                  }
                }}
              >
                <Icon type="plus" style={{ fontSize: 16, marginRight: 8 }} />
                添加新的选项
              </div>
            </Form.Item>
            <Divider />
            <Form.Item label="正确答案">
              {isMultiple ? (
                _mulptiRecords.map((option, index) => {
                  const value =
                    option[selectedQuestion.ColOptionDictData.valueCol];
                  return (
                    <Checkbox
                      checked={rightAnwsers.includes(value[0])}
                      onChange={e => {
                        if (e.target.checked) {
                          rightAnwsers.push(value[0]);
                          rightAnwsers.sort();
                          this.modifyColumn({
                            ...selectedQuestion,
                            ColValConstant: rightAnwsers.join(',')
                          });
                          this.setState({
                            selectedQuestion: {
                              ...selectedQuestion,
                              ColValConstant: rightAnwsers.join(',')
                            }
                          });
                        } else {
                          selectedQuestion.ColValConstant = selectedQuestion.ColValConstant.replace(
                            value[0],
                            ''
                          );
                          this.modifyColumn({ ...selectedQuestion });
                          this.setState({
                            selectedQuestion: { ...selectedQuestion }
                          });
                        }
                      }}
                    >
                      {value[0]}
                    </Checkbox>
                  );
                })
              ) : (
                <Select
                  value={selectedQuestion.ColValConstant}
                  onChange={v => {
                    this.setState(
                      {
                        selectedQuestion: {
                          ...selectedQuestion,
                          ColValConstant: v
                        }
                      },
                      () => {
                        this.modifyColumn({
                          ...this.state.selectedQuestion
                        });
                      }
                    );
                  }}
                >
                  {_mulptiRecords.map(option => {
                    const value =
                      option[selectedQuestion.ColOptionDictData.valueCol];
                    return <Option value={value[0]}>{value[0]}</Option>;
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="启用">
              <Checkbox
                checked={extendColumnInfo.some(
                  info => selectedQuestion.ColName == info.ColName
                )}
                onChange={e =>
                  this.setFieldShow(selectedQuestion, e.target.checked)
                }
              >
                启用
              </Checkbox>
            </Form.Item>
            {/* <Form.Item label="自动分配题目分值">
              <Checkbox>自动分配题目分值</Checkbox>{' '}
            </Form.Item> */}
            <Form.Item label="分值">
              <Input
                type="number"
                value={selectedQuestion.CS_SCORE}
                onBlur={() => {
                  const score = Number(selectedQuestion.CS_SCORE);
                  if (score > 99 || score < 0) {
                    return message.info('分值区间为0~99');
                  }
                  this.setScore({
                    colname: selectedQuestion.ColName,
                    score
                  });
                }}
                onChange={e => {
                  this.setState({
                    selectedQuestion: {
                      ...selectedQuestion,
                      CS_SCORE: e.target.value
                    }
                  });
                }}
              />
            </Form.Item>
          </Form>
        </Spin>
      </div>
    );
  };

  filterColByText = memoize((columnInfo = [], filterText = '') => {
    if (!filterText) {
      return columnInfo;
    }
    return columnInfo.filter(item =>
      item.ColNotes.toLowerCase().includes(filterText.toLowerCase())
    );
  });
  render() {
    const { onBack, paper } = this.props;
    const {
      columnInfo,
      selectedQuestion,
      addQuestionVisible,
      createBtnLoading,
      loading,
      scoreCol,
      filterText
    } = this.state;
    const filteredCol = this.filterColByText(columnInfo, filterText);
    return (
      <div className="design-paper">
        <header className="design-paper__header">
          <div className="design-paper__header-back-btn" onClick={onBack}>
            <Icon type="arrow-left" style={{ marginRight: 4 }} />
            <span>返回</span>
          </div>
          <div>试卷名：{paper.RES_NAME}</div>
          <div style={{ display: 'flex', marginLeft: 16 }}>
            <label>合格成绩：</label>
            <InputNumber
              size="small"
              value={scoreCol.ColValConstant}
              onChange={v => {
                this.setState({ scoreCol: { ...scoreCol, ColValConstant: v } });
              }}
              onBlur={() => {
                this.modifyColumn({ ...scoreCol });
              }}
            />
          </div>
        </header>
        <main className="design-paper__main">
          <div className="paper-questions">
            <Search
              placeholder="输入问题"
              value={filterText}
              onChange={e => this.setState({ filterText: e.target.value })}
            />
            <div
              className="add-question-btn"
              onClick={this.openAddQuestionModal}
            >
              <Icon type="plus" style={{ fontSize: 16, marginRight: 8 }} />
              添加新的问题
            </div>
            <div className="paper-question-list">
              {loading && <PwSpin />}
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable-question">
                  {(provided, snapshot) => (
                    <div
                      //provided.droppableProps应用的相同元素.
                      {...provided.droppableProps}
                      // 为了使 droppable 能够正常工作必须 绑定到最高可能的DOM节点中provided.innerRef.
                      ref={provided.innerRef}
                      // style={getListStyle(snapshot)}
                    >
                      {filteredCol.map((info, index) => (
                        <Draggable
                          key={info.ColName}
                          draggableId={info.ColName + ''}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                              className={classnames('paper-question', {
                                selected:
                                  info.ColName == selectedQuestion.ColName
                              })}
                              key={info.ColName}
                              onClick={() => {
                                this.setState({ selectedQuestion: info });
                              }}
                            >
                              <span className="paper-question-number">
                                {index + 1}
                              </span>
                              <span className="paper-question-title">
                                {info.ColNotes}
                              </span>
                              <div className="paper-question-actions">
                                {index != 0 && !filterText && (
                                  <Icon
                                    type="arrow-up"
                                    className="paper-question-action"
                                    onClick={this.handleMoveUp(info, index)}
                                  />
                                )}
                                {index != columnInfo.length - 1 &&
                                  !filterText && (
                                    <Icon
                                      type="arrow-down"
                                      className="paper-question-action"
                                      onClick={this.handleMoveDown(info, index)}
                                    />
                                  )}
                                <Popconfirm
                                  title="确认删除吗？"
                                  onConfirm={e => {
                                    e.stopPropagation();
                                    this.deleteColumn(info.ColName);
                                  }}
                                >
                                  <Icon
                                    type="delete"
                                    className="paper-question-action paper-question-action--danger"
                                    onClick={stopPropagation}
                                  />
                                </Popconfirm>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
          {this.renderEditor()}
        </main>
        <Modal
          visible={addQuestionVisible}
          okText="创建"
          title="添加题目"
          onCancel={() => this.setState({ addQuestionVisible: false })}
          onOk={this.addColumn}
          okButtonProps={{ loading: createBtnLoading }}
        >
          <Form {...formItemLayout}>
            <Form.Item label="题干">
              <Input
                required
                ref={e => {
                  this.paperNameRef = e;
                }}
              />
            </Form.Item>
            <Form.Item label="是否多选">
              <Select
                required
                ref={e => {
                  this.isMulptiRef = e;
                }}
                defaultValue={true}
              >
                <Option value={true}>是</Option>
                <Option value={false}>否</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default DesignPaper;
