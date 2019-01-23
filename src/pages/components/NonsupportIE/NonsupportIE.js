import React, { Fragment } from 'react';

function isIE() {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    return true;
  }
  return false;
}

function getIEVersion() {
  const userAgent = navigator.userAgent;
  const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
  reIE.test(userAgent);
  const fIEVersion = parseFloat(RegExp['$1']);
  if (userAgent.indexOf('MSIE 6.0') != -1) {
    return 'ie6';
  } else if (fIEVersion == 7) {
    return 'ie7';
  } else if (fIEVersion == 8) {
    return 'ie8';
  } else if (fIEVersion == 9) {
    return 'ie9';
  } else if (fIEVersion == 10) {
    return 'ie10';
  } else if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)) {
    return 'ie11';
  } else {
    return '';
  } //IE版本过低
}

// 是否当前版本的 ie 浏览器能够使用本应用
function isCurIEVersionCanUse(supportList, version) {
  return supportList.indexOf(version) !== -1;
}

// nonsupport IE component
const NonsupportIE = props => {
  const { curIEVersion = '', supportVersionList, reminder, warningBar } = props;
  let canUseApp = true;
  const isie = !!curIEVersion || isIE();
  if (isie || curIEVersion) {
    const ieVersion = curIEVersion || getIEVersion();
    // ie6 以下不支持
    if (!ieVersion) {
      canUseApp = false;
    } else {
      canUseApp = isCurIEVersionCanUse(supportVersionList, ieVersion);
    }
  }
  if (!canUseApp) {
    return <Fragment>{reminder || 'app is not support IE'}</Fragment>;
  }
  return (
    <Fragment>
      {isie && warningBar}
      {props.children}
    </Fragment>
  );
};

export default NonsupportIE;
