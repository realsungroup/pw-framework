import PropTypes from 'prop-types';

export const defaultProps = {};

export const propTypes = {
  /**
   * 根节点 id
   * 默认：-
   */
  rootId: PropTypes.number.isRequired,

  /**
   * 标题（中文）
   * 默认：-
   */
  title: PropTypes.string,

  /**
   * 标题（英文）
   * 默认：-
   */
  enTitle: PropTypes.string,

  /**
   * 数据库链接名称（当你想要用其他数据库时使用）
   * 默认：-
   */
  dblinkname: PropTypes.string
};
