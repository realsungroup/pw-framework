import React from 'react';
import ReactDOM from 'react-dom';
import './DesktopSearch.less';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Input } from 'antd';
const noop = () => {};

/**
 * 桌面左下角的搜索
 */
export default class DesktopSearch extends React.Component {
  static propTypes = {};

  static defaultProps = {
    onFocus: noop
  };

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.searchValue !== this.props.searchValue) {
      return true;
    }
    return false;
  }

  render() {
    const { onFocus, onChange, searchValue } = this.props;
    return (
      <Input.Search
        value={searchValue}
        className="desktop-search"
        onFocus={onFocus}
        onClick={e => e.stopPropagation()}
        onChange={onChange}
      />
    );
  }
}
