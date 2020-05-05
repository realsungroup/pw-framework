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
class PWRedirect extends React.Component {
  state = { url: '' };
  componentDidMount() {
    const { resid, replaceBaseUrl } = this.props;
    this.fetchRedirectUrl(resid, replaceBaseUrl);
  }
  fetchRedirectUrl = async (resid, replaceBaseUrl) => {
    try {
      const res = await http().getRedirectUrl({ resid });
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

    return url ? (
      <iframe
        src={url}
        height="100%"
        title={this.props.resid}
        width="100%"
        frameBorder="none"
      />
    ) : (
      <div>请稍等...</div>
    );
  }
}

export default PWRedirect;
