import React from 'react';
const penetrate = window.pwConfig[process.env.NODE_ENV].penetrate;

/**
 * 获取url对应的域名
 *
 * @param url
 * @return
 */
function getDomain(url) {
  let result = '';
  let j = 0,
    startIndex = 0,
    endIndex = 0;
  for (let i = 0; i < url.length; i++) {
    if (url.charAt(i) == '/') {
      j++;
      if (j === 3) {
        endIndex = i;
      }
    }
  }
  result = url.substring(startIndex, endIndex);
  return result;
}

const replaceDomain = 'http://ngrok90.realsun.me'
function Img(props) {
  const onError = function (e) {
    if (penetrate) {
      const domain = (getDomain(props.src));
      e.target.src = props.src.replace(domain, replaceDomain)
    } else {
      e.target.src = props.defaultImg;
    }
  };

  return <img {...props} onError={onError} />;
}
export default React.memo(Img);
