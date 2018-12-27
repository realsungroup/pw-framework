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
