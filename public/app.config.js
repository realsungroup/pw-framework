/**
 * 应用配置文件
 */
window.pwConfig = {
  // 开发环境
  development: {
    // 地址
<<<<<<< HEAD
    baseURL: 'http://pwhrapi1.realsun.me/', // 请求的基地址
    fileDownloadUrl: 'http://172.21.2.27:802/', // 导出 Excel 文件下载基地址
=======
    baseURL: 'http://kingofdinner.realsun.me:8102/', // 请求的基地址
    fileDownloadUrl: 'http://pwhr1.realsun.me/', // 导出 Excel 文件下载基地址
>>>>>>> 405b4dd723d31c678086b8156a155cfcb7d5c2f4

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
    businessOptionalResIds: [591549158605, 605787603655,608290060436], // 获取多个业务可选功能的 resid 数组

    // 主题
    themeColor: {
      '@primary-color': '#004a95'
    }, // 默认主题色

    // 锁屏
    lockScreenWaitTime: 6000, // 用户多久未操作登录后界面时，会锁屏（单位：秒）

    // logo 配置
    homeLogoSize: 42, // 首页 logo 尺寸

    loginLogoSize: 42, // 登录页 logo 尺寸

    // 上传文件配置
    upload: {
      mode: 'cloud', // 模式：'cloud' 云对象存储；'local' 服务器本地存储
      bucketname: 'realsun', // 当 mode 为 'cloud' 时，云对象存储的空间名称
      url: 'http://pwhrapi1.realsun.me/' // 当 mode 为 'cloud' 时，表示上传文件的基地址；当 'mode' 为 'local' 时，表示上传文件的地址
    },

    // 工作台配置
    openFuncInSelfResids: [597167932280], // 在本页面打开功能页面的功能 resid

    // bi 系统配置
    biBaseURL: 'http://localhost:3001/' // bi 系统基地址
  },
  // 生产环境
  production: {
    // 地址
    baseURL: 'http://wux-hr03:9091/', // 请求的基地址
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
      baseUrl: 'http://wux-hr03:9091/', // 域登录基地址
      usernameSuffix: '', // 域登录用户名的后缀
      domain: 'rbc.int', // 域名
      domainUserField: 'emp_id' // 域用户字段
    },
    enterprisecode: '???', // 忘记密码 api 传给后端的企业编号

    // 业务功能配置
    businessOptionalResIds: [591549158605, 605787603655,608290060436], // 获取多个业务可选功能的 resid 数组

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
    openFuncInSelfResids: [597167932280], // 在本页面打开功能页面的功能 resid

    // bi 系统配置
    biBaseURL: 'http://localhost:3001/' // bi 系统基地址
  }
};
