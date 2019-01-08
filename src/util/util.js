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
