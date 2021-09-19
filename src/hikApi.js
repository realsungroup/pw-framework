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
export const getRootRegion = () => {
  return hikInstance.get('/api/v1/getRootRegion');
};

/**
 * 通过姓名查询人员列表
 */
export const queryPersonsByName = name => {
  return hikInstance.get(
    `/api/v1/queryPersonsByName?personName=${encodeURIComponent(name)}`
  );
};

/**
 * 通过部门名称查询部门列表
 */
export const queryOrgsByName = orgName => {
  return hikInstance.get(
    `/api/v1/queryOrgsByName?orgName=${encodeURIComponent(orgName)}`
  );
};

/**
 * 通过门禁点名称查询门禁点列表
 */
export const queryDoorsByName = name => {
  return hikInstance.get(
    `/api/v1/queryDoorsByName?name=${encodeURIComponent(name)}`
  );
};

/**
 * 通过设备名称查询设备
 */
export const queryDevicesByName = name => {
  return hikInstance.get(
    `/api/v1/queryDevicesByName?name=${encodeURIComponent(name)}`
  );
};

/**
 * 通过区域名称查询区域
 */
export const queryRegionsByName = regionName => {
  return hikInstance.get(
    `/api/v1/queryRegionsByName?regionName=${encodeURIComponent(regionName)}`
  );
};

/**
 * 获取所有的区域
 */
export const getAllRegions = () => {
  return hikInstance.get('/api/v1/getAllRegions');
};

export const getSubRegions = data => {
  return hikInstance.post('/api/v1/getSubRegions', data);
};

/**
 * 根据编号获取区域详细信息
 */
export const getRegionInfo = indexCodes => {
  return hikInstance.post('/api/v1/getRegionInfo', {
    indexCodes
  });
};

/**
 * 根据编号获取区域详细信息
 */
export const getRegionTreeByName = (indexCodes, regionName) => {
  return hikInstance.post('/api/v1/getRegionTreeByName', {
    indexCodes,
    regionName
  });
};

/**
 * 根据组织名称获取组织树
 */
export const getOrgTreeByName = (orgIndexCodes, orgName) => {
  return hikInstance.post('/api/v1/getOrgTreeByName', {
    orgIndexCodes,
    orgName
  });
};

/**
 * 查询门禁点列表
 */
export const queryDoors = data => {
  return hikInstance.post('/api/v1/queryDoors', {
    ...data
  });
};

/**
 * 查询部门
 */
export const queryDepartments = data => {
  return hikInstance.post('/api/v1/queryDepartments', {
    ...data
  });
};

/**
 * 根据父组织编号获取下级组织列表
 */
export const getSubOrgs = parentOrgIndexCode => {
  return hikInstance.get(
    `/api/v1/getSubOrgs?parentOrgIndexCode=${encodeURIComponent(
      parentOrgIndexCode
    )}`
  );
};

/**
 * 查询人员列表
 */
export const queryPersons = data => {
  return hikInstance.post('/api/v1/queryPersons', {
    ...data
  });
};

/**
 * 查询所有人员列表
 */
export const queryAllPersons = data => {
  return hikInstance.post('/api/v1/queryAllPersons', {
    ...data
  });
};

/**
 * 校验人员信息
 */
export const validPersons = data => {
  return hikInstance.post('/api/v1/validPersons', {
    ...data
  });
};

/**
 * 添加人员分组权限
 */
export const addPersonGroupRight = data => {
  return hikInstance.post('/api/v1/addPersonGroupRight', {
    ...data
  });
};

/**
 * 查询权限配置单进度
 */
export const authConfigProgress = data => {
  return hikInstance.post('/api/v1/authConfigProgress', {
    ...data
  });
};

/**
 * 通过人员分组权限表 id 删除权限
 */
export const removeRightById = personGroupRightRecIds => {
  return hikInstance.post('/api/v1/removeRightById', {
    personGroupRightRecIds
  });
};

/**
 * 通过人员分组权限表 id 修改权限有效期
 */
export const modifyDateByIds = (personGroupRightRecIds, startTime, endTime) => {
  return hikInstance.post('/api/v1/modifyDateByIds', {
    personGroupRightRecIds,
    startTime,
    endTime
  });
};

/**
 * 通过人员分组权限表 id 修改权限有效期
 */
export const authDownload = data => {
  return hikInstance.post('/api/v1/authDownload', {
    ...data
  });
};

/**
 * 查询下载任务进度
 */
export const authDownloadProgress = data => {
  return hikInstance.post('/api/v1/authDownloadProgress', {
    ...data
  });
};

/**
 * 查询权限下载记录
 */
export const queryDownloadRecords = data => {
  return hikInstance.post('/api/v1/queryDownloadRecords', {
    ...data
  });
};

/**
 * 查询设备通道的人员权限下载详情
 */
export const queryDownloadDetail = data => {
  return hikInstance.post('/api/v1/queryDownloadDetail', {
    ...data
  });
};

/**
 * 查询权限条目列表
 */
export const queryAuthItemList = data => {
  return hikInstance.post('/api/v1/queryAuthItemList', {
    ...data
  });
};
