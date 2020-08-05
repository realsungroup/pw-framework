import React from 'react';
import './OnePage.less';

/**
 * 患者信息
 */
class OnePage extends React.Component {
  render() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const accessToken  = userInfo.AccessToken;
    return (
      <iframe
        className="onepage-iframe"
        src={`http://localhost:3001/home?accessToken=${accessToken}`}
      ></iframe>
    );
  }
}

export default OnePage;
