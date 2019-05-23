import React from 'react';
import { message } from 'antd';
import Functions from '../Functions';
import { getModuleComponentConfig } from '../../util/api';
import merge from 'deepmerge';
import config from './config';
import qs from 'qs';

const emptyTarget = value => (Array.isArray(value) ? [] : {});
const clone = (value, options) => merge(emptyTarget(value), value, options);

function combineMerge(target, source, options) {
  const destination = target.slice();

  source.forEach(function(e, i) {
    if (typeof destination[i] === 'undefined') {
      const cloneRequested = options.clone !== false;
      const shouldClone = cloneRequested && options.isMergeableObject(e);
      destination[i] = shouldClone ? clone(e, options) : e;
    } else if (options.isMergeableObject(e)) {
      destination[i] = merge(target[i], e, options);
    } else if (target.indexOf(e) === -1) {
      destination.push(e);
    }
  });
  return destination;
}

/**
 * 获取配置信息
 */
export default class FnModule extends React.Component {
  constructor(props) {
    super(props);
    const { resid: resId, recid: recId } = this.resolveQueryString();
    this.state = {
      resId,
      recId,
      beConfig: {}, // 后端模板组件配置信息
      isRequest: false // 是否请求了后端配置
    };
  }

  resolveQueryString = () => {
    const querystring = this.props.location.search.substring(1);
    return qs.parse(querystring);
  };

  componentDidMount() {
    this.getConfig();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.url !== this.props.match.url) {
      this.props = nextProps;
      this.getConfig();
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextState !== this.state) {
      return true;
    }
    return false;
  };

  /**
   * 请求后端表的配置
   */
  getConfig = async () => {
    const { recId } = this.state;
    let res, record;
    const resid = 459877233554,
      cmswhere = `C3_584903578245 = ${recId}`;
    try {
      res = await getModuleComponentConfig(resid, cmswhere);
    } catch (err) {
      this.setState({ isRequest: true });
      return message.error(err.message);
    }
    let beConfig;
    if (!res.data.length) {
      beConfig = {};
    } else {
      record = res.data[0];
      try {
        beConfig = record.C3_584902392149
          ? JSON.parse(record.C3_584902392149)
          : {};
      } catch (err) {
        beConfig = {};
        message.error('后端 JSON 配置错误');
      }
    }
    this.setState({ beConfig, isRequest: true });
  };

  mergeConfig = () => {
    let { beConfig, resId } = this.state;
    let feConfig;
    if (config[resId] && window[resId]) {
      feConfig = merge(config[resId], window[resId], {
        arrayMerge: combineMerge
      });
    } else {
      if (config[resId]) {
        feConfig = config[resId];
      }
      if (window[resId]) {
        feConfig = window[resId];
      }
    }
    if (!feConfig) {
      feConfig = {};
    }
    return merge(beConfig, feConfig, { arrayMerge: combineMerge });
  };

  render() {
    if (!this.state.isRequest) {
      return null;
    }
    const newConfig = this.mergeConfig();
    return <Functions config={newConfig} {...this.props} />;
  }
}
