import { GET_NAVLIST_APP, SET_TITLE_TYPE } from '../actions/PageHeaderActions';

const objArrUnique = (arr, key) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i][key] === arr[j][key]) {
        arr.splice(j, 1);
      }
    }
  }
};

const dealApps = apps => {
  apps.forEach(app => (app.ResID = app.ResID || app.resid));
  objArrUnique(apps, 'ResID');
  let arr = [];
  apps.forEach(app => {
    const appIndex = arr.findIndex(item => item.typeName === app.BusinessNode);
    let index = appIndex;
    if (appIndex === -1) {
      arr[arr.length] = {
        apps: [],
        typeName: app.BusinessNode
      };
      index = arr.length - 1;
    }
    arr[index].apps.push(app);
  });
  return arr;
};

const defaultState = {
  apps: []
};

export default (state = defaultState, action) => {
  const { type, data } = action;
  switch (type) {
    case GET_NAVLIST_APP: {
      let apps = [];
      if (!data.error) {
        apps = dealApps([...data.data, ...(data.data.userdefined || [])]);
      }
      return { ...state, apps };
    }

    case SET_TITLE_TYPE: {
      const { title, type } = data;
      return { ...state, title, type };
    }

    default:
      return state;
  }
};
