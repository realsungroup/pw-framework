import React, { Component } from 'react';
import './RichTextDemo.less';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { Upload, Button, Icon } from 'antd';
export default class RichTextDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="RichTextDemo__block">
        <Upload  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType='picture'>
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        </Upload>
        {/* <Control></Control> */}
      </div>
    );
  }
}
