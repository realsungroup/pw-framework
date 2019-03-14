## 开发规范

### 一、组件开发规范：

开发一个组件，需要按照以下目录结构规范进行开发，如开发一个 `MyCustomComponent` 组件：

```
-- MyCustomComponent
   |-- index.js               # 组件导出 [必须有]
   |-- MyCustomComponent.js   # MyCustomComponent 组件 [必须有]
   |-- MyCustomComponent.less # MyCustomComponent 组件样式 [必须有]
   |-- assets                 # MyCustomComponent 所需的其他资源文件夹，如图片 [可有可无]
```

### 二、样式规范：

- 使用 `less`
- 使用 [BEM](https://www.w3cplus.com/css/bem-definitions.html) 命名法
