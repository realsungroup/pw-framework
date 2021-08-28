export const setItem = (key, value) => {
  return localStorage.setItem(key, value);
};

export const getItem = key => {
  return localStorage.getItem(key);
};

export const removeItem = key => {
  return localStorage.removeItem(key);
};

export const getResid = (dataMode, resid, subresid) => {
  return dataMode === 'main' ? resid : subresid;
};

export const clone = obj => {
  return JSON.parse(JSON.stringify(obj));
};

export const getIntlVal = (locale, enString, zhString) => {
  return locale === 'zh' ? zhString : enString;
};

/**
 * 根据地址下载文件
 * @param {string} href 文件地址
 * @param {string} fileName 下载的文件名称
 */
export const downloadFile = (href, fileName) => {
  const el = document.createElement('a');
  el.setAttribute('href', href);
  el.setAttribute('download', fileName);
  el.click();
};

/**
 * 获取 cmsWehere
 * @param  {...string | object} cmsWhereArr
 * 当 cmsWhereArr 为一个字符串数组时：合并每一个字符串，如：['name = xl', 'age = 22', ...]
 * 当 cmsWhereArr[0] 为一个对象时：生成 cmswhere，如：[{ name: 'xl', age: 22, sex: 1 }]
 * @return {string} cmsWhere 返回 cmsWhere
 */
export const getCmsWhere = (...cmsWhereArr) => {
  let cmsWhere = '';
  // 如：['name = xl', 'age = 22', ...]
  if (cmsWhereArr.length > 1) {
    const arr = cmsWhereArr.filter(where => where);
    const len_1 = arr.length - 1;
    arr.forEach((where, index) => {
      if (where) {
        cmsWhere += `${where}`;
        cmsWhere += index === len_1 ? '' : ' and ';
      }
    });

    // 如：[{ name: 'xl', age: 22, sex: 1 }]
  } else if (typeof cmsWhereArr[0] === 'object' && cmsWhereArr.length === 1) {
    const formData = cmsWhereArr[0];
    const arr = Object.keys(formData).filter(
      key => formData[key] || formData[key] === 0
    );
    arr.forEach((key, index) => {
      let value = formData[key];
      if (value) {
        cmsWhere += `${key} = '${value}'`;
        cmsWhere += index === arr.length - 1 ? '' : ' and ';
      }
    });

    // 其他参数
  } else {
    return '';
  }
  return cmsWhere;
};

/**
 * 根据传入的函数数组，返回 Promise.all() 所需的 promise 对象数组
 * @param {array} fnArr 函数数组
 * 如：
 * [
 *   () => {
 *     if (condition) { 判断是否将这个 promise 添加到数组中
 *       return somePromise;
 *     }
 *   }
 * ]
 * @param {boolean} isExecute 是否执行 Promise.all()，默认值：true
 */
export const paa = (fnArr, isExecute = true) => {
  if (!Array.isArray(fnArr)) {
    throw new Error('fnArr 时必传的');
  }
  const arr = fnArr.map(fn => fn && fn());
  const pArr = arr;
  if (!isExecute) {
    return pArr;
  }
  return Promise.all(pArr);
};

/**
 * 判断字符串是否以日期字符串开头
 * @param {string} s 字符串
 */
export const isDateString = s => {
  return /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/.test(s);
};

/**
 * 百分比字符串转小数
 * @param {string} string 百分比字符串
 * @return {number} 小数
 */
export const percentString2decimal = string => {
  return parseInt(string, 10) / 100;
};

/**
 * 表格数据转换为树数据
 * @param tableData 表格数据
 * @param idField id 字段
 * @param pidField pid 字段
 * @param parentNode 父节点数据
 */
export const table2Tree = (tableData, idField, pidField, parentNode) => {
  const ret = [];
  if (!tableData) {
    return ret;
  }

  // parentNode 存在
  if (parentNode) {
    tableData.forEach(tableItem => {
      if (tableItem[pidField] === parentNode[idField]) {
        parentNode.children && parentNode.children.push({ ...tableItem });
      }
    });

    // parentNode 不存在
  } else {
    tableData.forEach(tableItem => {
      const index = ret.findIndex(
        item => item[idField] === tableItem[pidField]
      );

      if (index === -1) {
        ret.push({ ...tableItem, children: [] });
      } else {
        ret[index].children.push(tableItem);
        ret[index].children[
          ret[index].children.length - 1
        ].children = table2Tree(tableData, idField, pidField, tableItem);
      }
    });
  }

  return ret;
};

/**
 * 获取生成 BEM 命令法的函数
 * @param {string} prefix 类名前缀
 */
export const getGBEMClassName = prefix => {
  return (suffix = '') => {
    if (!suffix) {
      return prefix;
    }
    return `${prefix}__${suffix}`;
  };
};

export const getAccessToken = () => {
  const userInfoString = localStorage.getItem('userInfo');
  let accessToken;
  try {
    const userInfo = JSON.parse(userInfoString);
    accessToken = userInfo.AccessToken;
  } catch (err) {
    accessToken = '';
  }
  return accessToken;
};
