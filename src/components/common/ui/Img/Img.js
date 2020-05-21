import React from 'react';

function Img(props) {
  const onError = function(e) {
    e.target.src = props.defaultImg;
  };
  return <img {...props} onError={onError} />;
}
export default React.memo(Img);
