## pw-framework

power-works 基础框架

### 一、运行

#### 1. 下载以及安装依赖

- git clone https://github.com/realsungroup/pw-framework.git （或 `git clone git@github.com:realsungroup/pw-framework.git`）
- cd pw-framework
- npm install（或 `yarn`）

#### 2. 运行

##### 运行 power-works：

- 进入 power-work 开发模式：npm start
- 进入 power-work 开发模式，且开启 `webpack-bundle-analyzer` 插件进行包分析：npm start -- -b

##### 运行 power-works 中的某个组件：

- 使用 `src/dev` 文件夹中的 `Devxxx` 作为应用的入口文件：npm start -- -e Devxxx
- 使用 `src/dev` 文件夹中的 `Devxxx` 作为应用的入口文件，且开启 `webpack-bundle-analyzer` 插件进行包分析：npm start -- -e Devxxx -b

### 二、开始一个新项目

1. 切换至主分支：git checkout master
2. 新建分支：git branch xxx（xxx 为项目名称）
3. 切换至新分支进行开发：git checkout xxx
4. 修改 `public/app.config.js` 配置文件（[查看配置文件文档](./docs/app-config.md)）
5. 然后进行功能模块开发（[查看功能模块开发文档](./docs/develop.md)）

### 三、部署项目

1. 打包项目：`npm run build`，执行完之后，会在项目根目录生成一个 `build` 文件夹
2. 将 `build` 文件夹压缩，然后发给部署该项目的人

### 四、项目升级

`master` 分支是最新版本的分支，所以，如果要升级 xxx 项目（在 xxx 分支）的话，如下：

1. 切换至 `xxx` 分支（即 xxx 项目）：git checkout xxx
2. 拉取 `master` 分支的代码，并且合并到当前分支：`git pull origin master`
3. 若有冲突，则解决冲突，且按照 [更新日志](./docs/changelog.md) 的提示进行升级
4. 测试
5. 完成

新功能：

- [在窗口中如何返回上一页？](./docs/iframe.md)'

