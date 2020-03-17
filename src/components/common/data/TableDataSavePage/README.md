## TableDataSavePage 文档

### 一、props

[进入](./propTypes.js)

### 二、可调用的实例方法

- 获取 TableDataSavePage 实例

```javascript
<TableDataSavePage
  wrappedComponentRef={element => (this.TableDataSavePageRef = element)}
  refTargetComponentName="TableDataSavePage"
/>
```

此时，`this.TableDataSavePageRef` 就是 TableDataSavePage 的实例了

#### 1. TableDataSavePageRef.getDataSource():Array<any>

获取表格数据

#### 2. TableDataSavePageRef.handleRefresh(isFirst: boolean):void

刷新表格

- isFrist：是否刷新第一页数据。默认值：false，表示刷新当前页数据
