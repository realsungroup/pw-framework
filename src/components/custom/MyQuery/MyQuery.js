import React from 'react';
import { Button, Icon, Input, Select, Tag, Modal } from 'antd';
import './MyQuery.less';
import QueryTable from '../QueryTable';
import TableData from '../../common/data/TableData';
import Paging from '../Paging';
const Option = Select.Option;
const CheckableTag = Tag.CheckableTag;
class MyQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wid:300
    };
  }
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  delFloder = ()=>{
     alert("你确定要删除整个文件夹么")
     //这里弹出的框点击后，标签就会自动消失。到时候只需保证用户再次进来的时候这个文件夹不存在就好了。
  };
  render() {
    return (
      <div className="query">
        <div className="query-top">
          <Button type="primary" shape="round">
            <Icon type="plus" />
            创建问卷
          </Button>
          <Input.Search
            style={{ width: 480, padding: 10 }}
            defaultValue="请输入问卷名进行搜索..."
          />
          <Select defaultValue="问卷状态" style={{ width: 120 }}>
            <Option value="问卷状态">问卷状态</Option>
            <Option value="运行中">运行中</Option>
            <Option value="已暂停">已暂停</Option>
            <Option value="草稿">草稿</Option>
          </Select>
          <Button type="danger">
            <Icon type="delete" />
            回收站
          </Button>
        </div>
        {/* <hr style={{color:"#e4f0fb"}}/> */}
        <div className="folder">
          <Button
            type="primary"
            shape="round"
            icon="plus"
            onClick={this.showModal}
          >
            新建文件夹
          </Button>
          <Modal
            title="新建文件夹"
            // borderstyle= {color}
            width={this.state.wid}
            visible={this.state.visible}
            onCancel={this.handleCancel}
          >
            <label>文件夹名称:</label>
            <Input />
          </Modal>
          <Tag className="personalTags" size="large">
            全部
          </Tag>
          <Tag className="personalTags" size="large">
            离职原因调查
          </Tag>
          <Tag   closable onClose={this.delFloder} className="personalTags" size="large">
            满意度调查
          </Tag>
          <Tag className="personalTags" size="large">
            其他
          </Tag>
          <Tag className="personalTags" size="large" color="#108ee9">
            选中的标签
          </Tag>
        </div>
        <QueryTable />
        <Paging />
      </div>
    );
  }
}

export default MyQuery;
