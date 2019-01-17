import React from 'react';
import { argumentContainer } from '../util';
import http, { makeCancelable } from '../../../util/api';
import axios from 'axios';

// 上传文件的高阶组件
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

      componentWillUnmount = () => {
        this.p1 && this.p1.cancel();
      };

      handleUploadFile = (file, success, fail, url = this._url) => {
        // 为什么不用 async/await：https://github.com/ant-design/ant-design/issues/10122
        let formData = new FormData();
        formData.append('file', file, file.name);
        uploadFile(file, url)
          .then(fileUrl => {
            success && success(fileUrl);
          })
          .catch(err => {
            fail && fail(err);
          });

        // this.p1 = makeCancelable(
        //   http({
        //     baseURL: url
        //   }).uploadFile(formData)
        // );
        // this.p1.promise
        //   .then(data => {
        //     const fileUrl = data.httpfilename;
        //     success && success(fileUrl);
        //   })
        //   .catch(err => {
        //     console.error(err);
        //     fail && fail(err);
        //   });
      };

      render() {
        return (
          <WrappedComponent
            {...this.props}
            uploadFile={this.handleUploadFile}
          />
        );
      }
    }

    return argumentContainer(
      withUploadFile,
      WrappedComponent,
      'withUploadFile'
    );
  };
};

export default withUploadFile;
