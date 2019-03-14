## 功能模块开发

### 一、项目目录结构介绍

```
|-- pw-framework
    |-- public
    |   |-- app.config.js                 # 应用配置文件 [需要改]
    |   |-- functions.config.js           # 功能模块配置文件 [需要改]
    |-- src                               # 源码
    |   |-- components                    # 组件

    |       |-- common                    # 通用组件 [禁止修改]
    |           |-- data                  # 与后端数据相关的组件
    |           |-- hoc                   # 高阶组件
    |           |-- ui                    # ui 组件
    |           |-- loadableCommon.js     # 通用组件按需加载文件

    |       |-- custom                    # 定制组件 [需要改]
    |           |-- loadableCustom.js     # 定制组件按需加载文件

    |       |-- export-center             # 导出中心
    |           |-- index.js              # 导出中心文件 [需要改]
    |       |-- lib                       # 旧版本组件 [禁止修改]
    |       |-- locales                   # 国际化 [需要改]
    |           |-- en-US.js              # 英文
    |           |-- zh-CN.js              # 中文
    |       |-- pages                     # 页面组件 [禁止修改]
    |       |-- product-components        # 雷柏考勤系统定制组件 [禁止修改]
    |       |-- redux                     # redux [禁止修改]
    |       |-- style                     # 样式 [禁止修改]
    |       |-- util                      # 旧版本工具文件夹 [禁止修改]
    |       |-- util20                    # 工具文件夹 [禁止修改]
    |       |-- 其他文件夹                 # [禁止修改]

    |-- README.md
```

### 开发一个功能模块的流程

#### 一、使用通用组件开发一个功能模块

##### 1. 后端添加一个功能模块

叫该项目的后端管理人员添加一个功能模块

##### 2. 将功能模块添加到首页

- 进入设置页面 -> 点击右侧可选功能 “+” 按钮 -> 选择对应的功能模块，点确定进行添加

##### 3. 回到首页，刷新页面，即可看到新添加的功能模块

##### 4. 点击该功能模块，进入该功能模块页面

##### 5. 将地址栏中 querystring 中的 `resid 的值` 复制：

如地址栏为：
http://localhost:3000/fnmodule?resid=605804391005&recid=605805075325&type=%E5%89%8D%E7%AB%AF%E5%8A%9F%E8%83%BD&title=%E4%BF%9D%E5%AE%89%E7%99%BB%E8%AE%B0
则 `resid` 为 `605804391005`

- 然后打开 `public/functions.config.js` 文件
- 在文件末尾加上功能模块配置，如：

```javascript
// 某个功能模块的配置
// 605804391005 表示上面复制的 resid
window[605804391005] = {
  name: 'TableData', // 组件名称，这里使用了通用组件 TableData
  title: '人员信息', // 功能模块名称
  hasBackBtn: true, // 是否有返回上一页的按钮，默认为 true
  props: {
    resid: 777
  } // 组件所接收的 props
};
```

##### 6. 完成！

#### 一、使用定制组件开发一个功能模块

##### 1. 后端添加一个功能模块

叫该项目的后端管理人员添加一个功能模块

##### 2. 将功能模块添加到首页

- 进入设置页面 -> 点击右侧可选功能 “+” 按钮 -> 选择对应的功能模块，点确定进行添加

##### 3. 回到首页，刷新页面，即可看到新添加的功能模块

##### 4. 点击该功能模块，进入该功能模块页面

##### 5. 将地址栏中 querystring 中的 `resid 的值` 复制：

如地址栏为：
http://localhost:3000/fnmodule?resid=605804391005&recid=605805075325&type=%E5%89%8D%E7%AB%AF%E5%8A%9F%E8%83%BD&title=%E4%BF%9D%E5%AE%89%E7%99%BB%E8%AE%B0
则 `resid` 为 `605804391005`

- 然后打开 `public/functions.config.js` 文件
- 在文件末尾加上功能模块配置，如：

```javascript
// 某个功能模块的配置
// 605804391005 表示上面复制的 resid
window[605804391005] = {
  name: 'MyCustomComponent', // 组件名称，这里为定制组件名称
  title: '人员信息', // 功能模块名称
  hasBackBtn: true, // 是否有返回上一页的按钮，默认为 true
  props: {
    resid: 777
  } // 组件所接收的 props
};
```

##### 6. 开发上面的定制组件 `MyCustomComponent`

- 在 `src/components/custom` 文件夹中新建一个 `MyCustomComponent` 组件（[查看开发规范](./develop-standard.md)）

- 然后在 `src/components/custom/loadableCustom.js` 文件中实现该组件的按需加载，如：

```javascript
import React from 'react';
import Loadable from 'react-loadable';

const minLoading = <span>加载中...</span>;

// 实现 MyCustomComponent 组件的按需加载，再导出
export const MyCustomComponent = Loadable({
  loader: () => import('./MyCustomComponent'),
  loading() {
    return minLoading;
  }
});
```

- 然后打开 `src/export-center/index.js` 文件，将 `loadableCustom.js` 中的 `MyCustomComponent` 导入导出，如：

```javascript
// custom
export { MyCustomComponent } from '../components/custom/loadableCustom';
```

##### 7. 完成！
