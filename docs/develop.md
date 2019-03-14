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

### 
