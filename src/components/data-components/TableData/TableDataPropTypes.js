import PropTypes from 'prop-types';

export const tableDataDefaultPropTypes = {
  size: 'middle',
  dataMode: 'main',
  hasAdd: true,
  hasModify: true,
  hasDelete: true,
  hasBeSort: true,
  defaultColumnWidth: 200,
  hasRowModify: true,
  hasRowView: true,
  hasRowDelete: true,
  hasBeBtns: false,
  actionBarWidth: 300,
  actionBarFixed: true,
  recordFormName: 'default',
  editFormName: 'default',
  subtractH: 0,
  advSearchFormName: 'default',
  recordFormType: 'modal',
  recordFormContainerProps: {},
  advSearchValidationFields: [],
  hasRowEdit: false,
  hasAdvSearch: true,
  advSearchContainerType: 'drawer',
  formProps: {},
  hasResizeableBox: false,
  width: '100%',
  height: '100%',
  hasZoomInOut: true,
  defaultPagination: {
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true
  },
  bordered: true
};

export const tableDataPropTypes = {
  /**
   * 表格标题
   */
  title: PropTypes.string,

  /**
   * 数据模式
   * 可选：'main' | 'sub'
   * 默认：'main'
   * 描述：'main' 表示主表数据；'sub' 表示子表数据
   */
  dataMode: PropTypes.oneOf(['main', 'sub']),

  /**
   * 表格尺寸
   * 默认：'middle'
   */
  size: PropTypes.oneOf(['large', 'middle', 'small']),

  /**
   * 表格宽度
   * 默认：'100%'
   */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * 表格高度
   * 默认：'100%'
   */
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * 主表id
   * 默认：-
   */
  resid: PropTypes.number.isRequired,

  /**
   * 预设查询编号
   * 默认：-
   */
  mtsid: PropTypes.number,

  /**
   * 子表 id
   * 默认：-
   */
  subresid: (props, propName, componentName) => {
    // 当 dataMode 为 "sub" 时，subresid 是必传的
    if (props.dataMode === 'sub') {
      return typeof props[propName] === 'number'
        ? null
        : new Error('lz-table: subresid 无效，subresid 必须为 number 类型');
    }
  },

  /**
   * 主表记录编号
   * 默认：-
   */
  hostrecid: (props, propName, componentName) => {
    // 当 dataMode 为 "sub" 时，hostrecid 是必传的
    if (props.dataMode === 'sub') {
      return typeof props[propName] === 'number'
        ? null
        : new Error('lz-table: hostrecid 无效，hostrecid 必须为 number 类型');
    }
  },

  /**
   * 要获取数据的字段
   * 默认：-
   * 例子：'C3_511302422114,C3_511302066880,C3_511302131411'
   */
  cmscolumns: PropTypes.string,

  /**
   * 表 cmswhere 查询的字符串
   * 默认：-
   * 例子：'C3_511302422114=1,C3_511302066880,C3_511302131411'
   */
  cmswhere: PropTypes.string,

  // 按钮相关的 props
  /**
   * 默认分页配置
   * 默认：{ current: 1, pageSize: 10 }
   */
  defaultPagination: PropTypes.object,

  /**
   * 是否有后端排序功能
   * 默认：true
   */
  hasBeSort: PropTypes.bool,

  // ===========================================================
  // 表格列相关的 props ==========================================
  // ===========================================================
  /**
   * 默认列宽度
   * 默认：200
   */
  defaultColumnWidth: PropTypes.number,

  /**
   * 自定义列宽度
   * 默认：-
   * 如：{ '姓名': 100, '工号': 150 }
   */
  columnsWidth: PropTypes.object,

  /**
   * 固定列
   * 默认：-
   * 如：['姓名', '工号']
   */
  fixedColumns: PropTypes.array,

  // ===========================================================
  // 操作栏相关的 props ===============================================
  // ===========================================================
  /**
   * 操作栏的宽度
   * 默认：300
   */
  actionBarWidth: PropTypes.number,

  /**
   * 操作栏是否固定在右侧（注意：固定列时，不能开启行内编辑功能）
   * 默认：true
   */
  actionBarFixed: PropTypes.bool,

  // ===========================================================
  // 窗体名称相关的 props =========================================
  // ===========================================================
  /**
   * 记录表单所用窗体的窗体名称
   * 默认：default
   */
  recordFormName: PropTypes.string,

  /**
   * 行内编辑所用窗体的窗体名称
   * 默认：default
   */
  rowEditFormName: PropTypes.string,

  /**
   * 记录表单中 PwForm 组件接收的 props
   * 默认：{}
   */
  formProps: PropTypes.object,

  /**
   * 高级字典表格的配置
   * 默认：-
   */
  AdvDicTableProps: PropTypes.object,

  /**
   * 自定义行按钮
   * 默认：-
   */
  customRowBtns: PropTypes.array,

  /**
   * 表格高度 - scroll.y 的值
   * 默认：0
   */
  subtractH: PropTypes.number,

  // ===========================================================
  // 按钮相关的 props ============================================
  // ===========================================================
  /**
   * 是否有添加按钮
   * 默认：true
   */
  hasAdd: PropTypes.bool,

  /**
   * 是否有修改按钮
   * 默认：true
   */
  hasModify: PropTypes.bool,

  /**
   * 是否有删除按钮
   * 默认：true
   */
  hasDelete: PropTypes.bool,

  /**
   * 是否有行编辑按钮（注意：开启行内编辑时，不能固定操作栏！）
   * 默认：false
   */
  hasRowEdit: PropTypes.bool,

  /**
   * 是否有行修改按钮
   * 默认：true
   */
  hasRowModify: PropTypes.bool,

  /**
   * 是否有行查看按钮
   * 默认：true
   */
  hasRowView: PropTypes.bool,

  /**
   * 是否有行删除按钮
   * 默认：true
   */
  hasRowDelete: PropTypes.bool,

  /**
   * 是否有后端按钮
   * 默认：false
   */
  hasBeBtns: PropTypes.bool,

  /**
   * 渲染自定义行按钮：为一个函数数组
   * 默认：-
   */
  renderRowBtns: PropTypes.array,

  // 高级搜索相关 props
  /**
   * 是否有高级搜索功能
   * 默认：true
   */
  hasAdvSearch: PropTypes.bool,

  /**
   * 高级搜索所在的容器类型：'modal' 模态窗 | 'drawer' 抽屉
   * 默认：'drawer'
   */
  advSearchContainerType: PropTypes.oneOf(['modal', 'drawer']),

  /**
   * 高级搜索使用的窗体名称
   * 默认：'default'
   */
  advSearchFormName: PropTypes.string,

  /**
   * 高级搜索中容器组件所接收的 props
   * 默认：-
   */
  advSearchContainerProps: PropTypes.object,

  /**
   * 高级搜索中 PwForm 组件所接收的 props
   * 默认：-
   */
  advSearchFormProps: PropTypes.object,

  /**
   * 高级搜索中需要验证的字段，如：['name', 'age']
   * 默认：[]，表示不验证任何字段
   */
  advSearchValidationFields: PropTypes.array,

  // ===========================================================
  // 下载文件相关 props ==========================================
  // ===========================================================
  /**
   * 下载的文件名称：若此值为 undefined，则会使用 title 作为下载的文件名称
   * 默认：-
   */
  downloadFileName: PropTypes.string,

  /**
   * 下载的文件类型
   * 默认：'xls'
   */
  fileType: PropTypes.string,

  // ===========================================================
  // 记录表单相关 props ==========================================
  // ===========================================================
  /**
   * 记录表单所在容器的类型
   * 可选: 'modal' 模态窗 | 'drawer' 抽屉
   * 默认：'modal'
   */
  recordFormType: PropTypes.oneOf(['modal', 'drawer']),

  /**
   * 记录表单容器（Modal/Drawer）所接收的 props
   * 默认：-
   */
  recordFormContainerProps: PropTypes.object,

  // ===========================================================
  // 记录表单中的子表相关 props ===================================
  // ===========================================================

  /**
   * 记录表单中的子表配置
   * 默认：-
   */
  subTableArrProps: PropTypes.array,
  // [
  //   {
  //     subTableName: '子表',
  //     subResid: 666,
  //     tableProps: {
  //       width: 777,
  //       height: 888
  //     }
  //   }
  // ]

  /**
   * 内部字段数组（修改了该数组内的内部字段所对应的控件的值之后，会调用 api 请求后端使用计算公式计算出保存前的记录）
   * 默认：-
   * 例如：['C3_592244738975', 'C3_592244739145']
   */
  beforeSaveFields: PropTypes.array,

  /**
   * 是否有缩放表格功能（放大缩小功能与 hasResizeableBox 不能同时开启）
   * 默认：false
   */
  hasResizeableBox: PropTypes.bool,

  /**
   * 是否有放大缩小按钮（放大缩小功能与 hasResizeableBox 不能同时开启）
   * 默认：true
   */
  hasZoomInOut: PropTypes.bool,

  /**
   * 是否有边框
   * 默认：true
   */
  bordered: PropTypes.bool
};
