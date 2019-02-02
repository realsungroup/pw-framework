import PropTypes from 'prop-types';

export const defaultProps = {
  idField: 'id',
  pidField: 'pid',
  template: 'rony',
  lazyLoading: true,
  isExpandAllChildren: true,
  isClassifyLayout: false,
  recordFormType: 'drawer',
  enableDragDrop: false,
  // rootIds: ['0'],
  level: 16,
  recordFormContainerProps: {},
  orientation: 'top',
  padding: 0,
  mode: 'normal',
  advSearchFormName: 'search',
  settingStatus: 'min'
};

export const propTypes = {
  /**
   * OrgChart 的 id
   */
  chartId: PropTypes.string.isRequired,

  /**
   * OrgChart 父节点的 id
   */
  chartWrapId: PropTypes.string.isRequired,

  /**
   * 获取根节点的资源 id
   */
  rootIdsResid: PropTypes.number.isRequired,

  /**
   * 节点 id 对应的字段
   * 默认：'id'
   */
  idField: PropTypes.string,

  /**
   * 父节点 id 对应的字段
   * 默认：'pid'
   */
  pidField: PropTypes.string,

  /**
   * 资源 id
   */
  resid: PropTypes.number.isRequired,

  /**
   * 节点所使用的模板
   * 默认：'rony'
   */
  template: PropTypes.oneOf([
    'luba',
    'derek',
    'olivia',
    'diva',
    'mila',
    'polina',
    'mery',
    'rony',
    'belinda',
    'ula',
    'ana'
  ]),

  /**
   * 方向
   * 默认：'top'
   */
  orientation: PropTypes.oneOf([
    'top',
    'bottom',
    'right',
    'left',
    'top_left',
    'bottom_left',
    'right_top',
    'left_top'
  ]),

  /**
   * 是否使用懒加载
   * 默认：true
   */
  lazyLoading: PropTypes.bool,

  /**
   * 是否展开所有的子节点
   * 默认：true
   */
  isExpandAllChildren: PropTypes.bool,

  /**
   * 记录表单是否使用分类布局
   * 默认：false
   */
  isClassifyLayout: PropTypes.bool,

  /**
   * 是否可拖拽节点
   * 默认：false
   */
  enableDragDrop: PropTypes.bool,

  /**
   * 从后端请求到的节点的层级
   * 默认：8（最小值为 0 ，不会请求到节点；最大值为 8，会请求 8 层的节点数据）
   */
  level: PropTypes.number,

  /**
   * 根节点 id：可以用多个根节点 id
   * 默认：['0']
   */
  // rootIds: PropTypes.array,

  /**
   * 显示的字段：在卡片上显示的字段（支持最多 6 个字段）
   * 默认：-
   */
  showFields: PropTypes.object.isRequired,
  //如： {
  //   field_0: 'name',
  //   field_1: 'title',
  //   field_2: 'age',
  //   field_3: 'sex',
  //   field_4: 'phone',
  //   field_5: 'email',
  //   img_0: 'image'
  // }

  // ====================================================
  // 记录表单相关的配置
  // ====================================================
  /**
   * 记录表单的容器类型：'modal' 模态窗 | 'drawer' 抽屉
   * 默认：drawer
   */
  recordFormType: PropTypes.oneOf(['modal', 'drawer']),

  /**
   * 显示记录表单的容器（modal or drawer）接收的 props
   * 默认：{}
   */
  recordFormContainerProps: PropTypes.object,

  /**
   * PwForm 组件接收的 props
   * 默认：{}
   */
  formProps: PropTypes.object,

  /**
   * OrgChart 的 padding
   * 默认：-200
   */
  padding: PropTypes.number,

  /**
   * 显示模式：'normal' 普通模式 | 'grouping' 分组模式
   * 默认：'normal'
   */
  mode: PropTypes.oneOf(['normal', 'grouping']),

  /**
   * 分组配置
   */
  groupingConfig: PropTypes.array,
  // [
  //   {
  //     resourceOfTag: '111', // tag 的资源 id
  //     sourceColumnOfGroupName: '222', // 分组名称的字段名
  //     sourceColumnOfTagName: '333', // tag 名称的字段名
  //     columnOfTagName: '444',
  //     sourceColumnOfTemplate: '', // 分组所用模板名称
  //     isGroupTag: true // 是否分组
  //   }
  // ]

  /**
   * 高级搜索窗体名称
   * 默认：'search'
   */
  advSearchFormName: PropTypes.string,

  /**
   * 关键字段（在拖拽提示中会使用到）
   * 默认：-
   */
  keyField: PropTypes.string.isRequired,

  /**
   * 设置栏状态：'max' 最大化 | 'min' 最小化
   * 默认：'min'
   */
  settingStatus: PropTypes.oneOf(['max', 'min'])
};
