## dev

开发组件的目录：当你想要开发一个新组件时，可以在此目录下新建 `xxx.js` 文件，脱离实际 power-works 业务环境进行开发组件，从而减少开发时的打包时间以及 power-works 配置的时间。

#### 新建开发组件的步骤

1. 复制 Template.js 文件，粘贴到本目录下（在 vscode 下，会被命名为 `Template.1.js`）
2. 重命名 `Template.1.js` 文件为 `Devxxx.js`（xxx 根据实际组件名称进行修改），`Devxxx.js` 文件就是入口文件
3. 在 `Devxxx.js` 中引入你要开发的组件，且使用
4. 使用 `npm start Devxxx`，就可以开始开心地开始开发了！😃
