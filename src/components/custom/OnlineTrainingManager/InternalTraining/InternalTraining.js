import React from 'react';
import './InternalTraining.less';
import {
  Input,
  Icon,
  Popover,
  message,
  Modal,
  Form,
  Button,
  Select
} from 'antd';
import http, { makeCancelable } from 'Util20/api';
import classnames from 'classnames';
import { getDataProp } from 'Util20/formData2ControlsData';
import dealControlArr from 'Util20/controls';
import FormData from 'Common/data/FormData';
import TableData from 'Common/data/TableData';
import memoize from 'memoize-one';
import CourseCompletion from './CourseCompletion';

const { Search } = Input;
const resid = 640019761153;
const chapterResid = 636732588990;
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
class InternalTraining extends React.Component {
  state = {
    courses: [],
    selectedCourse: {},
    modifyCourseVisible: false,
    modifyChapterVisible: false,
    addCourseVisible: false,
    addChapterVisible: false,
    filterText: '',
    addChapterData: {
      C3_636732625526: '',
      C3_636735383253: '',
      C3_636735399221: '',
      videoId: '',
      C3_636735464189: '',
      directTest: 'N'
    },
    modifyChapterData: {},
    courseCompletionVisible: false,
    chapter: [] //待查看完成情况的章节
  };
  componentDidMount() {
    this.fetchCourse();
    this.getModifyFormData();
  }
  fetchCourse = async () => {
    const { baseURL } = this.props;
    try {
      const res = await http({ baseURL }).getTable({ resid });
      this.setState({ courses: res.data });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  getModifyFormData = async (formName = 'default') => {
    let res;
    try {
      const { baseURL } = this.props;
      this.setState({ loading: true });
      const httpParams = {};
      // 使用传入的 baseURL
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      res = await http(httpParams).getFormData({
        resid,
        formName
      });
      this._formData = dealControlArr(res.data.columns);
    } catch (err) {
      console.log(err);
      return message.error(err.message);
    }
  };

  filterCourses = memoize((courses = [], filterText = '') => {
    if (!filterText) {
      return courses;
    }
    const filterCourses = courses.filter(course => {
      return course.C3_636218615452.toLowerCase().includes(
        filterText.toLowerCase()
      );
    });
    return filterCourses;
  });
  openModifyModal = course => {
    this.setState({ selectedCourse: course }, () => {
      this._dataProp = getDataProp(
        this._formData,
        this.state.selectedCourse,
        true,
        false,
        false
      );

      this.setState({ modifyCourseVisible: true });
    });
  };
  openAddModal = () => {
    this._dataProp = getDataProp(
      this._formData,
      { C3_636485038768: '内训' },
      true,
      false,
      false
    );
    this.setState({ addCourseVisible: true });
  };

  afterSave = (operation, formData, record, form) => {
    const { courses } = this.state;
    const index = courses.findIndex(course => {
      return course.REC_ID === record.REC_ID;
    });
    if (index !== -1) {
      courses[index] = record;
      this.setState({
        courses: [...courses],
        selectedCourse: record,
        modifyCourseVisible: false
      });
    }
  };

  afterAdd = (operation, formData, record, form) => {
    const { courses } = this.state;
    courses.push(record);
    this.setState({ courses: [...courses], addCourseVisible: false });
  };
  confimeDelete = course => {
    Modal.confirm({
      title: '警告',
      content: '确认删除此门课程？',
      onOk: () => {
        this.handleDelete(course);
      }
    });
  };
  handleDelete = async course => {
    const { baseURL } = this.props;
    const { courses } = this.state;
    try {
      await http({ baseURL }).removeRecords({
        resid,
        data: [{ REC_ID: course.REC_ID }]
      });
      const index = courses.findIndex(course_ => {
        return course_.REC_ID === course.REC_ID;
      });
      if (index !== -1) {
        courses.splice(index, 1);
        this.setState({
          courses: [...courses],
          selectedCourse: {}
        });
      }
    } catch (error) {
      console.log(error);
      return message.error(error.message);
    }
  };
  handleAddChapterInputChange = key => e => {
    this.setState({
      addChapterData: {
        ...this.state.addChapterData,
        [key]: e.target.value
      }
    });
  };
  handleModifyChapterInputChange = key => e => {
    this.setState({
      modifyChapterData: {
        ...this.state.modifyChapterData,
        [key]: e.target.value
      }
    });
  };
  handleAddChapter = async () => {
    const { addChapterData } = this.state;
    if (!addChapterData.C3_636735399221) {
      return message.info('请输入名称');
    }
    try {
      await http({ baseURL: this.props.baseURL }).addRecords({
        resid: chapterResid,
        data: [addChapterData]
      });
      this.setState({ addChapterVisible: false, addChapterData: {} });
      this.tableDataRef.handleRefresh();
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };
  handleModifyChapter = async () => {
    const { modifyChapterData } = this.state;
    if (!modifyChapterData.C3_636735399221) {
      return message.info('请输入名称');
    }
    try {
      await http({ baseURL: this.props.baseURL }).modifyRecords({
        resid: chapterResid,
        data: [modifyChapterData]
      });
      this.setState({ modifyChapterVisible: false, modifyChapterData: {} });
      this.tableDataRef.handleRefresh();
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  addChapterClick = () => {
    const { selectedCourse, addChapterData } = this.state;
    this.setState({
      addChapterVisible: true,
      addChapterData: {
        ...addChapterData,
        C3_636732625526: selectedCourse.REC_ID
      }
    });
  };
  render() {
    const {
      courses,
      selectedCourse,
      filterText,
      modifyCourseVisible,
      addCourseVisible,
      addChapterVisible,
      modifyChapterVisible,
      addChapterData,
      modifyChapterData,
      courseCompletionVisible,
      chapter
    } = this.state;
    const { baseURL, coursePapers } = this.props;
    const _courses = this.filterCourses(courses, filterText);
    return (
      <div className="online-internal-training">
        <div className="course-container">
          <Search
            placeholder="搜索课程"
            value={filterText}
            onChange={e => {
              this.setState({ filterText: e.target.value });
            }}
            allowClear
          />
          <div className="add-course-btn" onClick={this.openAddModal}>
            点击新建内训课程
          </div>
          <div className="course-list">
            {_courses.map(course => {
              return (
                <div
                  key={course.REC_ID}
                  className={classnames('internal-training-course ', {
                    selected: selectedCourse.REC_ID === course.REC_ID
                  })}
                  onClick={() => {
                    this.setState({ selectedCourse: course });
                  }}
                >
                  <span className="course-name">{course.C3_636218615452}</span>
                  <Popover
                    placement="rightTop"
                    content={
                      <div className="course-more-actions">
                        <div
                          className="action"
                          onClick={() => this.openModifyModal(course)}
                        >
                          修改
                        </div>
                        <div
                          className="action danger-action"
                          onClick={() => {
                            this.confimeDelete(course);
                          }}
                        >
                          删除
                        </div>
                      </div>
                    }
                  >
                    <Icon type="more" className="course-more-btn" />
                  </Popover>
                </div>
              );
            })}
          </div>
        </div>
        <div className="test-table">
          <TableData
            key={selectedCourse.REC_ID}
            resid={636732588990}
            hasModify={false}
            hasDelete={true}
            hasRowDelete={false}
            subtractH={190}
            hasRowView={false}
            hasAdd={false}
            baseURL={baseURL}
            actionBarWidth={150}
            hasRowModify={false}
            hasRowSelection={true}
            wrappedComponentRef={element => (this.tableDataRef = element)}
            refTargetComponentName="TableData"
            cmswhere={
              selectedCourse.REC_ID
                ? `C3_636732625526 = '${selectedCourse.C3_636484839104}'`
                : '1 != 1'
            }
            actionBarExtra={({
              dataSource,
              selectedRowKeys,
              data,
              recordFormData
            }) => {
              return (
                selectedCourse.REC_ID && (
                  <div>
                    <Button size="small" onClick={this.addChapterClick}>
                      添加
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        if (selectedRowKeys.length !== 1) {
                          return message.info('请选择一条记录');
                        }
                        const record = dataSource.find(data => {
                          return data.REC_ID == selectedRowKeys[0];
                        });
                        this.setState({
                          modifyChapterVisible: true,
                          modifyChapterData: record
                        });
                      }}
                    >
                      修改
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        if (selectedRowKeys.length === 0) {
                          return message.info('请选择记录');
                        }
                        const record = dataSource.find(data => {
                          return data.REC_ID == selectedRowKeys[0];
                        });
                        this.setState({
                          courseCompletionVisible: true,
                          chapter: record
                          //modifyChapterData: records
                        });
                      }}
                    >
                      查看课程完成情况
                    </Button>
                  </div>
                )
              );
            }}
          />
        </div>
        <Modal
          visible={modifyCourseVisible}
          title="修改"
          width={800}
          footer={null}
          onCancel={() => {
            this.setState({ modifyCourseVisible: false });
          }}
          destroyOnClose
        >
          <FormData
            info={{ dataMode: 'main', resid }}
            operation="modify"
            data={this._dataProp}
            record={selectedCourse}
            onCancel={() => {
              this.setState({ modifyCourseVisible: false });
            }}
            onSuccess={this.afterSave}
            baseURL={baseURL}
          />
        </Modal>
        <Modal
          visible={addCourseVisible}
          title="添加"
          width={800}
          footer={null}
          onCancel={() => {
            this.setState({ addCourseVisible: false });
          }}
          destroyOnClose
        >
          <FormData
            info={{ dataMode: 'main', resid }}
            operation="add"
            data={this._dataProp}
            record={{}}
            onCancel={() => {
              this.setState({ addCourseVisible: false });
            }}
            onSuccess={this.afterAdd}
            baseURL={baseURL}
          />
        </Modal>
        <Modal
          visible={addChapterVisible}
          width={800}
          title="添加章节"
          onCancel={() => this.setState({ addChapterVisible: false })}
          destroyOnClose
          onOk={this.handleAddChapter}
        >
          <Form {...formItemLayout}>
            <Form.Item label="流程记录编号">
              <Input value={addChapterData.C3_636732625526} disabled />
            </Form.Item>
            <Form.Item
              label="章节名称"
              required
              validateStatus={
                !addChapterData.C3_636735399221 ? 'error' : 'success'
              }
              help={!addChapterData.C3_636735399221 && '请输入名称'}
            >
              <Input
                value={addChapterData.C3_636735399221}
                onChange={this.handleAddChapterInputChange('C3_636735399221')}
              />
            </Form.Item>
            <Form.Item label="视频编号">
              <Input
                value={addChapterData.videoId}
                onChange={this.handleAddChapterInputChange('videoId')}
              />
            </Form.Item>
            <Form.Item label="试卷编号">
              <Select
                showSearch
                value={addChapterData.C3_636735464189}
                optionFilterProp="children"
                onChange={value => {
                  const paper = coursePapers.find(
                    paper => paper.RES_ID == value
                  );
                  this.setState({
                    addChapterData: {
                      ...this.state.addChapterData,
                      C3_636735464189: value,
                      testMain: paper.RES_INDPID
                    }
                  });
                }}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {coursePapers.map(paper => {
                  return <Option value={paper.RES_ID}>{paper.RES_NAME}</Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item label="直接考试">
              <Select
                showSearch
                value={addChapterData.directTest}
                onChange={value => {
                  this.setState({
                    addChapterData: {
                      ...this.state.addChapterData,
                      directTest: value
                    }
                  });
                }}
              >
                <Option value="Y">Y</Option>
                <Option value="N">N</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          visible={modifyChapterVisible}
          title="修改章节"
          onCancel={() => this.setState({ modifyChapterVisible: false })}
          onOk={this.handleModifyChapter}
        >
          <Form {...formItemLayout}>
            <Form.Item label="流程记录编号">
              <Input value={modifyChapterData.C3_636732625526} disabled />
            </Form.Item>
            <Form.Item label="章节编号">
              <Input value={modifyChapterData.C3_636735383253} disabled />
            </Form.Item>
            <Form.Item
              label="章节名称"
              required
              validateStatus={
                !modifyChapterData.C3_636735399221 ? 'error' : 'success'
              }
              help={!modifyChapterData.C3_636735399221 && '请输入名称'}
            >
              <Input
                value={modifyChapterData.C3_636735399221}
                onChange={this.handleModifyChapterInputChange(
                  'C3_636735399221'
                )}
              />
            </Form.Item>
            <Form.Item label="视频编号">
              <Input
                value={modifyChapterData.videoId}
                onChange={this.handleModifyChapterInputChange('videoId')}
              />
            </Form.Item>
            <Form.Item label="试卷编号">
              <Select
                showSearch
                value={modifyChapterData.C3_636735464189}
                optionFilterProp="children"
                allowClear
                onChange={value => {
                  const paper = coursePapers.find(
                    paper => paper.RES_ID == value
                  );
                  this.setState({
                    modifyChapterData: {
                      ...this.state.modifyChapterData,
                      C3_636735464189: value ? value : '',
                      testMain: value ? paper.RES_INDPID : ''
                    }
                  });
                }}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {coursePapers.map(paper => {
                  return <Option value={paper.RES_ID}>{paper.RES_NAME}</Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item label="直接考试">
              <Select
                showSearch
                value={modifyChapterData.directTest}
                onChange={value => {
                  this.setState({
                    modifyChapterData: {
                      ...this.state.modifyChapterData,
                      directTest: value
                    }
                  });
                }}
              >
                <Option value="Y">Y</Option>
                <Option value="N">N</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          visible={courseCompletionVisible}
          onCancel={() => {
            this.setState({ courseCompletionVisible: false });
          }}
          width="90vw"
          destroyOnClose
          footer={null}
          title="课程完成情况"
        >
          <CourseCompletion
            course={selectedCourse}
            baseURL={baseURL}
            chapter={chapter}
          />
        </Modal>
      </div>
    );
  }
}

export default InternalTraining;
