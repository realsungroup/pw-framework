import PropTypes from 'prop-types';

export const defaultProps = {
  nodeId: 'id',
  parentNodeId: 'pid',
  template: 'ana',
  lazyLoading: true,
  isExpandAllChildren: true
};

export const propTypes = {
  /**
   * 节点 id 对应的字段
   * 默认：'id'
   */
  nodeId: PropTypes.string,

  /**
   * 父节点 id 对应的字段
   * 默认：'pid'
   */
  parentNodeId: PropTypes.string,

  /**
   * 资源 id
   */
  resid: PropTypes.number.isRequired,

  /**
   * OrgChartData 的 id
   */
  id: PropTypes.string.isRequired,

  /**
   * 节点所使用的模板
   * 默认：'ana'
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
   * 是否使用懒加载
   * 默认：true
   */
  lazyLoading: PropTypes.oneOf([true, false]),

  /**
   * 显示 n 层节点
   * 默认：-
   */
  level: PropTypes.number,

  /**
   * 是否展开所有的子节点
   * 默认：true
   */
  isExpandAllChildren: PropTypes.oneOf([true, false])
};
