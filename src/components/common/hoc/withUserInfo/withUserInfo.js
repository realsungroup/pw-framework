import React from 'react';
import { argumentContainer } from '../util';
import { getItem } from 'Util/util';

// 获取首页风格的高阶组件
const withHomeStyle = () => {
  return function(WrappedComponent) {
    class withHomeStyle extends React.Component {
      render() {
         let userInfo;
          try {
            userInfo = JSON.parse(getItem('userInfo'));
          } catch (err) {
            userInfo = null;
          }

        return (
          <WrappedComponent
            {...this.props}
            USER_INFO={userInfo}
          />
        );
      }
    }
    return argumentContainer(withHomeStyle, WrappedComponent, 'withHomeStyle');
  };
};

export default withHomeStyle;
