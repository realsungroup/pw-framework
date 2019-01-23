import PropTypes from 'prop-types';

export const defaultProps = {
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm',
  space: 4
};

export const propTypes = {
  /**
   * 日期显示格式化
   * 默认：'YYYY-MM-DD'
   */
  dateFormat: PropTypes.string,

  /**
   * 时间显示格式化
   * 默认：'HH:mm'
   */
  timeFormat: PropTypes.string,

  /**
   * 组件间的间隔(px)
   * 默认：4
   */
  space: PropTypes.number,

  /**
   * date picker props
   */
  datePickerProps: PropTypes.object,

  /**
   * time picker props
   */
  timePickerProps: PropTypes.object
};
