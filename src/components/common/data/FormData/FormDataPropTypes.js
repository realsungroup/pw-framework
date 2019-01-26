import PropTypes from 'prop-types';

export const defaultProps = {
  record: {},
  operation: 'add',
  formProps: {}
};

export const propTypes = {
  data: PropTypes.array,

  /**
   * 表单记录
   * 默认：{}
   */
  record: PropTypes.object,

  /**
   * 对表单的操作：'add' 添加 | 'modify' 修改 | 'view' 查看
   * 默认：'add'
   */
  operation: PropTypes.oneOf(['add', 'modify', 'view']),

  /**
   * PwForm 的 props
   * 默认：{}
   */
  formProps: PropTypes.object,

  /**
   * 添加、修改 所需要的信息：{ dataMode, resid, subresid, hostrecid }
   * 默认：-
   */
  info: PropTypes.object,

  /**
   * 保存成功后的回调函数
   * 默认：-
   */
  onConfirm: PropTypes.func,

  /**
   * 点击取消按钮后的回调函数
   * 默认：-
   */
  onCancel: PropTypes.func,

  /**
   * 表单中的子表数组
   */
  subTableArr: PropTypes.array,

  /**
   * 表单中子表接收的 props
   */
  subTableArrProps: PropTypes.array
};
