/**
 * 应用配置文件
 */
window.pwConfig = {
  // 开发环境
  development: {
    // 地址
    baseURL: 'http://ngrok4.realsun.me:6060//', // 请求的基地址
    basename: '/',
    // baseUrl: 'http://114.55.58.57:9096/', // 域登录基地址
    // baseURL: 'http://pwhrapi1.realsun.me/', // 域登录基地址
    // baseURL: 'https://finisarinterview.realsun.me/', // 请求的基地址
    //  baseURL:'http://hr.realsun.me:8081/',
    fileDownloadUrl: 'http://10.108.2.66:1000/', // 导出 Excel 文件下载基地址
    fileDownloadConfig: {
      629462405981: {
        fileType: 'mdb'
      }
    },

    //各定制组件需用到的基地址
    customURLs: {
      attendanceBaseURL: 'http://10.108.2.66:9091/', //考勤审批
      attendanceDownloadURL: 'http://10.108.2.66:80/', //考勤审批表格下载url
      DataProcessBaseURL: 'http://10.108.2.66:9091/',
      laowuURL:'http://kingofdinner.realsun.me:9091/',//劳务公司打印
      HeadCountBaseURL: 'http://10.108.2.66:9091/',
      PostArchitectureBaseURL: 'http://10.108.2.66:9091/',
      comprehensiveQueryBaseURL: 'http://10.108.2.66:9091/', //综合查询
      dlEmployBaseURL: 'http://kingofdinner.realsun.me:1201/', //DL招聘-DL管理员
      dlEmployDownloadURL: 'http://kingofdinner.realsun.me:1200/', //DL招聘-DL管理员下载URl
      onlineTrainning:'https://finisar26.realsun.me:1101',//在线培训数据查询
      onlineTrainningDownload:'http://finisar26.realsun.me:1100/'//在线培训数据下载

    },

    // 需前端缓存配置的资源
    tablesConfig: [
      {
        dblinkname: '',
        resids: '1300,621366399676'
      },
      {
        dblinkname: 'ehr',
        resids: '429373729010'
      }
    ],

    // 个人中心配置
    personCenterResIds: [
      {
        title: '基本信息', // 标题：必选
        enTitle: 'Basic Info',
        resid: 1300, // resid：必选
        formName: 'default', // 窗体名称：可选；不设置时默认为 'default'
        dbLinkName: 'EHR'
      }
    ],

    // 登录页配置
    defaultLoginMode: 'normal', // 进入登录页时的默认登录方式（localStorage 里保存的登录方式会覆盖该配置）：'normal' 普通登录 | 'domain' 域登录
    domainLoginConfig: {
      // 预登录配置
      baseUrl: 'http://114.55.58.57:9096/', // 域登录基地址
      usernameSuffix: '@finisar.com', // 域登录用户名的后缀
      domain: 'china', // 域名
      domainUserField: 'emp_email' // 域用户字段
    },
    enterprisecode: '???', // 忘记密码 api 传给后端的企业编号

    // 业务功能配置
    businessOptionalResIds: [
      591549158605,
      605787603655,
      608290060436,
      607189833315,
      609157644640,
      626954765251
    ], // 获取多个业务可选功能的 resid 数组

    // 主题
    themeColor: {
      '@primary-color': '#004a95'
    }, // 默认主题色

    // 锁屏
    lockScreenWaitTime: 86400, // 用户多久未操作登录后界面时，会锁屏（单位：秒）

    // logo 配置
    homeLogoSize: 42, // 首页 logo 尺寸

    loginLogoSize: 42, // 登录页 logo 尺寸

    // 上传文件配置
    // upload: {
    //   mode: 'cloud', // 模式：'cloud' 云对象存储；'local' 服务器本地存储
    //   bucketname: 'realsun', // 当 mode 为 'cloud' 时，云对象存储的空间名称
    //   url: 'http://pwhrapi1.realsun.me/' // 当 mode 为 'cloud' 时，表示上传文件的基地址；当 'mode' 为 'local' 时，表示上传文件的地址
    // },
    upload: {
      mode: 'local', // 模式：'cloud' 云对象存储；'local' 本地存储
      bucketname: 'realsun', // 当 mode 为 'cloud' 时，云对象存储的空间名称
      url:
        'http://10.108.2.66:1000/rispweb/rispservice/SvcUploadFile2.aspx?savepath=d:\\web\\rispweb\\upfiles&httppath=http://10.108.2.66/rispweb/upfiles' // 当 mode 为 'cloud' 时，表示上传文件的基地址；当 'mode' 为 'local' 时，表示上传文件的地址
    },

    // 工作台配置
    openFuncInSelfResids: [597167932280], // 在本页面打开功能页面的功能 resid

    // bi 系统配置
    biBaseURL: 'http://localhost:3002/', // bi 系统基地址

    // 默认打开的窗口（即在第一次进入桌面时，会自动打开的窗口）；为空字符串时，不会打开任何窗口
    defaultOpenWindow: '',

    // 组织架构组件配置；如果不需要组件架构，则设为 null 即可
    orgChartConfig: {
      resid: 602348115218,
      template: 'rony',
      chartId: 'org-chart',
      chartWrapId: 'org-chart-wrap',
      level: 3,
      isExpandAllChildren: true,
      pidField: 'C3_602347244770',
      idField: 'C3_602347243263',
      enableDragDrop: true,
      showFields: {
        field_0: 'C3_602347243459',
        field_1: 'C3_602347246317',
        field_2: 'C3_602347244217',
        field_3: 'C3_602416916077',
        field_4: 'C3_602417234378',
        img_0: 'C3_602350177952'
      },
      recordFormContainerProps: { width: 500 },
      rootIds: [14860455, 1360564],
      rootIdsResid: 602348168470,
      groupingConfig: [
        {
          resourceOfTag: '602364331868',
          sourceColumnOfGroupName: 'groupname',
          sourceColumnOfTagName: 'tagname',
          columnOfTagName: 'tagsname',
          isGroupTag: true,
          cmswhere: ''
        }
      ],
      keyField: 'C3_602347243459'
    }
  },
  // 生产环境
  production: {
    // 地址
    baseURL: 'http://10.108.2.66:1001/', // 请求的基地址
    basename: '/',
    // baseURL: 'https://finisarinterview.realsun.me/', // 请求的基地址
    fileDownloadUrl: 'http://10.108.2.66:1000/', // 导出 Excel 文件下载基地址

    fileDownloadConfig: {
      629462405981: {
        fileType: 'mdb'
      }
    },

    //各定制组件需用到的基地址
    customURLs: {
      attendanceBaseURL: 'http://10.108.2.66:9091/', //考勤审批
      attendanceDownloadURL: 'http://10.108.2.66:80/', //考勤审批表格下载url
      DataProcessBaseURL: 'http://10.108.2.66:9091/',
      laowuURL:'http://kingofdinner.realsun.me:9091/',//劳务公司打印

      HeadCountBaseURL: 'http://10.108.2.66:9091/',
      PostArchitectureBaseURL: 'http://10.108.2.66:9091/',
      comprehensiveQueryBaseURL: 'http://10.108.2.66:9091/', //综合查询
      dlEmployBaseURL: 'http://kingofdinner.realsun.me:1201/', //DL招聘-DL管理员
      dlEmployDownloadURL: 'http://kingofdinner.realsun.me:1200/', //DL招聘-DL管理员下载URl
      onlineTrainning:'https://finisar26.realsun.me:1101',//在线培训数据查询
      onlineTrainningDownload:'http://finisar26.realsun.me:1100/'//在线培训数据下载
    },

    // 需前端缓存配置的资源
    tablesConfig: [
      {
        dblinkname: '',
        resids: '1300,621366399676'
      },
      {
        dblinkname: 'ehr',
        resids: '429373729010,460481857607'
      }
    ],

    // 个人中心配置
    personCenterResIds: [
      {
        title: '基本信息', // 标题：必选
        enTitle: 'Basic Info',
        resid: 1300, // resid：必选
        formName: 'default', // 窗体名称：可选；不设置时默认为 'default'
        dbLinkName: 'EHR'
      }
    ],

    // 登录页配置
    defaultLoginMode: 'normal', // 进入登录页时的默认登录方式（localStorage 里保存的登录方式会覆盖该配置）：'normal' 普通登录 | 'domain' 域登录
    domainLoginConfig: {
      // 预登录配置
      baseUrl: 'http://10.108.2.66:1001/', // 域登录基地址
      usernameSuffix: '@finisar.com', // 域登录用户名的后缀
      domain: 'china', // 域名
      domainUserField: 'emp_email' // 域用户字段
    },
    enterprisecode: '???', // 忘记密码 api 传给后端的企业编号

    // 业务功能配置
    businessOptionalResIds: [
      591549158605,
      605787603655,
      608290060436,
      607189833315,
      626954765251
    ], // 获取多个业务可选功能的 resid 数组

    // 主题
    themeColor: {
      '@primary-color': '#004a95'
    }, // 默认主题色

    // 锁屏
    lockScreenWaitTime: 86400, // 用户多久未操作登录后界面时，会锁屏（单位：秒）

    // logo 配置
    homeLogoSize: 42, // 首页 logo 尺寸

    loginLogoSize: 42, // 登录页 logo 尺寸

    // 上传文件配置
    upload: {
      mode: 'local', // 模式：'cloud' 云对象存储；'local' 本地存储
      bucketname: 'realsun', // 当 mode 为 'cloud' 时，云对象存储的空间名称
      url:
        'http://10.108.2.66:1000/rispweb/rispservice/SvcUploadFile2.aspx?savepath=d:\\web\\rispweb\\upfiles&httppath=http://10.108.2.66/rispweb/upfiles' // 当 mode 为 'cloud' 时，表示上传文件的基地址；当 'mode' 为 'local' 时，表示上传文件的地址
    },

    // 工作台配置
    openFuncInSelfResids: [597167932280], // 在本页面打开功能页面的功能 resid

    // bi 系统配置
    biBaseURL: 'http://localhost:3001/', // bi 系统基地址

    // 默认打开的窗口
    defaultOpenWindow: '',

    // 组织架构组件配置；如果不需要组件架构，则设为 null 即可
    orgChartConfig: {
      resid: 602348115218,
      template: 'rony',
      chartId: 'org-chart',
      chartWrapId: 'org-chart-wrap',
      level: 3,
      isExpandAllChildren: true,
      pidField: 'C3_602347244770',
      idField: 'C3_602347243263',
      enableDragDrop: true,
      showFields: {
        field_0: 'C3_602347243459',
        field_1: 'C3_602347246317',
        field_2: 'C3_602347244217',
        field_3: 'C3_602416916077',
        field_4: 'C3_602417234378',
        img_0: 'C3_602350177952'
      },
      recordFormContainerProps: { width: 500 },
      rootIds: [14860455, 1360564],
      rootIdsResid: 602348168470,
      groupingConfig: [
        {
          resourceOfTag: '602364331868',
          sourceColumnOfGroupName: 'groupname',
          sourceColumnOfTagName: 'tagname',
          columnOfTagName: 'tagsname',
          isGroupTag: true,
          cmswhere: ''
        }
      ],
      keyField: 'C3_602347243459'
    }
  }
};
