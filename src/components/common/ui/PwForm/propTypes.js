import PropTypes from 'prop-types';

export const defaultProps = {
  mode: 'edit',
  colCount: 1,
  hasEdit: true,
  hasSave: true,
  hasCancel: true,
  displayMode: 'default',
  saveText: '保存',
  enSaveText: 'Save',
  saveOpenText: '保存并打开',
  enSaveOpenText: 'saveAndOpen',
  cancelText: '取消',
  enCancelText: 'Cancel',
  editText: '编辑',
  enEditText: 'Edit',
  layout: 'grid'
};

export const propTypes = {
  /**
   * 模式：'edit' 编辑模式 | 'view' 查看模式
   * 默认：'view'
   */
  mode: PropTypes.oneOf(['edit', 'view']),

  /**
   * 宽度
   * 默认：-
   */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * 高度
   * 默认：-
   */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * 显示模式：'default' 默认显示模式 | 'classify' 折叠面板形式的分类显示模式
   * 默认：'default'
   */
  displayMode: PropTypes.oneOf(['default', 'classify']),

  /**
   * 渲染表单控件的数据
   * 默认：-
   */
  data: PropTypes.array.isRequired,
  // data 格式：displayMode 为 default 时
  // [
  //   {
  //     id: 'name', // 字段名称
  //     label: '姓名', // label
  //     value: '肖磊', // 初始值
  //     labelCol: 8, // label 所占列
  //     wrapperCol: 16, // 控件 所占列
  //     rules: [{ required: true, message: '请输入姓名' }], // 验证规则
  //     name: 'Input', // 控件名称
  //     props: { // 控件所接收的 props
  //       type: 'number'
  //     }
  //   }
  // ];

  // data 格式：displayMode 为 classify 时
  // [
  //   {
  //     type: '基本信息',
  //     data: [
  //       {
  //         id: 'name', // 字段名称
  //         label: '姓名', // label
  //         value: '肖磊', // 初始值
  //         labelCol: 8, // label 所占列
  //         wrapperCol: 16, // 控件 所占列
  //         rules: [{ required: true, message: '请输入姓名' }], // 验证规则
  //         name: 'Input', // 控件名称
  //         props: { // 控件所接收的 props
  //           type: 'number'
  //         }
  //       }
  //     ]
  //   }
  // ]

  /**
   * 布局方式
   * 默认：'grid'
   */
  layout: PropTypes.oneOf(['grid', 'float']),

  /**
   * 列数量
   * 默认：1
   */
  colCount: PropTypes.number,

  /**
   * label 宽度所占列数量
   * 默认：-
   */
  labelCol: PropTypes.number,

  /**
   * 控件 宽度所占列数量
   * 默认：-
   */
  wrapperCol: PropTypes.number,

  /**
   * 是否有编辑按钮
   * 默认：true
   */
  hasEdit: PropTypes.bool,

  /**
   * 点击编辑时的回调函数
   * 默认：-
   */
  onEdit: PropTypes.func,

  /**
   * 是否有保存按钮
   * 默认：true
   */
  hasSave: PropTypes.bool,

  /**
   * 点击保存时的回调函数，如：(form) => {}，form 为包含 getFieldsValue/setFieldsValue/validateFields 方法的对象
   * 默认：-
   */
  onSave: PropTypes.func,

  /**
   * 是否有取消编辑按钮
   * 默认：true
   */
  hasCancel: PropTypes.bool,

  /**
   * 点击取消时的回调函数
   * 默认：-
   */
  onCancel: PropTypes.func,

  /**
   * 确认按钮文案
   * 默认：'保存'
   */
  saveText: PropTypes.string,

  /**
   * 取消按钮文案
   * 默认：'取消'
   */
  cancelText: PropTypes.string,

  /**
   * 确认按钮文案
   * 默认：'保存'
   */
  saveOpenText: PropTypes.string,

  /**
   * 取消按钮文案
   * 默认：'取消'
   */
  enSaveOpenText: PropTypes.string,

  /**
   * 编辑按钮文案
   * 默认：'编辑'
   */
  editText: PropTypes.string,

  /**
   * 字段显示的顺序（每一个元素为字段的名称，索引为序号）
   * 默认：-
   */
  fieldsOrder: PropTypes.array
};
