import PropTypes from 'prop-types';

export const defaultProps = {
  fields: []
};

export const propTypes = {
  /**
   * 可高级查询的字段
   * 默认：[]
   */
  fields: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      field: PropTypes.string, // 字段名称
      control: PropTypes.string // 所用控件名称
    })
  ])
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
};
