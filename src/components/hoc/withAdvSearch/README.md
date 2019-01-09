## withAdvSearch

带有抽屉形式的高级搜索的高阶组件，通过调用传入的回调函数，传入 cmsWhere 参数，在子组件中使用 cmsWhere

- 用于需要高级搜索且能够得到 cmsWhere 的组件中

### 一、WrappedComponent 组件中可使用的方法：

#### 1. openAdvSearch

```javascript
/**
 * 显示高级搜索
 * @param {number} resid 资源 id
 * @param {string} formName 窗体名称，如 'default'
 * @param {object} advSearchFormProps 高级查询中 PwForm 所接收的 props
 * @param {array} advSearchValidationFields 高级查询中需要有验证的字段，如：['name', 'age']
 * @param {function} getCmsWhere 获取 cmswhere 的回调函数
 */
openAdvSearch = (
  resid,
  formName,
  advSearchFormProps,
  advSearchValidationFields,
  getCmsWhere
) => {
  // ...
};

// 如：
this.props.openAdvSearch(
  666,
  'default',
  {},
  ['name', 'age'],
  this.handleGetCmsWhere
);
```

#### 2. setProps

```javascript
/**
 * 设置高级搜索接收的 props
 * @param {object} drawerProps 抽屉组件接收的 props
 * @param {object} formProps PwForm 组件接收的 props
 */
setProps = (drawerProps, formProps) => {
  // ...
};

// 如：
this.props.setProps({ width: 600 }, { width: 500 });
```

### 二、WrappedComponent 组件中可使用的属性：

无
