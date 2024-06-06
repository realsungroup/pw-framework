## 更新日志

pw-framework 的版本号遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/) 规范：

```
版本格式：主版本号.次版本号.修订号，版本号递增规则如下：
1. 主版本号：当你做了不兼容的 API 修改，
2. 次版本号：当你做了向下兼容的功能性新增，
3. 修订号：当你做了向下兼容的问题修正。
先行版本号及版本编译元数据可以加到“主版本号.次版本号.修订号”的后面，作为延伸。
```
# v21.5.1（2024/6/6）
- 修改就餐计算逻辑
# v21.5.0（2024/5/2）
- 增加就餐管理模块
# v21.4.4（2024/2/27）
- 修改档案打印文字
# v21.4.3（2024/1/28）
- 修改奖惩预累进逻辑
# v21.4.2（2023/11/23）
- 处理每月门禁确认时删除外包人员的逻辑

# v21.4.1（2023/11/9）
- 添加oracleID导入的入口

# v21.4.0（2023/10/24）

- 检测本地版本和服务器版本是否一致，不一致的场合强制清除浏览器缓存

# v21.3.0（2019/4/1）

- 添加 BusinessManagement 组件
- TableData 组件添加 headerExtra 配置
- 修复高阶组件深层次嵌套不能对被增强的组件使用 ref 的 bug
- 添加 TableData 组件 onRowClick 属性以及相关 props 变化后，会重新请求表格相关数据的功能
- 修复 TableData 设置 height 样式出问题的 bug
- 修复 TableData 组件计算 scrollXY 错误的 bug
- 添加 TableData 组件添加在添加记录时，记录表单的记录和子表数据可以同时添加的功能

# v21.2.3（2019/3/26）

- 修复 `TableData` 组件中记录表单子表不能添加数据的 bug

```
*升级提示
git pull origin master
```

# v21.2.2（2019/3/21）

- 修复 `TableData` 组件中记录表单中子表不能配置的 bug

# v21.2.1（2019/3/20）

- 修复 `TableData` 组件中后端修改按钮记录表单不显示字段值的 bug
- 修复 `TableData` 组件中记录表单的 title 显示错误的 bug

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
