import React from 'react';
import './TestPaperManager.less';
import {
  Input,
  Icon,
  Popover,
  Modal,
  Select,
  Form,
  Divider,
  Checkbox
} from 'antd';

const { Search, TextArea } = Input;
const { Option } = Select;
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

class TestPaperManager extends React.Component {
  state = { addPaperVisible: false, designPapering: true };
  renderPapers = () => {
    return (
      <div className="test-papers-main">
        <Search placeholder="试卷名" style={{ width: 300 }} />
        <div
          className="add-paper-btn"
          onClick={() => {
            this.setState({ addPaperVisible: true });
          }}
        >
          <div className="add-paper-btn__content">
            <Icon type="plus" style={{ fontSize: 28, marginBottom: 12 }} />
            <p>添加新考卷</p>
          </div>
        </div>
        <div className="test-papers-list">
          <div className="test-paper">
            <h4>5S培训考试题目</h4>
            <p>不含多选题</p>
            <p>已关联章节</p>
            <Icon type="delete" className="test-paper-delete-btn" />
          </div>
          <div className="test-paper seleted">
            <h4>5S培训考试题目</h4>
            <p>不含多选题</p>
            <p>已关联章节</p>
            <Icon type="delete" className="test-paper-delete-btn" />
          </div>
          <div className="test-paper">
            <h4>5S培训考试题目</h4>
            <p>不含多选题</p>
            <p>已关联章节</p>
            <Icon type="delete" className="test-paper-delete-btn" />
          </div>
        </div>
      </div>
    );
  };

  renderDesignPaper = () => {
    return (
      <div className="design-paper">
        <header className="design-paper__header">
          <div
            className="design-paper__header-back-btn"
            onClick={() => {
              this.setState({ designPapering: false });
            }}
          >
            <Icon type="arrow-left" style={{ marginRight: 4 }} />
            <span>返回</span>
          </div>
          <div>试卷名：5S培训考试题目</div>
        </header>
        <main className="design-paper__main">
          <div className="paper-questions">
            <Search placeholder="输入问题" />
            <div className="paper-question-list">
              <div className="add-question-btn">
                <Icon type="plus" style={{ fontSize: 16, marginRight: 8 }} />
                添加新的问题
              </div>
              <div className="paper-question">
                <span className="paper-question-number">1</span>
                <span className="paper-question-title">
                  净化间员工可以化妆（包括涂指甲油）净化间员工可以化妆（包括涂指甲油）净化间员工可以化妆（包括涂指甲油）
                </span>
                <div className="paper-question-actions">
                  <Icon type="arrow-up" className="paper-question-action" />
                  <Icon type="arrow-down" className="paper-question-action" />
                  <Icon
                    type="delete"
                    className="paper-question-action paper-question-action--danger"
                  />
                </div>
              </div>
              <div className="paper-question">
                <span className="paper-question-number">2</span>
                <span className="paper-question-title">问题2</span>
                <div className="paper-question-actions">
                  <Icon type="arrow-up" className="paper-question-action" />
                  <Icon type="arrow-down" className="paper-question-action" />
                  <Icon
                    type="delete"
                    className="paper-question-action paper-question-action--danger"
                  />
                </div>
              </div>
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
  };
  render() {
    const { addPaperVisible, designPapering } = this.state;
    return (
      <div className="online-test-paper-manager">
        {designPapering ? this.renderDesignPaper() : this.renderPapers()}
        <Modal
          visible={addPaperVisible}
          okText="创建"
          title="添加新考卷"
          onCancel={() => this.setState({ addPaperVisible: false })}
          onOk={() =>
            this.setState({ designPapering: true, addPaperVisible: false })
          }
        >
          <Form {...formItemLayout}>
            <Form.Item label="试卷名">
              <Input />
            </Form.Item>
            <Form.Item label="是否有多选题">
              <Select>
                <Option value="有">有</Option>
                <Option value="无">无</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default TestPaperManager;
