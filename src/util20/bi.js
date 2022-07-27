import http from 'Util20/api';
import { getAppConfig } from 'Util20/appConfig';

const biConfig = getAppConfig('biConfig');

const loginBiAjax = (userName, password) => {
  return new Promise((resolve, reject) => {
    // ajax 登录 bi 系统
    const { loginURL } = biConfig;
    var url = `${loginURL}?fine_username=${encodeURIComponent(
      userName
    )}&fine_password=${encodeURIComponent(password)}&validity=-1`;
    window.jQuery.ajax({
      url, //单点登录的管理平台报表服务器
      timeout: 5000, //超时时间（单位：毫秒）
      dataType: 'jsonp', //跨域采用jsonp方式
      jsonp: 'callback',
      success: (res) => {
        if (res.errorCode) {
          reject(res.errorMsg || res.errorCode);
        } else {
          resolve();
        }
      },
      error: function() {
        reject('超时或服务器其他错误');
      },
    });
  });
};

export const biLogin = async (params) => {
  if (!biConfig.open) {
    return;
  }

  const { userName, password, isGetUserNameAndPassword } = params || {};

  if (!isGetUserNameAndPassword && (!userName || !password)) {
    throw new Error(
      'isGetUserNameAndPassword 为 false 时，userName 和 password 为必传的参数'
    );
  }
  let _userName = userName,
    _password = password;
  if (isGetUserNameAndPassword) {
    const res = await http().getUserPass();
    const { UserCode, Data } = res || {};
    if (!UserCode || !Data) {
      throw new Error('UserCode 或 Data 为空');
    }
    _userName = UserCode;
    _password = Data;
  }
  await loginBiAjax(_userName, _password);
};

export const biLogout = async () => {
  const { logoutURL, open } = biConfig;
  if (!open) {
    return;
  }
  return new Promise((resolve, reject) => {
    window.jQuery.ajax({
      url: logoutURL, //单点登录的报表服务器
      dataType: 'jsonp', //跨域采用jsonp方式
      jsonp: 'callback',
      timeout: 5000, //超时时间（单位：毫秒）
      success: (data) => {
        if (data.status === 'success') {
          resolve();
        } else {
          reject(data.errorMsg);
        }
      },
      error: () => {
        reject('登出失败（超时或服务器其他错误）');
      },
    });
  });
};
