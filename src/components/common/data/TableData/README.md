## TableData 文档

### 一、props

[进入](./propTypes.js)

### 二、可调用的实例方法

- 获取 TableData 实例

```javascript
<TableData
  wrappedComponentRef={element => (this.tableDataRef = element)}
  refTargetComponentName="TableData"
/>
```

此时，`this.tableDataRef` 就是 TableData 的实例了

#### 1. tableDataRef.getDataSource():Array<any>

获取表格数据

#### 2. tableDataRef.handleRefresh(isFirst: boolean):void

刷新表格

- isFrist：是否刷新第一页数据。默认值：false，表示刷新当前页数据
