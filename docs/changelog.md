## 更新日志

pw-framework 的版本号遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/) 规范：

```
版本格式：主版本号.次版本号.修订号，版本号递增规则如下：
1. 主版本号：当你做了不兼容的 API 修改，
2. 次版本号：当你做了向下兼容的功能性新增，
3. 修订号：当你做了向下兼容的问题修正。
先行版本号及版本编译元数据可以加到“主版本号.次版本号.修订号”的后面，作为延伸。
```

# v21.2.1（2019/3/20）

- 修复 `TableData` 组件中后端修改按钮记录表单不显示字段值的 bug

# v21.2.0（2019/3/18）

- `TableData` 组件添加 `recordFormFormWidth` 和 `recordFormTabsWidth` 配置
- 修复在 `TableData` 组件中记录表单在只有右侧 tabs 时，tabs 宽度为 50% 的 bug
- 修复 `TableData` 在添加记录时，表单宽度为 50% 的 bug

# v21.1.1（2019/3/16）

- 修复在 `TableData` 组件中只有后端按钮时，点击不会弹出记录表单的 bug

```
*升级提示
git pull origin master
```

# v21.1.0（2019/3/15）

- `TableData` 组件添加 `hasSearch` 配置
- 修复在 `TableData` 组件中点击后端按钮，不会获取记录表单中的子表数据的 bug
- 修复在 `TableData` 组件中点击后端按钮，请求传参错误的 bug

```
*升级提示
git pull origin master
```

# v21.0.0（2019/3/14）

- `app.config.js` 中添加 `开发环境` 和 `生产环境` 配置

```
*升级提示：
1. 切换到要升级的项目分支 xxx：git checkout xxx
2. 更新本地 xxx 分支代码：git pull origin xxx
3. 将 master 分支合并到 xxx 分支：git pull origin master
4. 将原来的配置转移到 window.pwConfig.development 对象和 window.pwConfig.production 对象中：

/**
 * 应用配置文件
 */
window.pwConfig = {
  // 开发环境
  development: {
    // 地址
    baseURL: 'http://kingofdinner.realsun.me:8102/', // 请求的基地址
    fileDownloadUrl: 'http://172.21.2.27:802/', // 导出 Excel 文件下载基地址

    // 个人中心配置
    personCenterResIds: [
      {
        title: '基本信息', // 标题：必选
        enTitle: 'Basic Info',
        resid: 1300, // resid：必选
        formName: 'default' // 窗体名称：可选；不设置时默认为 'default'
      }
    ],

    // 登录页配置
    defaultLoginMode: 'normal', // 进入登录页时的默认登录方式（localStorage 里保存的登录方式会覆盖该配置）：'normal' 普通登录 | 'domain' 域登录
    domainLoginConfig: {
      // 预登录配置
      baseUrl: 'http://172.21.2.27:801/', // 域登录基地址
      usernameSuffix: '', // 域登录用户名的后缀
      domain: 'rbc.int', // 域名
      domainUserField: 'emp_id' // 域用户字段
    },
    enterprisecode: '???', // 忘记密码 api 传给后端的企业编号

    // 业务功能配置
    businessOptionalResIds: [
      593979035940,
      594468536480,
      593979020171,
      594399052677,
      593979050146,
      593979062893,
      597176310158
    ], // 获取多个业务可选功能的 resid 数组

    // 主题
    themeColor: {
      '@primary-color': '#004a95'
    }, // 默认主题色

    // 锁屏
    lockScreenWaitTime: 600, // 用户多久未操作登录后界面时，会锁屏（单位：秒）

    // logo 配置
    homeLogoSize: 42, // 首页 logo 尺寸

    loginLogoSize: 42, // 登录页 logo 尺寸

    // 上传文件配置
    upload: {
      mode: 'cloud', // 模式：'cloud' 云对象存储；'local' 服务器本地存储
      bucketname: 'realsun', // 当 mode 为 'cloud' 时，云对象存储的空间名称
      url: 'http://kingofdinner.realsun.me:8102/' // 当 mode 为 'cloud' 时，表示上传文件的基地址；当 'mode' 为 'local' 时，表示上传文件的地址
    },

    // 工作台配置
    openFuncInSelfResids: [597167932280] // 在本页面打开功能页面的功能 resid
  },
  // 生产环境
  production: {
    // 地址
    baseURL: 'http://kingofdinner.realsun.me:8102/', // 请求的基地址
    fileDownloadUrl: 'http://172.21.2.27:802/', // 导出 Excel 文件下载基地址

    // 个人中心配置
    personCenterResIds: [
      {
        title: '基本信息', // 标题：必选
        enTitle: 'Basic Info',
        resid: 1300, // resid：必选
        formName: 'default' // 窗体名称：可选；不设置时默认为 'default'
      }
    ],

    // 登录页配置
    defaultLoginMode: 'normal', // 进入登录页时的默认登录方式（localStorage 里保存的登录方式会覆盖该配置）：'normal' 普通登录 | 'domain' 域登录
    domainLoginConfig: {
      // 预登录配置
      baseUrl: 'http://172.21.2.27:801/', // 域登录基地址
      usernameSuffix: '', // 域登录用户名的后缀
      domain: 'rbc.int', // 域名
      domainUserField: 'emp_id' // 域用户字段
    },
    enterprisecode: '???', // 忘记密码 api 传给后端的企业编号

    // 业务功能配置
    businessOptionalResIds: [
      593979035940,
      594468536480,
      593979020171,
      594399052677,
      593979050146,
      593979062893,
      597176310158
    ], // 获取多个业务可选功能的 resid 数组

    // 主题
    themeColor: {
      '@primary-color': '#004a95'
    }, // 默认主题色

    // 锁屏
    lockScreenWaitTime: 600, // 用户多久未操作登录后界面时，会锁屏（单位：秒）

    // logo 配置
    homeLogoSize: 42, // 首页 logo 尺寸

    loginLogoSize: 42, // 登录页 logo 尺寸

    // 上传文件配置
    upload: {
      mode: 'cloud', // 模式：'cloud' 云对象存储；'local' 本地存储
      bucketname: 'realsun', // 当 mode 为 'cloud' 时，云对象存储的空间名称
      url: 'http://kingofdinner.realsun.me:8102/' // 当 mode 为 'cloud' 时，表示上传文件的基地址；当 'mode' 为 'local' 时，表示上传文件的地址
    },

    // 工作台配置
    openFuncInSelfResids: [597167932280] // 在本页面打开功能页面的功能 resid
  }
};

5. 完成！
```

# v20.0.0

- 重构通用组件
- 规范了开发目录

# v10.x.x

- 第一个版本
