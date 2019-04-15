import React, { Component } from 'react';
import './QuerySet.less';
import {
  Modal,
  Input,
  Button,
  Select,
  Tabs,
  Radio,
  Checkbox,
  Upload,
  Icon
} from 'antd';
import Choice from '../Choice';
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class QuerySet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wid: 600,
      title: '2019年满意度调查',
      radiovalue: ''
      // loading: false,
    };
  }
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  addSingle = () => {
    this.setState({
      visible2: true
    });
  };
  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };
  handleOk2 = e => {
    console.log(e);
    this.setState({
      visible2: false
    });
  };

  handleCancel2 = e => {
    console.log(e);
    this.setState({
      visible2: false
    });
  };
  showTabs = key => {
    console.log(key);
  };
  radioChange = e => {
    this.setState({
      radiovalue: e.target.value
    });
  };
  render() {
    return (
      <div className="queryset">
        <div className="queryHeader" onClick={this.showModal}>
          <h1>2019年满意度调查</h1>
          <div>
            试卷说明的内容
          </div>
          {/* <div className='prasered'>
            133******6758刚领到##礼品一份
          </div>
          <div>该问卷已经关闭</div> */}
        </div>
        <Choice />
        <Choice />
        <Choice />
        <Modal
          title="外观&说明&礼品"
          visible={this.state.visible}
          okText="保存"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={this.state.wid}
          cancelText='取消'
        >
          <label>标题</label>
          <Input />
          <label>说明</label>
          <TextArea />
          <label>外观</label>
          {/* <Upload name="avatar" action="//jsonplaceholder.typicode.com/posts/" className="avatar-uploader"></Upload> */}
          <div className="upload">
            <Icon type="plus" />
          </div>
          <label>礼品设置</label>
          <div>
            <RadioGroup>
              <Radio value={1}>礼品份数:<Input style={{width:30,height:20}}></Input><span className='prasetip'>份</span></Radio>
              <Radio value={2}>中奖率:<Input style={{width:30,height:20}}></Input><span className='prasetip'>%</span></Radio>
            </RadioGroup>
          </div>
        </Modal>
        <div className="addStyle">
          <Button>导入添加题目</Button> }
          <Button type="primary">提交</Button>
          <Button onClick={this.addSingle}>单独添加题目</Button>
          <Modal
            title="单独添加"
            visible={this.state.visible2}
            onOk={this.handleOk2}
            onCancel={this.handleCancel2}
            okText="确定"
            cancelText='取消'
            width={this.state.wid}
          >
            <Tabs defaultActiveKey="1" onChange={this.showTabs}>
              <TabPane tab="单选题" key="1">
                <div><Input placeholder='这里是题干'/></div>
                <RadioGroup
                  onChange={this.radioChange}
                  value={this.state.value}
                  style={{marginTop: 10}}
                >
                <ul>
                 <li> <Radio className='raio' value={1}>
                    <Input placeholder="输入选项内容" />
                    <Button icon='delet'>删除</Button>
                  </Radio></li>
                
                  <li> <Radio className='raio' value={2}>
                    <Input placeholder="输入选项内容" />
                    <Button icon='delet'>删除</Button>
                  </Radio></li>
                 
                  <li> <Radio className='raio' value={3}>
                    <Input placeholder="输入选项内容" />
                    <Button icon='delet'>删除</Button>
                  </Radio></li>
                 
                  <li> <Radio className='raio' value={4}>
                    <Input placeholder="输入选项内容" />
                    <Button icon='delet'>删除</Button>
                  </Radio></li>
                  </ul>
                </RadioGroup>
                <div className='addchoice'>
                <Button icon='plus' type='primary'>添加选项</Button>
                <Button icon='plus' type='primary'>添加可填写选项</Button>
                </div>
              </TabPane>
              <TabPane tab="多选题" key="2">
                <div><Input placeholder="输入题干"/></div>
                <CheckboxGroup>
                  <ul className='multichoice'>
                  <li className='checklee'><Checkbox style={{width: 20,height: 30,}} className='checkbox'></Checkbox><Input className='checkbox' style={{height:30,width:420,borderRadius:0}}placeholder="输入选项内容"/>
                  <Button>删除</Button>
                  </li>
                  <li className='checklee'><Checkbox style={{width: 20,height: 30,}} className='checkbox'></Checkbox><Input className='checkbox' style={{height:30,width:420,borderRadius:0}}placeholder="输入选项内容"/>
                  <Button>删除</Button>
                  </li>
                  <li className='checklee'><Checkbox style={{width: 20,height: 30,}} className='checkbox'></Checkbox><Input className='checkbox' style={{height:30,width:420,borderRadius:0}}placeholder="输入选项内容"/>
                  <Button>删除</Button>
                  </li>
                  <li className='checklee'><Checkbox style={{width: 20,height: 30,}} className='checkbox'></Checkbox><Input className='checkbox' style={{height:30,width:420,borderRadius:0}}placeholder="输入选项内容"/>
                  <Button>删除</Button>
                  </li>
                  </ul>
                </CheckboxGroup>
                <div className='addchoice'>
                <Button icon='plus'>添加选项</Button>
                <Button icon='plus' type='primary'>添加可填写选项</Button>
                </div>
              </TabPane>
              <TabPane tab="问答题" key="3">
                <div><Input placeholder='这里是题干'/></div>
                <TextArea style={{marginTop:10,}}/>
              </TabPane>
            </Tabs>
          </Modal>
        </div>
      </div>
    );
  }
}

export default QuerySet;
