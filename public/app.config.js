/**
 * 应用配置文件
 */

var pwConfig = {};

/**
 * 地址
 */
//  请求的基地址
pwConfig.baseURL = 'http://ivf.dybhealth.com:9001/';
// 导出 Excel 文件下载基地址
pwConfig.fileDownloadUrl = 'http://172.21.2.27:802/';

/**
 * 个人中心配置
 */
// 个人中心资源配置
pwConfig.personCenterResIds = [
  {
    title: '基本信息', // 标题：必选
    enTitle: 'Basic Info',
    resid: 1300, // resid：必选
    formName: 'default' // 窗体名称：可选；不设置时默认为 'default'
  }
];

/**
 * 登录页配置
 */
// 进入登录页时的默认登录方式（localStorage 里保存的登录方式会覆盖该配置）
// 'normal' 普通登录 | 'domain' 域登录
pwConfig.defaultLoginMode = 'normal';

// 预登录配置
pwConfig.domainLoginConfig = {
  baseUrl: 'http://172.21.2.27:801/', // 域登录基地址
  usernameSuffix: '', // 域登录用户名的后缀
  domain: 'rbc.int', // 域名
  domainUserField: 'emp_id' // 域用户字段
};

// 忘记密码 api 传给后端的企业编号
pwConfig.enterprisecode = '???';

/**
 * 业务功能配置
 */
// 获取多个业务可选功能的 resid 数组
pwConfig.businessOptionalResIds = [
  588416941524
  // 591275219130,
  // 591275423757,
  // 591276041921,
  // 591276266594,
  // 591276371907
];

/**
 * 主题
 */
// 默认主题色
pwConfig.themeColor = {
  '@primary-color': '#0d58ff'
};

/**
 * 锁屏
 */
// 用户多久未操作登录后界面时，会锁屏（单位：秒）
pwConfig.lockScreenWaitTime = 86400;

/**
 * logo 配置
 */
// 首页 logo 尺寸
pwConfig.homeLogoSize = 60;

// 登录页 logo 尺寸
pwConfig.loginLogoSize = 80;

/**
 * 上传文件配置
 */
// 对象空间名称
pwConfig.bucketname = 'realsun';

/**
 * 工作台配置
 */
// 在本页面打开功能页面的功能 resid
pwConfig.openFuncInSelfResids = [];

// 挂载到 window 对象下
window.pwConfig = pwConfig;

window.uploadFileUrl =
  'http://ivf.dybhealth.com:9000/rispweb/rispservice/SvcUploadFile2.aspx?savepath=F:\\IVFWEB\\rispweb\\upfiles&httppath=http://ivf.dybhealth.com:9000/rispweb/upfiles';
