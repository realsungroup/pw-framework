import React from 'react';
import HomeBody from './HomeBody';
import withTitle from 'Common/hoc/withTitle';
import { getItem } from 'Util20/util';

class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <HomeBody />
      </div>
    );
  }
}

const language = getItem('language') || '中文';
let title = 'Home Page';
if (language === '中文') {
  title = '首页';
}

export default withTitle(title)(Home);
