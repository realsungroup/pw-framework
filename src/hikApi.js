import axios from 'axios';

const hikApiBaseURL = window.pwConfig[process.env.NODE_ENV].hikApiBaseURL;

const hikInstance = axios.create({
  baseURL: hikApiBaseURL
});

// 请求拦截
hikInstance.interceptors.request.use(
  function(config) {
    // 请求头加上 token
    // const accessToken = globalStorage.getItem('hikAccessToken');
    // if (accessToken) {
    //   config.headers.accessToken = accessToken;
    // }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// 响应拦截
hikInstance.interceptors.response.use(
  function(response) {
    const res = response.data;

    if (res && res.error === 0) {
      return res;
    } else {
      throw new Error(res.message);
    }
  },
  function(error) {
    return Promise.reject(error);
  }
);

/**
 * 获取根区域信息
 */
export const getRootRegion = async params => {
  return hikInstance.get('/api/v1/getRootRegion');
};
