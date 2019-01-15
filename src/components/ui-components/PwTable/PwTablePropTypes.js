import PropTypes from 'prop-types';

export const defaultProps = {
  size: 'middle',

  width: 800,
  height: 400,

  hasDownload: true,
  hasRefresh: true,
  hasAdvSearch: true,

  hasAdd: true,
  hasModify: true,
  hasDelete: true,
  hasSearch: true
};

export const propTypes = {
  /**
   * 表格尺寸
   * 默认：'large'
   */
  size: PropTypes.oneOf(['large', 'middle', 'small']),

  /**
   * 表格标题
   */
  title: PropTypes.string,

  /**
   * 表格宽度
   * 默认：800
   */
  width: PropTypes.number,

  /**
   * 表格高度
   * 默认：300
   */
  height: PropTypes.number,

  /**
   * 是否有下载表格的功能
   * 默认值：true
   */
  hasDownload: PropTypes.bool,

  /**
   * 点击下载表格时的回调
   * */
  onDownload: PropTypes.func,

  /**
   * 是否有刷新表格数据的功能
   * 默认值：true
   */
  hasRefresh: PropTypes.bool,

  /**
   * 点击刷新时的回调
   * */
  onRefresh: PropTypes.func,

  /**
   * 是否有高级搜索的功能
   * 默认值：true
   */
  hasAdvSearch: PropTypes.bool,

  /**
   * 点击高级搜索时的回调
   */
  onAdvSearch: PropTypes.func,

  /**
   * 渲染其他按钮函数
   */
  renderOtherBtns: PropTypes.func,

  /**
   * 是否有添加按钮
   * 默认值：true
   */
  hasAdd: PropTypes.bool,

  /**
   * 点击添加时的回调
   */
  onAdd: PropTypes.func,

  /**
   * 是否有修改按钮
   * 默认值：true
   */
  hasModify: PropTypes.bool,

  /**
   * 点击修改时的回调
   */
  onModify: PropTypes.func,

  /**
   * 是否有删除按钮
   * 默认值：true
   */
  hasDelete: PropTypes.bool,

  /**
   * 点击删除时的回调
   */
  onDelete: PropTypes.func,

  /**
   * 是否有搜索栏
   * 默认值：true
   */
  hasSearch: PropTypes.bool,

  /**
   * 分页配置
   * 默认值：-
   */
  pagination: PropTypes.object,

  /**
   * 搜索时的回调
   */
  onSearch: PropTypes.func,

  /**
   * 是否有放大缩小按钮
   * 默认：true
   */
  hasZoomInOut: PropTypes.bool,

  /**
   * 点击放大按钮的回调
   */
  onZoomIn: PropTypes.func,

  /**
   * 点击缩小按钮的回调
   */
  onZoomOut: PropTypes.func
};
