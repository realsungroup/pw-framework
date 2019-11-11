import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import PageHeaderReducers from './redux/reducers/PageHeaderReducers';

// 合并 reducer
const reducers = combineReducers({
  PageHeaderReducers
});

// 创建 store
const store = createStore(reducers, applyMiddleware(thunk, logger));

export default store;
