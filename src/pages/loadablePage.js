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

export const Reminder = Loadable({
  loader: () => import('./Reminder'),
  loading() {
    return <FullLoading loading={true} />;
  }
});
