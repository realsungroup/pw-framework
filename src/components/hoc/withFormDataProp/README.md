## withFormDataProp

处理 `formData`（窗体数据）得到 PwForm 接受的 `data` prop

- 一般用来增强表单功能

```javascript
// formData 格式
const formData = {
  subTableArr: [], // 子表控件
  allControlArr: [], // 所有控件（可操作的控件 + label）
  canOpControlArr: [], // 可操作的控件（如 input）
  containerControlArr: [] // 容器控件
};

// data 格式：displayMode 为 default 时
const data = [
  {
    id: 'name', // 字段名称
    label: '姓名', // label
    value: '肖磊', // 初始值
    labelCol: 8, // label 所占列
    wrapperCol: 16, // 控件 所占列
    rules: [{ required: true, message: '请输入姓名' }], // 验证规则
    name: 'Input', // 控件名称
    props: {
      // 控件所接收的 props
      type: 'number'
    }
  }
];

// data 格式：displayMode 为 classify 时
const data = [
  {
    type: '基本信息',
    data: [
      {
        id: 'name', // 字段名称
        label: '姓名', // label
        value: '肖磊', // 初始值
        labelCol: 8, // label 所占列
        wrapperCol: 16, // 控件 所占列
        rules: [{ required: true, message: '请输入姓名' }], // 验证规则
        name: 'Input', // 控件名称
        props: {
          // 控件所接收的 props
          type: 'number'
        }
      }
    ]
  }
];
```

### 一、WrappedComponent 组件中可使用的方法：

#### 1. getDataProp

```javascript
/**
 * 获取 PwForm 所接收的 data
 * @param {string} operation 操作：'edit' 编辑 | 'view' 查看
 * @param {object} record 记录
 * @param {array} formData 窗体数据
 * @param {object} formProps PwForm 组件所接收的其他 props
 */
getDataProp = (operation, record, formData, formProps) => {
  // ...
};

// 如：
this.props.getDataProp(
  'edit',
  { name: 'xl', age: 22 },
  {
    subTableArr: [], // 子表控件
    allControlArr: [], // 所有控件（可操作的控件 + label）
    canOpControlArr: [], // 可操作的控件（如 input）
    containerControlArr: [] // 容器控件
  },
  {}
);
```

### 二、WrappedComponent 组件中可使用的属性：

#### 1. data

```javascript
/**
 * 获取 PwForm 所接收的 data
 * @param {string} operation 操作：'edit' 编辑 | 'view' 查看
 * @param {object} record 记录
 * @param {array} formData 窗体数据
 * @param {object} formProps PwForm 组件所接收的其他 props
 */
getDataProp = (operation, record, formData, formProps) => {
  // ...
};
```
