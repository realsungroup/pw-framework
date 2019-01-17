import PropTypes from 'prop-types';

export const defaultProps = {
  renderData: [],
  colCount: 1,
  keyName: ''
};

export const propTypes = {
  /**
   * 要被处理渲染的数据
   * 默认：[]
   */
  renderData: PropTypes.array,

  /**
   * 列数量
   * 默认：1
   */
  colCount: PropTypes.number,

  /**
   * 在 renderData 对象数组中标识每一个元素的键值
   * 默认：''
   */
  keyName: PropTypes.string
};
