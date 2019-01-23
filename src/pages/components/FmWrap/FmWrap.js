import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
/**
 * FmWrap
 */
const FmWrap = props => {
  return <FormattedMessage id={props.id}>{txt => txt}</FormattedMessage>;
};

FmWrap.propTypes = {
  id: PropTypes.string.isRequired
};

FmWrap.defaultProps = {};

export default FmWrap;
