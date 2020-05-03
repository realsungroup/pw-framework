import React from 'react';
import Loadable from 'react-loadable';

const minLoading = <span>加载中...</span>;

export const PatientInfo = Loadable({
  loader: () => import('./PatientInfo'),
  loading() {
    return minLoading;
  }
});

export const LzModal = Loadable({
  loader: () => import('../../lib/unit-component/components/LzModal'),
  loading() {
    return minLoading;
  }
});

export const LzMenuForms = Loadable({
  loader: () => import('./LzMenuForms'),
  loading() {
    return minLoading;
  }
});

export const RecordInput = Loadable({
  loader: () => import('./RecordInput'),
  loading() {
    return minLoading;
  }
});
export const BPChart = Loadable({
  loader: () => import('./BPChart'),
  loading() {
    return minLoading;
  }
});
export const GLUChart = Loadable({
  loader: () => import('./GLUChart'),
  loading() {
    return minLoading;
  }
});
export const OtherData = Loadable({
  loader: () => import('./OtherData'),
  loading() {
    return minLoading;
  }
});
export const DoctorList = Loadable({
  loader: () => import('./DoctorList'),
  loading() {
    return minLoading;
  }
});
export const IndexHome = Loadable({
  loader: () => import('./IndexHome'),
  loading() {
    return minLoading;
  }
});
export const AttentionPeople = Loadable({
  loader: () => import('./AttentionPeople'),
  loading() {
    return minLoading;
  }
});
export const PersonInfor = Loadable({
  loader: () => import('./PersonInfor'),
  loading() {
    return minLoading;
  }
});
export const PersonalInformation = Loadable({
  loader: () => import('./PersonalInformation'),
  loading() {
    return minLoading;
  }
});
export const DoctorAdvice = Loadable({
  loader: () => import('./DoctorAdvice'),
  loading() {
    return minLoading;
  }
});
