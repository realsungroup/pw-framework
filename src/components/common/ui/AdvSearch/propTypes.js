import PropTypes from 'prop-types';

export const defaultProps = {
  fields: [],
  confirmText: '确定',
  enConfirmText: 'Confirm'
};

export const propTypes = {
  /**
   * 可高级查询的字段
   * 默认：[]
   */
  fields: PropTypes.arrayOf(
    PropTypes.string,
    PropTypes.shape({
      field: PropTypes.string, // 字段名称
      control: PropTypes.string // 所用控件名称
    })
  ),
  // 如：
  // [
  //   'name',
  //   {
  //     field: 'birthday',
  //     control: 'DatePicker',
  //   },
  //   'age',
  //   {
  //     field: 'married',
  //     control: 'Checkbox'
  //   }
  // ]
  /**
   * 确定按钮文本（中文）
   * 默认：'确定'
   */
  confirmText: PropTypes.string,

  /**
   * 确定按钮文本（英文）
   * 默认：'Confirm'
   */
  enCofirmText: PropTypes.string
};
