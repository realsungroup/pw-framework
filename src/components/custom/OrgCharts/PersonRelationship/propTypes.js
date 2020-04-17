import PropTypes from 'prop-types';

export const defaultProps = {
  level: 3,
  hasOpration: true,
  hasImport: true,
  hasGroup: true,
  hasDepartmentFilter: true
};

export const propTypes = {
  /**
   * 主表id
   * 是否必须: 是
   * 默认: -
   * 描述: 主表的id
   */
  resid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  /**
   * 历史表id
   * 是否必须: 是
   * 默认: -
   * 描述: 与主表关联的历史表id
   */
  historyResid: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,

  /**
   * id字段
   * 是否必须: 是
   * 默认: -
   * 描述: 定义orgchart时用到 https://balkangraph.com/OrgChartJS/Docs/GettingStarted
   */
  idField: PropTypes.string.isRequired,

  /**
   * pid
   * 是否必须: 是
   * 默认: -
   * 描述: 定义orgchart时用到 https://balkangraph.com/OrgChartJS/Docs/GettingStarted
   */
  pidField: PropTypes.string.isRequired,

  /**
   * 初始层级数
   * 是否必须: 否
   * 默认: 3
   * 描述: 初始显示的层级数量
   */
  level: PropTypes.number, //初始层级数

  /**
   * 卡片显示的字段
   * 是否必须: 是
   * 默认: -
   * 描述: 每个卡片上显示的内容字段
   */
  displayFileds: PropTypes.shape({
    // 主要字段
    firstField: PropTypes.string,
    // 次要字段
    secondaryField: PropTypes.string,
    // 图片字段
    imgField: PropTypes.string
  }).isRequired,

  /**
   * 基地址
   * 是否必须: 否
   * 默认: -
   * 描述: -
   */
  baseURL: PropTypes.string,

  hasOpration: PropTypes.bool,
  hasImport: PropTypes.bool,
  hasGroup: PropTypes.bool,
  hasDepartmentFilter: PropTypes.bool
};
