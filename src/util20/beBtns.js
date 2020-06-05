import cloneDeep from 'lodash.clonedeep';

/**
 * 按钮字段说明：
 *
 * Name1：按钮名称
 *
 * Type：按钮行为类型
 *   1 发送请求操作单条记录；
 *   4 跳转网页；
 *   5 发送请求操作多条记录；
 *   6 打开指定的 formName 的表单进行编辑）；
 *
 * Code：发送给后台的 strCommand 参数值
 *
 * OkMsgCn：点击按钮成功后的提示信息
 *
 * FailMsgCn：点击按钮失败后的提示信息
 *
 * FormName：窗体名称
 */

/**
 * 一、提取后端两种不同的按钮
 * 1.可以操作多条记录的后端按钮：beBtnsMultiple
 * 2.只能操作单条记录的后端按钮：beBtnsSingle
 * 3.其他按钮（打开模态窗中的表单）：beBtnsOther
 *
 * 二、并且处理
 * 1.根据 Type 判断是否使用该按钮是否使用 Popconfirm 组件（Type 为 1 | 5 时，该按钮使用 Popconfirm 组件）
 *
 * @param {array} btnsData 后台返回的 “后端按钮” 数据（res.data）
 * @return {object} 返回已经分为三类的后端按钮：{ beBtnsMultiple: array, beBtnsSingle: array }；
 * beBtnsMultiple 表示能够操作多条记录的按钮；
 * beBtnsSingle 表示只能操作一条记录的按钮
 */
export const extractAndDealBackendBtns = btnsData => {
  const beBtnsMultiple = [],
    beBtnsSingle = [],
    beBtnsOther = [];
  if (!Array.isArray(btnsData)) {
    return { beBtnsMultiple, beBtnsSingle, beBtnsOther };
  }
  btnsData.forEach(btnData => {
    if (btnData.Show && btnData.Code) {
      // 只能够操作一条记录的按钮
      if (btnData.RecordSelect === 1) {
        beBtnsSingle.push(btnData);
      } else {
        if (btnData.Type === 1 || btnData.Type === 5) {
          // 能够操作多条记录的按钮
          beBtnsMultiple.push(btnData);
        } else {
          // 其他按钮
          beBtnsOther.push(btnData);
        }
      }
      // 使用 Popconfirm 组件
      if (btnData.Type === 1 || btnData.Type === 5) {
        btnData.isUsePopconfirm = true;
      } else {
        btnData.isUsePopconfirm = false;
      }
    }
  });
  return { beBtnsMultiple, beBtnsSingle, beBtnsOther };
};

/**
 * 根据 按钮隐藏条件 来筛选 需要显示 的后端按钮（该后端按钮是操作一条记录的按钮）
 *
 * @param {array} backEndBtnsSingle 操作一条记录的后端按钮数据
 * @param {array} backendBtnsHide 按钮隐藏条件
 * @param {object} record 记录
 * @return {array} 需要显示的后端按钮数组
 */
export const filterBackEndBtns = (
  backEndBtnsSingle,
  backendBtnsHide,
  record
) => {
  const newBackendBtnsHide = cloneDeep(backendBtnsHide);
  let backEndBtns;
  if (newBackendBtnsHide) {
    newBackendBtnsHide.forEach(btn => {
      btn.innerFieldNames.some((innerFieldName, index) => {
        // &&
        if (Array.isArray(innerFieldName)) {
        } else if (typeof innerFieldName === 'string') {
          // ||
          if (record[innerFieldName] === btn.values[index]) {
            return (btn.isHide = true);
          }
        }
      });
    });
    backEndBtns = backEndBtnsSingle.filter(btnInfo => {
      let btn;
      if (
        (btn = newBackendBtnsHide.find(item => item.btnName === btnInfo.Name1))
      ) {
        if (!btn.isHide) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });
  } else {
    backEndBtns = backEndBtnsSingle;
  }
  return backEndBtns;
};
