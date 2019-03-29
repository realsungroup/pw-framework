import React from 'react';
import { Button, Icon, Input, Select, Tag } from 'antd';
import './MyQuery.less';
import QueryTable from '../QueryTable';
import Paging from '../Paging'
const Option = Select.Option;
const CheckableTag = Tag.CheckableTag;
class MyQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  render() {
    return (
      <div className="query">
        <div className="query-top">
          <Button type="primary" shape="round" href="..">
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
          <Button type="primary" shape="round">
            管理文件夹
          </Button>
          <Tag className="personalTags" size="lagre">
            全部
          </Tag>
          <Tag className="personalTags" size="lagre">
            离职原因调查
          </Tag>
          <Tag className="personalTags" size="lagre">
            满意度调查
          </Tag>
          <Tag className="personalTags" size="lagre" selected>
            其他
          </Tag>
          <Tag className="personalTags" size="lagre" color="#108ee9">
            选中的标签
          </Tag>
        </div>
        <QueryTable/>
        <Paging/>
      </div>
    );
  }
}

export default MyQuery;
