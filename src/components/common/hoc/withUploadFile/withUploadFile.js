import React from 'react';
import { argumentContainer } from '../util';

// 上传文件的高阶组件
export const uploadFile = (file, url) => {
  return new Promise((resolve, reject) => {
    let fd = new FormData();
    fd.append('file', file, file.name);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = () => {
      const data = JSON.parse(xhr.response);
      if (xhr.status === 200 && (data.error === 0 || data.error === '0')) {
        const imgUrl = data.data;
        resolve(imgUrl);
      } else {
        reject(data);
      }
    };
    xhr.send(fd);
  });
};

function getUploadUrl(uploadConfig, srctype) {
  const { mode, bucketname, url } = uploadConfig;
  // 云对象存储
  if (mode === 'cloud') {
    return `${url}api/AliyunOss/PutOneImageObject?bucketname=${encodeURIComponent(
      bucketname
    )}&srctype=${encodeURIComponent(srctype)}
    `;

    // 服务器本地存储文件
  } else if (mode === 'local') {
    return url;
  } else {
    alert(`window.pwConfig.${process.env.NODE_ENV}.upload.mode 设置有误`);
  }
}

function getFileType(file) {
  return file.type.split('/')[1];
}

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
        const type = getFileType(file);

        const { upload } = window.pwConfig[process.env.NODE_ENV];
        uploadFile(file, getUploadUrl(upload, type))
          .then(fileUrl => {
            success && success(fileUrl);
          })
          .catch(err => {
            fail && fail(err);
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
    }

    return argumentContainer(
      withUploadFile,
      WrappedComponent,
      'withUploadFile'
    );
  };
};

export default withUploadFile;
