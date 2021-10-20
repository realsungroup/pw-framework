'use strict';

const inquirer = require('inquirer');
const semver = require('semver');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const pkg = require(`../package.json`);
const oldVersion = pkg.version;

const log = console.log;

const versionTypeMap = {
  主要版本: 'major',
  次要版本: 'minor',
  修订号: 'patch'
};

const questionOne = {
  type: 'list',
  name: 'versionType',
  message: '你要更新那个版本？',
  choices: ['主要版本', '次要版本', '修订号']
};

async function modifiedVersion() {
  let answers = await inquirer.prompt(questionOne);
  const { versionType } = answers;
  const newVersion = semver.inc(oldVersion, versionTypeMap[versionType]);
  log(chalk.red(`旧版本：${oldVersion}`));
  log(chalk.green(`新版本：${newVersion}`));
  const questionTwo = {
    type: 'confirm',
    name: 'isConfirmed',
    message: `您确定发布 ${newVersion} 版本吗?`,
    default: true
  };
  answers = await inquirer.prompt(questionTwo);
  const { isConfirmed } = answers;

  // 用户未确认，则退出
  if (!isConfirmed) {
    process.exit(1);
  }
  return modifiedPackageVersion(newVersion);
}

/**
 * 修改 package.json version 字段
 * @param {string} version 版本号
 */
function modifiedPackageVersion(version) {
  const spinner = ora().start('开始修改版本号');
  pkg.version = version;
  try {
    fs.writeFileSync(
      path.join(process.cwd(), 'package.json'),
      JSON.stringify(pkg, null, 2),
      {
        encoding: ''
      }
    );
  } catch (err) {
    spinner.fail(`修改版本号失败：${err.message}`);
    process.exit(1);
  }
  spinner.succeed(`修改版本号成功！`);
  return version;
}

/**
 * 执行命令且打印相关的命令以及命令执行后的返回值
 * @param {string} command 命令
 *
 * @param {object} callbacks 回调函数
 * @param {function} callbacks.onStart 开始执行命令的回调：(command) => void；result 表示执行后返回的结果
 * @param {function} callbacks.onSuccess 命令执行成功后的回调：(out) => out 表示执行后返回的结果，为字符串
 * @param {function} callbacks.onFail 命令执行失败后的回调：(errorMessage) => void；errorMessage 表示错误信息
 */
function execCommand(command, callbacks = { onSuccess: null, onFail: null }) {
  const { onStart, onSuccess, onFail } = callbacks;
  log(`\n${command}`);
  let out;
  onStart && onStart(command);
  try {
    out = execSync(command, {
      encoding: 'utf8'
    });
  } catch (err) {
    log(chalk.red(err.message));
    onFail && onFail();
    process.exit(1);
  }
  log(out);
  onSuccess && onSuccess(out);
}

/**
 * git push
 * @param {string} branchName 分支名称
 * @param {string} tagName 标签名称
 * @param {string} version 版本
 */
function gitPush(branchName, version) {
  const spinner = ora().start('开始 git add/commit/push');
  // push branch
  execCommand('git add package.json');
  execCommand(`git commit -m "Release v${version}"`);
  execCommand(`git push origin ${branchName}`);
  spinner.succeed(`git add/commit/push 成功！`);
}

const main = async () => {
  const version = await modifiedVersion();
  gitPush('hudong', version);
};

main();
