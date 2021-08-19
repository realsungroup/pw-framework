import React from 'react';
import './PhotoCollectModal.less';
import { Modal, Icon, message } from 'antd';
import { defaultPhoto } from './constants';
import uploadPng from './assets/upload.png';
import takePhotoPng from './assets/take-photo.png';
import { validatePersonPhoto } from 'Util20/hikDataSyncApi';
import * as blobUtil from 'blob-util';
import Compressor from 'compressorjs';

async function getBase64(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      resolve(reader.result);
    };
    reader.onerror = function(error) {
      reject(error);
    };
  });
}

const dealBase64 = base64 => {
  return base64.replace('data:image/jpeg;base64,', '');
};

class PhotoCollectModal extends React.Component {
  state = {
    imgUrl: '', // 上传后人脸照片的地址
    takePictureVisible: false,
    takePictureStatus: 'ing', // 拍照状态：'ing' 表示正在拍（未拍）| 'end' 表示已拍
    imgDataURL: '', // 拍照得到的图片的 base64
    takePictureOkText: '拍照', // 可选值：'拍照' | '上传'
    takePictureCancelText: '取消' // 可选值：'取消' | '重拍'
  };

  handleFileChange = async e => {
    const file = e.target.files[0];
    const size = file.size / 1024;
    if (size >= 200 || size <= 10) {
      return message.error('图片文件大小范围为： 10KB~200KB');
    }
    this.handleUploadFile(file);
  };

  handleUploadFile = async file => {
    const promise = new Promise((resolve, reject) => {
      const url = window.pwConfig[process.env.NODE_ENV].uploadPersonPhotoURL;
      let fd = new FormData();
      fd.append('file', file, file.name);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        if (xhr.status === 200 && (data.error === 0 || data.error === '0')) {
          let imgUrl;
          imgUrl = data.httpfilename;
          resolve(imgUrl);
        } else {
          reject(data);
        }
      };
      xhr.send(fd);
    });

    let imgUrl = '';
    try {
      imgUrl = await promise;
    } catch (err) {
      return message.error(err.message);
    }
    if (imgUrl) {
      this.setState({ takePictureStatus: 'ing' }, () => {
        this.handleEndTakePicture();
        this.setState({ imgUrl });
      });
    }
  };

  handleStartTakePicture = () => {
    this.setState(
      {
        takePictureVisible: true,
        takePictureOkText: '拍照',
        takePictureCancelText: '取消',
        takePictureStatus: 'ing'
      },
      () => {
        setTimeout(() => {
          this.playVideo();
        }, 0);
      }
    );
  };

  playVideo = async () => {
    this.videoNode = document.querySelector(`#photo-collect-modal__video`);

    console.log({ videoNode: this.videoNode });
    const videoConstraints = { width: 390, height: 520 };
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: videoConstraints
      });
      this.videoNode.srcObject = this.stream;
      this.videoNode.play();
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  };

  handleEndTakePicture = () => {
    const { takePictureStatus } = this.state;

    console.log({ takePictureStatus });
    // 点击了重拍
    if (takePictureStatus === 'end') {
      this.handleStartTakePicture();

      // 点击了取消
    } else {
      try {
        this.videoNode = null;
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
        this.canvas = null;
      } catch (err) {
        console.error(err);
      }

      this.setState({
        takePictureVisible: false,
        takePictureOkText: '拍照',
        takePictureCancelText: '取消'
      });
    }
  };

  handleTakePicture = async () => {
    const { takePictureStatus, imgDataURL } = this.state;

    // 点击了拍照
    if (takePictureStatus === 'ing') {
      this.canvas = document.createElement('canvas');
      const context = this.canvas.getContext('2d');
      this.canvas.width = 195;
      this.canvas.height = 260;
      context.drawImage(
        this[`videoNode`],
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      this.setState({
        imgDataURL: this.canvas.toDataURL('image/jpg', 0.5),
        takePictureStatus: 'end',
        takePictureOkText: '上传',
        takePictureCancelText: '重拍'
      });

      // 停止
      this.videoNode = null;
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      this.canvas = null;

      // 点击了上传
    } else {
      let blob;
      try {
        blob = blobUtil.dataURLToBlob(imgDataURL);
      } catch (err) {
        console.error(err);
        return message.error(err.message);
      }

      const fileName = Math.floor(new Date().getTime() / 1000);
      const file = new File([blob], fileName, {
        type: 'image/jpg'
      });

      this.handleUploadFile(file);
    }
  };

  renderTakePictureContent = () => {
    const { takePictureStatus, imgDataURL } = this.state;

    if (takePictureStatus === 'ing') {
      return (
        <video
          id={`photo-collect-modal__video`}
          autoPlay
          muted
          style={{ display: 'block', width: 390, height: 520 }}
        />
      );
    }

    return (
      <img
        src={imgDataURL}
        style={{ display: 'block', width: 390, height: 520 }}
      />
    );
  };

  render() {
    const { personRecord } = this.props;
    const {
      takePictureVisible,
      takePictureOkText,
      takePictureCancelText,
      imgUrl
    } = this.state;
    return (
      <Modal
        visible
        title="正面免冠照"
        className="photo-collect-modal"
        destroyOnClose
      >
        <div className="photo-collect-modal__tip">
          <Icon
            type="info-circle"
            theme="twoTone"
            className="photo-collect-modal__info"
          />
          <span>照片可用于制卡打印和人脸应用。</span>
        </div>
        <div className="photo-collect-modal__body">
          <div>
            默认组织/沪东{' '}
            <span className="photo-collect-modal__name">
              {personRecord.name}
            </span>
          </div>
          <img
            src={imgUrl || personRecord.photo || defaultPhoto}
            className="photo-collect-modal__img"
          ></img>

          <div className="photo-collect-modal__btns-wrapper">
            <div className="photo-collect-modal__btn photo-collect-modal__upload-btn">
              <input
                className="photo-collect-modal__btn photo-collect-modal__file-input"
                type="file"
                onChange={this.handleFileChange}
                accept="image/jpeg"
                onClick={event => {
                  event.target.value = null;
                }}
              ></input>
              <img
                className="photo-collect-modal__upload-img"
                src={uploadPng}
              ></img>
              <span>上传</span>
            </div>
            <div
              className="photo-collect-modal__btn"
              onClick={() => {
                this.setState({ takePictureVisible: true }, () => {
                  setTimeout(() => {
                    this.handleStartTakePicture();
                  }, 500);
                });
              }}
            >
              <img
                className="photo-collect-modal__take-photo-img"
                src={takePhotoPng}
              ></img>
              <span>采集</span>
            </div>
          </div>
          <div className="photo-collect-modal__desc-wrapper">
            <div className="photo-collect-modal__desc">
              请上传或采集正面免冠照，露出眼睛和眉毛；
            </div>
            <div className="photo-collect-modal__desc">
              图片文件支持 .jpg 格式
            </div>
            <div className="photo-collect-modal__desc">
              图片文件大小 10KB~200KB
            </div>
          </div>

          <Modal
            visible={takePictureVisible}
            title="拍照"
            width={440}
            height={260}
            onCancel={this.handleEndTakePicture}
            okText={takePictureOkText}
            cancelText={takePictureCancelText}
            onOk={this.handleTakePicture}
            maskClosable={false}
          >
            {this.renderTakePictureContent()}
          </Modal>
        </div>
      </Modal>
    );
  }
}

export default PhotoCollectModal;
