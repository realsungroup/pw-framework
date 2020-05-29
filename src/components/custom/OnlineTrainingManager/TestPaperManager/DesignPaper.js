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
  message
} from 'antd';
import http, { makeCancelable } from 'Util20/api';

const designPaperLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
};
const { Search, TextArea } = Input;
const { Option } = Select;
class DesignPaper extends React.Component {
  state = {
    columnInfo: []
  };
  componentDidMount() {
    const { paper } = this.props;
    const resid = paper.RES_ID;
    this.fetchSelectRes(resid);
    this.fetchColumnInfo(resid);
  }

  fetchSelectRes = async resid => {
    try {
      const res = await http({ baseURL: this.props.baseURL }).getUserAppLinks({
        parentresid: resid
      });
      console.log(res.data);
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
      this.setState({ columnInfo: res.data });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };
  addColumn = async () => {
    const { columnInfo } = this.state;
    const { baseURL, paper } = this.props;
    const resid = paper.RES_ID;
    try {
      const res = await http({ baseURL }).addColumnOfUserResource({
        ColType: 1,
        ColDispName: '试题' + columnInfo.length,
        ColSize: 20,
        ColNotes: '题目的编号是什么?',
        ColValConstant: 'aaa',
        ColIndepResID: resid
      });
      this.setState({ columnInfo: res.data.data });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };
  render() {
    const { onBack, paper } = this.props;
    const { columnInfo } = this.state;
    return (
      <div className="design-paper">
        <header className="design-paper__header">
          <div className="design-paper__header-back-btn" onClick={onBack}>
            <Icon type="arrow-left" style={{ marginRight: 4 }} />
            <span>返回</span>
          </div>
          <div>试卷名：{paper.RES_NAME}</div>
        </header>
        <main className="design-paper__main">
          <div className="paper-questions">
            <Search placeholder="输入问题" />
            <div className="add-question-btn" onClick={this.addColumn}>
              <Icon type="plus" style={{ fontSize: 16, marginRight: 8 }} />
              添加新的问题
            </div>
            <div className="paper-question-list">
              {columnInfo.map((info, index) => {
                return (
                  <div className="paper-question">
                    <span className="paper-question-number">{index + 1}</span>
                    <span className="paper-question-title">
                      {info.ColDispName}
                    </span>
                    <div className="paper-question-actions">
                      <Icon type="arrow-up" className="paper-question-action" />
                      <Icon
                        type="arrow-down"
                        className="paper-question-action"
                      />
                      <Icon
                        type="delete"
                        className="paper-question-action paper-question-action--danger"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="question-editor">
            <Form {...designPaperLayout}>
              <Form.Item label="能否多选：">
                <Select>
                  <Option value="能">能</Option>
                  <Option value="否">否</Option>
                </Select>
              </Form.Item>
              <Form.Item label="题干：">
                <TextArea rows={4} />
              </Form.Item>
              <Divider />
              <Form.Item label="选项：">
                <div className="question-option">
                  <Input />
                  <div className="question-option-actions">
                    <Icon type="arrow-up" className="question-option-action" />
                    <Icon
                      type="arrow-down"
                      className="question-option-action"
                    />
                    <Icon
                      type="delete"
                      className="question-option-action question-option-action--danger"
                    />
                  </div>
                </div>
                <div className="question-option">
                  <Input />
                  <div className="question-option-actions">
                    <Icon type="arrow-up" className="question-option-action" />
                    <Icon
                      type="arrow-down"
                      className="question-option-action"
                    />
                    <Icon
                      type="delete"
                      className="question-option-action question-option-action--danger"
                    />
                  </div>
                </div>
                <div className="add-option-btn">
                  <Icon type="plus" style={{ fontSize: 16, marginRight: 8 }} />
                  添加新的选项
                </div>
              </Form.Item>
              <Divider />
              <Form.Item label="正确答案">
                <Select>
                  <Option value="对">对</Option>
                  <Option value="错">错</Option>
                </Select>
                <Checkbox>启用</Checkbox>
                <br />
                <Checkbox>自动分配题目分值</Checkbox>
              </Form.Item>
            </Form>
          </div>
        </main>
      </div>
    );
  }
}

export default DesignPaper;
