import axios from 'axios';

const collectApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].collectApiBaseURL;

const collectInstance = axios.create({
  baseURL: collectApiBaseURL
});

// 请求拦截
collectInstance.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// 响应拦截
collectInstance.interceptors.response.use(
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
 * 采集刷脸数据
 */
export const collectData = data => {
  return collectInstance.post('/api/v1/collectData', { ...data });
};

/**
 * 采集刷脸数据
 */
export const collectDataProgress = () => {
  return collectInstance.get('/api/v1/collectDataProgress');
};
