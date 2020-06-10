import React from 'react';
import http, { makeCancelable } from 'Util20/api';

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
const style = { height: '100%', width: '100%' };
class PWRedirect extends React.Component {
  state = { url: '' };
  componentDidMount() {
    const { resid, replaceBaseUrl, baseURL } = this.props;
    this.fetchRedirectUrl(resid, replaceBaseUrl, baseURL);
  }
  fetchRedirectUrl = async (resid, replaceBaseUrl, baseURL) => {
    try {
      const res = await http({ baseURL }).getRedirectUrl({ resid });
      let url = res.data;
      if (replaceBaseUrl) {
        url = url.replace(getDomain(url), replaceBaseUrl);
      }
      console.log(url);
      this.setState({ url });
    } catch (error) {
      console.error(error);
    }
  };
  render() {
    const { url } = this.state;

    return (
      <div style={style} className="pw-redirect">
        {url ? (
          <iframe
            src={url}
            height="100%"
            title={this.props.resid}
            width="100%"
            frameBorder="none"
            className="pw-redirect-iframe"
          />
        ) : (
          <div>请稍等...</div>
        )}
      </div>
    );
  }
}

export default PWRedirect;
