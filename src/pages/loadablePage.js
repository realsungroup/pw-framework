import React from 'react';
import Loadable from 'react-loadable';
import FullLoading from 'react-fullscreen-loading';

export const PersonCenter = Loadable({
  loader: () => import('./PersonCenter'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const GetConfig = Loadable({
  loader: () => import('./GetConfig'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const Login = Loadable({
  loader: () => import('./Login'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const NotFound = Loadable({
  loader: () => import('./NotFound'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const Desktop = Loadable({
  loader: () => import('./Desktop'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const WorkBench = Loadable({
  loader: () => import('./NewHome'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const Reminder = Loadable({
  loader: () => import('./Reminder'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const PageContainer = Loadable({
  loader: () => import('./PageContainer'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const Home = Loadable({
  loader: () => import('./Home'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const WorkbenchSetting = Loadable({
  loader: () => import('./WorkbenchSetting'),
  loading() {
    return <FullLoading loading={true} />;
  }
});
