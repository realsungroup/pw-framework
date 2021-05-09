import http from 'lz-request/lib/http';

import { getItem } from './util';

const baseURL = window.pwConfig[process.env.NODE_ENV].baseURL;
const enterprisecode = window.pwConfig[process.env.NODE_ENV].enterprisecode;
http.setDefaultBaseURL(baseURL);

// 请求拦截
http.setRequestInterceptors(
  function (config) {
    // 请求头加上 token
    const userInfo = JSON.parse(getItem('userInfo'));

    let token = userInfo && userInfo.AccessToken;
    let userCode = userInfo && userInfo.UserCode;
    if (token && userCode) {
      config.headers.accessToken = token;
      config.headers.userCode = userCode;
      config.headers.enterprisecode = enterprisecode;
      config.headers.badgeno = userCode;
    }
    return config;
  },
  function (error) {
    return error;
  }
);

// 响应拦截
http.setResponseInterceptors(
  function (response) {
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
      if (
        res.Errmsg === 'loginerror' ||
        res.message === 'loginerror' ||
        res.ErrorMsg === 'loginerror'
      ) {
        window.location.href = '/login';
      } else {
        throw new Error(res.ErrMsg || res.message || res.ErrorMsg);
      }
    }
  },
  function (error) {
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
 * 根据dblinkname配置获取提醒数据
 * 参数：无
 */
http.createApi('getReminderDatas', {
  method: 'get',
  url: 'api/Resource/RetrieveDataOfHasReminders'
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
  method: 'get',
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

/**
 * 根据父resid查询下级的子资源记录（查询试卷列表）
 * 参数：parentresid
 */
http.createApi('getUserAppLinks', {
  method: 'get',
  url: 'api/Resource/RetrieveUserAppLinks'
});

/**
 * 获取当前用户综合管理树
 * 参数：{ rootid }
 * 1. rootid：根节点 id
 */
http.createApi('getUserFunctionTree', {
  method: 'get',
  url: '/api/Resource/GetUserFunctionTree'
});

/**
 * 根据 resid 获取资源的子表 id
 * 参数：resid
 */
http.createApi('getResourceRelation', {
  method: 'get',
  url: '/api/Resource/GetResourceRelation'
});

/**
 * 获取用户默认的仪表盘
 */
http.createApi('getDefaultDashboard', {
  method: 'get',
  url: '/api/Resource/GetUserDefaultReport'
});

/**
 * 获取用户所有的默认仪表盘
 */
http.createApi('getUserDefaultDashboards', {
  method: 'get',
  url: '/api/Resource/GetUserDefaultReports'
});

/**
 * 获取字段聚合后的值
 * 参数：{ resid, fields, groupby, cmswhere, orderby, dblink, innStart, intMaxRecords, strTableName, getresourcedata }
 * 1. resid：资源id
 * 2. fields：需要聚合的字段
 * 3. groupby：group by 字段
 * 4. cmswhere：where 语句
 * 5. orderby：排序
 * 6. ...
 */
http.createApi('getFieldAggregateValue', {
  method: 'get',
  url: '/api/100/table/GetDataBySqlParts'
});

/**
 * 根据数据源名称和执行sql语句获取单个值
 * 参数：{ dblink, sql, dblinkname }
 * 1. dblink
 * 2. sql
 * 3. dblinkname
 */
http.createApi('getFieldBySql', {
  method: 'get',
  url: '/api/Resource/GetFieldBySql'
});

/**
 * 获取表格列定义数据
 * 参数：{ resid }
 * 1. resid：资源id
 */
http.createApi('getTableColumnDefine', {
  method: 'get',
  url: '/api/100/table/RetrieveColumnsDefineByArray'
});

/**
 * 保存主表记录以及多张子表记录
 * 参数：{ data }。data 如下
 */
// 如：
// "data": [
//   {
//     "resid": "577814681716", // 主表 id
//     "maindata": { // 主表记录
//       "REC_ID": "585417447165",
//       "C3_577815790581": 80,
//       "C3_577835493318": "10001",
//       "_state": "modified", // 修改
//       "_id": 1
//      },
//     "subdata": [ // 子表数据
//       {
//         "resid": "577816887354", // 子表 id
//         "maindata": { "C3_577887174694": "hantao", "_state": "added", "_id": 1 } // 子表记录
//       }
//     ]
//   }
// ]
http.createApi('saveRecordAndSubTables', {
  method: 'post',
  url: '/api/200/table/Save'
});

http.createApi('postTreeData', {
  method: 'post',
  url: '/api/OrgChart/GetNodesData'
});

http.createApi('getRecordAndSubTables', {
  method: 'get',
  url: '/api/200/table/Retrieve'
});

/**
 * 开始自动导入
 * 参数：{ id }
 * 1. id: id
 */
http.createApi('runAutoImport', {
  method: 'get',
  url: '/api/Resource/RunAutoImport'
});

/**
 * 开始自动导入 post请求
 * 参数：{ id }
 * 1. id: id
 */
http.createApi('PostRunAutoImport', {
  method: 'post',
  url: '/api/Resource/PostRunAutoImport'
});

/**
 * 获取任务进度
 *
 */
http.createApi('getAutoImportStatus', {
  method: 'get',
  url: '/api/Resource/GetAutoImportStatus'
});

/**
 * 根据taskid获取任务进度
 *
 */
http.createApi('getAutoImportStatusByTaskId', {
  method: 'get',
  url: '/api/Resource/GetAutoImportStatusByTaskId'
});
/*
 * 获取所有 app
 * 参数：{ parentresids, getresourcedata, getrecordcount, cmswhere }
 * 1. parentresids:父节点 id 字符串，多个 id 以逗号分隔
 * 2. getresourcedata:1
 * 3. getrecordcount:是否获取记录数量，1 表示获取；0 表示不获取
 * 4. cmswhere
 */
http.createApi('getAllAppLinks', {
  method: 'get',
  url: '/api/Resource/RetrieveUserAllAppLinks'
});

/**
 * 修改密码
 * 参数：{ oldPass, newPass1 }
 * 1. oldPass:旧密码
 * 2. newPass1:新密码
 */
http.createApi('changePassword', {
  method: 'post',
  url: '/api/user/ChangePassword'
});

/**
 * 批量保存数据（100数据结构）
 */
http.createApi('StartSaveTask', {
  method: 'post',
  url: '/api/tablethread/StartSaveTask'
});
/**
 * 批量保存数据（200数据结构）
 */
http.createApi('StartSaveTask200', {
  method: 'post',
  url: '/api/tablethread/StartSaveTask200'
});

/**
 * 停止任务
 */
http.createApi('TerminateSaveTask', {
  method: 'get',
  url: '/api/tablethread/TerminateSaveTask'
});

/**
 * 根据id获取任务状况
 */
http.createApi('RetrieveSaveTask', {
  method: 'get',
  url: '/api/tablethread/RetrieveSaveTask'
});

/**
 * 根据resids获取通知数
 */
http.createApi('getRowCountOfResource', {
  method: 'get',
  url: '/api/resource/GetRowCountOfResource'
});

/**
 * 根据数据源名称和执行sql语句获取单个值
 */
http.createApi('runBySql', {
  method: 'get',
  url: '/api/Resource/RunBySql'
});

/**
 * 根据存储过程取数据
 */
http.createApi('getRecordsByProcedure', {
  method: 'get',
  url: '/api/200/table/RetrieveProcedure'
});

/**
 * 获取所有资源配置数据
 */
http.createApi('getResourcesData', {
  method: 'post',
  url: '/api/Resource/GetAllResourcesData'
});
/**
 * 更改密码传参数
 */
http.createApi('getResetPassword', {
  method: 'post',
  url: '/api/user/ResetPassword'
});
/**
 * 发送验证码
 */
http.createApi('forgetPassword', {
  method: 'get',
  url: '/api/Account/ForgetPass'
});

/**
 * 开始批处理任务
 */
http.createApi('batchImport', {
  method: 'post',
  url: '/api/Resource/BatchRunImportBySource'
});

/**
 * 获取批处理任务进度
 */
http.createApi('getBatchInfo', {
  method: 'get',
  url: '/api/Resource//GetAutoImportStatusByBatchTaskId'
});

/**
 * 停止批处理任务
 */
http.createApi('terminateBatch', {
  method: 'get',
  url: '/api/Resource/TerminateImportByBatchTaskId'
});

/**
 * 获取附表数据
 */
http.createApi('getTableByHostRecord', {
  method: 'get',
  url: '/api/100/table/RetrieveRelTableByHostRecord'
});
/**
 * 获取字段属性
 */
http.createApi('getFieldProp', {
  method: 'get',
  url: '/api/100/table/Retrieve'
});
/**
 * 获取审批流
 */
http.createApi('CreateAuditFlowData', {
  method: 'get',
  url: '/api/AuditFlow/CreateAuditFlowData'
});

/**
 *
 */
http.createApi('getByProcedure', {
  method: 'get',
  url: '/api/200/table/GetByProcedure'
});

/**
 *
 */
http.createApi('getByProcedureWithId', {
  method: 'get',
  url: '/api/OrgStaff/GetByProcedure'
});

/**
 *
 */
http.createApi('getSubNodes', {
  method: 'get',
  url: '/api/OrgStaff/GetSubNodes'
});

/**
 *
 */
http.createApi('clearOrgCache', {
  method: 'get',
  url: '/api/OrgStaff/clearcache'
});

/**
 *创建表
 * @param {number|string} parentresid
 * @param {number|string} sourceresid
 * @param {string} resname
 */
http.createApi('addUserResouce', {
  method: 'get',
  url: '/api/ical/AddUserResouce'
});

/**
 *创建继承表
 *@param {number|string} sourceresid
 *@param {string} resname
 */
http.createApi('addInheritResource', {
  method: 'get',
  url: '/api/Resource/AddInheritResource'
});

/**
 *创建表字段
 */
http.createApi('addColumnOfUserResource', {
  method: 'post',
  url: '/api/ical/AddColumnOfUserResource'
});

/**
 *修改表字段
 */
http.createApi('editColumnOfUserResource', {
  method: 'post',
  url: '/api/ical/EditColumnOfUserResource'
});

/**
 *删除表字段
 */
http.createApi('setColToShowDisable', {
  method: 'get',
  url: '/api/ical/SetColToShowDisable'
});

/**
 *设置下拉选项
 */
http.createApi('setfieldoptions', {
  method: 'get',
  url: '/api/PWFields/setfieldoptions'
});

/**
 *关联下拉字典
 */
http.createApi('setFieldAdvOptionDict', {
  method: 'get',
  url: '/api/PWFields/SetFieldAdvOptionDict'
});

/**
 *设置题目分数
 */
http.createApi('setColScore', {
  method: 'get',
  url: '/api/PWFields/SetColScore'
});

/**
 *根据resid获取继承表
 */
http.createApi('getInheritResIDsByHostResid', {
  method: 'get',
  url: '/api/Resource/GetInheritResIDsByHostResid'
});
/**
 * 向上移动字段
 */
http.createApi('moveUpColumn', {
  method: 'get',
  url: '/api/PWFields/MoveUpColumn'
});

/**
 * 向下移动字段
 */
http.createApi('moveDownColumn', {
  method: 'get',
  url: '/api/PWFields/MoveDownColumn'
});
/**
 * 设置字段显示或隐藏
 */
http.createApi('setFieldShow', {
  method: 'get',
  url: '/api/PWFields/SetFieldShow'
});

/**
 *根据资源编号获取跳转URL
 */
http.createApi('getRedirectUrl', {
  method: 'get',
  url: '/api/Resource/GetRedirectUrl'
});

/**
 * 根据表 id 获取行颜色数据
 * 参数：{ id }
 * 1. dblink 资源 id
 */
http.createApi('getRowColorData', {
  method: 'get',
  url: '/api/resource/retrieve'
});

/**
 * 获取多媒体字段中的图片url 相对路径
 * 参数：{ id }
 * 1. resid 资源 id
 * 2. colname 内部字段名称
 * 3. recid 记录 id
 * 4. dblinkname
 */
http.createApi('getBinImage', {
  method: 'get',
  url: '/api/100/table/RetrieveBinImage'
});

/**
 * 在添加记录之前使用计算公式获取将要添加的记录
 * 参数：{ resid, data, rp: { EnableFormulaVerify: 'false', EnableBitianCheck: false } }
 * resid:resid
 * data: "[{ _state: "added", _id: 1 }]"
 * rp:{ EnableFormulaVerify: 'false', EnableBitianCheck: false }
 */
http.createApi('beforeSaveAdd', {
  method: 'post',
  url: '/api/100/table/RunInnerTableFormulaBeforeSave'
});

/**
 * 设置用户考勤月份
 * 参数:{ yearmonth: string, dblinkname: string }
 * yearmonth:年月。如 '202009'
 * dblinkname:数据源名称
 */
http.createApi('saveUserAttMonth', {
  method: 'get',
  url: '/api/Account/SaveUserAttMonth'
});

/**
 * 获取表格数据（post 请求）
 * 参数:{ resid, cmswhere, ... }；参数和 getTable 的参数一致
 */
http.createApi('getTablePost', {
  method: 'post',
  url: '/api/100/table/PostRetrieve'
});

export default http;
