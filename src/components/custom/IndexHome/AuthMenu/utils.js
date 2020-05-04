/**
 * 用户属于用户组
 * localstorage 中 userinfo 中的 GroupList 中含有 641318283132 该 id
 */
export const userGroupMenus = [
  {
    title: '查询信息',
    url: '/searchInfo'
  },
  {
    title: '填写信息',
    url: '/personalInformation'
  },
  {
    title: '选择医护',
    url: '/doctorList'
  },
];

/**
 * 登录用户属于机构组
 * 即 localstorage 中 userinfo 中的 GroupList 中含有 641318326332 该 id
 */
export const organizationGroupMenus = [
  {
    title: '人员信息',
    url: '/personInfor'
  },
  {
    title: '入住人员',
    url: '/index'
  },
  {
    title: '关注人员',
    url: '/attentionPeople'
  },
  {
    title: '对接医生或医院',
    url: '/doctorList',
  }
];

/**
 * 用户属于医生组
 * 即 localstorage 中 userinfo 中的 GroupList 中含有 641318709005 该 id
 */
export const doctorGroupMenus = [
  {
    title: '医生在线提示',
    url: '/onlineTips'
  },
  {
    title: '响应会员要求',
    url: '/memberRequire'
  },
  {
    title: '医嘱记录',
    url: '/doctorAdvice'
  },
];

export const allMenus = [...userGroupMenus, ...organizationGroupMenus, ...doctorGroupMenus]

const idMap = {
  userGroup: '641318283132',
  organizationGroup: '641318326332',
  doctorGroup: '641318709005',
};

const menusMap = {
  641318283132: userGroupMenus,
  641318326332: organizationGroupMenus,
  641318709005: doctorGroupMenus,
};

/**
 * 通过 id 获取菜单数据
 * @param {string} id id
 * 
 * @returns {object} 菜单信息
 */
export const getMenusById = (id) => {
  return menusMap[id];
}

/**
 * 从 localStoreage 中获取 userInfo
 * @returns {object} 用户信息
 */
export const getUserInfo = () => {
  const userInfoString = localStorage.getItem('userInfo');
  if (!userInfoString) {
    return null;
  }
  let userInfo = null;
  try {
    userInfo = JSON.parse(userInfoString);
  } catch (err) {
  }
  return userInfo;
}

/**
 * 从用户信息中提取 groupList
 * @param {object} userInfo 用户信息
 * 
 * @returns {array} groupList 数组
 */
export const getGroupList = (userInfo) => {
  if (!userInfo) {
    return [];
  }
  let groupListString = userInfo && userInfo.UserInfo && userInfo.UserInfo.GroupList || '';
  groupListString = groupListString.replace(/[(|)]/g, '');

  let ret = groupListString.split(',');
  ret = ret.map(item => item.trim().replace(/['|']/g, ''));

  return ret;
}

/**
 * 获取菜单数据
 */
export const getMenus = () => {
  const userInfo = getUserInfo();
  const groupList = getGroupList(userInfo);
  
  let id;
  if (groupList.includes(idMap.userGroup)) {
    id = idMap.userGroup;
  } else if (groupList.includes(idMap.organizationGroup)) {
    id = idMap.organizationGroup;
  } else if (groupList.includes(idMap.doctorGroup)) {
    id = idMap.doctorGroup;
  }

  return menusMap[id];
}


