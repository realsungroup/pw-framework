import React from 'react';
import http from 'Util20/api';
import { Icon, Input, Button, Modal, Upload, message } from 'antd';
import './AddOrgByImportExcel.less';
import TableData from 'Common/data/TableData';
import XLSX from 'xlsx';

const { Dragger } = Upload;
const { TextArea } = Input;

class AddOrgByImportExcel extends React.Component {
  constructor(props) {
    super();
    this.state = {
      title: '',
      describe: '',
      fileList: [],
      modifyRecord: null,
      doorsTableKey: 0
    };
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
  }

  /**
   * 上传文件并解析
   * @param {Object} e
   */
  readWorkbookFromLocalFile = info => {
    const file = info.file.originFileObj;
    const reader = new FileReader();
    const ctx = this;
    const { title, describe } = ctx.state;
    const importData = [];
    reader.onload = function(e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      message.success('选择文件成功');
      // 只读取 sheet1 中的 excel 数据
      ctx._sheet1 = workbook.Sheets[workbook.SheetNames[0]];
      var sheetJson = XLSX.utils.sheet_to_json(ctx._sheet1);
      console.log(sheetJson);
      importData = sheetJson.map(item => {
        return {
          groupId: title,
          name: item.姓名,
          jobNo: item.工号,
          org: item.所属组织
        };
      });
    };
    console.log(importData);
    return;
    let taskId = '';
    try {
    } catch (error) {
      message.fail(`数据上传异常${error.message}`);
      console.log(error.message);
    }
  };

  render() {
    const { title, describe, fileList } = this.state;
    const { visible, onCancel, onOk } = this.props;
    return (
      <div>
        <Modal width={1180} visible={visible} onCancel={onCancel} onOk={onOk}>
          <div>
            <div className="l-info">
              <h2>基本信息</h2>
              <div className="modal-text">
                <h4>人员分组名称</h4>
                <Input
                  style={{ width: '400px', marginBottom: '64px' }}
                  value={title}
                  onChange={e => {
                    this.setState({
                      title: e.target.value
                    });
                  }}
                ></Input>
              </div>
              <div className="modal-text">
                <h4>描述</h4>
                <TextArea
                  style={{ width: '400px', marginBottom: '64px' }}
                  value={describe}
                  onChange={e => {
                    this.setState({
                      describe: e.target.value
                    });
                  }}
                ></TextArea>
              </div>
            </div>

            <Dragger
              name="file"
              fileList={fileList}
              onChange={this.readWorkbookFromLocalFile}
            >
              <p>点击或拖拽文件到此区域</p>
            </Dragger>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AddOrgByImportExcel;
