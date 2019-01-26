## withHttpAddRecords

添加记录

- 用于添加表格记录

### 一、WrappedComponent 组件中可使用的方法：

#### 1. httpAddRecords

```javascript
/**
 * 添加记录
 * @param {number} id 资源 id
 * @param {array} data 需要添加的记录数组
 * @param {boolean} isEditOrAdd _state 是否由 'added' 改为 'editoradd'，默认值：false
 * @return {promise} 返回 promise
 */
httpAddRecords = async (id, data, isEditOrAdd = false) => {
  // ...
}

// 如：
this.props.httpAddRecords(
  666,
  [{
    name: 'xl',
    age: 22
  }],
  false
);
```

### 二、WrappedComponent 组件中可使用的属性：

无


---


## withHttpModifyRecords

修改记录

- 用于修改表格记录

### 一、WrappedComponent 组件中可使用的方法：

#### 1. httpModifyRecords

```javascript
/**
 * 修改记录
 * @param {number} id 资源 id
 * @param {array} data 需要修改的记录数组
 * @param {boolean} isEditOrAdd _state 是否由 'added' 改为 'editoradd'，默认值：false
 * @return {promise} 返回 promise
 */
httpModifyRecords = async (id, data, isEditOrAdd = false) => {
  // ...
}

// 如：
this.props.httpModifyRecords(
  666,
  [{
    name: 'xl',
    age: 22,
    REC_ID: 'C3_xxx'
  }],
  false
);
```

### 二、WrappedComponent 组件中可使用的属性：

无



---


## withHttpRemoveRecords

删除记录

- 用于删除表格记录

### 一、WrappedComponent 组件中可使用的方法：

#### 1. httpRemoveRecords

```javascript
/**
 * 修改记录
 * @param {number} id 资源 id
 * @param {array} data 需要修改的记录数组
 * @param {boolean} isEditOrAdd _state 是否由 'added' 改为 'editoradd'，默认值：false
 * @return {promise} 返回 promise
 */
httpRemoveRecords = async (id, data, isEditOrAdd = false) => {
  // ...
}

// 如：
this.props.httpRemoveRecords(
  666,
  [{
    name: 'xl',
    age: 22,
    REC_ID: 'C3_xxx'
  }],
  false
);
```

### 二、WrappedComponent 组件中可使用的属性：

无



---


## withHttpGetTableData

获取主表数据

- 用于删除表格记录

### 一、WrappedComponent 组件中可使用的方法：

#### 1. httpGetTableData

```javascript
/**
 * 修改记录
 * @param {number} id 资源 id
 * @param {array} data 需要修改的记录数组
 * @param {boolean} isEditOrAdd _state 是否由 'added' 改为 'editoradd'，默认值：false
 * @return {promise} 返回 promise
 */
httpRemoveRecords = async (id, data, isEditOrAdd = false) => {
  // ...
}

// 如：
this.props.httpRemoveRecords(
  666,
  [{
    name: 'xl',
    age: 22,
    REC_ID: 'C3_xxx'
  }],
  false
);
```

### 二、WrappedComponent 组件中可使用的属性：

无



---