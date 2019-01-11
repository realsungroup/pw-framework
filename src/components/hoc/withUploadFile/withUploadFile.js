import React from 'react';
import { argumentContainer } from '../util';
import { message } from 'antd';

// 上传文件
export const uploadFile = (file, url) => {
  return new Promise((resolve, reject) => {
    let fd = new FormData();
    fd.append('file', file, file.name);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = () => {
      var data = JSON.parse(xhr.response);
      if (xhr.status === 200) {
        var imgUrl = data.httpfilename;
        resolve(imgUrl);
      } else {
        reject(data);
      }
    };
    xhr.send(fd);
  });
};

// 带有上传功能的高阶组件
const withUploadFile = (options = {}) => {
  const { url } = options;

  return function withUploadFile(WrappedComponent) {
    class withUploadFile extends React.Component {
      constructor(props) {
        super(props);
        this._url = url;
      }

      handleUploadFile = (fileInfo, callback, url = this._url) => {
        const file = fileInfo.file;
        // 为什么不用 async/await：https://github.com/ant-design/ant-design/issues/10122
        uploadFile(file, url)
          .then(fileUrl => {
            callback(null, fileUrl);
          })
          .catch(err => {
            callback(err);
          });
      };

      render() {
        return (
          <WrappedComponent
            {...this.props}
            uploadFile={this.handleUploadFile}
          />
        );
      }
    };

    return argumentContainer(
      withUploadFile,
      WrappedComponent,
      'withUploadFile'
    );
  };
};

export default withUploadFile;
