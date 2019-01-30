## pw-framework

power-works 基础框架

一、运行

1. 下载以及安装依赖

- git clone https://github.com/realsungroup/pw-framework.git（或 `git clone git@github.com:realsungroup/pw-framework.git`）
- cd pw-framework
- npm install（或 `yarn`）

2. 运行

### 运行 power-works

- 进入 power-work 开发模式：npm start
- 进入 power-work 开发模式，且开启 `webpack-bundle-analyzer` 插件进行包分析：npm start -- -b

### 运行 power-works 中的某个组件

- 使用 `src/dev` 文件夹中的 `Devxxx` 作为应用的入口文件：npm start -- -e Devxxx
- 使用 `src/dev` 文件夹中的 `Devxxx` 作为应用的入口文件，且开启 `webpack-bundle-analyzer` 插件进行包分析：npm start -- -e Devxxx -b

二、开始一个新项目

1. 切换至主分支：git checkout master
2. 新建分支：git branch xxx（xxx 为项目名称）
3. 切换至新分支进行开发：git checkout xxx
4. 修改配置文件
