import React from 'react';
import { Form } from 'antd';
export const EditableContext = React.createContext();

/**
 * 可编辑行组件：主要是为了收集行表单数据
 */
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

export default Form.create()(EditableRow);
