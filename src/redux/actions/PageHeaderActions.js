import http from 'Util20/api';

const GET_NAVLIST_APP = 'GET_NAVLIST_APP';
const SET_TITLE_TYPE = 'SET_TITLE_TYPE';

// 获取导航栏列表应用
const getNavlistApps = () => {
  return async dispatch => {
    let res;
    try {
      res = await http().getUserDesktop();
    } catch (err) {
      throw new Error(err);
    }
    dispatch({ type: GET_NAVLIST_APP, data: res });
  };
};

export { GET_NAVLIST_APP, SET_TITLE_TYPE, getNavlistApps };
