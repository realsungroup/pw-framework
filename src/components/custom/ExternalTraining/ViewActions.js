import React from 'react';
import { Button, message, Modal, Card, Row, Col, Rate ,Input} from 'antd';
import { TableData } from '../../common/loadableCommon';
import http from 'Util20/api';

const courseDetailId = '615054661547';

class ViewActions extends React.Component {
  state = {
    viewActionsVisible: false,
    selectedCourseArrangmentDetail: {},
    baoxiaodan:false,
    baoxiaodanData:[],
    planView: [],
    shijifeiyongData:'',
    // 内训评分
    rate: {
      rate1: null,
      rate2: null,
      rate3: null,
      rate4: null,
      rate5: null,
      rate6: null,
      rate7: null,
      rate8: null
    },
    //外训评分
    rateOut: {
      rate1: null,
      rate2: null,
      rate3: null,
      rate4: null
    },
    knowledge: [''],
    plans: ['']
  };

  //获取反馈与行动计划
  getFeebackAndRate = async () => {
    const { rate, rateOut, selectedCourseArrangmentDetail } = this.state;
    let res;
    try {
      //获取课程反馈
      res = await http().getTable({
        resid: 478367996508,
        cmswhere: `C3_478368118696 =${selectedCourseArrangmentDetail.CourseArrangeDetailID}`
      });
    } catch (err) {
      message.error(err.message);
      console.log(err.message);
    }
    if (res.data.length > 0) {
      if (res.data[0].C3_615639406401 === '外训') {
        const tempRateOut = { ...rateOut };
        tempRateOut.rate1 = res.data[0].C3_478370015482; //机构服务满意度
        tempRateOut.rate2 = res.data[0].C3_478370045169; //讲师满意度
        tempRateOut.rate3 = res.data[0].C3_615580966131; //内容关联度
        tempRateOut.rate4 = res.data[0].C3_478370100284; //是否推荐同事参加考试课程
        this.setState({
          rateOut: tempRateOut
        });
      } else {
        const tempRate = { ...rate };
        tempRate.rate1 = res.data[0].C3_615639978971; //讲师备课充分
        tempRate.rate2 = res.data[0].C3_615640010121; //我认为课程主题准确，结构清晰，内容充实
        tempRate.rate3 = res.data[0].C3_615640043869; //所学的内容对实际工作有很大帮助
        tempRate.rate4 = res.data[0].C3_615640107592; //讲师语言表达能力好,讲解清楚生动,运用肢体语言
        tempRate.rate5 = res.data[0].C3_615640157603; // 讲师能够引入实际案例和例证,讲解透彻,激发学员思考
        tempRate.rate6 = res.data[0].C3_615640180269; //我能够积极参与到课堂中去
        tempRate.rate7 = res.data[0].C3_615640206802; //我的提问能够得到讲师认真,满意的答复
        tempRate.rate8 = res.data[0].C3_615640235456; //时间控制合理使我感到舒适
        this.setState({
          rate: tempRate
        });
      }
    }
    let res2; //行动计划
    try {
      res2 = await http().getTable({
        resid: 615571557694,
        cmswhere: `courseArrange =${selectedCourseArrangmentDetail.CourseArrangeDetailID}`
      });
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
    if (res.data.length > 0) {
      let knowledge = res2.data[0].knowledge1.split(';'); //知识点
      let plans = res2.data[0].action1.split(';'); //行动计划
      this.setState({
        planView: res2.data,
        knowledge,
        plans
      });
    } else {
      this.setState({
        planView: [],
        knowledge: [],
        plans: []
      });
    }
  };
  // 获取实际费用
  getFeiyong=async(id)=>{
    this.setState({loading:true,feiyongID:id});
    try{
      let res= await http().getTable({
        resid: 613940032707,
        cmswhere: `CourseArrangeDetailID = '${id}'`
      });
      console.log('shijifeiy',res)
      if(res.data){
        let shiji=res.data[0].C3_614962974343||0;
        this.setState({shijifeiyongData:shiji});
      }

    this.setState({loading:false});
    }catch(e){
      console.log(e.message);
    this.setState({loading:false});
      message.error(e.message)
    }
}
// 修改实际费用
modiShijifeiyong=async()=>{
  this.setState({loading:true});
  try{
    let res= await http().modifyRecords({
      resid: 613940032707,
      data:[{
        REC_ID:this.state.feiyongID,
        C3_614962974343:this.state.shijifeiyongData
      }]
    });
  this.setState({loading:false,shijifeiyong:false});
  message.success('修改成功！')
  }catch(e){
    console.log(e.message);
  this.setState({loading:false});
    message.error(e.message)
  }
}

//获取发票

getFapiao = async(id)=>{
  let res;
  this.setState({loading:true});
  try{
    res =  await http().getTable({
      resid:656586685332,
      cmswhere:`recordId = '${id}'`
    })
  this.setState({loading:false,baoxiaodanData:res.data});
  }catch(e){
    message.error(e.message);
    this.setState({loading:false})
  }
}

  /**
   * 关闭模态窗
   */
  handleCloseModal = () => {
    this.setState({
      viewActionsVisible: false,
      selectedCourseArrangmentDetail: {},
      planView: [],
      knowledge: [],
      plans: [],
      // 内训评分
      rate: {
        rate1: null,
        rate2: null,
        rate3: null,
        rate4: null,
        rate5: null,
        rate6: null,
        rate7: null,
        rate8: null
      },
      //外训评分
      rateOut: {
        rate1: null,
        rate2: null,
        rate3: null,
        rate4: null
      }
    });
  };

  render() {
    return (
      <div style={{ flex: 1 ,height:'calc(100vh - 64px'}}>
        <TableData
          resid={courseDetailId}
          // subtractH='220px'
          hasAdd={false}
          hasRowView={false}
          hasModify={false}
          hasDelete={false}
          hasRowSelection={true}
          hasRowDelete={false}
          hasRowModify={false}
          subtractH={300}
          // height="calc(100vh - 64px)"
          recordFormType="drawer"
          hasBeBtns={true}
          customRowBtns={[
            record => {
              return (
                <>
                <Button
                  onClick={() => {
                    this.setState(
                      {
                        viewActionsVisible: true,
                        selectedCourseArrangmentDetail: record
                      },
                      this.getFeebackAndRate
                    );
                  }}
                >
                  查看
                </Button>
                <Button
                      onClick={
                        ()=>{
                          this.setState({
                            baoxiaodanData:[],
                            baoxiaodan:true
                          });
                          this.getFapiao(record.CourseArrangeDetailID);
                        }
                      }
                    >
                      查看报销发票
                    </Button>
                    <Button
                      onClick={
                        ()=>{
                          this.getFeiyong(record.REC_ID);
                          this.setState({
                            shijifeiyongData:'',
                            shijifeiyong:true
                          })
                        }
                      }
                    >
                      修改实际费用
                    </Button>
                </>
              );
            }
          ]}
          // cmswhere={`C3_614184177086 = '${selectedCourseArrangment.CourseArrangeID}'`}
        />
        <Modal
         title="修改实际费用"
         visible={this.state.shijifeiyong}
         footer={
           <>
            <Button onClick={()=>{this.setState({shijifeiyong:false})}}>
               取消
              </Button>
             <Button type='primary' onClick={()=>{this.modiShijifeiyong()}} loading={this.state.loading}>
               确定
              </Button>
            </>
         }
         
         width="400px"
         destroyOnClose
          onCancel={
           ()=>{
             this.setState({shijifeiyong:false})
           }
         }
        >
          <span>实际费用：</span>
          <Input style={{marginTop:'.5rem'}} value={this.state.shijifeiyongData} onChange={(v)=>{this.setState({shijifeiyongData:v.target.value})}} disabled={this.state.loading}/>
          
        </Modal>
        <Modal
         title="查看报销发票"
         visible={this.state.baoxiaodan}
         footer={null}
         width="400px"
         destroyOnClose
         onCancel={
           ()=>{
             this.setState({baoxiaodan:false})
           }
         }
        >
          <ul>
            {this.state.baoxiaodanData.map((item,key)=>{
              return(
                <li>
                  <a target="_blank" href={item.filePath} key={key}>{item.fileName}</a>
                </li>
              )
            })}
          </ul>
        </Modal>
        <Modal
          title="查看反馈和行动计划"
          visible={this.state.viewActionsVisible}
          onCancel={this.handleCloseModal}
          onOk={this.handleCloseModal}
          width="70%"
          destroyOnClose
        >
          <Card type="inner" title="讲师专业水平" className="cardinner">
            <Row>
              <Col span={12}>培训机构服务满意度</Col>
              <Col span={12}>
                <Rate value={this.state.rateOut.rate1} disabled />
              </Col>
            </Row>
            <Row>
              <Col span={12}>培训讲师满意度</Col>
              <Col span={12}>
                <Rate value={this.state.rateOut.rate2} disabled />
              </Col>
            </Row>
            <Row>
              <Col span={12}>培训内容和工作内容关联度</Col>
              <Col span={12}>
                <Rate value={this.state.rateOut.rate3} disabled />
              </Col>
            </Row>
            <Row>
              <Col span={12}>是否推荐同事参加该课程</Col>
              <Col span={12}>
                <Rate value={this.state.rateOut.rate4} disabled />
              </Col>
            </Row>
          </Card>
          <Card title="行动计划" style={{ marginTop: 10 }}>
            <Row>
              <div>
                <ul className="feedbackList">
                  <li>列出培训中学习到的3个知识点</li>
                  {this.state.knowledge.map((item, index) => {
                    return (
                      <li key={index}>
                        <rect>{index + 1}</rect>
                        <p>{item}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Row>
            <Row>
              <div>
                <ul className="feedbackList">
                  <li>
                    行动计划
                    <br />
                    (运用学到的知识，你可以改善工作中的哪些行为或问题？请列出具体行为。
                    )
                  </li>
                  {this.state.plans.map((item, index) => {
                    return (
                      <li key={index}>
                        <rect>{index + 1}</rect>
                        <p>{item}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Row>
          </Card>
        </Modal>
      </div>
    );
  }
}

export default ViewActions;
