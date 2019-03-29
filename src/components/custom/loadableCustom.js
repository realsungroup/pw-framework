import React from 'react';
import Loadable from 'react-loadable';

const minLoading = <span>加载中...</span>;



export const Arrange = Loadable({
    loader: () => import('./Arrange'),
    loading() {
      return minLoading;
    }
  });

  export const  List= Loadable({
    loader: () => import('./List'),
    loading() {
      return minLoading;
    }
  });
    
