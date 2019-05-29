import React from 'react';
import Loadable from 'react-loadable';
import FullLoading from 'react-fullscreen-loading';

export const DesktopDashboard = Loadable({
  loader: () => import('./DesktopDashboard'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const DesktopOrgChart = Loadable({
  loader: () => import('./DesktopOrgChart'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const DesktopColorPicker = Loadable({
  loader: () => import('./DesktopColorPicker'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const DesktopReminderList = Loadable({
  loader: () => import('./DesktopReminderList'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const WindowView = Loadable({
  loader: () => import('./WindowView'),
  loading() {
    return <FullLoading loading={true} />;
  }
});

export const DesktopPersonCenter = Loadable({
  loader: () => import('./DesktopPersonCenter'),
  loading() {
    return <FullLoading loading={true} />;
  }
});
