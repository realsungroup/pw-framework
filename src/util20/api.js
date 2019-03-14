import http from 'lz-request/lib/http';

import { getItem } from './util';

const baseURL = window.pwConfig[process.env.NODE_ENV].baseURL;
http.setDefaultBaseURL(baseURL);

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
    if (
      (res &&
        (res.error === 0 ||
          res.error === '0' ||
          res.Error === 0 ||
          res.Error === '0' ||
          res.OpResult === 'Y')) ||
      res === 'ok'
    ) {
      return res;
    } else {
      throw new Error(res.ErrMsg || res.message || res.ErrorMsg);
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

/**
 * 获取后端按钮
 */
http.createApi('getBeBtns', {
  method: 'get',
  url: 'api/menu/GetButton'
});

/**
 * 后端按钮点击发送的请求（修改字段）
 * 参数：{ resid, recids, strCommand }
 * 1. resid：表资源 id
 * 2. recids：记录 id 以逗号分隔的字符串
 * 3. strCommand：后端按钮所带信息的 Code 参数
 */
http.createApi('dealButton', {
  method: 'get',
  url: 'api/menu/DealButton'
});

/**
 * 获取窗体数据
 * 参数：{ resid, formname }
 * 1. resid：表资源 id
 * 2. formname：窗体名称
 */
http.createApi('getFormData', {
  method: 'get',
  url: 'api/100/table/RetrieveFormDefine'
});

/**
 * 导出表格数据
 * 参数：{ resid, cmswhere, filetype = 'xls' }
 * 1. resid：表资源 id
 * 2. cmswhere：查询条件
 * 3. filetype：导出文件格式（'xls'）
 */
http.createApi('exportTableData', {
  method: 'get',
  url: 'api/100/table/ExportTableData'
});

/**
 * 导出表格数据
 * 参数：{ resid }
 * 1. resid：表资源 id
 */
http.createApi('getImportConfigs', {
  method: 'get',
  url: 'api/Resource/GetImportConfigs'
});

/**
 * 导入数据服务
 * 参数：{ ImportTaskId, cmd }
 * 1. ImportTaskId：任务 id
 * 2. cmd：数据服务类型：'GetImportStatus' 获取实时状态；'PauseImport' 暂停；'ResumeImport' 恢复；'TerminateImport' 终止
 */
http.createApi('importingService', {
  method: 'get',
  url: 'api/Resource/ImportingService'
});

/**
 * 获取提醒数据
 * 参数：无
 */
http.createApi('getReminderData', {
  method: 'get',
  url: 'api/Resource/RetrieveDataOfHasReminder'
});

/**
 * 获取 OrgChart 所需的节点
 */
http.createApi('getNodesData', {
  method: 'post',
  url: '/api/OrgChart/GetNodesData'
});

/**
 * 获取移动后的节点
 */
http.createApi('getMoveNodes', {
  method: 'post',
  url: '/api/OrgChart/GetMoveNodesData'
});

/**
 * 默认登录
 * 参数：{ Code, Password }
 * 1. Code：用户名
 * 2. Password：密码
 */
http.createApi('defaultLogin', {
  method: 'post',
  url: '/api/Account/Login'
});

/**
 * 域登录
 * 参数：{ code, password, domain, domainUserField, loginMethod = 'domain' }
 * 1. code：用户名
 * 2. password：密码
 * 3. domain：域
 * 4. domainUserField：域用户字段
 * 5. loginMethod：登录方式（值确定为 'domain'）
 */
http.createApi('domainLogin', {
  method: 'post',
  baseURL: window.pwConfig[process.env.NODE_ENV].domainLoginConfig.baseUrl,
  url: '/api/Account/Login'
});

/**
 * 设置用户语言
 * 参数：{ language }
 * 1. language：语言
 */
http.createApi('setLanguage', {
  method: 'post',
  url: '/api/Account/SaveUserLanguage'
});

/**
 * 获取用户当前应用（必要功能和已选功能）
 * 参数：-
 */
http.createApi('getUserDesktop', {
  method: 'get',
  url: '/api/Resource/RetrieveUserDesktop'
});

export default http;
