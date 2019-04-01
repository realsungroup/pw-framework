import React from 'react';
import Loadable from 'react-loadable';

const minLoading = <span>加载中...</span>;



export const Arrange = Loadable({
    loader: () => import('./Arrange'),
    loading() {
      return minLoading;
    }
  });

  export const  Pop= Loadable({
    loader: () => import('./Pop'),
    loading() {
      return minLoading;
    }
  });

  export const  AddTitle= Loadable({
    loader: () => import('./AddTitle'),
    loading() {
      return minLoading;
    }
  });
    
    
