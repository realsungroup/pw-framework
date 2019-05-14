import PropTypes from 'prop-types';

export const defaultProps = {
  stepList: [],
  searchConfig: {
    title: '全员搜索',
    visible: true
  },
  list: [],
  secondFilterInputPlaceholder: ''
};

export const propTypes = {
  /**
   * 顶部单选按钮组配置
   * 默认：[]
   */
  radioGroupConfig: PropTypes.array,
  // [
  //   {
  //     type: 'tree', // 类型：'tree' 表示树；'list' 表示列表；'search' 表示模糊搜索；'file' 表示文件
  //     title: '按部门添加’, // 单选按钮文字
  //     resid: 666, // 资源 id,
  //     nameField: 'title', // 节点名称对应的字段
  //     idField: 'id', // id 字段
  //     pidField: 'pid', // 父 id 字段
  //   },
  //   {
  //     type: 'list', // 类型：'tree' 表示树；'list' 表示列表；'search' 表示模糊搜索；'file' 表示文件
  //     title: '按产线添加', // 单选按钮文字
  //     resid: 777, // 资源 id,
  //     nameField: 'title', // 列表项名称对应的字段
  //   },
  //   {
  //     type: 'search',  // 类型：'tree' 表示树；'list' 表示列表；'search' 表示模糊搜索；'file' 表示文件
  //     title: '搜索', // 单选按钮文字
  //   },
  //   {
  //     type: 'file',  // 类型：'tree' 表示树；'list' 表示列表；'search' 表示模糊搜索；'file' 表示文件
  //     title: '选择文件’, // 单选按钮文字
  //   }
  // ]

  /**
   * 子表 id
   * 默认：-
   */
  subResid: PropTypes.number.isRequired,

  /**
   * 显示个人信息的字段：目前支持显示人员的 4 个字段，且第一个字段为头像字段（无头像时，请传空字符串）
   * 默认：-
   */
  // 如： ['', 'C3_227192472953', 'C3_227192484125', 'C3_227212499515']；第一个为头像内部字段；第二个为工号内部字段；第三个为姓名内部字段；第四个为部门内部字段
  personFields: PropTypes.array.isRequired,

  /**
   * 人员主键字段
   * 默认：-
   */
  // 如：'C3_227192484125' 人员工号的内部字段
  personPrimaryKeyField: PropTypes.string.isRequired,

  /**
   * 第二步以及之后的步骤
   * 默认：[]
   */
  stepList: PropTypes.array,
  // [
  //   {
  //     stepTitle: '选择日期',
  //     renderContent: (current) => {},
  //     canToNext: () => true // 能够进入下一步的验证函数：当函数返回 true 时，点击下一步就可以进入下一步；否则就不能进入下一步
  //   }
  // ]

  /**
   * 二次筛选输入框的 placeholder
   * 默认：''
   */
  secondFilterInputPlaceholder: PropTypes.string,

  /**
   * 点击完成
   * 例如：() => {}
   */
  onComplete: PropTypes.func.isRequired,

  /**
   * 选择人员（可利用此函数将选好的人存储在父组件中）
   * 例如：(personList) => {}
   */
  onSelectPerson: PropTypes.func.isRequired,

  /**
   * 完成的文案
   * 默认：'完成'
   */
  completeText: PropTypes.string
};
