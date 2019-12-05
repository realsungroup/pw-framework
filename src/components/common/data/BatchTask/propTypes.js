import PropTypes from 'prop-types';

export const defaultProps = {
  batchsize: 500
};

export const propTypes = {
  /*
   * 每个批处理任务大小
   * 选传
   * 默认:500
   * 描述:
   */
  batchsize: PropTypes.number,
  /*
   * 每个批处理任务大小
   * 必传
   * 默认:500
   * 描述:
   */
  keycolumn: PropTypes.number,
  /*
   * 每个批处理任务大小
   * 必传
   * 默认:500
   * 描述:
   */
  keyparm: PropTypes.number,
  /*
   * 批处理任务的id
   * 必传
   * 默认: -
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /*
   * 批处理任务的id
   * 必传
   * 默认: -
   */
  resid: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
