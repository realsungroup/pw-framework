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
  modalFormName: 'default',
  subtractH: 0,
  advSearchFormName: 'default',
  recordFormType: 'modal',
  recordFormContainerProps: {}
};

export const tableDataPropTypes = {
  /**
   * 表格尺寸
   * 默认：'middle'
   */
  size: PropTypes.oneOf(['large', 'middle', 'small']),

  /**
   * 宽度
   * 默认
   */
  width: PropTypes.number,

  /**
   * 高度
   */
  height: PropTypes.number,

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
   * 主表id
   */
  resid: PropTypes.number.isRequired,

  /**
   * 预设查询编号
   */
  mtsid: PropTypes.number,

  /**
   * 子表 id
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

  /**
   * 窗体名称
   * 默认：'default'，相当于：
   * {
   *   rowFormName: 'default', //  rowFormName 表示行内编辑所用的窗体名称
   *   formFormName: 'default' // formFormName 表示表单中所用的窗体名称
   * }
   * 如果 formsName 的类型为字符串，则 “行内编辑所用的窗体名称” 和 “表单中所用的窗体名称” 相同
   */
  formsName: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

  // 按钮相关的 props
  /**
   * 默认分页配置
   * -
   */
  defaultPagination: PropTypes.object,

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

  /**
   * 是否有后端排序功能
   * 默认：true
   */
  hasBeSort: PropTypes.bool,

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
   * 操作栏的宽度
   * 默认：300
   */
  actionBarWidth: PropTypes.number,

  /**
   * 操作栏是否固定在右侧
   * 默认：true
   */
  actionBarFixed: PropTypes.bool,

  /**
   * 固定列
   * 默认：-
   * 如：['姓名', '工号']
   */
  fixedColumns: PropTypes.array,

  /**
   * 模态窗中表单的 formname
   * 默认：default
   */
  modalFormName: PropTypes.string,

  /**
   * PwForm 表单组件接收的 props
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

  /**
   * 高级搜索使用的窗体名称
   * 默认：'default'
   */
  advSearchFormName: PropTypes.string,

  /**
   * 高级搜索中 Drawer 组件所接收的 props
   * 默认：-
   */
  advSearchDrawerProps: PropTypes.object,

  /**
   * 高级搜索中 PwForm 组件所接收的 props
   * 默认：-
   */
  advSearchFormProps: PropTypes.object,

  // 下载相关 props
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

  // 记录表单相关 props
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
  recordFormContainerProps: PropTypes.object
};
