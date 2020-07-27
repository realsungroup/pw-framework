import PropTypes from 'prop-types';

export const defaultProps = {
  displayMode: 'view',
  uploadUrl:
    'http://kingofdinner.realsun.me:8081/rispweb/rispservice/SvcUploadFile2.aspx?savepath=C:\\web\\web\\rispweb\\upfiles&httppath=http://kingofdinner.realsun.me:8081/rispweb/upfiles'
};

export const propTypes = {
  /**
   * 描述控件的数据
   */
  dataItem: PropTypes.object.isRequired,

  /**
   * form 对象
   */
  form: PropTypes.object.isRequired,

  /**
   * 控件显示状态
   * 可选：'edit' 编辑状态 | 'view' 查看状态
   * 默认：'view'
   */
  mode: PropTypes.oneOf(['edit', 'view']),

  /**
   * 操作
   * 可选：'add' 添加 | 'modify' | 'view' 查看
   */
  operation: PropTypes.string,

  /**
   * 资源 id
   */
  resid: PropTypes.number,

  /**
   * 是否能够通过计算公式获取保存之前的记录
   */
  hasBeforeSave: PropTypes.bool,

  /**
   * 基地址
   * 默认：-
   */
  baseURL: PropTypes.string,

  /**
   * 多媒体字段值（值为地址）的基地址
   * 默认：-
   */
  mediaFieldBaseURL: PropTypes.string,
};
