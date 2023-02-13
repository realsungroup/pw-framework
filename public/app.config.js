/**
 * 应用配置文件
 */
window.pwConfig = {
  // 开发环境
  development: {
    // 地址
    // baseURL: 'http://10.108.11.36:6001/', // 请求的基地址
    // baseURL: 'http://pwkwebapi.realsun.me/',
    // baseURL: 'http://10.108.2.66:1001/', // 请求的基地址
    baseURL: 'http://kingofdinner.realsun.me:18001/', // 请求的基地址
    realsunApiBaseURL: 'http://kingofdinner.realsun.me:17001/',
    hikApiBaseURL: 'http://localhost:7001/', // 海康接口层基地址
    collectApiBaseURL: 'http://localhost:7002/', // 海康接口层基地址
    hikPageURL: 'https://114.55.35.96',
    basename: '/',
    // baseUrl: 'http://114.55.58.57:9096/', // 域登录基地址
    // baseURL: 'http://pwhrapi1.realsun.me/', // 域登录基地址
    // baseURL: 'https://finisarinterview.realsun.me/', // 请求的基地址
    //  baseURL:'http://hr.realsun.me:8081/',
    fileDownloadUrl: 'http://10.108.2.66:1000/', // 导出 Excel 文件下载基地址
    // 切换考勤月份的基地址
    attendanceMonthChangeUrl: 'http://kingofdinner.realsun.me:17001/',
    fileDownloadConfig: {
      629462405981: {
        fileType: 'mdb'
      }
    },

    // 上传人员人脸照片的基地址
    uploadPersonPhotoURL:
      'http://kingofdinner.realsun.me:17000/rispweb/rispservice/svcuploadfile2.aspx?savepath=d:\\web\\rispweb\\upfiles&httppath=http://kingofdinner.realsun.me:17000/rispweb/upfiles',

    penetrate: false, //是否穿透模式
    penetrateReplaceBaseURL: 'http://ngrok80.realsun.me',
    waitingHandleBaseURL: 'http://10.108.21.41:6000',
    hasAttendanceMonth: true, // 是否有考勤月份切换的功能
    offerletter: 621366399676,
    pexan: 623152549932,
    //各定制组件需用到的基地址
    customURLs: {
      personInfoDownloadURL: 'http://10.108.2.66:80/', //人事信息下载地址
      hikBaseURL: 'http://localhost:7001/', //海康平台api-沪东项目
      attendanceBaseURL: 'http://kingofdinner.realsun.me:17001/', //考勤审批
      attendanceDownloadURL: 'http://10.108.2.66:80/', //考勤审批表格下载url
      DataProcessBaseURL: 'http://10.108.2.48:9091/',
      laowuURL: 'http://kingofdinner.realsun.me:9091/', //劳务公司打印
      HeadCountBaseURL: 'http://10.108.21.41:2001/',
      PostArchitectureBaseURL: 'http://kingofdinner.realsun.me:17001/',
      PostArchitectureDownloadBaseURL: 'http://10.108.21.41:2001/',
      comprehensiveQueryBaseURL: 'http://kingofdinner.realsun.me:17001/', //综合查询
      dlEmployBaseURL: 'http://kingofdinner.realsun.me:1201/', //DL招聘-DL管理员
      dlEmployDownloadURL: 'http://kingofdinner.realsun.me:1200/', //DL招聘-DL管理员下载URl
      onlineTrainning: 'https://finisar26.realsun.me:1101', //在线培训数据查询
      onlineTrainningDownload: 'http://finisar26.realsun.me:1100/', //在线培训数据下载
      headquartersBaseURL: 'http://10.108.11.36:6001', //总部工作流管理-总部工作流
      headquartersDownloadURL: 'http://10.108.21.41:6000', //总部工作流管理-总部工作流下载URl
      WzBaseURL: 'http://ngrok8.realsun.me:7071', //物资管理
      WzDownloadURL: 'http://ngrok8.realsun.me:7071', //物资管理
      OnlineTrainingManagerBaseURL: 'http://kingofdinner.realsun.me:9091/',
      AchievementsBaseURL: 'http://10.108.2.66:1001/', //绩效定制页面基地址
      RBASchedulingBaseURL: 'http://10.108.21.41:2001', //RBA排班基地址
      RBASchedulingDownloadBaseURL: 'http://10.108.21.41:2000', //RBA排班下载基地址
      WuxiHr03BaseURL: 'http://kingofdinner.realsun.me:17001/', //80端口非定制组件基地址
      WuxiHr03DownloadBaseURL: 'http://10.108.2.66:80/', //80端口非定制组件下载基地址
      staffComBaseURL: 'http://kingofdinner.realsun.me:9091/', //在线培训数据查询
      staffComDownloadURL: 'http://kingofdinner.realsun.me:8081/', //在线培训数据下载
      importTemplateDownloadURL:
        'http://10.108.2.66/rispweb/upfiles/transtem.zip', //岗位任职导入模板下载链接
      importJobTemplateDownloadURL:
        'http://10.108.2.66/rispweb/upfiles/transtem.zip' //岗位任职导入模板下载链接
    },

    // 绩效-我的评估表功能用到的子表
    achievementSubResid: {
      target: 645204394778, //目标-目标
      history: 645205088996, //目标-历史记录
      middleYearTargetSelf: 645205266302, //年中-目标自评
      endYearTargetSelf: 645205507630, //年末-目标自评
      targetView: 645205681732, //直评查询-目标查看
      gradeRate: 645205819154, //直评查询-评级评优记录
      interview: 645205940028, //面谈记录-面谈记录
      员工绩效反馈: 558178954112,
      员工绩效反馈历史: 558638569486,
      绩效评估表: 420130498195,
      myAssessment: 462400643808
    },
    trainingClubUploadConfig: {
      mode: 'local',
      bucketname: 'realsun',
      url:
        'http://10.108.2.66:1000/rispweb/rispservice/SvcUploadFile2.aspx?savepath=d:\\web\\rispweb\\upfiles&httppath=http://10.108.2.66/rispweb/upfiles'
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
    enterprisecode: '9063', // 忘记密码 api 传给后端的企业编号

    // 业务功能配置
    businessOptionalResIds: [
      591549158605, //奖惩系统
      605787603655, //访客系统
      608290060436, //考试系统
      607189833315, //问卷系统
      609157644640, //学习与发展
      626954765251, //人事信息管理
      620212346456, //信息查询
      621258285555, //考勤审批
      629398031625, //考勤结算
      629806000986, //综合管理
      631968602083, //个人档案管理
      642077273014, //物资管理
      642852666439, //人员管理
      642852866577, //安全管控
      642852833296, //财务薪资相关
      642852880030, //供应商合同管理
      642852857804, //绩效考核
      642852735477, //假期管理
      642852790786, //考勤管理
      642852725747, //考勤权限
      642852713768, //考勤设置
      642852747371, //排班管理
      642852820322, //薪资与福利
      642852847030, //员工关系
      642852800770 //招聘
    ], // 获取多个业务可选功能的 resid 数组

    // 主题
    themeColor: {
      '@primary-color': '#A11D21'
    }, // 默认主题色

    // 锁屏
    lockScreenWaitTime: 86400, // 用户多久未操作登录后界面时，会锁屏（单位：秒）

    // logo 配置
    homeLogoSize: 42, // 首页 logo 尺寸

    loginLogoSize: 80, // 登录页 logo 尺寸

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

    // 提醒数据配置
    reminderDataConfig: [
      {
        dblinkname: 'me',
        baseurl: 'http://10.108.21.41:2001/'
      },
      {
        dblinkname: 'ehr',
        baseurl: 'http://10.108.21.41:2001/'
      }
    ],

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
    baseURL: 'http://192.168.6.161:1001/', // 请求的基地址
    realsunApiBaseURL: 'http://192.168.6.161:9091/',
    hikApiBaseURL: 'http://192.168.6.162:7700/', // 海康接口层基地址
    collectApiBaseURL: 'http://192.168.6.162:7801/',
    hikPageURL: 'https://192.168.6.162',
    basename: '/',
    // baseURL: 'https://finisarinterview.realsun.me/', // 请求的基地址
    fileDownloadUrl: 'http://10.108.2.66:1000/', // 导出 Excel 文件下载基地址
    // 切换考勤月份的基地址
    attendanceMonthChangeUrl: 'http://kingofdinner.realsun.me:17001/',
    fileDownloadConfig: {
      629462405981: {
        fileType: 'mdb'
      }
    },
    // 上传人员人脸照片的基地址
    uploadPersonPhotoURL:
      'http://kingofdinner.realsun.me:17000/rispweb/rispservice/svcuploadfile2.aspx?savepath=d:\\web\\rispweb\\upfiles&httppath=http://kingofdinner.realsun.me:17000/rispweb/upfiles',

    penetrate: false, //是否穿透模式
    penetrateReplaceBaseURL: 'http://ngrok80.realsun.me',
    waitingHandleBaseURL: 'http://10.108.2.66:1002',

    hasAttendanceMonth: true, // 是否有考勤月份切换的功能
    offerletter: 621366399676,
    pexan: 623152549932,

    //各定制组件需用到的基地址
    customURLs: {
      hikBaseURL: 'http://114.55.35.96:7700/', //海康平台api-沪东项目
      attendanceBaseURL: 'http://kingofdinner.realsun.me:17001/', //考勤审批
      attendanceDownloadURL: 'http://10.108.2.66:80/', //考勤审批表格下载url
      DataProcessBaseURL: 'http://10.108.2.48:9091/',
      laowuURL: 'http://kingofdinner.realsun.me:9091/', //劳务公司打印

      HeadCountBaseURL: 'http://kingofdinner.realsun.me:17001/',
      PostArchitectureBaseURL: 'http://kingofdinner.realsun.me:17001/',
      comprehensiveQueryBaseURL: 'http://kingofdinner.realsun.me:17001/', //综合查询
      dlEmployBaseURL: 'http://kingofdinner.realsun.me:1201/', //DL招聘-DL管理员
      dlEmployDownloadURL: 'http://kingofdinner.realsun.me:1200/', //DL招聘-DL管理员下载URl
      onlineTrainning: 'https://finisar26.realsun.me:1101', //在线培训数据查询
      onlineTrainningDownload: 'http://finisar26.realsun.me:1100/', //在线培训数据下载
      headquartersBaseURL: 'http://10.108.2.66:1001/', //总部工作流管理-总部工作流
      headquartersDownloadURL: 'http://10.108.2.66:1000', //总部工作流管理-总部工作流下载URl
      WzBaseURL: 'http://10.108.2.66:2001', //物资管理
      WzDownloadURL: 'http://10.108.2.66:2001', //物资管理下载地址
      OnlineTrainingManagerBaseURL: 'https://finisar26.realsun.me:1101',
      AchievementsBaseURL: 'http://10.108.2.66:1001/',
      RBASchedulingBaseURL: 'http://kingofdinner.realsun.me:17001', //RBA排班基地址
      RBASchedulingDownloadBaseURL: 'http://10.108.2.66:80', //RBA排班下载基地址
      WuxiHr03BaseURL: 'http://kingofdinner.realsun.me:17001/', //80端口非定制组件基地址
      WuxiHr03DownloadBaseURL: 'http://10.108.2.66:80/', //80端口非定制组件下载基地址
      staffComBaseURL: 'http://kingofdinner.realsun.me:9091/', //员工沟通平台数据基地址
      staffComDownloadURL: 'http://kingofdinner.realsun.me:8081/', //员工沟通平台下载基地址
      importTemplateDownloadURL:
        'http://10.108.2.66/rispweb/upfiles/transtem.zip', //岗位任职导入模板下载链接
      importJobTemplateDownloadURL:
        'http://10.108.2.66/rispweb/upfiles/transtem.zip' //岗位任职导入模板下载链接
    },
    // 绩效-我的评估表功能用到的子表
    achievementSubResid: {
      target: 645204394778, //目标-目标
      history: 645205088996, //目标-历史记录
      middleYearTargetSelf: 645205266302, //年中-目标自评
      endYearTargetSelf: 645205507630, //年末-目标自评
      targetView: 645205681732, //直评查询-目标查看
      gradeRate: 645205819154, //直评查询-评级评优记录
      interview: 645205940028, //面谈记录-面谈记录
      员工绩效反馈: 558178954112,
      员工绩效反馈历史: 558638569486,
      绩效评估表: 420130498195,
      myAssessment: 462400643808 //我的评估
    },
    trainingClubUploadConfig: {
      mode: 'local',
      bucketname: 'realsun',
      url:
        'http://10.108.2.66:1000/rispweb/rispservice/SvcUploadFile2.aspx?savepath=d:\\web\\rispweb\\upfiles&httppath=http://10.108.2.66/rispweb/upfiles'
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
      baseUrl: 'http://10.108.2.66:1001/', // 域登录基地址
      usernameSuffix: '@finisar.com', // 域登录用户名的后缀
      domain: 'china', // 域名
      domainUserField: 'emp_email' // 域用户字段
    },
    enterprisecode: '9063', // 忘记密码 api 传给后端的企业编号

    // 业务功能配置
    businessOptionalResIds: [
      591549158605, //奖惩系统
      605787603655, //访客系统
      608290060436, //考试系统
      607189833315, //问卷系统
      609157644640, //学习与发展
      626954765251, //人事信息管理
      620212346456, //信息查询
      621258285555, //考勤审批
      629398031625, //考勤结算
      629806000986, //综合管理
      631968602083, //个人档案管理
      642077273014, //物资管理
      642852666439, //人员管理
      642852866577, //安全管控
      642852833296, //财务薪资相关
      642852880030, //供应商合同管理
      642852857804, //绩效考核
      642852735477, //假期管理
      642852790786, //考勤管理
      642852725747, //考勤权限
      642852713768, //考勤设置
      642852747371, //排班管理
      642852820322, //薪资与福利
      642852847030, //员工关系
      642852800770 //招聘
    ], // 获取多个业务可选功能的 resid 数组

    // 主题
    themeColor: {
      '@primary-color': '#A11D21'
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

    // 提醒数据配置
    reminderDataConfig: [
      {
        dblinkname: 'me',
        baseurl: 'http://10.108.2.66:1001'
      },
      {
        dblinkname: 'ehr',
        baseurl: 'http://kingofdinner.realsun.me:17001'
      }
    ],

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
