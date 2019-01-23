/**
 * 登录配置
 */

// 预登录配置对象
window.domainLogin = {
  baseUrl: 'http://172.21.2.27:801/', // 域登录基地址
  usernameSuffix: '', // 域登录用户名的后缀
  domain: 'rbc.int', // 域名
  domainUserField: 'emp_id' // 域用户字段
};

// 打开登录页时，默认显示的登录方式
window.defaultLoginMode = 'domain'; // 'normal' 普通登录 | 'domain' 域登录