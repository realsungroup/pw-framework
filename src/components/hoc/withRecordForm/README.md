## withRecordForm

显示记录表单的高阶组件

- 可用于需要显示与记录有关的表单组件中

### 一、WrappedComponent 组件中可使用的方法：

#### 1. openRecordForm

```javascript
/**
 * 打开记录表单
 * @param {object} params Modal/FormData/Drawer 组件所接收的对象
 *
 * @param {string} params.type 记录表单所在的容器类型：'modal' 模态窗 | 'drawer' 抽屉；默认值为：'modal'
 * @param {string} params.title 容器的 title；默认值为：''
 * @param {object} params.formProps PwForm 表单组件接收的 props
 * @param {object} params.formData 窗体数据
 * @param {string} params.operation 对表单的操作：'add' 添加 | 'modify' 修改 | 'view' 查看；默认值为：'add'
 * @param {object} params.record 记录；默认值为：{}
 * @param {object} params.info 添加、修改 所需要的信息
 * @param {object} params.AdvDicTableProps 高级字典表格所接收的 props
 * @param {object} params.recordFormContainerProps 记录表单容器（Modal/Drawer）所接收的 props
 * @param {function} params.onConfirm 确认后的回调函数
 * @param {function} params.onCancel 取消后的回调函数
 */
openRecordForm = ({
  type = 'modal',
  title = '',
  formProps = {},
  formData = {
    subTableArr: [],
    allControlArr: [],
    canOpControlArr: [],
    containerControlArr: []
  },
  operation = 'add',
  record = {},
  info = {
    dataMode: 'main',
    resid: 666,
    subresid: 777,
    hostrecid: 'C3_888'
  },
  AdvDicTableProps = {},
  recordFormContainerProps = {},
  onConfirm = () => {},
  onCancel = () => {}
}) => {
  // ...
}

// 如：
this.props.openRecordForm(...);
```

#### 2. closeRecordForm

```javascript
/**
 * 关闭记录表单
 */
closeRecordForm = () => {
  // ...
}

// 如：
this.props.closeRecordForm();
```

### 二、WrappedComponent 组件中可使用的属性：

无