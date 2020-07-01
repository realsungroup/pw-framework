import React from 'react';
import { argumentContainer } from '../util';

/**
 * 上传文件
 * @param {file} file 文件
 * @param {string} url 上传的地址
 * @param {string} mode 上传的模式：'local' 本地；'cloud' 云对象存储
 */
export const uploadFile = (file, url, mode) => {
  return new Promise((resolve, reject) => {
    let fd = new FormData();
    fd.append('file', file, file.name);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = () => {
      const data = JSON.parse(xhr.response);
      if (xhr.status === 200 && (data.error === 0 || data.error === '0')) {
        let imgUrl;
        if (mode === 'local') {
          imgUrl = data.httpfilename;
        } else if (mode === 'cloud') {
          imgUrl = data.data;
        }
        resolve(imgUrl);
      } else {
        reject(data);
      }
    };
    xhr.send(fd);
  });
};

function getUploadUrl(uploadConfig, srctype, dblinkname) {
  const { mode, bucketname, url } = uploadConfig;
  // 云对象存储
  if (mode === 'cloud') {
    let newUrl = `${url}api/AliyunOss/PutFilesObject?bucketname=${encodeURIComponent(
      bucketname
    )}&srctype=${encodeURIComponent(srctype)}`;
    if (dblinkname) {
      newUrl += `&dblinkname=${encodeURIComponent(dblinkname)}`;
    }
    return newUrl;

    // 服务器本地存储文件
  } else if (mode === 'local') {
    return url + `&dblinkname=${encodeURIComponent(dblinkname)}`;
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

      handleUploadFile = (file, success, fail, dblinkname, uploadConfig) => {
        // 为什么不用 async/await：https://github.com/ant-design/ant-design/issues/10122
        let formData = new FormData();
        formData.append('file', file, file.name);
        const type = getFileType(file);
        
        let _uploadConfig;
        if (uploadConfig) {
          _uploadConfig = uploadConfig;
        } else {
          _uploadConfig = window.pwConfig[process.env.NODE_ENV];
        }
        
        uploadFile(file, getUploadUrl(_uploadConfig, type, dblinkname), _uploadConfig.mode)
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
