import PropTypes from 'prop-types';

export const defaultProps = {
  stepList: [],
  searchConfig: {
    title: '全员搜索',
    visible: true
  },
  treeConfig: {
    title: '按部门搜索',
    visible: true
  }
};

export const propTypes = {
  /**
   * tree 配置
   * 默认：{ title: '按部门搜索', visible: true }
   */
  treeConfig: PropTypes.shape({
    title: PropTypes.string, // 标题
    resid: PropTypes.number // 树组件中数据的主表 id
  }),

  /**
   * listConfig 配置（即主子表配置）
   * 默认：-
   */
  listConfig: PropTypes.array.isRequired,
  // [
  //   {
  //     title: '按班组添加', // 分组名称
  //     titleFieldName: 'DESCP', // 显示在 radio 按钮上文字对应的内部字段
  //     resid: 593017031990, // 主表 id
  //   },
  // ]

  /**
   * 搜索配置
   * 默认：{ title: '全员搜索'}
   */
  searchConfig: PropTypes.shape({
    title: PropTypes.string // 标题
  }),

  /**
   * 子表 id
   * 默认：-
   */
  subResid: PropTypes.number.isRequired,

  /**
   * 显示个人信息的字段
   * 默认：
   */
  // 如： ['', 'C3_227192472953', 'C3_227192484125', 'C3_227212499515']；第一个为头像内部字段；第二个为工号内部字段；第三个为姓名内部字段；第四个为部门内部字段
  personFields: PropTypes.array,

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
   * LzSteps 是否处于加载状态
   * 默认：false
   */
  stepsLoading: PropTypes.bool,

  /**
   * 完成的文案
   * 默认：'完成'
   */
  completeText: PropTypes.string
};
