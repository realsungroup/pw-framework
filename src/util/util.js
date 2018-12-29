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
