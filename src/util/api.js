import http from 'lz-request/lib/lz-request';
import 'lz-request/lib/login';
import 'lz-request/lib/addRecords';
import 'lz-request/lib/getSubTable';
import 'lz-request/lib/getTable';
import 'lz-request/lib/modifyRecords';
import 'lz-request/lib/removeRecords';
import { getItem } from './util';

http.setDefaultBaseURL('http://kingofdinner.realsun.me:8102/');

// 请求拦截
http.setRequestInterceptors(
  function(config) {
    // 请求头加上 token
    const userInfo = JSON.parse(getItem('userInfo'));

    let token = userInfo && userInfo.AccessToken;
    let userCode = userInfo && userInfo.UserCode;
    if (token && userCode) {
      config.headers.accessToken = token;
      config.headers.userCode = userCode;
    }
    return config;
  },
  function(error) {
    return error;
  }
);

// 响应拦截
http.setResponseInterceptors(
  function(response) {
    const res = response.data;
    if (res && (res.error == 0 || res.Error == 0 || res.OpResult === 'Y')) {
      return res;
    } else {
      throw new Error(res.ErrMsg);
    }
  },
  function(error) {
    return error;
  }
);

/**
 * 使 this.setState() 在异步请求中可以取消调用：https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
 * @param {promise} promise 请求对象
 */
export const makeCancelable = promise => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
    );
  });
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  };
};

// 获取后端定义的按钮
http.createApi('getBeBtns', {
  method: 'get',
  url: 'api/menu/GetButton'
});

export default http;
