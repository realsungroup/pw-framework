import PropTypes from 'prop-types';

export const defaultProps = {
  size: 'middle'
};

export const propTypes = {
  /**
   * 按钮大小
   * 默认：'middle'
   */
  size: PropTypes.oneOf(['large', 'middle', 'small']),

  /**
   * 后端按钮类型
   * 可选：'multiple' 操作多条记录的后端按钮 | 'single' 操作一条记录的后端按钮
   */
  backendBtnType: PropTypes.oneOf(['multiple', 'single']).isRequired,

  /**
   * 后端按钮信息
   */
  btnInfo: PropTypes.object.isRequired,

  /**
   * 点击后端按钮的回调函数，Type 的值不同，传给 onConfirm 的参数也不一样：
   * 当 Type =
   * 1 时：onConfirm(1, records)； // 1 为 Type 的值；records 为记录
   * 4 时：onConfirm(4, records)； // 4 为 Type 的值；records 为记录
   * 5 时：onConfirm(4, records)； // 5 为 Type 的值；records 为记录
   * 6 时：onConfirm(6, records, formData, defaultRecord) // 6 为 Type 的值；records 为记录；formData defaultRecord 为 btnInfo 中预设的记录默认值
   * 7 时：onConfirm(7, records, formData, defaultRecord) // 7 为 Type 的值；records 为记录；formData defaultRecord 为 btnInfo 中预设的记录默认值
   * 8 时：onConfirm(8, records, formData, defaultRecord) // 8 为 Type 的值；records 为记录；formData 为请求到的窗体数据
   */
  onConfirm: PropTypes.func.isRequired,

  /**
   * 后端按钮所在表的 resid
   */
  resid: PropTypes.number.isRequired,

  /**
   * 后端按钮所操作的记录（当 btnInfo.isUsePopconfirm 为 true 时，这是一个必传的参数）
   */
  records: function(props, propName, componentName) {
    if (props.btnInfo.isUsePopconfirm && !Array.isArray(props[propName])) {
      return new Error(
        `在 ${componentName} 中，当 btnInfo.isUsePopconfirm 为 true 时，${propName} 必传，且类型为 array`
      );
    }
  },

  /**
   * 当 btnInfo.Type 为 4 时，打开新的页面的地址（当 btnInfo.Type 为 4 时，必传）
   */
  url: function(props, propName, componentName) {
    if (props.btnInfo.Type === 4 && typeof props[propName] === 'string') {
      return new Error(
        `在 ${componentName} 中，当 btnInfo.Type 为 4 时，${propName} 必传，且类型为 string`
      );
    }
  }
};
