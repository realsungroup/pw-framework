import PropTypes from 'prop-types';

export const defaultProps = {
  mainTableProps: {},
  subTablesProps: {}
};

export const propTypes = {
  /**
   * 主表 id
   */
  resid: PropTypes.number,

  /**
   * 数据库链接名称（当你想要用其他数据库时使用）
   * 默认：-
   */
  dblinkname: PropTypes.string,

  /**
   * 主表接收的 props
   * 默认：{}
   */
  mainTableProps: PropTypes.object,

  /**
   * 子表接收的 props
   * 默认：{}
   */
  // 例如：
  // {
  //   111: { hasAdd: true }, // key 表示子表 id，value 表示该子表接收的 props
  //   222: { hasAdd: true },
  // }
  subTablesProps: PropTypes.object,

  /**
   * 基地址
   * 默认：-
   */
  baseURL: PropTypes.string
};
