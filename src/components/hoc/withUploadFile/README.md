## withDownloadFile

带有下载文件功能的高阶组件

- 用于需要有下载资源文件的组件上


### 一、WrappedComponent 组件中可使用的方法：

#### 1. downloadFile

```javascript
/**
 * 下载文件
 * @param {string} baseUrl 下载文件的基地址，如：http://localhost:3000
 * @param {string} fileName 文件名称，如：'人员信息表'
 * @param {string} resid 资源 id
 * @param {cmsWhere} where where 语句，如："name = 'xl' and age = '22'"
 * @param {string} fileType 文件类型，默认：'xls'
 */
downloadFile = async (baseUrl, fileName, resid, where, fileType) {
  // ...
}

// 如：
this.props.downloadFile(
  'http://localhost:3000',
  '人员信息表',
  666,
  "name = 'xl' and age = '22'",
  'xls'
);
```

### 二、WrappedComponent 组件中可使用的属性：

无
