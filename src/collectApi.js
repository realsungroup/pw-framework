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

/**
 * 通过任务编号运行采集任务
 */
export const runCollectDataTaskByTaskId = (
  taskId,
  receiveStartTime,
  receiveEndTime
) => {
  return collectInstance.post('/api/v1/runCollectDataTaskByTaskId', {
    taskId,
    receiveStartTime,
    receiveEndTime
  });
};

/**
 * 获取通过任务编号运行的任务是否正在运行
 */
export const collectDataTaskByTaskIdIsRun = taskId => {
  return collectInstance.post('/api/v1/collectDataTaskByTaskIdIsRun', {
    taskId
  });
};

export const getCollectVersion = () => {
  return collectInstance.get('/api/v1/version');
};
