import React from 'react';
import sha1 from 'js-sha1';
import moment from 'moment';
import './EnquirySystem.less';

const time = moment().unix();
const siteid = 165178;
const userid = 184221;
const nonce = 'abcd1234';
const token = '14rtK2';

class EnquirySystem extends React.Component {
  render() {
    let sign = sha1(`${token}${time}${siteid}${userid}${nonce}`);
    let url = `https://apis.v5kf.com/member/index/kexi?source=kxapi&nonce=${nonce}&time=${time}&sign=${sign}&siteid=${siteid}&userid=${userid}`;
    return (
      <div style={{ height: '100vh' }}>
        <iframe
          id="v5kf"
          src={url}
          title="客服"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      </div>
    );
  }
}
export default EnquirySystem;
