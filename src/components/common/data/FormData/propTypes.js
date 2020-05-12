import PropTypes from 'prop-types';

export const defaultProps = {
  data: [],
  record: {},
  operation: 'add',
  formProps: {},
  width: {
    formWidth: '30%',
    tabsWidth: '70%'
  },
  storeWay: 'be',
  subTableArrProps: [],
  subTalbeLayout: 'tab'
};

export const propTypes = {
  /**
   * 宽度配置
   * 默认：width = { formWidth: '50%', tabsWidth: '50%' }
   */
  width: PropTypes.shape({
    formWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tabsWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),

  /**
   * PwForm 接收的 data prop
   * 默认：[]
   */
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
   * 保存成功后的回调函数：(operation, formData, record, form) => {}；operation 表示操作；formData 表示修改后的表单数据；record 表示 当前记录；form 表示对象
   * 默认：-
   */
  onSuccess: PropTypes.func,

  /**
   * 点击取消按钮后的回调函数
   * 默认：-
   */
  onCancel: PropTypes.func,

  /**
   * 表单中的子表数组
   */
  // subTableArr = [
  //   {
  //     subResid: 666,
  //     // ...其他属性
  //   },
  //   {
  //     subResid: 666,
  //     // ...其他属性
  //   }
  // ]
  subTableArr: PropTypes.array,

  /**
   * 表单中子表接收的 props
   */
  subTableArrProps: PropTypes.array,

  /**
   * 添加、修改的数据所使用的存储方式
   * 可选：'be' 后端存储；'fe' 前端存储
   * 默认：'be'
   */
  storeWay: PropTypes.oneOf(['be', 'fe']),

  /**
   * 数据库链接名称（当你想要用其他数据库时使用）
   * 默认：-
   */
  dblinkname: PropTypes.string,

  /**
   * 子表布局
   * 默认：'tab' 每一个子表存在于标签页中 | 'grid' 每一个子表使用栅格布局
   */
  subTalbeLayout: PropTypes.oneOf(['tab', 'grid'])
};
