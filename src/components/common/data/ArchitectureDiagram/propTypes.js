import PropTypes from 'prop-types';

export const defaultProps = {
  level: 3
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
   * 根节点表id
   * 是否必须: 是
   * 默认: -
   * 描述: 存放跟节点表id
   */
  rootResid: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
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
   * 历史表的说明字段
   * 是否必须: 是
   * 默认: -
   * 描述: 用于区分不同的主表数据的历史记录
   */
  remarkField: PropTypes.string.isRequired,

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
   * 分组配置
   * 是否必须: 否
   * 默认: -
   * 描述: 进行分组的配置
   */
  groupConfig: PropTypes.arrayOf(
    PropTypes.shape({
      ResourceOfTag: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      SourceColumnOfGroupName: PropTypes.string,
      SourceColumnOfTagName: PropTypes.string,
      ColumnOfTagName: PropTypes.string,
      IsGroupTag: PropTypes.bool
    })
  ).isRequired,

  /**
   * 基地址
   * 是否必须: 否
   * 默认: -
   * 描述: -
   */
  baseURL: PropTypes.string
};
