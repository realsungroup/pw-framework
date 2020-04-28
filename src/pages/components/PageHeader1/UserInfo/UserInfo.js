import React from 'react';
import './UserInfo.less';
import { Avatar } from 'antd';
// import { Link } from 'react-router-dom';

const UserInfo = ({ userName, userRank, userHeadImg, onClick }) => (
  <div onClick={onClick} className="new-home__user-info">
    <div className="home-title">
      <Avatar
        size={35}
        icon="user"
        src={userHeadImg}
        className="home-title__avatar"
      />

      <div className="home-title-content">
        <div className="home-title-name">{userName}</div>
        <div className="home-title-rank">{userRank}</div>
      </div>
    </div>
  </div>
);

export default UserInfo;
