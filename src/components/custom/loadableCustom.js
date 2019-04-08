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

  export const  EditTitle= Loadable({
    loader: () => import('./EditTitle'),
    loading() {
      return minLoading;
    }
  });
  
  export const  ExamSet= Loadable({
    loader: () => import('./ExamSet'),
    loading() {
      return minLoading;
    }
  });

  export const  Choice= Loadable({
    loader: () => import('./Choice'),
    loading() {
      return minLoading;
    }
  });

  export const  Refer= Loadable({
    loader: () => import('./Refer'),
    loading() {
      return minLoading;
    }
  });

  
    
    
