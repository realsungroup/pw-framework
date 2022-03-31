import { get } from 'lodash'

export const getAppConfig = (path) => {
  return get(window.pwConfig[process.env.NODE_ENV], path);
}