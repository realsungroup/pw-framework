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
  Checkbox,
  message
} from 'antd';
import http, { makeCancelable } from 'Util20/api';
import DesignPaper from './DesignPaper';
import Spin from 'Common/ui/Spin';
import classNames from 'classnames';

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

const resid1 = 636040535718; //专门放试卷表
const resid2 = 636548884907; //放试卷实例的表

const templateResid = 636040619243; //模板表id
class TestPaperManager extends React.Component {
  state = {
    addPaperVisible: false,
    designPapering: false,
    papers: [],
    selectedPaper: null,
    createBtnLoading: false,
    fetchingPapers: true,
    filterText: ''
  };

  componentDidMount() {
    this.fetchPapers();
  }
  fetchPapers = async () => {
    try {
      this.setState({ fetchingPapers: true });
      const res = await http({ baseURL: this.props.baseURL }).getUserAppLinks({
        parentresid: resid1
      });
      this.setState({ papers: res.data, fetchingPapers: false });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  handleCreatePaper = async () => {
    const paperName = this.paperNameRef.state.value;
    if (!paperName || !paperName.trim()) {
      return message.info('请输入试卷名。');
    }
    const httpParam = { baseURL: this.props.baseURL };
    try {
      this.setState({ createBtnLoading: true });
      const res = await http(httpParam).addUserResouce({
        parentresid: resid1,
        sourceresid: templateResid,
        resname: paperName
      });
      await http(httpParam).addInheritResource({
        sourceresid: res.data,
        resname: paperName
      });
      await http(httpParam).addUserResouce({
        parentresid: res.data,
        sourceresid: res.data,
        resname: '单选-' + paperName
      });
      await http(httpParam).addUserResouce({
        parentresid: res.data,
        sourceresid: res.data,
        resname: '多选-' + paperName
      });
      this.setState({
        designPapering: true,
        addPaperVisible: false,
        selectedResid: res.data,
        createBtnLoading: false
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
      this.setState({ createBtnLoading: false });
    }
  };

  handleSearchChange = e => {
    this.setState({ filterText: e.target.value });
  };

  renderPapers = () => {
    const { papers, fetchingPapers, filterText } = this.state;
    return fetchingPapers ? (
      <Spin />
    ) : (
      <div className="test-papers-main">
        <Search
          placeholder="试卷名"
          value={filterText}
          style={{ width: 300 }}
          onChange={this.handleSearchChange}
        />
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
          {papers
            .filter(
              paper =>
                paper.RES_PID === resid1 &&
                (filterText.trim() !== ''
                  ? paper.RES_NAME.toLowerCase().includes(
                      filterText.toLowerCase()
                    )
                  : true)
            )
            .map(paper => {
              return (
                <div
                  className={'test-paper'}
                  key={paper.RES_ID}
                  onClick={() => {
                    this.setState({
                      selectedPaper: paper,
                      designPapering: true
                    });
                  }}
                >
                  <h4>{paper.RES_NAME}</h4>
                  <p>已关联章节</p>
                  <Icon type="delete" className="test-paper-delete-btn" />
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  handleBack = () => {
    this.setState({
      designPapering: false
    });
  };
  render() {
    const {
      addPaperVisible,
      designPapering,
      selectedPaper,
      createBtnLoading
    } = this.state;
    const { baseURL } = this.props;
    return (
      <div className="online-test-paper-manager">
        {designPapering ? (
          <DesignPaper
            onBack={this.handleBack}
            baseURL={baseURL}
            paper={selectedPaper}
          />
        ) : (
          this.renderPapers()
        )}
        <Modal
          visible={addPaperVisible}
          okText="创建"
          title="添加新考卷"
          onCancel={() => this.setState({ addPaperVisible: false })}
          onOk={this.handleCreatePaper}
          okButtonProps={{ loading: createBtnLoading }}
        >
          <Form {...formItemLayout}>
            <Form.Item label="试卷名">
              <Input
                required
                ref={e => {
                  this.paperNameRef = e;
                }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default TestPaperManager;
