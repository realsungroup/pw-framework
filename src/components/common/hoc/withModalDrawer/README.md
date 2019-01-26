## withFormDataProp

可选 Modal/Drawer 形式的容器高阶组件

- 可用于表单或表格等需要放在某个容器中组件

### 一、WrappedComponent 组件中可使用的方法：

#### 1. openModalOrDrawer

```javascript
/**
 * 打开 Modal or Drawer：由 type 参数决定
 * @param {string} type 类型：'Modal' 模态窗 | 'Drawer' 抽屉
 * @param {object} containerProps 容器（Modal | Drawer）接收的 props
 * @param {class | function} ChildComponent 放于容器中的子组件
 * @param {object} childProps 子组件接收的 props
 */
openModalOrDrawer = (type, containerProps, ChildComponent, childProps) {
  // ...
}

// 如：
this.props.openModalOrDrawer(
  'drawer',
  {
    width: 600
  },
  () => <div>demo</div>,
  {
    style: { width: 20 }
  }
);
```

#### 2. closeModalOrDrawer

```javascript
/**
 * 关闭 Modal or Drawer
 */
closeModalOrDrawer = () {
  // ...
}

// 如：
this.props.closeModalOrDrawer();
```

### 二、WrappedComponent 组件中可使用的属性：

无