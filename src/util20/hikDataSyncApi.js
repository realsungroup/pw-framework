/**
 * 与 hik 平台的接口
 */

import axios from 'axios';

const baseURL = 'http://localhost:7001';

const hikInstance = axios.create({
  baseURL: baseURL
});

// 响应拦截
hikInstance.interceptors.response.use(
  function(response) {
    const res = response.data;
    if (res.error !== 0) {
      throw new Error(res.message);
    }
    return res;
  },
  function(error) {
    return Promise.reject(error);
  }
);

export const validatePersonPhoto = async base64 => {
  return hikInstance({
    method: 'post',
    url: `/api/v1/validatePersonPhoto`,
    data: {
      base64
    }
  });
};
