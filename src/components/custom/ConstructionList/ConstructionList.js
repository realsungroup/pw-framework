import React from 'react';
import { TableData } from '../../common/loadableCommon';
import {
  Button,
  Input,
  Modal,
  Spin,
  Tabs,
  Select,
  message,
  DatePicker,
  Checkbox,
  Pagination
} from 'antd';
import './ConstructionList.less';
import moment from 'moment';
import http from '../../../util20/api';
import exportJsonExcel from 'js-export-excel';
import BuilderForm from '../LzApproval/BuilderForm';

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
class ConstructionList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }
  state = {
    loading:false,
    stDate:null,
    edDate:null,
    type:null,
    cms:``,
    record: {}, //当前操作记录
    printModal: false, //打印模态框
    isPrint: false, //是否打印
    abnormalNum: 0,
    activeKey: '待审批',
    showDeliverModal: false, //控制送货人员模态框
    showBuilderModal: false, //控制施工人员模态框
    deliverList: [], //送货人员清单
    builderList: [], //施工人员清单
    approvalList1: [], //审批流信息
  };

  //根据人员类型不同，打开不同的模态框
  showRecord = async record => {
    this.setState({ showBuilderModal: true, record: record });
    
    //获取人员清单
    let peopleList;
    try {
      peopleList = await http().getTable({
        resid: '605716014733',
        cmswhere: `C3_606070812241 = '${record.C3_605718092628}'`
      });
      this.setState({
        deliverList: peopleList.data,
        builderList: peopleList.data
      });
    } catch (error) {
      message.error(error.message);
    }
    //获取审批流信息
    let approvalList;
    const approvalPeopleList = [
      {
        C3_607445035535: '申请人',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '受施工影响部门负责人',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '厂务负责工程师',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '厂务经理',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '经理',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '总监',
        C3_605718014873: '',
        C3_605718009813: ''
      }
    ];
    try {
      approvalList = await http().getTable({
        resid: '605717968873',
        cmswhere: `C3_605717990563 = '${record.C3_605718092628}'`
      });
      this.setState({
        approvalList: approvalList.data
      });

      approvalPeopleList.map((item, index) => {
        const current = item.C3_607445035535;
        const data = approvalList.data.filter(
          item1 => item1.C3_607445035535 === current
        );
        if (data.length === 1) {
          item.C3_605718014873 = data[0].C3_605718014873;
          item.C3_605718009813 = data[0].C3_605718009813;
          item.C3_227192472953 = data[0].C3_227192472953;
        }
      });
    } catch (error) {
      message.error(error.message);
    }
    this.setState({
      approvalList1: approvalPeopleList
    });
  };
  getData=()=>{
    let cms;
    let ed = this.state.edDate;
    if(ed){
      ed=moment(ed).add(1,'days');
      ed=moment(ed).format('YYYY-MM-DD');
    }
    if (this.state.stDate){
      cms = `REC_CRTTIME >= '${this.state.stDate}'`
    }
    if(this.state.stDate&&ed){
      cms+=` and REC_CRTTIME <= '${ed}'`
    }else if(!this.state.stDate&&ed){
      cms=`REC_CRTTIME <= '${ed}'`
    }
    if((this.state.stDate||ed)&&this.state.type){
      cms+=` and workerType = '${this.state.type}'`
    }else if(!this.state.stDate&&!ed&&this.state.type){
      cms=`workerType = '${this.state.type}'`
    }
    this.setState({cms});
  }
  jump=()=>{
    window.open(
      window.location.origin +
      '?resid=605803889644&recid=613132651866&type=访客系统&title=访客申请'
    );
    window.parent.close();
  }
  doPrint = res => {
    var currentHtml = window.document.body.innerHTML;
    if (res === 'deliver') {
      if (
        window.document.getElementById('printDeliverForm').innerHTML != null
      ) {
        let bdHtml = window.document.getElementById('printDeliverForm')
          .innerHTML;
        window.document.body.innerHTML = bdHtml;
        // console.log('获取打印');
        window.print();
        this.setState({
          isPrint: false
        });
        window.location.reload();
      }
    } else if (res === 'builder') {
      if (
        window.document.getElementById('printBuilderForm').innerHTML != null
      ) {
        let bdHtml = window.document.getElementById('printBuilderForm')
          .innerHTML;
        window.document.body.innerHTML = bdHtml;
        // console.log('获取打印');
        window.print();
        this.setState({
          isPrint: false
        });
        window.location.reload();
      }
      window.document.body.innerHTML = currentHtml;
    }
  };
  render() {
    const {
      activeKey,
      abnormalNum,
      showBuilderModal,
      showDeliverModal,
      record,
      approvalList1,
      deliverList,
      builderList,
      isPrint
    } = this.state;
    return (
      <div className="conlist">
         <Modal
              width="61%"
              visible={showBuilderModal}
              title="施工申请审批"
              className="alterModal"
              onCancel={() => {
                this.setState({
                  showBuilderModal: false,
                  isPrint: false
                });
              }}
              footer={
                isPrint
                  ? [
                      <Button
                        type="primary"
                        onClick={() => {
                          this.doPrint('builder');
                          this.setState({
                            isPrint: true
                          });
                        }}
                      >
                        打印
                      </Button>,
                      <Button
                        onClick={() => {
                          this.setState({
                            showBuilderModal: false,
                            isPrint: false
                          });
                        }}
                      >
                        关闭
                      </Button>
                    ]
                  : [
                      <Button
                        type="primary"
                        onClick={() => {
                          this.approveBuilder('Y');
                          this.setState({ showBuilderModal: false });
                        }}
                      >
                        通过
                      </Button>,
                      <Button
                        type="danger"
                        onClick={() => {
                          this.approveBuilder('N');
                          this.setState({ showBuilderModal: false });
                        }}
                      >
                        拒绝
                      </Button>,
                      <Button
                        onClick={() => {
                          this.setState({
                            showBuilderModal: false
                          });
                        }}
                      >
                        关闭
                      </Button>
                    ]
              }
            >
              <div id="printBuilderForm">
                <div style={{ marginTop: 24 }}>
                  <div>附件：</div>
                  {record.file1 ? (
                    <ul>
                      <li>
                        <a href={record.file1Address} target="_blank">
                          {record.file1}
                        </a>
                      </li>
                      {record.file2 ? (
                        <li>
                          <a href={record.file2Address} target="_blank">
                            {record.file2}
                          </a>
                        </li>
                      ) : null}
                    </ul>
                  ) : (
                    <div>无</div>
                  )}
                </div>
                <div className="printBody">
                  <BuilderForm
                    toBuilderFormInfo={{
                      approvalInfo: record,
                      builderList: builderList,
                      approvalList: approvalList1,
                      isPrint: isPrint
                    }}
                  />
                </div>
              </div>
            </Modal>
        <Spin spinning={this.state.loading}>
          <div className='tableWrap'>
          <TableData
                  resid="706620130417"
                  cmswhere={this.state.cms}
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  refTargetComponentName="TableData"
                  defaultPagination={this.defaultPagination}
                  subtractH={200}
                  hasAdd={false}
                  hasRowView={false}
                  hasRowDelete={false}
                  hasDownload={true}
                  hasRowEdit={false}
                  hasDelete={false}
                  hasModify={false}
                  hasRowModify={false}
                  hasRowSelection={false}
                  hasAdvSearch={true}
                  isUseBESize={true}
                  noColumn={{
                    show: true,
                  }}
                  actionBarExtra={({ dataSource, selectedRowKeys }) => {
                    return (
                      <div className='filter'>
                          <div className='fitem'>
                            <span>请选择申请日期范围：</span>
                            <RangePicker
                                    style={{ marginLeft: 24 }}
                                    value={
                                      this.state.stDate && this.state.edDate
                                        ? [
                                            moment(this.state.stDate, dateFormat),
                                            moment(this.state.edDate, dateFormat)
                                          ]
                                        : [null, null]
                                    }
                                    onChange={(dates, dateString) => {
                                      this.setState({
                                        stDate: dateString[0],
                                        edDate: dateString[1]
                                      });
                                    }}
                            ></RangePicker>
                          </div>
                          <div className='fitem'>
                            <span>请选择施工类别：</span>
                            <Select
                                      style={{ width: 120, left: 16 }}
                                      onChange={v => {
                                        this.setState({type:v});
                                      }}
                                      value={this.state.type}
                                    >
                                      <Select.Option value={'一般施工'}>一般施工</Select.Option>
                                      <Select.Option value={'特种作业'}>特种作业</Select.Option>
                            </Select>
                          </div>
                          <Button
                            onClick={()=>{
                              this.setState({
                                loading:false,
                                stDate:null,
                                edDate:null,
                                type:null,
                                cms:``
                              })
                            }}
                          >
                            重置
                          </Button>
                          <Button type={'primary'}
                            onClick={()=>{
                              this.getData();
                            }}
                          >
                            搜索
                          </Button>
                          <Button
                                      onClick={() => {
                                        this.jump();
                                      }}
                                    >
                                      新增
                          </Button>
                        </div>
                    );
                  }}
                  customRowBtns={[
                    record => {
                      return (
                        <Button
                          style={{ width: '104px' }}
                          onClick={() => {
                            this.showRecord(record);
                            this.setState({
                              printModal: true,
                              isPrint: true
                            });
                          }}
                        >
                          查阅
                        </Button>
                      );
                    }
                  ]}
                />
          </div>
        </Spin>
      </div>
    );
  }
}

export default ConstructionList;
